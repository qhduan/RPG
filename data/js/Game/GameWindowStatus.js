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

  var win = Game.Window.create("status");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"statusWindowInventory\" class=\"brownButton\">物品</button>\n        <label id=\"heroName\"></label>\n      </div>\n      <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tr>\n          <td id=\"statusWindowTable\">\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td style=\"width: 50%;\">\n            <table id=\"statusWindowEquipmentTable\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n              <tbody>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">头部</td>\n                  <td id=\"equipment-head\"></td>\n                  <td style=\"width: 60px;\"><button id=\"equipmentButton-head\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">身体</td>\n                  <td id=\"equipment-body\"></td>\n                  <td><button id=\"equipmentButton-body\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">足部</td>\n                  <td id=\"equipment-feet\"></td>\n                  <td><button id=\"equipmentButton-feet\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">武器</td>\n                  <td id=\"equipment-weapon\"></td>\n                  <td><button id=\"equipmentButton-weapon\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">项链</td>\n                  <td id=\"equipment-neck\"></td>\n                  <td><button id=\"equipmentButton-neck\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">戒指</td>\n                  <td id=\"equipment-ring\"></td>\n                  <td><button id=\"equipmentButton-ring\" class=\"brownButton\">卸下</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ";

  win.css = "\n    #heroName {\n      font-size: 24px;\n      margin-left: 240px;\n    }\n\n    #statusWindowTable {\n      width: 50%;\n    }\n\n    #statusWindowTable label {\n      font-size: 18px;\n      margin-left: 80px;\n    }\n\n    #statusWindowEquipmentTable button {\n      width: 60px;\n      height: 40px;\n    }\n\n    .statusWindowEquipmentText {\n      width: 60px;\n      font-size: 20px;\n      text-align: center;\n    }\n\n    #statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n      text-align: center;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    #statusWindow table {\n      width: 100%;\n      height: 320px;\n    }\n  ";

  var statusWindowEquipment = {
    head: document.querySelector("#equipment-head"),
    body: document.querySelector("#equipment-body"),
    feet: document.querySelector("#equipment-feet"),
    weapon: document.querySelector("#equipment-weapon"),
    neck: document.querySelector("#equipment-neck"),
    ring: document.querySelector("#equipment-ring")
  };

  var statusWindowEquipmentButton = {
    head: document.querySelector("#equipmentButton-head"),
    body: document.querySelector("#equipmentButton-body"),
    feet: document.querySelector("#equipmentButton-feet"),
    weapon: document.querySelector("#equipmentButton-weapon"),
    neck: document.querySelector("#equipmentButton-neck"),
    ring: document.querySelector("#equipmentButton-ring")
  };

  var lastSelect = -1;

  Sprite.each(statusWindowEquipmentButton, function (button, key) {
    button.addEventListener("click", function () {
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

  var heroName = document.querySelector("#heroName");
  var heroHP = document.querySelector("#heroHP");
  var heroSP = document.querySelector("#heroSP");
  var heroLevel = document.querySelector("#heroLevel");
  var heroEXP = document.querySelector("#heroEXP");
  var heroSTR = document.querySelector("#heroSTR");
  var heroDEX = document.querySelector("#heroDEX");
  var heroCON = document.querySelector("#heroCON");
  var heroINT = document.querySelector("#heroINT");
  var heroCHA = document.querySelector("#heroCHA");
  var heroATK = document.querySelector("#heroATK");
  var heroDEF = document.querySelector("#heroDEF");
  var heroMATK = document.querySelector("#heroMATK");
  var heroMDEF = document.querySelector("#heroMDEF");

  var statusWindowClose = document.querySelector("button#statusWindowClose");
  var statusWindowInventory = document.querySelector("button#statusWindowInventory");
  var statusWindowEquipmentTable = document.querySelector("#statusWindowEquipmentTable");

  statusWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.inventory.open();
    }, 20);
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("update", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    heroName.textContent = "名字：" + Game.hero.data.name;
    heroHP.textContent = "生命力：" + Game.hero.data.hp + "/" + Game.hero.data.$hp;
    heroSP.textContent = "精神力：" + Game.hero.data.sp + "/" + Game.hero.data.$sp;
    heroLevel.textContent = "等级：" + Game.hero.data.level;
    heroEXP.textContent = "经验：" + Game.hero.data.exp;
    heroSTR.textContent = "力量：" + Game.hero.data.str;
    heroDEX.textContent = "敏捷：" + Game.hero.data.dex;
    heroCON.textContent = "耐力：" + Game.hero.data.con;
    heroINT.textContent = "智力：" + Game.hero.data.int;
    heroCHA.textContent = "魅力：" + Game.hero.data.cha;
    heroATK.textContent = "攻击：" + Game.hero.data.atk;
    heroDEF.textContent = "防御：" + Game.hero.data.def;
    heroMATK.textContent = "魔法攻击：" + Game.hero.data.matk;
    heroMDEF.textContent = "魔法防御：" + Game.hero.data.mdef;

    var lines = statusWindowEquipmentTable.querySelectorAll("tr");
    for (var i = 0; i < lines.length; i++) {
      if (select == i) {
        lines[i].style.backgroundColor = "green";
      } else {
        lines[i].style.backgroundColor = "";
      }
    }

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      var button = statusWindowEquipmentButton[key];

      if (element) {
        var line = "";
        line += "<img alt=\"\" src=\"" + Game.items[element].icon.src + "\">";
        line += "<span>" + Game.items[element].data.name + "</span>";
        statusWindowEquipment[key].innerHTML = line;
        button.textContent = "卸下";
      } else {
        statusWindowEquipment[key].innerHTML = "";
        button.textContent = "装备";
      }
    });
  });

  win.whenUp(["enter"], function () {
    var buttons = statusWindowEquipmentTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = statusWindowEquipmentTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  win.assign("open", function (select) {
    win.update(select);
    win.show();
  });
})();
//# sourceMappingURL=GameWindowStatus.js.map
