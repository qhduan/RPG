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

(function (Game) {
  "use strict";

  Game.AI = (function () {
    function AI() {
      _classCallCheck(this, AI);
    }

    _createClass(AI, null, [{
      key: "hint",
      value: function hint() {
        if (Game.hero) {
          var FindUnderHero = function FindUnderHero(element) {
            if (hint != null || element == Game.hero) {
              return;
            }
            if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
              hint = element;
            } else if (element.x == heroPosition.x && element.y == heroPosition.y) {
              hint = element;
            }
          };

          var FindFaceHero = function FindFaceHero(element) {
            if (hint != null || element == Game.hero) {
              return;
            }
            if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
              hint = element;
            } else if (element.x == heroFace.x && element.y == heroFace.y) {
              hint = element;
            }
          }

          // 找最近可“事件”人物 Game.area.actors
          ;

          var heroPosition = Game.hero.position;
          var heroFace = Game.hero.facePosition;

          var hint = null;

          Sprite.each(Game.area.touch, FindUnderHero);

          // 找最近可“事件”人物 Game.area.actors
          Sprite.each(Game.area.actors, FindUnderHero);
          // 找最近尸体 Game.area.actors
          Sprite.each(Game.area.bags, FindUnderHero);
          // 最近的门
          Game.area.doors.forEach(FindUnderHero);
          // 最近的箱子
          Game.area.chests.forEach(FindUnderHero);
          // 最近的提示物（例如牌子）
          Game.area.hints.forEach(FindUnderHero);

          // 找最近可“事件”人物 Game.area.actors
          Sprite.each(Game.area.actors, FindFaceHero);
          // 找最近尸体 Game.area.actors
          Sprite.each(Game.area.bags, FindFaceHero);
          // 最近的门
          Game.area.doors.forEach(FindFaceHero);
          // 最近的箱子
          Game.area.chests.forEach(FindFaceHero);
          // 最近的提示物（例如牌子）
          Game.area.hints.forEach(FindFaceHero);

          if (Game.hintObject && Game.hintObject != hint) {
            Game.hintObject = null;
            Game.windows["interface"].use.style.visibility = "hidden";
          }

          if (hint != null) {
            Game.hintObject = hint;
            Game.windows["interface"].use.style.visibility = "visible";
            if (hint.type == "door") {
              Game.popup({ x: hint.x * 32 + 16, y: hint.y * 32 + 16 }, hint.description, 0, -30);
            } else if (hint.type == "touch") {
              if (hint.showmap) {
                Game.layers.mapLayer.children.forEach(function (element) {
                  if (hint.showmap.indexOf(element.name) != -1) {
                    if (element.visible == false) {
                      element.visible = true;
                      element.alpha = 0.01;
                      Sprite.Tween.get(element).to({ alpha: 1 }, 200);
                    }
                  }
                });
              } // showmap
              if (hint.hidemap) {
                Game.layers.mapLayer.children.forEach(function (element) {
                  if (hint.hidemap.indexOf(element.name) != -1) {
                    if (element.alpha == 1) {
                      element.visible = true;
                      element.alpha = 0.99;
                      Sprite.Tween.get(element).to({ alpha: 0 }, 200).call(function () {
                        element.visible = false;
                      });
                    }
                  }
                });
              } // hidemap
              if (hint.showactor) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var actor = _step.value;

                    if (hint.showactor.indexOf(actor.id) != -1) {
                      if (actor.visible == false) {
                        actor.visible = true;
                        actor.alpha = 0.01;
                        Sprite.Tween.get(actor).to({ alpha: 1 }, 300);
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
              } // showactor
              if (hint.hideactor) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  var _loop = function () {
                    var actor = _step2.value;

                    if (hint.hideactor.indexOf(actor.id) != -1) {
                      if (actor.alpha == 1) {
                        actor.visible = true;
                        actor.alpha = 0.99;
                        Sprite.Tween.get(actor).to({ alpha: 0 }, 100).call(function () {
                          actor.visible = false;
                        });
                      }
                    }
                  };

                  for (var _iterator2 = Game.area.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
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
              } // hideactor
            } // touch
          }
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
            var _loop2 = function () {
              var actor = _step3.value;

              if (actor.data.type == "hero") {
                barChanged = false;

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
                barChanged = false;

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
                  x = actor.x;
                  y = actor.y;

                  actor.goto(x + Sprite.rand(-5, 5), y + Sprite.rand(-5, 5), "walk", function () {
                    actor.stop();
                  });
                }
              }
            };

            for (var _iterator3 = Game.area.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var barChanged;
              var barChanged;
              var x;
              var y;

              var _ret2 = _loop2();

              if (typeof _ret2 === "object") return _ret2.v;
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

        var skip = 0;
        Sprite.Ticker.on("tick", function () {
          if (Game.area && Game.area.actors && Game.area.bags) {
            skip++;
            if (skip % 5 == 0) Game.AI.hint();
          }
        });
      }
    }]);

    return AI;
  })();
})(Game);