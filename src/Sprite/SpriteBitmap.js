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

(function (Sprite) {

  Sprite.Bitmap = class Bitmap extends Sprite.Display {

    constructor (image) {
      super();
      this._image = image;
      this._width = image.width;
      this._height = image.height;
    }

    clone () {
      var bitmap = new Bitmap(this._image);
      bitmap.x = this.x;
      bitmap.y = this.y;
      bitmap.centerX = this.centerX;
      bitmap.centerY = this.centerY;
      bitmap.scaleX = this.scaleX;
      bitmap.scaleY = this.scaleY;
      return bitmap;
    }

    get width () {
      return this._width;
    }

    set width (value) {
      this._width = value;
    }

    get height () {
      return this._height;
    }

    set height (value) {
      this._height = value;
    }

    draw (context) {
      if (this._image && this._image.width > 0 && this._image.height > 0) {
        this.drawImage(context, this._image,
          0, 0, this._width, this._height,
          0, 0, this._width, this._height);
      }
    }

  };

})(Sprite);
