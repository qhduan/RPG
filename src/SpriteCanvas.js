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

/// @file SpriteCanvas.js
/// @namespace Sprite
/// class Sprite.Canvas

(function () {
  "use strict";

  Sprite.Canvas = class Canvas {

    static support () {
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("2d");
      if (gl) {
        return true;
      }
      return false;
    }

    constructor (width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      var context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("canvas inited");

      this._canvas = canvas;
      this._context = context;
    }

    filter () {
      // for now, only Sprite.Webgl could use .filter() method
    }

    drawImage (image, sx, sy, sw, sh, dx, dy, dw, dh) {
      if (!image.width || !image.height || image.width <= 0 || image.height <= 0) {
        console.error(image);
        throw new Error("drawImage invalid image");
      }

      this._context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    clear () {
      this._context.fillStyle = "black";
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    get width () {
      return this._canvas.width;
    }

    set width (value) {
      if (value != this._canvas.width) {
        this._canvas.width = value;
      }
    }

    get height () {
      return this._canvas.height;
    }

    set height (value) {
      if (value != this._canvas.height) {
        this._canvas.height = value;
      }
    }

    get canvas () {
      return this._canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Canvas.canvas cannot write");
    }


  };

})();
