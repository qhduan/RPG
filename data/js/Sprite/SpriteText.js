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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      _get(Object.getPrototypeOf(SpriteText.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      this.generate();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQyxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWQsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFlBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7Ozs7QUFPOUMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2NBQVEsVUFBVTs7Ozs7OztBQUt4QixhQUxjLFVBQVUsQ0FLdkIsTUFBTSxFQUFFOzRCQUxLLFVBQVU7O0FBTWxDLGlDQU53QixVQUFVLDZDQU0xQjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDO0FBQzlDLGNBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7QUFDNUMsY0FBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQztBQUN6QyxjQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQzFDLGNBQVEsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7QUFDbkQsY0FBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pC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SyxDQUFDO0FBQzVCLGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtPQUNGOzs7V0FwRnlCLFVBQVU7S0FBUyxNQUFNLENBQUMsT0FBTyxFQWdKM0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lIHRoZSBTcHJpdGUuVGV4dCB0byBzaG93IHRleHQgaW4gZ2FtZVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuIChmdW5jdGlvbiAoKSB7XG4gICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgbGV0IHRleHRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICB0ZXh0Q2FudmFzLndpZHRoID0gMTtcbiAgdGV4dENhbnZhcy5oZWlnaHQgPSAxO1xuICBsZXQgdGV4dENvbnRleHQgPSB0ZXh0Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLlRleHQsIGNvbnRhaW4gdGV4dFxuICAgKiBAY2xhc3NcbiAgICogQGV4dGVuZHMgU3ByaXRlLkRpc3BsYXlcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJUZXh0XCIsIGNsYXNzIFNwcml0ZVRleHQgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0IFNwcml0ZS5UZXh0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMudGV4dCA9IGNvbmZpZy50ZXh0IHx8IFwiSW52YWxpZCBUZXh0XCI7XG4gICAgICBwcml2YXRlcy5tYXhXaWR0aCA9IGNvbmZpZy5tYXhXaWR0aCB8fCAxMDAwO1xuICAgICAgcHJpdmF0ZXMuY29sb3IgPSBjb25maWcuY29sb3IgfHwgXCJibGFja1wiO1xuICAgICAgcHJpdmF0ZXMuZm9udFNpemUgPSBjb25maWcuZm9udFNpemUgfHwgMTQ7XG4gICAgICBwcml2YXRlcy5mb250RmFtaWx5ID0gY29uZmlnLmZvbnRGYW1pbHkgfHwgXCJBcmllbFwiO1xuICAgICAgcHJpdmF0ZXMuaW1hZ2UgPSBudWxsO1xuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IHRleHQgPSBuZXcgVGV4dCh7XG4gICAgICAgIHRleHQ6IHByaXZhdGVzLnRleHQsXG4gICAgICAgIG1heFdpZHRoOiBwcml2YXRlcy5tYXhXaWR0aCxcbiAgICAgICAgY29sb3I6IHByaXZhdGVzLmNvbG9yLFxuICAgICAgICBmb250U2l6ZTogcHJpdmF0ZXMuZm9udFNpemUsXG4gICAgICAgIGZvbnRGYW1pbHk6IHByaXZhdGVzLmZvbnRGYW1pbHlcbiAgICAgIH0pO1xuICAgICAgdGV4dC54ID0gdGhpcy54O1xuICAgICAgdGV4dC55ID0gdGhpcy55O1xuICAgICAgdGV4dC5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgdGV4dC5jZW50ZXJZID0gdGhpcy5jZW50ZXJZO1xuICAgICAgdGV4dC5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICB0ZXh0LnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy50ZXh0O1xuICAgIH1cblxuICAgIHNldCB0ZXh0ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT0gdGhpcy50ZXh0KSB7XG4gICAgICAgIHByaXZhdGVzLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjb2xvciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5jb2xvcjtcbiAgICB9XG5cbiAgICBzZXQgY29sb3IgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSB0aGlzLmNvbG9yKSB7XG4gICAgICAgIHByaXZhdGVzLmNvbG9yID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZm9udFNpemUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuZm9udFNpemU7XG4gICAgfVxuXG4gICAgc2V0IGZvbnRTaXplICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAodmFsdWUgIT0gdGhpcy5mb250U2l6ZSkge1xuICAgICAgICBwcml2YXRlcy5mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGZvbnRGYW1pbHkgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmZvbnRGYW1pbHk7XG4gICAgfVxuXG4gICAgc2V0IGZvbnRGYW1pbHkgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5mb250RmFtaWx5KSB7XG4gICAgICAgIHByaXZhdGVzLmZvbnRGYW1pbHkgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgdGV4dENvbnRleHQuZm9udCA9IHRoaXMuZm9udFNpemUgKyBcInB4IFwiICsgcHJpdmF0ZXMuZm9udEZhbWlseTtcbiAgICAgIC8vIFwi6b6NXCIgaXMgdGhlIG1heC13aWR0aCAmIG1heC1oZWlnaHQgQ2hpbmVzZSB3b3JkIEkgdGhpbmtcbiAgICAgIGxldCBsaW5lSGVpZ2h0ID0gTWF0aC5jZWlsKHRleHRDb250ZXh0Lm1lYXN1cmVUZXh0KFwi6b6NXCIpLndpZHRoICogMS4yKTtcbiAgICAgIHRoaXMud2lkdGggPSAwO1xuXG4gICAgICAvLyBmaW5kIHRoZSByZWFsLW1heGltdW0td2lkdGggb2YgbXVsdGlsaW5lIHRleHQsIGJhc2UgdXNlcidzIG1heFdpZHRoXG4gICAgICBsZXQgbGluZXMgPSBbXTtcbiAgICAgIGxldCBsaW5lVGV4dCA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy50ZXh0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmICh0ZXh0Q29udGV4dC5tZWFzdXJlVGV4dChsaW5lVGV4dCArIHRoaXMudGV4dFtpXSkud2lkdGggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgbGluZXMucHVzaChsaW5lVGV4dCk7XG4gICAgICAgICAgbGluZVRleHQgPSB0aGlzLnRleHRbaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGluZVRleHQgKz0gdGhpcy50ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Q29udGV4dC5tZWFzdXJlVGV4dChsaW5lVGV4dCkud2lkdGggPiB0aGlzLndpZHRoKVxuICAgICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmNlaWwodGV4dENvbnRleHQubWVhc3VyZVRleHQobGluZVRleHQpLndpZHRoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpbmVUZXh0Lmxlbmd0aCkge1xuICAgICAgICBsaW5lcy5wdXNoKGxpbmVUZXh0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oZWlnaHQgPSBsaW5lcy5sZW5ndGggKiBsaW5lSGVpZ2h0O1xuXG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjb250ZXh0LmZvbnQgPSB0aGlzLmZvbnRTaXplICsgXCJweCBcIiArIHRoaXMuZm9udEZhbWlseTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICAgIC8vIGRyYXcgZWFjaCBsaW5lXG4gICAgICBsaW5lcy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGVsZW1lbnQsIGNhbnZhcy53aWR0aC8yLCBpbmRleCpsaW5lSGVpZ2h0KVxuICAgICAgfSk7XG5cbiAgICAgIHByaXZhdGVzLmltYWdlID0gbnVsbDtcbiAgICAgIHByaXZhdGVzLmltYWdlID0gY2FudmFzO1xuICAgIH1cblxuICAgIGRyYXcgKGNvbnRleHQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGltYWdlID0gcHJpdmF0ZXMuaW1hZ2U7XG4gICAgICBpZiAoIGltYWdlICYmIGltYWdlLndpZHRoID4gMCAmJiBpbWFnZS5oZWlnaHQgPiAwKSB7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgMCxcbiAgICAgICAgICAwLFxuICAgICAgICAgIGltYWdlLndpZHRoLFxuICAgICAgICAgIGltYWdlLmhlaWdodFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
