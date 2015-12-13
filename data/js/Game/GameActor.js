"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      _classCallCheck(this, Actor);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Actor).call(this));

      var privates = internal(_this);

      privates.data = actorData;

      _this.makeInfoBox();

      if (_this.data.image instanceof Array) {
        _this.init(_this.data.image);
      } else if (typeof _this.data.image == "string") {
        Sprite.load("actor/" + _this.data.image).then(function (data) {
          // data is Array
          _this.init(data);
        });
      } else {
        console.error(_this.id, _this.data, _this.data.image, _this);
        throw new Error("Invalid Actor Image");
      }
      return _this;
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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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
              Game.area.actors.delete(_this3);

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
        Sprite.Ticker.after(10, function () {
          _this4.sprite.alpha = 1;
        });
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

        if (state != "dodge" && this != Game.hero) {
          if (Game.sounds.hurt) {
            Game.sounds.hurt.load();
            Game.sounds.hurt.volume = 0.2;
            Game.sounds.hurt.play();
          }
        }

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

        if (this.going) {
          this.going = false;
        }

        Game.Input.clearDest();

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
      value: function goto(x, y, state) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {

          if (_this6.going) {
            _this6.goingNext = function () {
              _this6.goto(x, y, state).then(resolve);
            };
            return false;
          }

          var destBlocked = _this6.checkCollision(x, y);

          if (destBlocked) {
            if (_this6.x == x) {
              if (_this6.y - y == -1) {
                _this6.stop();
                _this6.face("down");
                resolve();
                return false;
              } else if (_this6.y - y == 1) {
                _this6.stop();
                _this6.face("up");
                resolve();
                return false;
              }
            } else if (_this6.y == y) {
              if (_this6.x - x == -1) {
                _this6.stop();
                _this6.face("right");
                resolve();
                return false;
              } else if (_this6.x - x == 1) {
                _this6.stop();
                _this6.face("left");
                resolve();
                return false;
              }
            }
          }

          var positionChoice = [];
          // 上下左右
          if (_this6.checkCollision(x, y - 1) == false) {
            positionChoice.push({ x: x, y: y - 1, after: "down" });
          }
          if (_this6.checkCollision(x, y + 1) == false) {
            positionChoice.push({ x: x, y: y + 1, after: "up" });
          }
          if (_this6.checkCollision(x - 1, y) == false) {
            positionChoice.push({ x: x - 1, y: y, after: "right" });
          }
          if (_this6.checkCollision(x + 1, y) == false) {
            positionChoice.push({ x: x + 1, y: y, after: "left" });
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = positionChoice[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;
              // 计算地址距离
              element.distance = _this6.distance(element.x, element.y);
            }

            // 按照地址的距离从近到远排序（从小到大）
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
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
          if (_this6.checkCollision(x, y) == false) {
            positionChoice.splice(0, 0, { x: x, y: y });
          }

          var index = 0;
          var otherChoice = false;

          var TestPosition = function TestPosition() {
            if (index < positionChoice.length) {
              (function () {
                var dest = positionChoice[index]; // 保存第一个选项
                index++;
                Game.Astar.getPath({ x: _this6.x, y: _this6.y }, dest).then(function (result) {
                  _this6.gettingPath = false;
                  if (_this6.goingNext) {
                    var c = _this6.goingNext;
                    _this6.goingNext = null;
                    _this6.going = false;
                    if (_this6 == Game.hero) {
                      Game.Input.clearDest();
                    }
                    c();
                    return;
                  }
                  if (_this6.going) {
                    return;
                  }
                  if (result) {
                    if (_this6 == Game.hero) {
                      Game.Input.setDest(dest.x, dest.y);
                    } else {
                      // not hero
                      if (result.length > 30) {
                        // too far
                        return;
                      }
                    }
                    _this6.gotoPath(result, state, dest.after).then(resolve);
                    return;
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
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                      _iterator3.return();
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
        });
      }

      /**
       * 按照指定的path和state行走
       * 行走结束后如果after有定义，则面向after的方向
       */

    }, {
      key: "gotoPath",
      value: function gotoPath(path, state, after) {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
          _this7.going = true;
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
                _this7.go(state, direction).then(function () {
                  Walk();
                });
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
              resolve();
            }
          };
          Walk();
        });
      }

      /**
       * 让人物面向某个direction
       */

    }, {
      key: "face",
      value: function face(direction) {
        var animation = "face" + direction;
        if (this.animation != animation) {
          this.sprite.play(animation);
          this.emit("change");
        }
      }

      /**
       * 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
       * 返回true为有碰撞，返回false为无碰撞
       */

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
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }

        // 地图上的物品碰撞
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
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
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

      /**
       * 测试人物碰撞
       */
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
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
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

      /**
       * 用state的姿态（walk，run）向direction方向走
       * 如果人物现在不是direction方向的，优先转头
       */

    }, {
      key: "go",
      value: function go(state, direction) {
        var _this8 = this;

        return new Promise(function (resolve, reject) {
          if (Game.paused) {
            return;
          }

          // 如果正在战斗动画，则不走
          if (_this8.sprite.paused == false && _this8.sprite.currentAnimation.match(/skillcast|thrust|slash|shoot/)) {
            return;
          }

          if (_this8.walking) {
            return;
          }

          if (_this8.attacking) {
            return;
          }

          if (_this8.direction != direction) {
            _this8.walking = true;
            _this8.stop();
            _this8.face(direction);
            // wait 4 ticks
            Sprite.Ticker.after(4, function () {
              _this8.walking = false;
            });
            return;
          }

          var newPosition = _this8.facePosition;

          if (_this8.checkCollision(newPosition.x, newPosition.y) == false) {
            (function () {
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

              var whilesId = Sprite.Ticker.whiles(speed.length, function (last) {
                if (Game.paused) {
                  _this8.data.x = oldX;
                  _this8.data.y = oldY;
                  _this8.walking = false;
                  _this8.emit("change");
                  Sprite.Ticker.clearWhiles(whilesId);
                  resolve();
                  return;
                }
                if (last) {
                  _this8.x = newPosition.x;
                  _this8.y = newPosition.y;
                  _this8.walking = false;
                  _this8.emit("change");
                  resolve();
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
            })();
          }
        });
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

      /** 镜头移动到中心为这个人物 */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7Ozs7QUFBQyxBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxLQUFLOztpQkFBTCxLQUFLOzsyQkFFakIsRUFBRSxFQUFFO0FBQ2YsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsZ0JBQU0sQ0FBQyxJQUFJLFlBQVUsRUFBRSxTQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ2pELGdCQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxQixxQkFBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWxCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsZ0JBQUksU0FBUyxDQUFDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDM0Isc0JBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDekMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFO0FBQ3RDLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzdDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUNuQyxzQkFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMxQyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDbEMsc0JBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FB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QyxDQUFDLENBQUMsQ0FBQztPQUNwRTt3QkFFYyxLQUFLLEVBQUU7QUFDcEIsY0FBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO09BQ2xEOzs7MEJBRW1CO0FBQ2xCLFlBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDdEIsZ0JBQVEsSUFBSSxDQUFDLFNBQVM7QUFDcEIsZUFBSyxJQUFJO0FBQ1AsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1YsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLFNBQ1Q7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWO3dCQUVpQixLQUFLLEVBQUU7QUFDdkIsY0FBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQ3JEOzs7V0E3WndCLEtBQUs7S0FBUyxNQUFNLENBQUMsS0FBSyxFQTJtQ25EO0NBRUgsQ0FBQSxFQUFHLENBQUM7QUFGQSIsImZpbGUiOiJHYW1lQWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLypcbiAgICDop5LoibLnsbvvvIzljIXmi6zmtonlj4rliLBoZXJv5ZKMbnBjXG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3RvclwiLCBjbGFzcyBBY3RvciBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBhY3Rvci8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgYWN0b3JEYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIGFjdG9yRGF0YS5pZCA9IGlkO1xuXG4gICAgICAgICAgbGV0IGFjdG9yT2JqID0gbnVsbDtcbiAgICAgICAgICBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJucGNcIikge1xuICAgICAgICAgICAgYWN0b3JPYmogPSBuZXcgR2FtZS5BY3Rvck5QQyhhY3RvckRhdGEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJtb25zdGVyXCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JNb25zdGVyKGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhY3RvckRhdGEudHlwZSA9PSBcImFsbHlcIikge1xuICAgICAgICAgICAgYWN0b3JPYmogPSBuZXcgR2FtZS5BY3RvckFsbHkoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yRGF0YS50eXBlID09IFwicGV0XCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JQZXQoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihhY3RvckRhdGEudHlwZSwgYWN0b3JEYXRhKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IubG9hZCBpbnZhbGlkIGFjdG9yIHR5cGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFjdG9yT2JqLm9uKFwiY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShhY3Rvck9iaik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG5cbiAgICAgIHByaXZhdGVzLmRhdGEgPSBhY3RvckRhdGE7XG5cbiAgICAgIHRoaXMubWFrZUluZm9Cb3goKTtcblxuICAgICAgaWYgKHRoaXMuZGF0YS5pbWFnZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMuaW5pdCh0aGlzLmRhdGEuaW1hZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5kYXRhLmltYWdlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoXCJhY3Rvci9cIiArIHRoaXMuZGF0YS5pbWFnZSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIGRhdGEgaXMgQXJyYXlcbiAgICAgICAgICB0aGlzLmluaXQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmlkLCB0aGlzLmRhdGEsIHRoaXMuZGF0YS5pbWFnZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgQWN0b3IgSW1hZ2VcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCAoaW1hZ2VzKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBkYXRhID0gcHJpdmF0ZXMuZGF0YTtcblxuICAgICAgZm9yIChsZXQgaW1hZ2Ugb2YgaW1hZ2VzKSB7XG4gICAgICAgIGlmICghKGltYWdlIGluc3RhbmNlb2YgSW1hZ2UpICYmICEoaW1hZ2UuZ2V0Q29udGV4dCAmJiBpbWFnZS5nZXRDb250ZXh0KFwiMmRcIikpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihpbWFnZSwgaW1hZ2VzLCB0aGlzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIGltYWdlLCBub3QgSW1hZ2Ugb3IgQ2FudmFzXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgc3ByaXRlID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgIGltYWdlczogaW1hZ2VzLCAvLyBpbWFnZXMgaXMgQXJyYXlcbiAgICAgICAgd2lkdGg6IGRhdGEudGlsZXdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRhdGEudGlsZWhlaWdodCxcbiAgICAgICAgYW5pbWF0aW9uczogZGF0YS5hbmltYXRpb25zXG4gICAgICB9KTtcblxuICAgICAgaWYgKFxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKGRhdGEuY2VudGVyWCkgJiZcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihkYXRhLmNlbnRlclkpXG4gICAgICApIHtcbiAgICAgICAgc3ByaXRlLmNlbnRlclggPSBkYXRhLmNlbnRlclg7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJZID0gZGF0YS5jZW50ZXJZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IgaW52YWxpZCBjZW50ZXJYL2NlbnRlcllcIik7XG4gICAgICB9XG5cbiAgICAgIHNwcml0ZS5wbGF5KFwiZmFjZWRvd25cIik7XG4gICAgICBwcml2YXRlcy5zcHJpdGUgPSBzcHJpdGU7XG5cbiAgICAgIHNwcml0ZS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIHByaXZhdGVzLmluZm9Cb3gueCA9IHNwcml0ZS54O1xuICAgICAgICBwcml2YXRlcy5pbmZvQm94LnkgPSBzcHJpdGUueSAtIHNwcml0ZS5jZW50ZXJZIC0gMjBcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgY29tcGxldGVDb3VudCA9IC0xO1xuICAgICAgbGV0IENvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICBjb21wbGV0ZUNvdW50Kys7XG4gICAgICAgIGlmIChjb21wbGV0ZUNvdW50ID49IDApIHtcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZSgpO1xuICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyDliqDovb1OUEPlj6/og73mnInnmoTku7vliqFcbiAgICAgIGlmIChkYXRhLnF1ZXN0KSB7XG4gICAgICAgIHByaXZhdGVzLnF1ZXN0ID0gW107XG4gICAgICAgIHByaXZhdGVzLnF1ZXN0Lmxlbmd0aCA9IGRhdGEucXVlc3QubGVuZ3RoO1xuICAgICAgICBkYXRhLnF1ZXN0LmZvckVhY2goKHF1ZXN0SWQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuXG4gICAgICAgICAgR2FtZS5RdWVzdC5sb2FkKHF1ZXN0SWQpLnRoZW4oKHF1ZXN0RGF0YSkgPT4ge1xuICAgICAgICAgICAgcHJpdmF0ZXMucXVlc3QucHVzaChxdWVzdERhdGEpO1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp5oqA6IO9XG4gICAgICBpZiAoZGF0YS5za2lsbHMpIHtcbiAgICAgICAgZGF0YS5za2lsbHMuZm9yRWFjaCgoc2tpbGxJZCkgPT4ge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICBHYW1lLlNraWxsLmxvYWQoc2tpbGxJZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp6KOF5aSH77yI5pqC5pe25Y+q5pyJ546p5a6277yJXG4gICAgICBpZiAoZGF0YS5lcXVpcG1lbnQpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEuZXF1aXBtZW50KSB7XG4gICAgICAgICAgbGV0IGl0ZW1JZCA9IGRhdGEuZXF1aXBtZW50W2tleV07XG4gICAgICAgICAgaWYgKGl0ZW1JZCkge1xuICAgICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuICAgICAgICAgICAgR2FtZS5JdGVtLmxvYWQoaXRlbUlkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDliqDovb3kurrniannianlk4FcbiAgICAgIGlmIChkYXRhLml0ZW1zKSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW1JZCBpbiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgY29tcGxldGVDb3VudC0tO1xuICAgICAgICAgIEdhbWUuSXRlbS5sb2FkKGl0ZW1JZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIENvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGRhdGEgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEuaWQ7XG4gICAgfVxuXG4gICAgc2V0IGlkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5pZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgdHlwZSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS50eXBlO1xuICAgIH1cblxuICAgIHNldCB0eXBlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci50eXBlIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBzcHJpdGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuc3ByaXRlO1xuICAgIH1cblxuICAgIHNldCBzcHJpdGUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLnNwcml0ZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcXVlc3QgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMucXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzLnF1ZXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHF1ZXN0ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5xdWVzdHMgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgcG9wdXAgKHRleHQpIHtcbiAgICAgIEdhbWUucG9wdXAodGhpcy5zcHJpdGUsIHRleHQsIDAsIC01MCk7XG4gICAgfVxuXG4gICAgbWFrZUluZm9Cb3ggKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvLyDlkI3lrZdcbiAgICAgIGxldCB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgdGV4dDogcHJpdmF0ZXMuZGF0YS5uYW1lLFxuICAgICAgICBtYXhXaWR0aDogMjAwLFxuICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICBmb250U2l6ZTogMTJcbiAgICAgIH0pO1xuICAgICAgdGV4dC5jZW50ZXJZID0gTWF0aC5mbG9vcih0ZXh0LmhlaWdodCAvIDIpO1xuICAgICAgdGV4dC5jZW50ZXJYID0gTWF0aC5mbG9vcih0ZXh0LndpZHRoIC8gMik7XG4gICAgICB0ZXh0LnggPSAwO1xuICAgICAgdGV4dC55ID0gMDtcblxuICAgICAgLy8g5LiA5Liq5LiK6Z2i5Zub5Liq57K+56We5p2h44CB6KGA5p2h55qE6IGa5ZCI77yM57uf5LiA566h55CG5pS+5YWl6L+Z5LiqQ29udGFpbmVyXG4gICAgICBwcml2YXRlcy5pbmZvQm94ID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEudHlwZSAhPSBcImhlcm9cIikge1xuICAgICAgICAvLyDooYDmnaHlpJbpnaLnmoTpu5HmoYZcbiAgICAgICAgbGV0IGhwYmFyQm94ID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBocGJhckJveC5jZW50ZXJYID0gMTU7XG4gICAgICAgIGhwYmFyQm94LmNlbnRlclkgPSAyO1xuICAgICAgICBocGJhckJveC54ID0gMDtcbiAgICAgICAgaHBiYXJCb3gueSA9IDk7XG5cbiAgICAgICAgLy8g6a2U5rOV5p2h5aSW6Z2i55qE6buR5qGGXG4gICAgICAgIGxldCBtcGJhckJveCA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgbXBiYXJCb3guY2VudGVyWCA9IDE1O1xuICAgICAgICBtcGJhckJveC5jZW50ZXJZID0gMjtcbiAgICAgICAgbXBiYXJCb3gueCA9IDA7XG4gICAgICAgIG1wYmFyQm94LnkgPSAxMjtcblxuICAgICAgICBocGJhckJveC5yZWN0KHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1wYmFyQm94LnJlY3Qoe1xuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeTogMCxcbiAgICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g55Sf5ZG95p2hXG4gICAgICAgIHByaXZhdGVzLmhwYmFyID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBwcml2YXRlcy5ocGJhci5jZW50ZXJYID0gMTU7XG4gICAgICAgIHByaXZhdGVzLmhwYmFyLmNlbnRlclkgPSAyO1xuICAgICAgICBwcml2YXRlcy5ocGJhci54ID0gMDtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIueSA9IDk7XG5cbiAgICAgICAgLy8g57K+5Yqb5p2hXG4gICAgICAgIHByaXZhdGVzLm1wYmFyID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgICBwcml2YXRlcy5tcGJhci5jZW50ZXJYID0gMTU7XG4gICAgICAgIHByaXZhdGVzLm1wYmFyLmNlbnRlclkgPSAyO1xuICAgICAgICBwcml2YXRlcy5tcGJhci54ID0gMDtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIueSA9IDEyO1xuXG4gICAgICAgIHByaXZhdGVzLmluZm9Cb3guYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgdGV4dCxcbiAgICAgICAgICBocGJhckJveCxcbiAgICAgICAgICBtcGJhckJveCxcbiAgICAgICAgICBwcml2YXRlcy5ocGJhcixcbiAgICAgICAgICBwcml2YXRlcy5tcGJhclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSAoKSB7XG4gICAgICBsZXQgZGF0YSA9IGludGVybmFsKHRoaXMpLmRhdGE7XG4gICAgICBpZiAoXG4gICAgICAgIGRhdGEuJHN0ciAmJlxuICAgICAgICBkYXRhLiRkZXggJiZcbiAgICAgICAgZGF0YS4kY29uICYmXG4gICAgICAgIGRhdGEuJGludCAmJlxuICAgICAgICBkYXRhLiRjaGFcbiAgICAgICkge1xuXG4gICAgICAgIGRhdGEuc3RyID0gZGF0YS4kc3RyO1xuICAgICAgICBkYXRhLmRleCA9IGRhdGEuJGRleDtcbiAgICAgICAgZGF0YS5jb24gPSBkYXRhLiRjb247XG4gICAgICAgIGRhdGEuaW50ID0gZGF0YS4kaW50O1xuICAgICAgICBkYXRhLmNoYSA9IGRhdGEuJGNoYTtcblxuICAgICAgICAvLyDnhLblkI7lj6/ku6Xpkojlr7nkuIDnuqflsZ7mgKforqHnrpdidWZmXG5cblxuICAgICAgICAvLyDorqHnrpflrozkuIDnuqflsZ7mgKfnmoRidWZm5LmL5ZCO77yM5byA5aeL6K6h566X5LqM57qn5bGe5oCnXG5cbiAgICAgICAgZGF0YS4kaHAgPSBkYXRhLmNvbiAqIDU7XG4gICAgICAgIGRhdGEuJHNwID0gZGF0YS5pbnQgKiA1O1xuXG4gICAgICAgIGRhdGEuYXRrID0gTWF0aC5mbG9vcihkYXRhLnN0ciAqIDAuMjUpO1xuICAgICAgICBkYXRhLm1hdGsgPSBNYXRoLmZsb29yKGRhdGEuaW50ICogMC4yNSk7XG4gICAgICAgIGRhdGEuZGVmID0gMDtcbiAgICAgICAgZGF0YS5tZGVmID0gMDtcbiAgICAgICAgZGF0YS5jcml0aWNhbCA9IGRhdGEuZGV4ICogMC4wMDU7XG4gICAgICAgIGRhdGEuZG9kZ2UgPSBkYXRhLmRleCAqIDAuMDA1O1xuXG4gICAgICAgIC8vIOeEtuWQjuWPr+S7peWvueS6jOe6p+WxnuaAp+iuoeeul2J1ZmZcblxuXG5cbiAgICAgICAgLy8g5a+55LqM57qn5bGe5oCn6K6h566X5a6MYnVmZuS5i+WQju+8jOWPr+S7peiuoeeul+S8muWPmOWKqOeahOWAvFxuICAgICAgICAvLyDkvovlpoIuJGhw5pivYnVmZuS5i+WQjueahOeUn+WRveWAvOS4iumZkO+8jC5ocOaYr+W9k+WJjeeUn+WRveWAvFxuICAgICAgICBkYXRhLmhwID0gZGF0YS4kaHA7XG4gICAgICAgIGRhdGEuc3AgPSBkYXRhLiRzcDtcblxuICAgICAgICBpZiAoZGF0YS5idWZmICYmIGRhdGEubmVyZikge1xuICAgICAgICAgIGRhdGEuYnVmZi5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXRhLm5lcmYuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgeCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLng7XG4gICAgfVxuXG4gICAgc2V0IHggKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmRhdGEueCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNwcml0ZS54ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgaW50ZXJuYWwodGhpcyksIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIHgsIHggaGFzIHRvIGJlIGEgbnVtYmVyIGFuZCBpbnRlZ2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCB5ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEueTtcbiAgICB9XG5cbiAgICBzZXQgeSAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmIE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuZGF0YS55ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuc3ByaXRlLnkgPSB2YWx1ZSAqIDMyICsgMTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCBpbnRlcm5hbCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IgZ290IGludmFsaWQgeSwgeSBoYXMgdG8gYmUgYSBudW1iZXIgYW5kIGludGVnZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHZpc2libGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0IHZpc2libGUgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNwcml0ZS52aXNpYmxlID0gdmFsdWU7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnZpc2libGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlLmFscGhhO1xuICAgIH1cblxuICAgIHNldCBhbHBoYSAodmFsdWUpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gMSkge1xuICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IHZhbHVlO1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LmFscGhhID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5hbHBoYSBnb3QgaW52YWxpZCB2YWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogdGhpcy54LFxuICAgICAgICB5OiB0aGlzLnlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IHBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5wb3NpdGlvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgZGlyZWN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC91cHxsZWZ0fGRvd258cmlnaHQvKVswXTtcbiAgICB9XG5cbiAgICBzZXQgZGlyZWN0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5kaXJlY3Rpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGZhY2VQb3NpdGlvbiAoKSB7XG4gICAgICBsZXQgcCA9IHRoaXMucG9zaXRpb247XG4gICAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgIHAueSAtPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgIHAueSArPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgIHAueCAtPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICBwLnggKz0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIHNldCBmYWNlUG9zaXRpb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmZhY2VQb3NpdGlvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZXMuaHBiYXIgJiYgcHJpdmF0ZXMubXBiYXIpIHtcbiAgICAgICAgbGV0IGhwY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgIGlmICgodGhpcy5kYXRhLmhwIC8gdGhpcy5kYXRhLiRocCkgPCAwLjI1KVxuICAgICAgICAgIGhwY29sb3IgPSBcInJlZFwiO1xuICAgICAgICBlbHNlIGlmICgodGhpcy5kYXRhLmhwIC8gdGhpcy5kYXRhLiRocCkgPCAwLjUpXG4gICAgICAgICAgaHBjb2xvciA9IFwieWVsbG93XCI7XG5cbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIuY2xlYXIoKS5yZWN0KHtcbiAgICAgICAgICB4OiAxLFxuICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApICogMjgpLFxuICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICBmaWxsOiBocGNvbG9yLFxuICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJpdmF0ZXMubXBiYXIuY2xlYXIoKS5yZWN0KHtcbiAgICAgICAgICB4OiAxLFxuICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgd2lkdGg6IE1hdGguZmxvb3IoKHRoaXMuZGF0YS5zcCAvIHRoaXMuZGF0YS4kc3ApICogMjgpLFxuICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICBmaWxsOiBcImJsdWVcIixcbiAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc3RhbmNlICgpIHtcbiAgICAgIGxldCB4ID0gbnVsbCwgeSA9IG51bGw7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMF0pICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMV0pKSB7XG4gICAgICAgIHggPSBhcmd1bWVudHNbMF07XG4gICAgICAgIHkgPSBhcmd1bWVudHNbMV07XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdLngpICYmIE51bWJlci5pc0Zpbml0ZShhcmd1bWVudHNbMF0ueSkpIHtcbiAgICAgICAgeCA9IGFyZ3VtZW50c1swXS54O1xuICAgICAgICB5ID0gYXJndW1lbnRzWzBdLnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGFyZ3VtZW50cyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGlzdGFuY2UgSW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG4gICAgICBsZXQgZCA9IDA7XG4gICAgICBkICs9IE1hdGgucG93KHRoaXMueCAtIHgsIDIpO1xuICAgICAgZCArPSBNYXRoLnBvdyh0aGlzLnkgLSB5LCAyKTtcbiAgICAgIGQgPSBNYXRoLnNxcnQoZCk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG5cbiAgICBkZWNyZWFzZUhQIChwb3dlcikge1xuICAgICAgdGhpcy5kYXRhLmhwIC09IHBvd2VyO1xuICAgICAgdGhpcy5yZWZyZXNoQmFyKCk7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VTUCAoc3ApIHtcbiAgICAgIHRoaXMuZGF0YS5zcCAtPSBzcDtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgIH1cblxuICAgIGRlYWQgKGF0dGFja2VyKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmhwIDw9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS50eXBlID09IFwiaGVyb1wiKSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLm92ZXIub3Blbihg5L2g6KKrJHthdHRhY2tlci5kYXRhLm5hbWV95omT5q275LqGYCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmVyYXNlKCk7XG4gICAgICAgICAgR2FtZS5hcmVhLmFjdG9ycy5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLmRhdGEuaXRlbXMgfHwgeyBnb2xkOiAxIH07XG5cbiAgICAgICAgICBHYW1lLmFkZEJhZyh0aGlzLnggLHRoaXMueSkudGhlbigoYmFnKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtSWQgaW4gaXRlbXMpIHtcbiAgICAgICAgICAgICAgaWYgKGJhZy5pbm5lci5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICAgICAgICAgICAgYmFnLmlubmVyW2l0ZW1JZF0gKz0gaXRlbXNbaXRlbUlkXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWcuaW5uZXJbaXRlbUlkXSA9IGl0ZW1zW2l0ZW1JZF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGF0dGFja2VyLmVtaXQoXCJraWxsXCIsIGZhbHNlLCB0aGlzKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOmXquS4gOmXquS6uueJqe+8jOS+i+Wmguiiq+WHu+S4reaXtueahOaViOaenCAqL1xuICAgIGZsYXNoICgpIHtcbiAgICAgIHRoaXMuc3ByaXRlLmFscGhhID0gMC41O1xuICAgICAgU3ByaXRlLlRpY2tlci5hZnRlcigxMCwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiog5Y+X5YiwYXR0YWNrZXLnmoRza2lsbOaKgOiDveeahOS8pOWusyAqL1xuICAgIGRhbWFnZSAoYXR0YWNrZXIsIHNraWxsKSB7XG5cbiAgICAgIHRoaXMuZW1pdChcImRhbWFnZWRcIik7XG5cbiAgICAgIGxldCBwb3dlciA9IHNraWxsLnBvd2VyO1xuICAgICAgbGV0IHR5cGUgPSBza2lsbC50eXBlO1xuXG4gICAgICBsZXQgY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICBpZiAodGhpcy5kYXRhLnR5cGUgPT0gXCJoZXJvXCIpIHtcbiAgICAgICAgY29sb3IgPSBcInJlZFwiO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgIHBvd2VyICs9IGF0dGFja2VyLmRhdGEuYXRrO1xuICAgICAgICBwb3dlciAtPSB0aGlzLmRhdGEuZGVmXG4gICAgICAgIHBvd2VyID0gTWF0aC5tYXgoMCwgcG93ZXIpO1xuICAgICAgfSBlbHNlIHsgLy8gdHlwZSA9PSBtYWdpY1xuICAgICAgICBwb3dlciArPSBhdHRhY2tlci5kYXRhLm1hdGs7XG4gICAgICAgIHBvd2VyIC0gdGhpcy5kYXRhLm1kZWZcbiAgICAgICAgcG93ZXIgPSBNYXRoLm1heCgwLCBwb3dlcik7XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0ID0gbnVsbDtcbiAgICAgIGxldCBzdGF0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgdGhpcy5kYXRhLmRvZGdlKSB7IC8vIOmXqumBv+S6hlxuICAgICAgICBzdGF0ZSA9IFwiZG9kZ2VcIjtcbiAgICAgICAgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgdGV4dDogXCJtaXNzXCIsXG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIGZvbnRTaXplOiAxNlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5yYW5kb20oKSA8IGF0dGFja2VyLmRhdGEuY3JpdGljYWwpIHsgLy8g6YeN5Ye75LqGXG4gICAgICAgIHN0YXRlID0gXCJjcml0aWNhbFwiO1xuICAgICAgICBwb3dlciAqPSAyO1xuICAgICAgICB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgICB0ZXh0OiBcIi1cIiArIHBvd2VyLFxuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBmb250U2l6ZTogMzJcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmxhc2goKTtcbiAgICAgICAgdGhpcy5kZWNyZWFzZUhQKHBvd2VyKTtcbiAgICAgIH0gZWxzZSB7IC8vIOaZrumAmuWHu+S4rVxuICAgICAgICBzdGF0ZSA9IFwiaGl0XCI7XG4gICAgICAgIHRleHQgPSBuZXcgU3ByaXRlLlRleHQoe1xuICAgICAgICAgIHRleHQ6IFwiLVwiICsgcG93ZXIsXG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIGZvbnRTaXplOiAxNlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFzaCgpO1xuICAgICAgICB0aGlzLmRlY3JlYXNlSFAocG93ZXIpO1xuICAgICAgfVxuXG5cbiAgICAgIGlmIChzdGF0ZSAhPSBcImRvZGdlXCIgJiYgdGhpcyAhPSBHYW1lLmhlcm8pIHtcbiAgICAgICAgaWYgKEdhbWUuc291bmRzLmh1cnQpIHtcbiAgICAgICAgICBHYW1lLnNvdW5kcy5odXJ0LmxvYWQoKTtcbiAgICAgICAgICBHYW1lLnNvdW5kcy5odXJ0LnZvbHVtZSA9IDAuMjtcbiAgICAgICAgICBHYW1lLnNvdW5kcy5odXJ0LnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIHRleHQuY2VudGVyWCA9IE1hdGguZmxvb3IodGV4dC53aWR0aCAvIDIpO1xuICAgICAgdGV4dC5jZW50ZXJZID0gTWF0aC5mbG9vcih0ZXh0LmhlaWdodCk7XG4gICAgICB0ZXh0LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgdGV4dC55ID0gdGhpcy5zcHJpdGUueTtcblxuICAgICAgdGV4dC54ICs9IFNwcml0ZS5yYW5kKC0xMCwgMTApO1xuXG4gICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICBsZXQgc3BlZWQgPSBTcHJpdGUucmFuZCgxLCAzKTtcblxuICAgICAgU3ByaXRlLlRpY2tlci53aGlsZXMoMTAwLCAobGFzdCkgPT4ge1xuICAgICAgICB0ZXh0LnkgLT0gc3BlZWQ7XG4gICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOa1i+ivleaYr+WQpuatu+S6oVxuICAgICAgdGhpcy5kZWFkKGF0dGFja2VyKTtcblxuICAgIH1cblxuICAgIC8qKiDmkq3mlL7kuIDkuKrliqjnlLsgKi9cbiAgICBwbGF5IChhbmltYXRpb24sIHByaW9yaXR5KSB7XG4gICAgICAvLyDmlrDliqjnlLvpu5jorqTkvJjlhYjnuqfkuLowXG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwcmlvcml0eSkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyDml6DliqjnlLvmiJbogIXlgZzmraLnirbmgIHvvIznjrDmnInkvJjlhYjnuqfkuLotMe+8iOacgOS9jue6p++8iVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmFuaW1hdGlvblByaW9yaXR5ID09IFwidW5kZWZpbmVkXCIgfHwgdGhpcy5zcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Qcmlvcml0eSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuZGF0YS5hbmltYXRpb25zLmhhc093blByb3BlcnR5KGFuaW1hdGlvbikgJiZcbiAgICAgICAgcHJpb3JpdHkgPj0gdGhpcy5hbmltYXRpb25Qcmlvcml0eSAmJlxuICAgICAgICBhbmltYXRpb24gIT0gdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvblxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uUHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgdGhpcy5zcHJpdGUucGxheShhbmltYXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDlgZzmraIgKi9cbiAgICBzdG9wICgpIHtcbiAgICAgIGlmICghdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbikgcmV0dXJuO1xuXG4gICAgICBpZiAoKHRoaXMuc3ByaXRlLnBhdXNlZCAmJiAhdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvZmFjZS8pKVxuICAgICAgICB8fCB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC93YWxrfHJ1bi8pKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNldXBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2Vkb3duXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNlbGVmdFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2VyaWdodFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOWQkeaMh+WummRpcmVjdGlvbuaWueWQkemHiuaUvuS4gOS4quaKgOiDvSAqL1xuICAgIGZpcmUgKGlkLCBkaXJlY3Rpb24pIHtcbiAgICAgIC8vIOWQjOS4gOaXtumXtOWPquiDveaWveWxleS4gOS4qnNraWxsXG4gICAgICBpZiAodGhpcy5hdHRhY2tpbmcpXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tpZF07XG4gICAgICBpZiAoIXNraWxsKVxuICAgICAgICByZXR1cm4gMDtcblxuICAgICAgLy8g5Y+q5pyJ5b2T6L+Z5Liqc2tpbGznmoRjb29sZG93bue7k1xuICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgaWYgKFxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrQ29vbGRvd24pICYmXG4gICAgICAgIChub3cgLSB0aGlzLmxhc3RBdHRhY2spIDwgdGhpcy5sYXN0QXR0YWNrQ29vbGRvd25cbiAgICAgICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNraWxsLmRhdGEuY29zdCA+IHRoaXMuZGF0YS5zcCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICB9XG5cbiAgICAgIGlmICggLy8g546p5a625L2/55So5oqA6IO95piv5Y+v6IO95pyJ5p2h5Lu255qE77yM5L6L5aaC5YmR5oqA6IO96ZyA6KaB6KOF5aSH5YmRXG4gICAgICAgIHRoaXMudHlwZSA9PSBcImhlcm9cIiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbigpID09IGZhbHNlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEF0dGFjayA9IG5vdztcbiAgICAgIHRoaXMubGFzdEF0dGFja0Nvb2xkb3duID0gc2tpbGwuZGF0YS5jb29sZG93bjtcbiAgICAgIHRoaXMuYXR0YWNraW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKHRoaXMuZ29pbmcpIHtcbiAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuXG4gICAgICB0aGlzLmRhdGEuc3AgLT0gc2tpbGwuZGF0YS5jb3N0O1xuICAgICAgdGhpcy5yZWZyZXNoQmFyKCk7XG5cbiAgICAgIHNraWxsLmZpcmUodGhpcywgZGlyZWN0aW9uLCAoaGl0dGVkKSA9PiB7XG4gICAgICAgIHRoaXMuYXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChoaXR0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGhpdHRlZFswXS5kYW1hZ2UodGhpcywgc2tpbGwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2tpbGwuZGF0YS5jb29sZG93bjtcbiAgICB9XG5cbiAgICAvKiog6KGM6LWw5Yiw5oyH5a6a5Zyw54K5ICovXG4gICAgZ290byAoeCwgeSwgc3RhdGUpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgaWYgKHRoaXMuZ29pbmcpIHtcbiAgICAgICAgICB0aGlzLmdvaW5nTmV4dCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ290byh4LCB5LCBzdGF0ZSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZXN0QmxvY2tlZCA9IHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSk7XG5cbiAgICAgICAgaWYgKGRlc3RCbG9ja2VkKSB7XG4gICAgICAgICAgaWYgKHRoaXMueCA9PSB4KSB7XG4gICAgICAgICAgICBpZiAodGhpcy55IC0geSA9PSAtMSkge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKFwiZG93blwiKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSAtIHkgPT0gMSkge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKFwidXBcIik7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy55ID09IHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnggLSB4ID09IC0xKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgICB0aGlzLmZhY2UoXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueCAtIHggPT0gMSkge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKFwibGVmdFwiKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBvc2l0aW9uQ2hvaWNlID0gW107XG4gICAgICAgIC8vIOS4iuS4i+W3puWPs1xuICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5LTEpID09IGZhbHNlKSB7XG4gICAgICAgICAgcG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCwgeTogeS0xLCBhZnRlcjogXCJkb3duXCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5KzEpID09IGZhbHNlKSB7XG4gICAgICAgICAgcG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCwgeTogeSsxLCBhZnRlcjogXCJ1cFwifSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeC0xLCB5KSA9PSBmYWxzZSkge1xuICAgICAgICAgIHBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgtMSwgeTogeSwgYWZ0ZXI6IFwicmlnaHRcIn0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMSwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzEsIHk6IHksIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBwb3NpdGlvbkNob2ljZSkgeyAvLyDorqHnrpflnLDlnYDot53nprtcbiAgICAgICAgICBlbGVtZW50LmRpc3RhbmNlID0gdGhpcy5kaXN0YW5jZShlbGVtZW50LngsIGVsZW1lbnQueSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmjInnhaflnLDlnYDnmoTot53nprvku47ov5HliLDov5zmjpLluo/vvIjku47lsI/liLDlpKfvvIlcbiAgICAgICAgcG9zaXRpb25DaG9pY2Uuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIHJldHVybiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5aaC5p6c55yf5q2j55qE55uu55qE5Zyw5pyJ5Y+v6IO96LWw77yM5o+S5YWl5Yiw56ys5LiA5L2N77yM5YaZ5Zyo6L+Z6YeM5piv5Zug5Li655uu55qE5Zyw5bm25LiN5LiA5a6a5pivZGlzdGFuY2XmnIDlsI/nmoRcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICBwb3NpdGlvbkNob2ljZS5zcGxpY2UoMCwgMCwge3g6IHgsIHk6IHl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBvdGhlckNob2ljZSA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBUZXN0UG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKGluZGV4IDwgcG9zaXRpb25DaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgZGVzdCA9IHBvc2l0aW9uQ2hvaWNlW2luZGV4XTsgLy8g5L+d5a2Y56ys5LiA5Liq6YCJ6aG5XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgR2FtZS5Bc3Rhci5nZXRQYXRoKHt4OiB0aGlzLngsIHk6IHRoaXMueX0sIGRlc3QpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmdldHRpbmdQYXRoID0gZmFsc2U7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmdvaW5nTmV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBjID0gdGhpcy5nb2luZ05leHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5nb2luZ05leHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICAgICAgICAgIEdhbWUuSW5wdXQuY2xlYXJEZXN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMuZ29pbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgICAgICAgR2FtZS5JbnB1dC5zZXREZXN0KGRlc3QueCwgZGVzdC55KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBub3QgaGVyb1xuICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAzMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0b28gZmFyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nb3RvUGF0aChyZXN1bHQsIHN0YXRlLCBkZXN0LmFmdGVyKS50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVGVzdFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3RoZXJDaG9pY2UgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJDaG9pY2UgPSB0cnVlO1xuICAgICAgICAgICAgICBsZXQgb3RoZXJQb3NpdGlvbkNob2ljZSA9IFtdO1xuICAgICAgICAgICAgICAvLyDlm5vkuKrop5JcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeC0xLCB5LTEpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTEsIHk6IHktMSwgYWZ0ZXI6IFwicmlnaHRcIn0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMSwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCsxLCB5OiB5LTEsIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeSsxKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeC0xLCB5OiB5KzEsIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHkrMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgrMSwgeTogeSsxLCBhZnRlcjogXCJsZWZ0XCJ9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyDlm5vkuKrov5zmlrnlkJFcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeS0yKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCwgeTogeS0yLCBhZnRlcjogXCJkb3duXCJ9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5KzIpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5KzIsIGFmdGVyOiBcInVwXCJ9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LTIsIHkpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTIsIHk6IHksIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzIsIHkpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzIsIHk6IHksIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBvdGhlclBvc2l0aW9uQ2hvaWNlKSB7IC8vIOiuoeeul+WcsOWdgOi3neemu1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlKGVsZW1lbnQueCwgZWxlbWVudC55KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIOaMieeFp+WcsOWdgOeahOi3neemu+S7jui/keWIsOi/nOaOkuW6j++8iOS7juWwj+WIsOWkp++8iVxuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChvdGhlclBvc2l0aW9uQ2hvaWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbkNob2ljZSA9IG90aGVyUG9zaXRpb25DaG9pY2U7XG4gICAgICAgICAgICAgICAgVGVzdFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIOWGjeasoeWwneivleemu+WcsOeCueacgOi/keeahOWcsOeCuVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFRlc3RQb3NpdGlvbigpO1xuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmjInnhafmjIflrprnmoRwYXRo5ZKMc3RhdGXooYzotbBcbiAgICAgKiDooYzotbDnu5PmnZ/lkI7lpoLmnpxhZnRlcuacieWumuS5ie+8jOWImemdouWQkWFmdGVy55qE5pa55ZCRXG4gICAgICovXG4gICAgZ290b1BhdGggKHBhdGgsIHN0YXRlLCBhZnRlcikge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5nb2luZyA9IHRydWU7XG4gICAgICAgIGxldCBpbmRleCA9IDE7XG4gICAgICAgIGxldCBXYWxrID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChHYW1lLnBhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcyA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuZ29pbmdOZXh0KSB7XG4gICAgICAgICAgICBsZXQgYyA9IHRoaXMuZ29pbmdOZXh0O1xuICAgICAgICAgICAgdGhpcy5nb2luZ05leHQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICAgIEdhbWUuSW5wdXQuY2xlYXJEZXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGluZGV4IDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0ge3g6IHRoaXMueCwgeTogdGhpcy55fTtcbiAgICAgICAgICAgIGxldCBkZXN0ID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChkZXN0LnggPT0gY3VycmVudC54KSB7XG4gICAgICAgICAgICAgIGlmIChkZXN0LnkgPiBjdXJyZW50LnkpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcImRvd25cIjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkZXN0LnkgPCBjdXJyZW50LnkpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcInVwXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdC55ID09IGN1cnJlbnQueSkge1xuICAgICAgICAgICAgICBpZiAoZGVzdC54ID4gY3VycmVudC54KSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJyaWdodFwiXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdC54IDwgY3VycmVudC54KSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICBsZXQgY3VycmVudERpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICE9IGN1cnJlbnREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZhY2UoZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmdvKHN0YXRlLCBkaXJlY3Rpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIFdhbGsoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgeyAvLyDmraPluLjnu5PmnZ9cbiAgICAgICAgICAgIGlmIChhZnRlcikge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKGFmdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBXYWxrKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDorqnkurrnianpnaLlkJHmn5DkuKpkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBmYWNlIChkaXJlY3Rpb24pIHtcbiAgICAgIGxldCBhbmltYXRpb24gPSBcImZhY2VcIiArIGRpcmVjdGlvbjtcbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiAhPSBhbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5zcHJpdGUucGxheShhbmltYXRpb24pO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y+C5pWwdOS4reiusOW9leS6huafkOS4quaWueagvOeahOaWueS9jXh577yM5rWL6K+V6L+Z5Liq5pa55qC85piv5ZCm5ZKM546p5a625pyJ5Yay56qBXG4gICAgICog6L+U5ZuedHJ1ZeS4uuacieeisOaSnu+8jOi/lOWbnmZhbHNl5Li65peg56Kw5pKeXG4gICAgICovXG4gICAgY2hlY2tDb2xsaXNpb24gKHgsIHkpIHtcbiAgICAgIC8vIOWcsOWbvui+uee8mOeisOaSnlxuICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gR2FtZS5hcmVhLm1hcC5kYXRhLndpZHRoIHx8IHkgPj0gR2FtZS5hcmVhLm1hcC5kYXRhLmhlaWdodCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWcsOWbvueisOaSnlxuICAgICAgaWYgKEdhbWUuYXJlYS5tYXAuaGl0VGVzdCh4LCB5KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8g6KeS6Imy56Kw5pKeXG4gICAgICBpZiAoR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICAgaWYgKGFjdG9yICE9IHRoaXMgJiYgYWN0b3IuaGl0VGVzdCh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOWcsOWbvuS4iueahOeJqeWTgeeisOaSnlxuICAgICAgaWYgKEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICAgIGlmIChpdGVtLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOa1i+ivleS6uueJqeeisOaSnlxuICAgICAqL1xuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaGl0QXJlYSAmJiB0aGlzLmRhdGEuaGl0QXJlYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5kYXRhLmhpdEFyZWEpIHtcbiAgICAgICAgICBpZiAoeCA9PSB0aGlzLnggKyBwWzBdICYmIHkgPT0gdGhpcy55ICsgcFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5oaXRUZXN0IGludmFsaWQgZGF0YVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnlKhzdGF0ZeeahOWnv+aAge+8iHdhbGvvvIxydW7vvInlkJFkaXJlY3Rpb27mlrnlkJHotbBcbiAgICAgKiDlpoLmnpzkurrniannjrDlnKjkuI3mmK9kaXJlY3Rpb27mlrnlkJHnmoTvvIzkvJjlhYjovazlpLRcbiAgICAgKi9cbiAgICBnbyAoc3RhdGUsIGRpcmVjdGlvbikge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKEdhbWUucGF1c2VkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5aaC5p6c5q2j5Zyo5oiY5paX5Yqo55S777yM5YiZ5LiN6LWwXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLnNwcml0ZS5wYXVzZWQgPT0gZmFsc2UgJiZcbiAgICAgICAgICB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC9za2lsbGNhc3R8dGhydXN0fHNsYXNofHNob290LylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMud2Fsa2luZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF0dGFja2luZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPSBkaXJlY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgIHRoaXMuZmFjZShkaXJlY3Rpb24pO1xuICAgICAgICAgIC8vIHdhaXQgNCB0aWNrc1xuICAgICAgICAgIFNwcml0ZS5UaWNrZXIuYWZ0ZXIoNCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53YWxraW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG5cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24obmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyDmsqHnorDmkp7vvIzlvIDlp4vooYzotbBcbiAgICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8g5oqK6KeS6Imy5L2N572u6K6+572u5Li65paw5L2N572u77yM5Li65LqG5Y2g6aKG6L+Z5Liq5L2N572u77yM6L+Z5qC35YW25LuW6KeS6Imy5bCx5Lya56Kw5pKeXG4gICAgICAgICAgLy8g5L2G5piv5LiN6IO955SodGhpcy54ID0gbmV3WOi/meagt+iuvue9ru+8jOWboOS4unRoaXMueOeahOiuvue9ruS8muWQjOaXtuiuvue9rnRoaXMuc3ByaXRlLnhcbiAgICAgICAgICBsZXQgb2xkWCA9IHRoaXMuZGF0YS54O1xuICAgICAgICAgIGxldCBvbGRZID0gdGhpcy5kYXRhLnk7XG4gICAgICAgICAgdGhpcy5kYXRhLnggPSBuZXdQb3NpdGlvbi54O1xuICAgICAgICAgIHRoaXMuZGF0YS55ID0gbmV3UG9zaXRpb24ueTtcblxuICAgICAgICAgIC8vIHdhbGtcbiAgICAgICAgICAvLyDov5nkupvmlbDnu4Tlkozlv4XpobvmmK8zMu+8jOS4uuS6huS/neivgeS4gOasoWdv6KGM6LWwMzLkuKrlg4/ntKBcbiAgICAgICAgICBsZXQgc3BlZWQgPSBbMywzLDIsMywzLDIsMywzLDIsMywzLDJdOyAvLyDlkozmmK8zMlxuICAgICAgICAgIGlmIChzdGF0ZSA9PSBcInJ1blwiKSB7XG4gICAgICAgICAgICAvLyBzcGVlZCA9IFs2LDcsNiw3LDZdOyAvLyDlkozmmK8zMlxuICAgICAgICAgICAgc3BlZWQgPSBbNCw0LDQsNCw0LDQsNCw0XTsgLy8g5ZKM5pivMzJcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgd2hpbGVzSWQgPSBTcHJpdGUuVGlja2VyLndoaWxlcyhzcGVlZC5sZW5ndGgsIChsYXN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnggPSBvbGRYO1xuICAgICAgICAgICAgICB0aGlzLmRhdGEueSA9IG9sZFk7XG4gICAgICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAgIFNwcml0ZS5UaWNrZXIuY2xlYXJXaGlsZXMod2hpbGVzSWQpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICAgIHRoaXMueCA9IG5ld1Bvc2l0aW9uLng7XG4gICAgICAgICAgICAgIHRoaXMueSA9IG5ld1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS55IC09IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnkgKz0gc3BlZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUueCAtPSBzcGVlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUueCArPSBzcGVlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyDmkq3mlL7ooYzotbDliqjnlLtcbiAgICAgICAgICB0aGlzLnBsYXkoc3RhdGUgKyBkaXJlY3Rpb24sIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiog5ZyoR2FtZS5hY3RvckxheWVy5LiK5Yig6Zmk5Lq654mpICovXG4gICAgZXJhc2UgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLnJlbW92ZUNoaWxkKHRoaXMuc3ByaXRlKTtcbiAgICAgIEdhbWUubGF5ZXJzLmluZm9MYXllci5yZW1vdmVDaGlsZChwcml2YXRlcy5pbmZvQm94KTtcbiAgICB9XG5cbiAgICAvKiog5ZyoR2FtZS5hY3RvckxheWVy5LiK5pi+56S65Lq654mpICovXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHRoaXMueCkgJiYgTnVtYmVyLmlzSW50ZWdlcih0aGlzLnkpKSB7XG4gICAgICAgIHRoaXMueCA9IHRoaXMuZGF0YS54O1xuICAgICAgICB0aGlzLnkgPSB0aGlzLmRhdGEueTtcblxuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgICBpbnRlcm5hbCh0aGlzKS5pbmZvQm94LnkgPSB0aGlzLnNwcml0ZS55IC0gdGhpcy5zcHJpdGUuY2VudGVyWSAtIDIwO1xuXG4gICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuYXBwZW5kQ2hpbGQodGhpcy5zcHJpdGUpO1xuICAgICAgICBHYW1lLmxheWVycy5pbmZvTGF5ZXIuYXBwZW5kQ2hpbGQocHJpdmF0ZXMuaW5mb0JveCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YS54LCB0aGlzLmRhdGEueSwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5kcmF3IGludmFsaWQgZGF0YS54L2RhdGEueVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog6ZWc5aS056e75Yqo5Yiw5Lit5b+D5Li66L+Z5Liq5Lq654mpICovXG4gICAgZm9jdXMgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5pbmZvQm94LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgcHJpdmF0ZXMuaW5mb0JveC55ID0gdGhpcy5zcHJpdGUueSAtIHRoaXMuc3ByaXRlLmNlbnRlclkgLSAyMDtcblxuICAgICAgR2FtZS5zdGFnZS5jZW50ZXJYID0gTWF0aC5yb3VuZCh0aGlzLnNwcml0ZS54IC0gR2FtZS5jb25maWcud2lkdGggLyAyKTtcbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWSA9IE1hdGgucm91bmQodGhpcy5zcHJpdGUueSAtIEdhbWUuY29uZmlnLmhlaWdodCAvIDIpO1xuICAgIH1cblxuICB9KTsgLy8gR2FtZS5BY3RvclxuXG59KSgpO1xuIl19
