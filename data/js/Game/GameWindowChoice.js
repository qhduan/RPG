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

  var win = Game.Window.create("choice");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"choiceWindowNo\" class=\"brownButton\">取消</button>\n      <div style=\"width: 100%; height: 100%;\">\n        <div style=\"height: 370px; overflow-y: auto; text-align: center;\">\n          <table id=\"choiceWindowTable\" style=\"width: 100%; height: 370px;\">\n            <tbody>\n              <tr>\n                <td id=\"choiceWindowButtonContainer\">\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  ";

  win.css = "\n    #choiceWindow {\n      text-align: center;\n    }\n\n    #choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      right: 100px;\n      top: 50px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 300px;\n      min-height: 60px;\n      font-size: 30px;\n      display: block;\n    }\n  ";

  var choiceWindowButtonContainer = document.querySelector("#choiceWindowButtonContainer");
  var choiceWindowNo = document.querySelector("button#choiceWindowNo");
  var buttonArray = [];

  Game.choice = function (options, callback) {
    choiceWindowButtonContainer.innerHTML = "";
    buttonArray = [];

    win.show();
    Sprite.each(options, function (value, key) {
      var button = document.createElement("button");
      button.textContent = buttonArray.length + 1 + ". " + key;
      button.classList.add("brownButton");

      choiceWindowButtonContainer.appendChild(button);
      buttonArray.push(button);

      button.addEventListener("click", function () {
        if (win.atop) {
          win.hide();
          if (typeof callback == "function") callback(value);
        }
      });
    });
  };

  choiceWindowNo.addEventListener("click", function () {
    win.hide();
    if (typeof choiceHandle == "function") choiceHandle(null);
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
      if (typeof choiceHandle == "function") choiceHandle(null);
    }, 20);
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    // match 1 to 9
    var num = parseInt(key) - 1; // get 0 to 8
    var element = buttonArray[num];
    if (element) {
      element.click();
    }
  });
})();
//# sourceMappingURL=GameWindowChoice.js.map
