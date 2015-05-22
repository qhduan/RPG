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

  // 指示当前正在显示的地图
  Game.currentMap = null;

  var AreaClass = function (areaData) {
    var self = this;

    for (var key in areaData) {
      self[key] = areaData[key];
    }

    var images = [];

    self.tilesets.forEach(function (element) {
      images.push(element.image);
    });

    self.sheet = new createjs.SpriteSheet({
      images: images,
      frames: {
        width: self.tilewidth,
        height: self.tileheight
      }
    });

    // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
    self.blockedMap = [];
    self.blockedMap.length = self.height;

    for(var i = 0; i < self.blockedMap.length; i++) {
      self.blockedMap[i] = [];
      self.blockedMap[i].length = self.width;
    }

    // 保存这个地图的所有地图块
    self.container = new createjs.Container();

    self.layers.forEach(function (element, index, array) {
      var layer = element;

      if (layer.data) { // 渲染普通层
        var sprite = new createjs.Sprite(self.sheet);
        for (var y = 0; y < layer.height; y++) {
          for (var x = 0; x < layer.width; x++) {
            var position = x + y * layer.width;
            var picture = layer.data[position] - 1;
            if (picture >= 0) {
              var spriteClone = sprite.clone();
              spriteClone.x = x * self.tilewidth;
              spriteClone.y = y * self.tileheight;
              spriteClone.gotoAndStop(picture);

              if (layer.properties && layer.properties.blocked) {
                self.blockedMap[y][x] = spriteClone;
              }

              self.container.addChild(spriteClone);
            }
          }
        }
      } else { // 渲染对象层

      }

    });

    // 创建一个cache，地图很大可能会很大，所以以后可能还要想别的办法
    // 这个cache会让createjs创建一个看不到的canvas
    self.container.cache(0, 0,
      self.width * self.tilewidth, self.height * self.tileheight);

    Game.areas[self.id] = self;
    if (self.onload) self.onload(self);

  };

  // 返回某个坐标点所在的地格
  AreaClass.prototype.tile = function (x, y) {
    var self = this;
    x = x / self.tilewidth;
    y = y / self.tileheight;
    return {
      x: Math.floor(x),
      y: Math.floor(y)
    };
  }

  // 绘制图片，会改变Game.currentArea
  AreaClass.prototype.draw = function () {
    var self = this;

    Game.currentArea = self;
    Game.stage.addChild(self.container);

    if (self.actors && Object.keys(self.actors).length) {
      for (var key in self.actors) {
        self.actors[key].draw(self.actors[key].x, self.actors[key].y);
      }
    }

    if (self.bgm) {
      //createjs.Sound.play(self.bgm);
      // set loop = -1, 无限循环
      createjs.Sound.play(self.bgm, undefined, undefined, undefined, -1);
    }
  };

  // 加载地图，返回一个mapObj结构，这个结构包括
  // mapObj.draw()
  // mapObj.tile()
  // mapObj.blockedMap
  Game.loadArea = function (id, callback) {
    if (Game.areas.hasOwnProperty(id)) {
      callback(Game.maps[id]);
      return;
    } else {
      $.post("/area/get", {
        id: id
      }).done(function (ret) {
        if (ret.area) {
          var area = ret.area;

          Game.preload(area.resources, function () {

            area.tilesets.forEach(function (element) {
              element.image = Game.resources[element.image];
            });

            if (area.actors && Object.keys(area.actors).length) {
              for (var key in area.actors) {
                var actorObj = new Game.ActorClass(area.actors[key]);
                area.actors[key] = actorObj;
              }
            }

            callback(new AreaClass(area));

          });

        } else {
          console.log(ret.error || "Unknown Error");
        }
      });
    }
  };

})();
