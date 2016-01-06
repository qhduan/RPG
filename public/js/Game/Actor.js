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

  var internal = Sprite.Util.namespace();

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
          Sprite.Loader.load("actor/" + id + ".js").then(function (data) {
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
        Sprite.Loader.load("actor/" + _this.data.image).then(function (data) {
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
        var now = Date.now();
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
