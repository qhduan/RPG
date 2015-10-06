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
      var _this = this;

      _classCallCheck(this, GameItem);

      _get(Object.getPrototypeOf(GameItem.prototype), "constructor", this).call(this);
      var privates = internal(this);

      privates.data = itemData;
      privates.inner = null;

      if (!this.data.x || !this.data.y) {
        this.data.x = 0;
        this.data.y = 0;
      }

      if (this.data.image) {
        Sprite.load("item/" + this.data.image).then(function (data) {
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
        this.emit("complete", true);
      }
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
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07Y0FBUSxRQUFROztpQkFBUixRQUFROzthQUVwQixjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxXQUFTLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNoRCxnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekIsb0JBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGdCQUFJLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsZ0JBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLG1CQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQzNCLHFCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztBQUVXLGFBaEJZLFFBQVEsQ0FnQm5CLFFBQVEsRUFBRTs7OzRCQWhCQyxRQUFROztBQWlCOUIsaUNBakJzQixRQUFRLDZDQWlCdEI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLGNBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxD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QUU7QUFDbkIsZUFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsY0FBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO09BQ2hEOzs7V0E3SXVCLFFBQVE7S0FBUyxNQUFNLENBQUMsS0FBSyxFQXdOckQsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIEdhbWUuYXNzaWduKFwiSXRlbVwiLCBjbGFzcyBHYW1lSXRlbSBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBpdGVtLyR7aWR9LmpzYCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCBpdGVtRGF0YSA9IGRhdGFbMF0oKTtcbiAgICAgICAgICBpdGVtRGF0YS5pZCA9IGlkO1xuICAgICAgICAgIGxldCBpdGVtT2JqID0gbmV3IEdhbWUuSXRlbShpdGVtRGF0YSk7XG4gICAgICAgICAgR2FtZS5pdGVtc1tpZF0gPSBpdGVtT2JqO1xuICAgICAgICAgIGl0ZW1PYmoub24oXCJjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGl0ZW1PYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChpdGVtRGF0YSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBwcml2YXRlcy5kYXRhID0gaXRlbURhdGE7XG4gICAgICBwcml2YXRlcy5pbm5lciA9IG51bGw7XG5cbiAgICAgIGlmICghdGhpcy5kYXRhLnggfHwgIXRoaXMuZGF0YS55KSB7XG4gICAgICAgIHRoaXMuZGF0YS54ID0gMDtcbiAgICAgICAgdGhpcy5kYXRhLnkgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRhLmltYWdlKSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBpdGVtLyR7dGhpcy5kYXRhLmltYWdlfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBkYXRhWzBdO1xuICAgICAgICAgIHByaXZhdGVzLmljb24gPSBpbWFnZTtcblxuICAgICAgICAgIHByaXZhdGVzLmJpdG1hcCA9IG5ldyBTcHJpdGUuQml0bWFwKGltYWdlKTtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAueCA9IHRoaXMuZGF0YS54ICogMzIgKyAxNjtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAueSA9IHRoaXMuZGF0YS55ICogMzIgKyAxNjtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAubmFtZSA9IHRoaXMuaWQ7XG5cbiAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLmRhdGEuY2VudGVyWCkgJiYgTnVtYmVyLmlzSW50ZWdlcih0aGlzLmRhdGEuY2VudGVyWSkpIHtcbiAgICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC5jZW50ZXJYID0gdGhpcy5kYXRhLmNlbnRlclg7XG4gICAgICAgICAgICBwcml2YXRlcy5iaXRtYXAuY2VudGVyWSA9IHRoaXMuZGF0YS5jZW50ZXJZO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5JdGVtIGludmFsaWQgY2VudGVyWC9jZW50ZXJZXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIOWPkemAgeWujOaIkOS6i+S7tu+8jOesrOS6jOS4quWPguaVsOS7o+ihqOS4gOasoeaAp+S6i+S7tlxuICAgICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBpZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS5pZDtcbiAgICB9XG5cbiAgICBzZXQgaWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGljb24gKCkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmJpdG1hcCkge1xuICAgICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYml0bWFwLmltYWdlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc2V0IGljb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uaWNvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgZGF0YSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXIgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmlubmVyO1xuICAgIH1cblxuICAgIHNldCBpbm5lciAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmlubmVyID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEueDtcbiAgICB9XG5cbiAgICBzZXQgeCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuZGF0YS54ID0gdmFsdWU7XG4gICAgICBwcml2YXRlcy5iaXRtYXAueCA9IHZhbHVlICogMzIgKyAxNjtcbiAgICB9XG5cbiAgICBnZXQgeSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS55O1xuICAgIH1cblxuICAgIHNldCB5ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhLnkgPSB2YWx1ZTtcbiAgICAgIHByaXZhdGVzLmJpdG1hcC55ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgIH1cblxuICAgIGdldCB2aXNpYmxlICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iaXRtYXAudmlzaWJsZTtcbiAgICB9XG5cbiAgICBzZXQgdmlzaWJsZSAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmJpdG1hcC52aXNpYmxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGFscGhhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iaXRtYXAuYWxwaGE7XG4gICAgfVxuXG4gICAgc2V0IGFscGhhICh2YWx1ZSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiYgdmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSAxKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmJpdG1hcC5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuSXRlbS5hbHBoYSBnb3QgaW52YWxpZCB2YWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogdGhpcy54LFxuICAgICAgICB5OiB0aGlzLnlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IHBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5JdGVtLnBvc2l0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaGl0QXJlYSAmJiB0aGlzLmRhdGEuaGl0QXJlYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5kYXRhLmhpdEFyZWEpIHtcbiAgICAgICAgICBpZiAoeCA9PSB0aGlzLnggKyBwWzBdICYmIHkgPT0gdGhpcy55ICsgcFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5oaXRUZXN0IGludmFsaWQgZGF0YVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZXJvVXNlICgpIHtcbiAgICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEucGlja3VwQ29uZGl0aW9uKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5waWNrdXBDb25kaXRpb24oKSkge1xuICAgICAgICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDkuI3nrKblkIjmnaHku7ZcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhLnVzZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5kYXRhLnVzZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRhLnR5cGUgPT0gXCJwb3Rpb25cIikge1xuICAgICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gdGhpcy5kYXRhLnBvdGlvbikge1xuICAgICAgICAgIGxldCBlZmZlY3QgPSB0aGlzLmRhdGEucG90aW9uW2F0dHJpYnV0ZV07XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PSBcImhwXCIpIHtcbiAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmhwID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmhwICsgZWZmZWN0LFxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS4kaHBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgICAgIHRleHQ6IGBocCske2VmZmVjdH1gLFxuICAgICAgICAgICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGV4dC5jZW50ZXJYID0gTWF0aC5mbG9vcih0ZXh0LndpZHRoIC8gMik7XG4gICAgICAgICAgICB0ZXh0LmNlbnRlclkgPSBNYXRoLmZsb29yKHRleHQuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRleHQueCA9IEdhbWUuaGVyby5zcHJpdGUueDtcbiAgICAgICAgICAgIHRleHQueSA9IEdhbWUuaGVyby5zcHJpdGUueTtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBTcHJpdGUuVGlja2VyLndoaWxlcygxMDAsIChsYXN0KSA9PiB7XG4gICAgICAgICAgICAgIHRleHQueSAtPSAzO1xuICAgICAgICAgICAgICBpZiAobGFzdCkge1xuICAgICAgICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIucmVtb3ZlQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBHYW1lLmhlcm8uZGF0YS5pdGVtc1t0aGlzLmlkXS0tO1xuICAgICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuaXRlbXNbdGhpcy5pZF0gPD0gMCkge1xuICAgICAgICAgIGRlbGV0ZSBHYW1lLmhlcm8uZGF0YS5pdGVtc1t0aGlzLmlkXTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBwb3Rpb25cblxuICAgIH1cblxuICAgIGVyYXNlIChsYXllcikge1xuICAgICAgR2FtZS5sYXllcnMuaXRlbUxheWVyLnJlbW92ZUNoaWxkKGludGVybmFsKHRoaXMpLmJpdG1hcCk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBHYW1lLmxheWVycy5pdGVtTGF5ZXIuYXBwZW5kQ2hpbGQoaW50ZXJuYWwodGhpcykuYml0bWFwKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
