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
 * @fileoverview Class SpriteStage
 * @author mail@qhduan.com (QH Duan)
 */


 "use strict";

 import SpriteUtil from "./Util.js";
 import SpriteContainer from "./Container.js";
 import SpriteCanvas from "./Canvas.js";
 import SpriteWebgl from "./Webgl.js";

 let internal = SpriteUtil.namespace();

/**
 * Main Stage, display object
 * @class
 * @extends SpriteContainer
*/
export default class SpriteStage extends SpriteContainer {

  /** @function SpriteStage.constructor
   * consturct a SpriteStage with width and height
   * @constructor
   * @param width, the width of stage you need
   * @param height, the height of stage you need
   */
  constructor (width, height) {
    super();
    let privates = internal(this);

    if (!privates.renderer && SpriteWebgl.support()) {
      privates.renderer = new SpriteWebgl(width, height);
      privates.rendererType = "webgl";
    }

    // canvas 2d first
    if (!privates.renderer && SpriteCanvas.support()) {
      privates.renderer = new SpriteCanvas(width, height);
      privates.rendererType = "canvas";
    }

    if (!privates.renderer) {
      throw new Error("SpriteStage all renderer not support");
    }

    /**
    * color when stage is empty
    */
    privates.color = "#000000";
  }

  releaseRenderer (){
    internal(this).renderer.release();
  }

  get renderer () {
    return internal(this).renderer;
  }

  set renderer (value) {
    throw new Error("SpriteStage renderer readonly");
  }

  get rendererType () {
    return internal(this).rendererType;
  }

  set rendererType (value) {
    throw new Error("SpriteStage.rendererType readonly")
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
    throw new Error("SpriteStage.canvas readonly")
  }

  /// @function SpriteStage.clear
  /// clear the stage
  clear () {
    internal(this).renderer.clear();
  }

  update () {
    this.emit("beforeDraw");
    this.draw(this.renderer);
    this.emit("afterDraw");
  }

  draw (renderer) {
    /** this.children, never privates.children, because children are super's */
    if (this.children.length <= 0) {
      return false;
    }

    this.clear();

    for (let child of this.children) {
      child.draw(renderer);
    }
  }

}
