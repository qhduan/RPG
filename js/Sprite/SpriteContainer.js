/*

2D Game Sprite Library, Built using JavaScript ES6
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

/**
 * @fileoverview Class Sprite.Container, it's a general container
 * Contain Sprite.Sheet, Sprite.Bitmap, Sprite.Shape, Sprite.Text, Sprite.Frame or Sprite.Container
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Contain everything which inherit from Sprite.Display
   * @class
   */
  Sprite.assign("Container", (function (_Sprite$Display) {
    _inherits(SpriteContainer, _Sprite$Display);

    /**
     * Construct Sprite.Container
     * @constructor
     */

    function SpriteContainer() {
      _classCallCheck(this, SpriteContainer);

      _get(Object.getPrototypeOf(SpriteContainer.prototype), "constructor", this).call(this);
      var privates = internal(this);
      /**
       * Contain all children element
       * @private
       */
      privates.children = [];
      /**
       * Cached canvas
       */
      privates.cacheCanvas = null;
    }

    /**
     * @return {Array} Children array
     */

    _createClass(SpriteContainer, [{
      key: "findMinMax",
      value: function findMinMax() {
        var minX = null,
            minY = null,
            maxX = null,
            maxY = null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            if (child.findMinMax) {
              var r = child.findMinMax();
              if (minX === null || minX > r.minX) {
                minX = r.minX;
              }
              if (minY === null || minY > r.minY) {
                minY = r.minY;
              }
              if (maxX === null || maxX < r.maxX) {
                maxX = r.maxX;
              }
              if (maxY === null || maxY < r.maxY) {
                maxY = r.maxY;
              }
            } else {
              if (minX === null || minX > child.x) {
                minX = child.x;
              }
              if (minY === null || minY > child.y) {
                minY = child.y;
              }
              if (child.width && child.height) {
                if (maxX === null || maxX < child.x + child.width) {
                  maxX = child.x + child.width;
                }
                if (maxY === null || maxY < child.y + child.height) {
                  maxY = child.y + child.height;
                }
              }
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

        return {
          minX: minX, minY: minY, maxX: maxX, maxY: maxY
        };
      }

      /**
       * Remove canvas cache
       */
    }, {
      key: "clearCache",
      value: function clearCache() {
        var privates = internal(this);
        privates.cacheCanvas = null;
        if (privates.cacheX) {
          delete privates.cacheX;
        }
        if (privates.cacheY) {
          delete privates.cacheY;
        }
        if (privates.cacheWidth) {
          delete privates.cacheWidth;
        }
        if (privates.cacheHeight) {
          delete privates.cacheHeight;
        }
      }

      /**
       * Prerender all children as cache
       * generate a just size cache
       */
    }, {
      key: "cache",
      value: function cache(x, y, width, height) {
        var privates = internal(this);
        if (privates.cacheCanvas) {
          this.clearCache();
        }
        var p = this.parent;
        this.parent = null;

        var r = this.findMinMax();
        if (r && Number.isFinite(r.minX) && Number.isFinite(r.minY) && Number.isFinite(r.maxX) && Number.isFinite(r.maxY)) {
          var _width = r.maxX - r.minX;
          var _height = r.maxY - r.minY;
          var canvas = document.createElement("canvas");
          canvas.width = _width;
          canvas.height = _height;
          var context = canvas.getContext("2d");
          context.save();
          context.translate(-r.minX, -r.minY);
          this.draw(context);
          context.restore();
          privates.cacheX = r.minX;
          privates.cacheY = r.minY;
          privates.cacheWidth = _width;
          privates.cacheHeight = _height;
          privates.cacheCanvas = canvas;
        } else {
          console.error(r);
          throw new Error("Sprite.Container.cache cannot work something wrong");
        }

        this.parent = p;
      }
    }, {
      key: "hitTest",

      /**
       * Hit test
       */
      value: function hitTest(x, y) {
        var privates = internal(this);
        if (this.cacheCanvas) {
          return _get(Object.getPrototypeOf(SpriteContainer.prototype), "hitTest", this).call(this, x, y);
        } else {
          var hitted = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var child = _step2.value;

              var ret = child.hitTest(x, y);
              if (ret instanceof Array) {
                hitted = hitted.concat(ret);
              } else if (ret === true) {
                hitted.push(child);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return hitted;
        }
      }

      /**
       * Draw all children in this container on context
       * @param {Object} renderer Sprite.Webgl/Sprite.Canvas/Context
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        if (this.alpha < 0.01 || this.visible != true) {
          return;
        }

        if (this.cacheCanvas) {
          var x = this.x;
          var y = this.y;
          this.x += privates.cacheX;
          this.y += privates.cacheY;
          this.drawImage(renderer, this.cacheCanvas, 0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
          this.x = x;
          this.y = y;
        } else {
          if (this.children.length > 0) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var child = _step3.value;

                if (child.visible == true && child.alpha >= 0.01) {
                  child.draw(renderer);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }
      }

      /**
      */
    }, {
      key: "hasChild",
      value: function hasChild(element) {
        if (this.children.indexOf(element) != -1) {
          return true;
        }
        return false;
      }

      /**
       * Append one or more children into container
       * eg. c.appendChild(childA) c.appendChild(childA, childB)
       * @param one or more children
       */
    }, {
      key: "appendChild",
      value: function appendChild() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 0) {
          throw new Error("Sprite.Container.appendChild got an invalid arguments");
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = args[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var element = _step4.value;

            if (element instanceof Sprite.Display == false) {
              console.error(element);
              throw new Error("Sprite.Container.appendChild only accept Sprite.Display or it's sub-class");
            }
            element.parent = this;
            this.children.push(element);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.emit("addedChildren");
      }

      /**
       * Append one or more children into container at certain position
       * eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
       * @param one or more children
       */
    }, {
      key: "appendChildAt",
      value: function appendChildAt() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 1) {
          console.log(arguments, this);
          throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
        }

        var index = args[0];
        for (var i = 1, len = args.length; i < len; i++) {
          if (args[i] instanceof Sprite.Display == false) {
            console.error(args[i]);
            throw new Error("Sprite.Container.appendChildAt only can accept Sprite.Display or it's sub-class");
          }
          args[i].parent = this;
          this.children.splice(index, 0, args[i]);
        }

        this.emit("addedChildren");
      }

      /**
       * Remove one child from a container
       * eg. c.removeChild(childA)
       * @param {Object} element The child you want to remove
       * @return {boolean} If found and removed element, return true, otherwise, false
       */
    }, {
      key: "removeChild",
      value: function removeChild(element) {
        var index = this.children.indexOf(element);
        if (index != -1) {
          // found it
          this.children[index].parent = null;
          this.children.splice(index, 1);
          this.emit("removedChildren");
          return true;
        } else {
          // not found, element not a child
          return false;
        }
      }

      /**
       * remove all children of container
       */
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = privates.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var child = _step5.value;

            child.parent = null;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        privates.children = [];
        this.clearCache();
        this.emit("removedChildren");
      }
    }, {
      key: "children",
      get: function get() {
        return internal(this).children;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.children readonly");
      }

      /**
       * @return {Object} Cached canvas
       */
    }, {
      key: "cacheCanvas",
      get: function get() {
        return internal(this).cacheCanvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheCanvas readonly");
      }
    }, {
      key: "cacheX",
      get: function get() {
        return internal(this).cacheX;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheX readonly");
      }
    }, {
      key: "cacheY",
      get: function get() {
        return internal(this).cacheY;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheY readonly");
      }
    }]);

    return SpriteContainer;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ29udGFpbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7QUFNbEMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsZUFBZTs7Ozs7OztBQU1sQyxhQU5tQixlQUFlLEdBTS9COzRCQU5nQixlQUFlOztBQU81QyxpQ0FQNkIsZUFBZSw2Q0FPcEM7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7O0FBSzlCLGNBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXZCLGNBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0tBQzdCOzs7Ozs7aUJBbEI4QixlQUFlOzthQTBDbkMsc0JBQUc7QUFDWixZQUFJLElBQUksR0FBRyxJQUFJO1lBQUUsSUFBSSxHQUFHLElBQUk7WUFBRSxJQUFJLEdBQUcsSUFBSTtZQUFFLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7Ozs7QUFFdkQsK0JBQWtCLElBQUksQ0FBQyxRQUFRLDhIQUFFO2dCQUF4QixLQUFLOztBQUNaLGdCQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDcEIsa0JBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMzQixrQkFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQ2xDLG9CQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztlQUNmO0FBQ0Qsa0JBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNsQyxvQkFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7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dEIsY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO09BQzFEOzs7V0F5R1UsZUFBRztBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5QjtXQUVVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBRVUsZUFBRztBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5QjtXQUVVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBL0o4QixlQUFlO0tBQVMsTUFBTSxDQUFDLE9BQU8sRUE4U3JFLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVDb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkNvbnRhaW5lciwgaXQncyBhIGdlbmVyYWwgY29udGFpbmVyXG4gKiBDb250YWluIFNwcml0ZS5TaGVldCwgU3ByaXRlLkJpdG1hcCwgU3ByaXRlLlNoYXBlLCBTcHJpdGUuVGV4dCwgU3ByaXRlLkZyYW1lIG9yIFNwcml0ZS5Db250YWluZXJcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDb250YWluIGV2ZXJ5dGhpbmcgd2hpY2ggaW5oZXJpdCBmcm9tIFNwcml0ZS5EaXNwbGF5XG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkNvbnRhaW5lclwiLCBjbGFzcyBTcHJpdGVDb250YWluZXIgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgU3ByaXRlLkNvbnRhaW5lclxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbiBhbGwgY2hpbGRyZW4gZWxlbWVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQ2FjaGVkIGNhbnZhc1xuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jYWNoZUNhbnZhcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7QXJyYXl9IENoaWxkcmVuIGFycmF5XG4gICAgICovXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jaGlsZHJlbjtcbiAgICB9XG5cbiAgICBzZXQgY2hpbGRyZW4gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmNoaWxkcmVuIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ2FjaGVkIGNhbnZhc1xuICAgICAqL1xuICAgIGdldCBjYWNoZUNhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FjaGVDYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhY2hlQ2FudmFzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5jYWNoZUNhbnZhcyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBmaW5kTWluTWF4ICgpIHtcbiAgICAgIGxldCBtaW5YID0gbnVsbCwgbWluWSA9IG51bGwsIG1heFggPSBudWxsLCBtYXhZID0gbnVsbDtcblxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQuZmluZE1pbk1heCkge1xuICAgICAgICAgIGxldCByID0gY2hpbGQuZmluZE1pbk1heCgpO1xuICAgICAgICAgIGlmIChtaW5YID09PSBudWxsIHx8IG1pblggPiByLm1pblgpIHtcbiAgICAgICAgICAgIG1pblggPSByLm1pblg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtaW5ZID09PSBudWxsIHx8IG1pblkgPiByLm1pblkpIHtcbiAgICAgICAgICAgIG1pblkgPSByLm1pblk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXhYID09PSBudWxsIHx8IG1heFggPCByLm1heFgpIHtcbiAgICAgICAgICAgIG1heFggPSByLm1heFg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXhZID09PSBudWxsIHx8IG1heFkgPCByLm1heFkpIHtcbiAgICAgICAgICAgIG1heFkgPSByLm1heFk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtaW5YID09PSBudWxsIHx8IG1pblggPiBjaGlsZC54KSB7XG4gICAgICAgICAgICBtaW5YID0gY2hpbGQueDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1pblkgPT09IG51bGwgfHwgbWluWSA+IGNoaWxkLnkpIHtcbiAgICAgICAgICAgIG1pblkgPSBjaGlsZC55O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQud2lkdGggJiYgY2hpbGQuaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAobWF4WCA9PT0gbnVsbCB8fCBtYXhYIDwgY2hpbGQueCArIGNoaWxkLndpZHRoKSB7XG4gICAgICAgICAgICAgIG1heFggPSBjaGlsZC54ICsgY2hpbGQud2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4WSA9PT0gbnVsbCB8fCBtYXhZIDwgY2hpbGQueSArIGNoaWxkLmhlaWdodCkge1xuICAgICAgICAgICAgICBtYXhZID0gY2hpbGQueSArIGNoaWxkLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pblgsIG1pblksIG1heFgsIG1heFlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGNhbnZhcyBjYWNoZVxuICAgICAqL1xuICAgIGNsZWFyQ2FjaGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5jYWNoZUNhbnZhcyA9IG51bGw7XG4gICAgICBpZiAocHJpdmF0ZXMuY2FjaGVYKSB7XG4gICAgICAgIGRlbGV0ZSBwcml2YXRlcy5jYWNoZVg7XG4gICAgICB9XG4gICAgICBpZiAocHJpdmF0ZXMuY2FjaGVZKSB7XG4gICAgICAgIGRlbGV0ZSBwcml2YXRlcy5jYWNoZVk7XG4gICAgICB9XG4gICAgICBpZiAocHJpdmF0ZXMuY2FjaGVXaWR0aCkge1xuICAgICAgICBkZWxldGUgcHJpdmF0ZXMuY2FjaGVXaWR0aDtcbiAgICAgIH1cbiAgICAgIGlmIChwcml2YXRlcy5jYWNoZUhlaWdodCkge1xuICAgICAgICBkZWxldGUgcHJpdmF0ZXMuY2FjaGVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJlcmVuZGVyIGFsbCBjaGlsZHJlbiBhcyBjYWNoZVxuICAgICAqIGdlbmVyYXRlIGEganVzdCBzaXplIGNhY2hlXG4gICAgICovXG4gICAgY2FjaGUgKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmNhY2hlQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuICAgICAgfVxuICAgICAgbGV0IHAgPSB0aGlzLnBhcmVudDtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcblxuICAgICAgbGV0IHIgPSB0aGlzLmZpbmRNaW5NYXgoKTtcbiAgICAgIGlmIChcbiAgICAgICAgciAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUoci5taW5YKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUoci5taW5ZKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUoci5tYXhYKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUoci5tYXhZKVxuICAgICAgKSB7XG4gICAgICAgIGxldCB3aWR0aCA9IHIubWF4WCAtIHIubWluWDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHIubWF4WSAtIHIubWluWTtcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtci5taW5YLCAtci5taW5ZKTtcbiAgICAgICAgdGhpcy5kcmF3KGNvbnRleHQpO1xuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgcHJpdmF0ZXMuY2FjaGVYID0gci5taW5YO1xuICAgICAgICBwcml2YXRlcy5jYWNoZVkgPSByLm1pblk7XG4gICAgICAgIHByaXZhdGVzLmNhY2hlV2lkdGggPSB3aWR0aDtcbiAgICAgICAgcHJpdmF0ZXMuY2FjaGVIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHByaXZhdGVzLmNhY2hlQ2FudmFzID0gY2FudmFzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihyKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5jYWNoZSBjYW5ub3Qgd29yayBzb21ldGhpbmcgd3JvbmdcIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyZW50ID0gcDtcbiAgICB9XG5cbiAgICBnZXQgY2FjaGVYICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYWNoZVg7XG4gICAgfVxuXG4gICAgc2V0IGNhY2hlWCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuY2FjaGVYIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBjYWNoZVkgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhY2hlWTtcbiAgICB9XG5cbiAgICBzZXQgY2FjaGVZICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5jYWNoZVkgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGl0IHRlc3RcbiAgICAgKi9cbiAgICBoaXRUZXN0ICh4LCB5KSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLmNhY2hlQ2FudmFzKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5oaXRUZXN0KHgsIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGhpdHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgbGV0IHJldCA9IGNoaWxkLmhpdFRlc3QoeCwgeSk7XG4gICAgICAgICAgaWYgKHJldCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBoaXR0ZWQgPSBoaXR0ZWQuY29uY2F0KHJldCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGhpdHRlZC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpdHRlZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFsbCBjaGlsZHJlbiBpbiB0aGlzIGNvbnRhaW5lciBvbiBjb250ZXh0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyIFNwcml0ZS5XZWJnbC9TcHJpdGUuQ2FudmFzL0NvbnRleHRcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodGhpcy5hbHBoYSA8IDAuMDEgfHwgdGhpcy52aXNpYmxlICE9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jYWNoZUNhbnZhcykge1xuICAgICAgICBsZXQgeCA9IHRoaXMueDtcbiAgICAgICAgbGV0IHkgPSB0aGlzLnk7XG4gICAgICAgIHRoaXMueCArPSBwcml2YXRlcy5jYWNoZVg7XG4gICAgICAgIHRoaXMueSArPSBwcml2YXRlcy5jYWNoZVk7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKHJlbmRlcmVyLCB0aGlzLmNhY2hlQ2FudmFzLFxuICAgICAgICAgIDAsIDAsIHRoaXMuY2FjaGVDYW52YXMud2lkdGgsIHRoaXMuY2FjaGVDYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudmlzaWJsZSA9PSB0cnVlICYmIGNoaWxkLmFscGhhID49IDAuMDEpIHtcbiAgICAgICAgICAgICAgY2hpbGQuZHJhdyhyZW5kZXJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKi9cbiAgICBoYXNDaGlsZCAoZWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KSAhPSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmQgb25lIG9yIG1vcmUgY2hpbGRyZW4gaW50byBjb250YWluZXJcbiAgICAgKiBlZy4gYy5hcHBlbmRDaGlsZChjaGlsZEEpIGMuYXBwZW5kQ2hpbGQoY2hpbGRBLCBjaGlsZEIpXG4gICAgICogQHBhcmFtIG9uZSBvciBtb3JlIGNoaWxkcmVuXG4gICAgICovXG4gICAgYXBwZW5kQ2hpbGQgKCkge1xuICAgICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmFwcGVuZENoaWxkIGdvdCBhbiBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBhcmdzKSB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU3ByaXRlLkRpc3BsYXkgPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVsZW1lbnQpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuYXBwZW5kQ2hpbGQgb25seSBhY2NlcHQgU3ByaXRlLkRpc3BsYXkgb3IgaXQncyBzdWItY2xhc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdChcImFkZGVkQ2hpbGRyZW5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kIG9uZSBvciBtb3JlIGNoaWxkcmVuIGludG8gY29udGFpbmVyIGF0IGNlcnRhaW4gcG9zaXRpb25cbiAgICAgKiBlZy4gYy5hcHBlbmRDaGlsZEF0KDAsIGNoaWxkQSkgYy5hcHBlbmRDaGlsZEF0KDAsIGNoaWxkQSwgY2hpbGRCKVxuICAgICAqIEBwYXJhbSBvbmUgb3IgbW9yZSBjaGlsZHJlblxuICAgICAqL1xuICAgIGFwcGVuZENoaWxkQXQgKCkge1xuICAgICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5hcHBlbmRDaGlsZEF0IGhhcyBhbiBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGluZGV4ID0gYXJnc1swXTtcbiAgICAgIGZvciAobGV0IGkgPSAxLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgU3ByaXRlLkRpc3BsYXkgPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGFyZ3NbaV0pO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuYXBwZW5kQ2hpbGRBdCBvbmx5IGNhbiBhY2NlcHQgU3ByaXRlLkRpc3BsYXkgb3IgaXQncyBzdWItY2xhc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgYXJnc1tpXS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgYXJnc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdChcImFkZGVkQ2hpbGRyZW5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIG9uZSBjaGlsZCBmcm9tIGEgY29udGFpbmVyXG4gICAgICogZWcuIGMucmVtb3ZlQ2hpbGQoY2hpbGRBKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBjaGlsZCB5b3Ugd2FudCB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiBmb3VuZCBhbmQgcmVtb3ZlZCBlbGVtZW50LCByZXR1cm4gdHJ1ZSwgb3RoZXJ3aXNlLCBmYWxzZVxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkIChlbGVtZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgICBpZiAoaW5kZXggIT0gLTEpIHsgLy8gZm91bmQgaXRcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpbmRleF0ucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkQ2hpbGRyZW5cIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHsgLy8gbm90IGZvdW5kLCBlbGVtZW50IG5vdCBhIGNoaWxkXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGNvbnRhaW5lclxuICAgICAqL1xuICAgIGNsZWFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgcHJpdmF0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuID0gW107XG4gICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcbiAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRDaGlsZHJlblwiKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
