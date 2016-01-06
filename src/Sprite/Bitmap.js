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
 * @fileoverview Define Sprite Bitmap
 * @author mail@qhduan.com (QH Duan)
*/

"use strict";

import Util from "./Util.js";
import Display from "./Display.js";

let internal = Util.namespace();

export default class Bitmap extends Display {
  /**
   * SpriteBitmap's constructor
   * @constructor
  */
  constructor (image) {
    super();

    if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
      console.error(image, this);
      throw new Error("SpriteBitmap got invalid image, not Image or Canvas");
    }

    if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
      console.error(image);
      throw new Error("SpriteBitmap got invalid image, invalid width or height");
    }

    internal(this).image = image;
  }

  clone () {
    let bitmap = new Bitmap(internal(this).image);
    bitmap.x = this.x;
    bitmap.y = this.y;
    bitmap.centerX = this.centerX;
    bitmap.centerY = this.centerY;
    bitmap.alpha = this.alpha;
    bitmap.visible = this.visible;
    return bitmap;
  }

  /**
   * @return {Image} Return SpriteBitmap's image
  */
  get image () {
    return internal(this).image;
  }

  set image (value) {
    console.error(this);
    throw new Error("SpriteBitmap.image readonly");
  }

  /**
   * @return {number} Return SpriteBitmap's width
  */
  get width () {
    return internal(this).image.width;
  }

  set width (value) {
    console.error(this);
    throw new Error("SpriteBitmap.width readonly");
  }

  /**
   * @return {number} Return SpriteBitmap's height
  */
  get height () {
    return internal(this).image.height;
  }

  set height (value) {
    console.error(this);
    throw new Error("SpriteBitmap.height readonly");
  }

  /**
   * @param {Object} renderer Draw image on the renderer
  */
  draw (renderer) {
    if (this.alpha <= 0.01 || this.visible != true) {
      return;
    }
    let image = internal(this).image;
    this.drawImage(renderer, image, 0, 0, image.width, image.height);
  }

}
