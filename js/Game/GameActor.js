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
      key: "popup",
      value: function popup(text) {
        Game.popup(this.sprite, text, 0, -50);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxLQUFLOztpQkFBTCxLQUFLOzthQUVsQixjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxZQUFVLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUIscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOztBQUVsQixnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGdCQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQzNCLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUN0QyxzQkFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM3QyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDbkMsc0JBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDMUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2xDLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDLE1BQU07QUFDTCxxQkFBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLG9CQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7YUFDdkQ7QUFDRCxvQkFBUSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBTTtBQUM1QixxQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25CLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOzs7QUFHVyxhQTdCYSxLQUFLLENBNkJqQixTQUFTLEVBQUU7Ozs0QkE3QkMsS0FBSzs7QUE4QjVCLGlDQTlCdUIsS0FBSyw2Q0E4QnBCO0FBQ1IsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixjQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUVuQixVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLEtBQUssRUFBRTtBQUNwQyxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDNUIsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxFQUFFO0FBQzdDLGNBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUVyRCxnQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakIsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLGVBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pELGNBQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN4QztLQUNGOztpQkFoRHdCLEtBQUs7O2FBa0R6QixjQUFDLE1BQU0sRUFBRTs7O0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7QUFFekIsK0JBQWtCLE1BQU0sOEhBQUU7Z0JBQWpCLEtBQUs7O0FBQ1osZ0JBQUksRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFBLEFBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDOUUscUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxvQkFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO2FBQ3RFO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFDOztBQUVGLFlBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztBQUM1QixnQkFBTSxFQUFFLE1BQU07QUFDZCxlQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDckIsZ0JBQU0sRUFBRSxJQUFJLENBQUMsVUFBVTtBQUN2QixvQkFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzVCLENBQUMsQ0FBQzs7QUFFSCxZQUNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFDOUI7QUFDQSxnQkFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzlCLGdCQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDL0IsTUFBTTtBQUNMLGlCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLGdCQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7O0FBRUQsY0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QixnQkFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXpCLGNBQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDeEIsa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDOUIsa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7U0FDcEQsQ0FBQyxDQUFDOztBQUVILFlBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQ25CLHVCQUFhLEVBQUUsQ0FBQztBQUNoQixjQUFJLGFBQWEsSUFBSSxDQUFDLEVBQUU7QUFDdEIsbUJBQUssU0FBUyxFQUFFLENBQUM7QUFDakIsbUJBQUssVUFBVSxFQUFFLENBQUM7QUFDbEIsbUJBQUssSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztXQUM3QjtTQUNGLENBQUM7OztBQUdGLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGtCQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDMUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQ3JDLHlCQUFhLEVBQUUsQ0FBQzs7QUFFaEIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFNBQVMsRUFBSztBQUMzQyxzQkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0Isc0JBQVEsRUFBRSxDQUFDO2FBQ1osQ0FBQyxDQUFDO1dBRUosQ0FBQyxDQUFDO1NBQ0o7OztBQUdELFlBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGNBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQy9CLHlCQUFhLEVBQUUsQ0FBQztBQUNoQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDbEMsc0JBQVEsRUFBRSxDQUFDO2FBQ1osQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0o7OztBQUdELFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixlQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDOUIsZ0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsZ0JBQUksTUFBTSxFQUFFO0FBQ1YsMkJBQWEsRUFBRSxDQUFDO0FBQ2hCLGtCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNoQyx3QkFBUSxFQUFFLENBQUM7ZUFDWixDQUFDLENBQUM7YUFDSjtXQUNGO1NBQ0Y7OztBQUdELFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGVBQUssSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUM3Qix5QkFBYSxFQUFFLENBQUM7QUFDaEIsZ0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ2hDLHNCQUFRLEVBQUUsQ0FBQzthQUNaLENBQUMsQ0FBQztXQUNKO1NBQ0Y7O0FBRUQsZ0JBQVEsRUFBRSxDQUFDO09BQ1o7OzthQWlESyxlQUFDLElBQUksRUFBRTtBQUNYLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdkM7OzthQUVXLHVCQUFHO0FBQ2IsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixZQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsY0FBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSTtBQUN4QixrQkFBUSxFQUFFLEdBQUc7QUFDYixlQUFLLEVBQUUsT0FBTztBQUNkLGtCQUFRLEVBQUUsRUFBRTtTQUNiLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsWUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7OztBQUdYLGdCQUFRLENBQUMsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUUxQyxZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTs7QUFFaEMsY0FBSSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEMsa0JBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGtCQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNyQixrQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixrQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7OztBQUdmLGNBQUksUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xDLGtCQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN0QixrQkFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDckIsa0JBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2Ysa0JBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVoQixrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLGFBQUMsRUFBRSxDQUFDO0FBQ0osYUFBQyxFQUFFLENBQUM7QUFDSixpQkFBSyxFQUFFLEVBQUU7QUFDVCxrQkFBTSxFQUFFLENBQUM7QUFDVCwwQkFBYyxFQUFFLENBQUM7V0FDbEIsQ0FBQyxDQUFDOztBQUVILGtCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osYUFBQyxFQUFFLENBQUM7QUFDSixhQUFDLEVBQUUsQ0FBQztBQUNKLGlCQUFLLEVBQUUsRUFBRTtBQUNULGtCQUFNLEVBQUUsQ0FBQztBQUNULDBCQUFjLEVBQUUsQ0FBQztXQUNsQixDQUFDLENBQUM7OztBQUdILGtCQUFRLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BDLGtCQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDNUIsa0JBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUMzQixrQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7OztBQUdyQixrQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwQyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQzVCLGtCQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDM0Isa0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixrQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUV0QixrQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQzFCLElBQUksRUFDSixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsQ0FBQyxLQUFLLEVBQ2QsUUFBUSxDQUFDLEtBQUssQ0FDZixDQUFDO1NBQ0g7T0FDRjs7O2FBRVMscUJBQUc7QUFDWCxZQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQy9CLFlBQ0UsSUFBSSxDQUFDLElBQUksSUFDVCxJQUFJLENBQUMsSUFBSSxJQUNULElBQUksQ0FBQyxJQUFJLElBQ1QsSUFBSSxDQUFDLElBQUksSUFDVCxJQUFJLENBQUMsSUFBSSxFQUNUOztBQUVBLGNBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckIsY0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Ozs7OztBQU9yQixjQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGNBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRXhCLGNBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hDLGNBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsY0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDZCxjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7Ozs7OztBQVE5QixjQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkIsY0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztBQUVuQixjQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUMxQixnQkFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUssRUFFOUIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLLEVBRTlCLENBQUMsQ0FBQztXQUNKO1NBQ0Y7T0FDRjs7O2FBK0ZVLHNCQUFHO0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5QixZQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUNwQyxjQUFJLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdEIsY0FBSSxBQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFJLElBQUksRUFDdkMsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUNiLElBQUksQUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBSSxHQUFHLEVBQzNDLE9BQU8sR0FBRyxRQUFRLENBQUM7O0FBRXJCLGtCQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQztBQUMxQixhQUFDLEVBQUUsQ0FBQztBQUNKLGFBQUMsRUFBRSxDQUFDO0FBQ0osaUJBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEFBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUksRUFBRSxDQUFDO0FBQ3RELGtCQUFNLEVBQUUsQ0FBQztBQUNULGdCQUFJLEVBQUUsT0FBTztBQUNiLDBCQUFjLEVBQUUsQ0FBQztXQUNsQixDQUFDLENBQUM7O0FBRUgsa0JBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQzFCLGFBQUMsRUFBRSxDQUFDO0FBQ0osYUFBQyxFQUFFLENBQUM7QUFDSixpQkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBSSxFQUFFLENBQUM7QUFDdEQsa0JBQU0sRUFBRSxDQUFDO0FBQ1QsZ0JBQUksRUFBRSxNQUFNO0FBQ1osMEJBQWMsRUFBRSxDQUFDO1dBQ2xCLENBQUMsQ0FBQztTQUNKO09BQ0Y7OzthQUVRLG9CQUFHO0FBQ1YsWUFBSSxDQUFDLEdBQUcsSUFBSTtZQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdkIsWUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDM0YsV0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixXQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0RyxXQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixXQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekIsZ0JBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtBQUNELFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFNBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFNBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFNBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGVBQU8sQ0FBQyxDQUFDO09BQ1Y7OzthQUVVLG9CQUFDLEtBQUssRUFBRTtBQUNqQixZQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUM7QUFDdEIsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ25COzs7YUFFVSxvQkFBQyxFQUFFLEVBQUU7QUFDZCxZQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDbkIsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ25COzs7YUFFSSxjQUFDLFFBQVEsRUFBRTs7O0FBQ2QsWUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDckIsY0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDNUIsZ0JBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksUUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksU0FBTSxDQUFDO1dBQ3RELE1BQU07OztBQUVMLHFCQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2Isa0JBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxVQUFPLFFBQU0sQ0FBQzs7QUFFOUIsa0JBQUksS0FBSyxHQUFHLE9BQUssSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQzs7QUFFM0Msa0JBQUksQ0FBQyxNQUFNLENBQUMsT0FBSyxDQUFDLEVBQUUsT0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDeEMscUJBQUssSUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO0FBQ3hCLHNCQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3BDLHVCQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzttQkFDcEMsTUFBTTtBQUNMLHVCQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzttQkFDbkM7aUJBQ0Y7ZUFDRixDQUFDLENBQUM7O0FBRUgsc0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssU0FBTyxDQUFDOztXQUVwQztTQUNGO09BQ0Y7Ozs7O2FBR0ssaUJBQUc7OztBQUNQLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN4QixrQkFBVSxDQUFDLFlBQU07QUFDZixpQkFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ1Q7Ozs7O2FBR00sZ0JBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTs7QUFFdkIsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsWUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN4QixZQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOztBQUV0QixZQUFJLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDcEIsWUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDNUIsZUFBSyxHQUFHLEtBQUssQ0FBQztTQUNmOztBQUVELFlBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTtBQUNwQixlQUFLLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDM0IsZUFBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFBO0FBQ3RCLGVBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QixNQUFNOztBQUNMLGVBQUssSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUM1QixlQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDdEIsZUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVCOztBQUVELFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixZQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFlBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOztBQUNuQyxlQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLGNBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDckIsZ0JBQUksRUFBRSxNQUFNO0FBQ1osaUJBQUssRUFBRSxLQUFLO0FBQ1osb0JBQVEsRUFBRSxFQUFFO1dBQ2IsQ0FBQyxDQUFDO1NBQ0osTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFDakQsZUFBSyxHQUFHLFVBQVUsQ0FBQztBQUNuQixlQUFLLElBQUksQ0FBQyxDQUFDO0FBQ1gsY0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztBQUNyQixnQkFBSSxFQUFFLEdBQUcsR0FBRyxLQUFLO0FBQ2pCLGlCQUFLLEVBQUUsS0FBSztBQUNaLG9CQUFRLEVBQUUsRUFBRTtXQUNiLENBQUMsQ0FBQztBQUNILGNBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEIsTUFBTTs7QUFDTCxlQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2QsY0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztBQUNyQixnQkFBSSxFQUFFLEdBQUcsR0FBRyxLQUFLO0FBQ2pCLGlCQUFLLEVBQUUsS0FBSztBQUNaLG9CQUFRLEVBQUUsRUFBRTtXQUNiLENBQUMsQ0FBQztBQUNILGNBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7Ozs7Ozs7Ozs7O0FBV0QsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRXZCLFlBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV6QyxZQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsY0FBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ2xDLGNBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDO0FBQ2hCLGNBQUksSUFBSSxFQUFFO0FBQ1IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUMxQztTQUNGLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUVyQjs7Ozs7YUFHSSxjQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUU7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzlCLGtCQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7OztBQUdELFlBQUksT0FBTyxJQUFJLENBQUMsaUJBQWlCLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtBQUM5RSxjQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDN0I7O0FBRUQsWUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQzlDLFFBQVEsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQ2xDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUN6QztBQUNBLGNBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7QUFDbEMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0I7T0FDRjs7Ozs7YUFHSSxnQkFBRztBQUNOLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLE9BQU87O0FBRTFDLFlBQUksQUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNuRCxrQkFBUSxJQUFJLENBQUMsU0FBUztBQUNwQixpQkFBSyxJQUFJO0FBQ1Asa0JBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNCLG9CQUFNO0FBQUEsQUFDUixpQkFBSyxNQUFNO0FBQ1Qsa0JBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdCLG9CQUFNO0FBQUEsQUFDUixpQkFBSyxNQUFNO0FBQ1Qsa0JBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdCLG9CQUFNO0FBQUEsQUFDUixpQkFBSyxPQUFPO0FBQ1Ysa0JBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlCLG9CQUFNO0FBQUEsV0FDVDtTQUNGO09BQ0Y7Ozs7O2FBR0ksY0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFOzs7O0FBRW5CLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFDaEIsT0FBTyxDQUFDLENBQUM7O0FBRVgsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixZQUFJLENBQUMsS0FBSyxFQUNSLE9BQU8sQ0FBQyxDQUFDOzs7QUFHWCxZQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9CLFlBQ0UsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQ2hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQ3hDLEFBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUksSUFBSSxDQUFDLGtCQUFrQixFQUNqRDtBQUNBLGlCQUFPLENBQUMsQ0FBQztTQUNWOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDbEMsaUJBQU8sQ0FBQyxDQUFDO1NBQ1Y7O0FBRUQsWUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLG1CQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUM1Qjs7QUFFRDtBQUNFLFlBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxJQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxLQUFLLEVBQy9CO0FBQ0EsaUJBQU8sQ0FBQyxDQUFDO1NBQ1Y7O0FBRUQsWUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDdEIsWUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixZQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNoQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWxCLGFBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFDLE1BQU0sRUFBSztBQUN0QyxpQkFBSyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGNBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDckIsa0JBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLFNBQU8sS0FBSyxDQUFDLENBQUM7V0FDL0I7QUFDRCxpQkFBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckIsQ0FBQyxDQUFDOztBQUVILGVBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7T0FDNUI7Ozs7O2FBR0ksY0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7OztBQUUzQixZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxjQUFJLENBQUMsU0FBUyxHQUFHLFlBQU07QUFDckIsbUJBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1dBQ2xDLENBQUM7QUFDRixpQkFBTyxLQUFLLENBQUM7U0FDZDs7QUFFRCxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsWUFBSSxXQUFXLEVBQUU7QUFDZixjQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2YsZ0JBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDcEIsa0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLGtCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xCLGtCQUFJLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUN6QixxQkFBTyxLQUFLLENBQUM7YUFDZCxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQixrQkFBSSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDekIscUJBQU8sS0FBSyxDQUFDO2FBQ2Q7V0FDRixNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdEIsZ0JBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDcEIsa0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLGtCQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25CLGtCQUFJLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUN6QixxQkFBTyxLQUFLLENBQUM7YUFDZCxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixrQkFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQixrQkFBSSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDekIscUJBQU8sS0FBSyxDQUFDO2FBQ2Q7V0FDRjtTQUNGOztBQUVELFlBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQzs7QUFFeEIsWUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ3hDLHdCQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztTQUNwRDtBQUNELFlBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUN4Qyx3QkFBYyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7U0FDbEQ7QUFDRCxZQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDeEMsd0JBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1NBQ3JEO0FBQ0QsWUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ3hDLHdCQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztTQUNwRDs7Ozs7OztBQUVELGdDQUFvQixjQUFjLG1JQUFFO2dCQUEzQixPQUFPOztBQUNkLG1CQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDeEQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELHNCQUFjLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUM1QixpQkFBTyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7U0FDaEMsQ0FBQyxDQUFDOzs7QUFHSCxZQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUN0Qyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUMzQzs7QUFFRCxZQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxZQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7O0FBRXhCLFlBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFTO0FBQ3ZCLGNBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUU7O0FBQ2pDLGtCQUFJLElBQUksR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsbUJBQUssRUFBRSxDQUFDO0FBQ1Isa0JBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxFQUFFLE9BQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFLLENBQUMsRUFBQyxFQUFFLElBQUksRUFBRSxVQUFDLE1BQU0sRUFBSztBQUMzRCx1QkFBSyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLG9CQUFJLE9BQUssU0FBUyxFQUFFO0FBQ2xCLHNCQUFJLENBQUMsR0FBRyxPQUFLLFNBQVMsQ0FBQztBQUN2Qix5QkFBSyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLHlCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsc0JBQUksVUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHdCQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO21CQUN4QjtBQUNELG1CQUFDLEVBQUUsQ0FBQztBQUNKLHlCQUFPLEtBQUssQ0FBQztpQkFDZDtBQUNELG9CQUFJLE9BQUssS0FBSyxFQUFFO0FBQ2QseUJBQU8sS0FBSyxDQUFDO2lCQUNkO0FBQ0Qsb0JBQUksTUFBTSxFQUFFO0FBQ1Ysc0JBQUksVUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHdCQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzttQkFDcEMsTUFBTTs7QUFDTCx3QkFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTs7QUFFdEIsNkJBQU8sS0FBSyxDQUFDO3FCQUNkO21CQUNGO0FBQ0QseUJBQUssUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCx5QkFBTyxJQUFJLENBQUM7aUJBQ2IsTUFBTTtBQUNMLHlCQUFPLFlBQVksRUFBRSxDQUFDO2lCQUN2QjtlQUNGLENBQUMsQ0FBQzs7V0FDSixNQUFNO0FBQ0wsZ0JBQUksV0FBVyxJQUFJLEtBQUssRUFBRTtBQUN4Qix5QkFBVyxHQUFHLElBQUksQ0FBQztBQUNuQixrQkFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7O0FBRTdCLGtCQUFJLE9BQUssY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxtQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztlQUM1RDtBQUNELGtCQUFJLE9BQUssY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxtQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztlQUMzRDtBQUNELGtCQUFJLE9BQUssY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxtQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztlQUM1RDtBQUNELGtCQUFJLE9BQUssY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxtQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztlQUMzRDs7QUFFRCxrQkFBSSxPQUFLLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUN4QyxtQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FB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QUNqRDs7O1dBRWEsZUFBRztBQUNmLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNwRTtXQUVhLGFBQUMsS0FBSyxFQUFFO0FBQ3BCLGNBQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztPQUNsRDs7O1dBRWdCLGVBQUc7QUFDbEIsWUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN0QixnQkFBUSxJQUFJLENBQUMsU0FBUztBQUNwQixlQUFLLElBQUk7QUFDUCxhQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNULGtCQUFNO0FBQUEsQUFDUixlQUFLLE1BQU07QUFDVCxhQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNULGtCQUFNO0FBQUEsQUFDUixlQUFLLE1BQU07QUFDVCxhQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNULGtCQUFNO0FBQUEsQUFDUixlQUFLLE9BQU87QUFDVixhQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNULGtCQUFNO0FBQUEsU0FDVDtBQUNELGVBQU8sQ0FBQyxDQUFDO09BQ1Y7V0FFZ0IsYUFBQyxLQUFLLEVBQUU7QUFDdkIsY0FBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQ3JEOzs7V0E3WndCLEtBQUs7S0FBUyxNQUFNLENBQUMsS0FBSyxFQTBsQ25ELENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLypcbiAgICDop5LoibLnsbvvvIzljIXmi6zmtonlj4rliLBoZXJv5ZKMbnBjXG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3RvclwiLCBjbGFzcyBBY3RvciBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBhY3Rvci8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgYWN0b3JEYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIGFjdG9yRGF0YS5pZCA9IGlkO1xuXG4gICAgICAgICAgbGV0IGFjdG9yT2JqID0gbnVsbDtcbiAgICAgICAgICBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJucGNcIikge1xuICAgICAgICAgICAgYWN0b3JPYmogPSBuZXcgR2FtZS5BY3Rvck5QQyhhY3RvckRhdGEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJtb25zdGVyXCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JNb25zdGVyKGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhY3RvckRhdGEudHlwZSA9PSBcImFsbHlcIikge1xuICAgICAgICAgICAgYWN0b3JPYmogPSBuZXcgR2FtZS5BY3RvckFsbHkoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yRGF0YS50eXBlID09IFwicGV0XCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JQZXQoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihhY3RvckRhdGEudHlwZSwgYWN0b3JEYXRhKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IubG9hZCBpbnZhbGlkIGFjdG9yIHR5cGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFjdG9yT2JqLm9uKFwiY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShhY3Rvck9iaik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG5cbiAgICAgIHByaXZhdGVzLmRhdGEgPSBhY3RvckRhdGE7XG5cbiAgICAgIHRoaXMubWFrZUluZm9Cb3goKTtcblxuICAgICAgaWYgKHRoaXMuZGF0YS5pbWFnZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMuaW5pdCh0aGlzLmRhdGEuaW1hZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5kYXRhLmltYWdlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoXCJhY3Rvci9cIiArIHRoaXMuZGF0YS5pbWFnZSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIGRhdGEgaXMgQXJyYXlcbiAgICAgICAgICB0aGlzLmluaXQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmlkLCB0aGlzLmRhdGEsIHRoaXMuZGF0YS5pbWFnZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgQWN0b3IgSW1hZ2VcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCAoaW1hZ2VzKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBkYXRhID0gcHJpdmF0ZXMuZGF0YTtcblxuICAgICAgZm9yIChsZXQgaW1hZ2Ugb2YgaW1hZ2VzKSB7XG4gICAgICAgIGlmICghKGltYWdlIGluc3RhbmNlb2YgSW1hZ2UpICYmICEoaW1hZ2UuZ2V0Q29udGV4dCAmJiBpbWFnZS5nZXRDb250ZXh0KFwiMmRcIikpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihpbWFnZSwgaW1hZ2VzLCB0aGlzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIGltYWdlLCBub3QgSW1hZ2Ugb3IgQ2FudmFzXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgc3ByaXRlID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgIGltYWdlczogaW1hZ2VzLCAvLyBpbWFnZXMgaXMgQXJyYXlcbiAgICAgICAgd2lkdGg6IGRhdGEudGlsZXdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRhdGEudGlsZWhlaWdodCxcbiAgICAgICAgYW5pbWF0aW9uczogZGF0YS5hbmltYXRpb25zXG4gICAgICB9KTtcblxuICAgICAgaWYgKFxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKGRhdGEuY2VudGVyWCkgJiZcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihkYXRhLmNlbnRlclkpXG4gICAgICApIHtcbiAgICAgICAgc3ByaXRlLmNlbnRlclggPSBkYXRhLmNlbnRlclg7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJZID0gZGF0YS5jZW50ZXJZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IgaW52YWxpZCBjZW50ZXJYL2NlbnRlcllcIik7XG4gICAgICB9XG5cbiAgICAgIHNwcml0ZS5wbGF5KFwiZmFjZWRvd25cIik7XG4gICAgICBwcml2YXRlcy5zcHJpdGUgPSBzcHJpdGU7XG5cbiAgICAgIHNwcml0ZS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIHByaXZhdGVzLmluZm9Cb3gueCA9IHNwcml0ZS54O1xuICAgICAgICBwcml2YXRlcy5pbmZvQm94LnkgPSBzcHJpdGUueSAtIHNwcml0ZS5jZW50ZXJZIC0gMjBcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgY29tcGxldGVDb3VudCA9IC0xO1xuICAgICAgbGV0IENvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICBjb21wbGV0ZUNvdW50Kys7XG4gICAgICAgIGlmIChjb21wbGV0ZUNvdW50ID49IDApIHtcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZSgpO1xuICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyDliqDovb1OUEPlj6/og73mnInnmoTku7vliqFcbiAgICAgIGlmIChkYXRhLnF1ZXN0KSB7XG4gICAgICAgIHByaXZhdGVzLnF1ZXN0ID0gW107XG4gICAgICAgIHByaXZhdGVzLnF1ZXN0Lmxlbmd0aCA9IGRhdGEucXVlc3QubGVuZ3RoO1xuICAgICAgICBkYXRhLnF1ZXN0LmZvckVhY2goKHF1ZXN0SWQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuXG4gICAgICAgICAgR2FtZS5RdWVzdC5sb2FkKHF1ZXN0SWQpLnRoZW4oKHF1ZXN0RGF0YSkgPT4ge1xuICAgICAgICAgICAgcHJpdmF0ZXMucXVlc3QucHVzaChxdWVzdERhdGEpO1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp5oqA6IO9XG4gICAgICBpZiAoZGF0YS5za2lsbHMpIHtcbiAgICAgICAgZGF0YS5za2lsbHMuZm9yRWFjaCgoc2tpbGxJZCkgPT4ge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICBHYW1lLlNraWxsLmxvYWQoc2tpbGxJZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp6KOF5aSH77yI5pqC5pe25Y+q5pyJ546p5a6277yJXG4gICAgICBpZiAoZGF0YS5lcXVpcG1lbnQpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEuZXF1aXBtZW50KSB7XG4gICAgICAgICAgbGV0IGl0ZW1JZCA9IGRhdGEuZXF1aXBtZW50W2tleV07XG4gICAgICAgICAgaWYgKGl0ZW1JZCkge1xuICAgICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuICAgICAgICAgICAgR2FtZS5JdGVtLmxvYWQoaXRlbUlkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDliqDovb3kurrniannianlk4FcbiAgICAgIGlmIChkYXRhLml0ZW1zKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW1JZCBpbiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuICAgICAgICAgIEdhbWUuSXRlbS5sb2FkKGl0ZW1JZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIENvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGRhdGEgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEuaWQ7XG4gICAgfVxuXG4gICAgc2V0IGlkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5pZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgdHlwZSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS50eXBlO1xuICAgIH1cblxuICAgIHNldCB0eXBlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci50eXBlIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBzcHJpdGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuc3ByaXRlO1xuICAgIH1cblxuICAgIHNldCBzcHJpdGUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLnNwcml0ZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcXVlc3QgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMucXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzLnF1ZXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHF1ZXN0ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5xdWVzdHMgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgcG9wdXAgKHRleHQpIHtcbiAgICAgIEdhbWUucG9wdXAodGhpcy5zcHJpdGUsIHRleHQsIDAsIC01MCk7XG4gICAgfVxuXG4gICAgbWFrZUluZm9Cb3ggKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvLyDlkI3lrZdcbiAgICAgIGxldCB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgdGV4dDogcHJpdmF0ZXMuZGF0YS5uYW1lLFxuICAgICAgICBtYXhXaWR0aDogMjAwLFxuICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICBmb250U2l6ZTogMTJcbiAgICAgIH0pO1xuICAgICAgdGV4dC5jZW50ZXJZID0gTWF0aC5mbG9vcih0ZXh0LmhlaWdodCAvIDIpO1xuICAgICAgdGV4dC5jZW50ZXJYID0gTWF0aC5mbG9vcih0ZXh0LndpZHRoIC8gMik7XG4gICAgICB0ZXh0LnggPSAwO1xuICAgICAgdGV4dC55ID0gMDtcblxuICAgICAgLy8g5LiA5Liq5LiK6Z2i5Zub5Liq57K+56We5p2h44CB6KGA5p2h55qE6IGa5ZCI77yM57uf5LiA566h55CG5pS+5YWl6L+Z5LiqQ29udGFpbmVyXG4gICAgICBwcml2YXRlcy5pbmZvQm94ID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEudHlwZSAhPSBcImhlcm9cIikge1xuICAgICAgICAvLyDooYDmnaHlpJbpnaLnmoTpu5HmoYZcbiAgICAgICAgbGV0IGhwYmFyQm94ID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBocGJhckJveC5jZW50ZXJYID0gMTU7XG4gICAgICAgIGhwYmFyQm94LmNlbnRlclkgPSAyO1xuICAgICAgICBocGJhckJveC54ID0gMDtcbiAgICAgICAgaHBiYXJCb3gueSA9IDk7XG5cbiAgICAgICAgLy8g6a2U5rOV5p2h5aSW6Z2i55qE6buR5qGGXG4gICAgICAgIGxldCBtcGJhckJveCA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgbXBiYXJCb3guY2VudGVyWCA9IDE1O1xuICAgICAgICBtcGJhckJveC5jZW50ZXJZID0gMjtcbiAgICAgICAgbXBiYXJCb3gueCA9IDA7XG4gICAgICAgIG1wYmFyQm94LnkgPSAxMjtcblxuICAgICAgICBocGJhckJveC5yZWN0KHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1wYmFyQm94LnJlY3Qoe1xuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeTogMCxcbiAgICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g55Sf5ZG95p2hXG4gICAgICAgIHByaXZhdGVzLmhwYmFyID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBwcml2YXRlcy5ocGJhci5jZW50ZXJYID0gMTU7XG4gICAgICAgIHByaXZhdGVzLmhwYmFyLmNlbnRlclkgPSAyO1xuICAgICAgICBwcml2YXRlcy5ocGJhci54ID0gMDtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIueSA9IDk7XG5cbiAgICAgICAgLy8g57K+5Yqb5p2hXG4gICAgICAgIHByaXZhdGVzLm1wYmFyID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBwcml2YXRlcy5tcGJhci5jZW50ZXJYID0gMTU7XG4gICAgICAgIHByaXZhdGVzLm1wYmFyLmNlbnRlclkgPSAyO1xuICAgICAgICBwcml2YXRlcy5tcGJhci54ID0gMDtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIueSA9IDEyO1xuXG4gICAgICAgIHByaXZhdGVzLmluZm9Cb3guYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgdGV4dCxcbiAgICAgICAgICBocGJhckJveCxcbiAgICAgICAgICBtcGJhckJveCxcbiAgICAgICAgICBwcml2YXRlcy5ocGJhcixcbiAgICAgICAgICBwcml2YXRlcy5tcGJhclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSAoKSB7XG4gICAgICBsZXQgZGF0YSA9IGludGVybmFsKHRoaXMpLmRhdGE7XG4gICAgICBpZiAoXG4gICAgICAgIGRhdGEuJHN0ciAmJlxuICAgICAgICBkYXRhLiRkZXggJiZcbiAgICAgICAgZGF0YS4kY29uICYmXG4gICAgICAgIGRhdGEuJGludCAmJlxuICAgICAgICBkYXRhLiRjaGFcbiAgICAgICkge1xuXG4gICAgICAgIGRhdGEuc3RyID0gZGF0YS4kc3RyO1xuICAgICAgICBkYXRhLmRleCA9IGRhdGEuJGRleDtcbiAgICAgICAgZGF0YS5jb24gPSBkYXRhLiRjb247XG4gICAgICAgIGRhdGEuaW50ID0gZGF0YS4kaW50O1xuICAgICAgICBkYXRhLmNoYSA9IGRhdGEuJGNoYTtcblxuICAgICAgICAvLyDnhLblkI7lj6/ku6Xpkojlr7nkuIDnuqflsZ7mgKforqHnrpdidWZmXG5cblxuICAgICAgICAvLyDorqHnrpflrozkuIDnuqflsZ7mgKfnmoRidWZm5LmL5ZCO77yM5byA5aeL6K6h566X5LqM57qn5bGe5oCnXG5cbiAgICAgICAgZGF0YS4kaHAgPSBkYXRhLmNvbiAqIDU7XG4gICAgICAgIGRhdGEuJHNwID0gZGF0YS5pbnQgKiA1O1xuXG4gICAgICAgIGRhdGEuYXRrID0gTWF0aC5mbG9vcihkYXRhLnN0ciAqIDAuMjUpO1xuICAgICAgICBkYXRhLm1hdGsgPSBNYXRoLmZsb29yKGRhdGEuaW50ICogMC4yNSk7XG4gICAgICAgIGRhdGEuZGVmID0gMDtcbiAgICAgICAgZGF0YS5tZGVmID0gMDtcbiAgICAgICAgZGF0YS5jcml0aWNhbCA9IGRhdGEuZGV4ICogMC4wMDU7XG4gICAgICAgIGRhdGEuZG9kZ2UgPSBkYXRhLmRleCAqIDAuMDA1O1xuXG4gICAgICAgIC8vIOeEtuWQjuWPr+S7peWvueS6jOe6p+WxnuaAp+iuoeeul2J1ZmZcblxuXG5cbiAgICAgICAgLy8g5a+55LqM57qn5bGe5oCn6K6h566X5a6MYnVmZuS5i+WQju+8jOWPr+S7peiuoeeul+S8muWPmOWKqOeahOWAvFxuICAgICAgICAvLyDkvovlpoIuJGhw5pivYnVmZuS5i+WQjueahOeUn+WRveWAvOS4iumZkO+8jC5ocOaYr+W9k+WJjeeUn+WRveWAvFxuICAgICAgICBkYXRhLmhwID0gZGF0YS4kaHA7XG4gICAgICAgIGRhdGEuc3AgPSBkYXRhLiRzcDtcblxuICAgICAgICBpZiAoZGF0YS5idWZmICYmIGRhdGEubmVyZikge1xuICAgICAgICAgIGRhdGEuYnVmZi5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXRhLm5lcmYuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgeCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLng7XG4gICAgfVxuXG4gICAgc2V0IHggKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmRhdGEueCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNwcml0ZS54ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgaW50ZXJuYWwodGhpcyksIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIHgsIHggaGFzIHRvIGJlIGEgbnVtYmVyIGFuZCBpbnRlZ2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCB5ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEueTtcbiAgICB9XG5cbiAgICBzZXQgeSAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmIE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuZGF0YS55ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuc3ByaXRlLnkgPSB2YWx1ZSAqIDMyICsgMTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCBpbnRlcm5hbCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IgZ290IGludmFsaWQgeSwgeSBoYXMgdG8gYmUgYSBudW1iZXIgYW5kIGludGVnZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHZpc2libGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0IHZpc2libGUgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNwcml0ZS52aXNpYmxlID0gdmFsdWU7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnZpc2libGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlLmFscGhhO1xuICAgIH1cblxuICAgIHNldCBhbHBoYSAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gMSkge1xuICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IHZhbHVlO1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LmFscGhhID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5hbHBoYSBnb3QgaW52YWxpZCB2YWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogdGhpcy54LFxuICAgICAgICB5OiB0aGlzLnlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IHBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5wb3NpdGlvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgZGlyZWN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC91cHxsZWZ0fGRvd258cmlnaHQvKVswXTtcbiAgICB9XG5cbiAgICBzZXQgZGlyZWN0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5kaXJlY3Rpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGZhY2VQb3NpdGlvbiAoKSB7XG4gICAgICBsZXQgcCA9IHRoaXMucG9zaXRpb247XG4gICAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgIHAueSAtPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgIHAueSArPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgIHAueCAtPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICBwLnggKz0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIHNldCBmYWNlUG9zaXRpb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmZhY2VQb3NpdGlvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZXMuaHBiYXIgJiYgcHJpdmF0ZXMubXBiYXIpIHtcbiAgICAgICAgbGV0IGhwY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgIGlmICgodGhpcy5kYXRhLmhwIC8gdGhpcy5kYXRhLiRocCkgPCAwLjI1KVxuICAgICAgICAgIGhwY29sb3IgPSBcInJlZFwiO1xuICAgICAgICBlbHNlIGlmICgodGhpcy5kYXRhLmhwIC8gdGhpcy5kYXRhLiRocCkgPCAwLjUpXG4gICAgICAgICAgaHBjb2xvciA9IFwieWVsbG93XCI7XG5cbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIuY2xlYXIoKS5yZWN0KHtcbiAgICAgICAgICB4OiAxLFxuICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApICogMjgpLFxuICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICBmaWxsOiBocGNvbG9yLFxuICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJpdmF0ZXMubXBiYXIuY2xlYXIoKS5yZWN0KHtcbiAgICAgICAgICB4OiAxLFxuICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoKHRoaXMuZGF0YS5zcCAvIHRoaXMuZGF0YS4kc3ApICogMjgpLFxuICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICBmaWxsOiBcImJsdWVcIixcbiAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc3RhbmNlICgpIHtcbiAgICAgIGxldCB4ID0gbnVsbCwgeSA9IG51bGw7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMF0pICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMV0pKSB7XG4gICAgICAgIHggPSBhcmd1bWVudHNbMF07XG4gICAgICAgIHkgPSBhcmd1bWVudHNbMV07XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdLngpICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMF0ueSkpIHtcbiAgICAgICAgeCA9IGFyZ3VtZW50c1swXS54O1xuICAgICAgICB5ID0gYXJndW1lbnRzWzBdLnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGFyZ3VtZW50cyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGlzdGFuY2UgSW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG4gICAgICBsZXQgZCA9IDA7XG4gICAgICBkICs9IE1hdGgucG93KHRoaXMueCAtIHgsIDIpO1xuICAgICAgZCArPSBNYXRoLnBvdyh0aGlzLnkgLSB5LCAyKTtcbiAgICAgIGQgPSBNYXRoLnNxcnQoZCk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG5cbiAgICBkZWNyZWFzZUhQIChwb3dlcikge1xuICAgICAgdGhpcy5kYXRhLmhwIC09IHBvd2VyO1xuICAgICAgdGhpcy5yZWZyZXNoQmFyKCk7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VTUCAoc3ApIHtcbiAgICAgIHRoaXMuZGF0YS5zcCAtPSBzcDtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgIH1cblxuICAgIGRlYWQgKGF0dGFja2VyKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmhwIDw9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS50eXBlID09IFwiaGVyb1wiKSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLm92ZXIub3Blbihg5L2g6KKrJHthdHRhY2tlci5kYXRhLm5hbWV95omT5q275LqGYCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmVyYXNlKCk7XG4gICAgICAgICAgR2FtZS5hcmVhLmFjdG9ycy5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLmRhdGEuaXRlbXMgfHwgeyBnb2xkOiAxIH07XG5cbiAgICAgICAgICBHYW1lLmFkZEJhZyh0aGlzLnggLHRoaXMueSkudGhlbigoYmFnKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtSWQgaW4gaXRlbXMpIHtcbiAgICAgICAgICAgICAgaWYgKGJhZy5pbm5lci5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICAgICAgICAgICAgYmFnLmlubmVyW2l0ZW1JZF0gKz0gaXRlbXNbaXRlbUlkXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWcuaW5uZXJbaXRlbUlkXSA9IGl0ZW1zW2l0ZW1JZF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGF0dGFja2VyLmVtaXQoXCJraWxsXCIsIGZhbHNlLCB0aGlzKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOmXquS4gOmXquS6uueJqe+8jOS+i+Wmguiiq+WHu+S4reaXtueahOaViOaenCAqL1xuICAgIGZsYXNoICgpIHtcbiAgICAgIHRoaXMuc3ByaXRlLmFscGhhID0gMC41O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFscGhhID0gMTtcbiAgICAgIH0sIDIwMCk7XG4gICAgfVxuXG4gICAgLyoqIOWPl+WIsGF0dGFja2Vy55qEc2tpbGzmioDog73nmoTkvKTlrrMgKi9cbiAgICBkYW1hZ2UgKGF0dGFja2VyLCBza2lsbCkge1xuXG4gICAgICB0aGlzLmVtaXQoXCJkYW1hZ2VkXCIpO1xuXG4gICAgICBsZXQgcG93ZXIgPSBza2lsbC5wb3dlcjtcbiAgICAgIGxldCB0eXBlID0gc2tpbGwudHlwZTtcblxuICAgICAgbGV0IGNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgaWYgKHRoaXMuZGF0YS50eXBlID09IFwiaGVyb1wiKSB7XG4gICAgICAgIGNvbG9yID0gXCJyZWRcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT0gXCJub3JtYWxcIikge1xuICAgICAgICBwb3dlciArPSBhdHRhY2tlci5kYXRhLmF0aztcbiAgICAgICAgcG93ZXIgLT0gdGhpcy5kYXRhLmRlZlxuICAgICAgICBwb3dlciA9IE1hdGgubWF4KDAsIHBvd2VyKTtcbiAgICAgIH0gZWxzZSB7IC8vIHR5cGUgPT0gbWFnaWNcbiAgICAgICAgcG93ZXIgKz0gYXR0YWNrZXIuZGF0YS5tYXRrO1xuICAgICAgICBwb3dlciAtIHRoaXMuZGF0YS5tZGVmXG4gICAgICAgIHBvd2VyID0gTWF0aC5tYXgoMCwgcG93ZXIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dCA9IG51bGw7XG4gICAgICBsZXQgc3RhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IHRoaXMuZGF0YS5kb2RnZSkgeyAvLyDpl6rpgb/kuoZcbiAgICAgICAgc3RhdGUgPSBcImRvZGdlXCI7XG4gICAgICAgIHRleHQgPSBuZXcgU3ByaXRlLlRleHQoe1xuICAgICAgICAgIHRleHQ6IFwibWlzc1wiLFxuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBmb250U2l6ZTogMTZcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKE1hdGgucmFuZG9tKCkgPCBhdHRhY2tlci5kYXRhLmNyaXRpY2FsKSB7IC8vIOmHjeWHu+S6hlxuICAgICAgICBzdGF0ZSA9IFwiY3JpdGljYWxcIjtcbiAgICAgICAgcG93ZXIgKj0gMjtcbiAgICAgICAgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgdGV4dDogXCItXCIgKyBwb3dlcixcbiAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IDMyXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZsYXNoKCk7XG4gICAgICAgIHRoaXMuZGVjcmVhc2VIUChwb3dlcik7XG4gICAgICB9IGVsc2UgeyAvLyDmma7pgJrlh7vkuK1cbiAgICAgICAgc3RhdGUgPSBcImhpdFwiO1xuICAgICAgICB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgICB0ZXh0OiBcIi1cIiArIHBvd2VyLFxuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBmb250U2l6ZTogMTZcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmxhc2goKTtcbiAgICAgICAgdGhpcy5kZWNyZWFzZUhQKHBvd2VyKTtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgIGlmIChzdGF0ZSAhPSBcImRvZGdlXCIgJiYgdGhpcyAhPSBHYW1lLmhlcm8pIHtcbiAgICAgICAgaWYgKEdhbWUuc291bmRzLmh1cnQpIHtcbiAgICAgICAgICBHYW1lLnNvdW5kcy5odXJ0LmxvYWQoKTtcbiAgICAgICAgICBHYW1lLnNvdW5kcy5odXJ0LnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKi9cblxuICAgICAgdGV4dC5jZW50ZXJYID0gTWF0aC5mbG9vcih0ZXh0LndpZHRoIC8gMik7XG4gICAgICB0ZXh0LmNlbnRlclkgPSBNYXRoLmZsb29yKHRleHQuaGVpZ2h0KTtcbiAgICAgIHRleHQueCA9IHRoaXMuc3ByaXRlLng7XG4gICAgICB0ZXh0LnkgPSB0aGlzLnNwcml0ZS55O1xuXG4gICAgICB0ZXh0LnggKz0gU3ByaXRlLnJhbmQoLTEwLCAxMCk7XG5cbiAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgICAgIGxldCBzcGVlZCA9IFNwcml0ZS5yYW5kKDEsIDMpO1xuXG4gICAgICBTcHJpdGUuVGlja2VyLndoaWxlcygxMDAsIChsYXN0KSA9PiB7XG4gICAgICAgIHRleHQueSAtPSBzcGVlZDtcbiAgICAgICAgaWYgKGxhc3QpIHtcbiAgICAgICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLnJlbW92ZUNoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g5rWL6K+V5piv5ZCm5q275LqhXG4gICAgICB0aGlzLmRlYWQoYXR0YWNrZXIpO1xuXG4gICAgfVxuXG4gICAgLyoqIOaSreaUvuS4gOS4quWKqOeUuyAqL1xuICAgIHBsYXkgKGFuaW1hdGlvbiwgcHJpb3JpdHkpIHtcbiAgICAgIC8vIOaWsOWKqOeUu+m7mOiupOS8mOWFiOe6p+S4ujBcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHByaW9yaXR5KSkge1xuICAgICAgICBwcmlvcml0eSA9IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIOaXoOWKqOeUu+aIluiAheWBnOatoueKtuaAge+8jOeOsOacieS8mOWFiOe6p+S4ui0x77yI5pyA5L2O57qn77yJXG4gICAgICBpZiAodHlwZW9mIHRoaXMuYW5pbWF0aW9uUHJpb3JpdHkgPT0gXCJ1bmRlZmluZWRcIiB8fCB0aGlzLnNwcml0ZS5wYXVzZWQgPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvblByaW9yaXR5ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5kYXRhLmFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoYW5pbWF0aW9uKSAmJlxuICAgICAgICBwcmlvcml0eSA+PSB0aGlzLmFuaW1hdGlvblByaW9yaXR5ICYmXG4gICAgICAgIGFuaW1hdGlvbiAhPSB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Qcmlvcml0eSA9IHByaW9yaXR5O1xuICAgICAgICB0aGlzLnNwcml0ZS5wbGF5KGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOWBnOatoiAqL1xuICAgIHN0b3AgKCkge1xuICAgICAgaWYgKCF0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uKSByZXR1cm47XG5cbiAgICAgIGlmICgodGhpcy5zcHJpdGUucGF1c2VkICYmICF0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC9mYWNlLykpXG4gICAgICAgIHx8IHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24ubWF0Y2goL3dhbGt8cnVuLykpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2V1cFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5wbGF5KFwiZmFjZWRvd25cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2VsZWZ0XCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5wbGF5KFwiZmFjZXJpZ2h0XCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5ZCR5oyH5a6aZGlyZWN0aW9u5pa55ZCR6YeK5pS+5LiA5Liq5oqA6IO9ICovXG4gICAgZmlyZSAoaWQsIGRpcmVjdGlvbikge1xuICAgICAgLy8g5ZCM5LiA5pe26Ze05Y+q6IO95pa95bGV5LiA5Liqc2tpbGxcbiAgICAgIGlmICh0aGlzLmF0dGFja2luZylcbiAgICAgICAgcmV0dXJuIDA7XG5cbiAgICAgIGxldCBza2lsbCA9IEdhbWUuc2tpbGxzW2lkXTtcbiAgICAgIGlmICghc2tpbGwpXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgICAvLyDlj6rmnInlvZPov5nkuKpza2lsbOeahGNvb2xkb3du57uTXG4gICAgICBsZXQgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICBpZiAoXG4gICAgICAgIE51bWJlci5pc0Zpbml0ZSh0aGlzLmxhc3RBdHRhY2spICYmXG4gICAgICAgIE51bWJlci5pc0Zpbml0ZSh0aGlzLmxhc3RBdHRhY2tDb29sZG93bikgJiZcbiAgICAgICAgKG5vdyAtIHRoaXMubGFzdEF0dGFjaykgPCB0aGlzLmxhc3RBdHRhY2tDb29sZG93blxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2tpbGwuZGF0YS5jb3N0ID4gdGhpcy5kYXRhLnNwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRpcmVjdGlvbikge1xuICAgICAgICBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKCAvLyDnjqnlrrbkvb/nlKjmioDog73mmK/lj6/og73mnInmnaHku7bnmoTvvIzkvovlpoLliZHmioDog73pnIDopoHoo4XlpIfliZFcbiAgICAgICAgdGhpcy50eXBlID09IFwiaGVyb1wiICYmXG4gICAgICAgIHNraWxsLmRhdGEuY29uZGl0aW9uICYmXG4gICAgICAgIHNraWxsLmRhdGEuY29uZGl0aW9uKCkgPT0gZmFsc2VcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0QXR0YWNrID0gbm93O1xuICAgICAgdGhpcy5sYXN0QXR0YWNrQ29vbGRvd24gPSBza2lsbC5kYXRhLmNvb2xkb3duO1xuICAgICAgdGhpcy5hdHRhY2tpbmcgPSB0cnVlO1xuXG4gICAgICB0aGlzLmRhdGEuc3AgLT0gc2tpbGwuZGF0YS5jb3N0O1xuICAgICAgdGhpcy5yZWZyZXNoQmFyKCk7XG5cbiAgICAgIHNraWxsLmZpcmUodGhpcywgZGlyZWN0aW9uLCAoaGl0dGVkKSA9PiB7XG4gICAgICAgIHRoaXMuYXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChoaXR0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGhpdHRlZFswXS5kYW1hZ2UodGhpcywgc2tpbGwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2tpbGwuZGF0YS5jb29sZG93bjtcbiAgICB9XG5cbiAgICAvKiog6KGM6LWw5Yiw5oyH5a6a5Zyw54K5ICovXG4gICAgZ290byAoeCwgeSwgc3RhdGUsIGNhbGxiYWNrKSB7XG5cbiAgICAgIGlmICh0aGlzLmdvaW5nKSB7XG4gICAgICAgIHRoaXMuZ29pbmdOZXh0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ290byh4LCB5LCBzdGF0ZSwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGxldCBkZXN0QmxvY2tlZCA9IHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSk7XG5cbiAgICAgIGlmIChkZXN0QmxvY2tlZCkge1xuICAgICAgICBpZiAodGhpcy54ID09IHgpIHtcbiAgICAgICAgICBpZiAodGhpcy55IC0geSA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJkb3duXCIpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy55IC0geSA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjZShcInVwXCIpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnkgPT0geSkge1xuICAgICAgICAgIGlmICh0aGlzLnggLSB4ID09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjZShcInJpZ2h0XCIpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy54IC0geCA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjZShcImxlZnRcIik7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBwb3NpdGlvbkNob2ljZSA9IFtdO1xuICAgICAgLy8g5LiK5LiL5bem5Y+zXG4gICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5LTEpID09IGZhbHNlKSB7XG4gICAgICAgIHBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgsIHk6IHktMSwgYWZ0ZXI6IFwiZG93blwifSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5KzEpID09IGZhbHNlKSB7XG4gICAgICAgIHBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgsIHk6IHkrMSwgYWZ0ZXI6IFwidXBcIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeC0xLCB5KSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTEsIHk6IHksIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMSwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgcG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCsxLCB5OiB5LCBhZnRlcjogXCJsZWZ0XCJ9KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBwb3NpdGlvbkNob2ljZSkgeyAvLyDorqHnrpflnLDlnYDot53nprtcbiAgICAgICAgZWxlbWVudC5kaXN0YW5jZSA9IHRoaXMuZGlzdGFuY2UoZWxlbWVudC54LCBlbGVtZW50LnkpO1xuICAgICAgfVxuXG4gICAgICAvLyDmjInnhaflnLDlnYDnmoTot53nprvku47ov5HliLDov5zmjpLluo/vvIjku47lsI/liLDlpKfvvIlcbiAgICAgIHBvc2l0aW9uQ2hvaWNlLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIOWmguaenOecn+ato+eahOebrueahOWcsOacieWPr+iDvei1sO+8jOaPkuWFpeWIsOesrOS4gOS9je+8jOWGmeWcqOi/memHjOaYr+WboOS4uuebrueahOWcsOW5tuS4jeS4gOWumuaYr2Rpc3RhbmNl5pyA5bCP55qEXG4gICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5KSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5zcGxpY2UoMCwgMCwge3g6IHgsIHk6IHl9KTtcbiAgICAgIH1cblxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGxldCBvdGhlckNob2ljZSA9IGZhbHNlO1xuXG4gICAgICBsZXQgVGVzdFBvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPCBwb3NpdGlvbkNob2ljZS5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgZGVzdCA9IHBvc2l0aW9uQ2hvaWNlW2luZGV4XTsgLy8g5L+d5a2Y56ys5LiA5Liq6YCJ6aG5XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICBHYW1lLkFzdGFyLmdldFBhdGgoe3g6IHRoaXMueCwgeTogdGhpcy55fSwgZGVzdCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXR0aW5nUGF0aCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ29pbmdOZXh0KSB7XG4gICAgICAgICAgICAgIGxldCBjID0gdGhpcy5nb2luZ05leHQ7XG4gICAgICAgICAgICAgIHRoaXMuZ29pbmdOZXh0ID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICBpZiAodGhpcyA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGMoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ29pbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICBpZiAodGhpcyA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICAgICAgICBHYW1lLklucHV0LnNldERlc3QoZGVzdC54LCBkZXN0LnkpO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBub3QgaGVyb1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMzApIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRvbyBmYXJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5nb3RvUGF0aChyZXN1bHQsIHN0YXRlLCBkZXN0LmFmdGVyLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRlc3RQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvdGhlckNob2ljZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgb3RoZXJDaG9pY2UgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IG90aGVyUG9zaXRpb25DaG9pY2UgPSBbXTtcbiAgICAgICAgICAgIC8vIOWbm+S4quinklxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeC0xLCB5LTEpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeC0xLCB5OiB5LTEsIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMSwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgrMSwgeTogeS0xLCBhZnRlcjogXCJsZWZ0XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeSsxKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgtMSwgeTogeSsxLCBhZnRlcjogXCJyaWdodFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHkrMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzEsIHk6IHkrMSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDlm5vkuKrov5zmlrnlkJFcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgsIHktMikgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5LTIsIGFmdGVyOiBcImRvd25cIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSsyKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgsIHk6IHkrMiwgYWZ0ZXI6IFwidXBcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeC0yLCB5KSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgtMiwgeTogeSwgYWZ0ZXI6IFwicmlnaHRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCsyLCB5KSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgrMiwgeTogeSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2Ygb3RoZXJQb3NpdGlvbkNob2ljZSkgeyAvLyDorqHnrpflnLDlnYDot53nprtcbiAgICAgICAgICAgICAgZWxlbWVudC5kaXN0YW5jZSA9IHRoaXMuZGlzdGFuY2UoZWxlbWVudC54LCBlbGVtZW50LnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmjInnhaflnLDlnYDnmoTot53nprvku47ov5HliLDov5zmjpLluo/vvIjku47lsI/liLDlpKfvvIlcbiAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2Uuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG90aGVyUG9zaXRpb25DaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgcG9zaXRpb25DaG9pY2UgPSBvdGhlclBvc2l0aW9uQ2hvaWNlO1xuICAgICAgICAgICAgICBUZXN0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8g5YaN5qyh5bCd6K+V56a75Zyw54K55pyA6L+R55qE5Zyw54K5XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBUZXN0UG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICBnb3RvUGF0aCAocGF0aCwgc3RhdGUsIGFmdGVyLCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5nb2luZyA9IHRydWU7XG4gICAgICBsZXQgaW5kZXggPSAxO1xuICAgICAgbGV0IFdhbGsgPSAoKSA9PiB7XG4gICAgICAgIGlmIChHYW1lLnBhdXNlZCkge1xuICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZiAodGhpcyA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICAgIEdhbWUuSW5wdXQuY2xlYXJEZXN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nb2luZ05leHQpIHtcbiAgICAgICAgICBsZXQgYyA9IHRoaXMuZ29pbmdOZXh0O1xuICAgICAgICAgIHRoaXMuZ29pbmdOZXh0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4IDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgY3VycmVudCA9IHt4OiB0aGlzLngsIHk6IHRoaXMueX07XG4gICAgICAgICAgbGV0IGRlc3QgPSBwYXRoW2luZGV4XTtcbiAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICBpZiAoZGVzdC54ID09IGN1cnJlbnQueCkge1xuICAgICAgICAgICAgaWYgKGRlc3QueSA+IGN1cnJlbnQueSkge1xuICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcImRvd25cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdC55IDwgY3VycmVudC55KSB7XG4gICAgICAgICAgICAgIGRpcmVjdGlvbiA9IFwidXBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGRlc3QueSA9PSBjdXJyZW50LnkpIHtcbiAgICAgICAgICAgIGlmIChkZXN0LnggPiBjdXJyZW50LngpIHtcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJyaWdodFwiXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlc3QueCA8IGN1cnJlbnQueCkge1xuICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcImxlZnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudERpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAhPSBjdXJyZW50RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgICB0aGlzLmZhY2UoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBnb1Jlc3VsdCA9IHRoaXMuZ28oc3RhdGUsIGRpcmVjdGlvbiwgKCkgPT4gV2FsaygpKTtcbiAgICAgICAgICAgIGlmIChnb1Jlc3VsdCAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyDmraPluLjnu5PmnZ9cbiAgICAgICAgICBpZiAoYWZ0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5mYWNlKGFmdGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBXYWxrKCk7XG4gICAgfVxuXG4gICAgZmFjZSAoZGlyZWN0aW9uKSB7XG4gICAgICBsZXQgYW5pbWF0aW9uID0gXCJmYWNlXCIgKyBkaXJlY3Rpb247XG4gICAgICBpZiAodGhpcy5hbmltYXRpb24gIT0gYW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoYW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWPguaVsHTkuK3orrDlvZXkuobmn5DkuKrmlrnmoLznmoTmlrnkvY14ee+8jOa1i+ivlei/meS4quaWueagvOaYr+WQpuWSjOeOqeWutuacieWGsueqgVxuICAgIC8vIOi/lOWbnnRydWXkuLrmnInnorDmkp7vvIzov5Tlm55mYWxzZeS4uuaXoOeisOaSnlxuICAgIGNoZWNrQ29sbGlzaW9uICh4LCB5KSB7XG4gICAgICAvLyDlnLDlm77ovrnnvJjnorDmkp5cbiAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IEdhbWUuYXJlYS5tYXAuZGF0YS53aWR0aCB8fCB5ID49IEdhbWUuYXJlYS5tYXAuZGF0YS5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICAvLyDlnLDlm77norDmkp5cbiAgICAgIGlmIChHYW1lLmFyZWEubWFwLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIOinkuiJsueisOaSnlxuICAgICAgaWYgKEdhbWUuYXJlYS5hY3RvcnMpIHtcbiAgICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAgIGlmIChhY3RvciAhPSB0aGlzICYmIGFjdG9yLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoR2FtZS5hcmVhLml0ZW1zKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgR2FtZS5hcmVhLml0ZW1zKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uaGl0VGVzdCh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5oaXRBcmVhICYmIHRoaXMuZGF0YS5oaXRBcmVhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgZm9yIChsZXQgcCBvZiB0aGlzLmRhdGEuaGl0QXJlYSkge1xuICAgICAgICAgIGlmICh4ID09IHRoaXMueCArIHBbMF0gJiYgeSA9PSB0aGlzLnkgKyBwWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmhpdFRlc3QgaW52YWxpZCBkYXRhXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdvIChzdGF0ZSwgZGlyZWN0aW9uLCBjYWxsYmFjayA9IG51bGwpIHtcblxuICAgICAgaWYgKEdhbWUucGF1c2VkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8g5aaC5p6c5q2j5Zyo5oiY5paX5Yqo55S777yM5YiZ5LiN6LWwXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3ByaXRlLnBhdXNlZCA9PSBmYWxzZSAmJlxuICAgICAgICB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC9za2lsbGNhc3R8dGhydXN0fHNsYXNofHNob290LylcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLndhbGtpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hdHRhY2tpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gIT0gZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMud2Fsa2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLmZhY2UoZGlyZWN0aW9uKTtcbiAgICAgICAgLy8gd2FpdCA0IHRpY2tzXG4gICAgICAgIFNwcml0ZS5UaWNrZXIuYWZ0ZXIoNCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3UG9zaXRpb24gPSB0aGlzLmZhY2VQb3NpdGlvbjtcblxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24obmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSkgPT0gZmFsc2UpIHtcbiAgICAgICAgLy8g5rKh56Kw5pKe77yM5byA5aeL6KGM6LWwXG4gICAgICAgIHRoaXMud2Fsa2luZyA9IHRydWU7XG5cbiAgICAgICAgLy8g5oqK6KeS6Imy5L2N572u6K6+572u5Li65paw5L2N572u77yM5Li65LqG5Y2g6aKG6L+Z5Liq5L2N572u77yM6L+Z5qC35YW25LuW6KeS6Imy5bCx5Lya56Kw5pKeXG4gICAgICAgIC8vIOS9huaYr+S4jeiDveeUqHRoaXMueCA9IG5ld1jov5nmoLforr7nva7vvIzlm6DkuLp0aGlzLnjnmoTorr7nva7kvJrlkIzml7borr7nva50aGlzLnNwcml0ZS54XG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5kYXRhLng7XG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5kYXRhLnk7XG4gICAgICAgIHRoaXMuZGF0YS54ID0gbmV3UG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5kYXRhLnkgPSBuZXdQb3NpdGlvbi55O1xuXG4gICAgICAgIC8vIHdhbGtcbiAgICAgICAgLy8g6L+Z5Lqb5pWw57uE5ZKM5b+F6aG75pivMzLvvIzkuLrkuobkv53or4HkuIDmrKFnb+ihjOi1sDMy5Liq5YOP57SgXG4gICAgICAgIGxldCBzcGVlZCA9IFszLDMsMiwzLDMsMiwzLDMsMiwzLDMsMl07IC8vIOWSjOaYrzMyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBcInJ1blwiKSB7XG4gICAgICAgICAgLy8gc3BlZWQgPSBbNiw3LDYsNyw2XTsgLy8g5ZKM5pivMzJcbiAgICAgICAgICBzcGVlZCA9IFs0LDQsNCw0LDQsNCw0LDRdOyAvLyDlkozmmK8zMlxuICAgICAgICB9XG4gICAgICAgIC8vIOavlOmihOiuoeWkmuS4gOS4qu+8jOi/meagt+aYr+S4uuS6hua1geeVhVxuICAgICAgICAvLyDlm6DkuLrkuIvkuIDmrKFnb+WPr+iDvee0p+aMqOedgOi/measoVxuICAgICAgICBsZXQgdGltZXMgPSBzcGVlZC5sZW5ndGggKyAxO1xuXG4gICAgICAgIGxldCB3aGlsZXNJZCA9IFNwcml0ZS5UaWNrZXIud2hpbGVzKHRpbWVzLCAobGFzdCkgPT4ge1xuICAgICAgICAgIGlmIChHYW1lLnBhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLnggPSBvbGRYO1xuICAgICAgICAgICAgdGhpcy5kYXRhLnkgPSBvbGRZO1xuICAgICAgICAgICAgdGhpcy53YWxraW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICBTcHJpdGUuVGlja2VyLmNsZWFyV2hpbGVzKHdoaWxlc0lkKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICB0aGlzLnggPSBuZXdQb3NpdGlvbi54O1xuICAgICAgICAgICAgdGhpcy55ID0gbmV3UG9zaXRpb24ueTtcbiAgICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUueSAtPSBzcGVlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS55ICs9IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnggLT0gc3BlZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnggKz0gc3BlZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDmkq3mlL7ooYzotbDliqjnlLtcbiAgICAgICAgdGhpcy5wbGF5KHN0YXRlICsgZGlyZWN0aW9uLCAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiog5ZyoR2FtZS5hY3RvckxheWVy5LiK5Yig6Zmk5Lq654mpICovXG4gICAgZXJhc2UgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLnJlbW92ZUNoaWxkKHRoaXMuc3ByaXRlKTtcbiAgICAgIEdhbWUubGF5ZXJzLmluZm9MYXllci5yZW1vdmVDaGlsZChwcml2YXRlcy5pbmZvQm94KTtcbiAgICB9XG5cbiAgICAvKiog5ZyoR2FtZS5hY3RvckxheWVy5LiK5pi+56S65Lq654mpICovXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHRoaXMueCkgJiYgTnVtYmVyLmlzSW50ZWdlcih0aGlzLnkpKSB7XG4gICAgICAgIHRoaXMueCA9IHRoaXMuZGF0YS54O1xuICAgICAgICB0aGlzLnkgPSB0aGlzLmRhdGEueTtcblxuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnkgPSB0aGlzLnNwcml0ZS55IC0gdGhpcy5zcHJpdGUuY2VudGVyWSAtIDIwO1xuXG4gICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuYXBwZW5kQ2hpbGQodGhpcy5zcHJpdGUpO1xuICAgICAgICBHYW1lLmxheWVycy5pbmZvTGF5ZXIuYXBwZW5kQ2hpbGQocHJpdmF0ZXMuaW5mb0JveCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YS54LCB0aGlzLmRhdGEueSwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5kcmF3IGludmFsaWQgZGF0YS54L2RhdGEueVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog6ZWc5aS06ZuG5LitICovXG4gICAgZm9jdXMgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5pbmZvQm94LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgcHJpdmF0ZXMuaW5mb0JveC55ID0gdGhpcy5zcHJpdGUueSAtIHRoaXMuc3ByaXRlLmNlbnRlclkgLSAyMDtcblxuICAgICAgR2FtZS5zdGFnZS5jZW50ZXJYID0gTWF0aC5yb3VuZCh0aGlzLnNwcml0ZS54IC0gR2FtZS5jb25maWcud2lkdGggLyAyKTtcbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWSA9IE1hdGgucm91bmQodGhpcy5zcHJpdGUueSAtIEdhbWUuY29uZmlnLmhlaWdodCAvIDIpO1xuICAgIH1cblxuICB9KTsgLy8gR2FtZS5BY3RvclxuXG59KSgpO1xuIl19
