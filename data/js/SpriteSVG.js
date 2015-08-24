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

/// @file SpriteCanvas.js
/// @namespace Sprite
/// class Sprite.Canvas

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Sprite.SVG = (function () {
    _createClass(SVG, null, [{
      key: "support",
      value: function support() {
        if (document && document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
          return true;
        }
        return false;
      }
    }]);

    function SVG(width, height) {
      _classCallCheck(this, SVG);

      this._width = width || 640;
      this._height = height || 480;

      console.log("svg inited");

      this._canvas = document.createElement("div");
      this._images = [];
    }

    _createClass(SVG, [{
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (!image.width || !image.height || image.width <= 0 || image.height <= 0) {
          console.error(image);
          throw new Error("drawImage invalid image");
        }

        this._context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._images = [];
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        if (value != this._width) {
          this._width = value;
        }
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        if (value != this._height) {
          this._height = value;
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return this._canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Canvas.canvas cannot write");
      }
    }]);

    return SVG;
  })();
})();