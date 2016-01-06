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

import Game   from "../Base.js";
import Window from "../Window.js";
import html   from "../HTML/Archive.html";
import "../CSS/Archive.scss";

let win = Window.create("archiveWindow", html);
let WindowArchive = win;
export default WindowArchive;

let Save = win.querySelector("button#Save");
let Close = win.querySelector("button#Close");
let Table = win.querySelector("div#Table");

Save.addEventListener("click", () => {
  let canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 45;
  let context = canvas.getContext("2d");
  context.drawImage(Game.stage.canvas, 0, 0, Game.stage.canvas.width, Game.stage.canvas.height, 0, 0, 80, 45);

  Game.Archive.save({
    hero: Game.hero.data,
    screenshot: canvas.toDataURL("image/jpeg")
  });

  win.open();
});

Close.addEventListener("click", () => {
  win.hide();
  if ( !Game.windows.interface.showing ) {
    Game.windows.main.show();
  }
});

win.whenUp(["esc"], (key) => {
  setTimeout( () => {
    Close.click();
  }, 20);
});

win.assign("open", () => {

  if ( Game.windows.interface.showing && Game.hero ) {
    Save.style.visibility = "visible";
  } else {
    Save.style.visibility = "hidden";
  }

  let table = "";
  let list = Game.Archive.list();
  list.forEach( element => {
    let line = `<div class="Item">\n`;
    let archive = Game.Archive.get(`SAVE_${element}`);
    line += `  <button data-type="remove" data-id="SAVE_${element}" class="brownButton" style="float: right;">删除</button>\n`;
    line += `  <button data-type="load" data-id="SAVE_${element}" class="brownButton" style="float: right;">读取</button>\n`;
    line += `  <img alt="" src="${archive.screenshot || ""}" width="80" height="45" style="display: inline-block; margin: 5px;">\n`;
    line += `  <label style="font-size: 20px; margin: 10px;">${archive.name}</label>\n`;
    line += `  <label style="margin: 10px;">${archive.date}</label>\n`;
    line += "</div>\n";
    table += line;
  });

  Table.innerHTML = table;
  Game.windows.archive.show();
});

Table.addEventListener("click", (event) => {
  let type = event.target.getAttribute("data-type");
  let id = event.target.getAttribute("data-id");
  if (type && id) {
    if (type == "remove") {
      Game.Archive.remove(id);
      win.open();
    } else if (type == "load") {
      Game.Archive.load(id);
      win.hide();
    }
  }
});
