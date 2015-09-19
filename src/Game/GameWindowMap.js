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

  let win = Game.windows.map = Game.Window.create("mapWindow");

  win.html = `
    <div class="window-box">
      <button id="mapWindowClose" class="brownButton">关闭</button>
      <table><tbody><tr><td>
        <div id="mapWindowMap"></div>
      </td></tr></tbody></table>
    </div>
  `;

  win.css = `
    .mapWindow table, .mapWindow tbody, .mapWindow tr, .mapWindow td {
      width: 100%;
      height: 100%;
      magrin: 0;
      padding: 0;
    }

    .mapWindow {
      text-align: center;
    }

    #mapWindowClose {
      position: absolute;
      right: 50px;
      top: 50px;
      width: 120px;
      height: 60px;
      font-size: 16px;
    }

    #mapWindowMap img, #mapWindowMap canvas {
      max-width: 700px;
      max-height: 320px;
    }
  `;

  let mapWindowClose = win.querySelector("button#mapWindowClose");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  win.whenUp(["esc"], function (key) {
    mapWindowClose.click();
  });

  win.on("beforeShow", function (event) {
    if (Game.area && Game.area.map.minimap) {
      let div = win.querySelector("div#mapWindowMap");
      while(div.hasChildNodes()) {
        div.removeChild(div.lastChild);
      }
      div.appendChild(Game.area.map.minimap);
    }
  });


})();
