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

  /*
  let pathCallback = {};

  let worker = new Worker("js/Game/GameWorkerAstar.js");

  let lastMap = null;

  worker.onmessage = function (event) {
    let data = event.data;
    let id = data.id;
    if (pathCallback[id]) {
      pathCallback[id](data.path);
      delete pathCallback[id];
    }
  }
  */

  /**
   * 自动寻路算法
   */
  Game.assign("Astar", class GameAstar {
    /**
     * @param {function} collisionFunction 测试是否阻挡
     * @param {number} width 地图宽度
     * @param {number} height 地图高度
     * @param {Object} start 起始位置 eg. {x: 0, y: 0}
     * @param {Object} end
     */

     /*
     static getPathAsync (start, end, callback) {
       let id = Math.random().toString().substr(2);
       let blocked = {};
       for (let actor of Game.area.actors) {
         if (actor != this) {
           blocked[actor.x*10000+actor.y] = true;
         }
       }

       let blockedMap = null;
       if (lastMap != Game.area.map.blockedMap) {
         blockedMap = Game.area.map.blockedMap;
         lastMap = blockedMap;
       }

       pathCallback[id] = callback;
       worker.postMessage({
         id: id,
         blockedMap: blockedMap,
         blocked: blocked,
         width: Game.area.map.col,
         height: Game.area.map.row,
         start: start,
         end: end
       });
     }
     */

     static getPath (start, end, callback) {

       console.time("t");

       let blocked = {};
       for (let actor of Game.area.actors) {
         if (actor != this) {
           blocked[actor.x*10000+actor.y] = true;
         }
       }

       let result = path(function (x, y) {
         if (Game.area.map.blockedMap[x*10000+y]) {
           // 有阻挡，返回true
           return true;
         }
         if (blocked[x*10000+y]) {
           return true;
         }
         return false;
       }, Game.area.map.col, Game.area.map.row, start, end);

       console.timeEnd("t");

       callback(result);
     }


  });


  function path (collisionFunction, width, height, start, end) {
    // 用一个点结构的x和y值返回一个字符串的key
    // 例如{x: 9, y: 8}返回"9-8"
    let tag = function (point) {
      //return point.x.toString() + "-" + point.y.toString();
      return point.x * 10000 + point.y;
    };
    // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
    let manhattan = function (a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };
    // 粗略验证一个点是否可用，是否超出边界，地图上是否是墙
    let valid = function (x, y) {
      if (collisionFunction(x, y))
        return false;
      return true;
    };
    // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
    let make = function (x, y, best, addition, direction) {
      let t = {
        x: x,
        y: y,
        g: best.g + addition
      };
      t.key = tag(t);
      t.h = manhattan(t, end);
      t.f = t.g + t.h;
      t.front = best.front.slice();
      t.front.push(best.key);
      return t;
    };

    // 开启列表和关闭列表
    let open = {};
    let close = {};

    //构建起始节点
    open[tag(start)] = {
      x: start.x,
      y: start.y,
      key: tag(start),
      f: 0,
      g: 0,
      h: manhattan(start, end),
      front: []
    };

    while (Object.keys(open).length) {
      // 找到F值最小的节点
      let best = null;
      for (let key in open) {
        if (best == null || open[key].f < best.f) {
          best = open[key];
        }
      }
      // 从开启列表中删除，加入关闭列表
      delete open[best.key];
      close[best.key] = best;

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        best.front.push(tag(end));
        let result = [];
        for (let i = 0, len = best.front.length; i < len; i++) {
          result.push({
            x: Math.floor(best.front[i]/10000),
            y: Math.floor(best.front[i]%10000)
          });
          /*
          let m = best.front[i].match(/(\d+)-(\d+)/);
          if (m) {
            result.push({
              x: parseInt(m[1]),
              y: parseInt(m[2])
            });
          }
          */
        }
        return result;
      }

      // 记录上下左右，和四个斜方向的可能值
      let possible = [];

      if (valid(best.x, best.y - 1)) { // 验证up
        possible.push(make(best.x, best.y - 1, best, 10));
      }
      if (valid(best.x, best.y + 1)) { // 验证down
        possible.push(make(best.x, best.y + 1, best, 10));
      }
      if (valid(best.x - 1, best.y)) { // 验证left
        possible.push(make(best.x - 1, best.y, best, 10));
      }
      if (valid(best.x + 1, best.y)) { // 验证right
        possible.push(make(best.x + 1, best.y, best, 10));
      }

      // 去除已经在开启列表和关闭列表中的
      possible.forEach(function (element) {
        let t = tag(element);
        if (open[t]) return;
        if (close[t]) return;
        open[t] = element;
      });

    } // while

    return null;
  }


})();
