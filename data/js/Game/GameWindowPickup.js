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

  var win = Game.Window.create("pickup");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"pickupWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"pickupWindowAll\" class=\"brownButton\">全部(a)</button>\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"pickupWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    #pickupWindow table {\n      width: 100%;\n    }\n\n    #pickupWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #pickupWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16;\n    }\n\n    #pickupWindowClose {\n\n    }\n\n    #pickupWindowAll {\n\n    }\n  ";

  var pickupWindowClose = document.querySelector("button#pickupWindowClose");
  var pickupWindowAll = document.querySelector("button#pickupWindowAll");

  pickupWindowClose.addEventListener("click", function (event) {
    Game.windows.pickup.hide();
  });

  var currentItemObj = null;

  pickupWindowAll.addEventListener("click", function (event) {
    var itemObj = currentItemObj;
    if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
      Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
        if (Game.hero.data.items[itemId]) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
        delete inner[itemId];
      });
      Game.windows.pickup.execute("pickup", itemObj);
    }
  });

  Sprite.Input.whenUp(["a", "A"], function (key) {
    if (Game.windows.pickup.showing) {
      pickupWindowAll.click();
    }
  });

  Sprite.Input.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    if (Game.windows.pickup.showing) {
      var index = parseInt(key) - 1;
      var button = document.querySelector("button#pickupWindowGet-" + index);
      if (button) {
        button.click();
      }
    }
  });

  win.register("pickup", function (itemObj) {
    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {
      for (var key in Game.area.bags) {
        if (Game.area.bags[key] == itemObj) {
          delete Game.area.bags[key];
          itemObj.erase(Game.layers.itemLayer);
        }
      }
      Game.windows.pickup.hide();
      return;
    }

    currentItemObj = itemObj;

    var tableBody = document.getElementById("pickupWindowTable");
    while (tableBody.hasChildNodes()) {
      tableBody.removeChild(tableBody.lastChild);
    }

    var index = 0;

    Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
      var item = Game.items[itemId];

      var line = document.createElement("tr");

      var icon = document.createElement("td");
      line.appendChild(icon);

      var name = document.createElement("td");
      line.appendChild(name);

      var count = document.createElement("td");
      count.style.textAlign = "center";
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

      if (index < 9) {
        pickupButton.textContent = index + 1 + "捡取";
      } else {
        pickupButton.textContent = "捡取";
      }
      pickupButton.id = "pickupWindowGet-" + index;
      index++;

      pickupButton.classList.add("brownButton");

      pickupButton.addEventListener("click", function () {
        if (itemId == "gold") {
          Game.hero.data.gold += itemCount;
        } else {
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId] += itemCount;
          } else {
            Game.hero.data.items[itemId] = itemCount;
          }
        }

        delete inner[itemId];
        Game.windows.pickup.execute("pickup", itemObj);
      });
      pickup.appendChild(pickupButton);

      tableBody.appendChild(line);
    });

    Game.windows.pickup.show();
  });
})();