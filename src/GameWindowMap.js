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
      <div id="mapWindowMap"></div>
    </div>
  `);

  win.css(`
    #mapWindow {
      text-align: center;
    }

    #mapWindowClose {
      position: absolute;
      left: 20px;
      top: 20px;
      width: 60px;
      height: 40px;
    }

    #mapWindowMap img, #mapWindowMap canvas {
      max-width: 750px;
      max-height: 400px;
    }
  `);

  document.querySelector("button#mapWindowClose").addEventListener("click", function (event) {
    Game.windows.map.hide();
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
