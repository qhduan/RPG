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
    Game.windows["interface"].hide();
    Game.windows.stage.hide();
    win.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTeXNtZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSwwNEJBbUJQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcseWhCQTJCTixDQUFDOztBQUVGLE1BQUksc0JBQXNCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hGLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxRSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTVFLE1BQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzVFLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsS0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVB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RUgsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzNELFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDMUIsQ0FBQyxDQUFDOztBQUVILG9CQUFrQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUM1RCxPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93U3lzbWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3Muc3lzbWVudSA9IEdhbWUuV2luZG93LmNyZWF0ZShcInN5c21lbnVXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6Zet56qX5Y+jPC9idXR0b24+XG5cbiAgICAgIDx0YWJsZT48dGJvZHk+PHRyPjx0ZD5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dJbnZlbnRvcnlcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+MeOAgeiDjOWMheeJqeWTgTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd1N0YXR1c1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4y44CB54q25oCB6KOF5aSHPC9idXR0b24+XG4gICAgICAgIDxicj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dTa2lsbFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4z44CB5p+l55yL5oqA6IO9PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93UXVlc3RcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+NOOAgeS7u+WKoeWIl+ihqDwvYnV0dG9uPlxuICAgICAgICA8YnI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93TWFwXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjXjgIHov7fkvaDlnLDlm748L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dTZXR0aW5nXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjbjgIHmuLjmiI/orr7nva48L2J1dHRvbj5cbiAgICAgICAgPGJyPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd0FyY2hpdmVcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+N+OAgeWtmOaho+euoeeQhjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd0V4aXRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+OOOAgemAgOWHuua4uOaIjzwvYnV0dG9uPlxuICAgICAgICA8YnI+XG4gICAgICA8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLnN5c21lbnVXaW5kb3cge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIC5zeXNtZW51V2luZG93IHRhYmxlLCAuc3lzbWVudVdpbmRvdyB0Ym9keSwgLnN5c21lbnVXaW5kb3cgdHIsIC5zeXNtZW51V2luZG93IHRkIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgcGFkZGluZzogMDtcbiAgICB9XG5cbiAgICAuc3lzbWVudVdpbmRvdyBidXR0b24ge1xuICAgICAgd2lkdGg6IDIwMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgbWFyZ2luOiAycHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgYnV0dG9uI3N5c21lbnVXaW5kb3dDbG9zZSB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogNTBweDtcbiAgICAgIHRvcDogNTBweDtcbiAgICAgIHdpZHRoOiAxMjBweDtcbiAgICAgIGhlaWdodDogNjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHN5c21lbnVXaW5kb3dJbnZlbnRvcnkgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzeXNtZW51V2luZG93SW52ZW50b3J5XCIpO1xuICBsZXQgc3lzbWVudVdpbmRvd1N0YXR1cyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dTdGF0dXNcIik7XG5cbiAgbGV0IHN5c21lbnVXaW5kb3dTa2lsbCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dTa2lsbFwiKTtcbiAgbGV0IHN5c21lbnVXaW5kb3dRdWVzdCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dRdWVzdFwiKTtcblxuICBsZXQgc3lzbWVudVdpbmRvd01hcCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dNYXBcIik7XG4gIGxldCBzeXNtZW51V2luZG93U2V0dGluZyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dTZXR0aW5nXCIpO1xuXG4gIGxldCBzeXNtZW51V2luZG93QXJjaGl2ZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dBcmNoaXZlXCIpO1xuICBsZXQgc3lzbWVudVdpbmRvd0V4aXQgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzeXNtZW51V2luZG93RXhpdFwiKTtcblxuICBsZXQgc3lzbWVudVdpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd0Nsb3NlXCIpO1xuXG4gIHdpbi53aGVuVXAoW1wiZXNjXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgc3lzbWVudVdpbmRvd0Nsb3NlLmNsaWNrKCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSBcIjFcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd0ludmVudG9yeS5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIyXCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dTdGF0dXMuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiM1wiOlxuICAgICAgICBzeXNtZW51V2luZG93U2tpbGwuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiNFwiOlxuICAgICAgICBzeXNtZW51V2luZG93UXVlc3QuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiNVwiOlxuICAgICAgICBzeXNtZW51V2luZG93TWFwLmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjZcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd1NldHRpbmcuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiN1wiOlxuICAgICAgICBzeXNtZW51V2luZG93QXJjaGl2ZS5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI4XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dFeGl0LmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd0ludmVudG9yeS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MuaW52ZW50b3J5Lm9wZW4oKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd1N0YXR1cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3Muc3RhdHVzLm9wZW4oKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd1NraWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5za2lsbC5vcGVuKCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dRdWVzdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MucXVlc3QuY3VycmVudCgpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93TWFwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5tYXAuc2hvdygpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93U2V0dGluZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3Muc2V0dGluZy5zaG93KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dBcmNoaXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5hcmNoaXZlLm9wZW4oKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd0V4aXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zdGFnZS5oaWRlKCk7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MubWFpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
