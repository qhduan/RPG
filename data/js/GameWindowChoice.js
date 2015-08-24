/*

A-RPG Game, Built using JavaScript ES6
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

(function () {
  "use strict";

  var win = Game.windows.choice = new Game.Window("choiceWindow");

  win.html("\n    <button id=\"choiceWindowNo\">取消</button>\n    <div style=\"width: 100%; height: 100%; background-color: rgba(100, 100, 100, 0.8);\">\n      <div style=\"height: 420px; overflow-y: auto; text-align: center;\">\n        <table id=\"choiceWindowTable\" style=\"width: 100%; height: 380px;\">\n          <tbody>\n            <tr>\n              <td>\n                <button id=\"choiceWindowButton-0\">0</button>\n                <button id=\"choiceWindowButton-1\">1</button>\n                <button id=\"choiceWindowButton-2\">2</button>\n                <button id=\"choiceWindowButton-3\">3</button>\n                <button id=\"choiceWindowButton-4\">4</button>\n                <button id=\"choiceWindowButton-5\">5</button>\n                <button id=\"choiceWindowButton-6\">6</button>\n                <button id=\"choiceWindowButton-7\">7</button>\n                <button id=\"choiceWindowButton-8\">8</button>\n                <button id=\"choiceWindowButton-9\">9</button>\n                <button id=\"choiceWindowButton-10\">10</button>\n                <button id=\"choiceWindowButton-11\">11</button>\n                <button id=\"choiceWindowButton-12\">12</button>\n                <button id=\"choiceWindowButton-13\">13</button>\n                <button id=\"choiceWindowButton-14\">14</button>\n                <button id=\"choiceWindowButton-15\">15</button>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ");

  win.css("\n    #choiceWindow {\n      text-align: center;\n    }\n\n    #choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      left: 20px;\n      top: 20px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 400px;\n      min-height: 60px;\n      font-size: 30px;\n    }\n  ");

  var choiceHandle = null;
  var choiceOptions = null;

  Game.choice = function (options, callback) {
    choiceHandle = callback;
    choiceOptions = options;
    Game.windows.choice.show();
    var index = 0;
    for (var key in options) {
      document.querySelector("button#choiceWindowButton-" + index).textContent = index + 1 + ". " + key;
      document.querySelector("button#choiceWindowButton-" + index).style.display = "block";
      index++;
    }
    for (var i = index; i < 16; i++) {
      document.querySelector("button#choiceWindowButton-" + i).style.display = "none";
    }
  };

  document.querySelector("button#choiceWindowNo").addEventListener("click", function () {
    Game.windows.choice.hide();
    if (typeof choiceHandle == "function") {
      choiceHandle(null);
    }
  });

  for (var i = 0; i < 16; i++) {
    (function (index) {
      document.querySelector("button#choiceWindowButton-" + index).addEventListener("click", function () {
        if (Game.windows.choice.showing()) {
          var key = Object.keys(choiceOptions)[index];
          Game.windows.choice.hide();
          if (typeof choiceHandle == "function") {
            choiceHandle(choiceOptions[key]);
          }
        }
      });
    })(i);
  }

  Sprite.Input.whenDown(["1", "2", "3", "4", "5", "6", "7", "8", "9", "esc"], function (key) {
    if (Game.windows.choice.showing()) {
      if (key.match(/^\d$/)) {
        // match 1 to 9
        var num = parseInt(key) - 1; // get 0 to 8
        var element = document.querySelector("button#choiceWindowButton-" + num);
        if (element.style.display != "none") {
          element.click();
        }
      } else if (key == "esc") {
        document.querySelector("button#choiceWindowNo").click();
      }
    }
  });
})();
//# sourceMappingURL=GameWindowChoice.js.map
