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

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

      var Init = function Init(images) {
        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        //.centerX.centerY把角色中间设定为图片中间

        if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
          sprite.centerX = _this.data.centerX;
          sprite.centerY = _this.data.centerY;
        } else {
          console.log(_this.data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        // sprite.centerX = Math.floor(this.data.tilewidth * 0.5);
        // sprite.centerY = Math.floor(this.data.tileheight * 0.75);
        sprite.play("facedown");
        _this.sprite = sprite;

        sprite.on("change", function () {
          _this.infoBox.x = _this.sprite.x;
          _this.infoBox.y = _this.sprite.y - _this.sprite.centerY - 20;
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

        if (_this.data.contact && _this.data.trade && _this.data.trade.length) {
          _this.data.trade.forEach(function (itemId) {
            completeCount--;
            Game.Item.load(itemId, function () {
              Complete();
            });
          });
        }

        Complete();
      };

      if (this.data.image instanceof Array) {
        // img or canvas
        Init(this.data.image);
      } else if (typeof this.data.image == "string") {
        var loader = new Sprite.Loader();
        loader.add("/actor/" + this.data.image);
        loader.start();
        loader.on("complete", function (event) {
          Init(event.data);
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

          if (this.data.contact) {
            Sprite.each(this.data.contact, function (talk, key) {
              if (eval(talk.condition)) {
                options[key] = key;
              }
            });
          }

          if (this.data.trade) {
            options["交易"] = "trade";
          }

          Game.choice(options, function (choice) {
            switch (choice) {
              case "trade":
                Game.windows.trade.execute("trade", _this2.data.trade);
                break;
              default:
                if (_this2.data.contact[choice]) {
                  Game.dialogue(_this2.data.contact[choice].content, _this2.data.name);
                }
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
        return d;
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
          if (this.data.type == "hero") {} else {
            // item0001是物品掉落之后出现的小布袋
            var dead = Game.items.bag.clone();
            console.log(dead.x, dead.y);
            dead.x = this.x;
            dead.y = this.y;
            dead.draw(Game.layers.itemLayer);
            dead.inner = {
              "gold": 1
            };
            Game.area.bags[Sprite.uuid()] = dead;

            this.remove();

            Game.area.actors["delete"](this);
          }
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
        text.x = this.sprite.x;
        text.y = this.sprite.y;

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
            _this4.attacking = false;
            if (hitted.length > 0) {
              hitted[0].damage(_this4, skill);
            }
          });

          return skill.data.cooldown;
        } else {
          return 0;
        }
      }
    }, {
      key: "goto",
      value: function goto(x, y) {
        var _this5 = this;

        var state = arguments.length <= 2 || arguments[2] === undefined ? "walk" : arguments[2];
        var callback = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        if (this.going) {
          this.goingNext = function () {
            _this5.goto(x, y, state, callback);
          };
          return "wait";
        }

        var destBlocked = this.checkCollision(x, y);

        if (destBlocked) {
          if (this.x == x) {
            if (this.y - y == -1) {
              this.stop();
              this.play("facedown");
              return;
            } else if (this.y - y == 1) {
              this.stop();
              this.play("faceup");
              return;
            }
          } else if (this.y == y) {
            if (this.x - x == -1) {
              this.stop();
              this.play("faceright");
              return;
            } else if (this.x - x == 1) {
              this.stop();
              this.play("faceleft");
              return;
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
          Game.Astar.path(map, width, height, { x: this.x, y: this.y }, // 角色现在位置
          destPosition); // 目的地
        }

        // 可能因为指定x,y被阻挡，尝试寻路到指定x,y的四个邻接地点
        if (!path) {
          var otherChoice = [];
          if (this.checkCollision(x, y - 1) == false) {
            otherChoice.push({ x: x, y: y - 1, after: "facedown" });
          }
          if (this.checkCollision(x, y + 1) == false) {
            otherChoice.push({ x: x, y: y + 1, after: "faceup" });
          }
          if (this.checkCollision(x - 1, y) == false) {
            otherChoice.push({ x: x - 1, y: y, after: "faceright" });
          }
          if (this.checkCollision(x + 1, y) == false) {
            otherChoice.push({ x: x + 1, y: y, after: "faceleft" });
          }

          if (otherChoice.length > 0) {
            var _iteratorNormalCompletion = true;

            // 找到四个邻接地址中最近的
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = otherChoice[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;

                // 计算地址距离
                element.distance = this.distance(element.x, element.y);
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

            if (otherChoice.length > 1) {
              otherChoice.sort(function (a, b) {
                return a.distance - b.distance;
              });
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = otherChoice[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var element = _step2.value;

                path = Game.Astar.path(map, width, height, { x: this.x, y: this.y }, { x: element.x, y: element.y });
                if (path) {
                  // 如果找到路径，则不再继续找（这种找法并没找到最优，最优应该是四个path都测试寻找最短）
                  after = element.after;
                  break;
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
          }
        }

        if (path && path.length && path.length > 1) {
          this.going = true;
          var index = 1;
          var Walk = function Walk() {
            if (_this5.goingNext) {
              var c = _this5.goingNext;
              _this5.goingNext = null;
              _this5.going = false;
              c();
            } else if (index < path.length) {
              var current = { x: _this5.x, y: _this5.y };
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
                var currentDirection = _this5.direction;
                if (direction != currentDirection) {
                  _this5.face(direction);
                }
                var goResult = _this5.go(state, direction, function () {
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
                _this5.stop();
                _this5.play(after);
              }
              _this5.going = false;
              if (typeof callback == "function") {
                callback();
              }
            }
          };
          Walk();
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
        }
      }

      // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
      // 返回true为有碰撞，返回false为无碰撞
    }, {
      key: "checkCollision",
      value: function checkCollision(x, y) {
        var positionKey = x + "," + y;
        // 角色预占位碰撞
        if (actorHold[positionKey]) {
          return true;
        }
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
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Game.area.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var actor = _step3.value;

              if (actor != this && actor.hitTest(x, y)) {
                return true;
              }
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
        }
        return false;
      }
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.data.hitArea[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var p = _step4.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
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

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "go",
      value: function go(state, direction) {
        var _this6 = this;

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

        var currentDirection = this.direction;
        if (currentDirection != direction) {
          this.walking = true;
          this.face(direction);
          // wait 8 ticks
          Sprite.Ticker.after(4, function () {
            _this6.walking = false;
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

        var result = this.checkCollision(newX, newY);

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
                _this6.sprite.y -= speed;
                break;
              case "down":
                _this6.sprite.y += speed;
                break;
              case "left":
                _this6.sprite.x -= speed;
                break;
              case "right":
                _this6.sprite.x += speed;
                break;
            }

            if (last) {
              delete actorHold[newPositionKey];
              delete actorHold[oldPositionKey];
              _this6.x = newX;
              _this6.y = newY;
              _this6.walking = false;

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
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
          this.x = this.data.x;
          this.y = this.data.y;

          this.infoBox.x = this.sprite.x;
          this.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

          Game.layers.actorLayer.appendChild(this.sprite);
          Game.layers.infoLayer.appendChild(this.infoBox);
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.draw invalid data.x/data.y");
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        this.infoBox.x = this.sprite.x;
        this.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
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
        this.infoBox.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return this.sprite.alpha;
      },
      set: function set(value) {
        this.sprite.alpha = value;
        this.infoBox.alpha = value;
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

    return GameActor;
  })(Sprite.Event); // Game.Actor
})();