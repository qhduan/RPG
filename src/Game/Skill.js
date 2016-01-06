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
import Game from "./Base.js";

let internal = Sprite.Util.namespace();

export default class Skill extends Sprite.Event {

  static load (id) {
    return new Promise( (resolve, reject) => {
      Sprite.Loader.load(`skill/${id}.js`).then( (data) => {
        let skillData = data[0]();
        let skillObj = new Game.Skill(skillData);
        Game.skills[id] = skillObj;
        skillObj.on("complete", () => {
          resolve(skillObj);
        });
      });
    });
  }

  constructor (skillData) {
    super ();
    let privates = internal(this);
    privates.data = skillData;

    Sprite.Loader.load(
      `skill/${this.data.image}`,
      `skill/${this.data.icon}`,
      `skill/${this.data.sound}`
    ).then((data) => {
      let image = data[0];
      privates.icon = data[1];
      privates.sound = data[2];

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

      privates.sprite = sheet;

      // 发送完成事件，第二个参数代表一次性事件
      this.emit("complete", true);
    });
  }

  get id () {
    return internal(this).data.id;
  }

  set id (value) {
    throw new Error("Game.Skill.id readonly");
  }

  get icon () {
    return internal(this).icon;
  }

  set icon (value) {
    throw new Error("Game.Skill.icon readonly");
  }

  get data () {
    return internal(this).data;
  }

  set data (value) {
    console.error(this);
    throw new Error("Game.Skill.data readonly");
  }

  get power () {
    if (Number.isFinite(this.data.power)) {
      // 固定伤害
      return this.data.power;
    } else if (typeof this.data.power == "string") {
      // 骰子伤害，例如1d5就是投一个五面骰子，数值在1到5之间
      let m = this.data.power.match(/(\d+)d(\d+)/);
      if (!m) {
        console.error(this.data.power, this.data);
        throw new Error("Sprite.Skill got invalid power data");
      }
      let times = parseInt(m[1]);
      let dice = parseInt(m[2]);
      let sum = 0;
      for (let i = 0; i < times; i++) {
        sum += Sprite.Util.rand(0, dice) + 1;
      }
      return sum;
    } else {
      console.error(this.data.power, this.data);
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

  fire (attacker, direction, callback) {
    let privates = internal(this);

    if (privates.sound) {
      privates.sound.load();
      privates.sound.play();
    }

    let animation = "attack" + direction;
    let weaponAnimation = this.data.animations[animation];
    let sprite = privates.sprite.clone();

    // 矫正武器效果位置
    sprite.x = attacker.facePosition.x * 32 + 16;
    sprite.y = attacker.facePosition.y * 32 + 16;

    // 矫正武器效果中心
    if (Number.isFinite(weaponAnimation.centerX) && Number.isFinite(weaponAnimation.centerY)) {
      sprite.centerX = weaponAnimation.centerX;
      sprite.centerY = weaponAnimation.centerY;
    } else {
      console.error(weaponAnimation, this.data);
      throw new Error("Game.Skill.fire invalid centerX/centerY");
    }

    // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的距离
    let distance = 0;
    // 被命中的actor列表
    let hitted = [];
    const CheckHit = () => {
      // 技能所在当前方格
      let l1 = Game.area.map.tile(sprite.x, sprite.y);
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
        // 飞行速度是4
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

      // 测试碰撞到墙
      let grid = Game.area.map.tile(sprite.x, sprite.y);
      if (Game.area.map.hitTest(grid.x, grid.y)) {
        Finish();
      }

      // 如果击中了一个敌人（单体伤害）
      if (hitted.length > 0) {
        Finish();
      }

      // 如果是远程攻击，并且攻击距离已经到了
      if (this.data.distance > 0 && distance >= this.data.distance) {
        Finish();
      }

    });

    // 攻击结束时运行Stop函数
    const Finish = () => {
      Sprite.Ticker.off("tick", listener);

      if (hitted.length > 0 && this.data.animations["hitted"]) {
        let actor = hitted[0];
        sprite.x = actor.sprite.x;
        sprite.y = actor.sprite.y;
        sprite.play("hitted");
        if (sprite.paused == true) {
          Game.layers.skillLayer.removeChild(sprite);
        } else {
          sprite.on("animationend", () => {
            Game.layers.skillLayer.removeChild(sprite);
          });
        }
      } else {
        // 如果动画已经播完，则停止
        if (sprite.paused == true) {
          Game.layers.skillLayer.removeChild(sprite);
        } else {
          sprite.on("animationend", () => {
            Game.layers.skillLayer.removeChild(sprite);
          });
        }
      }

      if (callback) {
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

}
