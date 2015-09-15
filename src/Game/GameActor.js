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

  var actorHold = [];

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.Actor = class GameActor extends Sprite.Event {
    constructor (actorData) {
      super();

      this.data = actorData;
      this.id = this.data.id;

      // 名字
      var text = new Sprite.Text({
        text: this.data.name,
        maxWidth: 200,
        color: "white",
        fontSize: 12
      });
      text.centerY = Math.floor(text.height / 2);
      text.centerX = Math.floor(text.width / 2);
      text.x = 0;
      text.y = 0;
      this.text = text;

      // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
      this.infoBox = new Sprite.Container();

      if (this.data.type == "npc") {
        this.text.y += 10;
        this.infoBox.appendChild(this.text);
      } else if (this.data.type == "hero") {
        // do nothing
      } else {
        // 血条外面的黑框
        this.hpbarBox = new Sprite.Shape();
        this.hpbarBox.centerX = 15;
        this.hpbarBox.centerY = 2;
        this.hpbarBox.x = 0;
        this.hpbarBox.y = 9;

        // 魔法条外面的黑框
        this.mpbarBox = new Sprite.Shape();
        this.mpbarBox.centerX = 15;
        this.mpbarBox.centerY = 2;
        this.mpbarBox.x = 0;
        this.mpbarBox.y = 12;

        this.hpbarBox.rect({
          x: 0,
          y: 0,
          width: 30,
          height: 3,
          "fill-opacity": 0
        });

        this.mpbarBox.rect({
          x: 0,
          y: 0,
          width: 30,
          height: 3,
          "fill-opacity": 0
        });

        // 生命条
        this.hpbar = new Sprite.Shape();
        this.hpbar.centerX = 15;
        this.hpbar.centerY = 2;
        this.hpbar.x = 0;
        this.hpbar.y = 9;

        // 精力条
        this.mpbar = new Sprite.Shape();
        this.mpbar.centerX = 15;
        this.mpbar.centerY = 2;
        this.mpbar.x = 0;
        this.mpbar.y = 12;

        this.infoBox.appendChild(this.text,
          this.hpbarBox, this.mpbarBox, this.hpbar, this.mpbar);
      }

      var Init = (images) => {
        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: this.data.tilewidth,
          height: this.data.tileheight,
          animations: this.data.animations
        });

        //.centerX.centerY把角色中间设定为图片中间

        if (Number.isInteger(this.data.centerX) && Number.isInteger(this.data.centerY)) {
          sprite.centerX = this.data.centerX;
          sprite.centerY = this.data.centerY;
        } else {
          console.log(this.data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        // sprite.centerX = Math.floor(this.data.tilewidth * 0.5);
        // sprite.centerY = Math.floor(this.data.tileheight * 0.75);
        sprite.play("facedown");
        this.sprite = sprite;

        sprite.on("change", () => {
          this.infoBox.x = this.sprite.x;
          this.infoBox.y = this.sprite.y - this.sprite.centerY - 20
        });

        var completeCount = -1;
        var Complete = () => {
          completeCount++;
          if (completeCount >= 0) {
            this.calculate();
            this.refreshBar();
            this.emit("complete", true);
          }
        };

        if (this.data.skills) {
          this.data.skills.forEach((skillId) => {
            completeCount--;
            Game.Skill.load(skillId, () => {
              Complete();
            });
          });
        }

        if (this.data.equipment) {
          for (let key in this.data.equipment) {
            let itemId = this.data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId, () => {
                Complete();
              });
            }
          }
        }

        if (this.data.items) {
          for (let itemId in this.data.items) {
            completeCount--;
            Game.Item.load(itemId, () => {
              Complete();
            });
          }
        }

        if (this.data.contact && this.data.trade && this.data.trade.length) {
          this.data.trade.forEach((itemId) => {
            completeCount--;
            Game.Item.load(itemId, () => {
              Complete();
            });
          });
        }

        Complete();
      }

      if (this.data.image instanceof Array) {
        // img or canvas
        Init(this.data.image);
      } else if (typeof this.data.image == "string") {
        Sprite.Loader
          .create()
          .add("/actor/" + this.data.image)
          .start()
          .on("complete", function (event) {
            Init(event.data);
          });
      } else {
        console.error(this.id, this.data, this.data.image, this);
        throw new Error("Invalid Actor Image");
      }
    }

    calculate () {
      if (this.data.$str && this.data.$dex && this.data.$con && this.data.$int && this.data.$cha) {

        this.data.str = this.data.$str;
        this.data.dex = this.data.$dex;
        this.data.con = this.data.$con;
        this.data.int = this.data.$int;
        this.data.cha = this.data.$cha;

        // 然后可以针对基本属性计算buff

        this.data.$hp = this.data.con * 10;
        this.data.$sp = this.data.int * 5;
        this.data.$atk = this.data.str * 1;
        this.data.$matk = this.data.int * 0.5;
        this.data.$def = 0;
        this.data.$mdef = 0;

        this.data.critical = this.data.dex * 0.005;
        this.data.dodge = this.data.dex * 0.005;

        // 计算完了战斗相关数值
        this.data.hp = this.data.$hp;
        this.data.sp = this.data.$sp;
        this.data.atk = this.data.$atk;
        this.data.def = this.data.$def;
        this.data.matk = this.data.$matk;
        this.data.mdef = this.data.$mdef;

        // 最后可以对战斗相关数值计算buff

        if (this.data.buff && this.data.nerf) {
          this.data.buff.forEach((element) => {

          });
          this.data.nerf.forEach((element) => {

          });
        }
      }
    }

    get x () {
      return this.data.x;
    }

    set x (value) {
      this.data.x = value;
      this.sprite.x = value * 32 + 16;
    }

    get y () {
      return this.data.y;
    }

    set y (value) {
      this.data.y = value;
      this.sprite.y = value * 32 + 16;
    }

    get visible () {
      return this.sprite.visible;
    }

    set visible (value) {
      this.sprite.visible = value;
      this.infoBox.visible = value;
    }

    get alpha () {
      return this.sprite.alpha;
    }

    set alpha (value) {
      this.sprite.alpha = value;
      this.infoBox.alpha = value;
    }

    get position () {
      return {
        x: this.x,
        y: this.y
      };
    }

    set position (value) {
      throw new Error("Game.Actor.position readonly");
    }

    get direction () {
      return this.sprite.currentAnimation.match(/up|left|down|right/)[0];
    }

    set direction (value) {
      throw new Error("Game.Actor.direction readonly");
    }

    get facePosition () {
      var p = this.position;
      switch (this.direction) {
        case "up":
          p.y -= 1;
          break;
        case "down":
          p.y += 1;
          break;
        case "left":
          p.x -= 1;
          break;
        case "right":
          p.x += 1;
          break;
      }
      return p;
    }

    set facePosition (value) {
      throw new Error("Game.Actor.facePosition readonly");
    }

    clone  (callback) {
      var actorObj = new Game.Actor(this.data);
      actorObj.oncomplete(callback);
    }

    refreshBar () {
      if (Game.hero && this == Game.hero) {
        Game.windows.interface.execute("status", (this.data.hp / this.data.$hp), (this.data.sp / this.data.$sp));
      }

      if (this.hpbar && this.mpbar) {
        var hpcolor = "green";
        if ((this.data.hp / this.data.$hp) < 0.25)
          hpcolor = "red";
        else if ((this.data.hp / this.data.$hp) < 0.5)
          hpcolor = "yellow";

        this.hpbar.clear().rect({
          x: 1,
          y: 1,
          width: Math.floor((this.data.hp / this.data.$hp) * 28),
          height: 2,
          fill: hpcolor,
          "stroke-width": 0
        });

        this.mpbar.clear().rect({
          x: 1,
          y: 1,
          width: Math.floor((this.data.sp / this.data.$sp) * 28),
          height: 2,
          fill: "blue",
          "stroke-width": 0
        });
      }
    }

    heroUse () {
      if (this.data.contact) {

        var options = {};

        if (this.data.contact) {
          Sprite.each(this.data.contact, (talk, key) => {
            let h = Game.hero;
            let d = Game.hero.data;
            let result = null;
            try {
              result = eval(talk.condition)
            } catch (e) {
              console.error(talk.condition);
              console.error(e);
              throw new Error("talk.condition eval error");
            }
            if (result) {
              options[key] = key;
            }
          });
        }

        if (this.data.trade) {
          options["交易"] = "trade"
        }

        Game.choice(options, (choice) => {
          switch (choice) {
            case "trade":
              Game.windows.trade.execute("trade", this.data.trade);
              break;
            default:
              if (this.data.contact[choice]) {
                Game.dialogue(this.data.contact[choice].content, this.data.name);
              }
          }
        });
      }
    }

    distance () {
      var x, y;
      if (arguments.length == 2 && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
        x = arguments[0];
        y = arguments[1];
      } else if (arguments.length == 1 && typeof arguments[0].x == "number" && typeof arguments[0].y == "number") {
        x = arguments[0].x;
        y = arguments[0].y;
      } else {
        console.error(arguments);
        throw new Error("Game.Actor.distance Invalid arguments");
      }
      var d = 0;
      d += Math.pow(this.x - x, 2);
      d += Math.pow(this.y - y, 2);
      d = Math.sqrt(d);
      return d;
    }

    decreaseHitpoint (power) {
      this.data.hp -= power;
      this.refreshBar();
      this.dead();
    }

    decreaseManapoint (mp) {
      this.data.sp -= mp;
      this.refreshBar();
    }

    dead () {
      if (this.data.hp <= 0) {
        if (this.data.type == "hero") {

        } else {
          // item0001是物品掉落之后出现的小布袋
          var dead = Game.items.bag.clone();
          console.log(dead.x, dead.y);
          dead.x = this.x;
          dead.y = this.y;
          dead.draw(Game.layers.itemLayer);
          dead.inner = {
            "gold": 1
          };
          Game.area.bags[Sprite.uuid()] = dead;

          this.remove();

          Game.area.actors.delete(this);
        }
      }
    }

    flash () {
      this.sprite.alpha = 0.5;
      setTimeout(() => {
        this.sprite.alpha = 1;
      }, 200);
    }

    damage (attacker, skill) {

      this.emit("damaged");

      var power = skill.power;
      var type = skill.type;

      var color = "white";
      if (this.data.type == "hero") {
        color = "red";
      }

      if (type == "normal") {
        power += attacker.data.atk;
        power -= this.data.def
        power = Math.max(0, power);
      } else { // type == magic
        power += attacker.data.matk;
        power - this.data.mdef
        power = Math.max(0, power);
      }

      var text = null;

      if (Math.random() < this.data.dodge) { // 闪避了
        text = new Sprite.Text({
          text: "miss",
          color: color,
          fontSize: 16
        });
      } else if (Math.random() < attacker.data.critical) { // 重击了
        power *= 2;
        text = new Sprite.Text({
          text: "-" + power,
          color: color,
          fontSize: 32
        });
        this.flash();
        this.decreaseHitpoint(power);
      } else { // 普通击中
        text = new Sprite.Text({
          text: "-" + power,
          color: color,
          fontSize: 16
        });
        this.flash();
        this.decreaseHitpoint(power);
      }

      text.centerX = Math.floor(text.width / 2);
      text.centerY = Math.floor(text.height);
      text.x = this.sprite.x;
      text.y = this.sprite.y;

      text.x += Sprite.rand(-10, 10);

      Game.layers.actorLayer.appendChild(text);

      var speed = Sprite.rand(1, 3);

      Sprite.Ticker.whiles(100, (last) => {
        text.y -= speed;
        if (last) {
          Game.layers.actorLayer.removeChild(text);
        }
      });

    }

    play (animation, priority) {
      // 新动画默认优先级为0
      if (typeof priority != "number") {
        priority = 0;
      }

      // 无动画或者停止状态，现有优先级为-1（最低级）
      if (typeof this.animationPriority == "undefined" || this.sprite.paused == true) {
        this.animationPriority = -1;
      }

      if (
        this.data.animations.hasOwnProperty(animation) &&
        priority >= this.animationPriority &&
        animation != this.sprite.currentAnimation
      ) {
        this.animationPriority = priority;
        this.sprite.play(animation);
      }
    }

    stop () {
      if (!this.sprite.currentAnimation) return;

      if ((this.sprite.paused && !this.sprite.currentAnimation.match(/face/))
        || this.sprite.currentAnimation.match(/walk|run/)) {
        switch (this.direction) {
          case "up":
            this.sprite.play("faceup");
            break;
          case "down":
            this.sprite.play("facedown");
            break;
          case "left":
            this.sprite.play("faceleft");
            break;
          case "right":
            this.sprite.play("faceright");
            break;
        }
      }
    }

    fire (id, direction) {
      // 同一时间只能施展一个skill
      if (this.attacking)
        return 0;

      var skill = Game.skills[id];
      if (!skill)
        return 0;

      // 只有当这个skill的cooldown结
      var now = new Date().getTime();
      if ( typeof this.lastAttack == "number"
        && typeof this.lastAttackCooldown == "number"
        && (now - this.lastAttack) < this.lastAttackCooldown)
        return 0;

      if (skill.data.cost > this.data.sp) {
        return 0;
      }

      if (!direction) {
        direction = this.direction;
      }

      if (skill.can(this)) {

        this.lastAttack = now;
        this.lastAttackCooldown = skill.data.cooldown;
        this.attacking = true;

        this.data.sp -= skill.data.cost;
        this.refreshBar();

        skill.fire(this, direction, (hitted) => {
          this.attacking = false;
          if (hitted.length > 0) {
            hitted[0].damage(this, skill);
          }
        });

        return skill.data.cooldown;
      } else {
        return 0;
      }
    }

    goto (x, y, state = "walk", callback = null) {
      if (this.going) {
        this.goingNext = () => {
          this.goto(x, y, state, callback);
        };
        return "wait";
      }

      let destBlocked = this.checkCollision(x, y);

      if (destBlocked) {
        if (this.x == x) {
          if (this.y - y == -1) {
            this.stop();
            this.face("down");

            return;
          } else if (this.y - y == 1) {
            this.stop();
            this.face("up");
            return;
          }
        } else if (this.y == y) {
          if (this.x - x == -1) {
            this.stop();
            this.face("right");
            return;
          } else if (this.x - x == 1) {
            this.stop();
            this.face("left");
            return;
          }
        }
      }

      let map = [];
      let height = Game.area.map.blockedMap.length;
      let width = Game.area.map.blockedMap[0].length;

      map.length = height;
      for (let i = 0; i < height; i++) {
        map[i] = [];
        map[i].length = width;
      }

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (this.checkCollision(j, i)) {
            map[i][j] = 0;
          } else {
            map[i][j] = 1;
          }
        }
      }

      var destPosition = {
        x: x,
        y: y
      };
      let after = null;
      let path = null;

      if (destBlocked == false) {
        path = Game.Astar.path(map,
          width,
          height,
          {x: this.x, y: this.y}, // 角色现在位置
          destPosition); // 目的地
      }

      // 可能因为指定x,y被阻挡，尝试寻路到指定x,y的四个邻接地点
      if (!path) {
        let otherChoice = [];
        if (this.checkCollision(x, y-1) == false) {
          otherChoice.push({x: x, y: y-1, after: "down"});
        }
        if (this.checkCollision(x, y+1) == false) {
          otherChoice.push({x: x, y: y+1, after: "up"});
        }
        if (this.checkCollision(x-1, y) == false) {
          otherChoice.push({x: x-1, y: y, after: "right"});
        }
        if (this.checkCollision(x+1, y) == false) {
          otherChoice.push({x: x+1, y: y, after: "left"});
        }

        if (otherChoice.length > 0) {
          for (let element of otherChoice) {
            // 计算地址距离
            element.distance = this.distance(element.x, element.y);
          }

          // 找到四个邻接地址中最近的
          if (otherChoice.length > 1) {
            otherChoice.sort((a, b) => {
              return a.distance - b.distance;
            });
          }

          for (let element of otherChoice) {
            path = Game.Astar.path(
              map, width, height,
              {x: this.x, y: this.y},
              {x: element.x, y: element.y}
            );
            if (path) {
              // 如果找到路径，则不再继续找（这种找法并没找到最优，最优应该是四个path都测试寻找最短）
              after = element.after;
              break;
            }
          }
        }

      }

      if (path && path.length && path.length > 1) {
        this.going = true;
        var index = 1;
        var Walk = () => {
          if (this.goingNext) {
            var c = this.goingNext;
            this.goingNext = null;
            this.going = false;
            c();
          } else if (index < path.length) {
            var current = {x: this.x, y: this.y};
            var dest = path[index];
            var direction = null;
            if (dest.x == current.x) {
              if (dest.y > current.y) {
                direction = "down";
              } else if (dest.y < current.y) {
                direction = "up";
              }
            } else if (dest.y == current.y) {
              if (dest.x > current.x) {
                direction = "right"
              } else if (dest.x < current.x) {
                direction = "left";
              }
            }

            if (direction) {
              var currentDirection = this.direction;
              if (direction != currentDirection) {
                this.face(direction);
              }
              var goResult = this.go(state, direction, () => Walk());
              if (goResult != true) {
                this.going = false;
              }
              index++;
            }
          } else { // 正常结束
            if (after) {
              this.stop();
              this.face(after);
            }
            this.going = false;
            if (typeof callback == "function") {
              callback();
            }
          }
        }
        Walk();
      } else {
        // 实在没找到路
        // console.log("noway");
      }
    }

    face (direction) {
      var animation = "face" + direction;
      if (this.animation != animation) {
        this.sprite.play(animation);
        this.emit("change");
      }
    }

    // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
    // 返回true为有碰撞，返回false为无碰撞
    checkCollision (x, y) {
      var positionKey = `${x},${y}`;
      // 角色预占位碰撞
      if (actorHold[positionKey]) {
        return true;
      }
      // 地图边缘碰撞
      if (x < 0 || y < 0 || x >= Game.area.map.data.width || y >= Game.area.map.data.height) {
        return true;
      }
      // 地图碰撞
      if (Game.area.map.hitTest(x, y)) {
        return true;
      }

      // 角色碰撞
      if (Game.area.actors) {
        for (let actor of Game.area.actors) {
          if (actor != this && actor.hitTest(x, y)) {
            return true;
          }
        }
      }
      return false;
    };

    hitTest (x, y) {
      if (this.data.hitArea && this.data.hitArea instanceof Array) {
        for (let p of this.data.hitArea) {
          if (x == this.x + p[0] && y == this.y + p[1]) {
            return true;
          }
        }
        return false;
      } else {
        console.error(this.data);
        throw new Error("Game.Actor.hitTest invalid data");
      }
    }

    go (state, direction, callback = null) {

      // 如果正在战斗动画，则不走
      if (this.sprite.paused == false && this.sprite.currentAnimation.match(/skillcast|thrust|slash|shoot/)) {
        return false;
      }

      if (this.walking) {
        return false;
      }

      if (this.attacking) {
        return false;
      }

      if (this.direction != direction) {
        this.walking = true;
        this.face(direction);
        // wait 4 ticks
        Sprite.Ticker.after(4, () => {
          this.walking = false;
        });
        return false;
      }

      var newX = this.x;
      var newY = this.y;

      var oldPositionKey = `${newX},${newY}`;

      switch (direction) {
        case "up":
          newY -= 1;
          break;
        case "down":
          newY += 1;
          break;
        case "left":
          newX -= 1;
          break;
        case "right":
          newX += 1;
          break;
      }

      var newPositionKey = `${newX},${newY}`;

      var result = this.checkCollision(newX, newY);

      if (result == false) {
        this.walking = true;
        actorHold[newPositionKey] = true;
        actorHold[oldPositionKey] = true;

        var speed = 2;
        if (state == "run") {
          speed = 4;
        }
        var times = 32 / speed;
        var count = 0;
        var id = null;

        Sprite.Ticker.whiles(times, (last) => {
          switch (direction) {
            case "up":
              this.sprite.y -= speed;
              break;
            case "down":
              this.sprite.y += speed;
              break;
            case "left":
              this.sprite.x -= speed;
              break;
            case "right":
              this.sprite.x += speed;
              break;
          }

          if (last) {
            delete actorHold[newPositionKey];
            delete actorHold[oldPositionKey];
            this.x = newX;
            this.y = newY;
            this.walking = false;
            this.emit("change");

            if (typeof callback == "function") {
              Sprite.Ticker.after(2,function () {
                callback();
              });
            }

          }
        });

        this.play(state + direction, 1);
        return true;
      }

      this.play("face" + direction, 0);

      return false;
    }

    remove () {
      Game.layers.actorLayer.removeChild(this.sprite);
      Game.layers.infoLayer.removeChild(this.infoBox);
    }

    draw () {
      if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
        this.x = this.data.x;
        this.y = this.data.y;

        this.infoBox.x = this.sprite.x;
        this.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.layers.actorLayer.appendChild(this.sprite);
        Game.layers.infoLayer.appendChild(this.infoBox);
      } else {
        console.error(this.data);
        throw new Error("Game.Actor.draw invalid data.x/data.y");
      }
    }

    focus () {
      this.infoBox.x = this.sprite.x;
      this.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

      Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
      Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
    }

  } // Game.Actor

})();
