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
