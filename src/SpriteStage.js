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

      this._color = "black";
      this._renderer = new Sprite.Webgl(width, height);

      var mousedown = false;

      var ConvertMouseEvent = (event) => {
        var x;
        var y;
        var type;
        var rect = this.canvas.getBoundingClientRect();

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

        var scaleX = rect.width / this.width;
        var scaleY = rect.height / this.height;

        x = Math.floor(x / scaleX);
        y = Math.floor(y / scaleY);

        if (x >= 0 && y >= 0) {
          this.mouseX = x;
          this.mouseY = y;
          this.mouseType = type;
          return true;
        } else {
          return false;
        }
      }

      this.canvas.addEventListener("mousedown", (event) => {
        if (ConvertMouseEvent(event))
          this.pressdown();
      });

      this.canvas.addEventListener("mousemove", (event) => {
        if (ConvertMouseEvent(event))
          this.pressmove();
      });

      this.canvas.addEventListener("mouseup", (event) => {
        if (ConvertMouseEvent(event))
          this.pressup();
      });

      this.canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (ConvertMouseEvent(event))
          this.pressdown();
      });

      this.canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        if (ConvertMouseEvent(event))
          this.pressmove();
      });

      this.canvas.addEventListener("touchend", (event) => {
        event.preventDefault();
        if (ConvertMouseEvent(event))
          this.pressup();
      });

      this.canvas.addEventListener("touchleave", (event) => {
        event.preventDefault();
        if (ConvertMouseEvent(event))
          this.pressup();
      });

      this.pressdownElement = null;

    }

    findHit (event) {
      var hitted = super.hitTest(this.mouseX, this.mouseY);
      hitted.reverse();
      if (hitted.length)
        return hitted;
      return null;
    }

    pressdown () {
      var hit = this.findHit("pressdown");
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressdown", false);
        });
      }

      hit = this.findHit("click");
      if (hit) {
        this.pressdownElement = hit;
      }

      this.emit("stagemousedown");
    }

    pressmove (mouse) {
      var hit = this.findHit("pressmove");
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressmove", false);
        });
      }
    }

    pressup (mouse) {
      var hit = this.findHit("pressup");
      if (hit) {
        hit.forEach((element) => {
          element.emit("pressup", false);
        });
      }

      hit = this.findHit("click");
      if (hit) {
        hit.forEach((element) => {
          if (this.pressdownElement && this.pressdownElement.indexOf(element) != -1) {
            element.emit("click");
          }
        });
      }

      this.pressdownElement = null;

      this.emit("stagemouseup");
    }

    get width () {
      return this._renderer.width;
    }

    set width (value) {
      this._renderer.width = value;
      this._stageCacheCanvas.width = this._renderer.width;
    }

    get height () {
      return this._renderer.height;
    }

    set height (value) {
      this._renderer.height = value;
      this._stageCacheCanvas.height = this._renderer.height;
    }

    get color () {
      return this._color;
    }

    set color (value) {
      if (this._color != value) {
        this._color = value;
        this.update();
      }
    }

    get canvas () {
      return this._renderer.canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Stage.canvas readonly")
    }

    /// @function Sprite.Stage.clear
    /// clear the stage
    clear () {
      this._context.fillStyle = "white";
      this._context.fillRect(0, 0, this._renderer.width, this._renderer.height);
      //this._context.clearRect(0, 0, this._renderer.width, this._renderer.height);
    }

    update () {
      this.draw();
    }

    draw () {
      this.emit("drawStart");

      if (this._children.length <= 0) return false;

      this._renderer.clear();

      this._children.forEach((element) => {
        element.draw(this._renderer);
      });

      this.emit("drawEnd");
    }
  };

})();
