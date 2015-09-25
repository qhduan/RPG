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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Game.assign("Skill", (function (_Sprite$Event) {
    _inherits(GameSkill, _Sprite$Event);

    _createClass(GameSkill, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("skill/" + id + ".js").then(function (data) {
            var skillData = data[0]();
            var skillObj = new Game.Skill(skillData);
            Game.skills[id] = skillObj;
            skillObj.on("complete", function () {
              resolve(skillObj);
            });
          });
        });
      }
    }]);

    function GameSkill(skillData) {
      var _this = this;

      _classCallCheck(this, GameSkill);

      _get(Object.getPrototypeOf(GameSkill.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.data = skillData;

      Sprite.load("skill/" + this.data.image, "skill/" + this.data.icon, "skill/" + this.data.sound).then(function (data) {
        var image = data[0];
        privates.icon = data[1];
        privates.sound = data[2];

        var sheet = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        sheet.centerX = Math.floor(_this.data.tilewidth / 2);
        sheet.centerY = Math.floor(_this.data.tileheight / 2);

        if (_this.data.alpha) {
          sheet.alpha = _this.data.alpha;
        }

        privates.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
    }

    _createClass(GameSkill, [{
      key: "fire",
      value: function fire(attacker, direction, callback) {
        var _this2 = this;

        var privates = internal(this);

        if (privates.sound) {
          privates.sound.load();
          privates.sound.play();
        }

        var animation = "attack" + direction;
        var weaponAnimation = this.data.animations[animation];
        var sprite = privates.sprite.clone();

        // 矫正武器效果位置
        sprite.x = attacker.facePosition.x * 32 + 16;
        sprite.y = attacker.facePosition.y * 32 + 16;

        // 矫正武器效果中心
        if (Number.isFinite(weaponAnimation.centerX) && Number.isFinite(weaponAnimation.centerY)) {
          sprite.centerX = weaponAnimation.centerX;
          sprite.centerY = weaponAnimation.centerY;
        } else {
          console.error(weaponAnimation, this.data);
          throw new Error("Game.Skill.fire invalid centerX/centerY");
        }

        // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的距离
        var distance = 0;
        // 被命中的actor列表
        var hitted = [];
        var CheckHit = function CheckHit() {
          // 技能所在当前方格
          var l1 = Game.area.map.tile(sprite.x, sprite.y);
          // 碰撞检测
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var actor = _step.value;

              if (actor != attacker && hitted.length <= 0) {
                if (actor.hitTest(l1.x, l1.y)) {
                  hitted.push(actor);
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        };

        var listener = Sprite.Ticker.on("tick", function () {

          if (_this2.data.distance > 0) {
            // 飞行速度是4
            distance += 4;
          }

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

          // 测试碰撞到墙
          var grid = Game.area.map.tile(sprite.x, sprite.y);
          if (Game.area.map.hitTest(grid.x, grid.y)) {
            Finish();
          }

          // 如果击中了一个敌人（单体伤害）
          if (hitted.length > 0) {
            Finish();
          }

          // 如果是远程攻击，并且攻击距离已经到了
          if (_this2.data.distance > 0 && distance >= _this2.data.distance) {
            Finish();
          }
        });

        // 攻击结束时运行Stop函数
        var Finish = function Finish() {
          Sprite.Ticker.off("tick", listener);

          if (hitted.length > 0 && _this2.data.animations["hitted"]) {
            var actor = hitted[0];
            sprite.x = actor.sprite.x;
            sprite.y = actor.sprite.y;
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

          if (callback) {
            callback(hitted);
          }
        };

        Game.layers.skillLayer.appendChild(sprite);
        sprite.play(animation);

        if (this.data.animations[animation].actor && attacker.data.animations[this.data.animations[animation].actor]) {
          attacker.play(this.data.animations[animation].actor, 3);
        } else {
          attacker.play("face" + direction, 0);
          attacker.play("attack" + direction, 3);
        }
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Skill.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        return internal(this).icon;
      },
      set: function set(value) {
        throw new Error("Game.Skill.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Skill.data readonly");
      }
    }, {
      key: "power",
      get: function get() {
        if (Number.isFinite(this.data.power)) {
          return this.data.power;
        } else if (typeof this.data.power == "string") {
          var m = this.data.power.match(/(\d+)d(\d+)/);
          if (!m) {
            console.error(this.data.power, this.data);
            throw new Error("Sprite.Skill got invalid power data");
          }
          var times = parseInt(m[1]);
          var dice = parseInt(m[2]);
          var sum = 0;
          for (var i = 0; i < times; i++) {
            sum += Sprite.rand(0, dice) + 1;
          }
          return sum;
        } else {
          console.error(this.data.power, this.data);
          throw new Error("Game.Skill.power invalid power");
        }
      },
      set: function set(value) {
        throw new Error("Game.Skill.power readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return this.data.type;
      },
      set: function set(value) {
        throw new Error("Game.Skill.type readonly");
      }
    }]);

    return GameSkill;
  })(Sprite.Event));
})();