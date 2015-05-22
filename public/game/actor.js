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


  /*
    角色类，包括涉及到hero和npc
    属性：
      self.animation 当前精灵动作
      self.sprite 精灵
  */
  var ActorClass = Game.ActorClass = function (actorData) {
    var self = this;

    for (var key in actorData) {
      self[key] = actorData[key];
    }

    self.text = new createjs.Text(self.name, "12px Arial", "white");
    self.text.regY = self.text.getMeasuredHeight() / 2;
    self.text.regX = self.text.getMeasuredWidth() / 2;

    self.hpbar = new createjs.Shape();
    self.hpbar.graphics
      .beginStroke("black")
      .beginFill("green")
      .drawRect(0, 0, 30, 3);
    self.hpbar.regX = 15;
    self.hpbar.regY = 2;

    self.mpbar = new createjs.Shape();
    self.mpbar.graphics
      .beginStroke("black")
      .beginFill("blue")
      .drawRect(0, 0, 30, 3);
    self.mpbar.regX = 15;
    self.mpbar.regY = 2;

    var image = null;

    if (Game.resources[self.image]) {
      image = Game.resources[self.image];
    } else if (self.image) {
      image = new Image();
      image.src = self.image;
    } else {
      console.log("ActorClass Invalid Image");
    }

    function ImageComplete () {

      var sheet = new createjs.SpriteSheet({
        images: [image],
        frames: {
          width: self.tilewidth,
          height: self.tileheight,
          regX: parseInt(self.tilewidth / 2), // regX和regY把角色中间设定为中间
          regY: parseInt(self.tileheight / 2)
        },
        animations: self.animations
      });

      self.sprite = new createjs.Sprite(sheet, self.animation);
      self.animation = "facedown"; // 默认面向下方

      function SheetComplete () {
        self.sprite.x = 0;
        self.sprite.y = 0;
        Game.updateStage();

        self.sprite.on("tick", function () {
         if (self.animation.match(/^face/)) {

         } else {
           Game.updateStage();
         }
        });
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

  };

  // 播放某个动画
  ActorClass.prototype.play = function (animation) {
    var self = this;

    if (self.animations.hasOwnProperty(animation)) {
      self.sprite.gotoAndPlay(animation);
    }
  };

  ActorClass.prototype.fire = function (spell) {
    var self = this;
    var direction = self.animation.match(/up|left|down|right/)[0];
    self.spellObj[spell].fire(self, "attack" + direction);
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

        if (x > 0) {
          self.go(state + "right", skew, false);
          x -= skew;
        } else {
          self.go(state + "left", skew, false);
          x += skew;
        }

        if (y > 0) {
          self.go(state + "down", skew);
          y -= skew;
        } else {
          self.go(state + "up", skew);
          y += skew;
        }
        console.log(self.id, skew);
      } else if (Math.abs(x) > limit) {
        if (x > 0) {
          self.go(state + "right", speed);
          x -= speed;
        } else {
          self.go(state + "left", speed);
          x += speed;
        }

      } else if (Math.abs(y) > limit) {
        if (y > 0) {
          self.go(state + "down", speed);
          y -= speed;
        } else {
          self.go(state + "up", speed);
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
      self.animation = animation;
      Game.updateStage();
    }
  };

  ActorClass.prototype.go = function (animation, step, changeAnimate, collisionTest) {
    var self = this;

    if (typeof changeAnimate == "undefined")
      changeAnimate = true;

    if (typeof collisionTest == "undefined") {
      collisionTest = true;
    }

    var sprite = self.sprite;

    // 临时保存本次判断过的坐标方格，一定程度上避免重复
    var tested = {};

    var CheckCollision = function (t) {
      if (t.x < 0 || t.y < 0 || t.x >= Game.currentArea.width || t.y >= Game.currentArea.height)
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

    var oldX = sprite.x;
    var oldY = sprite.y;

    switch (animation.match(/up|down|left|right/)[0]) {
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

    //console.log(Game.hero.sprite.paused);

    if (collision) {
      sprite.x = oldX;
      sprite.y = oldY;
      return false;
    } else {
      if (Game.hero.sprite.paused || (changeAnimate && self.animation != animation)) {
        self.animation = animation;
        self.sprite.gotoAndPlay(animation);
      }
      return true;
    }
  };

  ActorClass.prototype.stop = function () {
    var self = this;

    if (!self.animation.match(/face/)) {
      switch (self.animation.match(/up|down|left|right/)[0]) {
        case "up":
          self.sprite.gotoAndStop("faceup");
          self.animation = "faceup";
          break;
        case "down":
          self.sprite.gotoAndStop("facedown");
          self.animation = "facedown";
          break;
        case "left":
          self.sprite.gotoAndStop("faceleft");
          self.animation = "faceleft";
          break;
        case "right":
          self.sprite.gotoAndStop("faceright");
          self.animation = "faceright";
          break;
      }
    }
  };

  ActorClass.prototype.draw = function (x, y) {
    var self = this;

    self.text.x = x;
    self.text.y = y - 40;

    self.hpbar.x = x;
    self.hpbar.y = y - 27;

    self.mpbar.x = x;
    self.mpbar.y = y - 24;

    self.sprite.x = x;
    self.sprite.y = y;

    Game.stage.addChild(self.sprite);
    Game.stage.addChild(self.text);
    Game.stage.addChild(self.hpbar);
    Game.stage.addChild(self.mpbar);
    Game.updateStage()
  };

  ActorClass.prototype.focus = function () {
    var self = this;

    self.text.x = self.sprite.x;
    self.text.y = self.sprite.y - 40;

    self.hpbar.x = self.sprite.x;
    self.hpbar.y = self.sprite.y - 27;

    self.mpbar.x = self.sprite.x;
    self.mpbar.y = self.sprite.y - 24;

    Game.stage.setTransform(0, 0,
      Game.stage.scaleX,
      Game.stage.scaleY,
      0, 0, 0,
      parseInt(self.sprite.x - Game.config.width / 2),
      parseInt(self.sprite.y - Game.config.height / 2)
    );
  };

})();
