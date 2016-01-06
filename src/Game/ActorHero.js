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


"use strict";

import Sprite from "../Sprite/Sprite.js";
import Game   from "./Base.js";
import Actor  from "./Actor.js";

let internal = Sprite.Util.namespace();

/**
  英雄类
  属性：
    this.sprite 精灵
*/
export default class ActorHero extends Actor {
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
      this.whenOnto();
      this.whenTouch();
    });

    setInterval(() => {
      if ( !Game.paused ) {
        this.whenOnto();
        this.whenTouch();
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
    if (count <= 0 || !Number.isFinite(count)) {
      count = 1;
    }
    for (const key in this.data.items) {
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
      touchActor.forEach((actor) => {
        if (actor.hitTest(facePosition.x, facePosition.y)) {
          faceAttacker = true;
        }
      });
      // 如果英雄现在没面对任何一个邻接的怪物，面向它
      if ( !faceAttacker ) {
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
      if (tickCount % 16 === 0) {
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
    let privates = internal(this);
    if (privates.isGoing) return;
    privates.isGoing = true;

    privates.beAttacking = new Set();

    Sprite.Util.timeout(5).then( () => {

      Game.pause();
      Game.windows.interface.hide();
      Game.windows.stage.hide();
      Game.windows.loading.begin();
      Game.windows.loading.update("30%");
      return Sprite.Util.timeout(5);

    }).then( () => {

      Game.clearStage();
      return Game.Area.load(dest);

    }).then( (area) => {

      Game.area = area;
      Game.windows.loading.update("50%");
      return Sprite.Util.timeout(5);

    }).then( () => {

      Game.hero.data.area = dest;
      Game.hero.draw();
      Game.hero.x = x;
      Game.hero.y = y;
      Game.area.actors.add(Game.hero);
      Game.area.map.draw();
      Game.windows.loading.update("80%");
      return Sprite.Util.timeout(5);

    }).then( () => {

      Game.hero.x = x;
      Game.hero.y = y;
      Game.hero.data.time += 60; // 加一小时
      Game.windows.loading.end();
      Game.windows.interface.datetime();
      Game.windows.interface.refresh();
      Game.start();
      Game.windows.loading.update("100%");
      return Sprite.Util.timeout(5);

    }).then( () => {

      Game.stage.update();
      Game.windows.stage.show();
      Game.windows.interface.show();
      privates.isGoing = false;

    }).catch( err => {
      console.error(err);
      console.error("ActorHero.gotoArea failed");
    });

  }

  findUnder (obj) {
    const heroPosition = this.position;
    let arr = null;
    if (obj instanceof Array || obj instanceof Set) {
      arr = obj;
    } else if (obj instanceof Map) {
      arr = obj.values();
    } else {
      arr = [];
      for (const key in obj) {
        arr.push(obj[key]);
      }
    }

    for (const element of arr) {
      if (element != this) {
        if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
          return element;
        } else if (element.points) {
          for (let p of element.points) {
            if (p.x == heroPosition.x && p.y == heroPosition.y) {
              return element;
            }
          }
        } else if (
          Number.isFinite(element.x) &&
          Number.isFinite(element.y) &&
          element.x == heroPosition.x &&
          element.y == heroPosition.y
        ) {
          return element;
        }
      }
    }
    return null;
  }

  findFace (obj) {
    const heroFace = this.facePosition;
    let arr = null;
    if (obj instanceof Array || obj instanceof Set) {
      arr = obj;
    } else if (obj instanceof Map) {
      arr = obj.values();
    } else {
      arr = [];
      for (const key in obj) {
        arr.push(obj[key]);
      }
    }

    for (const element of arr) {
      if (element != this) {
        if (element.heroUse) {
          if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
            return element;
          } else if (element.points) {
            for (let p of element.points) {
              if (p.x == heroFace.x && p.y == heroFace.y) {
                return element;
              }
            }
          } else if (
            Number.isFinite(element.x) &&
            Number.isFinite(element.y) &&
            element.x == heroFace.x &&
            element.y == heroFace.y
          ) {
            return element;
          }
        }
      }
    }
    return null;
  }

  // 当玩家站到某个点的时候执行的命令
  whenOnto () {
    if (!Game.area) return;
    if (!Game.area.onto) return;

    let onto = this.findUnder(Game.area.onto);

    // 找最近可“事件”人物 Game.area.actors
    if (onto) {
      if (onto.execute) {
        onto.execute();
      }
    } // touch
  }

  // 当玩家站到或者接触到某个点时执行的命令
  whenTouch () {
    if (!Game.area) return;
    if (!Game.area.touch) return;

    let heroFace = Game.hero.facePosition;
    let touch = this.findUnder(Game.area.actors) || // 找最近可“事件”人物 Game.area.actors
                this.findUnder(Game.area.bags) || // 找最近尸体 Game.area.bags
                this.findUnder(Game.area.items) || // 找最近物品 Game.area.items
                this.findUnder(Game.area.touch) || // 其他物品（由地图文件定义）
                this.findFace(Game.area.actors) ||
                this.findFace(Game.area.bags) ||
                this.findFace(Game.area.items) ||
                this.findFace(Game.area.touch);

    // 水源
    if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
      touch = {
        type: "water",
        heroUse: () => {
          Game.Choice({
            "喝水": "drink",
            "钓鱼": "fish"
          }).then( (choice) => {
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

    if ( !touch ) {
      Game.hintObject = null;
      Game.windows.interface.hideUse();
    } else {
      Game.hintObject = touch;
      Game.windows.interface.showUse();
    }
  }


}
