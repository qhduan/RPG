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

  var win = Game.windows.inventory = new Game.Window("inventoryWindow");

  win.html("\n    <div class=\"window-box\">\n      <div id=\"itemBar\">\n        <button id=\"inventoryWindowClose\">关闭</button>\n        <button id=\"inventoryWindowStatus\">状态</button>\n        <button id=\"inventoryWindowAll\">全部</button>\n        <button id=\"inventoryWindowWeapon\">武器</button>\n        <button id=\"inventoryWindowArmor\">护甲</button>\n        <button id=\"inventoryWindowPotion\">药水</button>\n        <button id=\"inventoryWindowMaterial\">材料</button>\n        <button id=\"inventoryWindowBook\">书籍</button>\n        <button id=\"inventoryWindowMisc\">其他</button>\n      </div>\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"inventoryWindowTable\"></tbody>\n      </table>\n    </div>\n  ");

  win.css("\n    #itemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #inventoryWindow table {\n      width: 100%;\n    }\n\n    #inventoryWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #inventoryWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n  ");

  document.querySelector("button#inventoryWindowClose").addEventListener("click", function (event) {
    Game.windows.inventory.hide();
  });

  document.querySelector("button#inventoryWindowStatus").addEventListener("click", function (event) {
    Game.windows.status.excute("open");
  });

  document.querySelector("button#inventoryWindowAll").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", null);
  });

  document.querySelector("button#inventoryWindowWeapon").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "sword|spear|bow");
  });

  document.querySelector("button#inventoryWindowArmor").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "head|body|feet");
  });

  document.querySelector("button#inventoryWindowPotion").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "potion");
  });

  document.querySelector("button#inventoryWindowMaterial").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "material");
  });

  document.querySelector("button#inventoryWindowBook").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "book|scroll|letter");
  });

  document.querySelector("button#inventoryWindowMisc").addEventListener("click", function (event) {
    Game.windows.inventory.execute("open", "misc");
  });

  win.register("open", function (filter) {
    var tableBody = document.querySelector("tbody#inventoryWindowTable");
    while (tableBody.hasChildNodes()) {
      tableBody.removeChild(tableBody.lastChild);
    }

    document.querySelector("button#inventoryWindowAll").style.color = "black";
    document.querySelector("button#inventoryWindowWeapon").style.color = "black";
    document.querySelector("button#inventoryWindowArmor").style.color = "black";
    document.querySelector("button#inventoryWindowPotion").style.color = "black";
    document.querySelector("button#inventoryWindowMaterial").style.color = "black";
    document.querySelector("button#inventoryWindowBook").style.color = "black";
    document.querySelector("button#inventoryWindowMisc").style.color = "black";

    if (filter == null) {
      document.querySelector("button#inventoryWindowAll").style.color = "red";
    } else if (filter.match(/sword/)) {
      document.querySelector("button#inventoryWindowWeapon").style.color = "red";
    } else if (filter.match(/head/)) {
      document.querySelector("button#inventoryWindowArmor").style.color = "red";
    } else if (filter.match(/potion/)) {
      document.querySelector("button#inventoryWindowPotion").style.color = "red";
    } else if (filter.match(/material/)) {
      document.querySelector("button#inventoryWindowMaterial").style.color = "red";
    } else if (filter.match(/book/)) {
      document.querySelector("button#inventoryWindowBook").style.color = "red";
    } else if (filter.match(/misc/)) {
      document.querySelector("button#inventoryWindowMisc").style.color = "red";
    }

    var ids = Object.keys(Game.hero.data.items);
    ids.sort();
    ids.forEach(function (itemId) {
      var itemCount = Game.hero.data.items[itemId];
      var item = Game.items[itemId];
      var equipment = null;

      Sprite.Util.each(Game.hero.data.equipment, function (element, key) {
        if (element == item.id) equipment = key;
      });

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = document.createElement("tr");

      var icon = document.createElement("td");
      icon.appendChild(item.icon);
      line.appendChild(icon);

      var name = document.createElement("td");
      name.textContent = item.data.name;
      if (equipment) name.style.color = "red";
      line.appendChild(name);

      var count = document.createElement("td");
      count.textContent = itemCount;
      count.style.textAlign = "center";
      line.appendChild(count);

      var description = document.createElement("td");
      description.textContent = item.data.description;
      line.appendChild(description);

      var manage = document.createElement("td");
      var manageButton = document.createElement("button");
      manageButton.textContent = "操作";
      manage.appendChild(manageButton);
      manageButton.addEventListener("click", function () {
        var options = {};
        if (item.data.type.match(/potion/)) {
          options["使用"] = "use";
          options["快捷键"] = "shortcut";
        } else if (item.data.type.match(/sword|spear|bow|head|body|feet|neck|ring/)) {
          if (equipment) options["卸下"] = "takeoff";else options["装备"] = "puton";
        } else if (item.data.type.match(/book/)) {
          options["阅读"] = "read";
        }

        options["丢弃"] = "drop";

        Game.choice(options, function (choice) {
          console.log(choice);
          switch (choice) {
            case "puton":
              Game.hero.data.equipment[item.data.type] = item.id;
              return Game.windows.inventory.execute("open", filter);
              break;
            case "takeoff":
              if (item.data.type.match(/sword|spear|bow/)) Game.hero.data.equipment.weapon = null;else Game.hero.data.equipment[item.data.type] = null;
              return Game.windows.inventory.execute("open", filter);
              break;
            case "use":
              break;
            case "read":
              break;
            case "drop":
              if (equipment) Game.hero.data.equipment[equipment] = null;
              var dead = Game.items.bag.clone();
              dead.x = Game.hero.x;
              dead.y = Game.hero.y;
              dead.draw(Game.layers.itemLayer);
              dead.inner = {};
              dead.inner[item.id] = itemCount;
              Game.area.bags[Sprite.Util.id()] = dead;
              delete Game.hero.data.items[item.id];
              return Game.windows.inventory.execute("open", filter);
              break;
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }, function (choice) {
                if (typeof choice == "number" && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: item.id,
                    type: "item"
                  };
                  Game.windows["interface"].execute("refresh");
                }
              });
              break;
          }
        });
      });
      line.appendChild(manage);

      tableBody.appendChild(line);
    });

    Game.windows.inventory.show();
  });
})();
//# sourceMappingURL=GameWindowInventory.js.map
