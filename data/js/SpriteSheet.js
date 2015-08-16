"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  Sprite.Sheet = (function (_Sprite$Display) {
    _inherits(Sheet, _Sprite$Display);

    function Sheet(config) {
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
        sheet.center.x = this.center.x;
        sheet.center.y = this.center.y;
        sheet.scale.x = this.scale.x;
        sheet.scale.y = this.scale.y;
        sheet._currentFrame = this._currentFrame;
        return sheet;
      }
    }, {
      key: "play",
      value: function play(choice) {
        var _this = this;

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
            _this._currentFrame++;
            if (_this._currentFrame > end) {
              clearInterval(_this._animationTimer);
              _this._animationTimer = null;
              if (next && next.length && _this._animations[next]) {
                _this.play(next);
              } else {
                _this._currentFrame--;
              }
              _this.emit("animationend");
            }
            _this.emit("change");
          }, time);
        } else {
          throw new Error("Sprite.Sheet.play has an invalid argument");
        }
      }
    }, {
      key: "getFrame",
      value: function getFrame(frame) {
        for (var i = 0; i < this._images.length; i++) {
          var image = this._images[i];
          var col = Math.floor(image.width / this._tilewidth);
          var row = Math.floor(image.height / this._tileheight);
          if (frame < row * col) {
            return {
              image: image,
              x: Math.floor(frame % col) * this._tilewidth,
              y: Math.floor(frame / col) * this._tileheight,
              width: this._tilewidth,
              height: this._tileheight,
              center: this.center
            };
          } else {
            frame -= row * col;
          }
        }
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var frame = this.getFrame(this._currentFrame);
        if (!frame || !frame.image) {
          console.error(frame, this._currentFrame, this);
          throw new Error("Sprite.Sheet.draw invalid frame");
        }
        this.drawImage(context, frame.image, frame.x, frame.y, frame.width, frame.height);
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
})();
//# sourceMappingURL=SpriteSheet.js.map
