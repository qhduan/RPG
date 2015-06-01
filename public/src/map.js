/*

Online A-RPG Game, Built using Node.js + createjs
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


  Game.MapClass = class MapClass extends Game.EventClass {
    constructor (mapData) {
      super();

      this.data = mapData;
      this.id = this.data.id;

      var images = [];
      this.data.tilesets.forEach(function (element) {
        images.push(element.image);
      });

      this.sheet = new createjs.SpriteSheet({
        images: images,
        frames: {
          width: this.data.tilewidth,
          height: this.data.tileheight
        }
      });

      // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
      this.blockedMap = [];
      this.blockedMap.length = this.data.height;

      for(var i = 0; i < this.blockedMap.length; i++) {
        this.blockedMap[i] = [];
        this.blockedMap[i].length = this.data.width;
      }

      // 保存这个地图的所有地图块
      this.container = new createjs.Container();

      this.data.layers.forEach((element, index, array) => {
        var layer = element;

        if (layer.data) { // 渲染普通层
          var sprite = new createjs.Sprite(this.sheet);
          for (var y = 0; y < layer.height; y++) {
            for (var x = 0; x < layer.width; x++) {
              var position = x + y * layer.width;
              var picture = layer.data[position] - 1;
              if (picture >= 0) {
                var spriteClone = sprite.clone();
                spriteClone.x = x * this.data.tilewidth;
                spriteClone.y = y * this.data.tileheight;
                spriteClone.gotoAndStop(picture);

                if (layer.properties && layer.properties.blocked) {
                  this.blockedMap[y][x] = spriteClone;
                }

                this.container.addChild(spriteClone);
              }
            }
          }
        } else { // 渲染对象层

        }

      });

      this.width = this.data.width * this.data.tilewidth;
      this.height = this.data.height * this.data.tileheight;

      // 创建一个cache，地图很大可能会很大，所以以后可能还要想别的办法
      // 这个cache会让createjs创建一个看不到的canvas
      this.container.cache(0, 0, this.width, this.height);

      // 开始计算迷你地图
      var ratio = this.width / this.height;
      var maxMinimapWidth = 780;
      var maxMinimapHeight = 360;
      var minimapWidth = 780;
      var minimapHeight = 780 / ratio;
      if (minimapHeight > maxMinimapHeight) {
        minimapHeight = 360;
        minimapWidth = 360 * ratio;
      }
      minimapHeight = Math.floor(minimapHeight);
      minimapWidth = Math.floor(minimapWidth);
      var minimapCanvas = document.createElement("canvas");
      minimapCanvas.width = minimapWidth;
      minimapCanvas.height = minimapHeight;
      var minimapContext = minimapCanvas.getContext("2d");
      minimapContext.drawImage(this.container.cacheCanvas, 0, 0,
        this.width, this.height, 0, 0, minimapWidth, minimapHeight);

      var minimap = new Image();
      minimap.onload = () => {
        this.minimap = new createjs.Bitmap(minimap);
        this.minimap.width = minimap.width;
        this.minimap.height = minimap.height;
        this.minimap.regX = parseInt(minimap.width / 2);
        this.minimap.regY = parseInt(minimap.height / 2);
      };
      minimap.src = minimapCanvas.toDataURL();

      // 开始计算地图平均颜色（用迷你地图的平均颜色，用来作为document.body的背景）
      var rgb = { r: 0, g: 0, b: 0 };
      var minimapData = minimapContext.getImageData(0, 0, minimapCanvas.width, minimapCanvas.height).data;

      for (var i = 0; i < minimapData.length; i += 4) {
        rgb.r += minimapData[i];
        rgb.g += minimapData[i + 1];
        rgb.b += minimapData[i + 2];
      }

      // 把颜色取平均值然后转换为16进制，最后到css格式
      rgb.r = Math.floor(rgb.r / (minimapData.length / 4)).toString(16);
      rgb.g = Math.floor(rgb.g / (minimapData.length / 4)).toString(16);
      rgb.b = Math.floor(rgb.b / (minimapData.length / 4)).toString(16);
      this.averageColor = "#" + rgb.r + rgb.g + rgb.b;

      // 发送完成事件，第二个参数代表一次性事件
      this.emit("complete", true);
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
      layer.addChild(this.container);

      if (this.averageColor) {
        document.body.style.backgroundColor = this.averageColor;
      }

      if (this.data.bgm) {
        // set loop = -1, 无限循环
        //var bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
        //bgm.setVolume(0.2);
      }
    }
  };

})();
