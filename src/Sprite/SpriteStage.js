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
 * @fileoverview Class Sprite.Stage
 * @author mail@qhduan.com (QH Duan)
 */

(function (Sprite) {
  "use strict";

  let internal = Sprite.Namespace();

  /**
   * Main Stage, display object
   * @class
   * @extends Sprite.Container
   */
  Sprite.Stage = class SpriteStage extends Sprite.Container {

    /** @function Sprite.Stage.constructor
     * consturct a Sprite.Stage with width and height
     * @constructor
     * @param width, the width of stage you need
     * @param height, the height of stage you need
     */
    constructor (width, height) {
      super();

      if (Sprite.Webgl.support()) {
        internal(this).renderer = new Sprite.Webgl(width, height);
        internal(this).rendererType = "webgl";
      } else if (Sprite.Canvas.support()) {
        internal(this).renderer = new Sprite.Canvas(width, height);
        internal(this).rendererType = "canvas";
      } else {
        throw new Error("Sprite.Stage all renderer not support");
      }

      internal(this).color = "#000000";

      internal(this).screenshot = null;
    }

    get renderer () {
      return internal(this).renderer;
    }

    set renderer (value) {
      throw new Error("Sprite.Stage renderer readonly");
    }

    get rendererType () {
      return internal(this).rendererType;
    }

    set rendererType (value) {
      throw new Error("Sprite.Stage.rendererType readonly")
    }

    filter (name, value) {
      return internal(this).renderer.filter(name, value);
    }

    findHit (event) {
      let hitted = this.hitTest(this.mouseX, this.mouseY);
      hitted.reverse();
      if (hitted.length)
        return hitted;
      return null;
    }

    get width () {
      return internal(this).renderer.width;
    }

    set width (value) {
      internal(this).renderer.width = value;
    }

    get height () {
      return internal(this).renderer.height;
    }

    set height (value) {
      internal(this).renderer.height = value;
    }

    get color () {
      return internal(this).renderer.color;
    }

    set color (value) {
      internal(this).renderer.color = value;
    }

    get canvas () {
      return this.renderer.canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Stage.canvas readonly")
    }

    /// @function Sprite.Stage.clear
    /// clear the stage
    clear () {
      internal(this).renderer.clear();
    }

    update () {
      this.draw();
    }

    requestScreenshot (callback) {
      internal(this).screenshot = function (url) {
        let img = new Image();
        img.src = url;
        if (img.complete) {
          callback(img);
        } else {
          img.onload = function () {
            callback(img);
          };
        }
      };
    }

    draw () {
      this.emit("drawStart");

      if (this.children.length <= 0) {
        return false;
      }

      this.clear();

      for (let child of this.children) {
        child.draw(this.renderer);
      }

      if (internal(this).screenshot) {
        internal(this).screenshot(this.canvas.toDataURL());
        internal(this).screenshot = null;
      }

      this.emit("drawEnd");
    }

  };

})(Sprite);
