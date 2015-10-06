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
