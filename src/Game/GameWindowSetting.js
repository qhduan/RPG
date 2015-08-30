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

  var win = Game.windows.setting = new Game.Window("settingWindow");

  win.html(`
    <div class="window-box">
      <button id="settingWindowClose">关闭</button>

      <div id="settingWindowBox">
        <button id="settingWindowFullscreen">全屏</button>
        <button id="settingWindowScale">缩放</button>
      </div>
    </div>
  `);

  win.css(`
    #settingWindowBox {
      width: 100%;
      height: 360px;
    }

    #settingWindowBox button {
      width: 120px;
      height: 60px;
      font-size: 16px;
      display: block;
    }

    #settingWindowClose {
      width: 60px;
      height: 40px;
      font-size: 16px;
      float: right;
    }
  `);

  var settingWindowClose = document.querySelector("button#settingWindowClose");
  var settingWindowScale = document.querySelector("button#settingWindowScale");

  settingWindowClose.addEventListener("click", function (event) {
    Game.windows.setting.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    Game.Window.resize();
  });


  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.setting.showing()) {
      settingWindowClose.click();
    }
  });

  document.querySelector("button#settingWindowFullscreen").addEventListener("click", function (event) {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
  });


}());
