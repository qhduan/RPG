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

  var win = Game.windows.archive = Game.Window.create("archiveWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"archiveWindowItemBar\">\n        <button id=\"archiveWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"archiveWindowSave\" class=\"brownButton\">保存</button>\n      </div>\n      <div id=\"archiveWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #archiveWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .archiveWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .archiveWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #archiveWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      display: block;\n      margin-bottom: 5px;\n    }\n\n    #archiveWindowClose {\n      float: right;\n    }\n  ";

  var archiveWindowSave = win.querySelector("button#archiveWindowSave");
  var archiveWindowClose = win.querySelector("button#archiveWindowClose");
  var archiveWindowTable = win.querySelector("#archiveWindowTable");

  archiveWindowSave.addEventListener("click", function () {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 45;
    var context = canvas.getContext("2d");
    context.drawImage(Game.stage.canvas, 0, 0, Game.stage.canvas.width, Game.stage.canvas.height, 0, 0, 80, 45);

    Game.Archive.save({
      hero: Game.hero.data,
      screenshot: canvas.toDataURL("image/jpeg")
    });

    win.open();
  });

  archiveWindowClose.addEventListener("click", function () {
    win.hide();
    if (!Game.windows.interface.showing) {
      Game.windows.main.show();
    }
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      archiveWindowClose.click();
    }, 20);
  });

  win.assign("open", function () {

    if (Game.windows.interface.showing && Game.hero) {
      archiveWindowSave.style.visibility = "visible";
    } else {
      archiveWindowSave.style.visibility = "hidden";
    }

    var table = "";
    var list = Game.Archive.list();
    list.forEach(function (element) {
      var line = "<div class=\"archiveWindowItem\">\n";
      var archive = Game.Archive.get("SAVE_" + element);
      line += "  <button data-type=\"remove\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">删除</button>\n";
      line += "  <button data-type=\"load\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">读取</button>\n";
      line += "  <img alt=\"\" src=\"" + (archive.screenshot || "") + "\" width=\"80\" height=\"45\" style=\"display: inline-block; margin: 5px;\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + archive.name + "</label>\n";
      line += "  <label style=\"margin: 10px;\">" + archive.date + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    archiveWindowTable.innerHTML = table;
    Game.windows.archive.show();
  });

  archiveWindowTable.addEventListener("click", function (event) {
    var type = event.target.getAttribute("data-type");
    var id = event.target.getAttribute("data-id");
    if (type && id) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUdiLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxrVEFRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGlqQkE4Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbEUsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdEQsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxVQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFF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RSxDQUFDLENBQUM7QUFDdEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ1o7S0FDRjtHQUNGLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dBcmNoaXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmFyY2hpdmUgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJhcmNoaXZlV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwiYXJjaGl2ZVdpbmRvd0l0ZW1CYXJcIj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImFyY2hpdmVXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImFyY2hpdmVXaW5kb3dTYXZlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuS/neWtmDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGlkPVwiYXJjaGl2ZVdpbmRvd1RhYmxlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAjYXJjaGl2ZVdpbmRvd1RhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgIGhlaWdodDogMzIwcHg7XG4gICAgfVxuXG4gICAgLmFyY2hpdmVXaW5kb3dJdGVtIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgbWFyZ2luOiAxMHB4IDEwcHg7XG4gICAgfVxuXG4gICAgLmFyY2hpdmVXaW5kb3dJdGVtID4gYnV0dG9uIHtcbiAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICB9XG5cbiAgICAjYXJjaGl2ZVdpbmRvd0l0ZW1CYXIgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgIGhlaWdodDogMzBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgICNhcmNoaXZlV2luZG93Q2xvc2Uge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cbiAgYDtcblxuICBsZXQgYXJjaGl2ZVdpbmRvd1NhdmUgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNhcmNoaXZlV2luZG93U2F2ZVwiKTtcbiAgbGV0IGFyY2hpdmVXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2FyY2hpdmVXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IGFyY2hpdmVXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2FyY2hpdmVXaW5kb3dUYWJsZVwiKTtcblxuICBhcmNoaXZlV2luZG93U2F2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy53aWR0aCA9IDgwO1xuICAgIGNhbnZhcy5oZWlnaHQgPSA0NTtcbiAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UoR2FtZS5zdGFnZS5jYW52YXMsIDAsIDAsIEdhbWUuc3RhZ2UuY2FudmFzLndpZHRoLCBHYW1lLnN0YWdlLmNhbnZhcy5oZWlnaHQsIDAsIDAsIDgwLCA0NSk7XG5cbiAgICBHYW1lLkFyY2hpdmUuc2F2ZSh7XG4gICAgICBoZXJvOiBHYW1lLmhlcm8uZGF0YSxcbiAgICAgIHNjcmVlbnNob3Q6IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9qcGVnXCIpXG4gICAgfSk7XG5cbiAgICB3aW4ub3BlbigpO1xuICB9KTtcblxuICBhcmNoaXZlV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIGlmICggIUdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvd2luZyApIHtcbiAgICAgIEdhbWUud2luZG93cy5tYWluLnNob3coKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZXNjXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBhcmNoaXZlV2luZG93Q2xvc2UuY2xpY2soKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJvcGVuXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICggR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93aW5nICYmIEdhbWUuaGVybyApIHtcbiAgICAgIGFyY2hpdmVXaW5kb3dTYXZlLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJjaGl2ZVdpbmRvd1NhdmUuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgbGlzdCA9IEdhbWUuQXJjaGl2ZS5saXN0KCk7XG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICBsZXQgbGluZSA9IGA8ZGl2IGNsYXNzPVwiYXJjaGl2ZVdpbmRvd0l0ZW1cIj5cXG5gO1xuICAgICAgbGV0IGFyY2hpdmUgPSBHYW1lLkFyY2hpdmUuZ2V0KGBTQVZFXyR7ZWxlbWVudH1gKTtcbiAgICAgIGxpbmUgKz0gYCAgPGJ1dHRvbiBkYXRhLXR5cGU9XCJyZW1vdmVcIiBkYXRhLWlkPVwiU0FWRV8ke2VsZW1lbnR9XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O1wiPuWIoOmZpDwvYnV0dG9uPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxidXR0b24gZGF0YS10eXBlPVwibG9hZFwiIGRhdGEtaWQ9XCJTQVZFXyR7ZWxlbWVudH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCIgc3R5bGU9XCJmbG9hdDogcmlnaHQ7XCI+6K+75Y+WPC9idXR0b24+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGltZyBhbHQ9XCJcIiBzcmM9XCIke2FyY2hpdmUuc2NyZWVuc2hvdCB8fCBcIlwifVwiIHdpZHRoPVwiODBcIiBoZWlnaHQ9XCI0NVwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBtYXJnaW46IDVweDtcIj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJmb250LXNpemU6IDIwcHg7IG1hcmdpbjogMTBweDtcIj4ke2FyY2hpdmUubmFtZX08L2xhYmVsPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj4ke2FyY2hpdmUuZGF0ZX08L2xhYmVsPlxcbmA7XG4gICAgICBsaW5lICs9IFwiPC9kaXY+XFxuXCJcbiAgICAgIHRhYmxlICs9IGxpbmU7XG4gICAgfSk7XG5cbiAgICBhcmNoaXZlV2luZG93VGFibGUuaW5uZXJIVE1MID0gdGFibGU7XG4gICAgR2FtZS53aW5kb3dzLmFyY2hpdmUuc2hvdygpO1xuICB9KTtcblxuICBhcmNoaXZlV2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCB0eXBlID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtdHlwZVwiKTtcbiAgICBsZXQgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICBpZiAodHlwZSAmJiBpZCkge1xuICAgICAgaWYgKHR5cGUgPT0gXCJyZW1vdmVcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUucmVtb3ZlKGlkKTtcbiAgICAgICAgd2luLm9wZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImxvYWRcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUubG9hZChpZCk7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
