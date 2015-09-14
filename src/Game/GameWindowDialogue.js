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
    <div style="width: 100%; height: 100%;">
      <div style="position: absolute; left: 10%; top: 35%; width: 80%; height: 30%; background-color: rgba(100, 100, 100, 0.8);">
        <span id="dialogueWindowSpeaker"></span>
        <table><tbody><tr><td>
          <div id="dialogueWindowContent" style=""></div>
        </td></tr></tbody></table>
        <button id="dialogueWindowNext" style="display: block;" class="brownButton">继续</button>
        <button id="dialogueWindowClose" style="display: none;" class="brownButton">结束</button>
      </div>
    </div>
  `);

  win.css(`
    #dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      text-align: center;
    }

    #dialogueWindowSpeaker {
      position: absolute;
      left: 5px;
      top: 5px;
    }

    #dialogueWindow button {
      width: 60px;
      height: 40px;
      font-size: 16px;
      position: absolute;
    }

    #dialogueWindowNext {
      bottom: 5px;
      right: 10px;
    }

    #dialogueWindowClose {
      bottom: 5px;
      right: 10px;
    }

    #dialogueContent {
      font-size: 30px;
      font-weight: bold;
      color: white;
      text-align: center;
    }
  `);

  var dialogueWindowSpeaker = document.querySelector("#dialogueWindowSpeaker");

  var dialogueContent = [];
  var dialogueIndex = 0;
  var dialogueWindowNext = document.getElementById("dialogueWindowNext");
  var dialogueWindowClose = document.getElementById("dialogueWindowClose");
  var dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    DialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    Game.windows.dialogue.hide();
    dialogueContent = [];
    dialogueIndex = 0;
  });

  Game.dialogue = function (content, name) {
    dialogueWindowNext.style.display = "block";
    dialogueWindowClose.style.display = "none";
    dialogueWindowSpeaker.textContent =  `${name}：`;
    dialogueContent = content;
    dialogueIndex = 0;
    DialogueNext();
    Game.windows.dialogue.show();
  };

  function DialogueNext () {
    dialogueWindowContent.textContent = dialogueContent[dialogueIndex];
    dialogueIndex++;
    if (dialogueIndex >= dialogueContent.length) {
      dialogueWindowNext.style.display = "none";
      dialogueWindowClose.style.display = "block";
    }
  };

  Sprite.Input.whenDown(["enter", "space"], function () {
    if (Game.windows.dialogue.showing) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });

}());
