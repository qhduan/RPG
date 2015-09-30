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

  var win = Game.windows.map = Game.Window.create("mapWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"mapWindowClose\" class=\"brownButton\">关闭</button>\n      <table><tbody><tr><td>\n        <div id=\"mapWindowMap\"></div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .mapWindow table, .mapWindow tbody, .mapWindow tr, .mapWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .mapWindow {\n      text-align: center;\n    }\n\n    #mapWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #mapWindowMap img, #mapWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var mapWindowClose = win.querySelector("#mapWindowClose");
  var mapWindowMap = win.querySelector("#mapWindowMap");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      mapWindowClose.click();
    }, 20);
  });

  win.on("beforeShow", function (event) {
    if (Game.stage && Game.area && Game.area.map) {
      var stage = {
        x: Game.stage.x,
        y: Game.stage.y,
        centerX: Game.stage.centerX,
        centerY: Game.stage.centerY
      };
      Game.stage.x = 0;
      Game.stage.y = 0;
      Game.stage.centerX = 0;
      Game.stage.centerY = 0;
      var canvas = document.createElement("canvas");
      canvas.width = Game.area.map.width;
      canvas.height = Game.area.map.height;
      var context = canvas.getContext("2d");
      Game.stage.draw(context);
      var minimap = document.createElement("canvas");
      minimap.width = Math.floor(canvas.width / 8);
      minimap.height = Math.floor(canvas.height / 8);
      var minimapContext = minimap.getContext("2d");
      minimapContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, minimap.width, minimap.height);
      context = null;
      canvas = null;
      mapWindowMap.innerHTML = "";
      mapWindowMap.appendChild(minimap);
      Game.stage.x = stage.x;
      Game.stage.y = stage.y;
      Game.stage.centerX = stage.centerX;
      Game.stage.centerY = stage.centerY;
    }
  });
})();
//# sourceMappingURL=GameWindowMap.js.map
