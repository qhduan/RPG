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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7Ozs7O0FBS2IsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7Ozs7Ozs7YUFNbEIsaUJBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUMxQixlQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxjQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7OztBQUNqQixpQ0FBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLDhIQUFFO2tCQUEzQixLQUFLOztBQUNaLGtCQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDNUMsdUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2VBQzNDO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxjQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFOztBQUVoQyxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDbkMscUJBQU8sSUFBSSxDQUFDO2FBQ2I7QUFDRCxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDbkMscUJBQU8sSUFBSSxDQUFDO2FBQ2I7QUFDRCxnQkFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FB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QUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBRTFDOztBQUVELFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FHRixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQXN0YXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvKipcbiAgICog6Ieq5Yqo5a+76Lev566X5rOVIEEqXG4gICAqL1xuICBHYW1lLmFzc2lnbihcIkFzdGFyXCIsIGNsYXNzIEdhbWVBc3RhciB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29sbGlzaW9uRnVuY3Rpb24g5rWL6K+V5piv5ZCm6Zi75oyhXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXJ0IOi1t+Wni+S9jee9riBlZy4ge3g6IDAsIHk6IDB9XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVuZFxuICAgICAqL1xuICAgICBzdGF0aWMgZ2V0UGF0aCAoc3RhcnQsIGVuZCkge1xuICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICBsZXQgYmxvY2tlZCA9IHt9O1xuICAgICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAgICBpZiAoYWN0b3IueCAhPSBzdGFydC54IHx8IGFjdG9yLnkgIT0gc3RhcnQueSkge1xuICAgICAgICAgICAgIGJsb2NrZWRbYWN0b3IueCAqIDEwMDAwICsgYWN0b3IueV0gPSB0cnVlO1xuICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCByZXN1bHQgPSBwYXRoKGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgIC8vIOWIpOaWreWHveaVsO+8jOWIpOaWreaYr+WQpumYu+aMoVxuICAgICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBHYW1lLmFyZWEubWFwLmNvbCkge1xuICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKHkgPCAwIHx8IHkgPj0gR2FtZS5hcmVhLm1hcC5yb3cpIHtcbiAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5pyJ6Zi75oyh77yM6L+U5ZuedHJ1ZVxuICAgICAgICAgICB9XG4gICAgICAgICAgIGxldCBrZXkgPSB4ICogMTAwMDAgKyB5O1xuICAgICAgICAgICBpZiAoR2FtZS5hcmVhLm1hcC5ibG9ja2VkTWFwW2tleV0pIHtcbiAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5pyJ6Zi75oyh77yM6L+U5ZuedHJ1ZVxuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChibG9ja2VkW2tleV0pIHtcbiAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5pyJ6Zi75oyh77yM6L+U5ZuedHJ1ZVxuICAgICAgICAgICB9XG4gICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8g5rKh5pyJ6Zi75oyhXG4gICAgICAgICB9LCBzdGFydCwgZW5kKTtcblxuICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgIH0pO1xuICAgICB9XG5cblxuICB9KTtcblxuICAvKlxuICAqIHJlZmVyZW5jZSBmcm9tIGh0dHA6Ly9lbG9xdWVudGphdmFzY3JpcHQubmV0LzFzdF9lZGl0aW9uL2FwcGVuZGl4Mi5odG1sXG4gICovXG4gIGNsYXNzIEJpbmFyeUhlYXAge1xuXG4gICAgY29uc3RydWN0b3IgKHNjb3JlRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFtdO1xuICAgICAgdGhpcy5zY29yZUZ1bmN0aW9uID0gc2NvcmVGdW5jdGlvbjtcbiAgICAgIHRoaXMuc2NvcmVzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIHB1c2ggKGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2NvcmVzLnNldChlbGVtZW50LCB0aGlzLnNjb3JlRnVuY3Rpb24oZWxlbWVudCkpO1xuICAgICAgdGhpcy5jb250ZW50LnB1c2goZWxlbWVudCk7XG4gICAgICB0aGlzLmJ1YmJsZVVwKHRoaXMuY29udGVudC5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICBwb3AgKCkge1xuICAgICAgbGV0IHIgPSB0aGlzLmNvbnRlbnRbMF07XG4gICAgICBsZXQgZSA9IHRoaXMuY29udGVudC5wb3AoKTtcbiAgICAgIGlmICh0aGlzLmNvbnRlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRbMF0gPSBlO1xuICAgICAgICB0aGlzLnNpbmtEb3duKDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgZGVsZXRlIChub2RlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5jb250ZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRbaV0gPT0gbm9kZSkge1xuICAgICAgICAgIHRoaXMuc2NvcmVzLmRlbGV0ZSh0aGlzLmNvbnRlbnRbaV0pO1xuICAgICAgICAgIGxldCBlID0gdGhpcy5jb250ZW50LnBvcCgpO1xuICAgICAgICAgIGlmIChpID09IGxlbiAtIDEpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNvbnRlbnRbaV0gPSBlO1xuICAgICAgICAgIHRoaXMuYnViYmxlVXAoaSk7XG4gICAgICAgICAgdGhpcy5zaW5rRG93bihpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBzaXplICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQubGVuZ3RoO1xuICAgIH1cblxuICAgIHNldCBzaXplICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmluYXJ5SGVhcC5zaXplIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGJ1YmJsZVVwIChuKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuY29udGVudFtuXTtcbiAgICAgIGxldCBzY29yZSA9IHRoaXMuc2NvcmVzLmdldChlbGVtZW50KTtcbiAgICAgIHdoaWxlIChuID4gMCkge1xuICAgICAgICBsZXQgcGFyZW50TiA9IE1hdGguZmxvb3IoKG4gKyAxKSAvIDIpIC0gMTtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuY29udGVudFtwYXJlbnROXTtcbiAgICAgICAgaWYgKHNjb3JlID49IHRoaXMuc2NvcmVzLmdldChwYXJlbnQpKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB0aGlzLmNvbnRlbnRbcGFyZW50Tl0gPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmNvbnRlbnRbbl0gPSBwYXJlbnQ7XG4gICAgICAgIG4gPSBwYXJlbnROO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNpbmtEb3duIChuKSB7XG4gICAgICBsZXQgbGVuID0gdGhpcy5jb250ZW50Lmxlbmd0aDtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jb250ZW50W25dO1xuICAgICAgbGV0IHNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGVsZW1lbnQpO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsZXQgY2hpbGQyTiA9IChuICsgMSkgKiAyO1xuICAgICAgICBsZXQgY2hpbGQxTiA9IGNoaWxkMk4gLSAxO1xuICAgICAgICBsZXQgc3dhcCA9IG51bGw7XG4gICAgICAgIGxldCBjaGlsZDFzY29yZSwgY2hpbGQyc2NvcmU7XG5cbiAgICAgICAgaWYgKGNoaWxkMU4gPCBsZW4pIHtcbiAgICAgICAgICBsZXQgY2hpbGQxID0gdGhpcy5jb250ZW50W2NoaWxkMU5dO1xuICAgICAgICAgIGNoaWxkMXNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGNoaWxkMSk7XG4gICAgICAgICAgaWYgKGNoaWxkMXNjb3JlIDwgc2NvcmUpIHtcbiAgICAgICAgICAgIHN3YXAgPSBjaGlsZDFOO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGlsZDJOIDwgbGVuKSB7XG4gICAgICAgICAgbGV0IGNoaWxkMiA9IHRoaXMuY29udGVudFtjaGlsZDJOXTtcbiAgICAgICAgICBjaGlsZDJzY29yZSA9IHRoaXMuc2NvcmVzLmdldChjaGlsZDIpO1xuICAgICAgICAgIGlmIChjaGlsZDJzY29yZSA8IChzd2FwID09IG51bGwgPyBzY29yZSA6IGNoaWxkMXNjb3JlKSkge1xuICAgICAgICAgICAgc3dhcCA9IGNoaWxkMk47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN3YXAgPT0gbnVsbCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZW50W25dID0gdGhpcy5jb250ZW50W3N3YXBdO1xuICAgICAgICB0aGlzLmNvbnRlbnRbc3dhcF0gPSBlbGVtZW50O1xuICAgICAgICBuID0gc3dhcDtcbiAgICAgIH1cblxuICAgIH1cblxuICB9OyAvLyBCaW5hcnlIZWFwXG5cbiAgLy8g6K6h566X54K557uT5p6EYeWSjGLkuYvpl7TnmoTmm7zlk4jpob/ot53nprvvvIzljbPkuI3luKbmlpzotbDnmoTnm7Tnur/ot53nprtcbiAgZnVuY3Rpb24gbWFuaGF0dGFuIChheCwgYXksIGJ4LCBieSkge1xuICAgIHJldHVybiBNYXRoLmFicyhheCAtIGJ4KSArIE1hdGguYWJzKGF5IC0gYnkpO1xuICB9XG5cbiAgLy8g6YCa6L+H5Z2Q5qCHeO+8jHnvvIzlvZPliY3mnIDlpb3nmoToioLngrliZXN05ZKM5LiA5Liq6ZmE5Yqg5YC877yI55u057q/MTDvvIzmlpznur8xNO+8ie+8jOi/lOWbnuS4gOS4quaWsOiKgueCuVxuICBmdW5jdGlvbiBtYWtlICh4LCB5LCBlbmQsIGJlc3QsIGFkZGl0aW9uKSB7XG4gICAgbGV0IHQgPSB7XG4gICAgICBrZXk6IHggKiAxMDAwMCArIHksXG4gICAgICB4OiB4LFxuICAgICAgeTogeSxcbiAgICAgIGc6IGJlc3QuZyArIGFkZGl0aW9uLFxuICAgICAgaDogbWFuaGF0dGFuKHgsIHksIGVuZC54LCBlbmQueSksXG4gICAgICBmcm9udDogW11cbiAgICB9O1xuICAgIHQuZiA9IHQuZyArIHQuaDtcbiAgICBsZXQgbGVuICA9IGJlc3QuZnJvbnQubGVuZ3RoO1xuICAgIHQuZnJvbnQubGVuZ3RoID0gbGVuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHQuZnJvbnRbaV0gPSBiZXN0LmZyb250W2ldO1xuICAgIH1cbiAgICB0LmZyb250LnB1c2goYmVzdC54KTtcbiAgICB0LmZyb250LnB1c2goYmVzdC55KTtcbiAgICByZXR1cm4gdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGggKGNvbGxpc2lvbkZ1bmN0aW9uLCBzdGFydCwgZW5kKSB7XG5cbiAgICAvLyDlvIDlkK/liJfooajlkozlhbPpl63liJfooahcbiAgICBsZXQgb3BlbiA9IG5ldyBCaW5hcnlIZWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5mO1xuICAgIH0pO1xuICAgIGxldCBvcGVuSW5kZXggPSBuZXcgU2V0KCk7XG4gICAgbGV0IGNsb3NlSW5kZXggPSBuZXcgU2V0KCk7XG5cbiAgICAvL+aehOW7uui1t+Wni+iKgueCuVxuICAgIGxldCBzdGFydEVsZW1lbnQgPSB7XG4gICAgICBrZXk6IHN0YXJ0LngqMTAwMDArc3RhcnQueSxcbiAgICAgIHg6IHN0YXJ0LngsXG4gICAgICB5OiBzdGFydC55LFxuICAgICAgZjogMCxcbiAgICAgIGc6IDAsXG4gICAgICBoOiBtYW5oYXR0YW4oc3RhcnQueCwgc3RhcnQueSwgZW5kLngsIGVuZC55KSxcbiAgICAgIGZyb250OiBbXVxuICAgIH07XG4gICAgb3BlbkluZGV4LmFkZChzdGFydEVsZW1lbnQua2V5KTtcbiAgICBvcGVuLnB1c2goc3RhcnRFbGVtZW50KTtcblxuICAgIGxldCBwdXNoMm9wZW4gPSBmdW5jdGlvbiAoeCwgeSwgZW5kLCBiZXN0KSB7XG4gICAgICBpZiAoIWNvbGxpc2lvbkZ1bmN0aW9uKHgsIHkpKSB7IC8vIOmqjOivgXVwXG4gICAgICAgIGxldCBrZXkgPSB4ICogMTAwMDAgKyB5O1xuICAgICAgICBpZiAoIW9wZW5JbmRleC5oYXMoa2V5KSAmJiAhY2xvc2VJbmRleC5oYXMoa2V5KSkge1xuICAgICAgICAgIG9wZW5JbmRleC5hZGQoa2V5KTtcbiAgICAgICAgICBvcGVuLnB1c2gobWFrZSh4LCB5LCBlbmQsIGJlc3QsIDEwKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2hpbGUgKG9wZW4uc2l6ZSkge1xuICAgICAgLy8gRuWAvOacgOWwj+eahOiKgueCue+8jOWwseaYr+WghumhtlxuICAgICAgbGV0IGJlc3QgPSBvcGVuLnBvcCgpO1xuICAgICAgLy8g5LuO5byA5ZCv5YiX6KGo5Lit5Yig6Zmk77yM5Yqg5YWl5YWz6Zet5YiX6KGoXG4gICAgICBvcGVuLmRlbGV0ZShiZXN0KTtcbiAgICAgIG9wZW5JbmRleC5kZWxldGUoYmVzdC5rZXkpO1xuICAgICAgY2xvc2VJbmRleC5hZGQoYmVzdC5rZXkpO1xuXG4gICAgICAvLyDlpoLmnpzov5nkuKrmnIDlpb3nmoToioLngrnlsLHmmK/nu5PlsL7oioLngrnvvIzliJnov5Tlm55cbiAgICAgIGlmIChiZXN0LnggPT0gZW5kLnggJiYgYmVzdC55ID09IGVuZC55KSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJlc3QuZnJvbnQubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICB4OiBiZXN0LmZyb250W2ldLFxuICAgICAgICAgICAgeTogYmVzdC5mcm9udFtpICsgMV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgeDogZW5kLngsXG4gICAgICAgICAgeTogZW5kLnlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIC8vIOiusOW9leS4iuS4i+W3puWPs+Wbm+aWueWQkeeahOWPr+iDveWAvFxuICAgICAgcHVzaDJvcGVuKGJlc3QueCwgYmVzdC55IC0gMSwgZW5kLCBiZXN0KTtcbiAgICAgIHB1c2gyb3BlbihiZXN0LngsIGJlc3QueSArIDEsIGVuZCwgYmVzdCk7XG4gICAgICBwdXNoMm9wZW4oYmVzdC54IC0gMSwgYmVzdC55LCBlbmQsIGJlc3QpO1xuICAgICAgcHVzaDJvcGVuKGJlc3QueCArIDEsIGJlc3QueSwgZW5kLCBiZXN0KTtcblxuICAgIH0gLy8gd2hpbGVcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cblxufSkoKTtcbiJdfQ==
