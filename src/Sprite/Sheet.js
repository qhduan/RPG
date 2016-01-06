/*import "js/Sprite/SpriteDisplay";

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
 * @fileoverview Class SpriteSheet, maybe the most importent class
 * @author mail@qhduan.com (QH Duan)
 */

 "use strict";

 import Util from "./Util.js";
 import Display from "./Display.js";
 import Frame from "./Frame.js";

 let internal = Util.namespace();

/**
 * Class SpriteSheet, contain sprite's sheet and it's animation
 * @class
 * @extends SpriteDisplay
*/
export default class Sheet extends Display {
  /**
   * construct SpriteSheet
   * @param config
   * @constructor
   */
  constructor (config) {
    super();
    let privates = internal(this);

    if (
        !config.images || !config.images.length ||
        !Number.isFinite(config.width) || config.width <= 0 || config.width > 4096 ||
        !Number.isFinite(config.height) || config.height <= 0 || config.height > 4096
      ) {
      console.error(config);
      throw new Error("SpriteSheet.constructor get invalid arguments");
    }

    /**
     * Contain one or more images
     @type {Array}
     @private
     */
    privates.images = config.images;
    /**
     * Width of each frame
     @type {number}
     @private
     */
    privates.tilewidth = config.width;
    this.width = config.width;
    /**
     * Height of each frame
     @type {number}
     @private
     */
    privates.tileheight = config.height;
    this.height = config.height;
    /**
     * Animations of this sprite sheet, eg. { "walkdown": [0, 2, "", 40], "walkup", [3, 5, "", 40] }
     @type {Object}
     @private
     */
    privates.animations = config.animations || {};
    /**
     * Current animation's name, eg. "walkdown", "attackright"
     @type {string}
     @private
     */
    privates.currentAnimation = null;
    /**
     * Current frame number, eg. 0, 1, 2, 3
     @type {number}
     @private
     */
    privates.currentFrame = 0;
    /**
     * If animationTimer is not null, it points an animation is running
     * it will be null or an handler from setInterval
     @type {Object}
     @private
     */
    privates.animationTimer = null;

    /**
     * The number of frames we have
     @type {number}
     @private
     */
    privates.frameCount = 0;

    for (let image of privates.images) {

      if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
        console.error(image, privates, this);
        throw new Error("SpriteSheet got invalid image, not Image or Canvas");
      }

      if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
        console.error(image, privates, this);
        throw new Error("SpriteSheet got invalid image, invalid width or height");
      }

