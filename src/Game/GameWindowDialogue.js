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

  let win = Game.Window.create("dialogue");

  win.html = `
    <div class="window-box">
      <div style="width: 100%; height: 100%;">
        <span id="dialogueWindowSpeaker"></span>
        <table><tbody><tr><td>
          <span id="dialogueWindowContent"></span>
        </td></tr></tbody></table>
        <button id="dialogueWindowNext" style="display: block;" class="brownButton">继续</button>
        <button id="dialogueWindowClose" style="display: none;" class="brownButton">结束</button>
      </div>
    </div>
  `;

  win.css = `
    #dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      text-align: center;
    }

    #dialogueWindowSpeaker {
      position: absolute;
      left: 50px;
      top: 50px;
      font-size: 30px;
      font-weight: bold;
    }

    #dialogueWindow button {
      width: 120px;
      height: 60px;
      font-size: 16px;
      position: absolute;
    }

    #dialogueWindowNext {
      bottom: 50px;
      right: 100px;
    }

    #dialogueWindowClose {
      bottom: 50px;
      right: 100px;
    }

    #dialogueWindowContent {
      font-size: 24px;
      text-align: center;
    }
  `;

  let dialogueWindowSpeaker = document.querySelector("#dialogueWindowSpeaker");

  let dialogueContent = [];
  let dialogueIndex = 0;
  let dialogueWindowNext = document.getElementById("dialogueWindowNext");
  let dialogueWindowClose = document.getElementById("dialogueWindowClose");
  let dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    DialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    setTimeout(function () {
      Game.windows.dialogue.hide();
      dialogueContent = [];
      dialogueIndex = 0;
    }, 20);
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

  win.whenUp(["enter", "space", "esc"], function () {
    if (Game.windows.dialogue.showing) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });


})();
