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

import Sprite from "../Sprite/Sprite.js";
import Game   from "./Base.js";

let internal = Sprite.Util.namespace();

export default class Map extends Sprite.Event {

  static load (id) {

    return new Promise( (resolve, reject) => {
      Sprite.Loader.load(`map/${id}.json`, `map/${id}.js`).then( ([mapData, mapInfoFunc]) => {
        let mapInfo = mapInfoFunc(Game); // map/id.js文件会返回一个函数
        mapData.id = id;

        for (const key in mapInfo) {
          if (mapData.hasOwnProperty(key)) {
            console.error(key, `map/${id}.json`, `map/${id}.js`, mapData, mapInfo);
            throw new Error("Map.load Conflict key");
          }
          mapData[key] = mapInfo[key];
        }

        let mapObj = new Game.Map(mapData);
        mapObj.on("complete", () => {
          resolve(mapObj);
        });
      });
    });
  }

  hitTest (x, y) {
    if (internal(this).blockedMap[x*10000+y]) {
      return true;
    }
    return false;
  }

  hitWater (x, y) {
    if (internal(this).waterMap[x*10000+y]) {
      return true;
    }
    return false;
  }

  get blockedMap () {
    return internal(this).blockedMap;
  }

  set blockedMap (value) {
    throw new Error("Game.Map.blockedMap readonly");
  }

  constructor (mapData) {
    super();
    let privates = internal(this);
    privates.data = mapData;

    let imageUrls = privates.data.tilesets.map(element => {
      return `map/${element.image}`;
    });

    Sprite.Loader.load(imageUrls).then( images => {

      // 释放空间
      privates.data.tilesets = null;

      privates.sheet = new Sprite.Sheet({
        images: images,
        width: privates.data.tilewidth,
        height: privates.data.tileheight,
      });

      // 水地图，用来进行hitWater测试
      privates.waterMap = {};
      // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
      privates.blockedMap = {};

      // 保存这个地图的所有地图块
      // 这个空间在draw后会释放
      privates.layers = [];

      for (let layerData of privates.data.layers) {
        let layerObj = null;
        if (layerData.name != "block") {
          layerObj = new Sprite.Container();
          layerObj.name = layerData.name;
          privates.layers.push(layerObj);
        }

        let width = this.col;
        let height = this.row;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let position = x + y * width;
            let key = x * 10000 + y;
            let picture = layerData.data[position] - 1;

            if (picture >= 0) {
              if (layerData.name == "block") {
                privates.blockedMap[key] = true;
              } else {
                let frame = privates.sheet.getFrame(picture);
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
    return this.data.height;
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
  draw () {
    let privates = internal(this);
    Game.layers.mapLayer.clear();

    privates.layers.forEach((element, index) => {
      let layerData = privates.data.layers[index];

      if (Number.isFinite(layerData.opacity)) {
        element.alpha = layerData.opacity;
      }

      Game.layers.mapLayer.appendChild(element);
    });

    // 释放冗余空间
    privates.layers = null;
    privates.data.layers = null;

    // 给其他地图缓冲层
    Game.layers.mapLayer.cache(this.width, this.height);
    let map = new Sprite.Bitmap(Game.layers.mapLayer.cacheCanvas);
    Game.layers.mapLayer.clear();
    Game.layers.mapLayer.appendChild(map);

    let minimap = document.createElement("canvas");
    minimap.width = this.col * 8; // 原地图的四倍
    minimap.height = this.row * 8;
    let minimapContext = minimap.getContext("2d");
    minimapContext.drawImage(map.image,
      0, 0, map.width, map.height,
      0, 0, minimap.width, minimap.height);

    privates.minimap = minimap;


    if (privates.data.bgm) {
      // set loop = -1, 无限循环
      //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
      //bgm.setVolume(0.2);
    }

    let block = {};

    // 预设人物占位
    if (privates.data.actors) {
      for (let actor of privates.data.actors) {
        block[actor.x*10000+actor.y] = true;
      }
    }

    // 生成怪物
    if (
      privates.data.spawnMonster &&
      privates.data.spawnMonster.list &&
      privates.data.spawnMonster.count
    ) {
      for (let i = 0, len = privates.data.spawnMonster.count; i < len; i++) {
        let monsterId = null;
        let prob = 0;
        let r = Math.random();
        for (const key in privates.data.spawnMonster.list) {
          prob += privates.data.spawnMonster.list[key];
          if (r < prob) {
            monsterId = key;
            break;
          }
        }
        if (!monsterId) {
          monsterId = Object.keys(privates.data.spawnMonster.list)[0];
        }
        Game.Actor.load(monsterId).then( actorObj => {
          let x, y;
          while (true) {
            x = Sprite.Util.rand(0, this.col);
            y = Sprite.Util.rand(0, this.row);
            if (!this.hitTest(x, y) && !block[x*10000+y]) {
              break;
            }
          }
          block[x*10000+y] = true;
          actorObj.x = x;
          actorObj.y = y;
          Game.area.actors.add(actorObj);
          actorObj.draw();
        });
      }
    }

    if (
      privates.data.spawnItem &&
      privates.data.spawnItem.list &&
      privates.data.spawnItem.count
    ) {
      for (let i = 0, len = privates.data.spawnItem.count; i < len; i++) {
        let itemId = null;
        let prob = 0;
        let r = Math.random();
        for (const key in privates.data.spawnItem.list) {
          prob += privates.data.spawnItem.list[key];
          if (r < prob) {
            itemId = key;
            break;
          }
        }
        if (!itemId) {
          itemId = Object.keys(privates.data.spawnItem.list)[0];
        }
        Game.Item.load(itemId).then( itemObj => {
          let x, y;
          while (true) {
            x = Sprite.Util.rand(0, this.col);
            y = Sprite.Util.rand(0, this.row);
            if (!this.hitTest(x, y) && !block[x*10000+y]) {
              break;
            }
          }
          block[x*10000+y] = true;
          itemObj.x = x;
          itemObj.y = y;
          itemObj.inner = {};
          itemObj.inner[itemId] = 1;
          Game.area.items.add(itemObj);
          itemObj.draw();
        });
      }
    }


  }
}
