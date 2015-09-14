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

  var popupCache = new Map();

  Game.popup = function (obj, text) {
    var adjustX = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var adjustY = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    if (popupCache.has(obj)) {
      var popup = popupCache.get(obj);
      Game.layers.dialogueLayer.removeChild(popup.container);
      clearInterval(popup.timer);
      popupCache["delete"](obj);
    }

    var dialogueText = new Sprite.Text({
      text: text,
      maxWidth: 200
    });

    var w = dialogueText.width;
    var h = dialogueText.height;
    var middle = Math.round((w + 10) / 2);

    var dialogueBox = new Sprite.Shape();

    dialogueBox.polygon({
      points: "0,0 " + (w + 10) + ",0 " + (w + 10) + "," + (h + 10) + " " + (middle + 5) + "," + (h + 10) + " " + middle + "," + (h + 15) + " " + (middle - 5) + "," + (h + 10) + " 0," + (h + 10) + " 0,0",
      fill: "white"
    });

    var dialogueContainer = new Sprite.Container();
    dialogueContainer.appendChild(dialogueBox, dialogueText);
    dialogueText.x = 5;
    dialogueText.y = 5;
    dialogueContainer.x = obj.x + adjustX;
    dialogueContainer.y = obj.y + adjustY;
    dialogueContainer.centerX = middle;
    dialogueContainer.centerY = h + 15;

    Game.layers.dialogueLayer.appendChild(dialogueContainer);

    if (obj instanceof Sprite.Event) {
      obj.on("change", function () {
        dialogueContainer.x = obj.x + adjustX;
        dialogueContainer.y = obj.y + adjustY;
      });
    }

    var timer = setTimeout(function () {
      if (popupCache.has(obj)) {
        var popup = popupCache.get(obj);
        Game.layers.dialogueLayer.removeChild(popup.container);
        popupCache["delete"](obj);
      }
    }, 3000);

    popupCache.set(obj, {
      container: dialogueContainer,
      timer: timer
    });
  };

  Game.ui = {};

  Game.ui.shortcut = function () {
    Game.choice({
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7
    }, function (choice) {
      if (typeof choice == "number" && choice >= 0) {
        Game.hero.data.bar[choice] = null;
        Game.ui.bar();
        Game.Window.show("uiWindow");
      }
    });
  };
})();