"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteContainer).call(this));

      var privates = internal(_this);
      /**
       * Contain all children element
       * @private
       */
      privates.children = [];
      /**
       * Cached canvas
       */
      privates.cacheCanvas = null;
      return _this;
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
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
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
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
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
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ29udGFpbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFOzs7Ozs7QUFBQyxBQU1sQyxRQUFNLENBQUMsTUFBTSxDQUFDLFdBQVc7Y0FBUSxlQUFlOzs7Ozs7O0FBTTlDLGFBTitCLGVBQWUsR0FNL0I7NEJBTmdCLGVBQWU7O3lFQUFmLGVBQWU7O0FBUTVDLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTTs7Ozs7QUFBQyxBQUs5QixjQUFRLENBQUMsUUFBUSxHQUFHLEVBQUU7Ozs7QUFBQyxBQUl2QixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7S0FDN0I7Ozs7O0FBQUE7aUJBbEI4QixlQUFlOzs7Ozs7bUNBNkNoQztBQUNaLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztPQUNuQzs7Ozs7Ozs7OzRCQU1NLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDcEIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTtBQUN4QixjQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7QUFDRCxZQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVuQixZQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLGNBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGNBQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLFlBQUksT0FBTyxHQUFHLE1BQU0sQ0FB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LElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQztPQUNoQzt3QkFFYSxLQUFLLEVBQUU7QUFDbkIsY0FBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO09BQ3ZEOzs7Ozs7OzswQkFLa0I7QUFDakIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO09BQ25DO3dCQUVnQixLQUFLLEVBQUU7QUFDdEIsY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO09BQzFEOzs7MEJBK0JhO0FBQ1osZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO09BQzlCO3dCQUVXLEtBQUssRUFBRTtBQUNqQixjQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7T0FDckQ7OzswQkFFYTtBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5Qjt3QkFFVyxLQUFLLEVBQUU7QUFDakIsY0FBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQ3JEOzs7V0FyRjhCLGVBQWU7S0FBUyxNQUFNLENBQUMsT0FBTyxFQW9PckUsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDbGFzcyBTcHJpdGUuQ29udGFpbmVyLCBpdCdzIGEgZ2VuZXJhbCBjb250YWluZXJcbiAqIENvbnRhaW4gU3ByaXRlLlNoZWV0LCBTcHJpdGUuQml0bWFwLCBTcHJpdGUuU2hhcGUsIFNwcml0ZS5UZXh0LCBTcHJpdGUuRnJhbWUgb3IgU3ByaXRlLkNvbnRhaW5lclxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAqIENvbnRhaW4gZXZlcnl0aGluZyB3aGljaCBpbmhlcml0IGZyb20gU3ByaXRlLkRpc3BsYXlcbiAgICogQGNsYXNzXG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiQ29udGFpbmVyXCIsIGNsYXNzIFNwcml0ZUNvbnRhaW5lciBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBTcHJpdGUuQ29udGFpbmVyXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgLyoqXG4gICAgICAgKiBDb250YWluIGFsbCBjaGlsZHJlbiBlbGVtZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBDYWNoZWQgY2FudmFzXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNhY2hlQ2FudmFzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQ2hpbGRyZW4gYXJyYXlcbiAgICAgKi9cbiAgICBnZXQgY2hpbGRyZW4gKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNoaWxkcmVuO1xuICAgIH1cblxuICAgIHNldCBjaGlsZHJlbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuY2hpbGRyZW4gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDYWNoZWQgY2FudmFzXG4gICAgICovXG4gICAgZ2V0IGNhY2hlQ2FudmFzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYWNoZUNhbnZhcztcbiAgICB9XG5cbiAgICBzZXQgY2FjaGVDYW52YXMgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmNhY2hlQ2FudmFzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBjYW52YXMgY2FjaGVcbiAgICAgKi9cbiAgICBjbGVhckNhY2hlICgpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmNhY2hlQ2FudmFzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmVyZW5kZXIgYWxsIGNoaWxkcmVuIGFzIGNhY2hlXG4gICAgICogZ2VuZXJhdGUgYSBqdXN0IHNpemUgY2FjaGVcbiAgICAgKi9cbiAgICBjYWNoZSAod2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuY2FjaGVDYW52YXMpIHtcbiAgICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG4gICAgICB9XG4gICAgICBsZXQgcCA9IHRoaXMucGFyZW50O1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuXG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIHRoaXMuZHJhdyhjb250ZXh0KTtcbiAgICAgIHByaXZhdGVzLmNhY2hlQ2FudmFzID0gY2FudmFzO1xuXG4gICAgICB0aGlzLnBhcmVudCA9IHA7XG4gICAgfVxuXG4gICAgZ2V0IGNhY2hlWCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FjaGVYO1xuICAgIH1cblxuICAgIHNldCBjYWNoZVggKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmNhY2hlWCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgY2FjaGVZICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYWNoZVk7XG4gICAgfVxuXG4gICAgc2V0IGNhY2hlWSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Db250YWluZXIuY2FjaGVZIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpdCB0ZXN0XG4gICAgICovXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodGhpcy5jYWNoZUNhbnZhcykge1xuICAgICAgICByZXR1cm4gc3VwZXIuaGl0VGVzdCh4LCB5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBoaXR0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgIGxldCByZXQgPSBjaGlsZC5oaXRUZXN0KHgsIHkpO1xuICAgICAgICAgIGlmIChyZXQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaGl0dGVkID0gaGl0dGVkLmNvbmNhdChyZXQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmV0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBoaXR0ZWQucHVzaChjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaXR0ZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhbGwgY2hpbGRyZW4gaW4gdGhpcyBjb250YWluZXIgb24gY29udGV4dFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlciBTcHJpdGUuV2ViZ2wvU3ByaXRlLkNhbnZhcy9Db250ZXh0XG4gICAgICovXG4gICAgZHJhdyAocmVuZGVyZXIpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHRoaXMuYWxwaGEgPCAwLjAxIHx8IHRoaXMudmlzaWJsZSAhPSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2FjaGVDYW52YXMpIHtcbiAgICAgICAgbGV0IHggPSB0aGlzLng7XG4gICAgICAgIGxldCB5ID0gdGhpcy55O1xuICAgICAgICB0aGlzLnggKz0gcHJpdmF0ZXMuY2FjaGVYO1xuICAgICAgICB0aGlzLnkgKz0gcHJpdmF0ZXMuY2FjaGVZO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZShyZW5kZXJlciwgdGhpcy5jYWNoZUNhbnZhcyxcbiAgICAgICAgICAwLCAwLCB0aGlzLmNhY2hlQ2FudmFzLndpZHRoLCB0aGlzLmNhY2hlQ2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnZpc2libGUgPT0gdHJ1ZSAmJiBjaGlsZC5hbHBoYSA+PSAwLjAxKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmRyYXcocmVuZGVyZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICovXG4gICAgaGFzQ2hpbGQgKGVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCkgIT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kIG9uZSBvciBtb3JlIGNoaWxkcmVuIGludG8gY29udGFpbmVyXG4gICAgICogZWcuIGMuYXBwZW5kQ2hpbGQoY2hpbGRBKSBjLmFwcGVuZENoaWxkKGNoaWxkQSwgY2hpbGRCKVxuICAgICAqIEBwYXJhbSBvbmUgb3IgbW9yZSBjaGlsZHJlblxuICAgICAqL1xuICAgIGFwcGVuZENoaWxkICgpIHtcbiAgICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNvbnRhaW5lci5hcHBlbmRDaGlsZCBnb3QgYW4gaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgYXJncykge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNwcml0ZS5EaXNwbGF5ID09IGZhbHNlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlbGVtZW50KTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmFwcGVuZENoaWxkIG9ubHkgYWNjZXB0IFNwcml0ZS5EaXNwbGF5IG9yIGl0J3Mgc3ViLWNsYXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZENoaWxkcmVuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBvbmUgb3IgbW9yZSBjaGlsZHJlbiBpbnRvIGNvbnRhaW5lciBhdCBjZXJ0YWluIHBvc2l0aW9uXG4gICAgICogZWcuIGMuYXBwZW5kQ2hpbGRBdCgwLCBjaGlsZEEpIGMuYXBwZW5kQ2hpbGRBdCgwLCBjaGlsZEEsIGNoaWxkQilcbiAgICAgKiBAcGFyYW0gb25lIG9yIG1vcmUgY2hpbGRyZW5cbiAgICAgKi9cbiAgICBhcHBlbmRDaGlsZEF0ICgpIHtcbiAgICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlNwcml0ZS5Db250YWluZXIuYXBwZW5kQ2hpbGRBdCBoYXMgYW4gaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmRleCA9IGFyZ3NbMF07XG4gICAgICBmb3IgKGxldCBpID0gMSwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSBpbnN0YW5jZW9mIFNwcml0ZS5EaXNwbGF5ID09IGZhbHNlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihhcmdzW2ldKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ29udGFpbmVyLmFwcGVuZENoaWxkQXQgb25seSBjYW4gYWNjZXB0IFNwcml0ZS5EaXNwbGF5IG9yIGl0J3Mgc3ViLWNsYXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGFyZ3NbaV0ucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGFyZ3NbaV0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZENoaWxkcmVuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBvbmUgY2hpbGQgZnJvbSBhIGNvbnRhaW5lclxuICAgICAqIGVnLiBjLnJlbW92ZUNoaWxkKGNoaWxkQSlcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBUaGUgY2hpbGQgeW91IHdhbnQgdG8gcmVtb3ZlXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgZm91bmQgYW5kIHJlbW92ZWQgZWxlbWVudCwgcmV0dXJuIHRydWUsIG90aGVyd2lzZSwgZmFsc2VcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZCAoZWxlbWVudCkge1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgICAgaWYgKGluZGV4ICE9IC0xKSB7IC8vIGZvdW5kIGl0XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baW5kZXhdLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZENoaWxkcmVuXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7IC8vIG5vdCBmb3VuZCwgZWxlbWVudCBub3QgYSBjaGlsZFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGFsbCBjaGlsZHJlbiBvZiBjb250YWluZXJcbiAgICAgKi9cbiAgICBjbGVhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHByaXZhdGVzLmNoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICB9XG4gICAgICBwcml2YXRlcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG4gICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkQ2hpbGRyZW5cIik7XG4gICAgfVxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
