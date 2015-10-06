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

      privates.width = 0;
      privates.height = 0;
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
      },

      /**
       * @param {number} value new x position
       */
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
      },

      /**
       * @param {number} value new y position
       */
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
      },

      /**
       * @param {number} value new center x
       */
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
      },

      /**
       * @param {number} value new center y
       */
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
      },

      /**
       * @param {number} value new alpha
       */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRGlzcGxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxXQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNwQixXQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNyQixNQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFlBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsTUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7QUFRdkQsUUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTO2NBQVEsYUFBYTs7Ozs7OztBQUs5QixhQUxpQixhQUFhLEdBSzNCOzRCQUxjLGFBQWE7O0FBTXhDLGlDQU4yQixhQUFhLDZDQU1oQztBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7QUFLOUIsY0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7O0FBS2YsY0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7O0FBS2YsY0FBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7O0FBS3JCLGNBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7OztBQUtyQixjQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FB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SSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDeEQsY0FBSSxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUMzQixvQkFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkIsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7V0FDckI7U0FDRixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7T0FDRjs7Ozs7OztXQUlXLGVBQUc7QUFDYixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsT0FBTyxDQUFDO09BQ3pCOzs7OztXQUlXLGFBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQzdCLGtCQUFRLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JCO09BQ0Y7OztXQXJMNEIsYUFBYTtLQUFTLE1BQU0sQ0FBQyxLQUFLLEVBMlIvRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENsYXNzIFNwcml0ZS5EaXNwbGF5XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIGxldCBoaXRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBoaXRDYW52YXMud2lkdGggPSAxO1xuICBoaXRDYW52YXMuaGVpZ2h0ID0gMTtcbiAgbGV0IGhpdENvbnRleHQgPSBoaXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBoaXRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCAxLCAxKTtcbiAgbGV0IGhpdERhdGEgPSBoaXRDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCAxLCAxKS5kYXRhO1xuXG5cbiAgLyoqXG4gICAqIENsYXNzIFNwcml0ZS5EaXNwbGF5LCBiYXNlIGNsYXNzIGZvciBhbGwgb3RoZXIgY2xhc3Nlc1xuICAgKiBAY2xhc3NcbiAgICogQGV4dGVuZHMgU3ByaXRlLkV2ZW50XG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiRGlzcGxheVwiLCBjbGFzcyBTcHJpdGVEaXNwbGF5IGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLkRpc3BsYXlcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvKipcbiAgICAgICAqIHggcG9zaXRpb24gb2Ygb2JqZWN0XG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMueCA9IDA7XG4gICAgICAvKipcbiAgICAgICAqIHkgcG9zaXRpb24gb2Ygb2JqZWN0XG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMueSA9IDA7XG4gICAgICAvKipcbiAgICAgICAqIG9iamVjdCdzIGNlbnRlciB4XG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY2VudGVyWCA9IDA7XG4gICAgICAvKipcbiAgICAgICAqIG9iamVjdCdzIGNlbnRlciB5XG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY2VudGVyWSA9IDA7XG4gICAgICAvKipcbiAgICAgICAqIG9iamVjdCdzIGFscGhhLCBmcm9tIDAgdG8gMSwgd2hlbiBhbHBoYSBpcyAwLCBvYmplY3QgaXMgaW52aXNpYmxlXG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYWxwaGEgPSAxO1xuICAgICAgLyoqXG4gICAgICAgKiBvYmplY3QncyB2aXNpYmlsaXR5XG4gICAgICAgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLnZpc2libGUgPSB0cnVlO1xuXG4gICAgICBwcml2YXRlcy53aWR0aCA9IDA7XG4gICAgICBwcml2YXRlcy5oZWlnaHQgPSAwO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykud2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IHdpZHRoICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykud2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0ICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmhlaWdodCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gcmV0dXJuIHggcG9zaXRpb25cbiAgICAgKi9cbiAgICBnZXQgeCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykueDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIG5ldyB4IHBvc2l0aW9uXG4gICAgICovXG4gICAgc2V0IHggKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy54KSB7XG4gICAgICAgICAgcHJpdmF0ZXMueCA9IE1hdGguZmxvb3IodmFsdWUpO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5EaXNwbGF5LnNldCB4IDogaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSByZXR1cm4geSBwb3NpdGlvblxuICAgICAqL1xuICAgIGdldCB5ICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS55O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgbmV3IHkgcG9zaXRpb25cbiAgICAgKi9cbiAgICBzZXQgeSAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLnkpIHtcbiAgICAgICAgICBwcml2YXRlcy55ID0gTWF0aC5mbG9vcih2YWx1ZSk7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkRpc3BsYXkuc2V0IHkgOiBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHJldHVybiBjZW50ZXIgeFxuICAgICAqL1xuICAgIGdldCBjZW50ZXJYICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jZW50ZXJYO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgbmV3IGNlbnRlciB4XG4gICAgICovXG4gICAgc2V0IGNlbnRlclggKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5jZW50ZXJYKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY2VudGVyWCA9IE1hdGguZmxvb3IodmFsdWUpO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5EaXNwbGF5LnNldCBjZW50ZXJYIDogaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSByZXR1cm4gY2VudGVyIHlcbiAgICAgKi9cbiAgICBnZXQgY2VudGVyWSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2VudGVyWTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIG5ldyBjZW50ZXIgeVxuICAgICAqL1xuICAgIHNldCBjZW50ZXJZICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuY2VudGVyWSkge1xuICAgICAgICAgIHByaXZhdGVzLmNlbnRlclkgPSBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuRGlzcGxheS5zZXQgY2VudGVyWSA6IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gcmV0dXJuIGFscGhhXG4gICAgICovXG4gICAgZ2V0IGFscGhhICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmFscGhhO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgbmV3IGFscGhhXG4gICAgICovXG4gICAgc2V0IGFscGhhICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiAodmFsdWUgPj0gMCB8fCB2YWx1ZSA8PSAxKSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuYWxwaGEpIHtcbiAgICAgICAgICBwcml2YXRlcy5hbHBoYSA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5EaXNwbGF5LnNldCBhbHBoYSA6IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHJldHVybiBhbHBoYVxuICAgICAqL1xuICAgIGdldCB2aXNpYmxlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnZpc2libGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWUgbmV3IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXQgdmlzaWJsZSAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLnZpc2libGUpIHtcbiAgICAgICAgcHJpdmF0ZXMudmlzaWJsZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVyZmFjZSwgc3ViLWNsYXNzIHNob3VsZCBvdmVybG9hZCB0aGlzIG1ldGhvZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlclxuICAgICAqL1xuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwic3ViLWNsYXNzIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXCIpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjYWxsIFNwcml0ZS5EaXNwbGF5LmRyYXdcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB4LHkgaGl0IHRoaXMgb2JqZWN0IG9yIG5vdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHRoZSB4IHBvc2l0aW9uIG9mIHNjcmVlbiAobWF5IDAgdG8gNjQwKSBmb3IgdGVzdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSB5IHBvc2l0aW9uIG9mIHNjcmVlbiAobWF5IDAgdG8gNDgwKSBmb3IgdGVzdFxuICAgICAqL1xuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGhpdENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIDEsIDEpO1xuICAgICAgaGl0Q29udGV4dC5zYXZlKCk7XG4gICAgICBoaXRDb250ZXh0LnRyYW5zbGF0ZSgteCwgLXkpO1xuICAgICAgdGhpcy5kcmF3KGhpdENvbnRleHQpO1xuICAgICAgaGl0Q29udGV4dC5yZXN0b3JlKCk7XG4gICAgICBsZXQgbmV3RGF0YSA9IGhpdENvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIDEpLmRhdGE7XG5cbiAgICAgIGlmIChoaXREYXRhWzBdICE9IG5ld0RhdGFbMF0gfHwgaGl0RGF0YVsxXSAhPSBuZXdEYXRhWzFdIHx8IGhpdERhdGFbMl0gIT0gbmV3RGF0YVsyXSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIGRyYXdQb3NpdGlvbiAoKSB7XG5cbiAgICAgIGxldCBjZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgbGV0IGNlbnRlclkgPSB0aGlzLmNlbnRlclk7XG4gICAgICBsZXQgeCA9IHRoaXMueDtcbiAgICAgIGxldCB5ID0gdGhpcy55O1xuICAgICAgbGV0IGFscGhhID0gdGhpcy5hbHBoYTtcblxuICAgICAgbGV0IHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBjZW50ZXJYICs9IHBhcmVudC5jZW50ZXJYO1xuICAgICAgICBjZW50ZXJZICs9IHBhcmVudC5jZW50ZXJZO1xuICAgICAgICB4ICs9IHBhcmVudC54O1xuICAgICAgICB5ICs9IHBhcmVudC55O1xuICAgICAgICBhbHBoYSAqPSBwYXJlbnQuYWxwaGE7XG4gICAgICAgIGlmIChhbHBoYSA8PSAwLjAwMSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggLSBjZW50ZXJYLFxuICAgICAgICB5OiB5IC0gY2VudGVyWSxcbiAgICAgICAgYWxwaGE6IGFscGhhXG4gICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEcmF3IGFuIGltYWdlIHRvIHJlbmRlcmVyXG4gICAgICogeCwgeS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICogLSAgICBzeC5zeS0tLS0tLS0tLS0tLSAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICogLSAgICAtICAgICAgICAgICAgICAgLSAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICogLSAgICAtLS1zd2lkdGgsc2hlaWdodCAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICogLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0taW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodFxuICAgICAqIENyb3AgaW1hZ2Ugd2l0aCBzeCwgc3ksIHN3aWR0aCBhbmQgc2hlaWdodCwgZHJhdyBpdCBvbiByZW5kZXJlclxuICAgICAqIHgsIHkgd2lsbCBiZSBjYWxjdWxhdGVkIGJ5IHRoaXMueCwgdGhpcy55LCB0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWSBhbmQgc29tZSBwYXJlbnRzJyBhdHRyaWJ1dGVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyIEEgb2JqZWN0IHdobyBoYXMgZHJhd0ltYWdlIG1ldGhvZCwgZWcuIFNwcml0ZS5XZWJnbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzeVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzd2lkdGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hlaWdodFxuICAgICAqL1xuICAgIGRyYXdJbWFnZSAocmVuZGVyZXIsIGltYWdlLCBzeCwgc3ksIHN3aWR0aCwgc2hlaWdodCkge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSAhPSB0cnVlIHx8IHRoaXMuYWxwaGEgPCAwLjAxKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgZCA9IHRoaXMuZHJhd1Bvc2l0aW9uKCk7XG4gICAgICBpZiAoIWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVuZGVyZXIuYWxwaGEgPSBkLmFscGhhO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZW5kZXJlci5kcmF3SW1hZ2UoXG4gICAgICAgICAgaW1hZ2UsIHN4LCBzeSwgc3dpZHRoLCBzaGVpZ2h0LFxuICAgICAgICAgIGQueCwgZC55LCBzd2lkdGgsIHNoZWlnaHRcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBpbWFnZSwgc3gsIHN5LCBzd2lkdGgsIHNoZWlnaHQsXG4gICAgICAgICAgZC54LCBkLnksIHN3aWR0aCwgc2hlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuXG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
