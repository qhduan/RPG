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
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var SpriteCore = (function () {
    function SpriteCore() {
      _classCallCheck(this, SpriteCore);
    }

    _createClass(SpriteCore, [{
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });
        return this;
      }
    }]);

    return SpriteCore;
  })();

  ;

  var Sprite = window.Sprite = new SpriteCore();

  /**
   * Function Sprite.Namespace, return an unique Private-Properties function
   * for javascript private properties need, for es6
   */
  Sprite.assign("Namespace", function () {
    /**
     * Using closure variable store private properties
     * and different file have different "privateProperties"
     */
    var privates = new WeakMap();
    return function (object) {
      if (privates.has(object) == false) {
        privates.set(object, {});
      }
      return privates.get(object);
    };
  });

  /**
   * @param {number} N The min number
   * @param {number} M The max number
   * @return {number} A random integer N <= return < M, aka. [N, M)
   */
  Sprite.assign("rand", function (N, M) {
    var r = M - N;
    r *= Math.random();
    return N + Math.floor(r);
  });

  /**
   * @param {Object} object The object we require copy
   * @return {Object} A deep copy of object
   */
  Sprite.assign("copy", function (object) {
    return JSON.parse(JSON.stringify(object));
  });

  Sprite.assign("each", function (obj, functional) {
    if (obj.forEach) {
      obj.forEach(functional);
    } else {
      for (var key in obj) {
        functional(obj[key], key, obj);
      }
    }
  });

  Sprite.assign("uuid", function () {
    // generate a UUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, function (c) {
      var r = Math.floor(Math.random() * 16);
      if (c == "x") {
        return r.toString(16);
      } else {
        return (r & 0x03 | 0x08).toString(16);
      }
    });
  });

  Sprite.assign("btoa", function (str) {
    // convert str to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  });

  Sprite.assign("atob", function (str) {
    // convert base64 str to original
    return decodeURIComponent(escape(window.atob(str)));
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztNQUVQLFVBQVU7YUFBVixVQUFVOzRCQUFWLFVBQVU7OztpQkFBVixVQUFVOzthQUNQLGdCQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDcEIsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLG9CQUFVLEVBQUUsS0FBSztBQUNqQixzQkFBWSxFQUFFLEtBQUs7QUFDbkIsa0JBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBSyxFQUFFLE1BQU07U0FDZCxDQUFDLENBQUM7QUFDSCxlQUFPLElBQUksQ0FBQztPQUNiOzs7V0FURyxVQUFVOzs7QUFVZixHQUFDOztBQUVGLE1BQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQzs7Ozs7O0FBTTlDLFFBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFlBQVk7Ozs7O0FBS3JDLFFBQUksUUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDN0IsV0FBTyxVQUFVLE1BQU0sRUFBRTtBQUN2QixVQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ2pDLGdCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztPQUMxQjtBQUNELGFBQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3QixDQUFDO0dBQ0gsQ0FBQyxDQUFDOzs7Ozs7O0FBT0gsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BDLFFBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxLQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLFdBQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDMUIsQ0FBQyxDQUFDOzs7Ozs7QUFNSCxRQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUN0QyxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQzNDLENBQUMsQ0FBQzs7QUFFSCxRQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDL0MsUUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO0FBQ2YsU0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN6QixNQUFNO0FBQ0wsV0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDbkIsa0JBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ2hDO0tBQ0Y7R0FDRixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsWUFBWTs7QUFFaEMsV0FBTyxzQ0FBc0MsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQ3pFLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUNaLGVBQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUN2QixNQUFNO0FBQ0wsZUFBTyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLENBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQ3ZDO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxFQUFFOztBQUVuQyxXQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN2RCxDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFHLEVBQUU7O0FBRW5DLFdBQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3JELENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEZWZpbmUgdGhlIFNwcml0ZSBpbiB3aW5kb3csIGRlY2xhcmUgdGhlIFNwcml0ZS5CYXNlXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjbGFzcyBTcHJpdGVDb3JlIHtcbiAgICBhc3NpZ24gKG5hbWUsIG9iamVjdCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG9iamVjdFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgbGV0IFNwcml0ZSA9IHdpbmRvdy5TcHJpdGUgPSBuZXcgU3ByaXRlQ29yZSgpO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiBTcHJpdGUuTmFtZXNwYWNlLCByZXR1cm4gYW4gdW5pcXVlIFByaXZhdGUtUHJvcGVydGllcyBmdW5jdGlvblxuICAgKiBmb3IgamF2YXNjcmlwdCBwcml2YXRlIHByb3BlcnRpZXMgbmVlZCwgZm9yIGVzNlxuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIk5hbWVzcGFjZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogVXNpbmcgY2xvc3VyZSB2YXJpYWJsZSBzdG9yZSBwcml2YXRlIHByb3BlcnRpZXNcbiAgICAgKiBhbmQgZGlmZmVyZW50IGZpbGUgaGF2ZSBkaWZmZXJlbnQgXCJwcml2YXRlUHJvcGVydGllc1wiXG4gICAgICovXG4gICAgbGV0IHByaXZhdGVzID0gbmV3IFdlYWtNYXAoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgaWYgKHByaXZhdGVzLmhhcyhvYmplY3QpID09IGZhbHNlKSB7XG4gICAgICAgIHByaXZhdGVzLnNldChvYmplY3QsIHt9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcml2YXRlcy5nZXQob2JqZWN0KTtcbiAgICB9O1xuICB9KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IE4gVGhlIG1pbiBudW1iZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9IE0gVGhlIG1heCBudW1iZXJcbiAgICogQHJldHVybiB7bnVtYmVyfSBBIHJhbmRvbSBpbnRlZ2VyIE4gPD0gcmV0dXJuIDwgTSwgYWthLiBbTiwgTSlcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJyYW5kXCIsIGZ1bmN0aW9uIChOLCBNKSB7XG4gICAgbGV0IHIgPSBNIC0gTjtcbiAgICByICo9IE1hdGgucmFuZG9tKCk7XG4gICAgcmV0dXJuIE4gKyBNYXRoLmZsb29yKHIpO1xuICB9KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHdlIHJlcXVpcmUgY29weVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgZGVlcCBjb3B5IG9mIG9iamVjdFxuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcImNvcHlcIiwgZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iamVjdCkpO1xuICB9KTtcblxuICBTcHJpdGUuYXNzaWduKFwiZWFjaFwiLCBmdW5jdGlvbiAob2JqLCBmdW5jdGlvbmFsKSB7XG4gICAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChmdW5jdGlvbmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBmdW5jdGlvbmFsKG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBTcHJpdGUuYXNzaWduKFwidXVpZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZ2VuZXJhdGUgYSBVVUlEXG4gICAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgveHx5L2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICBsZXQgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2KTtcbiAgICAgIGlmIChjID09IFwieFwiKSB7XG4gICAgICAgIHJldHVybiByLnRvU3RyaW5nKDE2KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAociAmIDB4MDMgfCAweDA4KS50b1N0cmluZygxNik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIFNwcml0ZS5hc3NpZ24oXCJidG9hXCIsIGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyBjb252ZXJ0IHN0ciB0byBiYXNlNjRcbiAgICByZXR1cm4gd2luZG93LmJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpKTtcbiAgfSk7XG5cbiAgU3ByaXRlLmFzc2lnbihcImF0b2JcIiwgZnVuY3Rpb24gKHN0cikge1xuICAgIC8vIGNvbnZlcnQgYmFzZTY0IHN0ciB0byBvcmlnaW5hbFxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKHdpbmRvdy5hdG9iKHN0cikpKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

      console.log("canvas inited");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQ2FudmFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7O0FBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUTtpQkFBUSxZQUFZOzs7Ozs7O2FBTXpCLG1CQUFHO0FBQ2hCLFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsWUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFPLElBQUksQ0FBQztTQUNiO0FBQ0QsZUFBTyxLQUFLLENBQUM7T0FDZDs7Ozs7Ozs7QUFNVyxhQW5CZ0IsWUFBWSxDQW1CM0IsS0FBSyxFQUFFLE1BQU0sRUFBRTs0QkFuQkEsWUFBWTs7QUFvQnRDLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUM1QixZQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDOUIsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGNBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztPQUMxRDs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7OztBQUs3QixjQUFRLENBQUMsS0FBSyxH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QVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsWUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUN4QixLQUFLLEdBQUcsQ0FBQyxJQUNULEtBQUssR0FBRyxLQUFLLEVBQ2I7QUFDQSxjQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNuQyxvQkFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1dBQ2hDO1NBQ0YsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzVEO09BQ0Y7Ozs7Ozs7V0FJVSxlQUFHO0FBQ1osZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO09BQzlCO1dBRVUsYUFBQyxLQUFLLEVBQUU7QUFDakIsY0FBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO09BQ3REOzs7V0F0TTJCLFlBQVk7T0F3TXhDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVDYW52YXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkRpc3BsYXlcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuQ2FudmFzLCBhbiByZW5kZXJlciB1c2luZyBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkNhbnZhc1wiLCBjbGFzcyBTcHJpdGVDYW52YXMge1xuXG4gICAgLyoqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRoZSBicm93c2VyIHdoZXRoZXIgb3Igbm90IHN1cHBvcnQgSFRNTDUgY2FudmFzXG4gICAgICovXG4gICAgc3RhdGljIHN1cHBvcnQgKCkge1xuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSByZW5kZXJlciB3aWR0aCBjZXJ0YWluIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAod2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoIHx8IDY0MDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQgfHwgNDgwO1xuICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBjYW52YXMgaXMgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coXCJjYW52YXMgaW5pdGVkXCIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIENvbG9yIGFmdGVyIGNsZWFyIGNhbnZhc1xuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jb2xvciA9IFwiIzAwMDAwMFwiO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2FudmFzIG9iamVjdFxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAvKipcbiAgICAgICAqIENvbnRleHQgb2YgY2FudmFzXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgLyoqXG4gICAgICAgKiBHbG9iYWwgYWxwaGFcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYWxwaGEgPSAxO1xuICAgICAgLyoqXG4gICAgICAgKiBTYXZlIHNvbWUgZmlsdGVyIHBhcmFtdGVycywgZWcuIGJyaWdodG5lc3MvY29udHJhc3RcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuZmlsdGVyID0gbmV3IE1hcCgpO1xuICAgICAgdGhpcy5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIDApO1xuICAgICAgdGhpcy5maWx0ZXIoXCJjb250cmFzdFwiLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBmaWx0ZXIgeW91IHdhbnQgZ2V0IG9yIHNldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOdW1iZXIgb3IgdW5kZWZpbmVkLCBpZiB1bmRlZmluZWQgLHJldHVybiBjdXJyZW50IHZhbHVlXG4gICAgICovXG4gICAgZmlsdGVyIChuYW1lLCB2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICBpZiAobmFtZSA9PSBcImJyaWdodG5lc3NcIikge1xuICAgICAgICAgIHZhbHVlICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJjb250cmFzdFwiKSB7XG4gICAgICAgICAgdmFsdWUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJpdmF0ZXMuZmlsdGVyLmdldChuYW1lKSAhPSB2YWx1ZSkge1xuICAgICAgICAgIHByaXZhdGVzLmZpbHRlci5zZXQobmFtZSwgdmFsdWUpO1xuICAgICAgICAgIGxldCBmaWx0ZXIgPSBbXTtcbiAgICAgICAgICBwcml2YXRlcy5maWx0ZXIuZm9yRWFjaCgodmFsdWUsIGtleSwgb2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXIucHVzaChgJHtrZXl9KCR7dmFsdWV9KWApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5qb2luKFwiIFwiKTtcbiAgICAgICAgICBwcml2YXRlcy5jYW52YXMuc3R5bGUuZmlsdGVyID0gZmlsdGVyO1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5zdHlsZS53ZWJraXRGaWx0ZXIgPSBmaWx0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy5maWx0ZXIuZ2V0KG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEcmF3IGFuIGltYWdlIG9uIHRoZSBjYW52YXNcbiAgICAgKiBhcmd1bWVudHMgc2FtZSBhcyBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICovXG4gICAgZHJhd0ltYWdlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICBwcml2YXRlcy5jb250ZXh0LmRyYXdJbWFnZS5hcHBseShwcml2YXRlcy5jb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJlbGVhc2UgKCkge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBldmVyeXRoaW5nIG9uIGNhbnZhcyBidXQgYSBzaW5nbGUgY29sb3JcbiAgICAgKi9cbiAgICBjbGVhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNvbnRleHQuZmlsbFN0eWxlID0gcHJpdmF0ZXMuY29sb3I7XG4gICAgICBwcml2YXRlcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBjb2xvciwgZWcgXCIjMDBmZjAwXCJcbiAgICAgKi9cbiAgICBnZXQgY29sb3IgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNvbG9yO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyBjb2xvciwgZWcgXCIjMDBmZjAwXCJcbiAgICAgKi9cbiAgICBzZXQgY29sb3IgKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUubWF0Y2goL14jKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pKFtcXGRhLWZBLUZdW1xcZGEtZkEtRl0pJC8pKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmNvbG9yID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkNhbnZhcyBpbnZhbGlkIGNvbG9yIHZhbHVlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFscGhhLCAwIHRvIDFcbiAgICAgKi9cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmFscGhhO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIG5ldyBhbHBoYSBudW1iZXJcbiAgICAgKi9cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+PSAwICYmXG4gICAgICAgIHZhbHVlIDw9IDFcbiAgICAgICkge1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgYWxwaGEgbnVtYmVyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gV2lkdGggb2YgY2FudmFzXG4gICAgICovXG4gICAgZ2V0IHdpZHRoICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYW52YXMud2lkdGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOZXcgd2lkdGhcbiAgICAgKi9cbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+IDAgJiZcbiAgICAgICAgdmFsdWUgPCAxMDAwMFxuICAgICAgKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmNhbnZhcy53aWR0aCA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgd2lkdGggbnVtYmVyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gSGVpZ2h0IG9mIGNhbnZhc1xuICAgICAqL1xuICAgIGdldCBoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNhbnZhcy5oZWlnaHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOZXcgaGVpZ2h0XG4gICAgICovXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiZcbiAgICAgICAgdmFsdWUgPiAwICYmXG4gICAgICAgIHZhbHVlIDwgMTAwMDBcbiAgICAgICkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuY2FudmFzLmhlaWdodCkge1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMgZ290IGludmFsaWQgaGVpZ2h0IG51bWJlclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDYW52YXNcbiAgICAgKi9cbiAgICBnZXQgY2FudmFzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhbnZhcyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5DYW52YXMuY2FudmFzIGNhbm5vdCB3cml0ZVwiKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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
 * @fileoverview Define the Sprite.Webgl, a renderer, other choice from Sprite.Canvas
 * @author mail@qhduan.com (QH Duan)
 */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  function isPOT(value) {
    return value > 0 && (value - 1 & value) === 0;
  }

  /**
    Use mediump precision in WebGL when possible
    Highp in fragment shaders is an optional part of the OpenGL ES 2.0 spec,
    so not all hardware supports it
    lowp mediump highp
    https://developers.google.com/web/updates/2011/12/Use-mediump-precision-in-WebGL-when-possible?hl=en
     brightness and contrast's formular from https://github.com/evanw/glfx.js
  */
  var vertexShaderSrc = "\n  precision mediump float;\n  attribute vec2 a_texCoord;\n  varying vec2 v_texCoord;\n\n  attribute vec2 aVertex;\n  uniform vec2 resolution;\n\n  uniform vec4 position;\n\n  void main(void) {\n     vec2 a = aVertex * (position.zw / resolution) + (position.xy / resolution);\n     vec2 b = a * 2.0 - 1.0;\n\n     gl_Position = vec4(b * vec2(1.0, -1.0), 0.0, 1.0);\n     v_texCoord = a_texCoord;\n  }";

  var fragmentShaderSrc = "\n  precision mediump float;\n\n  uniform vec4 crop;\n  uniform float brightness;\n  uniform float alpha;\n  uniform float contrast;\n\n  uniform sampler2D image;\n\n  // the texCoords passed in from the vertex shader.\n  varying vec2 v_texCoord;\n\n  void main(void) {\n\n    vec2 t = v_texCoord;\n    t.x *= crop.z;\n    t.y *= crop.w;\n    t += crop.xy;\n\n     vec4 color = texture2D(image, t).rgba;\n\n     if (contrast != 0.0) {\n       if (contrast > 0.0) {\n         color.xyz = (color.xyz - 0.5) / (1.0 - contrast) + 0.5;\n       } else {\n         color.xyz = (color.xyz - 0.5) * (1.0 + contrast) + 0.5;\n       }\n     }\n\n     if (brightness != 0.0) {\n       color.xyz += brightness;\n     }\n\n     if (alpha != 1.0) {\n       color.a *=  alpha;\n     }\n\n     gl_FragColor = color;\n  }";

  /**
   * Renderer using webgl
   * @class
   */
  Sprite.assign("Webgl", (function () {
    _createClass(SpriteWebgl, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support WebGL
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
          canvas.getContext("experimental-webgl");
        }
        if (!gl) {
          return false;
        }
        return true;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */
    }]);

    function SpriteWebgl(width, height) {
      _classCallCheck(this, SpriteWebgl);

      var privates = internal(this);

      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      var options = {
        antialias: false,
        preserveDrawingBuffer: true
      };

      var gl = canvas.getContext("webgl", options);
      if (!gl) {
        gl = canvas.getContext("experimental-webgl", options);
      }
      privates.gl = gl;

      if (!gl) {
        throw new Error("Sprite.Webgl webgl is not supported");
      }

      privates.color = [0, 0, 0];
      privates.filter = new Map();
      privates.textureCache = new Map();
      privates.canvas = canvas;
      privates.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      gl.viewport(0, 0, canvas.width, canvas.height);

      var vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
      var fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertShaderObj, vertexShaderSrc);
      gl.shaderSource(fragShaderObj, fragmentShaderSrc);
      gl.compileShader(vertShaderObj);
      gl.compileShader(fragShaderObj);

      var program = gl.createProgram();
      gl.attachShader(program, vertShaderObj);
      gl.attachShader(program, fragShaderObj);

      gl.linkProgram(program);
      gl.useProgram(program);

      gl.cullFace(gl.BACK);
      gl.frontFace(gl.CW);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      privates.cropLoc = gl.getUniformLocation(program, "crop");
      privates.brightnessLoc = gl.getUniformLocation(program, "brightness");
      privates.contrastLoc = gl.getUniformLocation(program, "contrast");
      privates.alphaLoc = gl.getUniformLocation(program, "alpha");
      privates.resolutionLoc = gl.getUniformLocation(program, "resolution");
      gl.uniform2f(privates.resolutionLoc, canvas.width, canvas.height);

      privates.positionLoc = gl.getUniformLocation(program, "position");

      privates.tLoc = gl.getAttribLocation(program, "a_texCoord");
      gl.enableVertexAttribArray(privates.tLoc);
      privates.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.texCoordBuffer);
      gl.vertexAttribPointer(privates.tLoc, 2, gl.FLOAT, false, 0, 0);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);

      privates.vLoc = gl.getAttribLocation(program, "aVertex");
      gl.enableVertexAttribArray(privates.vLoc);
      privates.vertexBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.vertexBuff);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(privates.vLoc);
      gl.vertexAttribPointer(privates.vLoc, 2, gl.FLOAT, false, 0, 0);

      privates.currentTexture = null;

      // setting, don't move
      this.filter("brightness", 0);
      this.filter("contrast", 0);
      this.alpha = 1;

      console.log("webgl inited. max texture size: %d", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    }

    _createClass(SpriteWebgl, [{
      key: "drawImage9",
      value: function drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var privates = internal(this);
        var gl = privates.gl;

        var texture = this.createTexture(gl, image);
        if (privates.currentTexture != texture) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          privates.currentTexture = texture;
        }

        gl.uniform4f(privates.cropLoc, sx / image.width, sy / image.height, sw / image.width, sh / image.height);
        gl.uniform4f(privates.positionLoc, dx, dy, dw, dh);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      }
    }, {
      key: "release",
      value: function release() {
        var privates = internal(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.textureCache.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var texture = _step.value;

            privates.gl.deleteTexture(texture);
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

        privates.textureCache = new Map();
      }
    }, {
      key: "createTexture",
      value: function createTexture(gl, image) {
        var privates = internal(this);
        if (privates.textureCache.has(image)) {
          return privates.textureCache.get(image);
        } else {
          gl.activeTexture(gl.TEXTURE0);
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

          // test width&height is power of 2, eg. 256, 512, 1024
          // may speed up
          if (isPOT(image.width) && isPOT(image.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          }

          gl.bindTexture(gl.TEXTURE_2D, null);
          privates.textureCache.set(image, texture);
          return texture;
        }
      }
    }, {
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (arguments.length == 9) {
          // all right
        } else if (arguments.length == 5) {
            // drawImage (image, dx, dy, dw, dh);
            dx = sx;
            dy = sy;
            dw = sw;
            dh = sh;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
          } else if (arguments.length == 3) {
            // drawImage (image, dx, dy);
            dx = sx;
            dy = sy;
            dw = image.width;
            dh = image.height;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
          } else {
            console.error(arguments, this);
            throw new Error("Sprite.Webgl.drawImage invalid arguments");
          }

        /*
        if (dx > this.width || dy > this.height) {
          return;
        }
         if ((dx + dw) < 0 || (dy + dh) < 0) {
          return;
        }
         if (
          !Number.isInteger(image.width) ||
          !Number.isInteger(image.height) ||
          image.width <= 0 ||
          image.height <= 0 ||
          image.width > privates.maxTextureSize ||
          image.height > privates.maxTextureSize
        ) {
          console.error(image, privates, this);
          throw new Error("Sprite.Webgl.drawImage invalid image");
        }
        */

        this.drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }, {
      key: "filter",

      /**
       * @param {string} name The name of filter you want get or set
       * @param {number} value Number or undefined, if undefined ,return current value
       */
      value: function filter(name, value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value)) {
          privates.filter.set(name, value);
          gl.uniform1f(privates.brightnessLoc, privates.filter.get("brightness"));
          gl.uniform1f(privates.contrastLoc, privates.filter.get("contrast"));
        } else {
          return privates.get(name);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var gl = privates.gl;
        var color = privates.color;
        gl.clearColor(color[0], color[1], color[2], 1); // black
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }, {
      key: "alpha",
      get: function get() {
        var privates = internal(this);
        return privates.alpha;
      },
      set: function set(value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value) && !isNaN(value) && value >= 0 && value <= 1) {
          if (value != privates.alpha) {
            privates.alpha = value;
            gl.uniform1f(privates.alphaLoc, privates.alpha);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid alpha number");
        }
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        var color = privates.color;
        var r = color[0].toString(16);
        var g = color[1].toString(16);
        var b = color[2].toString(16);
        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;
        return "#" + r + g + b;
      },

      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      set: function set(value) {
        var privates = internal(this);
        var m = value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/);
        if (m) {
          var r = m[1];
          var g = m[2];
          var b = m[3];
          privates.color[0] = parseInt(r, 16);
          privates.color[1] = parseInt(g, 16);
          privates.color[2] = parseInt(b, 16);
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl.color invalid color format");
        }
      }
    }, {
      key: "width",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.width;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.width) {
            privates.canvas.width = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(privates.resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid width number");
        }
      }
    }, {
      key: "height",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.height;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid height number");
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        console.error(value, this);
        throw new Error("Sprite.Webgl.canvas cannot write");
      }
    }]);

    return SpriteWebgl;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlV2ViZ2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBR2xDLFdBQVMsS0FBSyxDQUFFLEtBQUssRUFBRTtBQUNyQixXQUFPLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxBQUFDLEtBQUssR0FBRyxDQUFDLEdBQUksS0FBSyxDQUFBLEtBQU0sQ0FBQyxDQUFDO0dBQ2pEOzs7Ozs7Ozs7O0FBV0QsTUFBSSxlQUFlLHNaQWdCakIsQ0FBQzs7QUFFSCxNQUFJLGlCQUFpQix3eUJBdUNuQixDQUFDOzs7Ozs7QUFNSCxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87aUJBQVEsV0FBVzs7Ozs7OzthQU12QixtQkFBRztBQUNoQixZQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNQLGdCQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDekM7QUFDRCxZQUFJLENBQUMsRUFBRSxFQUFFO0FBQ1AsaUJBQU8sS0FBSyxDQUFDO1NBQ2Q7QUFDRCxlQUFPLElBQUksQ0FBQztPQUNiOzs7Ozs7OztBQU1XLGFBdEJlLFdBQVcsQ0FzQnpCLEtBQUssRUFBRSxNQUFNLEVBQUU7NEJBdEJELFdBQVc7O0FBdUJwQyxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsWUFBTSxDQUFDLEtBQUss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QUFDLE1BQU0sQ0FBQyxDQUFDO1dBQ3JGO1NBQ0YsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQzNEO09BQ0Y7OztXQUVVLGVBQUc7QUFDWixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7T0FDOUI7V0FFVSxhQUFDLEtBQUssRUFBRTtBQUNqQixlQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixjQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7T0FDckQ7OztXQW5YMEIsV0FBVztPQXFYdEMsQ0FBQztDQUlKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVdlYmdsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERlZmluZSB0aGUgU3ByaXRlLldlYmdsLCBhIHJlbmRlcmVyLCBvdGhlciBjaG9pY2UgZnJvbSBTcHJpdGUuQ2FudmFzXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cblxuICBmdW5jdGlvbiBpc1BPVCAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPiAwICYmICgodmFsdWUgLSAxKSAmIHZhbHVlKSA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgIFVzZSBtZWRpdW1wIHByZWNpc2lvbiBpbiBXZWJHTCB3aGVuIHBvc3NpYmxlXG4gICAgSGlnaHAgaW4gZnJhZ21lbnQgc2hhZGVycyBpcyBhbiBvcHRpb25hbCBwYXJ0IG9mIHRoZSBPcGVuR0wgRVMgMi4wIHNwZWMsXG4gICAgc28gbm90IGFsbCBoYXJkd2FyZSBzdXBwb3J0cyBpdFxuICAgIGxvd3AgbWVkaXVtcCBoaWdocFxuICAgIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi91cGRhdGVzLzIwMTEvMTIvVXNlLW1lZGl1bXAtcHJlY2lzaW9uLWluLVdlYkdMLXdoZW4tcG9zc2libGU/aGw9ZW5cblxuICAgIGJyaWdodG5lc3MgYW5kIGNvbnRyYXN0J3MgZm9ybXVsYXIgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXZhbncvZ2xmeC5qc1xuICAqL1xuICBsZXQgdmVydGV4U2hhZGVyU3JjID0gYFxuICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcbiAgdmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XG5cbiAgYXR0cmlidXRlIHZlYzIgYVZlcnRleDtcbiAgdW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XG5cbiAgdW5pZm9ybSB2ZWM0IHBvc2l0aW9uO1xuXG4gIHZvaWQgbWFpbih2b2lkKSB7XG4gICAgIHZlYzIgYSA9IGFWZXJ0ZXggKiAocG9zaXRpb24uencgLyByZXNvbHV0aW9uKSArIChwb3NpdGlvbi54eSAvIHJlc29sdXRpb24pO1xuICAgICB2ZWMyIGIgPSBhICogMi4wIC0gMS4wO1xuXG4gICAgIGdsX1Bvc2l0aW9uID0gdmVjNChiICogdmVjMigxLjAsIC0xLjApLCAwLjAsIDEuMCk7XG4gICAgIHZfdGV4Q29vcmQgPSBhX3RleENvb3JkO1xuICB9YDtcblxuICBsZXQgZnJhZ21lbnRTaGFkZXJTcmMgPSBgXG4gIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuXG4gIHVuaWZvcm0gdmVjNCBjcm9wO1xuICB1bmlmb3JtIGZsb2F0IGJyaWdodG5lc3M7XG4gIHVuaWZvcm0gZmxvYXQgYWxwaGE7XG4gIHVuaWZvcm0gZmxvYXQgY29udHJhc3Q7XG5cbiAgdW5pZm9ybSBzYW1wbGVyMkQgaW1hZ2U7XG5cbiAgLy8gdGhlIHRleENvb3JkcyBwYXNzZWQgaW4gZnJvbSB0aGUgdmVydGV4IHNoYWRlci5cbiAgdmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XG5cbiAgdm9pZCBtYWluKHZvaWQpIHtcblxuICAgIHZlYzIgdCA9IHZfdGV4Q29vcmQ7XG4gICAgdC54ICo9IGNyb3AuejtcbiAgICB0LnkgKj0gY3JvcC53O1xuICAgIHQgKz0gY3JvcC54eTtcblxuICAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKGltYWdlLCB0KS5yZ2JhO1xuXG4gICAgIGlmIChjb250cmFzdCAhPSAwLjApIHtcbiAgICAgICBpZiAoY29udHJhc3QgPiAwLjApIHtcbiAgICAgICAgIGNvbG9yLnh5eiA9IChjb2xvci54eXogLSAwLjUpIC8gKDEuMCAtIGNvbnRyYXN0KSArIDAuNTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgY29sb3IueHl6ID0gKGNvbG9yLnh5eiAtIDAuNSkgKiAoMS4wICsgY29udHJhc3QpICsgMC41O1xuICAgICAgIH1cbiAgICAgfVxuXG4gICAgIGlmIChicmlnaHRuZXNzICE9IDAuMCkge1xuICAgICAgIGNvbG9yLnh5eiArPSBicmlnaHRuZXNzO1xuICAgICB9XG5cbiAgICAgaWYgKGFscGhhICE9IDEuMCkge1xuICAgICAgIGNvbG9yLmEgKj0gIGFscGhhO1xuICAgICB9XG5cbiAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XG4gIH1gO1xuXG4gIC8qKlxuICAgKiBSZW5kZXJlciB1c2luZyB3ZWJnbFxuICAgKiBAY2xhc3NcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJXZWJnbFwiLCBjbGFzcyBTcHJpdGVXZWJnbCB7XG5cbiAgICAvKipcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVGhlIGJyb3dzZXIgd2hldGhlciBvciBub3Qgc3VwcG9ydCBXZWJHTFxuICAgICAqL1xuICAgIHN0YXRpYyBzdXBwb3J0ICgpIHtcbiAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcbiAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWdsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIHJlbmRlcmVyIHdpZHRoIGNlcnRhaW4gd2lkdGggYW5kIGhlaWdodFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aCB8fCA2NDA7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IDQ4MDtcblxuICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiLCBvcHRpb25zKTtcbiAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHByaXZhdGVzLmdsID0gZ2w7XG5cbiAgICAgIGlmICghZ2wpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsIHdlYmdsIGlzIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgICB9XG5cbiAgICAgIHByaXZhdGVzLmNvbG9yID0gWzAsIDAsIDBdO1xuICAgICAgcHJpdmF0ZXMuZmlsdGVyID0gbmV3IE1hcCgpO1xuICAgICAgcHJpdmF0ZXMudGV4dHVyZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgICAgcHJpdmF0ZXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgcHJpdmF0ZXMubWF4VGV4dHVyZVNpemUgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1RFWFRVUkVfU0laRSk7XG5cbiAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAgIGxldCB2ZXJ0U2hhZGVyT2JqID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuICAgICAgbGV0IGZyYWdTaGFkZXJPYmogPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcbiAgICAgIGdsLnNoYWRlclNvdXJjZSh2ZXJ0U2hhZGVyT2JqLCB2ZXJ0ZXhTaGFkZXJTcmMpO1xuICAgICAgZ2wuc2hhZGVyU291cmNlKGZyYWdTaGFkZXJPYmosIGZyYWdtZW50U2hhZGVyU3JjKTtcbiAgICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydFNoYWRlck9iaik7XG4gICAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdTaGFkZXJPYmopO1xuXG4gICAgICBsZXQgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0U2hhZGVyT2JqKTtcbiAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnU2hhZGVyT2JqKTtcblxuICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG4gICAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgICBnbC5jdWxsRmFjZShnbC5CQUNLKTtcbiAgICAgIGdsLmZyb250RmFjZShnbC5DVyk7XG4gICAgICBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcbiAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICAgIHByaXZhdGVzLmNyb3BMb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJjcm9wXCIpO1xuICAgICAgcHJpdmF0ZXMuYnJpZ2h0bmVzc0xvYyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcImJyaWdodG5lc3NcIik7XG4gICAgICBwcml2YXRlcy5jb250cmFzdExvYyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcImNvbnRyYXN0XCIpO1xuICAgICAgcHJpdmF0ZXMuYWxwaGFMb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJhbHBoYVwiKTtcbiAgICAgIHByaXZhdGVzLnJlc29sdXRpb25Mb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJyZXNvbHV0aW9uXCIpO1xuICAgICAgZ2wudW5pZm9ybTJmKHByaXZhdGVzLnJlc29sdXRpb25Mb2MsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAgIHByaXZhdGVzLnBvc2l0aW9uTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwicG9zaXRpb25cIik7XG5cblxuICAgICAgcHJpdmF0ZXMudExvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiYV90ZXhDb29yZFwiKTtcbiAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByaXZhdGVzLnRMb2MpO1xuICAgICAgcHJpdmF0ZXMudGV4Q29vcmRCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwcml2YXRlcy50ZXhDb29yZEJ1ZmZlcik7XG4gICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHByaXZhdGVzLnRMb2MsIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgbmV3IEZsb2F0MzJBcnJheShcbiAgICAgICAgICBbXG4gICAgICAgICAgICAwLCAxLFxuICAgICAgICAgICAgMCwgMCxcbiAgICAgICAgICAgIDEsIDAsXG4gICAgICAgICAgICAxLCAxXG4gICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgKTtcblxuICAgICAgcHJpdmF0ZXMudkxvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiYVZlcnRleFwiKTtcbiAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByaXZhdGVzLnZMb2MpO1xuICAgICAgcHJpdmF0ZXMudmVydGV4QnVmZiA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHByaXZhdGVzLnZlcnRleEJ1ZmYpO1xuICAgICAgZ2wuYnVmZmVyRGF0YShcbiAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAwLCAxLFxuICAgICAgICAgIDAsIDAsXG4gICAgICAgICAgMSwgMCxcbiAgICAgICAgICAxLCAxXG4gICAgICAgIF0pLFxuICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgKTtcbiAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByaXZhdGVzLnZMb2MpO1xuICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwcml2YXRlcy52TG9jLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgICBwcml2YXRlcy5jdXJyZW50VGV4dHVyZSA9IG51bGw7XG5cbiAgICAgIC8vIHNldHRpbmcsIGRvbid0IG1vdmVcbiAgICAgIHRoaXMuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAwKTtcbiAgICAgIHRoaXMuZmlsdGVyKFwiY29udHJhc3RcIiwgMCk7XG4gICAgICB0aGlzLmFscGhhID0gMTtcblxuICAgICAgY29uc29sZS5sb2coXCJ3ZWJnbCBpbml0ZWQuIG1heCB0ZXh0dXJlIHNpemU6ICVkXCIsXG4gICAgICAgIGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVEVYVFVSRV9TSVpFKSk7XG4gICAgfVxuXG4gICAgZHJhd0ltYWdlOSAoaW1hZ2UsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZ2wgPSBwcml2YXRlcy5nbDtcblxuICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLmNyZWF0ZVRleHR1cmUoZ2wsIGltYWdlKTtcbiAgICAgIGlmIChwcml2YXRlcy5jdXJyZW50VGV4dHVyZSAhPSB0ZXh0dXJlKSB7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuICAgICAgICBwcml2YXRlcy5jdXJyZW50VGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICB9XG5cbiAgICAgIGdsLnVuaWZvcm00Zihwcml2YXRlcy5jcm9wTG9jLFxuICAgICAgICBzeC9pbWFnZS53aWR0aCwgc3kvaW1hZ2UuaGVpZ2h0LCBzdy9pbWFnZS53aWR0aCwgc2gvaW1hZ2UuaGVpZ2h0KTtcbiAgICAgIGdsLnVuaWZvcm00Zihwcml2YXRlcy5wb3NpdGlvbkxvYywgZHgsIGR5LCBkdywgZGgpO1xuXG4gICAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgNCk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGZvciAobGV0IHRleHR1cmUgb2YgcHJpdmF0ZXMudGV4dHVyZUNhY2hlLnZhbHVlcygpKSB7XG4gICAgICAgIHByaXZhdGVzLmdsLmRlbGV0ZVRleHR1cmUodGV4dHVyZSk7XG4gICAgICB9XG4gICAgICBwcml2YXRlcy50ZXh0dXJlQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlVGV4dHVyZSAoZ2wsIGltYWdlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy50ZXh0dXJlQ2FjaGUuaGFzKGltYWdlKSkge1xuICAgICAgICByZXR1cm4gcHJpdmF0ZXMudGV4dHVyZUNhY2hlLmdldChpbWFnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcbiAgICAgICAgbGV0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsICBnbC5SR0JBLCAgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpO1xuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5ORUFSRVNUKTtcblxuICAgICAgICAvLyB0ZXN0IHdpZHRoJmhlaWdodCBpcyBwb3dlciBvZiAyLCBlZy4gMjU2LCA1MTIsIDEwMjRcbiAgICAgICAgLy8gbWF5IHNwZWVkIHVwXG4gICAgICAgIGlmIChpc1BPVChpbWFnZS53aWR0aCkgJiYgaXNQT1QoaW1hZ2UuaGVpZ2h0KSkge1xuICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUik7XG4gICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgICAgIHByaXZhdGVzLnRleHR1cmVDYWNoZS5zZXQoaW1hZ2UsIHRleHR1cmUpO1xuICAgICAgICByZXR1cm4gdGV4dHVyZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3SW1hZ2UgKGltYWdlLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDkpIHtcbiAgICAgICAgLy8gYWxsIHJpZ2h0XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNSkge1xuICAgICAgICAvLyBkcmF3SW1hZ2UgKGltYWdlLCBkeCwgZHksIGR3LCBkaCk7XG4gICAgICAgIGR4ID0gc3g7XG4gICAgICAgIGR5ID0gc3k7XG4gICAgICAgIGR3ID0gc3c7XG4gICAgICAgIGRoID0gc2g7XG4gICAgICAgIHN4ID0gMDtcbiAgICAgICAgc3kgPSAwO1xuICAgICAgICBzdyA9IGltYWdlLndpZHRoO1xuICAgICAgICBzaCA9IGltYWdlLmhlaWdodDtcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgIC8vIGRyYXdJbWFnZSAoaW1hZ2UsIGR4LCBkeSk7XG4gICAgICAgIGR4ID0gc3g7XG4gICAgICAgIGR5ID0gc3k7XG4gICAgICAgIGR3ID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgIGRoID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgICBzeCA9IDA7XG4gICAgICAgIHN5ID0gMDtcbiAgICAgICAgc3cgPSBpbWFnZS53aWR0aDtcbiAgICAgICAgc2ggPSBpbWFnZS5oZWlnaHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGFyZ3VtZW50cywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbC5kcmF3SW1hZ2UgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBpZiAoZHggPiB0aGlzLndpZHRoIHx8IGR5ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGR4ICsgZHcpIDwgMCB8fCAoZHkgKyBkaCkgPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAhTnVtYmVyLmlzSW50ZWdlcihpbWFnZS53aWR0aCkgfHxcbiAgICAgICAgIU51bWJlci5pc0ludGVnZXIoaW1hZ2UuaGVpZ2h0KSB8fFxuICAgICAgICBpbWFnZS53aWR0aCA8PSAwIHx8XG4gICAgICAgIGltYWdlLmhlaWdodCA8PSAwIHx8XG4gICAgICAgIGltYWdlLndpZHRoID4gcHJpdmF0ZXMubWF4VGV4dHVyZVNpemUgfHxcbiAgICAgICAgaW1hZ2UuaGVpZ2h0ID4gcHJpdmF0ZXMubWF4VGV4dHVyZVNpemVcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGltYWdlLCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbC5kcmF3SW1hZ2UgaW52YWxpZCBpbWFnZVwiKTtcbiAgICAgIH1cbiAgICAgICovXG5cbiAgICAgIHRoaXMuZHJhd0ltYWdlOShpbWFnZSwgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKTtcbiAgICB9XG5cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuYWxwaGE7XG4gICAgfVxuXG4gICAgc2V0IGFscGhhICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZ2wgPSBwcml2YXRlcy5nbDtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmXG4gICAgICAgICFpc05hTih2YWx1ZSkgJiZcbiAgICAgICAgdmFsdWUgPj0gMCAmJlxuICAgICAgICB2YWx1ZSA8PSAxXG4gICAgICApIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLmFscGhhKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuYWxwaGEgPSB2YWx1ZTtcbiAgICAgICAgICBnbC51bmlmb3JtMWYocHJpdmF0ZXMuYWxwaGFMb2MsIHByaXZhdGVzLmFscGhhKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbCBnb3QgaW52YWxpZCBhbHBoYSBudW1iZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgY29sb3IsIGVnIFwiIzAwZmYwMFwiXG4gICAgICovXG4gICAgZ2V0IGNvbG9yICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbG9yID0gcHJpdmF0ZXMuY29sb3I7XG4gICAgICBsZXQgciA9IGNvbG9yWzBdLnRvU3RyaW5nKDE2KTtcbiAgICAgIGxldCBnID0gY29sb3JbMV0udG9TdHJpbmcoMTYpO1xuICAgICAgbGV0IGIgPSBjb2xvclsyXS50b1N0cmluZygxNik7XG4gICAgICBpZiAoci5sZW5ndGggPCAyKSByID0gXCIwXCIgKyByO1xuICAgICAgaWYgKGcubGVuZ3RoIDwgMikgZyA9IFwiMFwiICsgZztcbiAgICAgIGlmIChiLmxlbmd0aCA8IDIpIGIgPSBcIjBcIiArIGI7XG4gICAgICByZXR1cm4gXCIjXCIgKyByICsgZyArIGI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmV3IGNvbG9yLCBlZyBcIiMwMGZmMDBcIlxuICAgICAqL1xuICAgIHNldCBjb2xvciAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IG0gPSB2YWx1ZS5tYXRjaCgvXiMoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkoW1xcZGEtZkEtRl1bXFxkYS1mQS1GXSkkLyk7XG4gICAgICBpZiAobSkge1xuICAgICAgICBsZXQgciA9IG1bMV07XG4gICAgICAgIGxldCBnID0gbVsyXTtcbiAgICAgICAgbGV0IGIgPSBtWzNdO1xuICAgICAgICBwcml2YXRlcy5jb2xvclswXSA9IHBhcnNlSW50KHIsIDE2KTtcbiAgICAgICAgcHJpdmF0ZXMuY29sb3JbMV0gPSBwYXJzZUludChnLCAxNik7XG4gICAgICAgIHByaXZhdGVzLmNvbG9yWzJdID0gcGFyc2VJbnQoYiwgMTYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbC5jb2xvciBpbnZhbGlkIGNvbG9yIGZvcm1hdFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBmaWx0ZXIgeW91IHdhbnQgZ2V0IG9yIHNldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBOdW1iZXIgb3IgdW5kZWZpbmVkLCBpZiB1bmRlZmluZWQgLHJldHVybiBjdXJyZW50IHZhbHVlXG4gICAgICovXG4gICAgZmlsdGVyIChuYW1lLCB2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZ2wgPSBwcml2YXRlcy5nbDtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIHByaXZhdGVzLmZpbHRlci5zZXQobmFtZSwgdmFsdWUpO1xuICAgICAgICBnbC51bmlmb3JtMWYocHJpdmF0ZXMuYnJpZ2h0bmVzc0xvYywgcHJpdmF0ZXMuZmlsdGVyLmdldChcImJyaWdodG5lc3NcIikpO1xuICAgICAgICBnbC51bmlmb3JtMWYocHJpdmF0ZXMuY29udHJhc3RMb2MsIHByaXZhdGVzLmZpbHRlci5nZXQoXCJjb250cmFzdFwiKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHJpdmF0ZXMuZ2V0KG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGdsID0gcHJpdmF0ZXMuZ2w7XG4gICAgICBsZXQgY29sb3IgPSBwcml2YXRlcy5jb2xvcjtcbiAgICAgIGdsLmNsZWFyQ29sb3IoY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgMSk7IC8vIGJsYWNrXG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGggKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuY2FudmFzLndpZHRoO1xuICAgIH1cblxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiZcbiAgICAgICAgIWlzTmFOKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+IDAgJiZcbiAgICAgICAgdmFsdWUgPD0gNDA5NlxuICAgICAgKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5jYW52YXMud2lkdGgpIHtcbiAgICAgICAgICBwcml2YXRlcy5jYW52YXMud2lkdGggPSB2YWx1ZTtcbiAgICAgICAgICBwcml2YXRlcy5nbC52aWV3cG9ydCgwLCAwLCBwcml2YXRlcy5jYW52YXMud2lkdGgsIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIHByaXZhdGVzLmdsLnVuaWZvcm0yZihcbiAgICAgICAgICAgIHByaXZhdGVzLnJlc29sdXRpb25Mb2MsXG4gICAgICAgICAgICBwcml2YXRlcy5jYW52YXMud2lkdGgsXG4gICAgICAgICAgICBwcml2YXRlcy5jYW52YXMuaGVpZ2h0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbCBnb3QgaW52YWxpZCB3aWR0aCBudW1iZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGhlaWdodCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5jYW52YXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIHNldCBoZWlnaHQgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmXG4gICAgICAgICFpc05hTih2YWx1ZSkgJiZcbiAgICAgICAgdmFsdWUgPiAwICYmXG4gICAgICAgIHZhbHVlIDw9IDQwOTZcbiAgICAgICkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuY2FudmFzLmhlaWdodCkge1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICBwcml2YXRlcy5nbC52aWV3cG9ydCgwLCAwLCBwcml2YXRlcy5jYW52YXMud2lkdGgsIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIHByaXZhdGVzLmdsLnVuaWZvcm0yZihyZXNvbHV0aW9uTG9jLCBwcml2YXRlcy5jYW52YXMud2lkdGgsIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsIGdvdCBpbnZhbGlkIGhlaWdodCBudW1iZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGNhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuY2FudmFzO1xuICAgIH1cblxuICAgIHNldCBjYW52YXMgKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbC5jYW52YXMgY2Fubm90IHdyaXRlXCIpO1xuICAgIH1cblxuICB9KTtcblxuXG5cbn0pKCk7XG4iXX0=

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
 * @fileoverview Class Sprite.Event
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Event, hold all events emit, bubble
   * @class
   */
  Sprite.assign("Event", (function () {
    /**
     * construct Sprite.Event
     * @constructor
     */

    function SpriteEvent() {
      _classCallCheck(this, SpriteEvent);

      var privates = internal(this);
      /**
       * Contain all event and its' listeners
       @type {Object}
       @private
       */
      privates.listeners = new Map();
      /**
       * Contain an event is once or not
       * @type {Object}
       * @private
       */
      privates.once = new Map();
      /**
       * Parent of this object
       * @type {Object}
       */
      privates.parent = null;
    }

    /**
     * @return {Object} parent we hold, an object or null
     */

    _createClass(SpriteEvent, [{
      key: "on",

      /**
       * Register an event
       * @param {string} event The event type, eg. "click"
       * @param {function} listener The callback function when event fired
       */
      value: function on(event, listener) {
        var privates = internal(this);
        // If event is an once event, when some client register this event after event fired, we just return it
        if (privates.once.has(event)) {
          listener({
            type: event,
            target: this,
            data: privates.once.get(event)
          });
          return null;
        } else {
          if (privates.listeners.has(event) == false) {
            privates.listeners.set(event, new Map());
          }

          var id = Sprite.uuid();
          privates.listeners.get(event).set(id, listener);
          return id;
        }
      }

      /**
       * Remove an event Register
       * @param {string} event The event type you want to remove. eg. "click"
       * @param {string} id The id of event, the id is what returned by "on" function
       */
    }, {
      key: "off",
      value: function off(event, id) {
        var privates = internal(this);
        if (privates.listeners.has(event) && privates.listeners.get(event).has(id)) {
          privates.listeners.get(event)["delete"](id);
          if (privates.listeners.get(event).size <= 0) {
            privates.listeners["delete"](event);
          }
          return true;
        }
        return false;
      }

      /**
       * Fire an event from children
       * @param {string} event Event type
       * @param {Object} target Event target
       * @param {Object} data Data
       */
    }, {
      key: "emitBubble",
      value: function emitBubble(event, target, data) {
        var privates = internal(this);
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = privates.listeners.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var listener = _step.value;

              if (listener({ type: event, target: target, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
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
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, target, data);
        }
      }

      /**
       * Fire an event
       * @param {string} event The event type you want to fire
       * @param {boolean} once Whether or not the event is once, if true, the event fire should only once, like "complete"
       * @param {Object} data The data to listener, undefined or null is OK
       */
    }, {
      key: "emit",
      value: function emit(event, once, data) {
        var privates = internal(this);
        if (once) {
          if (typeof data != "undefined") {
            privates.once.set(event, data);
          } else {
            privates.once.set(event, null);
          }
        }

        // wheter or not bubble the event, default true
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = privates.listeners.get(event).values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var listener = _step2.value;

              if (listener({ type: event, target: this, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
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

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, this, data);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        var privates = internal(this);
        return privates.parent;
      },

      /**
       * Set parent of object
       * @param {Object} value New parent value, or null
       */
      set: function set(value) {
        var privates = internal(this);
        privates.parent = value;
      }
    }]);

    return SpriteEvent;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7QUFNbEMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPOzs7Ozs7QUFLUCxhQUxlLFdBQVcsR0FLdkI7NEJBTFksV0FBVzs7QUFNcEMsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNOUIsY0FBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNL0IsY0FBUSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7OztBQUsxQixjQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7Ozs7O2lCQXhCMEIsV0FBVzs7Ozs7Ozs7YUE2Q25DLFlBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNuQixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFlBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDNUIsa0JBQVEsQ0FBQztBQUNQLGdCQUFJLEVBQUUsS0FBSztBQUNYLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1dBQy9CLENBQUMsQ0FBQztBQUNILGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQU07QUFDTCxjQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUks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QUFLLEVBQUU7O0FBRWpFLHNCQUFNLEdBQUcsS0FBSyxDQUFDO2VBQ2hCO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztTQUNGOztBQUVELFlBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3JDLGtCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO09BQ0Y7OztXQTNHVSxlQUFHO0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUN4Qjs7Ozs7O1dBS1UsYUFBQyxLQUFLLEVBQUU7QUFDakIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLGdCQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUN6Qjs7O1dBdkMwQixXQUFXO09Bd0l0QyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlRXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkV2ZW50XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkV2ZW50LCBob2xkIGFsbCBldmVudHMgZW1pdCwgYnViYmxlXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkV2ZW50XCIsIGNsYXNzIFNwcml0ZUV2ZW50IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLkV2ZW50XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvKipcbiAgICAgICAqIENvbnRhaW4gYWxsIGV2ZW50IGFuZCBpdHMnIGxpc3RlbmVyc1xuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgICAgLyoqXG4gICAgICAgKiBDb250YWluIGFuIGV2ZW50IGlzIG9uY2Ugb3Igbm90XG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMub25jZSA9IG5ldyBNYXAoKTtcbiAgICAgIC8qKlxuICAgICAgICogUGFyZW50IG9mIHRoaXMgb2JqZWN0XG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5wYXJlbnQgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHBhcmVudCB3ZSBob2xkLCBhbiBvYmplY3Qgb3IgbnVsbFxuICAgICAqL1xuICAgIGdldCBwYXJlbnQgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMucGFyZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgcGFyZW50IG9mIG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBOZXcgcGFyZW50IHZhbHVlLCBvciBudWxsXG4gICAgICovXG4gICAgc2V0IHBhcmVudCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMucGFyZW50ID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFuIGV2ZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBldmVudCB0eXBlLCBlZy4gXCJjbGlja1wiXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZXZlbnQgZmlyZWRcbiAgICAgKi9cbiAgICBvbiAoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8vIElmIGV2ZW50IGlzIGFuIG9uY2UgZXZlbnQsIHdoZW4gc29tZSBjbGllbnQgcmVnaXN0ZXIgdGhpcyBldmVudCBhZnRlciBldmVudCBmaXJlZCwgd2UganVzdCByZXR1cm4gaXRcbiAgICAgIGlmIChwcml2YXRlcy5vbmNlLmhhcyhldmVudCkpIHtcbiAgICAgICAgbGlzdGVuZXIoe1xuICAgICAgICAgIHR5cGU6IGV2ZW50LFxuICAgICAgICAgIHRhcmdldDogdGhpcyxcbiAgICAgICAgICBkYXRhOiBwcml2YXRlcy5vbmNlLmdldChldmVudClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpID09IGZhbHNlKSB7XG4gICAgICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzLnNldChldmVudCwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZCA9IFNwcml0ZS51dWlkKCk7XG4gICAgICAgIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnNldChpZCwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBldmVudCBSZWdpc3RlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgZXZlbnQgdHlwZSB5b3Ugd2FudCB0byByZW1vdmUuIGVnLiBcImNsaWNrXCJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIGlkIG9mIGV2ZW50LCB0aGUgaWQgaXMgd2hhdCByZXR1cm5lZCBieSBcIm9uXCIgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBvZmYgKGV2ZW50LCBpZCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmhhcyhldmVudCkgJiYgcHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkuaGFzKGlkKSkge1xuICAgICAgICBwcml2YXRlcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS5kZWxldGUoaWQpO1xuICAgICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkuc2l6ZSA8PSAwKSB7XG4gICAgICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzLmRlbGV0ZShldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmUgYW4gZXZlbnQgZnJvbSBjaGlsZHJlblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBFdmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBFdmVudCB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBEYXRhXG4gICAgICovXG4gICAgZW1pdEJ1YmJsZSAoZXZlbnQsIHRhcmdldCwgZGF0YSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgYnViYmxlID0gdHJ1ZTtcblxuICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnZhbHVlcygpKSB7XG4gICAgICAgICAgaWYgKGxpc3RlbmVyKHsgdHlwZTogZXZlbnQsIHRhcmdldDogdGFyZ2V0LCBkYXRhOiBkYXRhIH0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gSWYgY2xpZW50IHJldHVybiBqdXN0IFwiZmFsc2VcIiwgc3RvcCBwcm9wYWdhdGlvblxuICAgICAgICAgICAgYnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcml2YXRlcy5wYXJlbnQgJiYgYnViYmxlID09IHRydWUpIHtcbiAgICAgICAgcHJpdmF0ZXMucGFyZW50LmVtaXRCdWJibGUoZXZlbnQsIHRhcmdldCwgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmUgYW4gZXZlbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHR5cGUgeW91IHdhbnQgdG8gZmlyZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gb25jZSBXaGV0aGVyIG9yIG5vdCB0aGUgZXZlbnQgaXMgb25jZSwgaWYgdHJ1ZSwgdGhlIGV2ZW50IGZpcmUgc2hvdWxkIG9ubHkgb25jZSwgbGlrZSBcImNvbXBsZXRlXCJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YSB0byBsaXN0ZW5lciwgdW5kZWZpbmVkIG9yIG51bGwgaXMgT0tcbiAgICAgKi9cbiAgICBlbWl0IChldmVudCwgb25jZSwgZGF0YSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAob25jZSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHByaXZhdGVzLm9uY2Uuc2V0KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcml2YXRlcy5vbmNlLnNldChldmVudCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2hldGVyIG9yIG5vdCBidWJibGUgdGhlIGV2ZW50LCBkZWZhdWx0IHRydWVcbiAgICAgIGxldCBidWJibGUgPSB0cnVlO1xuXG4gICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgcHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkudmFsdWVzKCkpIHtcbiAgICAgICAgICBpZiAobGlzdGVuZXIoeyB0eXBlOiBldmVudCwgdGFyZ2V0OiB0aGlzLCBkYXRhOiBkYXRhIH0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gSWYgY2xpZW50IHJldHVybiBqdXN0IFwiZmFsc2VcIiwgc3RvcCBwcm9wYWdhdGlvblxuICAgICAgICAgICAgYnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcml2YXRlcy5wYXJlbnQgJiYgYnViYmxlID09IHRydWUpIHtcbiAgICAgICAgcHJpdmF0ZXMucGFyZW50LmVtaXRCdWJibGUoZXZlbnQsIHRoaXMsIGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

/*

Sprite.Tween.get(Game.hero)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x, Game.hero.y + 5,"walk", resolve);
  })
})
.wait(2000)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x + 5, Game.hero.y, "walk", resolve);
  })
})
.to({alpha: 0}, 500)
.wait(500)
.to({alpha: 1}, 500)
.call(function () {
  Game.popup(Game.hero.sprite, "hello", 0, -50);
})
.wait(2000)
.call(function () {
  console.log("ok");
});


*/

/**
 * @fileoverview Sprite.Tween
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

  Sprite.assign("Tween", (function (_Sprite$Event) {
    _inherits(SpriteTween, _Sprite$Event);

    _createClass(SpriteTween, null, [{
      key: "get",
      value: function get(object) {
        return new Sprite.Tween(object);
      }
    }]);

    function SpriteTween(object) {
      _classCallCheck(this, SpriteTween);

      _get(Object.getPrototypeOf(SpriteTween.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.object = object;
      privates.callback = null;
      privates.action = [];
      privates.doing = false;
    }

    _createClass(SpriteTween, [{
      key: "nextAction",
      value: function nextAction() {
        var privates = internal(this);
        if (privates.doing == false && privates.action.length > 0) {
          var action = privates.action[0];
          privates.action.splice(0, 1);
          switch (action.type) {
            case "to":
              this.toAction(action.attributes, action.time);
              break;
            case "wait":
              this.waitAction(action.time);
              break;
            case "call":
              this.callAction(action.callback);
              break;
            case "promise":
              this.promiseAction(action.callback);
              break;
            default:
              console.error(action);
              throw new Error("Sprite.Tween got invalid action");
          }
        }
      }
    }, {
      key: "toAction",
      value: function toAction(attributes, time) {
        var _this = this;

        var privates = internal(this);
        privates.doing = true;

        var splice = Math.min(100, time);
        var t = time / splice;
        var step = {};

        for (var key in attributes) {
          if (Number.isFinite(attributes[key])) {
            step[key] = attributes[key] - privates.object[key];
            step[key] /= splice;
          }
        }

        var count = 0;
        var inter = setInterval(function () {
          count++;
          if (count >= splice) {
            for (var key in attributes) {
              privates.object[key] = attributes[key];
            }
            clearInterval(inter);
            privates.doing = false;
            _this.nextAction();
          } else {
            for (var key in step) {
              privates.object[key] += step[key];
            }
          }
        }, t);
      }
    }, {
      key: "to",
      value: function to(attributes, time) {
        internal(this).action.push({
          type: "to",
          attributes: attributes,
          time: time
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "promiseAction",
      value: function promiseAction(callback) {
        var _this2 = this;

        this.doing = true;
        callback().then(function () {
          _this2.doing = false;
          _this2.nextAction();
        });
      }
    }, {
      key: "promise",
      value: function promise(callback) {
        internal(this).action.push({
          type: "promise",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "callAction",
      value: function callAction(callback) {
        this.doing = true;
        callback();
        this.doing = false;
        this.nextAction();
      }
    }, {
      key: "call",
      value: function call(callback) {
        internal(this).action.push({
          type: "call",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "waitAction",
      value: function waitAction(time) {
        var _this3 = this;

        var privates = internal(this);
        privates.doing = true;
        setTimeout(function () {
          privates.doing = false;
          _this3.nextAction();
        }, time);
      }
    }, {
      key: "wait",
      value: function wait(time) {
        internal(this).action.push({
          type: "wait",
          time: time
        });
        this.nextAction();
        return this;
      }
    }]);

    return SpriteTween;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVHdlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0RBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O2lCQUFYLFdBQVc7O2FBRTNCLGFBQUMsTUFBTSxFQUFFO0FBQ2xCLGVBQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2pDOzs7QUFFVyxhQU5lLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O0FBT3BDLGlDQVB5QixXQUFXLDZDQU81QjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN6QixjQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN6QixjQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixjQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN4Qjs7aUJBYjBCLFdBQVc7O2FBZTNCLHNCQUFHO0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pELGNBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsa0JBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixrQkFBUSxNQUFNLENBQUMsSUFBSTtBQUNqQixpQkFBSyxJQUFJO0FBQ1Asa0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsb0JBQU07QUFBQSxBQUNSLGlCQUFLLE1BQU07QUFDVCxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0Isb0JBQU07QUFBQSxBQUNSLGlCQUFLLE1BQU07QUFDVCxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsb0JBQU07QUFBQSxBQUNSLGlCQUFLLFNBQVM7QUFDWixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsb0JBQU07QUFBQSxBQUNSO0FBQ0UscUJBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsb0JBQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUFBLFdBQ3REO1NBQ0Y7T0FDRjs7O2FBRVEsa0JBQUMsVUFBVSxFQUFFLElBQUksRUFBRTs7O0FBQzFCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRXRCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVkLGFBQUssSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQzFCLGNBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNwQyxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDO1dBQ3JCO1NBQ0Y7O0FBRUQsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLFlBQU07QUFDNUIsZUFBSyxFQUFFLENBQUM7QUFDUixjQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDbkIsaUJBQUssSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQzFCLHNCQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4QztBQUNELHlCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsb0JBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGtCQUFLLFVBQVUsRUFBRSxDQUFDO1dBQ25CLE1BQU07QUFDTCxpQkFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDcEIsc0JBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1dBQ0Y7U0FDRixFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ1A7OzthQUVFLFlBQUMsVUFBVSxFQUFFLElBQUksRUFBRTtBQUNwQixnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsY0FBSSxFQUFFLElBQUk7QUFDVixvQkFBVSxFQUFFLFVBQVU7QUFDdEIsY0FBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7O2FBRWEsdUJBQUMsUUFBUSxFQUFFOzs7QUFDdkIsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsZ0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3BCLGlCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsaUJBQUssVUFBVSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7OzthQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsY0FBSSxFQUFFLFNBQVM7QUFDZixrQkFBUSxFQUFFLFFBQVE7U0FDbkIsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLGVBQU8sSUFBSSxDQUFDO09BQ2I7OzthQUVVLG9CQUFDLFFBQVEsRUFBRTtBQUNwQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixnQkFBUSxFQUFFLENBQUM7QUFDWCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDbkI7OzthQUVJLGNBQUMsUUFBUSxFQUFFO0FBQ2QsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3pCLGNBQUksRUFBRSxNQUFNO0FBQ1osa0JBQVEsRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixlQUFPLElBQUksQ0FBQztPQUNiOzs7YUFFVSxvQkFBQyxJQUFJLEVBQUU7OztBQUNoQixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZ0JBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLGtCQUFVLENBQUMsWUFBTTtBQUNmLGtCQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN2QixpQkFBSyxVQUFVLEVBQUUsQ0FBQztTQUNuQixFQUFFLElBQUksQ0FBQyxDQUFDO09BQ1Y7OzthQUVJLGNBQUMsSUFBSSxFQUFFO0FBQ1YsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3pCLGNBQUksRUFBRSxNQUFNO0FBQ1osY0FBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBcEkwQixXQUFXO0tBQVMsTUFBTSxDQUFDLEtBQUssRUFxSTNELENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVUd2Vlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qXG5cblNwcml0ZS5Ud2Vlbi5nZXQoR2FtZS5oZXJvKVxuLnByb21pc2UoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBHYW1lLmhlcm8uZ290byhHYW1lLmhlcm8ueCwgR2FtZS5oZXJvLnkgKyA1LFwid2Fsa1wiLCByZXNvbHZlKTtcbiAgfSlcbn0pXG4ud2FpdCgyMDAwKVxuLnByb21pc2UoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBHYW1lLmhlcm8uZ290byhHYW1lLmhlcm8ueCArIDUsIEdhbWUuaGVyby55LCBcIndhbGtcIiwgcmVzb2x2ZSk7XG4gIH0pXG59KVxuLnRvKHthbHBoYTogMH0sIDUwMClcbi53YWl0KDUwMClcbi50byh7YWxwaGE6IDF9LCA1MDApXG4uY2FsbChmdW5jdGlvbiAoKSB7XG4gIEdhbWUucG9wdXAoR2FtZS5oZXJvLnNwcml0ZSwgXCJoZWxsb1wiLCAwLCAtNTApO1xufSlcbi53YWl0KDIwMDApXG4uY2FsbChmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUubG9nKFwib2tcIik7XG59KTtcblxuXG4qL1xuXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBTcHJpdGUuVHdlZW5cbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIFNwcml0ZS5hc3NpZ24oXCJUd2VlblwiLCBjbGFzcyBTcHJpdGVUd2VlbiBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IChvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgU3ByaXRlLlR3ZWVuKG9iamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKG9iamVjdCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgcHJpdmF0ZXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuYWN0aW9uID0gW107XG4gICAgICBwcml2YXRlcy5kb2luZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG5leHRBY3Rpb24gKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuZG9pbmcgPT0gZmFsc2UgJiYgcHJpdmF0ZXMuYWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGFjdGlvbiA9IHByaXZhdGVzLmFjdGlvblswXTtcbiAgICAgICAgcHJpdmF0ZXMuYWN0aW9uLnNwbGljZSgwLCAxKTtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJ0b1wiOlxuICAgICAgICAgICAgdGhpcy50b0FjdGlvbihhY3Rpb24uYXR0cmlidXRlcywgYWN0aW9uLnRpbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIndhaXRcIjpcbiAgICAgICAgICAgIHRoaXMud2FpdEFjdGlvbihhY3Rpb24udGltZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiY2FsbFwiOlxuICAgICAgICAgICAgdGhpcy5jYWxsQWN0aW9uKGFjdGlvbi5jYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwicHJvbWlzZVwiOlxuICAgICAgICAgICAgdGhpcy5wcm9taXNlQWN0aW9uKGFjdGlvbi5jYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihhY3Rpb24pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlR3ZWVuIGdvdCBpbnZhbGlkIGFjdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvQWN0aW9uIChhdHRyaWJ1dGVzLCB0aW1lKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRvaW5nID0gdHJ1ZTtcblxuICAgICAgbGV0IHNwbGljZSA9IE1hdGgubWluKDEwMCwgdGltZSk7XG4gICAgICBsZXQgdCA9IHRpbWUgLyBzcGxpY2U7XG4gICAgICBsZXQgc3RlcCA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGF0dHJpYnV0ZXNba2V5XSkpIHtcbiAgICAgICAgICBzdGVwW2tleV0gPSBhdHRyaWJ1dGVzW2tleV0gLSBwcml2YXRlcy5vYmplY3Rba2V5XTtcbiAgICAgICAgICBzdGVwW2tleV0gLz0gc3BsaWNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaW50ZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSBzcGxpY2UpIHtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcHJpdmF0ZXMub2JqZWN0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXIpO1xuICAgICAgICAgIHByaXZhdGVzLmRvaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHN0ZXApIHtcbiAgICAgICAgICAgIHByaXZhdGVzLm9iamVjdFtrZXldICs9IHN0ZXBba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHQpO1xuICAgIH1cblxuICAgIHRvIChhdHRyaWJ1dGVzLCB0aW1lKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5hY3Rpb24ucHVzaCh7XG4gICAgICAgIHR5cGU6IFwidG9cIixcbiAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgdGltZTogdGltZVxuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHByb21pc2VBY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmRvaW5nID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuZG9pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm9taXNlIChjYWxsYmFjaykge1xuICAgICAgaW50ZXJuYWwodGhpcykuYWN0aW9uLnB1c2goe1xuICAgICAgICB0eXBlOiBcInByb21pc2VcIixcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FsbEFjdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZG9pbmcgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHRoaXMuZG9pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgIH1cblxuICAgIGNhbGwgKGNhbGxiYWNrKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5hY3Rpb24ucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiY2FsbFwiLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWl0QWN0aW9uICh0aW1lKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRvaW5nID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5kb2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgIH0sIHRpbWUpO1xuICAgIH1cblxuICAgIHdhaXQgKHRpbWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmFjdGlvbi5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJ3YWl0XCIsXG4gICAgICAgIHRpbWU6IHRpbWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xuXG59KSgpO1xuIl19

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
 * @fileoverview Sprite.Loader, fetch resource
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Cache all url and element
   */
  var Cache = new Map();
  /**
   * When some url in Downloading, the url is downloading,
   * and other thread want it have to wait
   */
  var Downloading = new Map();

  function Fetch(url, callback, timeout) {

    var type = null;
    if (url.match(/js$/)) {
      type = "js";
    } else if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      type = "audio";
    } else if (url.match(/json$/i)) {
      type = "json";
    } else {
      console.error(url);
      throw new Error("Fetch got an invalid url");
    }

    // finished
    var Finish = function Finish(obj) {
      Cache.set(url, obj);

      if (type == "json") {
        obj = Sprite.copy(obj);
      }

      if (callback) {
        callback(obj);
      }
      if (Downloading.has(url)) {
        var callbacks = Downloading.get(url);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _callback = _step.value;

            if (_callback) {
              _callback(obj);
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

        Downloading["delete"](url);
      }
    };

    if (Cache.has(url)) {
      Finish(Cache.get(url));
      return;
    }

    if (Downloading.has(url)) {
      Downloading.get(url).push(callback);
      return;
    }

    Downloading.set(url, []);

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 15000; // 15 seconds

    switch (type) {
      case "js":
        req.responseType = "text";
        break;
      case "image":
        req.responseType = "blob";
        break;
      case "audio":
        req.responseType = "blob";
        break;
      case "json":
        req.responseType = "json";
        break;
      default:
        console.error(type, url);
        throw new Error("Fetch something wrong");
    }

    if (typeof callback != "function") callback = function () {};

    req.ontimeout = function () {
      if (timeout) {
        console.error(url);
        throw new Error("Sprite.Loader.Fetch timeout twice");
      } else {
        Fetch(url, callback, true);
      }
    };

    var done = false;
    req.onreadystatechange = function () {
      if (req.readyState == 4 && !done) {
        done = true;
        if (req.response) {
          if (type == "js") {
            var fun = null;
            try {
              fun = new Function(req.response);
            } catch (e) {
              console.error(req.response, url);
              throw e;
            }
            Finish(fun);
          } else if (type == "image") {
            (function () {
              var blob = req.response;
              var image = new Image();
              image.onload = function () {
                // window.URL.revokeObjectURL(image.src);
                image.onload = null;
                Finish(image);
              };
              image.src = window.URL.createObjectURL(blob);
            })();
          } else if (type == "audio") {
            (function () {
              var blob = req.response;
              var audio = new Audio();
              audio.oncanplay = function () {
                // 如果reoke掉audio，那么audio.load()方法则不能用了
                // window.URL.revokeObjectURL(audio.src);
                audio.oncanplay = null;
                Finish(audio);
              };
              audio.src = window.URL.createObjectURL(blob);
            })();
          } else if (type == "json") {
            var json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Finish(json);
          }
        } else {
          console.error(req.response, req.readyState, req.status, req.statusText);
          throw new Error("Sprite.Loader.Fetch Error");
        }
      }
    };
    req.send();
  }

  Sprite.assign("load", function () {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      var urls = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;

          if (typeof element == "string") {
            urls.push(element);
          } else if (element instanceof Array) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = element[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var url = _step3.value;

                urls.push(url);
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
          } else {
            console.error(element, args);
            throw new Error("Sprite.load got invalid argument");
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

      var done = 0;
      var ret = [];
      ret.length = urls.length;

      var Done = function Done() {
        done++;

        if (done >= ret.length) {
          resolve(ret);
        }
      };

      urls.forEach(function (element, index) {
        Fetch(element, function (result) {
          ret[index] = result;
          Done();
        });
      });
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXRDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDbEQsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3ZDLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNmLE1BQU07QUFDTCxhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFlBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM3Qzs7O0FBR0QsUUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3BCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixVQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFD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LEdBQUcsQ0FBQyxDQUFDO0FBQ2IsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsU0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV6QixVQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNmLFlBQUksRUFBRSxDQUFDOztBQUVQLFlBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDdEIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO09BQ0YsQ0FBQTs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBSztBQUMvQixhQUFLLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3pCLGFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDcEIsY0FBSSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FFSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVMb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNwcml0ZS5Mb2FkZXIsIGZldGNoIHJlc291cmNlXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2FjaGUgYWxsIHVybCBhbmQgZWxlbWVudFxuICAgKi9cbiAgbGV0IENhY2hlID0gbmV3IE1hcCgpO1xuICAvKipcbiAgICogV2hlbiBzb21lIHVybCBpbiBEb3dubG9hZGluZywgdGhlIHVybCBpcyBkb3dubG9hZGluZyxcbiAgICogYW5kIG90aGVyIHRocmVhZCB3YW50IGl0IGhhdmUgdG8gd2FpdFxuICAgKi9cbiAgbGV0IERvd25sb2FkaW5nID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIEZldGNoICh1cmwsIGNhbGxiYWNrLCB0aW1lb3V0KSB7XG5cbiAgICBsZXQgdHlwZSA9IG51bGw7XG4gICAgaWYgKHVybC5tYXRjaCgvanMkLykpIHtcbiAgICAgIHR5cGUgPSBcImpzXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL2pwZyR8anBlZyR8cG5nJHxibXAkfGdpZiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImltYWdlXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL3dhdiR8bXAzJHxvZ2ckL2kpKSB7XG4gICAgICB0eXBlID0gXCJhdWRpb1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qc29uJC9pKSkge1xuICAgICAgdHlwZSA9IFwianNvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBnb3QgYW4gaW52YWxpZCB1cmxcIik7XG4gICAgfVxuXG4gICAgLy8gZmluaXNoZWRcbiAgICBsZXQgRmluaXNoID0gKG9iaikgPT4ge1xuICAgICAgQ2FjaGUuc2V0KHVybCwgb2JqKTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgb2JqID0gU3ByaXRlLmNvcHkob2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICB9XG4gICAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IERvd25sb2FkaW5nLmdldCh1cmwpO1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIERvd25sb2FkaW5nLmRlbGV0ZSh1cmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDYWNoZS5oYXModXJsKSkge1xuICAgICAgRmluaXNoKENhY2hlLmdldCh1cmwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgIERvd25sb2FkaW5nLmdldCh1cmwpLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIERvd25sb2FkaW5nLnNldCh1cmwsIFtdKTtcblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICAgIHJlcS50aW1lb3V0ID0gMTUwMDA7IC8vIDE1IHNlY29uZHNcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImpzXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW1hZ2VcIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhdWRpb1wiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodHlwZSwgdXJsKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggc29tZXRoaW5nIHdyb25nXCIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggdGltZW91dCB0d2ljZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZldGNoKHVybCwgY2FsbGJhY2ssIHRydWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiAhZG9uZSkge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHJlcS5yZXNwb25zZSkge1xuICAgICAgICAgIGlmICh0eXBlID09IFwianNcIikge1xuICAgICAgICAgICAgbGV0IGZ1biA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmdW4gPSBuZXcgRnVuY3Rpb24ocmVxLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXEucmVzcG9uc2UsIHVybCk7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goZnVuKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJpbWFnZVwiKSB7XG4gICAgICAgICAgICBsZXQgYmxvYiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChpbWFnZS5zcmMpO1xuICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBudWxsO1xuICAgICAgICAgICAgICBGaW5pc2goaW1hZ2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImF1ZGlvXCIpIHtcbiAgICAgICAgICAgIGxldCBibG9iID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgbGV0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgICAgICBhdWRpby5vbmNhbnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIOWmguaenHJlb2tl5o6JYXVkaW/vvIzpgqPkuYhhdWRpby5sb2FkKCnmlrnms5XliJnkuI3og73nlKjkuoZcbiAgICAgICAgICAgICAgLy8gd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoYXVkaW8uc3JjKTtcbiAgICAgICAgICAgICAgYXVkaW8ub25jYW5wbGF5ID0gbnVsbDtcbiAgICAgICAgICAgICAgRmluaXNoKGF1ZGlvKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdWRpby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIGxldCBqc29uID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKCFqc29uKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkxvYWRlciBpbnZhbGlkIGpzb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goanNvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnJlc3BvbnNlLCByZXEucmVhZHlTdGF0ZSwgcmVxLnN0YXR1cywgcmVxLnN0YXR1c1RleHQpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggRXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlcS5zZW5kKCk7XG4gIH1cblxuICBTcHJpdGUuYXNzaWduKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBsZXQgdXJscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB1cmxzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgZm9yIChsZXQgdXJsIG9mIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHVybHMucHVzaCh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVsZW1lbnQsIGFyZ3MpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5sb2FkIGdvdCBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBkb25lID0gMDtcbiAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgIHJldC5sZW5ndGggPSB1cmxzLmxlbmd0aDtcblxuICAgICAgbGV0IERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGRvbmUrKztcblxuICAgICAgICBpZiAoZG9uZSA+PSByZXQubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVybHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgRmV0Y2goZWxlbWVudCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldFtpbmRleF0gPSByZXN1bHQ7XG4gICAgICAgICAgRG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG59KSgpO1xuIl19

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
 * @fileoverview Sprite.Ticker
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var tickerCount = 0;

  var SpriteTicker = (function (_Sprite$Event) {
    _inherits(SpriteTicker, _Sprite$Event);

    function SpriteTicker() {
      _classCallCheck(this, SpriteTicker);

      _get(Object.getPrototypeOf(SpriteTicker.prototype), "constructor", this).call(this);
      this.tick();
    }

    _createClass(SpriteTicker, [{
      key: "tick",
      value: function tick() {
        var _this = this;

        tickerCount++;
        this.emit("tick", false, tickerCount);
        window.requestAnimationFrame(function () {
          _this.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this2 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this2.off("tick", id);
            if (callback) {
              callback();
            }
          }
        });
        return id;
      }
    }, {
      key: "clearAfter",
      value: function clearAfter(id) {
        this.off("tick", id);
      }
    }, {
      key: "whiles",
      value: function whiles(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (callback) {
              callback(true);
            }
            _this3.off("tick", id);
          } else {
            if (callback) {
              callback(false);
            }
          }
        });
        return id;
      }
    }, {
      key: "clearWhiles",
      value: function clearWhiles(id) {
        this.off("tick", id);
      }
    }]);

    return SpriteTicker;
  })(Sprite.Event);

  ;

  Sprite.assign("Ticker", new SpriteTicker());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7O01BRWQsWUFBWTtjQUFaLFlBQVk7O0FBQ0osYUFEUixZQUFZLEdBQ0Q7NEJBRFgsWUFBWTs7QUFFZCxpQ0FGRSxZQUFZLDZDQUVOO0FBQ1IsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7O2lCQUpHLFlBQVk7O2FBTVgsZ0JBQUc7OztBQUNOLG1CQUFXLEVBQUUsQ0FBQztBQUNkLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN0QyxjQUFNLENBQUMscUJBQXFCLENBQUMsWUFBTTtBQUNqQyxnQkFBSyxJQUFJLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FBQztPQUNKOzs7YUFFSyxlQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7OztBQUN0QixZQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQzdCLGVBQUssRUFBRSxDQUFDO0FBQ1IsY0FBSSxLQUFLLElBQUksS0FBSyxFQUFFO0FBQ2xCLG1CQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckIsZ0JBQUksUUFBUSxFQUFFO0FBQ1osc0JBQVEsRUFBRSxDQUFDO2FBQ1o7V0FDRjtTQUNGLENBQUMsQ0FBQztBQUNILGVBQU8sRUFBRSxDQUFDO09BQ1g7OzthQUVVLG9CQUFDLEVBQUUsRUFBRTtBQUNkLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ3RCOzs7YUFFTSxnQkFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFOzs7QUFDdkIsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBTTtBQUM3QixlQUFLLEVBQUUsQ0FBQztBQUNSLGNBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUNsQixnQkFBSSxRQUFRLEVBQUU7QUFDWixzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hCO0FBQ0QsbUJBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztXQUN0QixNQUFNO0FBQ0wsZ0JBQUksUUFBUSxFQUFFO0FBQ1osc0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQjtXQUNGO1NBQ0YsQ0FBQyxDQUFDO0FBQ0gsZUFBTyxFQUFFLENBQUM7T0FDWDs7O2FBRVcscUJBQUMsRUFBRSxFQUFFO0FBQ2YsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDdEI7OztXQXBERyxZQUFZO0tBQVMsTUFBTSxDQUFDLEtBQUs7O0FBc0R0QyxHQUFDOztBQUVGLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztDQUU3QyxDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVUaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLlRpY2tlclxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgdGlja2VyQ291bnQgPSAwO1xuXG4gIGNsYXNzIFNwcml0ZVRpY2tlciBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudGljaygpO1xuICAgIH1cblxuICAgIHRpY2sgKCkge1xuICAgICAgdGlja2VyQ291bnQrKztcbiAgICAgIHRoaXMuZW1pdChcInRpY2tcIiwgZmFsc2UsIHRpY2tlckNvdW50KTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLnRpY2soKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFmdGVyICh0aW1lcywgY2FsbGJhY2spIHtcbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaWQgPSB0aGlzLm9uKFwidGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSB0aW1lcykge1xuICAgICAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgY2xlYXJBZnRlciAoaWQpIHtcbiAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgfVxuXG4gICAgd2hpbGVzICh0aW1lcywgY2FsbGJhY2spIHtcbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaWQgPSB0aGlzLm9uKFwidGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSB0aW1lcykge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBjbGVhcldoaWxlcyAoaWQpIHtcbiAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgfVxuXG4gIH07XG5cbiAgU3ByaXRlLmFzc2lnbihcIlRpY2tlclwiLCBuZXcgU3ByaXRlVGlja2VyKCkpO1xuXG59KSgpO1xuIl19

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
 * @fileoverview Class Sprite.Stage
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
   * Main Stage, display object
   * @class
   * @extends Sprite.Container
   */
  Sprite.assign("Stage", (function (_Sprite$Container) {
    _inherits(SpriteStage, _Sprite$Container);

    /** @function Sprite.Stage.constructor
     * consturct a Sprite.Stage with width and height
     * @constructor
     * @param width, the width of stage you need
     * @param height, the height of stage you need
     */

    function SpriteStage(width, height) {
      _classCallCheck(this, SpriteStage);

      _get(Object.getPrototypeOf(SpriteStage.prototype), "constructor", this).call(this);
      var privates = internal(this);

      if (!privates.renderer && Sprite.Webgl.support()) {
        privates.renderer = new Sprite.Webgl(width, height);
        privates.rendererType = "webgl";
      }

      // canvas 2d first
      if (!privates.renderer && Sprite.Canvas.support()) {
        privates.renderer = new Sprite.Canvas(width, height);
        privates.rendererType = "canvas";
      }

      if (!privates.renderer) {
        throw new Error("Sprite.Stage all renderer not support");
      }

      /**
      * color when stage is empty
      */
      privates.color = "#000000";
    }

    _createClass(SpriteStage, [{
      key: "releaseRenderer",
      value: function releaseRenderer() {
        internal(this).renderer.release();
      }
    }, {
      key: "filter",
      value: function filter(name, value) {
        return internal(this).renderer.filter(name, value);
      }
    }, {
      key: "findHit",
      value: function findHit(event) {
        var hitted = this.hitTest(this.mouseX, this.mouseY);
        hitted.reverse();
        if (hitted.length) return hitted;
        return null;
      }
    }, {
      key: "clear",

      /// @function Sprite.Stage.clear
      /// clear the stage
      value: function clear() {
        internal(this).renderer.clear();
      }
    }, {
      key: "update",
      value: function update() {
        this.emit("beforeDraw");
        this.draw(this.renderer);
        this.emit("afterDraw");
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
        /** this.children, never privates.children, because children are super's */
        if (this.children.length <= 0) {
          return false;
        }

        this.clear();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            child.draw(renderer);
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
      }
    }, {
      key: "renderer",
      get: function get() {
        return internal(this).renderer;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage renderer readonly");
      }
    }, {
      key: "rendererType",
      get: function get() {
        return internal(this).rendererType;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.rendererType readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return internal(this).renderer.width;
      },
      set: function set(value) {
        internal(this).renderer.width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).renderer.height;
      },
      set: function set(value) {
        internal(this).renderer.height = value;
      }
    }, {
      key: "color",
      get: function get() {
        return internal(this).renderer.color;
      },
      set: function set(value) {
        internal(this).renderer.color = value;
      }
    }, {
      key: "canvas",
      get: function get() {
        return this.renderer.canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.canvas readonly");
      }
    }]);

    return SpriteStage;
  })(Sprite.Container));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7Ozs7QUFRMUIsYUFSZSxXQUFXLENBUXpCLEtBQUssRUFBRSxNQUFNLEVBQUU7NEJBUkQsV0FBVzs7QUFTcEMsaUNBVHlCLFdBQVcsNkNBUzVCO0FBQ1IsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ2hELGdCQUFRLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEQsZ0JBQVEsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO09BQ2pDOzs7QUFHRCxVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ2pELGdCQUFRLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsZ0JBQVEsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO09BQ2xDOztBQUVELFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO0FBQ3RCLGNBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztPQUMxRDs7Ozs7QUFLRCxjQUFRLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztLQUM1Qjs7aUJBL0IwQixX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QUFTLEVBMEgvRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlU3RhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLlN0YWdlXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogTWFpbiBTdGFnZSwgZGlzcGxheSBvYmplY3RcbiAgICogQGNsYXNzXG4gICAqIEBleHRlbmRzIFNwcml0ZS5Db250YWluZXJcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJTdGFnZVwiLCBjbGFzcyBTcHJpdGVTdGFnZSBleHRlbmRzIFNwcml0ZS5Db250YWluZXIge1xuXG4gICAgLyoqIEBmdW5jdGlvbiBTcHJpdGUuU3RhZ2UuY29uc3RydWN0b3JcbiAgICAgKiBjb25zdHVyY3QgYSBTcHJpdGUuU3RhZ2Ugd2l0aCB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHdpZHRoLCB0aGUgd2lkdGggb2Ygc3RhZ2UgeW91IG5lZWRcbiAgICAgKiBAcGFyYW0gaGVpZ2h0LCB0aGUgaGVpZ2h0IG9mIHN0YWdlIHlvdSBuZWVkXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKCFwcml2YXRlcy5yZW5kZXJlciAmJiBTcHJpdGUuV2ViZ2wuc3VwcG9ydCgpKSB7XG4gICAgICAgIHByaXZhdGVzLnJlbmRlcmVyID0gbmV3IFNwcml0ZS5XZWJnbCh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcHJpdmF0ZXMucmVuZGVyZXJUeXBlID0gXCJ3ZWJnbFwiO1xuICAgICAgfVxuXG4gICAgICAvLyBjYW52YXMgMmQgZmlyc3RcbiAgICAgIGlmICghcHJpdmF0ZXMucmVuZGVyZXIgJiYgU3ByaXRlLkNhbnZhcy5zdXBwb3J0KCkpIHtcbiAgICAgICAgcHJpdmF0ZXMucmVuZGVyZXIgPSBuZXcgU3ByaXRlLkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcHJpdmF0ZXMucmVuZGVyZXJUeXBlID0gXCJjYW52YXNcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcml2YXRlcy5yZW5kZXJlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU3RhZ2UgYWxsIHJlbmRlcmVyIG5vdCBzdXBwb3J0XCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICogY29sb3Igd2hlbiBzdGFnZSBpcyBlbXB0eVxuICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmNvbG9yID0gXCIjMDAwMDAwXCI7XG4gICAgfVxuXG4gICAgcmVsZWFzZVJlbmRlcmVyICgpe1xuICAgICAgaW50ZXJuYWwodGhpcykucmVuZGVyZXIucmVsZWFzZSgpO1xuICAgIH1cblxuICAgIGdldCByZW5kZXJlciAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykucmVuZGVyZXI7XG4gICAgfVxuXG4gICAgc2V0IHJlbmRlcmVyICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlN0YWdlIHJlbmRlcmVyIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCByZW5kZXJlclR5cGUgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnJlbmRlcmVyVHlwZTtcbiAgICB9XG5cbiAgICBzZXQgcmVuZGVyZXJUeXBlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlN0YWdlLnJlbmRlcmVyVHlwZSByZWFkb25seVwiKVxuICAgIH1cblxuICAgIGZpbHRlciAobmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5yZW5kZXJlci5maWx0ZXIobmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGZpbmRIaXQgKGV2ZW50KSB7XG4gICAgICBsZXQgaGl0dGVkID0gdGhpcy5oaXRUZXN0KHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XG4gICAgICBoaXR0ZWQucmV2ZXJzZSgpO1xuICAgICAgaWYgKGhpdHRlZC5sZW5ndGgpXG4gICAgICAgIHJldHVybiBoaXR0ZWQ7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnJlbmRlcmVyLndpZHRoO1xuICAgIH1cblxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLnJlbmRlcmVyLndpZHRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGhlaWdodCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykucmVuZGVyZXIuaGVpZ2h0O1xuICAgIH1cblxuICAgIHNldCBoZWlnaHQgKHZhbHVlKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5yZW5kZXJlci5oZWlnaHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgY29sb3IgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnJlbmRlcmVyLmNvbG9yO1xuICAgIH1cblxuICAgIHNldCBjb2xvciAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLnJlbmRlcmVyLmNvbG9yID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGNhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5jYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhbnZhcyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TdGFnZS5jYW52YXMgcmVhZG9ubHlcIilcbiAgICB9XG5cbiAgICAvLy8gQGZ1bmN0aW9uIFNwcml0ZS5TdGFnZS5jbGVhclxuICAgIC8vLyBjbGVhciB0aGUgc3RhZ2VcbiAgICBjbGVhciAoKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5yZW5kZXJlci5jbGVhcigpO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICB0aGlzLmVtaXQoXCJiZWZvcmVEcmF3XCIpO1xuICAgICAgdGhpcy5kcmF3KHRoaXMucmVuZGVyZXIpO1xuICAgICAgdGhpcy5lbWl0KFwiYWZ0ZXJEcmF3XCIpO1xuICAgIH1cblxuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICAvKiogdGhpcy5jaGlsZHJlbiwgbmV2ZXIgcHJpdmF0ZXMuY2hpbGRyZW4sIGJlY2F1c2UgY2hpbGRyZW4gYXJlIHN1cGVyJ3MgKi9cbiAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkLmRyYXcocmVuZGVyZXIpO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19

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
 * @fileoverview Define the Sprite.Text to show text in game
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

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  /**
   * Class Sprite.Text, contain text
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Text", (function (_Sprite$Display) {
    _inherits(SpriteText, _Sprite$Display);

    /**
     * construct Sprite.Text
     * @constructor
     */

    function SpriteText(config) {
      _classCallCheck(this, SpriteText);

      _get(Object.getPrototypeOf(SpriteText.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      this.generate();
    }

    _createClass(SpriteText, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var text = new Text({
          text: privates.text,
          maxWidth: privates.maxWidth,
          color: privates.color,
          fontSize: privates.fontSize,
          fontFamily: privates.fontFamily
        });
        text.x = this.x;
        text.y = this.y;
        text.centerX = this.centerX;
        text.centerY = this.centerY;
        text.alpha = this.alpha;
        text.visible = this.visible;
        return text;
      }
    }, {
      key: "generate",
      value: function generate() {
        var privates = internal(this);
        textContext.font = this.fontSize + "px " + privates.fontFamily;
        // "龍" is the max-width & max-height Chinese word I think
        var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
        this.width = 0;

        // find the real-maximum-width of multiline text, base user's maxWidth
        var lines = [];
        var lineText = "";
        for (var i = 0, len = this.text.length; i < len; i++) {
          if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
            lines.push(lineText);
            lineText = this.text[i];
          } else {
            lineText += this.text[i];
          }
          if (textContext.measureText(lineText).width > this.width) this.width = Math.ceil(textContext.measureText(lineText).width);
        }

        if (lineText.length) {
          lines.push(lineText);
        }

        this.height = lines.length * lineHeight;

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext("2d");
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "top";
        // draw each line
        lines.forEach(function (element, index) {
          context.fillText(element, canvas.width / 2, index * lineHeight);
        });

        privates.image = null;
        privates.image = canvas;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var privates = internal(this);
        var image = privates.image;
        if (image && image.width > 0 && image.height > 0) {
          this.drawImage(context, image, 0, 0, image.width, image.height);
        }
      }
    }, {
      key: "text",
      get: function get() {
        var privates = internal(this);
        return privates.text;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.text) {
          privates.text = value;
          this.generate();
        }
      }
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        return privates.color;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.color) {
          privates.color = value;
          this.generate();
        }
      }
    }, {
      key: "fontSize",
      get: function get() {
        var privates = internal(this);
        return privates.fontSize;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.fontSize) {
          privates.fontSize = value;
          this.generate();
        }
      }
    }, {
      key: "fontFamily",
      get: function get() {
        return internal(this).fontFamily;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.fontFamily) {
          privates.fontFamily = value;
          this.generate();
        }
      }
    }]);

    return SpriteText;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQyxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWQsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFlBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7Ozs7QUFPOUMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2NBQVEsVUFBVTs7Ozs7OztBQUt4QixhQUxjLFVBQVUsQ0FLdkIsTUFBTSxFQUFFOzRCQUxLLFVBQVU7O0FBTWxDLGlDQU53QixVQUFVLDZDQU0xQjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDO0FBQzlDLGNBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7QUFDNUMsY0FBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQztBQUN6QyxjQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQzFDLGNBQVEsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7QUFDbkQsY0FBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pC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SyxDQUFDO0FBQzVCLGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtPQUNGOzs7V0FwRnlCLFVBQVU7S0FBUyxNQUFNLENBQUMsT0FBTyxFQWdKM0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lIHRoZSBTcHJpdGUuVGV4dCB0byBzaG93IHRleHQgaW4gZ2FtZVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuIChmdW5jdGlvbiAoKSB7XG4gICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgbGV0IHRleHRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICB0ZXh0Q2FudmFzLndpZHRoID0gMTtcbiAgdGV4dENhbnZhcy5oZWlnaHQgPSAxO1xuICBsZXQgdGV4dENvbnRleHQgPSB0ZXh0Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLlRleHQsIGNvbnRhaW4gdGV4dFxuICAgKiBAY2xhc3NcbiAgICogQGV4dGVuZHMgU3ByaXRlLkRpc3BsYXlcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJUZXh0XCIsIGNsYXNzIFNwcml0ZVRleHQgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0IFNwcml0ZS5UZXh0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMudGV4dCA9IGNvbmZpZy50ZXh0IHx8IFwiSW52YWxpZCBUZXh0XCI7XG4gICAgICBwcml2YXRlcy5tYXhXaWR0aCA9IGNvbmZpZy5tYXhXaWR0aCB8fCAxMDAwO1xuICAgICAgcHJpdmF0ZXMuY29sb3IgPSBjb25maWcuY29sb3IgfHwgXCJibGFja1wiO1xuICAgICAgcHJpdmF0ZXMuZm9udFNpemUgPSBjb25maWcuZm9udFNpemUgfHwgMTQ7XG4gICAgICBwcml2YXRlcy5mb250RmFtaWx5ID0gY29uZmlnLmZvbnRGYW1pbHkgfHwgXCJBcmllbFwiO1xuICAgICAgcHJpdmF0ZXMuaW1hZ2UgPSBudWxsO1xuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IHRleHQgPSBuZXcgVGV4dCh7XG4gICAgICAgIHRleHQ6IHByaXZhdGVzLnRleHQsXG4gICAgICAgIG1heFdpZHRoOiBwcml2YXRlcy5tYXhXaWR0aCxcbiAgICAgICAgY29sb3I6IHByaXZhdGVzLmNvbG9yLFxuICAgICAgICBmb250U2l6ZTogcHJpdmF0ZXMuZm9udFNpemUsXG4gICAgICAgIGZvbnRGYW1pbHk6IHByaXZhdGVzLmZvbnRGYW1pbHlcbiAgICAgIH0pO1xuICAgICAgdGV4dC54ID0gdGhpcy54O1xuICAgICAgdGV4dC55ID0gdGhpcy55O1xuICAgICAgdGV4dC5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgdGV4dC5jZW50ZXJZID0gdGhpcy5jZW50ZXJZO1xuICAgICAgdGV4dC5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICB0ZXh0LnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy50ZXh0O1xuICAgIH1cblxuICAgIHNldCB0ZXh0ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT0gdGhpcy50ZXh0KSB7XG4gICAgICAgIHByaXZhdGVzLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjb2xvciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5jb2xvcjtcbiAgICB9XG5cbiAgICBzZXQgY29sb3IgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSB0aGlzLmNvbG9yKSB7XG4gICAgICAgIHByaXZhdGVzLmNvbG9yID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZm9udFNpemUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuZm9udFNpemU7XG4gICAgfVxuXG4gICAgc2V0IGZvbnRTaXplICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT0gdGhpcy5mb250U2l6ZSkge1xuICAgICAgICBwcml2YXRlcy5mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGZvbnRGYW1pbHkgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmZvbnRGYW1pbHk7XG4gICAgfVxuXG4gICAgc2V0IGZvbnRGYW1pbHkgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5mb250RmFtaWx5KSB7XG4gICAgICAgIHByaXZhdGVzLmZvbnRGYW1pbHkgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgdGV4dENvbnRleHQuZm9udCA9IHRoaXMuZm9udFNpemUgKyBcInB4IFwiICsgcHJpdmF0ZXMuZm9udEZhbWlseTtcbiAgICAgIC8vIFwi6b6NXCIgaXMgdGhlIG1heC13aWR0aCAmIG1heC1oZWlnaHQgQ2hpbmVzZSB3b3JkIEkgdGhpbmtcbiAgICAgIGxldCBsaW5lSGVpZ2h0ID0gTWF0aC5jZWlsKHRleHRDb250ZXh0Lm1lYXN1cmVUZXh0KFwi6b6NXCIpLndpZHRoICogMS4yKTtcbiAgICAgIHRoaXMud2lkdGggPSAwO1xuXG4gICAgICAvLyBmaW5kIHRoZSByZWFsLW1heGltdW0td2lkdGggb2YgbXVsdGlsaW5lIHRleHQsIGJhc2UgdXNlcidzIG1heFdpZHRoXG4gICAgICBsZXQgbGluZXMgPSBbXTtcbiAgICAgIGxldCBsaW5lVGV4dCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy50ZXh0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmICh0ZXh0Q29udGV4dC5tZWFzdXJlVGV4dChsaW5lVGV4dCArIHRoaXMudGV4dFtpXSkud2lkdGggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgbGluZXMucHVzaChsaW5lVGV4dCk7XG4gICAgICAgICAgbGluZVRleHQgPSB0aGlzLnRleHRbaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGluZVRleHQgKz0gdGhpcy50ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Q29udGV4dC5tZWFzdXJlVGV4dChsaW5lVGV4dCkud2lkdGggPiB0aGlzLndpZHRoKVxuICAgICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmNlaWwodGV4dENvbnRleHQubWVhc3VyZVRleHQobGluZVRleHQpLndpZHRoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpbmVUZXh0Lmxlbmd0aCkge1xuICAgICAgICBsaW5lcy5wdXNoKGxpbmVUZXh0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oZWlnaHQgPSBsaW5lcy5sZW5ndGggKiBsaW5lSGVpZ2h0O1xuXG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjb250ZXh0LmZvbnQgPSB0aGlzLmZvbnRTaXplICsgXCJweCBcIiArIHRoaXMuZm9udEZhbWlseTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICAgIC8vIGRyYXcgZWFjaCBsaW5lXG4gICAgICBsaW5lcy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGVsZW1lbnQsIGNhbnZhcy53aWR0aC8yLCBpbmRleCpsaW5lSGVpZ2h0KVxuICAgICAgfSk7XG5cbiAgICAgIHByaXZhdGVzLmltYWdlID0gbnVsbDtcbiAgICAgIHByaXZhdGVzLmltYWdlID0gY2FudmFzO1xuICAgIH1cblxuICAgIGRyYXcgKGNvbnRleHQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGltYWdlID0gcHJpdmF0ZXMuaW1hZ2U7XG4gICAgICBpZiAoIGltYWdlICYmIGltYWdlLndpZHRoID4gMCAmJiBpbWFnZS5oZWlnaHQgPiAwKSB7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgMCxcbiAgICAgICAgICAwLFxuICAgICAgICAgIGltYWdlLndpZHRoLFxuICAgICAgICAgIGltYWdlLmhlaWdodFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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
 * @fileoverview Class Sprite.Frame
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
   * Class Sprite.Frame, a frame of Sprite.Sheet
   * @class
   */
  Sprite.assign("Frame", (function (_Sprite$Display) {
    _inherits(SpriteFrame, _Sprite$Display);

    function SpriteFrame(image, sx, sy, width, height) {
      _classCallCheck(this, SpriteFrame);

      _get(Object.getPrototypeOf(SpriteFrame.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      this.width = width;
      this.height = height;
    }

    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */

    _createClass(SpriteFrame, [{
      key: "print",
      value: function print() {
        console.log(internal(this));
      }

      /**
       * @return {Object} Clone this Sprite.Frame
       */
    }, {
      key: "clone",
      value: function clone() {
        var frame = new Sprite.Frame(this.image, this.sx, this.sy, this.width, this.height);
        frame.x = this.x;
        frame.y = this.y;
        frame.parent = this.parent;
        return frame;
      }

      /**
       * @param {Object} renderer
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        this.drawImage(renderer, this.image, this.sx, this.sy, this.width, this.height);
      }
    }, {
      key: "image",
      get: function get() {
        var privates = internal(this);
        return privates.image;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.image readonly");
      }

      /**
       * @return {number} Return sx
       */
    }, {
      key: "sx",
      get: function get() {
        var privates = internal(this);
        return privates.sx;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sx readonly");
      }

      /**
       * @return {number} Return sy
       */
    }, {
      key: "sy",
      get: function get() {
        var privates = internal(this);
        return privates.sy;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sy readonly");
      }
    }]);

    return SpriteFrame;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRnJhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7O0FBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O0FBRTFCLGFBRmUsV0FBVyxDQUV6QixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFOzRCQUZoQixXQUFXOztBQUdwQyxpQ0FIeUIsV0FBVyw2Q0FHNUI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7Ozs7OztpQkFWMEIsV0FBVzs7YUErQ2hDLGlCQUFHO0FBQ1AsZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUM3Qjs7Ozs7OzthQUtLLGlCQUFHO0FBQ1AsWUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUMxQixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFDaEIsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUN4QixDQUFDO0FBQ0YsYUFBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGFBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixhQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsZUFBTyxLQUFLLENBQUM7T0FDZDs7Ozs7OzthQUtJLGNBQUMsUUFBUSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFNBQVMsQ0FDWixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDcEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQ3hCLENBQUM7T0FDSDs7O1dBN0RTLGVBQUc7QUFDWCxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDO09BQ3ZCO1dBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsY0FBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO09BQ2hEOzs7Ozs7O1dBS00sZUFBRztBQUNSLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixlQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7T0FDcEI7V0FFTSxhQUFDLEtBQUssRUFBRTtBQUNiLGNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztPQUM3Qzs7Ozs7OztXQUtNLGVBQUc7QUFDUixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO09BQ3BCO1dBRU0sYUFBQyxLQUFLLEVBQUU7QUFDYixjQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7T0FDN0M7OztXQTdDMEIsV0FBVztLQUFTLE1BQU0sQ0FBQyxPQUFPLEVBNkU3RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlRnJhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkZyYW1lXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkZyYW1lLCBhIGZyYW1lIG9mIFNwcml0ZS5TaGVldFxuICAgKiBAY2xhc3NcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJGcmFtZVwiLCBjbGFzcyBTcHJpdGVGcmFtZSBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcblxuICAgIGNvbnN0cnVjdG9yIChpbWFnZSwgc3gsIHN5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5pbWFnZSA9IGltYWdlO1xuICAgICAgcHJpdmF0ZXMuc3ggPSBzeDtcbiAgICAgIHByaXZhdGVzLnN5ID0gc3k7XG4gICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7SW1hZ2V9IFJldHVybiB0aGUgaW1hZ2UgdGhpcyBTcHJpdGUuRnJhbWUgaG9sZFxuICAgICAqL1xuICAgIGdldCBpbWFnZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5pbWFnZTtcbiAgICB9XG5cbiAgICBzZXQgaW1hZ2UgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuRnJhbWUuaW1hZ2UgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm4gc3hcbiAgICAgKi9cbiAgICBnZXQgc3ggKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuc3g7XG4gICAgfVxuXG4gICAgc2V0IHN4ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkZyYW1lLnN4IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJuIHN5XG4gICAgICovXG4gICAgZ2V0IHN5ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnN5O1xuICAgIH1cblxuICAgIHNldCBzeSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5GcmFtZS5zeSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBwcmludCAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhpbnRlcm5hbCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDbG9uZSB0aGlzIFNwcml0ZS5GcmFtZVxuICAgICAqL1xuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBmcmFtZSA9IG5ldyBTcHJpdGUuRnJhbWUoXG4gICAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAgIHRoaXMuc3gsIHRoaXMuc3ksXG4gICAgICAgIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgZnJhbWUueCA9IHRoaXMueDtcbiAgICAgIGZyYW1lLnkgPSB0aGlzLnk7XG4gICAgICBmcmFtZS5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgIHJldHVybiBmcmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXJcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgdGhpcy5kcmF3SW1hZ2UoXG4gICAgICAgIHJlbmRlcmVyLCB0aGlzLmltYWdlLFxuICAgICAgICB0aGlzLnN4LCB0aGlzLnN5LFxuICAgICAgICB0aGlzLndpZHRoLCB0aGlzLmhlaWdodFxuICAgICAgKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

/*import "js/Sprite/SpriteDisplay";

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
 * @fileoverview Class Sprite.Sheet, maybe the most importent class
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
   * Class Sprite.Sheet, contain sprite's sheet and it's animation
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Sheet", (function (_Sprite$Display) {
    _inherits(SpriteSheet, _Sprite$Display);

    /**
     * construct Sprite.Sheet
     * @param config
     * @constructor
     */

    function SpriteSheet(config) {
      _classCallCheck(this, SpriteSheet);

      _get(Object.getPrototypeOf(SpriteSheet.prototype), "constructor", this).call(this);
      var privates = internal(this);

      if (!config.images || !config.images.length || !Number.isFinite(config.width) || config.width <= 0 || config.width > 4096 || !Number.isFinite(config.height) || config.height <= 0 || config.height > 4096) {
        console.error(config);
        throw new Error("Sprite.Sheet.constructor get invalid arguments");
      }

      /**
       * Contain one or more images
       @type {Array}
       @private
       */
      privates.images = config.images;
      /**
       * Width of each frame
       @type {number}
       @private
       */
      privates.tilewidth = config.width;
      this.width = config.width;
      /**
       * Height of each frame
       @type {number}
       @private
       */
      privates.tileheight = config.height;
      this.height = config.height;
      /**
       * Animations of this sprite sheet, eg. { "walkdown": [0, 2, "", 40], "walkup", [3, 5, "", 40] }
       @type {Object}
       @private
       */
      privates.animations = config.animations || {};
      /**
       * Current animation's name, eg. "walkdown", "attackright"
       @type {string}
       @private
       */
      privates.currentAnimation = null;
      /**
       * Current frame number, eg. 0, 1, 2, 3
       @type {number}
       @private
       */
      privates.currentFrame = 0;
      /**
       * If animationTimer is not null, it points an animation is running
       * it will be null or an handler from setInterval
       @type {Object}
       @private
       */
      privates.animationTimer = null;

      /**
       * The number of frames we have
       @type {number}
       @private
       */
      privates.frameCount = 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;

          if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, not Image or Canvas");
          }

          if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, invalid width or height");
          }

          var col = Math.floor(image.width / privates.tilewidth);
          var row = Math.floor(image.height / privates.tileheight);
          privates.frameCount += col * row;
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
    }

    /**
     * Clone Sprite.Sheet object itself
     * @return {Object} Return an copy of this
     */

    _createClass(SpriteSheet, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var sheet = new Sprite.Sheet({
          images: privates.images,
          width: privates.tilewidth,
          height: privates.tileheight,
          animations: privates.animations
        });
        sheet.x = this.x;
        sheet.y = this.y;
        sheet.centerX = this.centerX;
        sheet.centerY = this.centerY;
        sheet.play(this.currentFrame);
        sheet.alpha = this.alpha;
        sheet.visible = this.visible;
        return sheet;
      }

      /**
       * @return {boolean} Return false if an animation is running
       */
    }, {
      key: "play",

      /**
       * Play a frame or an animation
       * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
       */
      value: function play(choice) {
        var _this = this;

        var privates = internal(this);
        if (privates.animationTimer) {
          clearInterval(privates.animationTimer);
          privates.animationTimer = null;
        }

        if (Number.isInteger(choice)) {
          // Argument points a frame
          privates.currentFrame = choice;
          this.emit("change");
        } else if (typeof choice == "string") {
          var _ret = (function () {
            // Argument points an animation name
            var animation = privates.animations[choice];

            if (!animation) {
              // if animation is not exist
              console.error(animation, privates.animations, choice);
              throw new Error("Sprite.Sheet.play invalid animation");
            }

            // if animation is single frame number
            if (Number.isFinite(animation)) {
              privates.currentAnimation = choice;
              return {
                v: _this.play(animation)
              };
            }

            // start frame number
            var begin = null;
            // finish frame number
            var end = null;
            // what action after animation finished
            var next = null;
            // the space between each frame, ms
            var time = null;

            if (animation instanceof Array) {
              // if animation format is like [begin, end, next, time]
              begin = animation[0];
              end = animation[1];
              next = animation[2];
              time = animation[3];
            } else if (animation.frames && animation.frames instanceof Array) {
              // if animation format is like { frames: [begin, end], next: "next", speed: "time" }
              begin = animation.frames[0];
              end = animation.frames[animation.frames.length - 1];
              next = animation.next;
              time = animation.speed;
            }

            if ( // Data ensure
            !Number.isFinite(begin) || begin < 0 || begin >= privates.frameCount || !Number.isFinite(end) || end < 0 || end >= privates.frameCount || !Number.isFinite(time) || time <= 0) {
              console.error(begin, end, time, _this);
              throw new Error("Sprite.Sheet.play Invalid animation data");
            }

            // Play first frame in animation
            privates.currentAnimation = choice;
            privates.currentFrame = begin;
            _this.emit("change");

            // Play other frame in animation
            privates.animationTimer = setInterval(function () {
              privates.currentFrame++;

              if (privates.currentFrame > end) {
                clearInterval(privates.animationTimer);
                privates.animationTimer = null;

                if (next && next.length && privates.animations[next]) {
                  _this.play(next);
                } else {
                  privates.currentFrame--;
                }
                _this.emit("animationend");
              }

              _this.emit("change");
            }, time);
          })();

          if (typeof _ret === "object") return _ret.v;
        } else {
          console.error(choice, internal(this).animations, this);
          throw new Error("Sprite.Sheet.play has an invalid argument");
        }
      }

      /**
       * Get a certain frame
       * @param {number} index The index of frame
       * @return {Object} An Sprite.Frame object
       */
    }, {
      key: "getFrame",
      value: function getFrame(index) {
        var privates = internal(this);
        if (!Number.isInteger(index)) {
          index = privates.currentFrame;
        }

        if (index < 0 || index >= privates.frameCount) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame index out of range");
        }

        var frame = null;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var image = _step2.value;

            var col = Math.floor(image.width / privates.tilewidth);
            var row = Math.floor(image.height / privates.tileheight);
            if (index < col * row) {
              // which row
              var j = Math.floor(index / col);
              // which column
              var i = index - col * j;
              frame = new Sprite.Frame(image, i * privates.tilewidth, // x
              j * privates.tileheight, // y
              privates.tilewidth, privates.tileheight);
              frame.parent = this;
              break;
            }
            index -= col * row;
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

        if (!frame) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame unknown error");
        }

        return frame;
      }

      /**
       * Draw this sheet on certain renderer
       * @param {Object} renderer A renderer engine, eg. Sprite.Webgl
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        if (this.visible == false || this.alpha <= 0.01) {
          return;
        }

        var privates = internal(this);
        var frame = this.getFrame(this.currentFrame);

        if (!frame || !frame.image) {
          console.error(frame, this.currentFrame, this);
          throw new Error("Sprite.Sheet.draw invalid frame");
        }

        frame.draw(renderer);
      }
    }, {
      key: "paused",
      get: function get() {
        var privates = internal(this);
        if (privates.animationTimer) {
          return false;
        }
        return true;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.paused readonly");
      }

      /**
       * @return {number} Return current frame number
       */
    }, {
      key: "currentFrame",
      get: function get() {
        var privates = internal(this);
        return privates.currentFrame;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentFrame readonly");
      }

      /**
       * @return {string} Return
       */
    }, {
      key: "currentAnimation",
      get: function get() {
        var privates = internal(this);
        return privates.currentAnimation;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentAnimation readonly");
      }
    }]);

    return SpriteSheet;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hlZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7OztBQU0xQixhQU5lLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O0FBT3BDLGlDQVB5QixXQUFXLDZDQU81QjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsVUFDSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFDdkMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksSUFDMUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksRUFDN0U7QUFDRixlQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztPQUNuRTs7Ozs7OztBQU9ELGNBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7Ozs7O0FBTWhDLGNBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxVQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Ozs7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b0IsYUFBQyxLQUFLLEVBQUU7QUFDM0IsY0FBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO09BQzNEOzs7V0FuSjBCLFdBQVc7S0FBUyxNQUFNLENBQUMsT0FBTyxFQW1UN0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVNoZWV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyppbXBvcnQgXCJqcy9TcHJpdGUvU3ByaXRlRGlzcGxheVwiO1xuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLlNoZWV0LCBtYXliZSB0aGUgbW9zdCBpbXBvcnRlbnQgY2xhc3NcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuU2hlZXQsIGNvbnRhaW4gc3ByaXRlJ3Mgc2hlZXQgYW5kIGl0J3MgYW5pbWF0aW9uXG4gICAqIEBjbGFzc1xuICAgKiBAZXh0ZW5kcyBTcHJpdGUuRGlzcGxheVxuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIlNoZWV0XCIsIGNsYXNzIFNwcml0ZVNoZWV0IGV4dGVuZHMgU3ByaXRlLkRpc3BsYXkge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdCBTcHJpdGUuU2hlZXRcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBpZiAoXG4gICAgICAgICAgIWNvbmZpZy5pbWFnZXMgfHwgIWNvbmZpZy5pbWFnZXMubGVuZ3RoIHx8XG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShjb25maWcud2lkdGgpIHx8IGNvbmZpZy53aWR0aCA8PSAwIHx8IGNvbmZpZy53aWR0aCA+IDQwOTYgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKGNvbmZpZy5oZWlnaHQpIHx8IGNvbmZpZy5oZWlnaHQgPD0gMCB8fCBjb25maWcuaGVpZ2h0ID4gNDA5NlxuICAgICAgICApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihjb25maWcpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5jb25zdHJ1Y3RvciBnZXQgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbiBvbmUgb3IgbW9yZSBpbWFnZXNcbiAgICAgICBAdHlwZSB7QXJyYXl9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuaW1hZ2VzID0gY29uZmlnLmltYWdlcztcbiAgICAgIC8qKlxuICAgICAgICogV2lkdGggb2YgZWFjaCBmcmFtZVxuICAgICAgIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMudGlsZXdpZHRoID0gY29uZmlnLndpZHRoO1xuICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbiAgICAgIC8qKlxuICAgICAgICogSGVpZ2h0IG9mIGVhY2ggZnJhbWVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLnRpbGVoZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICAgICAgdGhpcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICAgICAgLyoqXG4gICAgICAgKiBBbmltYXRpb25zIG9mIHRoaXMgc3ByaXRlIHNoZWV0LCBlZy4geyBcIndhbGtkb3duXCI6IFswLCAyLCBcIlwiLCA0MF0sIFwid2Fsa3VwXCIsIFszLCA1LCBcIlwiLCA0MF0gfVxuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9ucyA9IGNvbmZpZy5hbmltYXRpb25zIHx8IHt9O1xuICAgICAgLyoqXG4gICAgICAgKiBDdXJyZW50IGFuaW1hdGlvbidzIG5hbWUsIGVnLiBcIndhbGtkb3duXCIsIFwiYXR0YWNrcmlnaHRcIlxuICAgICAgIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAvKipcbiAgICAgICAqIEN1cnJlbnQgZnJhbWUgbnVtYmVyLCBlZy4gMCwgMSwgMiwgM1xuICAgICAgIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogSWYgYW5pbWF0aW9uVGltZXIgaXMgbm90IG51bGwsIGl0IHBvaW50cyBhbiBhbmltYXRpb24gaXMgcnVubmluZ1xuICAgICAgICogaXQgd2lsbCBiZSBudWxsIG9yIGFuIGhhbmRsZXIgZnJvbSBzZXRJbnRlcnZhbFxuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgZnJhbWVzIHdlIGhhdmVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmZyYW1lQ291bnQgPSAwO1xuXG4gICAgICBmb3IgKGxldCBpbWFnZSBvZiBwcml2YXRlcy5pbWFnZXMpIHtcblxuICAgICAgICBpZiAoIShpbWFnZSBpbnN0YW5jZW9mIEltYWdlKSAmJiAhKGltYWdlLmdldENvbnRleHQgJiYgaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpKSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIHByaXZhdGVzLCB0aGlzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQgZ290IGludmFsaWQgaW1hZ2UsIG5vdCBJbWFnZSBvciBDYW52YXNcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1hZ2Uud2lkdGggPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLndpZHRoKSB8fCBpbWFnZS5oZWlnaHQgPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLmhlaWdodCkpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGltYWdlLCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0IGdvdCBpbnZhbGlkIGltYWdlLCBpbnZhbGlkIHdpZHRoIG9yIGhlaWdodFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb2wgPSBNYXRoLmZsb29yKGltYWdlLndpZHRoIC8gcHJpdmF0ZXMudGlsZXdpZHRoKTtcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaW1hZ2UuaGVpZ2h0IC8gcHJpdmF0ZXMudGlsZWhlaWdodCk7XG4gICAgICAgIHByaXZhdGVzLmZyYW1lQ291bnQgKz0gY29sICogcm93O1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9uZSBTcHJpdGUuU2hlZXQgb2JqZWN0IGl0c2VsZlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJuIGFuIGNvcHkgb2YgdGhpc1xuICAgICAqL1xuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IHNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgIGltYWdlczogcHJpdmF0ZXMuaW1hZ2VzLFxuICAgICAgICB3aWR0aDogcHJpdmF0ZXMudGlsZXdpZHRoLFxuICAgICAgICBoZWlnaHQ6IHByaXZhdGVzLnRpbGVoZWlnaHQsXG4gICAgICAgIGFuaW1hdGlvbnM6IHByaXZhdGVzLmFuaW1hdGlvbnNcbiAgICAgIH0pO1xuICAgICAgc2hlZXQueCA9IHRoaXMueDtcbiAgICAgIHNoZWV0LnkgPSB0aGlzLnk7XG4gICAgICBzaGVldC5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgc2hlZXQuY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIHNoZWV0LnBsYXkodGhpcy5jdXJyZW50RnJhbWUpO1xuICAgICAgc2hlZXQuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgc2hlZXQudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICAgIHJldHVybiBzaGVldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJuIGZhbHNlIGlmIGFuIGFuaW1hdGlvbiBpcyBydW5uaW5nXG4gICAgICovXG4gICAgZ2V0IHBhdXNlZCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy5hbmltYXRpb25UaW1lcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXQgcGF1c2VkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0LnBhdXNlZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybiBjdXJyZW50IGZyYW1lIG51bWJlclxuICAgICAqL1xuICAgIGdldCBjdXJyZW50RnJhbWUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuY3VycmVudEZyYW1lO1xuICAgIH1cblxuICAgIHNldCBjdXJyZW50RnJhbWUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuY3VycmVudEZyYW1lIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gUmV0dXJuXG4gICAgICovXG4gICAgZ2V0IGN1cnJlbnRBbmltYXRpb24gKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudEFuaW1hdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5jdXJyZW50QW5pbWF0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYXkgYSBmcmFtZSBvciBhbiBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2hvaWNlIGZyYW1lIG51bWJlciBvZiBhbmltYXRpb24gbmFtZSwgZWcuIDAgZm9yIGZyYW1lIG9yIFwid2Fsa2Rvd25cIiBmb3IgYW5pbWF0aW9uXG4gICAgICovXG4gICAgcGxheSAoY2hvaWNlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy5hbmltYXRpb25UaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHByaXZhdGVzLmFuaW1hdGlvblRpbWVyKTtcbiAgICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihjaG9pY2UpKSB7XG4gICAgICAgIC8vIEFyZ3VtZW50IHBvaW50cyBhIGZyYW1lXG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSA9IGNob2ljZTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2hvaWNlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8gQXJndW1lbnQgcG9pbnRzIGFuIGFuaW1hdGlvbiBuYW1lXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBwcml2YXRlcy5hbmltYXRpb25zW2Nob2ljZV07XG5cbiAgICAgICAgaWYgKCFhbmltYXRpb24pIHsgLy8gaWYgYW5pbWF0aW9uIGlzIG5vdCBleGlzdFxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYW5pbWF0aW9uLCBwcml2YXRlcy5hbmltYXRpb25zLCBjaG9pY2UpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wbGF5IGludmFsaWQgYW5pbWF0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYW5pbWF0aW9uIGlzIHNpbmdsZSBmcmFtZSBudW1iZXJcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShhbmltYXRpb24pKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbiA9IGNob2ljZTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5KGFuaW1hdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdGFydCBmcmFtZSBudW1iZXJcbiAgICAgICAgbGV0IGJlZ2luID0gbnVsbDtcbiAgICAgICAgLy8gZmluaXNoIGZyYW1lIG51bWJlclxuICAgICAgICBsZXQgZW5kID0gbnVsbDtcbiAgICAgICAgLy8gd2hhdCBhY3Rpb24gYWZ0ZXIgYW5pbWF0aW9uIGZpbmlzaGVkXG4gICAgICAgIGxldCBuZXh0ID0gbnVsbDtcbiAgICAgICAgLy8gdGhlIHNwYWNlIGJldHdlZW4gZWFjaCBmcmFtZSwgbXNcbiAgICAgICAgbGV0IHRpbWUgPSBudWxsO1xuXG4gICAgICAgIGlmIChhbmltYXRpb24gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIC8vIGlmIGFuaW1hdGlvbiBmb3JtYXQgaXMgbGlrZSBbYmVnaW4sIGVuZCwgbmV4dCwgdGltZV1cbiAgICAgICAgICBiZWdpbiA9IGFuaW1hdGlvblswXTtcbiAgICAgICAgICBlbmQgPSBhbmltYXRpb25bMV07XG4gICAgICAgICAgbmV4dCA9IGFuaW1hdGlvblsyXTtcbiAgICAgICAgICB0aW1lID0gYW5pbWF0aW9uWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKGFuaW1hdGlvbi5mcmFtZXMgJiYgYW5pbWF0aW9uLmZyYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgLy8gaWYgYW5pbWF0aW9uIGZvcm1hdCBpcyBsaWtlIHsgZnJhbWVzOiBbYmVnaW4sIGVuZF0sIG5leHQ6IFwibmV4dFwiLCBzcGVlZDogXCJ0aW1lXCIgfVxuICAgICAgICAgIGJlZ2luID0gYW5pbWF0aW9uLmZyYW1lc1swXTtcbiAgICAgICAgICBlbmQgPSBhbmltYXRpb24uZnJhbWVzW2FuaW1hdGlvbi5mcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgbmV4dCA9IGFuaW1hdGlvbi5uZXh0O1xuICAgICAgICAgIHRpbWUgPSBhbmltYXRpb24uc3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIC8vIERhdGEgZW5zdXJlXG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShiZWdpbikgfHwgYmVnaW4gPCAwIHx8IGJlZ2luID49IHByaXZhdGVzLmZyYW1lQ291bnQgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKGVuZCkgfHwgZW5kIDwgMCB8fCBlbmQgPj0gcHJpdmF0ZXMuZnJhbWVDb3VudCB8fFxuICAgICAgICAgICFOdW1iZXIuaXNGaW5pdGUodGltZSkgfHwgdGltZSA8PSAwXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYmVnaW4sIGVuZCwgdGltZSwgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0LnBsYXkgSW52YWxpZCBhbmltYXRpb24gZGF0YVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBsYXkgZmlyc3QgZnJhbWUgaW4gYW5pbWF0aW9uXG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRBbmltYXRpb24gPSBjaG9pY2U7XG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSA9IGJlZ2luO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG5cbiAgICAgICAgLy8gUGxheSBvdGhlciBmcmFtZSBpbiBhbmltYXRpb25cbiAgICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgcHJpdmF0ZXMuY3VycmVudEZyYW1lKys7XG5cbiAgICAgICAgICBpZiAocHJpdmF0ZXMuY3VycmVudEZyYW1lID4gZW5kKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHByaXZhdGVzLmFuaW1hdGlvblRpbWVyKTtcbiAgICAgICAgICAgIHByaXZhdGVzLmFuaW1hdGlvblRpbWVyID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggJiYgcHJpdmF0ZXMuYW5pbWF0aW9uc1tuZXh0XSkge1xuICAgICAgICAgICAgICB0aGlzLnBsYXkobmV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcml2YXRlcy5jdXJyZW50RnJhbWUtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW1pdChcImFuaW1hdGlvbmVuZFwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgIH0sIHRpbWUpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGNob2ljZSwgaW50ZXJuYWwodGhpcykuYW5pbWF0aW9ucywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wbGF5IGhhcyBhbiBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNlcnRhaW4gZnJhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIGZyYW1lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBTcHJpdGUuRnJhbWUgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0RnJhbWUgKGluZGV4KSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpIHtcbiAgICAgICAgaW5kZXggPSBwcml2YXRlcy5jdXJyZW50RnJhbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gcHJpdmF0ZXMuZnJhbWVDb3VudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGluZGV4LCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5nZXRGcmFtZSBpbmRleCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICB9XG5cbiAgICAgIGxldCBmcmFtZSA9IG51bGw7XG4gICAgICBmb3IgKGxldCBpbWFnZSBvZiBwcml2YXRlcy5pbWFnZXMpIHtcbiAgICAgICAgbGV0IGNvbCA9IE1hdGguZmxvb3IoaW1hZ2Uud2lkdGggLyBwcml2YXRlcy50aWxld2lkdGgpO1xuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihpbWFnZS5oZWlnaHQgLyBwcml2YXRlcy50aWxlaGVpZ2h0KTtcbiAgICAgICAgaWYgKGluZGV4IDwgY29sICogcm93KSB7XG4gICAgICAgICAgLy8gd2hpY2ggcm93XG4gICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGluZGV4IC8gY29sKTtcbiAgICAgICAgICAvLyB3aGljaCBjb2x1bW5cbiAgICAgICAgICBsZXQgaSA9IGluZGV4IC0gY29sICogajtcbiAgICAgICAgICBmcmFtZSA9IG5ldyBTcHJpdGUuRnJhbWUgKFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBpICogcHJpdmF0ZXMudGlsZXdpZHRoLCAvLyB4XG4gICAgICAgICAgICBqICogcHJpdmF0ZXMudGlsZWhlaWdodCwgLy8geVxuICAgICAgICAgICAgcHJpdmF0ZXMudGlsZXdpZHRoLFxuICAgICAgICAgICAgcHJpdmF0ZXMudGlsZWhlaWdodFxuICAgICAgICAgICk7XG4gICAgICAgICAgZnJhbWUucGFyZW50ID0gdGhpcztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpbmRleCAtPSAoY29sICogcm93KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmcmFtZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGluZGV4LCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5nZXRGcmFtZSB1bmtub3duIGVycm9yXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGlzIHNoZWV0IG9uIGNlcnRhaW4gcmVuZGVyZXJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgQSByZW5kZXJlciBlbmdpbmUsIGVnLiBTcHJpdGUuV2ViZ2xcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSA9PSBmYWxzZSB8fCB0aGlzLmFscGhhIDw9IDAuMDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBmcmFtZSA9IHRoaXMuZ2V0RnJhbWUodGhpcy5jdXJyZW50RnJhbWUpO1xuXG4gICAgICBpZiAoIWZyYW1lIHx8ICFmcmFtZS5pbWFnZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGZyYW1lLCB0aGlzLmN1cnJlbnRGcmFtZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5kcmF3IGludmFsaWQgZnJhbWVcIik7XG4gICAgICB9XG5cbiAgICAgIGZyYW1lLmRyYXcocmVuZGVyZXIpO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19

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
 * @fileoverview Class Sprite.Input
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var keyTable = {
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "esc": 27,
    "space": 32,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "A": 65, // A
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90, // Z
    "a": 97, // a
    "b": 98,
    "c": 99,
    "d": 100,
    "e": 101,
    "f": 102,
    "g": 103,
    "h": 104,
    "i": 105,
    "j": 106,
    "k": 107,
    "l": 108,
    "m": 109,
    "n": 110,
    "o": 111,
    "p": 112,
    "q": 113,
    "r": 114,
    "s": 115,
    "t": 116,
    "u": 117,
    "v": 118,
    "w": 119,
    "x": 120,
    "y": 121,
    "z": 122 // z
  };

  var pressed = new Map();

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    pressed.set(keyCode, true);
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    if (pressed.has(keyCode)) {
      pressed["delete"](keyCode);
    }
  });

  /**
   * Sprite.Input, only has static methods
   * @class
   */
  Sprite.assign("Input", (function () {
    function SpriteInput() {
      _classCallCheck(this, SpriteInput);
    }

    _createClass(SpriteInput, null, [{
      key: "isPressed",

      /**
       * @param {string} key Key-string ('A', 'a') or key-number (65, 97)
       * @return {boolean} If the key is pressing, return true, otherwise, false
       */
      value: function isPressed(key) {
        if (Number.isFinite(key)) {
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else if (typeof key == "string") {
          key = keyTable[key];
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else {
          console.error(key);
          throw new Error("Sprite.Input.isPressed got invalid argument");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        if (callback) {
          window.addEventListener("keypress", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
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
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenPress got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        if (callback) {
          window.addEventListener("keydown", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
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
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenDown got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        if (callback) {
          window.addEventListener("keyup", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
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
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenUp got invalid arguments");
        }
      }
    }]);

    return SpriteInput;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUc7QUFDYixTQUFLLEVBQUUsQ0FBQztBQUNSLFdBQU8sRUFBRSxFQUFFO0FBQ1gsV0FBTyxFQUFFLEVBQUU7QUFDWCxTQUFLLEVBQUUsRUFBRTtBQUNULFdBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBTSxFQUFFLEVBQUU7QUFDVixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBTSxFQUFFLEVBQUU7QUFDVixPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVB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QTZDLENBQUMsQ0FBQztTQUNoRTtPQUNGOzs7Ozs7OzthQU1hLGdCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxRQUFRLEVBQUU7QUFDWixnQkFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNoRCxpQkFBSyxHQUFHLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlCLGdCQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDOzs7Ozs7QUFDNUIsb0NBQWdCLElBQUksbUlBQUU7b0JBQWIsR0FBRzs7QUFDVixvQkFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLG9CQUFJLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO0FBQzNCLDBCQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Y7ZUFDRjs7Ozs7Ozs7Ozs7Ozs7O1dBQ0YsQ0FBQyxDQUFDO1NBQ0osTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDOUQ7T0FDRjs7O1dBeEYwQixXQUFXO09BeUZ0QyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLklucHV0XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBrZXlUYWJsZSA9IHtcbiAgICBcInRhYlwiOiA5LFxuICAgIFwiZW50ZXJcIjogMTMsXG4gICAgXCJzaGlmdFwiOiAxNixcbiAgICBcImVzY1wiOiAyNyxcbiAgICBcInNwYWNlXCI6IDMyLFxuICAgIFwibGVmdFwiOiAzNyxcbiAgICBcInVwXCI6IDM4LFxuICAgIFwicmlnaHRcIjogMzksXG4gICAgXCJkb3duXCI6IDQwLFxuICAgIFwiMFwiOiA0OCxcbiAgICBcIjFcIjogNDksXG4gICAgXCIyXCI6IDUwLFxuICAgIFwiM1wiOiA1MSxcbiAgICBcIjRcIjogNTIsXG4gICAgXCI1XCI6IDUzLFxuICAgIFwiNlwiOiA1NCxcbiAgICBcIjdcIjogNTUsXG4gICAgXCI4XCI6IDU2LFxuICAgIFwiOVwiOiA1NyxcbiAgICBcIkFcIjogNjUsIC8vIEFcbiAgICBcIkJcIjogNjYsXG4gICAgXCJDXCI6IDY3LFxuICAgIFwiRFwiOiA2OCxcbiAgICBcIkVcIjogNjksXG4gICAgXCJGXCI6IDcwLFxuICAgIFwiR1wiOiA3MSxcbiAgICBcIkhcIjogNzIsXG4gICAgXCJJXCI6IDczLFxuICAgIFwiSlwiOiA3NCxcbiAgICBcIktcIjogNzUsXG4gICAgXCJMXCI6IDc2LFxuICAgIFwiTVwiOiA3NyxcbiAgICBcIk5cIjogNzgsXG4gICAgXCJPXCI6IDc5LFxuICAgIFwiUFwiOiA4MCxcbiAgICBcIlFcIjogODEsXG4gICAgXCJSXCI6IDgyLFxuICAgIFwiU1wiOiA4MyxcbiAgICBcIlRcIjogODQsXG4gICAgXCJVXCI6IDg1LFxuICAgIFwiVlwiOiA4NixcbiAgICBcIldcIjogODcsXG4gICAgXCJYXCI6IDg4LFxuICAgIFwiWVwiOiA4OSxcbiAgICBcIlpcIjogOTAsIC8vIFpcbiAgICBcImFcIjogOTcsIC8vIGFcbiAgICBcImJcIjogOTgsXG4gICAgXCJjXCI6IDk5LFxuICAgIFwiZFwiOiAxMDAsXG4gICAgXCJlXCI6IDEwMSxcbiAgICBcImZcIjogMTAyLFxuICAgIFwiZ1wiOiAxMDMsXG4gICAgXCJoXCI6IDEwNCxcbiAgICBcImlcIjogMTA1LFxuICAgIFwialwiOiAxMDYsXG4gICAgXCJrXCI6IDEwNyxcbiAgICBcImxcIjogMTA4LFxuICAgIFwibVwiOiAxMDksXG4gICAgXCJuXCI6IDExMCxcbiAgICBcIm9cIjogMTExLFxuICAgIFwicFwiOiAxMTIsXG4gICAgXCJxXCI6IDExMyxcbiAgICBcInJcIjogMTE0LFxuICAgIFwic1wiOiAxMTUsXG4gICAgXCJ0XCI6IDExNixcbiAgICBcInVcIjogMTE3LFxuICAgIFwidlwiOiAxMTgsXG4gICAgXCJ3XCI6IDExOSxcbiAgICBcInhcIjogMTIwLFxuICAgIFwieVwiOiAxMjEsXG4gICAgXCJ6XCI6IDEyMiAvLyB6XG4gIH07XG5cbiAgbGV0IHByZXNzZWQgPSBuZXcgTWFwKCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBwcmVzc2VkLnNldChrZXlDb2RlLCB0cnVlKTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgaWYgKHByZXNzZWQuaGFzKGtleUNvZGUpKSB7XG4gICAgICBwcmVzc2VkLmRlbGV0ZShrZXlDb2RlKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTcHJpdGUuSW5wdXQsIG9ubHkgaGFzIHN0YXRpYyBtZXRob2RzXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIklucHV0XCIsIGNsYXNzIFNwcml0ZUlucHV0IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgS2V5LXN0cmluZyAoJ0EnLCAnYScpIG9yIGtleS1udW1iZXIgKDY1LCA5NylcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiB0aGUga2V5IGlzIHByZXNzaW5nLCByZXR1cm4gdHJ1ZSwgb3RoZXJ3aXNlLCBmYWxzZVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1ByZXNzZWQgKGtleSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShrZXkpKSB7XG4gICAgICAgIGlmIChwcmVzc2VkLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAga2V5ID0ga2V5VGFibGVba2V5XTtcbiAgICAgICAgaWYgKHByZXNzZWQuaGFzKGtleSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGtleSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5JbnB1dC5pc1ByZXNzZWQgZ290IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBLZXlzIHRvIG1vbml0b3IsIGVnLiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJhXCIsIFwiYlwiLCBcImNcIl1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBXaGVuIGtleSBpbiBrZXlzIGlzIHByZXNzZWQsIGNhbGxiYWNrXG4gICAgICovXG4gICAgc3RhdGljIHdoZW5QcmVzcyAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgbGV0IGNvZGUgPSBrZXlUYWJsZVtrZXldO1xuICAgICAgICAgICAgaWYgKGNvZGUgJiYgY29kZSA9PSBrZXlDb2RlKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY2FsbGJhY2spO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuSW5wdXQud2hlblByZXNzIGdvdCBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIEtleXMgdG8gbW9uaXRvciwgZWcuIFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcImFcIiwgXCJiXCIsIFwiY1wiXVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdoZW4ga2V5IGluIGtleXMgaXMgcHJlc3NlZCwgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgd2hlbkRvd24gKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgbGV0IGNvZGUgPSBrZXlUYWJsZVtrZXldO1xuICAgICAgICAgICAgaWYgKGNvZGUgJiYgY29kZSA9PSBrZXlDb2RlKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY2FsbGJhY2spO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuSW5wdXQud2hlbkRvd24gZ290IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgS2V5cyB0byBtb25pdG9yLCBlZy4gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiYVwiLCBcImJcIiwgXCJjXCJdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgV2hlbiBrZXkgaW4ga2V5cyBpcyBwcmVzc2VkLCBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXRpYyB3aGVuVXAgKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBjb2RlID0ga2V5VGFibGVba2V5XTtcbiAgICAgICAgICAgIGlmIChjb2RlICYmIGNvZGUgPT0ga2V5Q29kZSkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGNhbGxiYWNrKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLklucHV0LndoZW5VcCBnb3QgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19

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
 * @fileoverview Create a shape
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
   * Class Sprite.Shape
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Shape", (function (_Sprite$Display) {
    _inherits(SpriteShape, _Sprite$Display);

    /**
     * construct Sprite.Shape
     * @constructor
     */

    function SpriteShape() {
      _classCallCheck(this, SpriteShape);

      _get(Object.getPrototypeOf(SpriteShape.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.children = [];
      this.width = 0;
      this.height = 0;
      privates.image = null;
    }

    _createClass(SpriteShape, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var shape = new Sprite.Shape();
        internal(shape).children = privates.children.slice();
        internal(shape).image = privates.image;
        shape.width = this.width;
        shape.height = this.height;
        shape.x = this.x;
        shape.y = this.y;
        shape.centerX = this.centerX;
        shape.centerY = this.centerY;
        return shape;
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.children = [];
        this.width = 0;
        this.height = 0;
        this.generate();
        return this;
      }
    }, {
      key: "makeConfig",
      value: function makeConfig(defaultConfig, userConfig) {
        if (userConfig) {
          for (var key in userConfig) {
            defaultConfig[key] = userConfig[key];
          }
        }
        var ret = [];
        for (var key in defaultConfig) {
          ret.push(key + "=\"" + defaultConfig[key] + "\"");
        }
        return ret.join(" ");
      }
    }, {
      key: "rect",
      value: function rect(userConfig) {
        var privates = internal(this);
        var config = {
          "x": 0,
          "y": 0,
          "width": 10,
          "height": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<rect " + this.makeConfig(config, userConfig) + " />");

        if (config.x + config.width > this.width) {
          this.width = config.x + config.width;
        }
        if (config.y + config.height > this.height) {
          this.height = config.y + config.height;
        }
        this.generate();
      }
    }, {
      key: "circle",
      value: function circle(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "r": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<circle " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.r > this.width) {
          this.width = config.cx + config.r;
        }
        if (config.cy + config.r > this.height) {
          this.height = config.cy + config.r;
        }
        this.generate();
      }
    }, {
      key: "ellipse",
      value: function ellipse(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "rx": 5,
          "ry": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<ellipse " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.rx > this.width) {
          this.width = config.cx + config.rx;
        }
        if (config.cy + config.ry > this.height) {
          this.height = config.cy + config.ry;
        }
        this.generate();
      }
    }, {
      key: "line",
      value: function line(userConfig) {
        var privates = internal(this);
        var config = {
          "x1": 10,
          "y1": 10,
          "x2": 20,
          "y2": 20,
          "stroke": "black",
          "stroke-width": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<line " + this.makeConfig(config, userConfig) + " />");

        if (Math.max(config.x1, config.x2) > this.width) {
          this.width = Math.max(config.x1, config.x2);
        }
        if (Math.max(config.y1, config.y2) > this.height) {
          this.height = Math.max(config.y1, config.y2);
        }
        this.generate();
      }
    }, {
      key: "polyline",
      value: function polyline(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20, 20, 30, 20, 30, 30, 20, 30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var max = -1;
        config.points.split(/, /).forEach(function (element) {
          var number = parseInt(element);
          if (!isNaN(number) && number > max) {
            max = number;
          }
        });

        if (max != -1 && max > this.width) {
          this.width = max;
        }
        if (max != -1 && max > this.height) {
          this.height = max;
        }
        this.generate();
      }
    }, {
      key: "polygon",
      value: function polygon(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20,20 30,20 30,30 20,30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var width = -1;
        var height = -1;
        // split points by comma or space
        config.points.split(/,| /).forEach(function (element, index) {
          var number = parseInt(element);
          if (index % 2 == 0) {
            // even
            if (number > width) width = number;
          } else {
            // odds
            if (number > height) height = number;
          }
        });

        if (width > 0 && width > this.width) this.width = width;
        if (height > 0 && height > this.height) this.height = height;
        this.generate();
      }
    }, {
      key: "generate",
      value: function generate() {
        var _this = this;

        var privates = internal(this);
        var svg = "<?xml version=\"1.0\"?>\n<svg width=\"" + this.width + "\" height=\"" + this.height + "\" " + ("style=\"width: " + this.width + "px; height: " + this.height + "px;\" ") + "xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            svg += "  " + child + "\n";
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

        svg += "</svg>";

        var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        var url = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = url;

        var Done = function Done() {
          privates.image = image;
          window.URL.revokeObjectURL(url);
          _this.emit("change");
        };

        if (image.complete) {
          Done();
        } else {
          image.onload = Done;
        }
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        var image = privates.image;
        if (image instanceof Image && image.width > 0 && image.height > 0) {
          this.drawImage(renderer, image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        }
      }
    }]);

    return SpriteShape;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hhcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7O0FBSzFCLGFBTGUsV0FBVyxHQUt2Qjs0QkFMWSxXQUFXOztBQU1wQyxpQ0FOeUIsV0FBVyw2Q0FNNUI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixjQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUN2Qjs7aUJBWjBCLFdBQVc7O2FBY2hDLGlCQUFHO0FBQ1AsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckQsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUN2QyxhQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsYUFBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLGFBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FB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LFFBQVEsRUFBRTtBQUNkLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNCLFlBQUksS0FBSyxZQUFZLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqRSxjQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQzVCLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxFQUMvQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDaEMsQ0FBQztTQUNIO09BQ0Y7OztXQWpRMEIsV0FBVztLQUFTLE1BQU0sQ0FBQyxPQUFPLEVBa1E3RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlU2hhcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ3JlYXRlIGEgc2hhcGVcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuU2hhcGVcbiAgICogQGNsYXNzXG4gICAqIEBleHRlbmRzIFNwcml0ZS5EaXNwbGF5XG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiU2hhcGVcIiwgY2xhc3MgU3ByaXRlU2hhcGUgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0IFNwcml0ZS5TaGFwZVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuID0gW107XG4gICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgIHByaXZhdGVzLmltYWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBzaGFwZSA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgIGludGVybmFsKHNoYXBlKS5jaGlsZHJlbiA9IHByaXZhdGVzLmNoaWxkcmVuLnNsaWNlKCk7XG4gICAgICBpbnRlcm5hbChzaGFwZSkuaW1hZ2UgPSBwcml2YXRlcy5pbWFnZTtcbiAgICAgIHNoYXBlLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgIHNoYXBlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgc2hhcGUueCA9IHRoaXMueDtcbiAgICAgIHNoYXBlLnkgPSB0aGlzLnk7XG4gICAgICBzaGFwZS5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgc2hhcGUuY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIHJldHVybiBzaGFwZTtcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuID0gW107XG4gICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1ha2VDb25maWcgKGRlZmF1bHRDb25maWcsIHVzZXJDb25maWcpIHtcbiAgICAgIGlmICh1c2VyQ29uZmlnKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB1c2VyQ29uZmlnKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZ1trZXldID0gdXNlckNvbmZpZ1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgcmV0ID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gZGVmYXVsdENvbmZpZykge1xuICAgICAgICByZXQucHVzaChgJHtrZXl9PVwiJHtkZWZhdWx0Q29uZmlnW2tleV19XCJgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgcmVjdCAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcInhcIjogMCxcbiAgICAgICAgXCJ5XCI6IDAsXG4gICAgICAgIFwid2lkdGhcIjogMTAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDEwLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8cmVjdCAke3RoaXMubWFrZUNvbmZpZyhjb25maWcsIHVzZXJDb25maWcpfSAvPmApO1xuXG4gICAgICBpZiAoY29uZmlnLnggKyBjb25maWcud2lkdGggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBjb25maWcueCArIGNvbmZpZy53aWR0aDtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcueSArIGNvbmZpZy5oZWlnaHQgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy55ICsgY29uZmlnLmhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBjaXJjbGUgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJjeFwiOiAxMCxcbiAgICAgICAgXCJjeVwiOiAxMCxcbiAgICAgICAgXCJyXCI6IDEwLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8Y2lyY2xlICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGlmIChjb25maWcuY3ggKyBjb25maWcuciA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy5jeCArIGNvbmZpZy5yO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5jeSArIGNvbmZpZy5yID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBjb25maWcuY3kgKyBjb25maWcucjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBlbGxpcHNlICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwiY3hcIjogMTAsXG4gICAgICAgIFwiY3lcIjogMTAsXG4gICAgICAgIFwicnhcIjogNSxcbiAgICAgICAgXCJyeVwiOiAxMCxcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPGVsbGlwc2UgJHt0aGlzLm1ha2VDb25maWcoY29uZmlnLCB1c2VyQ29uZmlnKX0gLz5gKTtcblxuICAgICAgaWYgKGNvbmZpZy5jeCArIGNvbmZpZy5yeCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy5jeCArIGNvbmZpZy5yeDtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuY3kgKyBjb25maWcucnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5jeSArIGNvbmZpZy5yeTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBsaW5lICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwieDFcIjogMTAsXG4gICAgICAgIFwieTFcIjogMTAsXG4gICAgICAgIFwieDJcIjogMjAsXG4gICAgICAgIFwieTJcIjogMjAsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxsaW5lICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGlmIChNYXRoLm1heChjb25maWcueDEsIGNvbmZpZy54MikgPiB0aGlzLndpZHRoKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBNYXRoLm1heChjb25maWcueDEsIGNvbmZpZy54Mik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0aC5tYXgoY29uZmlnLnkxLCBjb25maWcueTIpID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChjb25maWcueTEsIGNvbmZpZy55Mik7XG4gICAgICB9XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgcG9seWxpbmUgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJwb2ludHNcIjogXCIyMCwgMjAsIDMwLCAyMCwgMzAsIDMwLCAyMCwgMzBcIixcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPHBvbHlsaW5lICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGxldCBtYXggPSAtMTtcbiAgICAgIGNvbmZpZy5wb2ludHMuc3BsaXQoLywgLykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBsZXQgbnVtYmVyID0gcGFyc2VJbnQoZWxlbWVudCk7XG4gICAgICAgIGlmICghaXNOYU4obnVtYmVyKSAmJiBudW1iZXIgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBudW1iZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobWF4ICE9IC0xICYmIG1heCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IG1heDtcbiAgICAgIH1cbiAgICAgIGlmIChtYXggIT0gLTEgJiYgbWF4ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBtYXg7XG4gICAgICB9XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgcG9seWdvbiAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcInBvaW50c1wiOiBcIjIwLDIwIDMwLDIwIDMwLDMwIDIwLDMwXCIsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxwb2x5bGluZSAke3RoaXMubWFrZUNvbmZpZyhjb25maWcsIHVzZXJDb25maWcpfSAvPmApO1xuXG4gICAgICBsZXQgd2lkdGggPSAtMTtcbiAgICAgIGxldCBoZWlnaHQgPSAtMTtcbiAgICAgIC8vIHNwbGl0IHBvaW50cyBieSBjb21tYSBvciBzcGFjZVxuICAgICAgY29uZmlnLnBvaW50cy5zcGxpdCgvLHwgLykuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IG51bWJlciA9IHBhcnNlSW50KGVsZW1lbnQpO1xuICAgICAgICBpZiAoaW5kZXggJSAyID09IDApIHsgLy8gZXZlblxuICAgICAgICAgIGlmIChudW1iZXIgPiB3aWR0aClcbiAgICAgICAgICAgIHdpZHRoID0gbnVtYmVyO1xuICAgICAgICB9IGVsc2UgeyAvLyBvZGRzXG4gICAgICAgICAgaWYgKG51bWJlciA+IGhlaWdodClcbiAgICAgICAgICAgIGhlaWdodCA9IG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh3aWR0aCA+IDAgJiYgd2lkdGggPiB0aGlzLndpZHRoKVxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICBpZiAoaGVpZ2h0ID4gMCAmJiBoZWlnaHQgPiB0aGlzLmhlaWdodClcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgc3ZnID0gYDw/eG1sIHZlcnNpb249XCIxLjBcIj8+XFxuPHN2ZyB3aWR0aD1cIiR7dGhpcy53aWR0aH1cIiBoZWlnaHQ9XCIke3RoaXMuaGVpZ2h0fVwiIGAgK1xuICAgICAgICBgc3R5bGU9XCJ3aWR0aDogJHt0aGlzLndpZHRofXB4OyBoZWlnaHQ6ICR7dGhpcy5oZWlnaHR9cHg7XCIgYCArXG4gICAgICAgIGB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiPlxcbmA7XG5cbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHByaXZhdGVzLmNoaWxkcmVuKSB7XG4gICAgICAgIHN2ZyArPSBgICAke2NoaWxkfVxcbmA7XG4gICAgICB9XG5cbiAgICAgIHN2ZyArPSBcIjwvc3ZnPlwiO1xuXG4gICAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFtzdmddLCB7dHlwZTogXCJpbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLThcIn0pO1xuICAgICAgbGV0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZS5zcmMgPSB1cmw7XG5cbiAgICAgIGxldCBEb25lID0gKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcbiAgICAgICAgRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gRG9uZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBpbWFnZSA9IHByaXZhdGVzLmltYWdlO1xuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSW1hZ2UgJiYgaW1hZ2Uud2lkdGggPiAwICYmIGltYWdlLmhlaWdodCA+IDApIHtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UocmVuZGVyZXIsIGltYWdlLFxuICAgICAgICAgIDAsIDAsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgMCwgMCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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
 * @fileoverview Define Sprite.Bitmap
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

  Sprite.assign("Bitmap", (function (_Sprite$Display) {
    _inherits(SpriteBitmap, _Sprite$Display);

    /**
     * Sprite.Bitmap's constructor
     * @constructor
     */

    function SpriteBitmap(image) {
      _classCallCheck(this, SpriteBitmap);

      _get(Object.getPrototypeOf(SpriteBitmap.prototype), "constructor", this).call(this);

      if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
        console.error(image, this);
        throw new Error("Sprite.Bitmap got invalid image, not Image or Canvas");
      }

      if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
        console.error(image);
        throw new Error("Sprite.Bitmap got invalid image, invalid width or height");
      }

      internal(this).image = image;
    }

    _createClass(SpriteBitmap, [{
      key: "clone",
      value: function clone() {
        var bitmap = new Sprite.Bitmap(internal(this).image);
        bitmap.x = this.x;
        bitmap.y = this.y;
        bitmap.centerX = this.centerX;
        bitmap.centerY = this.centerY;
        bitmap.alpha = this.alpha;
        bitmap.visible = this.visible;
        return bitmap;
      }

      /**
       * @return {Image} Return Sprite.Bitmap's image
       */
    }, {
      key: "draw",

      /**
       * @param {Object} renderer Draw image on the renderer
       */
      value: function draw(renderer) {
        if (this.alpha <= 0.01 || this.visible != true) {
          return;
        }
        var image = internal(this).image;
        this.drawImage(renderer, image, 0, 0, image.width, image.height);
      }
    }, {
      key: "image",
      get: function get() {
        return internal(this).image;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.image readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's width
       */
    }, {
      key: "width",
      get: function get() {
        return internal(this).image.width;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.width readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's height
       */
    }, {
      key: "height",
      get: function get() {
        return internal(this).image.height;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.height readonly");
      }
    }]);

    return SpriteBitmap;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQml0bWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUTtjQUFRLFlBQVk7Ozs7Ozs7QUFLNUIsYUFMZ0IsWUFBWSxDQUszQixLQUFLLEVBQUU7NEJBTFEsWUFBWTs7QUFNdEMsaUNBTjBCLFlBQVksNkNBTTlCOztBQUVSLFVBQUksRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFBLEFBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDOUUsZUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0IsY0FBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO09BQ3pFOztBQUVELFVBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVHLGVBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsY0FBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO09BQzdFOztBQUVELGNBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQzlCOztpQkFuQjJCLFlBQVk7O2FBcUJsQyxpQkFBRztBQUNQLFlBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckQsY0FBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGNBQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsQixjQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDOUIsY0FBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzlCLGNBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQixjQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDOUIsZUFBTyxNQUFNLENBQUM7T0FDZjs7Ozs7Ozs7Ozs7YUF5Q0ksY0FBQyxRQUFRLEVBQUU7QUFDZCxZQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO0FBQzlDLGlCQUFPO1NBQ1I7QUFDRCxZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2xFOzs7V0ExQ1MsZUFBRztBQUNYLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztPQUM3QjtXQUVTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLGVBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsY0FBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO09BQ2pEOzs7Ozs7O1dBS1MsZUFBRztBQUNYLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7T0FDbkM7V0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixlQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLGNBQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztPQUNqRDs7Ozs7OztXQUtVLGVBQUc7QUFDWixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO09BQ3BDO1dBRVUsYUFBQyxLQUFLLEVBQUU7QUFDakIsZUFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixjQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7T0FDbEQ7OztXQWxFMkIsWUFBWTtLQUFTLE1BQU0sQ0FBQyxPQUFPLEVBK0UvRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlQml0bWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERlZmluZSBTcHJpdGUuQml0bWFwXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBTcHJpdGUuYXNzaWduKFwiQml0bWFwXCIsIGNsYXNzIFNwcml0ZUJpdG1hcCBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcbiAgICAvKipcbiAgICAgKiBTcHJpdGUuQml0bWFwJ3MgY29uc3RydWN0b3JcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoaW1hZ2UpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIGlmICghKGltYWdlIGluc3RhbmNlb2YgSW1hZ2UpICYmICEoaW1hZ2UuZ2V0Q29udGV4dCAmJiBpbWFnZS5nZXRDb250ZXh0KFwiMmRcIikpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQml0bWFwIGdvdCBpbnZhbGlkIGltYWdlLCBub3QgSW1hZ2Ugb3IgQ2FudmFzXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2Uud2lkdGggPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLndpZHRoKSB8fCBpbWFnZS5oZWlnaHQgPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLmhlaWdodCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihpbWFnZSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5CaXRtYXAgZ290IGludmFsaWQgaW1hZ2UsIGludmFsaWQgd2lkdGggb3IgaGVpZ2h0XCIpO1xuICAgICAgfVxuXG4gICAgICBpbnRlcm5hbCh0aGlzKS5pbWFnZSA9IGltYWdlO1xuICAgIH1cblxuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBiaXRtYXAgPSBuZXcgU3ByaXRlLkJpdG1hcChpbnRlcm5hbCh0aGlzKS5pbWFnZSk7XG4gICAgICBiaXRtYXAueCA9IHRoaXMueDtcbiAgICAgIGJpdG1hcC55ID0gdGhpcy55O1xuICAgICAgYml0bWFwLmNlbnRlclggPSB0aGlzLmNlbnRlclg7XG4gICAgICBiaXRtYXAuY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIGJpdG1hcC5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICBiaXRtYXAudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICAgIHJldHVybiBiaXRtYXA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7SW1hZ2V9IFJldHVybiBTcHJpdGUuQml0bWFwJ3MgaW1hZ2VcbiAgICAgKi9cbiAgICBnZXQgaW1hZ2UgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmltYWdlO1xuICAgIH1cblxuICAgIHNldCBpbWFnZSAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQml0bWFwLmltYWdlIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJuIFNwcml0ZS5CaXRtYXAncyB3aWR0aFxuICAgICAqL1xuICAgIGdldCB3aWR0aCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaW1hZ2Uud2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IHdpZHRoICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5CaXRtYXAud2lkdGggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm4gU3ByaXRlLkJpdG1hcCdzIGhlaWdodFxuICAgICAqL1xuICAgIGdldCBoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmltYWdlLmhlaWdodDtcbiAgICB9XG5cbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5CaXRtYXAuaGVpZ2h0IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlciBEcmF3IGltYWdlIG9uIHRoZSByZW5kZXJlclxuICAgICAqL1xuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICBpZiAodGhpcy5hbHBoYSA8PSAwLjAxIHx8IHRoaXMudmlzaWJsZSAhPSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBpbWFnZSA9IGludGVybmFsKHRoaXMpLmltYWdlO1xuICAgICAgdGhpcy5kcmF3SW1hZ2UocmVuZGVyZXIsIGltYWdlLCAwLCAwLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
