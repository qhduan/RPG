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

  Game.AI = class GameAI {

    static attach (hero) {
      let run = function () {
        Game.AI.heroOnto();
        Game.AI.heroTouch();
        Game.AI.autoHide();
      };

      hero.on("change", run);
      run();
    }

    static autoHide () {
      let heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);
      Game.area.map.layers.forEach((layer, index) => {
        layer.visible = true;
        let layerData = Game.area.map.data.layers[index];
        if (
          heroHide &&
          layerData.hasOwnProperty("properties") &&
          layerData.properties.hasOwnProperty("autohide") &&
          layerData.properties.autohide == heroHide
        ) {
          layer.visible = false;
        }
      });

      for (let actor of Game.area.actors) {
        if (actor != Game.hero) {
          let actorHide = Game.area.map.hitAutoHide(actor.x, actor.y);
          if (actorHide && actorHide == heroHide) {
            actor.visible = true;
          } else {
            if (actorHide) {
              actor.visible = false;
            } else {
              actor.visible = true;
            }
          }
        }
      }

      for (let bag of Game.area.bags) {
        let bagHide = Game.area.map.hitAutoHide(bag.x, bag.y);
        if (bagHide && bagHide == heroHide) {
          bag.visible = true;
        } else {
          if (bagHide) {
            bag.visible = false;
          } else {
            bag.visible = true;
          }
        }
      }
    }

    static heroOnto () {
      if (!Game.area) return;
      if (!Game.area.onto) return;

      let heroPosition = Game.hero.position;
      let onto = null;

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
          Game.windows.loading.begin();
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

              Game.windows.loading.end();
            });
          }, 100);
        } // dest, aka. door
      } // touch
    }

    static heroTouch () {
      if (!Game.area) return;
      if (!Game.area.actors) return;
      if (!Game.area.bags) return;
      if (!Game.area.touch) return;

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
        Game.windows.interface.hideUse();
      } else {

        if (touch.type == "message") {
          touch.heroUse = function () {
            Game.popup({
              x: touch.x * 32 + 16,
              y: touch.y * 32 + 16
            }, touch.content, 0, -30);
          };
        }

        Game.hintObject = touch;
        Game.windows.interface.showUse();
      }
    }

    static actor () {
      if (Game.area && Game.area.actors) {
        for (let actor of Game.area.actors) {

          if (actor.data.type == "hero") {
            let barChanged = false;

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

            let barChanged = false;

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
              let x = actor.x;
              let y = actor.y;
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

})();
