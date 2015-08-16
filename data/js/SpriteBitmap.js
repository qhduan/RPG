/// @file SpriteBitmap.js
///

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

  Sprite.Bitmap = (function (_Sprite$Display) {
    _inherits(Bitmap, _Sprite$Display);

    function Bitmap(image) {
      _classCallCheck(this, Bitmap);

      _get(Object.getPrototypeOf(Bitmap.prototype), "constructor", this).call(this);
      this._image = image;
      this._width = image.width;
      this._height = image.height;
    }

    _createClass(Bitmap, [{
      key: "clone",
      value: function clone() {
        var bitmap = new Bitmap(this._image);
        bitmap.x = this.x;
        bitmap.y = this.y;
        bitmap.center.x = this.center.x;
        bitmap.center.y = this.center.y;
        bitmap.scale.x = this.scale.x;
        bitmap.scale.y = this.scale.y;
        return bitmap;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        if (this._image && this._image.width > 0 && this._image.height > 0) {
          this.drawImage(context, this._image, 0, 0, this._width, this._height, 0, 0, this._width, this._height);
        }
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this._width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this._height = value;
      }
    }]);

    return Bitmap;
  })(Sprite.Display);
})();
//# sourceMappingURL=SpriteBitmap.js.map
