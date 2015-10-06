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

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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
            var _data = _slicedToArray(data, 2);

            var mapData = _data[0];
            var mapInfo = _data[1];

            mapInfo = mapInfo(); // map/id.js文件会返回一个函数
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

        console.time("do map");

        var _iteratorNormalCompletion2 = true;
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

        console.timeEnd("do map");

        // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
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

        // 预设人物占位
        if (privates.data.actors) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = privates.data.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var actor = _step3.value;

              block[actor.x * 10000 + actor.y] = true;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }

        // 生成怪物
        if (privates.data.spawnMonster && privates.data.spawnMonster.list && privates.data.spawnMonster.count) {
          for (var i = 0, len = privates.data.spawnMonster.count; i < len; i++) {
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
            if (!monsterId) {
              monsterId = Object.keys(privates.data.spawnMonster.list)[0];
            }
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

        if (privates.data.spawnItem && privates.data.spawnItem.list && privates.data.spawnItem.count) {
          var _loop = function (i, len) {
            var itemId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnItem.list) {
              prob += privates.data.spawnItem.list[key];
              if (r < prob) {
                itemId = key;
                break;
              }
            }
            if (!itemId) {
              itemId = Object.keys(privates.data.spawnItem.list)[0];
            }
            Game.Item.load(itemId).then(function (itemObj) {
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
              itemObj.inner[itemId] = 1;
              Game.area.items.add(itemObj);
              itemObj.draw();
            });
          };

          for (var i = 0, len = privates.data.spawnItem.count; i < len; i++) {
            _loop(i, len);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2NBQVEsT0FBTzs7aUJBQVAsT0FBTzs7YUF5QnRCLGlCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN4QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVXLHFCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakIsWUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekMsaUJBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0FBQ0QsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBRWMsZUFBRztBQUNoQixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUM7T0FDbEM7V0FFYyxhQUFDLEtBQUssRUFBRTtBQUNyQixjQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7T0FDakQ7OzthQWxEVyxjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxVQUFRLEVBQUUscUJBQWdCLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTt1Q0FDeEMsSUFBSTs7Z0JBQXhCLE9BQU87Z0JBQUUsT0FBTzs7QUFDckIsbUJBQU8sR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUNwQixtQkFBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWhCLGlCQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN2QixrQkFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQy9CLHVCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvRCxzQkFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2VBQy9DO0FBQ0QscUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDN0I7O0FBRUQsZ0JBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQyxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWTtBQUNoQyxxQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pCLENBQUMsQ0FBQTtXQUNILENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOzs7QUErQlcsYUF0RFcsT0FBTyxDQXNEakIsT0FBTyxFQUFFOzs7NEJBdERDLE9BQU87O0FBdUQ1QixpQ0F2RHFCLE9BQU8sNkNBdURwQjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQzs7QUFFeEIsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDaEIsNkJBQW9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSw4SEFBRTtjQUFuQyxPQUFPOztBQUNkLGdCQUFNLENBQUMsSUFBSSxVQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUcsQ0FBQztTQUNyQzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQUM7O0FBRUYsWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7OztBQUdqQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUU5QixnQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsZ0JBQU0sRUFBRSxJQUFJO0FBQ1osZUFBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUztBQUM5QixnQkFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUNqQyxDQUFDLENBQUM7OztBQUdILGdCQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFdkIsZ0JBQVEsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUV6QixnQkFBUSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7QUFJMUIsZ0JBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVyQixlQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7O0FBRXZCLGdDQUFzQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sbUlBQUU7Z0JBQW5DLFNBQVM7O0FBQ2hCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsZ0JBQUksU0FBUyxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDMUQsc0JBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNsQyxzQkFBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO0FBQy9CLHNCQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNoQzs7QUFFRCxnQkFBSSxLQUFLLEdBQUcsTUFBSyxHQUFHLENBQUM7QUFDckIsZ0JBQUksTUFBTSxHQUFHLE1BQUssR0FBRyxDQUFDO0FBQ3RCLGlCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlCLG9CQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM3QixvQkFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDeEIsb0JBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQyxvQkFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ2hCLHNCQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFO0FBQzdCLDRCQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzttQkFDakMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFO0FBQ3BDLDRCQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzttQkFDL0IsTUFBTTtBQUNMLHdCQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3Qyx5QkFBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEMseUJBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOztBQUV2Qyx3QkFBSSxTQUFTLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO0FBQ3pELDhCQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO3FCQUMzRDs7QUFFRCw0QkFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzttQkFDN0I7aUJBQ0Y7ZUFFRjthQUNGO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxlQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHMUIsY0FBSyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUVKOztpQkFwSXNCLE9BQU87Ozs7YUErTHpCLGNBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNWLFlBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzVDLGlCQUFPO0FBQ0wsYUFBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3RDLGFBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztXQUN4QyxDQUFDO1NBQ0gsTUFBTTtBQUNMLGlCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGdCQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDeEQ7T0FDRjs7Ozs7YUFHSSxnQkFBRzs7O0FBQ04sWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVqQyxZQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBRXZCLGdCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUs7QUFDMUMsY0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTVDLGNBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDdEMsbUJBQU8sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztXQUNuQzs7QUFFRCxjQUFJLFNBQVMsQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7QUFDekQsZ0JBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBQzFDLGdCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLDJCQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDL0M7QUFDRCx5QkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUMzQyxNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUMzQztTQUNGLENBQUMsQ0FBQzs7O0FBR0gsZ0JBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGdCQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7OztBQUc1QixhQUFLLElBQUksS0FBSyxJQUFJLGFBQWEsRUFBRTtBQUMvQix1QkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLGNBQUksV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEUscUJBQVcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUM1QyxxQkFBVyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzVDLHFCQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbkQ7QUFDRCxxQkFBYSxHQUFHLElBQUksQ0FBQzs7O0FBR3JCLFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLFlBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5RCxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXRDLFlBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsZUFBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM3QixlQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFlBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDaEMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQzNCLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXZDLGdCQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFHM0IsWUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTs7OztTQUl0Qjs7QUFFRCxZQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7OztBQUdmLFlBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7Ozs7OztBQUN4QixrQ0FBa0IsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLG1JQUFFO2tCQUEvQixLQUFLOztBQUNaLG1CQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNyQzs7Ozs7Ozs7Ozs7Ozs7O1NBQ0Y7OztBQUdELFlBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFDL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUNoQztBQUNBLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNwRSxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGdCQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixnQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLGlCQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMvQyxrQkFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QyxrQkFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ1oseUJBQVMsR0FBRyxHQUFHLENBQUM7QUFDaEIsc0JBQU07ZUFDUDthQUNGO0FBQ0QsZ0JBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCx1QkFBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0Q7QUFDRCxnQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzVDLGtCQUFJLENBQUMsWUFBQTtrQkFBRSxDQUFDLFlBQUEsQ0FBQztBQUNULHFCQUFPLElBQUksRUFBRTtBQUNYLGlCQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBSyxHQUFHLENBQUMsQ0FBQztBQUM3QixpQkFBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQUssR0FBRyxDQUFDLENBQUM7QUFDN0Isb0JBQUksQ0FBQyxPQUFLLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1Qyx3QkFBTTtpQkFDUDtlQUNGO0FBQ0QsbUJBQUssQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixzQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixzQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixrQkFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLHNCQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDakIsQ0FBQyxDQUFDO1dBQ0o7U0FDRjs7QUFFRCxZQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFDN0I7Z0NBQ1MsQ0FBQyxFQUFNLEdBQUc7QUFDakIsZ0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixnQkFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsZ0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QixpQkFBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDNUMsa0JBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsa0JBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUNaLHNCQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2Isc0JBQU07ZUFDUDthQUNGO0FBQ0QsZ0JBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxvQkFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkQ7QUFDRCxnQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ3ZDLGtCQUFJLENBQUMsWUFBQTtrQkFBRSxDQUFDLFlBQUEsQ0FBQztBQUNULHFCQUFPLElBQUksRUFBRTtBQUNYLGlCQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBSyxHQUFHLENBQUMsQ0FBQztBQUM3QixpQkFBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQUssR0FBRyxDQUFDLENBQUM7QUFDN0Isb0JBQUksQ0FBQyxPQUFLLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1Qyx3QkFBTTtpQkFDUDtlQUNGO0FBQ0QsbUJBQUssQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixxQkFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxxQkFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxxQkFBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDbkIscUJBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLGtCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IscUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNoQixDQUFDLENBQUM7OztBQTlCTCxlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7a0JBQTFELENBQUMsRUFBTSxHQUFHO1dBK0JsQjtTQUNGO09BR0Y7OztXQTVOUSxlQUFHO0FBQ1YsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO09BQzVCO1dBRVEsYUFBQyxLQUFLLEVBQUU7QUFDZixjQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7T0FDM0M7OztXQUVNLGVBQUc7QUFDUixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7T0FDMUI7V0FFTSxhQUFDLEtBQUssRUFBRTtBQUNiLGNBQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztPQUN6Qzs7O1dBRVMsZUFBRztBQUNYLGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7T0FDOUM7V0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixjQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7T0FDNUM7OztXQUVVLGVBQUc7QUFDWixlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO09BQ2hEO1dBRVUsYUFBQyxLQUFLLEVBQUU7QUFDakIsY0FBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO09BQzdDOzs7V0FFTyxlQUFHOztBQUNULGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDeEI7V0FFTyxhQUFDLEtBQUssRUFBRTtBQUNkLGNBQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztPQUMxQzs7O1dBRU8sZUFBRzs7QUFDVCxlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO09BQ3hCO1dBRU8sYUFBQyxLQUFLLEVBQUU7QUFDZCxjQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7T0FDMUM7OztXQUVXLGVBQUc7QUFDYixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7T0FDL0I7V0FFVyxhQUFDLEtBQUssRUFBRTtBQUNsQixjQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7T0FDOUM7OztXQTVMc0IsT0FBTztLQUFTLE1BQU0sQ0FBQyxLQUFLLEVBbVduRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZU1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBHYW1lLmFzc2lnbihcIk1hcFwiLCBjbGFzcyBHYW1lTWFwIGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcblxuICAgIHN0YXRpYyBsb2FkIChpZCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoYG1hcC8ke2lkfS5qc29uYCwgYG1hcC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgW21hcERhdGEsIG1hcEluZm9dID0gZGF0YTtcbiAgICAgICAgICBtYXBJbmZvID0gbWFwSW5mbygpOyAvLyBtYXAvaWQuanPmlofku7bkvJrov5Tlm57kuIDkuKrlh73mlbBcbiAgICAgICAgICBtYXBEYXRhLmlkID0gaWQ7XG5cbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWFwSW5mbykge1xuICAgICAgICAgICAgaWYgKG1hcERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhrZXksIG1hcERhdGFba2V5XSwgbWFwSW5mb1trZXldLCBtYXBJbmZvLCBtYXBEYXRhKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5sb2FkQXJlYSBpbnZhbGlkIGRhdGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBEYXRhW2tleV0gPSBtYXBJbmZvW2tleV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IG1hcE9iaiA9IG5ldyBHYW1lLk1hcChtYXBEYXRhKTtcbiAgICAgICAgICBtYXBPYmoub24oXCJjb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlKG1hcE9iaik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoaXRUZXN0ICh4LCB5KSB7XG4gICAgICBpZiAoaW50ZXJuYWwodGhpcykuYmxvY2tlZE1hcFt4KjEwMDAwK3ldKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpdFdhdGVyICh4LCB5KSB7XG4gICAgICBpZiAoaW50ZXJuYWwodGhpcykud2F0ZXJNYXBbeCoxMDAwMCt5XSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXRBdXRvSGlkZSAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmF1dG9IaWRlTWFwW3gqMTAwMDAreV0pIHtcbiAgICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmF1dG9IaWRlTWFwW3gqMTAwMDAreV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYmxvY2tlZE1hcCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmxvY2tlZE1hcDtcbiAgICB9XG5cbiAgICBzZXQgYmxvY2tlZE1hcCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmJsb2NrZWRNYXAgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKG1hcERhdGEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRhdGEgPSBtYXBEYXRhO1xuXG4gICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHByaXZhdGVzLmRhdGEudGlsZXNldHMpIHtcbiAgICAgICAgaW1hZ2VzLnB1c2goYG1hcC8ke2VsZW1lbnQuaW1hZ2V9YCk7XG4gICAgICB9O1xuXG4gICAgICBTcHJpdGUubG9hZChpbWFnZXMpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAvLyDph4rmlL7nqbrpl7RcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS50aWxlc2V0cyA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZXMuc2hlZXQgPSBuZXcgU3ByaXRlLlNoZWV0KHtcbiAgICAgICAgICBpbWFnZXM6IGRhdGEsXG4gICAgICAgICAgd2lkdGg6IHByaXZhdGVzLmRhdGEudGlsZXdpZHRoLFxuICAgICAgICAgIGhlaWdodDogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDmsLTlnLDlm77vvIznlKjmnaXov5vooYxoaXRXYXRlcua1i+ivlVxuICAgICAgICBwcml2YXRlcy53YXRlck1hcCA9IHt9O1xuICAgICAgICAvLyDorqHnrpfpmLvmjKHlnLDlm77vvIzlpoLmnpzkuLpvYmplY3TliJnmnInpmLvmjKHvvIx1bmRlZmluZWTliJnml6DpmLvmjKFcbiAgICAgICAgcHJpdmF0ZXMuYmxvY2tlZE1hcCA9IHt9O1xuICAgICAgICAvLyDmn5DkupvlsYLlnKjnjqnlrrbotbDliLDlhbbkuK3lkI7kvJroh6rliqjpmpDol49cbiAgICAgICAgcHJpdmF0ZXMuYXV0b0hpZGVNYXAgPSB7fTtcblxuICAgICAgICAvLyDkv53lrZjov5nkuKrlnLDlm77nmoTmiYDmnInlnLDlm77lnZdcbiAgICAgICAgLy8g6L+Z5Liq56m66Ze05ZyoZHJhd+WQjuS8mumHiuaUvlxuICAgICAgICBwcml2YXRlcy5sYXllcnMgPSBbXTtcblxuICAgICAgICBjb25zb2xlLnRpbWUoXCJkbyBtYXBcIik7XG5cbiAgICAgICAgZm9yIChsZXQgbGF5ZXJEYXRhIG9mIHByaXZhdGVzLmRhdGEubGF5ZXJzKSB7XG4gICAgICAgICAgbGV0IGxheWVyT2JqID0gbnVsbDtcbiAgICAgICAgICBpZiAobGF5ZXJEYXRhLm5hbWUgIT0gXCJibG9ja1wiICYmIGxheWVyRGF0YS5uYW1lICE9IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgbGF5ZXJPYmogPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgbGF5ZXJPYmoubmFtZSA9IGxheWVyRGF0YS5uYW1lO1xuICAgICAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLnB1c2gobGF5ZXJPYmopO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuY29sO1xuICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLnJvdztcbiAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0geCArIHkgKiB3aWR0aDtcbiAgICAgICAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgICAgICAgIGxldCBwaWN0dXJlID0gbGF5ZXJEYXRhLmRhdGFbcG9zaXRpb25dIC0gMTtcblxuICAgICAgICAgICAgICBpZiAocGljdHVyZSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxheWVyRGF0YS5uYW1lID09IFwiYmxvY2tcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYmxvY2tlZE1hcFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxheWVyRGF0YS5uYW1lID09IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMud2F0ZXJNYXBba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IHByaXZhdGVzLnNoZWV0LmdldEZyYW1lKHBpY3R1cmUpO1xuICAgICAgICAgICAgICAgICAgZnJhbWUueCA9IHggKiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aDtcbiAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSB5ICogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICBpZiAobGF5ZXJEYXRhLnByb3BlcnRpZXMgJiYgbGF5ZXJEYXRhLnByb3BlcnRpZXMuYXV0b2hpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYXV0b0hpZGVNYXBba2V5XSA9IGxheWVyRGF0YS5wcm9wZXJ0aWVzLmF1dG9oaWRlO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBsYXllck9iai5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJkbyBtYXBcIik7XG5cbiAgICAgICAgLy8g5Y+R6YCB5a6M5oiQ5LqL5Lu277yM56ys5LqM5Liq5Y+C5pWw5Luj6KGo5q2k5LqL5Lu25piv5LiA5qyh5oCn5LqL5Lu277yM5Y2z5LiN5Lya5YaN5qyhY29tcGxldGVcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgdHJ1ZSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgIH1cblxuICAgIHNldCBkYXRhICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmlkIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoICogdGhpcy5kYXRhLnRpbGV3aWR0aDtcbiAgICB9XG5cbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC53aWR0aCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEuaGVpZ2h0ICogdGhpcy5kYXRhLnRpbGVoZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmhlaWdodCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgY29sICgpIHsgLy8gd2lkdGggLyB0aWxld2lkdGhcbiAgICAgIHJldHVybiB0aGlzLmRhdGEud2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IGNvbCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmNvbCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcm93ICgpIHsgLy8gaGVpZ2h0IC8gdGlsZWhlaWdodFxuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oZWlnaHRcbiAgICB9XG5cbiAgICBzZXQgcm93ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAucm93IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBtaW5pbWFwICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5taW5pbWFwO1xuICAgIH1cblxuICAgIHNldCBtaW5pbWFwICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAubWluaW1hcCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvLyDov5Tlm57mn5DkuKrlnZDmoIfngrnmiYDlnKjnmoTlnLDmoLxcbiAgICB0aWxlICh4LCB5KSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHgpICYmIE51bWJlci5pc0Zpbml0ZSh5KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IE1hdGguZmxvb3IoeCAvIHRoaXMuZGF0YS50aWxld2lkdGgpLFxuICAgICAgICAgIHk6IE1hdGguZmxvb3IoeSAvIHRoaXMuZGF0YS50aWxlaGVpZ2h0KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih4LCB5LCB0aGlzLmRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC50aWxlIGdvdCBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDnu5jliLblm77niYfvvIzkvJrmlLnlj5hHYW1lLmN1cnJlbnRBcmVhXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNsZWFyKCk7XG4gICAgICBHYW1lLmxheWVycy5tYXBIaWRlTGF5ZXIuY2xlYXIoKTtcblxuICAgICAgbGV0IGF1dG9oaWRlTGF5ZXIgPSB7fTtcblxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBsYXllckRhdGEgPSBwcml2YXRlcy5kYXRhLmxheWVyc1tpbmRleF07XG5cbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShsYXllckRhdGEub3BhY2l0eSkpIHtcbiAgICAgICAgICBlbGVtZW50LmFscGhhID0gbGF5ZXJEYXRhLm9wYWNpdHk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGF5ZXJEYXRhLnByb3BlcnRpZXMgJiYgbGF5ZXJEYXRhLnByb3BlcnRpZXMuYXV0b2hpZGUpIHtcbiAgICAgICAgICBsZXQgZ3JvdXAgPSBsYXllckRhdGEucHJvcGVydGllcy5hdXRvaGlkZTtcbiAgICAgICAgICBpZiAoIWF1dG9oaWRlTGF5ZXJbZ3JvdXBdKSB7XG4gICAgICAgICAgICBhdXRvaGlkZUxheWVyW2dyb3VwXSA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGF1dG9oaWRlTGF5ZXJbZ3JvdXBdLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6YeK5pS+5YaX5L2Z56m66Ze0XG4gICAgICBwcml2YXRlcy5sYXllcnMgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuZGF0YS5sYXllcnMgPSBudWxsO1xuXG4gICAgICAvLyDnu5nmiYDmnInoh6rliqjpmpDol4/nmoTlnLDlm77nvJPlhrLlsYJcbiAgICAgIGZvciAobGV0IGdyb3VwIGluIGF1dG9oaWRlTGF5ZXIpIHtcbiAgICAgICAgYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGUoKTtcbiAgICAgICAgbGV0IGF1dG9oaWRlTWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVDYW52YXMpO1xuICAgICAgICBhdXRvaGlkZU1hcC54ID0gYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVYO1xuICAgICAgICBhdXRvaGlkZU1hcC55ID0gYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVZO1xuICAgICAgICBhdXRvaGlkZU1hcC5uYW1lID0gZ3JvdXA7XG4gICAgICAgIEdhbWUubGF5ZXJzLm1hcEhpZGVMYXllci5hcHBlbmRDaGlsZChhdXRvaGlkZU1hcCk7XG4gICAgICB9XG4gICAgICBhdXRvaGlkZUxheWVyID0gbnVsbDtcblxuICAgICAgLy8g57uZ5YW25LuW5Zyw5Zu+57yT5Yay5bGCXG4gICAgICBHYW1lLmxheWVycy5tYXBMYXllci5jYWNoZSgpO1xuICAgICAgbGV0IG1hcCA9IG5ldyBTcHJpdGUuQml0bWFwKEdhbWUubGF5ZXJzLm1hcExheWVyLmNhY2hlQ2FudmFzKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNsZWFyKCk7XG4gICAgICBHYW1lLmxheWVycy5tYXBMYXllci5hcHBlbmRDaGlsZChtYXApO1xuXG4gICAgICBsZXQgbWluaW1hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBtaW5pbWFwLndpZHRoID0gdGhpcy5jb2wgKiA4OyAvLyDljp/lnLDlm77nmoTlm5vlgI1cbiAgICAgIG1pbmltYXAuaGVpZ2h0ID0gdGhpcy5yb3cgKiA4O1xuICAgICAgbGV0IG1pbmltYXBDb250ZXh0ID0gbWluaW1hcC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBtaW5pbWFwQ29udGV4dC5kcmF3SW1hZ2UobWFwLmltYWdlLFxuICAgICAgICAwLCAwLCBtYXAud2lkdGgsIG1hcC5oZWlnaHQsXG4gICAgICAgIDAsIDAsIG1pbmltYXAud2lkdGgsIG1pbmltYXAuaGVpZ2h0KTtcblxuICAgICAgcHJpdmF0ZXMubWluaW1hcCA9IG1pbmltYXA7XG5cblxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEuYmdtKSB7XG4gICAgICAgIC8vIHNldCBsb29wID0gLTEsIOaXoOmZkOW+queOr1xuICAgICAgICAvL2xldCBiZ20gPSBjcmVhdGVqcy5Tb3VuZC5wbGF5KHRoaXMuZGF0YS5iZ20sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIC0xKTtcbiAgICAgICAgLy9iZ20uc2V0Vm9sdW1lKDAuMik7XG4gICAgICB9XG5cbiAgICAgIGxldCBibG9jayA9IHt9O1xuXG4gICAgICAvLyDpooTorr7kurrnianljaDkvY1cbiAgICAgIGlmIChwcml2YXRlcy5kYXRhLmFjdG9ycykge1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBwcml2YXRlcy5kYXRhLmFjdG9ycykge1xuICAgICAgICAgIGJsb2NrW2FjdG9yLngqMTAwMDArYWN0b3IueV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeUn+aIkOaAqueJqVxuICAgICAgaWYgKFxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3RlciAmJlxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0ICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmNvdW50XG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmNvdW50OyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgbW9uc3RlcklkID0gbnVsbDtcbiAgICAgICAgICBsZXQgcHJvYiA9IDA7XG4gICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0KSB7XG4gICAgICAgICAgICBwcm9iICs9IHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3Rba2V5XTtcbiAgICAgICAgICAgIGlmIChyIDwgcHJvYikge1xuICAgICAgICAgICAgICBtb25zdGVySWQgPSBrZXk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW1vbnN0ZXJJZCkge1xuICAgICAgICAgICAgbW9uc3RlcklkID0gT2JqZWN0LmtleXMocHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIubGlzdClbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIEdhbWUuQWN0b3IubG9hZChtb25zdGVySWQpLnRoZW4oKGFjdG9yT2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgeCwgeTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHggPSBTcHJpdGUucmFuZCgwLCB0aGlzLmNvbCk7XG4gICAgICAgICAgICAgIHkgPSBTcHJpdGUucmFuZCgwLCB0aGlzLnJvdyk7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5oaXRUZXN0KHgsIHkpICYmICFibG9ja1t4KjEwMDAwK3ldKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrW3gqMTAwMDAreV0gPSB0cnVlO1xuICAgICAgICAgICAgYWN0b3JPYmoueCA9IHg7XG4gICAgICAgICAgICBhY3Rvck9iai55ID0geTtcbiAgICAgICAgICAgIEdhbWUuYXJlYS5hY3RvcnMuYWRkKGFjdG9yT2JqKTtcbiAgICAgICAgICAgIGFjdG9yT2JqLmRyYXcoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QgJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0uY291bnRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0uY291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtSWQgPSBudWxsO1xuICAgICAgICAgIGxldCBwcm9iID0gMDtcbiAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QpIHtcbiAgICAgICAgICAgIHByb2IgKz0gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdFtrZXldO1xuICAgICAgICAgICAgaWYgKHIgPCBwcm9iKSB7XG4gICAgICAgICAgICAgIGl0ZW1JZCA9IGtleTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbUlkKSB7XG4gICAgICAgICAgICBpdGVtSWQgPSBPYmplY3Qua2V5cyhwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5saXN0KVswXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgR2FtZS5JdGVtLmxvYWQoaXRlbUlkKS50aGVuKChpdGVtT2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgeCwgeTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHggPSBTcHJpdGUucmFuZCgwLCB0aGlzLmNvbCk7XG4gICAgICAgICAgICAgIHkgPSBTcHJpdGUucmFuZCgwLCB0aGlzLnJvdyk7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5oaXRUZXN0KHgsIHkpICYmICFibG9ja1t4KjEwMDAwK3ldKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrW3gqMTAwMDAreV0gPSB0cnVlO1xuICAgICAgICAgICAgaXRlbU9iai54ID0geDtcbiAgICAgICAgICAgIGl0ZW1PYmoueSA9IHk7XG4gICAgICAgICAgICBpdGVtT2JqLmlubmVyID0ge307XG4gICAgICAgICAgICBpdGVtT2JqLmlubmVyW2l0ZW1JZF0gPSAxO1xuICAgICAgICAgICAgR2FtZS5hcmVhLml0ZW1zLmFkZChpdGVtT2JqKTtcbiAgICAgICAgICAgIGl0ZW1PYmouZHJhdygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
