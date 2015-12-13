"use strict";

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

(function () {
  "use strict";

  var win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = "\n    <div id=\"mainWindowBox\">\n      <h1>Elliorwis</h1>\n      <h4>艾利韦斯</h4>\n      <br>\n      <button id=\"mainWindowContinue\" class=\"brownButton\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\" class=\"brownButton\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\" class=\"brownButton\">读取进度</button>\n      <br>\n      <button id=\"mainWindowFullscreen\" class=\"brownButton\">全屏</button>\n    </div>\n  ";

  win.css = "\n    #mainWindowBox {\n      text-align: center;\n      height: 412px;\n      background-color: rgba(240, 217, 194, 0.85);\n      border: 20px solid rgba(134, 93, 52, 0.85);\n    }\n\n    #mainWindowFullscreen {\n      position: absolute;\n      left: 640px;\n      top: 30px;\n    }\n\n    .mainWindow h1 {\n      font-size: 60px;\n      margin-bottom: 0;\n    }\n\n    .mainWindow h4 {\n      margin-bottom: 0;\n    }\n\n    .mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ";

  var mainWindowContinue = win.querySelector("#mainWindowContinue");
  var mainWindowNew = win.querySelector("#mainWindowNew");
  var mainWindowLoad = win.querySelector("#mainWindowLoad");
  var mainWindowFullscreen = win.querySelector("#mainWindowFullscreen");

  mainWindowFullscreen.addEventListener("click", function (event) {
    Game.windows.setting.toggle();
  });

  win.on("beforeShow", function () {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", function (event) {
    win.hide();
    setTimeout(function () {
      Game.Archive.load();
    }, 20);
  });

  mainWindowNew.addEventListener("click", function (event) {
    win.hide();
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });
})();
