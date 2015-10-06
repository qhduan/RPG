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

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"statusWindowInventory\" class=\"brownButton\">物品</button>\n        <label id=\"heroName\"></label>\n      </div>\n      <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tr>\n          <td id=\"statusWindowTable\">\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td style=\"width: 50%;\">\n            <table id=\"statusWindowEquipmentTable\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n              <tbody>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">头部</td>\n                  <td id=\"equipment-head\"></td>\n                  <td style=\"width: 60px;\"><button id=\"equipmentButton-head\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">身体</td>\n                  <td id=\"equipment-body\"></td>\n                  <td><button id=\"equipmentButton-body\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">足部</td>\n                  <td id=\"equipment-feet\"></td>\n                  <td><button id=\"equipmentButton-feet\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">武器</td>\n                  <td id=\"equipment-weapon\"></td>\n                  <td><button id=\"equipmentButton-weapon\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">项链</td>\n                  <td id=\"equipment-neck\"></td>\n                  <td><button id=\"equipmentButton-neck\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">戒指</td>\n                  <td id=\"equipment-ring\"></td>\n                  <td><button id=\"equipmentButton-ring\" class=\"brownButton\">卸下</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ";

  win.css = "\n    #heroName {\n      font-size: 24px;\n      margin-left: 240px;\n    }\n\n    #statusWindowTable {\n      width: 50%;\n    }\n\n    #statusWindowTable label {\n      font-size: 18px;\n      margin-left: 80px;\n    }\n\n    #statusWindowEquipmentTable button {\n      width: 60px;\n      height: 40px;\n    }\n\n    .statusWindowEquipmentText {\n      width: 60px;\n      font-size: 20px;\n      text-align: center;\n    }\n\n    .statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n      text-align: center;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    .statusWindow table {\n      width: 100%;\n      height: 320px;\n    }\n  ";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5FLEtBQUcsQ0FBQyxJQUFJLGt6RkErRFAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyw4NUJBcUROLENBQUM7O0FBRUYsTUFBSSxxQkFBcUIsR0FBRztBQUMxQixRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxVQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztBQUM5QyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztHQUMzQyxDQUFDOztBQUVGLE1BQUksMkJBQTJCLEdBQUc7QUFDaEMsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsVUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUM7QUFDcEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFB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LEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93U3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zdGF0dXMgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzdGF0dXNXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgaWQ9XCJzdGF0dXNXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzdGF0dXNXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1dpbmRvd0ludmVudG9yeVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7nianlk4E8L2J1dHRvbj5cbiAgICAgICAgPGxhYmVsIGlkPVwiaGVyb05hbWVcIj48L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8dGFibGUgYm9yZGVyPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGNlbGxwYWRkaW5nPVwiMFwiPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIGlkPVwic3RhdHVzV2luZG93VGFibGVcIj5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9IUFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvU1BcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0xldmVsXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9FWFBcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb1NUUlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvREVYXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9DT05cIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0lOVFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvQ0hBXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9BVEtcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0RFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTUFUS1wiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTURFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNTAlO1wiPlxuICAgICAgICAgICAgPHRhYmxlIGlkPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGFibGVcIiBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCI+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+5aS06YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1oZWFkXCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24taGVhZFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPui6q+S9kzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtYm9keVwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1ib2R5XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+6Laz6YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1mZWV0XCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIGlkPVwiZXF1aXBtZW50QnV0dG9uLWZlZXRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7mrablmag8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LXdlYXBvblwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi13ZWFwb25cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7pobnpk748L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LW5lY2tcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24tbmVja1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPuaIkuaMhzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtcmluZ1wiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1yaW5nXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAjaGVyb05hbWUge1xuICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDI0MHB4O1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dUYWJsZSB7XG4gICAgICB3aWR0aDogNTAlO1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dUYWJsZSBsYWJlbCB7XG4gICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICBtYXJnaW4tbGVmdDogODBweDtcbiAgICB9XG5cbiAgICAjc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgIH1cblxuICAgIC5zdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0IHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIC5zdGF0dXNXaW5kb3cgbGFiZWwge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuXG4gICAgI3N0YXR1c1dpbmRvd0l0ZW1CYXIgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICAgICAgbWFyZ2luLXRvcDogMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dDbG9zZSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuXG4gICAgI3N0YXR1c1dpbmRvd0ludmVudG9yeSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuXG4gICAgLnN0YXR1c1dpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMzIwcHg7XG4gICAgfVxuICBgO1xuXG4gIGxldCBzdGF0dXNXaW5kb3dFcXVpcG1lbnQgPSB7XG4gICAgaGVhZDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWhlYWRcIiksXG4gICAgYm9keTogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWJvZHlcIiksXG4gICAgZmVldDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWZlZXRcIiksXG4gICAgd2VhcG9uOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnQtd2VhcG9uXCIpLFxuICAgIG5lY2s6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1uZWNrXCIpLFxuICAgIHJpbmc6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1yaW5nXCIpXG4gIH07XG5cbiAgbGV0IHN0YXR1c1dpbmRvd0VxdWlwbWVudEJ1dHRvbiA9IHtcbiAgICBoZWFkOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24taGVhZFwiKSxcbiAgICBib2R5OiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24tYm9keVwiKSxcbiAgICBmZWV0OiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24tZmVldFwiKSxcbiAgICB3ZWFwb246IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudEJ1dHRvbi13ZWFwb25cIiksXG4gICAgbmVjazogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLW5lY2tcIiksXG4gICAgcmluZzogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLXJpbmdcIilcbiAgfTtcblxuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIFNwcml0ZS5lYWNoKHN0YXR1c1dpbmRvd0VxdWlwbWVudEJ1dHRvbiwgZnVuY3Rpb24gKGJ1dHRvbiwga2V5KSB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2tleV0pIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2tleV0gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PSBcIndlYXBvblwiKSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKFwic3dvcmR8c3BlYXJ8Ym93XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbihcImhlYWR8Ym9keXxmZWV0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aW4udXBkYXRlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGxldCBoZXJvTmFtZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9OYW1lXCIpO1xuICBsZXQgaGVyb0hQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0hQXCIpXG4gIGxldCBoZXJvU1AgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvU1BcIik7XG4gIGxldCBoZXJvTGV2ZWwgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvTGV2ZWxcIik7XG4gIGxldCBoZXJvRVhQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0VYUFwiKTtcbiAgbGV0IGhlcm9TVFIgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvU1RSXCIpO1xuICBsZXQgaGVyb0RFWCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9ERVhcIik7XG4gIGxldCBoZXJvQ09OID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0NPTlwiKTtcbiAgbGV0IGhlcm9JTlQgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvSU5UXCIpO1xuICBsZXQgaGVyb0NIQSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9DSEFcIik7XG4gIGxldCBoZXJvQVRLID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0FUS1wiKTtcbiAgbGV0IGhlcm9ERUYgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvREVGXCIpO1xuICBsZXQgaGVyb01BVEsgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvTUFUS1wiKTtcbiAgbGV0IGhlcm9NREVGID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb01ERUZcIik7XG5cbiAgbGV0IHN0YXR1c1dpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3RhdHVzV2luZG93Q2xvc2VcIik7XG4gIGxldCBzdGF0dXNXaW5kb3dJbnZlbnRvcnkgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzdGF0dXNXaW5kb3dJbnZlbnRvcnlcIik7XG4gIGxldCBzdGF0dXNXaW5kb3dFcXVpcG1lbnRUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3N0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlXCIpO1xuXG4gIHN0YXR1c1dpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICBzdGF0dXNXaW5kb3dJbnZlbnRvcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widGFiXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW4uaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMClcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcInVwZGF0ZVwiLCBmdW5jdGlvbiAoc2VsZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxlY3QgPSAtMTtcbiAgICB9XG5cbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgaGVyb05hbWUudGV4dENvbnRlbnQgPSBg5ZCN5a2X77yaJHtHYW1lLmhlcm8uZGF0YS5uYW1lfWA7XG4gICAgaGVyb0hQLnRleHRDb250ZW50ID0gYOeUn+WRveWKm++8miR7R2FtZS5oZXJvLmRhdGEuaHB9LyR7R2FtZS5oZXJvLmRhdGEuJGhwfWA7XG4gICAgaGVyb1NQLnRleHRDb250ZW50ID0gYOeyvuelnuWKm++8miR7R2FtZS5oZXJvLmRhdGEuc3B9LyR7R2FtZS5oZXJvLmRhdGEuJHNwfWA7XG4gICAgaGVyb0xldmVsLnRleHRDb250ZW50ID0gYOetiee6p++8miR7R2FtZS5oZXJvLmRhdGEubGV2ZWx9YDtcbiAgICBoZXJvRVhQLnRleHRDb250ZW50ID0gYOe7j+mqjO+8miR7R2FtZS5oZXJvLmRhdGEuZXhwfWA7XG4gICAgaGVyb1NUUi50ZXh0Q29udGVudCA9IGDlipvph4/vvJoke0dhbWUuaGVyby5kYXRhLnN0cn1gO1xuICAgIGhlcm9ERVgudGV4dENvbnRlbnQgPSBg5pWP5o2377yaJHtHYW1lLmhlcm8uZGF0YS5kZXh9YDtcbiAgICBoZXJvQ09OLnRleHRDb250ZW50ID0gYOiAkOWKm++8miR7R2FtZS5oZXJvLmRhdGEuY29ufWA7XG4gICAgaGVyb0lOVC50ZXh0Q29udGVudCA9IGDmmbrlipvvvJoke0dhbWUuaGVyby5kYXRhLmludH1gO1xuICAgIGhlcm9DSEEudGV4dENvbnRlbnQgPSBg6a2F5Yqb77yaJHtHYW1lLmhlcm8uZGF0YS5jaGF9YDtcbiAgICBoZXJvQVRLLnRleHRDb250ZW50ID0gYOaUu+WHu++8miR7R2FtZS5oZXJvLmRhdGEuYXRrfWA7XG4gICAgaGVyb0RFRi50ZXh0Q29udGVudCA9IGDpmLLlvqHvvJoke0dhbWUuaGVyby5kYXRhLmRlZn1gO1xuICAgIGhlcm9NQVRLLnRleHRDb250ZW50ID0gYOmtlOazleaUu+WHu++8miR7R2FtZS5oZXJvLmRhdGEubWF0a31gO1xuICAgIGhlcm9NREVGLnRleHRDb250ZW50ID0gYOmtlOazlemYsuW+oe+8miR7R2FtZS5oZXJvLmRhdGEubWRlZn1gO1xuXG4gICAgbGV0IGxpbmVzID0gc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHNlbGVjdCA9PSBpKSB7XG4gICAgICAgIGxpbmVzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmVzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgU3ByaXRlLmVhY2goR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LCBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XG4gICAgICBsZXQgYnV0dG9uID0gc3RhdHVzV2luZG93RXF1aXBtZW50QnV0dG9uW2tleV07XG5cbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGxldCBsaW5lID0gXCJcIjtcbiAgICAgICAgbGluZSArPSBgPGltZyBhbHQ9XCJcIiBzcmM9XCIke0dhbWUuaXRlbXNbZWxlbWVudF0uaWNvbi5zcmN9XCI+YDtcbiAgICAgICAgbGluZSArPSBgPHNwYW4+JHtHYW1lLml0ZW1zW2VsZW1lbnRdLmRhdGEubmFtZX08L3NwYW4+YDtcbiAgICAgICAgc3RhdHVzV2luZG93RXF1aXBtZW50W2tleV0uaW5uZXJIVE1MID0gbGluZTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCLljbjkuItcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1c1dpbmRvd0VxdWlwbWVudFtrZXldLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwi6KOF5aSHXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZW50ZXJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IHN0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKS5sZW5ndGg7XG5cbiAgICBpZiAobGFzdFNlbGVjdCA9PSAtMSkge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICB3aW4ub3BlbigwKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICB3aW4ub3Blbihjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4oc2VsZWN0KTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCAtIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPCAwKSB7XG4gICAgICAgICAgc2VsZWN0ID0gY291bnQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKHNlbGVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB3aW4uYXNzaWduKFwib3BlblwiLCBmdW5jdGlvbiAoc2VsZWN0KSB7XG4gICAgd2luLnVwZGF0ZShzZWxlY3QpO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
