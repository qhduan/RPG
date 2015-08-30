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

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var actorHold = [];

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.Actor = (function (_Sprite$Event) {
    _inherits(GameActor, _Sprite$Event);

    function GameActor(actorData) {
      var _this = this;

      _classCallCheck(this, GameActor);

      _get(Object.getPrototypeOf(GameActor.prototype), "constructor", this).call(this);

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

          this.infoBox.appendChild(this.text, this.hpbarBox, this.mpbarBox, this.hpbar, this.mpbar);
        }

      var Init = function Init(image) {
        var sprite = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        //.centerX.centerY把角色中间设定为图片中间
        sprite.centerX = Math.floor(_this.data.tilewidth * 0.5);
        sprite.centerY = Math.floor(_this.data.tileheight * 0.75);
        sprite.play("facedown");
        sprite.x = 0;
        sprite.y = 0;
        _this.sprite = sprite;

        sprite.on("change", function () {
          _this.infoBox.x = _this.x;
          _this.infoBox.y = _this.y - _this.sprite.centerY - 20;
        });

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            _this.calculate();
            _this.refreshBar();
            _this.emit("complete", true);
          }
        };

        if (_this.data.skills) {
          _this.data.skills.forEach(function (skillId) {
            completeCount--;
            Game.Skill.load(skillId, function () {
              Complete();
            });
          });
        }

        if (_this.data.equipment) {
          for (var key in _this.data.equipment) {
            var itemId = _this.data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId, function () {
                Complete();
              });
            }
          }
        }

        if (_this.data.items) {
          for (var itemId in _this.data.items) {
            completeCount--;
            Game.Item.load(itemId, function () {
              Complete();
            });
          }
        }

        if (_this.data.contact && _this.data.contact.trade && _this.data.contact.trade.length) {
          _this.data.contact.trade.forEach(function (itemId) {
            completeCount--;
            Game.Item.load(itemId, function () {
              Complete();
            });
          });
        }

        Complete();
      };

      if (this.data.image && this.data.image.width && this.data.image.height) {
        // img or canvas
        Init(this.data.image);
      } else if (typeof this.data.image == "string") {
        var loader = new Sprite.Loader();
        loader.add("/actor/" + this.data.image);
        loader.start();
        loader.on("complete", function (event) {
          Init(event.data[0]);
        });
      } else {
        console.error(this.id, this.data, this.data.image, this);
        throw new Error("Invalid Actor Image");
      }
    }

    _createClass(GameActor, [{
      key: "calculate",
      value: function calculate() {
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
            this.data.buff.forEach(function (element) {});
            this.data.nerf.forEach(function (element) {});
          }
        }
      }
    }, {
      key: "clone",
      value: function clone(callback) {
        var actorObj = new Game.Actor(this.data);
        actorObj.oncomplete(callback);
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        if (Game.hero && this == Game.hero) {
          Game.windows["interface"].execute("status", this.data.hp / this.data.$hp, this.data.sp / this.data.$sp);
        }

        if (this.hpbar && this.mpbar) {
          var hpcolor = "green";
          if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

          this.hpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.hp / this.data.$hp * 28),
            height: 2,
            fill: hpcolor,
            "stroke-width": 0
          });

          this.mpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.sp / this.data.$sp * 28),
            height: 2,
            fill: "blue",
            "stroke-width": 0
          });
        }
      }
    }, {
      key: "contact",
      value: function contact() {
        var _this2 = this;

        if (this.data.contact) {

          var options = {};

          if (this.data.contact.talk) {
            options["对话"] = "talk";
          }

          if (this.data.contact.trade) {
            options["交易"] = "trade";
          }

          Game.choice(options, function (choice) {
            switch (choice) {
              case "talk":
                Game.dialogue(_this2.data.contact.talk, _this2.data.name);
                break;
              case "trade":
                Game.windows.trade.execute("trade", _this2.data.contact.trade);
                break;
            }
          });
        }
      }
    }, {
      key: "distance",
      value: function distance() {
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
        return Math.floor(d);
      }
    }, {
      key: "decreaseHitpoint",
      value: function decreaseHitpoint(power) {
        this.data.hp -= power;
        this.refreshBar();
        this.dead();
      }
    }, {
      key: "decreaseManapoint",
      value: function decreaseManapoint(mp) {
        this.data.sp -= mp;
        this.refreshBar();
      }
    }, {
      key: "dead",
      value: function dead() {
        if (this.data.hp <= 0) {

          // item0001是物品掉落之后出现的小布袋
          var dead = Game.items.bag.clone();
          dead.x = this.x;
          dead.y = this.y;
          dead.draw(Game.layers.itemLayer);
          dead.inner = {
            "gold": 1
          };
          Game.area.bags[Sprite.uuid()] = dead;

          this.remove();

          delete Game.area.actors[this.id];
        }
      }
    }, {
      key: "flash",
      value: function flash() {
        var _this3 = this;

        this.sprite.alpha = 0.5;
        setTimeout(function () {
          _this3.sprite.alpha = 1;
        }, 200);
      }
    }, {
      key: "damage",
      value: function damage(attacker, skill) {

        var power = skill.power;
        var type = skill.type;

        var color = "white";
        if (this.data.type == "hero") {
          color = "red";
        }

        if (type == "normal") {
          power += attacker.data.atk;
          power -= this.data.def;
          power = Math.max(0, power);
        } else {
          // type == magic
          power += attacker.data.matk;
          power - this.data.mdef;
          power = Math.max(0, power);
        }

        var text = null;

        if (Math.random() < this.data.dodge) {
          // 闪避了
          text = new Sprite.Text({
            text: "miss",
            color: color,
            fontSize: 16
          });
        } else if (Math.random() < attacker.data.critical) {
          // 重击了
          power *= 2;
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 32
          });
          this.flash();
          this.decreaseHitpoint(power);
        } else {
          // 普通击中
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
        text.x = this.x;
        text.y = this.y;

        text.x += Sprite.rand(-10, 10);

        Game.layers.actorLayer.appendChild(text);

        var speed = Sprite.rand(0, 3);

        Sprite.Ticker.whiles(100, function (last) {
          text.y -= speed;
          if (last) {
            Game.layers.actorLayer.removeChild(text);
          }
        });
      }
    }, {
      key: "play",
      value: function play(animation, priority) {
        var direction = animation.match(/down|left|right|up/)[0];

        // 新动画默认优先级为0
        if (typeof priority == "undefined") priority = 0;

        // 无动画或者停止状态，现有优先级为-1（最低级）
        if (typeof this.animationPriority == "undefined" || this.sprite.paused == true) this.animationPriority = -1;

        if (this.data.animations.hasOwnProperty(animation) && priority >= this.animationPriority && animation != this.sprite.currentAnimation) {
          this.animationPriority = priority;
          this.sprite.play(animation);
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        if (!this.sprite.currentAnimation) return;

        if (this.gotoListener) return;

        if (this.sprite.paused && !this.sprite.currentAnimation.match(/face/) || this.sprite.currentAnimation.match(/walk|run/)) {
          switch (this.sprite.currentAnimation.match(/up|down|left|right/)[0]) {
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
    }, {
      key: "fire",
      value: function fire(id, direction) {
        var _this4 = this;

        // 同一时间只能施展一个skill
        if (this.attacking) return 0;

        var skill = Game.skills[id];
        if (!skill) return 0;

        // 只有当这个skill的cooldown结
        var now = new Date().getTime();
        if (typeof this.lastAttack == "number" && typeof this.lastAttackCooldown == "number" && now - this.lastAttack < this.lastAttackCooldown) return 0;

        if (skill.data.cost > this.data.sp) {
          return 0;
        }

        this.lastAttack = now;
        this.lastAttackCooldown = skill.data.cooldown;
        this.attacking = true;

        if (!direction) {
          direction = this.sprite.currentAnimation.match(/up|left|down|right/)[0];
        }

        this.data.sp -= skill.data.cost;
        this.refreshBar();

        skill.fire(this, "attack" + direction, function (hittedActorIds) {
          _this4.attacking = false;
          if (hittedActorIds && hittedActorIds.length) {
            hittedActorIds.forEach(function (element) {
              if (Game.area.actors.hasOwnProperty(element)) {
                Game.area.actors[element].damage(_this4, skill);
              }
            });
          }
        });

        return skill.data.cooldown;
      }
    }, {
      key: "goto",
      value: function goto(x, y, state) {
        var _this5 = this;

        var callback = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        if (this.going) {
          return false;
        }

        var destPosition = Game.area.map.tile(x, y);

        var map = [];
        var height = Game.area.map.blockedMap.length;
        var width = Game.area.map.blockedMap[0].length;

        map.length = height;
        for (var i = 0; i < height; i++) {
          map[i] = [];
          map[i].length = width;
        }

        for (var i = 0; i < height; i++) {
          for (var j = 0; j < width; j++) {
            if (this.checkCollision({ x: j, y: i })) {
              map[i][j] = 0;
            } else {
              map[i][j] = 1;
            }
          }
        }

        var after = null;

        var path = Game.Astar.path(map, width, height, Game.area.map.tile(this.x, this.y), // 角色现在位置
        destPosition); // 目的地

        if (!path) {
          var otherChoice = [{
            x: destPosition.x,
            y: destPosition.y - 1,
            after: "facedown"
          }, {
            x: destPosition.x,
            y: destPosition.y + 1,
            after: "faceup"
          }, {
            x: destPosition.x - 1,
            y: destPosition.y,
            after: "faceright"
          }, {
            x: destPosition.x + 1,
            y: destPosition.y,
            after: "faceleft"
          }];

          otherChoice.forEach(function (element) {
            var x = element.x * 32 + 16;
            var y = element.y * 32 + 16;
            element.distance = _this5.distance(x, y);
          });

          otherChoice.sort(function (a, b) {
            return a.distance - b.distance;
          });

          otherChoice.forEach(function (element) {
            if (path) {
              return;
            }
            path = Game.Astar.path(map, width, height, Game.area.map.tile(_this5.x, _this5.y), element);
            if (path) {
              after = element.after;
            }
          });
        }

        if (path && path.length && path.length > 1) {
          this.going = true;
          var index = 1;
          var Walk = function Walk() {
            if (index < path.length) {
              var current = Game.area.map.tile(_this5.x, _this5.y);
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
                  direction = "right";
                } else if (dest.x < current.x) {
                  direction = "left";
                }
              }

              if (direction) {
                var currentDirection = _this5.sprite.currentAnimation.match(/up|left|down|right/)[0];
                if (direction != currentDirection) {
                  _this5.face(direction);
                }
                var goResult = _this5.go("walk", direction, function () {
                  return Walk();
                });
                if (goResult != true) {
                  _this5.going = false;
                }
                index++;
              }
            } else {
              // 正常结束
              if (after) {
                _this5.play(after);
              }
              _this5.going = false;
            }
          };
          Walk();
        } else {
          // 实在没找到路
          // console.log("noway");
        }
      }
    }, {
      key: "gotoTT",
      value: function gotoTT(x, y, state) {
        var _this6 = this;

        var collisionTest = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
        var callback = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        if (this.gotoListener) {
          Sprite.Ticker.off("tick", this.gotoListener);
          this.gotoListener = null;
        }

        var limit = 10;

        x -= this.x;
        y -= this.y;

        var speed = 2;
        if (state == "run") speed = 4;

        this.gotoListener = Sprite.Ticker.on("tick", function () {
          return toXY();
        });

        var leftright = "";
        var updown = "";
        if (x > 0) {
          leftright = "right";
        } else {
          leftright = "left";
        }
        if (y > 0) {
          updown = "down";
        } else {
          updown = "up";
        }
        var X = x = Math.abs(x);
        var Y = y = Math.abs(y);

        var toXY = function toXY() {
          if (x <= limit && y <= limit) {
            if (_this6.gotoListener) {
              Sprite.Ticker.off("tick", _this6.gotoListener);
              _this6.gotoListener = null;
              _this6.stop();
              if (typeof callback == "function") {
                callback();
              }
            }
            if (X > Y) {
              _this6.face(leftright);
            } else {
              _this6.face(updown);
            }
            if (callback) callback();
          } else if (x > limit && y > limit) {
            if (X > Y) {
              _this6.go(state, leftright, collisionTest);
              x -= speed;
            } else {
              _this6.go(state, updown, collisionTest);
              y -= speed;
            }
            if (x < 0) x = 0;
            if (y < 0) y = 0;
          } else if (x > limit) {
            _this6.go(state, leftright, collisionTest);
            x -= speed;
            if (x < 0) x = 0;
          } else if (y > limit) {
            _this6.go(state, updown, collisionTest);
            y -= speed;
            if (y < 0) y = 0;
          }
        };
      }
    }, {
      key: "face",
      value: function face(direction) {
        var animation = "face" + direction;
        if (this.animation != animation) {
          this.sprite.play(animation);
        }
      }

      // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
      // 返回true为有碰撞，返回false为无碰撞
    }, {
      key: "checkCollision",
      value: function checkCollision(t) {
        var positionKey = t.x + "x" + t.y;

        if (actorHold[positionKey]) {
          return true;
        }
        // 地图边缘碰撞
        if (t.x < 0 || t.y < 0 || t.x >= Game.area.map.data.width || t.y >= Game.area.map.data.height) {
          return true;
        }
        // 地图碰撞
        if (Game.area.map.blockedMap[t.y] && Game.area.map.blockedMap[t.y][t.x]) {
          return true;
        }
        // 角色碰撞
        if (Game.area.actors) {
          for (var key in Game.area.actors) {
            var actor = Game.area.actors[key];
            if (actor != this) {
              var pos = Game.area.map.tile(actor.x, actor.y);
              if (pos.x == t.x && pos.y == t.y) {
                return true;
              }
            }
          }
        }
        return false;
      }
    }, {
      key: "go",
      value: function go(state, direction) {
        var _this7 = this;

        var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

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

        var currentDirection = this.sprite.currentAnimation.match(/up|left|down|right/)[0];
        if (currentDirection != direction) {
          this.walking = true;
          this.face(direction);
          // wait 8 ticks
          Sprite.Ticker.after(4, function () {
            _this7.walking = false;
          });
          return false;
        }

        var t = Game.area.map.tile(this.x, this.y);

        var oldPositionKey = t.x + "x" + t.y;

        switch (direction) {
          case "up":
            t.y -= 1;
            break;
          case "down":
            t.y += 1;
            break;
          case "left":
            t.x -= 1;
            break;
          case "right":
            t.x += 1;
            break;
        }

        var newPositionKey = t.x + "x" + t.y;

        var result = this.checkCollision(t);

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

          Sprite.Ticker.whiles(times, function (last) {
            switch (direction) {
              case "up":
                _this7.y -= speed;
                break;
              case "down":
                _this7.y += speed;
                break;
              case "left":
                _this7.x -= speed;
                break;
              case "right":
                _this7.x += speed;
                break;
            }

            if (last) {
              delete actorHold[newPositionKey];
              delete actorHold[oldPositionKey];
              _this7.walking = false;

              if (typeof callback == "function") {
                callback();
              }
            }
          });

          this.play(state + direction, 1);
          return true;
        }

        this.play("face" + direction, 0);

        return false;
      }
    }, {
      key: "remove",
      value: function remove() {
        Game.layers.actorLayer.removeChild(this.sprite);
        Game.layers.infoLayer.removeChild(this.infoBox);
      }
    }, {
      key: "draw",
      value: function draw() {
        var x = this.data.x;
        var y = this.data.y;

        if (typeof x != "number" || typeof y != "number") {
          console.log(this, this.data, this.data.x, this.data.y);
          throw new Error("Game.Actor.draw Invalid position x,y");
        }

        this.infoBox.x = x;
        this.infoBox.y = y - this.sprite.centerY - 20;

        this.x = x;
        this.y = y;

        Game.layers.actorLayer.appendChild(this.sprite);
        Game.layers.infoLayer.appendChild(this.infoBox);
      }
    }, {
      key: "focus",
      value: function focus() {
        this.infoBox.x = this.x;
        this.infoBox.y = this.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.y - Game.config.height / 2);
      }
    }, {
      key: "x",
      get: function get() {
        return this.sprite.x;
      },
      set: function set(value) {
        this.sprite.x = value;
        this.data.x = value;
      }
    }, {
      key: "y",
      get: function get() {
        return this.sprite.y;
      },
      set: function set(value) {
        this.sprite.y = value;
        this.data.y = value;
      }
    }]);

    return GameActor;
  })(Sprite.Event); // Game.Actor
})();
//# sourceMappingURL=GameActor.js.map
