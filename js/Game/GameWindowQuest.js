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

  var win = Game.windows.quest = Game.Window.create("questWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"questWindowItemBar\">\n        <button id=\"questWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"questWindowCurrent\" class=\"brownButton\">当前任务</button>\n        <button id=\"questWindowPast\" class=\"brownButton\">已完成</button>\n      </div>\n      <div id=\"questWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #questWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .questWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .questWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #questWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      margin-bottom: 5px;\n    }\n\n    #questWindowClose {\n      float: right;\n    }\n  ";

  var questWindowClose = win.querySelector("#questWindowClose");
  var questWindowCurrent = win.querySelector("#questWindowCurrent");
  var questWindowPast = win.querySelector("#questWindowPast");
  var questWindowTable = win.querySelector("#questWindowTable");

  questWindowClose.addEventListener("click", function () {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      questWindowClose.click();
    }, 20);
  });

  questWindowCurrent.addEventListener("click", function () {
    win.hide();
    win.current();
  });

  questWindowPast.addEventListener("click", function () {
    win.hide();
    win.past();
  });

  win.assign("current", function () {

    questWindowCurrent.disabled = true;
    questWindowPast.disabled = false;

    var table = "";
    var list = Game.hero.data.quest.current;
    list.forEach(function (quest) {

      var complete = true;
      if (quest.target.type == "kill") {
        for (var key in quest.target.kill) {
          var t = quest.target.kill[key];
          if (t.current < t.need) {
            complete = false;
          }
        }
      }

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + (complete ? "[已完成]" : "[未完成]") + "</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target.type == "kill") {
        for (var key in quest.target.kill) {
          var t = quest.target.kill[key];
          line += "<div style=\"margin: 10px;\">" + t.name + "：" + t.current + " / " + t.need + "</div>";
        }
      }

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有正在进行的任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  win.assign("past", function () {

    questWindowCurrent.disabled = false;
    questWindowPast.disabled = true;

    var table = "";
    var list = Game.hero.data.quest.past;
    list.forEach(function (quest) {

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + "[已完成]</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target.type == "kill") {
        for (var key in quest.target.kill) {
          var t = quest.target.kill[key];
          line += "<div style=\"margin: 10px;\">" + t.name + "：" + t.current + " / " + t.need + "</div>";
        }
      }

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有已完成任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  questWindowTable.addEventListener("click", function (event) {
    var id = event.target.getAttribute("data-id");
    if (id) {
      if (type == "remove") {
        Game.Archive.remove(id);
        win.open();
      } else if (type == "load") {
        Game.Archive.load(id);
        win.hide();
      }
    }
  });
})();
//# sourceMappingURL=GameWindowQuest.js.map
