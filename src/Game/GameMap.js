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

  Game.assign("Map", class GameMap extends Sprite.Event {

    hitTest (x, y) {
      if (this.blockedMap[y] && this.blockedMap[y][x]) {
        return true;
      }
      return false;
    }

    waterTest (x, y) {
      if (this.waterMap[y] && this.waterMap[y][x]) {
        return true;
      }
      return false;
    }

    hitAutoHide (x, y) {
      if (this.autoHideMap[y] && this.autoHideMap[y][x]) {
        return this.autoHideMap[y][x];
      }
      return null;
    }

    constructor (mapData) {
      super();


      this.data = mapData;
      this.id = this.data.id;

      let imageUrls = [];
      this.data.tilesets.forEach((element) => {
        imageUrls.push(`/map/${element.image}`);
      });

      Sprite.Loader.create()
        .add(imageUrls)
        .start()
        .on("complete", (event) => {

        this.sheet = new Sprite.Sheet({
          images: event.data,
          width: this.data.tilewidth,
          height: this.data.tileheight,
        });

        this.waterMap = [];
        this.waterMap.length = this.data.height;
        for(let i = 0; i < this.waterMap.length; i++) {
          this.waterMap[i] = [];
          this.waterMap[i].length = this.data.width;
        }

        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        this.blockedMap = [];
        this.blockedMap.length = this.data.height;
        for(let i = 0; i < this.blockedMap.length; i++) {
          this.blockedMap[i] = [];
          this.blockedMap[i].length = this.data.width;
        }

        this.autoHideMap = [];
        this.autoHideMap.length = this.data.height;
        for(let i = 0; i < this.autoHideMap.length; i++) {
          this.autoHideMap[i] = [];
          this.autoHideMap[i].length = this.data.width;
        }

        // 保存这个地图的所有地图块
        this.layers = [];

        this.data.layers.forEach((element, index, array) => {
          let layer = element;

          if (layer.name == "block") {
            // 阻挡层，有东西则表示阻挡
            if (layer.hasOwnProperty("data")) {
              for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                  let position = x + y * layer.width;
                  let picture = layer.data[position] - 1;
                  if (picture >= 0 && this.blockedMap[y][x] != true) {
                    this.blockedMap[y][x] = true;
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
                  if (picture >= 0 && this.waterMap[y][x] != true) {
                    this.waterMap[y][x] = true;
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

            this.layers.push(layerObj);

            if (layer.hasOwnProperty("data")) { // 渲染普通层
              for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                  let position = x + y * layer.width;
                  let picture = layer.data[position] - 1;
                  if (picture >= 0) {
                    let frame = this.sheet.getFrame(picture);
                    frame.x = x * this.data.tilewidth;
                    frame.y = y * this.data.tileheight;

                    if (layer.hasOwnProperty("properties") && layer.properties.hasOwnProperty("autohide")) {
                      this.autoHideMap[y][x] = layer.properties.autohide;
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

        this.width = this.data.width * this.data.tilewidth;
        this.height = this.data.height * this.data.tileheight;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });

    }

    // 返回某个坐标点所在的地格
    tile (x, y) {
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
    draw () {
      Game.layers.mapLayer.clear();

      this.layers.forEach((element, index) => {
        let layerData = this.data.layers[index];

        //console.time("cache " + layerData.name);
        element.cache(0, 0, this.width, this.height);
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
  });


})();
