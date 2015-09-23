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
  Game.assign("ActorMonster", (function (_Game$Actor) {
    _inherits(GameActorMonster, _Game$Actor);

    function GameActorMonster(actorData) {
      _classCallCheck(this, GameActorMonster);

      _get(Object.getPrototypeOf(GameActorMonster.prototype), "constructor", this).call(this, actorData);
      var privates = internal(this);
      privates.ai = null;
    }

    _createClass(GameActorMonster, [{
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "draw", this).call(this);

        var dodo = Sprite.rand(30, 60);
        var attacking = false;

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          if (Game.paused) return;

          var tickCount = event.data;

          if (tickCount % 20 == 0) {
            var barChanged = false;

            if (_this.data.hp < _this.data.$hp) {
              _this.data.hp++;
              barChanged = true;
            }

            if (_this.data.sp < _this.data.$sp) {
              _this.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this.refreshBar();
            }
          }

          if (attacking) {
            if (tickCount % dodo == 0) {
              if (Game.hero && _this.facePosition.x == Game.hero.x && _this.facePosition.y == Game.hero.y) {
                if (_this.y == Game.hero.y) {
                  // left or right
                  if (_this.x < Game.hero.x) {
                    // left
                    _this.fire("sword01", "right");
                  } else {
                    // right
                    _this.fire("sword01", "left");
                  }
                } else {
                  // up or down
                  if (_this.y < Game.hero.y) {
                    // up
                    _this.fire("sword01", "down");
                  } else {
                    // down
                    _this.fire("sword01", "up");
                  }
                }
              }
            } else if (Game.hero && Game.hero.distance(_this) < 12) {
              _this.goto(Game.hero.x, Game.hero.y, "walk");
            } else {
              attacking = false;
            }
          } else {
            if (tickCount % dodo == 0) {
              if (Game.hero && Game.hero.distance(_this) < 8) {
                _this.goto(Game.hero.x, Game.hero.y, "walk");
                attacking = true;
              } else if (_this.data.mode == "patrol") {
                if (Math.random() > 0.3) {
                  _this.stop();
                  return;
                }
                var directions = ["down", "left", "right", "up"];
                _this.go("walk", directions[Math.floor(Math.random() * directions.length)], function () {
                  _this.stop();
                });
              }
            }
          } // not attacking
        });
      }
    }]);

    return GameActorMonster;
  })(Game.Actor));
})();
//# sourceMappingURL=GameActorMonster.js.map
