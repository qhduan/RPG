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
      privates.attacking = false;
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
        var _this = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "draw", this).call(this);

        var dodo = Sprite.rand(30, 60);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          if (Game.paused) return;

          var tickCount = event.data;

          if (tickCount % 20 == 0) {
            var barChanged = false;

            if (_this.data.hp < _this.data.$hp && privates.attacking == false) {
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

          if (privates.attacking) {
            if (tickCount % dodo == 0) {
              if (Game.hero && _this.facePosition.x == Game.hero.x && _this.facePosition.y == Game.hero.y) {
                if (_this.y == Game.hero.y) {
                  // left or right
                  if (_this.x < Game.hero.x) {
                    // left
                    _this.fire(_this.data.skills[0], "right");
                  } else {
                    // right
                    _this.fire(_this.data.skills[0], "left");
                  }
                } else {
                  // up or down
                  if (_this.y < Game.hero.y) {
                    // up
                    _this.fire(_this.data.skills[0], "down");
                  } else {
                    // down
                    _this.fire(_this.data.skills[0], "up");
                  }
                }
              }
            } else if (Game.hero && Game.hero.distance(_this) < 12) {
              _this.goto(Game.hero.x, Game.hero.y, "walk");
            } else {
              privates.attacking = false;
              if (Game.hero.beAttacking.has(_this)) {
                Game.hero.beAttacking["delete"](_this);
              }
            }
          } else {
            if (tickCount % dodo == 0) {
              if (Game.hero && Game.hero.distance(_this) < 8) {
                _this.goto(Game.hero.x, Game.hero.y, "walk");
                privates.attacking = true;
                Game.hero.beAttacking.add(_this);
              } else if (_this.data.mode == "patrol") {
                if (Math.random() > 0.3) {
                  _this.stop();
                  return;
                }
                var directions = ["down", "left", "right", "up"];
                _this.go("walk", directions[Math.floor(Math.random() * directions.length)]).then(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9HYW1lL0dhbWVBY3Rvck1vbnN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjO2NBQVEsZ0JBQWdCOztBQUNwQyxhQURvQixnQkFBZ0IsQ0FDbkMsU0FBUyxFQUFFOzRCQURRLGdCQUFnQjs7QUFFOUMsaUNBRjhCLGdCQUFnQiw2Q0FFeEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUM1Qjs7aUJBTitCLGdCQUFnQjs7YUFRekMsZ0JBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUN2QixtQ0FUOEIsZ0JBQWdCLHdDQVNqQyxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQzlCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxRQUFRLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRTtBQUMvQixjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMzQztPQUNGOzs7YUFFSyxpQkFBRztBQUNQLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixtQ0FuQjhCLGdCQUFnQix1Q0FtQmhDOztBQUVkLFlBQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNmLGdCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUs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QUcsQ0FBQyIsImZpbGUiOiJzcmMvR2FtZS9HYW1lQWN0b3JNb25zdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgIOiLsembhOexu1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JNb25zdGVyXCIsIGNsYXNzIEdhbWVBY3Rvck1vbnN0ZXIgZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICBwcml2YXRlcy5hdHRhY2tpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBkYW1hZ2UgKGF0dGFja2VyLCBza2lsbCkge1xuICAgICAgc3VwZXIuZGFtYWdlKGF0dGFja2VyLCBza2lsbCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmF0dGFja2luZyA9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmdvdG8oYXR0YWNrZXIueCwgYXR0YWNrZXIueSwgXCJ3YWxrXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZHJhdygpO1xuXG4gICAgICBsZXQgZG9kbyA9IFNwcml0ZS5yYW5kKDMwLCA2MCk7XG5cbiAgICAgIHByaXZhdGVzLmFpID0gU3ByaXRlLlRpY2tlci5vbihcInRpY2tcIiwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgaWYgKEdhbWUucGF1c2VkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHRpY2tDb3VudCA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDIwID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgcHJpdmF0ZXMuYXR0YWNraW5nID09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuaHArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc3AgPCB0aGlzLmRhdGEuJHNwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc3ArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiYXJDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuYXR0YWNraW5nKSB7XG4gICAgICAgICAgaWYgKHRpY2tDb3VudCAlIGRvZG8gPT0gMCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBHYW1lLmhlcm8gJiZcbiAgICAgICAgICAgICAgdGhpcy5mYWNlUG9zaXRpb24ueCA9PSBHYW1lLmhlcm8ueCAmJlxuICAgICAgICAgICAgICB0aGlzLmZhY2VQb3NpdGlvbi55ID09IEdhbWUuaGVyby55XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMueSA9PSBHYW1lLmhlcm8ueSkgeyAvLyBsZWZ0IG9yIHJpZ2h0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueCA8IEdhbWUuaGVyby54KSB7IC8vIGxlZnRcbiAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSh0aGlzLmRhdGEuc2tpbGxzWzBdLCBcInJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgICB0aGlzLmZpcmUodGhpcy5kYXRhLnNraWxsc1swXSwgXCJsZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gdXAgb3IgZG93blxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnkgPCBHYW1lLmhlcm8ueSkgeyAvLyB1cFxuICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKHRoaXMuZGF0YS5za2lsbHNbMF0sIFwiZG93blwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBkb3duXG4gICAgICAgICAgICAgICAgICB0aGlzLmZpcmUodGhpcy5kYXRhLnNraWxsc1swXSwgXCJ1cFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKEdhbWUuaGVybyAmJiBHYW1lLmhlcm8uZGlzdGFuY2UodGhpcykgPCAxMikge1xuICAgICAgICAgICAgdGhpcy5nb3RvKEdhbWUuaGVyby54LCBHYW1lLmhlcm8ueSwgXCJ3YWxrXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcml2YXRlcy5hdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChHYW1lLmhlcm8uYmVBdHRhY2tpbmcuaGFzKHRoaXMpKSB7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5iZUF0dGFja2luZy5kZWxldGUodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aWNrQ291bnQgJSBkb2RvID09IDApIHtcbiAgICAgICAgICAgIGlmIChHYW1lLmhlcm8gJiYgR2FtZS5oZXJvLmRpc3RhbmNlKHRoaXMpIDwgOCkge1xuICAgICAgICAgICAgICB0aGlzLmdvdG8oR2FtZS5oZXJvLngsIEdhbWUuaGVyby55LCBcIndhbGtcIik7XG4gICAgICAgICAgICAgIHByaXZhdGVzLmF0dGFja2luZyA9IHRydWU7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5iZUF0dGFja2luZy5hZGQodGhpcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS5tb2RlID09IFwicGF0cm9sXCIpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbnMgPSBbXCJkb3duXCIsIFwibGVmdFwiLCBcInJpZ2h0XCIsIFwidXBcIl07XG4gICAgICAgICAgICAgIHRoaXMuZ28oXCJ3YWxrXCIsIGRpcmVjdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGlyZWN0aW9ucy5sZW5ndGgpXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBub3QgYXR0YWNraW5nXG5cblxuICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=