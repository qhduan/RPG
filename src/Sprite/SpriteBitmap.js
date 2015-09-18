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

  let internal = Sprite.Namespace();

  Sprite.assign("Bitmap", class SpriteBitmap extends Sprite.Display {
    /**
     * Sprite.Bitmap's constructor
     * @constructor
     */
    constructor (image) {
      super();
      let privates = internal(this);

      if (
        !image ||
        typeof image.width != "number" || image.width <= 0 ||
        typeof image.width != "number" || image.height <= 0
      ) {
        console.error(image);
        throw new Error("Sprite.Bitmap got invalid argument");
      }

      /**
       * The image
       */
      privates.image = image;
    }

    clone () {
      let privates = internal(this);
      let bitmap = new Sprite.Bitmap(privates.image);
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
    get image () {
      let privates = internal(this);
      return privates.image;
    }

    set image (value) {
      console.error(this);
      throw new Error("Sprite.Bitmap.image readonly");
    }

    /**
     * @return {number} Return Sprite.Bitmap's width
     */
    get width () {
      let privates = internal(this);
      return privates.image.width;
    }

    set width (value) {
      console.error(this);
      throw new Error("Sprite.Bitmap.width readonly");
    }

    /**
     * @return {number} Return Sprite.Bitmap's height
     */
    get height () {
      let privates = internal(this);
      return privates.image.height;
    }

    set height (value) {
      console.error(this);
      throw new Error("Sprite.Bitmap.height readonly");
    }

    /**
     * @param {Object} renderer Draw image on the renderer
     */
    draw (renderer) {
      if (this.alpha <= 0.01 || this.visible != true) {
        return;
      }
      let privates = internal(this);
      this.drawImage(renderer, privates.image,
        0, 0, privates.image.width, privates.image.height);
    }

  });


})();
