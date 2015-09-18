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

  var win = Game.Window.create("sell");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"sellWindowItemBar\">\n\n      <button id=\"sellWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"sellWindowBuy\" class=\"brownButton\">买入</button>\n\n      <button id=\"sellWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"sellWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"sellWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"sellWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"sellWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"sellWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"sellWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"sellWindowGold\"></span>\n\n    <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n      <thead>\n        <tr>\n          <td style=\"width: 40px;\"></td>\n          <td style=\"width: 120px;\"></td>\n          <td style=\"width: 30px;\"></td>\n          <td style=\"width: 30px;\"></td>\n          <td></td>\n          <td style=\"width: 60px;\"></td>\n        </tr>\n      </thead>\n      <tbody id=\"sellWindowTable\"></tbody>\n    </table>\n  </div>\n  ";

  win.css = "\n    #sellWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #sellWindowClose {\n      float: right;\n    }\n\n    #sellWindowStatus {\n      float: right;\n    }\n\n    #sellWindow table {\n      width: 100%;\n    }\n\n    #sellWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #sellWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #sellWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var sellWindowClose = document.querySelector("button#sellWindowClose");
  var sellWindowBuy = document.querySelector("button#sellWindowBuy");

  var sellWindowAll = document.querySelector("button#sellWindowAll");
  var sellWindowWeapon = document.querySelector("button#sellWindowWeapon");
  var sellWindowArmor = document.querySelector("button#sellWindowArmor");
  var sellWindowPotion = document.querySelector("button#sellWindowPotion");
  var sellWindowMaterial = document.querySelector("button#sellWindowMaterial");
  var sellWindowBook = document.querySelector("button#sellWindowBook");
  var sellWindowMisc = document.querySelector("button#sellWindowMisc");

  var sellWindowGold = document.querySelector("span#sellWindowGold");
  var sellWindowTable = document.querySelector("#sellWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  sellWindowClose.addEventListener("click", function () {
    win.hide();
  });

  sellWindowBuy.addEventListener("click", function () {
    win.hide();
    Game.windows.buy.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.buy.open(lastItems);
    }, 20);
  });

  sellWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  sellWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  sellWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  sellWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  sellWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  sellWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  sellWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.register("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    sellWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    sellWindowAll.style.color = defaultColor;
    sellWindowWeapon.style.color = defaultColor;
    sellWindowArmor.style.color = defaultColor;
    sellWindowPotion.style.color = defaultColor;
    sellWindowMaterial.style.color = defaultColor;
    sellWindowBook.style.color = defaultColor;
    sellWindowMisc.style.color = defaultColor;

    if (filter == null) {
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

    var index = 0;
    var table = "";
    Sprite.each(Game.hero.data.items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 0.8) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">卖出</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    sellWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = sellWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = sellWindowTable.querySelectorAll("button").length;
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
      var filter = lastFilter;
      if (filter == null) {
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

  sellWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];
      var itemCount = Game.hero.data.items[itemId];

      if (lastItems.hasOwnProperty(itemId)) {
        lastItems[itemId]++;
      } else {
        lastItems[itemId] = 1;
      }

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

      Game.hero.data.gold += Math.ceil(item.data.value * 0.8);
      Game.windows["interface"].refresh();
      win.open(lastItems, lastFilter);
    }
  });
})();
//# sourceMappingURL=GameWindowSell.js.map
