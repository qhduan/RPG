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

  let win = Game.Window.create("setting");

  win.html = `
    <div class="window-box">
      <button id="settingWindowClose">关闭</button>

      <div id="settingWindowRendererType"></div>

      <div id="settingWindowBox">
        <button id="settingWindowFullscreen">全屏</button>
        <button id="settingWindowScale">缩放</button>
      </div>
    </div>
  `;

  win.css = `
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
  `;

  let settingWindowClose = document.querySelector("button#settingWindowClose");
  let settingWindowScale = document.querySelector("button#settingWindowScale");

  let settingWindowFullscreen = document.querySelector("button#settingWindowFullscreen");
  let settingWindowRendererType = document.querySelector("#settingWindowRendererType");

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    Game.Window.resize();
  });


  win.whenUp(["esc"], function (key) {
    settingWindowClose.click();
  });

  function toggleFullScreen () {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  settingWindowFullscreen.addEventListener("click", function (event) {
    toggleFullScreen();
  });


})();
