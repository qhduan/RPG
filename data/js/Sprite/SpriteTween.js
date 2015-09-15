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

"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (Sprite) {
  "use strict";

  var internal = Sprite.Namespace();

  var Tween = (function () {
    function Tween(object) {
      _classCallCheck(this, Tween);

      internal(this).object = object;
      internal(this).callback = null;
    }

    _createClass(Tween, [{
      key: "to",
      value: function to(attributes, time) {
        var _this = this;

        var splice = Math.min(100, time);
        var t = time / splice;
        var step = {};

        for (var key in attributes) {
          if (typeof attributes[key] == "number") {
            step[key] = attributes[key] - internal(this).object[key];
            step[key] /= splice;
          }
        }

        var count = 0;
        var inter = setInterval(function () {
          count++;
          if (count >= splice) {
            for (var key in attributes) {
              internal(_this).object[key] = attributes[key];
            }
            clearInterval(inter);
            if (internal(_this).callback) {
              internal(_this).callback();
            }
          } else {
            for (var key in step) {
              internal(_this).object[key] += step[key];
            }
          }
        }, t);

        return this;
      }
    }, {
      key: "call",
      value: function call(callback) {
        if (typeof callback == "function") {
          internal(this).callback = callback;
        }
        return this;
      }
    }, {
      key: "wait",
      value: function wait(time) {
        return this;
      }
    }]);

    return Tween;
  })();

  ;

  Sprite.Tween = (function (_Sprite$Event) {
    _inherits(SpriteTween, _Sprite$Event);

    function SpriteTween() {
      _classCallCheck(this, SpriteTween);

      _get(Object.getPrototypeOf(SpriteTween.prototype), "constructor", this).call(this);
    }

    _createClass(SpriteTween, null, [{
      key: "get",
      value: function get(object) {
        return new Tween(object);
      }
    }]);

    return SpriteTween;
  })(Sprite.Event);
})(Sprite);
/**
 * @fileoverview Sprite.Tween
 * @author mail@qhduan.com (QH Duan)
 */
//# sourceMappingURL=SpriteTween.js.map
