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
 * @fileoverview Class Sprite.Sheet, maybe the most importent class
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Sheet, contain sprite's sheet and it's animation
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Sheet", (function (_Sprite$Display) {
    _inherits(SpriteSheet, _Sprite$Display);

    /**
     * construct Sprite.Sheet
     * @param config
     * @constructor
     */

    function SpriteSheet(config) {
      _classCallCheck(this, SpriteSheet);

      _get(Object.getPrototypeOf(SpriteSheet.prototype), "constructor", this).call(this);
      var privates = internal(this);

      if (!config.images || !config.images.length || !Number.isFinite(config.width) || config.width <= 0 || config.width > 4096 || !Number.isFinite(config.height) || config.height <= 0 || config.height > 4096) {
        console.error(config);
        throw new Error("Sprite.Sheet.constructor get invalid arguments");
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
      /**
       * Height of each frame
       @type {number}
       @private
       */
      privates.tileheight = config.height;
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;

          if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, not Image or Canvas");
          }

          if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, invalid width or height");
          }

          var col = Math.floor(image.width / privates.tilewidth);
          var row = Math.floor(image.height / privates.tileheight);
          privates.frameCount += col * row;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Clone Sprite.Sheet object itself
     * @return {Object} Return an copy of this
     */

    _createClass(SpriteSheet, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var sheet = new Sprite.Sheet({
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
    }, {
      key: "play",

      /**
       * Play a frame or an animation
       * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
       */
      value: function play(choice) {
        var _this = this;

        var privates = internal(this);
        if (privates.animationTimer) {
          clearInterval(privates.animationTimer);
          privates.animationTimer = null;
        }

        if (Number.isInteger(choice)) {
          // Argument points a frame
          privates.currentFrame = choice;
          this.emit("change");
        } else if (typeof choice == "string") {
          var _ret = (function () {
            // Argument points an animation name
            var animation = privates.animations[choice];

            if (!animation) {
              // if animation is not exist
              console.error(animation, privates.animations, choice);
              throw new Error("Sprite.Sheet.play invalid animation");
            }

            // if animation is single frame number
            if (Number.isFinite(animation)) {
              privates.currentAnimation = choice;
              return {
                v: _this.play(animation)
              };
            }

            // start frame number
            var begin = null;
            // finish frame number
            var end = null;
            // what action after animation finished
            var next = null;
            // the space between each frame, ms
            var time = null;

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
            !Number.isFinite(begin) || begin < 0 || begin >= privates.frameCount || !Number.isFinite(end) || end < 0 || end >= privates.frameCount || !Number.isFinite(time) || time <= 0) {
              console.error(begin, end, time, _this);
              throw new Error("Sprite.Sheet.play Invalid animation data");
            }

            // Play first frame in animation
            privates.currentAnimation = choice;
            privates.currentFrame = begin;
            _this.emit("change");

            // Play other frame in animation
            privates.animationTimer = setInterval(function () {
              privates.currentFrame++;

              if (privates.currentFrame > end) {
                clearInterval(privates.animationTimer);
                privates.animationTimer = null;

                if (next && next.length && privates.animations[next]) {
                  _this.play(next);
                } else {
                  privates.currentFrame--;
                }
                _this.emit("animationend");
              }

              _this.emit("change");
            }, time);
          })();

          if (typeof _ret === "object") return _ret.v;
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
    }, {
      key: "getFrame",
      value: function getFrame(index) {
        var privates = internal(this);
        if (!Number.isInteger(index)) {
          index = privates.currentFrame;
        }

        if (index < 0 || index >= privates.frameCount) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame index out of range");
        }

        var frame = null;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var image = _step2.value;

            var col = Math.floor(image.width / privates.tilewidth);
            var row = Math.floor(image.height / privates.tileheight);
            if (index < col * row) {
              // which row
              var j = Math.floor(index / col);
              // which column
              var i = index - col * j;
              frame = new Sprite.Frame(image, i * privates.tilewidth, // x
              j * privates.tileheight, // y
              privates.tilewidth, privates.tileheight);
              frame.parent = this;
              break;
            }
            index -= col * row;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (!frame) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame unknown error");
        }

        return frame;
      }

      /**
       * Draw this sheet on certain renderer
       * @param {Object} renderer A renderer engine, eg. Sprite.Webgl
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        if (this.visible == false || this.alpha <= 0.01) {
          return;
        }

        var privates = internal(this);
        var frame = this.getFrame(this.currentFrame);

        if (!frame || !frame.image) {
          console.error(frame, this.currentFrame, this);
          throw new Error("Sprite.Sheet.draw invalid frame");
        }

        frame.draw(renderer);
      }
    }, {
      key: "paused",
      get: function get() {
        var privates = internal(this);
        if (privates.animationTimer) {
          return false;
        }
        return true;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.paused readonly");
      }

      /**
       * @return {number} Return current frame number
       */
    }, {
      key: "currentFrame",
      get: function get() {
        var privates = internal(this);
        return privates.currentFrame;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentFrame readonly");
      }

      /**
       * @return {string} Return
       */
    }, {
      key: "currentAnimation",
      get: function get() {
        var privates = internal(this);
        return privates.currentAnimation;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentAnimation readonly");
      }
    }]);

    return SpriteSheet;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteSheet.js.map
