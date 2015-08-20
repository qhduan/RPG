"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  Sprite.Text = (function (_Sprite$Display) {
    _inherits(Text, _Sprite$Display);

    function Text(config) {
      _classCallCheck(this, Text);

      _get(Object.getPrototypeOf(Text.prototype), "constructor", this).call(this);
      this._config = config;
      this._text = config.text || "Hello World!";
      this._maxWidth = config.maxWidth || 1000;
      this._color = config.color || "black";
      this._fontSize = config.fontSize || 14;
      this._fontFamily = config.fontFamily || "Ariel";
      this._image = null;
      this.generate();
    }

    _createClass(Text, [{
      key: "clone",
      value: function clone() {
        var text = new Text(this._config);
        text.x = this.x;
        text.y = this.y;
        text.center.x = this.center.x;
        text.center.y = this.center.y;
        text.scale.x = this.scale.x;
        text.scale.y = this.scale.y;
        return text;
      }
    }, {
      key: "generate",
      value: function generate() {
        textContext.font = this._fontSize + "px " + this._fontFamily;
        // "龍" is the max-width & max-height Chinese word I think
        var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
        this._width = 0;

        // find the real-maximum-width of multiline text, base user's maxWidth
        var lines = [];
        var lineText = "";
        for (var i = 0; i < this._text.length; i++) {
          if (textContext.measureText(lineText + this._text[i]).width > this._maxWidth) {
            lines.push(lineText);
            lineText = this._text[i];
          } else {
            lineText += this._text[i];
          }
          if (textContext.measureText(lineText).width > this._width) this._width = Math.ceil(textContext.measureText(lineText).width);
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
        lines.forEach(function (element, index) {
          context.fillText(element, canvas.width / 2, index * lineHeight);
        });

        this._image = canvas;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        if (this._image && this._image.width > 0 && this._image.height > 0) {
          this.drawImage(context, this._image, 0, 0, this._image.width, this._image.height);
        }
      }
    }, {
      key: "svg",
      get: function get() {
        return this._svg;
      },
      set: function set(value) {
        throw new TypeError("Sprite.Text.svg readonly");
      }
    }, {
      key: "text",
      get: function get() {
        return this._text;
      },
      set: function set(value) {
        this._text = value;
        this.generate();
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this._width = value;
        this.generate();
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this._height = value;
        this.generate();
      }
    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        this._color = value;
        this.generate();
      }
    }, {
      key: "fontSize",
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        this._fontSize = value;
        this.generate();
      }
    }, {
      key: "fontFamily",
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        this._fontFamily = value;
        this.generate();
      }
    }]);

    return Text;
  })(Sprite.Display);
})();
//# sourceMappingURL=SpriteText.js.map
