"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorHero", (function (_Game$Actor) {
    _inherits(GameActorHero, _Game$Actor);

    function GameActorHero(actorData) {
      _classCallCheck(this, GameActorHero);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorHero).call(this, actorData));

      var privates = internal(_this);
      privates.ai = null;
      privates.beAttacking = new Set();

      _this.on("kill", function (event) {
        var actor = event.data;

        if (_this.beAttacking.has(actor)) {
          _this.beAttacking.delete(actor);
        }

        if (actor.data.exp) {
          _this.data.exp += actor.data.exp;
        } else {
          _this.data.exp += 1;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this.data.currentQuest[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var quest = _step.value;

            if (quest.target && quest.target.kill) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var k = _step2.value;

                  if (actor.id == k.id && k.current < k.need) {
                    k.current++;
                  }
                }
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
      });

      _this.on("change", function () {
        _this.whenOnto();
        _this.whenTouch();
      });

      setInterval(function () {
        if (!Game.paused) {
          _this.whenOnto();
          _this.whenTouch();
        }
      }, 500);
      return _this;
    }

    _createClass(GameActorHero, [{
      key: "hasItem",
      value: function hasItem(id, count) {
        if (Number.isFinite(count) == false || count <= 0) {
          count = 1;
        }
        for (var key in this.data.items) {
          if (key == id) {
            if (this.data.items[key] >= count) {
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    }, {
      key: "hasQuest",
      value: function hasQuest(id) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.data.currentQuest[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var quest = _step3.value;

            if (id == quest.id) {
              return true;
            }
          }
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

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.data.completeQuest[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var quest = _step4.value;

            if (id == quest.id) {
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

        return false;
      }
    }, {
      key: "damage",
      value: function damage(attacker, skill) {
        var _this2 = this;

        _get(Object.getPrototypeOf(GameActorHero.prototype), "damage", this).call(this, attacker, skill);

        // 如果英雄受到了伤害
        var touchActor = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = Game.area.actors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var actor = _step5.value;

            // 找到所有邻接英雄的怪物
            if (actor != this && actor.data.type == "monster" && actor.distance(this) == 1) {
              touchActor.push(actor);
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

        if (touchActor.length) {
          (function () {
            var faceAttacker = false;
            var facePosition = _this2.facePosition;
            touchActor.forEach(function (actor) {
              if (actor.hitTest(facePosition.x, facePosition.y)) {
                faceAttacker = true;
              }
            });
            // 如果英雄现在没面对任何一个邻接的怪物，面向它
            if (faceAttacker == false) {
              _this2.goto(touchActor[0].x, touchActor[0].y);
            }
          })();
        }
      }
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        _get(Object.getPrototypeOf(GameActorHero.prototype), "refreshBar", this).call(this);
        Game.windows.interface.status(this.data.hp / this.data.$hp, // 生命百分比
        this.data.sp / this.data.$sp // 精神力百分比
        );
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this3 = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "draw", this).call(this);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          var tickCount = event.data;

          // 每秒16个tick
          if (tickCount % 16 == 0) {
            var barChanged = false;

            if (_this3.data.hp < _this3.data.$hp && _this3.beAttacking.size <= 0) {
              _this3.data.hp++;
              barChanged = true;
            }

            if (_this3.data.sp < _this3.data.$sp) {
              _this3.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this3.refreshBar();
              if (Game.windows.status.atop) {
                Game.windows.status.update();
              }
            }
          }
        });
      }
    }, {
      key: "gotoArea",
      value: function gotoArea(dest, x, y) {
        var privates = internal(this);
        privates.beAttacking = new Set();

        Sprite.Util.timeout(5).then(function () {

          Game.pause();
          Game.windows.interface.hide();
          Game.windows.stage.hide();
          Game.windows.loading.begin();
          Game.windows.loading.update("30%");
          return Sprite.Util.timeout(5);
        }).then(function () {

          Game.clearStage();
          return Game.loadArea(dest);
        }).then(function (area) {

          Game.area = area;
          Game.windows.loading.update("50%");
          return Sprite.Util.timeout(5);
        }).then(function () {

          Game.hero.data.area = dest;
          Game.hero.draw();
          Game.hero.x = x;
          Game.hero.y = y;
          Game.area.actors.add(Game.hero);
          Game.area.map.draw();
          Game.windows.loading.update("80%");
          return Sprite.Util.timeout(5);
        }).then(function () {

          Game.hero.x = x;
          Game.hero.y = y;
          Game.hero.data.time += 60; // 加一小时
          Game.windows.loading.end();
          Game.windows.interface.datetime();
          Game.windows.interface.refresh();
          Game.start();
          Game.windows.loading.update("100%");
          return Sprite.Util.timeout(5);
        }).then(function () {

          Game.stage.update();
          Game.windows.stage.show();
          Game.windows.interface.show();
        });
      }

      // 当玩家站到某个点的时候执行的命令

    }, {
      key: "whenOnto",
      value: function whenOnto() {
        if (!Game.area) return;
        if (!Game.area.onto) return;

        var heroPosition = Game.hero.position;
        var onto = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (onto != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            onto = element;
            return;
          } else if (element.points) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = element.points[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var p = _step6.value;

                if (p.x == heroPosition.x && p.y == heroPosition.y) {
                  onto = element;
                  return;
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
          } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
            onto = element;
            return;
          }
        };
        // 找最近可“事件”人物 Game.area.actors
        Sprite.Util.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.execute) {
            onto.execute();
          }
        } // touch
      }

      // 当玩家站到或者接触到某个点时执行的命令

    }, {
      key: "whenTouch",
      value: function whenTouch() {
        if (!Game.area) return;
        if (!Game.area.touch) return;

        var heroPosition = Game.hero.position;
        var heroFace = Game.hero.facePosition;
        var touch = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
              touch = element;
              return;
            } else if (element.points) {
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                for (var _iterator7 = element.points[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  var p = _step7.value;

                  if (p.x == heroPosition.x && p.y == heroPosition.y) {
                    touch = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
              touch = element;
              return;
            }
          }
        };

        var FindFaceHero = function FindFaceHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
              touch = element;
            } else if (element.points) {
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = element.points[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var p = _step8.value;

                  if (p.x == heroFace.x && p.y == heroFace.y) {
                    touch = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroFace.x && element.y == heroFace.y) {
              touch = element;
              return;
            }
          }
        };

        // 用FindUnderHero函数寻找到玩家当前格子的地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.Util.each(Game.area.actors, FindUnderHero);
        // 找最近尸体 Game.area.bags
        Sprite.Util.each(Game.area.bags, FindUnderHero);
        // 找最近物品 Game.area.items
        Sprite.Util.each(Game.area.items, FindUnderHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindUnderHero);

        // 用FindFaceHero寻找面对着玩家的格子地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.Util.each(Game.area.actors, FindFaceHero);
        // 找最近尸体 Game.area.bags
        Sprite.Util.each(Game.area.bags, FindFaceHero);
        // 找最近尸体 Game.area.items
        Sprite.Util.each(Game.area.items, FindFaceHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindFaceHero);
        // 水源
        if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
          touch = {
            type: "water",
            heroUse: function heroUse() {
              Game.choice({
                "喝水": "drink",
                "钓鱼": "fish"
              }).then(function (choice) {
                switch (choice) {
                  case "drink":
                    Game.hero.popup("drink");
                    break;
                  case "fish":
                    Game.hero.popup("fish");
                    break;
                }
              });
            }
          };
        }

        if (!touch) {
          Game.hintObject = null;
          Game.windows.interface.hideUse();
        } else {
          Game.hintObject = touch;
          Game.windows.interface.showUse();
        }
      }
    }, {
      key: "beAttacking",
      get: function get() {
        return internal(this).beAttacking;
      },
      set: function set(value) {
        throw new Error("Game.hero.beAttacking readonly");
      }
    }]);

    return GameActorHero;
  })(Game.Actor));
})();