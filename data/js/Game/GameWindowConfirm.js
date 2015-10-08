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

  Game.assign("confirm", function (message) {

    return new Promise(function (resolve, reject) {

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
        resolve();
      });

      confirmWindowNo.addEventListener("click", function () {
        win.destroy();
        reject();
      });
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9HYW1lL0dhbWVXaW5kb3dDb25maXJtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxXQUFXLGdaQVlkLENBQUM7O0FBRUYsTUFBSSxVQUFVLDJaQXlCYixDQUFDOztBQUVGLE1BQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQUMsT0FBTyxFQUFLOztBQUVsQyxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSzs7QUFFdEMsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDOUMsU0FBRyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7QUFDdkIsU0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFDckIsU0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVYLFVBQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RFLFVBQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlELFVBQUksZUFBZSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFNUQsVUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDOUIsNEJBQW9CLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztPQUM1QyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUMxQiw0QkFBb0IsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNuRCxZQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDZiwwQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUM1QztBQUNELFlBQUksT0FBTyxDQUFDLEVBQUUsRUFBRTtBQUNkLHlCQUFlLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDMUM7T0FDRixNQUFNO0FBQ0wsY0FBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO09BQ3ZEOztBQUdELFNBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxZQUFZO0FBQzlCLGtCQUFVLENBQUMsWUFBWTtBQUNyQix5QkFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3pCLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDUixDQUFDLENBQUM7O0FBRUgsU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxZQUFZO0FBQ2pDLHdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO09BQzFCLENBQUMsQ0FBQzs7QUFFSCxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFlBQVk7QUFDakMsdUJBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUN6QixDQUFDLENBQUM7O0FBRUgsc0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDckQsV0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2QsZUFBTyxFQUFFLENBQUM7T0FDWCxDQUFDLENBQUM7O0FBRUgscUJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNwRCxXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxjQUFNLEVBQUUsQ0FBQztPQUNWLENBQUMsQ0FBQztLQUVKLENBQUMsQ0FBQztHQUVKLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6InNyYy9HYW1lL0dhbWVXaW5kb3dDb25maXJtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIGxldCBjb25maXJtSFRNTCA9IGBcbiAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcIj5cbiAgICAgIDx0YWJsZT5cbiAgICAgICAgPHRyPjx0ZD48c3BhbiBpZD1cImNvbmZpcm1XaW5kb3dNZXNzYWdlXCI+PC9zcGFuPjwvdGQ+PC90cj5cbiAgICAgICAgPHRyPjx0ZD5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiY29uZmlybVdpbmRvd1llc1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7noa7lrpo8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiY29uZmlybVdpbmRvd05vXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWPlua2iDwvYnV0dG9uPlxuICAgICAgICA8L3RkPjwvdHI+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYDtcblxuICBsZXQgY29uZmlybUNTUyA9IGBcbiAgICAuY29uZmlybVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLmNvbmZpcm1XaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgLmNvbmZpcm1XaW5kb3cgc3BhbiB7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgLmNvbmZpcm1XaW5kb3cgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgIGhlaWdodDogNjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbjogMjBweDtcbiAgICB9XG5cbiAgICAjY29uZmlybVdpbmRvd01lc3NhZ2Uge1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgIH1cbiAgYDtcblxuICBHYW1lLmFzc2lnbihcImNvbmZpcm1cIiwgKG1lc3NhZ2UpID0+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGxldCB3aW4gPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJjb25maXJtV2luZG93XCIpO1xuICAgICAgd2luLmh0bWwgPSBjb25maXJtSFRNTDtcbiAgICAgIHdpbi5jc3MgPSBjb25maXJtQ1NTO1xuICAgICAgd2luLnNob3coKTtcblxuICAgICAgbGV0IGNvbmZpcm1XaW5kb3dNZXNzYWdlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjY29uZmlybVdpbmRvd01lc3NhZ2VcIik7XG4gICAgICBsZXQgY29uZmlybVdpbmRvd1llcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2NvbmZpcm1XaW5kb3dZZXNcIik7XG4gICAgICBsZXQgY29uZmlybVdpbmRvd05vID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjY29uZmlybVdpbmRvd05vXCIpO1xuXG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25maXJtV2luZG93TWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UubWVzc2FnZSkge1xuICAgICAgICBjb25maXJtV2luZG93TWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2UubWVzc2FnZTtcbiAgICAgICAgaWYgKG1lc3NhZ2UueWVzKSB7XG4gICAgICAgICAgY29uZmlybVdpbmRvd1llcy50ZXh0Q29udGVudCA9IG1lc3NhZ2UueWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLm5vKSB7XG4gICAgICAgICAgY29uZmlybVdpbmRvd05vLnRleHRDb250ZW50ID0gbWVzc2FnZS5ubztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5jb25maXJtIGdvdCBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cblxuXG4gICAgICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25maXJtV2luZG93Tm8uY2xpY2soKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgfSk7XG5cbiAgICAgIHdpbi53aGVuVXAoW1wieVwiLCBcIllcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uZmlybVdpbmRvd1llcy5jbGljaygpO1xuICAgICAgfSk7XG5cbiAgICAgIHdpbi53aGVuVXAoW1wiblwiLCBcIk5cIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uZmlybVdpbmRvd05vLmNsaWNrKCk7XG4gICAgICB9KTtcblxuICAgICAgY29uZmlybVdpbmRvd1llcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW4uZGVzdHJveSgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcblxuICAgICAgY29uZmlybVdpbmRvd05vLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxuXG59KSgpO1xuIl19