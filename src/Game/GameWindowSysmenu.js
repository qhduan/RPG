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

  var win = Game.windows.sysmenu = new Game.Window("sysmenuWindow");

  win.html(`
    <div class="window-box">
      <button id="sysmenuWindowClose" class="brownButton">关闭窗口</button>

      <table><tbody><tr><td>
        <button id="sysmenuWindowInventory" class="brownButton">背包物品</button>
        <button id="sysmenuWindowStatus" class="brownButton">状态装备</button>
        <br>
        <button id="sysmenuWindowSkill" class="brownButton">查看技能</button>
        <button id="sysmenuWindowQuest" class="brownButton">任务列表</button>
        <br>
        <button id="sysmenuWindowMap" class="brownButton">迷你地图</button>
        <button id="sysmenuWindowSetting" class="brownButton">游戏设置</button>
        <br>
        <button id="sysmenuWindowArchive" class="brownButton">存档管理</button>
        <button id="sysmenuWindowExit" class="brownButton">退出游戏</button>
        <br>
      </td></tr></tbody></table>
    </div>
  `);

  win.css(`
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
      right: 5px;
      top: 5px;
      width: 120px;
      height: 60px;
      font-size: 16px;
    }
  `);

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

}());
