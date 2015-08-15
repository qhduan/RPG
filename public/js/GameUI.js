/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  Game.ui = {};

  Game.ui.confirmHandle = null;
  Game.ui.confirm = function (message, callback) {
    document.getElementById("confirmMessage").textContent = message;
    Game.ui.confirmHandle = callback;
    document.getElementById("confirmWindow").style.display = "block";
  };
  document.getElementById("confirmYes").addEventListener("click", function () {
    document.getElementById("confirmWindow").style.display = "none";
    if (typeof Game.ui.confirmHandle == "function") Game.ui.confirmHandle(true);
  });
  document.getElementById("confirmNo").addEventListener("click", function () {
    document.getElementById("confirmWindow").style.display = "none";
    if (typeof Game.ui.confirmHandle == "function") Game.ui.confirmHandle(false);
  });

  Game.ui.choiceHandle = null;
  Game.ui.choiceOptions = null;
  Game.ui.choice = function (options, callback) {
    Game.ui.choiceHandle = callback;
    Game.ui.choiceOptions = options;
    document.getElementById("choiceWindow").style.display = "block";
    var index = 0;
    for (var key in options) {
      document.getElementById("choice" + index).textContent = key;
      document.getElementById("choice" + index).style.display = "block";
      index++;
    }
    for (var i = index; i < 16; i++) {
      document.getElementById("choice" + i).style.display = "none";
    }
  };
  document.getElementById("choiceNo").addEventListener("click", function () {
    document.getElementById("choiceWindow").style.display = "none";
    if (typeof Game.ui.choiceHandle == "function") Game.ui.choiceHandle(null);
  });
  for (var i = 0; i < 16; i++) {
    (function (index) {
      document.getElementById("choice" + index).addEventListener("click", function () {
        var key = Object.keys(Game.ui.choiceOptions)[index];
        document.getElementById("choiceWindow").style.display = "none";
        if (typeof Game.ui.choiceHandle == "function") Game.ui.choiceHandle(Game.ui.choiceOptions[key]);
      });
    })(i);
  }

  Game.ui.shortcut = function () {
    Game.ui.choice({
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
        Game.hero.data.bar[choice] = null;
        Game.ui.bar();
        Game.ShowWindow("uiWindow");
      }
    });
  };

  Game.ui.pickupWindow = function (itemObj) {
    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {
      for (var key in Game.area.bags) {
        if (Game.area.bags[key] == itemObj) {
          delete Game.area.bags[key];
          itemObj.erase(Game.itemLayer);
        }
      }
      Game.ShowWindow("uiWindow");
      return;
    }

    var tableBody = document.getElementById("pickupTableBody");
    while (tableBody.hasChildNodes()) {
      tableBody.removeChild(tableBody.lastChild);
    }

    Sprite.Util.each(itemObj.inner, function (itemCount, itemId, inner) {
      var item = Game.items[itemId];

      var line = document.createElement("tr");

      var icon = document.createElement("td");
      line.appendChild(icon);

      var name = document.createElement("td");
      line.appendChild(name);

      var count = document.createElement("td");
      line.appendChild(count);

      var description = document.createElement("td");
      line.appendChild(description);

      var pickup = document.createElement("td");
      line.appendChild(pickup);

      icon.appendChild(item.icon);
      name.textContent = item.data.name;
      count.textContent = itemCount;
      description.textContent = item.data.description;

      var pickupButton = document.createElement("button");
      pickupButton.textContent = "捡取";
      pickupButton.addEventListener("click", function () {
        if (Game.hero.data.items[itemId]) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
        delete inner[itemId];
        Game.ui.pickupWindow(itemObj);
      });
      pickup.appendChild(pickupButton);

      tableBody.appendChild(line);
    });

    Game.ShowWindow("pickupWindow");
  };

  Game.ui.itemWindow = function (filter) {
    var tableBody = document.getElementById("itemTableBody");
    while (tableBody.hasChildNodes()) {
      tableBody.removeChild(tableBody.lastChild);
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

        Game.ui.choice(options, function (choice) {
          console.log(choice);
          switch (choice) {
            case "puton":
              Game.hero.data.equipment[item.data.type] = item.id;
              return Game.ui.itemWindow(filter);
              break;
            case "takeoff":
              if (item.data.type.match(/sword|spear|bow/)) Game.hero.data.equipment.weapon = null;else Game.hero.data.equipment[item.data.type] = null;
              return Game.ui.itemWindow(filter);
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
              dead.draw(Game.itemLayer);
              dead.inner = {};
              dead.inner[item.id] = itemCount;
              Game.area.bags[Sprite.Util.id()] = dead;
              delete Game.hero.data.items[item.id];
              return Game.ui.itemWindow(filter);
              break;
            case "shortcut":
              Game.ui.choice({
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
                  Game.ui.bar();
                }
              });
              break;
          }
        });
      });
      line.appendChild(manage);

      tableBody.appendChild(line);
    });

    Game.ShowWindow("itemWindow");
  };

  Game.ui.skillWindow = function () {
    var tableBody = document.getElementById("skillTableBody");
    while (tableBody.hasChildNodes()) {
      tableBody.removeChild(tableBody.lastChild);
    }

    for (var i = 0; i < Game.hero.data.skillcount; i++) {
      (function (index) {
        var line = document.createElement("tr");

        var icon = document.createElement("td");
        line.appendChild(icon);

        var name = document.createElement("td");
        line.appendChild(name);

        var description = document.createElement("td");
        line.appendChild(description);

        var manage = document.createElement("td");
        line.appendChild(manage);

        var skillId = Game.hero.data.skills[index];
        if (skillId) {
          var skill = Game.hero.skills[skillId];
          icon.appendChild(skill.icon);
          name.textContent = skill.data.name;
          description.textContent = skill.data.description;

          var manageButton = document.createElement("button");
          manageButton.textContent = "操作";
          manage.appendChild(manageButton);
          manageButton.addEventListener("click", function () {
            Game.ui.choice({
              "快捷栏": "shortcut",
              "升级": "levelup",
              "遗忘": "remove"
            }, function (choice) {
              switch (choice) {
                case "shortcut":
                  Game.ui.choice({
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
                        id: skillId,
                        type: "skill"
                      };
                      Game.ui.bar();
                    }
                  });
                  break;
                case "levelup":
                  if (skill.data.next && skill.data.exp && Game.hero.data.exp > skill.data.exp) {
                    // level up
                  }
                  break;
                case "remove":
                  Game.ui.confirm("真的要遗忘 " + skill.data.name + " 技能吗？", function (yes) {
                    if (yes) {
                      Game.hero.data.bar.forEach(function (element, index, array) {
                        if (element && element.id == skillId) {
                          array[index] = null;
                        }
                      });
                      Game.hero.data.skills.splice(index, 1);
                      Game.ui.bar();
                      Game.ui.skillWindow();
                    }
                  });
                  break;
              }
            });
          });
        } else {
          name.textContent = "空";
        }

        tableBody.appendChild(line);
      })(i);
    }

    Game.ShowWindow("skillWindow");
  };

  Game.ui.statusWindow = function () {
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

    Sprite.Util.each(Game.hero.data.equipment, function (element, key) {
      if (!element) return;
      var dom = document.getElementById("equipment-" + key);
      while (dom.hasChildNodes()) dom.removeChild(dom.lastChild);
      dom.appendChild(Game.items[element].icon);
      var text = document.createElement("span");
      text.textContent = Game.items[element].data.name;
      dom.appendChild(text);
    });

    Game.ShowWindow('statusWindow');
  };

  Game.ui.archiveWindow = function () {
    Game.ShowWindow("archiveWindow");
    var table = document.getElementById("archiveTable");

    while (table.hasChildNodes()) {
      table.removeChild(table.lastChild);
    }

    var list = Game.archive.list();
    list.forEach(function (element) {
      var div = document.createElement("div");
      div.classList.add("archiveItem");

      var archive = Game.archive.get("SAVE_" + element);

      var removeButton = document.createElement("button");
      removeButton.style.float = "right";
      removeButton.textContent = "REMOVE";
      div.appendChild(removeButton);
      removeButton.addEventListener("click", function () {
        Game.archive.remove("SAVE_" + element);
        Game.ui.archiveWindow();
      });

      var loadButton = document.createElement("button");
      loadButton.style.float = "right";
      loadButton.style.marginBottom = "40px";
      loadButton.textContent = "LOAD";
      div.appendChild(loadButton);
      loadButton.addEventListener("click", function () {
        Game.archive.load("SAVE_" + element);
      });

      var heroName = document.createElement("h4");
      heroName.innerHTML = archive.name;
      div.appendChild(heroName);

      var time = document.createElement("h5");
      time.innerHTML = archive.date;
      div.appendChild(time);

      table.appendChild(div);
    });
  };

  Game.ui.bar = function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var container = document.getElementById("buttonBar-" + i);
      while (container.hasChildNodes()) container.removeChild(container.lastChild);
      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.hero.skills[id];
          container.appendChild(skill.icon.cloneNode());
        } else if (type == "item") {
          var item = Game.items[id];
          container.appendChild(item.icon.cloneNode());
        }
      } else {
        // empty bar element
        container.appendChild(document.createElement("img"));
      }
    }
  };

  Game.ui.init = function () {
    // 设置技能栏
    for (var i = 0; i < 8; i++) {
      (function (buttonSkill, index) {
        buttonSkill.addEventListener("click", function () {
          var element = Game.hero.data.bar[index];
          if (element) {
            if (element.type == "skill") Game.hero.fire(element.id);else if (element.type == "item") {}
          }
        });
      })(document.getElementById("buttonBar-" + i), i);
    }

    Game.ui.bar();

    document.getElementById("buttonMenu").addEventListener("click", function (event) {
      Game.ShowWindow("menuWindow");
    });
  };
})();