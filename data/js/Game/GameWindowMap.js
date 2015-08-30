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

  var win = Game.windows.map = new Game.Window("mapWindow");

  win.html("\n    <div class=\"window-box\">\n      <button id=\"mapWindowClose\">关闭</button>\n      <table><tbody><tr><td>\n        <div id=\"mapWindowMap\"></div>\n      </td></tr></tbody></table>\n    </div>\n  ");

  win.css("\n    #mapWindow table, #mapWindow tbody, #mapWindow tr, #mapWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    #mapWindow {\n      text-align: center;\n    }\n\n    #mapWindowClose {\n      position: absolute;\n      right: 5px;\n      top: 5px;\n      width: 60px;\n      height: 40px;\n    }\n\n    #mapWindowMap img, #mapWindowMap canvas {\n      max-width: 750px;\n      max-height: 400px;\n    }\n  ");

  var mapWindowClose = document.querySelector("button#mapWindowClose");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.map.showing()) {
      mapWindowClose.click();
    }
  });

  win.on("beforeShow", function (event) {
    if (Game.area && Game.area.map.minimap) {
      var div = document.querySelector("div#mapWindowMap");
      while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
      }
      div.appendChild(Game.area.map.minimap);
    }
  });
})();
//# sourceMappingURL=GameWindowMap.js.map
