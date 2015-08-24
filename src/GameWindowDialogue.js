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

  var win = Game.windows.dialogue = new Game.Window("dialogueWindow");

  win.html(`
    <div style="width: 100%; height: 100%; background-color: rgba(100, 100, 100, 0.8);">
      <div id="dialogueWindowContent" style="width: 600px; height: 300px; position: absolute; left: 100px; top: 100px;">
      </div>
      <div style="width: 100px; height: 80px; position: absolute; left: 500px; top: 360px;">
        <button id="dialogueWindowNext" style="display: block;">继续</button>
        <button id="dialogueWindowClose" style="display: none;">结束</button>
      </div>
    </div>
  `);

  win.css(`
    #dialogueWindow button {
      width: 60px;
      height: 40px;
      font-size: 16px;
    }

    #dialogueContent {
      font-size: 30px;
      font-weight: bold;
      color: white;
      text-align: center;
    }
  `);

  var dialogueContent = [];
  var dialogueIndex = 0;
  var dialogueWindowNext = document.getElementById("dialogueWindowNext");
  var dialogueWindowClose = document.getElementById("dialogueWindowClose");
  var dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    Game.dialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    Game.windows.dialogue.hide();
    dialogueContent = [];
    dialogueIndex = 0;
  });

  Game.dialogue = function (content) {
    dialogueWindowNext.style.display = "block";
    dialogueWindowClose.style.display = "none";
    dialogueContent = content;
    dialogueIndex = 0;
    Game.dialogueNext();
    Game.windows.dialogue.show();
  };

  Game.dialogueNext = function () {
    dialogueWindowContent.textContent = dialogueContent[dialogueIndex];
    dialogueIndex++;
    if (dialogueIndex >= dialogueContent.length) {
      dialogueWindowNext.style.display = "none";
      dialogueWindowClose.style.display = "block";
    }
  };

  Sprite.Input.whenDown(["enter", "space"], function () {
    if (Game.windows.dialogue.showing()) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });

}());
