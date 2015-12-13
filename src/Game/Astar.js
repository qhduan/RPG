/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

( () => {
  "use strict";

  /**
   * 自动寻路算法 A*
   */
  Game.assign("Astar", class GameAstar {
    /**
     * @param {function} collisionFunction 测试是否阻挡
     * @param {Object} start 起始位置 eg. {x: 0, y: 0}
     * @param {Object} end
     */
     static getPath (start, end) {
       return new Promise( (resolve, reject) => {
         let blocked = {};
         for (let actor of Game.area.actors) {
           if (actor.x != start.x || actor.y != start.y) {
             blocked[actor.x * 10000 + actor.y] = true;
           }
         }

         let result = path((x, y) => {
           // 判断函数，判断是否阻挡
           if (x < 0 || x >= Game.area.map.col) {
             return true; // 有阻挡，返回true
           }
           if (y < 0 || y >= Game.area.map.row) {
             return true; // 有阻挡，返回true
           }
           let key = x * 10000 + y;
           if (Game.area.map.blockedMap[key]) {
             return true; // 有阻挡，返回true
           }
           if (blocked[key]) {
             return true; // 有阻挡，返回true
           }
           return false; // 没有阻挡
         }, start, end);

         resolve(result);
       });
     }


  });

  /*
  * reference from http://eloquentjavascript.net/1st_edition/appendix2.html
  */
  class BinaryHeap {

    constructor (scoreFunction) {
      this.content = [];
      this.scoreFunction = scoreFunction;
      this.scores = new Map();
    }

    push (element) {
      this.scores.set(element, this.scoreFunction(element));
      this.content.push(element);
      this.bubbleUp(this.content.length - 1);
    }

    pop () {
      let r = this.content[0];
      let e = this.content.pop();
      if (this.content.length > 0) {
        this.content[0] = e;
        this.sinkDown(0);
      }
      return r;
    }

    delete (node) {
      for (let i = 0, len = this.content.length; i < len; i++) {
        if (this.content[i] == node) {
          this.scores.delete(this.content[i]);
          let e = this.content.pop();
          if (i == len - 1) {
            break;
          }
          this.content[i] = e;
          this.bubbleUp(i);
          this.sinkDown(i);
          break;
        }
      }
    }

    get size () {
      return this.content.length;
    }

    set size (value) {
      throw new Error("BinaryHeap.size readonly");
    }

    bubbleUp (n) {
      let element = this.content[n];
      let score = this.scores.get(element);
      while (n > 0) {
        let parentN = Math.floor((n + 1) / 2) - 1;
        let parent = this.content[parentN];
        if (score >= this.scores.get(parent))
          break;
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
    }

    sinkDown (n) {
      let len = this.content.length;
      let element = this.content[n];
      let score = this.scores.get(element);

      while (true) {
        let child2N = (n + 1) * 2;
        let child1N = child2N - 1;
        let swap = null;
        let child1score, child2score;

        if (child1N < len) {
          let child1 = this.content[child1N];
          child1score = this.scores.get(child1);
          if (child1score < score) {
            swap = child1N;
          }
        }

        if (child2N < len) {
          let child2 = this.content[child2N];
          child2score = this.scores.get(child2);
          if (child2score < (swap == null ? score : child1score)) {
            swap = child2N;
          }
        }

        if (swap == null) {
          break;
        }

        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }

    }

  }; // BinaryHeap

  // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
  function manhattan (ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }

  // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
  function make (x, y, end, best, addition) {
    let t = {
      key: x * 10000 + y,
      x: x,
      y: y,
      g: best.g + addition,
      h: manhattan(x, y, end.x, end.y),
      front: []
    };
    t.f = t.g + t.h;
    let len  = best.front.length;
    t.front.length = len;
    for (let i = 0; i < len; i++) {
      t.front[i] = best.front[i];
    }
    t.front.push(best.x);
    t.front.push(best.y);
    return t;
  }

  function path (collisionFunction, start, end) {

    // 开启列表和关闭列表
    let open = new BinaryHeap((element) => {
      return element.f;
    });
    let openIndex = new Set();
    let closeIndex = new Set();

    //构建起始节点
    let startElement = {
      key: start.x*10000+start.y,
      x: start.x,
      y: start.y,
      f: 0,
      g: 0,
      h: manhattan(start.x, start.y, end.x, end.y),
      front: []
    };
    openIndex.add(startElement.key);
    open.push(startElement);

    let push2open = (x, y, end, best) => {
      if (!collisionFunction(x, y)) { // 验证up
        let key = x * 10000 + y;
        if (!openIndex.has(key) && !closeIndex.has(key)) {
          openIndex.add(key);
          open.push(make(x, y, end, best, 10));
        }
      }
    };

    while (open.size) {
      // F值最小的节点，就是堆顶
      let best = open.pop();
      // 从开启列表中删除，加入关闭列表
      open.delete(best);
      openIndex.delete(best.key);
      closeIndex.add(best.key);

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        let result = [];
        for (let i = 0, len = best.front.length; i < len; i += 2) {
          result.push({
            x: best.front[i],
            y: best.front[i + 1]
          });
        }
        result.push({
          x: end.x,
          y: end.y
        });
        return result;
      }

      // 记录上下左右四方向的可能值
      push2open(best.x, best.y - 1, end, best);
      push2open(best.x, best.y + 1, end, best);
      push2open(best.x - 1, best.y, end, best);
      push2open(best.x + 1, best.y, end, best);

    } // while

    return null;
  }


})();
