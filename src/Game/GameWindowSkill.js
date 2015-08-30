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

  var win = Game.windows.skill = new Game.Window("skillWindow");

  win.html(`
    <div class="window-box">
      <div id="skillWindowItemBar">
        <button id="skillWindowClose" class="brownButton">关闭</button>
      </div>
      <table border="1" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <td style="width: 40px;"></td>
            <td style="width: 120px;"></td>
            <td></td>
            <td style="width: 60px;"></td>
          </tr>
        </thead>
        <tbody id="skillWindowTable"></tbody>
      </table>
    </div>
  `);

  win.css(`
    #skillWindow table {
      width: 100%;
    }

    #skillWindow table img {
      width: 100%;
      height: 100%;
    }

    #skillWindow button {
      width: 60px;
      height: 40px;
      font-size: 16px;
    }

    #skillWindowItemBar button {
      width: 60px;
      height: 40px;
      font-size: 16px;
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 0px;
      margin-bottom: 5px;
    }

    #skillWindowClose {
      float: right;
    }
  `);

  var skillWindowClose = document.querySelector("button#skillWindowClose");

  skillWindowClose.addEventListener("click", function (event) {
    Game.windows.skill.hide();
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.skill.showing()) {
      skillWindowClose.click();
    }
  });

  win.register("open", function () {
    var tableBody = document.querySelector("tbody#skillWindowTable");
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
          var skill = Game.skills[skillId];
          icon.appendChild(skill.icon);
          name.textContent = skill.data.name;
          description.textContent = skill.data.description;

          var manageButton = document.createElement("button");
          manageButton.textContent = "操作";
          manage.appendChild(manageButton);

          manageButton.classList.add("brownButton");

          manageButton.addEventListener("click", function () {
            Game.choice({
              "快捷栏": "shortcut",
              "升级": "levelup",
              "遗忘": "remove"
            }, function (choice) {
              switch(choice) {
                case "shortcut":
                  Game.choice({
                    1:0,
                    2:1,
                    3:2,
                    4:3,
                    5:4,
                    6:5,
                    7:6,
                    8:7
                  }, function (choice) {
                    if (typeof choice == "number" && choice >= 0) {
                      Game.hero.data.bar[choice] = {
                        id: skillId,
                        type: "skill"
                      };
                      Game.windows.interface.execute("refresh");
                    }
                  });
                  break;
                case "levelup":
                  if (skill.data.next && skill.data.exp && Game.hero.data.exp > skill.data.exp) {
                    // level up
                  }
                  break;
                case "remove":
                  Game.confirm(`真的要遗忘 ${skill.data.name} 技能吗？`, function (yes) {
                    if (yes) {
                      Game.hero.data.bar.forEach(function (element, index, array) {
                        if (element && element.id == skillId) {
                          array[index] = null;
                        }
                      });
                      Game.hero.data.skills.splice(index, 1);
                      Game.windows.interface.execute("refresh");
                      Game.windows.skill.execute("open");
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

    Game.windows.skill.show();
  });

}());
