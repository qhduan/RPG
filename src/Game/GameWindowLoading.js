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

  let win = Game.Window.create("loading");

  win.html = `
    <table><tbody><tr><td>
      <label>载入中...</label>
    </td></tr></tbody></table>
  `;

  win.css = `
    #loadingWindow {
      text-align: center;
      background-color: gray;
    }

    #loadingWindow table, #loadingWindow tbody, #loadingWindow tr, #loadingWindow td {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    #loadingWindow label {
      font-size: 60px;
    }
  `;

  win.register("begin", function () {
    Game.windows.loading.show();
  });

  win.register("end", function () {
    Game.windows.loading.hide();
  });


})();
