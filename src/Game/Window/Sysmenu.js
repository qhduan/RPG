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

import Game from "../Base.js";
import Window from "../Window.js";

import "../CSS/Sysmenu.scss";
import html from "../HTML/Sysmenu.html";

let win = Window.create("sysmenuWindow", html);
let WindowSysmenu = win;
export default WindowSysmenu;

let sysmenuWindowInventory = win.querySelector("button#sysmenuWindowInventory");
let sysmenuWindowStatus = win.querySelector("button#sysmenuWindowStatus");

let sysmenuWindowSkill = win.querySelector("button#sysmenuWindowSkill");
let sysmenuWindowQuest = win.querySelector("button#sysmenuWindowQuest");

let sysmenuWindowMap = win.querySelector("button#sysmenuWindowMap");
let sysmenuWindowSetting = win.querySelector("button#sysmenuWindowSetting");

let sysmenuWindowArchive = win.querySelector("button#sysmenuWindowArchive");
let sysmenuWindowExit = win.querySelector("button#sysmenuWindowExit");

let sysmenuWindowClose = win.querySelector("button#sysmenuWindowClose");

win.whenUp(["esc"], (key) => {
  sysmenuWindowClose.click();
});

win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], (key) => {
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

sysmenuWindowInventory.addEventListener("click", (event) => {
  win.hide();
  Game.windows.inventory.open();
});

sysmenuWindowStatus.addEventListener("click", (event) => {
  win.hide();
  Game.windows.status.open();
});

sysmenuWindowSkill.addEventListener("click", (event) => {
  win.hide();
  Game.windows.skill.open();
});

sysmenuWindowQuest.addEventListener("click", (event) => {
  win.hide();
  Game.windows.quest.current();
});

sysmenuWindowMap.addEventListener("click", (event) => {
  win.hide();
  Game.windows.map.show();
});

sysmenuWindowSetting.addEventListener("click", (event) => {
  win.hide();
  Game.windows.setting.show();
});

sysmenuWindowArchive.addEventListener("click", (event) => {
  win.hide();
  Game.windows.archive.open();
});

sysmenuWindowExit.addEventListener("click", (event) => {
  Game.clearStage();
  Game.windows.interface.hide();
  Game.windows.stage.hide();
  win.hide();
  Game.windows.main.show();
});

sysmenuWindowClose.addEventListener("click", (event) => {
  win.hide();
});
