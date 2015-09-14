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

  var win = Game.windows.trade = new Game.Window("tradeWindow");

  win.html(`
    <div class="window-box">
      <div id="tradeWindowItemBar">
        <button id="tradeWindowClose" class="brownButton">关闭</button>
        <button id="tradeWindowAll" class="brownButton">全部</button>
        <button id="tradeWindowWeapon" class="brownButton">武器</button>
        <button id="tradeWindowArmor" class="brownButton">护甲</button>
        <button id="tradeWindowPotion" class="brownButton">药水</button>
        <button id="tradeWindowMaterial" class="brownButton">材料</button>
        <button id="tradeWindowBook" class="brownButton">书籍</button>
        <button id="tradeWindowMisc" class="brownButton">其他</button>
      </div>

      <span id="tradeWindowGold"></span>

      <table style="width: 760px; height: 360px;" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td style="vertical-align: top;">
              <div style="width: 380px; overflow-y: auto;">
                <table style="width: 100%;" border="1" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <td style="width: 40px;"></td>
                      <td></td>
                      <td style="width: 30px;"></td>
                      <td style="width: 60px;"></td>
                    </tr>
                  </thead>
                  <tbody id="tradeWindowTable">
                  </tbody>
                </table>
              </div>
            </td>
            <td style="vertical-align: top;">
              <div style="width: 380px; overflow-y: auto;">
                <table style="width: 100%;" border="1" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <td style="width: 40px;"></td>
                      <td></td>
                      <td style="width: 30px;"></td>
                      <td style="width: 30px;"></td>
                      <td style="width: 60px;"></td>
                    </tr>
                  </thead>
                  <tbody id="tradeWindowHero">
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `);

  win.css(`
    #tradeWindowItemBar > button {
      width: 60px;
      height: 40px;
      font-size: 16px;
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 0px;
      margin-bottom: 5px;
    }

    #tradeWindowClose {
      float: right;
    }

    #tradeWindowTable button, #tradeWindowHero button {
      width: 60px;
      height: 40px;
      font-size: 16px;
    }

    #tradeWindowGold {
      position: absolute;
      right: 30px;
      bottom: 5px;
      font-size: 20px;
      color: gold;
    }
  `);

  var tradeWindowClose = document.querySelector("button#tradeWindowClose");

  var tradeWindowAll = document.querySelector("button#tradeWindowAll");
  var tradeWindowWeapon = document.querySelector("button#tradeWindowWeapon");
  var tradeWindowArmor = document.querySelector("button#tradeWindowArmor");
  var tradeWindowPotion = document.querySelector("button#tradeWindowPotion");
  var tradeWindowMaterial = document.querySelector("button#tradeWindowMaterial");
  var tradeWindowBook = document.querySelector("button#tradeWindowBook");
  var tradeWindowMisc = document.querySelector("button#tradeWindowMisc");

  var tradeWindowGold = document.querySelector("span#tradeWindowGold");

  tradeWindowClose.addEventListener("click", function () {
    Game.windows.trade.hide();
  });

  var lastItems = null;

  tradeWindowAll.addEventListener("click", function (event) {
    Game.windows.trade.execute("trade", lastItems, null);
  });

  tradeWindowWeapon.addEventListener("click", function (event) {
      Game.windows.trade.execute("trade", lastItems, "sword|spear|bow");
  });

  tradeWindowArmor.addEventListener("click", function (event) {
    Game.windows.trade.execute("trade", lastItems, "head|body|feet");
  });

  tradeWindowPotion.addEventListener("click", function (event) {
      Game.windows.trade.execute("trade", lastItems, "potion");
  });

  tradeWindowMaterial.addEventListener("click", function (event) {
    Game.windows.trade.execute("trade", lastItems, "material");
  });

  tradeWindowBook.addEventListener("click", function (event) {
    Game.windows.trade.execute("trade", lastItems, "book|scroll|letter");
  });

  tradeWindowMisc.addEventListener("click", function (event) {
    Game.windows.trade.execute("trade", lastItems, "misc");
  });

  win.register("trade", function (items, filter) {

    lastItems = items;

    tradeWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    tradeWindowAll.style.color = defaultColor;
    tradeWindowWeapon.style.color = defaultColor;
    tradeWindowArmor.style.color = defaultColor;
    tradeWindowPotion.style.color = defaultColor;
    tradeWindowMaterial.style.color = defaultColor;
    tradeWindowBook.style.color = defaultColor;
    tradeWindowMisc.style.color = defaultColor;

    if (filter == null) {
      tradeWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      tradeWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      tradeWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      tradeWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      tradeWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      tradeWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      tradeWindowMisc.style.color = activeColor;
    }

    var tradeTable = document.getElementById("tradeWindowTable");
    var tradeHeroTable = document.getElementById("tradeWindowHero");

    while (tradeTable.hasChildNodes()) {
      tradeTable.removeChild(tradeTable.lastChild);
    }

    while (tradeHeroTable.hasChildNodes()) {
      tradeHeroTable.removeChild(tradeHeroTable.lastChild);
    }

    items.forEach(function (itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1)
        return;

      var line = document.createElement("tr");

      var icon = document.createElement("td");
      icon.appendChild(item.icon.cloneNode());
      line.appendChild(icon);

      var name = document.createElement("td");
      name.textContent = item.data.name;
      line.appendChild(name);

      var value = document.createElement("td");
      value.textContent = item.data.value + "G";
      value.style.textAlign = "center";
      value.style.color = "gold";
      line.appendChild(value);

      var buy = document.createElement("td");
      var buyButton = document.createElement("button");
      buyButton.textContent = "买入";
      buy.appendChild(buyButton);
      line.appendChild(buy);

      buyButton.classList.add("brownButton");

      if (item.data.value > Game.hero.data.gold) {
        buyButton.disabled = true;
        buyButton.style.opacity = 0.3;
      } else {
        buyButton.addEventListener("click", function () {
          Game.hero.data.gold -= item.data.value;
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId]++;
          } else {
            Game.hero.data.items[itemId] = 1;
          }
          Game.windows.trade.execute("trade", items, filter);
        });
      }

      tradeTable.appendChild(line);
    });

    Sprite.each(Game.hero.data.items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1)
        return;

      var line = document.createElement("tr");

      var icon = document.createElement("td");
      icon.appendChild(item.icon.cloneNode());
      line.appendChild(icon);

      var name = document.createElement("td");
      name.textContent = item.data.name;
      line.appendChild(name);

      var count = document.createElement("td");
      count.textContent = itemCount;
      count.style.textAlign = "center";
      line.appendChild(count);

      var value = document.createElement("td");
      value.textContent = item.data.value + "G";
      value.style.textAlign = "center";
      value.style.color = "gold";
      line.appendChild(value);

      var sell = document.createElement("td");
      var sellButton = document.createElement("button");
      sellButton.textContent = "卖出";
      sell.appendChild(sellButton);
      line.appendChild(sell);

      sellButton.classList.add("brownButton");

      sellButton.addEventListener("click", function () {
        if (itemCount == 1) {
          Game.hero.data.bar.forEach(function (element, index, array) {
            if (element && element.id == itemId) {
              array[index] = null;
            }
          });
          Sprite.each(Game.hero.data.equipment, function (element, key) {
            if (element == itemId) {
              Game.hero.data.equipment[key] = null;
            }
          });
          delete Game.hero.data.items[itemId];
        } else {
          Game.hero.data.items[itemId]--;
        }
        Game.hero.data.gold += item.data.value;
        Game.windows.interface.execute("refresh");
        Game.windows.trade.execute("trade", items, filter);
      });

      tradeHeroTable.appendChild(line);
    });

    Game.windows.trade.show();
  });

}());
