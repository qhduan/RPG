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

  let keyTable = {
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

  let pressed = new Map();

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    let keyCode = event.keyCode;
    pressed.set(keyCode, true);
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    let keyCode = event.keyCode;
    if (pressed.has(keyCode)) {
      pressed.delete(keyCode);
    }
  });

  /**
   * Sprite.Input, only has static methods
   * @class
   */
  Sprite.register("Input", class SpriteInput {

    /**
     * @param {string} key Key-string ('A', 'a') or key-number (65, 97)
     * @return {boolean} If the key is pressing, return true, otherwise, false
     */
    static isPressed (key) {
      if (typeof key == "number") {
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
    static whenPress (keys, callback) {
      if (typeof callback == "function") {
        window.addEventListener("keypress", function (event) {
          event = event || window.event;
          let keyCode = event.keyCode;
          for (let key of keys) {
            let code = keyTable[key];
            if (code && code == keyCode) {
              callback(key);
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
    static whenDown (keys, callback) {
      if (typeof callback == "function") {
        window.addEventListener("keydown", function (event) {
          event = event || window.event;
          let keyCode = event.keyCode;
          for (let key of keys) {
            let code = keyTable[key];
            if (code && code == keyCode) {
              callback(key);
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
    static whenUp (keys, callback) {
      if (typeof callback == "function") {
        window.addEventListener("keyup", function (event) {
          event = event || window.event;
          let keyCode = event.keyCode;
          for (let key of keys) {
            let code = keyTable[key];
            if (code && code == keyCode) {
              callback(key);
            }
          }
        });
      } else {
        console.error(callback);
        throw new Error("Sprite.Input.whenUp got invalid arguments");
      }
    }
  });


})();
