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

  var win = Game.windows.main = new Game.Window("mainWindow");

  win.html("\n    <div>\n      <h1>维加世界</h1>\n      <button id=\"mainWindowContinue\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\">读取进度</button>\n    </div>\n  ");

  win.css("\n    #mainWindow {\n      text-align: center;\n      background-color: green;\n    }\n\n    #mainWindow h1 {\n      font-size: 60px;\n    }\n\n    #mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ");

  document.querySelector("button#mainWindowContinue").addEventListener("click", function (event) {
    Game.archive.load();
  });

  document.querySelector("button#mainWindowNew").addEventListener("click", function (event) {
    Game.register.reg();
  });

  document.querySelector("button#mainWindowLoad").addEventListener("click", function (event) {
    Game.windows.archive.execute("open");
  });
})();
//# sourceMappingURL=GameWindowMain.js.map
