"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteDisplay).call(this));

      var privates = internal(_this);
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

      privates.width = 0;
      privates.height = 0;
      return _this;
    }

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
      key: "width",
      get: function get() {
        return internal(this).width;
      },
      set: function set(value) {
        internal(this).width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).height;
      },
      set: function set(value) {
        internal(this).height = value;
      }

      /**
       * @return {number} return x position
       */

    }, {
      key: "x",
      get: function get() {
        return internal(this).x;
      }
      /**
       * @param {number} value new x position
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.x) {
            privates.x = Math.floor(value);
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
      }
      /**
       * @param {number} value new y position
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.y) {
            privates.y = Math.floor(value);
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
      }
      /**
       * @param {number} value new center x
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerX) {
            privates.centerX = Math.floor(value);
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
      }
      /**
       * @param {number} value new center y
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerY) {
            privates.centerY = Math.floor(value);
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
      }
      /**
       * @param {number} value new alpha
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && (value >= 0 || value <= 1)) {
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
      }
      /**
       * @param {boolean} value new visible
       */
      ,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRGlzcGxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxXQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNwQixXQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNyQixNQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFlBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsTUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJOzs7Ozs7O0FBQUMsQUFRdkQsUUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTO2NBQVEsYUFBYTs7Ozs7OztBQUsxQyxhQUw2QixhQUFhLEdBSzNCOzRCQUxjLGFBQWE7O3lFQUFiLGFBQWE7O0FBT3hDLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTTs7Ozs7QUFBQyxBQUs5QixjQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Ozs7O0FBQUMsQUFLZixjQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Ozs7O0FBQUMsQUFLZixjQUFRLENBQUMsT0FBTyxHQUFHLENBQUM7Ozs7O0FBQUMsQUFLckIsY0FBUSxDQUFDLE9BQU8sR0FBRyxDQUFDOzs7OztBQUFDLEFBS3JCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7Ozs7QUFBQyxBQUtuQixjQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFeEIsY0FBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbkIsY0FBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0tBQ3JCOztpQkF6QzRCLGFBQWE7Ozs7Ozs7MkJBMExwQyxRQUFRLEVBQUU7QUFDZCxlQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDekQsY0FBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQ3JEOzs7Ozs7Ozs7OEJBTVEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNiLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLGtCQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RCLGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsWUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRXZELFlBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEYsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7QUFDRCxlQUFPLEtBQUssQ0FBQztPQUNkOzs7cUNBR2U7O0FBRWQsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDZixZQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2YsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7QUFFdkIsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixlQUFPLE1BQU0sRUFBRTtBQUNiLGlCQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMxQixpQkFBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDMUIsV0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDZCxXQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNkLGVBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3RCLGNBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUNsQixtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGNBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLEVBQUU7QUFDM0IsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxnQkFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDeEI7O0FBRUQsZUFBTztBQUNMLFdBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTztBQUNkLFdBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTztBQUNkLGVBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQztPQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQW1CVSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNuRCxZQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFO0FBQzdDLGlCQUFNO1NBQ1A7O0FBRUQsWUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVCLFlBQUksQ0FBQyxDQUFDLEVBQUU7QUFDTixpQkFBTztTQUNSO0FBQ0QsZ0JBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFekIsWUFBSTtBQUNGLGtCQUFRLENBQUMsU0FBUyxDQUNoQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUM5QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FDMUIsQ0FBQztTQUNILENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixpQkFBTyxDQUFDLEtBQUssQ0FDWCxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUM5QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FDMUIsQ0FBQztBQUNGLGdCQUFNLENBQUMsQ0FBQztTQUNUO09BRUY7OzswQkEvT1k7QUFDWCxlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7T0FDN0I7d0JBRVUsS0FBSyxFQUFFO0FBQ2hCLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztPQUM5Qjs7OzBCQUVhO0FBQ1osZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO09BQzlCO3dCQUVXLEtBQUssRUFBRTtBQUNqQixnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7T0FDL0I7Ozs7Ozs7OzBCQUtRO0FBQ1AsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3pCOzs7Ozt3QkFJTSxLQUFLLEVBQUU7QUFDWixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsWUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFCLGNBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsb0JBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUNyQjtTQUNGLE1BQU07QUFDTCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0IsZ0JBQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztTQUM1RDtPQUNGOzs7Ozs7OzBCQUlRO0FBQ1AsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3pCOzs7Ozt3QkFJTSxLQUFLLEVBQUU7QUFDWixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsWUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFCLGNBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsb0JBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUNyQjtTQUNGLE1BQU07QUFDTCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0IsZ0JBQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztTQUM1RDtPQUNGOzs7Ozs7OzBCQUljO0FBQ2IsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO09BQy9COzs7Ozt3QkFJWSxLQUFLLEVBQUU7QUFDbEIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMxQixjQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQzdCLG9CQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7V0FDckI7U0FDRixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDbEU7T0FDRjs7Ozs7OzswQkFJYztBQUNiLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztPQUMvQjs7Ozs7d0JBSVksS0FBSyxFQUFFO0FBQ2xCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDMUIsY0FBSSxLQUFLLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUM3QixvQkFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLGdCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ3JCO1NBQ0YsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ2xFO09BQ0Y7Ozs7Ozs7MEJBSVk7QUFDWCxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDO09BQ3ZCOzs7Ozt3QkFJVSxLQUFLLEVBQUU7QUFDaEIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQ3hELGNBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDM0Isb0JBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGdCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ3JCO1NBQ0YsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2hFO09BQ0Y7Ozs7Ozs7MEJBSWM7QUFDYixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsT0FBTyxDQUFDO09BQ3pCOzs7Ozt3QkFJWSxLQUFLLEVBQUU7QUFDbEIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDN0Isa0JBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckI7T0FDRjs7O1dBckw0QixhQUFhO0tBQVMsTUFBTSxDQUFDLEtBQUssRUEyUi9ELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkRpc3BsYXlcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgbGV0IGhpdENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGhpdENhbnZhcy53aWR0aCA9IDE7XG4gIGhpdENhbnZhcy5oZWlnaHQgPSAxO1xuICBsZXQgaGl0Q29udGV4dCA9IGhpdENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGhpdENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIDEsIDEpO1xuICBsZXQgaGl0RGF0YSA9IGhpdENvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIDEpLmRhdGE7XG5cblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkRpc3BsYXksIGJhc2UgY2xhc3MgZm9yIGFsbCBvdGhlciBjbGFzc2VzXG4gICAqIEBjbGFzc1xuICAgKiBAZXh0ZW5kcyBTcHJpdGUuRXZlbnRcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJEaXNwbGF5XCIsIGNsYXNzIFNwcml0ZURpc3BsYXkgZXh0ZW5kcyBTcHJpdGUuRXZlbnQge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdCBTcHJpdGUuRGlzcGxheVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8qKlxuICAgICAgICogeCBwb3NpdGlvbiBvZiBvYmplY3RcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy54ID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogeSBwb3NpdGlvbiBvZiBvYmplY3RcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy55ID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogb2JqZWN0J3MgY2VudGVyIHhcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jZW50ZXJYID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogb2JqZWN0J3MgY2VudGVyIHlcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jZW50ZXJZID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogb2JqZWN0J3MgYWxwaGEsIGZyb20gMCB0byAxLCB3aGVuIGFscGhhIGlzIDAsIG9iamVjdCBpcyBpbnZpc2libGVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5hbHBoYSA9IDE7XG4gICAgICAvKipcbiAgICAgICAqIG9iamVjdCdzIHZpc2liaWxpdHlcbiAgICAgICBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMudmlzaWJsZSA9IHRydWU7XG5cbiAgICAgIHByaXZhdGVzLndpZHRoID0gMDtcbiAgICAgIHByaXZhdGVzLmhlaWdodCA9IDA7XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS53aWR0aDtcbiAgICB9XG5cbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS53aWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmhlaWdodDtcbiAgICB9XG5cbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaGVpZ2h0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSByZXR1cm4geCBwb3NpdGlvblxuICAgICAqL1xuICAgIGdldCB4ICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS54O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgbmV3IHggcG9zaXRpb25cbiAgICAgKi9cbiAgICBzZXQgeCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLngpIHtcbiAgICAgICAgICBwcml2YXRlcy54ID0gTWF0aC5mbG9vcih2YWx1ZSk7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkRpc3BsYXkuc2V0IHggOiBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHJldHVybiB5IHBvc2l0aW9uXG4gICAgICovXG4gICAgZ2V0IHkgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBuZXcgeSBwb3NpdGlvblxuICAgICAqL1xuICAgIHNldCB5ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMueSkge1xuICAgICAgICAgIHByaXZhdGVzLnkgPSBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuRGlzcGxheS5zZXQgeSA6IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gcmV0dXJuIGNlbnRlciB4XG4gICAgICovXG4gICAgZ2V0IGNlbnRlclggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNlbnRlclg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBuZXcgY2VudGVyIHhcbiAgICAgKi9cbiAgICBzZXQgY2VudGVyWCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLmNlbnRlclgpIHtcbiAgICAgICAgICBwcml2YXRlcy5jZW50ZXJYID0gTWF0aC5mbG9vcih2YWx1ZSk7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkRpc3BsYXkuc2V0IGNlbnRlclggOiBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHJldHVybiBjZW50ZXIgeVxuICAgICAqL1xuICAgIGdldCBjZW50ZXJZICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jZW50ZXJZO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgbmV3IGNlbnRlciB5XG4gICAgICovXG4gICAgc2V0IGNlbnRlclkgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5jZW50ZXJZKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY2VudGVyWSA9IE1hdGguZmxvb3IodmFsdWUpO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5EaXNwbGF5LnNldCBjZW50ZXJZIDogaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSByZXR1cm4gYWxwaGFcbiAgICAgKi9cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuYWxwaGE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBuZXcgYWxwaGFcbiAgICAgKi9cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmICh2YWx1ZSA+PSAwIHx8IHZhbHVlIDw9IDEpKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5hbHBoYSkge1xuICAgICAgICAgIHByaXZhdGVzLmFscGhhID0gdmFsdWU7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkRpc3BsYXkuc2V0IGFscGhhIDogaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gcmV0dXJuIGFscGhhXG4gICAgICovXG4gICAgZ2V0IHZpc2libGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMudmlzaWJsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZSBuZXcgdmlzaWJsZVxuICAgICAqL1xuICAgIHNldCB2aXNpYmxlICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMudmlzaWJsZSkge1xuICAgICAgICBwcml2YXRlcy52aXNpYmxlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogSW50ZXJmYWNlLCBzdWItY2xhc3Mgc2hvdWxkIG92ZXJsb2FkIHRoaXMgbWV0aG9kXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyXG4gICAgICovXG4gICAgZHJhdyAocmVuZGVyZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJzdWItY2xhc3Mgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNhbGwgU3ByaXRlLkRpc3BsYXkuZHJhd1wiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHgseSBoaXQgdGhpcyBvYmplY3Qgb3Igbm90XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggdGhlIHggcG9zaXRpb24gb2Ygc2NyZWVuIChtYXkgMCB0byA2NDApIGZvciB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgcG9zaXRpb24gb2Ygc2NyZWVuIChtYXkgMCB0byA0ODApIGZvciB0ZXN0XG4gICAgICovXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgaGl0Q29udGV4dC5jbGVhclJlY3QoMCwgMCwgMSwgMSk7XG4gICAgICBoaXRDb250ZXh0LnNhdmUoKTtcbiAgICAgIGhpdENvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XG4gICAgICB0aGlzLmRyYXcoaGl0Q29udGV4dCk7XG4gICAgICBoaXRDb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgIGxldCBuZXdEYXRhID0gaGl0Q29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgMSkuZGF0YTtcblxuICAgICAgaWYgKGhpdERhdGFbMF0gIT0gbmV3RGF0YVswXSB8fCBoaXREYXRhWzFdICE9IG5ld0RhdGFbMV0gfHwgaGl0RGF0YVsyXSAhPSBuZXdEYXRhWzJdKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgZHJhd1Bvc2l0aW9uICgpIHtcblxuICAgICAgbGV0IGNlbnRlclggPSB0aGlzLmNlbnRlclg7XG4gICAgICBsZXQgY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIGxldCB4ID0gdGhpcy54O1xuICAgICAgbGV0IHkgPSB0aGlzLnk7XG4gICAgICBsZXQgYWxwaGEgPSB0aGlzLmFscGhhO1xuXG4gICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGNlbnRlclggKz0gcGFyZW50LmNlbnRlclg7XG4gICAgICAgIGNlbnRlclkgKz0gcGFyZW50LmNlbnRlclk7XG4gICAgICAgIHggKz0gcGFyZW50Lng7XG4gICAgICAgIHkgKz0gcGFyZW50Lnk7XG4gICAgICAgIGFscGhhICo9IHBhcmVudC5hbHBoYTtcbiAgICAgICAgaWYgKGFscGhhIDw9IDAuMDAxKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudC52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCAtIGNlbnRlclgsXG4gICAgICAgIHk6IHkgLSBjZW50ZXJZLFxuICAgICAgICBhbHBoYTogYWxwaGFcbiAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERyYXcgYW4gaW1hZ2UgdG8gcmVuZGVyZXJcbiAgICAgKiB4LCB5LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiAtICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC1cbiAgICAgKiAtICAgIHN4LnN5LS0tLS0tLS0tLS0tICAgICAgICAgICAgICAgICAgICAgIC1cbiAgICAgKiAtICAgIC0gICAgICAgICAgICAgICAtICAgICAgICAgICAgICAgICAgICAgIC1cbiAgICAgKiAtICAgIC0tLXN3aWR0aCxzaGVpZ2h0ICAgICAgICAgICAgICAgICAgICAgIC1cbiAgICAgKiAtICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC1cbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1pbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0XG4gICAgICogQ3JvcCBpbWFnZSB3aXRoIHN4LCBzeSwgc3dpZHRoIGFuZCBzaGVpZ2h0LCBkcmF3IGl0IG9uIHJlbmRlcmVyXG4gICAgICogeCwgeSB3aWxsIGJlIGNhbGN1bGF0ZWQgYnkgdGhpcy54LCB0aGlzLnksIHRoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZIGFuZCBzb21lIHBhcmVudHMnIGF0dHJpYnV0ZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgQSBvYmplY3Qgd2hvIGhhcyBkcmF3SW1hZ2UgbWV0aG9kLCBlZy4gU3ByaXRlLldlYmdsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltYWdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN3aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaGVpZ2h0XG4gICAgICovXG4gICAgZHJhd0ltYWdlIChyZW5kZXJlciwgaW1hZ2UsIHN4LCBzeSwgc3dpZHRoLCBzaGVpZ2h0KSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlICE9IHRydWUgfHwgdGhpcy5hbHBoYSA8IDAuMDEpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBkID0gdGhpcy5kcmF3UG9zaXRpb24oKTtcbiAgICAgIGlmICghZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZW5kZXJlci5hbHBoYSA9IGQuYWxwaGE7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlbmRlcmVyLmRyYXdJbWFnZShcbiAgICAgICAgICBpbWFnZSwgc3gsIHN5LCBzd2lkdGgsIHNoZWlnaHQsXG4gICAgICAgICAgZC54LCBkLnksIHN3aWR0aCwgc2hlaWdodFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGltYWdlLCBzeCwgc3ksIHN3aWR0aCwgc2hlaWdodCxcbiAgICAgICAgICBkLngsIGQueSwgc3dpZHRoLCBzaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
