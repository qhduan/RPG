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
      text.center.x = this.center.x;
      text.center.y = this.center.y;
      text.scale.x = this.scale.x;
      text.scale.y = this.scale.y;
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
      //this._image = new Image();
      //this._image.src = canvas.toDataURL();
    }

    draw (context) {
      if (this._image) {
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
