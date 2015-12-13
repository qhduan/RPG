"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  "use strict"

  /**
   * 自动寻路算法 A*
   */
  ;
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
      value: function getPath(start, end) {
        return new Promise(function (resolve, reject) {
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
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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

          resolve(result);
        });
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
            this.scores.delete(this.content[i]);
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
          var parent = this.content[parentN];
          if (score >= this.scores.get(parent)) break;
          this.content[parentN] = element;
          this.content[n] = parent;
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
      open.delete(best);
      openIndex.delete(best.key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWDs7Ozs7QUFBWSxHQUFDO0FBS2IsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7Ozs7Ozs7OEJBTWpCLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDMUIsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsY0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDakIsaUNBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSw4SEFBRTtrQkFBM0IsS0FBSzs7QUFDWixrQkFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzVDLHVCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztlQUMzQzthQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsY0FBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7QUFFaEMsZ0JBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ25DLHFCQUFPLElBQUk7QUFBQyxhQUNiO0FBQ0QsZ0JBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ25DLHFCQUFPLElBQUk7QUFBQyxhQUNiO0FBQ0QsZ0JBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FB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LENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBRTFDOztBQUFBLEFBRUQsV0FBTyxJQUFJLENBQUM7R0FDYjtDQUdGLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVBc3Rhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8qKlxuICAgKiDoh6rliqjlr7vot6/nrpfms5UgQSpcbiAgICovXG4gIEdhbWUuYXNzaWduKFwiQXN0YXJcIiwgY2xhc3MgR2FtZUFzdGFyIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb2xsaXNpb25GdW5jdGlvbiDmtYvor5XmmK/lkKbpmLvmjKFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RhcnQg6LW35aeL5L2N572uIGVnLiB7eDogMCwgeTogMH1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZW5kXG4gICAgICovXG4gICAgIHN0YXRpYyBnZXRQYXRoIChzdGFydCwgZW5kKSB7XG4gICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgIGxldCBibG9ja2VkID0ge307XG4gICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICAgIGlmIChhY3Rvci54ICE9IHN0YXJ0LnggfHwgYWN0b3IueSAhPSBzdGFydC55KSB7XG4gICAgICAgICAgICAgYmxvY2tlZFthY3Rvci54ICogMTAwMDAgKyBhY3Rvci55XSA9IHRydWU7XG4gICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHJlc3VsdCA9IHBhdGgoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgLy8g5Yik5pat5Ye95pWw77yM5Yik5pat5piv5ZCm6Zi75oyhXG4gICAgICAgICAgIGlmICh4IDwgMCB8fCB4ID49IEdhbWUuYXJlYS5tYXAuY29sKSB7XG4gICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIOaciemYu+aMoe+8jOi/lOWbnnRydWVcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAoeSA8IDAgfHwgeSA+PSBHYW1lLmFyZWEubWFwLnJvdykge1xuICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgICAgIGlmIChHYW1lLmFyZWEubWFwLmJsb2NrZWRNYXBba2V5XSkge1xuICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGJsb2NrZWRba2V5XSkge1xuICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyDmsqHmnInpmLvmjKFcbiAgICAgICAgIH0sIHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgfSk7XG4gICAgIH1cblxuXG4gIH0pO1xuXG4gIC8qXG4gICogcmVmZXJlbmNlIGZyb20gaHR0cDovL2Vsb3F1ZW50amF2YXNjcmlwdC5uZXQvMXN0X2VkaXRpb24vYXBwZW5kaXgyLmh0bWxcbiAgKi9cbiAgY2xhc3MgQmluYXJ5SGVhcCB7XG5cbiAgICBjb25zdHJ1Y3RvciAoc2NvcmVGdW5jdGlvbikge1xuICAgICAgdGhpcy5jb250ZW50ID0gW107XG4gICAgICB0aGlzLnNjb3JlRnVuY3Rpb24gPSBzY29yZUZ1bmN0aW9uO1xuICAgICAgdGhpcy5zY29yZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgcHVzaCAoZWxlbWVudCkge1xuICAgICAgdGhpcy5zY29yZXMuc2V0KGVsZW1lbnQsIHRoaXMuc2NvcmVGdW5jdGlvbihlbGVtZW50KSk7XG4gICAgICB0aGlzLmNvbnRlbnQucHVzaChlbGVtZW50KTtcbiAgICAgIHRoaXMuYnViYmxlVXAodGhpcy5jb250ZW50Lmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHBvcCAoKSB7XG4gICAgICBsZXQgciA9IHRoaXMuY29udGVudFswXTtcbiAgICAgIGxldCBlID0gdGhpcy5jb250ZW50LnBvcCgpO1xuICAgICAgaWYgKHRoaXMuY29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuY29udGVudFswXSA9IGU7XG4gICAgICAgIHRoaXMuc2lua0Rvd24oMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBkZWxldGUgKG5vZGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudFtpXSA9PSBub2RlKSB7XG4gICAgICAgICAgdGhpcy5zY29yZXMuZGVsZXRlKHRoaXMuY29udGVudFtpXSk7XG4gICAgICAgICAgbGV0IGUgPSB0aGlzLmNvbnRlbnQucG9wKCk7XG4gICAgICAgICAgaWYgKGkgPT0gbGVuIC0gMSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29udGVudFtpXSA9IGU7XG4gICAgICAgICAgdGhpcy5idWJibGVVcChpKTtcbiAgICAgICAgICB0aGlzLnNpbmtEb3duKGkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHNpemUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2V0IHNpemUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaW5hcnlIZWFwLnNpemUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgYnViYmxlVXAgKG4pIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jb250ZW50W25dO1xuICAgICAgbGV0IHNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGVsZW1lbnQpO1xuICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIGxldCBwYXJlbnROID0gTWF0aC5mbG9vcigobiArIDEpIC8gMikgLSAxO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jb250ZW50W3BhcmVudE5dO1xuICAgICAgICBpZiAoc2NvcmUgPj0gdGhpcy5zY29yZXMuZ2V0KHBhcmVudCkpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIHRoaXMuY29udGVudFtwYXJlbnROXSA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY29udGVudFtuXSA9IHBhcmVudDtcbiAgICAgICAgbiA9IHBhcmVudE47XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2lua0Rvd24gKG4pIHtcbiAgICAgIGxldCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoO1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNvbnRlbnRbbl07XG4gICAgICBsZXQgc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoZWxlbWVudCk7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGxldCBjaGlsZDJOID0gKG4gKyAxKSAqIDI7XG4gICAgICAgIGxldCBjaGlsZDFOID0gY2hpbGQyTiAtIDE7XG4gICAgICAgIGxldCBzd2FwID0gbnVsbDtcbiAgICAgICAgbGV0IGNoaWxkMXNjb3JlLCBjaGlsZDJzY29yZTtcblxuICAgICAgICBpZiAoY2hpbGQxTiA8IGxlbikge1xuICAgICAgICAgIGxldCBjaGlsZDEgPSB0aGlzLmNvbnRlbnRbY2hpbGQxTl07XG4gICAgICAgICAgY2hpbGQxc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoY2hpbGQxKTtcbiAgICAgICAgICBpZiAoY2hpbGQxc2NvcmUgPCBzY29yZSkge1xuICAgICAgICAgICAgc3dhcCA9IGNoaWxkMU47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkMk4gPCBsZW4pIHtcbiAgICAgICAgICBsZXQgY2hpbGQyID0gdGhpcy5jb250ZW50W2NoaWxkMk5dO1xuICAgICAgICAgIGNoaWxkMnNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGNoaWxkMik7XG4gICAgICAgICAgaWYgKGNoaWxkMnNjb3JlIDwgKHN3YXAgPT0gbnVsbCA/IHNjb3JlIDogY2hpbGQxc2NvcmUpKSB7XG4gICAgICAgICAgICBzd2FwID0gY2hpbGQyTjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3dhcCA9PSBudWxsKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRlbnRbbl0gPSB0aGlzLmNvbnRlbnRbc3dhcF07XG4gICAgICAgIHRoaXMuY29udGVudFtzd2FwXSA9IGVsZW1lbnQ7XG4gICAgICAgIG4gPSBzd2FwO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH07IC8vIEJpbmFyeUhlYXBcblxuICAvLyDorqHnrpfngrnnu5PmnoRh5ZKMYuS5i+mXtOeahOabvOWTiOmhv+i3neemu++8jOWNs+S4jeW4puaWnOi1sOeahOebtOe6v+i3neemu1xuICBmdW5jdGlvbiBtYW5oYXR0YW4gKGF4LCBheSwgYngsIGJ5KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGF4IC0gYngpICsgTWF0aC5hYnMoYXkgLSBieSk7XG4gIH1cblxuICAvLyDpgJrov4flnZDmoId477yMee+8jOW9k+WJjeacgOWlveeahOiKgueCuWJlc3TlkozkuIDkuKrpmYTliqDlgLzvvIjnm7Tnur8xMO+8jOaWnOe6vzE077yJ77yM6L+U5Zue5LiA5Liq5paw6IqC54K5XG4gIGZ1bmN0aW9uIG1ha2UgKHgsIHksIGVuZCwgYmVzdCwgYWRkaXRpb24pIHtcbiAgICBsZXQgdCA9IHtcbiAgICAgIGtleTogeCAqIDEwMDAwICsgeSxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5LFxuICAgICAgZzogYmVzdC5nICsgYWRkaXRpb24sXG4gICAgICBoOiBtYW5oYXR0YW4oeCwgeSwgZW5kLngsIGVuZC55KSxcbiAgICAgIGZyb250OiBbXVxuICAgIH07XG4gICAgdC5mID0gdC5nICsgdC5oO1xuICAgIGxldCBsZW4gID0gYmVzdC5mcm9udC5sZW5ndGg7XG4gICAgdC5mcm9udC5sZW5ndGggPSBsZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdC5mcm9udFtpXSA9IGJlc3QuZnJvbnRbaV07XG4gICAgfVxuICAgIHQuZnJvbnQucHVzaChiZXN0LngpO1xuICAgIHQuZnJvbnQucHVzaChiZXN0LnkpO1xuICAgIHJldHVybiB0O1xuICB9XG5cbiAgZnVuY3Rpb24gcGF0aCAoY29sbGlzaW9uRnVuY3Rpb24sIHN0YXJ0LCBlbmQpIHtcblxuICAgIC8vIOW8gOWQr+WIl+ihqOWSjOWFs+mXreWIl+ihqFxuICAgIGxldCBvcGVuID0gbmV3IEJpbmFyeUhlYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmY7XG4gICAgfSk7XG4gICAgbGV0IG9wZW5JbmRleCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgY2xvc2VJbmRleCA9IG5ldyBTZXQoKTtcblxuICAgIC8v5p6E5bu66LW35aeL6IqC54K5XG4gICAgbGV0IHN0YXJ0RWxlbWVudCA9IHtcbiAgICAgIGtleTogc3RhcnQueCoxMDAwMCtzdGFydC55LFxuICAgICAgeDogc3RhcnQueCxcbiAgICAgIHk6IHN0YXJ0LnksXG4gICAgICBmOiAwLFxuICAgICAgZzogMCxcbiAgICAgIGg6IG1hbmhhdHRhbihzdGFydC54LCBzdGFydC55LCBlbmQueCwgZW5kLnkpLFxuICAgICAgZnJvbnQ6IFtdXG4gICAgfTtcbiAgICBvcGVuSW5kZXguYWRkKHN0YXJ0RWxlbWVudC5rZXkpO1xuICAgIG9wZW4ucHVzaChzdGFydEVsZW1lbnQpO1xuXG4gICAgbGV0IHB1c2gyb3BlbiA9IGZ1bmN0aW9uICh4LCB5LCBlbmQsIGJlc3QpIHtcbiAgICAgIGlmICghY29sbGlzaW9uRnVuY3Rpb24oeCwgeSkpIHsgLy8g6aqM6K+BdXBcbiAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgIGlmICghb3BlbkluZGV4LmhhcyhrZXkpICYmICFjbG9zZUluZGV4LmhhcyhrZXkpKSB7XG4gICAgICAgICAgb3BlbkluZGV4LmFkZChrZXkpO1xuICAgICAgICAgIG9wZW4ucHVzaChtYWtlKHgsIHksIGVuZCwgYmVzdCwgMTApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB3aGlsZSAob3Blbi5zaXplKSB7XG4gICAgICAvLyBG5YC85pyA5bCP55qE6IqC54K577yM5bCx5piv5aCG6aG2XG4gICAgICBsZXQgYmVzdCA9IG9wZW4ucG9wKCk7XG4gICAgICAvLyDku47lvIDlkK/liJfooajkuK3liKDpmaTvvIzliqDlhaXlhbPpl63liJfooahcbiAgICAgIG9wZW4uZGVsZXRlKGJlc3QpO1xuICAgICAgb3BlbkluZGV4LmRlbGV0ZShiZXN0LmtleSk7XG4gICAgICBjbG9zZUluZGV4LmFkZChiZXN0LmtleSk7XG5cbiAgICAgIC8vIOWmguaenOi/meS4quacgOWlveeahOiKgueCueWwseaYr+e7k+WwvuiKgueCue+8jOWImei/lOWbnlxuICAgICAgaWYgKGJlc3QueCA9PSBlbmQueCAmJiBiZXN0LnkgPT0gZW5kLnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYmVzdC5mcm9udC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIHg6IGJlc3QuZnJvbnRbaV0sXG4gICAgICAgICAgICB5OiBiZXN0LmZyb250W2kgKyAxXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICB4OiBlbmQueCxcbiAgICAgICAgICB5OiBlbmQueVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgLy8g6K6w5b2V5LiK5LiL5bem5Y+z5Zub5pa55ZCR55qE5Y+v6IO95YC8XG4gICAgICBwdXNoMm9wZW4oYmVzdC54LCBiZXN0LnkgLSAxLCBlbmQsIGJlc3QpO1xuICAgICAgcHVzaDJvcGVuKGJlc3QueCwgYmVzdC55ICsgMSwgZW5kLCBiZXN0KTtcbiAgICAgIHB1c2gyb3BlbihiZXN0LnggLSAxLCBiZXN0LnksIGVuZCwgYmVzdCk7XG4gICAgICBwdXNoMm9wZW4oYmVzdC54ICsgMSwgYmVzdC55LCBlbmQsIGJlc3QpO1xuXG4gICAgfSAvLyB3aGlsZVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG59KSgpO1xuIl19
