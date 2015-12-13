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

  var win = Game.windows.sysmenu = Game.Window.create("sysmenuWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"sysmenuWindowClose\" class=\"brownButton\">关闭窗口</button>\n\n      <table><tbody><tr><td>\n        <button id=\"sysmenuWindowInventory\" class=\"brownButton\">1、背包物品</button>\n        <button id=\"sysmenuWindowStatus\" class=\"brownButton\">2、状态装备</button>\n        <br>\n        <button id=\"sysmenuWindowSkill\" class=\"brownButton\">3、查看技能</button>\n        <button id=\"sysmenuWindowQuest\" class=\"brownButton\">4、任务列表</button>\n        <br>\n        <button id=\"sysmenuWindowMap\" class=\"brownButton\">5、迷你地图</button>\n        <button id=\"sysmenuWindowSetting\" class=\"brownButton\">6、游戏设置</button>\n        <br>\n        <button id=\"sysmenuWindowArchive\" class=\"brownButton\">7、存档管理</button>\n        <button id=\"sysmenuWindowExit\" class=\"brownButton\">8、退出游戏</button>\n        <br>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .sysmenuWindow {\n      text-align: center;\n    }\n\n    .sysmenuWindow table, .sysmenuWindow tbody, .sysmenuWindow tr, .sysmenuWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .sysmenuWindow button {\n      width: 200px;\n      height: 60px;\n      margin: 2px;\n      font-size: 16px;\n    }\n\n    button#sysmenuWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n  ";

  var sysmenuWindowInventory = win.querySelector("button#sysmenuWindowInventory");
  var sysmenuWindowStatus = win.querySelector("button#sysmenuWindowStatus");

  var sysmenuWindowSkill = win.querySelector("button#sysmenuWindowSkill");
  var sysmenuWindowQuest = win.querySelector("button#sysmenuWindowQuest");

  var sysmenuWindowMap = win.querySelector("button#sysmenuWindowMap");
  var sysmenuWindowSetting = win.querySelector("button#sysmenuWindowSetting");

  var sysmenuWindowArchive = win.querySelector("button#sysmenuWindowArchive");
  var sysmenuWindowExit = win.querySelector("button#sysmenuWindowExit");

  var sysmenuWindowClose = win.querySelector("button#sysmenuWindowClose");

  win.whenUp(["esc"], function (key) {
    sysmenuWindowClose.click();
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    switch (key) {
      case "1":
        sysmenuWindowInventory.click();
        break;
      case "2":
        sysmenuWindowStatus.click();
        break;
      case "3":
        sysmenuWindowSkill.click();
        break;
      case "4":
        sysmenuWindowQuest.click();
        break;
      case "5":
        sysmenuWindowMap.click();
        break;
      case "6":
        sysmenuWindowSetting.click();
        break;
      case "7":
        sysmenuWindowArchive.click();
        break;
      case "8":
        sysmenuWindowExit.click();
        break;
    }
  });

  sysmenuWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  sysmenuWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  sysmenuWindowSkill.addEventListener("click", function (event) {
    win.hide();
    Game.windows.skill.open();
  });

  sysmenuWindowQuest.addEventListener("click", function (event) {
    win.hide();
    Game.windows.quest.current();
  });

  sysmenuWindowMap.addEventListener("click", function (event) {
    win.hide();
    Game.windows.map.show();
  });

  sysmenuWindowSetting.addEventListener("click", function (event) {
    win.hide();
    Game.windows.setting.show();
  });

  sysmenuWindowArchive.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });

  sysmenuWindowExit.addEventListener("click", function (event) {
    Game.clearStage();
    Game.windows.interface.hide();
    Game.windows.stage.hide();
    win.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTeXNtZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSwwNEJBbUJQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcseWhCQTJCTixDQUFDOztBQUVGLE1BQUksc0JBQXNCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hGLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxRSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTVFLE1BQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzVFLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsS0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVB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RUgsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzNELFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUMxQixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzVELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dTeXNtZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zeXNtZW51ID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwic3lzbWVudVdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl63nqpflj6M8L2J1dHRvbj5cblxuICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd0ludmVudG9yeVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4x44CB6IOM5YyF54mp5ZOBPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93U3RhdHVzXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjLjgIHnirbmgIHoo4XlpIc8L2J1dHRvbj5cbiAgICAgICAgPGJyPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd1NraWxsXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjPjgIHmn6XnnIvmioDog708L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dRdWVzdFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4044CB5Lu75Yqh5YiX6KGoPC9idXR0b24+XG4gICAgICAgIDxicj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dNYXBcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+NeOAgei/t+S9oOWcsOWbvjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd1NldHRpbmdcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+NuOAgea4uOaIj+iuvue9rjwvYnV0dG9uPlxuICAgICAgICA8YnI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93QXJjaGl2ZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4344CB5a2Y5qGj566h55CGPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93RXhpdFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4444CB6YCA5Ye65ri45oiPPC9idXR0b24+XG4gICAgICAgIDxicj5cbiAgICAgIDwvdGQ+PC90cj48L3Rib2R5PjwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAuc3lzbWVudVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLnN5c21lbnVXaW5kb3cgdGFibGUsIC5zeXNtZW51V2luZG93IHRib2R5LCAuc3lzbWVudVdpbmRvdyB0ciwgLnN5c21lbnVXaW5kb3cgdGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5zeXNtZW51V2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMjAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBtYXJnaW46IDJweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG5cbiAgICBidXR0b24jc3lzbWVudVdpbmRvd0Nsb3NlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cbiAgYDtcblxuICBsZXQgc3lzbWVudVdpbmRvd0ludmVudG9yeSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dJbnZlbnRvcnlcIik7XG4gIGxldCBzeXNtZW51V2luZG93U3RhdHVzID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1N0YXR1c1wiKTtcblxuICBsZXQgc3lzbWVudVdpbmRvd1NraWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1NraWxsXCIpO1xuICBsZXQgc3lzbWVudVdpbmRvd1F1ZXN0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1F1ZXN0XCIpO1xuXG4gIGxldCBzeXNtZW51V2luZG93TWFwID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd01hcFwiKTtcbiAgbGV0IHN5c21lbnVXaW5kb3dTZXR0aW5nID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1NldHRpbmdcIik7XG5cbiAgbGV0IHN5c21lbnVXaW5kb3dBcmNoaXZlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd0FyY2hpdmVcIik7XG4gIGxldCBzeXNtZW51V2luZG93RXhpdCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dFeGl0XCIpO1xuXG4gIGxldCBzeXNtZW51V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzeXNtZW51V2luZG93Q2xvc2VcIik7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzeXNtZW51V2luZG93Q2xvc2UuY2xpY2soKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIFwiMVwiOlxuICAgICAgICBzeXNtZW51V2luZG93SW52ZW50b3J5LmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjJcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd1N0YXR1cy5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIzXCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dTa2lsbC5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI0XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dRdWVzdC5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI1XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dNYXAuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiNlwiOlxuICAgICAgICBzeXNtZW51V2luZG93U2V0dGluZy5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI3XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dBcmNoaXZlLmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjhcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd0V4aXQuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxuICBzeXNtZW51V2luZG93SW52ZW50b3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93U3RhdHVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zdGF0dXMub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93U2tpbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLnNraWxsLm9wZW4oKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd1F1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5xdWVzdC5jdXJyZW50KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dNYXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLm1hcC5zaG93KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dTZXR0aW5nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zZXR0aW5nLnNob3coKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd0FyY2hpdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLmFyY2hpdmUub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93RXhpdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgR2FtZS5jbGVhclN0YWdlKCk7XG4gICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLnN0YWdlLmhpZGUoKTtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5tYWluLnNob3coKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuXG59KSgpO1xuIl19
