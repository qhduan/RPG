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

let internal = Util.namespace();

/**
 * Class SpriteCanvas, an renderer using canvas.getContext("2d")
 * @class
*/
export default class Canvas {

  /**
   * @static
   * @return {boolean} The browser whether or not support HTML5 canvas
  */
  static support () {
    let canvas = document.createElement("canvas");
    if ( canvas.getContext("2d") ) {
      return true;
    }
    return false;
  }

  /**
   * Construct a renderer width certain width and height
   * @constructor
   */
  constructor (width, height) {
    let privates = internal(this);
    let canvas = document.createElement("canvas");
    canvas.width = width || 640;
    canvas.height = height || 480;
    let context = canvas.getContext("2d");

    if (!context) {
      throw new Error("SpriteCanvas canvas is not supported");
    }

    console.log("SpriteCanvas 2d inited");

    /**
     * Color after clear canvas
     */
    privates.color = "#000000";
    /**
     * The canvas object
     */
    privates.canvas = canvas;
    /**
     * Context of canvas
     */
    privates.context = context;
    /**
     * Global alpha
     */
    privates.alpha = 1;
    /**
     * Save some filter paramters, eg. brightness/contrast
     */
    privates.filter = new Map();
    this.filter("brightness", 0);
    this.filter("contrast", 0);
  }

  /**
   * @param {string} name The name of filter you want get or set
   * @param {number} value Number or undefined, if undefined ,return current value
   */
  filter (name, value) {
    let privates = internal(this);
    if (Number.isFinite(value)) {
      if (name == "brightness") {
        value += 1;
      }
      if (name == "contrast") {
        value += 1;
      }
      if (privates.filter.get(name) != value) {
        privates.filter.set(name, value);
        let filter = [];
        privates.filter.forEach((value, key, object) => {
          filter.push(`${key}(${value})`);
        });
        filter = filter.join(" ");
        privates.canvas.style.filter = filter;
        privates.canvas.style.webkitFilter = filter;
      }
    } else {
      return privates.filter.get(name);
    }
  }
  /**
   * Draw an image on the canvas
   * arguments same as canvas.getContext("2d")
   */
  drawImage () {
    let privates = internal(this);
    privates.context.globalAlpha = this.alpha;
    privates.context.drawImage.apply(privates.context, arguments);
  }

  release () {
    // nothing
  }

  /**
   * Remove everything on canvas but a single color
   */
  clear () {
    let privates = internal(this);
    privates.context.fillStyle = privates.color;
    privates.context.fillRect(0, 0, this.width, this.height);
  }

  /**
   * @return {string} The color, eg "#00ff00"
   */
  get color () {
    return internal(this).color;
  }
  /**
   * @param {string} value The new color, eg "#00ff00"
   */
  set color (value) {
    if (value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/)) {
      internal(this).color = value;
    } else {
      console.error(value, this);
      throw new Error("SpriteCanvas invalid color value");
    }
  }

  /**
   * @return {number} The alpha, 0 to 1
   */
  get alpha () {
    return internal(this).alpha;
  }
  /**
   * @param {number} value The new alpha number
   */
  set alpha (value) {
    if (Number.isFinite(value) &&
      value >= 0 &&
      value <= 1
    ) {
      internal(this).alpha = value;
    } else {
      console.error(value, this);
      throw new Error("SpriteCanvas got invalid alpha number");
    }
  }

  /**
   * @return {number} Width of canvas
   */
  get width () {
    return internal(this).canvas.width;
  }
  /**
   * @param {number} value New width
   */
  set width (value) {
    if (Number.isFinite(value) &&
      value > 0 &&
      value < 10000
    ) {
      internal(this).canvas.width = value;
    } else {
      console.error(value, this);
      throw new Error("SpriteCanvas got invalid width number");
    }
  }

  /**
   * @return {number} Height of canvas
   */
  get height () {
    return internal(this).canvas.height;
  }
  /**
   * @param {number} value New height
   */
  set height (value) {
    let privates = internal(this);
    if (Number.isFinite(value) &&
      value > 0 &&
      value < 10000
    ) {
      if (value != privates.canvas.height) {
        privates.canvas.height = value;
      }
    } else {
      console.error(value, this);
      throw new Error("SpriteCanvas got invalid height number");
    }
  }
  /**
   * @return {Object} Canvas
   */
  get canvas () {
    return internal(this).canvas;
  }

  set canvas (value) {
    throw new Error("SpriteCanvas.canvas cannot write");
  }

}
