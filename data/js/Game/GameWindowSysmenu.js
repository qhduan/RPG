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

  var win = Game.windows.sysmenu = new Game.Window("sysmenuWindow");

  win.html("\n    <div class=\"window-box\">\n      <button id=\"sysmenuWindowClose\" class=\"brownButton\">关闭窗口</button>\n\n      <table><tbody><tr><td>\n        <button id=\"sysmenuWindowInventory\" class=\"brownButton\">背包物品</button>\n        <button id=\"sysmenuWindowStatus\" class=\"brownButton\">状态装备</button>\n        <br>\n        <button id=\"sysmenuWindowSkill\" class=\"brownButton\">查看技能</button>\n        <button id=\"sysmenuWindowQuest\" class=\"brownButton\">任务列表</button>\n        <br>\n        <button id=\"sysmenuWindowMap\" class=\"brownButton\">迷你地图</button>\n        <button id=\"sysmenuWindowSetting\" class=\"brownButton\">游戏设置</button>\n        <br>\n        <button id=\"sysmenuWindowArchive\" class=\"brownButton\">存档管理</button>\n        <button id=\"sysmenuWindowExit\" class=\"brownButton\">退出游戏</button>\n        <br>\n      </td></tr></tbody></table>\n    </div>\n  ");

  win.css("\n    #sysmenuWindow {\n      text-align: center;\n    }\n\n    #sysmenuWindow table, #sysmenuWindow tbody, #sysmenuWindow tr, #sysmenuWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    #sysmenuWindow button {\n      width: 200px;\n      height: 60px;\n      margin: 2px;\n      font-size: 16px;\n    }\n\n    button#sysmenuWindowClose {\n      position: absolute;\n      right: 5px;\n      top: 5px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n  ");

  var sysmenuWindowInventory = document.querySelector("button#sysmenuWindowInventory");
  var sysmenuWindowStatus = document.querySelector("button#sysmenuWindowStatus");
  var sysmenuWindowSkill = document.querySelector("button#sysmenuWindowSkill");
  var sysmenuWindowQuest = document.querySelector("button#sysmenuWindowQuest");
  var sysmenuWindowMap = document.querySelector("button#sysmenuWindowMap");
  var sysmenuWindowSetting = document.querySelector("button#sysmenuWindowSetting");
  var sysmenuWindowArchive = document.querySelector("button#sysmenuWindowArchive");
  var sysmenuWindowExit = document.querySelector("button#sysmenuWindowExit");
  var sysmenuWindowClose = document.querySelector("button#sysmenuWindowClose");

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.sysmenu.showing()) {
      sysmenuWindowClose.click();
    }
  });

  sysmenuWindowInventory.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.inventory.execute("open");
  });

  sysmenuWindowStatus.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.status.execute("open");
  });

  sysmenuWindowSkill.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.skill.execute("open");
  });

  sysmenuWindowQuest.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.quest.show();
  });

  sysmenuWindowMap.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.map.show();
  });

  sysmenuWindowSetting.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.setting.show();
  });

  sysmenuWindowArchive.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.archive.execute("open");
  });

  sysmenuWindowExit.addEventListener("click", function (event) {
    Game.clearStage();
    Game.windows.sysmenu.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
  });
})();