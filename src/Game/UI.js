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

( () => {
  "use strict";

  let popupCache = new Map();

  Game.assign("popup", (obj, text, adjustX = 0, adjustY = 0) => {

    if (popupCache.has(obj)) {
      let popup = popupCache.get(obj);
      Game.layers.dialogueLayer.removeChild(popup.container);
      clearInterval(popup.timer);
      popupCache.delete(obj);
    }

    let dialogueText = new Sprite.Text({
      text: text,
      maxWidth: 200,
    });

    let w = dialogueText.width;
    let h = dialogueText.height;
    let middle = Math.round((w + 10) / 2);

    let dialogueBox = new Sprite.Shape();

    dialogueBox.polygon({
      points: `0,0 ${w+10},0 ${w+10},${h+10} ${middle+5},${h+10} ${middle},${h+15} ${middle-5},${h+10} 0,${h+10} 0,0`,
      fill: "white"
    });

    let dialogueContainer = new Sprite.Container();
    dialogueContainer.appendChild(dialogueBox, dialogueText);
    dialogueText.x = 5;
    dialogueText.y = 5;
    dialogueContainer.x = obj.x + adjustX;
    dialogueContainer.y = obj.y + adjustY;
    dialogueContainer.centerX = middle;
    dialogueContainer.centerY = h + 15;

    Game.layers.dialogueLayer.appendChild(dialogueContainer);

    if (obj instanceof Sprite.Event) {
      obj.on("change", () => {
        dialogueContainer.x = obj.x + adjustX;
        dialogueContainer.y = obj.y + adjustY;
      });
    }

    let timer = setTimeout(() => {
      if (popupCache.has(obj)) {
        let popup = popupCache.get(obj);
        Game.layers.dialogueLayer.removeChild(popup.container);
        popupCache.delete(obj);
      }
    }, 3000);

    popupCache.set(obj, {
      container: dialogueContainer,
      timer: timer
    });
  });


})();
