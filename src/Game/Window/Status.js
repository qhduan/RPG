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

import Sprite from "../../Sprite/Sprite.js";
import Game from "../Base.js";
import Window from "../Window.js";

let win = Window.create("statusWindow");

let WindowStatus = win;
export default WindowStatus;

import css from "../CSS/Status.scss";
import html from "../HTML/Status.html";

win.css = css;
win.html = html;

let statusWindowEquipment = {
  head: win.querySelector("#equipment-head"),
  body: win.querySelector("#equipment-body"),
  feet: win.querySelector("#equipment-feet"),
  weapon: win.querySelector("#equipment-weapon"),
  neck: win.querySelector("#equipment-neck"),
  ring: win.querySelector("#equipment-ring")
};

let statusWindowEquipmentButton = {
  head: win.querySelector("#equipmentButton-head"),
  body: win.querySelector("#equipmentButton-body"),
  feet: win.querySelector("#equipmentButton-feet"),
  weapon: win.querySelector("#equipmentButton-weapon"),
  neck: win.querySelector("#equipmentButton-neck"),
  ring: win.querySelector("#equipmentButton-ring")
};

let lastSelect = -1;

Object.keys(statusWindowEquipmentButton).forEach(key => {
  let button = statusWindowEquipmentButton[key];
  button.addEventListener("click", () => {
    if (Game.hero.data.equipment[key]) {
      Game.hero.data.equipment[key] = null;
    } else {
      if (key == "weapon") {
        Game.windows.inventory.open("sword|spear|bow");
      } else {
        Game.windows.inventory.open("head|body|feet");
      }
    }
    win.update();
  });
});

let heroName = win.querySelector("#heroName");
let heroHP = win.querySelector("#heroHP")
let heroSP = win.querySelector("#heroSP");
let heroLevel = win.querySelector("#heroLevel");
let heroEXP = win.querySelector("#heroEXP");
let heroSTR = win.querySelector("#heroSTR");
let heroDEX = win.querySelector("#heroDEX");
let heroCON = win.querySelector("#heroCON");
let heroINT = win.querySelector("#heroINT");
let heroCHA = win.querySelector("#heroCHA");
let heroATK = win.querySelector("#heroATK");
let heroDEF = win.querySelector("#heroDEF");
let heroMATK = win.querySelector("#heroMATK");
let heroMDEF = win.querySelector("#heroMDEF");

let statusWindowClose = win.querySelector("button#statusWindowClose");
let statusWindowInventory = win.querySelector("button#statusWindowInventory");
let statusWindowEquipmentTable = win.querySelector("#statusWindowEquipmentTable");

statusWindowClose.addEventListener("click", (event) => {
  win.hide();
});

statusWindowInventory.addEventListener("click", (event) => {
  win.hide();
  Game.windows.inventory.open();
});

win.whenUp(["tab"], () => {
  setTimeout( () => {
    win.hide();
    Game.windows.inventory.open();
  }, 20);
});

win.whenUp(["esc"], (key) => {
  setTimeout( () => {
    win.hide();
  }, 20)
});

win.assign("update", (select) => {

  if (typeof select == "undefined") {
    select = -1;
  }

  lastSelect = select;

  heroName.textContent = `名字：${Game.hero.data.name}`;
  heroHP.textContent = `生命力：${Game.hero.data.hp}/${Game.hero.data.$hp}`;
  heroSP.textContent = `精神力：${Game.hero.data.sp}/${Game.hero.data.$sp}`;
  heroLevel.textContent = `等级：${Game.hero.data.level}`;
  heroEXP.textContent = `经验：${Game.hero.data.exp}`;
  heroSTR.textContent = `力量：${Game.hero.data.str}`;
  heroDEX.textContent = `敏捷：${Game.hero.data.dex}`;
  heroCON.textContent = `耐力：${Game.hero.data.con}`;
  heroINT.textContent = `智力：${Game.hero.data.int}`;
  heroCHA.textContent = `魅力：${Game.hero.data.cha}`;
  heroATK.textContent = `攻击：${Game.hero.data.atk}`;
  heroDEF.textContent = `防御：${Game.hero.data.def}`;
  heroMATK.textContent = `魔法攻击：${Game.hero.data.matk}`;
  heroMDEF.textContent = `魔法防御：${Game.hero.data.mdef}`;

  let lines = statusWindowEquipmentTable.querySelectorAll("tr");
  for (let i = 0, len = lines.length; i < len; i++) {
    if (select == i) {
      lines[i].style.backgroundColor = "green";
    } else {
      lines[i].style.backgroundColor = "";
    }
  }

  Object.keys(Game.hero.data.equipment).forEach(key => {
    const value = Game.hero.data.equipment[key];
    let item = Game.items[value];
    let button = statusWindowEquipmentButton[key];
    if (value) {
      let line = "";
      line += `<img alt="" src="${item.icon.src}">`;
      line += `<span>${item.data.name}</span>`;
      statusWindowEquipment[key].innerHTML = line;
      button.textContent = "卸下";
    } else {
      statusWindowEquipment[key].innerHTML = "";
      button.textContent = "装备";
    }
  });

});

win.whenUp(["enter"], () => {
  let buttons = statusWindowEquipmentTable.querySelectorAll("button");
  if (lastSelect >= 0 && lastSelect < buttons.length) {
    buttons[lastSelect].click();
  }
});

win.whenUp(["up", "down"], (key) => {
  let count = statusWindowEquipmentTable.querySelectorAll("button").length;

  if (lastSelect == -1) {
    if (key == "down") {
      win.open(0);
    } else if (key == "up") {
      win.open(count - 1);
    }
  } else {
    if (key == "down") {
      let select = lastSelect + 1;
      if (select >= count) {
        select = 0;
      }
      win.open(select);
    } else if (key == "up") {
      let select = lastSelect - 1;
      if (select < 0) {
        select = count - 1;
      }
      win.open(select);
    }
  }
});

win.assign("open", (select) => {
  win.update(select);
  win.show();
});
