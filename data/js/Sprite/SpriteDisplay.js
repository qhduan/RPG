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

/// @file SpriteDisplay.js
/// @namespace Sprite
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (Sprite) {
  "use strict";

  var hitCanvas = document.createElement("canvas");
  hitCanvas.width = 1;
  hitCanvas.height = 1;
  var hitContext = hitCanvas.getContext("2d");
  hitContext.clearRect(0, 0, 1, 1);
  var hitData = hitContext.getImageData(0, 0, 1, 1).data;

  /// @class Sprite.Display
  /// inherit the Sprite.Event, a basic class
  Sprite.Display = (function (_Sprite$Event) {
    _inherits(Display, _Sprite$Event);

    /// @function Sprite.Display.constructor
    /// construct a Sprite.Display

    function Display() {
      _classCallCheck(this, Display);

      _get(Object.getPrototypeOf(Display.prototype), "constructor", this).call(this);

      this._x = 0;
      this._y = 0;
      this._centerX = 0;
      this._centerY = 0;
      this._alpha = 1;
      this._visible = true;
      this._parent = null;
    }

    _createClass(Display, [{
      key: "realPosition",
      value: function realPosition() {
        var scale = {
          x: this.scaleX,
          y: this.scaleY
        };
        var center = {
          x: this.centerX,
          y: this.centerY
        };
        var position = {
          x: this.x,
          y: this.y
        };

        var obj = this.parent;
        while (obj) {
          scale.x *= obj.scaleX;
          scale.y *= obj.scaleY;
          center.x += obj.centerX;
          center.y += obj.centerY;
          position.x += obj.x;
          position.y += obj.y;
          obj = obj.parent;
        }

        position.x = (position.x - center.x) * scale.x;
        position.y = (position.y - center.y) * scale.y;
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);

        return {
          position: position,
          center: center,
          scale: scale
        };
      }

      /// @function Sprite.Display.draw
    }, {
      key: "draw",
      value: function draw(context) {
        throw new Error("Invalid call Sprite.Display.draw");
      }

      /// @function Sprite.Display.hitTest
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {

        /*
        var data = this.realPosition();
        var dx = Math.floor(data.position.x);
        var dy = Math.floor(data.position.y);
        var dwidth = Math.floor(100 * data.scaleX);
        var dheight = Math.floor(100 * data.scaleY);
        if (dx > x && dy > y)
          return false;
        if ((dx + dwidth) < x && (dy + dheight) < y)
          return false;
          */

        hitContext.clearRect(0, 0, 1, 1);
        hitContext.save();
        hitContext.translate(-x, -y);
        this.draw(hitContext);
        hitContext.restore();
        var newData = hitContext.getImageData(0, 0, 1, 1).data;

        if (hitData[0] != newData[0] || hitData[1] != newData[1] || hitData[2] != newData[2]) {
          return true;
        }
        /*
        context.clearRect(x, y, 1, 1);
        var oldData = context.getImageData(x, y, 1, 1).data;
        this.draw(context);
        var newData = context.getImageData(x, y, 1, 1).data;
        if (oldData[0] != newData[0] || oldData[1] != newData[1] || oldData[2] != newData[2]) {
          return true;
        }
        */

        return false;
      }

      /// @function Sprite.Display.drawImage
      /// image, draw a 'box' from.scaleX.scaleY to swidth,sheight on context
      /// x=0,y=0--------------------------------------
      /// -                                           -
      /// -    sx.sy------------                      -
      /// -    -               -                      -
      /// -    ---swidth,sheight                      -
      /// -                                           -
      /// ---------------------image.width,image.height
      /// draw an image on context
      /// @param context a 2d context from canvas
      /// @param image, the image we wang to draw
      /// @param.scaleX the x position of image
      /// @param.scaleY the y position of image
      /// @param swidth the width of image we want to draw
      /// @param sheight the height of image we want to draw
    }, {
      key: "drawImage",
      value: function drawImage(renderer, image, sx, sy, swidth, sheight) {
        if (this.visible == true && this.alpha > 0) {
          var center = {
            x: this.centerX,
            y: this.centerY
          };
          var position = {
            x: this.x,
            y: this.y
          };

          var obj = this.parent;
          while (obj) {
            center.x += obj.centerX;
            center.y += obj.centerY;
            position.x += obj.x;
            position.y += obj.y;
            obj = obj.parent;
          }

          var dx = position.x - center.x;
          var dy = position.y - center.y;

          renderer.alpha = this.alpha;
          renderer.drawImage(image, sx, sy, swidth, sheight, dx, dy, swidth, sheight);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        return this._parent;
      },
      set: function set(value) {
        this._parent = value;
      }
    }, {
      key: "x",
      get: function get() {
        return this._x;
      },
      set: function set(value) {
        if (value != this._x) {
          this._x = value;
          this.emit("change");
        }
      }
    }, {
      key: "y",
      get: function get() {
        return this._y;
      },
      set: function set(value) {
        if (value != this._y) {
          this._y = value;
          this.emit("change");
        }
      }
    }, {
      key: "centerX",
      get: function get() {
        return this._centerX;
      },
      set: function set(value) {
        if (value != this._centerX) {
          this._centerX = value;
          this.emit("change");
        }
      }
    }, {
      key: "centerY",
      get: function get() {
        return this._centerY;
      },
      set: function set(value) {
        if (value != this._centerY) {
          this._centerY = value;
          this.emit("change");
        }
      }
    }, {
      key: "alpha",
      get: function get() {
        return this._alpha;
      },
      set: function set(value) {
        if (value != this._alpha) {
          this._alpha = value;
          this.emit("change");
        }
      }
    }, {
      key: "visible",
      get: function get() {
        return this._visible;
      },
      set: function set(value) {
        if (value != this._visible) {
          this._visible = value;
          this.emit("change");
        }
      }
    }]);

    return Display;
  })(Sprite.Event);
})(Sprite);
/// class Sprite.Display
//# sourceMappingURL=SpriteDisplay.js.map
