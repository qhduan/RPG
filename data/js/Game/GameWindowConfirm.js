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

  var internal = Sprite.Namespace();

  var confirmHTML = "\n  <div class=\"window-box\">\n    <div style=\"width: 100%; height: 100%;\">\n      <table>\n        <tr><td><span id=\"confirmWindowMessage\"></span></td></tr>\n        <tr><td>\n          <button id=\"confirmWindowYes\" class=\"brownButton\">确定</button>\n          <button id=\"confirmWindowNo\" class=\"brownButton\">取消</button>\n        </td></tr>\n      </table>\n    </div>\n  </div>\n  ";

  var confirmCSS = "\n    .confirmWindow {\n      text-align: center;\n    }\n\n    .confirmWindow table {\n      width: 100%;\n      height: 100%;\n    }\n\n    .confirmWindow span {\n      font-size: 16px;\n    }\n\n    .confirmWindow button {\n      width: 100px;\n      height: 60px;\n      font-size: 16px;\n      margin: 20px;\n    }\n\n    #confirmWindowMessage {\n      color: black;\n      font-size: 20px;\n    }\n  ";

  Game.assign("confirm", function (message, yes, no) {

    var win = Game.Window.create("confirmWindow");
    win.html = confirmHTML;
    win.css = confirmCSS;
    win.show();

    var confirmWindowMessage = win.querySelector("#confirmWindowMessage");
    var confirmWindowYes = win.querySelector("#confirmWindowYes");
    var confirmWindowNo = win.querySelector("#confirmWindowNo");

    if (typeof message == "string") {
      confirmWindowMessage.textContent = message;
    } else if (message.message) {
      confirmWindowMessage.textContent = message.message;
      if (message.yes) {
        confirmWindowYes.textContent = message.yes;
      }
      if (message.no) {
        confirmWindowNo.textContent = message.no;
      }
    } else {
      console.error(message, yes, no);
      throw new Error("Game.confirm got invalid arguments");
    }

    win.whenUp(["esc"], function () {
      setTimeout(function () {
        confirmWindowNo.click();
      }, 20);
    });

    win.whenUp(["y", "Y"], function () {
      confirmWindowYes.click();
    });

    win.whenUp(["n", "N"], function () {
      confirmWindowNo.click();
    });

    confirmWindowYes.addEventListener("click", function () {
      win.destroy();
      if (yes) {
        yes();
      }
    });

    confirmWindowNo.addEventListener("click", function () {
      win.destroy();
      if (no) {
        no();
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dDb25maXJtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxXQUFXLGdaQVlkLENBQUM7O0FBRUYsTUFBSSxVQUFVLDJaQXlCYixDQUFDOztBQUVGLE1BQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7O0FBRWpELFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlDLE9BQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0FBQ3ZCLE9BQUcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ3JCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxRQUFJLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0RSxRQUFJLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxRQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTVELFFBQUksT0FBTyxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzlCLDBCQUFvQixDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7S0FDNUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDMUIsMEJBQW9CLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDbkQsVUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2Ysd0JBQWdCLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7T0FDNUM7QUFDRCxVQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDZCx1QkFBZSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO09BQzFDO0tBQ0YsTUFBTTtBQUNMLGFBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxZQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7S0FDdkQ7O0FBR0QsT0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVk7QUFDOUIsZ0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLHVCQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDekIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSLENBQUMsQ0FBQzs7QUFFSCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFlBQVk7QUFDakMsc0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDMUIsQ0FBQyxDQUFDOztBQUVILE9BQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsWUFBWTtBQUNqQyxxQkFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3pCLENBQUMsQ0FBQzs7QUFFSCxvQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNyRCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLEdBQUcsRUFBRTtBQUNQLFdBQUcsRUFBRSxDQUFDO09BQ1A7S0FDRixDQUFDLENBQUM7O0FBRUgsbUJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNwRCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLEVBQUUsRUFBRTtBQUNOLFVBQUUsRUFBRSxDQUFDO09BQ047S0FDRixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93Q29uZmlybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBsZXQgY29uZmlybUhUTUwgPSBgXG4gIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XCI+XG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0cj48dGQ+PHNwYW4gaWQ9XCJjb25maXJtV2luZG93TWVzc2FnZVwiPjwvc3Bhbj48L3RkPjwvdHI+XG4gICAgICAgIDx0cj48dGQ+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbmZpcm1XaW5kb3dZZXNcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+56Gu5a6aPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbmZpcm1XaW5kb3dOb1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lj5bmtog8L2J1dHRvbj5cbiAgICAgICAgPC90ZD48L3RyPlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGA7XG5cbiAgbGV0IGNvbmZpcm1DU1MgPSBgXG4gICAgLmNvbmZpcm1XaW5kb3cge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IHRhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IHNwYW4ge1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBtYXJnaW46IDIwcHg7XG4gICAgfVxuXG4gICAgI2NvbmZpcm1XaW5kb3dNZXNzYWdlIHtcbiAgICAgIGNvbG9yOiBibGFjaztcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICB9XG4gIGA7XG5cbiAgR2FtZS5hc3NpZ24oXCJjb25maXJtXCIsIGZ1bmN0aW9uIChtZXNzYWdlLCB5ZXMsIG5vKSB7XG5cbiAgICBsZXQgd2luID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiY29uZmlybVdpbmRvd1wiKTtcbiAgICB3aW4uaHRtbCA9IGNvbmZpcm1IVE1MO1xuICAgIHdpbi5jc3MgPSBjb25maXJtQ1NTO1xuICAgIHdpbi5zaG93KCk7XG5cbiAgICBsZXQgY29uZmlybVdpbmRvd01lc3NhZ2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjb25maXJtV2luZG93TWVzc2FnZVwiKTtcbiAgICBsZXQgY29uZmlybVdpbmRvd1llcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2NvbmZpcm1XaW5kb3dZZXNcIik7XG4gICAgbGV0IGNvbmZpcm1XaW5kb3dObyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2NvbmZpcm1XaW5kb3dOb1wiKTtcblxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25maXJtV2luZG93TWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLm1lc3NhZ2UpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dNZXNzYWdlLnRleHRDb250ZW50ID0gbWVzc2FnZS5tZXNzYWdlO1xuICAgICAgaWYgKG1lc3NhZ2UueWVzKSB7XG4gICAgICAgIGNvbmZpcm1XaW5kb3dZZXMudGV4dENvbnRlbnQgPSBtZXNzYWdlLnllcztcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlLm5vKSB7XG4gICAgICAgIGNvbmZpcm1XaW5kb3dOby50ZXh0Q29udGVudCA9IG1lc3NhZ2Uubm87XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgeWVzLCBubyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLmNvbmZpcm0gZ290IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgIH1cblxuXG4gICAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25maXJtV2luZG93Tm8uY2xpY2soKTtcbiAgICAgIH0sIDIwKTtcbiAgICB9KTtcblxuICAgIHdpbi53aGVuVXAoW1wieVwiLCBcIllcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dZZXMuY2xpY2soKTtcbiAgICB9KTtcblxuICAgIHdpbi53aGVuVXAoW1wiblwiLCBcIk5cIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dOby5jbGljaygpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybVdpbmRvd1llcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmRlc3Ryb3koKTtcbiAgICAgIGlmICh5ZXMpIHtcbiAgICAgICAgeWVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25maXJtV2luZG93Tm8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICBpZiAobm8pIHtcbiAgICAgICAgbm8oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
