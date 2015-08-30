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

/// @file SpriteTicker.js
/// @namespace Sprite
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (Sprite) {
  "use strict";

  var Ticker = (function (_Sprite$Event) {
    _inherits(Ticker, _Sprite$Event);

    function Ticker() {
      _classCallCheck(this, Ticker);

      _get(Object.getPrototypeOf(Ticker.prototype), "constructor", this).call(this);

      this.tick();
    }

    _createClass(Ticker, [{
      key: "tick",
      value: function tick() {
        var _this = this;

        this.emit("tick");
        window.requestAnimationFrame(function () {
          _this.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this2 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this2.off("tick", id);
            if (typeof callback == "function") {
              callback();
            }
          }
        });
      }
    }, {
      key: "whiles",
      value: function whiles(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (typeof callback == "function") {
              callback(true);
            }
            _this3.off("tick", id);
          } else {
            if (typeof callback == "function") {
              callback(false);
            }
          }
        });
      }
    }]);

    return Ticker;
  })(Sprite.Event);

  ;

  Sprite.Ticker = new Ticker();
})(Sprite);
/// class Sprite.Ticker
//# sourceMappingURL=SpriteTicker.js.map
