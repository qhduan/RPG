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
  Game.assign("ActorMonster", (function (_Game$Actor) {
    _inherits(GameActorMonster, _Game$Actor);

    function GameActorMonster(actorData) {
      _classCallCheck(this, GameActorMonster);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorMonster).call(this, actorData));

      var privates = internal(_this);
      privates.ai = null;
      privates.attacking = false;
      return _this;
    }

    _createClass(GameActorMonster, [{
      key: "damage",
      value: function damage(attacker, skill) {
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "damage", this).call(this, attacker, skill);
        var privates = internal(this);

        if (privates.attacking == false) {
          this.goto(attacker.x, attacker.y, "walk");
        }
      }
    }, {
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
        var _this2 = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "draw", this).call(this);

        var dodo = Sprite.rand(30, 60);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          if (Game.paused) return;

          var tickCount = event.data;

          if (tickCount % 20 == 0) {
            var barChanged = false;

            if (_this2.data.hp < _this2.data.$hp && privates.attacking == false) {
              _this2.data.hp++;
              barChanged = true;
            }

            if (_this2.data.sp < _this2.data.$sp) {
              _this2.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this2.refreshBar();
            }
          }

          if (privates.attacking) {
            if (tickCount % dodo == 0) {
              if (Game.hero && _this2.facePosition.x == Game.hero.x && _this2.facePosition.y == Game.hero.y) {
                if (_this2.y == Game.hero.y) {
                  // left or right
                  if (_this2.x < Game.hero.x) {
                    // left
                    _this2.fire(_this2.data.skills[0], "right");
                  } else {
                    // right
                    _this2.fire(_this2.data.skills[0], "left");
                  }
                } else {
                  // up or down
                  if (_this2.y < Game.hero.y) {
                    // up
                    _this2.fire(_this2.data.skills[0], "down");
                  } else {
                    // down
                    _this2.fire(_this2.data.skills[0], "up");
                  }
                }
              }
            } else if (Game.hero && Game.hero.distance(_this2) < 12) {
              _this2.goto(Game.hero.x, Game.hero.y, "walk");
            } else {
              privates.attacking = false;
              if (Game.hero.beAttacking.has(_this2)) {
                Game.hero.beAttacking.delete(_this2);
              }
            }
          } else {
            if (tickCount % dodo == 0) {
              if (Game.hero && Game.hero.distance(_this2) < 8) {
                _this2.goto(Game.hero.x, Game.hero.y, "walk");
                privates.attacking = true;
                Game.hero.beAttacking.add(_this2);
              } else if (_this2.data.mode == "patrol") {
                if (Math.random() > 0.3) {
                  _this2.stop();
                  return;
                }
                var directions = ["down", "left", "right", "up"];
                _this2.go("walk", directions[Math.floor(Math.random() * directions.length)]).then(function () {
                  _this2.stop();
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
