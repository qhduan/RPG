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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsYUFBYTs7QUFDOUIsYUFEaUIsYUFBYSxDQUM3QixTQUFTLEVBQUU7Ozs0QkFESyxhQUFhOztBQUV4QyxpQ0FGMkIsYUFBYSw2Q0FFbEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUksTUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGdCQUFLLFdBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDbEIsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNqQyxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDcEI7Ozs7Ozs7QUFFRCwrQkFBa0IsTUFBSyxJQUFJLENBQUMsWUFBWSw4SEFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FB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RyxJQUFJLENBQUM7QUFDdkIsY0FBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDLE1BQU07QUFDTCxjQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixjQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEM7T0FDRjs7O1dBclVlLGVBQUc7QUFDakIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO09BQ25DO1dBRWUsYUFBQyxLQUFLLEVBQUU7QUFDdEIsY0FBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO09BQ25EOzs7V0FuRDRCLGFBQWE7S0FBUyxJQUFJLENBQUMsS0FBSyxFQXFYN0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVBY3Rvckhlcm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAg6Iux6ZuE57G7XG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3Rvckhlcm9cIiwgY2xhc3MgR2FtZUFjdG9ySGVybyBleHRlbmRzIEdhbWUuQWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChhY3RvckRhdGEpIHtcbiAgICAgIHN1cGVyKGFjdG9yRGF0YSk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIHByaXZhdGVzLmJlQXR0YWNraW5nID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLm9uKFwia2lsbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IGFjdG9yID0gZXZlbnQuZGF0YTtcblxuICAgICAgICBpZiAodGhpcy5iZUF0dGFja2luZy5oYXMoYWN0b3IpKSB7XG4gICAgICAgICAgdGhpcy5iZUF0dGFja2luZy5kZWxldGUoYWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdG9yLmRhdGEuZXhwKSB7XG4gICAgICAgICAgdGhpcy5kYXRhLmV4cCArPSBhY3Rvci5kYXRhLmV4cDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGEuZXhwICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgICAgaWYgKHF1ZXN0LnRhcmdldCAmJiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgayBvZiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgICBpZiAoYWN0b3IuaWQgPT0gay5pZCAmJiBrLmN1cnJlbnQgPCBrLm5lZWQpIHtcbiAgICAgICAgICAgICAgICBrLmN1cnJlbnQrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub250bygpO1xuICAgICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoICFHYW1lLnBhdXNlZCApIHtcbiAgICAgICAgICB0aGlzLm9udG8oKTtcbiAgICAgICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCk7XG4gICAgfVxuXG4gICAgZ2V0IGJlQXR0YWNraW5nICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iZUF0dGFja2luZztcbiAgICB9XG5cbiAgICBzZXQgYmVBdHRhY2tpbmcgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLmhlcm8uYmVBdHRhY2tpbmcgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgaGFzSXRlbSAoaWQsIGNvdW50KSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNvdW50KSA9PSBmYWxzZSB8fCBjb3VudCA8PSAwKSB7XG4gICAgICAgIGNvdW50ID0gMTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmRhdGEuaXRlbXMpIHtcbiAgICAgICAgaWYgKGtleSA9PSBpZCkge1xuICAgICAgICAgIGlmICh0aGlzLmRhdGEuaXRlbXNba2V5XSA+PSBjb3VudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoYXNRdWVzdCAoaWQpIHtcbiAgICAgIGZvciAobGV0IHF1ZXN0IG9mIHRoaXMuZGF0YS5jdXJyZW50UXVlc3QpIHtcbiAgICAgICAgaWYgKGlkID09IHF1ZXN0LmlkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IHF1ZXN0IG9mIHRoaXMuZGF0YS5jb21wbGV0ZVF1ZXN0KSB7XG4gICAgICAgIGlmIChpZCA9PSBxdWVzdC5pZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZGFtYWdlIChhdHRhY2tlciwgc2tpbGwpIHtcbiAgICAgIHN1cGVyLmRhbWFnZShhdHRhY2tlciwgc2tpbGwpO1xuXG4gICAgICAvLyDlpoLmnpzoi7Hpm4Tlj5fliLDkuobkvKTlrrNcbiAgICAgIGxldCB0b3VjaEFjdG9yID0gW107XG4gICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgIC8vIOaJvuWIsOaJgOaciemCu+aOpeiLsembhOeahOaAqueJqVxuICAgICAgICBpZiAoYWN0b3IgIT0gdGhpcyAmJiBhY3Rvci5kYXRhLnR5cGUgPT0gXCJtb25zdGVyXCIgJiYgYWN0b3IuZGlzdGFuY2UodGhpcykgPT0gMSkge1xuICAgICAgICAgIHRvdWNoQWN0b3IucHVzaChhY3Rvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0b3VjaEFjdG9yLmxlbmd0aCkge1xuICAgICAgICBsZXQgZmFjZUF0dGFja2VyID0gZmFsc2U7XG4gICAgICAgIGxldCBmYWNlUG9zaXRpb24gPSB0aGlzLmZhY2VQb3NpdGlvbjtcbiAgICAgICAgdG91Y2hBY3Rvci5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAgIGlmIChhY3Rvci5oaXRUZXN0KGZhY2VQb3NpdGlvbi54LCBmYWNlUG9zaXRpb24ueSkpIHtcbiAgICAgICAgICAgIGZhY2VBdHRhY2tlciA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8g5aaC5p6c6Iux6ZuE546w5Zyo5rKh6Z2i5a+55Lu75L2V5LiA5Liq6YK75o6l55qE5oCq54mp77yM6Z2i5ZCR5a6DXG4gICAgICAgIGlmIChmYWNlQXR0YWNrZXIgPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLmdvdG8odG91Y2hBY3RvclswXS54LCB0b3VjaEFjdG9yWzBdLnkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZXJhc2UgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBzdXBlci5lcmFzZSgpO1xuXG4gICAgICBpZiAocHJpdmF0ZXMuYWkpIHtcbiAgICAgICAgU3ByaXRlLlRpY2tlci5vZmYoXCJ0aWNrXCIsIHByaXZhdGVzLmFpKTtcbiAgICAgICAgcHJpdmF0ZXMuYWkgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlZnJlc2hCYXIgKCkge1xuICAgICAgc3VwZXIucmVmcmVzaEJhcigpO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zdGF0dXMoXG4gICAgICAgIHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHAsIC8vIOeUn+WRveeZvuWIhuavlFxuICAgICAgICB0aGlzLmRhdGEuc3AgLyB0aGlzLmRhdGEuJHNwIC8vIOeyvuelnuWKm+eZvuWIhuavlFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZHJhdygpO1xuXG4gICAgICBwcml2YXRlcy5haSA9IFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsIChldmVudCkgPT4ge1xuXG4gICAgICAgIGxldCB0aWNrQ291bnQgPSBldmVudC5kYXRhO1xuXG4gICAgICAgIC8vIOavj+enkjE25LiqdGlja1xuICAgICAgICBpZiAodGlja0NvdW50ICUgMTYgPT0gMCkge1xuICAgICAgICAgIGxldCBiYXJDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAodGhpcy5kYXRhLmhwIDwgdGhpcy5kYXRhLiRocCAmJiB0aGlzLmJlQXR0YWNraW5nLnNpemUgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLmhwKys7XG4gICAgICAgICAgICBiYXJDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnNwIDwgdGhpcy5kYXRhLiRzcCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLnNwKys7XG4gICAgICAgICAgICBiYXJDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmFyQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQmFyKCk7XG4gICAgICAgICAgICBpZiAoR2FtZS53aW5kb3dzLnN0YXR1cy5hdG9wKSB7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5zdGF0dXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICBnb3RvQXJlYSAoZGVzdCwgeCwgeSkge1xuICAgICAgdmFyIHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5iZUF0dGFja2luZyA9IG5ldyBTZXQoKTtcbiAgICAgIEdhbWUucGF1c2UoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLmJlZ2luKCk7XG4gICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCIyMCVcIik7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCI1MCVcIik7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBHYW1lLmxvYWRBcmVhKGRlc3QpLnRoZW4oZnVuY3Rpb24gKGFyZWEpIHtcblxuICAgICAgICAgICAgR2FtZS5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjgwJVwiKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuYXJlYSA9IGRlc3Q7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby54ID0geDtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICBhcmVhLmFjdG9ycy5hZGQoR2FtZS5oZXJvKTtcblxuICAgICAgICAgICAgICBhcmVhLm1hcC5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjEwMCVcIik7XG5cbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8ueCA9IHg7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLnRpbWUgKz0gNjA7IC8vIOWKoOS4gOWwj+aXtlxuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLmVuZCgpO1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuZGF0ZXRpbWUoKTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICBHYW1lLnN0YXJ0KCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgR2FtZS5zdGFnZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5zdGFnZS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnNob3coKTtcbiAgICAgICAgICAgICAgICB9LCA1KTtcbiAgICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgICB9LCA1KTtcbiAgICAgICAgICB9KTsgLy8gbG9hZEFyZWFcbiAgICAgICAgfSwgNSk7XG4gICAgICB9LCA1KTtcbiAgICB9XG5cbiAgICAvLyDlvZPnjqnlrrbnq5nliLDmn5DkuKrngrnnmoTml7blgJnmiafooYznmoTlkb3ku6RcbiAgICBvbnRvICgpIHtcbiAgICAgIGlmICghR2FtZS5hcmVhKSByZXR1cm47XG4gICAgICBpZiAoIUdhbWUuYXJlYS5vbnRvKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvUG9zaXRpb24gPSBHYW1lLmhlcm8ucG9zaXRpb247XG4gICAgICBsZXQgb250byA9IG51bGw7XG5cbiAgICAgIGxldCBGaW5kVW5kZXJIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG9udG8gIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvUG9zaXRpb24ueCAmJiBwLnkgPT0gaGVyb1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueCkgJiZcbiAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvUG9zaXRpb24ueCAmJlxuICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvUG9zaXRpb24ueVxuICAgICAgICApIHtcbiAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEub250bywgRmluZFVuZGVySGVybyk7XG4gICAgICBpZiAob250bykge1xuICAgICAgICBpZiAob250by5leGVjdXRlKSB7XG4gICAgICAgICAgb250by5leGVjdXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gdG91Y2hcbiAgICB9XG5cbiAgICAvLyDlvZPnjqnlrrbnq5nliLDmiJbogIXmjqXop6bliLDmn5DkuKrngrnml7bmiafooYznmoTlkb3ku6RcbiAgICB0b3VjaCAoKSB7XG4gICAgICBpZiAoIUdhbWUuYXJlYSkgcmV0dXJuO1xuICAgICAgaWYgKCFHYW1lLmFyZWEudG91Y2gpIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBoZXJvRmFjZSA9IEdhbWUuaGVyby5mYWNlUG9zaXRpb247XG4gICAgICBsZXQgdG91Y2ggPSBudWxsO1xuXG4gICAgICBsZXQgRmluZFVuZGVySGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueCkgJiZcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LnkpICYmXG4gICAgICAgICAgICBlbGVtZW50LnggPT0gaGVyb1Bvc2l0aW9uLnggJiZcbiAgICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvUG9zaXRpb24ueVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgRmluZEZhY2VIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRvdWNoICE9IG51bGwgfHwgZWxlbWVudCA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQuaGVyb1VzZSkge1xuICAgICAgICAgIGlmIChlbGVtZW50LmhpdFRlc3QgJiYgZWxlbWVudC5oaXRUZXN0KGhlcm9GYWNlLngsIGhlcm9GYWNlLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9GYWNlLnggJiYgcC55ID09IGhlcm9GYWNlLnkpIHtcbiAgICAgICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgICAgZWxlbWVudC54ID09IGhlcm9GYWNlLnggJiZcbiAgICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvRmFjZS55XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeUqEZpbmRVbmRlckhlcm/lh73mlbDlr7vmib7liLDnjqnlrrblvZPliY3moLzlrZDnmoTlnLDngrlcblxuICAgICAgLy8g5om+5pyA6L+R5Y+v4oCc5LqL5Lu24oCd5Lq654mpIEdhbWUuYXJlYS5hY3RvcnNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5hY3RvcnMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZFVuZGVySGVybyk7XG4gICAgICAvLyDmib7mnIDov5Hnianlk4EgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5YW25LuW54mp5ZOB77yI55Sx5Zyw5Zu+5paH5Lu25a6a5LmJ77yJXG4gICAgICBHYW1lLmFyZWEudG91Y2guZm9yRWFjaChGaW5kVW5kZXJIZXJvKTtcblxuICAgICAgLy8g55SoRmluZEZhY2VIZXJv5a+75om+6Z2i5a+5552A546p5a6255qE5qC85a2Q5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kRmFjZUhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuaXRlbXNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5pdGVtcywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOawtOa6kFxuICAgICAgaWYgKCF0b3VjaCAmJiBHYW1lLmFyZWEubWFwLmhpdFdhdGVyKGhlcm9GYWNlLngsIGhlcm9GYWNlLnkpKSB7XG4gICAgICAgIHRvdWNoID0ge1xuICAgICAgICAgIHR5cGU6IFwid2F0ZXJcIixcbiAgICAgICAgICBoZXJvVXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBHYW1lLmNob2ljZSh7XG4gICAgICAgICAgICAgIFwi5Zad5rC0XCI6IFwiZHJpbmtcIixcbiAgICAgICAgICAgICAgXCLpkpPpsbxcIjogXCJmaXNoXCJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgICBzd2l0Y2ggKGNob2ljZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkcmlua1wiOlxuICAgICAgICAgICAgICAgICAgR2FtZS5oZXJvLnBvcHVwKFwiZHJpbmtcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpc2hcIjpcbiAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5wb3B1cChcImZpc2hcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaCkge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QgPSBudWxsO1xuICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGVVc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdhbWUuaGludE9iamVjdCA9IHRvdWNoO1xuICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnNob3dVc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICB9KTtcblxuXG59KSgpO1xuIl19
