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

  Game.assign("AI", class GameAI {

    static attach (hero) {
      let run = function () {
        Game.AI.heroOnto();
        Game.AI.heroTouch();
        Game.AI.autoHide();
      };
      run();
      // 英雄移动后运行
      hero.on("change", run);
      // 游戏窗口切换后运行
      Game.windows.interface.on("active", function () {
        run();
      });
    }

    static autoHide () {
      let heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);

      for (let layer of Game.layers.mapHideLayer.children) {
        if (layer.name == heroHide) {
          layer.visible = false;
        } else {
          layer.visible = true;
        }
      }

      // 检查需要隐藏的角色，例如建筑物里的npc
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

          // 当npc紧挨着玩家所在格子的时候，自动面向玩家
          if (actor.distance(Game.hero) == 1) {
            let actorFace = actor.facePosition;
            if (actorFace.x != Game.hero.x || actorFace.y != Game.hero.y) {
              if (actor.y == Game.hero.y) { // 同一水平
                if (actor.x < Game.hero.x) { // npc 在玩家左边
                  actor.face("right");
                } else if (actor.x > Game.hero.x) { // npc在玩家右边
                  actor.face("left");
                }
              } else if (actor.x == Game.hero.x) { // 同一垂直
                if (actor.y < Game.hero.y) {
                  actor.face("down");
                } else if (actor.y > Game.hero.y) {
                  actor.face("up");
                }
              }
            }
          }



        }
      }

      // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
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
          Game.pause();
          Game.windows.loading.begin();
          Game.windows.loading.update("20%");
          setTimeout(function () {
            Game.clearStage();
            Game.windows.loading.update("50%");
            Game.loadArea(onto.dest, function (area) {
              Game.windows.loading.update("80%");
              Game.area = area;
              area.map.draw(Game.layers.mapLayer);
              Game.hero.data.area = onto.dest;
              Game.hero.draw(Game.layers.actorLayer);
              area.actors.add(Game.hero);
              Game.hero.x = onto.destx;
              Game.hero.y = onto.desty;
              Game.windows.loading.update("100%");
              setTimeout(function () {
                Game.windows.loading.end();
              }, 20);
            });
          }, 20);
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
        if (element.heroUse) {
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            touch = element;
          } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
            touch = element;
          }
        }
      }

      let FindFaceHero = function (element) {
        if (touch != null || element == Game.hero) {
          return;
        }
        if (element.heroUse) {
          if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
            touch = element;
          } else if (element.x == heroFace.x && element.y == heroFace.y) {
            touch = element;
          }
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
      if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
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

  });

})();
