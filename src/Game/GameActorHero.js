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

  let internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorHero", class GameActorHero extends Game.Actor {
    constructor (actorData) {
      super(actorData);
      let privates = internal(this);
      privates.ai = null;
      privates.beAttacking = new Set();

      this.on("kill", (event) => {
        let actor = event.data;

        if (this.beAttacking.has(actor)) {
          this.beAttacking.delete(actor);
        }

        if (actor.data.exp) {
          this.data.exp += actor.data.exp;
        } else {
          this.data.exp += 1;
        }

        for (let quest of this.data.currentQuest) {
          if (quest.target && quest.target.kill) {
            for (let k of quest.target.kill) {
              if (actor.id == k.id && k.current < k.need) {
                k.current++;
              }
            }
          }
        }

      });

      this.on("change", () => {
        this.onto();
        this.touch();
      });

      setInterval(() => {
        if ( !Game.paused ) {
          this.onto();
          this.touch();
        }
      }, 500);
    }

    get beAttacking () {
      return internal(this).beAttacking;
    }

    set beAttacking (value) {
      throw new Error("Game.hero.beAttacking readonly");
    }

    hasItem (id, count) {
      if (Number.isFinite(count) == false || count <= 0) {
        count = 1;
      }
      for (let key in this.data.items) {
        if (key == id) {
          if (this.data.items[key] >= count) {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    }

    hasQuest (id) {
      for (let quest of this.data.currentQuest) {
        if (id == quest.id) {
          return true;
        }
      }
      for (let quest of this.data.completeQuest) {
        if (id == quest.id) {
          return true;
        }
      }
      return false;
    }

    damage (attacker, skill) {
      super.damage(attacker, skill);

      // 如果英雄受到了伤害
      let touchActor = [];
      for (let actor of Game.area.actors) {
        // 找到所有邻接英雄的怪物
        if (actor != this && actor.data.type == "monster" && actor.distance(this) == 1) {
          touchActor.push(actor);
        }
      }
      if (touchActor.length) {
        let faceAttacker = false;
        let facePosition = this.facePosition;
        touchActor.forEach(function (actor) {
          if (actor.hitTest(facePosition.x, facePosition.y)) {
            faceAttacker = true;
          }
        });
        // 如果英雄现在没面对任何一个邻接的怪物，面向它
        if (faceAttacker == false) {
          this.goto(touchActor[0].x, touchActor[0].y);
        }
      }
    }

    erase () {
      let privates = internal(this);
      super.erase();

      if (privates.ai) {
        Sprite.Ticker.off("tick", privates.ai);
        privates.ai = null;
      }
    }

    refreshBar () {
      super.refreshBar();
      Game.windows.interface.status(
        this.data.hp / this.data.$hp, // 生命百分比
        this.data.sp / this.data.$sp // 精神力百分比
      );
    }

    draw () {
      let privates = internal(this);
      super.draw();

      privates.ai = Sprite.Ticker.on("tick", (event) => {

        let tickCount = event.data;

        // 每秒16个tick
        if (tickCount % 16 == 0) {
          let barChanged = false;

          if (this.data.hp < this.data.$hp && this.beAttacking.size <= 0) {
            this.data.hp++;
            barChanged = true;
          }

          if (this.data.sp < this.data.$sp) {
            this.data.sp++;
            barChanged = true;
          }

          if (barChanged) {
            this.refreshBar();
            if (Game.windows.status.atop) {
              Game.windows.status.update();
            }
          }
        }

      });

    }


    gotoArea (dest, x, y) {
      var privates = internal(this);
      privates.beAttacking = new Set();
      Game.pause();
      Game.windows.interface.hide();
      Game.windows.stage.hide();
      Game.windows.loading.begin();
      Game.windows.loading.update("20%");

      setTimeout(function () {

        Game.clearStage();
        Game.windows.loading.update("50%");

        setTimeout(function () {

          Game.loadArea(dest).then(function (area) {

            Game.area = area;
            Game.windows.loading.update("80%");

            setTimeout(function () {

              Game.hero.data.area = dest;
              Game.hero.draw();
              Game.hero.x = x;
              Game.hero.y = y;
              area.actors.add(Game.hero);

              area.map.draw();
              Game.windows.loading.update("100%");

              setTimeout(function () {

                Game.hero.x = x;
                Game.hero.y = y;
                Game.hero.data.time += 60; // 加一小时
                Game.windows.loading.end();
                Game.windows.interface.datetime();
                Game.windows.interface.refresh();
                Game.start();

                setTimeout(function () {

                  Game.stage.update();
                  Game.windows.stage.show();
                  Game.windows.interface.show();
                }, 5);
              }, 5);
            }, 5);
          }); // loadArea
        }, 5);
      }, 5);
    }

    // 当玩家站到某个点的时候执行的命令
    onto () {
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
          return;
        } else if (element.points) {
          for (let p of element.points) {
            if (p.x == heroPosition.x && p.y == heroPosition.y) {
              onto = element;
              return;
            }
          }
        } else if (
          Number.isFinite(element.x) &&
          Number.isFinite(element.y) &&
          element.x == heroPosition.x &&
          element.y == heroPosition.y
        ) {
          onto = element;
          return;
        }
      }
      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.onto, FindUnderHero);
      if (onto) {
        if (onto.execute) {
          onto.execute();
        }
      } // touch
    }

    // 当玩家站到或者接触到某个点时执行的命令
    touch () {
      if (!Game.area) return;
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
            return;
          } else if (element.points) {
            for (let p of element.points) {
              if (p.x == heroPosition.x && p.y == heroPosition.y) {
                touch = element;
                return;
              }
            }
          } else if (
            Number.isFinite(element.x) &&
            Number.isFinite(element.y) &&
            element.x == heroPosition.x &&
            element.y == heroPosition.y
          ) {
            touch = element;
            return;
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
          } else if (element.points) {
            for (let p of element.points) {
              if (p.x == heroFace.x && p.y == heroFace.y) {
                touch = element;
                return;
              }
            }
          } else if (
            Number.isFinite(element.x) &&
            Number.isFinite(element.y) &&
            element.x == heroFace.x &&
            element.y == heroFace.y
          ) {
            touch = element;
            return;
          }
        }
      }

      // 用FindUnderHero函数寻找到玩家当前格子的地点

      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindUnderHero);
      // 找最近尸体 Game.area.bags
      Sprite.each(Game.area.bags, FindUnderHero);
      // 找最近物品 Game.area.items
      Sprite.each(Game.area.items, FindUnderHero);
      // 其他物品（由地图文件定义）
      Game.area.touch.forEach(FindUnderHero);

      // 用FindFaceHero寻找面对着玩家的格子地点

      // 找最近可“事件”人物 Game.area.actors
      Sprite.each(Game.area.actors, FindFaceHero);
      // 找最近尸体 Game.area.bags
      Sprite.each(Game.area.bags, FindFaceHero);
      // 找最近尸体 Game.area.items
      Sprite.each(Game.area.items, FindFaceHero);
      // 其他物品（由地图文件定义）
      Game.area.touch.forEach(FindFaceHero);
      // 水源
      if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
        touch = {
          type: "water",
          heroUse: function () {
            Game.choice({
              "喝水": "drink",
              "钓鱼": "fish"
            }).then(function (choice) {
              switch (choice) {
                case "drink":
                  Game.hero.popup("drink");
                break;
                case "fish":
                  Game.hero.popup("fish");
                break;
              }
            });
          }
        };
      }

      if (!touch) {
        Game.hintObject = null;
        Game.windows.interface.hideUse();
      } else {
        Game.hintObject = touch;
        Game.windows.interface.showUse();
      }
    }


  });


})();
