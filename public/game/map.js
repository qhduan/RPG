
~function () {
  "use strict";

  // 指示当前正在显示的地图
  Game.currentMap = null;

  var MapClass = function (mapId) {
    var self = this;
    self.id = mapId;

    Game.io.get("map", mapId, function (mapObj) {
      if (mapObj) {

        for (var key in mapObj) {
          self[key] = mapObj[key];
        }

        var images = [];
        var count = -mapObj.tilesets.length;

        self.tilesets.forEach(function (element) {
          var image = new Image();
          image.src = element.image;
          element.image = image;
          images.push(image);

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
        self.container.cache(0, 0, self.width * self.tilewidth, self.height * self.tileheight);

        Game.maps[self.id] = self;
        if (self.onload) self.onload(self);
      }
    });
  };


  MapClass.prototype.tile = function (x, y) {
    var self = this;
    x = x / self.tilewidth;
    y = y / self.tileheight;
    return {
      x: Math.floor(x),
      y: Math.floor(y)
    };
  }

  // 绘制图片，会改变Game.currentMap
  MapClass.prototype.draw = function () {
    var self = this;
    Game.currentMap = self;

    Game.stage.addChild(self.container);
    //Game.stage.addChild(self.image);
  };

  // 加载地图，返回一个mapObj结构，这个结构包括
  // mapObj.draw()
  // mapObj.tile()
  // mapObj.blockedMap
  Game.loadMap = function (mapId, callback) {
    if (Game.maps.hasOwnProperty(mapId)) {
      callback(Game.maps[mapId]);
      return;
    } else {
      var mapObj = new MapClass(mapId);
      Game.maps[mapId] = mapObj;
      mapObj.onload = function () {
        callback(mapObj);
      };
    }
  };

  Game.loadTypeReg("map", Game.loadMap);


}();
