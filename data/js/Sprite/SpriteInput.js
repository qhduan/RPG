"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
 * @fileoverview Class Sprite.Input
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var keyTable = {
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "esc": 27,
    "space": 32,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "A": 65, // A
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
    "Z": 90, // Z
    "a": 97, // a
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
    "z": 122 // z
  };

  var pressed = new Map();

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    pressed.set(keyCode, true);
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    if (pressed.has(keyCode)) {
      pressed.delete(keyCode);
    }
  });

  /**
   * Sprite.Input, only has static methods
   * @class
   */
  Sprite.assign("Input", (function () {
    function SpriteInput() {
      _classCallCheck(this, SpriteInput);
    }

    _createClass(SpriteInput, null, [{
      key: "isPressed",

      /**
       * @param {string} key Key-string ('A', 'a') or key-number (65, 97)
       * @return {boolean} If the key is pressing, return true, otherwise, false
       */
      value: function isPressed(key) {
        if (Number.isFinite(key)) {
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else if (typeof key == "string") {
          key = keyTable[key];
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else {
          console.error(key);
          throw new Error("Sprite.Input.isPressed got invalid argument");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        if (callback) {
          window.addEventListener("keypress", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenPress got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        if (callback) {
          window.addEventListener("keydown", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenDown got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        if (callback) {
          window.addEventListener("keyup", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenUp got invalid arguments");
        }
      }
    }]);

    return SpriteInput;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUc7QUFDYixTQUFLLEVBQUUsQ0FBQztBQUNSLFdBQU8sRUFBRSxFQUFFO0FBQ1gsV0FBTyxFQUFFLEVBQUU7QUFDWCxTQUFLLEVBQUUsRUFBRTtBQUNULFdBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBTSxFQUFFLEVBQUU7QUFDVixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBTSxFQUFFLEVBQUU7QUFDVixPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsRUFBRTtBQUNQLE9BQUcsRUFBRSxFQUFFO0FBQ1AsT0FBRyxFQUFFLEVBQUU7QUFDUCxPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQ1IsT0FBRyxFQUFFLEdBQUc7QUFDUixPQUFHLEVBQUUsR0FBRztBQUNSLE9BQUcsRUFBRSxHQUFHO0FBQUEsR0FDVCxDQUFDOztBQUVGLE1BQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXhCLFFBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDbEQsU0FBSyxHQUFHLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlCLFFBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDNUIsV0FBTyxDQUFD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QyxDQUFDLENBQUM7U0FDaEU7T0FDRjs7Ozs7Ozs7OzZCQU1jLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxRQUFRLEVBQUU7QUFDWixnQkFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNoRCxpQkFBSyxHQUFHLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlCLGdCQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDOzs7Ozs7QUFDNUIsb0NBQWdCLElBQUksbUlBQUU7b0JBQWIsR0FBRzs7QUFDVixvQkFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLG9CQUFJLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO0FBQzNCLDBCQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Y7ZUFDRjs7Ozs7Ozs7Ozs7Ozs7O1dBQ0YsQ0FBQyxDQUFDO1NBQ0osTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDOUQ7T0FDRjs7O1dBeEYwQixXQUFXO09BeUZ0QyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLklucHV0XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBrZXlUYWJsZSA9IHtcbiAgICBcInRhYlwiOiA5LFxuICAgIFwiZW50ZXJcIjogMTMsXG4gICAgXCJzaGlmdFwiOiAxNixcbiAgICBcImVzY1wiOiAyNyxcbiAgICBcInNwYWNlXCI6IDMyLFxuICAgIFwibGVmdFwiOiAzNyxcbiAgICBcInVwXCI6IDM4LFxuICAgIFwicmlnaHRcIjogMzksXG4gICAgXCJkb3duXCI6IDQwLFxuICAgIFwiMFwiOiA0OCxcbiAgICBcIjFcIjogNDksXG4gICAgXCIyXCI6IDUwLFxuICAgIFwiM1wiOiA1MSxcbiAgICBcIjRcIjogNTIsXG4gICAgXCI1XCI6IDUzLFxuICAgIFwiNlwiOiA1NCxcbiAgICBcIjdcIjogNTUsXG4gICAgXCI4XCI6IDU2LFxuICAgIFwiOVwiOiA1NyxcbiAgICBcIkFcIjogNjUsIC8vIEFcbiAgICBcIkJcIjogNjYsXG4gICAgXCJDXCI6IDY3LFxuICAgIFwiRFwiOiA2OCxcbiAgICBcIkVcIjogNjksXG4gICAgXCJGXCI6IDcwLFxuICAgIFwiR1wiOiA3MSxcbiAgICBcIkhcIjogNzIsXG4gICAgXCJJXCI6IDczLFxuICAgIFwiSlwiOiA3NCxcbiAgICBcIktcIjogNzUsXG4gICAgXCJMXCI6IDc2LFxuICAgIFwiTVwiOiA3NyxcbiAgICBcIk5cIjogNzgsXG4gICAgXCJPXCI6IDc5LFxuICAgIFwiUFwiOiA4MCxcbiAgICBcIlFcIjogODEsXG4gICAgXCJSXCI6IDgyLFxuICAgIFwiU1wiOiA4MyxcbiAgICBcIlRcIjogODQsXG4gICAgXCJVXCI6IDg1LFxuICAgIFwiVlwiOiA4NixcbiAgICBcIldcIjogODcsXG4gICAgXCJYXCI6IDg4LFxuICAgIFwiWVwiOiA4OSxcbiAgICBcIlpcIjogOTAsIC8vIFpcbiAgICBcImFcIjogOTcsIC8vIGFcbiAgICBcImJcIjogOTgsXG4gICAgXCJjXCI6IDk5LFxuICAgIFwiZFwiOiAxMDAsXG4gICAgXCJlXCI6IDEwMSxcbiAgICBcImZcIjogMTAyLFxuICAgIFwiZ1wiOiAxMDMsXG4gICAgXCJoXCI6IDEwNCxcbiAgICBcImlcIjogMTA1LFxuICAgIFwialwiOiAxMDYsXG4gICAgXCJrXCI6IDEwNyxcbiAgICBcImxcIjogMTA4LFxuICAgIFwibVwiOiAxMDksXG4gICAgXCJuXCI6IDExMCxcbiAgICBcIm9cIjogMTExLFxuICAgIFwicFwiOiAxMTIsXG4gICAgXCJxXCI6IDExMyxcbiAgICBcInJcIjogMTE0LFxuICAgIFwic1wiOiAxMTUsXG4gICAgXCJ0XCI6IDExNixcbiAgICBcInVcIjogMTE3LFxuICAgIFwidlwiOiAxMTgsXG4gICAgXCJ3XCI6IDExOSxcbiAgICBcInhcIjogMTIwLFxuICAgIFwieVwiOiAxMjEsXG4gICAgXCJ6XCI6IDEyMiAvLyB6XG4gIH07XG5cbiAgbGV0IHByZXNzZWQgPSBuZXcgTWFwKCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBwcmVzc2VkLnNldChrZXlDb2RlLCB0cnVlKTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgaWYgKHByZXNzZWQuaGFzKGtleUNvZGUpKSB7XG4gICAgICBwcmVzc2VkLmRlbGV0ZShrZXlDb2RlKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTcHJpdGUuSW5wdXQsIG9ubHkgaGFzIHN0YXRpYyBtZXRob2RzXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIklucHV0XCIsIGNsYXNzIFNwcml0ZUlucHV0IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgS2V5LXN0cmluZyAoJ0EnLCAnYScpIG9yIGtleS1udW1iZXIgKDY1LCA5NylcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiB0aGUga2V5IGlzIHByZXNzaW5nLCByZXR1cm4gdHJ1ZSwgb3RoZXJ3aXNlLCBmYWxzZVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1ByZXNzZWQgKGtleSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShrZXkpKSB7XG4gICAgICAgIGlmIChwcmVzc2VkLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAga2V5ID0ga2V5VGFibGVba2V5XTtcbiAgICAgICAgaWYgKHByZXNzZWQuaGFzKGtleSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGtleSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5JbnB1dC5pc1ByZXNzZWQgZ290IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBLZXlzIHRvIG1vbml0b3IsIGVnLiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJhXCIsIFwiYlwiLCBcImNcIl1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBXaGVuIGtleSBpbiBrZXlzIGlzIHByZXNzZWQsIGNhbGxiYWNrXG4gICAgICovXG4gICAgc3RhdGljIHdoZW5QcmVzcyAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgbGV0IGNvZGUgPSBrZXlUYWJsZVtrZXldO1xuICAgICAgICAgICAgaWYgKGNvZGUgJiYgY29kZSA9PSBrZXlDb2RlKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY2FsbGJhY2spO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuSW5wdXQud2hlblByZXNzIGdvdCBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIEtleXMgdG8gbW9uaXRvciwgZWcuIFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcImFcIiwgXCJiXCIsIFwiY1wiXVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdoZW4ga2V5IGluIGtleXMgaXMgcHJlc3NlZCwgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgd2hlbkRvd24gKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgIGxldCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgbGV0IGNvZGUgPSBrZXlUYWJsZVtrZXldO1xuICAgICAgICAgICAgaWYgKGNvZGUgJiYgY29kZSA9PSBrZXlDb2RlKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoY2FsbGJhY2spO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuSW5wdXQud2hlbkRvd24gZ290IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgS2V5cyB0byBtb25pdG9yLCBlZy4gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiYVwiLCBcImJcIiwgXCJjXCJdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgV2hlbiBrZXkgaW4ga2V5cyBpcyBwcmVzc2VkLCBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXRpYyB3aGVuVXAgKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBjb2RlID0ga2V5VGFibGVba2V5XTtcbiAgICAgICAgICAgIGlmIChjb2RlICYmIGNvZGUgPT0ga2V5Q29kZSkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGNhbGxiYWNrKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLklucHV0LndoZW5VcCBnb3QgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
