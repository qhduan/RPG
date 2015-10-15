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
      key: "clearCache",

      /**
       * Remove canvas cache
       */
      value: function clearCache() {
        internal(this).cacheCanvas = null;
      }

      /**
       * Prerender all children as cache
       * generate a just size cache
       */
    }, {
      key: "cache",
      value: function cache(width, height) {
        var privates = internal(this);
        if (privates.cacheCanvas) {
          this.clearCache();
        }
        var p = this.parent;
        this.parent = null;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        this.draw(context);
        privates.cacheCanvas = canvas;

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
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;

              var ret = child.hitTest(x, y);
              if (ret instanceof Array) {
                hitted = hitted.concat(ret);
              } else if (ret === true) {
                hitted.push(child);
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
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var child = _step2.value;

                if (child.visible == true && child.alpha >= 0.01) {
                  child.draw(renderer);
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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = args[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var element = _step3.value;

            if (element instanceof Sprite.Display == false) {
              console.error(element);
              throw new Error("Sprite.Container.appendChild only accept Sprite.Display or it's sub-class");
            }
            element.parent = this;
            this.children.push(element);
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = privates.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var child = _step4.value;

            child.parent = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ29udGFpbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7QUFNbEMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsZUFBZTs7Ozs7OztBQU1sQyxhQU5tQixlQUFlLEdBTS9COzRCQU5nQixlQUFlOztBQU81QyxpQ0FQNkIsZUFBZSw2Q0FPcEM7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7O0FBSzlCLGNBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXZCLGNBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0tBQzdCOzs7Ozs7aUJBbEI4QixlQUFlOzs7Ozs7YUE2Q25DLHNCQUFHO0FBQ1osZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO09BQ25DOzs7Ozs7OzthQU1LLGVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNwQixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsWUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO0FBQ3hCLGNBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtBQUNELFlBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDcEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsY0FBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDckIsY0FBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDdkIs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QkFBaUIsQ0FBQyxDQUFDO09BQzlCOzs7V0EzTVksZUFBRztBQUNkLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQztPQUNoQztXQUVZLGFBQUMsS0FBSyxFQUFFO0FBQ25CLGNBQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztPQUN2RDs7Ozs7OztXQUtlLGVBQUc7QUFDakIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO09BQ25DO1dBRWUsYUFBQyxLQUFLLEVBQUU7QUFDdEIsY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO09BQzFEOzs7V0ErQlUsZUFBRztBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5QjtXQUVVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBRVUsZUFBRztBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5QjtXQUVVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBckY4QixlQUFlO0tBQVMsTUFBTSxDQUFDLE9BQU8sRUFvT3JFLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVDb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkNvbnRhaW5lciwgaXQncyBhIGdlbmVyYWwgY29udGFpbmVyXG4gKiBDb250YWluIFNwcml0ZS5TaGVldCwgU3ByaXRlLkJpdG1hcCwgU3ByaXRlLlNoYXBlLCBTcHJpdGUuVGV4dCwgU3ByaXRlLkZyYW1lIG9yIFNwcml0ZS5Db250YWluZXJcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDb250YWluIGV2ZXJ5dGhpbmcgd2hpY2ggaW5oZXJpdCBmcm9tIFNwcml0ZS5EaXNwbGF5XG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkNvbnRhaW5lclwiLCBjbGFzcyBTcHJpdGVDb250YWluZXIgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgU3ByaXRlLkNvbnRhaW5lclxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbiBhbGwgY2hpbGRyZW4gZWxlbWVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQ2FjaGVkIGNhbnZhc1xuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jYWNoZUNhbnZhcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7QXJyYXl9IENoaWxkcmVuIGFycmF5XG4gICAgICovXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jaGlsZHJlbjtcbiAgICB9XG5cbiAgICBzZXQgY2hpbGRyZW4gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmNoaWxkcmVuIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ2FjaGVkIGNhbnZhc1xuICAgICAqL1xuICAgIGdldCBjYWNoZUNhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FjaGVDYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhY2hlQ2FudmFzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5jYWNoZUNhbnZhcyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgY2FudmFzIGNhY2hlXG4gICAgICovXG4gICAgY2xlYXJDYWNoZSAoKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5jYWNoZUNhbnZhcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJlcmVuZGVyIGFsbCBjaGlsZHJlbiBhcyBjYWNoZVxuICAgICAqIGdlbmVyYXRlIGEganVzdCBzaXplIGNhY2hlXG4gICAgICovXG4gICAgY2FjaGUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmNhY2hlQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuICAgICAgfVxuICAgICAgbGV0IHAgPSB0aGlzLnBhcmVudDtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcblxuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICB0aGlzLmRyYXcoY29udGV4dCk7XG4gICAgICBwcml2YXRlcy5jYWNoZUNhbnZhcyA9IGNhbnZhcztcblxuICAgICAgdGhpcy5wYXJlbnQgPSBwO1xuICAgIH1cblxuICAgIGdldCBjYWNoZVggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhY2hlWDtcbiAgICB9XG5cbiAgICBzZXQgY2FjaGVYICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5jYWNoZVggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGNhY2hlWSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FjaGVZO1xuICAgIH1cblxuICAgIHNldCBjYWNoZVkgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmNhY2hlWSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaXQgdGVzdFxuICAgICAqL1xuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHRoaXMuY2FjaGVDYW52YXMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhpdFRlc3QoeCwgeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgaGl0dGVkID0gW107XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICBsZXQgcmV0ID0gY2hpbGQuaGl0VGVzdCh4LCB5KTtcbiAgICAgICAgICBpZiAocmV0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGhpdHRlZCA9IGhpdHRlZC5jb25jYXQocmV0KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJldCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaGl0dGVkLnB1c2goY2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGl0dGVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYWxsIGNoaWxkcmVuIGluIHRoaXMgY29udGFpbmVyIG9uIGNvbnRleHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgU3ByaXRlLldlYmdsL1Nwcml0ZS5DYW52YXMvQ29udGV4dFxuICAgICAqL1xuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLmFscGhhIDwgMC4wMSB8fCB0aGlzLnZpc2libGUgIT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNhY2hlQ2FudmFzKSB7XG4gICAgICAgIGxldCB4ID0gdGhpcy54O1xuICAgICAgICBsZXQgeSA9IHRoaXMueTtcbiAgICAgICAgdGhpcy54ICs9IHByaXZhdGVzLmNhY2hlWDtcbiAgICAgICAgdGhpcy55ICs9IHByaXZhdGVzLmNhY2hlWTtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UocmVuZGVyZXIsIHRoaXMuY2FjaGVDYW52YXMsXG4gICAgICAgICAgMCwgMCwgdGhpcy5jYWNoZUNhbnZhcy53aWR0aCwgdGhpcy5jYWNoZUNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC52aXNpYmxlID09IHRydWUgJiYgY2hpbGQuYWxwaGEgPj0gMC4wMSkge1xuICAgICAgICAgICAgICBjaGlsZC5kcmF3KHJlbmRlcmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqL1xuICAgIGhhc0NoaWxkIChlbGVtZW50KSB7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBvbmUgb3IgbW9yZSBjaGlsZHJlbiBpbnRvIGNvbnRhaW5lclxuICAgICAqIGVnLiBjLmFwcGVuZENoaWxkKGNoaWxkQSkgYy5hcHBlbmRDaGlsZChjaGlsZEEsIGNoaWxkQilcbiAgICAgKiBAcGFyYW0gb25lIG9yIG1vcmUgY2hpbGRyZW5cbiAgICAgKi9cbiAgICBhcHBlbmRDaGlsZCAoKSB7XG4gICAgICBsZXQgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuYXBwZW5kQ2hpbGQgZ290IGFuIGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTcHJpdGUuRGlzcGxheSA9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZWxlbWVudCk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5hcHBlbmRDaGlsZCBvbmx5IGFjY2VwdCBTcHJpdGUuRGlzcGxheSBvciBpdCdzIHN1Yi1jbGFzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRDaGlsZHJlblwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmQgb25lIG9yIG1vcmUgY2hpbGRyZW4gaW50byBjb250YWluZXIgYXQgY2VydGFpbiBwb3NpdGlvblxuICAgICAqIGVnLiBjLmFwcGVuZENoaWxkQXQoMCwgY2hpbGRBKSBjLmFwcGVuZENoaWxkQXQoMCwgY2hpbGRBLCBjaGlsZEIpXG4gICAgICogQHBhcmFtIG9uZSBvciBtb3JlIGNoaWxkcmVuXG4gICAgICovXG4gICAgYXBwZW5kQ2hpbGRBdCAoKSB7XG4gICAgICBsZXQgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmFwcGVuZENoaWxkQXQgaGFzIGFuIGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgaW5kZXggPSBhcmdzWzBdO1xuICAgICAgZm9yIChsZXQgaSA9IDEsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFyZ3NbaV0gaW5zdGFuY2VvZiBTcHJpdGUuRGlzcGxheSA9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXJnc1tpXSk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5hcHBlbmRDaGlsZEF0IG9ubHkgY2FuIGFjY2VwdCBTcHJpdGUuRGlzcGxheSBvciBpdCdzIHN1Yi1jbGFzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBhcmdzW2ldLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBhcmdzW2ldKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRDaGlsZHJlblwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgb25lIGNoaWxkIGZyb20gYSBjb250YWluZXJcbiAgICAgKiBlZy4gYy5yZW1vdmVDaGlsZChjaGlsZEEpXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIGNoaWxkIHlvdSB3YW50IHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIGZvdW5kIGFuZCByZW1vdmVkIGVsZW1lbnQsIHJldHVybiB0cnVlLCBvdGhlcndpc2UsIGZhbHNlXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQgKGVsZW1lbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcbiAgICAgIGlmIChpbmRleCAhPSAtMSkgeyAvLyBmb3VuZCBpdFxuICAgICAgICB0aGlzLmNoaWxkcmVuW2luZGV4XS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRDaGlsZHJlblwiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgeyAvLyBub3QgZm91bmQsIGVsZW1lbnQgbm90IGEgY2hpbGRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhbGwgY2hpbGRyZW4gb2YgY29udGFpbmVyXG4gICAgICovXG4gICAgY2xlYXIgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBwcml2YXRlcy5jaGlsZHJlbikge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgfVxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZENoaWxkcmVuXCIpO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19
