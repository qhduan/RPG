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
  Sprite.register("Text", class SpriteText extends Sprite.Display {
    /**
     * construct Sprite.Text
     * @constructor
     */
    constructor (config) {
      super();
      internal(this).text = config.text || "Invalid Text";
      internal(this).maxWidth = config.maxWidth || 1000;
      internal(this).color = config.color || "black";
      internal(this).fontSize = config.fontSize || 14;
      internal(this).fontFamily = config.fontFamily || "Ariel";
      internal(this).image = null;
      this.generate();
    }

    clone () {
      let text = new Text({
        text: internal(this).text,
        maxWidth: internal(this).maxWidth,
        color: internal(this).color,
        fontSize: internal(this).fontSize,
        fontFamily: internal(this).fontFamily
      });
      text.x = this.x;
      text.y = this.y;
      text.centerX = this.centerX;
      text.centerY = this.centerY;
      return text;
    }

    get text () {
      return internal(this).text;
    }

    set text (value) {
      if (value != this.text) {
        internal(this).text = value;
        this.generate();
      }
    }

    get width () {
      return internal(this).width;
    }

    set width (value) {
      if (value != this.width) {
        internal(this).width = value;
        this.generate();
      }
    }

    get height () {
      return internal(this).height;
    }

    set height (value) {
      if (value != this.height) {
        internal(this).height = value;
        this.generate();
      }
    }

    get color () {
      return internal(this).color;
    }

    set color (value) {
      if (value != this.color) {
        internal(this).color = value;
        this.generate();
      }
    }

    get fontSize () {
      return internal(this).fontSize;
    }

    set fontSize (value) {
      if (value != this.fontSize) {
        internal(this).fontSize = value;
        this.generate();
      }
    }

    get fontFamily () {
      return internal(this).fontFamily;
    }

    set fontFamily (value) {
      if (value != this.fontFamily) {
        internal(this).fontFamily = value;
        this.generate();
      }
    }

    generate () {
      textContext.font = this.fontSize + "px " + internal(this).fontFamily;
      // "龍" is the max-width & max-height Chinese word I think
      let lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
      internal(this).width = 0;

      // find the real-maximum-width of multiline text, base user's maxWidth
      let lines = [];
      let lineText = "";
      for (let i = 0; i < this.text.length; i++) {
        if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
          lines.push(lineText);
          lineText = this.text[i];
        } else {
          lineText += this.text[i];
        }
        if (textContext.measureText(lineText).width > this.width)
          internal(this).width = Math.ceil(textContext.measureText(lineText).width);
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

      internal(this).image = canvas;
    }

    draw (context) {
      let image = internal(this).image;
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
