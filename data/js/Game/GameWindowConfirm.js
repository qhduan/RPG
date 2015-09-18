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

  var win = Game.Window.create("confirm");

  win.html = "\n  <div class=\"window-box\">\n    <div style=\"width: 100%; height: 100%;\">\n      <table>\n        <tr><td><span id=\"confirmWindowMessage\"></span></td></tr>\n        <tr><td>\n          <button id=\"confirmWindowYes\" class=\"brownButton\">确定</button>\n          <button id=\"confirmWindowNo\" class=\"brownButton\">取消</button>\n        </td></tr>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n    #confirmWindow {\n      text-align: center;\n    }\n\n    #confirmWindow table {\n      width: 100%;\n      height: 100%;\n    }\n\n    #confirmWindow span {\n      font-size: 16px;\n    }\n\n    #confirmWindow button {\n      width: 100px;\n      height: 60px;\n      font-size: 16px;\n      margin: 20px;\n    }\n\n    #confirmWindowMessage {\n      color: black;\n      font-size: 20px;\n    }\n  ";

  var confirmWindowMessage = document.querySelector("#confirmWindowMessage");
  var confirmWindowYes = document.querySelector("button#confirmWindowYes");
  var confirmWindowNo = document.querySelector("button#confirmWindowNo");

  var confirmHandle = null;

  Game.confirm = function (message, callback) {
    if (typeof callback != "function") {
      console.error(callback, message);
      throw new Error("Game.onfirm got invalid callback");
    }
    confirmWindowMessage.textContent = message;
    confirmHandle = callback;
    win.show();
  };

  win.whenUp(["y", "Y"], function () {
    confirmWindowYes.click();
  });

  win.whenUp(["n", "N"], function () {
    confirmWindowNo.click();
  });

  confirmWindowYes.addEventListener("click", function () {
    win.hide();
    confirmHandle(true);
  });

  confirmWindowNo.addEventListener("click", function () {
    win.hide();
    confirmHandle(false);
  });
})();
//# sourceMappingURL=GameWindowConfirm.js.map
