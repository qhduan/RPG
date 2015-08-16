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

      this._canvas = document.createElement("canvas");
      this._canvas.width = width || 320;
      this._canvas.height = height || 240;

      this._context = this._canvas.getContext("2d");
      this._context.imageSmoothingEnabled = false;

      this._stageCacheCanvas = document.createElement("canvas");
      this._stageCacheCanvas.width = this._canvas.width;
      this._stageCacheCanvas.height = this._canvas.height;

      this._stageCacheContext = this._stageCacheCanvas.getContext("2d");
      this._stageCacheContext.imageSmoothingEnabled = false;

      this._updateNextTick = false;

      this.on("addedChildren", function () {
        _this.update();
      });

      this.on("removedChildren", function () {
        _this.update();
      });

      this.on("change", function () {
        _this.update();
      });

      Sprite.Ticker.on("tick", function () {
        if (_this._updateNextTick) {
          _this._updateNextTick = false;
          _this.draw();
        }
      });

      var mousedown = false;

      var ConvertMouseEvent = function ConvertMouseEvent(event) {
        var x;
        var y;
        var type;
        var rect = _this._canvas.getBoundingClientRect();

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
        return { x: x, y: y, type: type };
      };

      this._canvas.addEventListener("mousedown", function (event) {
        mousedown = true;
        _this.pressdown(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("mousemove", function (event) {
        if (mousedown) _this.pressmove(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("mouseup", function (event) {
        mousedown = false;
        _this.pressup(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        _this.pressdown(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        _this.pressmove(ConvertMouseEvent(event));
      });

      this._canvas.addEventListener("touchend", function (event) {
        event.preventDefault();
        _this.pressup(ConvertMouseEvent(event));
      });

      this.pressdownElement = null;
    }

    _createClass(Stage, [{
      key: "findHit",
      value: function findHit(event, mouse) {
        var hitted = _get(Object.getPrototypeOf(Stage.prototype), "hitTest", this).call(this, mouse.x, mouse.y);
        hitted.reverse();
        if (hitted.length) return hitted;
        return null;
      }
    }, {
      key: "pressdown",
      value: function pressdown(mouse) {
        var hit = this.findHit("pressdown", mouse);
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressdown", false, mouse);
          });
        }

        hit = this.findHit("click", mouse);
        if (hit) {
          this.pressdownElement = hit;
        }
      }
    }, {
      key: "pressmove",
      value: function pressmove(mouse) {
        var hit = this.findHit("pressmove", mouse);
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressmove", false, mouse);
          });
        }
      }
    }, {
      key: "pressup",
      value: function pressup(mouse) {
        var _this2 = this;

        var hit = this.findHit("pressup", mouse);
        if (hit) {
          hit.forEach(function (element) {
            element.emit("pressup", false, mouse);
          });
        }

        hit = this.findHit("click", mouse);
        if (hit) {
          hit.forEach(function (element) {
            if (_this2.pressdownElement && _this2.pressdownElement.indexOf(element) != -1) {
              element.emit("click");
            }
          });
        }

        this.pressdownElement = null;
      }
    }, {
      key: "clear",

      /// @function Sprite.Stage.clear
      /// clear the stage
      value: function clear() {
        this._context.fillStyle = "white";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        //this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }, {
      key: "update",
      value: function update() {
        this._updateNextTick = true;
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this3 = this;

        this.emit("drawStart");

        if (this._children.length <= 0) return false;

        this._children.forEach(function (element) {
          element.draw(_this3._stageCacheContext);
        });

        this.clear();
        this._context.drawImage(this._stageCacheCanvas, 0, 0);
        //this._stageCacheContext.clearRect(0, 0, this._stageCacheCanvas.width, this._stageCacheCanvas.height);
        this._stageCacheContext.fillStyle = this._color;
        this._stageCacheContext.fillRect(0, 0, this._stageCacheCanvas.width, this._stageCacheCanvas.height);

        this.emit("drawEnd");
      }
    }, {
      key: "width",
      get: function get() {
        return this._canvas.width;
      },
      set: function set(value) {
        this._canvas.width = value;
        this._stageCacheCanvas.width = this._canvas.width;
      }
    }, {
      key: "height",
      get: function get() {
        return this._canvas.height;
      },
      set: function set(value) {
        this._canvas.height = value;
        this._stageCacheCanvas.height = this._canvas.height;
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
        return this._canvas;
      },
      set: function set(value) {
        throw new TypeError("Sprite.Stage.canvas readonly");
      }
    }]);

    return Stage;
  })(Sprite.Container);
})();