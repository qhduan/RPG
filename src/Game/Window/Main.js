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

import "../CSS/Main.scss";
import html from "../HTML/Main.html";

let win = Window.create("mainWindow", html);
let WindowMain = win;
export default WindowMain;

let mainWindowContinue = win.querySelector("#mainWindowContinue");
let mainWindowNew = win.querySelector("#mainWindowNew");
let mainWindowLoad = win.querySelector("#mainWindowLoad");
let mainWindowFullscreen = win.querySelector("#mainWindowFullscreen");

mainWindowFullscreen.addEventListener("click", (event) => {
  Game.windows.setting.toggle();
});

win.on("beforeShow", () => {
  if ( !Game.Archive.last() ) {
    mainWindowContinue.style.visibility = "hidden";
  } else {
    mainWindowContinue.style.visibility = "visible";
  }
});

mainWindowContinue.addEventListener("click", (event) => {
  win.hide();
  setTimeout( () => {
    Game.Archive.load();
  }, 20);
});

mainWindowNew.addEventListener("click", (event) => {
  win.hide();
  Game.Register.reg();
});

mainWindowLoad.addEventListener("click", (event) => {
  win.hide();
  Game.windows.archive.open();
});
