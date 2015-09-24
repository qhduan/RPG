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
      value: function load(id, callback) {
        if (Game.items && Game.items[id]) {
          if (callback) {
            callback(Game.items[id]);
          }
          return;
        }
        Sprite.Loader.create().add("item/" + id + ".js").start().on("complete", function (event) {
          var itemData = event.data[0]();
          itemData.id = id;
          var itemObj = new Game.Item(itemData);
          Game.items[id] = itemObj;
          itemObj.on("complete", function () {
            if (callback) {
              callback(itemObj);
            }
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

      Sprite.Loader.create().add("item/" + this.data.image).start().on("complete", function (event) {
        var image = event.data[0];

        privates.icon = image;

        privates.bitmap = new Sprite.Bitmap(image);
        privates.bitmap.x = _this.data.x * 32 + 16;
        privates.bitmap.y = _this.data.y * 32 + 16;

        if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
          privates.bitmap.centerX = _this.data.centerX;
          privates.bitmap.centerY = _this.data.centerY;
        } else {
          console.log(_this.data);
          throw new Error("Game.Item invalid centerX/centerY");
        }

        internal(_this).bitmap.name = _this.id;

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
      key: "heroUse",
      value: function heroUse() {
        if (this.inner) {
          Game.windows.pickup.open(this);
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
      key: "clone",
      value: function clone(callback) {
        var itemObj = new Game.Item(Sprite.copy(this.data));
        itemObj.x = this.x;
        itemObj.y = this.y;
        itemObj.centerX = this.centerX;
        itemObj.centerY = this.centerY;
        itemObj.alpha = this.alpha;
        itemObj.visible = this.visible;
        itemObj.inner = this.inner;
        return itemObj;
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
        return internal(this).bitmap.image;
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
//# sourceMappingURL=GameItem.js.map
