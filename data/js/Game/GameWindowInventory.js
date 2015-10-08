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

  var win = Game.windows.inventory = Game.Window.create("inventoryWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"inventoryWindowItemBar\">\n\n        <button id=\"inventoryWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"inventoryWindowStatus\" class=\"brownButton\">状态</button>\n\n        <button id=\"inventoryWindowAll\" class=\"brownButton\">全部</button>\n        <button id=\"inventoryWindowWeapon\" class=\"brownButton\">武器</button>\n        <button id=\"inventoryWindowArmor\" class=\"brownButton\">护甲</button>\n        <button id=\"inventoryWindowPotion\" class=\"brownButton\">药水</button>\n        <button id=\"inventoryWindowMaterial\" class=\"brownButton\">材料</button>\n        <button id=\"inventoryWindowBook\" class=\"brownButton\">书籍</button>\n        <button id=\"inventoryWindowMisc\" class=\"brownButton\">其他</button>\n      </div>\n\n      <span id=\"inventoryWindowGold\"></span>\n\n      <div style=\"overflow: auto; height: 310px;\">\n        <table border=\"0\">\n          <thead>\n            <tr>\n              <td style=\"width: 40px; text-align: center;\"></td>\n              <td style=\"width: 120px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td></td>\n              <td style=\"width: 60px;\"></td>\n            </tr>\n          </thead>\n          <tbody id=\"inventoryWindowTable\"></tbody>\n        </table>\n      </div>\n    </div>\n  ";

  win.css = "\n\n    #inventoryWindowItemBar {\n      height: 50px;\n    }\n\n    #inventoryWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #inventoryWindowClose {\n      float: right;\n    }\n\n    #inventoryWindowStatus {\n      float: right;\n    }\n\n    .inventoryWindow table {\n      width: 100%;\n    }\n\n    .inventoryWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #inventoryWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #inventoryWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 10px;\n      font-size: 20px;\n      color: black;\n      font-weight: bold;\n    }\n  ";

  var inventoryWindowClose = win.querySelector("button#inventoryWindowClose");
  var inventoryWindowStatus = win.querySelector("button#inventoryWindowStatus");

  var inventoryWindowAll = win.querySelector("button#inventoryWindowAll");
  var inventoryWindowWeapon = win.querySelector("button#inventoryWindowWeapon");
  var inventoryWindowArmor = win.querySelector("button#inventoryWindowArmor");
  var inventoryWindowPotion = win.querySelector("button#inventoryWindowPotion");
  var inventoryWindowMaterial = win.querySelector("button#inventoryWindowMaterial");
  var inventoryWindowBook = win.querySelector("button#inventoryWindowBook");
  var inventoryWindowMisc = win.querySelector("button#inventoryWindowMisc");

  var inventoryWindowGold = win.querySelector("span#inventoryWindowGold");
  var inventoryWindowTable = win.querySelector("#inventoryWindowTable");

  inventoryWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  inventoryWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.status.open();
    }, 20);
  });

  inventoryWindowAll.addEventListener("click", function (event) {
    win.open();
  });

  inventoryWindowWeapon.addEventListener("click", function (event) {
    win.open("sword|spear|bow");
  });

  inventoryWindowArmor.addEventListener("click", function (event) {
    win.open("head|body|feet");
  });

  inventoryWindowPotion.addEventListener("click", function (event) {
    win.open("potion");
  });

  inventoryWindowMaterial.addEventListener("click", function (event) {
    win.open("material");
  });

  inventoryWindowBook.addEventListener("click", function (event) {
    win.open("book|scroll|letter");
  });

  inventoryWindowMisc.addEventListener("click", function (event) {
    win.open("misc");
  });

  var lastFilter = null;
  var lastSelect = -1;

  win.assign("open", function (filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastFilter = filter;
    lastSelect = select;

    var defaultColor = "white";
    var activeColor = "yellow";

    inventoryWindowAll.style.color = defaultColor;
    inventoryWindowWeapon.style.color = defaultColor;
    inventoryWindowArmor.style.color = defaultColor;
    inventoryWindowPotion.style.color = defaultColor;
    inventoryWindowMaterial.style.color = defaultColor;
    inventoryWindowBook.style.color = defaultColor;
    inventoryWindowMisc.style.color = defaultColor;

    if (filter == null) {
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

    var table = "";
    var index = 0;
    var ids = Object.keys(Game.hero.data.items);
    ids.sort();
    ids.forEach(function (itemId) {
      var itemCount = Game.hero.data.items[itemId];
      var item = Game.items[itemId];
      var equipment = null;

      Sprite.each(Game.hero.data.equipment, function (element, key) {
        if (element == item.id) equipment = key;
      });

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + (equipment ? "*" : "") + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">操作</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    inventoryWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = inventoryWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = inventoryWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastFilter, 0);
      } else if (key == "up") {
        win.open(lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastFilter, select);
      }
    }
  });

  inventoryWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      (function () {
        var item = Game.items[itemId];
        var itemCount = Game.hero.data.items[itemId];
        var equipment = null;

        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == item.id) equipment = key;
        });

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

        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "puton":
              var type = item.data.type;
              if (type.match(/sword|spear|bow/)) {
                type = "weapon";
              }
              Game.hero.data.equipment[type] = item.id;
              return win.open(lastFilter);
              break;
            case "takeoff":
              if (item.data.type.match(/sword|spear|bow/)) Game.hero.data.equipment.weapon = null;else Game.hero.data.equipment[item.data.type] = null;
              return win.open(lastFilter);
              break;
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

              Game.addBag(Game.hero.x, Game.hero.y).then(function (bag) {
                if (bag.inner.hasOwnProperty(itemId)) {
                  bag.inner[itemId] += itemCount;
                } else {
                  bag.inner[itemId] = itemCount;
                }
              });

              delete Game.hero.data.items[itemId];

              Game.hero.data.bar.forEach(function (element, index, array) {
                if (element && element.id == itemId) {
                  array[index] = null;
                }
              });

              Game.windows["interface"].refresh();
              return win.open(lastFilter);
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
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: item.id,
                    type: "item"
                  };
                  Game.windows["interface"].refresh();
                }
              });
              break;
          }
        });
      })();
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
      win.open(filter, -1);
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
      win.open(filter, -1);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9HYW1lL0dhbWVXaW5kb3dJbnZlbnRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFekUsS0FBRyxDQUFDLElBQUksbzRDQWtDUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLDIxQkE4Q04sQ0FBQzs7QUFFRixNQUFJLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUM1RSxNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFOUUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDNUUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEYsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUUsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRTFFLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxD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aWxlIjoic3JjL0dhbWUvR2FtZVdpbmRvd0ludmVudG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3MuaW52ZW50b3J5ID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiaW52ZW50b3J5V2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwiaW52ZW50b3J5V2luZG93SXRlbUJhclwiPlxuXG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd1N0YXR1c1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7nirbmgIE8L2J1dHRvbj5cblxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93QWxsXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFqOmDqDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93V2VhcG9uXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuatpuWZqDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93QXJtb3JcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5oqk55SyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dQb3Rpb25cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+6I2v5rC0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mnZDmlpk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd0Jvb2tcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Lmm57GNPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dNaXNjXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFtuS7ljwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzcGFuIGlkPVwiaW52ZW50b3J5V2luZG93R29sZFwiPjwvc3Bhbj5cblxuICAgICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93OiBhdXRvOyBoZWlnaHQ6IDMxMHB4O1wiPlxuICAgICAgICA8dGFibGUgYm9yZGVyPVwiMFwiPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDQwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj48L3RkPlxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMTIwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDMwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDMwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgICAgPHRkPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5IGlkPVwiaW52ZW50b3J5V2luZG93VGFibGVcIj48L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcblxuICAgICNpbnZlbnRvcnlXaW5kb3dJdGVtQmFyIHtcbiAgICAgIGhlaWdodDogNTBweDtcbiAgICB9XG5cbiAgICAjaW52ZW50b3J5V2luZG93SXRlbUJhciA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjaW52ZW50b3J5V2luZG93Q2xvc2Uge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgICNpbnZlbnRvcnlXaW5kb3dTdGF0dXMge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgIC5pbnZlbnRvcnlXaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgLmludmVudG9yeVdpbmRvdyB0YWJsZSBidXR0b24ge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd1RhYmxlIHRyOm50aC1jaGlsZChvZGQpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTkyLCAxOTIsIDE5MiwgMC42KTtcbiAgICB9XG5cbiAgICAjaW52ZW50b3J5V2luZG93R29sZCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgICBib3R0b206IDEwcHg7XG4gICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICBjb2xvcjogYmxhY2s7XG4gICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGludmVudG9yeVdpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93Q2xvc2VcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dTdGF0dXMgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dTdGF0dXNcIik7XG5cbiAgbGV0IGludmVudG9yeVdpbmRvd0FsbCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd0FsbFwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd1dlYXBvbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd1dlYXBvblwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd0FybW9yID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93QXJtb3JcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dQb3Rpb24gPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dQb3Rpb25cIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd01hdGVyaWFsXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93Qm9vayA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd0Jvb2tcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dNaXNjID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93TWlzY1wiKTtcblxuICBsZXQgaW52ZW50b3J5V2luZG93R29sZCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwic3BhbiNpbnZlbnRvcnlXaW5kb3dHb2xkXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNpbnZlbnRvcnlXaW5kb3dUYWJsZVwiKTtcblxuICBpbnZlbnRvcnlXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93U3RhdHVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zdGF0dXMub3BlbigpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInRhYlwiXSwgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5zdGF0dXMub3BlbigpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93QWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbigpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dXZWFwb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwic3dvcmR8c3BlYXJ8Ym93XCIpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dBcm1vci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJoZWFkfGJvZHl8ZmVldFwiKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93UG90aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcInBvdGlvblwiKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93TWF0ZXJpYWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwibWF0ZXJpYWxcIik7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd0Jvb2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwiYm9va3xzY3JvbGx8bGV0dGVyXCIpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dNaXNjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcIm1pc2NcIik7XG4gIH0pO1xuXG4gIGxldCBsYXN0RmlsdGVyID0gbnVsbDtcbiAgbGV0IGxhc3RTZWxlY3QgPSAtMTtcblxuICB3aW4uYXNzaWduKFwib3BlblwiLCBmdW5jdGlvbiAoZmlsdGVyLCBzZWxlY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygc2VsZWN0ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHNlbGVjdCA9IC0xO1xuICAgIH1cblxuICAgIGxhc3RGaWx0ZXIgPSBmaWx0ZXI7XG4gICAgbGFzdFNlbGVjdCA9IHNlbGVjdDtcblxuICAgIGxldCBkZWZhdWx0Q29sb3IgPSBcIndoaXRlXCI7XG4gICAgbGV0IGFjdGl2ZUNvbG9yID0gXCJ5ZWxsb3dcIjtcblxuICAgIGludmVudG9yeVdpbmRvd0FsbC5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dXZWFwb24uc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93QXJtb3Iuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93UG90aW9uLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd01hdGVyaWFsLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd0Jvb2suc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93TWlzYy5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcblxuICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgaW52ZW50b3J5V2luZG93QWxsLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd1dlYXBvbi5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd0FybW9yLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dQb3Rpb24uc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWF0ZXJpYWwvKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93TWF0ZXJpYWwuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dCb29rLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93TWlzYy5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH1cblxuICAgIGludmVudG9yeVdpbmRvd0dvbGQudGV4dENvbnRlbnQgPSBHYW1lLmhlcm8uZGF0YS5nb2xkICsgXCJHXCI7XG5cbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGlkcyA9IE9iamVjdC5rZXlzKEdhbWUuaGVyby5kYXRhLml0ZW1zKTtcbiAgICBpZHMuc29ydCgpO1xuICAgIGlkcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtSWQpIHtcbiAgICAgIGxldCBpdGVtQ291bnQgPSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdO1xuICAgICAgbGV0IGl0ZW0gPSBHYW1lLml0ZW1zW2l0ZW1JZF07XG4gICAgICBsZXQgZXF1aXBtZW50ID0gbnVsbDtcblxuICAgICAgU3ByaXRlLmVhY2goR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LCBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IGl0ZW0uaWQpXG4gICAgICAgICAgZXF1aXBtZW50ID0ga2V5O1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaWx0ZXIgJiYgZmlsdGVyLmluZGV4T2YoaXRlbS5kYXRhLnR5cGUpID09IC0xKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBsaW5lID0gXCJcIjtcblxuICAgICAgaWYgKHNlbGVjdCA9PSBpbmRleCkge1xuICAgICAgICBsaW5lICs9IGA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcIj5cXG5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZSArPSBgPHRyPlxcbmA7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLmljb24pIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+PGltZyBhbHQ9XCJcIiBzcmM9XCIke2l0ZW0uaWNvbi5zcmN9XCI+PC90ZD5cXG5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQ+IDwvdGQ+XFxuYDtcbiAgICAgIH1cbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7ZXF1aXBtZW50P1wiKlwiOlwiXCJ9JHtpdGVtLmRhdGEubmFtZX08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4ke2l0ZW0uZGF0YS52YWx1ZX1HPC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHtpdGVtQ291bnR9PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+JHtpdGVtLmRhdGEuZGVzY3JpcHRpb259PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+PGJ1dHRvbiBkYXRhLWlkPVwiJHtpdGVtSWR9XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuaTjeS9nDwvYnV0dG9uPjwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L3RyPlxcblwiO1xuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICAgIGluZGV4Kys7XG4gICAgfSk7XG5cbiAgICBpbnZlbnRvcnlXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBpbnZlbnRvcnlXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGlmIChsYXN0U2VsZWN0ID49IDAgJiYgbGFzdFNlbGVjdCA8IGJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBidXR0b25zW2xhc3RTZWxlY3RdLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInVwXCIsIFwiZG93blwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBjb3VudCA9IGludmVudG9yeVdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIikubGVuZ3RoO1xuXG4gICAgaWYgKGxhc3RTZWxlY3QgPT0gLTEpIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgd2luLm9wZW4obGFzdEZpbHRlciwgMCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgd2luLm9wZW4obGFzdEZpbHRlciwgY291bnQgLSAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCArIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPj0gY291bnQpIHtcbiAgICAgICAgICBzZWxlY3QgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKGxhc3RGaWx0ZXIsIHNlbGVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgLSAxO1xuICAgICAgICBpZiAoc2VsZWN0IDwgMCkge1xuICAgICAgICAgIHNlbGVjdCA9IGNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpdGVtSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICBpZiAoaXRlbUlkICYmIEdhbWUuaGVyby5kYXRhLml0ZW1zLmhhc093blByb3BlcnR5KGl0ZW1JZCkpIHtcbiAgICAgIGxldCBpdGVtID0gR2FtZS5pdGVtc1tpdGVtSWRdO1xuICAgICAgbGV0IGl0ZW1Db3VudCA9IEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF07XG4gICAgICBsZXQgZXF1aXBtZW50ID0gbnVsbDtcblxuICAgICAgU3ByaXRlLmVhY2goR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LCBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IGl0ZW0uaWQpXG4gICAgICAgICAgZXF1aXBtZW50ID0ga2V5O1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBvcHRpb25zID0ge307XG4gICAgICBpZiAoaXRlbS5kYXRhLnR5cGUubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIG9wdGlvbnNbXCLkvb/nlKhcIl0gPSBcInVzZVwiO1xuICAgICAgICBvcHRpb25zW1wi5b+r5o236ZSuXCJdID0gXCJzaG9ydGN1dFwiO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLmRhdGEudHlwZS5tYXRjaCgvc3dvcmR8c3BlYXJ8Ym93fGhlYWR8Ym9keXxmZWV0fG5lY2t8cmluZy8pKSB7XG4gICAgICAgIGlmIChlcXVpcG1lbnQpXG4gICAgICAgICAgb3B0aW9uc1tcIuWNuOS4i1wiXSA9IFwidGFrZW9mZlwiO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgb3B0aW9uc1tcIuijheWkh1wiXSA9IFwicHV0b25cIjtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5kYXRhLnR5cGUubWF0Y2goL2Jvb2svKSkge1xuICAgICAgICBvcHRpb25zW1wi6ZiF6K+7XCJdID0gXCJyZWFkXCI7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnNbXCLkuKLlvINcIl0gPSBcImRyb3BcIjtcblxuICAgICAgR2FtZS5jaG9pY2Uob3B0aW9ucykudGhlbigoY2hvaWNlKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XG4gICAgICAgICAgY2FzZSBcInB1dG9uXCI6XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGl0ZW0uZGF0YS50eXBlO1xuICAgICAgICAgICAgaWYgKHR5cGUubWF0Y2goL3N3b3JkfHNwZWFyfGJvdy8pKSB7XG4gICAgICAgICAgICAgIHR5cGUgPSBcIndlYXBvblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W3R5cGVdID0gaXRlbS5pZDtcbiAgICAgICAgICAgIHJldHVybiB3aW4ub3BlbihsYXN0RmlsdGVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ0YWtlb2ZmXCI6XG4gICAgICAgICAgICBpZiAoaXRlbS5kYXRhLnR5cGUubWF0Y2goL3N3b3JkfHNwZWFyfGJvdy8pKVxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnQud2VhcG9uID0gbnVsbDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2l0ZW0uZGF0YS50eXBlXSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gd2luLm9wZW4obGFzdEZpbHRlcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidXNlXCI6XG4gICAgICAgICAgICBpZiAoaXRlbS5oZXJvVXNlKSB7XG4gICAgICAgICAgICAgIGl0ZW0uaGVyb1VzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInJlYWRcIjpcbiAgICAgICAgICAgIGlmIChpdGVtLmhlcm9Vc2UpIHtcbiAgICAgICAgICAgICAgaXRlbS5oZXJvVXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZHJvcFwiOlxuICAgICAgICAgICAgaWYgKGVxdWlwbWVudCkge1xuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnRbZXF1aXBtZW50XSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEdhbWUuYWRkQmFnKEdhbWUuaGVyby54ICxHYW1lLmhlcm8ueSkudGhlbigoYmFnKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChiYWcuaW5uZXIuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgICAgICAgICAgIGJhZy5pbm5lcltpdGVtSWRdICs9IGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWcuaW5uZXJbaXRlbUlkXSA9IGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdO1xuXG4gICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXIuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuaWQgPT0gaXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHdpbi5vcGVuKGxhc3RGaWx0ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInNob3J0Y3V0XCI6XG4gICAgICAgICAgICBHYW1lLmNob2ljZSh7XG4gICAgICAgICAgICAgIDE6MCxcbiAgICAgICAgICAgICAgMjoxLFxuICAgICAgICAgICAgICAzOjIsXG4gICAgICAgICAgICAgIDQ6MyxcbiAgICAgICAgICAgICAgNTo0LFxuICAgICAgICAgICAgICA2OjUsXG4gICAgICAgICAgICAgIDc6NixcbiAgICAgICAgICAgICAgODo3XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2hvaWNlKSAmJiBjaG9pY2UgPj0gMCkge1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmJhcltjaG9pY2VdID0ge1xuICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcIml0ZW1cIlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wibGVmdFwiLCBcInJpZ2h0XCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleSA9PSBcInJpZ2h0XCIpIHtcbiAgICAgIGxldCBmaWx0ZXIgPSBsYXN0RmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICAgIGZpbHRlciA9IFwic3dvcmR8c3BlYXJ8Ym93XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImhlYWR8Ym9keXxmZWV0XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtYXRlcmlhbFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rfHNjcm9sbHxsZXR0ZXJcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtaXNjXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICAgIGZpbHRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICB3aW4ub3BlbihmaWx0ZXIsIC0xKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PSBcImxlZnRcIikge1xuICAgICAgbGV0IGZpbHRlciA9IGxhc3RGaWx0ZXI7XG4gICAgICBpZiAoZmlsdGVyID09IG51bGwpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtaXNjXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2hlYWQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcInN3b3JkfHNwZWFyfGJvd1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiaGVhZHxib2R5fGZlZXRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWF0ZXJpYWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9taXNjLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rfHNjcm9sbHxsZXR0ZXJcIjtcbiAgICAgIH1cbiAgICAgIHdpbi5vcGVuKGZpbHRlciwgLTEpO1xuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==