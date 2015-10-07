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
        _this.onto();
        _this.touch();
      });

      setInterval(function () {
        if (!Game.paused) {
          _this.onto();
          _this.touch();
        }
      }, 500);
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
                  }, 5);
                }, 5);
              }, 5);
            }); // loadArea
          }, 5);
        }, 5);
      }

      // 当玩家站到某个点的时候执行的命令
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
                if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                  _iterator6["return"]();
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
        Sprite.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.execute) {
            onto.execute();
          }
        } // touch
      }

      // 当玩家站到或者接触到某个点时执行的命令
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
                  if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
                    _iterator7["return"]();
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
                  if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
                    _iterator8["return"]();
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
              this.popup("This is water");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsYUFBYTs7QUFDOUIsYUFEaUIsYUFBYSxDQUM3QixTQUFTLEVBQUU7Ozs0QkFESyxhQUFhOztBQUV4QyxpQ0FGMkIsYUFBYSw2Q0FFbEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUksTUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGdCQUFLLFdBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDbEIsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNqQyxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDcEI7Ozs7Ozs7QUFFRCwrQkFBa0IsTUFBSyxJQUFJLENBQUMsWUFBWSw4SEFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FB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Z0NBQWdDLENBQUMsQ0FBQztPQUNuRDs7O1dBbkQ0QixhQUFhO0tBQVMsSUFBSSxDQUFDLEtBQUssRUF5VzdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3JIZXJvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgIOiLsembhOexu1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JIZXJvXCIsIGNsYXNzIEdhbWVBY3Rvckhlcm8gZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICBwcml2YXRlcy5iZUF0dGFja2luZyA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5vbihcImtpbGxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBhY3RvciA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuYmVBdHRhY2tpbmcuaGFzKGFjdG9yKSkge1xuICAgICAgICAgIHRoaXMuYmVBdHRhY2tpbmcuZGVsZXRlKGFjdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhY3Rvci5kYXRhLmV4cCkge1xuICAgICAgICAgIHRoaXMuZGF0YS5leHAgKz0gYWN0b3IuZGF0YS5leHA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kYXRhLmV4cCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcXVlc3Qgb2YgdGhpcy5kYXRhLmN1cnJlbnRRdWVzdCkge1xuICAgICAgICAgIGlmIChxdWVzdC50YXJnZXQgJiYgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgb2YgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgICAgaWYgKGFjdG9yLmlkID09IGsuaWQgJiYgay5jdXJyZW50IDwgay5uZWVkKSB7XG4gICAgICAgICAgICAgICAgay5jdXJyZW50Kys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9udG8oKTtcbiAgICAgICAgdGhpcy50b3VjaCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKCAhR2FtZS5wYXVzZWQgKSB7XG4gICAgICAgICAgdGhpcy5vbnRvKCk7XG4gICAgICAgICAgdGhpcy50b3VjaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIGdldCBiZUF0dGFja2luZyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmVBdHRhY2tpbmc7XG4gICAgfVxuXG4gICAgc2V0IGJlQXR0YWNraW5nICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5oZXJvLmJlQXR0YWNraW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhhc0l0ZW0gKGlkLCBjb3VudCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb3VudCkgPT0gZmFsc2UgfHwgY291bnQgPD0gMCkge1xuICAgICAgICBjb3VudCA9IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5kYXRhLml0ZW1zKSB7XG4gICAgICAgIGlmIChrZXkgPT0gaWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLml0ZW1zW2tleV0gPj0gY291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzUXVlc3QgKGlkKSB7XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgIGlmIChpZCA9PSBxdWVzdC5pZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY29tcGxldGVRdWVzdCkge1xuICAgICAgICBpZiAoaWQgPT0gcXVlc3QuaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRhbWFnZSAoYXR0YWNrZXIsIHNraWxsKSB7XG4gICAgICBzdXBlci5kYW1hZ2UoYXR0YWNrZXIsIHNraWxsKTtcblxuICAgICAgLy8g5aaC5p6c6Iux6ZuE5Y+X5Yiw5LqG5Lyk5a6zXG4gICAgICBsZXQgdG91Y2hBY3RvciA9IFtdO1xuICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAvLyDmib7liLDmiYDmnInpgrvmjqXoi7Hpm4TnmoTmgKrnialcbiAgICAgICAgaWYgKGFjdG9yICE9IHRoaXMgJiYgYWN0b3IuZGF0YS50eXBlID09IFwibW9uc3RlclwiICYmIGFjdG9yLmRpc3RhbmNlKHRoaXMpID09IDEpIHtcbiAgICAgICAgICB0b3VjaEFjdG9yLnB1c2goYWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodG91Y2hBY3Rvci5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGZhY2VBdHRhY2tlciA9IGZhbHNlO1xuICAgICAgICBsZXQgZmFjZVBvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG4gICAgICAgIHRvdWNoQWN0b3IuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICBpZiAoYWN0b3IuaGl0VGVzdChmYWNlUG9zaXRpb24ueCwgZmFjZVBvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICBmYWNlQXR0YWNrZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWmguaenOiLsembhOeOsOWcqOayoemdouWvueS7u+S9leS4gOS4qumCu+aOpeeahOaAqueJqe+8jOmdouWQkeWug1xuICAgICAgICBpZiAoZmFjZUF0dGFja2VyID09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5nb3RvKHRvdWNoQWN0b3JbMF0ueCwgdG91Y2hBY3RvclswXS55KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIHN1cGVyLnJlZnJlc2hCYXIoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc3RhdHVzKFxuICAgICAgICB0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwLCAvLyDnlJ/lkb3nmb7liIbmr5RcbiAgICAgICAgdGhpcy5kYXRhLnNwIC8gdGhpcy5kYXRhLiRzcCAvLyDnsr7npZ7lipvnmb7liIbmr5RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHN1cGVyLmRyYXcoKTtcblxuICAgICAgcHJpdmF0ZXMuYWkgPSBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCAoZXZlbnQpID0+IHtcblxuICAgICAgICBsZXQgdGlja0NvdW50ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAvLyDmr4/np5IxNuS4qnRpY2tcbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDE2ID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgdGhpcy5iZUF0dGFja2luZy5zaXplIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ocCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5zcCA8IHRoaXMuZGF0YS4kc3ApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zcCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJhckNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgICAgaWYgKEdhbWUud2luZG93cy5zdGF0dXMuYXRvcCkge1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhdHVzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgZ290b0FyZWEgKGRlc3QsIHgsIHkpIHtcbiAgICAgIHZhciBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuYmVBdHRhY2tpbmcgPSBuZXcgU2V0KCk7XG4gICAgICBHYW1lLnBhdXNlKCk7XG4gICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5zdGFnZS5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5iZWdpbigpO1xuICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiMjAlXCIpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBHYW1lLmNsZWFyU3RhZ2UoKTtcbiAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiNTAlXCIpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgR2FtZS5sb2FkQXJlYShkZXN0KS50aGVuKGZ1bmN0aW9uIChhcmVhKSB7XG5cbiAgICAgICAgICAgIEdhbWUuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCI4MCVcIik7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmFyZWEgPSBkZXN0O1xuICAgICAgICAgICAgICBHYW1lLmhlcm8uZHJhdygpO1xuICAgICAgICAgICAgICBHYW1lLmhlcm8ueCA9IHg7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby55ID0geTtcbiAgICAgICAgICAgICAgYXJlYS5hY3RvcnMuYWRkKEdhbWUuaGVybyk7XG5cbiAgICAgICAgICAgICAgYXJlYS5tYXAuZHJhdygpO1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCIxMDAlXCIpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLnggPSB4O1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby55ID0geTtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS50aW1lICs9IDYwOyAvLyDliqDkuIDlsI/ml7ZcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5lbmQoKTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmRhdGV0aW1lKCk7XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgR2FtZS5zdGFydCgpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhZ2Uuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgICAgIH0sIDUpO1xuICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgfSk7IC8vIGxvYWRBcmVhXG4gICAgICAgIH0sIDUpO1xuICAgICAgfSwgNSk7XG4gICAgfVxuXG4gICAgLy8g5b2T546p5a6256uZ5Yiw5p+Q5Liq54K555qE5pe25YCZ5omn6KGM55qE5ZG95LukXG4gICAgb250byAoKSB7XG4gICAgICBpZiAoIUdhbWUuYXJlYSkgcmV0dXJuO1xuICAgICAgaWYgKCFHYW1lLmFyZWEub250bykgcmV0dXJuO1xuXG4gICAgICBsZXQgaGVyb1Bvc2l0aW9uID0gR2FtZS5oZXJvLnBvc2l0aW9uO1xuICAgICAgbGV0IG9udG8gPSBudWxsO1xuXG4gICAgICBsZXQgRmluZFVuZGVySGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChvbnRvICE9IG51bGwgfHwgZWxlbWVudCA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQuaGl0VGVzdCAmJiBlbGVtZW50LmhpdFRlc3QoaGVyb1Bvc2l0aW9uLngsIGhlcm9Qb3NpdGlvbi55KSkge1xuICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgIGZvciAobGV0IHAgb2YgZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgIGlmIChwLnggPT0gaGVyb1Bvc2l0aW9uLnggJiYgcC55ID09IGhlcm9Qb3NpdGlvbi55KSB7XG4gICAgICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICBlbGVtZW50LnggPT0gaGVyb1Bvc2l0aW9uLnggJiZcbiAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb1Bvc2l0aW9uLnlcbiAgICAgICAgKSB7XG4gICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyDmib7mnIDov5Hlj6/igJzkuovku7bigJ3kurrniakgR2FtZS5hcmVhLmFjdG9yc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLm9udG8sIEZpbmRVbmRlckhlcm8pO1xuICAgICAgaWYgKG9udG8pIHtcbiAgICAgICAgaWYgKG9udG8uZXhlY3V0ZSkge1xuICAgICAgICAgIG9udG8uZXhlY3V0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IC8vIHRvdWNoXG4gICAgfVxuXG4gICAgLy8g5b2T546p5a6256uZ5Yiw5oiW6ICF5o6l6Kem5Yiw5p+Q5Liq54K55pe25omn6KGM55qE5ZG95LukXG4gICAgdG91Y2ggKCkge1xuICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgIGlmICghR2FtZS5hcmVhLnRvdWNoKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvUG9zaXRpb24gPSBHYW1lLmhlcm8ucG9zaXRpb247XG4gICAgICBsZXQgaGVyb0ZhY2UgPSBHYW1lLmhlcm8uZmFjZVBvc2l0aW9uO1xuICAgICAgbGV0IHRvdWNoID0gbnVsbDtcblxuICAgICAgbGV0IEZpbmRVbmRlckhlcm8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAodG91Y2ggIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oZXJvVXNlKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaGl0VGVzdCAmJiBlbGVtZW50LmhpdFRlc3QoaGVyb1Bvc2l0aW9uLngsIGhlcm9Qb3NpdGlvbi55KSkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvUG9zaXRpb24ueCAmJiBwLnkgPT0gaGVyb1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgICAgZWxlbWVudC54ID09IGhlcm9Qb3NpdGlvbi54ICYmXG4gICAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb1Bvc2l0aW9uLnlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IEZpbmRGYWNlSGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvRmFjZS54LCBoZXJvRmFjZS55KSkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvRmFjZS54ICYmIHAueSA9PSBoZXJvRmFjZS55KSB7XG4gICAgICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvRmFjZS54ICYmXG4gICAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb0ZhY2UueVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDnlKhGaW5kVW5kZXJIZXJv5Ye95pWw5a+75om+5Yiw546p5a625b2T5YmN5qC85a2Q55qE5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R54mp5ZOBIEdhbWUuYXJlYS5pdGVtc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLml0ZW1zLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZFVuZGVySGVybyk7XG5cbiAgICAgIC8vIOeUqEZpbmRGYWNlSGVyb+Wvu+aJvumdouWvueedgOeOqeWutueahOagvOWtkOWcsOeCuVxuXG4gICAgICAvLyDmib7mnIDov5Hlj6/igJzkuovku7bigJ3kurrniakgR2FtZS5hcmVhLmFjdG9yc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmFjdG9ycywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmib7mnIDov5HlsLjkvZMgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDlhbbku5bnianlk4HvvIjnlLHlnLDlm77mlofku7blrprkuYnvvIlcbiAgICAgIEdhbWUuYXJlYS50b3VjaC5mb3JFYWNoKEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmsLTmupBcbiAgICAgIGlmICghdG91Y2ggJiYgR2FtZS5hcmVhLm1hcC5oaXRXYXRlcihoZXJvRmFjZS54LCBoZXJvRmFjZS55KSkge1xuICAgICAgICB0b3VjaCA9IHtcbiAgICAgICAgICB0eXBlOiBcIndhdGVyXCIsXG4gICAgICAgICAgaGVyb1VzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5wb3B1cChcIlRoaXMgaXMgd2F0ZXJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRvdWNoKSB7XG4gICAgICAgIEdhbWUuaGludE9iamVjdCA9IG51bGw7XG4gICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZVVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2FtZS5oaW50T2JqZWN0ID0gdG91Y2g7XG4gICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvd1VzZSgpO1xuICAgICAgfVxuICAgIH1cblxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
