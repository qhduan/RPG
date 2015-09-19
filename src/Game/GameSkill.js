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

  Game.assign("Skill", class GameSkill extends Sprite.Event {
    static load (id, callback) {
      Sprite.Loader.create()
        .add(`skill/${id}.json`)
        .start()
        .on("complete", (event) => {
        let skillData = event.data[0];
        let skillObj = new Game.Skill(skillData);
        Game.skills[id] = skillObj;
        skillObj.on("complete", () => {
          if (typeof callback == "function") {
            callback();
          }
        });
      });
    }

    constructor (skillData) {
      super ();

      this.data = skillData;
      this.id = this.data.id;

      Sprite.Loader.create()
        .add(`skill/${this.data.image}`)
        .add(`skill/${this.data.icon}`)
        .add(`skill/${this.data.sound}`)
        .start()
        .on("complete", (event) => {
        let image = event.data[0];
        this.icon = event.data[1];
        this.sound = event.data[2];

        let sheet = new Sprite.Sheet({
          images: [image],
          width: this.data.tilewidth,
          height: this.data.tileheight,
          animations: this.data.animations
        });

        sheet.centerX = Math.floor(this.data.tilewidth / 2);
        sheet.centerY = Math.floor(this.data.tileheight / 2);

        if (this.data.alpha) {
          sheet.alpha = this.data.alpha;
        }

        this.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    get power () {
      if (typeof this.data.power == "number") {
        return this.data.power;
      } else if (typeof this.data.power == "string") {
        let m = this.data.power.match(/(\d+)d(\d+)/);
        let times = parseInt(m[1]);
        let dice = parseInt(m[2]);
        let sum = 0;
        for (let i = 0; i < times; i++) {
          sum += Sprite.rand(0, dice);
        }
        return sum;
      } else {
        console.error(this, this.data, this.data.power);
        throw new Error("Game.Skill.power invalid power");
      }
    }

    set power (value) {
      throw new Error("Game.Skill.power readonly");
    }

    get type () {
      return this.data.type;
    }

    set type (value) {
      throw new Error("Game.Skill.type readonly");
    }

    can (attacker) {
      let Type2Text = {
        sword: "剑",
        spear: "枪",
        bow: "弓"
      };

      if (this.data.needweapontype && attacker == Game.hero) {
        if (Game.hero.data.equipment.weapon) {
          let weapon = Game.items[Game.hero.data.equipment.weapon];
          if (weapon.data.type != this.data.needweapontype) {
            Game.popup(Game.hero.sprite, `这个技能需要装备 '${Type2Text[this.data.needweapontype]}' 类型的武器`, 0, -40);
            return false;
          }
        } else {
          Game.popup(Game.hero.sprite, "这个技能需要装备武器", 0, -40);
          return false;
        }
      }

      return true;
    }

    fire (attacker, direction, callback) {

      if (this.sound) {
        this.sound.load();
        this.sound.play();
      }

      let animation = "attack" + direction;
      let sprite = this.sprite.clone();

      // 矫正武器效果位置
      sprite.x = attacker.sprite.x;
      sprite.y = attacker.sprite.y;

      switch (direction) {
        case "left":
          sprite.x -= 32;
          break;
        case "up":
          sprite.y -= 32;
          break;
        case "right":
          sprite.x += 32;
          break;
        case "down":
          sprite.y += 32;
          break;
      }

      // 矫正武器效果中心
      if (this.data.animations[animation].centerX) {
        sprite.centerX = this.data.animations[animation].centerX;
      }
      if (this.data.animations[animation].centerY) {
        sprite.centerY = this.data.animations[animation].centerY;
      }


      // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的举例
      let distance = 0;
      // 被命中的actor列表
      let hitted = [];
      let CheckHit = () => {
        // 技能所在当前方格
        let l1 = Game.area.map.tile(sprite);
        if (this.data.distance > 0
          && (l1.x < 0
            || l1.y < 0
            || l1.x >= Game.area.map.data.width
            || l1.y >= Game.area.map.data.height
          )
        ) {
          distance = this.data.distance;
        }
        // 碰撞检测
        for (let actor of Game.area.actors) {
          if (actor != attacker && hitted.length <= 0) {
            if (actor.hitTest(l1.x, l1.y)) {
              hitted.push(actor);
            }
          }
        }
      };

      let listener = Sprite.Ticker.on("tick", () => {

        if (this.data.distance > 0) {
          distance += 4;
        }

        switch (animation) {
          case "attackdown":
            sprite.y += distance;
            break;
          case "attackleft":
            sprite.x -= distance;
            break;
          case "attackright":
            sprite.x += distance;
            break;
          case "attackup":
            sprite.y -= distance;
            break;
        }

        CheckHit();

        // 如果击中了一个敌人（单体伤害）
        if (hitted.length > 0) {
          Finish();
        }

        // 如果是远程攻击，并且攻击距离已经到了
        if (this.data.distance > 0 && distance >= this.data.distance) {
          Finish();
        }

        // 如果是近战攻击（this.data.distance <= 0），而且动画已经停止
        if (this.data.distance <= 0 && sprite.paused) {
          Finish();
        }

      });

      // 攻击结束时运行Stop函数
      let Finish = () => {
        Sprite.Ticker.off("tick", listener);

        if (hitted.length > 0 && this.data.animations["hitted"]) {
          let actor = hitted[0];
          sprite.x = actor.sprite.x;
          sprite.y = actor.sprite.y;
          sprite.play("hitted");
          if (sprite.paused == true) {
            Game.layers.skillLayer.removeChild(sprite);
          } else {
            sprite.on("animationend", function () {
              Game.layers.skillLayer.removeChild(sprite);
            });
          }
        } else {
          // 如果动画已经播完，则停止
          if (sprite.paused == true) {
            Game.layers.skillLayer.removeChild(sprite);
          } else {
            sprite.on("animationend", function () {
              Game.layers.skillLayer.removeChild(sprite);
            });
          }
        }

        if (typeof callback == "function") {
          callback(hitted);
        }
      }

      Game.layers.skillLayer.appendChild(sprite);
      sprite.play(animation);

      if ( this.data.animations[animation].actor
        && attacker.data.animations[this.data.animations[animation].actor] ) {
        attacker.play(this.data.animations[animation].actor, 3);
      } else {
        attacker.play("face" + direction, 0);
        attacker.play("attack" + direction, 3);
      }
    }

  });

})();
