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

/// @file SpriteText.js
/// @namespace Sprite
/// class Sprite.Text

(function () {
  "use strict";

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  Sprite.Text = class Text extends Sprite.Display {
    constructor (config) {
      super();
      this._config = config;
      this._text = config.text || "Hello World!";
      this._maxWidth = config.maxWidth || 1000;
      this._color = config.color || "black";
      this._fontSize = config.fontSize || 14;
      this._fontFamily = config.fontFamily || "Ariel";
      this._image = null;
      this.generate();
    }

    clone () {
      var text = new Text(this._config);
      text.x = this.x;
      text.y = this.y;
      text.centerX = this.centerX;
      text.centerY = this.centerY;
      text.scaleX = this.scaleX;
      text.scaleY = this.scaleY;
      return text;
    }

    get svg () {
      return this._svg;
    }

    set svg (value) {
      throw new TypeError("Sprite.Text.svg readonly");
    }

    get text () {
      return this._text;
    }

    set text (value) {
      this._text = value;
      this.generate();
    }

    get width () {
      return this._width;
    }

    set width (value) {
      this._width = value;
      this.generate();
    }

    get height () {
      return this._height;
    }

    set height (value) {
      this._height = value;
      this.generate();
    }

    get color () {
      return this._color;
    }

    set color (value) {
      this._color = value;
      this.generate();
    }

    get fontSize () {
      return this._fontSize;
    }

    set fontSize (value) {
      this._fontSize = value;
      this.generate();
    }

    get fontFamily () {
      return this._fontFamily;
    }

    set fontFamily (value) {
      this._fontFamily = value;
      this.generate();
    }

    generate () {
      textContext.font = this._fontSize + "px " + this._fontFamily;
      // "龍" is the max-width & max-height Chinese word I think
      var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
      this._width = 0;

      // find the real-maximum-width of multiline text, base user's maxWidth
      var lines = [];
      var lineText = "";
      for (let i = 0; i < this._text.length; i++) {
        if (textContext.measureText(lineText + this._text[i]).width > this._maxWidth) {
          lines.push(lineText);
          lineText = this._text[i];
        } else {
          lineText += this._text[i];
        }
        if (textContext.measureText(lineText).width > this._width)
          this._width = Math.ceil(textContext.measureText(lineText).width);
      }

      if (lineText.length) {
        lines.push(lineText);
      }

      this._height = lines.length * lineHeight;

      var canvas = document.createElement("canvas");
      canvas.width = this._width;
      canvas.height = this._height;
      var context = canvas.getContext("2d");
      context.font = this._fontSize + "px " + this._fontFamily;
      context.fillStyle = this._color;
      context.textAlign = "center";
      context.textBaseline = "top";
      // draw each line
      lines.forEach((element, index) => {
        context.fillText(element, canvas.width/2, index*lineHeight)
      });

      this._image = canvas;
    }

    draw (context) {
      if (this._image && this._image.width > 0 && this._image.height > 0) {
        this.drawImage(
          context,
          this._image,
          0,
          0,
          this._image.width,
          this._image.height
        );
      }
    }
  }


})();
