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

  Game.Skill = class GameSkill extends Sprite.Event {
    static load (id, callback) {
      var skillLoader = new Sprite.Loader();
      skillLoader.add(`/skill/${id}.json`);
      skillLoader.start();
      skillLoader.on("complete", (event) => {
        var skillData = event.data[0];
        var skillObj = new Game.Skill(skillData);
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

      var loader = new Sprite.Loader();
      loader.add(`/skill/${this.data.image}`);
      loader.add(`/skill/${this.data.icon}`);
      loader.add(`/skill/${this.data.sound}`);
      loader.start();
      loader.on("complete", (event) => {
        var image = event.data[0];
        this.icon = event.data[1];
        this.sound = event.data[2];

        var sheet = new Sprite.Sheet({
          images: [image],
          width: this.data.tilewidth,
          height: this.data.tileheight,
          animations: this.data.animations
        });

        sheet.centerX = Math.floor(this.data.tilewidth / 2);
        sheet.centerY = Math.floor(this.data.tileheight / 2);

        this.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    fire (actor, animation, callback) {

      if (this.sound) {
        this.sound.load();
        this.sound.play();
      }

      var sprite = this.sprite.clone();

      // 矫正武器效果位置
      //sprite.x = parseInt(actor.sprite.x - parseInt(this.data.tilewidth / 2));
      //sprite.y = parseInt(actor.sprite.y - parseInt(this.data.tileheight / 2));
      sprite.x = actor.x;
      sprite.y = actor.y;

      if (this.data.animations[animation].x) {
        sprite.x += this.data.animations[animation].x;
      }

      if (this.data.animations[animation].y) {
        sprite.y += this.data.animations[animation].y;
      }

      // 被命中的actor列表
      var hitted= {};
      var CheckHit = () => {

        // 碰撞检测
        for (var key in Game.area.actors) {
          if (Game.area.actors[key].id == actor.id) continue;
          if (Game.area.actors[key].data.type != "monster") continue;
          var c = Game.skillCollision(sprite, Game.area.actors[key].sprite);
          if (c) {
            hitted[key] = true;
          }
        }
      };

      // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的举例
      var distance = 0;

      var listener = Sprite.Ticker.on("tick", () => {

        distance += this.data.flyspeed;

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
        if (Object.keys(hitted).length > 0) {
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
      var Finish = () => {
        Sprite.Ticker.off("tick", listener);

        if (Object.keys(hitted).length > 0 && this.data.animations["hitted"]) {
          var a = Object.keys(hitted)[0];
          a = Game.area.actors[a];
          sprite.x = a.sprite.x;
          sprite.y = a.sprite.y;
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

        if (callback) callback(Object.keys(hitted));
      }

      Game.layers.skillLayer.appendChild(sprite);
      sprite.play(animation);

      if ( this.data.animations[animation].actor
        && actor.data.animations[this.data.animations[animation].actor] ) {
        actor.play(this.data.animations[animation].actor, 3);
      }
    }

  };

})();
