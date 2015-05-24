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


  var AreaClass = function (areaData) {
    var self = this;

    self.data = areaData;
    self.id = self.data.id;

    var images = [];

    self.data.tilesets.forEach(function (element) {
      images.push(element.image);
    });

    self.sheet = new createjs.SpriteSheet({
      images: images,
      frames: {
        width: self.data.tilewidth,
        height: self.data.tileheight
      }
    });

    // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
    self.blockedMap = [];
    self.blockedMap.length = self.data.height;

    for(var i = 0; i < self.blockedMap.length; i++) {
      self.blockedMap[i] = [];
      self.blockedMap[i].length = self.data.width;
    }

    // 保存这个地图的所有地图块
    self.container = new createjs.Container();

    self.data.layers.forEach(function (element, index, array) {
      var layer = element;

      if (layer.data) { // 渲染普通层
        var sprite = new createjs.Sprite(self.sheet);
        for (var y = 0; y < layer.height; y++) {
          for (var x = 0; x < layer.width; x++) {
            var position = x + y * layer.width;
            var picture = layer.data[position] - 1;
            if (picture >= 0) {
              var spriteClone = sprite.clone();
              spriteClone.x = x * self.data.tilewidth;
              spriteClone.y = y * self.data.tileheight;
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
      self.data.width * self.data.tilewidth,
      self.data.height * self.data.tileheight);

    Game.areas[self.id] = self;

    // 完成事件
    self.complete = true;
    if (self.listeners && self.listeners["complete"]) {
      for (var key in self.listeners["complete"]) {
        self.listeners["complete"][key](self);
      }
    }

  };

  AreaClass.prototype.on = function (event, listener) {
    var self = this;

    if (!self.listeners)
      self.listeners = {};

    if (!self.listeners[event])
      self.listeners[event] = {};

    var id = Math.random().toString(16).substr(2);
    self.listeners[event][id] = listener;
  };

  AreaClass.prototype.off = function (event, id) {
    var self = this;

    if (self.listeners[event] && self.listeners[event][id]) {
      delete self.listeners[event][id];
    }
  };

  AreaClass.prototype.oncomplete = function (callback) {
    var self = this;

    if (self.complete) {
      callback(self);
    } else {
      self.on("complete", callback);
    }
  };

  // 返回某个坐标点所在的地格
  AreaClass.prototype.tile = function (x, y) {
    var self = this;
    x = x / self.data.tilewidth;
    y = y / self.data.tileheight;
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

    if (self.data.actors && Object.keys(self.data.actors).length) {
      for (var key in self.data.actors) {
        var actorObj = self.data.actors[key];
        if (actorObj.data.x && actorObj.data.y) {
          actorObj.draw();
        } else {
          actorObj.draw(self.data.entry.x, self.data.entry. y);
        }
      }
    }

    if (self.data.bgm) {
      // set loop = -1, 无限循环
      var bgm = createjs.Sound.play(self.data.bgm, undefined, undefined, undefined, -1);
      bgm.setVolume(0.2);
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
          var areaData = ret.area;

          Game.preload(areaData.resources, function () {

            areaData.tilesets.forEach(function (element) {
              element.image = Game.resources[element.image];
            });

            var count = 0;
            // 当area的actors和items都加载完成后回调
            var AreaComplete = function () {
              count++;
              if (count >= 0){
                var areaObj = new AreaClass(areaData);
                areaObj.oncomplete(callback);
              }
            };

            // 处理地图角色（NPC或怪物）
            if (areaData.actors && Object.keys(areaData.actors).length) {
              count -= Object.keys(areaData.actors).length;
              for (var key in areaData.actors) {

                if (areaData.actors[key].type == "hero") {
                  var DrawHero = function (actorData) {
                    Game.drawHero(actorData, function (heroImage) {
                      actorData.image = heroImage;
                      actorData.id = "hero_" + actorData.name;
                      delete actorData.images;
                      var hero = new Game.ActorClass(actorData);
                      areaData.actors[actorData.id] = hero;
                      hero.oncomplete(AreaComplete);
                    });
                  };
                  DrawHero(areaData.actors[key]);
                } else {
                  var actorObj = new Game.ActorClass(areaData.actors[key]);
                  areaData.actors[key] = actorObj;
                  actorObj.oncomplete(AreaComplete);
                }
              }
            }

            // 处理地图物品，可能出现的物品
            if (areaData.items && Object.keys(areaData.items).length) {
              count -= Object.keys(areaData.items).length;
              for (var key in areaData.items) {
                var itemObj = new Game.ItemClass(areaData.items[key]);
                itemObj.oncomplete(AreaComplete);
              }
            }

          });

        } else {
          console.log(ret.error || "Unknown Error");
        }
      });
    }
  };

})();
