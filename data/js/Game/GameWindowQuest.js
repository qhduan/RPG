"use strict";

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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dRdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFHYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakUsS0FBRyxDQUFDLElBQUksMFhBU1AsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxnaEJBNkJOLENBQUM7O0FBRUYsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUQsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbEUsTUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVELE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUc5RCxrQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNyRCxPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQ2pDLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLHNCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzFCLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDUixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdkQsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsT0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2YsQ0FBQyxDQUFDOztBQUVILGlCQUFlLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDcEQsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVk7O0FBRWhDLHNCQUFrQixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbkMsbUJBQWUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUVqQyxRQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDdkMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRTs7QUFFNUIsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTVDLFVBQUksSUFBSSxzQ0FBb0MsQ0FBQztBQUM3QyxVQUFJLDJEQUF1RCxLQUFLLENBQUMsSUFBSSxJQUFHLFFBQVEsR0FBQyxPQUFPLEdBQUMsT0FBTyxDQUFBLGVBQVksQ0FBQztBQUM3RyxVQUFJLDJDQUF1QyxLQUFLLENBQUMsV0FBVyxhQUFVLENBQUM7O0FBRXZFLFVBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixZQUFJLDBDQUF3QyxDQUFDO0FBQzdDLFlBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsY0FBSSxpREFBNkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQVUsQ0FBQztTQUM5RTtBQUNELFlBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsY0FBSSxpREFBNkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQVUsQ0FBQztTQUM3RTtBQUNELFlBQUksY0FBYyxDQUFDO09BQ3BCOztBQUVELFVBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7Ozs7OztBQUMvQywrQkFBYyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksOEhBQUU7Z0JBQXhCLENBQUM7O0FBQ1IsZ0JBQUksc0NBQWtDLENBQUMsQ0FBQyxJQUFJLFNBQUksQ0FBQyxDQUFDLE9BQU8sV0FBTSxDQUFDLENBQUMsSUFBSSxXQUFRLENBQUM7V0FDL0U7Ozs7Ozs7Ozs7Ozs7OztPQUNGOztBQUVELFVBQUksOENBQTBDLEtBQUssQ0FBQyxPQUFPLFdBQU0sS0FBSyxDQUFDLFFBQVEsZUFBWSxDQUFDO0FBQzVGLFVBQUksOENBQTBDLEtBQUssQ0FBQyxLQUFLLFdBQU0sS0FBSyxDQUFDLE1BQU0sZUFBWSxDQUFDO0FBQ3hGLFVBQUksSUFBSSxVQUFVLENBQUE7QUFDbEIsV0FBSyxJQUFJLElBQUksQ0FBQztLQUNmLENBQUMsQ0FBQzs7QUFFSCxRQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3JCLFdBQUssR0FBRyxxQ0FBcUMsQ0FBQztLQUMvQzs7QUFFRCxvQkFBZ0IsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ25DLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZOztBQUU3QixzQkFBa0IsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLG1CQUFlLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFaEMsUUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7O0FBRTVCLFVBQUksSUFBSSxzQ0FBb0MsQ0FBQztBQUM3QyxVQUFJLDJEQUF1RCxLQUFLLENBQUMsSUFBSSxvQkFBaUIsQ0FBQztBQUN2RixVQUFJLDJDQUF1QyxLQUFLLENBQUMsV0FBVyxhQUFVLENBQUM7O0FBRXZFLFVBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixZQUFJLDBDQUF3QyxDQUFDO0FBQzdDLFlBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsY0FBSSxpREFBNkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQVUsQ0FBQztTQUM5RTtBQUNELFlBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsY0FBSSxpREFBNkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQVUsQ0FBQztTQUM3RTtBQUNELFlBQUksY0FBYyxDQUFDO09BQ3BCOztBQUVELFVBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7Ozs7OztBQUMvQyxnQ0FBYyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksbUlBQUU7Z0JBQXhCLENBQUM7O0FBQ1IsZ0JBQUksc0NBQWtDLENBQUMsQ0FBQyxJQUFJLFNBQUksQ0FBQyxDQUFDLE9BQU8sV0FBTSxDQUFDLENBQUMsSUFBSSxXQUFRLENBQUM7V0FDL0U7Ozs7Ozs7Ozs7Ozs7OztPQUNGOztBQUVELFVBQUksOENBQTBDLEtBQUssQ0FBQyxPQUFPLFdBQU0sS0FBSyxDQUFDLFFBQVEsZUFBWSxDQUFDO0FBQzVGLFVBQUksOENBQTBDLEtBQUssQ0FBQyxLQUFLLFdBQU0sS0FBSyxDQUFDLE1BQU0sZUFBWSxDQUFDO0FBQ3hGLFVBQUksSUFBSSxVQUFVLENBQUE7QUFDbEIsV0FBSyxJQUFJLElBQUksQ0FBQztLQUNmLENBQUMsQ0FBQzs7QUFFSCxRQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3JCLFdBQUssR0FBRyxtQ0FBbUMsQ0FBQztLQUM3Qzs7QUFFRCxvQkFBZ0IsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ25DLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxrQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDMUQsUUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUMsUUFBSSxFQUFFLEVBQUU7QUFDTixVQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDcEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ1osTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDekIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ1o7S0FDRjtHQUNGLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dRdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5xdWVzdCA9IEdhbWUuV2luZG93LmNyZWF0ZShcInF1ZXN0V2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwicXVlc3RXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJxdWVzdFdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwicXVlc3RXaW5kb3dDdXJyZW50XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuW9k+WJjeS7u+WKoTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwicXVlc3RXaW5kb3dQYXN0XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuW3suWujOaIkDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGlkPVwicXVlc3RXaW5kb3dUYWJsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgI3F1ZXN0V2luZG93VGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgaGVpZ2h0OiAzMjBweDtcbiAgICB9XG5cbiAgICAucXVlc3RXaW5kb3dJdGVtIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgbWFyZ2luOiAxMHB4IDEwcHg7XG4gICAgfVxuXG4gICAgLnF1ZXN0V2luZG93SXRlbSA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfVxuXG4gICAgI3F1ZXN0V2luZG93SXRlbUJhciBidXR0b24ge1xuICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgICNxdWVzdFdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHF1ZXN0V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNxdWVzdFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgcXVlc3RXaW5kb3dDdXJyZW50ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjcXVlc3RXaW5kb3dDdXJyZW50XCIpO1xuICBsZXQgcXVlc3RXaW5kb3dQYXN0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjcXVlc3RXaW5kb3dQYXN0XCIpO1xuICBsZXQgcXVlc3RXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3F1ZXN0V2luZG93VGFibGVcIik7XG5cblxuICBxdWVzdFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHF1ZXN0V2luZG93Q2xvc2UuY2xpY2soKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHF1ZXN0V2luZG93Q3VycmVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgd2luLmN1cnJlbnQoKTtcbiAgfSk7XG5cbiAgcXVlc3RXaW5kb3dQYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICB3aW4ucGFzdCgpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwiY3VycmVudFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBxdWVzdFdpbmRvd0N1cnJlbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHF1ZXN0V2luZG93UGFzdC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgbGlzdCA9IEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdDtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKHF1ZXN0KSB7XG5cbiAgICAgIGxldCBjb21wbGV0ZSA9IEdhbWUuUXVlc3QuaXNDb21wbGV0ZShxdWVzdCk7XG5cbiAgICAgIGxldCBsaW5lID0gYDxkaXYgY2xhc3M9XCJxdWVzdFdpbmRvd0l0ZW1cIj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJmb250LXNpemU6IDIwcHg7IG1hcmdpbjogMTBweDtcIj4ke3F1ZXN0Lm5hbWV9JHtjb21wbGV0ZT9cIlvlt7LlrozmiJBdXCI6XCJb5pyq5a6M5oiQXVwifTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj7nroDku4vvvJoke3F1ZXN0LmRlc2NyaXB0aW9ufTwvZGl2PlxcbmA7XG5cbiAgICAgIGlmIChxdWVzdC5yZXdhcmQpIHtcbiAgICAgICAgbGluZSArPSBgICA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPuS7u+WKoeWlluWKse+8mmA7XG4gICAgICAgIGlmIChxdWVzdC5yZXdhcmQuZ29sZCkge1xuICAgICAgICAgIGxpbmUgKz0gYDxsYWJlbCBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjBweDtcIj7ph5HluIHvvJoke3F1ZXN0LnJld2FyZC5nb2xkfTwvbGFiZWw+YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocXVlc3QucmV3YXJkLmV4cCkge1xuICAgICAgICAgIGxpbmUgKz0gYDxsYWJlbCBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjBweDtcIj7nu4/pqozvvJoke3F1ZXN0LnJld2FyZC5leHB9PC9sYWJlbD5gO1xuICAgICAgICB9XG4gICAgICAgIGxpbmUgKz0gYCAgPC9kaXY+YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHF1ZXN0LnRhcmdldCAmJiBxdWVzdC50YXJnZXQua2lsbCA9PSBcImtpbGxcIikge1xuICAgICAgICBmb3IgKGxldCBrIG9mIHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgbGluZSArPSBgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj4ke2submFtZX3vvJoke2suY3VycmVudH0gLyAke3QubmVlZH08L2Rpdj5gO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPue7meS6iOS6uu+8miR7cXVlc3QuZnJvbU1hcH0g55qEICR7cXVlc3QuZnJvbU5hbWV9PC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+5Lqk5LuY5Lq677yaJHtxdWVzdC50b01hcH0g55qEICR7cXVlc3QudG9OYW1lfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L2Rpdj5cXG5cIlxuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICB9KTtcblxuICAgIGlmICh0YWJsZS5sZW5ndGggPD0gMCkge1xuICAgICAgdGFibGUgPSBcIjxkaXY+PGxhYmVsPuayoeacieato+WcqOi/m+ihjOeahOS7u+WKoTwvbGFiZWw+PC9kaXY+XCI7XG4gICAgfVxuXG4gICAgcXVlc3RXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwicGFzdFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBxdWVzdFdpbmRvd0N1cnJlbnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBxdWVzdFdpbmRvd1Bhc3QuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgbGlzdCA9IEdhbWUuaGVyby5kYXRhLmNvbXBsZXRlUXVlc3Q7XG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChxdWVzdCkge1xuXG4gICAgICBsZXQgbGluZSA9IGA8ZGl2IGNsYXNzPVwicXVlc3RXaW5kb3dJdGVtXCI+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwiZm9udC1zaXplOiAyMHB4OyBtYXJnaW46IDEwcHg7XCI+JHtxdWVzdC5uYW1lfVvlt7LlrozmiJBdPC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPueugOS7i++8miR7cXVlc3QuZGVzY3JpcHRpb259PC9kaXY+XFxuYDtcblxuICAgICAgaWYgKHF1ZXN0LnJld2FyZCkge1xuICAgICAgICBsaW5lICs9IGAgIDxkaXYgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+5Lu75Yqh5aWW5Yqx77yaYDtcbiAgICAgICAgaWYgKHF1ZXN0LnJld2FyZC5nb2xkKSB7XG4gICAgICAgICAgbGluZSArPSBgPGxhYmVsIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAyMHB4O1wiPumHkeW4ge+8miR7cXVlc3QucmV3YXJkLmdvbGR9PC9sYWJlbD5gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVzdC5yZXdhcmQuZXhwKSB7XG4gICAgICAgICAgbGluZSArPSBgPGxhYmVsIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAyMHB4O1wiPue7j+mqjO+8miR7cXVlc3QucmV3YXJkLmV4cH08L2xhYmVsPmA7XG4gICAgICAgIH1cbiAgICAgICAgbGluZSArPSBgICA8L2Rpdj5gO1xuICAgICAgfVxuXG4gICAgICBpZiAocXVlc3QudGFyZ2V0ICYmIHF1ZXN0LnRhcmdldC50eXBlID09IFwia2lsbFwiKSB7XG4gICAgICAgIGZvciAobGV0IGsgb2YgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICBsaW5lICs9IGA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPiR7ay5uYW1lfe+8miR7ay5jdXJyZW50fSAvICR7dC5uZWVkfTwvZGl2PmA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+57uZ5LqI5Lq677yaJHtxdWVzdC5mcm9tTWFwfSDnmoQgJHtxdWVzdC5mcm9tTmFtZX08L2xhYmVsPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj7kuqTku5jkurrvvJoke3F1ZXN0LnRvTWFwfSDnmoQgJHtxdWVzdC50b05hbWV9PC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBcIjwvZGl2PlxcblwiXG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgIH0pO1xuXG4gICAgaWYgKHRhYmxlLmxlbmd0aCA8PSAwKSB7XG4gICAgICB0YWJsZSA9IFwiPGRpdj48bGFiZWw+5rKh5pyJ5bey5a6M5oiQ5Lu75YqhPC9sYWJlbD48L2Rpdj5cIjtcbiAgICB9XG5cbiAgICBxdWVzdFdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHF1ZXN0V2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmIChpZCkge1xuICAgICAgaWYgKHR5cGUgPT0gXCJyZW1vdmVcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUucmVtb3ZlKGlkKTtcbiAgICAgICAgd2luLm9wZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImxvYWRcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUubG9hZChpZCk7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
