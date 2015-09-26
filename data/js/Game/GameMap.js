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

  Game.assign("Map", (function (_Sprite$Event) {
    _inherits(GameMap, _Sprite$Event);

    _createClass(GameMap, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (internal(this).blockedMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitWater",
      value: function hitWater(x, y) {
        if (internal(this).waterMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitAutoHide",
      value: function hitAutoHide(x, y) {
        if (internal(this).autoHideMap[x * 10000 + y]) {
          return internal(this).autoHideMap[x * 10000 + y];
        }
        return null;
      }
    }, {
      key: "blockedMap",
      get: function get() {
        return internal(this).blockedMap;
      },
      set: function set(value) {
        throw new Error("Game.Map.blockedMap readonly");
      }
    }], [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("map/" + id + ".json", "map/" + id + ".js").then(function (data) {
            var mapData = data[0];
            var mapInfo = data[1](); // map/id.js文件会返回一个函数
            mapData.id = id;

            for (var key in mapInfo) {
              if (mapData.hasOwnProperty(key)) {
                console.log(key, mapData[key], mapInfo[key], mapInfo, mapData);
                throw new Error("Game.loadArea invalid data");
              }
              mapData[key] = mapInfo[key];
            }

            var mapObj = new Game.Map(mapData);
            mapObj.on("complete", function () {
              resolve(mapObj);
            });
          });
        });
      }
    }]);

    function GameMap(mapData) {
      var _this = this;

      _classCallCheck(this, GameMap);

      _get(Object.getPrototypeOf(GameMap.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.data = mapData;

      var images = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.data.tilesets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          images.push("map/" + element.image);
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

      ;

      Sprite.load(images).then(function (data) {

        // 释放空间
        privates.data.tilesets = null;

        privates.sheet = new Sprite.Sheet({
          images: data,
          width: privates.data.tilewidth,
          height: privates.data.tileheight
        });

        // 水地图，用来进行hitWater测试
        privates.waterMap = {};
        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        privates.blockedMap = {};
        // 某些层在玩家走到其中后会自动隐藏
        privates.autoHideMap = {};

        // 保存这个地图的所有地图块
        // 这个空间在draw后会释放
        privates.layers = [];

        var _iteratorNormalCompletion2 = true;

        // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.data.layers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var layerData = _step2.value;

            var layerObj = null;
            if (layerData.name != "block" && layerData.name != "water") {
              layerObj = new Sprite.Container();
              layerObj.name = layerData.name;
              privates.layers.push(layerObj);
            }

            var width = _this.col;
            var height = _this.row;
            for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                var position = x + y * width;
                var key = x * 10000 + y;
                var picture = layerData.data[position] - 1;

                if (picture >= 0) {
                  if (layerData.name == "block") {
                    privates.blockedMap[key] = true;
                  } else if (layerData.name == "water") {
                    privates.waterMap[key] = true;
                  } else {
                    var frame = privates.sheet.getFrame(picture);
                    frame.x = x * privates.data.tilewidth;
                    frame.y = y * privates.data.tileheight;

                    if (layerData.properties && layerData.properties.autohide) {
                      privates.autoHideMap[key] = layerData.properties.autohide;
                    }

                    layerObj.appendChild(frame);
                  }
                }
              }
            }
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

        _this.emit("complete", true);
      });
    }

    _createClass(GameMap, [{
      key: "tile",

      // 返回某个坐标点所在的地格
      value: function tile(x, y) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
          return {
            x: Math.floor(x / this.data.tilewidth),
            y: Math.floor(y / this.data.tileheight)
          };
        } else {
          console.error(x, y, this.data);
          throw new Error("Game.Map.tile got invalid arguments");
        }
      }

      // 绘制图片，会改变Game.currentArea
    }, {
      key: "draw",
      value: function draw() {
        var _this2 = this;

        var privates = internal(this);
        Game.layers.mapLayer.clear();
        Game.layers.mapHideLayer.clear();

        var autohideLayer = {};

        privates.layers.forEach(function (element, index) {
          var layerData = privates.data.layers[index];

          if (Number.isFinite(layerData.opacity)) {
            element.alpha = layerData.opacity;
          }

          if (layerData.properties && layerData.properties.autohide) {
            var group = layerData.properties.autohide;
            if (!autohideLayer[group]) {
              autohideLayer[group] = new Sprite.Container();
            }
            autohideLayer[group].appendChild(element);
          } else {
            Game.layers.mapLayer.appendChild(element);
          }
        });

        // 释放冗余空间
        privates.layers = null;
        privates.data.layers = null;

        // 给所有自动隐藏的地图缓冲层
        for (var group in autohideLayer) {
          autohideLayer[group].cache();
          var autohideMap = new Sprite.Bitmap(autohideLayer[group].cacheCanvas);
          autohideMap.x = autohideLayer[group].cacheX;
          autohideMap.y = autohideLayer[group].cacheY;
          autohideMap.name = group;
          Game.layers.mapHideLayer.appendChild(autohideMap);
        }
        autohideLayer = null;

        // 给其他地图缓冲层
        Game.layers.mapLayer.cache();
        var map = new Sprite.Bitmap(Game.layers.mapLayer.cacheCanvas);
        Game.layers.mapLayer.clear();
        Game.layers.mapLayer.appendChild(map);

        var minimap = document.createElement("canvas");
        minimap.width = this.col * 8; // 原地图的四倍
        minimap.height = this.row * 8;
        var minimapContext = minimap.getContext("2d");
        minimapContext.drawImage(map.image, 0, 0, map.width, map.height, 0, 0, minimap.width, minimap.height);

        privates.minimap = minimap;

        if (privates.data.bgm) {
          // set loop = -1, 无限循环
          //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
          //bgm.setVolume(0.2);
        }

        var block = {};

        // 生成怪物
        if (privates.data.spawnMonster && privates.data.spawnMonster.list && privates.data.spawnMonster.count) {
          var done = 0;
          while (done < privates.data.spawnMonster.count) {
            var monsterId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnMonster.list) {
              prob += privates.data.spawnMonster.list[key];
              if (r < prob) {
                monsterId = key;
                break;
              }
            }
            if (monsterId) {
              done++;
              Game.Actor.load(monsterId).then(function (actorObj) {
                var x = undefined,
                    y = undefined;
                while (true) {
                  x = Sprite.rand(0, _this2.col);
                  y = Sprite.rand(0, _this2.row);
                  if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                    break;
                  }
                }
                block[x * 10000 + y] = true;
                actorObj.x = x;
                actorObj.y = y;
                Game.area.actors.add(actorObj);
                actorObj.draw();
              });
            }
          }
        }

        if (privates.data.spawnItem && privates.data.spawnItem.list && privates.data.spawnItem.count) {
          var done = 0;

          var _loop = function () {
            var oreId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnItem.list) {
              prob += privates.data.spawnItem.list[key];
              if (r < prob) {
                oreId = key;
                break;
              }
            }
            if (oreId) {
              done++;
              Game.Item.load(oreId).then(function (itemObj) {
                var x = undefined,
                    y = undefined;
                while (true) {
                  x = Sprite.rand(0, _this2.col);
                  y = Sprite.rand(0, _this2.row);
                  if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                    break;
                  }
                }
                block[x * 10000 + y] = true;
                itemObj.x = x;
                itemObj.y = y;
                itemObj.inner = {};
                itemObj.inner[oreId] = 1;
                Game.area.bags.add(itemObj);
                itemObj.draw();
              });
            }
          };

          while (done < privates.data.spawnItem.count) {
            _loop();
          }
        }
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        throw new Error("Game.Map.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).id;
      },
      set: function set(value) {
        throw new Error("Game.Map.id readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return this.data.width * this.data.tilewidth;
      },
      set: function set(value) {
        throw new Error("Game.Map.width readonly");
      }
    }, {
      key: "height",
      get: function get() {
        return this.data.height * this.data.tileheight;
      },
      set: function set(value) {
        throw new Error("Game.Map.height readonly");
      }
    }, {
      key: "col",
      get: function get() {
        // width / tilewidth
        return this.data.width;
      },
      set: function set(value) {
        throw new Error("Game.Map.col readonly");
      }
    }, {
      key: "row",
      get: function get() {
        // height / tileheight
        return this.data.height;
      },
      set: function set(value) {
        throw new Error("Game.Map.row readonly");
      }
    }, {
      key: "minimap",
      get: function get() {
        return internal(this).minimap;
      },
      set: function set(value) {
        throw new Error("Game.Map.minimap readonly");
      }
    }]);

    return GameMap;
  })(Sprite.Event));
})();
//# sourceMappingURL=GameMap.js.map
