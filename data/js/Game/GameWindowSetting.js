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

  var win = Game.Window.create("setting");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"settingWindowClose\">关闭</button>\n\n      <div id=\"settingWindowRendererType\"></div>\n\n      <div id=\"settingWindowBox\">\n        <button id=\"settingWindowFullscreen\">全屏</button>\n        <button id=\"settingWindowScale\">缩放</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    #settingWindowBox {\n      width: 100%;\n      height: 360px;\n    }\n\n    #settingWindowBox button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      display: block;\n    }\n\n    #settingWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      float: right;\n    }\n  ";

  var settingWindowClose = document.querySelector("button#settingWindowClose");
  var settingWindowScale = document.querySelector("button#settingWindowScale");

  var settingWindowFullscreen = document.querySelector("button#settingWindowFullscreen");
  var settingWindowRendererType = document.querySelector("#settingWindowRendererType");

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    Game.windows.setting.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    Game.Window.resize();
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.setting.showing) {
      settingWindowClose.click();
    }
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // current working methods
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