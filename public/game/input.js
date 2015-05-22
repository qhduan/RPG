/*

Online A-RPG Game, Built using Node.js + createjs
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

  var keyTable = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "shift": 16,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57
  };

  var pressed = {};

  // 封装Game.key.isPressed方法，用来检测某个案件是否按下
  // usage: if (Game.key.isPressed("left")) { /* true */ } else { /* false */ }
  Game.key = {
    isPressed: function (keyStr) {
      if (pressed.hasOwnProperty(keyStr))
        return pressed[keyStr];
      return pressed[keyTable[keyStr]];
    }
  };

  Game.oninit(function () {

    Game.stage.on("stagemousedown", function (event) {
      pressed["mouse"] = true;
      //Game.hero.gotoXY(x, y);
    });

    Game.stage.on("stagemouseup", function (event) {
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    Game.stage.on("mouseleave", function (event) { // mouse leave canvas
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    window.addEventListener("keydown", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      pressed[keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      if (pressed.hasOwnProperty(keyCode)) {
        delete pressed[keyCode];
      }
    });

    createjs.Ticker.on("tick", function () {

      if (!Game.hero) return;
      if (!Game.currentArea) return;

      var speed = Game.config.walk;
      var skew = Game.config.walk / 1.4;

      if (Game.key.isPressed("shift")) { // run key
        speed = Game.config.run;
        skew = Game.config.run / 1.4;
      }

      var state;
      if (Game.key.isPressed("shift"))
        state = "run";
      else
        state = "walk";

      var moved = false;
      // 计算八个方向角色的动画和面向
      if (Game.key.isPressed("up") && Game.key.isPressed("right")) {
        moved = Game.hero.go(state + "up", skew);
        moved = Game.hero.go(state + "right", skew, false) || moved;
        if (!moved) Game.hero.face("up");
      } else if (Game.key.isPressed("down") && Game.key.isPressed("right")) {
        moved = Game.hero.go(state + "down", skew);
        moved = Game.hero.go(state + "right", skew, false) || moved;
        if (!moved) Game.hero.face("down");
      } else if (Game.key.isPressed("down") && Game.key.isPressed("left")) {
        moved = Game.hero.go(state + "down", skew);
        moved = Game.hero.go(state + "left", skew, false) || moved;
        if (!moved) Game.hero.face("down");
      } else if (Game.key.isPressed("up") && Game.key.isPressed("left")) {
        moved = Game.hero.go(state + "up", skew);
        moved = Game.hero.go(state + "left", skew, false) || moved;
        if (!moved) Game.hero.face("up");
      } else if (Game.key.isPressed("left")) {
        moved = Game.hero.go(state + "left", speed);
        if (!moved) Game.hero.face("left");
      } else if (Game.key.isPressed("up")) {
        moved = Game.hero.go(state + "up", speed);
        if (!moved) Game.hero.face("up");
      } else if (Game.key.isPressed("right")) {
        moved = Game.hero.go(state + "right", speed);
        if (!moved) Game.hero.face("right");
      } else if (Game.key.isPressed("down")) {
        moved = Game.hero.go(state + "down", speed);
        if (!moved) Game.hero.face("down");
      } else {
        Game.hero.stop();
      }

      if (Game.hero.spells && Game.hero.spells.length) {
        if (Game.key.isPressed("z")) {
          if (Game.hero.spells[0]) {
            Game.hero.fire(Game.hero.spells[0]);
          }
        }
      }

      Game.hero.focus();
    });
  }); // Game.oninit

})();
