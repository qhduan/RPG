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
"use strict";

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
    isPressed: function isPressed(keyStr) {
      if (pressed.hasOwnProperty(keyStr)) return pressed[keyStr];
      return pressed[keyTable[keyStr]];
    }
  };

  function HotKey(keyCode) {

    if (Game.dialogue.talkBox && Game.dialogue.talkBox.visible) return;

    if (keyCode == keyTable["m"]) {
      // map
      Game.ui.openMap();
    }
    if (keyCode == keyTable["i"]) {
      // map
      Game.ui.openInformation();
    }
    if (keyCode == keyTable["b"]) {
      // map
      Game.ui.openItem();
    }
    if (keyCode == keyTable["e"]) {
      // map
      if (Game.hintObject) {
        if (Game.hintObject.contact) Game.hintObject.contact();else if (Game.hintObject.pickup) Game.hintObject.pickup();
      }
    }
  };

  Game.initInput = function () {

    Game.stage.on("stagemousedown", function (event) {
      pressed["mouse"] = true;
      //Game.hero.gotoXY(x, y);
      //console.log();
    });

    Game.stage.on("stagemouseup", function (event) {
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    Game.stage.on("mouseleave", function (event) {
      // mouse leave canvas
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    window.addEventListener("keydown", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      pressed[keyCode] = true;
      HotKey(keyCode);
    });

    window.addEventListener("keyup", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      if (pressed.hasOwnProperty(keyCode)) {
        delete pressed[keyCode];
      }
    });

    Sprite.Ticker.on("tick", function () {

      if (!Game.hero) return;
      if (!Game.area) return;
      if (!Game.area.map) return;

      var speed = Game.config.walk;
      var skew = Game.config.walk / 1.4;

      if (Game.key.isPressed("shift")) {
        // run key
        speed = Game.config.run;
        skew = Game.config.run / 1.4;
      }

      var state;
      if (Game.key.isPressed("shift")) state = "run";else state = "walk";

      // 计算八个方向角色的动画和面向
      if (Game.key.isPressed("up") && Game.key.isPressed("right")) {
        Game.hero.go(state, "upright", skew);
      } else if (Game.key.isPressed("down") && Game.key.isPressed("right")) {
        Game.hero.go(state, "downright", skew);
      } else if (Game.key.isPressed("down") && Game.key.isPressed("left")) {
        Game.hero.go(state, "downleft", skew);
      } else if (Game.key.isPressed("up") && Game.key.isPressed("left")) {
        Game.hero.go(state, "upleft", skew);
      } else if (Game.key.isPressed("left")) {
        Game.hero.go(state, "left", speed);
      } else if (Game.key.isPressed("up")) {
        Game.hero.go(state, "up", speed);
      } else if (Game.key.isPressed("right")) {
        Game.hero.go(state, "right", speed);
      } else if (Game.key.isPressed("down")) {
        Game.hero.go(state, "down", speed);
      } else if (Game.key.isPressed("mouse")) {
        if (Game.uiLayer.numChildren > 1) {
          return;
        }
        var x = Game.stage.center.x + Game.stage.mouseX / Game.stage.scaleX;
        var y = Game.stage.center.y + Game.stage.mouseY / Game.stage.scaleY;
        if (Game.uiLayer.hitTest(x, y)) {
          return;
        }
        x -= Game.hero.x;
        y -= Game.hero.y;

        if (Math.abs(Math.abs(x) - Math.abs(y)) < 40) {
          if (x < 0 && y < 0) {
            // left up
            Game.hero.go(state, "upleft", skew);
          } else if (x > 0 && y < 0) {
            // right up
            Game.hero.go(state, "upright", skew);
          } else if (x < 0 && y > 0) {
            // left down
            Game.hero.go(state, "downleft", skew);
          } else if (x > 0 && y > 0) {
            // right down
            Game.hero.go(state, "downright", skew);
          }
        } else if (Math.abs(x) > Math.abs(y)) {
          // left or right
          if (x < 0) {
            // left
            Game.hero.go(state, "left", speed);
          } else {
            // right
            Game.hero.go(state, "right", speed);
          }
        } else if (Math.abs(x) < Math.abs(y)) {
          // up or down
          if (y < 0) {
            // up
            Game.hero.go(state, "up", speed);
          } else {
            // down
            Game.hero.go(state, "down", speed);
          }
        }
      } else {
        Game.hero.stop();
      }

      function SkillFire(num) {
        var element = Game.hero.data.bar[num];
        if (element) {
          if (element.type == "skill") {
            Game.hero.fire(element.id);
          } else if (element.type == "item") {}
        }
      }

      if (Game.key.isPressed("1")) {
        SkillFire(0);
      }

      if (Game.key.isPressed("2")) {
        SkillFire(1);
      }

      if (Game.key.isPressed("3")) {
        SkillFire(2);
      }

      if (Game.key.isPressed("4")) {
        SkillFire(3);
      }

      if (Game.key.isPressed("5")) {
        SkillFire(4);
      }

      if (Game.key.isPressed("6")) {
        SkillFire(5);
      }

      Game.hero.focus();
    });
  }; // Game.oninit
})();
//# sourceMappingURL=GameInput.js.map
