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

  let win = Game.Window.create("skill");

  win.html = `
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
  `;

  win.css = `
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
  `;

  let skillWindowClose = document.querySelector("button#skillWindowClose");
  let skillWindowTable = document.querySelector("#skillWindowTable");

  let lastSelect = -1;

  skillWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.register("open", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    let index = 0;
    let table = "";
    Game.hero.data.skills.forEach(function (skillId) {
      let skill = Game.skills[skillId];

      let line = "";

      if (select == index) {
        line += `<tr style="background-color: green;">\n`;
      } else {
        line += `<tr>\n`;
      }

      line += `  <td><img alt="" src="${skill.icon.src}"></td>\n`;
      line += `  <td>${skill.data.name}</td>\n`;
      line += `  <td>${skill.data.description}</td>\n`;
      line += `  <td><button data-id="${skillId}" class="brownButton">管理</button></td>\n`;
      line += "</tr>\n";
      table += line;
      index++;
    });

    skillWindowTable.innerHTML = table;
    Game.windows.skill.show();
  });

  win.whenUp(["enter"], function () {
    let buttons = skillWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    let count = skillWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        let select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        let select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  skillWindowTable.addEventListener("click", function (event) {
    let skillId = event.target.getAttribute("data-id");
    let index = Game.hero.data.skills.indexOf(skillId);
    if (skillId && Game.skills.hasOwnProperty(skillId) && index != -1) {

      let skill = Game.skills[skillId];

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
                Game.windows.interface.refresh();
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
                Game.windows.interface.refresh();
                win.open();
              }
            });
            break;
        }
      });

    }
  });


})();
