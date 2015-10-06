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

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.assign("Actor", (function (_Sprite$Event) {
    _inherits(Actor, _Sprite$Event);

    _createClass(Actor, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("actor/" + id + ".js").then(function (data) {
            var actorData = data[0]();
            actorData.id = id;

            var actorObj = null;
            if (actorData.type == "npc") {
              actorObj = new Game.ActorNPC(actorData);
            } else if (actorData.type == "monster") {
              actorObj = new Game.ActorMonster(actorData);
            } else if (actorData.type == "ally") {
              actorObj = new Game.ActorAlly(actorData);
            } else if (actorData.type == "pet") {
              actorObj = new Game.ActorPet(actorData);
            } else {
              console.error(actorData.type, actorData);
              throw new Error("Game.Actor.load invalid actor type");
            }
            actorObj.on("complete", function () {
              resolve(actorObj);
            });
          });
        });
      }
    }]);

    function Actor(actorData) {
      var _this = this;

      _classCallCheck(this, Actor);

      _get(Object.getPrototypeOf(Actor.prototype), "constructor", this).call(this);
      var privates = internal(this);

      privates.data = actorData;

      this.makeInfoBox();

      if (this.data.image instanceof Array) {
        this.init(this.data.image);
      } else if (typeof this.data.image == "string") {
        Sprite.load("actor/" + this.data.image).then(function (data) {
          // data is Array
          _this.init(data);
        });
      } else {
        console.error(this.id, this.data, this.data.image, this);
        throw new Error("Invalid Actor Image");
      }
    }

    _createClass(Actor, [{
      key: "init",
      value: function init(images) {
        var _this2 = this;

        var privates = internal(this);
        var data = privates.data;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var image = _step.value;

            if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
              console.error(image, images, this);
              throw new Error("Game.Actor got invalid image, not Image or Canvas");
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

        ;

        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: data.tilewidth,
          height: data.tileheight,
          animations: data.animations
        });

        if (Number.isInteger(data.centerX) && Number.isInteger(data.centerY)) {
          sprite.centerX = data.centerX;
          sprite.centerY = data.centerY;
        } else {
          console.log(data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        sprite.play("facedown");
        privates.sprite = sprite;

        sprite.on("change", function () {
          privates.infoBox.x = sprite.x;
          privates.infoBox.y = sprite.y - sprite.centerY - 20;
        });

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            _this2.calculate();
            _this2.refreshBar();
            _this2.emit("complete", true);
          }
        };

        // 加载NPC可能有的任务
        if (data.quest) {
          privates.quest = [];
          privates.quest.length = data.quest.length;
          data.quest.forEach(function (questId, index) {
            completeCount--;

            Game.Quest.load(questId).then(function (questData) {
              privates.quest.push(questData);
              Complete();
            });
          });
        }

        // 加载人物技能
        if (data.skills) {
          data.skills.forEach(function (skillId) {
            completeCount--;
            Game.Skill.load(skillId).then(function () {
              Complete();
            });
          });
        }

        // 加载人物装备（暂时只有玩家）
        if (data.equipment) {
          for (var key in data.equipment) {
            var itemId = data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId).then(function () {
                Complete();
              });
            }
          }
        }

        // 加载人物物品
        if (data.items) {
          for (var itemId in data.items) {
            completeCount--;
            Game.Item.load(itemId).then(function () {
              Complete();
            });
          }
        }

        Complete();
      }
    }, {
      key: "makeInfoBox",
      value: function makeInfoBox() {
        var privates = internal(this);
        // 名字
        var text = new Sprite.Text({
          text: privates.data.name,
          maxWidth: 200,
          color: "white",
          fontSize: 12
        });
        text.centerY = Math.floor(text.height / 2);
        text.centerX = Math.floor(text.width / 2);
        text.x = 0;
        text.y = 0;

        // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
        privates.infoBox = new Sprite.Container();

        if (privates.data.type != "hero") {
          // 血条外面的黑框
          var hpbarBox = new Sprite.Shape();
          hpbarBox.centerX = 15;
          hpbarBox.centerY = 2;
          hpbarBox.x = 0;
          hpbarBox.y = 9;

          // 魔法条外面的黑框
          var mpbarBox = new Sprite.Shape();
          mpbarBox.centerX = 15;
          mpbarBox.centerY = 2;
          mpbarBox.x = 0;
          mpbarBox.y = 12;

          hpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          mpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          // 生命条
          privates.hpbar = new Sprite.Shape();
          privates.hpbar.centerX = 15;
          privates.hpbar.centerY = 2;
          privates.hpbar.x = 0;
          privates.hpbar.y = 9;

          // 精力条
          privates.mpbar = new Sprite.Shape();
          privates.mpbar.centerX = 15;
          privates.mpbar.centerY = 2;
          privates.mpbar.x = 0;
          privates.mpbar.y = 12;

          privates.infoBox.appendChild(text, hpbarBox, mpbarBox, privates.hpbar, privates.mpbar);
        }
      }
    }, {
      key: "calculate",
      value: function calculate() {
        var data = internal(this).data;
        if (data.$str && data.$dex && data.$con && data.$int && data.$cha) {

          data.str = data.$str;
          data.dex = data.$dex;
          data.con = data.$con;
          data.int = data.$int;
          data.cha = data.$cha;

          // 然后可以针对一级属性计算buff

          // 计算完一级属性的buff之后，开始计算二级属性

          data.$hp = data.con * 5;
          data.$sp = data.int * 5;

          data.atk = Math.floor(data.str * 0.25);
          data.matk = Math.floor(data.int * 0.25);
          data.def = 0;
          data.mdef = 0;
          data.critical = data.dex * 0.005;
          data.dodge = data.dex * 0.005;

          // 然后可以对二级属性计算buff

          // 对二级属性计算完buff之后，可以计算会变动的值
          // 例如.$hp是buff之后的生命值上限，.hp是当前生命值
          data.hp = data.$hp;
          data.sp = data.$sp;

          if (data.buff && data.nerf) {
            data.buff.forEach(function (element) {});
            data.nerf.forEach(function (element) {});
          }
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        var privates = internal(this);

        if (privates.hpbar && privates.mpbar) {
          var hpcolor = "green";
          if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

          privates.hpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.hp / this.data.$hp * 28),
            height: 2,
            fill: hpcolor,
            "stroke-width": 0
          });

          privates.mpbar.clear().rect({
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
      key: "distance",
      value: function distance() {
        var x = null,
            y = null;
        if (arguments.length == 2 && Number.isFinite(arguments[0]) && Number.isFinite(arguments[1])) {
          x = arguments[0];
          y = arguments[1];
        } else if (arguments.length == 1 && Number.isFinite(arguments[0].x) && Number.isFinite(arguments[0].y)) {
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
        return d;
      }
    }, {
      key: "decreaseHP",
      value: function decreaseHP(power) {
        this.data.hp -= power;
        this.refreshBar();
      }
    }, {
      key: "decreaseSP",
      value: function decreaseSP(sp) {
        this.data.sp -= sp;
        this.refreshBar();
      }
    }, {
      key: "dead",
      value: function dead(attacker) {
        var _this3 = this;

        if (this.data.hp <= 0) {
          if (this.data.type == "hero") {
            Game.windows.over.open("你被" + attacker.data.name + "打死了");
          } else {
            (function () {

              _this3.erase();
              Game.area.actors["delete"](_this3);

              var items = _this3.data.items || { gold: 1 };

              Game.addBag(_this3.x, _this3.y).then(function (bag) {
                for (var itemId in items) {
                  if (bag.inner.hasOwnProperty(itemId)) {
                    bag.inner[itemId] += items[itemId];
                  } else {
                    bag.inner[itemId] = items[itemId];
                  }
                }
              });

              attacker.emit("kill", false, _this3);
            })();
          }
        }
      }

      /** 闪一闪人物，例如被击中时的效果 */
    }, {
      key: "flash",
      value: function flash() {
        var _this4 = this;

        this.sprite.alpha = 0.5;
        setTimeout(function () {
          _this4.sprite.alpha = 1;
        }, 200);
      }

      /** 受到attacker的skill技能的伤害 */
    }, {
      key: "damage",
      value: function damage(attacker, skill) {

        this.emit("damaged");

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
        var state = null;

        if (Math.random() < this.data.dodge) {
          // 闪避了
          state = "dodge";
          text = new Sprite.Text({
            text: "miss",
            color: color,
            fontSize: 16
          });
        } else if (Math.random() < attacker.data.critical) {
          // 重击了
          state = "critical";
          power *= 2;
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 32
          });
          this.flash();
          this.decreaseHP(power);
        } else {
          // 普通击中
          state = "hit";
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 16
          });
          this.flash();
          this.decreaseHP(power);
        }

        /*
        if (state != "dodge" && this != Game.hero) {
          if (Game.sounds.hurt) {
            Game.sounds.hurt.load();
            Game.sounds.hurt.play();
          }
        }
        */

        text.centerX = Math.floor(text.width / 2);
        text.centerY = Math.floor(text.height);
        text.x = this.sprite.x;
        text.y = this.sprite.y;

        text.x += Sprite.rand(-10, 10);

        Game.layers.actorLayer.appendChild(text);

        var speed = Sprite.rand(1, 3);

        Sprite.Ticker.whiles(100, function (last) {
          text.y -= speed;
          if (last) {
            Game.layers.actorLayer.removeChild(text);
          }
        });

        // 测试是否死亡
        this.dead(attacker);
      }

      /** 播放一个动画 */
    }, {
      key: "play",
      value: function play(animation, priority) {
        // 新动画默认优先级为0
        if (!Number.isFinite(priority)) {
          priority = 0;
        }

        // 无动画或者停止状态，现有优先级为-1（最低级）
        if (typeof this.animationPriority == "undefined" || this.sprite.paused == true) {
          this.animationPriority = -1;
        }

        if (this.data.animations.hasOwnProperty(animation) && priority >= this.animationPriority && animation != this.sprite.currentAnimation) {
          this.animationPriority = priority;
          this.sprite.play(animation);
        }
      }

      /** 停止 */
    }, {
      key: "stop",
      value: function stop() {
        if (!this.sprite.currentAnimation) return;

        if (this.sprite.paused && !this.sprite.currentAnimation.match(/face/) || this.sprite.currentAnimation.match(/walk|run/)) {
          switch (this.direction) {
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

      /** 向指定direction方向释放一个技能 */
    }, {
      key: "fire",
      value: function fire(id, direction) {
        var _this5 = this;

        // 同一时间只能施展一个skill
        if (this.attacking) return 0;

        var skill = Game.skills[id];
        if (!skill) return 0;

        // 只有当这个skill的cooldown结
        var now = new Date().getTime();
        if (Number.isFinite(this.lastAttack) && Number.isFinite(this.lastAttackCooldown) && now - this.lastAttack < this.lastAttackCooldown) {
          return 0;
        }

        if (skill.data.cost > this.data.sp) {
          return 0;
        }

        if (!direction) {
          direction = this.direction;
        }

        if ( // 玩家使用技能是可能有条件的，例如剑技能需要装备剑
        this.type == "hero" && skill.data.condition && skill.data.condition() == false) {
          return 0;
        }

        this.lastAttack = now;
        this.lastAttackCooldown = skill.data.cooldown;
        this.attacking = true;

        this.data.sp -= skill.data.cost;
        this.refreshBar();

        skill.fire(this, direction, function (hitted) {
          _this5.attacking = false;
          if (hitted.length > 0) {
            hitted[0].damage(_this5, skill);
          }
          _this5.emit("change");
        });

        return skill.data.cooldown;
      }

      /** 行走到指定地点 */
    }, {
      key: "goto",
      value: function goto(x, y, state, callback) {
        var _this6 = this;

        if (this.going) {
          this.goingNext = function () {
            _this6.goto(x, y, state, callback);
          };
          return false;
        }

        var destBlocked = this.checkCollision(x, y);

        if (destBlocked) {
          if (this.x == x) {
            if (this.y - y == -1) {
              this.stop();
              this.face("down");
              if (callback) callback();
              return false;
            } else if (this.y - y == 1) {
              this.stop();
              this.face("up");
              if (callback) callback();
              return false;
            }
          } else if (this.y == y) {
            if (this.x - x == -1) {
              this.stop();
              this.face("right");
              if (callback) callback();
              return false;
            } else if (this.x - x == 1) {
              this.stop();
              this.face("left");
              if (callback) callback();
              return false;
            }
          }
        }

        var positionChoice = [];
        // 上下左右
        if (this.checkCollision(x, y - 1) == false) {
          positionChoice.push({ x: x, y: y - 1, after: "down" });
        }
        if (this.checkCollision(x, y + 1) == false) {
          positionChoice.push({ x: x, y: y + 1, after: "up" });
        }
        if (this.checkCollision(x - 1, y) == false) {
          positionChoice.push({ x: x - 1, y: y, after: "right" });
        }
        if (this.checkCollision(x + 1, y) == false) {
          positionChoice.push({ x: x + 1, y: y, after: "left" });
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = positionChoice[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var element = _step2.value;
            // 计算地址距离
            element.distance = this.distance(element.x, element.y);
          }

          // 按照地址的距离从近到远排序（从小到大）
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        positionChoice.sort(function (a, b) {
          return a.distance - b.distance;
        });

        // 如果真正的目的地有可能走，插入到第一位，写在这里是因为目的地并不一定是distance最小的
        if (this.checkCollision(x, y) == false) {
          positionChoice.splice(0, 0, { x: x, y: y });
        }

        var index = 0;
        var otherChoice = false;

        var TestPosition = function TestPosition() {
          if (index < positionChoice.length) {
            (function () {
              var dest = positionChoice[index]; // 保存第一个选项
              index++;
              Game.Astar.getPath({ x: _this6.x, y: _this6.y }, dest, function (result) {
                _this6.gettingPath = false;
                if (_this6.goingNext) {
                  var c = _this6.goingNext;
                  _this6.goingNext = null;
                  _this6.going = false;
                  if (_this6 == Game.hero) {
                    Game.Input.clearDest();
                  }
                  c();
                  return false;
                }
                if (_this6.going) {
                  return false;
                }
                if (result) {
                  if (_this6 == Game.hero) {
                    Game.Input.setDest(dest.x, dest.y);
                  } else {
                    // not hero
                    if (result.length > 30) {
                      // too far
                      return false;
                    }
                  }
                  _this6.gotoPath(result, state, dest.after, callback);
                  return true;
                } else {
                  return TestPosition();
                }
              });
            })();
          } else {
            if (otherChoice == false) {
              otherChoice = true;
              var otherPositionChoice = [];
              // 四个角
              if (_this6.checkCollision(x - 1, y - 1) == false) {
                otherPositionChoice.push({ x: x - 1, y: y - 1, after: "right" });
              }
              if (_this6.checkCollision(x + 1, y - 1) == false) {
                otherPositionChoice.push({ x: x + 1, y: y - 1, after: "left" });
              }
              if (_this6.checkCollision(x - 1, y + 1) == false) {
                otherPositionChoice.push({ x: x - 1, y: y + 1, after: "right" });
              }
              if (_this6.checkCollision(x + 1, y + 1) == false) {
                otherPositionChoice.push({ x: x + 1, y: y + 1, after: "left" });
              }
              // 四个远方向
              if (_this6.checkCollision(x, y - 2) == false) {
                otherPositionChoice.push({ x: x, y: y - 2, after: "down" });
              }
              if (_this6.checkCollision(x, y + 2) == false) {
                otherPositionChoice.push({ x: x, y: y + 2, after: "up" });
              }
              if (_this6.checkCollision(x - 2, y) == false) {
                otherPositionChoice.push({ x: x - 2, y: y, after: "right" });
              }
              if (_this6.checkCollision(x + 2, y) == false) {
                otherPositionChoice.push({ x: x + 2, y: y, after: "left" });
              }

              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = otherPositionChoice[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var element = _step3.value;
                  // 计算地址距离
                  element.distance = _this6.distance(element.x, element.y);
                }

                // 按照地址的距离从近到远排序（从小到大）
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                    _iterator3["return"]();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }

              otherPositionChoice.sort(function (a, b) {
                return a.distance - b.distance;
              });

              if (otherPositionChoice.length) {
                index = 0;
                positionChoice = otherPositionChoice;
                TestPosition();
              }
            }
          } // 再次尝试离地点最近的地点
        };

        return TestPosition();
      }
    }, {
      key: "gotoPath",
      value: function gotoPath(path, state, after, callback) {
        var _this7 = this;

        this.going = true;
        var index = 1;
        var Walk = function Walk() {
          if (Game.paused) {
            _this7.stop();
            _this7.going = false;
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            return;
          }
          if (_this7.goingNext) {
            var c = _this7.goingNext;
            _this7.goingNext = null;
            _this7.going = false;
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            c();
            return;
          }

          if (index < path.length) {
            var current = { x: _this7.x, y: _this7.y };
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
              var currentDirection = _this7.direction;
              if (direction != currentDirection) {
                _this7.stop();
                _this7.face(direction);
              }
              var goResult = _this7.go(state, direction, function () {
                return Walk();
              });
              if (goResult != true) {
                _this7.going = false;
              }
              index++;
            }
          } else {
            // 正常结束
            if (after) {
              _this7.stop();
              _this7.face(after);
            }
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            _this7.going = false;
            if (callback) callback();
          }
        };
        Walk();
      }
    }, {
      key: "face",
      value: function face(direction) {
        var animation = "face" + direction;
        if (this.animation != animation) {
          this.sprite.play(animation);
          this.emit("change");
        }
      }

      // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
      // 返回true为有碰撞，返回false为无碰撞
    }, {
      key: "checkCollision",
      value: function checkCollision(x, y) {
        // 地图边缘碰撞
        if (x < 0 || y < 0 || x >= Game.area.map.data.width || y >= Game.area.map.data.height) {
          return true;
        }
        // 地图碰撞
        if (Game.area.map.hitTest(x, y)) {
          return true;
        }

        // 角色碰撞
        if (Game.area.actors) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Game.area.actors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var actor = _step4.value;

              if (actor != this && actor.hitTest(x, y)) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }

        if (Game.area.items) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = Game.area.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var item = _step5.value;

              if (item.hitTest(x, y)) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                _iterator5["return"]();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = this.data.hitArea[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var p = _step6.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "go",
      value: function go(state, direction) {
        var _this8 = this;

        var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        if (Game.paused) {
          return false;
        }

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

        if (this.direction != direction) {
          this.walking = true;
          this.stop();
          this.face(direction);
          // wait 4 ticks
          Sprite.Ticker.after(4, function () {
            _this8.walking = false;
          });
          return false;
        }

        var newPosition = this.facePosition;

        if (this.checkCollision(newPosition.x, newPosition.y) == false) {
          var _ret3 = (function () {
            // 没碰撞，开始行走
            _this8.walking = true;

            // 把角色位置设置为新位置，为了占领这个位置，这样其他角色就会碰撞
            // 但是不能用this.x = newX这样设置，因为this.x的设置会同时设置this.sprite.x
            var oldX = _this8.data.x;
            var oldY = _this8.data.y;
            _this8.data.x = newPosition.x;
            _this8.data.y = newPosition.y;

            // walk
            // 这些数组和必须是32，为了保证一次go行走32个像素
            var speed = [3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2]; // 和是32
            if (state == "run") {
              // speed = [6,7,6,7,6]; // 和是32
              speed = [4, 4, 4, 4, 4, 4, 4, 4]; // 和是32
            }
            // 比预计多一个，这样是为了流畅
            // 因为下一次go可能紧挨着这次
            var times = speed.length + 1;

            var whilesId = Sprite.Ticker.whiles(times, function (last) {
              if (Game.paused) {
                _this8.data.x = oldX;
                _this8.data.y = oldY;
                _this8.walking = false;
                _this8.emit("change");
                Sprite.Ticker.clearWhiles(whilesId);
                if (callback) {
                  callback();
                }
                return;
              }

              if (last) {
                _this8.x = newPosition.x;
                _this8.y = newPosition.y;
                _this8.walking = false;
                _this8.emit("change");

                if (callback) {
                  callback();
                }
              } else {
                switch (direction) {
                  case "up":
                    _this8.sprite.y -= speed.pop();
                    break;
                  case "down":
                    _this8.sprite.y += speed.pop();
                    break;
                  case "left":
                    _this8.sprite.x -= speed.pop();
                    break;
                  case "right":
                    _this8.sprite.x += speed.pop();
                    break;
                }
              }
            });

            // 播放行走动画
            _this8.play(state + direction, 1);
            return {
              v: true
            };
          })();

          if (typeof _ret3 === "object") return _ret3.v;
        }

        return false;
      }

      /** 在Game.actorLayer上删除人物 */
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        Game.layers.actorLayer.removeChild(this.sprite);
        Game.layers.infoLayer.removeChild(privates.infoBox);
      }

      /** 在Game.actorLayer上显示人物 */
    }, {
      key: "draw",
      value: function draw() {
        var privates = internal(this);
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
          this.x = this.data.x;
          this.y = this.data.y;

          internal(this).infoBox.x = this.sprite.x;
          internal(this).infoBox.y = this.sprite.y - this.sprite.centerY - 20;

          Game.layers.actorLayer.appendChild(this.sprite);
          Game.layers.infoLayer.appendChild(privates.infoBox);
        } else {
          console.error(this.data.x, this.data.y, this.data);
          throw new Error("Game.Actor.draw invalid data.x/data.y");
        }
      }

      /** 镜头集中 */
    }, {
      key: "focus",
      value: function focus() {
        var privates = internal(this);
        privates.infoBox.x = this.sprite.x;
        privates.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
      }
    }, {
      key: "data",
      get: function get() {
        var privates = internal(this);
        return privates.data;
      },
      set: function set(value) {
        throw new Error("Game.Actor.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Actor.id readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return internal(this).data.type;
      },
      set: function set(value) {
        throw new Error("Game.Actor.type readonly");
      }
    }, {
      key: "sprite",
      get: function get() {
        var privates = internal(this);
        return privates.sprite;
      },
      set: function set(value) {
        throw new Error("Game.Actor.sprite readonly");
      }
    }, {
      key: "quest",
      get: function get() {
        var privates = internal(this);
        if (privates.quest) {
          return privates.quest;
        } else {
          return null;
        }
      },
      set: function set(value) {
        throw new Error("Game.Actor.quests readonly");
      }
    }, {
      key: "x",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.x = value;
          this.sprite.x = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid x, x has to be a number and integer");
        }
      }
    }, {
      key: "y",
      get: function get() {
        return this.data.y;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.y = value;
          this.sprite.y = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid y, y has to be a number and integer");
        }
      }
    }, {
      key: "visible",
      get: function get() {
        return this.sprite.visible;
      },
      set: function set(value) {
        this.sprite.visible = value;
        internal(this).infoBox.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return this.sprite.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          this.sprite.alpha = value;
          internal(this).infoBox.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Actor.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        throw new Error("Game.Actor.position readonly");
      }
    }, {
      key: "direction",
      get: function get() {
        return this.sprite.currentAnimation.match(/up|left|down|right/)[0];
      },
      set: function set(value) {
        throw new Error("Game.Actor.direction readonly");
      }
    }, {
      key: "facePosition",
      get: function get() {
        var p = this.position;
        switch (this.direction) {
          case "up":
            p.y -= 1;
            break;
          case "down":
            p.y += 1;
            break;
          case "left":
            p.x -= 1;
            break;
          case "right":
            p.x += 1;
            break;
        }
        return p;
      },
      set: function set(value) {
        throw new Error("Game.Actor.facePosition readonly");
      }
    }]);

    return Actor;
  })(Sprite.Event)); // Game.Actor
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxLQUFLOztpQkFBTCxLQUFLOzthQUVsQixjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxZQUFVLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUIscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOztBQUVsQixnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGdCQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQzNCLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUN0QyxzQkFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM3QyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDbkMsc0JBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDMUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2xDLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFD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QUFDLEtBQUssRUFBRTtBQUNwQixjQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7T0FDbEQ7OztXQUVnQixlQUFHO0FBQ2xCLFlBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDdEIsZ0JBQVEsSUFBSSxDQUFDLFNBQVM7QUFDcEIsZUFBSyxJQUFJO0FBQ1AsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1YsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLFNBQ1Q7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWO1dBRWdCLGFBQUMsS0FBSyxFQUFFO0FBQ3ZCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBelp3QixLQUFLO0tBQVMsTUFBTSxDQUFDLEtBQUssRUFzbENuRCxDQUFDO0NBRUosQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qXG4gICAg6KeS6Imy57G777yM5YyF5ous5raJ5Y+K5YiwaGVyb+WSjG5wY1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JcIiwgY2xhc3MgQWN0b3IgZXh0ZW5kcyBTcHJpdGUuRXZlbnQge1xuXG4gICAgc3RhdGljIGxvYWQgKGlkKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBTcHJpdGUubG9hZChgYWN0b3IvJHtpZH0uanNgKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IGFjdG9yRGF0YSA9IGRhdGFbMF0oKTtcbiAgICAgICAgICBhY3RvckRhdGEuaWQgPSBpZDtcblxuICAgICAgICAgIGxldCBhY3Rvck9iaiA9IG51bGw7XG4gICAgICAgICAgaWYgKGFjdG9yRGF0YS50eXBlID09IFwibnBjXCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JOUEMoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yRGF0YS50eXBlID09IFwibW9uc3RlclwiKSB7XG4gICAgICAgICAgICBhY3Rvck9iaiA9IG5ldyBHYW1lLkFjdG9yTW9uc3RlcihhY3RvckRhdGEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJhbGx5XCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JBbGx5KGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhY3RvckRhdGEudHlwZSA9PSBcInBldFwiKSB7XG4gICAgICAgICAgICBhY3Rvck9iaiA9IG5ldyBHYW1lLkFjdG9yUGV0KGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYWN0b3JEYXRhLnR5cGUsIGFjdG9yRGF0YSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmxvYWQgaW52YWxpZCBhY3RvciB0eXBlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3Rvck9iai5vbihcImNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoYWN0b3JPYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgY29uc3RydWN0b3IgKGFjdG9yRGF0YSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBwcml2YXRlcy5kYXRhID0gYWN0b3JEYXRhO1xuXG4gICAgICB0aGlzLm1ha2VJbmZvQm94KCk7XG5cbiAgICAgIGlmICh0aGlzLmRhdGEuaW1hZ2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLmluaXQodGhpcy5kYXRhLmltYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuZGF0YS5pbWFnZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKFwiYWN0b3IvXCIgKyB0aGlzLmRhdGEuaW1hZ2UpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAvLyBkYXRhIGlzIEFycmF5XG4gICAgICAgICAgdGhpcy5pbml0KGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5pZCwgdGhpcy5kYXRhLCB0aGlzLmRhdGEuaW1hZ2UsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEFjdG9yIEltYWdlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgKGltYWdlcykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZGF0YSA9IHByaXZhdGVzLmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGltYWdlIG9mIGltYWdlcykge1xuICAgICAgICBpZiAoIShpbWFnZSBpbnN0YW5jZW9mIEltYWdlKSAmJiAhKGltYWdlLmdldENvbnRleHQgJiYgaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpKSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIGltYWdlcywgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3RvciBnb3QgaW52YWxpZCBpbWFnZSwgbm90IEltYWdlIG9yIENhbnZhc1wiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgbGV0IHNwcml0ZSA9IG5ldyBTcHJpdGUuU2hlZXQoe1xuICAgICAgICBpbWFnZXM6IGltYWdlcywgLy8gaW1hZ2VzIGlzIEFycmF5XG4gICAgICAgIHdpZHRoOiBkYXRhLnRpbGV3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkYXRhLnRpbGVoZWlnaHQsXG4gICAgICAgIGFuaW1hdGlvbnM6IGRhdGEuYW5pbWF0aW9uc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihkYXRhLmNlbnRlclgpICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIoZGF0YS5jZW50ZXJZKVxuICAgICAgKSB7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJYID0gZGF0YS5jZW50ZXJYO1xuICAgICAgICBzcHJpdGUuY2VudGVyWSA9IGRhdGEuY2VudGVyWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGludmFsaWQgY2VudGVyWC9jZW50ZXJZXCIpO1xuICAgICAgfVxuXG4gICAgICBzcHJpdGUucGxheShcImZhY2Vkb3duXCIpO1xuICAgICAgcHJpdmF0ZXMuc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICBzcHJpdGUub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5pbmZvQm94LnggPSBzcHJpdGUueDtcbiAgICAgICAgcHJpdmF0ZXMuaW5mb0JveC55ID0gc3ByaXRlLnkgLSBzcHJpdGUuY2VudGVyWSAtIDIwXG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbXBsZXRlQ291bnQgPSAtMTtcbiAgICAgIGxldCBDb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgY29tcGxldGVDb3VudCsrO1xuICAgICAgICBpZiAoY29tcGxldGVDb3VudCA+PSAwKSB7XG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGUoKTtcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8g5Yqg6L29TlBD5Y+v6IO95pyJ55qE5Lu75YqhXG4gICAgICBpZiAoZGF0YS5xdWVzdCkge1xuICAgICAgICBwcml2YXRlcy5xdWVzdCA9IFtdO1xuICAgICAgICBwcml2YXRlcy5xdWVzdC5sZW5ndGggPSBkYXRhLnF1ZXN0Lmxlbmd0aDtcbiAgICAgICAgZGF0YS5xdWVzdC5mb3JFYWNoKChxdWVzdElkLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcblxuICAgICAgICAgIEdhbWUuUXVlc3QubG9hZChxdWVzdElkKS50aGVuKChxdWVzdERhdGEpID0+IHtcbiAgICAgICAgICAgIHByaXZhdGVzLnF1ZXN0LnB1c2gocXVlc3REYXRhKTtcbiAgICAgICAgICAgIENvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOWKoOi9veS6uueJqeaKgOiDvVxuICAgICAgaWYgKGRhdGEuc2tpbGxzKSB7XG4gICAgICAgIGRhdGEuc2tpbGxzLmZvckVhY2goKHNraWxsSWQpID0+IHtcbiAgICAgICAgICBjb21wbGV0ZUNvdW50LS07XG4gICAgICAgICAgR2FtZS5Ta2lsbC5sb2FkKHNraWxsSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOWKoOi9veS6uueJqeijheWkh++8iOaaguaXtuWPquacieeOqeWutu+8iVxuICAgICAgaWYgKGRhdGEuZXF1aXBtZW50KSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhLmVxdWlwbWVudCkge1xuICAgICAgICAgIGxldCBpdGVtSWQgPSBkYXRhLmVxdWlwbWVudFtrZXldO1xuICAgICAgICAgIGlmIChpdGVtSWQpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICAgIEdhbWUuSXRlbS5sb2FkKGl0ZW1JZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIENvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp54mp5ZOBXG4gICAgICBpZiAoZGF0YS5pdGVtcykge1xuICAgICAgICBmb3IgKGxldCBpdGVtSWQgaW4gZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICBHYW1lLkl0ZW0ubG9hZChpdGVtSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBDb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmRhdGE7XG4gICAgfVxuXG4gICAgc2V0IGRhdGEgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmRhdGEgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEudHlwZTtcbiAgICB9XG5cbiAgICBzZXQgdHlwZSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IudHlwZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc3ByaXRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnNwcml0ZTtcbiAgICB9XG5cbiAgICBzZXQgc3ByaXRlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5zcHJpdGUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHF1ZXN0ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLnF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy5xdWVzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldCBxdWVzdCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IucXVlc3RzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIG1ha2VJbmZvQm94ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgLy8g5ZCN5a2XXG4gICAgICBsZXQgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgIHRleHQ6IHByaXZhdGVzLmRhdGEubmFtZSxcbiAgICAgICAgbWF4V2lkdGg6IDIwMCxcbiAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgZm9udFNpemU6IDEyXG4gICAgICB9KTtcbiAgICAgIHRleHQuY2VudGVyWSA9IE1hdGguZmxvb3IodGV4dC5oZWlnaHQgLyAyKTtcbiAgICAgIHRleHQuY2VudGVyWCA9IE1hdGguZmxvb3IodGV4dC53aWR0aCAvIDIpO1xuICAgICAgdGV4dC54ID0gMDtcbiAgICAgIHRleHQueSA9IDA7XG5cbiAgICAgIC8vIOS4gOS4quS4iumdouWbm+S4queyvuelnuadoeOAgeihgOadoeeahOiBmuWQiO+8jOe7n+S4gOeuoeeQhuaUvuWFpei/meS4qkNvbnRhaW5lclxuICAgICAgcHJpdmF0ZXMuaW5mb0JveCA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG5cbiAgICAgIGlmIChwcml2YXRlcy5kYXRhLnR5cGUgIT0gXCJoZXJvXCIpIHtcbiAgICAgICAgLy8g6KGA5p2h5aSW6Z2i55qE6buR5qGGXG4gICAgICAgIGxldCBocGJhckJveCA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgaHBiYXJCb3guY2VudGVyWCA9IDE1O1xuICAgICAgICBocGJhckJveC5jZW50ZXJZID0gMjtcbiAgICAgICAgaHBiYXJCb3gueCA9IDA7XG4gICAgICAgIGhwYmFyQm94LnkgPSA5O1xuXG4gICAgICAgIC8vIOmtlOazleadoeWklumdoueahOm7keahhlxuICAgICAgICBsZXQgbXBiYXJCb3ggPSBuZXcgU3ByaXRlLlNoYXBlKCk7XG4gICAgICAgIG1wYmFyQm94LmNlbnRlclggPSAxNTtcbiAgICAgICAgbXBiYXJCb3guY2VudGVyWSA9IDI7XG4gICAgICAgIG1wYmFyQm94LnggPSAwO1xuICAgICAgICBtcGJhckJveC55ID0gMTI7XG5cbiAgICAgICAgaHBiYXJCb3gucmVjdCh7XG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwLFxuICAgICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMFxuICAgICAgICB9KTtcblxuICAgICAgICBtcGJhckJveC5yZWN0KHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOeUn+WRveadoVxuICAgICAgICBwcml2YXRlcy5ocGJhciA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIuY2VudGVyWCA9IDE1O1xuICAgICAgICBwcml2YXRlcy5ocGJhci5jZW50ZXJZID0gMjtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIueCA9IDA7XG4gICAgICAgIHByaXZhdGVzLmhwYmFyLnkgPSA5O1xuXG4gICAgICAgIC8vIOeyvuWKm+adoVxuICAgICAgICBwcml2YXRlcy5tcGJhciA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIuY2VudGVyWCA9IDE1O1xuICAgICAgICBwcml2YXRlcy5tcGJhci5jZW50ZXJZID0gMjtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIueCA9IDA7XG4gICAgICAgIHByaXZhdGVzLm1wYmFyLnkgPSAxMjtcblxuICAgICAgICBwcml2YXRlcy5pbmZvQm94LmFwcGVuZENoaWxkKFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgaHBiYXJCb3gsXG4gICAgICAgICAgbXBiYXJCb3gsXG4gICAgICAgICAgcHJpdmF0ZXMuaHBiYXIsXG4gICAgICAgICAgcHJpdmF0ZXMubXBiYXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxjdWxhdGUgKCkge1xuICAgICAgbGV0IGRhdGEgPSBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgICAgaWYgKFxuICAgICAgICBkYXRhLiRzdHIgJiZcbiAgICAgICAgZGF0YS4kZGV4ICYmXG4gICAgICAgIGRhdGEuJGNvbiAmJlxuICAgICAgICBkYXRhLiRpbnQgJiZcbiAgICAgICAgZGF0YS4kY2hhXG4gICAgICApIHtcblxuICAgICAgICBkYXRhLnN0ciA9IGRhdGEuJHN0cjtcbiAgICAgICAgZGF0YS5kZXggPSBkYXRhLiRkZXg7XG4gICAgICAgIGRhdGEuY29uID0gZGF0YS4kY29uO1xuICAgICAgICBkYXRhLmludCA9IGRhdGEuJGludDtcbiAgICAgICAgZGF0YS5jaGEgPSBkYXRhLiRjaGE7XG5cbiAgICAgICAgLy8g54S25ZCO5Y+v5Lul6ZKI5a+55LiA57qn5bGe5oCn6K6h566XYnVmZlxuXG5cbiAgICAgICAgLy8g6K6h566X5a6M5LiA57qn5bGe5oCn55qEYnVmZuS5i+WQju+8jOW8gOWni+iuoeeul+S6jOe6p+WxnuaAp1xuXG4gICAgICAgIGRhdGEuJGhwID0gZGF0YS5jb24gKiA1O1xuICAgICAgICBkYXRhLiRzcCA9IGRhdGEuaW50ICogNTtcblxuICAgICAgICBkYXRhLmF0ayA9IE1hdGguZmxvb3IoZGF0YS5zdHIgKiAwLjI1KTtcbiAgICAgICAgZGF0YS5tYXRrID0gTWF0aC5mbG9vcihkYXRhLmludCAqIDAuMjUpO1xuICAgICAgICBkYXRhLmRlZiA9IDA7XG4gICAgICAgIGRhdGEubWRlZiA9IDA7XG4gICAgICAgIGRhdGEuY3JpdGljYWwgPSBkYXRhLmRleCAqIDAuMDA1O1xuICAgICAgICBkYXRhLmRvZGdlID0gZGF0YS5kZXggKiAwLjAwNTtcblxuICAgICAgICAvLyDnhLblkI7lj6/ku6Xlr7nkuoznuqflsZ7mgKforqHnrpdidWZmXG5cblxuXG4gICAgICAgIC8vIOWvueS6jOe6p+WxnuaAp+iuoeeul+WujGJ1ZmbkuYvlkI7vvIzlj6/ku6XorqHnrpfkvJrlj5jliqjnmoTlgLxcbiAgICAgICAgLy8g5L6L5aaCLiRocOaYr2J1ZmbkuYvlkI7nmoTnlJ/lkb3lgLzkuIrpmZDvvIwuaHDmmK/lvZPliY3nlJ/lkb3lgLxcbiAgICAgICAgZGF0YS5ocCA9IGRhdGEuJGhwO1xuICAgICAgICBkYXRhLnNwID0gZGF0YS4kc3A7XG5cbiAgICAgICAgaWYgKGRhdGEuYnVmZiAmJiBkYXRhLm5lcmYpIHtcbiAgICAgICAgICBkYXRhLmJ1ZmYuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGF0YS5uZXJmLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHggKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS54O1xuICAgIH1cblxuICAgIHNldCB4ICh2YWx1ZSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiYgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5kYXRhLnggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5zcHJpdGUueCA9IHZhbHVlICogMzIgKyAxNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIGludGVybmFsKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3RvciBnb3QgaW52YWxpZCB4LCB4IGhhcyB0byBiZSBhIG51bWJlciBhbmQgaW50ZWdlclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgeSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnk7XG4gICAgfVxuXG4gICAgc2V0IHkgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmRhdGEueSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNwcml0ZS55ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgaW50ZXJuYWwodGhpcyksIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIHksIHkgaGFzIHRvIGJlIGEgbnVtYmVyIGFuZCBpbnRlZ2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCB2aXNpYmxlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlICh2YWx1ZSkge1xuICAgICAgdGhpcy5zcHJpdGUudmlzaWJsZSA9IHZhbHVlO1xuICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC52aXNpYmxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGFscGhhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS5hbHBoYTtcbiAgICB9XG5cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDEpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuYWxwaGEgPSB2YWx1ZTtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuYWxwaGEgZ290IGludmFsaWQgdmFsdWVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHBvc2l0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgeTogdGhpcy55XG4gICAgICB9O1xuICAgIH1cblxuICAgIHNldCBwb3NpdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IucG9zaXRpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGRpcmVjdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvdXB8bGVmdHxkb3dufHJpZ2h0LylbMF07XG4gICAgfVxuXG4gICAgc2V0IGRpcmVjdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGlyZWN0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBmYWNlUG9zaXRpb24gKCkge1xuICAgICAgbGV0IHAgPSB0aGlzLnBvc2l0aW9uO1xuICAgICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICBwLnkgLT0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICBwLnkgKz0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICBwLnggLT0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgcC54ICs9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBzZXQgZmFjZVBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5mYWNlUG9zaXRpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmhwYmFyICYmIHByaXZhdGVzLm1wYmFyKSB7XG4gICAgICAgIGxldCBocGNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICBpZiAoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApIDwgMC4yNSlcbiAgICAgICAgICBocGNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgZWxzZSBpZiAoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApIDwgMC41KVxuICAgICAgICAgIGhwY29sb3IgPSBcInllbGxvd1wiO1xuXG4gICAgICAgIHByaXZhdGVzLmhwYmFyLmNsZWFyKCkucmVjdCh7XG4gICAgICAgICAgeDogMSxcbiAgICAgICAgICB5OiAxLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmZsb29yKCh0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwKSAqIDI4KSxcbiAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgZmlsbDogaHBjb2xvcixcbiAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGVzLm1wYmFyLmNsZWFyKCkucmVjdCh7XG4gICAgICAgICAgeDogMSxcbiAgICAgICAgICB5OiAxLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmZsb29yKCh0aGlzLmRhdGEuc3AgLyB0aGlzLmRhdGEuJHNwKSAqIDI4KSxcbiAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgZmlsbDogXCJibHVlXCIsXG4gICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXN0YW5jZSAoKSB7XG4gICAgICBsZXQgeCA9IG51bGwsIHkgPSBudWxsO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMiAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdKSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzFdKSkge1xuICAgICAgICB4ID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzFdO1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgTnVtYmVyLmlzRmluaXRlKGFyZ3VtZW50c1swXS54KSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdLnkpKSB7XG4gICAgICAgIHggPSBhcmd1bWVudHNbMF0ueDtcbiAgICAgICAgeSA9IGFyZ3VtZW50c1swXS55O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihhcmd1bWVudHMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmRpc3RhbmNlIEludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuICAgICAgbGV0IGQgPSAwO1xuICAgICAgZCArPSBNYXRoLnBvdyh0aGlzLnggLSB4LCAyKTtcbiAgICAgIGQgKz0gTWF0aC5wb3codGhpcy55IC0geSwgMik7XG4gICAgICBkID0gTWF0aC5zcXJ0KGQpO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VIUCAocG93ZXIpIHtcbiAgICAgIHRoaXMuZGF0YS5ocCAtPSBwb3dlcjtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgIH1cblxuICAgIGRlY3JlYXNlU1AgKHNwKSB7XG4gICAgICB0aGlzLmRhdGEuc3AgLT0gc3A7XG4gICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICB9XG5cbiAgICBkZWFkIChhdHRhY2tlcikge1xuICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8PSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEudHlwZSA9PSBcImhlcm9cIikge1xuICAgICAgICAgIEdhbWUud2luZG93cy5vdmVyLm9wZW4oYOS9oOiiqyR7YXR0YWNrZXIuZGF0YS5uYW1lfeaJk+atu+S6hmApO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgdGhpcy5lcmFzZSgpO1xuICAgICAgICAgIEdhbWUuYXJlYS5hY3RvcnMuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhLml0ZW1zIHx8IHsgZ29sZDogMSB9O1xuXG4gICAgICAgICAgR2FtZS5hZGRCYWcodGhpcy54ICx0aGlzLnkpLnRoZW4oKGJhZykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaXRlbUlkIGluIGl0ZW1zKSB7XG4gICAgICAgICAgICAgIGlmIChiYWcuaW5uZXIuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgICAgICAgICAgIGJhZy5pbm5lcltpdGVtSWRdICs9IGl0ZW1zW2l0ZW1JZF07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFnLmlubmVyW2l0ZW1JZF0gPSBpdGVtc1tpdGVtSWRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhdHRhY2tlci5lbWl0KFwia2lsbFwiLCBmYWxzZSwgdGhpcyk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDpl6rkuIDpl6rkurrnianvvIzkvovlpoLooqvlh7vkuK3ml7bnmoTmlYjmnpwgKi9cbiAgICBmbGFzaCAoKSB7XG4gICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDAuNTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDE7XG4gICAgICB9LCAyMDApO1xuICAgIH1cblxuICAgIC8qKiDlj5fliLBhdHRhY2tlcueahHNraWxs5oqA6IO955qE5Lyk5a6zICovXG4gICAgZGFtYWdlIChhdHRhY2tlciwgc2tpbGwpIHtcblxuICAgICAgdGhpcy5lbWl0KFwiZGFtYWdlZFwiKTtcblxuICAgICAgbGV0IHBvd2VyID0gc2tpbGwucG93ZXI7XG4gICAgICBsZXQgdHlwZSA9IHNraWxsLnR5cGU7XG5cbiAgICAgIGxldCBjb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGlmICh0aGlzLmRhdGEudHlwZSA9PSBcImhlcm9cIikge1xuICAgICAgICBjb2xvciA9IFwicmVkXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgcG93ZXIgKz0gYXR0YWNrZXIuZGF0YS5hdGs7XG4gICAgICAgIHBvd2VyIC09IHRoaXMuZGF0YS5kZWZcbiAgICAgICAgcG93ZXIgPSBNYXRoLm1heCgwLCBwb3dlcik7XG4gICAgICB9IGVsc2UgeyAvLyB0eXBlID09IG1hZ2ljXG4gICAgICAgIHBvd2VyICs9IGF0dGFja2VyLmRhdGEubWF0aztcbiAgICAgICAgcG93ZXIgLSB0aGlzLmRhdGEubWRlZlxuICAgICAgICBwb3dlciA9IE1hdGgubWF4KDAsIHBvd2VyKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHQgPSBudWxsO1xuICAgICAgbGV0IHN0YXRlID0gbnVsbDtcblxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCB0aGlzLmRhdGEuZG9kZ2UpIHsgLy8g6Zeq6YG/5LqGXG4gICAgICAgIHN0YXRlID0gXCJkb2RnZVwiO1xuICAgICAgICB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgICB0ZXh0OiBcIm1pc3NcIixcbiAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IDE2XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLnJhbmRvbSgpIDwgYXR0YWNrZXIuZGF0YS5jcml0aWNhbCkgeyAvLyDph43lh7vkuoZcbiAgICAgICAgc3RhdGUgPSBcImNyaXRpY2FsXCI7XG4gICAgICAgIHBvd2VyICo9IDI7XG4gICAgICAgIHRleHQgPSBuZXcgU3ByaXRlLlRleHQoe1xuICAgICAgICAgIHRleHQ6IFwiLVwiICsgcG93ZXIsXG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIGZvbnRTaXplOiAzMlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFzaCgpO1xuICAgICAgICB0aGlzLmRlY3JlYXNlSFAocG93ZXIpO1xuICAgICAgfSBlbHNlIHsgLy8g5pmu6YCa5Ye75LitXG4gICAgICAgIHN0YXRlID0gXCJoaXRcIjtcbiAgICAgICAgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgdGV4dDogXCItXCIgKyBwb3dlcixcbiAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IDE2XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZsYXNoKCk7XG4gICAgICAgIHRoaXMuZGVjcmVhc2VIUChwb3dlcik7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBpZiAoc3RhdGUgIT0gXCJkb2RnZVwiICYmIHRoaXMgIT0gR2FtZS5oZXJvKSB7XG4gICAgICAgIGlmIChHYW1lLnNvdW5kcy5odXJ0KSB7XG4gICAgICAgICAgR2FtZS5zb3VuZHMuaHVydC5sb2FkKCk7XG4gICAgICAgICAgR2FtZS5zb3VuZHMuaHVydC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICovXG5cbiAgICAgIHRleHQuY2VudGVyWCA9IE1hdGguZmxvb3IodGV4dC53aWR0aCAvIDIpO1xuICAgICAgdGV4dC5jZW50ZXJZID0gTWF0aC5mbG9vcih0ZXh0LmhlaWdodCk7XG4gICAgICB0ZXh0LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgdGV4dC55ID0gdGhpcy5zcHJpdGUueTtcblxuICAgICAgdGV4dC54ICs9IFNwcml0ZS5yYW5kKC0xMCwgMTApO1xuXG4gICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICBsZXQgc3BlZWQgPSBTcHJpdGUucmFuZCgxLCAzKTtcblxuICAgICAgU3ByaXRlLlRpY2tlci53aGlsZXMoMTAwLCAobGFzdCkgPT4ge1xuICAgICAgICB0ZXh0LnkgLT0gc3BlZWQ7XG4gICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOa1i+ivleaYr+WQpuatu+S6oVxuICAgICAgdGhpcy5kZWFkKGF0dGFja2VyKTtcblxuICAgIH1cblxuICAgIC8qKiDmkq3mlL7kuIDkuKrliqjnlLsgKi9cbiAgICBwbGF5IChhbmltYXRpb24sIHByaW9yaXR5KSB7XG4gICAgICAvLyDmlrDliqjnlLvpu5jorqTkvJjlhYjnuqfkuLowXG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwcmlvcml0eSkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyDml6DliqjnlLvmiJbogIXlgZzmraLnirbmgIHvvIznjrDmnInkvJjlhYjnuqfkuLotMe+8iOacgOS9jue6p++8iVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmFuaW1hdGlvblByaW9yaXR5ID09IFwidW5kZWZpbmVkXCIgfHwgdGhpcy5zcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Qcmlvcml0eSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuZGF0YS5hbmltYXRpb25zLmhhc093blByb3BlcnR5KGFuaW1hdGlvbikgJiZcbiAgICAgICAgcHJpb3JpdHkgPj0gdGhpcy5hbmltYXRpb25Qcmlvcml0eSAmJlxuICAgICAgICBhbmltYXRpb24gIT0gdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvblxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uUHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgdGhpcy5zcHJpdGUucGxheShhbmltYXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDlgZzmraIgKi9cbiAgICBzdG9wICgpIHtcbiAgICAgIGlmICghdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbikgcmV0dXJuO1xuXG4gICAgICBpZiAoKHRoaXMuc3ByaXRlLnBhdXNlZCAmJiAhdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvZmFjZS8pKVxuICAgICAgICB8fCB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC93YWxrfHJ1bi8pKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNldXBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2Vkb3duXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNlbGVmdFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2VyaWdodFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOWQkeaMh+WummRpcmVjdGlvbuaWueWQkemHiuaUvuS4gOS4quaKgOiDvSAqL1xuICAgIGZpcmUgKGlkLCBkaXJlY3Rpb24pIHtcbiAgICAgIC8vIOWQjOS4gOaXtumXtOWPquiDveaWveWxleS4gOS4qnNraWxsXG4gICAgICBpZiAodGhpcy5hdHRhY2tpbmcpXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tpZF07XG4gICAgICBpZiAoIXNraWxsKVxuICAgICAgICByZXR1cm4gMDtcblxuICAgICAgLy8g5Y+q5pyJ5b2T6L+Z5Liqc2tpbGznmoRjb29sZG93bue7k1xuICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgaWYgKFxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrQ29vbGRvd24pICYmXG4gICAgICAgIChub3cgLSB0aGlzLmxhc3RBdHRhY2spIDwgdGhpcy5sYXN0QXR0YWNrQ29vbGRvd25cbiAgICAgICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNraWxsLmRhdGEuY29zdCA+IHRoaXMuZGF0YS5zcCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICB9XG5cbiAgICAgIGlmICggLy8g546p5a625L2/55So5oqA6IO95piv5Y+v6IO95pyJ5p2h5Lu255qE77yM5L6L5aaC5YmR5oqA6IO96ZyA6KaB6KOF5aSH5YmRXG4gICAgICAgIHRoaXMudHlwZSA9PSBcImhlcm9cIiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbigpID09IGZhbHNlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEF0dGFjayA9IG5vdztcbiAgICAgIHRoaXMubGFzdEF0dGFja0Nvb2xkb3duID0gc2tpbGwuZGF0YS5jb29sZG93bjtcbiAgICAgIHRoaXMuYXR0YWNraW5nID0gdHJ1ZTtcblxuICAgICAgdGhpcy5kYXRhLnNwIC09IHNraWxsLmRhdGEuY29zdDtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuXG4gICAgICBza2lsbC5maXJlKHRoaXMsIGRpcmVjdGlvbiwgKGhpdHRlZCkgPT4ge1xuICAgICAgICB0aGlzLmF0dGFja2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBoaXR0ZWRbMF0uZGFtYWdlKHRoaXMsIHNraWxsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNraWxsLmRhdGEuY29vbGRvd247XG4gICAgfVxuXG4gICAgLyoqIOihjOi1sOWIsOaMh+WumuWcsOeCuSAqL1xuICAgIGdvdG8gKHgsIHksIHN0YXRlLCBjYWxsYmFjaykge1xuXG4gICAgICBpZiAodGhpcy5nb2luZykge1xuICAgICAgICB0aGlzLmdvaW5nTmV4dCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvdG8oeCwgeSwgc3RhdGUsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGVzdEJsb2NrZWQgPSB0aGlzLmNoZWNrQ29sbGlzaW9uKHgsIHkpO1xuXG4gICAgICBpZiAoZGVzdEJsb2NrZWQpIHtcbiAgICAgICAgaWYgKHRoaXMueCA9PSB4KSB7XG4gICAgICAgICAgaWYgKHRoaXMueSAtIHkgPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5mYWNlKFwiZG93blwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSAtIHkgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJ1cFwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy55ID09IHkpIHtcbiAgICAgICAgICBpZiAodGhpcy54IC0geCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJyaWdodFwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueCAtIHggPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJsZWZ0XCIpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcG9zaXRpb25DaG9pY2UgPSBbXTtcbiAgICAgIC8vIOS4iuS4i+W3puWPs1xuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5LTEsIGFmdGVyOiBcImRvd25cIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSsxKSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5KzEsIGFmdGVyOiBcInVwXCJ9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgcG9zaXRpb25DaG9pY2UucHVzaCh7eDogeC0xLCB5OiB5LCBhZnRlcjogXCJyaWdodFwifSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHkpID09IGZhbHNlKSB7XG4gICAgICAgIHBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgrMSwgeTogeSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgcG9zaXRpb25DaG9pY2UpIHsgLy8g6K6h566X5Zyw5Z2A6Led56a7XG4gICAgICAgIGVsZW1lbnQuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlKGVsZW1lbnQueCwgZWxlbWVudC55KTtcbiAgICAgIH1cblxuICAgICAgLy8g5oyJ54Wn5Zyw5Z2A55qE6Led56a75LuO6L+R5Yiw6L+c5o6S5bqP77yI5LuO5bCP5Yiw5aSn77yJXG4gICAgICBwb3NpdGlvbkNob2ljZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyDlpoLmnpznnJ/mraPnmoTnm67nmoTlnLDmnInlj6/og73otbDvvIzmj5LlhaXliLDnrKzkuIDkvY3vvIzlhpnlnKjov5nph4zmmK/lm6DkuLrnm67nmoTlnLDlubbkuI3kuIDlrprmmK9kaXN0YW5jZeacgOWwj+eahFxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgcG9zaXRpb25DaG9pY2Uuc3BsaWNlKDAsIDAsIHt4OiB4LCB5OiB5fSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBsZXQgb3RoZXJDaG9pY2UgPSBmYWxzZTtcblxuICAgICAgbGV0IFRlc3RQb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4IDwgcG9zaXRpb25DaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGRlc3QgPSBwb3NpdGlvbkNob2ljZVtpbmRleF07IC8vIOS/neWtmOesrOS4gOS4qumAiemhuVxuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgR2FtZS5Bc3Rhci5nZXRQYXRoKHt4OiB0aGlzLngsIHk6IHRoaXMueX0sIGRlc3QsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0dGluZ1BhdGggPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdvaW5nTmV4dCkge1xuICAgICAgICAgICAgICBsZXQgYyA9IHRoaXMuZ29pbmdOZXh0O1xuICAgICAgICAgICAgICB0aGlzLmdvaW5nTmV4dCA9IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmdvaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICAgICAgR2FtZS5JbnB1dC5zZXREZXN0KGRlc3QueCwgZGVzdC55KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gbm90IGhlcm9cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDMwKSB7XG4gICAgICAgICAgICAgICAgICAvLyB0b28gZmFyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuZ290b1BhdGgocmVzdWx0LCBzdGF0ZSwgZGVzdC5hZnRlciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUZXN0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3RoZXJDaG9pY2UgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG90aGVyQ2hvaWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBvdGhlclBvc2l0aW9uQ2hvaWNlID0gW107XG4gICAgICAgICAgICAvLyDlm5vkuKrop5JcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgtMSwgeTogeS0xLCBhZnRlcjogXCJyaWdodFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHktMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzEsIHk6IHktMSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LTEsIHkrMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTEsIHk6IHkrMSwgYWZ0ZXI6IFwicmlnaHRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCsxLCB5KzEpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCsxLCB5OiB5KzEsIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5Zub5Liq6L+c5pa55ZCRXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5LTIpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCwgeTogeS0yLCBhZnRlcjogXCJkb3duXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgsIHkrMikgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5KzIsIGFmdGVyOiBcInVwXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMiwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTIsIHk6IHksIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMiwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzIsIHk6IHksIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIG90aGVyUG9zaXRpb25DaG9pY2UpIHsgLy8g6K6h566X5Zyw5Z2A6Led56a7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlKGVsZW1lbnQueCwgZWxlbWVudC55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5oyJ54Wn5Zyw5Z2A55qE6Led56a75LuO6L+R5Yiw6L+c5o6S5bqP77yI5LuO5bCP5Yiw5aSn77yJXG4gICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvdGhlclBvc2l0aW9uQ2hvaWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgIHBvc2l0aW9uQ2hvaWNlID0gb3RoZXJQb3NpdGlvbkNob2ljZTtcbiAgICAgICAgICAgICAgVGVzdFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vIOWGjeasoeWwneivleemu+WcsOeCueacgOi/keeahOWcsOeCuVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gVGVzdFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgZ290b1BhdGggKHBhdGgsIHN0YXRlLCBhZnRlciwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZ29pbmcgPSB0cnVlO1xuICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgIGxldCBXYWxrID0gKCkgPT4ge1xuICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHtcbiAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ29pbmdOZXh0KSB7XG4gICAgICAgICAgbGV0IGMgPSB0aGlzLmdvaW5nTmV4dDtcbiAgICAgICAgICB0aGlzLmdvaW5nTmV4dCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGN1cnJlbnQgPSB7eDogdGhpcy54LCB5OiB0aGlzLnl9O1xuICAgICAgICAgIGxldCBkZXN0ID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgaWYgKGRlc3QueCA9PSBjdXJyZW50LngpIHtcbiAgICAgICAgICAgIGlmIChkZXN0LnkgPiBjdXJyZW50LnkpIHtcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlc3QueSA8IGN1cnJlbnQueSkge1xuICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcInVwXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChkZXN0LnkgPT0gY3VycmVudC55KSB7XG4gICAgICAgICAgICBpZiAoZGVzdC54ID4gY3VycmVudC54KSB7XG4gICAgICAgICAgICAgIGRpcmVjdGlvbiA9IFwicmlnaHRcIlxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXN0LnggPCBjdXJyZW50LngpIHtcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnREaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gIT0gY3VycmVudERpcmVjdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29SZXN1bHQgPSB0aGlzLmdvKHN0YXRlLCBkaXJlY3Rpb24sICgpID0+IFdhbGsoKSk7XG4gICAgICAgICAgICBpZiAoZ29SZXN1bHQgIT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8g5q2j5bi457uT5p2fXG4gICAgICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjZShhZnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgV2FsaygpO1xuICAgIH1cblxuICAgIGZhY2UgKGRpcmVjdGlvbikge1xuICAgICAgbGV0IGFuaW1hdGlvbiA9IFwiZmFjZVwiICsgZGlyZWN0aW9uO1xuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICE9IGFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnNwcml0ZS5wbGF5KGFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlj4LmlbB05Lit6K6w5b2V5LqG5p+Q5Liq5pa55qC855qE5pa55L2NeHnvvIzmtYvor5Xov5nkuKrmlrnmoLzmmK/lkKblkoznjqnlrrbmnInlhrLnqoFcbiAgICAvLyDov5Tlm550cnVl5Li65pyJ56Kw5pKe77yM6L+U5ZueZmFsc2XkuLrml6DnorDmkp5cbiAgICBjaGVja0NvbGxpc2lvbiAoeCwgeSkge1xuICAgICAgLy8g5Zyw5Zu+6L6557yY56Kw5pKeXG4gICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSBHYW1lLmFyZWEubWFwLmRhdGEud2lkdGggfHwgeSA+PSBHYW1lLmFyZWEubWFwLmRhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8g5Zyw5Zu+56Kw5pKeXG4gICAgICBpZiAoR2FtZS5hcmVhLm1hcC5oaXRUZXN0KHgsIHkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyDop5LoibLnorDmkp5cbiAgICAgIGlmIChHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgIGZvciAobGV0IGFjdG9yIG9mIEdhbWUuYXJlYS5hY3RvcnMpIHtcbiAgICAgICAgICBpZiAoYWN0b3IgIT0gdGhpcyAmJiBhY3Rvci5oaXRUZXN0KHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICAgIGlmIChpdGVtLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaGl0QXJlYSAmJiB0aGlzLmRhdGEuaGl0QXJlYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5kYXRhLmhpdEFyZWEpIHtcbiAgICAgICAgICBpZiAoeCA9PSB0aGlzLnggKyBwWzBdICYmIHkgPT0gdGhpcy55ICsgcFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5oaXRUZXN0IGludmFsaWQgZGF0YVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnbyAoc3RhdGUsIGRpcmVjdGlvbiwgY2FsbGJhY2sgPSBudWxsKSB7XG5cbiAgICAgIGlmIChHYW1lLnBhdXNlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIOWmguaenOato+WcqOaImOaWl+WKqOeUu++8jOWImeS4jei1sFxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnNwcml0ZS5wYXVzZWQgPT0gZmFsc2UgJiZcbiAgICAgICAgdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvc2tpbGxjYXN0fHRocnVzdHxzbGFzaHxzaG9vdC8pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy53YWxraW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYXR0YWNraW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9IGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5mYWNlKGRpcmVjdGlvbik7XG4gICAgICAgIC8vIHdhaXQgNCB0aWNrc1xuICAgICAgICBTcHJpdGUuVGlja2VyLmFmdGVyKDQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG5cbiAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKG5ld1Bvc2l0aW9uLngsIG5ld1Bvc2l0aW9uLnkpID09IGZhbHNlKSB7XG4gICAgICAgIC8vIOayoeeisOaSnu+8jOW8gOWni+ihjOi1sFxuICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIOaKiuinkuiJsuS9jee9ruiuvue9ruS4uuaWsOS9jee9ru+8jOS4uuS6huWNoOmihui/meS4quS9jee9ru+8jOi/meagt+WFtuS7luinkuiJsuWwseS8mueisOaSnlxuICAgICAgICAvLyDkvYbmmK/kuI3og73nlKh0aGlzLnggPSBuZXdY6L+Z5qC36K6+572u77yM5Zug5Li6dGhpcy5455qE6K6+572u5Lya5ZCM5pe26K6+572udGhpcy5zcHJpdGUueFxuICAgICAgICBsZXQgb2xkWCA9IHRoaXMuZGF0YS54O1xuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuZGF0YS55O1xuICAgICAgICB0aGlzLmRhdGEueCA9IG5ld1Bvc2l0aW9uLng7XG4gICAgICAgIHRoaXMuZGF0YS55ID0gbmV3UG9zaXRpb24ueTtcblxuICAgICAgICAvLyB3YWxrXG4gICAgICAgIC8vIOi/meS6m+aVsOe7hOWSjOW/hemhu+aYrzMy77yM5Li65LqG5L+d6K+B5LiA5qyhZ2/ooYzotbAzMuS4quWDj+e0oFxuICAgICAgICBsZXQgc3BlZWQgPSBbMywzLDIsMywzLDIsMywzLDIsMywzLDJdOyAvLyDlkozmmK8zMlxuICAgICAgICBpZiAoc3RhdGUgPT0gXCJydW5cIikge1xuICAgICAgICAgIC8vIHNwZWVkID0gWzYsNyw2LDcsNl07IC8vIOWSjOaYrzMyXG4gICAgICAgICAgc3BlZWQgPSBbNCw0LDQsNCw0LDQsNCw0XTsgLy8g5ZKM5pivMzJcbiAgICAgICAgfVxuICAgICAgICAvLyDmr5TpooTorqHlpJrkuIDkuKrvvIzov5nmoLfmmK/kuLrkuobmtYHnlYVcbiAgICAgICAgLy8g5Zug5Li65LiL5LiA5qyhZ2/lj6/og73ntKfmjKjnnYDov5nmrKFcbiAgICAgICAgbGV0IHRpbWVzID0gc3BlZWQubGVuZ3RoICsgMTtcblxuICAgICAgICBsZXQgd2hpbGVzSWQgPSBTcHJpdGUuVGlja2VyLndoaWxlcyh0aW1lcywgKGxhc3QpID0+IHtcbiAgICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS54ID0gb2xkWDtcbiAgICAgICAgICAgIHRoaXMuZGF0YS55ID0gb2xkWTtcbiAgICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgU3ByaXRlLlRpY2tlci5jbGVhcldoaWxlcyh3aGlsZXNJZCk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobGFzdCkge1xuICAgICAgICAgICAgdGhpcy54ID0gbmV3UG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRoaXMueSA9IG5ld1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICB0aGlzLndhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnkgLT0gc3BlZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUueSArPSBzcGVlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS54IC09IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS54ICs9IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5pKt5pS+6KGM6LWw5Yqo55S7XG4gICAgICAgIHRoaXMucGxheShzdGF0ZSArIGRpcmVjdGlvbiwgMSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIOWcqEdhbWUuYWN0b3JMYXllcuS4iuWIoOmZpOS6uueJqSAqL1xuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0aGlzLnNwcml0ZSk7XG4gICAgICBHYW1lLmxheWVycy5pbmZvTGF5ZXIucmVtb3ZlQ2hpbGQocHJpdmF0ZXMuaW5mb0JveCk7XG4gICAgfVxuXG4gICAgLyoqIOWcqEdhbWUuYWN0b3JMYXllcuS4iuaYvuekuuS6uueJqSAqL1xuICAgIGRyYXcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLngpICYmIE51bWJlci5pc0ludGVnZXIodGhpcy55KSkge1xuICAgICAgICB0aGlzLnggPSB0aGlzLmRhdGEueDtcbiAgICAgICAgdGhpcy55ID0gdGhpcy5kYXRhLnk7XG5cbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC54ID0gdGhpcy5zcHJpdGUueDtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC55ID0gdGhpcy5zcHJpdGUueSAtIHRoaXMuc3ByaXRlLmNlbnRlclkgLSAyMDtcblxuICAgICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmFwcGVuZENoaWxkKHRoaXMuc3ByaXRlKTtcbiAgICAgICAgR2FtZS5sYXllcnMuaW5mb0xheWVyLmFwcGVuZENoaWxkKHByaXZhdGVzLmluZm9Cb3gpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEueCwgdGhpcy5kYXRhLnksIHRoaXMuZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZHJhdyBpbnZhbGlkIGRhdGEueC9kYXRhLnlcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOmVnOWktOmbhuS4rSAqL1xuICAgIGZvY3VzICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuaW5mb0JveC54ID0gdGhpcy5zcHJpdGUueDtcbiAgICAgIHByaXZhdGVzLmluZm9Cb3gueSA9IHRoaXMuc3ByaXRlLnkgLSB0aGlzLnNwcml0ZS5jZW50ZXJZIC0gMjA7XG5cbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWCA9IE1hdGgucm91bmQodGhpcy5zcHJpdGUueCAtIEdhbWUuY29uZmlnLndpZHRoIC8gMik7XG4gICAgICBHYW1lLnN0YWdlLmNlbnRlclkgPSBNYXRoLnJvdW5kKHRoaXMuc3ByaXRlLnkgLSBHYW1lLmNvbmZpZy5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgfSk7IC8vIEdhbWUuQWN0b3JcblxufSkoKTtcbiJdfQ==
