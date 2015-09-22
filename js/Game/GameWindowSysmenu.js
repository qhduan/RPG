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

  var win = Game.windows.sysmenu = Game.Window.create("sysmenuWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"sysmenuWindowClose\" class=\"brownButton\">关闭窗口</button>\n\n      <table><tbody><tr><td>\n        <button id=\"sysmenuWindowInventory\" class=\"brownButton\">1、背包物品</button>\n        <button id=\"sysmenuWindowStatus\" class=\"brownButton\">2、状态装备</button>\n        <br>\n        <button id=\"sysmenuWindowSkill\" class=\"brownButton\">3、查看技能</button>\n        <button id=\"sysmenuWindowQuest\" class=\"brownButton\">4、任务列表</button>\n        <br>\n        <button id=\"sysmenuWindowMap\" class=\"brownButton\">5、迷你地图</button>\n        <button id=\"sysmenuWindowSetting\" class=\"brownButton\">6、游戏设置</button>\n        <br>\n        <button id=\"sysmenuWindowArchive\" class=\"brownButton\">7、存档管理</button>\n        <button id=\"sysmenuWindowExit\" class=\"brownButton\">8、退出游戏</button>\n        <br>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .sysmenuWindow {\n      text-align: center;\n    }\n\n    .sysmenuWindow table, .sysmenuWindow tbody, .sysmenuWindow tr, .sysmenuWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .sysmenuWindow button {\n      width: 200px;\n      height: 60px;\n      margin: 2px;\n      font-size: 16px;\n    }\n\n    button#sysmenuWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n  ";

  var sysmenuWindowInventory = win.querySelector("button#sysmenuWindowInventory");
  var sysmenuWindowStatus = win.querySelector("button#sysmenuWindowStatus");

  var sysmenuWindowSkill = win.querySelector("button#sysmenuWindowSkill");
  var sysmenuWindowQuest = win.querySelector("button#sysmenuWindowQuest");

  var sysmenuWindowMap = win.querySelector("button#sysmenuWindowMap");
  var sysmenuWindowSetting = win.querySelector("button#sysmenuWindowSetting");

  var sysmenuWindowArchive = win.querySelector("button#sysmenuWindowArchive");
  var sysmenuWindowExit = win.querySelector("button#sysmenuWindowExit");

  var sysmenuWindowClose = win.querySelector("button#sysmenuWindowClose");

  win.whenUp(["esc"], function (key) {
    sysmenuWindowClose.click();
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    switch (key) {
      case "1":
        sysmenuWindowInventory.click();
        break;
      case "2":
        sysmenuWindowStatus.click();
        break;
      case "3":
        sysmenuWindowSkill.click();
        break;
      case "4":
        sysmenuWindowQuest.click();
        break;
      case "5":
        sysmenuWindowMap.click();
        break;
      case "6":
        sysmenuWindowSetting.click();
        break;
      case "7":
        sysmenuWindowArchive.click();
        break;
      case "8":
        sysmenuWindowExit.click();
        break;
    }
  });

  sysmenuWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  sysmenuWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  sysmenuWindowSkill.addEventListener("click", function (event) {
    win.hide();
    Game.windows.skill.open();
  });

  sysmenuWindowQuest.addEventListener("click", function (event) {
    win.hide();
    Game.windows.quest.current();
  });

  sysmenuWindowMap.addEventListener("click", function (event) {
    win.hide();
    Game.windows.map.show();
  });

  sysmenuWindowSetting.addEventListener("click", function (event) {
    win.hide();
    Game.windows.setting.show();
  });

  sysmenuWindowArchive.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });

  sysmenuWindowExit.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    win.hide();
  });
})();
//# sourceMappingURL=GameWindowSysmenu.js.map
