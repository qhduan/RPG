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

  var SpellClass = Game.SpellClass = function (spellData) {
    var self = this;

    self.data = spellData;
    self.id = self.data.id;

    var image = Game.resources[self.data.image];
    var icon = Game.resources[self.data.icon];

    self.icon = new createjs.Bitmap(icon);
    self.icon.regX = icon.width / 2;
    self.icon.regY = icon.height / 2;

    self.sheet = new createjs.SpriteSheet({
      images: [image],
      frames: {
        width: self.data.tilewidth,
        height: self.data.tileheight
      },
      animations: self.data.animations
    });

    // 完成事件
    self.complete = true;
    if (self.listeners && self.listeners["complete"]) {
      for (var key in self.listeners["complete"]) {
        self.listeners["complete"][key](self);
      }
    }

  };

  SpellClass.prototype.on = function (event, listener) {
    var self = this;

    if (!self.listeners)
      self.listeners = {};

    if (!self.listeners[event])
      self.listeners[event] = {};

    var id = Math.random().toString(16).substr(2);
    self.listeners[event][id] = listener;
  };

  SpellClass.prototype.off = function (event, id) {
    var self = this;

    if (self.listeners[event] && self.listeners[event][id]) {
      delete self.listeners[event][id];
    }
  };

  SpellClass.prototype.oncomplete = function (callback) {
    var self = this;

    if (self.complete) {
      callback(self);
    } else {
      self.on("complete", callback);
    }
  };

  SpellClass.prototype.fire = function (actor, animation, callback) {
    var self = this;

    if (Game.resources[self.data.sound])
      createjs.Sound.play(self.data.sound);

    var sprite = new createjs.Sprite(self.sheet);

    function UpdateLocation () {
      sprite.x = actor.sprite.x - 32;
      sprite.y = actor.sprite.y - 32;

      if (self.data.animations[animation].x) {
        sprite.x += self.data.animations[animation].x;
      }

      if (self.data.animations[animation].y) {
        sprite.y += self.data.animations[animation].y;
      }
    }

    UpdateLocation();

    var hitted= {};

    var distance = 0;

    var listener = createjs.Ticker.on("tick", function () {

      distance += self.data.flyspeed;

      UpdateLocation();

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

      // 碰撞检测
      for (var key in Game.area.actors) {
        if (Game.area.actors[key].id == actor.id) continue;
        var c = Game.spellCollision(sprite, Game.area.actors[key].sprite);
        if (c) {
          hitted[key] = true;
        }
      }

      Game.update();

      // 如果是远程攻击
      if (self.data.distance == 0) {
      } else {
        // 如果攻击距离已经过了，或者命中了一个敌人
        if (distance >= self.data.distance || Object.keys(hitted).length > 0)
          Stop();
      }
    });

    // 攻击结束时运行Stop函数
    function Stop () {
      createjs.Ticker.off("tick", listener);
      Game.spellLayer.removeChild(sprite);
      Game.update();

      // 判断应该受伤的角色
      for (var key in hitted) {
        Game.area.actors[key].damage(self.data.type, self.data.attack);
      }

      if (Object.keys(hitted).length) {
        createjs.Sound.play("/sound/effect/hurt.ogg");
      }

      if (callback) callback();
    }

    sprite.on("animationend", function () {
      if (self.data.distance == 0) {
        Stop();
      }
    });

    Game.spellLayer.addChild(sprite);
    sprite.gotoAndPlay(animation);

    if ( self.data.animations[animation].actor
      && actor.data.animations[self.data.animations[animation].actor] ) {
      actor.play(self.data.animations[animation].actor, 3);
    }
  };

})();
