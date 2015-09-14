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
 * @fileoverview Class Sprite.Sheet, maybe the most importent class
 * @author mail@qhduan.com (QH Duan)
 */

(function (Sprite) {
  "use strict";

  let internal = Sprite.Namespace();

  /**
   * Class Sprite.Sheet, contain sprite's sheet and it's animation
   * @class
   * @extends Sprite.Display
   */
  Sprite.Sheet = class SpriteSheet extends Sprite.Display {
    /**
     * construct Sprite.Sheet
     * @param config
     * @constructor
     */
    constructor (config) {
      super();

      if (
          !config.images || !config.images.length ||
          !Number.isInteger(config.width) || isNaN(config.width) || config.width <= 0 ||
          !Number.isInteger(config.height) || isNaN(config.height) || config.height <= 0
        ) {
        console.error(config)
        throw new Error("Sprite.Sheet.constructor get invalid arguments");
      }

      /**
       * Contain one or more images
       @type {Array}
       @private
       */
      internal(this).images = config.images;
      /**
       * Width of each frame
       @type {number}
       @private
       */
      internal(this).tilewidth = config.width;
      /**
       * Height of each frame
       @type {number}
       @private
       */
      internal(this).tileheight = config.height;
      /**
       * Animations of this sprite sheet, eg. { "walkdown": [0, 2, "", 40], "walkup", [3, 5, "", 40] }
       @type {Object}
       @private
       */
      internal(this).animations = config.animations || {};
      /**
       * Current animation's name, eg. "walkdown", "attackright"
       @type {string}
       @private
       */
      internal(this).currentAnimation = null;
      /**
       * Current frame number, eg. 0, 1, 2, 3
       @type {number}
       @private
       */
      internal(this).currentFrame = 0;
      /**
       * If animationTimer is not null, it points an animation is running
       * it will be null or an handler from setInterval
       @type {Object}
       @private
       */
      internal(this).animationTimer = null;
      /**
       * Contain frames cache
       @type {Array}
       @private
       */
      internal(this).frames = [];

      for (let image of internal(this).images) {
        if (image && image.width && image.height) {
          let col = Math.floor(image.width / internal(this).tilewidth);
          let row = Math.floor(image.height / internal(this).tileheight);
          for (let j = 0; j < row; j++) {
            for (let i = 0; i < col; i++) {
              internal(this).frames.push({
                image: image,
                x: i * internal(this).tilewidth,
                y: j * internal(this).tileheight
              });
            }
          }
        } else {
          console.error(image, internal(this).images, this);
          throw new Error("Sprite.Sheet got an invalid image");
        }
      }

      /**
       * The number of frames we have
       @type {number}
       @private
       */
      internal(this).frameCount = internal(this).frames.length;

      if (internal(this).frameCount <= 0) {
        console.error(internal(this).frames, this);
        throw new Error("Sprite.Sheet got invalid frameCount, something wrong");
      }
    }
    /**
     * Clone Sprite.Sheet object itself
     * @return {Object} Return an copy of this
     */
    clone () {
      let sheet = new Sprite.Sheet({
        images: internal(this).images,
        width: internal(this).tilewidth,
        height: internal(this).tileheight,
        animations: internal(this).animations
      });
      sheet.x = this.x;
      sheet.y = this.y;
      sheet.centerX = this.centerX;
      sheet.centerY = this.centerY;
      sheet.play(this.currentFrame);
      return sheet;
    }
    /**
     * @return {boolean} Return false if an animation is running
     */
    get paused () {
      if (internal(this).animationTimer) {
        return false;
      }
      return true;
    }

    set paused (value) {
      throw new Error("Sprite.Sheet.paused readonly");
    }

    /**
     * @return {number} Return current frame number
     */
    get currentFrame () {
      return internal(this).currentFrame;
    }

    set currentFrame (value) {
      throw new Error("Sprite.Sheet.currentFrame readonly");
    }

    /**
     * @return {string} Return
     */
    get currentAnimation () {
      return internal(this).currentAnimation;
    }

    set currentAnimation (value) {
      throw new Error("Sprite.Sheet.currentAnimation readonly");
    }

    /**
     * Play a frame or an animation
     * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
     */
    play (choice) {
      if (internal(this).animationTimer) {
        clearInterval(internal(this).animationTimer);
        internal(this).animationTimer = null;
      }

      if (typeof choice == "number") {
        // Argument points a frame
        internal(this).currentFrame = choice;
        this.emit("change");
      } else if (typeof choice == "string") {
        // Argument points an animation name
        let animation = internal(this).animations[choice];

        if (!animation) { // if animation is not exist
          console.error(animation, internal(this).animations, choice);
          throw new Error("Sprite.Sheet.play invalid animation");
        }

        // if animation is single frame number
        if (typeof animation == "number") {
          internal(this).currentAnimation = choice;
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
          typeof begin != "number" || begin < 0 || begin >= internal(this).frameCount ||
          typeof end != "number" || end < 0 || end >= internal(this).frameCount ||
          typeof time != "number" || time <= 0
        ) {
          console.error(begin, end, time, this);
          throw new Error("Sprite.Sheet.play Invalid animation data");
        }

        // Play first frame in animation
        internal(this).currentAnimation = choice;
        internal(this).currentFrame = begin;
        this.emit("change");

        // Play other frame in animation
        internal(this).animationTimer = setInterval(() => {
          internal(this).currentFrame++;

          if (internal(this).currentFrame > end) {
            clearInterval(internal(this).animationTimer);
            internal(this).animationTimer = null;

            if (next && next.length && internal(this).animations[next]) {
              this.play(next);
            } else {
              internal(this).currentFrame--;
            }
            this.emit("animationend");
          }

          this.emit("change");
        }, time);

      } else {
        console.error(choice, internal(this).animations, this);
        throw new Error("Sprite.Sheet.play has an invalid argument");
      }
    }

    /**
     * Get a certain frame
     * @param {number} index The index of frame
     * @return {Object} An Sprite.Frame object
     */
    getFrame (index) {
      if (!Number.isInteger(index)) {
        index = internal(this).currentFrame;
      }
      if (index < 0 || index >= internal(this).frameCount) {
        console.error(index, this);
        throw new Error("Sprite.Sheet.getFrame invalid index")
      }
      let frame = internal(this).frames[index];
      let frameObj = new Sprite.Frame(
        frame.image,
        frame.x,
        frame.y,
        internal(this).tilewidth,
        internal(this).tileheight
      );
      frameObj.parent = this;
      return frameObj;
    }

    /**
     * Draw this sheet on certain renderer
     * @param {Object} renderer A renderer engine, eg. Sprite.Webgl
     */
    draw (renderer) {
      let frame = this.getFrame(this.currentFrame);

      if (!frame || !frame.image) {
        console.error(frame, this.currentFrame, this);
        throw new Error("Sprite.Sheet.draw invalid frame");
      }

      frame.draw(renderer);
    }

  };

})(Sprite);
