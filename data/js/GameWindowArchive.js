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

  var win = Game.windows.archive = new Game.Window("archiveWindow");

  win.html("\n    <button onclick=\"Game.windows.main.show()\" class=\"btn\">返回首页</button>\n    <div id=\"archiveTable\" style=\"overflow-y: auto; height: 360px;\"></div>\n  ");

  win.css("\n    #archiveWindow {\n      background-color: white;\n    }\n    .archiveItem {\n      border: 4px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .archiveItem > button {\n      width: 80px;\n      height: 50px;\n      border-radius: 5px;\n    }\n  ");

  win.register("open", function () {

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
        Game.windows.archive.execute("open");
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

    Game.windows.archive.show();
  });
})();
//# sourceMappingURL=GameWindowArchive.js.map
