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
            if (layerData.name != "block") {
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
                  } else {
                    var frame = privates.sheet.getFrame(picture);
                    frame.x = x * privates.data.tilewidth;
                    frame.y = y * privates.data.tileheight;
                    layerObj.appendChild(frame);
                    if (layerData.name == "water") {
                      privates.waterMap[key] = true;
                    }
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

        privates.layers.forEach(function (element, index) {
          var layerData = privates.data.layers[index];

          if (Number.isFinite(layerData.opacity)) {
            element.alpha = layerData.opacity;
          }

          Game.layers.mapLayer.appendChild(element);
        });

        // 释放冗余空间
        privates.layers = null;
        privates.data.layers = null;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2NBQVEsT0FBTzs7aUJBQVAsT0FBTzs7YUF5QnRCLGlCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN4QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OztXQUVjLGVBQUc7QUFDaEIsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDO09BQ2xDO1dBRWMsYUFBQyxLQUFLLEVBQUU7QUFDckIsY0FBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO09BQ2pEOzs7YUEzQ1csY0FBQyxFQUFFLEVBQUU7QUFDZixlQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxnQkFBTSxDQUFDLElBQUksVUFBUSxFQUFFLHFCQUFnQixFQUFFLFNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7dUNBQ3hDLElBQUk7O2dCQUF4QixPQUFPO2dCQUFFLE9BQU87O0FBQ3JC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QixDQUFDLENBQUM7T0FDMUM7OztXQUVPLGVBQUc7O0FBQ1QsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtPQUN4QjtXQUVPLGFBQUMsS0FBSyxFQUFFO0FBQ2QsY0FBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO09BQzFDOzs7V0FFVyxlQUFHO0FBQ2IsZUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO09BQy9CO1dBRVcsYUFBQyxLQUFLLEVBQUU7QUFDbEIsY0FBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO09BQzlDOzs7V0EzS3NCLE9BQU87S0FBUyxNQUFNLENBQUMsS0FBSyxFQTZUbkQsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgR2FtZS5hc3NpZ24oXCJNYXBcIiwgY2xhc3MgR2FtZU1hcCBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBtYXAvJHtpZH0uanNvbmAsIGBtYXAvJHtpZH0uanNgKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IFttYXBEYXRhLCBtYXBJbmZvXSA9IGRhdGE7XG4gICAgICAgICAgbWFwSW5mbyA9IG1hcEluZm8oKTsgLy8gbWFwL2lkLmpz5paH5Lu25Lya6L+U5Zue5LiA5Liq5Ye95pWwXG4gICAgICAgICAgbWFwRGF0YS5pZCA9IGlkO1xuXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIG1hcEluZm8pIHtcbiAgICAgICAgICAgIGlmIChtYXBEYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LCBtYXBEYXRhW2tleV0sIG1hcEluZm9ba2V5XSwgbWFwSW5mbywgbWFwRGF0YSk7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUubG9hZEFyZWEgaW52YWxpZCBkYXRhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwRGF0YVtrZXldID0gbWFwSW5mb1trZXldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBtYXBPYmogPSBuZXcgR2FtZS5NYXAobWFwRGF0YSk7XG4gICAgICAgICAgbWFwT2JqLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZShtYXBPYmopO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGl0VGVzdCAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmJsb2NrZWRNYXBbeCoxMDAwMCt5XSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXRXYXRlciAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLndhdGVyTWFwW3gqMTAwMDAreV0pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IGJsb2NrZWRNYXAgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmJsb2NrZWRNYXA7XG4gICAgfVxuXG4gICAgc2V0IGJsb2NrZWRNYXAgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5ibG9ja2VkTWFwIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChtYXBEYXRhKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhID0gbWFwRGF0YTtcblxuICAgICAgbGV0IGltYWdlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBwcml2YXRlcy5kYXRhLnRpbGVzZXRzKSB7XG4gICAgICAgIGltYWdlcy5wdXNoKGBtYXAvJHtlbGVtZW50LmltYWdlfWApO1xuICAgICAgfTtcblxuICAgICAgU3ByaXRlLmxvYWQoaW1hZ2VzKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgLy8g6YeK5pS+56m66Ze0XG4gICAgICAgIHByaXZhdGVzLmRhdGEudGlsZXNldHMgPSBudWxsO1xuXG4gICAgICAgIHByaXZhdGVzLnNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgICAgaW1hZ2VzOiBkYXRhLFxuICAgICAgICAgIHdpZHRoOiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHByaXZhdGVzLmRhdGEudGlsZWhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5rC05Zyw5Zu+77yM55So5p2l6L+b6KGMaGl0V2F0ZXLmtYvor5VcbiAgICAgICAgcHJpdmF0ZXMud2F0ZXJNYXAgPSB7fTtcbiAgICAgICAgLy8g6K6h566X6Zi75oyh5Zyw5Zu+77yM5aaC5p6c5Li6b2JqZWN05YiZ5pyJ6Zi75oyh77yMdW5kZWZpbmVk5YiZ5peg6Zi75oyhXG4gICAgICAgIHByaXZhdGVzLmJsb2NrZWRNYXAgPSB7fTtcblxuICAgICAgICAvLyDkv53lrZjov5nkuKrlnLDlm77nmoTmiYDmnInlnLDlm77lnZdcbiAgICAgICAgLy8g6L+Z5Liq56m66Ze05ZyoZHJhd+WQjuS8mumHiuaUvlxuICAgICAgICBwcml2YXRlcy5sYXllcnMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBsYXllckRhdGEgb2YgcHJpdmF0ZXMuZGF0YS5sYXllcnMpIHtcbiAgICAgICAgICBsZXQgbGF5ZXJPYmogPSBudWxsO1xuICAgICAgICAgIGlmIChsYXllckRhdGEubmFtZSAhPSBcImJsb2NrXCIpIHtcbiAgICAgICAgICAgIGxheWVyT2JqID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgICAgICAgIGxheWVyT2JqLm5hbWUgPSBsYXllckRhdGEubmFtZTtcbiAgICAgICAgICAgIHByaXZhdGVzLmxheWVycy5wdXNoKGxheWVyT2JqKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLmNvbDtcbiAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5yb3c7XG4gICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHggKyB5ICogd2lkdGg7XG4gICAgICAgICAgICAgIGxldCBrZXkgPSB4ICogMTAwMDAgKyB5O1xuICAgICAgICAgICAgICBsZXQgcGljdHVyZSA9IGxheWVyRGF0YS5kYXRhW3Bvc2l0aW9uXSAtIDE7XG5cbiAgICAgICAgICAgICAgaWYgKHBpY3R1cmUgPj0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChsYXllckRhdGEubmFtZSA9PSBcImJsb2NrXCIpIHtcbiAgICAgICAgICAgICAgICAgIHByaXZhdGVzLmJsb2NrZWRNYXBba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IHByaXZhdGVzLnNoZWV0LmdldEZyYW1lKHBpY3R1cmUpO1xuICAgICAgICAgICAgICAgICAgZnJhbWUueCA9IHggKiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aDtcbiAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSB5ICogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgbGF5ZXJPYmouYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxheWVyRGF0YS5uYW1lID09IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBwcml2YXRlcy53YXRlck1hcFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWPkemAgeWujOaIkOS6i+S7tu+8jOesrOS6jOS4quWPguaVsOS7o+ihqOatpOS6i+S7tuaYr+S4gOasoeaAp+S6i+S7tu+8jOWNs+S4jeS8muWGjeasoWNvbXBsZXRlXG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXQgZGF0YSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmRhdGEgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pZDtcbiAgICB9XG5cbiAgICBzZXQgaWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5pZCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGggKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS53aWR0aCAqIHRoaXMuZGF0YS50aWxld2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IHdpZHRoICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAud2lkdGggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGhlaWdodCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodCAqIHRoaXMuZGF0YS50aWxlaGVpZ2h0O1xuICAgIH1cblxuICAgIHNldCBoZWlnaHQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5oZWlnaHQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGNvbCAoKSB7IC8vIHdpZHRoIC8gdGlsZXdpZHRoXG4gICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoO1xuICAgIH1cblxuICAgIHNldCBjb2wgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC5jb2wgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHJvdyAoKSB7IC8vIGhlaWdodCAvIHRpbGVoZWlnaHRcbiAgICAgIHJldHVybiB0aGlzLmRhdGEuaGVpZ2h0XG4gICAgfVxuXG4gICAgc2V0IHJvdyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLnJvdyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgbWluaW1hcCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykubWluaW1hcDtcbiAgICB9XG5cbiAgICBzZXQgbWluaW1hcCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLm1pbmltYXAgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLy8g6L+U5Zue5p+Q5Liq5Z2Q5qCH54K55omA5Zyo55qE5Zyw5qC8XG4gICAgdGlsZSAoeCwgeSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiBNYXRoLmZsb29yKHggLyB0aGlzLmRhdGEudGlsZXdpZHRoKSxcbiAgICAgICAgICB5OiBNYXRoLmZsb29yKHkgLyB0aGlzLmRhdGEudGlsZWhlaWdodClcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoeCwgeSwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAudGlsZSBnb3QgaW52YWxpZCBhcmd1bWVudHNcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g57uY5Yi25Zu+54mH77yM5Lya5pS55Y+YR2FtZS5jdXJyZW50QXJlYVxuICAgIGRyYXcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBHYW1lLmxheWVycy5tYXBMYXllci5jbGVhcigpO1xuICAgICAgR2FtZS5sYXllcnMubWFwSGlkZUxheWVyLmNsZWFyKCk7XG5cbiAgICAgIHByaXZhdGVzLmxheWVycy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgbGF5ZXJEYXRhID0gcHJpdmF0ZXMuZGF0YS5sYXllcnNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobGF5ZXJEYXRhLm9wYWNpdHkpKSB7XG4gICAgICAgICAgZWxlbWVudC5hbHBoYSA9IGxheWVyRGF0YS5vcGFjaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgR2FtZS5sYXllcnMubWFwTGF5ZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICB9KTtcblxuICAgICAgLy8g6YeK5pS+5YaX5L2Z56m66Ze0XG4gICAgICBwcml2YXRlcy5sYXllcnMgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuZGF0YS5sYXllcnMgPSBudWxsO1xuXG4gICAgICAvLyDnu5nlhbbku5blnLDlm77nvJPlhrLlsYJcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNhY2hlKCk7XG4gICAgICBsZXQgbWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoR2FtZS5sYXllcnMubWFwTGF5ZXIuY2FjaGVDYW52YXMpO1xuICAgICAgR2FtZS5sYXllcnMubWFwTGF5ZXIuY2xlYXIoKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmFwcGVuZENoaWxkKG1hcCk7XG5cbiAgICAgIGxldCBtaW5pbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIG1pbmltYXAud2lkdGggPSB0aGlzLmNvbCAqIDg7IC8vIOWOn+WcsOWbvueahOWbm+WAjVxuICAgICAgbWluaW1hcC5oZWlnaHQgPSB0aGlzLnJvdyAqIDg7XG4gICAgICBsZXQgbWluaW1hcENvbnRleHQgPSBtaW5pbWFwLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIG1pbmltYXBDb250ZXh0LmRyYXdJbWFnZShtYXAuaW1hZ2UsXG4gICAgICAgIDAsIDAsIG1hcC53aWR0aCwgbWFwLmhlaWdodCxcbiAgICAgICAgMCwgMCwgbWluaW1hcC53aWR0aCwgbWluaW1hcC5oZWlnaHQpO1xuXG4gICAgICBwcml2YXRlcy5taW5pbWFwID0gbWluaW1hcDtcblxuXG4gICAgICBpZiAocHJpdmF0ZXMuZGF0YS5iZ20pIHtcbiAgICAgICAgLy8gc2V0IGxvb3AgPSAtMSwg5peg6ZmQ5b6q546vXG4gICAgICAgIC8vbGV0IGJnbSA9IGNyZWF0ZWpzLlNvdW5kLnBsYXkodGhpcy5kYXRhLmJnbSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgLTEpO1xuICAgICAgICAvL2JnbS5zZXRWb2x1bWUoMC4yKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGJsb2NrID0ge307XG5cbiAgICAgIC8vIOmihOiuvuS6uueJqeWNoOS9jVxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEuYWN0b3JzKSB7XG4gICAgICAgIGZvciAobGV0IGFjdG9yIG9mIHByaXZhdGVzLmRhdGEuYWN0b3JzKSB7XG4gICAgICAgICAgYmxvY2tbYWN0b3IueCoxMDAwMCthY3Rvci55XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g55Sf5oiQ5oCq54mpXG4gICAgICBpZiAoXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3QgJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIuY291bnRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIuY291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBtb25zdGVySWQgPSBudWxsO1xuICAgICAgICAgIGxldCBwcm9iID0gMDtcbiAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3QpIHtcbiAgICAgICAgICAgIHByb2IgKz0gcHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIubGlzdFtrZXldO1xuICAgICAgICAgICAgaWYgKHIgPCBwcm9iKSB7XG4gICAgICAgICAgICAgIG1vbnN0ZXJJZCA9IGtleTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbW9uc3RlcklkKSB7XG4gICAgICAgICAgICBtb25zdGVySWQgPSBPYmplY3Qua2V5cyhwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0KVswXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgR2FtZS5BY3Rvci5sb2FkKG1vbnN0ZXJJZCkudGhlbigoYWN0b3JPYmopID0+IHtcbiAgICAgICAgICAgIGxldCB4LCB5O1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgeCA9IFNwcml0ZS5yYW5kKDAsIHRoaXMuY29sKTtcbiAgICAgICAgICAgICAgeSA9IFNwcml0ZS5yYW5kKDAsIHRoaXMucm93KTtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmhpdFRlc3QoeCwgeSkgJiYgIWJsb2NrW3gqMTAwMDAreV0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tbeCoxMDAwMCt5XSA9IHRydWU7XG4gICAgICAgICAgICBhY3Rvck9iai54ID0geDtcbiAgICAgICAgICAgIGFjdG9yT2JqLnkgPSB5O1xuICAgICAgICAgICAgR2FtZS5hcmVhLmFjdG9ycy5hZGQoYWN0b3JPYmopO1xuICAgICAgICAgICAgYWN0b3JPYmouZHJhdygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0gJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdCAmJlxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5jb3VudFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5jb3VudDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbGV0IGl0ZW1JZCA9IG51bGw7XG4gICAgICAgICAgbGV0IHByb2IgPSAwO1xuICAgICAgICAgIGxldCByID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdCkge1xuICAgICAgICAgICAgcHJvYiArPSBwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5saXN0W2tleV07XG4gICAgICAgICAgICBpZiAociA8IHByb2IpIHtcbiAgICAgICAgICAgICAgaXRlbUlkID0ga2V5O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtSWQpIHtcbiAgICAgICAgICAgIGl0ZW1JZCA9IE9iamVjdC5rZXlzKHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QpWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBHYW1lLkl0ZW0ubG9hZChpdGVtSWQpLnRoZW4oKGl0ZW1PYmopID0+IHtcbiAgICAgICAgICAgIGxldCB4LCB5O1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgeCA9IFNwcml0ZS5yYW5kKDAsIHRoaXMuY29sKTtcbiAgICAgICAgICAgICAgeSA9IFNwcml0ZS5yYW5kKDAsIHRoaXMucm93KTtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmhpdFRlc3QoeCwgeSkgJiYgIWJsb2NrW3gqMTAwMDAreV0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tbeCoxMDAwMCt5XSA9IHRydWU7XG4gICAgICAgICAgICBpdGVtT2JqLnggPSB4O1xuICAgICAgICAgICAgaXRlbU9iai55ID0geTtcbiAgICAgICAgICAgIGl0ZW1PYmouaW5uZXIgPSB7fTtcbiAgICAgICAgICAgIGl0ZW1PYmouaW5uZXJbaXRlbUlkXSA9IDE7XG4gICAgICAgICAgICBHYW1lLmFyZWEuaXRlbXMuYWRkKGl0ZW1PYmopO1xuICAgICAgICAgICAgaXRlbU9iai5kcmF3KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
