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
  Sprite.assign("Canvas", class SpriteCanvas {

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
      let privates = internal(this);
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
      if (typeof value == "number" && !isNaN(value)) {
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
      let privates = internal(this);

      if (dx > this.width || dy > this.height) {
        return;
      }

      if ((dx + dw) < 0 || (dy + dh) < 0) {
        return;
      }

      privates.context.globalAlpha = this.alpha;
      privates.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
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
      let privates = internal(this);
      return privates.color;
    }
    /**
     * @param {string} value The new color, eg "#00ff00"
     */
    set color (value) {
      let privates = internal(this);
      if (value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/)) {
        privates.color = value;
      } else {
        console.error(value, this);
        throw new Error("Sprite.Canvas invalid color value");
      }
    }

    /**
     * @return {number} The alpha, 0 to 1
     */
    get alpha () {
      let privates = internal(this);
      return privates.alpha;
    }
    /**
     * @param {number} value The new alpha number
     */
    set alpha (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value >= 0 &&
        value <= 1
      ) {
        if (value != privates.alpha) {
          privates.alpha = value;
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
      let privates = internal(this);
      return privates.canvas.width;
    }
    /**
     * @param {number} value New width
     */
    set width (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != privates.canvas.width) {
          privates.canvas.width = value;
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
      let privates = internal(this);
      return privates.canvas.height;
    }
    /**
     * @param {number} value New height
     */
    set height (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != privates.canvas.height) {
          privates.canvas.height = value;
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
      let privates = internal(this);
      return privates.canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Canvas.canvas cannot write");
    }

  });


})();
