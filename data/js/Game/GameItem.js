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

  Game.assign("Item", (function (_Sprite$Event) {
    _inherits(GameItem, _Sprite$Event);

    _createClass(GameItem, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("item/" + id + ".js").then(function (data) {
            var itemData = data[0]();
            itemData.id = id;
            var itemObj = new Game.Item(itemData);
            Game.items[id] = itemObj;
            itemObj.on("complete", function () {
              resolve(itemObj);
            });
          });
        });
      }
    }]);

    function GameItem(itemData) {
      _classCallCheck(this, GameItem);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameItem).call(this));

      var privates = internal(_this);

      privates.data = itemData;
      privates.inner = null;

      if (!_this.data.x || !_this.data.y) {
        _this.data.x = 0;
        _this.data.y = 0;
      }

      if (_this.data.image) {
        Sprite.load("item/" + _this.data.image).then(function (data) {
          var image = data[0];
          privates.icon = image;

          privates.bitmap = new Sprite.Bitmap(image);
          privates.bitmap.x = _this.data.x * 32 + 16;
          privates.bitmap.y = _this.data.y * 32 + 16;
          privates.bitmap.name = _this.id;

          if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
            privates.bitmap.centerX = _this.data.centerX;
            privates.bitmap.centerY = _this.data.centerY;
          } else {
            console.log(_this.data);
            throw new Error("Game.Item invalid centerX/centerY");
          }

          // 发送完成事件，第二个参数代表一次性事件
          _this.emit("complete", true);
        });
      } else {
        _this.emit("complete", true);
      }
      return _this;
    }

    _createClass(GameItem, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.data.hitArea[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var p = _step.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
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

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "heroUse",
      value: function heroUse() {
        if (this.inner) {
          if (this.data.pickupCondition) {
            if (this.data.pickupCondition()) {
              Game.windows.pickup.open(this);
            } else {
              // 不符合条件
            }
          } else {
              Game.windows.pickup.open(this);
            }
        }

        if (typeof this.data.use == "function") {
          this.data.use();
        }

        if (this.data.type == "potion") {
          for (var attribute in this.data.potion) {
            var effect = this.data.potion[attribute];
            if (attribute == "hp") {
              (function () {
                Game.hero.data.hp = Math.min(Game.hero.data.hp + effect, Game.hero.data.$hp);
                var text = new Sprite.Text({
                  text: "hp+" + effect,
                  color: "black",
                  fontSize: 20
                });
                text.centerX = Math.floor(text.width / 2);
                text.centerY = Math.floor(text.height);
                text.x = Game.hero.sprite.x;
                text.y = Game.hero.sprite.y;
                Game.layers.actorLayer.appendChild(text);
                Sprite.Ticker.whiles(100, function (last) {
                  text.y -= 3;
                  if (last) {
                    Game.layers.actorLayer.removeChild(text);
                  }
                });
              })();
            }
          }
          Game.hero.data.items[this.id]--;
          if (Game.hero.data.items[this.id] <= 0) {
            delete Game.hero.data.items[this.id];
          }
        } // potion
      }
    }, {
      key: "erase",
      value: function erase(layer) {
        Game.layers.itemLayer.removeChild(internal(this).bitmap);
      }
    }, {
      key: "draw",
      value: function draw() {
        Game.layers.itemLayer.appendChild(internal(this).bitmap);
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Item.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        if (internal(this).bitmap) {
          return internal(this).bitmap.image;
        }
        return null;
      },
      set: function set(value) {
        throw new Error("Game.Item.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Item.data readonly");
      }
    }, {
      key: "inner",
      get: function get() {
        return internal(this).inner;
      },
      set: function set(value) {
        internal(this).inner = value;
      }
    }, {
      key: "x",
      get: function get() {
        return internal(this).data.x;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.x = value;
        privates.bitmap.x = value * 32 + 16;
      }
    }, {
      key: "y",
      get: function get() {
        return internal(this).data.y;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.y = value;
        privates.bitmap.y = value * 32 + 16;
      }
    }, {
      key: "visible",
      get: function get() {
        return internal(this).bitmap.visible;
      },
      set: function set(value) {
        internal(this).bitmap.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).bitmap.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).bitmap.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Item.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        console.error(this.data);
        throw new Error("Game.Item.position readonly");
      }
    }]);

    return GameItem;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07Y0FBUSxRQUFROztpQkFBUixRQUFROzsyQkFFbkIsRUFBRSxFQUFFO0FBQ2YsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsZ0JBQU0sQ0FBQyxJQUFJLFdBQVMsRUFBRSxTQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ2hELGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN6QixvQkFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsZ0JBQUksT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxnQkFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDekIsbUJBQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQU07QUFDM0IscUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNsQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7O0FBRUQsYUFoQndCLFFBQVEsQ0FnQm5CLFFBQVEsRUFBRTs0QkFoQkMsUUFBUTs7eUVBQVIsUUFBUTs7QUFrQjlCLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTSxDQUFDOztBQUU5QixjQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztBQUN6QixjQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsVUFBSSxDQUFDLE1BQUssSUFB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QUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgR2FtZS5hc3NpZ24oXCJJdGVtXCIsIGNsYXNzIEdhbWVJdGVtIGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcblxuICAgIHN0YXRpYyBsb2FkIChpZCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoYGl0ZW0vJHtpZH0uanNgKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IGl0ZW1EYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIGl0ZW1EYXRhLmlkID0gaWQ7XG4gICAgICAgICAgbGV0IGl0ZW1PYmogPSBuZXcgR2FtZS5JdGVtKGl0ZW1EYXRhKTtcbiAgICAgICAgICBHYW1lLml0ZW1zW2lkXSA9IGl0ZW1PYmo7XG4gICAgICAgICAgaXRlbU9iai5vbihcImNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbU9iaik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKGl0ZW1EYXRhKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG5cbiAgICAgIHByaXZhdGVzLmRhdGEgPSBpdGVtRGF0YTtcbiAgICAgIHByaXZhdGVzLmlubmVyID0gbnVsbDtcblxuICAgICAgaWYgKCF0aGlzLmRhdGEueCB8fCAhdGhpcy5kYXRhLnkpIHtcbiAgICAgICAgdGhpcy5kYXRhLnggPSAwO1xuICAgICAgICB0aGlzLmRhdGEueSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRhdGEuaW1hZ2UpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoYGl0ZW0vJHt0aGlzLmRhdGEuaW1hZ2V9YCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBpbWFnZSA9IGRhdGFbMF07XG4gICAgICAgICAgcHJpdmF0ZXMuaWNvbiA9IGltYWdlO1xuXG4gICAgICAgICAgcHJpdmF0ZXMuYml0bWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoaW1hZ2UpO1xuICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC54ID0gdGhpcy5kYXRhLnggKiAzMiArIDE2O1xuICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC55ID0gdGhpcy5kYXRhLnkgKiAzMiArIDE2O1xuICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC5uYW1lID0gdGhpcy5pZDtcblxuICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHRoaXMuZGF0YS5jZW50ZXJYKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMuZGF0YS5jZW50ZXJZKSkge1xuICAgICAgICAgICAgcHJpdmF0ZXMuYml0bWFwLmNlbnRlclggPSB0aGlzLmRhdGEuY2VudGVyWDtcbiAgICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC5jZW50ZXJZID0gdGhpcy5kYXRhLmNlbnRlclk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0gaW52YWxpZCBjZW50ZXJYL2NlbnRlcllcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g5Y+R6YCB5a6M5oiQ5LqL5Lu277yM56ys5LqM5Liq5Y+C5pWw5Luj6KGo5LiA5qyh5oCn5LqL5Lu2XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuSXRlbS5pZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaWNvbiAoKSB7XG4gICAgICBpZiAoaW50ZXJuYWwodGhpcykuYml0bWFwKSB7XG4gICAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iaXRtYXAuaW1hZ2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzZXQgaWNvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuSXRlbS5pY29uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgIH1cblxuICAgIHNldCBkYXRhICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuSXRlbS5kYXRhIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpbm5lciAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaW5uZXI7XG4gICAgfVxuXG4gICAgc2V0IGlubmVyICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaW5uZXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgeCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS54O1xuICAgIH1cblxuICAgIHNldCB4ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhLnggPSB2YWx1ZTtcbiAgICAgIHByaXZhdGVzLmJpdG1hcC54ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgIH1cblxuICAgIGdldCB5ICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhLnk7XG4gICAgfVxuXG4gICAgc2V0IHkgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRhdGEueSA9IHZhbHVlO1xuICAgICAgcHJpdmF0ZXMuYml0bWFwLnkgPSB2YWx1ZSAqIDMyICsgMTY7XG4gICAgfVxuXG4gICAgZ2V0IHZpc2libGUgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmJpdG1hcC52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuYml0bWFwLnZpc2libGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYWxwaGEgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmJpdG1hcC5hbHBoYTtcbiAgICB9XG5cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDEpIHtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuYml0bWFwLmFscGhhID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5JdGVtLmFscGhhIGdvdCBpbnZhbGlkIHZhbHVlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBwb3NpdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgIHk6IHRoaXMueVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXQgcG9zaXRpb24gKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0ucG9zaXRpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5oaXRBcmVhICYmIHRoaXMuZGF0YS5oaXRBcmVhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgZm9yIChsZXQgcCBvZiB0aGlzLmRhdGEuaGl0QXJlYSkge1xuICAgICAgICAgIGlmICh4ID09IHRoaXMueCArIHBbMF0gJiYgeSA9PSB0aGlzLnkgKyBwWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmhpdFRlc3QgaW52YWxpZCBkYXRhXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlcm9Vc2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW5uZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWNrdXBDb25kaXRpb24pIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnBpY2t1cENvbmRpdGlvbigpKSB7XG4gICAgICAgICAgICBHYW1lLndpbmRvd3MucGlja3VwLm9wZW4odGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOS4jeespuWQiOadoeS7tlxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBHYW1lLndpbmRvd3MucGlja3VwLm9wZW4odGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmRhdGEudXNlID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmRhdGEudXNlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRhdGEudHlwZSA9PSBcInBvdGlvblwiKSB7XG4gICAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBpbiB0aGlzLmRhdGEucG90aW9uKSB7XG4gICAgICAgICAgbGV0IGVmZmVjdCA9IHRoaXMuZGF0YS5wb3Rpb25bYXR0cmlidXRlXTtcbiAgICAgICAgICBpZiAoYXR0cmlidXRlID09IFwiaHBcIikge1xuICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaHAgPSBNYXRoLm1pbihcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaHAgKyBlZmZlY3QsXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLiRocFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgICAgICAgdGV4dDogYGhwKyR7ZWZmZWN0fWAsXG4gICAgICAgICAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0ZXh0LmNlbnRlclggPSBNYXRoLmZsb29yKHRleHQud2lkdGggLyAyKTtcbiAgICAgICAgICAgIHRleHQuY2VudGVyWSA9IE1hdGguZmxvb3IodGV4dC5oZWlnaHQpO1xuICAgICAgICAgICAgdGV4dC54ID0gR2FtZS5oZXJvLnNwcml0ZS54O1xuICAgICAgICAgICAgdGV4dC55ID0gR2FtZS5oZXJvLnNwcml0ZS55O1xuICAgICAgICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIFNwcml0ZS5UaWNrZXIud2hpbGVzKDEwMCwgKGxhc3QpID0+IHtcbiAgICAgICAgICAgICAgdGV4dC55IC09IDM7XG4gICAgICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEdhbWUuaGVyby5kYXRhLml0ZW1zW3RoaXMuaWRdLS07XG4gICAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5pdGVtc1t0aGlzLmlkXSA8PSAwKSB7XG4gICAgICAgICAgZGVsZXRlIEdhbWUuaGVyby5kYXRhLml0ZW1zW3RoaXMuaWRdO1xuICAgICAgICB9XG4gICAgICB9IC8vIHBvdGlvblxuXG4gICAgfVxuXG4gICAgZXJhc2UgKGxheWVyKSB7XG4gICAgICBHYW1lLmxheWVycy5pdGVtTGF5ZXIucmVtb3ZlQ2hpbGQoaW50ZXJuYWwodGhpcykuYml0bWFwKTtcbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgIEdhbWUubGF5ZXJzLml0ZW1MYXllci5hcHBlbmRDaGlsZChpbnRlcm5hbCh0aGlzKS5iaXRtYXApO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19
