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

    if (self.data.image instanceof Image) {
      image = self.data.image;
    } else if (Game.resources.hasOwnProperty(self.data.image)) {
      image = Game.resources[self.data.image];
    } else {
      console.log("ActorClass Invalid Image");
    }

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
    //self.sprite = new createjs.Sprite(sheet);

    self.sprite = new createjs.Sprite(sheet, "facedown");

    function SheetComplete () {
      self.sprite.x = 0;
      self.sprite.y = 0;
      Game.update();

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

    if (self.data.spells) {
      for (var key in self.data.spells) {
        self.data.spells[key] = new Game.SpellClass(self.data.spells[key]);
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
        dead.draw(Game.itemLayer, self.sprite.x, self.sprite.y);
      });

      Game.actorLayer.removeChild(self.infoBox);
      Game.actorLayer.removeChild(self.sprite);

      delete Game.area.actors[self.id];

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


    Game.update();
  };

  ActorClass.prototype.decreaseManapoint = function (mp) {
    var self = this;

    self.currentManapoint -= mp;

    self.mpbar.graphics
      .clear()
      .beginFill("blue")
      .drawRect(0, 0, parseInt((self.currentManapoint / self.data.manapoint) * 30), 3);

    Game.update();
  };

  // 计算某个type类型，攻击力attack的技能对本角色的伤害
  ActorClass.prototype.damage = function (type, attack) {
    var self = this;

    self.decreaseHitpoint(attack);
  };


  // 播放某个动画
  ActorClass.prototype.play = function (animation, priority) {
    var self = this;

    var direction = animation.match(/down|left|right|up/)[0];

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

  ActorClass.prototype.fire = function (num, direction) {
    var self = this;

    // 同一时间只能施展一个spell
    if (self.attacking)
      return 0;

    var spell = self.data.spellbar[num];
    if (!spell)
      return 0;

    // 只有当这个spell的cooldown结
    var now = new Date().getTime();
    if ( typeof self.lastAttack == "number"
      && typeof self.lastAttackCooldown == "number"
      && (now - self.lastAttack) < self.lastAttackCooldown)
      return 0;

    self.lastAttack = now;
    self.lastAttackCooldown = self.data.spells[spell].data.cooldown;
    self.attacking = true;

    if (!direction) {
      direction = self.sprite.currentAnimation.match(/up|left|down|right/)[0];
    }

    self.data.spells[spell].fire(self, "attack" + direction, function () {
      self.attacking = false;
      self.face(direction);
    });

    if (self.id == Game.hero.id) {
      Game.io.sync("attack", {
        num: num,
        direction: direction
      });
    }

    return self.data.spells[spell].data.cooldown;
  };

  ActorClass.prototype.gotoXY = function (x, y, speed, collisionTest, callback) {
    var self = this;

    if (self.gotoXYListener) {
      createjs.Ticker.off("tick", self.gotoXYListener);
      self.gotoXYListener = null;
    }

    x -= self.sprite.x;
    y -= self.sprite.y;

    var state = "walk";

    var limit = speed;

    self.gotoXYListener = createjs.Ticker.on("tick", toXY);

    function toXY () {

      if (x == 0 && y == 0) {
        if (self.gotoXYListener) {
          createjs.Ticker.off("tick", self.gotoXYListener);
          self.gotoXYListener = null;
        }
        self.stop();
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
        self.go(state, direction, skew, collisionTest);
      } else if (Math.abs(x) > limit) {
        if (x > 0) {
          self.go(state, "right", speed, collisionTest);
          x -= speed;
        } else {
          self.go(state, "left", speed, collisionTest);
          x += speed;
        }
      } else if (Math.abs(y) > limit) {
        if (y > 0) {
          self.go(state, "down", speed, collisionTest);
          y -= speed;
        } else {
          self.go(state, "up", speed, collisionTest);
          y += speed;
        }
      } else if (Math.abs(y) != 0) {
        if (y > 0) {
          self.go(state, "down", y, collisionTest);
          y = 0;
        } else {
          self.go(state, "up", -y, collisionTest);
          y = 0;
        }
      } else if (Math.abs(x) != 0) {
        if (x > 0) {
          self.go(state, "right", x, collisionTest);
          x = 0;
        } else {
          self.go(state, "left", -x, collisionTest);
          x = 0;
        }
      }
    }

  };

  ActorClass.prototype.face = function (direction) {
    var self = this;

    var animation = "face" + direction;
    if (self.animation != animation) {
      self.sprite.gotoAndStop(animation);
      Game.update();
    }
  };

  ActorClass.prototype.go = function (state, direction, step, collisionTest) {
    var self = this;

    // 如果正在战斗动画，则不走
    if (self.sprite.paused == false && self.sprite.currentAnimation.match(/spellcast|thrust|slash|shoot/)) {
      return false;
    }

    if (self.data.weapons) {
      if (self.bowSprite.paused == false || self.daggerSprite.paused == false || self.spearSprite.paused == false || self.woodwandSprite.paused == false)
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
      if (t.x < 0 || t.y < 0 || t.x >= Game.area.map.data.width || t.y >= Game.area.map.data.height)
        return true;

      var i = t.x + "-" + t.y;
      if (tested.hasOwnProperty(i))
        return tested[i];

      if (Game.area.map.blockedMap[t.y] && Game.area.map.blockedMap[t.y][t.x]) {
        if (Game.actorCollision(self.sprite, Game.area.map.blockedMap[t.y][t.x])) {
          tested[i] = true;
          return true;
        }
      }
      tested[i] = false;
      return false;
    };

    // 这个函数是测试某个方向能否走，能移动则移动
    // direction的值有up，down，left，right四种可能
    // 建立这个函数是因为一次行走虽然是一次，但是也可以潮四个角方向走，实际就要执行两次CheckDirection
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

      sprite.x = parseInt(sprite.x);
      sprite.y = parseInt(sprite.y);

      var t = Game.area.map.tile(sprite.x, sprite.y);

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
        self.infoBox.y = self.sprite.y - 45;

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

    if (self.id == Game.hero.id) {
      Game.io.sync("move", {
        x: self.sprite.x,
        y: self.sprite.y,
        speed: step
      });
    }
  };

  ActorClass.prototype.remove = function (layer) {
    var self = this;

    layer.removeChild(self.sprite);
    layer.removeChild(self.infoBox);
    Game.update();
  };

  ActorClass.prototype.draw = function (layer, x, y) {
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
    self.infoBox.y = y - 45;

    self.sprite.x = x;
    self.sprite.y = y;

    layer.addChild(self.sprite);
    layer.addChild(self.infoBox);

    Game.update()
  };

  ActorClass.prototype.focus = function () {
    var self = this;

    self.infoBox.x = self.sprite.x;
    self.infoBox.y = self.sprite.y - 45;

    Game.stage.regX = parseInt(self.sprite.x - Game.config.width / 2);
    Game.stage.regY = parseInt(self.sprite.y - Game.config.height / 2);
  };

  ActorClass.prototype.distance = function (x, y) {
    var d = 0;
    d += Math.pow(self.sprite.x - x, 2);
    d += Math.pow(self.sprite.y - y, 2);
    return Math.sqrt(d);
  };

})();
