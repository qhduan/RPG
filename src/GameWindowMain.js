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

  var win = Game.windows.main = new Game.Window("mainWindow");

  win.html(`
    <div>
      <h1>维加世界</h1>
      <button id="mainWindowContinue">继续旅程</button>
      <br>
      <button id="mainWindowNew">新的旅程</button>
      <br>
      <button id="mainWindowLoad">读取进度</button>
    </div>
  `);

  win.css(`
    #mainWindow {
      text-align: center;
      background-color: green;
    }

    #mainWindow h1 {
      font-size: 60px;
    }

    #mainWindow button {
      width: 120px;
      height: 60px;
      margin-top: 10px;
    }
  `);

  document.querySelector("button#mainWindowContinue").addEventListener("click", function (event) {
    Game.archive.load();
  });

  document.querySelector("button#mainWindowNew").addEventListener("click", function (event) {
    Game.register.reg();
  });

  document.querySelector("button#mainWindowLoad").addEventListener("click", function (event) {
    Game.windows.archive.show();
  });

}());
