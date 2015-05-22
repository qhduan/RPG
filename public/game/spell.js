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

    for (var key in spellData) {
      self[key] = spellData[key];
    }

    var image = new Image();
    image.src = self.image;
    self.image = image;

    self.sheet = new createjs.SpriteSheet({
      images: [self.image],
      frames: {
        width: self.tilewidth,
        height: self.tileheight
      },
      animations: self.animations
    });

    if (self.onload) self.onload();

  };

  SpellClass.prototype.fire = function (actor, animation) {
    var self = this;

    var now = new Date().getTime();
    if (typeof self.firing == "number" && (now - self.firing) < self.cooldown)
      return;

    self.firing = new Date().getTime();

    createjs.Sound.play(self.sound);

    var sprite = new createjs.Sprite(self.sheet);

    var listener = createjs.Ticker.on("tick", function () {
      sprite.x = actor.sprite.x - 32;
      sprite.y = actor.sprite.y - 32;

      if (self.animations[animation].x) {
        sprite.x += self.animations[animation].x;
      }

      if (self.animations[animation].y) {
        sprite.y += self.animations[animation].y;
      }
      Game.updateStage();
    });

    sprite.on("animationend", function () {
      sprite.gotoAndStop(0);
      createjs.Ticker.off("tick", listener);
      Game.stage.removeChild(sprite);
      Game.updateStage();
    });

    Game.stage.addChild(sprite);
    sprite.gotoAndPlay(animation);
  };

})();
