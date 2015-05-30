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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

(function () {
  "use strict";

  Game.SpellClass = (function (_Game$EventClass) {
    function SpellClass(spellData) {
      _classCallCheck(this, SpellClass);

      _get(Object.getPrototypeOf(SpellClass.prototype), "constructor", this).call(this);

      this.data = spellData;
      this.id = this.data.id;

      var image = Game.resources[this.data.image];
      var icon = Game.resources[this.data.icon];

      this.icon = new createjs.Bitmap(icon);
      this.icon.regX = icon.width / 2;
      this.icon.regY = icon.height / 2;

      var sheet = new createjs.SpriteSheet({
        images: [image],
        frames: {
          width: this.data.tilewidth,
          height: this.data.tileheight,
          regX: parseInt(this.data.tilewidth / 2),
          regY: parseInt(this.data.tileheight / 2)
        },
        animations: this.data.animations
      });

      this.sprite = new createjs.Sprite(sheet);

      // 发送完成事件，第二个参数代表一次性事件
      this.emit("complete", true);
    }

    _inherits(SpellClass, _Game$EventClass);

    _createClass(SpellClass, [{
      key: "fire",
      value: function fire(actor, animation, callback) {
        var _this = this;

        if (Game.resources[this.data.sound]) createjs.Sound.play(this.data.sound);

        var sprite = this.sprite.clone();

        // 矫正武器效果位置
        //sprite.x = parseInt(actor.sprite.x - parseInt(this.data.tilewidth / 2));
        //sprite.y = parseInt(actor.sprite.y - parseInt(this.data.tileheight / 2));
        sprite.x = parseInt(actor.sprite.x);
        sprite.y = parseInt(actor.sprite.y);

        if (this.data.animations[animation].x) {
          sprite.x += this.data.animations[animation].x;
        }

        if (this.data.animations[animation].y) {
          sprite.y += this.data.animations[animation].y;
        }

        // 被命中的actor列表
        var hitted = {};
        var CheckHit = function CheckHit() {

          // 碰撞检测
          for (var key in Game.area.actors) {
            if (Game.area.actors[key].id == actor.id) continue;
            if (Game.area.actors[key].data.type != "monster") continue;
            var c = Game.spellCollision(sprite, Game.area.actors[key].sprite);
            if (c) {
              hitted[key] = true;
            }
          }
        };

        // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的举例
        var distance = 0;

        var listener = createjs.Ticker.on("tick", function () {

          distance += _this.data.flyspeed;

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

          Game.update();

          // 如果击中了一个敌人（单体伤害）
          if (Object.keys(hitted).length > 0) {
            Finish();
          }

          // 如果是远程攻击，并且攻击距离已经到了
          if (_this.data.distance > 0 && distance >= _this.data.distance) {
            Finish();
          }

          // 如果是近战攻击（this.data.distance <= 0），而且动画已经停止
          if (_this.data.distance <= 0 && sprite.paused) {
            Finish();
          }
        });

        // 攻击结束时运行Stop函数
        var Finish = function Finish() {
          createjs.Ticker.off("tick", listener);

          if (Object.keys(hitted).length > 0 && _this.data.animations["hitted"]) {
            var a = Object.keys(hitted)[0];
            a = Game.area.actors[a];
            sprite.x = a.sprite.x;
            sprite.y = a.sprite.y;
            console.log(a.sprite.x, a.sprite.y);
            sprite.gotoAndPlay("hitted");
            sprite.on("animationend", function () {
              Game.spellLayer.removeChild(sprite);
            });
          } else {
            // 如果动画已经播完，则停止
            if (sprite.paused == true) {
              Game.spellLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.spellLayer.removeChild(sprite);
              });
            }
          }

          Game.update();
          if (callback) callback(Object.keys(hitted));
        };

        Game.spellLayer.addChild(sprite);
        sprite.gotoAndPlay(animation);

        if (this.data.animations[animation].actor && actor.data.animations[this.data.animations[animation].actor]) {
          actor.play(this.data.animations[animation].actor, 3);
        }
      }
    }]);

    return SpellClass;
  })(Game.EventClass);
})();
//# sourceMappingURL=spell.js.map