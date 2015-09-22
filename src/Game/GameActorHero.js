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

      this.on("kill", (event) => {
        let actor = event.data;
        if (actor.data.exp) {
          this.data.exp += actor.data.exp;
        } else {
          this.data.exp += 1;
        }
        this.data.quest.current.forEach((quest) => {
          if (quest.target.type == "kill") {
            if (quest.target.kill.hasOwnProperty(actor.id)) {
              let t = quest.target.kill[actor.id];
              if (t.current < t.need) {
                t.current++;
              }
            }
          }
        });
      });
    }

    hasQuest (id) {
      for (let quest of this.data.quest.current) {
        if (id == quest.id) {
          return true;
        }
      }
      for (let quest of this.data.quest.past) {
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

          if (this.data.hp < this.data.$hp) {
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


  });


})();
