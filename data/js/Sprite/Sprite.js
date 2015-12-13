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
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztNQUVQLFVBQVU7YUFBVixVQUFVOzRCQUFWLFVBQVU7OztpQkFBVixVQUFVOzs2QkFDTixJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ3BCLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNoQyxvQkFBVSxFQUFFLEtBQUs7QUFDakIsc0JBQVksRUFBRSxLQUFLO0FBQ25CLGtCQUFRLEVBQUUsS0FBSztBQUNmLGVBQUssRUFBRSxNQUFNO1NBQ2QsQ0FBQyxDQUFDO0FBQ0gsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBVEcsVUFBVTs7O0FBVWYsR0FBQzs7QUFFRixNQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFOzs7Ozs7QUFBQyxBQU05QyxRQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZOzs7OztBQUtyQyxRQUFJLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFdBQU8sVUFBVSxNQUFNLEVBQUU7QUFDdkIsVUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUNqQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDMUI7QUFDRCxhQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0IsQ0FBQztHQUNILENBQUM7Ozs7Ozs7QUFBQyxBQU9ILFFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNwQyxRQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsS0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQixXQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzFCLENBQUM7Ozs7OztBQUFDLEFBTUgsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxNQUFNLEVBQUU7QUFDdEMsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUMzQyxDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFHLEVBQUUsVUFBVSxFQUFFO0FBQy9DLFFBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUNmLFNBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDekIsTUFBTTtBQUNMLFdBQUssSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO0FBQ25CLGtCQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUNoQztLQUNGO0dBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVk7O0FBRWhDLFdBQU8sc0NBQXNDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtBQUN6RSxVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7QUFDWixlQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkIsTUFBTTtBQUNMLGVBQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxDQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUN2QztLQUNGLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxRQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsRUFBRTs7QUFFbkMsV0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDdkQsQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxFQUFFOztBQUVuQyxXQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNyRCxDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lIHRoZSBTcHJpdGUgaW4gd2luZG93LCBkZWNsYXJlIHRoZSBTcHJpdGUuQmFzZVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgY2xhc3MgU3ByaXRlQ29yZSB7XG4gICAgYXNzaWduIChuYW1lLCBvYmplY3QpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvYmplY3RcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuXG4gIGxldCBTcHJpdGUgPSB3aW5kb3cuU3ByaXRlID0gbmV3IFNwcml0ZUNvcmUoKTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gU3ByaXRlLk5hbWVzcGFjZSwgcmV0dXJuIGFuIHVuaXF1ZSBQcml2YXRlLVByb3BlcnRpZXMgZnVuY3Rpb25cbiAgICogZm9yIGphdmFzY3JpcHQgcHJpdmF0ZSBwcm9wZXJ0aWVzIG5lZWQsIGZvciBlczZcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJOYW1lc3BhY2VcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIFVzaW5nIGNsb3N1cmUgdmFyaWFibGUgc3RvcmUgcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgICogYW5kIGRpZmZlcmVudCBmaWxlIGhhdmUgZGlmZmVyZW50IFwicHJpdmF0ZVByb3BlcnRpZXNcIlxuICAgICAqL1xuICAgIGxldCBwcml2YXRlcyA9IG5ldyBXZWFrTWFwKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgIGlmIChwcml2YXRlcy5oYXMob2JqZWN0KSA9PSBmYWxzZSkge1xuICAgICAgICBwcml2YXRlcy5zZXQob2JqZWN0LCB7fSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuZ2V0KG9iamVjdCk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBOIFRoZSBtaW4gbnVtYmVyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBNIFRoZSBtYXggbnVtYmVyXG4gICAqIEByZXR1cm4ge251bWJlcn0gQSByYW5kb20gaW50ZWdlciBOIDw9IHJldHVybiA8IE0sIGFrYS4gW04sIE0pXG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwicmFuZFwiLCBmdW5jdGlvbiAoTiwgTSkge1xuICAgIGxldCByID0gTSAtIE47XG4gICAgciAqPSBNYXRoLnJhbmRvbSgpO1xuICAgIHJldHVybiBOICsgTWF0aC5mbG9vcihyKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB3ZSByZXF1aXJlIGNvcHlcbiAgICogQHJldHVybiB7T2JqZWN0fSBBIGRlZXAgY29weSBvZiBvYmplY3RcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJjb3B5XCIsIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpKTtcbiAgfSk7XG5cbiAgU3ByaXRlLmFzc2lnbihcImVhY2hcIiwgZnVuY3Rpb24gKG9iaiwgZnVuY3Rpb25hbCkge1xuICAgIGlmIChvYmouZm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb25hbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgZnVuY3Rpb25hbChvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgU3ByaXRlLmFzc2lnbihcInV1aWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIGdlbmVyYXRlIGEgVVVJRFxuICAgIHJldHVybiBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoL3h8eS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgbGV0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNik7XG4gICAgICBpZiAoYyA9PSBcInhcIikge1xuICAgICAgICByZXR1cm4gci50b1N0cmluZygxNik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKHIgJiAweDAzIHwgMHgwOCkudG9TdHJpbmcoMTYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBTcHJpdGUuYXNzaWduKFwiYnRvYVwiLCBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gY29udmVydCBzdHIgdG8gYmFzZTY0XG4gICAgcmV0dXJuIHdpbmRvdy5idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gIH0pO1xuXG4gIFNwcml0ZS5hc3NpZ24oXCJhdG9iXCIsIGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyBjb252ZXJ0IGJhc2U2NCBzdHIgdG8gb3JpZ2luYWxcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZSh3aW5kb3cuYXRvYihzdHIpKSk7XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
