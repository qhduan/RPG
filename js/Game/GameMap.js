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

          // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2NBQVEsT0FBTzs7aUJBQVAsT0FBTzs7YUF5QnRCLGlCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN4QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVXLHFCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakIsWUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekMsaUJBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0FBQ0QsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBRWMsZUFBRztBQUNoQixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUM7T0FDbEM7V0FFYyxhQUFDLEtBQUssRUFBRTtBQUNyQixjQUFNLElBQUks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QkFBeUIsQ0FBQyxDQUFDO09BQzVDOzs7V0FFVSxlQUFHO0FBQ1osZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztPQUNoRDtXQUVVLGFBQUMsS0FBSyxFQUFFO0FBQ2pCLGNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztPQUM3Qzs7O1dBRU8sZUFBRzs7QUFDVCxlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ3hCO1dBRU8sYUFBQyxLQUFLLEVBQUU7QUFDZCxjQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7T0FDMUM7OztXQUVPLGVBQUc7O0FBQ1QsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtPQUN4QjtXQUVPLGFBQUMsS0FBSyxFQUFFO0FBQ2QsY0FBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO09BQzFDOzs7V0FFVyxlQUFHO0FBQ2IsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO09BQy9CO1dBRVcsYUFBQyxLQUFLLEVBQUU7QUFDbEIsY0FBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO09BQzlDOzs7V0F4THNCLE9BQU87S0FBUyxNQUFNLENBQUMsS0FBSyxFQStWbkQsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgR2FtZS5hc3NpZ24oXCJNYXBcIiwgY2xhc3MgR2FtZU1hcCBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBtYXAvJHtpZH0uanNvbmAsIGBtYXAvJHtpZH0uanNgKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IFttYXBEYXRhLCBtYXBJbmZvXSA9IGRhdGE7XG4gICAgICAgICAgbWFwSW5mbyA9IG1hcEluZm8oKTsgLy8gbWFwL2lkLmpz5paH5Lu25Lya6L+U5Zue5LiA5Liq5Ye95pWwXG4gICAgICAgICAgbWFwRGF0YS5pZCA9IGlkO1xuXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIG1hcEluZm8pIHtcbiAgICAgICAgICAgIGlmIChtYXBEYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LCBtYXBEYXRhW2tleV0sIG1hcEluZm9ba2V5XSwgbWFwSW5mbywgbWFwRGF0YSk7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUubG9hZEFyZWEgaW52YWxpZCBkYXRhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwRGF0YVtrZXldID0gbWFwSW5mb1trZXldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBtYXBPYmogPSBuZXcgR2FtZS5NYXAobWFwRGF0YSk7XG4gICAgICAgICAgbWFwT2JqLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZShtYXBPYmopO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmJsb2NrZWRNYXBbeCoxMDAwMCt5XSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXRXYXRlciAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLndhdGVyTWFwW3gqMTAwMDAreV0pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGl0QXV0b0hpZGUgKHgsIHkpIHtcbiAgICAgIGlmIChpbnRlcm5hbCh0aGlzKS5hdXRvSGlkZU1hcFt4KjEwMDAwK3ldKSB7XG4gICAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5hdXRvSGlkZU1hcFt4KjEwMDAwK3ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGJsb2NrZWRNYXAgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmJsb2NrZWRNYXA7XG4gICAgfVxuXG4gICAgc2V0IGJsb2NrZWRNYXAgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5ibG9ja2VkTWFwIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChtYXBEYXRhKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhID0gbWFwRGF0YTtcblxuICAgICAgbGV0IGltYWdlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBwcml2YXRlcy5kYXRhLnRpbGVzZXRzKSB7XG4gICAgICAgIGltYWdlcy5wdXNoKGBtYXAvJHtlbGVtZW50LmltYWdlfWApO1xuICAgICAgfTtcblxuICAgICAgU3ByaXRlLmxvYWQoaW1hZ2VzKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgLy8g6YeK5pS+56m66Ze0XG4gICAgICAgIHByaXZhdGVzLmRhdGEudGlsZXNldHMgPSBudWxsO1xuXG4gICAgICAgIHByaXZhdGVzLnNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgICAgaW1hZ2VzOiBkYXRhLFxuICAgICAgICAgIHdpZHRoOiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHByaXZhdGVzLmRhdGEudGlsZWhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5rC05Zyw5Zu+77yM55So5p2l6L+b6KGMaGl0V2F0ZXLmtYvor5VcbiAgICAgICAgcHJpdmF0ZXMud2F0ZXJNYXAgPSB7fTtcbiAgICAgICAgLy8g6K6h566X6Zi75oyh5Zyw5Zu+77yM5aaC5p6c5Li6b2JqZWN05YiZ5pyJ6Zi75oyh77yMdW5kZWZpbmVk5YiZ5peg6Zi75oyhXG4gICAgICAgIHByaXZhdGVzLmJsb2NrZWRNYXAgPSB7fTtcbiAgICAgICAgLy8g5p+Q5Lqb5bGC5Zyo546p5a626LWw5Yiw5YW25Lit5ZCO5Lya6Ieq5Yqo6ZqQ6JePXG4gICAgICAgIHByaXZhdGVzLmF1dG9IaWRlTWFwID0ge307XG5cbiAgICAgICAgLy8g5L+d5a2Y6L+Z5Liq5Zyw5Zu+55qE5omA5pyJ5Zyw5Zu+5Z2XXG4gICAgICAgIC8vIOi/meS4quepuumXtOWcqGRyYXflkI7kvJrph4rmlL5cbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgbGF5ZXJEYXRhIG9mIHByaXZhdGVzLmRhdGEubGF5ZXJzKSB7XG4gICAgICAgICAgbGV0IGxheWVyT2JqID0gbnVsbDtcbiAgICAgICAgICBpZiAobGF5ZXJEYXRhLm5hbWUgIT0gXCJibG9ja1wiICYmIGxheWVyRGF0YS5uYW1lICE9IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgbGF5ZXJPYmogPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgbGF5ZXJPYmoubmFtZSA9IGxheWVyRGF0YS5uYW1lO1xuICAgICAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLnB1c2gobGF5ZXJPYmopO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuY29sO1xuICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLnJvdztcbiAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0geCArIHkgKiB3aWR0aDtcbiAgICAgICAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgICAgICAgIGxldCBwaWN0dXJlID0gbGF5ZXJEYXRhLmRhdGFbcG9zaXRpb25dIC0gMTtcblxuICAgICAgICAgICAgICBpZiAocGljdHVyZSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxheWVyRGF0YS5uYW1lID09IFwiYmxvY2tcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYmxvY2tlZE1hcFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxheWVyRGF0YS5uYW1lID09IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMud2F0ZXJNYXBba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IHByaXZhdGVzLnNoZWV0LmdldEZyYW1lKHBpY3R1cmUpO1xuICAgICAgICAgICAgICAgICAgZnJhbWUueCA9IHggKiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aDtcbiAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSB5ICogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICBpZiAobGF5ZXJEYXRhLnByb3BlcnRpZXMgJiYgbGF5ZXJEYXRhLnByb3BlcnRpZXMuYXV0b2hpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYXV0b0hpZGVNYXBba2V5XSA9IGxheWVyRGF0YS5wcm9wZXJ0aWVzLmF1dG9oaWRlO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBsYXllck9iai5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlj5HpgIHlrozmiJDkuovku7bvvIznrKzkuozkuKrlj4LmlbDku6PooajmraTkuovku7bmmK/kuIDmrKHmgKfkuovku7bvvIzljbPkuI3kvJrlho3mrKFjb21wbGV0ZVxuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0IGRhdGEgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGE7XG4gICAgfVxuXG4gICAgc2V0IGRhdGEgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5kYXRhIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaWQ7XG4gICAgfVxuXG4gICAgc2V0IGlkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAuaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEud2lkdGggKiB0aGlzLmRhdGEudGlsZXdpZHRoO1xuICAgIH1cblxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLndpZHRoIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oZWlnaHQgKiB0aGlzLmRhdGEudGlsZWhlaWdodDtcbiAgICB9XG5cbiAgICBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAuaGVpZ2h0IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBjb2wgKCkgeyAvLyB3aWR0aCAvIHRpbGV3aWR0aFxuICAgICAgcmV0dXJuIHRoaXMuZGF0YS53aWR0aDtcbiAgICB9XG5cbiAgICBzZXQgY29sICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAuY29sIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCByb3cgKCkgeyAvLyBoZWlnaHQgLyB0aWxlaGVpZ2h0XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodFxuICAgIH1cblxuICAgIHNldCByb3cgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5yb3cgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IG1pbmltYXAgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLm1pbmltYXA7XG4gICAgfVxuXG4gICAgc2V0IG1pbmltYXAgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5taW5pbWFwIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8vIOi/lOWbnuafkOS4quWdkOagh+eCueaJgOWcqOeahOWcsOagvFxuICAgIHRpbGUgKHgsIHkpIHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogTWF0aC5mbG9vcih4IC8gdGhpcy5kYXRhLnRpbGV3aWR0aCksXG4gICAgICAgICAgeTogTWF0aC5mbG9vcih5IC8gdGhpcy5kYXRhLnRpbGVoZWlnaHQpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHgsIHksIHRoaXMuZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLnRpbGUgZ290IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOe7mOWItuWbvueJh++8jOS8muaUueWPmEdhbWUuY3VycmVudEFyZWFcbiAgICBkcmF3ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgR2FtZS5sYXllcnMubWFwTGF5ZXIuY2xlYXIoKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcEhpZGVMYXllci5jbGVhcigpO1xuXG4gICAgICBsZXQgYXV0b2hpZGVMYXllciA9IHt9O1xuXG4gICAgICBwcml2YXRlcy5sYXllcnMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGxheWVyRGF0YSA9IHByaXZhdGVzLmRhdGEubGF5ZXJzW2luZGV4XTtcblxuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGxheWVyRGF0YS5vcGFjaXR5KSkge1xuICAgICAgICAgIGVsZW1lbnQuYWxwaGEgPSBsYXllckRhdGEub3BhY2l0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsYXllckRhdGEucHJvcGVydGllcyAmJiBsYXllckRhdGEucHJvcGVydGllcy5hdXRvaGlkZSkge1xuICAgICAgICAgIGxldCBncm91cCA9IGxheWVyRGF0YS5wcm9wZXJ0aWVzLmF1dG9oaWRlO1xuICAgICAgICAgIGlmICghYXV0b2hpZGVMYXllcltncm91cF0pIHtcbiAgICAgICAgICAgIGF1dG9oaWRlTGF5ZXJbZ3JvdXBdID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXV0b2hpZGVMYXllcltncm91cF0uYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMubWFwTGF5ZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDph4rmlL7lhpfkvZnnqbrpl7RcbiAgICAgIHByaXZhdGVzLmxheWVycyA9IG51bGw7XG4gICAgICBwcml2YXRlcy5kYXRhLmxheWVycyA9IG51bGw7XG5cbiAgICAgIC8vIOe7meaJgOacieiHquWKqOmakOiXj+eahOWcsOWbvue8k+WGsuWxglxuICAgICAgZm9yIChsZXQgZ3JvdXAgaW4gYXV0b2hpZGVMYXllcikge1xuICAgICAgICBhdXRvaGlkZUxheWVyW2dyb3VwXS5jYWNoZSgpO1xuICAgICAgICBsZXQgYXV0b2hpZGVNYXAgPSBuZXcgU3ByaXRlLkJpdG1hcChhdXRvaGlkZUxheWVyW2dyb3VwXS5jYWNoZUNhbnZhcyk7XG4gICAgICAgIGF1dG9oaWRlTWFwLnggPSBhdXRvaGlkZUxheWVyW2dyb3VwXS5jYWNoZVg7XG4gICAgICAgIGF1dG9oaWRlTWFwLnkgPSBhdXRvaGlkZUxheWVyW2dyb3VwXS5jYWNoZVk7XG4gICAgICAgIGF1dG9oaWRlTWFwLm5hbWUgPSBncm91cDtcbiAgICAgICAgR2FtZS5sYXllcnMubWFwSGlkZUxheWVyLmFwcGVuZENoaWxkKGF1dG9oaWRlTWFwKTtcbiAgICAgIH1cbiAgICAgIGF1dG9oaWRlTGF5ZXIgPSBudWxsO1xuXG4gICAgICAvLyDnu5nlhbbku5blnLDlm77nvJPlhrLlsYJcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNhY2hlKCk7XG4gICAgICBsZXQgbWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoR2FtZS5sYXllcnMubWFwTGF5ZXIuY2FjaGVDYW52YXMpO1xuICAgICAgR2FtZS5sYXllcnMubWFwTGF5ZXIuY2xlYXIoKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmFwcGVuZENoaWxkKG1hcCk7XG5cbiAgICAgIGxldCBtaW5pbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIG1pbmltYXAud2lkdGggPSB0aGlzLmNvbCAqIDg7IC8vIOWOn+WcsOWbvueahOWbm+WAjVxuICAgICAgbWluaW1hcC5oZWlnaHQgPSB0aGlzLnJvdyAqIDg7XG4gICAgICBsZXQgbWluaW1hcENvbnRleHQgPSBtaW5pbWFwLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIG1pbmltYXBDb250ZXh0LmRyYXdJbWFnZShtYXAuaW1hZ2UsXG4gICAgICAgIDAsIDAsIG1hcC53aWR0aCwgbWFwLmhlaWdodCxcbiAgICAgICAgMCwgMCwgbWluaW1hcC53aWR0aCwgbWluaW1hcC5oZWlnaHQpO1xuXG4gICAgICBwcml2YXRlcy5taW5pbWFwID0gbWluaW1hcDtcblxuXG4gICAgICBpZiAocHJpdmF0ZXMuZGF0YS5iZ20pIHtcbiAgICAgICAgLy8gc2V0IGxvb3AgPSAtMSwg5peg6ZmQ5b6q546vXG4gICAgICAgIC8vbGV0IGJnbSA9IGNyZWF0ZWpzLlNvdW5kLnBsYXkodGhpcy5kYXRhLmJnbSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgLTEpO1xuICAgICAgICAvL2JnbS5zZXRWb2x1bWUoMC4yKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGJsb2NrID0ge307XG5cbiAgICAgIC8vIOmihOiuvuS6uueJqeWNoOS9jVxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEuYWN0b3JzKSB7XG4gICAgICAgIGZvciAobGV0IGFjdG9yIG9mIHByaXZhdGVzLmRhdGEuYWN0b3JzKSB7XG4gICAgICAgICAgYmxvY2tbYWN0b3IueCoxMDAwMCthY3Rvci55XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g55Sf5oiQ5oCq54mpXG4gICAgICBpZiAoXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3QgJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIuY291bnRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIuY291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBtb25zdGVySWQgPSBudWxsO1xuICAgICAgICAgIGxldCBwcm9iID0gMDtcbiAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3QpIHtcbiAgICAgICAgICAgIHByb2IgKz0gcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIubGlzdFtrZXldO1xuICAgICAgICAgICAgaWYgKHIgPCBwcm9iKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXJJZCA9IGtleTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbW9uc3RlcklkKSB7XG4gICAgICAgICAgICBtb25zdGVySWQgPSBPYmplY3Qua2V5cyhwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0KVswXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgR2FtZS5BY3Rvci5sb2FkKG1vbnN0ZXJJZCkudGhlbigoYWN0b3JPYmopID0+IHtcbiAgICAgICAgICAgIGxldCB4LCB5O1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgeCA9IFNwcml0ZS5yYW5kKDAsIHRoaXMuY29sKTtcbiAgICAgICAgICAgICAgeSA9IFNwcml0ZS5yYW5kKDAsIHRoaXMucm93KTtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmhpdFRlc3QoeCwgeSkgJiYgIWJsb2NrW3gqMTAwMDAreV0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tbeCoxMDAwMCt5XSA9IHRydWU7XG4gICAgICAgICAgICBhY3Rvck9iai54ID0geDtcbiAgICAgICAgICAgIGFjdG9yT2JqLnkgPSB5O1xuICAgICAgICAgICAgR2FtZS5hcmVhLmFjdG9ycy5hZGQoYWN0b3JPYmopO1xuICAgICAgICAgICAgYWN0b3JPYmouZHJhdygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0gJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdCAmJlxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5jb3VudFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5jb3VudDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbGV0IGl0ZW1JZCA9IG51bGw7XG4gICAgICAgICAgbGV0IHByb2IgPSAwO1xuICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdCkge1xuICAgICAgICAgICAgcHJvYiArPSBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5saXN0W2tleV07XG4gICAgICAgICAgICBpZiAociA8IHByb2IpIHtcbiAgICAgICAgICAgICAgaXRlbUlkID0ga2V5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtSWQpIHtcbiAgICAgICAgICAgIGl0ZW1JZCA9IE9iamVjdC5rZXlzKHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QpWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBHYW1lLkl0ZW0ubG9hZChpdGVtSWQpLnRoZW4oKGl0ZW1PYmopID0+IHtcbiAgICAgICAgICAgIGxldCB4LCB5O1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgeCA9IFNwcml0ZS5yYW5kKDAsIHRoaXMuY29sKTtcbiAgICAgICAgICAgICAgeSA9IFNwcml0ZS5yYW5kKDAsIHRoaXMucm93KTtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmhpdFRlc3QoeCwgeSkgJiYgIWJsb2NrW3gqMTAwMDAreV0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tbeCoxMDAwMCt5XSA9IHRydWU7XG4gICAgICAgICAgICBpdGVtT2JqLnggPSB4O1xuICAgICAgICAgICAgaXRlbU9iai55ID0geTtcbiAgICAgICAgICAgIGl0ZW1PYmouaW5uZXIgPSB7fTtcbiAgICAgICAgICAgIGl0ZW1PYmouaW5uZXJbaXRlbUlkXSA9IDE7XG4gICAgICAgICAgICBHYW1lLmFyZWEuaXRlbXMuYWRkKGl0ZW1PYmopO1xuICAgICAgICAgICAgaXRlbU9iai5kcmF3KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
