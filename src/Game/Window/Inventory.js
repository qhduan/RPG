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
import Choice from  "../Component/Choice.js";

import "../CSS/Inventory.scss";
import html from "../HTML/Inventory.html";

let win = Window.create("inventoryWindow", html);
let WindowInventory = win;
export default WindowInventory;

let inventoryWindowClose = win.querySelector("button#inventoryWindowClose");
let inventoryWindowStatus = win.querySelector("button#inventoryWindowStatus");

let inventoryWindowAll = win.querySelector("button#inventoryWindowAll");
let inventoryWindowWeapon = win.querySelector("button#inventoryWindowWeapon");
let inventoryWindowArmor = win.querySelector("button#inventoryWindowArmor");
let inventoryWindowPotion = win.querySelector("button#inventoryWindowPotion");
let inventoryWindowMaterial = win.querySelector("button#inventoryWindowMaterial");
let inventoryWindowBook = win.querySelector("button#inventoryWindowBook");
let inventoryWindowMisc = win.querySelector("button#inventoryWindowMisc");

let inventoryWindowGold = win.querySelector("span#inventoryWindowGold");
let inventoryWindowTable = win.querySelector("#inventoryWindowTable");

inventoryWindowClose.addEventListener("click", (event) => {
  win.hide();
});

inventoryWindowStatus.addEventListener("click", (event) => {
  win.hide();
  Game.windows.status.open();
});

win.whenUp(["tab"], () => {
  setTimeout( () => {
    win.hide();
    Game.windows.status.open();
  }, 20);
});

inventoryWindowAll.addEventListener("click", (event) => {
  win.open();
});

inventoryWindowWeapon.addEventListener("click", (event) => {
  win.open("sword|spear|bow");
});

inventoryWindowArmor.addEventListener("click", (event) => {
  win.open("head|body|feet");
});

inventoryWindowPotion.addEventListener("click", (event) => {
  win.open("potion");
});

inventoryWindowMaterial.addEventListener("click", (event) => {
  win.open("material");
});

inventoryWindowBook.addEventListener("click", (event) => {
  win.open("book|scroll|letter");
});

inventoryWindowMisc.addEventListener("click", (event) => {
  win.open("misc");
});

let lastFilter = null;
let lastSelect = -1;

win.assign("open", (filter, select) => {

  if (typeof select == "undefined") {
    select = -1;
  }

  lastFilter = filter;
  lastSelect = select;

  let defaultColor = "white";
  let activeColor = "yellow";

  inventoryWindowAll.style.color = defaultColor;
  inventoryWindowWeapon.style.color = defaultColor;
  inventoryWindowArmor.style.color = defaultColor;
  inventoryWindowPotion.style.color = defaultColor;
  inventoryWindowMaterial.style.color = defaultColor;
  inventoryWindowBook.style.color = defaultColor;
  inventoryWindowMisc.style.color = defaultColor;

  if ( !filter ) {
    inventoryWindowAll.style.color = activeColor;
  } else if (filter.match(/sword/)) {
    inventoryWindowWeapon.style.color = activeColor;
  } else if (filter.match(/head/)) {
    inventoryWindowArmor.style.color = activeColor;
  } else if (filter.match(/potion/)) {
    inventoryWindowPotion.style.color = activeColor;
  } else if (filter.match(/material/)) {
    inventoryWindowMaterial.style.color = activeColor;
  } else if (filter.match(/book/)) {
    inventoryWindowBook.style.color = activeColor;
  } else if (filter.match(/misc/)) {
    inventoryWindowMisc.style.color = activeColor;
  }

  inventoryWindowGold.textContent = Game.hero.data.gold + "G";

  let table = "";
  let index = 0;
  let ids = Object.keys(Game.hero.data.items);
  ids.sort();
  ids.forEach((itemId) => {
    let itemCount = Game.hero.data.items[itemId];
    let item = Game.items[itemId];
    let equipment = null;

    Object.keys(Game.hero.data.equipment).forEach(key => {
      let value = Game.hero.data.equipment[key];
      if (value == item.id) {
        equipment = key;
      }
    });

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
    line += `  <td>${equipment?"*":""}${item.data.name}</td>\n`;
    line += `  <td style="text-align: center;">${item.data.value}G</td>\n`;
    line += `  <td style="text-align: center;">${itemCount}</td>\n`;
    line += `  <td>${item.data.description}</td>\n`;
    line += `  <td><button data-id="${itemId}" class="brownButton">操作</button></td>\n`;
    line += "</tr>\n";
    table += line;
    index++;
  });

  inventoryWindowTable.innerHTML = table;
  win.show();
});

