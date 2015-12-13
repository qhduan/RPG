"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  var internal = Sprite.Namespace();

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  /**
   * Class Sprite.Text, contain text
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Text", (function (_Sprite$Display) {
    _inherits(SpriteText, _Sprite$Display);

    /**
     * construct Sprite.Text
     * @constructor
     */

    function SpriteText(config) {
      _classCallCheck(this, SpriteText);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteText).call(this));

      var privates = internal(_this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      _this.generate();
      return _this;
    }

    _createClass(SpriteText, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var text = new Text({
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
    }, {
      key: "generate",
      value: function generate() {
        var privates = internal(this);
        textContext.font = this.fontSize + "px " + privates.fontFamily;
        // "龍" is the max-width & max-height Chinese word I think
        var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
        this.width = 0;

        // find the real-maximum-width of multiline text, base user's maxWidth
        var lines = [];
        var lineText = "";
        for (var i = 0, len = this.text.length; i < len; i++) {
          if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
            lines.push(lineText);
            lineText = this.text[i];
          } else {
            lineText += this.text[i];
          }
          if (textContext.measureText(lineText).width > this.width) this.width = Math.ceil(textContext.measureText(lineText).width);
        }

        if (lineText.length) {
          lines.push(lineText);
        }

        this.height = lines.length * lineHeight;

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext("2d");
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "top";
        // draw each line
        lines.forEach(function (element, index) {
          context.fillText(element, canvas.width / 2, index * lineHeight);
        });

        privates.image = null;
        privates.image = canvas;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var privates = internal(this);
        var image = privates.image;
        if (image && image.width > 0 && image.height > 0) {
          this.drawImage(context, image, 0, 0, image.width, image.height);
        }
      }
    }, {
      key: "text",
      get: function get() {
        var privates = internal(this);
        return privates.text;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.text) {
          privates.text = value;
          this.generate();
        }
      }
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        return privates.color;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.color) {
          privates.color = value;
          this.generate();
        }
      }
    }, {
      key: "fontSize",
      get: function get() {
        var privates = internal(this);
        return privates.fontSize;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.fontSize) {
          privates.fontSize = value;
          this.generate();
        }
      }
    }, {
      key: "fontFamily",
      get: function get() {
        return internal(this).fontFamily;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.fontFamily) {
          privates.fontFamily = value;
          this.generate();
        }
      }
    }]);

    return SpriteText;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQyxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWQsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFlBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDOzs7Ozs7O0FBQUMsQUFPOUMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2NBQVEsVUFBVTs7Ozs7OztBQUtwQyxhQUwwQixVQUFVLENBS3ZCLE1BQU0sRUFBRTs0QkFMSyxVQUFVOzt5RUFBVixVQUFVOztBQU9sQyxVQUFJLFFBQVEsR0FBRyxRQUFRLE9BQU0sQ0FBQztBQUM5QixjQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDO0FBQzlDLGNBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7QUFDNUMsY0FBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQztBQUN6QyxjQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQzFDLGNBQVEsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7QUFDbkQsY0FBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsWUFBSyxRQUFRLEVBQUUsQ0FBQzs7S0FDakI7O2lCQWZ5QixVQUFVOzs4QkFpQjNCO0FB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QU0sQ0FBQyxPQUFPLEVBZ0ozRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlVGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEZWZpbmUgdGhlIFNwcml0ZS5UZXh0IHRvIHNob3cgdGV4dCBpbiBnYW1lXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4gKGZ1bmN0aW9uICgpIHtcbiAgIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBsZXQgdGV4dENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIHRleHRDYW52YXMud2lkdGggPSAxO1xuICB0ZXh0Q2FudmFzLmhlaWdodCA9IDE7XG4gIGxldCB0ZXh0Q29udGV4dCA9IHRleHRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuVGV4dCwgY29udGFpbiB0ZXh0XG4gICAqIEBjbGFzc1xuICAgKiBAZXh0ZW5kcyBTcHJpdGUuRGlzcGxheVxuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIlRleHRcIiwgY2xhc3MgU3ByaXRlVGV4dCBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLlRleHRcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy50ZXh0ID0gY29uZmlnLnRleHQgfHwgXCJJbnZhbGlkIFRleHRcIjtcbiAgICAgIHByaXZhdGVzLm1heFdpZHRoID0gY29uZmlnLm1heFdpZHRoIHx8IDEwMDA7XG4gICAgICBwcml2YXRlcy5jb2xvciA9IGNvbmZpZy5jb2xvciB8fCBcImJsYWNrXCI7XG4gICAgICBwcml2YXRlcy5mb250U2l6ZSA9IGNvbmZpZy5mb250U2l6ZSB8fCAxNDtcbiAgICAgIHByaXZhdGVzLmZvbnRGYW1pbHkgPSBjb25maWcuZm9udEZhbWlseSB8fCBcIkFyaWVsXCI7XG4gICAgICBwcml2YXRlcy5pbWFnZSA9IG51bGw7XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgY2xvbmUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgdGV4dCA9IG5ldyBUZXh0KHtcbiAgICAgICAgdGV4dDogcHJpdmF0ZXMudGV4dCxcbiAgICAgICAgbWF4V2lkdGg6IHByaXZhdGVzLm1heFdpZHRoLFxuICAgICAgICBjb2xvcjogcHJpdmF0ZXMuY29sb3IsXG4gICAgICAgIGZvbnRTaXplOiBwcml2YXRlcy5mb250U2l6ZSxcbiAgICAgICAgZm9udEZhbWlseTogcHJpdmF0ZXMuZm9udEZhbWlseVxuICAgICAgfSk7XG4gICAgICB0ZXh0LnggPSB0aGlzLng7XG4gICAgICB0ZXh0LnkgPSB0aGlzLnk7XG4gICAgICB0ZXh0LmNlbnRlclggPSB0aGlzLmNlbnRlclg7XG4gICAgICB0ZXh0LmNlbnRlclkgPSB0aGlzLmNlbnRlclk7XG4gICAgICB0ZXh0LmFscGhhID0gdGhpcy5hbHBoYTtcbiAgICAgIHRleHQudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIGdldCB0ZXh0ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IHRleHQgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSB0aGlzLnRleHQpIHtcbiAgICAgICAgcHJpdmF0ZXMudGV4dCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGNvbG9yICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmNvbG9yO1xuICAgIH1cblxuICAgIHNldCBjb2xvciAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHZhbHVlICE9IHRoaXMuY29sb3IpIHtcbiAgICAgICAgcHJpdmF0ZXMuY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBmb250U2l6ZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5mb250U2l6ZTtcbiAgICB9XG5cbiAgICBzZXQgZm9udFNpemUgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSB0aGlzLmZvbnRTaXplKSB7XG4gICAgICAgIHByaXZhdGVzLmZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZm9udEZhbWlseSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZm9udEZhbWlseTtcbiAgICB9XG5cbiAgICBzZXQgZm9udEZhbWlseSAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLmZvbnRGYW1pbHkpIHtcbiAgICAgICAgcHJpdmF0ZXMuZm9udEZhbWlseSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICB0ZXh0Q29udGV4dC5mb250ID0gdGhpcy5mb250U2l6ZSArIFwicHggXCIgKyBwcml2YXRlcy5mb250RmFtaWx5O1xuICAgICAgLy8gXCLpvo1cIiBpcyB0aGUgbWF4LXdpZHRoICYgbWF4LWhlaWdodCBDaGluZXNlIHdvcmQgSSB0aGlua1xuICAgICAgbGV0IGxpbmVIZWlnaHQgPSBNYXRoLmNlaWwodGV4dENvbnRleHQubWVhc3VyZVRleHQoXCLpvo1cIikud2lkdGggKiAxLjIpO1xuICAgICAgdGhpcy53aWR0aCA9IDA7XG5cbiAgICAgIC8vIGZpbmQgdGhlIHJlYWwtbWF4aW11bS13aWR0aCBvZiBtdWx0aWxpbmUgdGV4dCwgYmFzZSB1c2VyJ3MgbWF4V2lkdGhcbiAgICAgIGxldCBsaW5lcyA9IFtdO1xuICAgICAgbGV0IGxpbmVUZXh0ID0gXCJcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnRleHQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRleHRDb250ZXh0Lm1lYXN1cmVUZXh0KGxpbmVUZXh0ICsgdGhpcy50ZXh0W2ldKS53aWR0aCA+IHRoaXMubWF4V2lkdGgpIHtcbiAgICAgICAgICBsaW5lcy5wdXNoKGxpbmVUZXh0KTtcbiAgICAgICAgICBsaW5lVGV4dCA9IHRoaXMudGV4dFtpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lVGV4dCArPSB0aGlzLnRleHRbaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHRDb250ZXh0Lm1lYXN1cmVUZXh0KGxpbmVUZXh0KS53aWR0aCA+IHRoaXMud2lkdGgpXG4gICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbCh0ZXh0Q29udGV4dC5tZWFzdXJlVGV4dChsaW5lVGV4dCkud2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGluZVRleHQubGVuZ3RoKSB7XG4gICAgICAgIGxpbmVzLnB1c2gobGluZVRleHQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhlaWdodCA9IGxpbmVzLmxlbmd0aCAqIGxpbmVIZWlnaHQ7XG5cbiAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNvbnRleHQuZm9udCA9IHRoaXMuZm9udFNpemUgKyBcInB4IFwiICsgdGhpcy5mb250RmFtaWx5O1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICAgICAgLy8gZHJhdyBlYWNoIGxpbmVcbiAgICAgIGxpbmVzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoZWxlbWVudCwgY2FudmFzLndpZHRoLzIsIGluZGV4KmxpbmVIZWlnaHQpXG4gICAgICB9KTtcblxuICAgICAgcHJpdmF0ZXMuaW1hZ2UgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuaW1hZ2UgPSBjYW52YXM7XG4gICAgfVxuXG4gICAgZHJhdyAoY29udGV4dCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgaW1hZ2UgPSBwcml2YXRlcy5pbWFnZTtcbiAgICAgIGlmICggaW1hZ2UgJiYgaW1hZ2Uud2lkdGggPiAwICYmIGltYWdlLmhlaWdodCA+IDApIHtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgaW1hZ2Uud2lkdGgsXG4gICAgICAgICAgaW1hZ2UuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
