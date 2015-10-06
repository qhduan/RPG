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

  Game.assign("Skill", (function (_Sprite$Event) {
    _inherits(GameSkill, _Sprite$Event);

    _createClass(GameSkill, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("skill/" + id + ".js").then(function (data) {
            var skillData = data[0]();
            var skillObj = new Game.Skill(skillData);
            Game.skills[id] = skillObj;
            skillObj.on("complete", function () {
              resolve(skillObj);
            });
          });
        });
      }
    }]);

    function GameSkill(skillData) {
      var _this = this;

      _classCallCheck(this, GameSkill);

      _get(Object.getPrototypeOf(GameSkill.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.data = skillData;

      Sprite.load("skill/" + this.data.image, "skill/" + this.data.icon, "skill/" + this.data.sound).then(function (data) {
        var image = data[0];
        privates.icon = data[1];
        privates.sound = data[2];

        var sheet = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        sheet.centerX = Math.floor(_this.data.tilewidth / 2);
        sheet.centerY = Math.floor(_this.data.tileheight / 2);

        if (_this.data.alpha) {
          sheet.alpha = _this.data.alpha;
        }

        privates.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
    }

    _createClass(GameSkill, [{
      key: "fire",
      value: function fire(attacker, direction, callback) {
        var _this2 = this;

        var privates = internal(this);

        if (privates.sound) {
          privates.sound.load();
          privates.sound.play();
        }

        var animation = "attack" + direction;
        var weaponAnimation = this.data.animations[animation];
        var sprite = privates.sprite.clone();

        // 矫正武器效果位置
        sprite.x = attacker.facePosition.x * 32 + 16;
        sprite.y = attacker.facePosition.y * 32 + 16;

        // 矫正武器效果中心
        if (Number.isFinite(weaponAnimation.centerX) && Number.isFinite(weaponAnimation.centerY)) {
          sprite.centerX = weaponAnimation.centerX;
          sprite.centerY = weaponAnimation.centerY;
        } else {
          console.error(weaponAnimation, this.data);
          throw new Error("Game.Skill.fire invalid centerX/centerY");
        }

        // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的距离
        var distance = 0;
        // 被命中的actor列表
        var hitted = [];
        var CheckHit = function CheckHit() {
          // 技能所在当前方格
          var l1 = Game.area.map.tile(sprite.x, sprite.y);
          // 碰撞检测
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var actor = _step.value;

              if (actor != attacker && hitted.length <= 0) {
                if (actor.hitTest(l1.x, l1.y)) {
                  hitted.push(actor);
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
        };

        var listener = Sprite.Ticker.on("tick", function () {

          if (_this2.data.distance > 0) {
            // 飞行速度是4
            distance += 4;
          }

          switch (animation) {
            case "attackdown":
              sprite.y += distance;
              break;
            case "attackleft":
              sprite.x -= distance;
              break;
            case "attackright":
              sprite.x += distance;
              break;
            case "attackup":
              sprite.y -= distance;
              break;
          }

          CheckHit();

          // 测试碰撞到墙
          var grid = Game.area.map.tile(sprite.x, sprite.y);
          if (Game.area.map.hitTest(grid.x, grid.y)) {
            Finish();
          }

          // 如果击中了一个敌人（单体伤害）
          if (hitted.length > 0) {
            Finish();
          }

          // 如果是远程攻击，并且攻击距离已经到了
          if (_this2.data.distance > 0 && distance >= _this2.data.distance) {
            Finish();
          }
        });

        // 攻击结束时运行Stop函数
        var Finish = function Finish() {
          Sprite.Ticker.off("tick", listener);

          if (hitted.length > 0 && _this2.data.animations["hitted"]) {
            var actor = hitted[0];
            sprite.x = actor.sprite.x;
            sprite.y = actor.sprite.y;
            sprite.play("hitted");
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          } else {
            // 如果动画已经播完，则停止
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          }

          if (callback) {
            callback(hitted);
          }
        };

        Game.layers.skillLayer.appendChild(sprite);
        sprite.play(animation);

        if (this.data.animations[animation].actor && attacker.data.animations[this.data.animations[animation].actor]) {
          attacker.play(this.data.animations[animation].actor, 3);
        } else {
          attacker.play("face" + direction, 0);
          attacker.play("attack" + direction, 3);
        }
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Skill.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        return internal(this).icon;
      },
      set: function set(value) {
        throw new Error("Game.Skill.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Skill.data readonly");
      }
    }, {
      key: "power",
      get: function get() {
        if (Number.isFinite(this.data.power)) {
          // 固定伤害
          return this.data.power;
        } else if (typeof this.data.power == "string") {
          // 骰子伤害，例如1d5就是投一个五面骰子，数值在1到5之间
          var m = this.data.power.match(/(\d+)d(\d+)/);
          if (!m) {
            console.error(this.data.power, this.data);
            throw new Error("Sprite.Skill got invalid power data");
          }
          var times = parseInt(m[1]);
          var dice = parseInt(m[2]);
          var sum = 0;
          for (var i = 0; i < times; i++) {
            sum += Sprite.rand(0, dice) + 1;
          }
          return sum;
        } else {
          console.error(this.data.power, this.data);
          throw new Error("Game.Skill.power invalid power");
        }
      },
      set: function set(value) {
        throw new Error("Game.Skill.power readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return this.data.type;
      },
      set: function set(value) {
        throw new Error("Game.Skill.type readonly");
      }
    }]);

    return GameSkill;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVTa2lsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2NBQVEsU0FBUzs7aUJBQVQsU0FBUzs7YUFFdEIsY0FBQyxFQUFFLEVBQUU7QUFDZixlQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxnQkFBTSxDQUFDLElBQUksWUFBVSxFQUFFLFNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDakQsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQzNCLG9CQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQzVCLHFCQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbkIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztBQUVXLGFBZmEsU0FBUyxDQWVyQixTQUFTLEVBQUU7Ozs0QkFmQyxTQUFTOztBQWdCaEMsaUNBaEJ1QixTQUFTLDZDQWdCdkI7QUFDVCxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRTFCLFlBQU0sQ0FBQyxJQUFJLFlBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQ2YsSUFBSSxDQUFDLElBQUks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QyxDQUFDLENBQUM7QUFDM0IsY0FBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGNBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUIsZUFBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNqQztBQUNELGlCQUFPLEdBQUcsQ0FBQztTQUNaLE1BQU07QUFDTCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsZ0JBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUNuRDtPQUNGO1dBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsY0FBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO09BQzlDOzs7V0FFUSxlQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUN2QjtXQUVRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsY0FBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO09BQzdDOzs7V0E3R3dCLFNBQVM7S0FBUyxNQUFNLENBQUMsS0FBSyxFQStPdkQsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVTa2lsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBHYW1lLmFzc2lnbihcIlNraWxsXCIsIGNsYXNzIEdhbWVTa2lsbCBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBza2lsbC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgc2tpbGxEYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIGxldCBza2lsbE9iaiA9IG5ldyBHYW1lLlNraWxsKHNraWxsRGF0YSk7XG4gICAgICAgICAgR2FtZS5za2lsbHNbaWRdID0gc2tpbGxPYmo7XG4gICAgICAgICAgc2tpbGxPYmoub24oXCJjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHNraWxsT2JqKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoc2tpbGxEYXRhKSB7XG4gICAgICBzdXBlciAoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuZGF0YSA9IHNraWxsRGF0YTtcblxuICAgICAgU3ByaXRlLmxvYWQoXG4gICAgICAgIGBza2lsbC8ke3RoaXMuZGF0YS5pbWFnZX1gLFxuICAgICAgICBgc2tpbGwvJHt0aGlzLmRhdGEuaWNvbn1gLFxuICAgICAgICBgc2tpbGwvJHt0aGlzLmRhdGEuc291bmR9YFxuICAgICAgKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBpbWFnZSA9IGRhdGFbMF07XG4gICAgICAgIHByaXZhdGVzLmljb24gPSBkYXRhWzFdO1xuICAgICAgICBwcml2YXRlcy5zb3VuZCA9IGRhdGFbMl07XG5cbiAgICAgICAgbGV0IHNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgICAgaW1hZ2VzOiBbaW1hZ2VdLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLmRhdGEudGlsZXdpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5kYXRhLnRpbGVoZWlnaHQsXG4gICAgICAgICAgYW5pbWF0aW9uczogdGhpcy5kYXRhLmFuaW1hdGlvbnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2hlZXQuY2VudGVyWCA9IE1hdGguZmxvb3IodGhpcy5kYXRhLnRpbGV3aWR0aCAvIDIpO1xuICAgICAgICBzaGVldC5jZW50ZXJZID0gTWF0aC5mbG9vcih0aGlzLmRhdGEudGlsZWhlaWdodCAvIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLmRhdGEuYWxwaGEpIHtcbiAgICAgICAgICBzaGVldC5hbHBoYSA9IHRoaXMuZGF0YS5hbHBoYTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGVzLnNwcml0ZSA9IHNoZWV0O1xuXG4gICAgICAgIC8vIOWPkemAgeWujOaIkOS6i+S7tu+8jOesrOS6jOS4quWPguaVsOS7o+ihqOS4gOasoeaAp+S6i+S7tlxuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBpZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS5pZDtcbiAgICB9XG5cbiAgICBzZXQgaWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLlNraWxsLmlkIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpY29uICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pY29uO1xuICAgIH1cblxuICAgIHNldCBpY29uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5pY29uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgIH1cblxuICAgIHNldCBkYXRhICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcG93ZXIgKCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh0aGlzLmRhdGEucG93ZXIpKSB7XG4gICAgICAgIC8vIOWbuuWumuS8pOWus1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnBvd2VyO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5kYXRhLnBvd2VyID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8g6aqw5a2Q5Lyk5a6z77yM5L6L5aaCMWQ15bCx5piv5oqV5LiA5Liq5LqU6Z2i6aqw5a2Q77yM5pWw5YC85ZyoMeWIsDXkuYvpl7RcbiAgICAgICAgbGV0IG0gPSB0aGlzLmRhdGEucG93ZXIubWF0Y2goLyhcXGQrKWQoXFxkKykvKTtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEucG93ZXIsIHRoaXMuZGF0YSk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNraWxsIGdvdCBpbnZhbGlkIHBvd2VyIGRhdGFcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRpbWVzID0gcGFyc2VJbnQobVsxXSk7XG4gICAgICAgIGxldCBkaWNlID0gcGFyc2VJbnQobVsyXSk7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcbiAgICAgICAgICBzdW0gKz0gU3ByaXRlLnJhbmQoMCwgZGljZSkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YS5wb3dlciwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5wb3dlciBpbnZhbGlkIHBvd2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldCBwb3dlciAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwucG93ZXIgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS50eXBlO1xuICAgIH1cblxuICAgIHNldCB0eXBlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC50eXBlIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGZpcmUgKGF0dGFja2VyLCBkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLnNvdW5kKSB7XG4gICAgICAgIHByaXZhdGVzLnNvdW5kLmxvYWQoKTtcbiAgICAgICAgcHJpdmF0ZXMuc291bmQucGxheSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgYW5pbWF0aW9uID0gXCJhdHRhY2tcIiArIGRpcmVjdGlvbjtcbiAgICAgIGxldCB3ZWFwb25BbmltYXRpb24gPSB0aGlzLmRhdGEuYW5pbWF0aW9uc1thbmltYXRpb25dO1xuICAgICAgbGV0IHNwcml0ZSA9IHByaXZhdGVzLnNwcml0ZS5jbG9uZSgpO1xuXG4gICAgICAvLyDnn6vmraPmrablmajmlYjmnpzkvY3nva5cbiAgICAgIHNwcml0ZS54ID0gYXR0YWNrZXIuZmFjZVBvc2l0aW9uLnggKiAzMiArIDE2O1xuICAgICAgc3ByaXRlLnkgPSBhdHRhY2tlci5mYWNlUG9zaXRpb24ueSAqIDMyICsgMTY7XG5cbiAgICAgIC8vIOefq+ato+atpuWZqOaViOaenOS4reW/g1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh3ZWFwb25BbmltYXRpb24uY2VudGVyWCkgJiYgTnVtYmVyLmlzRmluaXRlKHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJZKSkge1xuICAgICAgICBzcHJpdGUuY2VudGVyWCA9IHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJYO1xuICAgICAgICBzcHJpdGUuY2VudGVyWSA9IHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih3ZWFwb25BbmltYXRpb24sIHRoaXMuZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwuZmlyZSBpbnZhbGlkIGNlbnRlclgvY2VudGVyWVwiKTtcbiAgICAgIH1cblxuICAgICAgLy8g5aaC5p6c5piv6L+c6Led56a75pS75Ye777yIdGhpcy5kYXRhLmRpc3RhbmNlID4gMO+8ie+8jOmCo+S5iGRpc3RhbmNl5piv5a6D5bey57uP6LWw6L+H55qE6Led56a7XG4gICAgICBsZXQgZGlzdGFuY2UgPSAwO1xuICAgICAgLy8g6KKr5ZG95Lit55qEYWN0b3LliJfooahcbiAgICAgIGxldCBoaXR0ZWQgPSBbXTtcbiAgICAgIGxldCBDaGVja0hpdCA9ICgpID0+IHtcbiAgICAgICAgLy8g5oqA6IO95omA5Zyo5b2T5YmN5pa55qC8XG4gICAgICAgIGxldCBsMSA9IEdhbWUuYXJlYS5tYXAudGlsZShzcHJpdGUueCwgc3ByaXRlLnkpO1xuICAgICAgICAvLyDnorDmkp7mo4DmtYtcbiAgICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAgIGlmIChhY3RvciAhPSBhdHRhY2tlciAmJiBoaXR0ZWQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChhY3Rvci5oaXRUZXN0KGwxLngsIGwxLnkpKSB7XG4gICAgICAgICAgICAgIGhpdHRlZC5wdXNoKGFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxldCBsaXN0ZW5lciA9IFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsICgpID0+IHtcblxuICAgICAgICBpZiAodGhpcy5kYXRhLmRpc3RhbmNlID4gMCkge1xuICAgICAgICAgIC8vIOmjnuihjOmAn+W6puaYrzRcbiAgICAgICAgICBkaXN0YW5jZSArPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChhbmltYXRpb24pIHtcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrZG93blwiOlxuICAgICAgICAgICAgc3ByaXRlLnkgKz0gZGlzdGFuY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrbGVmdFwiOlxuICAgICAgICAgICAgc3ByaXRlLnggLT0gZGlzdGFuY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrcmlnaHRcIjpcbiAgICAgICAgICAgIHNwcml0ZS54ICs9IGRpc3RhbmNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImF0dGFja3VwXCI6XG4gICAgICAgICAgICBzcHJpdGUueSAtPSBkaXN0YW5jZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgQ2hlY2tIaXQoKTtcblxuICAgICAgICAvLyDmtYvor5XnorDmkp7liLDloplcbiAgICAgICAgbGV0IGdyaWQgPSBHYW1lLmFyZWEubWFwLnRpbGUoc3ByaXRlLngsIHNwcml0ZS55KTtcbiAgICAgICAgaWYgKEdhbWUuYXJlYS5tYXAuaGl0VGVzdChncmlkLngsIGdyaWQueSkpIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOWHu+S4reS6huS4gOS4quaVjOS6uu+8iOWNleS9k+S8pOWus++8iVxuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOaYr+i/nOeoi+aUu+WHu++8jOW5tuS4lOaUu+WHu+i3neemu+W3sue7j+WIsOS6hlxuICAgICAgICBpZiAodGhpcy5kYXRhLmRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA+PSB0aGlzLmRhdGEuZGlzdGFuY2UpIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgLy8g5pS75Ye757uT5p2f5pe26L+Q6KGMU3RvcOWHveaVsFxuICAgICAgbGV0IEZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgU3ByaXRlLlRpY2tlci5vZmYoXCJ0aWNrXCIsIGxpc3RlbmVyKTtcblxuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDAgJiYgdGhpcy5kYXRhLmFuaW1hdGlvbnNbXCJoaXR0ZWRcIl0pIHtcbiAgICAgICAgICBsZXQgYWN0b3IgPSBoaXR0ZWRbMF07XG4gICAgICAgICAgc3ByaXRlLnggPSBhY3Rvci5zcHJpdGUueDtcbiAgICAgICAgICBzcHJpdGUueSA9IGFjdG9yLnNwcml0ZS55O1xuICAgICAgICAgIHNwcml0ZS5wbGF5KFwiaGl0dGVkXCIpO1xuICAgICAgICAgIGlmIChzcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLnNraWxsTGF5ZXIucmVtb3ZlQ2hpbGQoc3ByaXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ByaXRlLm9uKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOWmguaenOWKqOeUu+W3sue7j+aSreWujO+8jOWImeWBnOatolxuICAgICAgICAgIGlmIChzcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLnNraWxsTGF5ZXIucmVtb3ZlQ2hpbGQoc3ByaXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ByaXRlLm9uKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soaGl0dGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBHYW1lLmxheWVycy5za2lsbExheWVyLmFwcGVuZENoaWxkKHNwcml0ZSk7XG4gICAgICBzcHJpdGUucGxheShhbmltYXRpb24pO1xuXG4gICAgICBpZiAoIHRoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3JcbiAgICAgICAgJiYgYXR0YWNrZXIuZGF0YS5hbmltYXRpb25zW3RoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3JdICkge1xuICAgICAgICBhdHRhY2tlci5wbGF5KHRoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3IsIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0YWNrZXIucGxheShcImZhY2VcIiArIGRpcmVjdGlvbiwgMCk7XG4gICAgICAgIGF0dGFja2VyLnBsYXkoXCJhdHRhY2tcIiArIGRpcmVjdGlvbiwgMyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59KSgpO1xuIl19
