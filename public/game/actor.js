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

      if (Game.stage) {
        for (var i = 0; i < Game.stage.children.length; i++) {
          if (Game.stage.children[i].paused == false) {
            Game.updateStage();
            break;
          }
        }
      }

    });

  });


  /*
    角色类，包括涉及到hero和npc
    属性：
      self.animation 当前精灵动作
      self.sprite 精灵
  */
  var ActorClass = Game.ActorClass = function (actorData) {
    var self = this;

    self.data = actorData;
    self.id = self.data.id;

    self.currentHitpoint = self.data.hitpoint;
    self.currentManapoint = self.data.manapoint;

    self.text = new createjs.Text(self.data.name, "12px Arial", "white");
    self.text.regY = self.text.getMeasuredHeight() / 2;
    self.text.regX = self.text.getMeasuredWidth() / 2;
    self.text.x = 0;
    self.text.y = 0;

    // 血条外面的黑框
    self.hpbarBox = new createjs.Shape();
    self.hpbarBox.graphics
      .beginStroke("black")
      .drawRect(0, 0, 30, 3);
    self.hpbarBox.regX = 15;
    self.hpbarBox.regY = 2;
    self.hpbarBox.x = 0;
    self.hpbarBox.y = 10;
    // 魔法条外面的黑框
    self.mpbarBox = new createjs.Shape();
    self.mpbarBox.graphics
      .beginStroke("black")
      .drawRect(0, 0, 30, 3);
    self.mpbarBox.regX = 15;
    self.mpbarBox.regY = 2;
    self.mpbarBox.x = 0;
    self.mpbarBox.y = 14;
    // 血条
    self.hpbar = new createjs.Shape();
    self.hpbar.regX = 15;
    self.hpbar.regY = 2;
    self.hpbar.x = 0;
    self.hpbar.y = 10;
    // 根据血量不同设定不同颜色
    var hpcolor = "green";
    if ((self.currentHitpoint / self.data.hitpoint) < 0.25)
      hpcolor = "red";
    else if ((self.currentHitpoint / self.data.hitpoint) < 0.5)
      hpcolor = "yellow";

    self.hpbar.graphics
      .clear()
      .beginFill(hpcolor)
      .drawRect(0, 0, parseInt((self.currentHitpoint / self.data.hitpoint) * 30), 3);

    // 魔法条
    self.mpbar = new createjs.Shape();
    self.mpbar.regX = 15;
    self.mpbar.regY = 2;
    self.mpbar.x = 0;
    self.mpbar.y = 14;
    self.mpbar.graphics
      .clear()
      .beginFill("blue")
      .drawRect(0, 0, parseInt((self.currentManapoint / self.data.manapoint) * 30), 3);

    // 一个上面四个魔法条、血条的聚合，统一管理放入这个Container
    self.infoBox = new createjs.Container();
    self.infoBox.addChild(self.text, self.hpbarBox, self.mpbarBox, self.hpbar, self.mpbar);

    var image = null;

    if (Game.resources.hasOwnProperty(self.data.image)) {
      image = Game.resources[self.data.image];
    } else if (self.data.image) {
      image = new Image();
      image.src = self.data.image;
    } else {
      console.log("ActorClass Invalid Image");
    }

    function ImageComplete () {

      Game.resources[self.data.image] = image;

      var sheet = new createjs.SpriteSheet({
        images: [image],
        frames: {
          width: self.data.tilewidth,
          height: self.data.tileheight,
          regX: parseInt(self.data.tilewidth / 2), // regX和regY把角色中间设定为中间
          regY: parseInt(self.data.tileheight / 2)
        },
        animations: self.data.animations
      });

      self.sprite = new createjs.Sprite(sheet, "facedown");

      function SheetComplete () {
        self.sprite.x = 0;
        self.sprite.y = 0;
        Game.updateStage();

        // 完成事件
        self.complete = true;
        if (self.listeners && self.listeners["complete"]) {
          for (var key in self.listeners["complete"]) {
            self.listeners["complete"][key](self);
          }
        }
      }

      if (sheet.complete) {
        SheetComplete()
      } else {
        sheet.on("complete", SheetComplete);
      }
    } // ImageComplete

    if (image.complete) {
      ImageComplete();
    } else {
      image.onload = ImageComplete();
    }

    if (self.data.spellData) {
      var spellSound = [];
      self.spellObj = {};

      var queue = new createjs.LoadQueue(true);
      queue.installPlugin(createjs.Sound);

      for (var key in self.data.spellData) {
        var spellData = self.data.spellData[key];
        self.spellObj[spellData.id] = new Game.SpellClass(spellData);
        queue.loadFile({
          src: spellData.sound
        });
      }
    }

  };

  ActorClass.prototype.on = function (event, listener) {
    var self = this;

    if (!self.listeners)
      self.listeners = {};

    if (!self.listeners[event])
      self.listeners[event] = {};

    var id = Math.random().toString(16).substr(2);
    self.listeners[event][id] = listener;
  };

  ActorClass.prototype.off = function (event, id) {
    var self = this;

    if (self.listeners[event] && self.listeners[event][id]) {
      delete self.listeners[event][id];
    }
  };

  ActorClass.prototype.oncomplete = function (callback) {
    var self = this;

    if (self.complete) {
      callback(self);
    } else {
      self.on("complete", callback);
    }
  };

  ActorClass.prototype.clone = function (callback) {
    var self = this;

    var actorObj = new ActorClass(self.data);
    actorObj.oncomplete(callback);
  };

  ActorClass.prototype.decreaseHitpoint = function (hp) {
    var self = this;

    self.currentHitpoint -= hp;

    if (self.currentHitpoint <= 0) {

      // item0001是物品掉落之后出现的小布袋
      Game.items.item0001.clone(function (dead) {
        dead.bitmap.x = self.sprite.x;
        dead.bitmap.y = self.sprite.y;
        Game.stage.addChild(dead.bitmap);
        // 因为sprite在hero下面，而如果直接加那么dead就会出现在hero上面，所以swap一下，保证dead不会在hero之上
        Game.stage.swapChildren(dead.bitmap, self.sprite);
      });

      //Game.stage.removeChild(self.infoBox);
      //Game.stage.removeChild(self.sprite);

      // 没有removeChild而是设置visible是因为easeljs似乎有bug，会导致tick事件一个error
      self.sprite.visible = 0;
      self.infoBox.visible = 0;

      delete Game.currentArea.data.actors[self.id];

    } else {
      var hpcolor = "green";
      if ((self.currentHitpoint / self.data.hitpoint) < 0.25)
        hpcolor = "red";
      else if ((self.currentHitpoint / self.data.hitpoint) < 0.5)
        hpcolor = "yellow";

      self.hpbar.graphics
        .clear()
        .beginFill(hpcolor)
        .drawRect(0, 0, parseInt((self.currentHitpoint / self.data.hitpoint) * 30), 3);
    }


    Game.updateStage();
  };

  ActorClass.prototype.decreaseManapoint = function (mp) {
    var self = this;

    self.currentManapoint -= mp;

    self.mpbar.graphics
      .clear()
      .beginFill("blue")
      .drawRect(0, 0, parseInt((self.currentManapoint / self.data.manapoint) * 30), 3);

    Game.updateStage();
  };

  // 计算某个type类型，攻击力attack的技能对本角色的伤害
  ActorClass.prototype.damage = function (type, attack) {
    var self = this;

    self.decreaseHitpoint(attack);
  };


  // 播放某个动画
  ActorClass.prototype.play = function (animation, priority) {
    var self = this;

    // 新动画默认优先级为0
    if (typeof priority == "undefined")
      priority = 0;

    // 无动画或者停止状态，现有优先级为-1（最低级）
    if (typeof self.animationPriority == "undefined" || self.sprite.paused == true)
      self.animationPriority = -1;

    if (self.data.animations.hasOwnProperty(animation)
    && priority >= self.animationPriority
    && animation != self.sprite.currentAnimation) {
      self.animationPriority = priority;
      self.sprite.gotoAndPlay(animation);
    }
  };

  ActorClass.prototype.stop = function () {
    var self = this;

    if (!self.sprite.currentAnimation) return;

    if ((self.sprite.paused && !self.sprite.currentAnimation.match(/face/))
      || self.sprite.currentAnimation.match(/walk|run/)) {
      switch (self.sprite.currentAnimation.match(/up|down|left|right/)[0]) {
        case "up":
          self.sprite.gotoAndStop("faceup");
          break;
        case "down":
          self.sprite.gotoAndStop("facedown");
          break;
        case "left":
          self.sprite.gotoAndStop("faceleft");
          break;
        case "right":
          self.sprite.gotoAndStop("faceright");
          break;
      }
    }
  };

  ActorClass.prototype.fire = function (num) {
    var self = this;

    var spell = self.data.spells[num];
    if (spell) {
      var direction = self.sprite.currentAnimation.match(/up|left|down|right/)[0];
      self.spellObj[spell].fire(self, "attack" + direction);
    }
  };

  ActorClass.prototype.followHero = function () {
    var self = this;

    self.stopFollowHero();

    var DistanceToHero = function () {
      var distance = 0;
      distance += Math.pow(self.sprite.x - Game.hero.sprite.x, 2);
      distance += Math.pow(self.sprite.y - Game.hero.sprite.y, 2);
      distance = Math.sqrt(distance);
      return distance;
    };

    var walking = false;

    self.followHerolistener = createjs.Ticker.on("tick", function () {
      if (walking == false) {
        if (DistanceToHero() > 100) {
          walking = true;
          self.gotoXY(Game.hero.sprite.x, Game.hero.sprite.y, "walk", function () {
            walking = false;
          });
        }
      }
    });
  };

  ActorClass.prototype.stopFollowHero = function () {
    var self = this;

    if (self.followHerolistener) {
      createjs.Ticket.off("tick", self.followHerolistener);
      self.followHerolistener = null;
    }
  };

  ActorClass.prototype.gotoXY = function (x, y, state, callback) {
    var self = this;

    if (self.gotoXYListener) {
      createjs.Ticker.off("tick", self.gotoXYListener);
      self.gotoXYListener = null;
    }

    x -= self.sprite.x;
    y -= self.sprite.y;

    state = state || "walk";

    var speed = Game.config.walk;
    if (state == "run") {
      speed = Game.config.run;
    }

    var limit = 5;

    self.gotoXYListener = createjs.Ticker.on("tick", toXY);

    function toXY () {

      if (Math.abs(x) > limit && Math.abs(y) > limit) {
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
          direction += "right";
          x += skew;
        } else {
          direction += "left";
          x -= skew;
        }

        self.go(state, direction, skew);
      } else if (Math.abs(x) > limit) {
        if (x > 0) {
          self.go(state, "right", speed);
          x -= speed;
        } else {
          self.go(state, "left", speed);
          x += speed;
        }

      } else if (Math.abs(y) > limit) {
        if (y > 0) {
          self.go(state, "down", speed);
          y -= speed;
        } else {
          self.go(state, "up", speed);
          y += speed;
        }
      } else {
        if (self.gotoXYListener) {
          createjs.Ticker.off("tick", self.gotoXYListener);
          self.gotoXYListener = null;
        }
        self.stop();
        if (callback) callback();
      }
    }

  };

  ActorClass.prototype.face = function (direction) {
    var self = this;

    var animation = "face" + direction;
    if (self.animation != animation) {
      self.sprite.gotoAndStop(animation);
      Game.updateStage();
    }
  };

  ActorClass.prototype.go = function (state, direction, step, collisionTest) {
    var self = this;

    // 如果正在战斗动画，则不走
    if (self.sprite.paused == false && self.sprite.currentAnimation.match(/spellcast|thrust|slash|shoot/)) {
      return false;
    }

    if (typeof collisionTest == "undefined") {
      collisionTest = true;
    }

    var sprite = self.sprite;

    // 临时保存本次判断过的坐标方格，一定程度上避免重复
    var tested = {};

    // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
    var CheckCollision = function (t) {
      if (t.x < 0 || t.y < 0 || t.x >= Game.currentArea.data.width || t.y >= Game.currentArea.data.height)
        return true;

      var i = t.x + "-" + t.y;
      if (tested.hasOwnProperty(i))
        return tested[i];

      if (Game.currentArea.blockedMap[t.y] && Game.currentArea.blockedMap[t.y][t.x]) {
        if (Game.actorCollision(self.sprite, Game.currentArea.blockedMap[t.y][t.x])) {
          tested[i] = true;
          return true;
        }
      }
      tested[i] = false;
      return false;
    };

    // 这个函数是测试某个方向能否走，能移动则移动
    // direction的值有up，down，left，right四种可能
    function CheckDirection (direction) {

      var oldX = sprite.x;
      var oldY = sprite.y;

      switch (direction) {
        case "up":
          sprite.y += -step;
          break;
        case "down":
          sprite.y += step;
          break;
        case "left":
          sprite.x += -step;
          break;
        case "right":
          sprite.x += step;
          break;
      }

      var t = Game.currentArea.tile(sprite.x, sprite.y);

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
        sprite.x = oldX;
        sprite.y = oldY;
        return false;
      } else {
        self.infoBox.x = self.sprite.x;
        self.infoBox.y = self.sprite.y - 35;
        return true;
      }
    }

    // 八个方向的检测
    // 以四个角度方向为例，如果玩家希望走 右上，如果右走不了，只会会走上；上走不了，只会走右；右和上都走不了，则停止
    // 就算走不了，也改变人物的面部朝向
    switch (direction) {
      case "upleft":
        if (CheckDirection("up") | CheckDirection("left")) {
          self.play(state + "up", 1);
        } else {
          self.play("faceup", 0);
        }
        break;
      case "upright":
        if (CheckDirection("up") | CheckDirection("right")) {
          self.play(state + "up", 1);
        } else {
          self.play("faceup", 0);
        }
        break;
      case "downleft":
        if (CheckDirection("down") | CheckDirection("left")) {
          self.play(state + "down", 1);
        } else {
          self.play("facedown", 0);
        }
        break;
      case "downright":
        if (CheckDirection("down") | CheckDirection("right")) {
          self.play(state + "down", 1);
        } else {
          self.play("facedown", 0);
        }
        break;
      case "up":
        if (CheckDirection("up")) {
          self.play(state + "up", 1);
        } else {
          self.play("faceup", 0);
        }
        break;
      case "down":
        if (CheckDirection("down")) {
          self.play(state + "down", 1);
        } else {
          self.play("facedown", 0);
        }
        break;
      case "left":
        if (CheckDirection("left")) {
          self.play(state + "left", 1);
        } else {
          self.play("faceleft", 0);
        }
        break;
      case "right":
        if (CheckDirection("right")) {
          self.play(state + "right", 1);
        } else {
          self.play("faceright", 0);
        }
        break;
    }
  };

  ActorClass.prototype.randomWalk = function () {

  };

  ActorClass.prototype.stopRandomWalk = function () {

  };

  ActorClass.prototype.draw = function (x, y) {
    var self = this;

    if (typeof x != "number")
      x = self.data.x;

    if (typeof y != "number")
      y = self.data.y;

    if (typeof x != "number" || typeof y != "number") {
      console.log(self);
      throw "ActorClass.draw Invalid Arguments";
    }

    self.infoBox.x = x;
    self.infoBox.y = y - 35;

    self.sprite.x = x;
    self.sprite.y = y;

    Game.stage.addChild(self.sprite);
    Game.stage.addChild(self.infoBox);

    if (self.data.mode && self.data.mode.length) {

      if (self.data.mode == "randomwalk") {
        var RandomWalk = function () {
          var x = parseInt(Math.random() * 50 - 25);
          var y = parseInt(Math.random() * 50 - 25);

        //  console.log(x, y)

          x += self.sprite.x;
          y += self.sprite.y;

          var distance = 0;
          distance += Math.pow(x - self.data.x, 2);
          distance += Math.pow(y - self.data.y, 2);
          distance = Math.sqrt(distance);
        //            console.log(distance)

          if (distance < 100) {
            self.gotoXY(x, y);
          }

          setTimeout(RandomWalk, 3000 + parseInt(Math.random() * 1000 - 500));
        };
        RandomWalk();
      }
    }

    Game.updateStage()
  };

  ActorClass.prototype.focus = function () {
    var self = this;

    self.infoBox.x = self.sprite.x;
    self.infoBox.y = self.sprite.y - 35;

    Game.stage.setTransform(0, 0,
      Game.stage.scaleX,
      Game.stage.scaleY,
      0, 0, 0,
      parseInt(self.sprite.x - Game.config.width / 2),
      parseInt(self.sprite.y - Game.config.height / 2)
    );
  };

})();
