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
 * @fileoverview Class SpriteDisplay
 * @author mail@qhduan.com (QH Duan)
 */


 "use strict";

 import Util from "./Util.js";
 import Event from "./Event.js";

 let internal = Util.namespace();

let hitCanvas = document.createElement("canvas");
hitCanvas.width = 1;
hitCanvas.height = 1;
let hitContext = hitCanvas.getContext("2d");
hitContext.clearRect(0, 0, 1, 1);
let hitData = hitContext.getImageData(0, 0, 1, 1).data;


/**
 * Class SpriteDisplay, base class for all other classes
 * @class
 * @extends SpriteEvent
*/
export default class Display extends Event {

  /**
   * construct SpriteDisplay
   * @constructor
  */
  constructor () {
    super();
    let privates = internal(this);
    /**
     * x position of object
     @type {number}
     */
    privates.x = 0;
    /**
     * y position of object
     @type {number}
     */
    privates.y = 0;
    /**
     * object's center x
     @type {number}
     */
    privates.centerX = 0;
    /**
     * object's center y
     @type {number}
     */
    privates.centerY = 0;
    /**
     * object's alpha, from 0 to 1, when alpha is 0, object is invisible
     @type {number}
     */
    privates.alpha = 1;
    /**
     * object's visibility
     @type {boolean}
     */
    privates.visible = true;

    privates.width = 0;
    privates.height = 0;
  }

  get width () {
    return internal(this).width;
  }

  set width (value) {
    internal(this).width = value;
  }

  get height () {
    return internal(this).height;
  }

  set height (value) {
    internal(this).height = value;
  }

  /**
   * @return {number} return x position
   */
  get x () {
    return internal(this).x;
  }
  /**
   * @param {number} value new x position
   */
  set x (value) {
    let privates = internal(this);
    if (Number.isFinite(value)) {
      if (value != privates.x) {
        privates.x = Math.floor(value);
        this.emit("change");
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteDisplay.set x : invalid argument");
    }
  }
  /**
   * @return {number} return y position
   */
  get y () {
    return internal(this).y;
  }
  /**
   * @param {number} value new y position
   */
  set y (value) {
    let privates = internal(this);
    if (Number.isFinite(value)) {
      if (value != privates.y) {
        privates.y = Math.floor(value);
        this.emit("change");
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteDisplay.set y : invalid argument");
    }
  }
  /**
   * @return {number} return center x
   */
  get centerX () {
    return internal(this).centerX;
  }
  /**
   * @param {number} value new center x
   */
  set centerX (value) {
    let privates = internal(this);
    if (Number.isFinite(value)) {
      if (value != privates.centerX) {
        privates.centerX = Math.floor(value);
        this.emit("change");
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteDisplay.set centerX : invalid argument");
    }
  }
  /**
   * @return {number} return center y
   */
  get centerY () {
    return internal(this).centerY;
  }
  /**
   * @param {number} value new center y
   */
  set centerY (value) {
    let privates = internal(this);
    if (Number.isFinite(value)) {
      if (value != privates.centerY) {
        privates.centerY = Math.floor(value);
        this.emit("change");
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteDisplay.set centerY : invalid argument");
    }
  }
  /**
   * @return {number} return alpha
   */
  get alpha () {
    let privates = internal(this);
    return privates.alpha;
  }
  /**
   * @param {number} value new alpha
   */
  set alpha (value) {
    let privates = internal(this);
    if (Number.isFinite(value) && (value >= 0 || value <= 1)) {
      if (value != privates.alpha) {
        privates.alpha = value;
        this.emit("change");
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteDisplay.set alpha : invalid argument");
    }
  }
  /**
   * @return {boolean} return alpha
   */
  get visible () {
    let privates = internal(this);
    return privates.visible;
  }
  /**
   * @param {boolean} value new visible
   */
  set visible (value) {
    let privates = internal(this);
    if (value != privates.visible) {
      privates.visible = value;
      this.emit("change");
    }
  }
  /**
   * Interface, sub-class should overload this method
   * @param {Object} renderer
   */
  draw (renderer) {
    console.error("sub-class should override this function");
    throw new Error("Invalid call SpriteDisplay.draw");
  }
  /**
   * Check if the x,y hit this object or not
   * @param {number} x the x position of screen (may 0 to 640) for test
   * @param {number} y the y position of screen (may 0 to 480) for test
   */
  hitTest (x, y) {
    hitContext.clearRect(0, 0, 1, 1);
    hitContext.save();
    hitContext.translate(-x, -y);
    this.draw(hitContext);
    hitContext.restore();
    let newData = hitContext.getImageData(0, 0, 1, 1).data;

    if (hitData[0] != newData[0] || hitData[1] != newData[1] || hitData[2] != newData[2]) {
      return true;
    }
    return false;
  }


  drawPosition () {

    let centerX = this.centerX;
    let centerY = this.centerY;
    let x = this.x;
    let y = this.y;
    let alpha = this.alpha;

    let parent = this.parent;
    while (parent) {
      centerX += parent.centerX;
      centerY += parent.centerY;
      x += parent.x;
      y += parent.y;
      alpha *= parent.alpha;
      if (alpha <= 0.001) {
        return null;
      }
      if (parent.visible == false) {
        return null;
      }
      parent = parent.parent;
    }

    return {
      x: x - centerX,
      y: y - centerY,
      alpha: alpha
    };
  }
  /**
   * Draw an image to renderer
   * x, y-----------------------------------------
   * -                                           -
   * -    sx.sy------------                      -
   * -    -               -                      -
   * -    ---swidth,sheight                      -
   * -                                           -
   * ---------------------------------------------image.width, image.height
   * Crop image with sx, sy, swidth and sheight, draw it on renderer
   * x, y will be calculated by this.x, this.y, this.centerX, this.centerY and some parents' attributes
   * @param {Object} renderer A object who has drawImage method, eg. SpriteWebgl
   * @param {Object} image
   * @param {number} sx
   * @param {number} sy
   * @param {number} swidth
   * @param {number} sheight
   */
  drawImage (renderer, image, sx, sy, swidth, sheight) {
    if (this.visible != true || this.alpha < 0.01) {
      return
    }

    let d = this.drawPosition();
    if (!d) {
      return;
    }
    renderer.alpha = d.alpha;

    try {
      renderer.drawImage(
        image, sx, sy, swidth, sheight,
        d.x, d.y, swidth, sheight
      );
    } catch (e) {
      console.error(
        image, sx, sy, swidth, sheight,
        d.x, d.y, swidth, sheight
      );
      throw e;
    }

  }
}
