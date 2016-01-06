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

  var win = Game.windows.setting = Game.Window.create("settingWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"settingWindowClose\" class=\"brownButton\">关闭</button>\n\n      <div id=\"settingWindowRendererType\"></div>\n\n      <div id=\"settingWindowBox\">\n        <button id=\"settingWindowFullscreen\" class=\"brownButton\">全屏</button>\n        <button id=\"settingWindowScale\" class=\"brownButton\">缩放</button>\n        <button id=\"settingWindowShortcut\" class=\"brownButton\">清除快捷栏</button>\n        <button id=\"settingWindowShortcutAll\" class=\"brownButton\">清除全部快捷栏</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    #settingWindowBox {\n      width: 100%;\n      height: 360px;\n    }\n\n    #settingWindowBox button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      display: block;\n    }\n\n    #settingWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      float: right;\n    }\n  ";

  var settingWindowShortcut = win.querySelector("#settingWindowShortcut");
  var settingWindowShortcutAll = win.querySelector("#settingWindowShortcutAll");

  var settingWindowClose = win.querySelector("#settingWindowClose");
  var settingWindowScale = win.querySelector("#settingWindowScale");

  var settingWindowFullscreen = win.querySelector("#settingWindowFullscreen");
  var settingWindowRendererType = win.querySelector("#settingWindowRendererType");

  settingWindowShortcut.addEventListener("click", function (event) {
    Game.choice({ 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 }).then(function (choice) {
      if (Number.isFinite(choice)) {
        Game.hero.data.bar[choice] = null;
        Game.windows.interface.refresh();
      }
    });
  });

  settingWindowShortcutAll.addEventListener("click", function (event) {
    Game.confirm("确定要删除所有快捷栏图表吗？").then(function () {
      for (var i = 0; i < 8; i++) {
        Game.hero.data.bar[i] = null;
      }
      Game.windows.interface.refresh();
    }).catch(function () {
      // no
    });
  });

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    win.show();
  });

  win.whenUp(["esc"], function (key) {
    settingWindowClose.click();
  });

  win.assign("toggle", function () {
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
  });

  settingWindowFullscreen.addEventListener("click", function (event) {
    win.toggle();
  });
})();
