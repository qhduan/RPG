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

(function () {
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
     static getPath (start, end, callback) {

       // console.time("t");

       let blocked = {};
       for (let actor of Game.area.actors) {
         if (actor.x != start.x || actor.y != start.y) {
           blocked[actor.x * 10000 + actor.y] = true;
         }
       }

       let result = path(function (x, y) {
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

       // console.timeEnd("t");

       callback(result);
     }


  });

  // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
  function manhattan (ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
  // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
  function make (x, y, end, best, addition) {
    let t = {
      x: x,
      y: y,
      g: best.g + addition,
      key: x * 10000 + y,
      h: manhattan(x, y, end.x, end.y)
    };
    t.f = t.g + t.h;
    t.front = [];
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
    let open = new Map();
    let close = new Map();

    //构建起始节点
    let startKey = start.x * 10000 + start.y;
    open.set(startKey, {
      x: start.x,
      y: start.y,
      key: startKey,
      f: 0,
      g: 0,
      h: manhattan(start.x, start.y, end.x, end.y),
      front: []
    });

    while (open.size) {
      // 找到F值最小的节点
      let best = null;
      for (let element of open.values()) {
        if (best == null || element.f < best.f) {
          best = element;
        }
      }
      // 从开启列表中删除，加入关闭列表
      open.delete(best.key);
      close.set(best.key, best);

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        let result = [];
        for (let i = 0, len = best.front.length; i < len; i += 2) {
          result.push({
            x: best.front[i],
            y: best.front[i + 1]
          });
        }
        // console.log(best.front);
        result.push({
          x: end.x,
          y: end.y
        });
        return result;
      }

      let nx, ny;

      // 记录上下左右四方向的可能值
      nx = best.x;
      ny = best.y - 1;
      if (!collisionFunction(nx, ny)) { // 验证up
        let key = nx * 10000 + ny;
        if (!open.has(key) && !close.has(key)) {
          open.set(key, make(nx, ny, end, best, 10));
        }
      }

      nx = best.x;
      ny = best.y + 1;
      if (!collisionFunction(nx, ny)) { // 验证down
        let key = nx * 10000 + ny;
        if (!open.has(key) && !close.has(key)) {
          open.set(key, make(nx, ny, end, best, 10));
        }
      }

      nx = best.x - 1;
      ny = best.y;
      if (!collisionFunction(nx, ny)) { // 验证left
        let key = nx * 10000 + ny;
        if (!open.has(key) && !close.has(key)) {
          open.set(key, make(nx, ny, end, best, 10));
        }
      }

      nx = best.x + 1;
      ny = best.y;
      if (!collisionFunction(nx, ny)) { // 验证right
        let key = nx * 10000 + ny;
        if (!open.has(key) && !close.has(key)) {
          open.set(key, make(nx, ny, end, best, 10));
        }
      }

    } // while

    return null;
  }


})();
