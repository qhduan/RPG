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

  let internal = Sprite.Namespace();

  Game.assign("Map", class GameMap extends Sprite.Event {

    hitTest (x, y) {
      if (internal(this).blockedMap.has(x*10000+y)) {
        return true;
      }
      return false;
    }

    hitWater (x, y) {
      if (internal(this).waterMap.has(x*10000+y)) {
        return true;
      }
      return false;
    }

    hitAutoHide (x, y) {
      if (internal(this).autoHideMap.has(x*10000+y)) {
        return internal(this).autoHideMap.get(x*10000+y);
      }
      return null;
    }

    constructor (mapData) {
      super();
      let privates = internal(this);

      privates.data = mapData;

      let mapTilesetLoader = Sprite.Loader.create();
      for (let element of privates.data.tilesets) {
        mapTilesetLoader.add(`map/${element.image}`);
      };


      mapTilesetLoader.start().on("complete", (event) => {

        privates.sheet = new Sprite.Sheet({
          images: event.data,
          width: privates.data.tilewidth,
          height: privates.data.tileheight,
        });

        // 水地图，用来进行hitWater测试
        privates.waterMap = new Map();
        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        privates.blockedMap = new Map();
        // 某些层在玩家走到其中后会自动隐藏
        privates.autoHideMap = new Map();

        // 保存这个地图的所有地图块
        privates.layers = [];

        privates.data.layers.forEach((element, index, array) => {
          let layer = element;

          if (layer.name == "block") {
            // 阻挡层，有东西则表示阻挡
            if (layer.hasOwnProperty("data")) {
              for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                  let position = x + y * layer.width;
                  let picture = layer.data[position] - 1;
                  if (picture >= 0) {
                    privates.blockedMap.set(x*10000+y, true);
                  }
                }
              }
            } else {
              console.error(layer, this.data);
              throw new Error("Game.Map got invalid block layer");
            }
          } else if (layer.name == "water") {
            // 水层，用来钓鱼
            if (layer.hasOwnProperty("data")) {
              for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                  let position = x + y * layer.width;
                  let picture = layer.data[position] - 1;
                  if (picture >= 0) {
                    privates.waterMap.set(x*10000+y, true);
                  }
                }
              }
            } else {
              console.error(layer, this.data);
              throw new Error("Game.Map got invalid water layer");
            }
          } else {
            let layerObj = new Sprite.Container();
            layerObj.name = layer.name;

            privates.layers.push(layerObj);

            if (layer.hasOwnProperty("data")) { // 渲染普通层
              for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                  let position = x + y * layer.width;
                  let picture = layer.data[position] - 1;
                  if (picture >= 0) {
                    let frame = privates.sheet.getFrame(picture);
                    frame.x = x * privates.data.tilewidth;
                    frame.y = y * privates.data.tileheight;

                    if (layer.properties && layer.properties.autohide) {
                      privates.autoHideMap.set(x*10000+y, layer.properties.autohide);
                    }

                    layerObj.appendChild(frame);
                  }
                }
              }
            } else {
              console.error(layer, this.data);
              throw new Error("Game.Map got invalid layer");
            }
          }

        });

        // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
        this.emit("complete", true);
      });

    }

    get data () {
      return internal(this).data;
    }

    set data (value) {
      throw new Error("Game.Map.data readonly");
    }

    get id () {
      return internal(this).id;
    }

    set id (value) {
      throw new Error("Game.Map.id readonly");
    }

    get width () {
      return this.data.width * this.data.tilewidth;
    }

    set width (value) {
      throw new Error("Game.Map.width readonly");
    }

    get height () {
      return this.data.height * this.data.tileheight;
    }

    set height (value) {
      throw new Error("Game.Map.height readonly");
    }

    get col () { // width / tilewidth
      return this.data.width;
    }

    set col (value) {
      throw new Error("Game.Map.col readonly");
    }

    get row () { // height / tileheight
      return this.data.height
    }

    set row (value) {
      throw new Error("Game.Map.row readonly");
    }

    get minimap () {
      return internal(this).minimap;
    }

    set minimap (value) {
      throw new Error("Game.Map.minimap readonly");
    }

    // 返回某个坐标点所在的地格
    tile (x, y) {
      if (x && typeof y == "undefined" && Number.isFinite(x.x) && Number.isFinite(x.y)) {
        return {
          x: Math.floor(x.x / this.data.tilewidth),
          y: Math.floor(x.y / this.data.tileheight)
        };
      } else if (Number.isFinite(x) && Number.isFinite(y)) {
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
    draw () {
      let privates = internal(this);
      Game.layers.mapLayer.clear();

      let autohideLayer = {};

      privates.layers.forEach((element, index) => {
        let layerData = privates.data.layers[index];

        if (Number.isFinite(layerData.opacity)) {
          element.alpha = layerData.opacity;
        }

        if (layerData.properties && layerData.properties.autohide) {
          let group = layerData.properties.autohide;
          if (autohideLayer[group]) {
            autohideLayer[group].push(element);
          } else {
            autohideLayer[group] = [element];
          }
        } else {
          Game.layers.mapLayer.appendChild(element);
        }

      });

      for (let key in autohideLayer) {
        let container = new Sprite.Container();
        container.name = key;
        for (let element of autohideLayer[key]) {
          container.appendChild(element);
        }
        container.cache(0, 0, this.width, this.height);
        Game.layers.mapHideLayer.appendChild(container);
      }

      Game.layers.mapLayer.cache(0, 0, this.width, this.height);
      Game.layers.mapHideLayer.cache(0, 0, this.width, this.height);

      let minimap = document.createElement("canvas");
      minimap.width = this.col * 8; // 原地图的四倍
      minimap.height = this.row * 8;
      let minimapContext = minimap.getContext("2d");
      minimapContext.drawImage(Game.layers.mapLayer.cacheCanvas,
        0, 0, this.width, this.height, 0, 0, minimap.width, minimap.height);
      minimapContext.drawImage(Game.layers.mapHideLayer.cacheCanvas,
        0, 0, this.width, this.height, 0, 0, minimap.width, minimap.height);

      privates.minimap = minimap;

      Game.layers.mapHideLayer.clearCache();

      if (privates.data.bgm) {
        // set loop = -1, 无限循环
        //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
        //bgm.setVolume(0.2);
      }
    }
  });


})();