win.whenUp(["enter"], () => {
  let buttons = inventoryWindowTable.querySelectorAll("button");
  if (lastSelect >= 0 && lastSelect < buttons.length) {
    buttons[lastSelect].click();
  }
});

win.whenUp(["up", "down"], (key) => {
  let count = inventoryWindowTable.querySelectorAll("button").length;

  if (lastSelect == -1) {
    if (key == "down") {
      win.open(lastFilter, 0);
    } else if (key == "up") {
      win.open(lastFilter, count - 1);
    }
  } else {
    if (key == "down") {
      let select = lastSelect + 1;
      if (select >= count) {
        select = 0;
      }
      win.open(lastFilter, select);
    } else if (key == "up") {
      let select = lastSelect - 1;
      if (select < 0) {
        select = count - 1;
      }
      win.open(lastFilter, select);
    }
  }
});

inventoryWindowTable.addEventListener("click", (event) => {
  let itemId = event.target.getAttribute("data-id");
  if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
    let item = Game.items[itemId];
    let itemCount = Game.hero.data.items[itemId];
    let equipment = null;

    Object.keys(Game.hero.data.equipment).forEach(key => {
      let value = Game.hero.data.equipment[key];
      if (value == item.id) {
        equipment = key;
      }
    });

    let options = {};
    if (item.data.type.match(/potion/)) {
      options["使用"] = "use";
      options["快捷键"] = "shortcut";
    } else if (item.data.type.match(/sword|spear|bow|head|body|feet|neck|ring/)) {
      if (equipment)
        options["卸下"] = "takeoff";
      else
        options["装备"] = "puton";
    } else if (item.data.type.match(/book/)) {
      options["阅读"] = "read";
    }

    options["丢弃"] = "drop";

    Choice(options).then((choice) => {
      switch (choice) {
        case "puton":
          let type = item.data.type;
          if (type.match(/sword|spear|bow/)) {
            type = "weapon";
          }
          Game.hero.data.equipment[type] = item.id;
          return win.open(lastFilter);
        case "takeoff":
          if (item.data.type.match(/sword|spear|bow/))
            Game.hero.data.equipment.weapon = null;
          else
            Game.hero.data.equipment[item.data.type] = null;
          return win.open(lastFilter);
        case "use":
          if (item.heroUse) {
            item.heroUse();
          }
          break;
        case "read":
          if (item.heroUse) {
            item.heroUse();
          }
          break;
        case "drop":
          if (equipment) {
            Game.hero.data.equipment[equipment] = null;
          }

          Game.addBag(Game.hero.x ,Game.hero.y).then((bag) => {
            if (bag.inner.hasOwnProperty(itemId)) {
              bag.inner[itemId] += itemCount;
            } else {
              bag.inner[itemId] = itemCount;
            }
          });

          delete Game.hero.data.items[itemId];

          Game.hero.data.bar.forEach((element, index, array) => {
            if (element && element.id == itemId) {
              array[index] = null;
            }
          });

          Game.windows.interface.refresh();
          return win.open(lastFilter);
        case "shortcut":
          Choice({
            1:0,
            2:1,
            3:2,
            4:3,
            5:4,
            6:5,
            7:6,
            8:7
          }, (choice) => {
            if (Number.isFinite(choice) && choice >= 0) {
              Game.hero.data.bar[choice] = {
                id: item.id,
                type: "item"
              };
              Game.windows.interface.refresh();
            }
          });
          break;
      }
    });

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
      filter = "sword|spear|bow";
    } else if (filter.match(/sword/)) {
      filter = "head|body|feet";
    } else if (filter.match(/head/)) {
      filter = "potion";
    } else if (filter.match(/potion/)) {
      filter = "material";
    } else if (filter.match(/material/)) {
      filter = "book|scroll|letter";
    } else if (filter.match(/book/)) {
      filter = "misc";
    } else if (filter.match(/misc/)) {
      filter = null;
    }
    win.open(filter, -1);
  } else if (key == "left") {
    let filter = lastFilter;
    if ( !filter ) {
      filter = "misc";
    } else if (filter.match(/sword/)) {
      filter = null;
    } else if (filter.match(/head/)) {
      filter = "sword|spear|bow";
    } else if (filter.match(/potion/)) {
      filter = "head|body|feet";
    } else if (filter.match(/material/)) {
      filter = "potion";
    } else if (filter.match(/book/)) {
      filter = "material";
    } else if (filter.match(/misc/)) {
      filter = "book|scroll|letter";
    }
    win.open(filter, -1);
  }
});
