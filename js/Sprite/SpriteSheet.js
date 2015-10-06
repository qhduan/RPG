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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hlZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7OztBQU0xQixhQU5lLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O0FBT3BDLGlDQVB5QixXQUFXLDZDQU81QjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsVUFDSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFDdkMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksSUFDMUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksRUFDN0U7QUFDRixlQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztPQUNuRTs7Ozs7OztBQU9ELGNBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7Ozs7O0FBTWhDLGNBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxVQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Ozs7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b0IsYUFBQyxLQUFLLEVBQUU7QUFDM0IsY0FBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO09BQzNEOzs7V0FuSjBCLFdBQVc7S0FBUyxNQUFNLENBQUMsT0FBTyxFQW1UN0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVNoZWV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyppbXBvcnQgXCJqcy9TcHJpdGUvU3ByaXRlRGlzcGxheVwiO1xuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLlNoZWV0LCBtYXliZSB0aGUgbW9zdCBpbXBvcnRlbnQgY2xhc3NcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuU2hlZXQsIGNvbnRhaW4gc3ByaXRlJ3Mgc2hlZXQgYW5kIGl0J3MgYW5pbWF0aW9uXG4gICAqIEBjbGFzc1xuICAgKiBAZXh0ZW5kcyBTcHJpdGUuRGlzcGxheVxuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIlNoZWV0XCIsIGNsYXNzIFNwcml0ZVNoZWV0IGV4dGVuZHMgU3ByaXRlLkRpc3BsYXkge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdCBTcHJpdGUuU2hlZXRcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBpZiAoXG4gICAgICAgICAgIWNvbmZpZy5pbWFnZXMgfHwgIWNvbmZpZy5pbWFnZXMubGVuZ3RoIHx8XG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShjb25maWcud2lkdGgpIHx8IGNvbmZpZy53aWR0aCA8PSAwIHx8IGNvbmZpZy53aWR0aCA+IDQwOTYgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKGNvbmZpZy5oZWlnaHQpIHx8IGNvbmZpZy5oZWlnaHQgPD0gMCB8fCBjb25maWcuaGVpZ2h0ID4gNDA5NlxuICAgICAgICApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihjb25maWcpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5jb25zdHJ1Y3RvciBnZXQgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbiBvbmUgb3IgbW9yZSBpbWFnZXNcbiAgICAgICBAdHlwZSB7QXJyYXl9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuaW1hZ2VzID0gY29uZmlnLmltYWdlcztcbiAgICAgIC8qKlxuICAgICAgICogV2lkdGggb2YgZWFjaCBmcmFtZVxuICAgICAgIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMudGlsZXdpZHRoID0gY29uZmlnLndpZHRoO1xuICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbiAgICAgIC8qKlxuICAgICAgICogSGVpZ2h0IG9mIGVhY2ggZnJhbWVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLnRpbGVoZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICAgICAgdGhpcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICAgICAgLyoqXG4gICAgICAgKiBBbmltYXRpb25zIG9mIHRoaXMgc3ByaXRlIHNoZWV0LCBlZy4geyBcIndhbGtkb3duXCI6IFswLCAyLCBcIlwiLCA0MF0sIFwid2Fsa3VwXCIsIFszLCA1LCBcIlwiLCA0MF0gfVxuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9ucyA9IGNvbmZpZy5hbmltYXRpb25zIHx8IHt9O1xuICAgICAgLyoqXG4gICAgICAgKiBDdXJyZW50IGFuaW1hdGlvbidzIG5hbWUsIGVnLiBcIndhbGtkb3duXCIsIFwiYXR0YWNrcmlnaHRcIlxuICAgICAgIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAvKipcbiAgICAgICAqIEN1cnJlbnQgZnJhbWUgbnVtYmVyLCBlZy4gMCwgMSwgMiwgM1xuICAgICAgIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuY3VycmVudEZyYW1lID0gMDtcbiAgICAgIC8qKlxuICAgICAgICogSWYgYW5pbWF0aW9uVGltZXIgaXMgbm90IG51bGwsIGl0IHBvaW50cyBhbiBhbmltYXRpb24gaXMgcnVubmluZ1xuICAgICAgICogaXQgd2lsbCBiZSBudWxsIG9yIGFuIGhhbmRsZXIgZnJvbSBzZXRJbnRlcnZhbFxuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgZnJhbWVzIHdlIGhhdmVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmZyYW1lQ291bnQgPSAwO1xuXG4gICAgICBmb3IgKGxldCBpbWFnZSBvZiBwcml2YXRlcy5pbWFnZXMpIHtcblxuICAgICAgICBpZiAoIShpbWFnZSBpbnN0YW5jZW9mIEltYWdlKSAmJiAhKGltYWdlLmdldENvbnRleHQgJiYgaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpKSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIHByaXZhdGVzLCB0aGlzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQgZ290IGludmFsaWQgaW1hZ2UsIG5vdCBJbWFnZSBvciBDYW52YXNcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1hZ2Uud2lkdGggPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLndpZHRoKSB8fCBpbWFnZS5oZWlnaHQgPD0gMCB8fCAhTnVtYmVyLmlzRmluaXRlKGltYWdlLmhlaWdodCkpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGltYWdlLCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0IGdvdCBpbnZhbGlkIGltYWdlLCBpbnZhbGlkIHdpZHRoIG9yIGhlaWdodFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb2wgPSBNYXRoLmZsb29yKGltYWdlLndpZHRoIC8gcHJpdmF0ZXMudGlsZXdpZHRoKTtcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaW1hZ2UuaGVpZ2h0IC8gcHJpdmF0ZXMudGlsZWhlaWdodCk7XG4gICAgICAgIHByaXZhdGVzLmZyYW1lQ291bnQgKz0gY29sICogcm93O1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9uZSBTcHJpdGUuU2hlZXQgb2JqZWN0IGl0c2VsZlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJuIGFuIGNvcHkgb2YgdGhpc1xuICAgICAqL1xuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IHNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgIGltYWdlczogcHJpdmF0ZXMuaW1hZ2VzLFxuICAgICAgICB3aWR0aDogcHJpdmF0ZXMudGlsZXdpZHRoLFxuICAgICAgICBoZWlnaHQ6IHByaXZhdGVzLnRpbGVoZWlnaHQsXG4gICAgICAgIGFuaW1hdGlvbnM6IHByaXZhdGVzLmFuaW1hdGlvbnNcbiAgICAgIH0pO1xuICAgICAgc2hlZXQueCA9IHRoaXMueDtcbiAgICAgIHNoZWV0LnkgPSB0aGlzLnk7XG4gICAgICBzaGVldC5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgc2hlZXQuY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIHNoZWV0LnBsYXkodGhpcy5jdXJyZW50RnJhbWUpO1xuICAgICAgc2hlZXQuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgc2hlZXQudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICAgIHJldHVybiBzaGVldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJuIGZhbHNlIGlmIGFuIGFuaW1hdGlvbiBpcyBydW5uaW5nXG4gICAgICovXG4gICAgZ2V0IHBhdXNlZCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy5hbmltYXRpb25UaW1lcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXQgcGF1c2VkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0LnBhdXNlZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybiBjdXJyZW50IGZyYW1lIG51bWJlclxuICAgICAqL1xuICAgIGdldCBjdXJyZW50RnJhbWUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuY3VycmVudEZyYW1lO1xuICAgIH1cblxuICAgIHNldCBjdXJyZW50RnJhbWUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuY3VycmVudEZyYW1lIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gUmV0dXJuXG4gICAgICovXG4gICAgZ2V0IGN1cnJlbnRBbmltYXRpb24gKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudEFuaW1hdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5jdXJyZW50QW5pbWF0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYXkgYSBmcmFtZSBvciBhbiBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2hvaWNlIGZyYW1lIG51bWJlciBvZiBhbmltYXRpb24gbmFtZSwgZWcuIDAgZm9yIGZyYW1lIG9yIFwid2Fsa2Rvd25cIiBmb3IgYW5pbWF0aW9uXG4gICAgICovXG4gICAgcGxheSAoY2hvaWNlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy5hbmltYXRpb25UaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHByaXZhdGVzLmFuaW1hdGlvblRpbWVyKTtcbiAgICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihjaG9pY2UpKSB7XG4gICAgICAgIC8vIEFyZ3VtZW50IHBvaW50cyBhIGZyYW1lXG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSA9IGNob2ljZTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2hvaWNlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8gQXJndW1lbnQgcG9pbnRzIGFuIGFuaW1hdGlvbiBuYW1lXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBwcml2YXRlcy5hbmltYXRpb25zW2Nob2ljZV07XG5cbiAgICAgICAgaWYgKCFhbmltYXRpb24pIHsgLy8gaWYgYW5pbWF0aW9uIGlzIG5vdCBleGlzdFxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYW5pbWF0aW9uLCBwcml2YXRlcy5hbmltYXRpb25zLCBjaG9pY2UpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wbGF5IGludmFsaWQgYW5pbWF0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYW5pbWF0aW9uIGlzIHNpbmdsZSBmcmFtZSBudW1iZXJcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShhbmltYXRpb24pKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY3VycmVudEFuaW1hdGlvbiA9IGNob2ljZTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5KGFuaW1hdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdGFydCBmcmFtZSBudW1iZXJcbiAgICAgICAgbGV0IGJlZ2luID0gbnVsbDtcbiAgICAgICAgLy8gZmluaXNoIGZyYW1lIG51bWJlclxuICAgICAgICBsZXQgZW5kID0gbnVsbDtcbiAgICAgICAgLy8gd2hhdCBhY3Rpb24gYWZ0ZXIgYW5pbWF0aW9uIGZpbmlzaGVkXG4gICAgICAgIGxldCBuZXh0ID0gbnVsbDtcbiAgICAgICAgLy8gdGhlIHNwYWNlIGJldHdlZW4gZWFjaCBmcmFtZSwgbXNcbiAgICAgICAgbGV0IHRpbWUgPSBudWxsO1xuXG4gICAgICAgIGlmIChhbmltYXRpb24gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIC8vIGlmIGFuaW1hdGlvbiBmb3JtYXQgaXMgbGlrZSBbYmVnaW4sIGVuZCwgbmV4dCwgdGltZV1cbiAgICAgICAgICBiZWdpbiA9IGFuaW1hdGlvblswXTtcbiAgICAgICAgICBlbmQgPSBhbmltYXRpb25bMV07XG4gICAgICAgICAgbmV4dCA9IGFuaW1hdGlvblsyXTtcbiAgICAgICAgICB0aW1lID0gYW5pbWF0aW9uWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKGFuaW1hdGlvbi5mcmFtZXMgJiYgYW5pbWF0aW9uLmZyYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgLy8gaWYgYW5pbWF0aW9uIGZvcm1hdCBpcyBsaWtlIHsgZnJhbWVzOiBbYmVnaW4sIGVuZF0sIG5leHQ6IFwibmV4dFwiLCBzcGVlZDogXCJ0aW1lXCIgfVxuICAgICAgICAgIGJlZ2luID0gYW5pbWF0aW9uLmZyYW1lc1swXTtcbiAgICAgICAgICBlbmQgPSBhbmltYXRpb24uZnJhbWVzW2FuaW1hdGlvbi5mcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgbmV4dCA9IGFuaW1hdGlvbi5uZXh0O1xuICAgICAgICAgIHRpbWUgPSBhbmltYXRpb24uc3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIC8vIERhdGEgZW5zdXJlXG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShiZWdpbikgfHwgYmVnaW4gPCAwIHx8IGJlZ2luID49IHByaXZhdGVzLmZyYW1lQ291bnQgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKGVuZCkgfHwgZW5kIDwgMCB8fCBlbmQgPj0gcHJpdmF0ZXMuZnJhbWVDb3VudCB8fFxuICAgICAgICAgICFOdW1iZXIuaXNGaW5pdGUodGltZSkgfHwgdGltZSA8PSAwXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYmVnaW4sIGVuZCwgdGltZSwgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0LnBsYXkgSW52YWxpZCBhbmltYXRpb24gZGF0YVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBsYXkgZmlyc3QgZnJhbWUgaW4gYW5pbWF0aW9uXG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRBbmltYXRpb24gPSBjaG9pY2U7XG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSA9IGJlZ2luO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG5cbiAgICAgICAgLy8gUGxheSBvdGhlciBmcmFtZSBpbiBhbmltYXRpb25cbiAgICAgICAgcHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgcHJpdmF0ZXMuY3VycmVudEZyYW1lKys7XG5cbiAgICAgICAgICBpZiAocHJpdmF0ZXMuY3VycmVudEZyYW1lID4gZW5kKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHByaXZhdGVzLmFuaW1hdGlvblRpbWVyKTtcbiAgICAgICAgICAgIHByaXZhdGVzLmFuaW1hdGlvblRpbWVyID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggJiYgcHJpdmF0ZXMuYW5pbWF0aW9uc1tuZXh0XSkge1xuICAgICAgICAgICAgICB0aGlzLnBsYXkobmV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcml2YXRlcy5jdXJyZW50RnJhbWUtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW1pdChcImFuaW1hdGlvbmVuZFwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgIH0sIHRpbWUpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGNob2ljZSwgaW50ZXJuYWwodGhpcykuYW5pbWF0aW9ucywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wbGF5IGhhcyBhbiBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNlcnRhaW4gZnJhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIGZyYW1lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBTcHJpdGUuRnJhbWUgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0RnJhbWUgKGluZGV4KSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpIHtcbiAgICAgICAgaW5kZXggPSBwcml2YXRlcy5jdXJyZW50RnJhbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gcHJpdmF0ZXMuZnJhbWVDb3VudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGluZGV4LCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5nZXRGcmFtZSBpbmRleCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICB9XG5cbiAgICAgIGxldCBmcmFtZSA9IG51bGw7XG4gICAgICBmb3IgKGxldCBpbWFnZSBvZiBwcml2YXRlcy5pbWFnZXMpIHtcbiAgICAgICAgbGV0IGNvbCA9IE1hdGguZmxvb3IoaW1hZ2Uud2lkdGggLyBwcml2YXRlcy50aWxld2lkdGgpO1xuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihpbWFnZS5oZWlnaHQgLyBwcml2YXRlcy50aWxlaGVpZ2h0KTtcbiAgICAgICAgaWYgKGluZGV4IDwgY29sICogcm93KSB7XG4gICAgICAgICAgLy8gd2hpY2ggcm93XG4gICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGluZGV4IC8gY29sKTtcbiAgICAgICAgICAvLyB3aGljaCBjb2x1bW5cbiAgICAgICAgICBsZXQgaSA9IGluZGV4IC0gY29sICogajtcbiAgICAgICAgICBmcmFtZSA9IG5ldyBTcHJpdGUuRnJhbWUgKFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBpICogcHJpdmF0ZXMudGlsZXdpZHRoLCAvLyB4XG4gICAgICAgICAgICBqICogcHJpdmF0ZXMudGlsZWhlaWdodCwgLy8geVxuICAgICAgICAgICAgcHJpdmF0ZXMudGlsZXdpZHRoLFxuICAgICAgICAgICAgcHJpdmF0ZXMudGlsZWhlaWdodFxuICAgICAgICAgICk7XG4gICAgICAgICAgZnJhbWUucGFyZW50ID0gdGhpcztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpbmRleCAtPSAoY29sICogcm93KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmcmFtZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGluZGV4LCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5nZXRGcmFtZSB1bmtub3duIGVycm9yXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGlzIHNoZWV0IG9uIGNlcnRhaW4gcmVuZGVyZXJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgQSByZW5kZXJlciBlbmdpbmUsIGVnLiBTcHJpdGUuV2ViZ2xcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSA9PSBmYWxzZSB8fCB0aGlzLmFscGhhIDw9IDAuMDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBmcmFtZSA9IHRoaXMuZ2V0RnJhbWUodGhpcy5jdXJyZW50RnJhbWUpO1xuXG4gICAgICBpZiAoIWZyYW1lIHx8ICFmcmFtZS5pbWFnZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGZyYW1lLCB0aGlzLmN1cnJlbnRGcmFtZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5kcmF3IGludmFsaWQgZnJhbWVcIik7XG4gICAgICB9XG5cbiAgICAgIGZyYW1lLmRyYXcocmVuZGVyZXIpO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19
