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

  var win = Game.windows.dialogue = new Game.Window("dialogueWindow");

  win.html("\n    <div style=\"width: 100%; height: 100%;\">\n      <div style=\"position: absolute; left: 10%; top: 35%; width: 80%; height: 30%; background-color: rgba(100, 100, 100, 0.8);\">\n        <span id=\"dialogueWindowSpeaker\"></span>\n        <table><tbody><tr><td>\n          <div id=\"dialogueWindowContent\" style=\"\"></div>\n        </td></tr></tbody></table>\n        <button id=\"dialogueWindowNext\" style=\"display: block;\" class=\"brownButton\">继续</button>\n        <button id=\"dialogueWindowClose\" style=\"display: none;\" class=\"brownButton\">结束</button>\n      </div>\n    </div>\n  ");

  win.css("\n    #dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {\n      margin: 0;\n      padding: 0;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n    }\n\n    #dialogueWindowSpeaker {\n      position: absolute;\n      left: 5px;\n      top: 5px;\n    }\n\n    #dialogueWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      position: absolute;\n    }\n\n    #dialogueWindowNext {\n      bottom: 5px;\n      right: 10px;\n    }\n\n    #dialogueWindowClose {\n      bottom: 5px;\n      right: 10px;\n    }\n\n    #dialogueContent {\n      font-size: 30px;\n      font-weight: bold;\n      color: white;\n      text-align: center;\n    }\n  ");

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
    dialogueWindowSpeaker.textContent = name + "：";
    dialogueContent = content;
    dialogueIndex = 0;
    DialogueNext();
    Game.windows.dialogue.show();
  };

  function DialogueNext() {
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
})();
//# sourceMappingURL=GameWindowDialogue.js.map
