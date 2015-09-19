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
  Sprite.assign("Frame", class SpriteFrame extends Sprite.Display {

    constructor (image, sx, sy, width, height) {
      super();
      let privates = internal(this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      privates.width = width;
      privates.height = height;
    }
    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */
    get image () {
      let privates = internal(this);
      return privates.image;
    }

    set image (value) {
      throw new Error("Sprite.Frame.image readonly");
    }

    /**
     * @return {number} Return sx
     */
    get sx () {
      let privates = internal(this);
      return privates.sx;
    }

    set sx (value) {
      throw new Error("Sprite.Frame.sx readonly");
    }

    /**
     * @return {number} Return sy
     */
    get sy () {
      let privates = internal(this);
      return privates.sy;
    }

    set sy (value) {
      throw new Error("Sprite.Frame.sy readonly");
    }

    /**
     * @return {number} return width
     */
    get width () {
      let privates = internal(this);
      return privates.width;
    }

    set width (value) {
      console.error(value, this);
      throw new Error("Sprite.Frame.width readonly");
    }

    /**
     * @return {number} return height
     */
    get height () {
      let privates = internal(this);
      return privates.height;
    }

    set height (value) {
      console.error(value, this);
      throw new Error("Sprite.Frame.height readonly");
    }

    print () {
      console.log(internal(this));
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
      frame.parent = this.parent;
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
