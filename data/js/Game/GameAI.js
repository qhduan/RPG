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

  Game.AI = (function () {
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

        hero.on("change", run);
        run();
      }
    }, {
      key: "autoHide",
      value: function autoHide() {
        var heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);
        Game.area.map.layers.forEach(function (layer, index) {
          layer.visible = true;
          var layerData = Game.area.map.data.layers[index];
          if (heroHide && layerData.hasOwnProperty("properties") && layerData.properties.hasOwnProperty("autohide") && layerData.properties.autohide == heroHide) {
            layer.visible = false;
          }
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var actor = _step.value;

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
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Game.area.bags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var bag = _step2.value;

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
            Game.windows.loading.begin();
            setTimeout(function () {
              Game.clearStage();
              Game.pause();
              Game.loadArea(onto.dest, function (area) {

                Game.area = area;
                area.map.draw(Game.layers.mapLayer);

                Game.hero.data.area = onto.dest;
                Game.hero.draw(Game.layers.actorLayer);
                area.actors.add(Game.hero);
                Game.hero.x = onto.destx;
                Game.hero.y = onto.desty;
                Game.windows["interface"].show();
                Game.start();

                Game.windows.loading.end();
              });
            }, 100);
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
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            touch = element;
          } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
            touch = element;
          }
        };

        var FindFaceHero = function FindFaceHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
            touch = element;
          } else if (element.x == heroFace.x && element.y == heroFace.y) {
            touch = element;
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
        if (!touch && Game.area.map.waterTest(heroFace.x, heroFace.y)) {
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
    }, {
      key: "actor",
      value: function actor() {
        if (Game.area && Game.area.actors) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            var _loop = function () {
              var actor = _step3.value;

              if (actor.data.type == "hero") {
                var barChanged = false;

                if (actor.data.hp < actor.data.$hp) {
                  actor.data.hp++;
                  barChanged = true;
                }

                if (actor.data.sp < actor.data.$sp) {
                  actor.data.sp++;
                  barChanged = true;
                }

                if (barChanged) {
                  actor.refreshBar();
                }
              } else if (actor.data.type == "monster") {

                var barChanged = false;

                if (actor.data.hp < actor.data.$hp) {
                  actor.data.hp++;
                  barChanged = true;
                }

                if (actor.data.sp < actor.data.$sp) {
                  actor.data.sp++;
                  barChanged = true;
                }

                if (barChanged) {
                  actor.refreshBar();
                }

                if (Game.hero && actor.facePosition.x == Game.hero.x && actor.facePosition.y == Game.hero.y) {
                  if (actor.y == Game.hero.y) {
                    // left or right
                    if (actor.x < Game.hero.x) {
                      // left
                      actor.fire("sword01", "right");
                    } else {
                      // right
                      actor.fire("sword01", "left");
                    }
                  } else {
                    // up or down
                    if (actor.y < Game.hero.y) {
                      // up
                      actor.fire("sword01", "down");
                    } else {
                      // down
                      actor.fire("sword01", "up");
                    }
                  }
                } else if (Game.hero && Game.hero.distance(actor) < 10) {
                  actor.goto(Game.hero.x, Game.hero.y, "walk");
                } else if (actor.data.mode == "patrol") {
                  if (Math.random() < 0.01) {
                    return {
                      v: undefined
                    };
                  }
                  var x = actor.x;
                  var y = actor.y;
                  actor.goto(x + Sprite.rand(-5, 5), y + Sprite.rand(-5, 5), "walk", function () {
                    actor.stop();
                  });
                }
              }
            };

            for (var _iterator3 = Game.area.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _ret = _loop();

              if (typeof _ret === "object") return _ret.v;
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

          ;
        }
      }
    }, {
      key: "start",
      value: function start() {
        setInterval(function () {
          Game.AI.actor();
        }, 50);
      }
    }]);

    return GameAI;
  })();
})();
//# sourceMappingURL=GameAI.js.map
