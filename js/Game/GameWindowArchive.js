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
    if (!Game.windows["interface"].showing) {
      Game.windows.main.show();
    }
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      archiveWindowClose.click();
    }, 20);
  });

  win.assign("open", function () {

    if (Game.windows["interface"].showing && Game.hero) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUdiLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxrVEFRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGlqQkE4Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbEUsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdEQsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxVQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFF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QztBQUN0QixXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDWjtLQUNGO0dBQ0YsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0FyY2hpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3MuYXJjaGl2ZSA9IEdhbWUuV2luZG93LmNyZWF0ZShcImFyY2hpdmVXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgaWQ9XCJhcmNoaXZlV2luZG93SXRlbUJhclwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwiYXJjaGl2ZVdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiYXJjaGl2ZVdpbmRvd1NhdmVcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5L+d5a2YPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgaWQ9XCJhcmNoaXZlV2luZG93VGFibGVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgICNhcmNoaXZlV2luZG93VGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgaGVpZ2h0OiAzMjBweDtcbiAgICB9XG5cbiAgICAuYXJjaGl2ZVdpbmRvd0l0ZW0ge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICBtYXJnaW46IDEwcHggMTBweDtcbiAgICB9XG5cbiAgICAuYXJjaGl2ZVdpbmRvd0l0ZW0gPiBidXR0b24ge1xuICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIH1cblxuICAgICNhcmNoaXZlV2luZG93SXRlbUJhciBidXR0b24ge1xuICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgfVxuXG4gICAgI2FyY2hpdmVXaW5kb3dDbG9zZSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuICBgO1xuXG4gIGxldCBhcmNoaXZlV2luZG93U2F2ZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2FyY2hpdmVXaW5kb3dTYXZlXCIpO1xuICBsZXQgYXJjaGl2ZVdpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jYXJjaGl2ZVdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgYXJjaGl2ZVdpbmRvd1RhYmxlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjYXJjaGl2ZVdpbmRvd1RhYmxlXCIpO1xuXG4gIGFyY2hpdmVXaW5kb3dTYXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgY2FudmFzLndpZHRoID0gODA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ1O1xuICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjb250ZXh0LmRyYXdJbWFnZShHYW1lLnN0YWdlLmNhbnZhcywgMCwgMCwgR2FtZS5zdGFnZS5jYW52YXMud2lkdGgsIEdhbWUuc3RhZ2UuY2FudmFzLmhlaWdodCwgMCwgMCwgODAsIDQ1KTtcblxuICAgIEdhbWUuQXJjaGl2ZS5zYXZlKHtcbiAgICAgIGhlcm86IEdhbWUuaGVyby5kYXRhLFxuICAgICAgc2NyZWVuc2hvdDogY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIilcbiAgICB9KTtcblxuICAgIHdpbi5vcGVuKCk7XG4gIH0pO1xuXG4gIGFyY2hpdmVXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgaWYgKCAhR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93aW5nICkge1xuICAgICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGFyY2hpdmVXaW5kb3dDbG9zZS5jbGljaygpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnNob3dpbmcgJiYgR2FtZS5oZXJvICkge1xuICAgICAgYXJjaGl2ZVdpbmRvd1NhdmUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmNoaXZlV2luZG93U2F2ZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICB9XG5cbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIGxldCBsaXN0ID0gR2FtZS5BcmNoaXZlLmxpc3QoKTtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIGxldCBsaW5lID0gYDxkaXYgY2xhc3M9XCJhcmNoaXZlV2luZG93SXRlbVwiPlxcbmA7XG4gICAgICBsZXQgYXJjaGl2ZSA9IEdhbWUuQXJjaGl2ZS5nZXQoYFNBVkVfJHtlbGVtZW50fWApO1xuICAgICAgbGluZSArPSBgICA8YnV0dG9uIGRhdGEtdHlwZT1cInJlbW92ZVwiIGRhdGEtaWQ9XCJTQVZFXyR7ZWxlbWVudH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCIgc3R5bGU9XCJmbG9hdDogcmlnaHQ7XCI+5Yig6ZmkPC9idXR0b24+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGJ1dHRvbiBkYXRhLXR5cGU9XCJsb2FkXCIgZGF0YS1pZD1cIlNBVkVfJHtlbGVtZW50fVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIiBzdHlsZT1cImZsb2F0OiByaWdodDtcIj7or7vlj5Y8L2J1dHRvbj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8aW1nIGFsdD1cIlwiIHNyYz1cIiR7YXJjaGl2ZS5zY3JlZW5zaG90IHx8IFwiXCJ9XCIgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjQ1XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IG1hcmdpbjogNXB4O1wiPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cImZvbnQtc2l6ZTogMjBweDsgbWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5uYW1lfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5kYXRlfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L2Rpdj5cXG5cIlxuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICB9KTtcblxuICAgIGFyY2hpdmVXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICBHYW1lLndpbmRvd3MuYXJjaGl2ZS5zaG93KCk7XG4gIH0pO1xuXG4gIGFyY2hpdmVXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IHR5cGUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpO1xuICAgIGxldCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmICh0eXBlICYmIGlkKSB7XG4gICAgICBpZiAodHlwZSA9PSBcInJlbW92ZVwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5yZW1vdmUoaWQpO1xuICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwibG9hZFwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5sb2FkKGlkKTtcbiAgICAgICAgd2luLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
