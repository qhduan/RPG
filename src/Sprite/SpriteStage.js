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

(function () {
 "use strict";

  let internal = Sprite.Namespace();

  /**
   * Main Stage, display object
   * @class
   * @extends Sprite.Container
   */
  Sprite.assign("Stage", class SpriteStage extends Sprite.Container {

    /** @function Sprite.Stage.constructor
     * consturct a Sprite.Stage with width and height
     * @constructor
     * @param width, the width of stage you need
     * @param height, the height of stage you need
     */
    constructor (width, height) {
      super();
      let privates = internal(this);

      if (!privates.renderer && Sprite.Webgl.support()) {
        privates.renderer = new Sprite.Webgl(width, height);
        privates.rendererType = "webgl";
      }

      // canvas 2d first
      if (!privates.renderer && Sprite.Canvas.support()) {
        privates.renderer = new Sprite.Canvas(width, height);
        privates.rendererType = "canvas";
      }

      if (!privates.renderer) {
        throw new Error("Sprite.Stage all renderer not support");
      }

      /**
      * color when stage is empty
      */
      privates.color = "#000000";
    }

    get renderer () {
      let privates = internal(this);
      return privates.renderer;
    }

    set renderer (value) {
      throw new Error("Sprite.Stage renderer readonly");
    }

    get rendererType () {
      let privates = internal(this);
      return privates.rendererType;
    }

    set rendererType (value) {
      throw new Error("Sprite.Stage.rendererType readonly")
    }

    filter (name, value) {
      let privates = internal(this);
      return privates.renderer.filter(name, value);
    }

    findHit (event) {
      let privates = internal(this);
      let hitted = this.hitTest(this.mouseX, this.mouseY);
      hitted.reverse();
      if (hitted.length)
        return hitted;
      return null;
    }

    get width () {
      let privates = internal(this);
      return privates.renderer.width;
    }

    set width (value) {
      let privates = internal(this);
      privates.renderer.width = value;
    }

    get height () {
      let privates = internal(this);
      return privates.renderer.height;
    }

    set height (value) {
      let privates = internal(this);
      privates.renderer.height = value;
    }

    get color () {
      let privates = internal(this);
      return privates.renderer.color;
    }

    set color (value) {
      let privates = internal(this);
      privates.renderer.color = value;
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

    draw () {
      let privates = internal(this);
      this.emit("beforeDraw");

      /** this.children, never privates.children, because children are super's */
      if (this.children.length <= 0) {
        return false;
      }

      this.clear();

      for (let child of this.children) {
        child.draw(this.renderer);
      }

      this.emit("afterDraw");
    }

  });


})();
