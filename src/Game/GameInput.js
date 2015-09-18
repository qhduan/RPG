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
    let state = "run";
    if (Sprite.Input.isPressed("shift")) {
      state = "walk";
    }

    if (Sprite.Input.isPressed("left")) {
      Game.hero.go(state, "left");
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up");
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right");
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down");
    }
  }

  Game.initInput = function () {
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

    Game.windows.stage.on("mousedown", function (event) {
      let data = event.data;

      // console.log(data.x, data.y, Game.hero.sprite.x, Game.hero.sprite.y, Game.hero.sprite.hitTest(data.x, data.y));

      data.x += Game.stage.centerX;
      data.y += Game.stage.centerY;

      data.x = Math.floor(data.x / 32);
      data.y = Math.floor(data.y / 32);

      if (Game.hero.x != data.x || Game.hero.y != data.y) {
        Game.hero.goto(data.x, data.y, "run", function () {
          if (Game.hintObject && Game.hintObject.heroUse) {
            Game.hintObject.heroUse();
          }
        });
      }
    });

    Sprite.Ticker.on("tick", function () {

      if (Game.paused) return;
      if (!Game.hero) return;
      if (!Game.area) return;
      if (!Game.area.map) return;

      let state;
      if (Sprite.Input.isPressed("shift")) {
        state = "run";
      } else {
        state = "walk";
      }

      CheckHeroAction();
      if (!Game.hero.walking) {
        Game.hero.stop();
      }

      Game.hero.focus();
    });
  }; // Game.oninit


})();
