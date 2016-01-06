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

import "../CSS/Sell.scss";
import html from "../HTML/Sell.html";

let win = Window.create("sellWindow", html);
let WindowSell = win;
export default WindowSell;

let sellWindowClose = win.querySelector("button#sellWindowClose");
let sellWindowBuy = win.querySelector("button#sellWindowBuy");

let sellWindowAll = win.querySelector("button#sellWindowAll");
let sellWindowWeapon = win.querySelector("button#sellWindowWeapon");
let sellWindowArmor = win.querySelector("button#sellWindowArmor");
let sellWindowPotion = win.querySelector("button#sellWindowPotion");
let sellWindowMaterial = win.querySelector("button#sellWindowMaterial");
let sellWindowBook = win.querySelector("button#sellWindowBook");
let sellWindowMisc = win.querySelector("button#sellWindowMisc");

let sellWindowGold = win.querySelector("span#sellWindowGold");
let sellWindowTable = win.querySelector("#sellWindowTable");

let lastItems = null;
let lastFilter = null;
let lastSelect = -1;

sellWindowClose.addEventListener("click", () => {
  win.hide();
});

sellWindowBuy.addEventListener("click", () => {
  win.hide();
  Game.windows.buy.open(lastItems);
});

win.whenUp(["tab"], () => {
  setTimeout( () => {
    win.hide();
    Game.windows.buy.open(lastItems);
  }, 20);
});

sellWindowAll.addEventListener("click", (event) => {
  win.open(lastItems, null);
});

sellWindowWeapon.addEventListener("click", (event) => {
  win.open(lastItems, "sword|spear|bow");
});

sellWindowArmor.addEventListener("click", (event) => {
  win.open(lastItems, "head|body|feet");
});

sellWindowPotion.addEventListener("click", (event) => {
  win.open(lastItems, "potion");
});

sellWindowMaterial.addEventListener("click", (event) => {
  win.open(lastItems, "material");
});

sellWindowBook.addEventListener("click", (event) => {
  win.open(lastItems, "book|scroll|letter");
});

sellWindowMisc.addEventListener("click", (event) => {
  win.open(lastItems, "misc");
});

win.assign("open", (items, filter, select) => {

  if (typeof select == "undefined") {
    select = -1;
  }

  lastItems = items;
  lastFilter = filter;
  lastSelect = select;

  sellWindowGold.textContent = Game.hero.data.gold + "G";

  let defaultColor = "white";
  let activeColor = "yellow";

  sellWindowAll.style.color = defaultColor;
  sellWindowWeapon.style.color = defaultColor;
  sellWindowArmor.style.color = defaultColor;
  sellWindowPotion.style.color = defaultColor;
  sellWindowMaterial.style.color = defaultColor;
  sellWindowBook.style.color = defaultColor;
  sellWindowMisc.style.color = defaultColor;

  if ( !filter ) {
    sellWindowAll.style.color = activeColor;
  } else if (filter.match(/sword/)) {
    sellWindowWeapon.style.color = activeColor;
  } else if (filter.match(/head/)) {
    sellWindowArmor.style.color = activeColor;
  } else if (filter.match(/potion/)) {
    sellWindowPotion.style.color = activeColor;
  } else if (filter.match(/material/)) {
    sellWindowMaterial.style.color = activeColor;
  } else if (filter.match(/book/)) {
    sellWindowBook.style.color = activeColor;
  } else if (filter.match(/misc/)) {
    sellWindowMisc.style.color = activeColor;
  }

  let index = 0;
  let table = "";
  Object.keys(Game.hero.data.items).forEach(itemId => {
    const itemCount = Game.hero.data.items[itemId];
    let item = Game.items[itemId];

    if (filter && filter.indexOf(item.data.type) == -1)
      return;

    let line = "";

    if (select == index) {
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
    line += `  <td style="text-align: center;">${Math.ceil(item.data.value * 0.8)}G</td>\n`;
    line += `  <td style="text-align: center;">${itemCount}</td>\n`;
    line += `  <td>${item.data.description}</td>\n`;
    line += `  <td><button data-id="${itemId}" class="brownButton">卖出</button></td>\n`;

    line += "</tr>\n";
    table += line;
    index++;
  });

  sellWindowTable.innerHTML = table;
  win.show();
});

win.whenUp(["enter"], () => {
  let buttons = sellWindowTable.querySelectorAll("button");
  if (lastSelect >= 0 && lastSelect < buttons.length) {
    buttons[lastSelect].click();
  }
});

win.whenUp(["up", "down"], (key) => {
  let count = sellWindowTable.querySelectorAll("button").length;
  if (count <= 0) return;

  if (lastSelect == -1) {
    if (key == "down") {
      win.open(lastItems, lastFilter, 0);
    } else if (key == "up") {
      win.open(lastItems, lastFilter, count - 1);
    }
  } else {
    if (key == "down") {
      let select = lastSelect + 1;
      if (select >= count) {
        select = 0;
      }
      win.open(lastItems, lastFilter, select);
    } else if (key == "up") {
      let select = lastSelect - 1;
      if (select < 0) {
        select = count - 1;
      }
      win.open(lastItems, lastFilter, select);
    }
  }
});

win.whenUp(["esc"], () => {
  setTimeout( () => {
    win.hide();
  }, 20);
});

win.whenUp(["left", "right"], (key) => {
  if (key == "right") {
    let filter = lastFilter;
    if ( !filter ) {
      filter = "sword";
    } else if (filter.match(/sword/)) {
      filter = "head";
    } else if (filter.match(/head/)) {
      filter = "potion";
    } else if (filter.match(/potion/)) {
      filter = "material";
    } else if (filter.match(/material/)) {
      filter = "book";
    } else if (filter.match(/book/)) {
      filter = "misc";
    } else if (filter.match(/misc/)) {
      filter = null;
    }
    win.open(lastItems, filter);
  } else if (key == "left") {
    let filter = lastFilter;
    if ( !filter ) {
      filter = "misc";
    } else if (filter.match(/sword/)) {
      filter = null;
    } else if (filter.match(/head/)) {
      filter = "sword";
    } else if (filter.match(/potion/)) {
      filter = "head";
    } else if (filter.match(/material/)) {
      filter = "potion";
    } else if (filter.match(/book/)) {
      filter = "material";
    } else if (filter.match(/misc/)) {
      filter = "book";
    }
    win.open(lastItems, filter);
  }
});

sellWindowTable.addEventListener("click", (event) => {
  let itemId = event.target.getAttribute("data-id");
  if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
    let item = Game.items[itemId];
    let itemCount = Game.hero.data.items[itemId];

    if (lastItems.hasOwnProperty(itemId)) {
      lastItems[itemId]++;
    } else {
      lastItems[itemId] = 1;
    }

    if (itemCount == 1) {
      Game.hero.data.bar.forEach((element, index, array) => {
        if (element && element.id == itemId) {
          array[index] = null;
        }
      });
      Object.keys(Game.hero.data.equipment).forEach(key => {
        const value = Game.hero.data.equipment[key];
        if (value == itemId) {
          Game.hero.data.equipment[key] = null;
        }
      });
      delete Game.hero.data.items[itemId];
    } else {
      Game.hero.data.items[itemId]--;
    }

    Game.hero.data.gold += Math.ceil(item.data.value * 0.8);
    Game.windows.interface.refresh();
    win.open(lastItems, lastFilter);
  }
});
