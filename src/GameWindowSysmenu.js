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
      <button id="sysmenuWindowInventory">背包物品</button>
      <button id="sysmenuWindowStatus">状态装备</button>
      <button id="sysmenuWindowSkill">查看技能</button>
      <button id="sysmenuWindowQuest">任务列表</button>
      <button id="sysmenuWindowLog">游戏日志</button>
      <button id="sysmenuWindowMap">迷你地图</button>
      <button id="sysmenuWindowSetting">游戏设置</button>
      <button id="sysmenuWindowTeam">队伍管理</button>
      <button id="sysmenuWindowSave">保存游戏</button>
      <button id="sysmenuWindowLoad">读取游戏</button>
      <button id="sysmenuWindowExit">退出游戏</button>
      <button id="sysmenuWindowClose">关闭窗口</button>
    </div>
  `);

  win.css(`
    #sysmenuWindow {
      text-align: center;
    }

    #sysmenuWindow button {
      width: 300px;
      height: 60px;
      margin: 2px;
      font-size: 16px;
    }
  `);

  document.querySelector("button#sysmenuWindowInventory").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.inventory.execute("open");
  });

  document.querySelector("button#sysmenuWindowStatus").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.status.execute("open");
  });

  document.querySelector("button#sysmenuWindowSkill").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.skill.execute("open");
  });

  document.querySelector("button#sysmenuWindowQuest").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.quest.show();
  });

  document.querySelector("button#sysmenuWindowLog").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.log.show();
  });

  document.querySelector("button#sysmenuWindowMap").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.map.show();
  });

  document.querySelector("button#sysmenuWindowSetting").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.setting.show();
  });

  document.querySelector("button#sysmenuWindowTeam").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.windows.team.show();
  });

  document.querySelector("button#sysmenuWindowSave").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.ui.save();
  });

  document.querySelector("button#sysmenuWindowLoad").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
    Game.ui.load()
  });

  document.querySelector("button#sysmenuWindowExit").addEventListener("click", function (event) {
    Game.clearStage();
    Game.windows.sysmenu.hide();
    Game.windows.main.show();
  });

  document.querySelector("button#sysmenuWindowClose").addEventListener("click", function (event) {
    Game.windows.sysmenu.hide();
  });

}());
