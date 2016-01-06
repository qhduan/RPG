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

import Game     from "../Base.js";
import Window   from "../Window.js";
import Confirm  from "../Component/Confirm.js";
import Choice   from  "../Component/Choice.js";
import Dialogue from  "../Component/Dialogue.js";
import html     from "../HTML/Skill.html";
import "../CSS/Skill.scss";

let win = Window.create("skillWindow", html);
let WindowSkill = win;
export default WindowSkill;

let Close = win.querySelector("button#Close");
let Tbody = win.querySelector("tbody#Table");
let ClearShortcut = win.querySelector("button#ClearShortcut");
let ClearShortcutAll = win.querySelector("button#ClearShortcutAll");

let lastSelect = -1;

Close.addEventListener("click", (event) => {
  win.hide();
});

ClearShortcut.addEventListener("click", (event) => {
  Choice({1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 7:6, 8:7}).then((choice) => {
    if (Number.isFinite(choice)) {
      Game.hero.data.bar[choice] = null;
      Game.windows.interface.refresh();
    }
  });
});

ClearShortcutAll.addEventListener("click", (event) => {
  Confirm("确定要删除所有快捷栏图表吗？").then(() => {
    for (let i = 0; i < 8; i++) {
      Game.hero.data.bar[i] = null;
    }
    Game.windows.interface.refresh();
  }).catch(() => {
    // no
  });
});

win.whenUp(["esc"], (key) => {
  setTimeout( () => {
    win.hide();
  }, 20);
});

win.assign("open", (select) => {

  if (typeof select == "undefined") {
    select = -1;
  }

  lastSelect = select;

  let index = 0;
  let table = "";
  Game.hero.data.skills.forEach((skillId) => {
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
    line += `  <td><button data-id="${skillId}" class="brownButton skillWindowManage">管理</button></td>\n`;
    line += "</tr>\n";
    table += line;
    index++;
  });

  Tbody.innerHTML = table;
  Game.windows.skill.show();
});

win.whenUp(["enter"], () => {
  let buttons = win.querySelectorAll(".skillWindowManage");
  if (lastSelect >= 0 && lastSelect < buttons.length) {
    buttons[lastSelect].click();
  }
});

win.whenUp(["up", "down"], (key) => {
  let count = win.querySelectorAll(".skillWindowManage").length;

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

Tbody.addEventListener("click", (event) => {
  const skillId = event.target.getAttribute("data-id");
  const index = Game.hero.data.skills.indexOf(skillId);
  if (skillId && Game.skills.hasOwnProperty(skillId) && index != -1) {

    let skill = Game.skills[skillId];

    let options = {};

    options["快捷栏"] = "shortcut";
    options["遗忘"] = "remove";
    if (skill.data.next) {
      options["升级"] = "levelup";
    }

    Choice(options).then((choice) => {
      switch(choice) {
        case "shortcut":
          Choice({
            1:0,
            2:1,
            3:2,
            4:3,
            5:4,
            6:5,
            7:6,
            8:7
          }).then((choice) => {
            if (Number.isFinite(choice) && choice >= 0) {
              Game.hero.data.bar[choice] = {
                id: skillId,
                type: "skill"
              };
              Game.windows.interface.refresh();
            }
          });
          break;
        case "levelup":
          if (skill.data.next) {
            let cannot = [];
            if (Game.hero.data.gold < skill.data.next.gold) {
              cannot.push(`金币不足，需要金币${skill.data.next.gold}，当前您有金币${Game.hero.data.gold}`);
            }
            if (Game.hero.data.exp < skill.data.next.exp) {
              cannot.push(`经验不足，需要经验${skill.data.next.exp}，当前您有经验${Game.hero.data.exp}`);
            }
            if (cannot.length) {
              Dialogue(cannot);
              return;
            }
            Confirm(`确定要升级这个技能吗？共需要金币${skill.data.next.gold}，经验${skill.data.next.exp}`).then(() => {
              let nextId = skill.data.next.id;
              Game.hero.data.skills.splice(index, 1);
              Game.hero.data.skills.push(nextId);
              Game.hero.data.gold -= skill.data.next.gold;
              Game.hero.data.exp -= skill.data.next.exp;
              Game.windows.loading.begin();
              Game.Skill.load(nextId).then( (skillObj) => {
                Game.windows.loading.end();
                win.open();
              });
            }).catch(() => {
              // no
            });
          }
          break;
        case "remove":
          Confirm(`真的要遗忘 ${skill.data.name} 技能吗？`).then(() => {
            Game.hero.data.bar.forEach((element, index, array) => {
              if (element && element.id == skillId) {
                array[index] = null;
              }
            });
            Game.hero.data.skills.splice(index, 1);
            Game.windows.interface.refresh();
            win.open();
          }).catch(() => {
            // no
          });
          break;
      }
    });

  }
});
