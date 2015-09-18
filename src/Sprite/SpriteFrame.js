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
 * @fileoverview Class Sprite.Frame
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
 "use strict";

  let internal = Sprite.Namespace();

  /**
   * Class Sprite.Frame, a frame of Sprite.Sheet
   * @class
   */
  Sprite.register("Frame", class SpriteFrame extends Sprite.Display {

    constructor (image, sx, sy, width, height) {
      super();
      internal(this).image = image;
      internal(this).sx = sx;
      internal(this).sy = sy;
      internal(this).width = width;
      internal(this).height = height;
    }
    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */
    get image () {
      return internal(this).image;
    }

    set image (value) {
      throw new Error("Sprite.Frame.image readonly");
    }

    /**
     * @return {number} Return sx
     */
    get sx () {
      return internal(this).sx;
    }

    set sx (value) {
      throw new Error("Sprite.Frame.sx readonly");
    }

    /**
     * @return {number} Return sy
     */
    get sy () {
      return internal(this).sy;
    }

    set sy (value) {
      throw new Error("Sprite.Frame.sy readonly");
    }

    /**
     * @return {number} return width
     */
    get width () {
      return internal(this).width;
    }

    set width (value) {
      console.error(value, this);
      throw new Error("Sprite.Frame.width readonly");
    }

    /**
     * @return {number} return height
     */
    get height () {
      return internal(this).height;
    }

    set height (value) {
      console.error(value, this);
      throw new Error("Sprite.Frame.height readonly");
    }

    /**
     * @return {Object} Clone this Sprite.Frame
     */
    clone () {
      let frame = new Sprite.Frame(
        this.image,
        this.sx, this.sy,
        this.width, this.height
      );
      frame.x = this.x;
      frame.y = this.y;
      return frame;
    }

    /**
     * @param {Object} renderer
     */
    draw (renderer) {
      this.drawImage(
        renderer, this.image,
        this.sx, this.sy,
        this.width, this.height
      );
    }

  });


})();
