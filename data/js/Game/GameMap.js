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

  Game.assign("Map", (function (_Sprite$Event) {
    _inherits(GameMap, _Sprite$Event);

    _createClass(GameMap, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.blockedMap[y] && this.blockedMap[y][x]) {
          return true;
        }
        return false;
      }
    }, {
      key: "waterTest",
      value: function waterTest(x, y) {
        if (this.waterMap[y] && this.waterMap[y][x]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitAutoHide",
      value: function hitAutoHide(x, y) {
        if (this.autoHideMap[y] && this.autoHideMap[y][x]) {
          return this.autoHideMap[y][x];
        }
        return null;
      }
    }]);

    function GameMap(mapData) {
      var _this = this;

      _classCallCheck(this, GameMap);

      _get(Object.getPrototypeOf(GameMap.prototype), "constructor", this).call(this);

      this.data = mapData;
      this.id = this.data.id;

      var imageUrls = [];
      this.data.tilesets.forEach(function (element) {
        imageUrls.push("/map/" + element.image);
      });

      Sprite.Loader.create().add(imageUrls).start().on("complete", function (event) {

        _this.sheet = new Sprite.Sheet({
          images: event.data,
          width: _this.data.tilewidth,
          height: _this.data.tileheight
        });

        _this.waterMap = [];
        _this.waterMap.length = _this.data.height;
        for (var i = 0; i < _this.waterMap.length; i++) {
          _this.waterMap[i] = [];
          _this.waterMap[i].length = _this.data.width;
        }

        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        _this.blockedMap = [];
        _this.blockedMap.length = _this.data.height;
        for (var i = 0; i < _this.blockedMap.length; i++) {
          _this.blockedMap[i] = [];
          _this.blockedMap[i].length = _this.data.width;
        }

        _this.autoHideMap = [];
        _this.autoHideMap.length = _this.data.height;
        for (var i = 0; i < _this.autoHideMap.length; i++) {
          _this.autoHideMap[i] = [];
          _this.autoHideMap[i].length = _this.data.width;
        }

        // 保存这个地图的所有地图块
        _this.layers = [];

        _this.data.layers.forEach(function (element, index, array) {
          var layer = element;

          if (layer.name == "block") {
            // 阻挡层，有东西则表示阻挡
            if (layer.hasOwnProperty("data")) {
              for (var y = 0; y < layer.height; y++) {
                for (var x = 0; x < layer.width; x++) {
                  var position = x + y * layer.width;
                  var picture = layer.data[position] - 1;
                  if (picture >= 0 && _this.blockedMap[y][x] != true) {
                    _this.blockedMap[y][x] = true;
                  }
                }
              }
            } else {
              console.error(layer, _this.data);
              throw new Error("Game.Map got invalid block layer");
            }
          } else if (layer.name == "water") {
            // 水层，用来钓鱼
            if (layer.hasOwnProperty("data")) {
              for (var y = 0; y < layer.height; y++) {
                for (var x = 0; x < layer.width; x++) {
                  var position = x + y * layer.width;
                  var picture = layer.data[position] - 1;
                  if (picture >= 0 && _this.waterMap[y][x] != true) {
                    _this.waterMap[y][x] = true;
                  }
                }
              }
            } else {
              console.error(layer, _this.data);
              throw new Error("Game.Map got invalid water layer");
            }
          } else {
            var layerObj = new Sprite.Container();
            layerObj.name = layer.name;

            _this.layers.push(layerObj);

            if (layer.hasOwnProperty("data")) {
              // 渲染普通层
              for (var y = 0; y < layer.height; y++) {
                for (var x = 0; x < layer.width; x++) {
                  var position = x + y * layer.width;
                  var picture = layer.data[position] - 1;
                  if (picture >= 0) {
                    var frame = _this.sheet.getFrame(picture);
                    frame.x = x * _this.data.tilewidth;
                    frame.y = y * _this.data.tileheight;

                    if (layer.hasOwnProperty("properties") && layer.properties.hasOwnProperty("autohide")) {
                      _this.autoHideMap[y][x] = layer.properties.autohide;
                    }

                    layerObj.appendChild(frame);
                  }
                }
              }
            } else {
              console.error(layer, _this.data);
              throw new Error("Game.Map got invalid layer");
            }
          }
        });

        _this.width = _this.data.width * _this.data.tilewidth;
        _this.height = _this.data.height * _this.data.tileheight;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
    }

    // 返回某个坐标点所在的地格

    _createClass(GameMap, [{
      key: "tile",
      value: function tile(x, y) {
        if (x && typeof y == "undefined" && typeof x.x == "number" && typeof x.y == "number") {
          return {
            x: Math.floor(x.x / this.data.tilewidth),
            y: Math.floor(x.y / this.data.tileheight)
          };
        } else if (typeof x == "number" && typeof y == "number") {
          return {
            x: Math.floor(x / this.data.tilewidth),
            y: Math.floor(y / this.data.tileheight)
          };
        } else {
          console.error(x, y);
          throw new Error("Game.Map.tile Invalid arguments");
        }
      }

      // 绘制图片，会改变Game.currentArea
    }, {
      key: "draw",
      value: function draw() {
        var _this2 = this;

        Game.layers.mapLayer.clear();

        this.layers.forEach(function (element, index) {
          var layerData = _this2.data.layers[index];

          //console.time("cache " + layerData.name);
          element.cache(0, 0, _this2.width, _this2.height);
          //console.timeEnd("cache " + layerData.name);

          if (layerData.hasOwnProperty("visible") && layerData.visible == false) {
            element.visible = false;
          }
          if (layerData.hasOwnProperty("opacity") && typeof layerData.opacity == "number") {
            element.alpha = layerData.opacity;
          }

          Game.layers.mapLayer.appendChild(element);
        });

        //Game.layers.mapLayer.cache(0, 0, this.width, this.height);
        //this.minimap = Game.layers.mapLayer.cacheCanvas;
        //Game.layers.mapLayer.clearCache();

        if (this.data.bgm) {
          // set loop = -1, 无限循环
          //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
          //bgm.setVolume(0.2);
        }
      }
    }]);

    return GameMap;
  })(Sprite.Event));
})();
//# sourceMappingURL=GameMap.js.map
