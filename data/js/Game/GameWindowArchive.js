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
    if (!Game.hero) {
      Game.windows.main.show();
    }
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      archiveWindowClose.click();
    }, 20);
  });

  win.assign("open", function () {

    if (Game.hero) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUdiLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxrVEFRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGlqQkE4Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbEUsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdEQsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxVQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFF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LENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93QXJjaGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5hcmNoaXZlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiYXJjaGl2ZVdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGRpdiBpZD1cImFyY2hpdmVXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhcmNoaXZlV2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6ZetPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhcmNoaXZlV2luZG93U2F2ZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7kv53lrZg8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBpZD1cImFyY2hpdmVXaW5kb3dUYWJsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgI2FyY2hpdmVXaW5kb3dUYWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICBoZWlnaHQ6IDMyMHB4O1xuICAgIH1cblxuICAgIC5hcmNoaXZlV2luZG93SXRlbSB7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgIG1hcmdpbjogMTBweCAxMHB4O1xuICAgIH1cblxuICAgIC5hcmNoaXZlV2luZG93SXRlbSA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfVxuXG4gICAgI2FyY2hpdmVXaW5kb3dJdGVtQmFyIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjYXJjaGl2ZVdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGFyY2hpdmVXaW5kb3dTYXZlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jYXJjaGl2ZVdpbmRvd1NhdmVcIik7XG4gIGxldCBhcmNoaXZlV2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNhcmNoaXZlV2luZG93Q2xvc2VcIik7XG4gIGxldCBhcmNoaXZlV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNhcmNoaXZlV2luZG93VGFibGVcIik7XG5cbiAgYXJjaGl2ZVdpbmRvd1NhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMud2lkdGggPSA4MDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gNDU7XG4gICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnRleHQuZHJhd0ltYWdlKEdhbWUuc3RhZ2UuY2FudmFzLCAwLCAwLCBHYW1lLnN0YWdlLmNhbnZhcy53aWR0aCwgR2FtZS5zdGFnZS5jYW52YXMuaGVpZ2h0LCAwLCAwLCA4MCwgNDUpO1xuXG4gICAgR2FtZS5BcmNoaXZlLnNhdmUoe1xuICAgICAgaGVybzogR2FtZS5oZXJvLmRhdGEsXG4gICAgICBzY3JlZW5zaG90OiBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiKVxuICAgIH0pO1xuXG4gICAgd2luLm9wZW4oKTtcbiAgfSk7XG5cbiAgYXJjaGl2ZVdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBpZiAoIUdhbWUuaGVybykge1xuICAgICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGFyY2hpdmVXaW5kb3dDbG9zZS5jbGljaygpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKEdhbWUuaGVybykge1xuICAgICAgYXJjaGl2ZVdpbmRvd1NhdmUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmNoaXZlV2luZG93U2F2ZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICB9XG5cbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIGxldCBsaXN0ID0gR2FtZS5BcmNoaXZlLmxpc3QoKTtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIGxldCBsaW5lID0gYDxkaXYgY2xhc3M9XCJhcmNoaXZlV2luZG93SXRlbVwiPlxcbmA7XG4gICAgICBsZXQgYXJjaGl2ZSA9IEdhbWUuQXJjaGl2ZS5nZXQoYFNBVkVfJHtlbGVtZW50fWApO1xuICAgICAgbGluZSArPSBgICA8YnV0dG9uIGRhdGEtdHlwZT1cInJlbW92ZVwiIGRhdGEtaWQ9XCJTQVZFXyR7ZWxlbWVudH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCIgc3R5bGU9XCJmbG9hdDogcmlnaHQ7XCI+5Yig6ZmkPC9idXR0b24+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGJ1dHRvbiBkYXRhLXR5cGU9XCJsb2FkXCIgZGF0YS1pZD1cIlNBVkVfJHtlbGVtZW50fVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIiBzdHlsZT1cImZsb2F0OiByaWdodDtcIj7or7vlj5Y8L2J1dHRvbj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8aW1nIGFsdD1cIlwiIHNyYz1cIiR7YXJjaGl2ZS5zY3JlZW5zaG90IHx8IFwiXCJ9XCIgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjQ1XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IG1hcmdpbjogNXB4O1wiPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cImZvbnQtc2l6ZTogMjBweDsgbWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5uYW1lfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5kYXRlfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L2Rpdj5cXG5cIlxuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICB9KTtcblxuICAgIGFyY2hpdmVXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICBHYW1lLndpbmRvd3MuYXJjaGl2ZS5zaG93KCk7XG4gIH0pO1xuXG4gIGFyY2hpdmVXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IHR5cGUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpO1xuICAgIGxldCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmICh0eXBlICYmIGlkKSB7XG4gICAgICBpZiAodHlwZSA9PSBcInJlbW92ZVwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5yZW1vdmUoaWQpO1xuICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwibG9hZFwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5sb2FkKGlkKTtcbiAgICAgICAgd2luLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
