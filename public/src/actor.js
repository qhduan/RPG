/*

Online A-RPG Game, Built using Node.js + createjs
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

  Game.oninit(function () {

    createjs.Ticker.on("tick", function () {

      // 当有人物正在播放animation时（paused == false）则刷新Game.stage

      for (var i = 0; i < Game.actorLayer.children.length; i++) {
        if (Game.actorLayer.children[i].paused == false) {
          Game.update();
          break;
        }
      }
      for (var i = 0; i < Game.heroLayer.children.length; i++) {
        if (Game.heroLayer.children[i].paused == false) {
          Game.update();
          break;
        }
      }
      for (var i = 0; i < Game.playerLayer.children.length; i++) {
        if (Game.playerLayer.children[i].paused == false) {
          Game.update();
          break;
        }
      }

    });

  });

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.animation 当前精灵动作
      this.sprite 精灵
  */
  Game.ActorClass = class ActorClass extends Game.EventClass {
    constructor (actorData) {
      super();

      this.data = actorData;
      this.id = this.data.id;

      this.currentHitpoint = this.data.hitpoint;
      this.currentManapoint = this.data.manapoint;

      // 名字
      this.text = new createjs.Text(this.data.name, "12px Arial", "white");
      this.text.regY = this.text.getMeasuredHeight() / 2;
      this.text.regX = this.text.getMeasuredWidth() / 2;
      this.text.x = 0;
      this.text.y = 0;

      // 血条外面的黑框
      this.hpbarBox = new createjs.Shape();
      this.hpbarBox.graphics
        .beginStroke("black")
        .drawRect(0, 0, 30, 3);
      this.hpbarBox.regX = 15;
      this.hpbarBox.regY = 2;
      this.hpbarBox.x = 0;
      this.hpbarBox.y = 10;
      // 魔法条外面的黑框
      this.mpbarBox = new createjs.Shape();
      this.mpbarBox.graphics
        .beginStroke("black")
        .drawRect(0, 0, 30, 3);
      this.mpbarBox.regX = 15;
      this.mpbarBox.regY = 2;
      this.mpbarBox.x = 0;
      this.mpbarBox.y = 14;
      // 血条
      this.hpbar = new createjs.Shape();
      this.hpbar.regX = 15;
      this.hpbar.regY = 2;
      this.hpbar.x = 0;
      this.hpbar.y = 10;
      // 根据血量不同设定不同颜色
      var hpcolor = "green";
      if ((this.currentHitpoint / this.data.hitpoint) < 0.25)
        hpcolor = "red";
      else if ((this.currentHitpoint / this.data.hitpoint) < 0.5)
        hpcolor = "yellow";

      this.hpbar.graphics
        .clear()
        .beginFill(hpcolor)
        .drawRect(0, 0, parseInt((this.currentHitpoint / this.data.hitpoint) * 30), 3);

      // 魔法条
      this.mpbar = new createjs.Shape();
      this.mpbar.regX = 15;
      this.mpbar.regY = 2;
      this.mpbar.x = 0;
      this.mpbar.y = 14;
      this.mpbar.graphics
        .clear()
        .beginFill("blue")
        .drawRect(0, 0, parseInt((this.currentManapoint / this.data.manapoint) * 30), 3);

      // 一个上面四个魔法条、血条的聚合，统一管理放入这个Container
      this.infoBox = new createjs.Container();

      if (this.data.type == "npc") {
        this.text.y += 10;
        this.infoBox.addChild(this.text);
      } else {
        this.infoBox.addChild(this.text, this.hpbarBox, this.mpbarBox, this.hpbar, this.mpbar);
      }

      var image = null;

      if (this.data.image instanceof Image) {
        image = this.data.image;
      } else if (Game.resources.hasOwnProperty(this.data.image)) {
        image = Game.resources[this.data.image];
      } else {
        console.log("ActorClass Invalid Image");
      }

      var sheet = new createjs.SpriteSheet({
        images: [image],
        frames: {
          width: this.data.tilewidth,
          height: this.data.tileheight,
          regX: parseInt(this.data.tilewidth / 2), // regX和regY把角色中间设定为中间
          regY: parseInt(this.data.tileheight / 2)
        },
        animations: this.data.animations
      });
      //this.sprite = new createjs.Sprite(sheet);

      this.sprite = new createjs.Sprite(sheet, "facedown");

      this.sprite.x = 0;
      this.sprite.y = 0;

      if (this.data.spells) {
        for (var key in this.data.spells) {
          this.data.spells[key] = new Game.SpellClass(this.data.spells[key]);
        }
      }

      // 发送完成事件，第二个参数代表一次性事件
      super.emit("complete", true);
    }

    get x () {
      return this.sprite.x;
    }

    get y () {
      return this.sprite.y;
    }

    set x (v) {
      this.sprite.x = v;
      Game.update();
    }

    set y (v) {
      this.sprite.y = v;
      Game.update();
    }
/*
    on (event, listener) {
      if (this[event])
        return listener(this);

      if (!this.listeners)
        this.listeners = {};

      if (!this.listeners[event])
        this.listeners[event] = {};

      var id = uuid.v4();
      this.listeners[event][id] = listener;
    }

    off  (event, id) {
      if (this.listeners[event] && this.listeners[event][id]) {
        delete this.listeners[event][id];
      }
    }

    emit (event, data) {
      if (this.listeners && this.listeners[event]) {
        for (let key in this.listeners[event]) {
          this.listeners[event][key](data);
        }
      }
    }
 */
    clone  (callback) {
      var actorObj = new ActorClass(this.data);
      actorObj.oncomplete(callback);
    }

    use () {
      if (this.data.use) {
        if (this.data.use.type == "talk") {
          var dialogueText = new createjs.Text(this.data.use.content);
          var w = dialogueText.getMeasuredWidth();
          var h = dialogueText.getMeasuredHeight();
          var dialogueBox = new createjs.Shape();
          dialogueBox.graphics
          .beginStroke("black")
          .beginFill("white")
          .drawRoundRect(0, 0, w + 10, h + 10, 5);

          dialogueBox.graphics
          .beginFill("white")
          .moveTo(w + 5, h + 8)
          .lineTo(w, h + 15)
          .lineTo(w - 5, h + 8)
          .beginStroke("white")
          .lineTo(w + 5, h + 8);

          var dialogueContainer = new createjs.Container();
          dialogueContainer.addChild(dialogueBox, dialogueText);
          dialogueText.x = 5;
          dialogueText.y = 5;
          dialogueContainer.x = this.x;
          dialogueContainer.y = this.y - this.sprite.spriteSheet.getFrame(0).regY;
          dialogueContainer.regX = w - 5;
          dialogueContainer.regY = h + 8;

          Game.dialogueLayer.addChild(dialogueContainer);
          setTimeout(() => {
            Game.dialogueLayer.removeChild(dialogueContainer);
            Game.update();
          }, 5000);
          Game.update();
        }
      }
    }

    distance (x, y) {
      var d = 0;
      d += Math.pow(this.x - x, 2);
      d += Math.pow(this.y - y, 2);
      return parseInt(Math.sqrt(d));
    }

    decreaseHitpoint (hp) {
      this.currentHitpoint -= hp;

      if (this.currentHitpoint <= 0) {

        // item0001是物品掉落之后出现的小布袋
        Game.items.item0001.clone((dead) => {
          dead.draw(Game.itemLayer, this.sprite.x, this.sprite.y);
        });

        Game.actorLayer.removeChild(this.infoBox);
        Game.actorLayer.removeChild(this.sprite);

        delete Game.area.actors[this.id];

      } else {
        var hpcolor = "green";
        if ((this.currentHitpoint / this.data.hitpoint) < 0.25)
          hpcolor = "red";
        else if ((this.currentHitpoint / this.data.hitpoint) < 0.5)
          hpcolor = "yellow";

        this.hpbar.graphics
          .clear()
          .beginFill(hpcolor)
          .drawRect(0, 0, parseInt((this.currentHitpoint / this.data.hitpoint) * 30), 3);
      }


      Game.update();
    }

    decreaseManapoint (mp) {
      var self = this;

      this.currentManapoint -= mp;

      this.mpbar.graphics
        .clear()
        .beginFill("blue")
        .drawRect(0, 0, parseInt((this.currentManapoint / this.data.manapoint) * 30), 3);

      Game.update();
    }

    damage (hp, mp) {
      var self = this;

      if (typeof hp == "number" && !isNaN(hp) && hp > 0)
        this.decreaseHitpoint(hp);
      if (typeof mp == "number" && !isNaN(mp) && mp > 0)
        this.decreaseManapoint(mp);
    }

    play (animation, priority) {
      var self = this;

      var direction = animation.match(/down|left|right|up/)[0];

      // 新动画默认优先级为0
      if (typeof priority == "undefined")
        priority = 0;

      // 无动画或者停止状态，现有优先级为-1（最低级）
      if (typeof this.animationPriority == "undefined" || this.sprite.paused == true)
        this.animationPriority = -1;

      if (this.data.animations.hasOwnProperty(animation)
      && priority >= this.animationPriority
      && animation != this.sprite.currentAnimation) {
        this.animationPriority = priority;
        this.sprite.gotoAndPlay(animation);
      }
    }

    stop () {
      var self = this;

      if (!this.sprite.currentAnimation) return;

      if ((this.sprite.paused && !this.sprite.currentAnimation.match(/face/))
        || this.sprite.currentAnimation.match(/walk|run/)) {
        switch (this.sprite.currentAnimation.match(/up|down|left|right/)[0]) {
          case "up":
            this.sprite.gotoAndStop("faceup");
            break;
          case "down":
            this.sprite.gotoAndStop("facedown");
            break;
          case "left":
            this.sprite.gotoAndStop("faceleft");
            break;
          case "right":
            this.sprite.gotoAndStop("faceright");
            break;
        }
      }
    }

    fire (num, direction) {
      var self = this;

      // 同一时间只能施展一个spell
      if (this.attacking)
        return 0;

      var spell = this.data.spellbar[num];
      if (!spell)
        return 0;

      // 只有当这个spell的cooldown结
      var now = new Date().getTime();
      if ( typeof this.lastAttack == "number"
        && typeof this.lastAttackCooldown == "number"
        && (now - this.lastAttack) < this.lastAttackCooldown)
        return 0;

      this.lastAttack = now;
      this.lastAttackCooldown = this.data.spells[spell].data.cooldown;
      this.attacking = true;

      if (!direction) {
        direction = this.sprite.currentAnimation.match(/up|left|down|right/)[0];
      }

      this.data.spells[spell].fire(self, "attack" + direction, (hittedActorIds) => {
        this.attacking = false;
        if (hittedActorIds && hittedActorIds.length) {
          Game.io.hit(this.data.spells[spell].id, hittedActorIds);
        }
      });

      if (this.id == Game.hero.id) {
        Game.io.sync("attack", {
          num: num,
          direction: direction
        });
      }

      return this.data.spells[spell].data.cooldown;
    }

    gotoXY (x, y, speed, collisionTest, callback) {
      var self = this;

      if (this.gotoXYListener) {
        createjs.Ticker.off("tick", this.gotoXYListener);
        this.gotoXYListener = null;
      }

      x -= this.sprite.x;
      y -= this.sprite.y;

      var state = "walk";

      var limit = speed;

      this.gotoXYListener = createjs.Ticker.on("tick", () => toXY());

      var toXY = () => {

        if (x == 0 && y == 0) {
          if (this.gotoXYListener) {
            createjs.Ticker.off("tick", this.gotoXYListener);
            this.gotoXYListener = null;
          }
          this.stop();
          if (callback) callback();
        } else if (Math.abs(x) > limit && Math.abs(y) > limit) {
          var skew = speed / 1.4;
          var direction = "";
          if (y < 0) {
            direction = "up"
            y += skew;
          } else {
            direction = "down";
            y -= skew;
          }
          if (x < 0) {
            direction += "left";
            x += skew;
          } else {
            direction += "right";
            x -= skew;
          }
          this.go(state, direction, skew, collisionTest);
        } else if (Math.abs(x) > limit) {
          if (x > 0) {
            this.go(state, "right", speed, collisionTest);
            x -= speed;
          } else {
            this.go(state, "left", speed, collisionTest);
            x += speed;
          }
        } else if (Math.abs(y) > limit) {
          if (y > 0) {
            this.go(state, "down", speed, collisionTest);
            y -= speed;
          } else {
            this.go(state, "up", speed, collisionTest);
            y += speed;
          }
        } else if (Math.abs(y) != 0) {
          if (y > 0) {
            this.go(state, "down", y, collisionTest);
            y = 0;
          } else {
            this.go(state, "up", -y, collisionTest);
            y = 0;
          }
        } else if (Math.abs(x) != 0) {
          if (x > 0) {
            this.go(state, "right", x, collisionTest);
            x = 0;
          } else {
            this.go(state, "left", -x, collisionTest);
            x = 0;
          }
        }
      }

    }

    face (direction) {
      var self = this;

      var animation = "face" + direction;
      if (this.animation != animation) {
        this.sprite.gotoAndStop(animation);
        Game.update();
      }
    }




    // 这个函数是测试某个方向能否走，能移动则移动
    // direction的值有up，down，left，right四种可能
    // 建立这个函数是因为一次行走虽然是一次，但是也可以潮四个角方向走，实际就要执行两次CheckDirection
    CheckDirection (direction, step, collisionTest) {

      var oldX = this.sprite.x;
      var oldY = this.sprite.y;

      switch (direction) {
        case "up":
          this.sprite.y += -step;
          break;
        case "down":
          this.sprite.y += step;
          break;
        case "left":
          this.sprite.x += -step;
          break;
        case "right":
          this.sprite.x += step;
          break;
      }

      this.sprite.x = parseInt(this.sprite.x);
      this.sprite.y = parseInt(this.sprite.y);

      var t = Game.area.map.tile(this.sprite.x, this.sprite.y);

      var tested = {};

      // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
      var CheckCollision = (t) => {
        if (t.x < 0 || t.y < 0 || t.x >= Game.area.map.data.width || t.y >= Game.area.map.data.height)
          return true;

        var i = t.x + "-" + t.y;
        if (tested.hasOwnProperty(i))
          return tested[i];

        if (Game.area.map.blockedMap[t.y] && Game.area.map.blockedMap[t.y][t.x]) {
          if (Game.actorCollision(this.sprite, Game.area.map.blockedMap[t.y][t.x])) {
            tested[i] = true;
            return true;
          }
        }
        tested[i] = false;
        return false;
      };

      var collision = false;

      if (collisionTest) {
        if (collision == false) collision = CheckCollision(t);

        if (collision == false) collision = CheckCollision({x: t.x, y: t.y + 1});
        if (collision == false) collision = CheckCollision({x: t.x, y: t.y - 1});
        if (collision == false) collision = CheckCollision({x: t.x - 1, y: t.y});
        if (collision == false) collision = CheckCollision({x: t.x + 1, y: t.y});

        if (collision == false) collision = CheckCollision({x: t.x + 1, y: t.y - 1});
        if (collision == false) collision = CheckCollision({x: t.x + 1, y: t.y + 1});
        if (collision == false) collision = CheckCollision({x: t.x - 1, y: t.y - 1});
        if (collision == false) collision = CheckCollision({x: t.x - 1, y: t.y + 1});
      }

      // 碰撞了
      if (collision) {
        this.sprite.x = oldX;
        this.sprite.y = oldY;
        return false;
      } else {
        this.infoBox.x = this.sprite.x;
        this.infoBox.y = this.sprite.y - this.sprite.spriteSheet.getFrame(0).regY - 20;

        return true;
      }
    }

    go (state, direction, step, collisionTest) {
      // 如果正在战斗动画，则不走
      if (this.sprite.paused == false && this.sprite.currentAnimation.match(/spellcast|thrust|slash|shoot/)) {
        return false;
      }

      if (this.data.weapons) {
        if (this.bowSprite.paused == false || this.daggerSprite.paused == false || this.spearSprite.paused == false || this.woodwandSprite.paused == false)
          return false;
      }

      if (typeof collisionTest == "undefined") {
        collisionTest = true;
      }

      // 八个方向的检测
      // 以四个角度方向为例，如果玩家希望走 右上，如果右走不了，只会会走上；上走不了，只会走右；右和上都走不了，则停止
      // 就算走不了，也改变人物的面部朝向
      switch (direction) {
        case "upleft":
          if (this.CheckDirection("up", step, collisionTest) | this.CheckDirection("left", step, collisionTest)) {
            this.play(state + "up", 1);
          } else {
            this.play("faceup", 0);
          }
          break;
        case "upright":
          if (this.CheckDirection("up", step, collisionTest) | this.CheckDirection("right", step, collisionTest)) {
            this.play(state + "up", 1);
          } else {
            this.play("faceup", 0);
          }
          break;
        case "downleft":
          if (this.CheckDirection("down", step, collisionTest) | this.CheckDirection("left", step, collisionTest)) {
            this.play(state + "down", 1);
          } else {
            this.play("facedown", 0);
          }
          break;
        case "downright":
          if (this.CheckDirection("down", step, collisionTest) | this.CheckDirection("right", step, collisionTest)) {
            this.play(state + "down", 1);
          } else {
            this.play("facedown", 0);
          }
          break;
        case "up":
          if (this.CheckDirection("up", step, collisionTest)) {
            this.play(state + "up", 1);
          } else {
            this.play("faceup", 0);
          }
          break;
        case "down":
          if (this.CheckDirection("down", step, collisionTest)) {
            this.play(state + "down", 1);
          } else {
            this.play("facedown", 0);
          }
          break;
        case "left":
          if (this.CheckDirection("left", step, collisionTest)) {
            this.play(state + "left", 1);
          } else {
            this.play("faceleft", 0);
          }
          break;
        case "right":
          if (this.CheckDirection("right", step, collisionTest)) {
            this.play(state + "right", 1);
          } else {
            this.play("faceright", 0);
          }
          break;
      }

      if (this.id == Game.hero.id) {
        Game.io.sync("move", {
          x: this.sprite.x,
          y: this.sprite.y,
          speed: step
        });
      }
    }

    remove (layer) {
      layer.removeChild(this.sprite);
      layer.removeChild(this.infoBox);
      Game.update();
    }

    draw (layer) {
      var x = this.data.x;
      var y = this.data.y;

      if (typeof x != "number" || typeof y != "number") {
        x = Game.area.map.data.entry.x;
        y = Game.area.map.data.entry.y;
      }

      this.infoBox.x = x;
      this.infoBox.y = y - this.sprite.spriteSheet.getFrame(0).regY - 20;

      this.sprite.x = x;
      this.sprite.y = y;

      layer.addChild(this.sprite);
      layer.addChild(this.infoBox);

      Game.update()
    }

    focus () {
      var self = this;

      this.infoBox.x = this.sprite.x;
      this.infoBox.y = this.sprite.y - this.sprite.spriteSheet.getFrame(0).regY - 20

      Game.stage.regX = parseInt(this.sprite.x - Game.config.width / 2);
      Game.stage.regY = parseInt(this.sprite.y - Game.config.height / 2);
    }

  } // ActorClass

})();
