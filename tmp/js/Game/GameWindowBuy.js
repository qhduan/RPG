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

(function () {
  "use strict";

  var win = Game.windows.buy = Game.Window.create("buyWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"buyWindowItemBar\">\n\n      <button id=\"buyWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"buyWindowSell\" class=\"brownButton\">卖出</button>\n\n      <button id=\"buyWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"buyWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"buyWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"buyWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"buyWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"buyWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"buyWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"buyWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"buyWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n    #buyWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #buyWindowClose {\n      float: right;\n    }\n\n    #buyWindowStatus {\n      float: right;\n    }\n\n    .buyWindow table {\n      width: 100%;\n    }\n\n    .buyWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .buyWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #buyWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var buyWindowClose = win.querySelector("button#buyWindowClose");
  var buyWindowSell = win.querySelector("button#buyWindowSell");

  var buyWindowAll = win.querySelector("button#buyWindowAll");
  var buyWindowWeapon = win.querySelector("button#buyWindowWeapon");
  var buyWindowArmor = win.querySelector("button#buyWindowArmor");
  var buyWindowPotion = win.querySelector("button#buyWindowPotion");
  var buyWindowMaterial = win.querySelector("button#buyWindowMaterial");
  var buyWindowBook = win.querySelector("button#buyWindowBook");
  var buyWindowMisc = win.querySelector("button#buyWindowMisc");

  var buyWindowGold = win.querySelector("span#buyWindowGold");
  var buyWindowTable = win.querySelector("#buyWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  buyWindowClose.addEventListener("click", function () {
    win.hide();
  });

  buyWindowSell.addEventListener("click", function () {
    win.hide();
    Game.windows.sell.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.sell.open(lastItems);
    }, 20);
  });

  buyWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  buyWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  buyWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  buyWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  buyWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  buyWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  buyWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    buyWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    buyWindowAll.style.color = defaultColor;
    buyWindowWeapon.style.color = defaultColor;
    buyWindowArmor.style.color = defaultColor;
    buyWindowPotion.style.color = defaultColor;
    buyWindowMaterial.style.color = defaultColor;
    buyWindowBook.style.color = defaultColor;
    buyWindowMisc.style.color = defaultColor;

    if (filter == null) {
      buyWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      buyWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      buyWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      buyWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      buyWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      buyWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      buyWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 1.2) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";

      if (Math.ceil(item.data.value * 1.2) > Game.hero.data.gold || items[itemId] <= 0) {
        line += "  <td><button disabled style=\"Opacity: 0.5;\" class=\"brownButton\">买入</button></td>\n";
      } else {
        line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">买入</button></td>\n";
      }

      line += "</tr>\n";
      table += line;
      index++;
    });

    buyWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = buyWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = buyWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
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
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
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
      win.open(lastItems, filter);
    }
  });

  buyWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && lastItems.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];

      Game.hero.data.gold -= Math.ceil(item.data.value * 1.2);
      if (Game.hero.data.items[itemId]) {
        Game.hero.data.items[itemId]++;
      } else {
        Game.hero.data.items[itemId] = 1;
      }

      lastItems[itemId]--;

      if (lastItems[itemId] == 0) {
        delete lastItems[itemId];
      }

      win.open(lastItems, lastFilter);
    }
  });
})();
//# sourceMappingURL=GameWindowBuy.js.map
