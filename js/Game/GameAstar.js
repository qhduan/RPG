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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  /**
   * 自动寻路算法 A*
   */
  Game.assign("Astar", (function () {
    function GameAstar() {
      _classCallCheck(this, GameAstar);
    }

    _createClass(GameAstar, null, [{
      key: "getPath",

      /**
       * @param {function} collisionFunction 测试是否阻挡
       * @param {Object} start 起始位置 eg. {x: 0, y: 0}
       * @param {Object} end
       */
      value: function getPath(start, end, callback) {

        // console.time("t");

        var blocked = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var actor = _step.value;

            if (actor.x != start.x || actor.y != start.y) {
              blocked[actor.x * 10000 + actor.y] = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var result = path(function (x, y) {
          // 判断函数，判断是否阻挡
          if (x < 0 || x >= Game.area.map.col) {
            return true; // 有阻挡，返回true
          }
          if (y < 0 || y >= Game.area.map.row) {
            return true; // 有阻挡，返回true
          }
          var key = x * 10000 + y;
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
    }]);

    return GameAstar;
  })());

  /*
  * reference from http://eloquentjavascript.net/1st_edition/appendix2.html
  */

  var BinaryHeap = (function () {
    function BinaryHeap(scoreFunction) {
      _classCallCheck(this, BinaryHeap);

      this.content = [];
      this.scoreFunction = scoreFunction;
      this.scores = new Map();
    }

    _createClass(BinaryHeap, [{
      key: "push",
      value: function push(element) {
        this.scores.set(element, this.scoreFunction(element));
        this.content.push(element);
        this.bubbleUp(this.content.length - 1);
      }
    }, {
      key: "pop",
      value: function pop() {
        var r = this.content[0];
        var e = this.content.pop();
        if (this.content.length > 0) {
          this.content[0] = e;
          this.sinkDown(0);
        }
        return r;
      }
    }, {
      key: "delete",
      value: function _delete(node) {
        for (var i = 0, len = this.content.length; i < len; i++) {
          if (this.content[i] == node) {
            this.scores["delete"](this.content[i]);
            var e = this.content.pop();
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
    }, {
      key: "bubbleUp",
      value: function bubbleUp(n) {
        var element = this.content[n];
        var score = this.scores.get(element);
        while (n > 0) {
          var parentN = Math.floor((n + 1) / 2) - 1;
          var _parent = this.content[parentN];
          if (score >= this.scores.get(_parent)) break;
          this.content[parentN] = element;
          this.content[n] = _parent;
          n = parentN;
        }
      }
    }, {
      key: "sinkDown",
      value: function sinkDown(n) {
        var len = this.content.length;
        var element = this.content[n];
        var score = this.scores.get(element);

        while (true) {
          var child2N = (n + 1) * 2;
          var child1N = child2N - 1;
          var swap = null;
          var child1score = undefined,
              child2score = undefined;

          if (child1N < len) {
            var child1 = this.content[child1N];
            child1score = this.scores.get(child1);
            if (child1score < score) {
              swap = child1N;
            }
          }

          if (child2N < len) {
            var child2 = this.content[child2N];
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
    }, {
      key: "size",
      get: function get() {
        return this.content.length;
      },
      set: function set(value) {
        throw new Error("BinaryHeap.size readonly");
      }
    }]);

    return BinaryHeap;
  })();

  ; // BinaryHeap

  // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
  function manhattan(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }

  // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
  function make(x, y, end, best, addition) {
    var t = {
      key: x * 10000 + y,
      x: x,
      y: y,
      g: best.g + addition,
      h: manhattan(x, y, end.x, end.y),
      front: []
    };
    t.f = t.g + t.h;
    var len = best.front.length;
    t.front.length = len;
    for (var i = 0; i < len; i++) {
      t.front[i] = best.front[i];
    }
    t.front.push(best.x);
    t.front.push(best.y);
    return t;
  }

  function path(collisionFunction, start, end) {

    // 开启列表和关闭列表
    var open = new BinaryHeap(function (element) {
      return element.f;
    });
    var openIndex = new Set();
    var closeIndex = new Set();

    //构建起始节点
    var startElement = {
      key: start.x * 10000 + start.y,
      x: start.x,
      y: start.y,
      f: 0,
      g: 0,
      h: manhattan(start.x, start.y, end.x, end.y),
      front: []
    };
    openIndex.add(startElement.key);
    open.push(startElement);

    var push2open = function push2open(x, y, end, best) {
      if (!collisionFunction(x, y)) {
        // 验证up
        var key = x * 10000 + y;
        if (!openIndex.has(key) && !closeIndex.has(key)) {
          openIndex.add(key);
          open.push(make(x, y, end, best, 10));
        }
      }
    };

    while (open.size) {
      // F值最小的节点，就是堆顶
      var best = open.pop();
      // 从开启列表中删除，加入关闭列表
      open["delete"](best);
      openIndex["delete"](best.key);
      closeIndex.add(best.key);

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        var result = [];
        for (var i = 0, len = best.front.length; i < len; i += 2) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7Ozs7O0FBS2IsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7Ozs7Ozs7YUFNbEIsaUJBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7Ozs7QUFJcEMsWUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDakIsK0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSw4SEFBRTtnQkFBM0IsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzVDLHFCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUMzQztXQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7QUFFaEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDbkMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNuQyxtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGNBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGNBQUksSUFBSSxDQUFDLElBQUksQ0FB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RyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGVBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUUxQzs7QUFFRCxXQUFPLElBQUksQ0FBQztHQUNiO0NBR0YsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFzdGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIOiHquWKqOWvu+i3r+eul+azlSBBKlxuICAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBc3RhclwiLCBjbGFzcyBHYW1lQXN0YXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbGxpc2lvbkZ1bmN0aW9uIOa1i+ivleaYr+WQpumYu+aMoVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGFydCDotbflp4vkvY3nva4gZWcuIHt4OiAwLCB5OiAwfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbmRcbiAgICAgKi9cbiAgICAgc3RhdGljIGdldFBhdGggKHN0YXJ0LCBlbmQsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAvLyBjb25zb2xlLnRpbWUoXCJ0XCIpO1xuXG4gICAgICAgbGV0IGJsb2NrZWQgPSB7fTtcbiAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICBpZiAoYWN0b3IueCAhPSBzdGFydC54IHx8IGFjdG9yLnkgIT0gc3RhcnQueSkge1xuICAgICAgICAgICBibG9ja2VkW2FjdG9yLnggKiAxMDAwMCArIGFjdG9yLnldID0gdHJ1ZTtcbiAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBsZXQgcmVzdWx0ID0gcGF0aChmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgLy8g5Yik5pat5Ye95pWw77yM5Yik5pat5piv5ZCm6Zi75oyhXG4gICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBHYW1lLmFyZWEubWFwLmNvbCkge1xuICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5pyJ6Zi75oyh77yM6L+U5ZuedHJ1ZVxuICAgICAgICAgfVxuICAgICAgICAgaWYgKHkgPCAwIHx8IHkgPj0gR2FtZS5hcmVhLm1hcC5yb3cpIHtcbiAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIOaciemYu+aMoe+8jOi/lOWbnnRydWVcbiAgICAgICAgIH1cbiAgICAgICAgIGxldCBrZXkgPSB4ICogMTAwMDAgKyB5O1xuICAgICAgICAgaWYgKEdhbWUuYXJlYS5tYXAuYmxvY2tlZE1hcFtrZXldKSB7XG4gICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICB9XG4gICAgICAgICBpZiAoYmxvY2tlZFtrZXldKSB7XG4gICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gZmFsc2U7IC8vIOayoeaciemYu+aMoVxuICAgICAgIH0sIHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwidFwiKTtcblxuICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgIH1cblxuXG4gIH0pO1xuXG4gIC8qXG4gICogcmVmZXJlbmNlIGZyb20gaHR0cDovL2Vsb3F1ZW50amF2YXNjcmlwdC5uZXQvMXN0X2VkaXRpb24vYXBwZW5kaXgyLmh0bWxcbiAgKi9cbiAgY2xhc3MgQmluYXJ5SGVhcCB7XG5cbiAgICBjb25zdHJ1Y3RvciAoc2NvcmVGdW5jdGlvbikge1xuICAgICAgdGhpcy5jb250ZW50ID0gW107XG4gICAgICB0aGlzLnNjb3JlRnVuY3Rpb24gPSBzY29yZUZ1bmN0aW9uO1xuICAgICAgdGhpcy5zY29yZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgcHVzaCAoZWxlbWVudCkge1xuICAgICAgdGhpcy5zY29yZXMuc2V0KGVsZW1lbnQsIHRoaXMuc2NvcmVGdW5jdGlvbihlbGVtZW50KSk7XG4gICAgICB0aGlzLmNvbnRlbnQucHVzaChlbGVtZW50KTtcbiAgICAgIHRoaXMuYnViYmxlVXAodGhpcy5jb250ZW50Lmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHBvcCAoKSB7XG4gICAgICBsZXQgciA9IHRoaXMuY29udGVudFswXTtcbiAgICAgIGxldCBlID0gdGhpcy5jb250ZW50LnBvcCgpO1xuICAgICAgaWYgKHRoaXMuY29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuY29udGVudFswXSA9IGU7XG4gICAgICAgIHRoaXMuc2lua0Rvd24oMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBkZWxldGUgKG5vZGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudFtpXSA9PSBub2RlKSB7XG4gICAgICAgICAgdGhpcy5zY29yZXMuZGVsZXRlKHRoaXMuY29udGVudFtpXSk7XG4gICAgICAgICAgbGV0IGUgPSB0aGlzLmNvbnRlbnQucG9wKCk7XG4gICAgICAgICAgaWYgKGkgPT0gbGVuIC0gMSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29udGVudFtpXSA9IGU7XG4gICAgICAgICAgdGhpcy5idWJibGVVcChpKTtcbiAgICAgICAgICB0aGlzLnNpbmtEb3duKGkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHNpemUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2V0IHNpemUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaW5hcnlIZWFwLnNpemUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgYnViYmxlVXAgKG4pIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jb250ZW50W25dO1xuICAgICAgbGV0IHNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGVsZW1lbnQpO1xuICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIGxldCBwYXJlbnROID0gTWF0aC5mbG9vcigobiArIDEpIC8gMikgLSAxO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jb250ZW50W3BhcmVudE5dO1xuICAgICAgICBpZiAoc2NvcmUgPj0gdGhpcy5zY29yZXMuZ2V0KHBhcmVudCkpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIHRoaXMuY29udGVudFtwYXJlbnROXSA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY29udGVudFtuXSA9IHBhcmVudDtcbiAgICAgICAgbiA9IHBhcmVudE47XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2lua0Rvd24gKG4pIHtcbiAgICAgIGxldCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoO1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNvbnRlbnRbbl07XG4gICAgICBsZXQgc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoZWxlbWVudCk7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGxldCBjaGlsZDJOID0gKG4gKyAxKSAqIDI7XG4gICAgICAgIGxldCBjaGlsZDFOID0gY2hpbGQyTiAtIDE7XG4gICAgICAgIGxldCBzd2FwID0gbnVsbDtcbiAgICAgICAgbGV0IGNoaWxkMXNjb3JlLCBjaGlsZDJzY29yZTtcblxuICAgICAgICBpZiAoY2hpbGQxTiA8IGxlbikge1xuICAgICAgICAgIGxldCBjaGlsZDEgPSB0aGlzLmNvbnRlbnRbY2hpbGQxTl07XG4gICAgICAgICAgY2hpbGQxc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoY2hpbGQxKTtcbiAgICAgICAgICBpZiAoY2hpbGQxc2NvcmUgPCBzY29yZSkge1xuICAgICAgICAgICAgc3dhcCA9IGNoaWxkMU47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkMk4gPCBsZW4pIHtcbiAgICAgICAgICBsZXQgY2hpbGQyID0gdGhpcy5jb250ZW50W2NoaWxkMk5dO1xuICAgICAgICAgIGNoaWxkMnNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGNoaWxkMik7XG4gICAgICAgICAgaWYgKGNoaWxkMnNjb3JlIDwgKHN3YXAgPT0gbnVsbCA/IHNjb3JlIDogY2hpbGQxc2NvcmUpKSB7XG4gICAgICAgICAgICBzd2FwID0gY2hpbGQyTjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3dhcCA9PSBudWxsKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRlbnRbbl0gPSB0aGlzLmNvbnRlbnRbc3dhcF07XG4gICAgICAgIHRoaXMuY29udGVudFtzd2FwXSA9IGVsZW1lbnQ7XG4gICAgICAgIG4gPSBzd2FwO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH07IC8vIEJpbmFyeUhlYXBcblxuICAvLyDorqHnrpfngrnnu5PmnoRh5ZKMYuS5i+mXtOeahOabvOWTiOmhv+i3neemu++8jOWNs+S4jeW4puaWnOi1sOeahOebtOe6v+i3neemu1xuICBmdW5jdGlvbiBtYW5oYXR0YW4gKGF4LCBheSwgYngsIGJ5KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGF4IC0gYngpICsgTWF0aC5hYnMoYXkgLSBieSk7XG4gIH1cblxuICAvLyDpgJrov4flnZDmoId477yMee+8jOW9k+WJjeacgOWlveeahOiKgueCuWJlc3TlkozkuIDkuKrpmYTliqDlgLzvvIjnm7Tnur8xMO+8jOaWnOe6vzE077yJ77yM6L+U5Zue5LiA5Liq5paw6IqC54K5XG4gIGZ1bmN0aW9uIG1ha2UgKHgsIHksIGVuZCwgYmVzdCwgYWRkaXRpb24pIHtcbiAgICBsZXQgdCA9IHtcbiAgICAgIGtleTogeCAqIDEwMDAwICsgeSxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5LFxuICAgICAgZzogYmVzdC5nICsgYWRkaXRpb24sXG4gICAgICBoOiBtYW5oYXR0YW4oeCwgeSwgZW5kLngsIGVuZC55KSxcbiAgICAgIGZyb250OiBbXVxuICAgIH07XG4gICAgdC5mID0gdC5nICsgdC5oO1xuICAgIGxldCBsZW4gID0gYmVzdC5mcm9udC5sZW5ndGg7XG4gICAgdC5mcm9udC5sZW5ndGggPSBsZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdC5mcm9udFtpXSA9IGJlc3QuZnJvbnRbaV07XG4gICAgfVxuICAgIHQuZnJvbnQucHVzaChiZXN0LngpO1xuICAgIHQuZnJvbnQucHVzaChiZXN0LnkpO1xuICAgIHJldHVybiB0O1xuICB9XG5cbiAgZnVuY3Rpb24gcGF0aCAoY29sbGlzaW9uRnVuY3Rpb24sIHN0YXJ0LCBlbmQpIHtcblxuICAgIC8vIOW8gOWQr+WIl+ihqOWSjOWFs+mXreWIl+ihqFxuICAgIGxldCBvcGVuID0gbmV3IEJpbmFyeUhlYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmY7XG4gICAgfSk7XG4gICAgbGV0IG9wZW5JbmRleCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgY2xvc2VJbmRleCA9IG5ldyBTZXQoKTtcblxuICAgIC8v5p6E5bu66LW35aeL6IqC54K5XG4gICAgbGV0IHN0YXJ0RWxlbWVudCA9IHtcbiAgICAgIGtleTogc3RhcnQueCoxMDAwMCtzdGFydC55LFxuICAgICAgeDogc3RhcnQueCxcbiAgICAgIHk6IHN0YXJ0LnksXG4gICAgICBmOiAwLFxuICAgICAgZzogMCxcbiAgICAgIGg6IG1hbmhhdHRhbihzdGFydC54LCBzdGFydC55LCBlbmQueCwgZW5kLnkpLFxuICAgICAgZnJvbnQ6IFtdXG4gICAgfTtcbiAgICBvcGVuSW5kZXguYWRkKHN0YXJ0RWxlbWVudC5rZXkpO1xuICAgIG9wZW4ucHVzaChzdGFydEVsZW1lbnQpO1xuXG4gICAgbGV0IHB1c2gyb3BlbiA9IGZ1bmN0aW9uICh4LCB5LCBlbmQsIGJlc3QpIHtcbiAgICAgIGlmICghY29sbGlzaW9uRnVuY3Rpb24oeCwgeSkpIHsgLy8g6aqM6K+BdXBcbiAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgIGlmICghb3BlbkluZGV4LmhhcyhrZXkpICYmICFjbG9zZUluZGV4LmhhcyhrZXkpKSB7XG4gICAgICAgICAgb3BlbkluZGV4LmFkZChrZXkpO1xuICAgICAgICAgIG9wZW4ucHVzaChtYWtlKHgsIHksIGVuZCwgYmVzdCwgMTApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB3aGlsZSAob3Blbi5zaXplKSB7XG4gICAgICAvLyBG5YC85pyA5bCP55qE6IqC54K577yM5bCx5piv5aCG6aG2XG4gICAgICBsZXQgYmVzdCA9IG9wZW4ucG9wKCk7XG4gICAgICAvLyDku47lvIDlkK/liJfooajkuK3liKDpmaTvvIzliqDlhaXlhbPpl63liJfooahcbiAgICAgIG9wZW4uZGVsZXRlKGJlc3QpO1xuICAgICAgb3BlbkluZGV4LmRlbGV0ZShiZXN0LmtleSk7XG4gICAgICBjbG9zZUluZGV4LmFkZChiZXN0LmtleSk7XG5cbiAgICAgIC8vIOWmguaenOi/meS4quacgOWlveeahOiKgueCueWwseaYr+e7k+WwvuiKgueCue+8jOWImei/lOWbnlxuICAgICAgaWYgKGJlc3QueCA9PSBlbmQueCAmJiBiZXN0LnkgPT0gZW5kLnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYmVzdC5mcm9udC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIHg6IGJlc3QuZnJvbnRbaV0sXG4gICAgICAgICAgICB5OiBiZXN0LmZyb250W2kgKyAxXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICB4OiBlbmQueCxcbiAgICAgICAgICB5OiBlbmQueVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgLy8g6K6w5b2V5LiK5LiL5bem5Y+z5Zub5pa55ZCR55qE5Y+v6IO95YC8XG4gICAgICBwdXNoMm9wZW4oYmVzdC54LCBiZXN0LnkgLSAxLCBlbmQsIGJlc3QpO1xuICAgICAgcHVzaDJvcGVuKGJlc3QueCwgYmVzdC55ICsgMSwgZW5kLCBiZXN0KTtcbiAgICAgIHB1c2gyb3BlbihiZXN0LnggLSAxLCBiZXN0LnksIGVuZCwgYmVzdCk7XG4gICAgICBwdXNoMm9wZW4oYmVzdC54ICsgMSwgYmVzdC55LCBlbmQsIGJlc3QpO1xuXG4gICAgfSAvLyB3aGlsZVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG59KSgpO1xuIl19
