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
  Game.assign("ActorMonster", class GameActorMonster extends Game.Actor {
    constructor (actorData) {
      super(actorData);
      let privates = internal(this);
      privates.ai = null;
      privates.attacking = false;
    }

    damage (attacker, skill) {
      super.damage(attacker, skill);
      let privates = internal(this);

      if (privates.attacking == false) {
        this.goto(attacker.x, attacker.y, "walk");
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

    draw () {
      let privates = internal(this);
      super.draw();

      let dodo = Sprite.rand(30, 60);

      privates.ai = Sprite.Ticker.on("tick", (event) => {

        if (Game.paused) return;

        let tickCount = event.data;

        if (tickCount % 20 == 0) {
          let barChanged = false;

          if (this.data.hp < this.data.$hp && privates.attacking == false) {
            this.data.hp++;
            barChanged = true;
          }

          if (this.data.sp < this.data.$sp) {
            this.data.sp++;
            barChanged = true;
          }

          if (barChanged) {
            this.refreshBar();
          }
        }

        if (privates.attacking) {
          if (tickCount % dodo == 0) {
            if (
              Game.hero &&
              this.facePosition.x == Game.hero.x &&
              this.facePosition.y == Game.hero.y
            ) {
              if (this.y == Game.hero.y) { // left or right
                if (this.x < Game.hero.x) { // left
                  this.fire(this.data.skills[0], "right");
                } else { // right
                  this.fire(this.data.skills[0], "left");
                }
              } else { // up or down
                if (this.y < Game.hero.y) { // up
                  this.fire(this.data.skills[0], "down");
                } else { // down
                  this.fire(this.data.skills[0], "up");
                }
              }
            }
          } else if (Game.hero && Game.hero.distance(this) < 12) {
            this.goto(Game.hero.x, Game.hero.y, "walk");
          } else {
            privates.attacking = false;
            if (Game.hero.beAttacking.has(this)) {
              Game.hero.beAttacking.delete(this);
            }
          }
        } else {
          if (tickCount % dodo == 0) {
            if (Game.hero && Game.hero.distance(this) < 8) {
              this.goto(Game.hero.x, Game.hero.y, "walk");
              privates.attacking = true;
              Game.hero.beAttacking.add(this);
            } else if (this.data.mode == "patrol") {
              if (Math.random() > 0.3) {
                this.stop();
                return;
              }
              let directions = ["down", "left", "right", "up"];
              this.go("walk", directions[Math.floor(Math.random() * directions.length)]).then(() => {
                this.stop();
              });
            }
          }
        } // not attacking


      });


    }


  });


})();
