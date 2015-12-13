"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      }
      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      ,
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
      }
      /**
       * @param {number} value The new alpha number
       */
      ,
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
      }
      /**
       * @param {number} value New width
       */
      ,
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
      }
      /**
       * @param {number} value New height
       */
      ,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ2FudmFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7OztBQUFDLEFBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUTtpQkFBUSxZQUFZOzs7Ozs7O2dDQU10QjtBQUNoQixZQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBSSxPQUFPLEVBQUU7QUFDWCxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7Ozs7Ozs7OztBQU1ELGFBbkI0QixZQUFZLENBbUIzQixLQUFLLEVBQUUsTUFBTSxFQUFFOzRCQW5CQSxZQUFZOztBQW9CdEMsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFVBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsWUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksR0FBRyxDQUFDO0FBQzVCLFlBQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUM5QixVQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QyxVQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osY0FBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO09BQzFEOztBQUVELGFBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7Ozs7O0FBQUMsQUFLdkMsY0FBUSxDQUFDLEtBQUssR0FB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QUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUN4QixLQUFLLEdBQUcsQ0FBQyxJQUNULEtBQUssR0FBRyxLQUFLLEVBQ2I7QUFDQSxjQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNuQyxvQkFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1dBQ2hDO1NBQ0YsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzVEO09BQ0Y7Ozs7Ozs7MEJBSWE7QUFDWixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7T0FDOUI7d0JBRVcsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztPQUN0RDs7O1dBdE0yQixZQUFZO09Bd014QyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlQ2FudmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENsYXNzIFNwcml0ZS5EaXNwbGF5XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkNhbnZhcywgYW4gcmVuZGVyZXIgdXNpbmcgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgKiBAY2xhc3NcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJDYW52YXNcIiwgY2xhc3MgU3ByaXRlQ2FudmFzIHtcblxuICAgIC8qKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBUaGUgYnJvd3NlciB3aGV0aGVyIG9yIG5vdCBzdXBwb3J0IEhUTUw1IGNhbnZhc1xuICAgICAqL1xuICAgIHN0YXRpYyBzdXBwb3J0ICgpIHtcbiAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgcmVuZGVyZXIgd2lkdGggY2VydGFpbiB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aCB8fCA2NDA7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IDQ4MDtcbiAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgY2FudmFzIGlzIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiU3ByaXRlLkNhbnZhcyAyZCBpbml0ZWRcIik7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29sb3IgYWZ0ZXIgY2xlYXIgY2FudmFzXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNvbG9yID0gXCIjMDAwMDAwXCI7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjYW52YXMgb2JqZWN0XG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgIC8qKlxuICAgICAgICogQ29udGV4dCBvZiBjYW52YXNcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAvKipcbiAgICAgICAqIEdsb2JhbCBhbHBoYVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5hbHBoYSA9IDE7XG4gICAgICAvKipcbiAgICAgICAqIFNhdmUgc29tZSBmaWx0ZXIgcGFyYW10ZXJzLCBlZy4gYnJpZ2h0bmVzcy9jb250cmFzdFxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5maWx0ZXIgPSBuZXcgTWFwKCk7XG4gICAgICB0aGlzLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMCk7XG4gICAgICB0aGlzLmZpbHRlcihcImNvbnRyYXN0XCIsIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIGZpbHRlciB5b3Ugd2FudCBnZXQgb3Igc2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIE51bWJlciBvciB1bmRlZmluZWQsIGlmIHVuZGVmaW5lZCAscmV0dXJuIGN1cnJlbnQgdmFsdWVcbiAgICAgKi9cbiAgICBmaWx0ZXIgKG5hbWUsIHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIGlmIChuYW1lID09IFwiYnJpZ2h0bmVzc1wiKSB7XG4gICAgICAgICAgdmFsdWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcImNvbnRyYXN0XCIpIHtcbiAgICAgICAgICB2YWx1ZSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcml2YXRlcy5maWx0ZXIuZ2V0KG5hbWUpICE9IHZhbHVlKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuZmlsdGVyLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgbGV0IGZpbHRlciA9IFtdO1xuICAgICAgICAgIHByaXZhdGVzLmZpbHRlci5mb3JFYWNoKCh2YWx1ZSwga2V5LCBvYmplY3QpID0+IHtcbiAgICAgICAgICAgIGZpbHRlci5wdXNoKGAke2tleX0oJHt2YWx1ZX0pYCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZmlsdGVyID0gZmlsdGVyLmpvaW4oXCIgXCIpO1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5zdHlsZS5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgICAgICAgcHJpdmF0ZXMuY2FudmFzLnN0eWxlLndlYmtpdEZpbHRlciA9IGZpbHRlcjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzLmZpbHRlci5nZXQobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERyYXcgYW4gaW1hZ2Ugb24gdGhlIGNhbnZhc1xuICAgICAqIGFyZ3VtZW50cyBzYW1lIGFzIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgKi9cbiAgICBkcmF3SW1hZ2UgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5hbHBoYTtcbiAgICAgIHByaXZhdGVzLmNvbnRleHQuZHJhd0ltYWdlLmFwcGx5KHByaXZhdGVzLmNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICAvLyBub3RoaW5nXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGV2ZXJ5dGhpbmcgb24gY2FudmFzIGJ1dCBhIHNpbmdsZSBjb2xvclxuICAgICAqL1xuICAgIGNsZWFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuY29udGV4dC5maWxsU3R5bGUgPSBwcml2YXRlcy5jb2xvcjtcbiAgICAgIHByaXZhdGVzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGNvbG9yLCBlZyBcIiMwMGZmMDBcIlxuICAgICAqL1xuICAgIGdldCBjb2xvciAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY29sb3I7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmV3IGNvbG9yLCBlZyBcIiMwMGZmMDBcIlxuICAgICAqL1xuICAgIHNldCBjb2xvciAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZS5tYXRjaCgvXiMoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkkLykpIHtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuY29sb3IgPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQ2FudmFzIGludmFsaWQgY29sb3IgdmFsdWVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgYWxwaGEsIDAgdG8gMVxuICAgICAqL1xuICAgIGdldCBhbHBoYSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYWxwaGE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBUaGUgbmV3IGFscGhhIG51bWJlclxuICAgICAqL1xuICAgIHNldCBhbHBoYSAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmXG4gICAgICAgIHZhbHVlID49IDAgJiZcbiAgICAgICAgdmFsdWUgPD0gMVxuICAgICAgKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmFscGhhID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBnb3QgaW52YWxpZCBhbHBoYSBudW1iZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBXaWR0aCBvZiBjYW52YXNcbiAgICAgKi9cbiAgICBnZXQgd2lkdGggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhbnZhcy53aWR0aDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIE5ldyB3aWR0aFxuICAgICAqL1xuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmXG4gICAgICAgIHZhbHVlID4gMCAmJlxuICAgICAgICB2YWx1ZSA8IDEwMDAwXG4gICAgICApIHtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuY2FudmFzLndpZHRoID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBnb3QgaW52YWxpZCB3aWR0aCBudW1iZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBIZWlnaHQgb2YgY2FudmFzXG4gICAgICovXG4gICAgZ2V0IGhlaWdodCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FudmFzLmhlaWdodDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIE5ldyBoZWlnaHRcbiAgICAgKi9cbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+IDAgJiZcbiAgICAgICAgdmFsdWUgPCAxMDAwMFxuICAgICAgKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5jYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY2FudmFzLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBnb3QgaW52YWxpZCBoZWlnaHQgbnVtYmVyXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IENhbnZhc1xuICAgICAqL1xuICAgIGdldCBjYW52YXMgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhbnZhcztcbiAgICB9XG5cbiAgICBzZXQgY2FudmFzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcy5jYW52YXMgY2Fubm90IHdyaXRlXCIpO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19
