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

  var win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = "\n    <div>\n      <h1>维加大陆</h1>\n      <button id=\"mainWindowContinue\" class=\"brownButton\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\" class=\"brownButton\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\" class=\"brownButton\">读取进度</button>\n      <br>\n    </div>\n  ";

  win.css = "\n    .mainWindow {\n      text-align: center;\n      background-image: url(\"image/main.jpeg\");\n    }\n\n    .mainWindow h1 {\n      font-size: 60px;\n    }\n\n    .mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ";

  var mainWindowContinue = win.querySelector("button#mainWindowContinue");
  var mainWindowNew = win.querySelector("button#mainWindowNew");
  var mainWindowLoad = win.querySelector("button#mainWindowLoad");

  win.on("beforeShow", function () {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", function (event) {
    win.hide();
    Game.Archive.load();
  });

  mainWindowNew.addEventListener("click", function (event) {
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });
})();