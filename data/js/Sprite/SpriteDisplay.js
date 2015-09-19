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
 * @fileoverview Class Sprite.Display
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
  Sprite.assign("Display", (function (_Sprite$Event) {
    _inherits(SpriteDisplay, _Sprite$Event);

    /**
     * construct Sprite.Display
     * @constructor
     */

    function SpriteDisplay() {
      _classCallCheck(this, SpriteDisplay);

      _get(Object.getPrototypeOf(SpriteDisplay.prototype), "constructor", this).call(this);
      var privates = internal(this);
      /**
       * x position of object
       @type {number}
       */
      privates.x = 0;
      /**
       * y position of object
       @type {number}
       */
      privates.y = 0;
      /**
       * object's center x
       @type {number}
       */
      privates.centerX = 0;
      /**
       * object's center y
       @type {number}
       */
      privates.centerY = 0;
      /**
       * object's alpha, from 0 to 1, when alpha is 0, object is invisible
       @type {number}
       */
      privates.alpha = 1;
      /**
       * object's visibility
       @type {boolean}
       */
      privates.visible = true;
    }

    /**
     * @return {number} return x position
     */

    _createClass(SpriteDisplay, [{
      key: "draw",

      /**
       * Interface, sub-class should overload this method
       * @param {Object} renderer
       */
      value: function draw(renderer) {
        console.error("sub-class should override this function");
        throw new Error("Invalid call Sprite.Display.draw");
      }

      /**
       * Check if the x,y hit this object or not
       * @param {number} x the x position of screen (may 0 to 640) for test
       * @param {number} y the y position of screen (may 0 to 480) for test
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
    }, {
      key: "drawPosition",
      value: function drawPosition() {

        var centerX = this.centerX;
        var centerY = this.centerY;
        var x = this.x;
        var y = this.y;
        var alpha = this.alpha;

        var parent = this.parent;
        while (parent) {
          centerX += parent.centerX;
          centerY += parent.centerY;
          x += parent.x;
          y += parent.y;
          alpha *= parent.alpha;
          if (alpha <= 0.001) {
            return null;
          }
          if (parent.visible == false) {
            return null;
          }
          parent = parent.parent;
        }

        return {
          x: x - centerX,
          y: y - centerY,
          alpha: alpha
        };
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
        if (this.visible != true || this.alpha < 0.01) {
          return;
        }

        var d = this.drawPosition();
        if (!d) {
          return;
        }
        renderer.alpha = d.alpha;

        try {
          renderer.drawImage(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
        } catch (e) {
          console.error(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
          throw e;
        }
      }
    }, {
      key: "x",
      get: function get() {
        var privates = internal(this);
        return privates.x;
      },

      /**
       * @param {number} value new x position
       */
      set: function set(value) {
        var privates = internal(this);
        if (typeof value == "number" && !isNaN(value)) {
          if (value != privates.x) {
            privates.x = value;
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
        var privates = internal(this);
        return privates.y;
      },

      /**
       * @param {number} value new y position
       */
      set: function set(value) {
        var privates = internal(this);
        if (typeof value == "number" && !isNaN(value)) {
          if (value != privates.y) {
            privates.y = value;
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
        var privates = internal(this);
        return privates.centerX;
      },

      /**
       * @param {number} value new center x
       */
      set: function set(value) {
        var privates = internal(this);
        if (typeof value == "number" && !isNaN(value)) {
          if (value != privates.centerX) {
            privates.centerX = value;
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
        var privates = internal(this);
        return privates.centerY;
      },

      /**
       * @param {number} value new center y
       */
      set: function set(value) {
        var privates = internal(this);
        if (typeof value == "number" && !isNaN(value)) {
          if (value != privates.centerY) {
            privates.centerY = value;
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
        var privates = internal(this);
        return privates.alpha;
      },

      /**
       * @param {number} value new alpha
       */
      set: function set(value) {
        var privates = internal(this);
        if (typeof value == "number" && !isNaN(value) && (value >= 0 || value <= 1)) {
          if (value != privates.alpha) {
            privates.alpha = value;
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
        var privates = internal(this);
        return privates.visible;
      },

      /**
       * @param {boolean} value new visible
       */
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.visible) {
          privates.visible = value;
          this.emit("change");
        }
      }
    }]);

    return SpriteDisplay;
  })(Sprite.Event));
})();
//# sourceMappingURL=SpriteDisplay.js.map
