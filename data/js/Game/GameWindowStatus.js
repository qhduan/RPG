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

  var win = Game.windows.status = new Game.Window("statusWindow");

  win.html("\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\">关闭</button>\n        <button id=\"statusWindowInventory\">物品</button>\n      </div>\n      <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tr>\n          <td>\n            <label id=\"heroName\"></label>\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td>\n            <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n              <tr>\n                <td>头部</td>\n                <td id=\"equipment-head\"></td>\n              </tr>\n              <tr>\n                <td>身体</td>\n                <td id=\"equipment-body\"></td>\n              </tr>\n              <tr>\n                <td>足部</td>\n                <td id=\"equipment-feet\"></td>\n              </tr>\n              <tr>\n                <td>武器</td>\n                <td id=\"equipment-weapon\"></td>\n              </tr>\n              <tr>\n                <td>项链</td>\n                <td id=\"equipment-neck\"></td>\n              </tr>\n              <tr>\n                <td>戒指</td>\n                <td id=\"equipment-ring\"></td>\n              </tr>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ");

  win.css("\n    #statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    #statusWindow table {\n      width: 100%;\n      height: 360px;\n    }\n  ");

  var statusWindowClose = document.querySelector("button#statusWindowClose");
  var statusWindowInventory = document.querySelector("button#statusWindowInventory");

  statusWindowClose.addEventListener("click", function (event) {
    Game.windows.status.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    Game.windows.status.hide();
    Game.windows.inventory.execute("open");
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.status.showing()) {
      statusWindowClose.click();
    }
  });

  win.register("update", function () {
    document.getElementById("heroName").textContent = "名字：" + Game.hero.data.name;
    document.getElementById("heroHP").textContent = "生命力：" + Game.hero.data.hp + "/" + Game.hero.data.$hp;
    document.getElementById("heroSP").textContent = "精神力：" + Game.hero.data.sp + "/" + Game.hero.data.$sp;
    document.getElementById("heroLevel").textContent = "等级：" + Game.hero.data.level;
    document.getElementById("heroEXP").textContent = "经验：" + Game.hero.data.exp;
    document.getElementById("heroSTR").textContent = "力量：" + Game.hero.data.str;
    document.getElementById("heroDEX").textContent = "敏捷：" + Game.hero.data.dex;
    document.getElementById("heroCON").textContent = "耐力：" + Game.hero.data.con;
    document.getElementById("heroINT").textContent = "智力：" + Game.hero.data.int;
    document.getElementById("heroCHA").textContent = "魅力：" + Game.hero.data.cha;
    document.getElementById("heroATK").textContent = "攻击：" + Game.hero.data.atk;
    document.getElementById("heroDEF").textContent = "防御：" + Game.hero.data.def;
    document.getElementById("heroMATK").textContent = "魔法攻击：" + Game.hero.data.matk;
    document.getElementById("heroMDEF").textContent = "魔法防御：" + Game.hero.data.mdef;

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      if (!element) return;
      var dom = document.getElementById("equipment-" + key);
      while (dom.hasChildNodes()) dom.removeChild(dom.lastChild);
      dom.appendChild(Game.items[element].icon);
      var text = document.createElement("span");
      text.textContent = Game.items[element].data.name;
      dom.appendChild(text);
    });
  });

  win.register("open", function () {
    Game.windows.status.execute("update");
    Game.windows.status.show();
  });
})();
//# sourceMappingURL=GameWindowStatus.js.map
