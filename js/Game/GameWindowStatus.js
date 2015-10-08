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

  var win = Game.windows.status = Game.Window.create("statusWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"statusWindowInventory\" class=\"brownButton\">物品</button>\n        <label id=\"heroName\"></label>\n      </div>\n      <table border=\"0\">\n        <tr>\n          <td id=\"statusWindowTable\">\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td style=\"width: 50%;\">\n            <table id=\"statusWindowEquipmentTable\" border=\"0\">\n              <tbody>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">头部</td>\n                  <td id=\"equipment-head\"></td>\n                  <td style=\"width: 60px;\"><button id=\"equipmentButton-head\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">身体</td>\n                  <td id=\"equipment-body\"></td>\n                  <td><button id=\"equipmentButton-body\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">足部</td>\n                  <td id=\"equipment-feet\"></td>\n                  <td><button id=\"equipmentButton-feet\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">武器</td>\n                  <td id=\"equipment-weapon\"></td>\n                  <td><button id=\"equipmentButton-weapon\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">项链</td>\n                  <td id=\"equipment-neck\"></td>\n                  <td><button id=\"equipmentButton-neck\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">戒指</td>\n                  <td id=\"equipment-ring\"></td>\n                  <td><button id=\"equipmentButton-ring\" class=\"brownButton\">卸下</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ";

  win.css = "\n\n    #statusWindowEquipmentTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #heroName {\n      font-size: 24px;\n      margin-left: 240px;\n    }\n\n    #statusWindowTable {\n      width: 50%;\n    }\n\n    #statusWindowTable label {\n      font-size: 18px;\n      margin-left: 80px;\n    }\n\n    #statusWindowEquipmentTable button {\n      width: 60px;\n      height: 40px;\n    }\n\n    .statusWindowEquipmentText {\n      width: 60px;\n      font-size: 20px;\n      text-align: center;\n    }\n\n    .statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n      text-align: center;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    .statusWindow table {\n      width: 100%;\n      height: 320px;\n    }\n  ";

  var statusWindowEquipment = {
    head: win.querySelector("#equipment-head"),
    body: win.querySelector("#equipment-body"),
    feet: win.querySelector("#equipment-feet"),
    weapon: win.querySelector("#equipment-weapon"),
    neck: win.querySelector("#equipment-neck"),
    ring: win.querySelector("#equipment-ring")
  };

  var statusWindowEquipmentButton = {
    head: win.querySelector("#equipmentButton-head"),
    body: win.querySelector("#equipmentButton-body"),
    feet: win.querySelector("#equipmentButton-feet"),
    weapon: win.querySelector("#equipmentButton-weapon"),
    neck: win.querySelector("#equipmentButton-neck"),
    ring: win.querySelector("#equipmentButton-ring")
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

  var heroName = win.querySelector("#heroName");
  var heroHP = win.querySelector("#heroHP");
  var heroSP = win.querySelector("#heroSP");
  var heroLevel = win.querySelector("#heroLevel");
  var heroEXP = win.querySelector("#heroEXP");
  var heroSTR = win.querySelector("#heroSTR");
  var heroDEX = win.querySelector("#heroDEX");
  var heroCON = win.querySelector("#heroCON");
  var heroINT = win.querySelector("#heroINT");
  var heroCHA = win.querySelector("#heroCHA");
  var heroATK = win.querySelector("#heroATK");
  var heroDEF = win.querySelector("#heroDEF");
  var heroMATK = win.querySelector("#heroMATK");
  var heroMDEF = win.querySelector("#heroMDEF");

  var statusWindowClose = win.querySelector("button#statusWindowClose");
  var statusWindowInventory = win.querySelector("button#statusWindowInventory");
  var statusWindowEquipmentTable = win.querySelector("#statusWindowEquipmentTable");

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
    for (var i = 0, len = lines.length; i < len; i++) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5FLEtBQUcsQ0FBQyxJQUFJLDB1RkErRFAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxpaENBMEROLENBQUM7O0FBRUYsTUFBSSxxQkFBcUIsR0FBRztBQUMxQixRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxVQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztBQUM5QyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztHQUMzQyxDQUFDOztBQUVGLE1BQUksMkJBQTJCLEdBQUc7QUFDaEMsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsVUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUM7QUFDcEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFB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LEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93U3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zdGF0dXMgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzdGF0dXNXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgaWQ9XCJzdGF0dXNXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzdGF0dXNXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1dpbmRvd0ludmVudG9yeVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7nianlk4E8L2J1dHRvbj5cbiAgICAgICAgPGxhYmVsIGlkPVwiaGVyb05hbWVcIj48L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8dGFibGUgYm9yZGVyPVwiMFwiPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIGlkPVwic3RhdHVzV2luZG93VGFibGVcIj5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9IUFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvU1BcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0xldmVsXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9FWFBcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb1NUUlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvREVYXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9DT05cIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0lOVFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvQ0hBXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9BVEtcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0RFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTUFUS1wiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTURFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNTAlO1wiPlxuICAgICAgICAgICAgPHRhYmxlIGlkPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGFibGVcIiBib3JkZXI9XCIwXCI+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+5aS06YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1oZWFkXCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24taGVhZFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPui6q+S9kzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtYm9keVwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1ib2R5XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+6Laz6YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1mZWV0XCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIGlkPVwiZXF1aXBtZW50QnV0dG9uLWZlZXRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7mrablmag8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LXdlYXBvblwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi13ZWFwb25cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7pobnpk748L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LW5lY2tcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24tbmVja1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPuaIkuaMhzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtcmluZ1wiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1yaW5nXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcblxuICAgICNzdGF0dXNXaW5kb3dFcXVpcG1lbnRUYWJsZSB0cjpudGgtY2hpbGQob2RkKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE5MiwgMTkyLCAxOTIsIDAuNik7XG4gICAgfVxuXG4gICAgI2hlcm9OYW1lIHtcbiAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAyNDBweDtcbiAgICB9XG5cbiAgICAjc3RhdHVzV2luZG93VGFibGUge1xuICAgICAgd2lkdGg6IDUwJTtcbiAgICB9XG5cbiAgICAjc3RhdHVzV2luZG93VGFibGUgbGFiZWwge1xuICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDgwcHg7XG4gICAgfVxuXG4gICAgI3N0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICB9XG5cbiAgICAuc3RhdHVzV2luZG93RXF1aXBtZW50VGV4dCB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuc3RhdHVzV2luZG93IGxhYmVsIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dJdGVtQmFyIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjc3RhdHVzV2luZG93Q2xvc2Uge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dJbnZlbnRvcnkge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgIC5zdGF0dXNXaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDMyMHB4O1xuICAgIH1cbiAgYDtcblxuICBsZXQgc3RhdHVzV2luZG93RXF1aXBtZW50ID0ge1xuICAgIGhlYWQ6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1oZWFkXCIpLFxuICAgIGJvZHk6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1ib2R5XCIpLFxuICAgIGZlZXQ6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1mZWV0XCIpLFxuICAgIHdlYXBvbjogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LXdlYXBvblwiKSxcbiAgICBuZWNrOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnQtbmVja1wiKSxcbiAgICByaW5nOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnQtcmluZ1wiKVxuICB9O1xuXG4gIGxldCBzdGF0dXNXaW5kb3dFcXVpcG1lbnRCdXR0b24gPSB7XG4gICAgaGVhZDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLWhlYWRcIiksXG4gICAgYm9keTogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLWJvZHlcIiksXG4gICAgZmVldDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLWZlZXRcIiksXG4gICAgd2VhcG9uOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24td2VhcG9uXCIpLFxuICAgIG5lY2s6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudEJ1dHRvbi1uZWNrXCIpLFxuICAgIHJpbmc6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudEJ1dHRvbi1yaW5nXCIpXG4gIH07XG5cbiAgbGV0IGxhc3RTZWxlY3QgPSAtMTtcblxuICBTcHJpdGUuZWFjaChzdGF0dXNXaW5kb3dFcXVpcG1lbnRCdXR0b24sIGZ1bmN0aW9uIChidXR0b24sIGtleSkge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudFtrZXldKSB7XG4gICAgICAgIEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudFtrZXldID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChrZXkgPT0gXCJ3ZWFwb25cIikge1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbihcInN3b3JkfHNwZWFyfGJvd1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBHYW1lLndpbmRvd3MuaW52ZW50b3J5Lm9wZW4oXCJoZWFkfGJvZHl8ZmVldFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd2luLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBsZXQgaGVyb05hbWUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvTmFtZVwiKTtcbiAgbGV0IGhlcm9IUCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9IUFwiKVxuICBsZXQgaGVyb1NQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb1NQXCIpO1xuICBsZXQgaGVyb0xldmVsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0xldmVsXCIpO1xuICBsZXQgaGVyb0VYUCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9FWFBcIik7XG4gIGxldCBoZXJvU1RSID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb1NUUlwiKTtcbiAgbGV0IGhlcm9ERVggPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvREVYXCIpO1xuICBsZXQgaGVyb0NPTiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9DT05cIik7XG4gIGxldCBoZXJvSU5UID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0lOVFwiKTtcbiAgbGV0IGhlcm9DSEEgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvQ0hBXCIpO1xuICBsZXQgaGVyb0FUSyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9BVEtcIik7XG4gIGxldCBoZXJvREVGID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0RFRlwiKTtcbiAgbGV0IGhlcm9NQVRLID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb01BVEtcIik7XG4gIGxldCBoZXJvTURFRiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9NREVGXCIpO1xuXG4gIGxldCBzdGF0dXNXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N0YXR1c1dpbmRvd0Nsb3NlXCIpO1xuICBsZXQgc3RhdHVzV2luZG93SW52ZW50b3J5ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3RhdHVzV2luZG93SW52ZW50b3J5XCIpO1xuICBsZXQgc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzdGF0dXNXaW5kb3dFcXVpcG1lbnRUYWJsZVwiKTtcblxuICBzdGF0dXNXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgc3RhdHVzV2luZG93SW52ZW50b3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbigpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInRhYlwiXSwgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbigpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgfSwgMjApXG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJ1cGRhdGVcIiwgZnVuY3Rpb24gKHNlbGVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3QgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZWN0ID0gLTE7XG4gICAgfVxuXG4gICAgbGFzdFNlbGVjdCA9IHNlbGVjdDtcblxuICAgIGhlcm9OYW1lLnRleHRDb250ZW50ID0gYOWQjeWtl++8miR7R2FtZS5oZXJvLmRhdGEubmFtZX1gO1xuICAgIGhlcm9IUC50ZXh0Q29udGVudCA9IGDnlJ/lkb3lipvvvJoke0dhbWUuaGVyby5kYXRhLmhwfS8ke0dhbWUuaGVyby5kYXRhLiRocH1gO1xuICAgIGhlcm9TUC50ZXh0Q29udGVudCA9IGDnsr7npZ7lipvvvJoke0dhbWUuaGVyby5kYXRhLnNwfS8ke0dhbWUuaGVyby5kYXRhLiRzcH1gO1xuICAgIGhlcm9MZXZlbC50ZXh0Q29udGVudCA9IGDnrYnnuqfvvJoke0dhbWUuaGVyby5kYXRhLmxldmVsfWA7XG4gICAgaGVyb0VYUC50ZXh0Q29udGVudCA9IGDnu4/pqozvvJoke0dhbWUuaGVyby5kYXRhLmV4cH1gO1xuICAgIGhlcm9TVFIudGV4dENvbnRlbnQgPSBg5Yqb6YeP77yaJHtHYW1lLmhlcm8uZGF0YS5zdHJ9YDtcbiAgICBoZXJvREVYLnRleHRDb250ZW50ID0gYOaVj+aNt++8miR7R2FtZS5oZXJvLmRhdGEuZGV4fWA7XG4gICAgaGVyb0NPTi50ZXh0Q29udGVudCA9IGDogJDlipvvvJoke0dhbWUuaGVyby5kYXRhLmNvbn1gO1xuICAgIGhlcm9JTlQudGV4dENvbnRlbnQgPSBg5pm65Yqb77yaJHtHYW1lLmhlcm8uZGF0YS5pbnR9YDtcbiAgICBoZXJvQ0hBLnRleHRDb250ZW50ID0gYOmtheWKm++8miR7R2FtZS5oZXJvLmRhdGEuY2hhfWA7XG4gICAgaGVyb0FUSy50ZXh0Q29udGVudCA9IGDmlLvlh7vvvJoke0dhbWUuaGVyby5kYXRhLmF0a31gO1xuICAgIGhlcm9ERUYudGV4dENvbnRlbnQgPSBg6Ziy5b6h77yaJHtHYW1lLmhlcm8uZGF0YS5kZWZ9YDtcbiAgICBoZXJvTUFUSy50ZXh0Q29udGVudCA9IGDprZTms5XmlLvlh7vvvJoke0dhbWUuaGVyby5kYXRhLm1hdGt9YDtcbiAgICBoZXJvTURFRi50ZXh0Q29udGVudCA9IGDprZTms5XpmLLlvqHvvJoke0dhbWUuaGVyby5kYXRhLm1kZWZ9YDtcblxuICAgIGxldCBsaW5lcyA9IHN0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChzZWxlY3QgPT0gaSkge1xuICAgICAgICBsaW5lc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZWVuXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNwcml0ZS5lYWNoKEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudCwgZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xuICAgICAgbGV0IGJ1dHRvbiA9IHN0YXR1c1dpbmRvd0VxdWlwbWVudEJ1dHRvbltrZXldO1xuXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBsZXQgbGluZSA9IFwiXCI7XG4gICAgICAgIGxpbmUgKz0gYDxpbWcgYWx0PVwiXCIgc3JjPVwiJHtHYW1lLml0ZW1zW2VsZW1lbnRdLmljb24uc3JjfVwiPmA7XG4gICAgICAgIGxpbmUgKz0gYDxzcGFuPiR7R2FtZS5pdGVtc1tlbGVtZW50XS5kYXRhLm5hbWV9PC9zcGFuPmA7XG4gICAgICAgIHN0YXR1c1dpbmRvd0VxdWlwbWVudFtrZXldLmlubmVySFRNTCA9IGxpbmU7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwi5Y245LiLXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXNXaW5kb3dFcXVpcG1lbnRba2V5XS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIuijheWkh1wiO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBzdGF0dXNXaW5kb3dFcXVpcG1lbnRUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGlmIChsYXN0U2VsZWN0ID49IDAgJiYgbGFzdFNlbGVjdCA8IGJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBidXR0b25zW2xhc3RTZWxlY3RdLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInVwXCIsIFwiZG93blwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBjb3VudCA9IHN0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIikubGVuZ3RoO1xuXG4gICAgaWYgKGxhc3RTZWxlY3QgPT0gLTEpIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgd2luLm9wZW4oMCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgd2luLm9wZW4oY291bnQgLSAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCArIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPj0gY291bnQpIHtcbiAgICAgICAgICBzZWxlY3QgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKHNlbGVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgLSAxO1xuICAgICAgICBpZiAoc2VsZWN0IDwgMCkge1xuICAgICAgICAgIHNlbGVjdCA9IGNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihzZWxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKHNlbGVjdCkge1xuICAgIHdpbi51cGRhdGUoc2VsZWN0KTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuXG59KSgpO1xuIl19
