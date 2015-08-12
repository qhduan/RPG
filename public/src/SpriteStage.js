/// @file SpriteStage.js
/// @namespace Sprite
/// class Sprite.Stage

(function () {
  "use strict";

  /// @class Sprite.Stage
  /// inherit the Sprite.Container
  Sprite.Stage = class Stage extends Sprite.Container {

    /// @function Sprite.Stage.constructor
    /// consturct a Sprite.Stage with width and height
    /// @param width, the width of stage you need
    /// @param height, the height of stage you need
    constructor (width, height) {
      super();

      this._canvas = document.createElement("canvas");
      this._canvas.width = width || 320;
      this._canvas.height = height || 240;

      this._context = this._canvas.getContext("2d");

      this._context.mozImageSmoothingEnabled = false;
      this._context.webkitImageSmoothingEnabled = false;
      this._context.msImageSmoothingEnabled = false;
      this._context.imageSmoothingEnabled = false;

      this._stageCacheCanvas = document.createElement("canvas");
      this._stageCacheCanvas.width = this._canvas.width;
      this._stageCacheCanvas.height = this._canvas.height;

      this._stageCacheCanvas.mozImageSmoothingEnabled = false;
      this._stageCacheCanvas.webkitImageSmoothingEnabled = false;
      this._stageCacheCanvas.msImageSmoothingEnabled = false;
      this._stageCacheCanvas.imageSmoothingEnabled = false;

      this._stageCacheContext = this._stageCacheCanvas.getContext("2d");

      this.on("addedChildren", () => {
        this.update();
      });

      this.on("removedChildren", () => {
        this.update();
      });

      this.on("changeFrame", (event) => {
        var offset = 500;
        if (event.target.x > -this.center.x - offset &&
            event.target.x < -this.center.x + this.width + offset &&
            event.target.y > -this.center.y - offset &&
            event.target.y < -this.center.y + this.height + offset) {
          this.update();
        }
      });

      var mousedown = false;

      var ConvertMouseEvent = (event) => {
        var x;
        var y;
        var type;
        var rect = this._canvas.getBoundingClientRect();

        if (event.targetTouches && event.targetTouches.length == 1) {
          var touch = event.targetTouches[0];
          x = touch.pageX - rect.left;
          y = touch.pageX - rect.top;
          type = "touch";
        } else {
          x = event.pageX - rect.left;
          y = event.pageY - rect.top;
          type = "mouse";
        }

        //x = x / this.scale.x + this.center.x;
        //y = y / this.scale.y + this.center.y;
        x = Math.round(x);
        y = Math.round(y);
        return {x, y, type};
      }

      this._canvas.addEventListener("mousedown", (event) => {
        mousedown = true;
        this.pressdown(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("mousemove", (event) => {
        if (mousedown)
          this.pressmove(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("mouseup", (event) => {
        mousedown = false;
        this.pressup(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        this.pressdown(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        this.pressmove(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchend", (event) => {
        event.preventDefault();
        this.pressup(ConvertMouseEvent(event));
      });

      this.pressdownElement = null;

    }

    findHit (event, mouse) {
      var hitted = super.hitTest(mouse.x, mouse.y);
      hitted.reverse();
      if (hitted.length)
        return hitted;
      return null;
    }

    pressdown (mouse) {
      var hit = this.findHit("pressdown", mouse);
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressdown", false, mouse);
        });
      }

      hit = this.findHit("click", mouse);
      if (hit) {
        this.pressdownElement = hit;
      }
    }

    pressmove (mouse) {
      var hit = this.findHit("pressmove", mouse);
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressmove", false, mouse);
        });
      }
    }

    pressup (mouse) {
      var hit = this.findHit("pressup", mouse);
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressup", false, mouse);
        });
      }

      hit = this.findHit("click", mouse);
      if (hit) {
        hit.forEach((element) => {
          if (this.pressdownElement && this.pressdownElement.indexOf(element) != -1) {
            element.emit("click");
          }
        });
      }

      this.pressdownElement = null;
    }

    get width () {
      return this._canvas.width;
    }

    set width (value) {
      this._canvas.width = value;
      this._stageCacheCanvas.width = this._canvas.width;
    }

    get height () {
      return this._canvas.height;
    }

    set height (value) {
      this._canvas.height = value;
      this._stageCacheCanvas.height = this._canvas.height;
    }

    get canvas () {
      return this._canvas;
    }

    set canvas (value) {
      throw new TypeError("Sprite.Stage.canvas readonly")
    }

    /// @function Sprite.Stage.clear
    /// clear the stage
    clear () {
      this._context.fillStyle = "white";
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      //this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    update () {
      return this.draw();
    }

    draw () {
      if (this._drawing) return false;
      this._drawing = true;
      this.emit("drawStart");

      if (this._children.length <= 0) return false;

      this._children.forEach((element) => {
        element.draw(this._stageCacheContext);
      });

      this.clear();
      this._context.drawImage(this._stageCacheCanvas, 0, 0);
      //this._stageCacheContext.clearRect(0, 0, this._stageCacheCanvas.width, this._stageCacheCanvas.height);

      this.emit("drawEnd");
      this._drawing = false;
      return true;
    }
  };

})();
