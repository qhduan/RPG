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

(function (Game) {
  "use strict";

  Game.AI = class AI {

    static hint () {
      var heroPosition = Game.area.map.tile(Game.hero.x, Game.hero.y);
      var heroDirection = Game.hero.sprite.currentAnimation.match(/up|left|down|right/)[0];
      var heroFace = Sprite.copy(heroPosition);

      switch (heroDirection) {
        case "up":
          heroFace.y -= 1;
          break;
        case "down":
          heroFace.y += 1;
          break;
        case "left":
          heroFace.x -= 1;
          break;
        case "right":
          heroFace.x += 1;
          break;
      }

      var hint = null;

      function FindUnderHero (element) {
        if (hint != null || element == Game.hero) {
          return;
        }
        var t = Game.area.map.tile(element.x, element.y);
        if (t.x == heroPosition.x && t.y == heroPosition.y) {
          hint = element;
        }
      }

      function FindFaceHero (element) {
        if (hint != null || element == Game.hero) {
          return;
        }
        var t = Game.area.map.tile(element.x, element.y);
        if (t.x == heroFace.x && t.y == heroFace.y) {
          hint = element;
        }
      }

      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindUnderHero);
      // 找最近尸体 Game.area.actors
      Sprite.each(Game.area.bags, FindUnderHero);
      // 最近的门
      Game.area.doors.forEach(FindUnderHero);
      // 最近的箱子
      Game.area.chests.forEach(FindUnderHero);
      // 最近的提示物（例如牌子）
      Game.area.hints.forEach(FindUnderHero);


      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindFaceHero);
      // 找最近尸体 Game.area.actors
      Sprite.each(Game.area.bags, FindFaceHero);
      // 最近的门
      Game.area.doors.forEach(FindFaceHero);
      // 最近的箱子
      Game.area.chests.forEach(FindFaceHero);
      // 最近的提示物（例如牌子）
      Game.area.hints.forEach(FindFaceHero);


      if (Game.hintObject && Game.hintObject != hint) {
        Game.hintObject = null;
        Game.windows.interface.use.style.visibility = "hidden";
      }

      if (hint != null) {
        Game.hintObject = hint;
        Game.windows.interface.use.style.visibility = "visible";
        if (hint.type == "door") {
          Game.popup(hint, hint.description, 0, -30);
        }
      }
    }

    static actor () {
      if (Game.area && Game.area.actors) {
        Sprite.each(Game.area.actors, function (actor) {

          if (actor.data.type == "hero") {
            var barChanged = false;

            if (actor.data.hp < actor.data.$hp) {
              actor.data.hp++;
              barChanged = true;
            }

            if (actor.data.sp < actor.data.$sp) {
              actor.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              actor.refreshBar();
            }
          } else if (actor.data.type == "monster") {

            var barChanged = false;

            if (actor.data.hp < actor.data.$hp) {
              actor.data.hp++;
              barChanged = true;
            }

            if (actor.data.sp < actor.data.$sp) {
              actor.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              actor.refreshBar();
            }

            if (Game.hero && Game.hero.distance(actor) <= 32) {
              if (actor.y == Game.hero.y) { // left or right
                if (actor.x < Game.hero.x) { // left
                  actor.fire("sword01", "right");
                } else { // right
                  actor.fire("sword01", "left");
                }
              } else { // up or down
                if (actor.y < Game.hero.y) { // up
                  actor.fire("sword01", "down");
                } else { // down
                  actor.fire("sword01", "up");
                }
              }
            } else if (Game.hero && Game.hero.distance(actor) < 200) {
              actor.goto(Game.hero.x, Game.hero.y, "walk", true);
            } else if (actor.data.mode == "patrol") {
              if (Math.random() < 0.8) {
                return;
              }
              var x = actor.x;
              var y = actor.y;
              actor.goto(x + Sprite.rand(-50, 50), y + Sprite.rand(-50, 50), 4);
            }
          }
        });
      }
    }

    static start () {
      setInterval(function () {
        Game.AI.actor();
      }, 500);

      var skip = 0;
      Sprite.Ticker.on("tick", function () {
        if (Game.area && Game.area.actors && Game.area.bags) {
          skip++;
          if (skip % 5 == 0)
            Game.AI.hint();
        }
      });
    }

  };
})(Game);
