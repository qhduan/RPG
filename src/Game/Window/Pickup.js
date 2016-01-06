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

import "../CSS/Pickup.scss";
import html from "../HTML/Pickup.html";

let win = Window.create("pickupWindow", html);
let WindowPickup = win;
export default WindowPickup;

let pickupWindowClose = win.querySelector("button#pickupWindowClose");
let pickupWindowAll = win.querySelector("button#pickupWindowAll");
let pickupWindowTable = win.querySelector("#pickupWindowTable");

let currentItemObj = null;
let lastSelect = -1;

pickupWindowClose.addEventListener("click", (event) => {
  Game.windows.pickup.hide();
});

pickupWindowAll.addEventListener("click", (event) => {
  let itemObj = currentItemObj;
  if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
    Object.keys(itemObj.inner).forEach(itemId => {
      const itemCount = inner[itemId];
      if (itemId == "gold") {
        Game.hero.data.gold += itemCount;
      } else {
        if (Game.hero.data.items[itemId]) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
      }
      delete itemObj.inner[itemId];
    });

    Game.windows.pickup.open(itemObj);
  }
});

win.whenUp(["a", "A"], (key) => {
  pickupWindowAll.click();
});

win.whenUp(["esc"], (key) => {
  setTimeout( () => {
    win.hide();
  }, 20);
});

win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], (key) => {
  let buttons = pickupWindowTable.querySelectorAll("button");
  for (let i = 0, len = buttons.length; i < len; i++) {
    let buttonIndex = buttons[i].getAttribute("data-index");
    if (buttonIndex) {
      if (buttonIndex == key) {
        buttons[i].click();
      }
    }
  }
});

win.assign("open", (itemObj, select) => {
  if (typeof select == "undefined") {
    select = -1;
  }

  lastSelect = select;

  if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {

    if (Game.area.bags.has(itemObj)) {
      itemObj.erase();
      Game.area.bags.delete(itemObj);
    }

    if (Game.area.items.has(itemObj)) {
      itemObj.erase();
      Game.area.items.delete(itemObj);
    }

    Game.windows.pickup.hide();
    return;
  }

  currentItemObj = itemObj;

  let index = 1;
  let table = "";
  Object.keys(itemObj.inner).forEach(itemId => {
    const itemCount = itemObj.inner[itemId];
    let item = Game.items[itemId];
    let line = "";

    if (select == (index - 1)) {
      line += `<tr style="background-color: green;">\n`;
    } else {
      line += `<tr>\n`;
    }


    if (item.icon) {
      line += `  <td style="text-align: center;"><img alt="" src="${item.icon.src}"></td>\n`;
    } else {
      line += `  <td> </td>\n`;
    }
    line += `  <td>${item.data.name}</td>\n`;
    line += `  <td style="text-align: center;">${item.data.value}G</td>\n`;
    line += `  <td style="text-align: center;">${itemCount}</td>\n`;
    line += `  <td>${item.data.description}</td>\n`;
    line += `  <td><button data-id="${itemId}" data-index="${index}" class="brownButton">${index<=9?(index):""} 拿取</button></td>\n`;

    line += "</tr>\n";
    table += line;
    index++;
  });

  pickupWindowTable.innerHTML = table;
  Game.windows.pickup.show();
});

win.whenUp(["enter"], () => {
  let buttons = pickupWindowTable.querySelectorAll("button");
  if (lastSelect >= 0 && lastSelect < buttons.length) {
    buttons[lastSelect].click();
  }
});

win.whenUp(["up", "down"], (key) => {
  let count = pickupWindowTable.querySelectorAll("button").length;

  if (lastSelect == -1) {
    if (key == "down") {
      win.open(currentItemObj, 0);
    } else if (key == "up") {
      win.open(currentItemObj, count - 1);
    }
  } else {
    if (key == "down") {
      let select = lastSelect + 1;
      if (select >= count) {
        select = 0;
      }
      win.open(currentItemObj, select);
    } else if (key == "up") {
      let select = lastSelect - 1;
      if (select < 0) {
        select = count - 1;
      }
      win.open(currentItemObj, select);
    }
  }
});

pickupWindowTable.addEventListener("click", (event) => {
  let itemId = event.target.getAttribute("data-id");
  if (itemId && currentItemObj.inner && currentItemObj.inner.hasOwnProperty(itemId)) {
    let itemCount = currentItemObj.inner[itemId];
    if(itemId == "gold") {
      Game.hero.data.gold += itemCount;
    } else {
      if (Game.hero.data.items.hasOwnProperty(itemId)) {
        Game.hero.data.items[itemId] += itemCount;
      } else {
        Game.hero.data.items[itemId] = itemCount;
      }
    }
    delete currentItemObj.inner[itemId];
    win.open(currentItemObj);
  }
});
