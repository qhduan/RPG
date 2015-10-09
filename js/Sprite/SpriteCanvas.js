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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Canvas, an renderer using canvas.getContext("2d")
   * @class
   */
  Sprite.assign("Canvas", (function () {
    _createClass(SpriteCanvas, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support HTML5 canvas
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        if (context) {
          return true;
        }
        return false;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */
    }]);

    function SpriteCanvas(width, height) {
      _classCallCheck(this, SpriteCanvas);

      var privates = internal(this);
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;
      var context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("Sprite.Canvas 2d inited");

      /**
       * Color after clear canvas
       */
      privates.color = "#000000";
      /**
       * The canvas object
       */
      privates.canvas = canvas;
      /**
       * Context of canvas
       */
      privates.context = context;
      /**
       * Global alpha
       */
      privates.alpha = 1;
      /**
       * Save some filter paramters, eg. brightness/contrast
       */
      privates.filter = new Map();
      this.filter("brightness", 0);
      this.filter("contrast", 0);
    }

    /**
     * @param {string} name The name of filter you want get or set
     * @param {number} value Number or undefined, if undefined ,return current value
     */

    _createClass(SpriteCanvas, [{
      key: "filter",
      value: function filter(name, value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (name == "brightness") {
            value += 1;
          }
          if (name == "contrast") {
            value += 1;
          }
          if (privates.filter.get(name) != value) {
            (function () {
              privates.filter.set(name, value);
              var filter = [];
              privates.filter.forEach(function (value, key, object) {
                filter.push(key + "(" + value + ")");
              });
              filter = filter.join(" ");
              privates.canvas.style.filter = filter;
              privates.canvas.style.webkitFilter = filter;
            })();
          }
        } else {
          return privates.filter.get(name);
        }
      }

      /**
       * Draw an image on the canvas
       * arguments same as canvas.getContext("2d")
       */
    }, {
      key: "drawImage",
      value: function drawImage() {
        var privates = internal(this);
        privates.context.globalAlpha = this.alpha;
        privates.context.drawImage.apply(privates.context, arguments);
      }
    }, {
      key: "release",
      value: function release() {}
      // nothing

      /**
       * Remove everything on canvas but a single color
       */

    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.context.fillStyle = privates.color;
        privates.context.fillRect(0, 0, this.width, this.height);
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */
    }, {
      key: "color",
      get: function get() {
        return internal(this).color;
      },

      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      set: function set(value) {
        if (value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/)) {
          internal(this).color = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas invalid color value");
        }
      }

      /**
       * @return {number} The alpha, 0 to 1
       */
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).alpha;
      },

      /**
       * @param {number} value The new alpha number
       */
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid alpha number");
        }
      }

      /**
       * @return {number} Width of canvas
       */
    }, {
      key: "width",
      get: function get() {
        return internal(this).canvas.width;
      },

      /**
       * @param {number} value New width
       */
      set: function set(value) {
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          internal(this).canvas.width = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid width number");
        }
      }

      /**
       * @return {number} Height of canvas
       */
    }, {
      key: "height",
      get: function get() {
        return internal(this).canvas.height;
      },

      /**
       * @param {number} value New height
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid height number");
        }
      }

      /**
       * @return {Object} Canvas
       */
    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Canvas.canvas cannot write");
      }
    }]);

    return SpriteCanvas;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ2FudmFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7O0FBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUTtpQkFBUSxZQUFZOzs7Ozs7O2FBTXpCLG1CQUFHO0FBQ2hCLFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsWUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFPLElBQUksQ0FBQztTQUNiO0FBQ0QsZUFBTyxLQUFLLENBQUM7T0FDZDs7Ozs7Ozs7QUFNVyxhQW5CZ0IsWUFBWSxDQW1CM0IsS0FBSyxFQUFFLE1BQU0sRUFBRTs0QkFuQkEsWUFBWTs7QUFvQnRDLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUM1QixZQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDOUIsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGNBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztPQUMxRDs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Ozs7O0FBS3ZDLGNBQVEsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDOzs7O0FBSTNCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7O0FBSXpCLGNBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7O0FBSTNCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7O0FBSW5CLGNBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM1Qjs7Ozs7OztpQkF0RDJCLFlBQVk7O2FBNERqQyxnQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDMUIsY0FBSSxJQUFJLElBQUksWUFBWSxFQUFFO0FBQ3hCLGlCQUFLLElBQUksQ0FBQyxDQUFDO1dBQ1o7QUFDRCxjQUFJLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDdEIsaUJBQUssSUFBSSxDQUFDLENBQUM7V0FDWjtBQUNELGNBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFOztBQUN0QyxzQkFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLGtCQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsc0JBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUs7QUFDOUMsc0JBQU0sQ0FBQyxJQUFJLENBQUksR0FBRyxTQUFJLEtBQUssT0FBSSxDQUFDO2VBQ2pDLENBQUMsQ0FBQztBQUNILG9CQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixzQkFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN0QyxzQkFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQzs7V0FDN0M7U0FDRixNQUFNO0FBQ0wsaUJBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7T0FDRjs7Ozs7Ozs7YUFLUyxxQkFBRztBQUNYLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQyxnQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7T0FDL0Q7OzthQUVPLG1CQUFHLEVBRVY7Ozs7OztBQUFBOzs7YUFLSyxpQkFBRztBQUNQLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1QyxnQkFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMxRDs7Ozs7OztXQUtTLGVBQUc7QUFDWCxlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7T0FDN0I7Ozs7O1dBSVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLHVFQUF1RSxDQUFDLEVBQUU7QUFDeEYsa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQzlCLE1BQU07QUFDTCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0IsZ0JBQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUN0RDtPQUNGOzs7Ozs7O1dBS1MsZUFBRztBQUNYLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztPQUM3Qjs7Ozs7V0FJUyxhQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQ3hCLEtBQUssSUFBSSxDQUFDLElBQ1YsS0FBSyxJQUFJLENBQUMsRUFDVjtBQUNBLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUM5QixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDM0Q7T0FDRjs7Ozs7OztXQUtTLGVBQUc7QUFDWCxlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO09BQ3BDOzs7OztXQUlTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFDeEIsS0FBSyxHQUFHLENBQUMsSUFDVCxLQUFLLEdBQUcsS0FBSyxFQUNiO0FBQ0Esa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNyQyxNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDM0Q7T0FDRjs7Ozs7OztXQUtVLGVBQUc7QUFDWixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO09BQ3JDOzs7OztXQUlVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQ3hCLEtBQUssR0FBRyxDQUFDLElBQ1QsS0FBSyxHQUFHLEtBQUssRUFDYjtBQUNBLGNBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ25DLG9CQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7V0FDaEM7U0FDRixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDNUQ7T0FDRjs7Ozs7OztXQUlVLGVBQUc7QUFDWixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7T0FDOUI7V0FFVSxhQUFDLEtBQUssRUFBRTtBQUNqQixjQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7T0FDdEQ7OztXQXRNMkIsWUFBWTtPQXdNeEMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUNhbnZhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDbGFzcyBTcHJpdGUuRGlzcGxheVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAqIENsYXNzIFNwcml0ZS5DYW52YXMsIGFuIHJlbmRlcmVyIHVzaW5nIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICogQGNsYXNzXG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiQ2FudmFzXCIsIGNsYXNzIFNwcml0ZUNhbnZhcyB7XG5cbiAgICAvKipcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVGhlIGJyb3dzZXIgd2hldGhlciBvciBub3Qgc3VwcG9ydCBIVE1MNSBjYW52YXNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3VwcG9ydCAoKSB7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIHJlbmRlcmVyIHdpZHRoIGNlcnRhaW4gd2lkdGggYW5kIGhlaWdodFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY2FudmFzLndpZHRoID0gd2lkdGggfHwgNjQwO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCB8fCA0ODA7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ2FudmFzIGNhbnZhcyBpcyBub3Qgc3VwcG9ydGVkXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcIlNwcml0ZS5DYW52YXMgMmQgaW5pdGVkXCIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIENvbG9yIGFmdGVyIGNsZWFyIGNhbnZhc1xuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jb2xvciA9IFwiIzAwMDAwMFwiO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2FudmFzIG9iamVjdFxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAvKipcbiAgICAgICAqIENvbnRleHQgb2YgY2FudmFzXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgLyoqXG4gICAgICAgKiBHbG9iYWwgYWxwaGFcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYWxwaGEgPSAxO1xuICAgICAgLyoqXG4gICAgICAgKiBTYXZlIHNvbWUgZmlsdGVyIHBhcmFtdGVycywgZWcuIGJyaWdodG5lc3MvY29udHJhc3RcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuZmlsdGVyID0gbmV3IE1hcCgpO1xuICAgICAgdGhpcy5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIDApO1xuICAgICAgdGhpcy5maWx0ZXIoXCJjb250cmFzdFwiLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBmaWx0ZXIgeW91IHdhbnQgZ2V0IG9yIHNldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOdW1iZXIgb3IgdW5kZWZpbmVkLCBpZiB1bmRlZmluZWQgLHJldHVybiBjdXJyZW50IHZhbHVlXG4gICAgICovXG4gICAgZmlsdGVyIChuYW1lLCB2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICBpZiAobmFtZSA9PSBcImJyaWdodG5lc3NcIikge1xuICAgICAgICAgIHZhbHVlICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJjb250cmFzdFwiKSB7XG4gICAgICAgICAgdmFsdWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJpdmF0ZXMuZmlsdGVyLmdldChuYW1lKSAhPSB2YWx1ZSkge1xuICAgICAgICAgIHByaXZhdGVzLmZpbHRlci5zZXQobmFtZSwgdmFsdWUpO1xuICAgICAgICAgIGxldCBmaWx0ZXIgPSBbXTtcbiAgICAgICAgICBwcml2YXRlcy5maWx0ZXIuZm9yRWFjaCgodmFsdWUsIGtleSwgb2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXIucHVzaChgJHtrZXl9KCR7dmFsdWV9KWApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5qb2luKFwiIFwiKTtcbiAgICAgICAgICBwcml2YXRlcy5jYW52YXMuc3R5bGUuZmlsdGVyID0gZmlsdGVyO1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5zdHlsZS53ZWJraXRGaWx0ZXIgPSBmaWx0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy5maWx0ZXIuZ2V0KG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEcmF3IGFuIGltYWdlIG9uIHRoZSBjYW52YXNcbiAgICAgKiBhcmd1bWVudHMgc2FtZSBhcyBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICovXG4gICAgZHJhd0ltYWdlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICBwcml2YXRlcy5jb250ZXh0LmRyYXdJbWFnZS5hcHBseShwcml2YXRlcy5jb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJlbGVhc2UgKCkge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBldmVyeXRoaW5nIG9uIGNhbnZhcyBidXQgYSBzaW5nbGUgY29sb3JcbiAgICAgKi9cbiAgICBjbGVhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNvbnRleHQuZmlsbFN0eWxlID0gcHJpdmF0ZXMuY29sb3I7XG4gICAgICBwcml2YXRlcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBjb2xvciwgZWcgXCIjMDBmZjAwXCJcbiAgICAgKi9cbiAgICBnZXQgY29sb3IgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNvbG9yO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyBjb2xvciwgZWcgXCIjMDBmZjAwXCJcbiAgICAgKi9cbiAgICBzZXQgY29sb3IgKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUubWF0Y2goL14jKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pJC8pKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmNvbG9yID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBpbnZhbGlkIGNvbG9yIHZhbHVlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFscGhhLCAwIHRvIDFcbiAgICAgKi9cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmFscGhhO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIG5ldyBhbHBoYSBudW1iZXJcbiAgICAgKi9cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+PSAwICYmXG4gICAgICAgIHZhbHVlIDw9IDFcbiAgICAgICkge1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgYWxwaGEgbnVtYmVyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gV2lkdGggb2YgY2FudmFzXG4gICAgICovXG4gICAgZ2V0IHdpZHRoICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYW52YXMud2lkdGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOZXcgd2lkdGhcbiAgICAgKi9cbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+IDAgJiZcbiAgICAgICAgdmFsdWUgPCAxMDAwMFxuICAgICAgKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmNhbnZhcy53aWR0aCA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgd2lkdGggbnVtYmVyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gSGVpZ2h0IG9mIGNhbnZhc1xuICAgICAqL1xuICAgIGdldCBoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhbnZhcy5oZWlnaHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOZXcgaGVpZ2h0XG4gICAgICovXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiZcbiAgICAgICAgdmFsdWUgPiAwICYmXG4gICAgICAgIHZhbHVlIDwgMTAwMDBcbiAgICAgICkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuY2FudmFzLmhlaWdodCkge1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgaGVpZ2h0IG51bWJlclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDYW52YXNcbiAgICAgKi9cbiAgICBnZXQgY2FudmFzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhbnZhcyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMuY2FudmFzIGNhbm5vdCB3cml0ZVwiKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
