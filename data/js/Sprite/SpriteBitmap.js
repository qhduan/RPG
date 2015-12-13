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
 * @fileoverview Define Sprite.Bitmap
 * @author mail@qhduan.com (QH Duan)
 */

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteBitmap).call(this));

      if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
        console.error(image, _this);
        throw new Error("Sprite.Bitmap got invalid image, not Image or Canvas");
      }

      if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
        console.error(image);
        throw new Error("Sprite.Bitmap got invalid image, invalid width or height");
      }

      internal(_this).image = image;
      return _this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlQml0bWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUTtjQUFRLFlBQVk7Ozs7Ozs7QUFLeEMsYUFMNEIsWUFBWSxDQUszQixLQUFLLEVBQUU7NEJBTFEsWUFBWTs7eUVBQVosWUFBWTs7QUFRdEMsVUFBSSxFQUFFLEtBQUssWUFBWSxLQUFLLENBQUEsQUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBLEFBQUMsRUFBRTtBQUM5RSxlQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBTyxDQUFDO0FBQzNCLGNBQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztPQUN6RTs7QUFFRCxVQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM1RyxlQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLGNBQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztPQUM3RTs7QUFFRCxjQUFRLE9BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztLQUM5Qjs7aUJBbkIyQixZQUFZOzs4QkFxQi9CO0FBQ1AsWUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxjQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEIsY0FBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGNBQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM5QixjQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDOUIsY0FBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFCLGNBQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM5QixlQUFPLE1BQU0sQ0FBQztPQUNmOzs7Ozs7Ozs7Ozs7MkJBeUNLLFFBQVEsRUFBRTtBQUNkLFlBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDOUMsaUJBQU87U0FDUjtBQUNELFlBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDakMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDbEU7OzswQkExQ1k7QUFDWCxlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7T0FDN0I7d0JBRVUsS0FBSyxFQUFFO0FBQ2hCLGVBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsY0FBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO09BQ2pEOzs7Ozs7OzswQkFLWTtBQUNYLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7T0FDbkM7d0JBRVUsS0FBSyxFQUFFO0FBQ2hCLGVBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsY0FBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO09BQ2pEOzs7Ozs7OzswQkFLYTtBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FDcEM7d0JBRVcsS0FBSyxFQUFFO0FBQ2pCLGVBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsY0FBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO09BQ2xEOzs7V0FsRTJCLFlBQVk7S0FBUyxNQUFNLENBQUMsT0FBTyxFQStFL0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUJpdG1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEZWZpbmUgU3ByaXRlLkJpdG1hcFxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgU3ByaXRlLmFzc2lnbihcIkJpdG1hcFwiLCBjbGFzcyBTcHJpdGVCaXRtYXAgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG4gICAgLyoqXG4gICAgICogU3ByaXRlLkJpdG1hcCdzIGNvbnN0cnVjdG9yXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGltYWdlKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBpZiAoIShpbWFnZSBpbnN0YW5jZW9mIEltYWdlKSAmJiAhKGltYWdlLmdldENvbnRleHQgJiYgaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGltYWdlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkJpdG1hcCBnb3QgaW52YWxpZCBpbWFnZSwgbm90IEltYWdlIG9yIENhbnZhc1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGltYWdlLndpZHRoIDw9IDAgfHwgIU51bWJlci5pc0Zpbml0ZShpbWFnZS53aWR0aCkgfHwgaW1hZ2UuaGVpZ2h0IDw9IDAgfHwgIU51bWJlci5pc0Zpbml0ZShpbWFnZS5oZWlnaHQpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQml0bWFwIGdvdCBpbnZhbGlkIGltYWdlLCBpbnZhbGlkIHdpZHRoIG9yIGhlaWdodFwiKTtcbiAgICAgIH1cblxuICAgICAgaW50ZXJuYWwodGhpcykuaW1hZ2UgPSBpbWFnZTtcbiAgICB9XG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICBsZXQgYml0bWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoaW50ZXJuYWwodGhpcykuaW1hZ2UpO1xuICAgICAgYml0bWFwLnggPSB0aGlzLng7XG4gICAgICBiaXRtYXAueSA9IHRoaXMueTtcbiAgICAgIGJpdG1hcC5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgYml0bWFwLmNlbnRlclkgPSB0aGlzLmNlbnRlclk7XG4gICAgICBiaXRtYXAuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgYml0bWFwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgICByZXR1cm4gYml0bWFwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge0ltYWdlfSBSZXR1cm4gU3ByaXRlLkJpdG1hcCdzIGltYWdlXG4gICAgICovXG4gICAgZ2V0IGltYWdlICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pbWFnZTtcbiAgICB9XG5cbiAgICBzZXQgaW1hZ2UgKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkJpdG1hcC5pbWFnZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybiBTcHJpdGUuQml0bWFwJ3Mgd2lkdGhcbiAgICAgKi9cbiAgICBnZXQgd2lkdGggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmltYWdlLndpZHRoO1xuICAgIH1cblxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQml0bWFwLndpZHRoIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJuIFNwcml0ZS5CaXRtYXAncyBoZWlnaHRcbiAgICAgKi9cbiAgICBnZXQgaGVpZ2h0ICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pbWFnZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuQml0bWFwLmhlaWdodCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgRHJhdyBpbWFnZSBvbiB0aGUgcmVuZGVyZXJcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgaWYgKHRoaXMuYWxwaGEgPD0gMC4wMSB8fCB0aGlzLnZpc2libGUgIT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgaW1hZ2UgPSBpbnRlcm5hbCh0aGlzKS5pbWFnZTtcbiAgICAgIHRoaXMuZHJhd0ltYWdlKHJlbmRlcmVyLCBpbWFnZSwgMCwgMCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XG4gICAgfVxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
