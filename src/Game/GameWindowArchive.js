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

  var win = Game.windows.archive = new Game.Window("archiveWindow");

  win.html(`
    <div class="window-box">
      <div id="archiveWindowItemBar">
        <button id="archiveWindowClose" class="brownButton">关闭</button>
        <button id="archiveWindowSave" class="brownButton">保存</button>
      </div>
      <div id="archiveWindowTable"></div>
    </div>
  `);

  win.css(`
    #archiveWindowTable {
      width: 100%;
      overflow-y: auto;
      height: 360px;
    }

    .archiveItem {
      border: 4px solid gray;
      border-radius: 10px;
      margin: 10px 10px;
    }

    .archiveItem > button {
      width: 100px;
      height: 40px;
      border-radius: 5px;
    }

    #archiveWindowItemBar button {
      width: 100px;
      height: 30px;
      font-size: 16px;
      display: block;
      margin-bottom: 5px;
    }

    #archiveWindowClose {
      float: right;
    }
  `);

  var archiveWindowSave = document.querySelector("button#archiveWindowSave");
  var archiveWindowClose = document.querySelector("button#archiveWindowClose");
  var archiveWindowTable = document.querySelector("#archiveWindowTable");

  archiveWindowSave.addEventListener("click", function () {
    Game.stage.requestScreenshot(function (img) {
      var canvas=document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 45;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, 80, 45);
      var screenshot = canvas.toDataURL("image/jpeg");

      Game.archive.save({
        hero: Game.hero.data,
        screenshot: screenshot
      });

      Game.windows.archive.execute("open");
    });
  });

  archiveWindowClose.addEventListener("click", function () {
    Game.windows.archive.hide();
  });

  win.register("open", function () {

    if (Game.hero && Game.windows.main.showing() == false) {
      archiveWindowSave.style.visibility = "visible";
    } else {
      archiveWindowSave.style.visibility = "hidden";
    }

    var table = archiveWindowTable;

    while(table.hasChildNodes()) {
      table.removeChild(table.lastChild);
    }

    var list = Game.archive.list();
    list.forEach(function (element) {
      var div = document.createElement("div");
      div.classList.add("archiveItem");

      var archive = Game.archive.get(`SAVE_${element}`);

      var removeButton = document.createElement("button");
      removeButton.style.float = "right";
      removeButton.textContent = "REMOVE";
      div.appendChild(removeButton);
      removeButton.addEventListener("click", function () {
        Game.archive.remove(`SAVE_${element}`);
        Game.windows.archive.execute("open");
      });

      var loadButton = document.createElement("button");
      loadButton.style.float = "right";
      loadButton.textContent = "LOAD";
      div.appendChild(loadButton);
      loadButton.addEventListener("click", function () {
        Game.archive.load(`SAVE_${element}`);
        Game.windows.archive.hide();
      });

      var screenshot = new Image();
      screenshot.width = "80";
      screenshot.height = "45";
      screenshot.alt = "存档截图";
      if (archive.screenshot) {
        screenshot.src = archive.screenshot;
      }
      screenshot.style.display = "inline-block";
      screenshot.style.margin = "5px";
      div.appendChild(screenshot);

      var heroName = document.createElement("label");
      heroName.innerHTML = archive.name;
      heroName.style.fontSize = "20px";
      heroName.style.margin = "10px";
      div.appendChild(heroName);

      var time = document.createElement("label");
      time.innerHTML = archive.date;
      div.appendChild(time);

      table.appendChild(div);
    });

    Game.windows.archive.show();
  });

}());
