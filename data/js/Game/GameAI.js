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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Game.assign("AI", (function () {
    function GameAI() {
      _classCallCheck(this, GameAI);
    }

    _createClass(GameAI, null, [{
      key: "attach",
      value: function attach(hero) {
        var run = function run() {
          Game.AI.heroOnto();
          Game.AI.heroTouch();
          Game.AI.autoHide();
        };
        run();
        // 英雄移动后运行
        hero.on("change", run);
        // 游戏窗口切换后运行
        Game.windows["interface"].on("active", function () {
          run();
        });
      }
    }, {
      key: "autoHide",
      value: function autoHide() {
        var heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);

        var _iteratorNormalCompletion = true;

        // 检查需要隐藏的角色，例如建筑物里的npc
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Game.layers.mapHideLayer.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var layer = _step.value;

            if (layer.name == heroHide) {
              layer.visible = false;
            } else {
              layer.visible = true;
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

        var _iteratorNormalCompletion2 = true;

        // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Game.area.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var actor = _step2.value;

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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Game.area.bags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var bag = _step3.value;

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
    }, {
      key: "heroOnto",
      value: function heroOnto() {
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
          } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
            onto = element;
          }
        };
        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.dest) {
            Game.pause();
            Game.windows.loading.begin();
            Game.windows.loading.update("20%");
            setTimeout(function () {
              Game.clearStage();
              Game.windows.loading.update("50%");
              Game.loadArea(onto.dest, function (area) {
                Game.windows.loading.update("80%");
                Game.area = area;
                area.map.draw(Game.layers.mapLayer);
                Game.hero.data.area = onto.dest;
                Game.hero.draw(Game.layers.actorLayer);
                area.actors.add(Game.hero);
                Game.hero.x = onto.destx;
                Game.hero.y = onto.desty;
                Game.windows.loading.update("100%");
                setTimeout(function () {
                  Game.windows.loading.end();
                }, 20);
              });
            }, 20);
          } // dest, aka. door
        } // touch
      }
    }, {
      key: "heroTouch",
      value: function heroTouch() {
        if (!Game.area) return;
        if (!Game.area.actors) return;
        if (!Game.area.bags) return;
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
            } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
              touch = element;
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
            } else if (element.x == heroFace.x && element.y == heroFace.y) {
              touch = element;
            }
          }
        };

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindUnderHero);
        // 找最近尸体 Game.area.actors
        Sprite.each(Game.area.bags, FindUnderHero);
        // 最近的提示物（例如牌子）
        Game.area.touch.forEach(FindUnderHero);

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindFaceHero);
        // 找最近尸体 Game.area.actors
        Sprite.each(Game.area.bags, FindFaceHero);
        // 最近的提示物（例如牌子）
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

          if (touch.type == "message") {
            touch.heroUse = function () {
              Game.popup({
                x: touch.x * 32 + 16,
                y: touch.y * 32 + 16
              }, touch.content, 0, -30);
            };
          }

          Game.hintObject = touch;
          Game.windows["interface"].showUse();
        }
      }
    }]);

    return GameAI;
  })());
})();
//# sourceMappingURL=GameAI.js.map