      let col = Math.floor(image.width / privates.tilewidth);
      let row = Math.floor(image.height / privates.tileheight);
      privates.frameCount += col * row;
    }
  }
  /**
   * Clone SpriteSheet object itself
   * @return {Object} Return an copy of this
   */
  clone () {
    let privates = internal(this);
    let sheet = new Sheet({
      images: privates.images,
      width: privates.tilewidth,
      height: privates.tileheight,
      animations: privates.animations
    });
    sheet.x = this.x;
    sheet.y = this.y;
    sheet.centerX = this.centerX;
    sheet.centerY = this.centerY;
    sheet.play(this.currentFrame);
    sheet.alpha = this.alpha;
    sheet.visible = this.visible;
    return sheet;
  }
  /**
   * @return {boolean} Return false if an animation is running
   */
  get paused () {
    let privates = internal(this);
    if (privates.animationTimer) {
      return false;
    }
    return true;
  }

  set paused (value) {
    throw new Error("SpriteSheet.paused readonly");
  }

  /**
   * @return {number} Return current frame number
   */
  get currentFrame () {
    let privates = internal(this);
    return privates.currentFrame;
  }

  set currentFrame (value) {
    throw new Error("SpriteSheet.currentFrame readonly");
  }

  /**
   * @return {string} Return
   */
  get currentAnimation () {
    let privates = internal(this);
    return privates.currentAnimation;
  }

  set currentAnimation (value) {
    throw new Error("SpriteSheet.currentAnimation readonly");
  }

  /**
   * Play a frame or an animation
   * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
   */
  play (choice) {
    let privates = internal(this);
    if (privates.animationTimer) {
      clearInterval(privates.animationTimer);
      privates.animationTimer = null;
    }

    if (Number.isInteger(choice)) {
      // Argument points a frame
      privates.currentFrame = choice;
      this.emit("change");
    } else if (typeof choice == "string") {
      // Argument points an animation name
      let animation = privates.animations[choice];

      if (!animation) { // if animation is not exist
        console.error(animation, privates.animations, choice);
        throw new Error("SpriteSheet.play invalid animation");
      }

      // if animation is single frame number
      if (Number.isFinite(animation)) {
        privates.currentAnimation = choice;
        return this.play(animation);
      }

      // start frame number
      let begin = null;
      // finish frame number
      let end = null;
      // what action after animation finished
      let next = null;
      // the space between each frame, ms
      let time = null;

      if (animation instanceof Array) {
        // if animation format is like [begin, end, next, time]
        begin = animation[0];
        end = animation[1];
        next = animation[2];
        time = animation[3];
      } else if (animation.frames && animation.frames instanceof Array) {
        // if animation format is like { frames: [begin, end], next: "next", speed: "time" }
        begin = animation.frames[0];
        end = animation.frames[animation.frames.length - 1];
        next = animation.next;
        time = animation.speed;
      }

      if ( // Data ensure
        !Number.isFinite(begin) || begin < 0 || begin >= privates.frameCount ||
        !Number.isFinite(end) || end < 0 || end >= privates.frameCount ||
        !Number.isFinite(time) || time <= 0
      ) {
        console.error(begin, end, time, this);
        throw new Error("SpriteSheet.play Invalid animation data");
      }

      // Play first frame in animation
      privates.currentAnimation = choice;
      privates.currentFrame = begin;
      this.emit("change");

      // Play other frame in animation
      privates.animationTimer = setInterval(() => {
        privates.currentFrame++;

        if (privates.currentFrame > end) {
          clearInterval(privates.animationTimer);
          privates.animationTimer = null;

          if (next && next.length && privates.animations[next]) {
            this.play(next);
          } else {
            privates.currentFrame--;
          }
          this.emit("animationend");
        }

        this.emit("change");
      }, time);

    } else {
      console.error(choice, internal(this).animations, this);
      throw new Error("SpriteSheet.play has an invalid argument");
    }
  }

  /**
   * Get a certain frame
   * @param {number} index The index of frame
   * @return {Object} An SpriteFrame object
   */
  getFrame (index) {
    let privates = internal(this);
    if (!Number.isInteger(index)) {
      index = privates.currentFrame;
    }

    if (index < 0 || index >= privates.frameCount) {
      console.error(index, privates, this);
      throw new Error("SpriteSheet.getFrame index out of range");
    }

    let frame = null;
    for (let image of privates.images) {
      let col = Math.floor(image.width / privates.tilewidth);
      let row = Math.floor(image.height / privates.tileheight);
      if (index < col * row) {
        // which row
        let j = Math.floor(index / col);
        // which column
        let i = index - col * j;
        frame = new Frame (
          image,
          i * privates.tilewidth, // x
          j * privates.tileheight, // y
          privates.tilewidth,
          privates.tileheight
        );
        frame.parent = this;
        break;
      }
      index -= (col * row);
    }

    if (!frame) {
      console.error(index, privates, this);
      throw new Error("SpriteSheet.getFrame unknown error");
    }

    return frame;
  }

  /**
   * Draw this sheet on certain renderer
   * @param {Object} renderer A renderer engine, eg. SpriteWebgl
   */
  draw (renderer) {
    if (this.alpha <= 0.01 || !this.visible) {
      return;
    }

    let privates = internal(this);
    let frame = this.getFrame(this.currentFrame);

    if (!frame || !frame.image) {
      console.error(frame, this.currentFrame, this);
      throw new Error("SpriteSheet.draw invalid frame");
    }

    frame.draw(renderer);
  }

}
