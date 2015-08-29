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
/// class Sprite.Display

(function () {
  "use strict";

  var hitCanvas = document.createElement("canvas");
  hitCanvas.width = 1;
  hitCanvas.height = 1;
  var hitContext = hitCanvas.getContext("2d");
  hitContext.clearRect(0, 0, 1, 1);
  var hitData = hitContext.getImageData(0, 0, 1, 1).data;

  /// @class Sprite.Display
  /// inherit the Sprite.Event, a basic class
  Sprite.Display = class Display extends Sprite.Event {

    /// @function Sprite.Display.constructor
    /// construct a Sprite.Display
    constructor () {
      super();

      this._x = 0;
      this._y = 0;
      this._centerX = 0;
      this._centerY = 0;
      this._alpha = 1;
      this._visible = true;
      this._parent = null;
    }

    get parent () {
      return this._parent;
    }

    set parent (value) {
      this._parent = value;
    }

    get x () {
      return this._x;
    }

    set x (value) {
      if (value != this._x) {
        this._x = value;
        this.emit("change");
      }
    }

    get y () {
      return this._y;
    }

    set y (value) {
      if (value != this._y) {
        this._y = value;
        this.emit("change");
      }
    }

    get centerX () {
      return this._centerX;
    }

    set centerX (value) {
      if (value != this._centerX) {
        this._centerX = value;
        this.emit("change");
      }
    }

    get centerY () {
      return this._centerY;
    }

    set centerY (value) {
      if (value != this._centerY) {
        this._centerY = value;
        this.emit("change");
      }
    }



    get alpha () {
      return this._alpha;
    }

    set alpha (value) {
      if (value != this._alpha) {
        this._alpha = value;
        this.emit("change");
      }
    }

    get visible () {
      return this._visible;
    }

    set visible (value) {
      if (value != this._visible) {
        this._visible = value;
        this.emit("change");
      }
    }

    realPosition () {
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
        position,
        center,
        scale,
      };
    }

    /// @function Sprite.Display.draw
    draw (context) {
      throw new Error("Invalid call Sprite.Display.draw");
    }

    /// @function Sprite.Display.hitTest
    hitTest (x, y) {

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
    drawImage (renderer, image, sx, sy, swidth, sheight) {
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
        renderer.drawImage(
          image, sx, sy, swidth, sheight,
          dx, dy, swidth, sheight
        );
      }
    }
  };

})();
