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
                    onto = element;
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
                    onto = element;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsYUFBYTs7QUFDOUIsYUFEaUIsYUFBYSxDQUM3QixTQUFTLEVBQUU7Ozs0QkFESyxhQUFhOztBQUV4QyxpQ0FGMkIsYUFBYSw2Q0FFbEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUksTUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGdCQUFLLFdBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDbEIsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNqQyxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDcEI7Ozs7Ozs7QUFFRCwrQkFBa0IsTUFBSyxJQUFJLENBQUMsWUFBWSw4SEFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FB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QUFnQyxDQUFDLENBQUM7T0FDbkQ7OztXQW5ENEIsYUFBYTtLQUFTLElBQUksQ0FBQyxLQUFLLEVBeVc3RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFjdG9ySGVyby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICDoi7Hpm4TnsbtcbiAgICDlsZ7mgKfvvJpcbiAgICAgIHRoaXMuc3ByaXRlIOeyvueBtVxuICAqL1xuICBHYW1lLmFzc2lnbihcIkFjdG9ySGVyb1wiLCBjbGFzcyBHYW1lQWN0b3JIZXJvIGV4dGVuZHMgR2FtZS5BY3RvciB7XG4gICAgY29uc3RydWN0b3IgKGFjdG9yRGF0YSkge1xuICAgICAgc3VwZXIoYWN0b3JEYXRhKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuYWkgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuYmVBdHRhY2tpbmcgPSBuZXcgU2V0KCk7XG5cbiAgICAgIHRoaXMub24oXCJraWxsXCIsIChldmVudCkgPT4ge1xuICAgICAgICBsZXQgYWN0b3IgPSBldmVudC5kYXRhO1xuXG4gICAgICAgIGlmICh0aGlzLmJlQXR0YWNraW5nLmhhcyhhY3RvcikpIHtcbiAgICAgICAgICB0aGlzLmJlQXR0YWNraW5nLmRlbGV0ZShhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0b3IuZGF0YS5leHApIHtcbiAgICAgICAgICB0aGlzLmRhdGEuZXhwICs9IGFjdG9yLmRhdGEuZXhwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0YS5leHAgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHF1ZXN0IG9mIHRoaXMuZGF0YS5jdXJyZW50UXVlc3QpIHtcbiAgICAgICAgICBpZiAocXVlc3QudGFyZ2V0ICYmIHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrIG9mIHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgICAgIGlmIChhY3Rvci5pZCA9PSBrLmlkICYmIGsuY3VycmVudCA8IGsubmVlZCkge1xuICAgICAgICAgICAgICAgIGsuY3VycmVudCsrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbnRvKCk7XG4gICAgICAgIHRoaXMudG91Y2goKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICggIUdhbWUucGF1c2VkICkge1xuICAgICAgICAgIHRoaXMub250bygpO1xuICAgICAgICAgIHRoaXMudG91Y2goKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTAwKTtcbiAgICB9XG5cbiAgICBnZXQgYmVBdHRhY2tpbmcgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmJlQXR0YWNraW5nO1xuICAgIH1cblxuICAgIHNldCBiZUF0dGFja2luZyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuaGVyby5iZUF0dGFja2luZyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBoYXNJdGVtIChpZCwgY291bnQpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY291bnQpID09IGZhbHNlIHx8IGNvdW50IDw9IDApIHtcbiAgICAgICAgY291bnQgPSAxO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZGF0YS5pdGVtcykge1xuICAgICAgICBpZiAoa2V5ID09IGlkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5pdGVtc1trZXldID49IGNvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhhc1F1ZXN0IChpZCkge1xuICAgICAgZm9yIChsZXQgcXVlc3Qgb2YgdGhpcy5kYXRhLmN1cnJlbnRRdWVzdCkge1xuICAgICAgICBpZiAoaWQgPT0gcXVlc3QuaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgcXVlc3Qgb2YgdGhpcy5kYXRhLmNvbXBsZXRlUXVlc3QpIHtcbiAgICAgICAgaWYgKGlkID09IHF1ZXN0LmlkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkYW1hZ2UgKGF0dGFja2VyLCBza2lsbCkge1xuICAgICAgc3VwZXIuZGFtYWdlKGF0dGFja2VyLCBza2lsbCk7XG5cbiAgICAgIC8vIOWmguaenOiLsembhOWPl+WIsOS6huS8pOWus1xuICAgICAgbGV0IHRvdWNoQWN0b3IgPSBbXTtcbiAgICAgIGZvciAobGV0IGFjdG9yIG9mIEdhbWUuYXJlYS5hY3RvcnMpIHtcbiAgICAgICAgLy8g5om+5Yiw5omA5pyJ6YK75o6l6Iux6ZuE55qE5oCq54mpXG4gICAgICAgIGlmIChhY3RvciAhPSB0aGlzICYmIGFjdG9yLmRhdGEudHlwZSA9PSBcIm1vbnN0ZXJcIiAmJiBhY3Rvci5kaXN0YW5jZSh0aGlzKSA9PSAxKSB7XG4gICAgICAgICAgdG91Y2hBY3Rvci5wdXNoKGFjdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRvdWNoQWN0b3IubGVuZ3RoKSB7XG4gICAgICAgIGxldCBmYWNlQXR0YWNrZXIgPSBmYWxzZTtcbiAgICAgICAgbGV0IGZhY2VQb3NpdGlvbiA9IHRoaXMuZmFjZVBvc2l0aW9uO1xuICAgICAgICB0b3VjaEFjdG9yLmZvckVhY2goZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgICAgaWYgKGFjdG9yLmhpdFRlc3QoZmFjZVBvc2l0aW9uLngsIGZhY2VQb3NpdGlvbi55KSkge1xuICAgICAgICAgICAgZmFjZUF0dGFja2VyID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyDlpoLmnpzoi7Hpm4TnjrDlnKjmsqHpnaLlr7nku7vkvZXkuIDkuKrpgrvmjqXnmoTmgKrnianvvIzpnaLlkJHlroNcbiAgICAgICAgaWYgKGZhY2VBdHRhY2tlciA9PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuZ290byh0b3VjaEFjdG9yWzBdLngsIHRvdWNoQWN0b3JbMF0ueSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBlcmFzZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHN1cGVyLmVyYXNlKCk7XG5cbiAgICAgIGlmIChwcml2YXRlcy5haSkge1xuICAgICAgICBTcHJpdGUuVGlja2VyLm9mZihcInRpY2tcIiwgcHJpdmF0ZXMuYWkpO1xuICAgICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVmcmVzaEJhciAoKSB7XG4gICAgICBzdXBlci5yZWZyZXNoQmFyKCk7XG4gICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnN0YXR1cyhcbiAgICAgICAgdGhpcy5kYXRhLmhwIC8gdGhpcy5kYXRhLiRocCwgLy8g55Sf5ZG955m+5YiG5q+UXG4gICAgICAgIHRoaXMuZGF0YS5zcCAvIHRoaXMuZGF0YS4kc3AgLy8g57K+56We5Yqb55m+5YiG5q+UXG4gICAgICApO1xuICAgIH1cblxuICAgIGRyYXcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBzdXBlci5kcmF3KCk7XG5cbiAgICAgIHByaXZhdGVzLmFpID0gU3ByaXRlLlRpY2tlci5vbihcInRpY2tcIiwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgbGV0IHRpY2tDb3VudCA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgLy8g5q+P56eSMTbkuKp0aWNrXG4gICAgICAgIGlmICh0aWNrQ291bnQgJSAxNiA9PSAwKSB7XG4gICAgICAgICAgbGV0IGJhckNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuaHAgPCB0aGlzLmRhdGEuJGhwICYmIHRoaXMuYmVBdHRhY2tpbmcuc2l6ZSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuaHArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc3AgPCB0aGlzLmRhdGEuJHNwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc3ArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiYXJDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICAgICAgICAgIGlmIChHYW1lLndpbmRvd3Muc3RhdHVzLmF0b3ApIHtcbiAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLnN0YXR1cy51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICB9XG5cblxuICAgIGdvdG9BcmVhIChkZXN0LCB4LCB5KSB7XG4gICAgICB2YXIgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmJlQXR0YWNraW5nID0gbmV3IFNldCgpO1xuICAgICAgR2FtZS5wYXVzZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3Muc3RhZ2UuaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcbiAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjIwJVwiKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgR2FtZS5jbGVhclN0YWdlKCk7XG4gICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjUwJVwiKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgIEdhbWUubG9hZEFyZWEoZGVzdCkudGhlbihmdW5jdGlvbiAoYXJlYSkge1xuXG4gICAgICAgICAgICBHYW1lLmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiODAlXCIpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5hcmVhID0gZGVzdDtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRyYXcoKTtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLnggPSB4O1xuICAgICAgICAgICAgICBHYW1lLmhlcm8ueSA9IHk7XG4gICAgICAgICAgICAgIGFyZWEuYWN0b3JzLmFkZChHYW1lLmhlcm8pO1xuXG4gICAgICAgICAgICAgIGFyZWEubWFwLmRyYXcoKTtcbiAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcudXBkYXRlKFwiMTAwJVwiKTtcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIEdhbWUuaGVyby54ID0geDtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8ueSA9IHk7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEudGltZSArPSA2MDsgLy8g5Yqg5LiA5bCP5pe2XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuZW5kKCk7XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5kYXRldGltZSgpO1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIEdhbWUuc3RhcnQoKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICBHYW1lLnN0YWdlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLnNob3coKTtcbiAgICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sIDUpO1xuICAgICAgICAgICAgICB9LCA1KTtcbiAgICAgICAgICAgIH0sIDUpO1xuICAgICAgICAgIH0pOyAvLyBsb2FkQXJlYVxuICAgICAgICB9LCA1KTtcbiAgICAgIH0sIDUpO1xuICAgIH1cblxuICAgIC8vIOW9k+eOqeWutuermeWIsOafkOS4queCueeahOaXtuWAmeaJp+ihjOeahOWRveS7pFxuICAgIG9udG8gKCkge1xuICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgIGlmICghR2FtZS5hcmVhLm9udG8pIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBvbnRvID0gbnVsbDtcblxuICAgICAgbGV0IEZpbmRVbmRlckhlcm8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAob250byAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmhpdFRlc3QgJiYgZWxlbWVudC5oaXRUZXN0KGhlcm9Qb3NpdGlvbi54LCBoZXJvUG9zaXRpb24ueSkpIHtcbiAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICBmb3IgKGxldCBwIG9mIGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LnkpICYmXG4gICAgICAgICAgZWxlbWVudC54ID09IGhlcm9Qb3NpdGlvbi54ICYmXG4gICAgICAgICAgZWxlbWVudC55ID09IGhlcm9Qb3NpdGlvbi55XG4gICAgICAgICkge1xuICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8g5om+5pyA6L+R5Y+v4oCc5LqL5Lu24oCd5Lq654mpIEdhbWUuYXJlYS5hY3RvcnNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5vbnRvLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIGlmIChvbnRvKSB7XG4gICAgICAgIGlmIChvbnRvLmV4ZWN1dGUpIHtcbiAgICAgICAgICBvbnRvLmV4ZWN1dGUoKTtcbiAgICAgICAgfVxuICAgICAgfSAvLyB0b3VjaFxuICAgIH1cblxuICAgIC8vIOW9k+eOqeWutuermeWIsOaIluiAheaOpeinpuWIsOafkOS4queCueaXtuaJp+ihjOeahOWRveS7pFxuICAgIHRvdWNoICgpIHtcbiAgICAgIGlmICghR2FtZS5hcmVhKSByZXR1cm47XG4gICAgICBpZiAoIUdhbWUuYXJlYS50b3VjaCkgcmV0dXJuO1xuXG4gICAgICBsZXQgaGVyb1Bvc2l0aW9uID0gR2FtZS5oZXJvLnBvc2l0aW9uO1xuICAgICAgbGV0IGhlcm9GYWNlID0gR2FtZS5oZXJvLmZhY2VQb3NpdGlvbjtcbiAgICAgIGxldCB0b3VjaCA9IG51bGw7XG5cbiAgICAgIGxldCBGaW5kVW5kZXJIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRvdWNoICE9IG51bGwgfHwgZWxlbWVudCA9PSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQuaGVyb1VzZSkge1xuICAgICAgICAgIGlmIChlbGVtZW50LmhpdFRlc3QgJiYgZWxlbWVudC5oaXRUZXN0KGhlcm9Qb3NpdGlvbi54LCBoZXJvUG9zaXRpb24ueSkpIHtcbiAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICAgIGlmIChwLnggPT0gaGVyb1Bvc2l0aW9uLnggJiYgcC55ID09IGhlcm9Qb3NpdGlvbi55KSB7XG4gICAgICAgICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgICAgZWxlbWVudC54ID09IGhlcm9Qb3NpdGlvbi54ICYmXG4gICAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb1Bvc2l0aW9uLnlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IEZpbmRGYWNlSGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvRmFjZS54LCBoZXJvRmFjZS55KSkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgZWxlbWVudC5wb2ludHMpIHtcbiAgICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvRmFjZS54ICYmIHAueSA9PSBoZXJvRmFjZS55KSB7XG4gICAgICAgICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShlbGVtZW50LngpICYmXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgICAgZWxlbWVudC54ID09IGhlcm9GYWNlLnggJiZcbiAgICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvRmFjZS55XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeUqEZpbmRVbmRlckhlcm/lh73mlbDlr7vmib7liLDnjqnlrrblvZPliY3moLzlrZDnmoTlnLDngrlcblxuICAgICAgLy8g5om+5pyA6L+R5Y+v4oCc5LqL5Lu24oCd5Lq654mpIEdhbWUuYXJlYS5hY3RvcnNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5hY3RvcnMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZFVuZGVySGVybyk7XG4gICAgICAvLyDmib7mnIDov5Hnianlk4EgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5YW25LuW54mp5ZOB77yI55Sx5Zyw5Zu+5paH5Lu25a6a5LmJ77yJXG4gICAgICBHYW1lLmFyZWEudG91Y2guZm9yRWFjaChGaW5kVW5kZXJIZXJvKTtcblxuICAgICAgLy8g55SoRmluZEZhY2VIZXJv5a+75om+6Z2i5a+5552A546p5a6255qE5qC85a2Q5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kRmFjZUhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R5bC45L2TIEdhbWUuYXJlYS5iYWdzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYmFncywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuaXRlbXNcbiAgICAgIFNwcml0ZS5lYWNoKEdhbWUuYXJlYS5pdGVtcywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOawtOa6kFxuICAgICAgaWYgKCF0b3VjaCAmJiBHYW1lLmFyZWEubWFwLmhpdFdhdGVyKGhlcm9GYWNlLngsIGhlcm9GYWNlLnkpKSB7XG4gICAgICAgIHRvdWNoID0ge1xuICAgICAgICAgIHR5cGU6IFwid2F0ZXJcIixcbiAgICAgICAgICBoZXJvVXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwKFwiVGhpcyBpcyB3YXRlclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gpIHtcbiAgICAgICAgR2FtZS5oaW50T2JqZWN0ID0gbnVsbDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlVXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QgPSB0b3VjaDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93VXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
