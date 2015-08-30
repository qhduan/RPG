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


  Game.Map = class GameMap extends Sprite.Event {
    constructor (mapData) {
      super();

      this.data = mapData;
      this.id = this.data.id;

      if (this.data.entry) {
        this.data.entry.x = this.data.entry.x * 32 + 16;
        this.data.entry.y = this.data.entry.y * 32 + 16;
      }

      var imageUrls = [];
      this.data.tilesets.forEach((element) => {
        imageUrls.push(`/map/${element.image}`);
      });

      var loader = new Sprite.Loader();
      loader.add(imageUrls);
      loader.start();
      loader.on("complete", (event) => {

        this.sheet = new Sprite.Sheet({
          images: event.data,
          width: this.data.tilewidth,
          height: this.data.tileheight,
        });

        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        this.blockedMap = [];
        this.blockedMap.length = this.data.height;

        for(var i = 0; i < this.blockedMap.length; i++) {
          this.blockedMap[i] = [];
          this.blockedMap[i].length = this.data.width;
        }

        // 保存这个地图的所有地图块
        this.container = new Sprite.Container();
        this.container.name = this.id;

        this.data.layers.forEach((element, index, array) => {
          var layer = element;

          if (layer.data) { // 渲染普通层
            for (var y = 0; y < layer.height; y++) {
              for (var x = 0; x < layer.width; x++) {
                var position = x + y * layer.width;
                var picture = layer.data[position] - 1;
                if (picture >= 0) {
                  var frame = this.sheet.getFrame(picture);
                  frame.x = x * this.data.tilewidth;
                  frame.y = y * this.data.tileheight;

                  if (layer.properties && layer.properties.blocked) {
                    this.blockedMap[y][x] = frame;
                  }

                  this.container.appendChild(frame);
                }
              }
            }
          } else { // 渲染对象层

          }

        });

        this.width = this.data.width * this.data.tilewidth;
        this.height = this.data.height * this.data.tileheight;

        // 创建一个cache，地图很大可能会很大，所以以后可能还要想别的办法
        // 这个cache会创建一个看不到的canvas
        this.container.cache(0, 0, this.width, this.height);
        this.minimap = this.container.cacheCanvas;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });

    }

    // 返回某个坐标点所在的地格
    tile (x, y) {
      x = x / this.data.tilewidth;
      y = y / this.data.tileheight;
      return {
        x: Math.floor(x),
        y: Math.floor(y)
      };
    }

    // 绘制图片，会改变Game.currentArea
    draw (layer) {
      layer.clear();
      layer.appendChild(this.container);

      if (this.data.bgm) {
        // set loop = -1, 无限循环
        //var bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
        //bgm.setVolume(0.2);
      }
    }
  };

})();
