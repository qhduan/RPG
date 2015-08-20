/// @file SpriteStage.js
/// @namespace Sprite
/// class Sprite.Stage

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  /// @class Sprite.Stage
  /// inherit the Sprite.Container
  Sprite.Stage = (function (_Sprite$Container) {
    _inherits(Stage, _Sprite$Container);

    /// @function Sprite.Stage.constructor
    /// consturct a Sprite.Stage with width and height
    /// @param width, the width of stage you need
    /// @param height, the height of stage you need

    function Stage(width, height) {
      var _this = this;

      _classCallCheck(this, Stage);

      _get(Object.getPrototypeOf(Stage.prototype), "constructor", this).call(this);

      this._color = "black";
      this._renderer = new Sprite.Webgl(width, height);

      var mousedown = false;

      var ConvertMouseEvent = function ConvertMouseEvent(event) {
        var x;
        var y;
        var type;
        var rect = _this.canvas.getBoundingClientRect();

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

        var scaleX = rect.width / _this.width;
        var scaleY = rect.height / _this.height;

        x = Math.floor(x / scaleX);
        y = Math.floor(y / scaleY);

        if (x >= 0 && y >= 0) {
          _this.mouseX = x;
          _this.mouseY = y;
          _this.mouseType = type;
          return true;
        } else {
          return false;
        }
      };

      this.canvas.addEventListener("mousedown", function (event) {
        if (ConvertMouseEvent(event)) _this.pressdown();
      });

      this.canvas.addEventListener("mousemove", function (event) {
        if (ConvertMouseEvent(event)) _this.pressmove();
      });

      this.canvas.addEventListener("mouseup", function (event) {
        if (ConvertMouseEvent(event)) _this.pressup();
      });

      this.canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        if (ConvertMouseEvent(event)) _this.pressdown();
      });

      this.canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        if (ConvertMouseEvent(event)) _this.pressmove();
      });

      this.canvas.addEventListener("touchend", function (event) {
        event.preventDefault();
        if (ConvertMouseEvent(event)) _this.pressup();
      });

      this.canvas.addEventListener("touchleave", function (event) {
        event.preventDefault();
        if (ConvertMouseEvent(event)) _this.pressup();
      });

      this.pressdownElement = null;
    }

    _createClass(Stage, [{
      key: "findHit",
      value: function findHit(event) {
        var hitted = _get(Object.getPrototypeOf(Stage.prototype), "hitTest", this).call(this, this.mouseX, this.mouseY);
        hitted.reverse();
        if (hitted.length) return hitted;
        return null;
      }
    }, {
      key: "pressdown",
      value: function pressdown() {
        var hit = this.findHit("pressdown");
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressdown", false);
          });
        }

        hit = this.findHit("click");
        if (hit) {
          this.pressdownElement = hit;
        }

        this.emit("stagemousedown");
      }
    }, {
      key: "pressmove",
      value: function pressmove(mouse) {
        var hit = this.findHit("pressmove");
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressmove", false);
          });
        }
      }
    }, {
      key: "pressup",
      value: function pressup(mouse) {
        var _this2 = this;

        var hit = this.findHit("pressup");
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressup", false);
          });
        }

        hit = this.findHit("click");
        if (hit) {
          hit.forEach(function (element) {
            if (_this2.pressdownElement && _this2.pressdownElement.indexOf(element) != -1) {
              element.emit("click");
            }
          });
        }

        this.pressdownElement = null;

        this.emit("stagemouseup");
      }
    }, {
      key: "clear",

      /// @function Sprite.Stage.clear
      /// clear the stage
      value: function clear() {
        this._context.fillStyle = "white";
        this._context.fillRect(0, 0, this._renderer.width, this._renderer.height);
        //this._context.clearRect(0, 0, this._renderer.width, this._renderer.height);
      }
    }, {
      key: "update",
      value: function update() {
        this.draw();
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this3 = this;

        this.emit("drawStart");

        if (this._children.length <= 0) return false;

        this._renderer.clear();

        this._children.forEach(function (element) {
          element.draw(_this3._renderer);
        });

        this.emit("drawEnd");
      }
    }, {
      key: "width",
      get: function get() {
        return this._renderer.width;
      },
      set: function set(value) {
        this._renderer.width = value;
        this._stageCacheCanvas.width = this._renderer.width;
      }
    }, {
      key: "height",
      get: function get() {
        return this._renderer.height;
      },
      set: function set(value) {
        this._renderer.height = value;
        this._stageCacheCanvas.height = this._renderer.height;
      }
    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        if (this._color != value) {
          this._color = value;
          this.update();
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return this._renderer.canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.canvas readonly");
      }
    }]);

    return Stage;
  })(Sprite.Container);
})();
//# sourceMappingURL=SpriteStage.js.map
