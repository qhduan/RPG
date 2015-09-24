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
    var list = Game.hero.data.currentQuest;
    list.forEach(function (quest) {

      var complete = Game.Quest.isComplete(quest);

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

      if (quest.target && quest.target.kill == "kill") {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
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
    var list = Game.hero.data.completeQuest;
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

      if (quest.target && quest.target.type == "kill") {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
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
