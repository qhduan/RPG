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

  var win = Game.windows.map = new Game.Window("mapWindow");

  win.html(`
    <div class="window-box">
      <button id="mapWindowClose">关闭</button>
      <table><tbody><tr><td>
        <div id="mapWindowMap"></div>
      </td></tr></tbody></table>
    </div>
  `);

  win.css(`
    #mapWindow table, #mapWindow tbody, #mapWindow tr, #mapWindow td {
      width: 100%;
      height: 100%;
      magrin: 0;
      padding: 0;
    }

    #mapWindow {
      text-align: center;
    }

    #mapWindowClose {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 60px;
      height: 40px;
    }

    #mapWindowMap img, #mapWindowMap canvas {
      max-width: 750px;
      max-height: 400px;
    }
  `);

  var mapWindowClose = document.querySelector("button#mapWindowClose");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.map.showing) {
      mapWindowClose.click();
    }
  });

  win.on("beforeShow", function (event) {
    if (Game.area && Game.area.map.minimap) {
      var div = document.querySelector("div#mapWindowMap");
      while(div.hasChildNodes()) {
        div.removeChild(div.lastChild);
      }
      div.appendChild(Game.area.map.minimap);
    }
  });

}());
