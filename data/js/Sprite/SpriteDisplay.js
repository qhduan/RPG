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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (Sprite) {
  "use strict";

  var internal = Sprite.Namespace();

  var hitCanvas = document.createElement("canvas");
  hitCanvas.width = 1;
  hitCanvas.height = 1;
  var hitContext = hitCanvas.getContext("2d");
  hitContext.clearRect(0, 0, 1, 1);
  var hitData = hitContext.getImageData(0, 0, 1, 1).data;

  /**
   * Class Sprite.Display, base class for all other classes
   * @class
   * @extends Sprite.Event
   */
  Sprite.Display = (function (_Sprite$Event) {
    _inherits(Display, _Sprite$Event);

    /**
     * construct Sprite.Display
     * @constructor
     */

    function Display() {
      _classCallCheck(this, Display);

      _get(Object.getPrototypeOf(Display.prototype), "constructor", this).call(this);
      /**
       * x position of object
       @type {number}
       */
      internal(this).x = 0;
      /**
       * y position of object
       @type {number}
       */
      internal(this).y = 0;
      /**
       * object's center x
       @type {number}
       */
      internal(this).centerX = 0;
      /**
       * object's center y
       @type {number}
       */
      internal(this).centerY = 0;
      /**
       * object's alpha, from 0 to 1, when alpha is 0, object is invisible
       @type {number}
       */
      internal(this).alpha = 1;
      /**
       * object's visibility
       @type {boolean}
       */
      internal(this).visible = true;
    }

    /**
     * @return {number} return x position
     */

    _createClass(Display, [{
      key: "draw",

      /**
       * Interface, sub-class should overload this method
       * @param {Object} renderer
       */
      value: function draw(renderer) {
        throw new Error("Invalid call Sprite.Display.draw");
      }

      /**
       * Check if the x,y hit this object or not
       * @param {number} x the x position for test
       * @param {number} y the y position for test
       */
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        hitContext.clearRect(0, 0, 1, 1);
        hitContext.save();
        hitContext.translate(-x, -y);
        this.draw(hitContext);
        hitContext.restore();
        var newData = hitContext.getImageData(0, 0, 1, 1).data;

        if (hitData[0] != newData[0] || hitData[1] != newData[1] || hitData[2] != newData[2]) {
          return true;
        }
        return false;
      }

      /**
       * Draw an image to renderer
       * x, y-----------------------------------------
       * -                                           -
       * -    sx.sy------------                      -
       * -    -               -                      -
       * -    ---swidth,sheight                      -
       * -                                           -
       * ---------------------------------------------image.width, image.height
       * Crop image with sx, sy, swidth and sheight, draw it on renderer
       * x, y will be calculated by this.x, this.y, this.centerX, this.centerY and some parents' attributes
       * @param {Object} renderer A object who has drawImage method, eg. Sprite.Webgl
       * @param {Object} image
       * @param {number} sx
       * @param {number} sy
       * @param {number} swidth
       * @param {number} sheight
       */
    }, {
      key: "drawImage",
      value: function drawImage(renderer, image, sx, sy, swidth, sheight) {
        if (this.visible != internal(this).visible) {
          throw new Error("ssss");
        }
        if (this.visible == true && this.alpha > 0) {
          var center = {
            x: this.centerX,
            y: this.centerY
          };
          var position = {
            x: this.x,
            y: this.y
          };

          var alpha = this.alpha;

          var obj = this.parent;
          while (obj) {
            center.x += obj.centerX;
            center.y += obj.centerY;
            position.x += obj.x;
            position.y += obj.y;
            alpha *= obj.alpha;
            if (alpha <= 0) {
              return;
            }
            if (obj.visible == false) {
              return;
            }
            obj = obj.parent;
          }

          var dx = position.x - center.x;
          var dy = position.y - center.y;

          renderer.alpha = alpha;
          try {
            renderer.drawImage(image, sx, sy, swidth, sheight, dx, dy, swidth, sheight);
          } catch (e) {
            console.error(image, sx, sy, swidth, sheight, dx, dy, swidth, sheight);
            throw e;
          }
        }
      }
    }, {
      key: "x",
      get: function get() {
        return internal(this).x;
      },

      /**
       * @param {number} value new x position
       */
      set: function set(value) {
        if (typeof value == "number" && !isNaN(value)) {
          if (value != internal(this).x) {
            internal(this).x = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set x : invalid argument");
        }
      }

      /**
       * @return {number} return y position
       */
    }, {
      key: "y",
      get: function get() {
        return internal(this).y;
      },

      /**
       * @param {number} value new y position
       */
      set: function set(value) {
        if (typeof value == "number" && !isNaN(value)) {
          if (value != internal(this).y) {
            internal(this).y = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set y : invalid argument");
        }
      }

      /**
       * @return {number} return center x
       */
    }, {
      key: "centerX",
      get: function get() {
        return internal(this).centerX;
      },

      /**
       * @param {number} value new center x
       */
      set: function set(value) {
        if (typeof value == "number" && !isNaN(value)) {
          if (value != internal(this).centerX) {
            internal(this).centerX = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerX : invalid argument");
        }
      }

      /**
       * @return {number} return center y
       */
    }, {
      key: "centerY",
      get: function get() {
        return internal(this).centerY;
      },

      /**
       * @param {number} value new center y
       */
      set: function set(value) {
        if (typeof value == "number" && !isNaN(value)) {
          if (value != internal(this).centerY) {
            internal(this).centerY = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerY : invalid argument");
        }
      }

      /**
       * @return {number} return alpha
       */
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).alpha;
      },

      /**
       * @param {number} value new alpha
       */
      set: function set(value) {
        if (typeof value == "number" && !isNaN(value) && (value >= 0 || value <= 1)) {
          if (value != internal(this).alpha) {
            internal(this).alpha = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set alpha : invalid argument");
        }
      }

      /**
       * @return {boolean} return alpha
       */
    }, {
      key: "visible",
      get: function get() {
        return internal(this).visible;
      },

      /**
       * @param {boolean} value new visible
       */
      set: function set(value) {
        if (value != internal(this).visible) {
          internal(this).visible = value;
          this.emit("change");
        }
      }
    }]);

    return Display;
  })(Sprite.Event);
})(Sprite);
/**
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */