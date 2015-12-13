"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteSheet).call(this));

      var privates = internal(_this);

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
      _this.width = config.width;
      /**
       * Height of each frame
       @type {number}
       @private
       */
      privates.tileheight = config.height;
      _this.height = config.height;
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
            console.error(image, privates, _this);
            throw new Error("Sprite.Sheet got invalid image, not Image or Canvas");
          }

          if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
            console.error(image, privates, _this);
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
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _this;
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
        var _this2 = this;

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
                v: _this2.play(animation)
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
              console.error(begin, end, time, _this2);
              throw new Error("Sprite.Sheet.play Invalid animation data");
            }

            // Play first frame in animation
            privates.currentAnimation = choice;
            privates.currentFrame = begin;
            _this2.emit("change");

            // Play other frame in animation
            privates.animationTimer = setInterval(function () {
              privates.currentFrame++;

              if (privates.currentFrame > end) {
                clearInterval(privates.animationTimer);
                privates.animationTimer = null;

                if (next && next.length && privates.animations[next]) {
                  _this2.play(next);
                } else {
                  privates.currentFrame--;
                }
                _this2.emit("animationend");
              }

              _this2.emit("change");
            }, time);
          })();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hlZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRTs7Ozs7OztBQUFDLEFBT2xDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7Ozs7Ozs7O0FBTXRDLGFBTjJCLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O3lFQUFYLFdBQVc7O0FBUXBDLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTSxDQUFDOztBQUU5QixVQUNJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUN2QyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUMxRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUM3RTtBQUNGLGVBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckIsY0FBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO09BQ25FOzs7Ozs7O0FBQUEsQUFPRCxjQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNOzs7Ozs7QUFBQyxBQU1oQyxjQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDbEMsWUFBSyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUs7Ozs7OztBQUFDLEFBTTFCLGNBQVEsQ0FBQyxV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QUMzRDs7O1dBbkowQixXQUFXO0tBQVMsTUFBTSxDQUFDLE9BQU8sRUFtVDdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVTaGVldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qaW1wb3J0IFwianMvU3ByaXRlL1Nwcml0ZURpc3BsYXlcIjtcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENsYXNzIFNwcml0ZS5TaGVldCwgbWF5YmUgdGhlIG1vc3QgaW1wb3J0ZW50IGNsYXNzXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLlNoZWV0LCBjb250YWluIHNwcml0ZSdzIHNoZWV0IGFuZCBpdCdzIGFuaW1hdGlvblxuICAgKiBAY2xhc3NcbiAgICogQGV4dGVuZHMgU3ByaXRlLkRpc3BsYXlcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJTaGVldFwiLCBjbGFzcyBTcHJpdGVTaGVldCBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLlNoZWV0XG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChjb25maWcpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKFxuICAgICAgICAgICFjb25maWcuaW1hZ2VzIHx8ICFjb25maWcuaW1hZ2VzLmxlbmd0aCB8fFxuICAgICAgICAgICFOdW1iZXIuaXNGaW5pdGUoY29uZmlnLndpZHRoKSB8fCBjb25maWcud2lkdGggPD0gMCB8fCBjb25maWcud2lkdGggPiA0MDk2IHx8XG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShjb25maWcuaGVpZ2h0KSB8fCBjb25maWcuaGVpZ2h0IDw9IDAgfHwgY29uZmlnLmhlaWdodCA+IDQwOTZcbiAgICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY29uZmlnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuY29uc3RydWN0b3IgZ2V0IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENvbnRhaW4gb25lIG9yIG1vcmUgaW1hZ2VzXG4gICAgICAgQHR5cGUge0FycmF5fVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmltYWdlcyA9IGNvbmZpZy5pbWFnZXM7XG4gICAgICAvKipcbiAgICAgICAqIFdpZHRoIG9mIGVhY2ggZnJhbWVcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLnRpbGV3aWR0aCA9IGNvbmZpZy53aWR0aDtcbiAgICAgIHRoaXMud2lkdGggPSBjb25maWcud2lkdGg7XG4gICAgICAvKipcbiAgICAgICAqIEhlaWdodCBvZiBlYWNoIGZyYW1lXG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy50aWxlaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcbiAgICAgIC8qKlxuICAgICAgICogQW5pbWF0aW9ucyBvZiB0aGlzIHNwcml0ZSBzaGVldCwgZWcuIHsgXCJ3YWxrZG93blwiOiBbMCwgMiwgXCJcIiwgNDBdLCBcIndhbGt1cFwiLCBbMywgNSwgXCJcIiwgNDBdIH1cbiAgICAgICBAdHlwZSB7T2JqZWN0fVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmFuaW1hdGlvbnMgPSBjb25maWcuYW5pbWF0aW9ucyB8fCB7fTtcbiAgICAgIC8qKlxuICAgICAgICogQ3VycmVudCBhbmltYXRpb24ncyBuYW1lLCBlZy4gXCJ3YWxrZG93blwiLCBcImF0dGFja3JpZ2h0XCJcbiAgICAgICBAdHlwZSB7c3RyaW5nfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmN1cnJlbnRBbmltYXRpb24gPSBudWxsO1xuICAgICAgLyoqXG4gICAgICAgKiBDdXJyZW50IGZyYW1lIG51bWJlciwgZWcuIDAsIDEsIDIsIDNcbiAgICAgICBAdHlwZSB7bnVtYmVyfVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAvKipcbiAgICAgICAqIElmIGFuaW1hdGlvblRpbWVyIGlzIG5vdCBudWxsLCBpdCBwb2ludHMgYW4gYW5pbWF0aW9uIGlzIHJ1bm5pbmdcbiAgICAgICAqIGl0IHdpbGwgYmUgbnVsbCBvciBhbiBoYW5kbGVyIGZyb20gc2V0SW50ZXJ2YWxcbiAgICAgICBAdHlwZSB7T2JqZWN0fVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmFuaW1hdGlvblRpbWVyID0gbnVsbDtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGZyYW1lcyB3ZSBoYXZlXG4gICAgICAgQHR5cGUge251bWJlcn1cbiAgICAgICBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5mcmFtZUNvdW50ID0gMDtcblxuICAgICAgZm9yIChsZXQgaW1hZ2Ugb2YgcHJpdmF0ZXMuaW1hZ2VzKSB7XG5cbiAgICAgICAgaWYgKCEoaW1hZ2UgaW5zdGFuY2VvZiBJbWFnZSkgJiYgIShpbWFnZS5nZXRDb250ZXh0ICYmIGltYWdlLmdldENvbnRleHQoXCIyZFwiKSkpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGltYWdlLCBwcml2YXRlcywgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0IGdvdCBpbnZhbGlkIGltYWdlLCBub3QgSW1hZ2Ugb3IgQ2FudmFzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltYWdlLndpZHRoIDw9IDAgfHwgIU51bWJlci5pc0Zpbml0ZShpbWFnZS53aWR0aCkgfHwgaW1hZ2UuaGVpZ2h0IDw9IDAgfHwgIU51bWJlci5pc0Zpbml0ZShpbWFnZS5oZWlnaHQpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihpbWFnZSwgcHJpdmF0ZXMsIHRoaXMpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldCBnb3QgaW52YWxpZCBpbWFnZSwgaW52YWxpZCB3aWR0aCBvciBoZWlnaHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29sID0gTWF0aC5mbG9vcihpbWFnZS53aWR0aCAvIHByaXZhdGVzLnRpbGV3aWR0aCk7XG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGltYWdlLmhlaWdodCAvIHByaXZhdGVzLnRpbGVoZWlnaHQpO1xuICAgICAgICBwcml2YXRlcy5mcmFtZUNvdW50ICs9IGNvbCAqIHJvdztcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvbmUgU3ByaXRlLlNoZWV0IG9iamVjdCBpdHNlbGZcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybiBhbiBjb3B5IG9mIHRoaXNcbiAgICAgKi9cbiAgICBjbG9uZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBzaGVldCA9IG5ldyBTcHJpdGUuU2hlZXQoe1xuICAgICAgICBpbWFnZXM6IHByaXZhdGVzLmltYWdlcyxcbiAgICAgICAgd2lkdGg6IHByaXZhdGVzLnRpbGV3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBwcml2YXRlcy50aWxlaGVpZ2h0LFxuICAgICAgICBhbmltYXRpb25zOiBwcml2YXRlcy5hbmltYXRpb25zXG4gICAgICB9KTtcbiAgICAgIHNoZWV0LnggPSB0aGlzLng7XG4gICAgICBzaGVldC55ID0gdGhpcy55O1xuICAgICAgc2hlZXQuY2VudGVyWCA9IHRoaXMuY2VudGVyWDtcbiAgICAgIHNoZWV0LmNlbnRlclkgPSB0aGlzLmNlbnRlclk7XG4gICAgICBzaGVldC5wbGF5KHRoaXMuY3VycmVudEZyYW1lKTtcbiAgICAgIHNoZWV0LmFscGhhID0gdGhpcy5hbHBoYTtcbiAgICAgIHNoZWV0LnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgICByZXR1cm4gc2hlZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybiBmYWxzZSBpZiBhbiBhbmltYXRpb24gaXMgcnVubmluZ1xuICAgICAqL1xuICAgIGdldCBwYXVzZWQgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2V0IHBhdXNlZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wYXVzZWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm4gY3VycmVudCBmcmFtZSBudW1iZXJcbiAgICAgKi9cbiAgICBnZXQgY3VycmVudEZyYW1lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmN1cnJlbnRGcmFtZTtcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudEZyYW1lICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNoZWV0LmN1cnJlbnRGcmFtZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFJldHVyblxuICAgICAqL1xuICAgIGdldCBjdXJyZW50QW5pbWF0aW9uICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmN1cnJlbnRBbmltYXRpb247XG4gICAgfVxuXG4gICAgc2V0IGN1cnJlbnRBbmltYXRpb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuY3VycmVudEFuaW1hdGlvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF5IGEgZnJhbWUgb3IgYW4gYW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNob2ljZSBmcmFtZSBudW1iZXIgb2YgYW5pbWF0aW9uIG5hbWUsIGVnLiAwIGZvciBmcmFtZSBvciBcIndhbGtkb3duXCIgZm9yIGFuaW1hdGlvblxuICAgICAqL1xuICAgIHBsYXkgKGNob2ljZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuYW5pbWF0aW9uVGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChwcml2YXRlcy5hbmltYXRpb25UaW1lcik7XG4gICAgICAgIHByaXZhdGVzLmFuaW1hdGlvblRpbWVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoY2hvaWNlKSkge1xuICAgICAgICAvLyBBcmd1bWVudCBwb2ludHMgYSBmcmFtZVxuICAgICAgICBwcml2YXRlcy5jdXJyZW50RnJhbWUgPSBjaG9pY2U7XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNob2ljZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIC8vIEFyZ3VtZW50IHBvaW50cyBhbiBhbmltYXRpb24gbmFtZVxuICAgICAgICBsZXQgYW5pbWF0aW9uID0gcHJpdmF0ZXMuYW5pbWF0aW9uc1tjaG9pY2VdO1xuXG4gICAgICAgIGlmICghYW5pbWF0aW9uKSB7IC8vIGlmIGFuaW1hdGlvbiBpcyBub3QgZXhpc3RcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGFuaW1hdGlvbiwgcHJpdmF0ZXMuYW5pbWF0aW9ucywgY2hvaWNlKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQucGxheSBpbnZhbGlkIGFuaW1hdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFuaW1hdGlvbiBpcyBzaW5nbGUgZnJhbWUgbnVtYmVyXG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoYW5pbWF0aW9uKSkge1xuICAgICAgICAgIHByaXZhdGVzLmN1cnJlbnRBbmltYXRpb24gPSBjaG9pY2U7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGxheShhbmltYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RhcnQgZnJhbWUgbnVtYmVyXG4gICAgICAgIGxldCBiZWdpbiA9IG51bGw7XG4gICAgICAgIC8vIGZpbmlzaCBmcmFtZSBudW1iZXJcbiAgICAgICAgbGV0IGVuZCA9IG51bGw7XG4gICAgICAgIC8vIHdoYXQgYWN0aW9uIGFmdGVyIGFuaW1hdGlvbiBmaW5pc2hlZFxuICAgICAgICBsZXQgbmV4dCA9IG51bGw7XG4gICAgICAgIC8vIHRoZSBzcGFjZSBiZXR3ZWVuIGVhY2ggZnJhbWUsIG1zXG4gICAgICAgIGxldCB0aW1lID0gbnVsbDtcblxuICAgICAgICBpZiAoYW5pbWF0aW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAvLyBpZiBhbmltYXRpb24gZm9ybWF0IGlzIGxpa2UgW2JlZ2luLCBlbmQsIG5leHQsIHRpbWVdXG4gICAgICAgICAgYmVnaW4gPSBhbmltYXRpb25bMF07XG4gICAgICAgICAgZW5kID0gYW5pbWF0aW9uWzFdO1xuICAgICAgICAgIG5leHQgPSBhbmltYXRpb25bMl07XG4gICAgICAgICAgdGltZSA9IGFuaW1hdGlvblszXTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmltYXRpb24uZnJhbWVzICYmIGFuaW1hdGlvbi5mcmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIC8vIGlmIGFuaW1hdGlvbiBmb3JtYXQgaXMgbGlrZSB7IGZyYW1lczogW2JlZ2luLCBlbmRdLCBuZXh0OiBcIm5leHRcIiwgc3BlZWQ6IFwidGltZVwiIH1cbiAgICAgICAgICBiZWdpbiA9IGFuaW1hdGlvbi5mcmFtZXNbMF07XG4gICAgICAgICAgZW5kID0gYW5pbWF0aW9uLmZyYW1lc1thbmltYXRpb24uZnJhbWVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIG5leHQgPSBhbmltYXRpb24ubmV4dDtcbiAgICAgICAgICB0aW1lID0gYW5pbWF0aW9uLnNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAvLyBEYXRhIGVuc3VyZVxuICAgICAgICAgICFOdW1iZXIuaXNGaW5pdGUoYmVnaW4pIHx8IGJlZ2luIDwgMCB8fCBiZWdpbiA+PSBwcml2YXRlcy5mcmFtZUNvdW50IHx8XG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShlbmQpIHx8IGVuZCA8IDAgfHwgZW5kID49IHByaXZhdGVzLmZyYW1lQ291bnQgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKHRpbWUpIHx8IHRpbWUgPD0gMFxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGJlZ2luLCBlbmQsIHRpbWUsIHRoaXMpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5TaGVldC5wbGF5IEludmFsaWQgYW5pbWF0aW9uIGRhdGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQbGF5IGZpcnN0IGZyYW1lIGluIGFuaW1hdGlvblxuICAgICAgICBwcml2YXRlcy5jdXJyZW50QW5pbWF0aW9uID0gY2hvaWNlO1xuICAgICAgICBwcml2YXRlcy5jdXJyZW50RnJhbWUgPSBiZWdpbjtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuXG4gICAgICAgIC8vIFBsYXkgb3RoZXIgZnJhbWUgaW4gYW5pbWF0aW9uXG4gICAgICAgIHByaXZhdGVzLmFuaW1hdGlvblRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHByaXZhdGVzLmN1cnJlbnRGcmFtZSsrO1xuXG4gICAgICAgICAgaWYgKHByaXZhdGVzLmN1cnJlbnRGcmFtZSA+IGVuZCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChwcml2YXRlcy5hbmltYXRpb25UaW1lcik7XG4gICAgICAgICAgICBwcml2YXRlcy5hbmltYXRpb25UaW1lciA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoICYmIHByaXZhdGVzLmFuaW1hdGlvbnNbbmV4dF0pIHtcbiAgICAgICAgICAgICAgdGhpcy5wbGF5KG5leHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJpdmF0ZXMuY3VycmVudEZyYW1lLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJhbmltYXRpb25lbmRcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICB9LCB0aW1lKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihjaG9pY2UsIGludGVybmFsKHRoaXMpLmFuaW1hdGlvbnMsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQucGxheSBoYXMgYW4gaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBjZXJ0YWluIGZyYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiBmcmFtZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gU3ByaXRlLkZyYW1lIG9iamVjdFxuICAgICAqL1xuICAgIGdldEZyYW1lIChpbmRleCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICAgIGluZGV4ID0gcHJpdmF0ZXMuY3VycmVudEZyYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHByaXZhdGVzLmZyYW1lQ291bnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihpbmRleCwgcHJpdmF0ZXMsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuZ2V0RnJhbWUgaW5kZXggb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZnJhbWUgPSBudWxsO1xuICAgICAgZm9yIChsZXQgaW1hZ2Ugb2YgcHJpdmF0ZXMuaW1hZ2VzKSB7XG4gICAgICAgIGxldCBjb2wgPSBNYXRoLmZsb29yKGltYWdlLndpZHRoIC8gcHJpdmF0ZXMudGlsZXdpZHRoKTtcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaW1hZ2UuaGVpZ2h0IC8gcHJpdmF0ZXMudGlsZWhlaWdodCk7XG4gICAgICAgIGlmIChpbmRleCA8IGNvbCAqIHJvdykge1xuICAgICAgICAgIC8vIHdoaWNoIHJvd1xuICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihpbmRleCAvIGNvbCk7XG4gICAgICAgICAgLy8gd2hpY2ggY29sdW1uXG4gICAgICAgICAgbGV0IGkgPSBpbmRleCAtIGNvbCAqIGo7XG4gICAgICAgICAgZnJhbWUgPSBuZXcgU3ByaXRlLkZyYW1lIChcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgaSAqIHByaXZhdGVzLnRpbGV3aWR0aCwgLy8geFxuICAgICAgICAgICAgaiAqIHByaXZhdGVzLnRpbGVoZWlnaHQsIC8vIHlcbiAgICAgICAgICAgIHByaXZhdGVzLnRpbGV3aWR0aCxcbiAgICAgICAgICAgIHByaXZhdGVzLnRpbGVoZWlnaHRcbiAgICAgICAgICApO1xuICAgICAgICAgIGZyYW1lLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXggLT0gKGNvbCAqIHJvdyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZnJhbWUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihpbmRleCwgcHJpdmF0ZXMsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuZ2V0RnJhbWUgdW5rbm93biBlcnJvclwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZyYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgdGhpcyBzaGVldCBvbiBjZXJ0YWluIHJlbmRlcmVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyIEEgcmVuZGVyZXIgZW5naW5lLCBlZy4gU3ByaXRlLldlYmdsXG4gICAgICovXG4gICAgZHJhdyAocmVuZGVyZXIpIHtcbiAgICAgIGlmICh0aGlzLnZpc2libGUgPT0gZmFsc2UgfHwgdGhpcy5hbHBoYSA8PSAwLjAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZnJhbWUgPSB0aGlzLmdldEZyYW1lKHRoaXMuY3VycmVudEZyYW1lKTtcblxuICAgICAgaWYgKCFmcmFtZSB8fCAhZnJhbWUuaW1hZ2UpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihmcmFtZSwgdGhpcy5jdXJyZW50RnJhbWUsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2hlZXQuZHJhdyBpbnZhbGlkIGZyYW1lXCIpO1xuICAgICAgfVxuXG4gICAgICBmcmFtZS5kcmF3KHJlbmRlcmVyKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
