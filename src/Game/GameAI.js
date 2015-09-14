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
      if (Game.hero) {

        var heroPosition = Game.hero.position;
        var heroFace = Game.hero.facePosition;

        var hint = null;

        function FindUnderHero (element) {
          if (hint != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            hint = element;
          } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
            hint = element;
          }
        }

        function FindFaceHero (element) {
          if (hint != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
            hint = element;
          } else if (element.x == heroFace.x && element.y == heroFace.y) {
            hint = element;
          }
        }

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.touch, FindUnderHero);

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
            Game.popup({x: hint.x*32+16, y: hint.y*32+16}, hint.description, 0, -30);
          } else if (hint.type == "touch") {
            if (hint.showmap) {
              Game.layers.mapLayer.children.forEach(function (element) {
                if (hint.showmap.indexOf(element.name) != -1) {
                  if (element.visible == false) {
                    element.visible = true;
                    element.alpha = 0.01;
                    Sprite.Tween.get(element).to({alpha: 1}, 200);
                  }
                }
              });
            } // showmap
            if (hint.hidemap) {
              Game.layers.mapLayer.children.forEach(function (element) {
                if (hint.hidemap.indexOf(element.name) != -1) {
                  if (element.alpha == 1) {
                    element.visible = true;
                    element.alpha = 0.99;
                    Sprite.Tween.get(element).to({alpha: 0}, 200).call(function () {
                      element.visible = false;
                    });
                  }
                }
              });
            } // hidemap
            if (hint.showactor) {
              for (let actor of Game.area.actors) {
                if (hint.showactor.indexOf(actor.id) != -1) {
                  if (actor.visible == false) {
                    actor.visible = true;
                    actor.alpha = 0.01;
                    Sprite.Tween.get(actor).to({alpha: 1}, 300);
                  }
                }
              }
            } // showactor
            if (hint.hideactor) {
              for (let actor of Game.area.actors) {
                if (hint.hideactor.indexOf(actor.id) != -1) {
                  if (actor.alpha == 1) {
                    actor.visible = true;
                    actor.alpha = 0.99;
                    Sprite.Tween.get(actor).to({alpha: 0}, 100).call(function () {
                      actor.visible = false;
                    });
                  }
                }
              }
            } // hideactor
          } // touch
        }
      }
    }

    static actor () {
      if (Game.area && Game.area.actors) {
        for (let actor of Game.area.actors) {

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

            if (Game.hero && actor.facePosition.x == Game.hero.x && actor.facePosition.y == Game.hero.y) {
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
            } else if (Game.hero && Game.hero.distance(actor) < 10) {
              actor.goto(Game.hero.x, Game.hero.y, "walk");
            } else if (actor.data.mode == "patrol") {
              if (Math.random() < 0.01) {
                return;
              }
              var x = actor.x;
              var y = actor.y;
              actor.goto(x + Sprite.rand(-5, 5), y + Sprite.rand(-5, 5), "walk", function () {
                actor.stop();
              });
            }
          }
        };
      }
    }

    static start () {
      setInterval(function () {
        Game.AI.actor();
      }, 50);

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
