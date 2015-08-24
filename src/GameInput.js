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


  Game.initInput = function () {

    var mousePressed = false;

    Game.stage.on("stagemousedown", function (event) {
      mousePressed = true;
      //Game.hero.gotoXY(x, y);
      //console.log();
    });

    Game.stage.on("stagemouseup", function (event) {
      mousePressed = false;
    });

    Game.stage.on("mouseleave", function (event) { // mouse leave canvas
      mousePressed = false;
    });

    Sprite.Ticker.on("tick", function () {

      if (!Game.hero) return;
      if (!Game.area) return;
      if (!Game.area.map) return;

      var speed = Game.config.walk;
      var skew = Game.config.walk / 1.4;

      if (Sprite.Input.isPressed("shift")) { // run key
        speed = Game.config.run;
        skew = Game.config.run / 1.4;
      }

      var state;
      if (Sprite.Input.isPressed("shift"))
        state = "run";
      else
        state = "walk";

      // 计算八个方向角色的动画和面向
      if (Sprite.Input.isPressed("up") && Sprite.Input.isPressed("right")) {
        Game.hero.go(state, "upright", skew);
      } else if (Sprite.Input.isPressed("down") && Sprite.Input.isPressed("right")) {
        Game.hero.go(state, "downright", skew);
      } else if (Sprite.Input.isPressed("down") && Sprite.Input.isPressed("left")) {
        Game.hero.go(state, "downleft", skew);
      } else if (Sprite.Input.isPressed("up") && Sprite.Input.isPressed("left")) {
        Game.hero.go(state, "upleft", skew);
      } else if (Sprite.Input.isPressed("left")) {
        Game.hero.go(state, "left", speed);
      } else if (Sprite.Input.isPressed("up")) {
        Game.hero.go(state, "up", speed);
      } else if (Sprite.Input.isPressed("right")) {
        Game.hero.go(state, "right", speed);
      } else if (Sprite.Input.isPressed("down")) {
        Game.hero.go(state, "down", speed);
      } else if (mousePressed) {
        //var x = Game.stage.center.x + Game.stage.mouseX / Game.stage.scaleX;
        //var y = Game.stage.center.y + Game.stage.mouseY / Game.stage.scaleY;
        //if (Game.uiLayer.hitTest(x, y)) {
        //  return;
        //}
        var x = Game.stage.mouseX;
        var y = Game.stage.mouseY;
        x -= Game.stage.width/2;
        y -= Game.stage.height/2;

        //console.log(Game.stage.mouseX, Game.stage.mouseY, x, y, Game.stage.width, Game.stage.height);

        if (Math.abs(Math.abs(x) - Math.abs(y)) < 40) {
          if (x < 0 && y < 0) { // left up
            Game.hero.go(state, "upleft", skew);
          } else if (x > 0 && y < 0) { // right up
            Game.hero.go(state, "upright", skew);
          } else if (x < 0 && y > 0) { // left down
            Game.hero.go(state, "downleft", skew);
          } else if (x > 0 && y > 0) { // right down
            Game.hero.go(state, "downright", skew);
          }
        } else if (Math.abs(x) > Math.abs(y)) { // left or right
          if (x < 0) { // left
            Game.hero.go(state, "left", speed);
          } else { // right
            Game.hero.go(state, "right", speed);
          }
        } else if (Math.abs(x) < Math.abs(y)) { // up or down
          if (y < 0) { // up
            Game.hero.go(state, "up", speed);
          } else { // down
            Game.hero.go(state, "down", speed);
          }
        }
      } else {
        Game.hero.stop();
      }

      Game.hero.focus();
    });
  }; // Game.oninit

})();
