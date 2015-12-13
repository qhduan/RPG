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

/**
 * @fileoverview Define the Sprite.Text to show text in game
 * @author mail@qhduan.com (QH Duan)
 */

 (function () {
   "use strict";

  let internal = Sprite.Namespace();

  let textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  let textContext = textCanvas.getContext("2d");

  /**
   * Class Sprite.Text, contain text
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Text", class SpriteText extends Sprite.Display {
    /**
     * construct Sprite.Text
     * @constructor
     */
    constructor (config) {
      super();
      let privates = internal(this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      this.generate();
    }

    clone () {
      let privates = internal(this);
      let text = new Text({
        text: privates.text,
        maxWidth: privates.maxWidth,
        color: privates.color,
        fontSize: privates.fontSize,
        fontFamily: privates.fontFamily
      });
      text.x = this.x;
      text.y = this.y;
      text.centerX = this.centerX;
      text.centerY = this.centerY;
      text.alpha = this.alpha;
      text.visible = this.visible;
      return text;
    }

    get text () {
      let privates = internal(this);
      return privates.text;
    }

    set text (value) {
      let privates = internal(this);
      if (value != this.text) {
        privates.text = value;
        this.generate();
      }
    }

    get color () {
      let privates = internal(this);
      return privates.color;
    }

    set color (value) {
      let privates = internal(this);
      if (value != this.color) {
        privates.color = value;
        this.generate();
      }
    }

    get fontSize () {
      let privates = internal(this);
      return privates.fontSize;
    }

    set fontSize (value) {
      let privates = internal(this);
      if (value != this.fontSize) {
        privates.fontSize = value;
        this.generate();
      }
    }

    get fontFamily () {
      return internal(this).fontFamily;
    }

    set fontFamily (value) {
      let privates = internal(this);
      if (value != privates.fontFamily) {
        privates.fontFamily = value;
        this.generate();
      }
    }

    generate () {
      let privates = internal(this);
      textContext.font = this.fontSize + "px " + privates.fontFamily;
      // "龍" is the max-width & max-height Chinese word I think
      let lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
      this.width = 0;

      // find the real-maximum-width of multiline text, base user's maxWidth
      let lines = [];
      let lineText = "";
      for (let i = 0, len = this.text.length; i < len; i++) {
        if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
          lines.push(lineText);
          lineText = this.text[i];
        } else {
          lineText += this.text[i];
        }
        if (textContext.measureText(lineText).width > this.width)
          this.width = Math.ceil(textContext.measureText(lineText).width);
      }

      if (lineText.length) {
        lines.push(lineText);
      }

      this.height = lines.length * lineHeight;

      let canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      let context = canvas.getContext("2d");
      context.font = this.fontSize + "px " + this.fontFamily;
      context.fillStyle = this.color;
      context.textAlign = "center";
      context.textBaseline = "top";
      // draw each line
      lines.forEach((element, index) => {
        context.fillText(element, canvas.width/2, index*lineHeight)
      });

      privates.image = null;
      privates.image = canvas;
    }

    draw (context) {
      let privates = internal(this);
      let image = privates.image;
      if ( image && image.width > 0 && image.height > 0) {
        this.drawImage(
          context,
          image,
          0,
          0,
          image.width,
          image.height
        );
      }
    }
  });


})();
