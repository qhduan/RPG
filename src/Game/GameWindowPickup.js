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

  let win = Game.windows.pickup = Game.Window.create("pickupWindow");

  win.html = `
    <div class="window-box">
      <button id="pickupWindowClose" class="brownButton">关闭</button>
      <button id="pickupWindowAll" class="brownButton">A 全部</button>
      <table border="1" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <td style="width: 40px;"></td>
            <td style="width: 120px;"></td>
            <td style="width: 30px;"></td>
            <td style="width: 30px;"></td>
            <td></td>
            <td style="width: 60px;"></td>
          </tr>
        </thead>
        <tbody id="pickupWindowTable"></tbody>
      </table>
    </div>
  `;

  win.css = `
    .pickupWindow table {
      width: 100%;
    }

    .pickupWindow table img {
      width: 100%;
      height: 100%;
    }

    .pickupWindow button {
      width: 60px;
      height: 40px;
      font-size: 16;
    }

    #pickupWindowClose {

    }

    #pickupWindowAll {

    }
  `;

  let pickupWindowClose = win.querySelector("button#pickupWindowClose");
  let pickupWindowAll = win.querySelector("button#pickupWindowAll");
  let pickupWindowTable = win.querySelector("#pickupWindowTable");

  let currentItemObj = null;
  let lastSelect = -1;

  pickupWindowClose.addEventListener("click", function (event) {
    Game.windows.pickup.hide();
  });

  pickupWindowAll.addEventListener("click", function (event) {
    let itemObj = currentItemObj;
    if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
      Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
        if (itemId == "gold") {
          Game.hero.data.gold += itemCount;
        } else {
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId] += itemCount;
          } else {
            Game.hero.data.items[itemId] = itemCount;
          }
        }
        delete inner[itemId];
      });
      Game.windows.pickup.open(itemObj);
    }
  });

  win.whenUp(["a", "A"], function (key) {
    pickupWindowAll.click();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    let buttons = pickupWindowTable.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
      let buttonIndex = buttons[i].getAttribute("data-index");
      if (buttonIndex) {
        if (buttonIndex == key) {
          buttons[i].click();
        }
      }
    }
  });

  win.assign("open", function (itemObj, select) {
    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {
      for (let bag of Game.area.bags) {
        if (bag == itemObj) {
          Game.area.bags.delete(bag);
          itemObj.erase();
        }
      }
      Game.windows.pickup.hide();
      return;
    }

    currentItemObj = itemObj;

    let index = 1;
    let table = "";
    Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
      let item = Game.items[itemId];

      let line = "";

      if (select == (index - 1)) {
        line += `<tr style="background-color: green;">\n`;
      } else {
        line += `<tr>\n`;
      }

      line += `  <td><img alt="" src="${item.icon.src}"></td>\n`;
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

  win.whenUp(["enter"], function () {
    let buttons = pickupWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
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

  pickupWindowTable.addEventListener("click", function (event) {
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

})();
