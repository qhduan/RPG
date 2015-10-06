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

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorHero", (function (_Game$Actor) {
    _inherits(GameActorHero, _Game$Actor);

    function GameActorHero(actorData) {
      var _this = this;

      _classCallCheck(this, GameActorHero);

      _get(Object.getPrototypeOf(GameActorHero.prototype), "constructor", this).call(this, actorData);
      var privates = internal(this);
      privates.ai = null;
      privates.beAttacking = new Set();

      this.on("kill", function (event) {
        var actor = event.data;

        if (_this.beAttacking.has(actor)) {
          _this.beAttacking["delete"](actor);
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
      });

      this.on("change", function () {
        _this.autoHide();
        _this.onto();
        _this.touch();
      });

      setInterval(function () {
        if (Game.paused == false) {
          _this.autoHide();
          _this.onto();
          _this.touch();
        }
      }, 500);
    }

    _createClass(GameActorHero, [{
      key: "popup",
      value: function popup(text) {
        Game.popup(this.sprite, text, 0, -50);
      }
    }, {
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
            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
              _iterator3["return"]();
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
            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
              _iterator5["return"]();
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
        Game.windows["interface"].status(this.data.hp / this.data.$hp, // 生命百分比
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
      key: "autoHide",
      value: function autoHide() {
        if (!Game.area) return;
        if (!Game.hero) return;

        var heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = Game.layers.mapHideLayer.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var layer = _step6.value;

            // console.log(heroHide, layer.name);
            if (layer.name == heroHide) {
              layer.visible = false;
            } else {
              layer.visible = true;
            }
          }

          // 检查需要隐藏的角色，例如建筑物里的npc
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

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = Game.area.actors[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var actor = _step7.value;

            if (actor != Game.hero) {
              var actorHide = Game.area.map.hitAutoHide(actor.x, actor.y);
              if (actorHide && actorHide == heroHide) {
                actor.visible = true;
              } else {
                if (actorHide) {
                  actor.visible = false;
                } else {
                  actor.visible = true;
                }
              }

              // 当npc紧挨着玩家所在格子的时候，自动面向玩家
              if (actor.distance(Game.hero) == 1) {
                var actorFace = actor.facePosition;
                if (actorFace.x != Game.hero.x || actorFace.y != Game.hero.y) {
                  if (actor.y == Game.hero.y) {
                    // 同一水平
                    if (actor.x < Game.hero.x) {
                      // npc 在玩家左边
                      actor.face("right");
                    } else if (actor.x > Game.hero.x) {
                      // npc在玩家右边
                      actor.face("left");
                    }
                  } else if (actor.x == Game.hero.x) {
                    // 同一垂直
                    if (actor.y < Game.hero.y) {
                      actor.face("down");
                    } else if (actor.y > Game.hero.y) {
                      actor.face("up");
                    }
                  }
                }
              }
            }
          }

          // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = Game.area.bags[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var bag = _step8.value;

            var bagHide = Game.area.map.hitAutoHide(bag.x, bag.y);
            if (bagHide && bagHide == heroHide) {
              bag.visible = true;
            } else {
              if (bagHide) {
                bag.visible = false;
              } else {
                bag.visible = true;
              }
            }
          }

          // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
              _iterator8["return"]();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Game.area.items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var item = _step9.value;

            var itemHide = Game.area.map.hitAutoHide(item.x, item.y);
            if (itemHide && itemHide == heroHide) {
              item.visible = true;
            } else {
              if (itemHide) {
                item.visible = false;
              } else {
                item.visible = true;
              }
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
              _iterator9["return"]();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }
      }
    }, {
      key: "gotoArea",
      value: function gotoArea(dest, x, y) {
        var privates = internal(this);
        privates.beAttacking = new Set();
        Game.pause();
        Game.windows["interface"].hide();
        Game.windows.stage.hide();
        Game.windows.loading.begin();
        Game.windows.loading.update("20%");
        setTimeout(function () {

          Game.clearStage();
          Game.windows.loading.update("50%");

          setTimeout(function () {

            Game.loadArea(dest).then(function (area) {

              Game.area = area;
              Game.windows.loading.update("80%");

              setTimeout(function () {

                Game.hero.data.area = dest;
                Game.hero.draw();
                Game.hero.x = x;
                Game.hero.y = y;
                area.actors.add(Game.hero);

                area.map.draw();
                Game.windows.loading.update("100%");

                setTimeout(function () {

                  Game.hero.x = x;
                  Game.hero.y = y;
                  Game.hero.data.time += 60; // 加一小时
                  Game.windows.loading.end();
                  Game.windows["interface"].datetime();
                  Game.windows["interface"].refresh();
                  Game.start();
                  setTimeout(function () {
                    Game.stage.update();
                    Game.windows.stage.show();
                    Game.windows["interface"].show();
                  }, 20);
                }, 20);
              }, 20);
            });
          }, 20);
        }, 20);
      }
    }, {
      key: "onto",
      value: function onto() {
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
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = element.points[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var p = _step10.value;

                if (p.x == heroPosition.x && p.y == heroPosition.y) {
                  onto = element;
                  return;
                }
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
                  _iterator10["return"]();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
            onto = element;
            return;
          }
        };
        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.execute) {
            onto.execute();
          }
        } // touch
      }
    }, {
      key: "touch",
      value: function touch() {
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
              var _iteratorNormalCompletion11 = true;
              var _didIteratorError11 = false;
              var _iteratorError11 = undefined;

              try {
                for (var _iterator11 = element.points[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                  var p = _step11.value;

                  if (p.x == heroPosition.x && p.y == heroPosition.y) {
                    onto = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
                    _iterator11["return"]();
                  }
                } finally {
                  if (_didIteratorError11) {
                    throw _iteratorError11;
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
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = element.points[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var p = _step12.value;

                  if (p.x == heroFace.x && p.y == heroFace.y) {
                    onto = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
                    _iterator12["return"]();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
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
        Sprite.each(Game.area.actors, FindUnderHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindUnderHero);
        // 找最近物品 Game.area.items
        Sprite.each(Game.area.items, FindUnderHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindUnderHero);

        // 用FindFaceHero寻找面对着玩家的格子地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindFaceHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindFaceHero);
        // 找最近尸体 Game.area.items
        Sprite.each(Game.area.items, FindFaceHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindFaceHero);
        // 水源
        if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
          touch = {
            type: "water",
            heroUse: function heroUse() {
              Game.popup(Game.hero.sprite, "This is water", 0, -50);
            }
          };
        }

        if (!touch) {
          Game.hintObject = null;
          Game.windows["interface"].hideUse();
        } else {
          Game.hintObject = touch;
          Game.windows["interface"].showUse();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsYUFBYTs7QUFDOUIsYUFEaUIsYUFBYSxDQUM3QixTQUFTLEVBQUU7Ozs0QkFESyxhQUFhOztBQUV4QyxpQ0FGMkIsYUFBYSw2Q0FFbEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUksTUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGdCQUFLLFdBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDbEIsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNqQyxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDcEI7Ozs7Ozs7QUFFRCwrQkFBa0IsTUFBSyxJQUFJLENBQUMsWUFBWSw4SEFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzs7Ozs7QUFDckMsc0NBQWMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1JQUFFO3NCQUF4QixDQUFDOztBQUNSLHNCQUFJLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDMUMscUJBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzttQkFDYjtpQkFDRjs7Ozs7Ozs7Ozs7Ozs7O2FBQ0Y7V0FDRjs7Ozs7Ozs7Ozs7Ozs7O09BRUYsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEIsY0FBSyxRQUFRLEVBQUUsQ0FBQztBQUNoQixjQUFLLElBQUksRUFBRSxDQUFDO0FBQ1osY0FBSyxLQUFLLEVBQUUsQ0FBQztPQUNkLENBQUMsQ0FBQzs7QUFFSCxpQkFBVyxDQUFDLFlBQU07QUFDaEIsWUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtBQUN4QixnQkFBSyxRQUFRLEVBQUUsQ0FBQztBQUNoQixnQkFBSyxJQUFJLEVBQUUsQ0FBQztBQUNaLGdCQUFLLEtBQUssRUFBRSxDQUFDO1NBQ2Q7T0FDRixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ1Q7O2lCQTdDNEIsYUFBYTs7YUErQ3BDLGVBQUMsSUFBSSxFQUFFO0FBQ1gsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUN2Qzs7O2FBVU8saUJBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUNsQixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDakQsZUFBSyxHQUFHLENBQUMsQ0FBQztTQUNYO0FBQ0QsYUFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUMvQixjQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUU7QUFDYixnQkFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDakMscUJBQU8sSUFBSSxDQUFDO2FBQ2IsTUFBTTtBQUNMLHFCQUFPLEtBQUssQ0FBQzthQUNkO1dBQ0Y7U0FDRjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLEVBQUUsRUFBRTs7Ozs7O0FBQ1osZ0NBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxtSUFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtBQUNsQixxQkFBTyxJQUFJLENBQUM7YUFDYjtXQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxnQ0FBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLG1JQUFFO2dCQUFsQyxLQUFLOztBQUNaLGdCQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO0FBQ2xCLHFCQUFPLElBQUksQ0FBQzthQUNiO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxlQUFPLEtBQUssQ0FBQztPQUNkOzs7YUFFTSxnQkFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFOzs7QUFDdkIsbUNBMUYyQixhQUFhLHdDQTBGM0IsUUFBUSxFQUFFLEtBQUssRUFBRTs7O0FBRzlCLFlBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQ3BCLGdDQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sbUlBQUU7Z0JBQTNCLEtBQUs7OztBQUVaLGdCQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlFLHdCQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxZQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7O0FBQ3JCLGdCQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDekIsZ0JBQUksWUFBWSxHQUFHLE9BQUssWUFBWSxDQUFDO0FBQ3JDLHNCQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQ2xDLGtCQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakQsNEJBQVksR0FBRyxJQUFJLENBQUM7ZUFDckI7YUFDRixDQUFDLENBQUM7O0FBRUgsZ0JBQUksWUFBWSxJQUFJLEtBQUssRUFBRTtBQUN6QixxQkFBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0M7O1NBQ0Y7T0FDRjs7O2FBRUssaUJBQUc7QUFDUCxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsbUNBckgyQixhQUFhLHVDQXFIMUI7O0FBRWQsWUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQ2YsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkMsa0JBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO09BQ0Y7OzthQUVVLHNCQUFHO0FBQ1osbUNBOUgyQixhQUFhLDRDQThIckI7QUFDbkIsWUFBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLE1BQU0sQ0FDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQzVCLFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztTQUM3QixDQUFDO09BQ0g7OzthQUVJLGdCQUFHOzs7QUFDTixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsbUNBdkkyQixhQUFhLHNDQXVJM0I7O0FBRWIsZ0JBQVEsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVoRCxjQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7QUFHM0IsY0FBSSxTQUFTLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUN2QixnQkFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOztBQUV2QixnQkFBSSxPQUFLLElBQUksQ0FBQyxFQUFFLEdBQUcsT0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQUssV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDOUQscUJBQUssSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2Ysd0JBQVUsR0FBRyxJQUFJLENBQUM7YUFDbkI7O0FBRUQsZ0JBQUksT0FBSyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQUssSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNoQyxxQkFBSyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDZix3QkFBVSxHQUFHLElBQUksQ0FBQzthQUNuQjs7QUFFRCxnQkFBSSxVQUFVLEVBQUU7QUFDZCxxQkFBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixrQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDNUIsb0JBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2VBQzlCO2FBQ0Y7V0FDRjtTQUVGLENBQUMsQ0FBQztPQUdKOzs7YUFFUSxvQkFBRztBQUNWLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU87QUFDdkIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFdkIsWUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7QUFFbkUsZ0NBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsbUlBQUU7Z0JBQTVDLEtBQUs7OztBQUdaLGdCQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO0FBQzFCLG1CQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzthQUN2QixNQUFNO0FBQ0wsbUJBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0QsZ0NBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxtSUFBRTtnQkFBM0IsS0FBSzs7QUFDWixnQkFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN0QixrQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELGtCQUFJLFNBQVMsSUFBSSxTQUFTLElBQUksUUFBUSxFQUFFO0FBQ3RDLHFCQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztlQUN0QixNQUFNO0FBQ0wsb0JBQUksU0FBUyxFQUFFO0FBQ2IsdUJBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2lCQUN2QixNQUFNO0FBQ0wsdUJBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUN0QjtlQUNGOzs7QUFHRCxrQkFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEMsb0JBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7QUFDbkMsb0JBQUksU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzVELHNCQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O0FBQzFCLHdCQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O0FBQ3pCLDJCQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTs7QUFDaEMsMkJBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3BCO21CQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFOztBQUNqQyx3QkFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLDJCQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNoQywyQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbEI7bUJBQ0Y7aUJBQ0Y7ZUFDRjthQUlGO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0QsZ0NBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxtSUFBRTtnQkFBdkIsR0FBRzs7QUFDVixnQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELGdCQUFJLE9BQU8sSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQ2xDLGlCQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUNwQixNQUFNO0FBQ0wsa0JBQUksT0FBTyxFQUFFO0FBQ1gsbUJBQUcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2VBQ3JCLE1BQU07QUFDTCxtQkFBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7ZUFDcEI7YUFDRjtXQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELGdDQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssbUlBQUU7Z0JBQXpCLElBQUk7O0FBQ1gsZ0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxnQkFBSSxRQUFRLElBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUNwQyxrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDckIsTUFBTTtBQUNMLGtCQUFJLFFBQVEsRUFBRTtBQUNaLG9CQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztlQUN0QixNQUFNO0FBQ0wsb0JBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2VBQ3JCO2FBQ0Y7V0FDRjs7Ozs7Ozs7Ozs7Ozs7O09BRUY7OzthQUVRLGtCQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLFlBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsa0JBQVUsQ0FBQyxZQUFZOztBQUVyQixjQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxvQkFBVSxDQUFDLFlBQVk7O0FBRXJCLGdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTs7QUFFdkMsa0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGtCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLHdCQUFVLENBQUMsWUFBWTs7QUFFckIsb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDM0Isb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsb0JBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixvQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLG9CQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLG9CQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLG9CQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBDLDBCQUFVLENBQUMsWUFBWTs7QUFFckIsc0JBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixzQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLHNCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzFCLHNCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixzQkFBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2xDLHNCQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsc0JBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLDRCQUFVLENBQUMsWUFBWTtBQUNyQix3QkFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQix3QkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsd0JBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzttQkFDL0IsRUFBRSxFQUFFLENBQUMsQ0FBQztpQkFDUixFQUFFLEVBQUUsQ0FBQyxDQUFDO2VBQ1IsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNSLENBQUMsQ0FBQztXQUVKLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDUixFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ1I7OzthQUVJLGdCQUFHO0FBQ04sWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUN2QixZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFNUIsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDdEMsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixZQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQWEsT0FBTyxFQUFFO0FBQ3JDLGNBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN4QyxtQkFBTztXQUNSO0FBQ0QsY0FBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEUsZ0JBQUksR0FBRyxPQUFPLENBQUM7QUFDZixtQkFBTztXQUNSLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFOzs7Ozs7QUFDekIscUNBQWMsT0FBTyxDQUFDLE1BQU0sd0lBQUU7b0JBQXJCLENBQUM7O0FBQ1Isb0JBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsRUFBRTtBQUNsRCxzQkFBSSxHQUFHLE9BQU8sQ0FBQztBQUNmLHlCQUFPO2lCQUNSO2VBQ0Y7Ozs7Ozs7Ozs7Ozs7OztXQUNGLE1BQU0sSUFDTCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsSUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUMzQjtBQUNBLGdCQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsbUJBQU87V0FDUjtTQUNGLENBQUE7O0FBRUQsY0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUMzQyxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1dBQ2hCO1NBQ0Y7T0FDRjs7O2FBRUssaUJBQUc7QUFDUCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPO0FBQ3ZCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPOztBQUU3QixZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN0QyxZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUN0QyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFlBQUksYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBYSxPQUFPLEVBQUU7QUFDckMsY0FBSSxLQUFLLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3pDLG1CQUFPO1dBQ1I7QUFDRCxjQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsZ0JBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RFLG1CQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLHFCQUFPO2FBQ1IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Ozs7OztBQUN6Qix1Q0FBYyxPQUFPLENBQUMsTUFBTSx3SUFBRTtzQkFBckIsQ0FBQzs7QUFDUixzQkFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQ2xELHdCQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsMkJBQU87bUJBQ1I7aUJBQ0Y7Ozs7Ozs7Ozs7Ozs7OzthQUNGLE1BQU0sSUFDTCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsSUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUMzQjtBQUNBLG1CQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLHFCQUFPO2FBQ1I7V0FDRjtTQUNGLENBQUE7O0FBRUQsWUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQWEsT0FBTyxFQUFFO0FBQ3BDLGNBQUksS0FBSyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN6QyxtQkFBTztXQUNSO0FBQ0QsY0FBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGdCQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM5RCxtQkFBSyxHQUFHLE9BQU8sQ0FBQzthQUNqQixNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTs7Ozs7O0FBQ3pCLHVDQUFjLE9BQU8sQ0FBQyxNQUFNLHdJQUFFO3NCQUFyQixDQUFDOztBQUNSLHNCQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUMsd0JBQUksR0FBRyxPQUFPLENBQUM7QUFDZiwyQkFBTzttQkFDUjtpQkFDRjs7Ozs7Ozs7Ozs7Ozs7O2FBQ0YsTUFBTSxJQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsT0FBTyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUN2QixPQUFPLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQ3ZCO0FBQ0EsbUJBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIscUJBQU87YUFDUjtXQUNGO1NBQ0YsQ0FBQTs7Ozs7QUFLRCxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUU3QyxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUUzQyxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUU1QyxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7O0FBS3ZDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTVDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTFDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTNDLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsZUFBSyxHQUFHO0FBQ04sZ0JBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQU8sRUFBRSxtQkFBWTtBQUNuQixrQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDdkQ7V0FDRixDQUFDO1NBQ0g7O0FBRUQsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLGNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsY0FBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO09BQ0Y7OztXQTFZZSxlQUFHO0FBQ2pCLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztPQUNuQztXQUVlLGFBQUMsS0FBSyxFQUFFO0FBQ3RCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztPQUNuRDs7O1dBekQ0QixhQUFhO0tBQVMsSUFBSSxDQUFDLEtBQUssRUFnYzdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3JIZXJvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgIOiLsembhOexu1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JIZXJvXCIsIGNsYXNzIEdhbWVBY3Rvckhlcm8gZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICBwcml2YXRlcy5iZUF0dGFja2luZyA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5vbihcImtpbGxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBhY3RvciA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuYmVBdHRhY2tpbmcuaGFzKGFjdG9yKSkge1xuICAgICAgICAgIHRoaXMuYmVBdHRhY2tpbmcuZGVsZXRlKGFjdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhY3Rvci5kYXRhLmV4cCkge1xuICAgICAgICAgIHRoaXMuZGF0YS5leHAgKz0gYWN0b3IuZGF0YS5leHA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kYXRhLmV4cCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcXVlc3Qgb2YgdGhpcy5kYXRhLmN1cnJlbnRRdWVzdCkge1xuICAgICAgICAgIGlmIChxdWVzdC50YXJnZXQgJiYgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgb2YgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgICAgaWYgKGFjdG9yLmlkID09IGsuaWQgJiYgay5jdXJyZW50IDwgay5uZWVkKSB7XG4gICAgICAgICAgICAgICAgay5jdXJyZW50Kys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmF1dG9IaWRlKCk7XG4gICAgICAgIHRoaXMub250bygpO1xuICAgICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoR2FtZS5wYXVzZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLmF1dG9IaWRlKCk7XG4gICAgICAgICAgdGhpcy5vbnRvKCk7XG4gICAgICAgICAgdGhpcy50b3VjaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIHBvcHVwICh0ZXh0KSB7XG4gICAgICBHYW1lLnBvcHVwKHRoaXMuc3ByaXRlLCB0ZXh0LCAwLCAtNTApO1xuICAgIH1cblxuICAgIGdldCBiZUF0dGFja2luZyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmVBdHRhY2tpbmc7XG4gICAgfVxuXG4gICAgc2V0IGJlQXR0YWNraW5nICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5oZXJvLmJlQXR0YWNraW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhhc0l0ZW0gKGlkLCBjb3VudCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb3VudCkgPT0gZmFsc2UgfHwgY291bnQgPD0gMCkge1xuICAgICAgICBjb3VudCA9IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5kYXRhLml0ZW1zKSB7XG4gICAgICAgIGlmIChrZXkgPT0gaWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLml0ZW1zW2tleV0gPj0gY291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzUXVlc3QgKGlkKSB7XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgIGlmIChpZCA9PSBxdWVzdC5pZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY29tcGxldGVRdWVzdCkge1xuICAgICAgICBpZiAoaWQgPT0gcXVlc3QuaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRhbWFnZSAoYXR0YWNrZXIsIHNraWxsKSB7XG4gICAgICBzdXBlci5kYW1hZ2UoYXR0YWNrZXIsIHNraWxsKTtcblxuICAgICAgLy8g5aaC5p6c6Iux6ZuE5Y+X5Yiw5LqG5Lyk5a6zXG4gICAgICBsZXQgdG91Y2hBY3RvciA9IFtdO1xuICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAvLyDmib7liLDmiYDmnInpgrvmjqXoi7Hpm4TnmoTmgKrnialcbiAgICAgICAgaWYgKGFjdG9yICE9IHRoaXMgJiYgYWN0b3IuZGF0YS50eXBlID09IFwibW9uc3RlclwiICYmIGFjdG9yLmRpc3RhbmNlKHRoaXMpID09IDEpIHtcbiAgICAgICAgICB0b3VjaEFjdG9yLnB1c2goYWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodG91Y2hBY3Rvci5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGZhY2VBdHRhY2tlciA9IGZhbHNlO1xuICAgICAgICBsZXQgZmFjZVBvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG4gICAgICAgIHRvdWNoQWN0b3IuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICBpZiAoYWN0b3IuaGl0VGVzdChmYWNlUG9zaXRpb24ueCwgZmFjZVBvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICBmYWNlQXR0YWNrZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWmguaenOiLsembhOeOsOWcqOayoemdouWvueS7u+S9leS4gOS4qumCu+aOpeeahOaAqueJqe+8jOmdouWQkeWug1xuICAgICAgICBpZiAoZmFjZUF0dGFja2VyID09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5nb3RvKHRvdWNoQWN0b3JbMF0ueCwgdG91Y2hBY3RvclswXS55KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIHN1cGVyLnJlZnJlc2hCYXIoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc3RhdHVzKFxuICAgICAgICB0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwLCAvLyDnlJ/lkb3nmb7liIbmr5RcbiAgICAgICAgdGhpcy5kYXRhLnNwIC8gdGhpcy5kYXRhLiRzcCAvLyDnsr7npZ7lipvnmb7liIbmr5RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHN1cGVyLmRyYXcoKTtcblxuICAgICAgcHJpdmF0ZXMuYWkgPSBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCAoZXZlbnQpID0+IHtcblxuICAgICAgICBsZXQgdGlja0NvdW50ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAvLyDmr4/np5IxNuS4qnRpY2tcbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDE2ID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgdGhpcy5iZUF0dGFja2luZy5zaXplIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ocCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5zcCA8IHRoaXMuZGF0YS4kc3ApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zcCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJhckNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgICAgaWYgKEdhbWUud2luZG93cy5zdGF0dXMuYXRvcCkge1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhdHVzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuXG4gICAgfVxuXG4gICAgYXV0b0hpZGUgKCkge1xuICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgIGlmICghR2FtZS5oZXJvKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvSGlkZSA9IEdhbWUuYXJlYS5tYXAuaGl0QXV0b0hpZGUoR2FtZS5oZXJvLngsIEdhbWUuaGVyby55KTtcblxuICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgR2FtZS5sYXllcnMubWFwSGlkZUxheWVyLmNoaWxkcmVuKSB7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKGhlcm9IaWRlLCBsYXllci5uYW1lKTtcbiAgICAgICAgaWYgKGxheWVyLm5hbWUgPT0gaGVyb0hpZGUpIHtcbiAgICAgICAgICBsYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGF5ZXIudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g5qOA5p+l6ZyA6KaB6ZqQ6JeP55qE6KeS6Imy77yM5L6L5aaC5bu6562R54mp6YeM55qEbnBjXG4gICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgIGlmIChhY3RvciAhPSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICBsZXQgYWN0b3JIaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShhY3Rvci54LCBhY3Rvci55KTtcbiAgICAgICAgICBpZiAoYWN0b3JIaWRlICYmIGFjdG9ySGlkZSA9PSBoZXJvSGlkZSkge1xuICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhY3RvckhpZGUpIHtcbiAgICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g5b2TbnBj57Sn5oyo552A546p5a625omA5Zyo5qC85a2Q55qE5pe25YCZ77yM6Ieq5Yqo6Z2i5ZCR546p5a62XG4gICAgICAgICAgaWYgKGFjdG9yLmRpc3RhbmNlKEdhbWUuaGVybykgPT0gMSkge1xuICAgICAgICAgICAgbGV0IGFjdG9yRmFjZSA9IGFjdG9yLmZhY2VQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChhY3RvckZhY2UueCAhPSBHYW1lLmhlcm8ueCB8fCBhY3RvckZhY2UueSAhPSBHYW1lLmhlcm8ueSkge1xuICAgICAgICAgICAgICBpZiAoYWN0b3IueSA9PSBHYW1lLmhlcm8ueSkgeyAvLyDlkIzkuIDmsLTlubNcbiAgICAgICAgICAgICAgICBpZiAoYWN0b3IueCA8IEdhbWUuaGVyby54KSB7IC8vIG5wYyDlnKjnjqnlrrblt6bovrlcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yLnggPiBHYW1lLmhlcm8ueCkgeyAvLyBucGPlnKjnjqnlrrblj7PovrlcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJsZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rvci54ID09IEdhbWUuaGVyby54KSB7IC8vIOWQjOS4gOWeguebtFxuICAgICAgICAgICAgICAgIGlmIChhY3Rvci55IDwgR2FtZS5oZXJvLnkpIHtcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJkb3duXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3IueSA+IEdhbWUuaGVyby55KSB7XG4gICAgICAgICAgICAgICAgICBhY3Rvci5mYWNlKFwidXBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpemcgOimgemakOiXj+eahOWwj+WMheWMhe+8jOS+i+WmguW7uuetkeeJqeS4reWcsOS4i+eOqeWutuaJlOS4i+eahOeJqeWTgVxuICAgICAgZm9yIChsZXQgYmFnIG9mIEdhbWUuYXJlYS5iYWdzKSB7XG4gICAgICAgIGxldCBiYWdIaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShiYWcueCwgYmFnLnkpO1xuICAgICAgICBpZiAoYmFnSGlkZSAmJiBiYWdIaWRlID09IGhlcm9IaWRlKSB7XG4gICAgICAgICAgYmFnLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiYWdIaWRlKSB7XG4gICAgICAgICAgICBiYWcudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYWcudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpemcgOimgemakOiXj+eahOWwj+WMheWMhe+8jOS+i+WmguW7uuetkeeJqeS4reWcsOS4i+eOqeWutuaJlOS4i+eahOeJqeWTgVxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBHYW1lLmFyZWEuaXRlbXMpIHtcbiAgICAgICAgbGV0IGl0ZW1IaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShpdGVtLngsIGl0ZW0ueSk7XG4gICAgICAgIGlmIChpdGVtSGlkZSAmJiBpdGVtSGlkZSA9PSBoZXJvSGlkZSkge1xuICAgICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW1IaWRlKSB7XG4gICAgICAgICAgICBpdGVtLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIGdvdG9BcmVhIChkZXN0LCB4LCB5KSB7XG4gICAgICB2YXIgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmJlQXR0YWNraW5nID0gbmV3IFNldCgpO1xuICAgICAgR2FtZS5wYXVzZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3Muc3RhZ2UuaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcbiAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjIwJVwiKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCI1MCVcIik7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBHYW1lLmxvYWRBcmVhKGRlc3QpLnRoZW4oZnVuY3Rpb24gKGFyZWEpIHtcblxuICAgICAgICAgICAgR2FtZS5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjgwJVwiKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuYXJlYSA9IGRlc3Q7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby54ID0geDtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICBhcmVhLmFjdG9ycy5hZGQoR2FtZS5oZXJvKTtcblxuICAgICAgICAgICAgICBhcmVhLm1hcC5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjEwMCVcIik7XG5cbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8ueCA9IHg7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLnRpbWUgKz0gNjA7IC8vIOWKoOS4gOWwj+aXtlxuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLmVuZCgpO1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuZGF0ZXRpbWUoKTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICBHYW1lLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBHYW1lLnN0YWdlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLnNob3coKTtcbiAgICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sIDIwKTtcbiAgICAgICAgICAgICAgfSwgMjApO1xuICAgICAgICAgICAgfSwgMjApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIDIwKTtcbiAgICAgIH0sIDIwKTtcbiAgICB9XG5cbiAgICBvbnRvICgpIHtcbiAgICAgIGlmICghR2FtZS5hcmVhKSByZXR1cm47XG4gICAgICBpZiAoIUdhbWUuYXJlYS5vbnRvKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvUG9zaXRpb24gPSBHYW1lLmhlcm8ucG9zaXRpb247XG4gICAgICBsZXQgb250byA9IG51bGw7XG5cbiAgICAgIGxldCBGaW5kVW5kZXJIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG9udG8gIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvUG9zaXRpb24ueCAmJiBwLnkgPT0gaGVyb1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueCkgJiZcbiAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvUG9zaXRpb24ueCAmJlxuICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvUG9zaXRpb24ueVxuICAgICAgICApIHtcbiAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEub250bywgRmluZFVuZGVySGVybyk7XG4gICAgICBpZiAob250bykge1xuICAgICAgICBpZiAob250by5leGVjdXRlKSB7XG4gICAgICAgICAgb250by5leGVjdXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gdG91Y2hcbiAgICB9XG5cbiAgICB0b3VjaCAoKSB7XG4gICAgICBpZiAoIUdhbWUuYXJlYSkgcmV0dXJuO1xuICAgICAgaWYgKCFHYW1lLmFyZWEudG91Y2gpIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBoZXJvRmFjZSA9IEdhbWUuaGVyby5mYWNlUG9zaXRpb247XG4gICAgICBsZXQgdG91Y2ggPSBudWxsO1xuXG4gICAgICBsZXQgRmluZFVuZGVySGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvUG9zaXRpb24ueCAmJlxuICAgICAgICAgICAgZWxlbWVudC55ID09IGhlcm9Qb3NpdGlvbi55XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBGaW5kRmFjZUhlcm8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAodG91Y2ggIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oZXJvVXNlKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaGl0VGVzdCAmJiBlbGVtZW50LmhpdFRlc3QoaGVyb0ZhY2UueCwgaGVyb0ZhY2UueSkpIHtcbiAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICAgIGlmIChwLnggPT0gaGVyb0ZhY2UueCAmJiBwLnkgPT0gaGVyb0ZhY2UueSkge1xuICAgICAgICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvRmFjZS54ICYmXG4gICAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb0ZhY2UueVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDnlKhGaW5kVW5kZXJIZXJv5Ye95pWw5a+75om+5Yiw546p5a625b2T5YmN5qC85a2Q55qE5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R54mp5ZOBIEdhbWUuYXJlYS5pdGVtc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLml0ZW1zLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZFVuZGVySGVybyk7XG5cbiAgICAgIC8vIOeUqEZpbmRGYWNlSGVyb+Wvu+aJvumdouWvueedgOeOqeWutueahOagvOWtkOWcsOeCuVxuXG4gICAgICAvLyDmib7mnIDov5Hlj6/igJzkuovku7bigJ3kurrniakgR2FtZS5hcmVhLmFjdG9yc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmFjdG9ycywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmib7mnIDov5HlsLjkvZMgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDlhbbku5bnianlk4HvvIjnlLHlnLDlm77mlofku7blrprkuYnvvIlcbiAgICAgIEdhbWUuYXJlYS50b3VjaC5mb3JFYWNoKEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmsLTmupBcbiAgICAgIGlmICghdG91Y2ggJiYgR2FtZS5hcmVhLm1hcC5oaXRXYXRlcihoZXJvRmFjZS54LCBoZXJvRmFjZS55KSkge1xuICAgICAgICB0b3VjaCA9IHtcbiAgICAgICAgICB0eXBlOiBcIndhdGVyXCIsXG4gICAgICAgICAgaGVyb1VzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR2FtZS5wb3B1cChHYW1lLmhlcm8uc3ByaXRlLCBcIlRoaXMgaXMgd2F0ZXJcIiwgMCwgLTUwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gpIHtcbiAgICAgICAgR2FtZS5oaW50T2JqZWN0ID0gbnVsbDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlVXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QgPSB0b3VjaDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93VXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
