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

  var win = Game.windows.loading = new Game.Window("loadingWindow");

  win.html("\n    <table><tbody><tr><td>\n      <label>载入中...</label>\n    </td></tr></tbody></table>\n  ");

  win.css("\n    #loadingWindow {\n      text-align: center;\n      background-color: gray;\n    }\n\n    #loadingWindow table, #loadingWindow tbody, #loadingWindow tr, #loadingWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    #loadingWindow label {\n      font-size: 60px;\n    }\n  ");

  win.register("begin", function () {
    Game.windows.loading.show();
  });

  win.register("end", function () {
    Game.windows.loading.hide();
  });
})();