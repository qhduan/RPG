/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.ActorClass = (function (_Sprite$Event) {
    _inherits(ActorClass, _Sprite$Event);

    function ActorClass(actorData) {
      var _this = this;

      _classCallCheck(this, ActorClass);

      _get(Object.getPrototypeOf(ActorClass.prototype), "constructor", this).call(this);

      this.data = actorData;
      this.id = this.data.id;

      // 名字
      var text = new Sprite.Text({
        text: this.data.name,
        maxWidth: 200,
        color: "white",
        fontSize: 12
      });
      text.center.y = Math.floor(text.height / 2);
      text.center.x = Math.floor(text.width / 2);
      text.x = 0;
      text.y = 0;
      this.text = text;

      // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
      this.infoBox = new Sprite.Container();

      if (this.data.type == "npc") {
        this.text.y += 10;
        this.infoBox.appendChild(this.text);
      } else {
        // 血条外面的黑框
        this.hpbarBox = new Sprite.Shape();
        this.hpbarBox.center.x = 15;
        this.hpbarBox.center.y = 2;
        this.hpbarBox.x = 0;
        this.hpbarBox.y = 10;

        // 魔法条外面的黑框
        this.mpbarBox = new Sprite.Shape();
        this.mpbarBox.center.x = 15;
        this.mpbarBox.center.y = 2;
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
        this.hpbar.center.x = 15;
        this.hpbar.center.y = 2;
        this.hpbar.x = 0;
        this.hpbar.y = 10;

        // 精力条
        this.mpbar = new Sprite.Shape();
        this.mpbar.center.x = 15;
        this.mpbar.center.y = 2;
        this.mpbar.x = 0;
        this.mpbar.y = 12;

        this.refreshBar();

        this.infoBox.appendChild(this.text, this.hpbarBox, this.mpbarBox, this.hpbar, this.mpbar);
      }

      var Init = function Init(image) {
        var sprite = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        //.center.x.center.y把角色中间设定为图片中间
        sprite.center.x = Math.floor(_this.data.tilewidth / 2);
        sprite.center.y = Math.floor(_this.data.tileheight / 2);
        sprite.play("facedown");
        sprite.x = 0;
        sprite.y = 0;
        _this.sprite = sprite;

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            _this.emit("complete", true);
          }
        };

        if (_this.data.skills) {
          _this.skills = {};
          _this.data.skills.forEach(function (element) {
            var skillLoader = new Sprite.Loader();
            skillLoader.add("/skill/" + element + ".json");
            skillLoader.start();
            completeCount--;
            skillLoader.on("complete", function (event) {
              var skillData = event.data[0];
              var skillObj = new Game.SkillClass(skillData);
              _this.skills[element] = skillObj;
              Complete();
            });
          });
        }

        var LoadItem = function LoadItem(element) {
          if (Game.items.hasOwnProperty(element) == false) {
            Game.items[element] = true;
            var itemLoader = new Sprite.Loader();
            itemLoader.add("/item/" + element + ".json");
            itemLoader.start();
            completeCount--;
            itemLoader.on("complete", function (event) {
              var itemData = event.data[0];
              var itemObj = new Game.ItemClass(itemData);
              Game.items[element] = itemObj;
              Complete();
            });
          }
        };

        if (_this.data.equipment) {
          for (var key in _this.data.equipment) {
            var equipment = _this.data.equipment[key];
            if (equipment) {
              LoadItem(equipment);
            }
          }
        }

        if (_this.data.items) {
          for (var itemId in _this.data.items) {
            LoadItem(itemId);
          }
        }

        Complete();
      };

      if (this.data.image instanceof Image) {
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

      this.calculate();

      this.on("move", function () {
        if (_this.popupBox && Object.keys(_this.popupBox).length) {
          for (var key in _this.popupBox) {
            _this.popupBox[key].x = _this.x;
            _this.popupBox[key].y = _this.y - _this.sprite.center.y;
          }
        }
      });
    }

    _createClass(ActorClass, [{
      key: "calculate",
      value: function calculate() {
        this.data.str = this.data.$str;
        this.data.dex = this.data.$dex;
        this.data.con = this.data.$con;
        this.data.int = this.data.$int;
        this.data.cha = this.data.$cha;
        // 然后可以针对基本属性计算buff
        this.data.$hp = this.data.con * 10;
        this.data.$sp = this.data.int * 10;
        this.data.$atk = this.data.str * 2;
        this.data.$def = this.data.dex * 2;
        this.data.$matk = this.data.int * 1.5;
        this.data.$mdef = this.data.int * 0.5;
        // 计算完了战斗相关数值
        this.data.hp = this.data.$hp;
        this.data.sp = this.data.$sp;
        this.data.atk = this.data.$atk;
        this.data.def = this.data.$def;
        this.data.matk = this.data.$matk;
        this.data.mdef = this.data.$mdef;
        // 最后可以对战斗相关数值计算buff
      }
    }, {
      key: "clone",
      value: function clone(callback) {
        var actorObj = new ActorClass(this.data);
        actorObj.oncomplete(callback);
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        var hpcolor = "green";
        if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

        this.hpbar.clear().rect({
          x: 0,
          y: 0,
          width: Math.floor(this.data.hp / this.data.$hp * 30),
          height: 3,
          fill: hpcolor,
          "stroke-width": 0
        });

        this.mpbar.clear().rect({
          x: 0,
          y: 0,
          width: Math.floor(this.data.sp / this.data.$sp * 30),
          height: 3,
          fill: "blue",
          "stroke-width": 0
        });
      }
    }, {
      key: "popup",
      value: function popup(text) {
        var _this2 = this;

        var dialogueText = new Sprite.Text({
          text: text,
          maxWidth: 200
        });
        var w = dialogueText.width;
        var h = dialogueText.height;
        var middle = Math.round((w + 10) / 2);

        var dialogueBox = new Sprite.Shape();
        dialogueBox.rect({
          x: 0,
          y: 0,
          width: w + 10,
          height: h + 10,
          stroke: "black",
          fill: "white"
        });

        /*
        dialogueBox.polygon({
          points: [
            middle - 5, h + 9,
            middle + 5, h + 9,
            middle - 5, h + 9,
          ].join(", "),
          fill: "white"
        });
        */

        var dialogueContainer = new Sprite.Container();
        dialogueContainer.appendChild(dialogueBox, dialogueText);
        dialogueText.x = 5;
        dialogueText.y = 5;
        dialogueContainer.x = this.x;
        dialogueContainer.y = this.y - this.sprite.center.y - 30;
        dialogueContainer.center.x = middle;
        dialogueContainer.center.y = h + 15;
        dialogueContainer.height = h + 15;
        dialogueContainer.width = w + 10;

        if (!this.popupBox) {
          this.popupBox = {};
        }

        if (Object.keys(this.popupBox).length > 0) {
          for (var key in this.popupBox) {
            this.popupBox[key].center.y += this.popupBox[key].height;
          }
        }

        var id = Sprite.Util.id();

        this.popupBox[id] = dialogueContainer;
        Game.dialogueLayer.appendChild(this.popupBox[id]);

        setTimeout(function () {
          if (_this2.popupBox[id]) {
            Game.dialogueLayer.removeChild(_this2.popupBox[id]);
            delete _this2.popupBox[id];
          }
        }, 4000);
      }
    }, {
      key: "contact",
      value: function contact() {
        if (this.data.contact) {
          if (this.data.contact.type == "talk") {
            this.popup(this.data.contact.content);
          }
        }
      }
    }, {
      key: "distance",
      value: function distance(x, y) {
        var d = 0;
        d += Math.pow(this.x - x, 2);
        d += Math.pow(this.y - y, 2);
        return parseInt(Math.sqrt(d));
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
          dead.draw(Game.itemLayer);
          dead.inner = {
            "gold": 1
          };
          Game.area.bags[Sprite.Util.id()] = dead;

          Game.actorLayer.removeChild(this.infoBox);
          Game.actorLayer.removeChild(this.sprite);

          delete Game.area.actors[this.id];
        }
      }
    }, {
      key: "damage",
      value: function damage(type, power) {

        if (type == "normal") {
          power = Math.max(0, power - this.data.def);
        } else {
          // type == magic
          power = Math.max(0, power - this.data.mdef);
        }

        var text = new Sprite.Text({
          text: "-" + power,
          color: "white",
          fontSize: 16
        });
        text.center.x = Math.floor(text.width / 2);
        text.center.y = Math.floor(text.height);
        text.x = this.x;
        text.y = this.y;

        Game.actorLayer.appendChild(text);

        var inter = setInterval(function () {
          text.y -= 4;
        }, 50);

        setTimeout(function () {
          Game.actorLayer.removeChild(text);
          clearInterval(inter);
        }, 2000);

        this.decreaseHitpoint(power);
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
        var _this3 = this;

        // 同一时间只能施展一个skill
        if (this.attacking) return 0;

        var skill = this.skills[id];
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

        skill.fire(this, "attack" + direction, function (hittedActorIds) {
          _this3.attacking = false;
          if (hittedActorIds && hittedActorIds.length) {
            hittedActorIds.forEach(function (element) {
              Game.area.actors[element].damage(skill.data.type, skill.data.power);
            });
          }
        });

        return skill.data.cooldown;
      }
    }, {
      key: "goto",
      value: function goto(x, y, speed, collisionTest, callback) {
        var _this4 = this;

        if (this.gotoListener) {
          Sprite.Ticker.off("tick", this.gotoListener);
          this.gotoListener = null;
        }

        x -= this.x;
        y -= this.y;

        var state = "walk";
        var limit = 20;
        var skew = speed / 1.4;

        this.gotoListener = Sprite.Ticker.on("tick", function () {
          return toXY();
        });

        var leftright = "";
        var updown = "";
        if (x > 0) {
          leftright = "right";
        } else if (x < 0) {
          leftright = "left";
        }
        if (y > 0) {
          updown = "down";
        } else if (y < 0) {
          updown = "up";
        }
        var X = x = Math.abs(x);
        var Y = y = Math.abs(y);

        var toXY = function toXY() {
          if (x <= limit && y <= limit) {
            if (_this4.gotoListener) {
              Sprite.Ticker.off("tick", _this4.gotoListener);
              _this4.gotoListener = null;
            }
            if (X > Y) {
              _this4.face(leftright);
            } else {
              _this4.face(updown);
            }
            if (callback) callback();
          } else if (x > limit && y > limit) {
            if (X > Y) {
              _this4.go(state, leftright, speed, collisionTest);
              x -= speed;
            } else {
              _this4.go(state, updown, speed, collisionTest);
              y -= speed;
            }
            if (x < 0) x = 0;
            if (y < 0) y = 0;
          } else if (x > limit) {
            _this4.go(state, leftright, speed, collisionTest);
            x -= speed;
            if (x < 0) x = 0;
          } else if (y > limit) {
            _this4.go(state, updown, speed, collisionTest);
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

      // 这个函数是测试某个方向能否走，能移动则移动
      // direction的值有up，down，left，right四种可能
      // 建立这个函数是因为一次行走虽然是一次，但是也可以潮四个角方向走，实际就要执行两次CheckDirection
    }, {
      key: "CheckDirection",
      value: function CheckDirection(direction, step, collisionTest) {
        var _this5 = this;

        var oldX = this.x;
        var oldY = this.y;

        switch (direction) {
          case "up":
            this.y += -step;
            break;
          case "down":
            this.y += step;
            break;
          case "left":
            this.x += -step;
            break;
          case "right":
            this.x += step;
            break;
        }

        this.x = parseInt(this.x);
        this.y = parseInt(this.y);

        var t = Game.area.map.tile(this.x, this.y);

        var tested = {};

        // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
        var CheckCollision = function CheckCollision(t) {
          if (t.x < 0 || t.y < 0 || t.x >= Game.area.map.data.width || t.y >= Game.area.map.data.height) return true;

          var i = t.x + "-" + t.y;
          if (tested.hasOwnProperty(i)) return tested[i];

          if (Game.area.map.blockedMap[t.y] && Game.area.map.blockedMap[t.y][t.x]) {
            if (Game.actorCollision(_this5.sprite, Game.area.map.blockedMap[t.y][t.x])) {
              tested[i] = true;
              return true;
            }
          }
          tested[i] = false;
          return false;
        };

        var collision = false;

        if (collisionTest) {
          if (collision == false) collision = CheckCollision(t);

          if (collision == false) collision = CheckCollision({ x: t.x, y: t.y + 1 });
          if (collision == false) collision = CheckCollision({ x: t.x, y: t.y - 1 });
          if (collision == false) collision = CheckCollision({ x: t.x - 1, y: t.y });
          if (collision == false) collision = CheckCollision({ x: t.x + 1, y: t.y });

          if (collision == false) collision = CheckCollision({ x: t.x + 1, y: t.y - 1 });
          if (collision == false) collision = CheckCollision({ x: t.x + 1, y: t.y + 1 });
          if (collision == false) collision = CheckCollision({ x: t.x - 1, y: t.y - 1 });
          if (collision == false) collision = CheckCollision({ x: t.x - 1, y: t.y + 1 });

          // 判断和地图上角色的碰撞
          if (collision == false) {
            for (var key in Game.area.actors) {
              collision = Game.actorCollision(this.sprite, Game.area.actors[key].sprite);
              if (collision) break;
            }
          }
        }

        // 碰撞了
        if (collision) {
          this.x = oldX;
          this.y = oldY;
          return false;
        } else {
          this.infoBox.x = this.x;
          this.infoBox.y = this.y - this.sprite.center.y - 20;

          return true;
        }
      }
    }, {
      key: "go",
      value: function go(state, direction, step, collisionTest) {
        // 如果正在战斗动画，则不走
        if (this.sprite.paused == false && this.sprite.currentAnimation.match(/skillcast|thrust|slash|shoot/)) {
          return false;
        }

        if (this.data.weapons) {
          if (this.bowSprite.paused == false || this.daggerSprite.paused == false || this.spearSprite.paused == false || this.woodwandSprite.paused == false) return false;
        }

        if (typeof collisionTest == "undefined") {
          collisionTest = true;
        }

        // 八个方向的检测
        // 以四个角度方向为例，如果玩家希望走 右上，如果右走不了，只会会走上；上走不了，只会走右；右和上都走不了，则停止
        // 就算走不了，也改变人物的面部朝向
        switch (direction) {
          case "upleft":
            if (this.CheckDirection("up", step, collisionTest) | this.CheckDirection("left", step, collisionTest)) {
              this.play(state + "up", 1);
            } else {
              this.play("faceup", 0);
            }
            break;
          case "upright":
            if (this.CheckDirection("up", step, collisionTest) | this.CheckDirection("right", step, collisionTest)) {
              this.play(state + "up", 1);
            } else {
              this.play("faceup", 0);
            }
            break;
          case "downleft":
            if (this.CheckDirection("down", step, collisionTest) | this.CheckDirection("left", step, collisionTest)) {
              this.play(state + "down", 1);
            } else {
              this.play("facedown", 0);
            }
            break;
          case "downright":
            if (this.CheckDirection("down", step, collisionTest) | this.CheckDirection("right", step, collisionTest)) {
              this.play(state + "down", 1);
            } else {
              this.play("facedown", 0);
            }
            break;
          case "up":
            if (this.CheckDirection("up", step, collisionTest)) {
              this.play(state + "up", 1);
            } else {
              this.play("faceup", 0);
            }
            break;
          case "down":
            if (this.CheckDirection("down", step, collisionTest)) {
              this.play(state + "down", 1);
            } else {
              this.play("facedown", 0);
            }
            break;
          case "left":
            if (this.CheckDirection("left", step, collisionTest)) {
              this.play(state + "left", 1);
            } else {
              this.play("faceleft", 0);
            }
            break;
          case "right":
            if (this.CheckDirection("right", step, collisionTest)) {
              this.play(state + "right", 1);
            } else {
              this.play("faceright", 0);
            }
            break;
        }

        this.focus();
        _get(Object.getPrototypeOf(ActorClass.prototype), "emit", this).call(this, "move");
      }
    }, {
      key: "remove",
      value: function remove(layer) {
        layer.removeChild(this.sprite);
        layer.removeChild(this.infoBox);
      }
    }, {
      key: "draw",
      value: function draw(layer) {
        var x = this.data.x;
        var y = this.data.y;

        if (typeof x != "number" || typeof y != "number") {
          x = Game.area.data.entry.x;
          y = Game.area.data.entry.y;
        }

        this.infoBox.x = x;
        this.infoBox.y = y - this.sprite.center.y - 20;

        this.x = x;
        this.y = y;

        layer.appendChild(this.sprite);
        layer.appendChild(this.infoBox);
      }
    }, {
      key: "focus",
      value: function focus() {
        this.infoBox.x = this.x;
        this.infoBox.y = this.y - this.sprite.center.y - 20;

        Game.stage.center.x = Math.round(this.x - Game.config.width / 2);
        Game.stage.center.y = Math.round(this.y - Game.config.height / 2);
      }
    }, {
      key: "x",
      get: function get() {
        return this.sprite.x;
      },
      set: function set(v) {
        this.sprite.x = v;
      }
    }, {
      key: "y",
      get: function get() {
        return this.sprite.y;
      },
      set: function set(v) {
        this.sprite.y = v;
      }
    }]);

    return ActorClass;
  })(Sprite.Event); // ActorClass
})();