/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  Game.dialogue = {};

    /*
  Game.oninit(function () {
    var talkBox = Game.dialogue.talkBox = new createjs.DOMElement("talkBox");
    Game.dialogueLayer.appendChild(talkBox);
    talkBox.center.x = 300;
    talkBox.center.y = 20;
    talkBox.visible = 0;

    Sprite.Ticker.on("tick", function () {
      if (Game.hero) {
        talkBox.x = Game.hero.x;
        talkBox.y = Game.hero.y;
      }
    });
  });
  */

  Game.dialogue.talkHistory = [];

  Game.dialogue.talk = function () {
    // 发送聊天信息
    if (Game.dialogue.talkBox)  {
      if (Game.dialogue.talkBox.visible) {
        Game.dialogue.talkBox.visible = 0;
        var text = document.getElementById("talkInput").value;
        document.getElementById("talkInput").value = "";
        if (text.trim().length) {
          Game.io.talk(text.trim());
        }
      } else {
        Game.dialogue.talkBox.visible = 1;
        document.getElementById("talkInput").focus();
        setTimeout(function () {
          document.getElementById("talkInput").focus()
        }, 100);
      }
      Game.update();
    }
  }

  document.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    if (keyCode == 13) { // Enter
      Game.dialogue.talk();
    }
  });


})();
