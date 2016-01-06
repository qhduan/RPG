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

import Game from "../Base.js";
import Window from "../Window.js";

let win = Window.create("dialogueWindow");

let WindowDialogue = win;
export default WindowDialogue;

import css from "../CSS/Dialogue.scss";
import html from "../HTML/Dialogue.html";

win.css = css;
win.html = html;

let dialogueWindowSpeaker = win.querySelector("#dialogueWindowSpeaker");

let dialogueContent = [];
let dialogueIndex = 0;
let dialogueWindowNext = document.getElementById("dialogueWindowNext");
let dialogueWindowClose = document.getElementById("dialogueWindowClose");
let dialogueWindowContent = document.getElementById("dialogueWindowContent");

dialogueWindowNext.addEventListener("click", () => {
  DialogueNext();
});

dialogueWindowClose.addEventListener("click", () => {
  setTimeout( () => {
    Game.windows.dialogue.hide();
    dialogueContent = [];
    dialogueIndex = 0;
  }, 20);
});

Game.dialogue = (content, name) => {
  dialogueWindowNext.style.display = "block";
  dialogueWindowClose.style.display = "none";
  if (name && name.length) {
    dialogueWindowSpeaker.textContent = `${name}：`;
  } else {
    dialogueWindowSpeaker.textContent = "";
  }
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

win.whenUp(["enter", "space", "esc"], () => {
  if (Game.windows.dialogue.showing) {
    if (dialogueWindowNext.style.display != "none") {
      dialogueWindowNext.click();
    } else if (dialogueWindowClose.style.display != "none") {
      dialogueWindowClose.click();
    }
  }
});
