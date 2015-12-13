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
