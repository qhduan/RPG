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


  function CheckHeroAction () {
    if (Game.paused) return;

    let state = "run";
    if (Sprite.Input.isPressed("shift")) {
      state = "walk";
    }

    if (Sprite.Input.isPressed("left")) {
      Game.hero.go(state, "left", CheckHeroAction);
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up", CheckHeroAction);
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right", CheckHeroAction);
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down", CheckHeroAction);
    }
  }

  let destIcon = null;

  Game.assign("Input", class GameInput {

    static clearDest () {
      destIcon.visible = false;
    }

    static setDest (x, y) {
      destIcon.x = x * 32 + 16;
      destIcon.y = y * 32 + 16;
      destIcon.visible = true;
    }

    static init () {

      destIcon = new Sprite.Shape();
      destIcon.circle({
        cx: 5,
        cy: 5,
        r: 5,
        stroke: "red",
        fill: "green"
      });
      destIcon.visible = false;
      destIcon.centerX = 5;
      destIcon.centerY = 5;

      Game.windows.stage.on("mousedown", function (event) {
        let data = event.data;

        data.x += Game.stage.centerX;
        data.y += Game.stage.centerY;

        data.x = Math.floor(data.x / 32);
        data.y = Math.floor(data.y / 32);

        if (!Game.layers.infoLayer.hasChild(destIcon)) {
          Game.layers.infoLayer.appendChild(destIcon);
        }

        if (Game.hero.x != data.x || Game.hero.y != data.y) {
          Game.hero.goto(data.x, data.y, "run", function () {
            destIcon.visible = false;
            if (Game.hintObject && Game.hintObject.heroUse) {
              Game.hintObject.heroUse();
            }
          });
          /*
          if (destPosition) {
            destIcon.x = data.x * 32 + 16;
            destIcon.y = data.y * 32 + 16;
            destIcon.visible = true;
          }
          */
        }
      });

      Sprite.Ticker.on("tick", function () {

        if (Game.paused) return;
        if (!Game.hero) return;
        if (!Game.area) return;
        if (!Game.area.map) return;

        CheckHeroAction();
        if (!Game.hero.walking) {
          Game.hero.stop();
        }

        Game.hero.focus();
      });
    }
  });

  Game.assign("initInput", function () {





  /*
    let mousePressed = false;

    Game.stage.on("stagemousedown", function (event) {
      mousePressed = true;
    });

    Game.stage.on("stagemouseup", function (event) {
      mousePressed = false;
    });

    Game.stage.on("mouseleave", function (event) { // mouse leave canvas
      mousePressed = false;
    });
    */
  }); // Game.oninit


})();
