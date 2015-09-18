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
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
 "use strict";

  let internal = Sprite.Namespace();

  /**
   * Class Sprite.Canvas, an renderer using canvas.getContext("2d")
   * @class
   */
  Sprite.register("Canvas", class SpriteCanvas {

    /**
     * @static
     * @return {boolean} The browser whether or not support HTML5 canvas
     */
    static support () {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      if (context) {
        return true;
      }
      return false;
    }

    /**
     * Construct a renderer width certain width and height
     * @constructor
     */
    constructor (width, height) {
      let canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;
      let context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("canvas inited");

      /**
       * Color after clear canvas
       */
      internal(this).color = "#000000";
      /**
       * The canvas object
       */
      internal(this).canvas = canvas;
      /**
       * Context of canvas
       */
      internal(this).context = context;
      /**
       * Global alpha
       */
      internal(this).alpha = 1;
      /**
       * Save some filter paramters, eg. brightness/contrast
       */
      internal(this).filter = new Map();
      this.filter("brightness", 0);
      this.filter("contrast", 0);
    }

    /**
     * @param {string} name The name of filter you want get or set
     * @param {number} value Number or undefined, if undefined ,return current value
     */
    filter (name, value) {
      if (typeof value == "number" && !isNaN(value)) {
        if (name == "brightness") {
          value += 1;
        }
        if (name == "contrast") {
          value += 1;
        }
        if (internal(this).filter.get(name) != value) {
          internal(this).filter.set(name, value);
          let filter = [];
          internal(this).filter.forEach((value, key, object) => {
            filter.push(`${key}(${value})`);
          });
          filter = filter.join(" ");
          this.canvas.style.filter = filter;
          this.canvas.style.webkitFilter = filter;
        }
      } else {
        return internal(this).filter.get(name);
      }
    }
    /**
     * Draw an image on the canvas
     * @param {Image} image The image we are gonna draw
     * @param {number} sx Crop image from x=sx
     * @param {number} sy Crop image from y=sy
     * @param {number} sw Crop image with sw width
     * @param {number} sh Crop image width sh height
     * @param {number} dx Draw image on canvas's x=dx
     * @param {number} dy Draw image on canvas's x=dy
     * @param {number} dw Change image's width to dw on canvas
     * @param {number} dh Change image's height to dh on canvas
     */
    drawImage (image, sx, sy, sw, sh, dx, dy, dw, dh) {
      internal(this).context.globalAlpha = this.alpha;
      internal(this).context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    /**
     * Remove everything on canvas but a single color
     */
    clear () {
      internal(this).context.fillStyle = internal(this).color;
      internal(this).context.fillRect(0, 0, this.width, this.height);
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
        throw new Error("Sprite.Canvas invalid color value");
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
      if (typeof value == "number" &&
        !isNaN(value) &&
        value >= 0 &&
        value <= 1
      ) {
        if (value != internal(this).alpha) {
          internal(this).alpha = value;
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Canvas got invalid alpha number");
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
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != internal(this).canvas.width) {
          internal(this).canvas.width = value;
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Canvas got invalid width number");
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
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != internal(this).canvas.height) {
          internal(this).canvas.height = value;
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Canvas got invalid height number");
      }
    }
    /**
     * @return {Object} Canvas
     */
    get canvas () {
      return internal(this).canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Canvas.canvas cannot write");
    }

  });


})();
