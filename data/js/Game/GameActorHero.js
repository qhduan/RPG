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

  var internal = Sprite.Namespace();

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
        Game.pause();
        Game.windows.interface.hide();
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
                  Game.windows.interface.datetime();
                  Game.windows.interface.refresh();
                  Game.start();

                  setTimeout(function () {

                    Game.stage.update();
                    Game.windows.stage.show();
                    Game.windows.interface.show();
                  }, 5);
                }, 5);
              }, 5);
            }); // loadArea
          }, 5);
        }, 5);
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
        Sprite.each(Game.area.onto, FindUnderHero);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7Ozs7QUFBQyxBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7Y0FBUSxhQUFhOztBQUMxQyxhQUQ2QixhQUFhLENBQzdCLFNBQVMsRUFBRTs0QkFESyxhQUFhOzt5RUFBYixhQUFhLGFBRWxDLFNBQVM7O0FBQ2YsVUFBSSxRQUFRLEdBQUcsUUFBUSxPQUFNLENBQUM7QUFDOUIsY0FBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVqQyxZQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekIsWUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzs7QUFFdkIsWUFBSSxNQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDL0IsZ0JBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQzs7QUFFRCxZQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2xCLGdCQUFLLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDakMsTUFBTTtBQUNMLGdCQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3BCOzs7Ozs7O0FBRUQsK0JBQWtCLE1BQUssSUFBSSxDQUFDLFlBQVksOEhBQUU7Z0JBQWpDLEtBQUs7O0FBQ1osZ0JBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTs7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TyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEM7T0FDRjs7OzBCQXJVa0I7QUFDakIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO09BQ25DO3dCQUVnQixLQUFLLEVBQUU7QUFDdEIsY0FBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO09BQ25EOzs7V0FuRDRCLGFBQWE7S0FBUyxJQUFJLENBQUMsS0FBSyxFQXFYN0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVBY3Rvckhlcm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAg6Iux6ZuE57G7XG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3Rvckhlcm9cIiwgY2xhc3MgR2FtZUFjdG9ySGVybyBleHRlbmRzIEdhbWUuQWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChhY3RvckRhdGEpIHtcbiAgICAgIHN1cGVyKGFjdG9yRGF0YSk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIHByaXZhdGVzLmJlQXR0YWNraW5nID0gbmV3IFNldCgpO1xuXG4gICAgICB0aGlzLm9uKFwia2lsbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IGFjdG9yID0gZXZlbnQuZGF0YTtcblxuICAgICAgICBpZiAodGhpcy5iZUF0dGFja2luZy5oYXMoYWN0b3IpKSB7XG4gICAgICAgICAgdGhpcy5iZUF0dGFja2luZy5kZWxldGUoYWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdG9yLmRhdGEuZXhwKSB7XG4gICAgICAgICAgdGhpcy5kYXRhLmV4cCArPSBhY3Rvci5kYXRhLmV4cDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGEuZXhwICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgICAgaWYgKHF1ZXN0LnRhcmdldCAmJiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgayBvZiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgICBpZiAoYWN0b3IuaWQgPT0gay5pZCAmJiBrLmN1cnJlbnQgPCBrLm5lZWQpIHtcbiAgICAgICAgICAgICAgICBrLmN1cnJlbnQrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2hlbk9udG8oKTtcbiAgICAgICAgdGhpcy53aGVuVG91Y2goKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICggIUdhbWUucGF1c2VkICkge1xuICAgICAgICAgIHRoaXMud2hlbk9udG8oKTtcbiAgICAgICAgICB0aGlzLndoZW5Ub3VjaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIGdldCBiZUF0dGFja2luZyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmVBdHRhY2tpbmc7XG4gICAgfVxuXG4gICAgc2V0IGJlQXR0YWNraW5nICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5oZXJvLmJlQXR0YWNraW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhhc0l0ZW0gKGlkLCBjb3VudCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb3VudCkgPT0gZmFsc2UgfHwgY291bnQgPD0gMCkge1xuICAgICAgICBjb3VudCA9IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5kYXRhLml0ZW1zKSB7XG4gICAgICAgIGlmIChrZXkgPT0gaWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLml0ZW1zW2tleV0gPj0gY291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzUXVlc3QgKGlkKSB7XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgIGlmIChpZCA9PSBxdWVzdC5pZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY29tcGxldGVRdWVzdCkge1xuICAgICAgICBpZiAoaWQgPT0gcXVlc3QuaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRhbWFnZSAoYXR0YWNrZXIsIHNraWxsKSB7XG4gICAgICBzdXBlci5kYW1hZ2UoYXR0YWNrZXIsIHNraWxsKTtcblxuICAgICAgLy8g5aaC5p6c6Iux6ZuE5Y+X5Yiw5LqG5Lyk5a6zXG4gICAgICBsZXQgdG91Y2hBY3RvciA9IFtdO1xuICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAvLyDmib7liLDmiYDmnInpgrvmjqXoi7Hpm4TnmoTmgKrnialcbiAgICAgICAgaWYgKGFjdG9yICE9IHRoaXMgJiYgYWN0b3IuZGF0YS50eXBlID09IFwibW9uc3RlclwiICYmIGFjdG9yLmRpc3RhbmNlKHRoaXMpID09IDEpIHtcbiAgICAgICAgICB0b3VjaEFjdG9yLnB1c2goYWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodG91Y2hBY3Rvci5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGZhY2VBdHRhY2tlciA9IGZhbHNlO1xuICAgICAgICBsZXQgZmFjZVBvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG4gICAgICAgIHRvdWNoQWN0b3IuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICBpZiAoYWN0b3IuaGl0VGVzdChmYWNlUG9zaXRpb24ueCwgZmFjZVBvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICBmYWNlQXR0YWNrZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWmguaenOiLsembhOeOsOWcqOayoemdouWvueS7u+S9leS4gOS4qumCu+aOpeeahOaAqueJqe+8jOmdouWQkeWug1xuICAgICAgICBpZiAoZmFjZUF0dGFja2VyID09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5nb3RvKHRvdWNoQWN0b3JbMF0ueCwgdG91Y2hBY3RvclswXS55KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIHN1cGVyLnJlZnJlc2hCYXIoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc3RhdHVzKFxuICAgICAgICB0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwLCAvLyDnlJ/lkb3nmb7liIbmr5RcbiAgICAgICAgdGhpcy5kYXRhLnNwIC8gdGhpcy5kYXRhLiRzcCAvLyDnsr7npZ7lipvnmb7liIbmr5RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHN1cGVyLmRyYXcoKTtcblxuICAgICAgcHJpdmF0ZXMuYWkgPSBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCAoZXZlbnQpID0+IHtcblxuICAgICAgICBsZXQgdGlja0NvdW50ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAvLyDmr4/np5IxNuS4qnRpY2tcbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDE2ID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgdGhpcy5iZUF0dGFja2luZy5zaXplIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ocCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5zcCA8IHRoaXMuZGF0YS4kc3ApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zcCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJhckNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgICAgaWYgKEdhbWUud2luZG93cy5zdGF0dXMuYXRvcCkge1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhdHVzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgZ290b0FyZWEgKGRlc3QsIHgsIHkpIHtcbiAgICAgIHZhciBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuYmVBdHRhY2tpbmcgPSBuZXcgU2V0KCk7XG4gICAgICBHYW1lLnBhdXNlKCk7XG4gICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5zdGFnZS5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5iZWdpbigpO1xuICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiMjAlXCIpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBHYW1lLmNsZWFyU3RhZ2UoKTtcbiAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiNTAlXCIpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgR2FtZS5sb2FkQXJlYShkZXN0KS50aGVuKGZ1bmN0aW9uIChhcmVhKSB7XG5cbiAgICAgICAgICAgIEdhbWUuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCI4MCVcIik7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmFyZWEgPSBkZXN0O1xuICAgICAgICAgICAgICBHYW1lLmhlcm8uZHJhdygpO1xuICAgICAgICAgICAgICBHYW1lLmhlcm8ueCA9IHg7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby55ID0geTtcbiAgICAgICAgICAgICAgYXJlYS5hY3RvcnMuYWRkKEdhbWUuaGVybyk7XG5cbiAgICAgICAgICAgICAgYXJlYS5tYXAuZHJhdygpO1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCIxMDAlXCIpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLnggPSB4O1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby55ID0geTtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS50aW1lICs9IDYwOyAvLyDliqDkuIDlsI/ml7ZcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5lbmQoKTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmRhdGV0aW1lKCk7XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgR2FtZS5zdGFydCgpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhZ2Uuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgICAgIH0sIDUpO1xuICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgfSk7IC8vIGxvYWRBcmVhXG4gICAgICAgIH0sIDUpO1xuICAgICAgfSwgNSk7XG4gICAgfVxuXG4gICAgLy8g5b2T546p5a6256uZ5Yiw5p+Q5Liq54K555qE5pe25YCZ5omn6KGM55qE5ZG95LukXG4gICAgd2hlbk9udG8gKCkge1xuICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgIGlmICghR2FtZS5hcmVhLm9udG8pIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBvbnRvID0gbnVsbDtcblxuICAgICAgbGV0IEZpbmRVbmRlckhlcm8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAob250byAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmhpdFRlc3QgJiYgZWxlbWVudC5oaXRUZXN0KGhlcm9Qb3NpdGlvbi54LCBoZXJvUG9zaXRpb24ueSkpIHtcbiAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICBmb3IgKGxldCBwIG9mIGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LnkpICYmXG4gICAgICAgICAgZWxlbWVudC54ID09IGhlcm9Qb3NpdGlvbi54ICYmXG4gICAgICAgICAgZWxlbWVudC55ID09IGhlcm9Qb3NpdGlvbi55XG4gICAgICAgICkge1xuICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8g5om+5pyA6L+R5Y+v4oCc5LqL5Lu24oCd5Lq654mpIEdhbWUuYXJlYS5hY3RvcnNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5vbnRvLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIGlmIChvbnRvKSB7XG4gICAgICAgIGlmIChvbnRvLmV4ZWN1dGUpIHtcbiAgICAgICAgICBvbnRvLmV4ZWN1dGUoKTtcbiAgICAgICAgfVxuICAgICAgfSAvLyB0b3VjaFxuICAgIH1cblxuICAgIC8vIOW9k+eOqeWutuermeWIsOaIluiAheaOpeinpuWIsOafkOS4queCueaXtuaJp+ihjOeahOWRveS7pFxuICAgIHdoZW5Ub3VjaCAoKSB7XG4gICAgICBpZiAoIUdhbWUuYXJlYSkgcmV0dXJuO1xuICAgICAgaWYgKCFHYW1lLmFyZWEudG91Y2gpIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBoZXJvRmFjZSA9IEdhbWUuaGVyby5mYWNlUG9zaXRpb247XG4gICAgICBsZXQgdG91Y2ggPSBudWxsO1xuXG4gICAgICBsZXQgRmluZFVuZGVySGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueCkgJiZcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LnkpICYmXG4gICAgICAgICAgICBlbGVtZW50LnggPT0gaGVyb1Bvc2l0aW9uLnggJiZcbiAgICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvUG9zaXRpb24ueVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgRmluZEZhY2VIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRvdWNoICE9IG51bGwgfHwgZWxlbWVudCA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQuaGVyb1VzZSkge1xuICAgICAgICAgIGlmIChlbGVtZW50LmhpdFRlc3QgJiYgZWxlbWVudC5oaXRUZXN0KGhlcm9GYWNlLngsIGhlcm9GYWNlLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9GYWNlLnggJiYgcC55ID09IGhlcm9GYWNlLnkpIHtcbiAgICAgICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgICAgZWxlbWVudC54ID09IGhlcm9GYWNlLnggJiZcbiAgICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvRmFjZS55XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeUqEZpbmRVbmRlckhlcm/lh73mlbDlr7vmib7liLDnjqnlrrblvZPliY3moLzlrZDnmoTlnLDngrlcblxuICAgICAgLy8g5om+5pyA6L+R5Y+v4oCc5LqL5Lu24oCd5Lq654mpIEdhbWUuYXJlYS5hY3RvcnNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5hY3RvcnMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZFVuZGVySGVybyk7XG4gICAgICAvLyDmib7mnIDov5Hnianlk4EgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5YW25LuW54mp5ZOB77yI55Sx5Zyw5Zu+5paH5Lu25a6a5LmJ77yJXG4gICAgICBHYW1lLmFyZWEudG91Y2guZm9yRWFjaChGaW5kVW5kZXJIZXJvKTtcblxuICAgICAgLy8g55SoRmluZEZhY2VIZXJv5a+75om+6Z2i5a+5552A546p5a6255qE5qC85a2Q5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kRmFjZUhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuaXRlbXNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5pdGVtcywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOawtOa6kFxuICAgICAgaWYgKCF0b3VjaCAmJiBHYW1lLmFyZWEubWFwLmhpdFdhdGVyKGhlcm9GYWNlLngsIGhlcm9GYWNlLnkpKSB7XG4gICAgICAgIHRvdWNoID0ge1xuICAgICAgICAgIHR5cGU6IFwid2F0ZXJcIixcbiAgICAgICAgICBoZXJvVXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBHYW1lLmNob2ljZSh7XG4gICAgICAgICAgICAgIFwi5Zad5rC0XCI6IFwiZHJpbmtcIixcbiAgICAgICAgICAgICAgXCLpkpPpsbxcIjogXCJmaXNoXCJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgICBzd2l0Y2ggKGNob2ljZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkcmlua1wiOlxuICAgICAgICAgICAgICAgICAgR2FtZS5oZXJvLnBvcHVwKFwiZHJpbmtcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpc2hcIjpcbiAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5wb3B1cChcImZpc2hcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaCkge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QgPSBudWxsO1xuICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGVVc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdhbWUuaGludE9iamVjdCA9IHRvdWNoO1xuICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnNob3dVc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICB9KTtcblxuXG59KSgpO1xuIl19
