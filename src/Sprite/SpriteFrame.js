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

  Sprite.Frame = class Frame extends Sprite.Display {

    constructor (image, sx, sy, width, height) {
      super();
      this._image = image;
      this._sx = sx;
      this._sy = sy;
      this.width = width;
      this.height = height;
    }

    get image () {
      return this._image;
    }

    set image (value) {
      throw new Error("Sprite.Frame.image readonly");
    }

    get sx () {
      return this._sx;
    }

    set sx (value) {
      throw new Error("Sprite.Frame.sx readonly");
    }

    get sy () {
      return this._sy;
    }

    set sy (value) {
      throw new Error("Sprite.Frame.sy readonly");
    }

    clone () {
      var frame = new Frame(this._image,
        this._sx, this._sy, this.width, this.height, this.centerX, this.centerY);
      frame.x = this.x;
      frame.y = this.y;
      return frame;
    }

    draw (renderer) {
      this.drawImage(renderer, this.image, this.sx, this.sy, this.width, this.height);
    }

  };

})(Sprite);
