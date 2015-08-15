
(function () {
  "use strict";

  Sprite.Sheet = class Sheet extends Sprite.Display {
    constructor (config) {
      super();

      if (!config.images || !config.width || !config.height) {
        console.log(config)
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

    clone () {
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

    get paused () {
      if (this._animationTimer)
        return false;
      return true;
    }

    set paused (value) {
      throw new Error("Sprite.Sheet 'paused' readonly");
    }

    get currentFrame () {
      return this._currentFrame;
    }

    set currentFrame (value) {
      throw new Error("Sprite.Sheet.currentFrame readonly");
    }

    get currentAnimation () {
      return this._currentAnimation;
    }

    set currentAnimation (value) {
      throw new Error("Sprite.Sheet.currentAnimation readonly");
    }

    play (choice) {
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

        this._animationTimer = setInterval(() => {
          this._currentFrame++;
          if (this._currentFrame > end) {
            clearInterval(this._animationTimer);
            this._animationTimer = null;
            if (next && next.length && this._animations[next]) {
              this.play(next);
            } else {
              this._currentFrame--;
            }
            this.emit("animationend");
          }
          this.emit("change");
        }, time);
      } else {
        throw new Error("Sprite.Sheet.play has an invalid argument");
      }
    }

    getFrame (frame) {
      for (let i = 0; i < this._images.length; i++) {
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
            center: this.center,
          };
        } else {
          frame -= row * col;
        }
      }
    }

    draw (context) {
      var frame = this.getFrame(this._currentFrame);
      if (!frame || !frame.image) {
        console.error(frame, this._currentFrame, this);
        throw new Error("Sprite.Sheet.draw invalid frame");
      }
      this.drawImage(context, frame.image, frame.x, frame.y, frame.width, frame.height);
    }

  };

})();
