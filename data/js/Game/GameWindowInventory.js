"use strict";

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

              Game.windows.interface.refresh();
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
                  Game.windows.interface.refresh();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dJbnZlbnRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFekUsS0FBRyxDQUFDLElBQUksbzRDQWtDUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLDIxQkE4Q04sQ0FBQzs7QUFFRixNQUFJLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUM1RSxNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFOUUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDNUUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEYsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUUsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRTFFLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFB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LENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dJbnZlbnRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmludmVudG9yeSA9IEdhbWUuV2luZG93LmNyZWF0ZShcImludmVudG9yeVdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGRpdiBpZD1cImludmVudG9yeVdpbmRvd0l0ZW1CYXJcIj5cblxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6ZetPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dTdGF0dXNcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+54q25oCBPC9idXR0b24+XG5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd0FsbFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhajpg6g8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd1dlYXBvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mrablmag8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd0FybW9yXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuaKpOeUsjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93UG90aW9uXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuiNr+awtDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93TWF0ZXJpYWxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5p2Q5paZPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dCb29rXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuS5puexjTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93TWlzY1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbbku5Y8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8c3BhbiBpZD1cImludmVudG9yeVdpbmRvd0dvbGRcIj48L3NwYW4+XG5cbiAgICAgIDxkaXYgc3R5bGU9XCJvdmVyZmxvdzogYXV0bzsgaGVpZ2h0OiAzMTBweDtcIj5cbiAgICAgICAgPHRhYmxlIGJvcmRlcj1cIjBcIj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA0MHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7XCI+PC90ZD5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDEyMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNjBweDtcIj48L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keSBpZD1cImludmVudG9yeVdpbmRvd1RhYmxlXCI+PC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG5cbiAgICAjaW52ZW50b3J5V2luZG93SXRlbUJhciB7XG4gICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd0l0ZW1CYXIgPiBidXR0b24ge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBtYXJnaW4tbGVmdDogNXB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gICAgICBtYXJnaW4tdG9wOiAwcHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAjaW52ZW50b3J5V2luZG93U3RhdHVzIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAuaW52ZW50b3J5V2luZG93IHRhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5pbnZlbnRvcnlXaW5kb3cgdGFibGUgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgICNpbnZlbnRvcnlXaW5kb3dUYWJsZSB0cjpudGgtY2hpbGQob2RkKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE5MiwgMTkyLCAxOTIsIDAuNik7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd0dvbGQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgICAgYm90dG9tOiAxMHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuICBgO1xuXG4gIGxldCBpbnZlbnRvcnlXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93U3RhdHVzID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93U3RhdHVzXCIpO1xuXG4gIGxldCBpbnZlbnRvcnlXaW5kb3dBbGwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dBbGxcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dXZWFwb24gPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dXZWFwb25cIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dBcm1vciA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd0FybW9yXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93UG90aW9uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93UG90aW9uXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93TWF0ZXJpYWwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbFwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd0Jvb2sgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dCb29rXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93TWlzYyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd01pc2NcIik7XG5cbiAgbGV0IGludmVudG9yeVdpbmRvd0dvbGQgPSB3aW4ucXVlcnlTZWxlY3RvcihcInNwYW4jaW52ZW50b3J5V2luZG93R29sZFwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd1RhYmxlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaW52ZW50b3J5V2luZG93VGFibGVcIik7XG5cbiAgaW52ZW50b3J5V2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd1N0YXR1cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3Muc3RhdHVzLm9wZW4oKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJ0YWJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3Muc3RhdHVzLm9wZW4oKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd0FsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93V2VhcG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcInN3b3JkfHNwZWFyfGJvd1wiKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93QXJtb3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwiaGVhZHxib2R5fGZlZXRcIik7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd1BvdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJwb3Rpb25cIik7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd01hdGVyaWFsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcIm1hdGVyaWFsXCIpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dCb29rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcImJvb2t8c2Nyb2xsfGxldHRlclwiKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93TWlzYy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJtaXNjXCIpO1xuICB9KTtcblxuICBsZXQgbGFzdEZpbHRlciA9IG51bGw7XG4gIGxldCBsYXN0U2VsZWN0ID0gLTE7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKGZpbHRlciwgc2VsZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxlY3QgPSAtMTtcbiAgICB9XG5cbiAgICBsYXN0RmlsdGVyID0gZmlsdGVyO1xuICAgIGxhc3RTZWxlY3QgPSBzZWxlY3Q7XG5cbiAgICBsZXQgZGVmYXVsdENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgIGxldCBhY3RpdmVDb2xvciA9IFwieWVsbG93XCI7XG5cbiAgICBpbnZlbnRvcnlXaW5kb3dBbGwuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93V2VhcG9uLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd0FybW9yLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd1BvdGlvbi5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbC5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dCb29rLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd01pc2Muc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG5cbiAgICBpZiAoZmlsdGVyID09IG51bGwpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd0FsbC5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9zd29yZC8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dXZWFwb24uc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dBcm1vci5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93UG90aW9uLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd01hdGVyaWFsLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2Jvb2svKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93Qm9vay5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9taXNjLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd01pc2Muc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9XG5cbiAgICBpbnZlbnRvcnlXaW5kb3dHb2xkLnRleHRDb250ZW50ID0gR2FtZS5oZXJvLmRhdGEuZ29sZCArIFwiR1wiO1xuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBpZHMgPSBPYmplY3Qua2V5cyhHYW1lLmhlcm8uZGF0YS5pdGVtcyk7XG4gICAgaWRzLnNvcnQoKTtcbiAgICBpZHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgICBsZXQgaXRlbUNvdW50ID0gR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXTtcbiAgICAgIGxldCBpdGVtID0gR2FtZS5pdGVtc1tpdGVtSWRdO1xuICAgICAgbGV0IGVxdWlwbWVudCA9IG51bGw7XG5cbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudCwgZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PSBpdGVtLmlkKVxuICAgICAgICAgIGVxdWlwbWVudCA9IGtleTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZmlsdGVyICYmIGZpbHRlci5pbmRleE9mKGl0ZW0uZGF0YS50eXBlKSA9PSAtMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgbGluZSA9IFwiXCI7XG5cbiAgICAgIGlmIChzZWxlY3QgPT0gaW5kZXgpIHtcbiAgICAgICAgbGluZSArPSBgPHRyIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XCI+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYDx0cj5cXG5gO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5pY29uKSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPjxpbWcgYWx0PVwiXCIgc3JjPVwiJHtpdGVtLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPiA8L3RkPlxcbmA7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2VxdWlwbWVudD9cIipcIjpcIlwifSR7aXRlbS5kYXRhLm5hbWV9PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHtpdGVtLmRhdGEudmFsdWV9RzwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbUNvdW50fTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7aXRlbS5kYXRhLmRlc2NyaXB0aW9ufTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPjxidXR0b24gZGF0YS1pZD1cIiR7aXRlbUlkfVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mk43kvZw8L2J1dHRvbj48L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IFwiPC90cj5cXG5cIjtcbiAgICAgIHRhYmxlICs9IGxpbmU7XG4gICAgICBpbmRleCsrO1xuICAgIH0pO1xuXG4gICAgaW52ZW50b3J5V2luZG93VGFibGUuaW5uZXJIVE1MID0gdGFibGU7XG4gICAgd2luLnNob3coKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlbnRlclwiXSwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBidXR0b25zID0gaW52ZW50b3J5V2luZG93VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICBpZiAobGFzdFNlbGVjdCA+PSAwICYmIGxhc3RTZWxlY3QgPCBidXR0b25zLmxlbmd0aCkge1xuICAgICAgYnV0dG9uc1tsYXN0U2VsZWN0XS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJ1cFwiLCBcImRvd25cIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBsZXQgY291bnQgPSBpbnZlbnRvcnlXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpLmxlbmd0aDtcblxuICAgIGlmIChsYXN0U2VsZWN0ID09IC0xKSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGxhc3RGaWx0ZXIsIDApO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGxhc3RGaWx0ZXIsIGNvdW50IC0gMSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgKyAxO1xuICAgICAgICBpZiAoc2VsZWN0ID49IGNvdW50KSB7XG4gICAgICAgICAgc2VsZWN0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0IC0gMTtcbiAgICAgICAgaWYgKHNlbGVjdCA8IDApIHtcbiAgICAgICAgICBzZWxlY3QgPSBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEZpbHRlciwgc2VsZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd1RhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaXRlbUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgaWYgKGl0ZW1JZCAmJiBHYW1lLmhlcm8uZGF0YS5pdGVtcy5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcbiAgICAgIGxldCBpdGVtQ291bnQgPSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdO1xuICAgICAgbGV0IGVxdWlwbWVudCA9IG51bGw7XG5cbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudCwgZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PSBpdGVtLmlkKVxuICAgICAgICAgIGVxdWlwbWVudCA9IGtleTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgICAgaWYgKGl0ZW0uZGF0YS50eXBlLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgICBvcHRpb25zW1wi5L2/55SoXCJdID0gXCJ1c2VcIjtcbiAgICAgICAgb3B0aW9uc1tcIuW/q+aNt+mUrlwiXSA9IFwic2hvcnRjdXRcIjtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5kYXRhLnR5cGUubWF0Y2goL3N3b3JkfHNwZWFyfGJvd3xoZWFkfGJvZHl8ZmVldHxuZWNrfHJpbmcvKSkge1xuICAgICAgICBpZiAoZXF1aXBtZW50KVxuICAgICAgICAgIG9wdGlvbnNbXCLljbjkuItcIl0gPSBcInRha2VvZmZcIjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9wdGlvbnNbXCLoo4XlpIdcIl0gPSBcInB1dG9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uZGF0YS50eXBlLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgb3B0aW9uc1tcIumYheivu1wiXSA9IFwicmVhZFwiO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zW1wi5Lii5byDXCJdID0gXCJkcm9wXCI7XG5cbiAgICAgIEdhbWUuY2hvaWNlKG9wdGlvbnMpLnRoZW4oKGNob2ljZSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGNob2ljZSkge1xuICAgICAgICAgIGNhc2UgXCJwdXRvblwiOlxuICAgICAgICAgICAgbGV0IHR5cGUgPSBpdGVtLmRhdGEudHlwZTtcbiAgICAgICAgICAgIGlmICh0eXBlLm1hdGNoKC9zd29yZHxzcGVhcnxib3cvKSkge1xuICAgICAgICAgICAgICB0eXBlID0gXCJ3ZWFwb25cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudFt0eXBlXSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICByZXR1cm4gd2luLm9wZW4obGFzdEZpbHRlcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidGFrZW9mZlwiOlxuICAgICAgICAgICAgaWYgKGl0ZW0uZGF0YS50eXBlLm1hdGNoKC9zd29yZHxzcGVhcnxib3cvKSlcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LndlYXBvbiA9IG51bGw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudFtpdGVtLmRhdGEudHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHdpbi5vcGVuKGxhc3RGaWx0ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInVzZVwiOlxuICAgICAgICAgICAgaWYgKGl0ZW0uaGVyb1VzZSkge1xuICAgICAgICAgICAgICBpdGVtLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyZWFkXCI6XG4gICAgICAgICAgICBpZiAoaXRlbS5oZXJvVXNlKSB7XG4gICAgICAgICAgICAgIGl0ZW0uaGVyb1VzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImRyb3BcIjpcbiAgICAgICAgICAgIGlmIChlcXVpcG1lbnQpIHtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2VxdWlwbWVudF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBHYW1lLmFkZEJhZyhHYW1lLmhlcm8ueCAsR2FtZS5oZXJvLnkpLnRoZW4oKGJhZykgPT4ge1xuICAgICAgICAgICAgICBpZiAoYmFnLmlubmVyLmhhc093blByb3BlcnR5KGl0ZW1JZCkpIHtcbiAgICAgICAgICAgICAgICBiYWcuaW5uZXJbaXRlbUlkXSArPSBpdGVtQ291bnQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFnLmlubmVyW2l0ZW1JZF0gPSBpdGVtQ291bnQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZWxldGUgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuYmFyLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4LCBhcnJheSkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LmlkID09IGl0ZW1JZCkge1xuICAgICAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgIHJldHVybiB3aW4ub3BlbihsYXN0RmlsdGVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJzaG9ydGN1dFwiOlxuICAgICAgICAgICAgR2FtZS5jaG9pY2Uoe1xuICAgICAgICAgICAgICAxOjAsXG4gICAgICAgICAgICAgIDI6MSxcbiAgICAgICAgICAgICAgMzoyLFxuICAgICAgICAgICAgICA0OjMsXG4gICAgICAgICAgICAgIDU6NCxcbiAgICAgICAgICAgICAgNjo1LFxuICAgICAgICAgICAgICA3OjYsXG4gICAgICAgICAgICAgIDg6N1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNob2ljZSkgJiYgY2hvaWNlID49IDApIHtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXJbY2hvaWNlXSA9IHtcbiAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJpdGVtXCJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImxlZnRcIiwgXCJyaWdodFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkgPT0gXCJyaWdodFwiKSB7XG4gICAgICBsZXQgZmlsdGVyID0gbGFzdEZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICBmaWx0ZXIgPSBcInN3b3JkfHNwZWFyfGJvd1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJoZWFkfGJvZHl8ZmVldFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2hlYWQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcInBvdGlvblwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWF0ZXJpYWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiYm9va3xzY3JvbGx8bGV0dGVyXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWlzY1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgICBmaWx0ZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgd2luLm9wZW4oZmlsdGVyLCAtMSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT0gXCJsZWZ0XCIpIHtcbiAgICAgIGxldCBmaWx0ZXIgPSBsYXN0RmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWlzY1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgICAgZmlsdGVyID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJzd29yZHxzcGVhcnxib3dcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImhlYWR8Ym9keXxmZWV0XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWF0ZXJpYWwvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcInBvdGlvblwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2Jvb2svKSkge1xuICAgICAgICBmaWx0ZXIgPSBcIm1hdGVyaWFsXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiYm9va3xzY3JvbGx8bGV0dGVyXCI7XG4gICAgICB9XG4gICAgICB3aW4ub3BlbihmaWx0ZXIsIC0xKTtcbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
