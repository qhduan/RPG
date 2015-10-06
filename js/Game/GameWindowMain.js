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

  var win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = "\n    <div>\n      <h1>维加大陆</h1>\n      <button id=\"mainWindowContinue\" class=\"brownButton\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\" class=\"brownButton\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\" class=\"brownButton\">读取进度</button>\n      <br>\n    </div>\n  ";

  win.css = "\n    .mainWindow {\n      text-align: center;\n      background-image: url(\"image/main.jpeg\");\n    }\n\n    .mainWindow h1 {\n      font-size: 60px;\n    }\n\n    .mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ";

  var mainWindowContinue = win.querySelector("button#mainWindowContinue");
  var mainWindowNew = win.querySelector("button#mainWindowNew");
  var mainWindowLoad = win.querySelector("button#mainWindowLoad");

  win.on("beforeShow", function () {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", function (event) {
    win.hide();
    setTimeout(function () {
      Game.Archive.load();
    }, 20);
  });

  mainWindowNew.addEventListener("click", function (event) {
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dNYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSx1VEFVUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLDhRQWVOLENBQUM7O0FBRUYsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzlELE1BQUksY0FBYyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEUsS0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWTtBQUMvQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUN4Qix3QkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztLQUNoRCxNQUFNO0FBQ0wsd0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7S0FDakQ7R0FDRixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzVELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDckIsRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLENBQUMsQ0FBQzs7QUFFSCxlQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3ZELFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDckIsQ0FBQyxDQUFDOztBQUVILGdCQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3hELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzdCLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dNYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5tYWluID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwibWFpbldpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2PlxuICAgICAgPGgxPue7tOWKoOWkp+mZhjwvaDE+XG4gICAgICA8YnV0dG9uIGlkPVwibWFpbldpbmRvd0NvbnRpbnVlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPue7p+e7reaXheeoizwvYnV0dG9uPlxuICAgICAgPGJyPlxuICAgICAgPGJ1dHRvbiBpZD1cIm1haW5XaW5kb3dOZXdcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5paw55qE5peF56iLPC9idXR0b24+XG4gICAgICA8YnI+XG4gICAgICA8YnV0dG9uIGlkPVwibWFpbldpbmRvd0xvYWRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+6K+75Y+W6L+b5bqmPC9idXR0b24+XG4gICAgICA8YnI+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAubWFpbldpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJpbWFnZS9tYWluLmpwZWdcIik7XG4gICAgfVxuXG4gICAgLm1haW5XaW5kb3cgaDEge1xuICAgICAgZm9udC1zaXplOiA2MHB4O1xuICAgIH1cblxuICAgIC5tYWluV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTIwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIH1cbiAgYDtcblxuICBsZXQgbWFpbldpbmRvd0NvbnRpbnVlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jbWFpbldpbmRvd0NvbnRpbnVlXCIpO1xuICBsZXQgbWFpbldpbmRvd05ldyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI21haW5XaW5kb3dOZXdcIik7XG4gIGxldCBtYWluV2luZG93TG9hZCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI21haW5XaW5kb3dMb2FkXCIpO1xuXG4gIHdpbi5vbihcImJlZm9yZVNob3dcIiwgZnVuY3Rpb24gKCkge1xuICAgIGlmICghR2FtZS5BcmNoaXZlLmxhc3QoKSkge1xuICAgICAgbWFpbldpbmRvd0NvbnRpbnVlLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYWluV2luZG93Q29udGludWUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH1cbiAgfSk7XG5cbiAgbWFpbldpbmRvd0NvbnRpbnVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgR2FtZS5BcmNoaXZlLmxvYWQoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIG1haW5XaW5kb3dOZXcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIEdhbWUucmVnaXN0ZXIucmVnKCk7XG4gIH0pO1xuXG4gIG1haW5XaW5kb3dMb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5hcmNoaXZlLm9wZW4oKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
