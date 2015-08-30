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

/// @file SpriteSheet.js
/// @namespace Sprite
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (Sprite) {
  "use strict";

  Sprite.Sheet = (function (_Sprite$Display) {
    _inherits(Sheet, _Sprite$Display);

    function Sheet(config) {
      var _this = this;

      _classCallCheck(this, Sheet);

      _get(Object.getPrototypeOf(Sheet.prototype), "constructor", this).call(this);

      if (!config.images || !config.width || !config.height) {
        console.log(config);
        throw new TypeError("Sprite.Sheet.constructor get invalid arguments");
      }

      this._images = config.images;
      this._tilewidth = config.width;
      this._tileheight = config.height;
      this._animations = config.animations || {};
      this._currentAnimation = null;
      this._currentFrame = 0;
      this._animationTimer = null;

      this._frames = [];

      this._images.forEach(function (image) {
        var col = Math.floor(image.width / _this._tilewidth);
        var row = Math.floor(image.height / _this._tileheight);
        for (var j = 0; j < row; j++) {
          for (var i = 0; i < col; i++) {
            _this._frames.push({
              image: image,
              x: i * _this._tilewidth,
              y: j * _this._tileheight
            });
          }
        }
      });
    }

    _createClass(Sheet, [{
      key: "clone",
      value: function clone() {
        var sheet = new Sheet({
          images: this._images,
          width: this._tilewidth,
          height: this._tileheight,
          animations: this._animations
        });
        sheet.x = this.x;
        sheet.y = this.y;
        sheet.centerX = this.centerX;
        sheet.centerY = this.centerY;
        sheet.scaleX = this.scaleX;
        sheet.scaleY = this.scaleY;
        sheet._currentFrame = this._currentFrame;
        return sheet;
      }
    }, {
      key: "play",
      value: function play(choice) {
        var _this2 = this;

        if (this._animationTimer) {
          clearInterval(this._animationTimer);
          this._animationTimer = null;
        }

        if (typeof choice == "number") {
          this._currentFrame = choice;
          this.emit("change");
        } else if (typeof choice == "string") {

          var animation = this._animations[choice];

          if (!animation) {
            console.error(animation, this._animations, choice);
            throw new Error("Sprite.Sheet.play invalid animation");
          }

          // if animation is single frame number
          if (typeof animation == "number") {
            this._currentAnimation = choice;
            this.play(animation);
            return;
          }

          var begin;
          var end;
          var next;
          var time;

          if (animation instanceof Array) {
            begin = animation[0];
            end = animation[1];
            next = animation[2];
            time = animation[3];
          } else if (animation.frames instanceof Array) {
            begin = animation.frames[0];
            end = animation.frames[animation.frames.length - 1];
            next = animation.next;
            time = animation.speed;
          }

          if (typeof begin != "number" || typeof end != "number" || typeof time != "number") {
            console.error(begin, end, time);
            throw new Error("Sprite.Sheet.play Invalid Sheet Data");
          }

          this._currentAnimation = choice;
          this._currentFrame = begin;
          this.emit("change");

          this._animationTimer = setInterval(function () {
            _this2._currentFrame++;
            if (_this2._currentFrame > end) {
              clearInterval(_this2._animationTimer);
              _this2._animationTimer = null;
              if (next && next.length && _this2._animations[next]) {
                _this2.play(next);
              } else {
                _this2._currentFrame--;
              }
              _this2.emit("animationend");
            }
            _this2.emit("change");
          }, time);
        } else {
          throw new Error("Sprite.Sheet.play has an invalid argument");
        }
      }
    }, {
      key: "getFrame",
      value: function getFrame(index) {
        if (typeof index != "number") {
          index = this.currentFrame;
        }
        var frame = this._frames[index];
        var frameObj = new Sprite.Frame(frame.image, frame.x, frame.y, this._tilewidth, this._tileheight);
        frameObj.parent = this;
        return frameObj;
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
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
        if (this._animationTimer) return false;
        return true;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet 'paused' readonly");
      }
    }, {
      key: "currentFrame",
      get: function get() {
        return this._currentFrame;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentFrame readonly");
      }
    }, {
      key: "currentAnimation",
      get: function get() {
        return this._currentAnimation;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentAnimation readonly");
      }
    }]);

    return Sheet;
  })(Sprite.Display);
})(Sprite);
/// class Sprite.Sheet