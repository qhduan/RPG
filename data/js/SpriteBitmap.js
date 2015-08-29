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

/// @file SpriteBitmap.js
/// @namespace Sprite
/// class Sprite.Bitmap

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

  Sprite.Bitmap = (function (_Sprite$Display) {
    _inherits(Bitmap, _Sprite$Display);

    function Bitmap(image) {
      _classCallCheck(this, Bitmap);

      _get(Object.getPrototypeOf(Bitmap.prototype), "constructor", this).call(this);
      this._image = image;
      this._width = image.width;
      this._height = image.height;
    }

    _createClass(Bitmap, [{
      key: "clone",
      value: function clone() {
        var bitmap = new Bitmap(this._image);
        bitmap.x = this.x;
        bitmap.y = this.y;
        bitmap.centerX = this.centerX;
        bitmap.centerY = this.centerY;
        bitmap.scaleX = this.scaleX;
        bitmap.scaleY = this.scaleY;
        return bitmap;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        if (this._image && this._image.width > 0 && this._image.height > 0) {
          this.drawImage(context, this._image, 0, 0, this._width, this._height, 0, 0, this._width, this._height);
        }
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this._width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this._height = value;
      }
    }]);

    return Bitmap;
  })(Sprite.Display);
})();
//# sourceMappingURL=SpriteBitmap.js.map
