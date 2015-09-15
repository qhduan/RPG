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

    static attach (hero) {
      hero.on("change", function () {
        Game.AI.heroOnto();
        Game.AI.heroTouch();
      });
    }

    static heroOnto () {
      let heroPosition = Game.hero.position;
      var onto = null;

      let FindUnderHero = function (element) {
        if (onto != null || element == Game.hero) {
          return;
        }
        if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
          onto = element;
        } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
          onto = element;
        }
      }
      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.onto, FindUnderHero);
      if (onto) {
        if (onto.dest) {
          Game.windows.loading.execute("begin");
          setTimeout(function () {
            Game.clearStage();
            Game.pause();
            Game.loadArea(onto.dest, function (area) {

              Game.area = area;
              area.map.draw(Game.layers.mapLayer);

              Game.hero.data.area = onto.dest;
              Game.hero.draw(Game.layers.actorLayer);
              area.actors.add(Game.hero);
              Game.hero.x = onto.destx;
              Game.hero.y = onto.desty;
              Game.windows.interface.show();
              Game.start();

              Game.windows.loading.execute("end");
            });
          }, 100);
        }
        if (onto.showmap) {
          Game.layers.mapLayer.children.forEach(function (element) {
            if (onto.showmap.indexOf(element.name) != -1) {
              element.visible = true;
            }
          });
        } // showmap
        if (onto.hidemap) {
          Game.layers.mapLayer.children.forEach(function (element) {
            if (onto.hidemap.indexOf(element.name) != -1) {
                element.visible = false;
            }
          });
        } // hidemap
        if (onto.showactor) {
          for (let actor of Game.area.actors) {
            if (onto.showactor.indexOf(actor.id) != -1) {
              actor.visible = true;
            }
          }
        } // showactor
        if (onto.hideactor) {
          for (let actor of Game.area.actors) {
            if (onto.hideactor.indexOf(actor.id) != -1) {
              actor.visible = false;
            }
          }
        } // hideactor
      } // touch
    }

    static heroTouch () {
      let heroPosition = Game.hero.position;
      let heroFace = Game.hero.facePosition;
      let touch = null;

      let FindUnderHero = function (element) {
        if (touch != null || element == Game.hero) {
          return;
        }
        if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
          touch = element;
        } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
          touch = element;
        }
      }

      let FindFaceHero = function (element) {
        if (touch != null || element == Game.hero) {
          return;
        }
        if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
          touch = element;
        } else if (element.x == heroFace.x && element.y == heroFace.y) {
          touch = element;
        }
      }

      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindUnderHero);
      // 找最近尸体 Game.area.actors
      Sprite.each(Game.area.bags, FindUnderHero);
      // 最近的提示物（例如牌子）
      Game.area.touch.forEach(FindUnderHero);


      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindFaceHero);
      // 找最近尸体 Game.area.actors
      Sprite.each(Game.area.bags, FindFaceHero);
      // 最近的提示物（例如牌子）
      Game.area.touch.forEach(FindFaceHero);
      // 水源
      if (!touch && Game.area.map.waterTest(heroFace.x, heroFace.y)) {
        touch = {
          type: "water",
          heroUse: function () {
            Game.popup(Game.hero.sprite, "This is water", 0, -50);
          }
        };
      }


      if (!touch) {
        Game.hintObject = null;
        Game.windows.interface.use.style.visibility = "hidden";
      } else {
        Game.hintObject = touch;
        Game.windows.interface.use.style.visibility = "visible";
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
    }

  };
})(Game);
