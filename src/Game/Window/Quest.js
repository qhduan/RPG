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

import Game   from "../Base.js";
import Window from "../Window.js";
import html   from "../HTML/Quest.html";
import "../CSS/Quest.scss";

let win = Window.create("questWindow", html);
let WindowQuest = win;
export default WindowQuest;

let questWindowClose = win.querySelector("#questWindowClose");
let questWindowCurrent = win.querySelector("#questWindowCurrent");
let questWindowPast = win.querySelector("#questWindowPast");
let questWindowTable = win.querySelector("#questWindowTable");


questWindowClose.addEventListener("click", () => {
  win.hide();
});

win.whenUp(["esc"], (key) => {
  setTimeout( () => {
    questWindowClose.click();
  }, 20);
});

questWindowCurrent.addEventListener("click", () => {
  win.hide();
  win.current();
});

questWindowPast.addEventListener("click", () => {
  win.hide();
  win.past();
});

win.assign("current", () => {

  questWindowCurrent.disabled = true;
  questWindowPast.disabled = false;

  let table = "";
  let list = Game.hero.data.currentQuest;
  list.forEach( quest => {

    let complete = Game.Quest.isComplete(quest);

    let line = `<div class="questWindowItem">\n`;
    line += `  <label style="font-size: 20px; margin: 10px;">${quest.name}${complete?"[已完成]":"[未完成]"}</label>\n`;
    line += `  <div style="margin: 10px;">简介：${quest.description}</div>\n`;

    if (quest.reward) {
      line += `  <div style="margin: 10px;">任务奖励：`;
      if (quest.reward.gold) {
        line += `<label style="margin-right: 20px;">金币：${quest.reward.gold}</label>`;
      }
      if (quest.reward.exp) {
        line += `<label style="margin-right: 20px;">经验：${quest.reward.exp}</label>`;
      }
      line += `  </div>`;
    }

    if (quest.target && quest.target.kill == "kill") {
      for (let k of quest.target.kill) {
        line += `<div style="margin: 10px;">${k.name}：${k.current} / ${k.need}</div>`;
      }
    }

    line += `  <label style="margin: 10px;">给予人：${quest.fromMap} 的 ${quest.fromName}</label>\n`;
    line += `  <label style="margin: 10px;">交付人：${quest.toMap} 的 ${quest.toName}</label>\n`;
    line += "</div>\n";
    table += line;
  });

  if (table.length <= 0) {
    table = "<div><label>没有正在进行的任务</label></div>";
  }

  questWindowTable.innerHTML = table;
  win.show();
});

win.assign("past", () => {

  questWindowCurrent.disabled = false;
  questWindowPast.disabled = true;

  let table = "";
  let list = Game.hero.data.completeQuest;
  list.forEach( quest => {

    let line = `<div class="questWindowItem">\n`;
    line += `  <label style="font-size: 20px; margin: 10px;">${quest.name}[已完成]</label>\n`;
    line += `  <div style="margin: 10px;">简介：${quest.description}</div>\n`;

    if (quest.reward) {
      line += `  <div style="margin: 10px;">任务奖励：`;
      if (quest.reward.gold) {
        line += `<label style="margin-right: 20px;">金币：${quest.reward.gold}</label>`;
      }
      if (quest.reward.exp) {
        line += `<label style="margin-right: 20px;">经验：${quest.reward.exp}</label>`;
      }
      line += `  </div>`;
    }

    if (quest.target && quest.target.type == "kill") {
      for (let k of quest.target.kill) {
        line += `<div style="margin: 10px;">${k.name}：${k.current} / ${k.need}</div>`;
      }
    }

    line += `  <label style="margin: 10px;">给予人：${quest.fromMap} 的 ${quest.fromName}</label>\n`;
    line += `  <label style="margin: 10px;">交付人：${quest.toMap} 的 ${quest.toName}</label>\n`;
    line += "</div>\n";
    table += line;
  });

  if (table.length <= 0) {
    table = "<div><label>没有已完成任务</label></div>";
  }

  questWindowTable.innerHTML = table;
  win.show();
});
