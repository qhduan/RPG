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
  Game.register("Actor", (function (_Sprite$Event) {
    _inherits(Actor, _Sprite$Event);

    function Actor(actorData) {
      var _this = this;

      _classCallCheck(this, Actor);

      _get(Object.getPrototypeOf(Actor.prototype), "constructor", this).call(this);

      internal(this).data = actorData;

      this.makeInfoBox();

      if (this.data.image instanceof Array) {
        this.init(this.data.image);
      } else if (typeof this.data.image == "string") {
        Sprite.Loader.create().add("/actor/" + this.data.image).start().on("complete", function (event) {
          _this.init(event.data);
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

        images.forEach(function (image) {
          if (!Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width <= 0 || image.width >= 4096 || image.height <= 0 || image.height >= 4096) {
            console.error(image, images);
            throw new Error("Game.Actor.init got invalid image");
          }
        });

        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: this.data.tilewidth,
          height: this.data.tileheight,
          animations: this.data.animations
        });

        if (Number.isInteger(this.data.centerX) && Number.isInteger(this.data.centerY)) {
          sprite.centerX = this.data.centerX;
          sprite.centerY = this.data.centerY;
        } else {
          console.log(this.data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        sprite.play("facedown");
        internal(this).sprite = sprite;

        sprite.on("change", function () {
          internal(_this2).infoBox.x = sprite.x;
          internal(_this2).infoBox.y = sprite.y - sprite.centerY - 20;
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

        if (this.data.skills) {
          this.data.skills.forEach(function (skillId) {
            completeCount--;
            Game.Skill.load(skillId, function () {
              Complete();
            });
          });
        }

        if (this.data.equipment) {
          for (var key in this.data.equipment) {
            var itemId = this.data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId, function () {
                Complete();
              });
            }
          }
        }

        if (this.data.items) {
          for (var itemId in this.data.items) {
            completeCount--;
            Game.Item.load(itemId, function () {
              Complete();
            });
          }
        }

        if (this.data.contact && this.data.trade) {
          for (var itemId in this.data.trade) {
            completeCount--;
            Game.Item.load(itemId, function () {
              Complete();
            });
          }
        }

        Complete();
      }
    }, {
      key: "makeInfoBox",
      value: function makeInfoBox() {
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

        // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
        internal(this).infoBox = new Sprite.Container();

        if (this.data.type == "npc") {
          text.y += 10;
          internal(this).infoBox.appendChild(text);
        } else if (this.data.type == "hero") {
          // do nothing
        } else {
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
            internal(this).hpbar = new Sprite.Shape();
            internal(this).hpbar.centerX = 15;
            internal(this).hpbar.centerY = 2;
            internal(this).hpbar.x = 0;
            internal(this).hpbar.y = 9;

            // 精力条
            internal(this).mpbar = new Sprite.Shape();
            internal(this).mpbar.centerX = 15;
            internal(this).mpbar.centerY = 2;
            internal(this).mpbar.x = 0;
            internal(this).mpbar.y = 12;

            internal(this).infoBox.appendChild(text, hpbarBox, mpbarBox, internal(this).hpbar, internal(this).mpbar);
          }
      }
    }, {
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
        var actor = new Game.Actor(this.data);
        actor.x = this.x;
        actor.y = this.y;
        actor.visible = this.visible;
        actor.alpha = this.alpha;
        actorObj.on("complete", function () {
          if (typeof callback == "function") {
            callback(actor);
          }
        });
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        if (Game.hero && this == Game.hero) {
          Game.windows["interface"].status(this.data.hp / this.data.$hp, // 生命百分比
          this.data.sp / this.data.$sp // 精神力百分比
          );
        }

        if (internal(this).hpbar && internal(this).mpbar) {
          var hpcolor = "green";
          if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

          internal(this).hpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.hp / this.data.$hp * 28),
            height: 2,
            fill: hpcolor,
            "stroke-width": 0
          });

          internal(this).mpbar.clear().rect({
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
      key: "heroUse",
      value: function heroUse() {
        var _this3 = this;

        if (this.data.contact) {
          (function () {

            var options = {};

            if (_this3.data.contact) {
              Sprite.each(_this3.data.contact, function (talk, key) {
                var h = Game.hero;
                var d = Game.hero.data;
                var result = null;
                try {
                  result = eval(talk.condition);
                } catch (e) {
                  console.error(talk.condition);
                  console.error(e);
                  throw new Error("talk.condition eval error");
                }
                if (result) {
                  options[key] = key;
                }
              });
            }

            if (_this3.data.trade) {
              options["买入"] = "buy";
              options["卖出"] = "sell";
            }

            Game.choice(options, function (choice) {
              switch (choice) {
                case "buy":
                  Game.windows.buy.open(_this3.data.trade);
                  break;
                case "sell":
                  Game.windows.sell.open(_this3.data.trade);
                  break;
                default:
                  if (_this3.data.contact[choice]) {
                    Game.dialogue(_this3.data.contact[choice].content, _this3.data.name);
                  }
              }
            });
          })();
        }
      }
    }, {
      key: "distance",
      value: function distance() {
        var x = null,
            y = null;
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
        return d;
      }
    }, {
      key: "decreaseHP",
      value: function decreaseHP(power) {
        this.data.hp -= power;
        this.refreshBar();
        this.dead();
      }
    }, {
      key: "decreaseSP",
      value: function decreaseSP(sp) {
        this.data.sp -= sp;
        this.refreshBar();
      }
    }, {
      key: "dead",
      value: function dead() {
        var _this4 = this;

        if (this.data.hp <= 0) {
          if (this.data.type == "hero") {} else {
            var _iteratorNormalCompletion;

            var _didIteratorError;

            var _iteratorError;

            var _iterator, _step;

            (function () {
              var bag = null;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;

              try {
                for (_iterator = Game.area.bags[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var b = _step.value;

                  if (b.hitTest(_this4.x, _this4.y)) {
                    bag = b;
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

              if (!bag) {
                bag = Game.items.bag.clone();
                bag.on("complete", function () {
                  bag.x = _this4.x;
                  bag.y = _this4.y;
                  bag.draw();
                  Game.area.bags.add(bag);
                });
              }

              bag.inner = {
                "gold": 1
              };

              _this4.remove();
              Game.area.actors["delete"](_this4);
            })();
          }
        }
      }

      /** 闪一闪人物，例如被击中时的效果 */
    }, {
      key: "flash",
      value: function flash() {
        var _this5 = this;

        this.sprite.alpha = 0.5;
        setTimeout(function () {
          _this5.sprite.alpha = 1;
        }, 200);
      }

      /** 受到attacker的skill技能的伤害 */
    }, {
      key: "damage",
      value: function damage(attacker, skill) {
        var _this6 = this;

        this.emit("damaged");

        if (this == Game.hero) {
          // 如果英雄受到了伤害
          var touchActor = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Game.area.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var actor = _step2.value;

              // 找到所有邻接英雄的怪物
              if (actor != this && actor.data.type == "monster" && actor.distance(this) < 1.01) {
                touchActor.push(actor);
              }
            }
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

          if (touchActor.length) {
            (function () {
              var faceAttacker = false;
              var facePosition = _this6.facePosition;
              touchActor.forEach(function (actor) {
                if (actor.hitTest(facePosition.x, facePosition.y)) {
                  faceAttacker = true;
                }
              });
              // 如果英雄现在没面对任何一个邻接的怪物，面向它
              if (faceAttacker == false) {
                _this6.goto(touchActor[0].x, touchActor[0].y);
              }
            })();
          }
        }

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
          this.decreaseHP(power);
        } else {
          // 普通击中
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 16
          });
          this.flash();
          this.decreaseHP(power);
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
      }

      /** 播放一个动画 */
    }, {
      key: "play",
      value: function play(animation, priority) {
        // 新动画默认优先级为0
        if (typeof priority != "number") {
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
        var _this7 = this;

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

        if (!direction) {
          direction = this.direction;
        }

        if (skill.can(this)) {

          this.lastAttack = now;
          this.lastAttackCooldown = skill.data.cooldown;
          this.attacking = true;

          this.data.sp -= skill.data.cost;
          this.refreshBar();

          skill.fire(this, direction, function (hitted) {
            _this7.attacking = false;
            if (hitted.length > 0) {
              hitted[0].damage(_this7, skill);
            }
          });

          return skill.data.cooldown;
        } else {
          return 0;
        }
      }

      /** 行走到指定地点 */
    }, {
      key: "goto",
      value: function goto(x, y, state, callback) {
        var _this8 = this;

        state = state || "run";
        callback = typeof callback == "function" ? callback : function () {};

        if (this.going) {
          this.goingNext = function () {
            _this8.goto(x, y, state, callback);
          };
          return "wait";
        }

        var destBlocked = this.checkCollision(x, y);

        if (destBlocked) {
          if (this.x == x) {
            if (this.y - y == -1) {
              this.stop();
              this.face("down");
              return callback();
            } else if (this.y - y == 1) {
              this.stop();
              this.face("up");
              return callback();
            }
          } else if (this.y == y) {
            if (this.x - x == -1) {
              this.stop();
              this.face("right");
              return callback();
            } else if (this.x - x == 1) {
              this.stop();
              this.face("left");
              return callback();
            }
          }
        }

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
            if (this.checkCollision(j, i)) {
              map[i][j] = 0;
            } else {
              map[i][j] = 1;
            }
          }
        }

        var destPosition = {
          x: x,
          y: y
        };
        var after = null;
        var path = null;

        if (destBlocked == false) {
          path = Game.Astar.path(map, width, height, { x: this.x, y: this.y }, // 角色现在位置
          destPosition); // 目的地
        }

        // 可能因为指定x,y被阻挡，尝试寻路到指定x,y的四个邻接地点
        if (!path) {
          var otherChoice = [];
          if (this.checkCollision(x, y - 1) == false) {
            otherChoice.push({ x: x, y: y - 1, after: "down" });
          }
          if (this.checkCollision(x, y + 1) == false) {
            otherChoice.push({ x: x, y: y + 1, after: "up" });
          }
          if (this.checkCollision(x - 1, y) == false) {
            otherChoice.push({ x: x - 1, y: y, after: "right" });
          }
          if (this.checkCollision(x + 1, y) == false) {
            otherChoice.push({ x: x + 1, y: y, after: "left" });
          }

          if (otherChoice.length > 0) {
            var _iteratorNormalCompletion3 = true;

            // 找到四个邻接地址中最近的
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = otherChoice[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var element = _step3.value;

                // 计算地址距离
                element.distance = this.distance(element.x, element.y);
              }
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

            if (otherChoice.length > 1) {
              otherChoice.sort(function (a, b) {
                return a.distance - b.distance;
              });
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = otherChoice[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var element = _step4.value;

                path = Game.Astar.path(map, width, height, { x: this.x, y: this.y }, { x: element.x, y: element.y });
                if (path) {
                  // 如果找到路径，则不再继续找（这种找法并没找到最优，最优应该是四个path都测试寻找最短）
                  after = element.after;
                  break;
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
        }

        if (path && path.length && path.length > 1) {
          (function () {
            _this8.going = true;
            var index = 1;
            var Walk = function Walk() {
              if (_this8.goingNext) {
                var c = _this8.goingNext;
                _this8.goingNext = null;
                _this8.going = false;
                c();
              } else if (index < path.length) {
                var current = { x: _this8.x, y: _this8.y };
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
                  var currentDirection = _this8.direction;
                  if (direction != currentDirection) {
                    _this8.face(direction);
                  }
                  var goResult = _this8.go(state, direction, function () {
                    return Walk();
                  });
                  if (goResult != true) {
                    _this8.going = false;
                  }
                  index++;
                }
              } else {
                // 正常结束
                if (after) {
                  _this8.stop();
                  _this8.face(after);
                }
                _this8.going = false;
                callback();
              }
            };
            Walk();
          })();
        } else {
          // 实在没找到路
          // console.log("noway");
        }
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
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = Game.area.actors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var actor = _step5.value;

              if (actor != this && actor.hitTest(x, y)) {
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
        var _this9 = this;

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

        if (this.direction != direction) {
          this.walking = true;
          this.face(direction);
          // wait 4 ticks
          Sprite.Ticker.after(4, function () {
            _this9.walking = false;
          });
          return false;
        }

        var newX = this.x;
        var newY = this.y;

        var oldPositionKey = newX + "," + newY;

        switch (direction) {
          case "up":
            newY -= 1;
            break;
          case "down":
            newY += 1;
            break;
          case "left":
            newX -= 1;
            break;
          case "right":
            newX += 1;
            break;
        }

        var newPositionKey = newX + "," + newY;

        if (this.checkCollision(newX, newY) == false) {
          var _ret5 = (function () {
            // 没碰撞，开始行走
            _this9.walking = true;

            // 把角色位置设置为新位置，为了占领这个位置，这样其他角色就会碰撞
            // 但是不能用this.x = newX这样设置，因为this.x的设置会同时设置this.sprite.x
            _this9.data.x = newX;
            _this9.data.y = newY;

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
                  _this9.sprite.y -= speed;
                  break;
                case "down":
                  _this9.sprite.y += speed;
                  break;
                case "left":
                  _this9.sprite.x -= speed;
                  break;
                case "right":
                  _this9.sprite.x += speed;
                  break;
              }

              if (last) {
                _this9.x = newX;
                _this9.y = newY;
                _this9.walking = false;
                _this9.emit("change");

                if (typeof callback == "function") {
                  Sprite.Ticker.after(2, function () {
                    callback();
                  });
                }
              }
            });

            // 播放行走动画
            _this9.play(state + direction, 1);
            return {
              v: true
            };
          })();

          if (typeof _ret5 === "object") return _ret5.v;
        }

        this.play("face" + direction, 0);

        return false;
      }

      /** 在Game.actorLayer上删除人物 */
    }, {
      key: "remove",
      value: function remove() {
        Game.layers.actorLayer.removeChild(this.sprite);
        Game.layers.actorLayer.removeChild(internal(this).infoBox);
      }

      /** 在Game.actorLayer上显示人物 */
    }, {
      key: "draw",
      value: function draw() {
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
          this.x = this.data.x;
          this.y = this.data.y;

          internal(this).infoBox.x = this.sprite.x;
          internal(this).infoBox.y = this.sprite.y - this.sprite.centerY - 20;

          Game.layers.actorLayer.appendChild(this.sprite);
          Game.layers.actorLayer.appendChild(internal(this).infoBox);
        } else {
          console.error(this.data.x, this.data.y, this.data);
          throw new Error("Game.Actor.draw invalid data.x/data.y");
        }
      }

      /** 镜头集中 */
    }, {
      key: "focus",
      value: function focus() {
        internal(this).infoBox.x = this.sprite.x;
        internal(this).infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
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
      key: "sprite",
      get: function get() {
        return internal(this).sprite;
      },
      set: function set(value) {
        throw new Error("Game.Actor.sprite readonly");
      }
    }, {
      key: "x",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        this.data.x = value;
        this.sprite.x = value * 32 + 16;
      }
    }, {
      key: "y",
      get: function get() {
        return this.data.y;
      },
      set: function set(value) {
        this.data.y = value;
        this.sprite.y = value * 32 + 16;
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
        if (typeof value == "number" && !isNaN(value) && value >= 0 && value <= 1) {
          internal(this).sprite.alpha = value;
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
//# sourceMappingURL=GameActor.js.map
