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

  let win = Game.Window.create("sysmenu");

  win.html = `
    <div class="window-box">
      <button id="sysmenuWindowClose" class="brownButton">关闭窗口</button>

      <table><tbody><tr><td>
        <button id="sysmenuWindowInventory" class="brownButton">1、背包物品</button>
        <button id="sysmenuWindowStatus" class="brownButton">2、状态装备</button>
        <br>
        <button id="sysmenuWindowSkill" class="brownButton">3、查看技能</button>
        <button id="sysmenuWindowQuest" class="brownButton">4、任务列表</button>
        <br>
        <button id="sysmenuWindowMap" class="brownButton">5、迷你地图</button>
        <button id="sysmenuWindowSetting" class="brownButton">6、游戏设置</button>
        <br>
        <button id="sysmenuWindowArchive" class="brownButton">7、存档管理</button>
        <button id="sysmenuWindowExit" class="brownButton">8、退出游戏</button>
        <br>
      </td></tr></tbody></table>
    </div>
  `;

  win.css = `
    #sysmenuWindow {
      text-align: center;
    }

    #sysmenuWindow table, #sysmenuWindow tbody, #sysmenuWindow tr, #sysmenuWindow td {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    #sysmenuWindow button {
      width: 200px;
      height: 60px;
      margin: 2px;
      font-size: 16px;
    }

    button#sysmenuWindowClose {
      position: absolute;
      right: 50px;
      top: 50px;
      width: 120px;
      height: 60px;
      font-size: 16px;
    }
  `;

  let sysmenuWindowInventory = document.querySelector("button#sysmenuWindowInventory");
  let sysmenuWindowStatus = document.querySelector("button#sysmenuWindowStatus");

  let sysmenuWindowSkill = document.querySelector("button#sysmenuWindowSkill");
  let sysmenuWindowQuest = document.querySelector("button#sysmenuWindowQuest");

  let sysmenuWindowMap = document.querySelector("button#sysmenuWindowMap");
  let sysmenuWindowSetting = document.querySelector("button#sysmenuWindowSetting");

  let sysmenuWindowArchive = document.querySelector("button#sysmenuWindowArchive");
  let sysmenuWindowExit = document.querySelector("button#sysmenuWindowExit");

  let sysmenuWindowClose = document.querySelector("button#sysmenuWindowClose");

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
    Game.windows.quest.show();
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
