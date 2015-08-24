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

/// @file SpriteInput.js
/// @namespace Sprite
/// class Sprite.Input

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  var keyTable = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "shift": 16,
    "esc": 27,
    "enter": 13,
    "space": 32,
    "a": 97,
    "b": 98,
    "c": 99,
    "d": 100,
    "e": 101,
    "f": 102,
    "g": 103,
    "h": 104,
    "i": 105,
    "j": 106,
    "k": 107,
    "l": 108,
    "m": 109,
    "n": 110,
    "o": 111,
    "p": 112,
    "q": 113,
    "r": 114,
    "s": 115,
    "t": 116,
    "u": 117,
    "v": 118,
    "w": 119,
    "x": 120,
    "y": 121,
    "z": 122,
    "A": 65,
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57
  };

  var pressed = {};

  document.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    pressed[keyCode] = true;
  });

  document.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    if (pressed[keyCode]) delete pressed[keyCode];
  });

  Sprite.Input = (function () {
    function Input() {
      _classCallCheck(this, Input);
    }

    _createClass(Input, null, [{
      key: "isPressed",
      value: function isPressed(keyStr) {
        if (pressed.hasOwnProperty(keyStr)) return pressed[keyStr];
        return pressed[keyTable[keyStr]];
      }
    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        document.addEventListener("keypress", function (event) {
          event = event || window.event;
          var keyCode = event.keyCode;
          for (var i = 0; i < keys.length; i++) {
            var code = keyTable[keys[i]];
            if (code && code == keyCode) {
              callback(keys[i]);
              return;
            }
          }
        });
      }
    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        document.addEventListener("keydown", function (event) {
          event = event || window.event;
          var keyCode = event.keyCode;
          for (var i = 0; i < keys.length; i++) {
            var code = keyTable[keys[i]];
            if (code && code == keyCode) {
              callback(keys[i]);
              return;
            }
          }
        });
      }
    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        document.addEventListener("keyup", function (event) {
          event = event || window.event;
          var keyCode = event.keyCode;
          for (var i = 0; i < keys.length; i++) {
            var code = keyTable[keys[i]];
            if (code && code == keyCode) {
              callback(keys[i]);
              return;
            }
          }
        });
      }
    }]);

    return Input;
  })();
})();
//# sourceMappingURL=SpriteInput.js.map
