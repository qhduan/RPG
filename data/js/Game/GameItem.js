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

  Game.Item = (function (_Sprite$Event) {
    _inherits(GameItem, _Sprite$Event);

    _createClass(GameItem, null, [{
      key: "load",
      value: function load(id, callback) {
        var itemLoader = new Sprite.Loader();
        itemLoader.add("/item/" + id + ".json");
        itemLoader.start();
        itemLoader.on("complete", function (event) {
          var itemData = event.data[0];
          var itemObj = new Game.Item(itemData);
          Game.items[id] = itemObj;
          itemObj.on("complete", function () {
            if (typeof callback == "function") {
              callback();
            }
          });
        });
      }
    }]);

    function GameItem(itemData) {
      var _this = this;

      _classCallCheck(this, GameItem);

      _get(Object.getPrototypeOf(GameItem.prototype), "constructor", this).call(this);

      this.data = itemData;
      this.id = this.data.id;
      this.inner = null;

      if (!this.data.x || !this.data.y) {
        this.data.x = 0;
        this.data.y = 0;
      }

      var loader = new Sprite.Loader();
      loader.add("/item/" + this.data.image);
      loader.start();
      loader.on("complete", function (event) {
        var image = event.data[0];

        _this.icon = image;

        _this.bitmap = new Sprite.Bitmap(image);
        _this.bitmap.x = _this.data.x * 32 + 16;
        _this.bitmap.y = _this.data.y * 32 + 16;

        if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
          _this.bitmap.centerX = _this.data.centerX;
          _this.bitmap.centerY = _this.data.centerY;
        } else {
          console.log(_this.data);
          throw new Error("Game.Item invalid centerX/centerY");
        }

        _this.bitmap.name = _this.id;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
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
      key: "pickup",
      value: function pickup() {
        if (this.inner) {
          Game.windows.pickup.execute("pickup", this);
        }
      }
    }, {
      key: "use",
      value: function use(actor) {
        if (this.data.type == "potion") {
          for (var attribute in this.data.potion) {
            var effect = this.data.potion[attribute];
            if (attribute == "hp") {
              actor.data.hp += effect;
              if (actor.data.hp > actor.data.$hp) {
                actor.data.hp = actor.data.$hp;
              }
            }
          }
        }
      }
    }, {
      key: "clone",
      value: function clone(callback) {
        var itemObj = new Game.Item(this.data);
        itemObj.x = this.x;
        itemObj.y = this.y;
        itemObj.inner = this.inner;
        return itemObj;
      }
    }, {
      key: "erase",
      value: function erase(layer) {
        layer.removeChild(this.bitmap);
      }
    }, {
      key: "draw",
      value: function draw(layer) {
        layer.appendChild(this.bitmap);
      }
    }, {
      key: "x",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        this.data.x = value;
        this.bitmap.x = value * 32 + 16;
      }
    }, {
      key: "y",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        this.data.y = value;
        this.bitmap.y = value * 32 + 16;
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
  })(Sprite.Event);
})();
//# sourceMappingURL=GameItem.js.map
