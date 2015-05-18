~function () {
  "use strict";


  var ActorClass = function (actorId) {
    var self = this;

    self.id = actorId;

    self.direction = "";

    Game.io.get("actor", self.id, function (actorObj) {
      if (actorObj) {

        for (var key in actorObj) {
          self[key] = actorObj[key];
        }

        var image = new Image();
        image.src = self.image;
        self.image = image;

        var sheet = new createjs.SpriteSheet({
          images: [self.image],
          frames: {
            width: self.tilewidth,
            height: self.tileheight,
            regX: parseInt(self.tilewidth / 2),
            regY: parseInt(self.tileheight * 0.75) // 把角色中间设定为下半部分的中间
          },
          animations: self.animations
        });

        self.sprite = new createjs.Sprite(sheet);
        self.sprite.x = 0;
        self.sprite.y = 0;
        self.sprite.gotoAndStop(0); // facedown

        self.animation = "facedown";

        if (self.onload) self.onload();
      }
    });
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
          self.toXY(Game.hero.sprite.x, Game.hero.sprite.y, "walk", function () {
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

  ActorClass.prototype.toXY = function (x, y, state, callback) {
    var self = this;

    var diffX = x - self.sprite.x;
    var diffY = y - self.sprite.y;

    self.goXY(diffX, diffY, state, callback);
  };

  ActorClass.prototype.goXY = function (x, y, state, callback) {
    x = x || 1;
    y = y || 1;

    var self = this;

    state = state || "walk";

    var speed = Game.config.walk;
    if (state == "run") {
      speed = Game.config.run;
    }

    var listener = createjs.Ticker.on("tick", toXY);

    function toXY () {

      if (Math.abs(x) > 10 && Math.abs(y) > 10) {
        var skew = speed / 1.4;

        if (x > 0) {
          self.go(state + "right", skew, false, false);
          x -= skew;
        } else {
          self.go(state + "left", skew, false, false);
          x += skew;
        }

        if (y > 0) {
          self.go(state + "down", skew, true, false);
          y -= skew;
        } else {
          self.go(state + "up", skew, true, false);
          y += skew;
        }
      } else if (Math.abs(x) > 10) {
        if (x > 0) {
          self.go(state + "right", speed, true, false);
          x -= speed;
        } else {
          self.go(state + "left", speed, true, false);
          x += speed;
        }

      } else if (Math.abs(y) > 10) {
        if (y > 0) {
          self.go(state + "down", speed, true, false);
          y -= speed;
        } else {
          self.go(state + "up", speed, true, false);
          y += speed;
        }
      } else {
        createjs.Ticker.off("tick", listener);
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
      if (t.x < 0 || t.y < 0 || t.x >= Game.currentMap.width || t.y >= Game.currentMap.height)
        return true;

      var i = t.x + "-" + t.y;
      if (tested.hasOwnProperty(i))
        return tested[i];

      if (Game.currentMap.blockedMap[t.y] && Game.currentMap.blockedMap[t.y][t.x]) {
        if (Game.actorCollision(self.sprite, Game.currentMap.blockedMap[t.y][t.x])) {
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

    var t = Game.currentMap.tile(sprite.x, sprite.y);

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

    if (collision) {
      sprite.x = oldX;
      sprite.y = oldY;
      return false;
    } else {
      if ((changeAnimate || self.animation.match(/face/)) && self.animation != animation) {
        self.sprite.gotoAndPlay(animation);
        self.animation = animation;
      }
      Game.updateStage();
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

  ActorClass.prototype.draw = function (position) {
    var self = this;
    if (position) {
      if (position.x) self.sprite.x = position.x;
      if (position.y) self.sprite.y = position.y;
    }
    Game.stage.addChild(self.sprite);
  };

  Game.actors[self.id] = self;

  ActorClass.prototype.focus = function () {
    var self = this;
    Game.stage.setTransform(0, 0,
      Game.stage.scaleX,
      Game.stage.scaleY,
      0, 0, 0,
      parseInt(self.sprite.x - Game.config.width / 2),
      parseInt(self.sprite.y - Game.config.height / 2)
    );
  };

  Game.loadActor = function (actorId, callback) {

    if (Game.actors.hasOwnProperty(actorId)) {
      callback(Game.actors[actorId]);
      return;
    } else {
      var actorObj = new ActorClass(actorId);
      Game.actors[actorId] = actorObj;
      actorObj.onload = function () {
        callback(actorObj);
      };
    }


  };

  Game.loadTypeReg("actor", Game.loadActor);

}();
