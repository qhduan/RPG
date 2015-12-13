"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
      _classCallCheck(this, GameSkill);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameSkill).call(this));

      var privates = internal(_this);
      privates.data = skillData;

      Sprite.load("skill/" + _this.data.image, "skill/" + _this.data.icon, "skill/" + _this.data.sound).then(function (data) {
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
      return _this;
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
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVTa2lsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2NBQVEsU0FBUzs7aUJBQVQsU0FBUzs7MkJBRXJCLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxZQUFVLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUIsZ0JBQUksUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDM0Isb0JBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQU07QUFDNUIscUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNuQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7O0FBRUQsYUFmeUIsU0FBUyxDQWVyQixTQUFTLEVBQUU7NEJBZkMsU0FBUzs7eUVBQVQsU0FBUzs7QUFpQmhDLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTSxDQUFDO0FBQzlCLGNBQVEsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDOztBQUUxQixZQUFNLENBQUMsSUFBSSxZQUNBLE1BQUssSUFBSSxDQUFDLEtBQUssYUFDZixNQUFLLElBQUksQ0FBQyxJQUFJLGFBQ2QsTUFBSyxJQUFJLENBQUMsS0FBSyxDQUN6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QyxDQUFDLENBQUM7QUFDMUIsY0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QixlQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQ2pDO0FBQ0QsaUJBQU8sR0FBRyxDQUFDO1NBQ1osTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxnQkFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ25EO09BQ0Y7d0JBRVUsS0FBSyxFQUFFO0FBQ2hCLGNBQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztPQUM5Qzs7OzBCQUVXO0FBQ1YsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUN2Qjt3QkFFUyxLQUFLLEVBQUU7QUFDZixjQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7T0FDN0M7OztXQTdHd0IsU0FBUztLQUFTLE1BQU0sQ0FBQyxLQUFLLEVBK092RCxDQUFDO0NBRUosQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVNraWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIEdhbWUuYXNzaWduKFwiU2tpbGxcIiwgY2xhc3MgR2FtZVNraWxsIGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcblxuICAgIHN0YXRpYyBsb2FkIChpZCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoYHNraWxsLyR7aWR9LmpzYCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCBza2lsbERhdGEgPSBkYXRhWzBdKCk7XG4gICAgICAgICAgbGV0IHNraWxsT2JqID0gbmV3IEdhbWUuU2tpbGwoc2tpbGxEYXRhKTtcbiAgICAgICAgICBHYW1lLnNraWxsc1tpZF0gPSBza2lsbE9iajtcbiAgICAgICAgICBza2lsbE9iai5vbihcImNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoc2tpbGxPYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChza2lsbERhdGEpIHtcbiAgICAgIHN1cGVyICgpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhID0gc2tpbGxEYXRhO1xuXG4gICAgICBTcHJpdGUubG9hZChcbiAgICAgICAgYHNraWxsLyR7dGhpcy5kYXRhLmltYWdlfWAsXG4gICAgICAgIGBza2lsbC8ke3RoaXMuZGF0YS5pY29ufWAsXG4gICAgICAgIGBza2lsbC8ke3RoaXMuZGF0YS5zb3VuZH1gXG4gICAgICApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IGltYWdlID0gZGF0YVswXTtcbiAgICAgICAgcHJpdmF0ZXMuaWNvbiA9IGRhdGFbMV07XG4gICAgICAgIHByaXZhdGVzLnNvdW5kID0gZGF0YVsyXTtcblxuICAgICAgICBsZXQgc2hlZXQgPSBuZXcgU3ByaXRlLlNoZWV0KHtcbiAgICAgICAgICBpbWFnZXM6IFtpbWFnZV0sXG4gICAgICAgICAgd2lkdGg6IHRoaXMuZGF0YS50aWxld2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmRhdGEudGlsZWhlaWdodCxcbiAgICAgICAgICBhbmltYXRpb25zOiB0aGlzLmRhdGEuYW5pbWF0aW9uc1xuICAgICAgICB9KTtcblxuICAgICAgICBzaGVldC5jZW50ZXJYID0gTWF0aC5mbG9vcih0aGlzLmRhdGEudGlsZXdpZHRoIC8gMik7XG4gICAgICAgIHNoZWV0LmNlbnRlclkgPSBNYXRoLmZsb29yKHRoaXMuZGF0YS50aWxlaGVpZ2h0IC8gMik7XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0YS5hbHBoYSkge1xuICAgICAgICAgIHNoZWV0LmFscGhhID0gdGhpcy5kYXRhLmFscGhhO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZXMuc3ByaXRlID0gc2hlZXQ7XG5cbiAgICAgICAgLy8g5Y+R6YCB5a6M5oiQ5LqL5Lu277yM56ys5LqM5Liq5Y+C5pWw5Luj6KGo5LiA5qyh5oCn5LqL5Lu2XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwuaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGljb24gKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmljb247XG4gICAgfVxuXG4gICAgc2V0IGljb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLlNraWxsLmljb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGRhdGEgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGE7XG4gICAgfVxuXG4gICAgc2V0IGRhdGEgKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5kYXRhIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBwb3dlciAoKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRoaXMuZGF0YS5wb3dlcikpIHtcbiAgICAgICAgLy8g5Zu65a6a5Lyk5a6zXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucG93ZXI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmRhdGEucG93ZXIgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAvLyDpqrDlrZDkvKTlrrPvvIzkvovlpoIxZDXlsLHmmK/mipXkuIDkuKrkupTpnaLpqrDlrZDvvIzmlbDlgLzlnKgx5YiwNeS5i+mXtFxuICAgICAgICBsZXQgbSA9IHRoaXMuZGF0YS5wb3dlci5tYXRjaCgvKFxcZCspZChcXGQrKS8pO1xuICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YS5wb3dlciwgdGhpcy5kYXRhKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuU2tpbGwgZ290IGludmFsaWQgcG93ZXIgZGF0YVwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGltZXMgPSBwYXJzZUludChtWzFdKTtcbiAgICAgICAgbGV0IGRpY2UgPSBwYXJzZUludChtWzJdKTtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xuICAgICAgICAgIHN1bSArPSBTcHJpdGUucmFuZCgwLCBkaWNlKSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhLnBvd2VyLCB0aGlzLmRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLlNraWxsLnBvd2VyIGludmFsaWQgcG93ZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHBvd2VyICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5wb3dlciByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgdHlwZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnR5cGU7XG4gICAgfVxuXG4gICAgc2V0IHR5cGUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLlNraWxsLnR5cGUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZmlyZSAoYXR0YWNrZXIsIGRpcmVjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZXMuc291bmQpIHtcbiAgICAgICAgcHJpdmF0ZXMuc291bmQubG9hZCgpO1xuICAgICAgICBwcml2YXRlcy5zb3VuZC5wbGF5KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBhbmltYXRpb24gPSBcImF0dGFja1wiICsgZGlyZWN0aW9uO1xuICAgICAgbGV0IHdlYXBvbkFuaW1hdGlvbiA9IHRoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl07XG4gICAgICBsZXQgc3ByaXRlID0gcHJpdmF0ZXMuc3ByaXRlLmNsb25lKCk7XG5cbiAgICAgIC8vIOefq+ato+atpuWZqOaViOaenOS9jee9rlxuICAgICAgc3ByaXRlLnggPSBhdHRhY2tlci5mYWNlUG9zaXRpb24ueCAqIDMyICsgMTY7XG4gICAgICBzcHJpdGUueSA9IGF0dGFja2VyLmZhY2VQb3NpdGlvbi55ICogMzIgKyAxNjtcblxuICAgICAgLy8g55+r5q2j5q2m5Zmo5pWI5p6c5Lit5b+DXG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJYKSAmJiBOdW1iZXIuaXNGaW5pdGUod2VhcG9uQW5pbWF0aW9uLmNlbnRlclkpKSB7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJYID0gd2VhcG9uQW5pbWF0aW9uLmNlbnRlclg7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJZID0gd2VhcG9uQW5pbWF0aW9uLmNlbnRlclk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHdlYXBvbkFuaW1hdGlvbiwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5maXJlIGludmFsaWQgY2VudGVyWC9jZW50ZXJZXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyDlpoLmnpzmmK/ov5zot53nprvmlLvlh7vvvIh0aGlzLmRhdGEuZGlzdGFuY2UgPiAw77yJ77yM6YKj5LmIZGlzdGFuY2XmmK/lroPlt7Lnu4/otbDov4fnmoTot53nprtcbiAgICAgIGxldCBkaXN0YW5jZSA9IDA7XG4gICAgICAvLyDooqvlkb3kuK3nmoRhY3RvcuWIl+ihqFxuICAgICAgbGV0IGhpdHRlZCA9IFtdO1xuICAgICAgbGV0IENoZWNrSGl0ID0gKCkgPT4ge1xuICAgICAgICAvLyDmioDog73miYDlnKjlvZPliY3mlrnmoLxcbiAgICAgICAgbGV0IGwxID0gR2FtZS5hcmVhLm1hcC50aWxlKHNwcml0ZS54LCBzcHJpdGUueSk7XG4gICAgICAgIC8vIOeisOaSnuajgOa1i1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICAgaWYgKGFjdG9yICE9IGF0dGFja2VyICYmIGhpdHRlZC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgaWYgKGFjdG9yLmhpdFRlc3QobDEueCwgbDEueSkpIHtcbiAgICAgICAgICAgICAgaGl0dGVkLnB1c2goYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgbGV0IGxpc3RlbmVyID0gU3ByaXRlLlRpY2tlci5vbihcInRpY2tcIiwgKCkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgLy8g6aOe6KGM6YCf5bqm5pivNFxuICAgICAgICAgIGRpc3RhbmNlICs9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGFuaW1hdGlvbikge1xuICAgICAgICAgIGNhc2UgXCJhdHRhY2tkb3duXCI6XG4gICAgICAgICAgICBzcHJpdGUueSArPSBkaXN0YW5jZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJhdHRhY2tsZWZ0XCI6XG4gICAgICAgICAgICBzcHJpdGUueCAtPSBkaXN0YW5jZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJhdHRhY2tyaWdodFwiOlxuICAgICAgICAgICAgc3ByaXRlLnggKz0gZGlzdGFuY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrdXBcIjpcbiAgICAgICAgICAgIHNwcml0ZS55IC09IGRpc3RhbmNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBDaGVja0hpdCgpO1xuXG4gICAgICAgIC8vIOa1i+ivleeisOaSnuWIsOWimVxuICAgICAgICBsZXQgZ3JpZCA9IEdhbWUuYXJlYS5tYXAudGlsZShzcHJpdGUueCwgc3ByaXRlLnkpO1xuICAgICAgICBpZiAoR2FtZS5hcmVhLm1hcC5oaXRUZXN0KGdyaWQueCwgZ3JpZC55KSkge1xuICAgICAgICAgIEZpbmlzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5aaC5p6c5Ye75Lit5LqG5LiA5Liq5pWM5Lq677yI5Y2V5L2T5Lyk5a6z77yJXG4gICAgICAgIGlmIChoaXR0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIEZpbmlzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5aaC5p6c5piv6L+c56iL5pS75Ye777yM5bm25LiU5pS75Ye76Led56a75bey57uP5Yiw5LqGXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlID49IHRoaXMuZGF0YS5kaXN0YW5jZSkge1xuICAgICAgICAgIEZpbmlzaCgpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgICAvLyDmlLvlh7vnu5PmnZ/ml7bov5DooYxTdG9w5Ye95pWwXG4gICAgICBsZXQgRmluaXNoID0gKCkgPT4ge1xuICAgICAgICBTcHJpdGUuVGlja2VyLm9mZihcInRpY2tcIiwgbGlzdGVuZXIpO1xuXG4gICAgICAgIGlmIChoaXR0ZWQubGVuZ3RoID4gMCAmJiB0aGlzLmRhdGEuYW5pbWF0aW9uc1tcImhpdHRlZFwiXSkge1xuICAgICAgICAgIGxldCBhY3RvciA9IGhpdHRlZFswXTtcbiAgICAgICAgICBzcHJpdGUueCA9IGFjdG9yLnNwcml0ZS54O1xuICAgICAgICAgIHNwcml0ZS55ID0gYWN0b3Iuc3ByaXRlLnk7XG4gICAgICAgICAgc3ByaXRlLnBsYXkoXCJoaXR0ZWRcIik7XG4gICAgICAgICAgaWYgKHNwcml0ZS5wYXVzZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcHJpdGUub24oXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBHYW1lLmxheWVycy5za2lsbExheWVyLnJlbW92ZUNoaWxkKHNwcml0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8g5aaC5p6c5Yqo55S75bey57uP5pKt5a6M77yM5YiZ5YGc5q2iXG4gICAgICAgICAgaWYgKHNwcml0ZS5wYXVzZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcHJpdGUub24oXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBHYW1lLmxheWVycy5za2lsbExheWVyLnJlbW92ZUNoaWxkKHNwcml0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhoaXR0ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIEdhbWUubGF5ZXJzLnNraWxsTGF5ZXIuYXBwZW5kQ2hpbGQoc3ByaXRlKTtcbiAgICAgIHNwcml0ZS5wbGF5KGFuaW1hdGlvbik7XG5cbiAgICAgIGlmICggdGhpcy5kYXRhLmFuaW1hdGlvbnNbYW5pbWF0aW9uXS5hY3RvclxuICAgICAgICAmJiBhdHRhY2tlci5kYXRhLmFuaW1hdGlvbnNbdGhpcy5kYXRhLmFuaW1hdGlvbnNbYW5pbWF0aW9uXS5hY3Rvcl0gKSB7XG4gICAgICAgIGF0dGFja2VyLnBsYXkodGhpcy5kYXRhLmFuaW1hdGlvbnNbYW5pbWF0aW9uXS5hY3RvciwgMyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRhY2tlci5wbGF5KFwiZmFjZVwiICsgZGlyZWN0aW9uLCAwKTtcbiAgICAgICAgYXR0YWNrZXIucGxheShcImF0dGFja1wiICsgZGlyZWN0aW9uLCAzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfSk7XG5cbn0pKCk7XG4iXX0=
