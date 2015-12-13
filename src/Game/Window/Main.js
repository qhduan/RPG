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

( () => {
  "use strict";

  let win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = `
    <div id="mainWindowBox">
      <h1>Elliorwis</h1>
      <h4>艾利韦斯</h4>
      <br>
      <button id="mainWindowContinue" class="brownButton">继续旅程</button>
      <br>
      <button id="mainWindowNew" class="brownButton">新的旅程</button>
      <br>
      <button id="mainWindowLoad" class="brownButton">读取进度</button>
      <br>
      <button id="mainWindowFullscreen" class="brownButton">全屏</button>
    </div>
  `;

  win.css = `
    #mainWindowBox {
      text-align: center;
      height: 412px;
      background-color: rgba(240, 217, 194, 0.85);
      border: 20px solid rgba(134, 93, 52, 0.85);
    }

    #mainWindowFullscreen {
      position: absolute;
      left: 640px;
      top: 30px;
    }

    .mainWindow h1 {
      font-size: 60px;
      margin-bottom: 0;
    }

    .mainWindow h4 {
      margin-bottom: 0;
    }

    .mainWindow button {
      width: 120px;
      height: 60px;
      margin-top: 10px;
    }
  `;

  let mainWindowContinue = win.querySelector("#mainWindowContinue");
  let mainWindowNew = win.querySelector("#mainWindowNew");
  let mainWindowLoad = win.querySelector("#mainWindowLoad");
  let mainWindowFullscreen = win.querySelector("#mainWindowFullscreen");

  mainWindowFullscreen.addEventListener("click", (event) => {
    Game.windows.setting.toggle();
  });

  win.on("beforeShow", () => {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", (event) => {
    win.hide();
    setTimeout( () => {
      Game.Archive.load();
    }, 20);
  });

  mainWindowNew.addEventListener("click", (event) => {
    win.hide();
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", (event) => {
    win.hide();
    Game.windows.archive.open();
  });


})();
