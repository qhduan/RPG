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

  // 加载区域，把括地图，角色，物品
  Game.loadArea = function (id, callback) {
    Game.io.get("/area/get", {
      id: id
    }, function (ret) {

      if (ret.map) {
        var mapData = ret.map;

        Game.preload(ret.resources, function () {

          mapData.tilesets.forEach(function (element) {
            element.image = Game.resources[element.image];
          });

          var count = 0;
          // 当area的actors和items都加载完成后回调
          var AreaComplete = function () {
            count++;
            if (count >= 0){
              var mapObj = new Game.MapClass(mapData);
              ret.map = mapObj;
              mapObj.on("complete", function () {
                callback(ret);
              });
            }
          };

          count = 0;
          count -= Object.keys(ret.heros).length;
          count -= Object.keys(ret.actors).length;
          count -= Object.keys(ret.items).length;

          // 处理地图中的hero
          for (var key in ret.heros) {
            (function (key, heroData) {
              Game.drawHero(heroData.custom, function (heroImage) {
                heroData.image = heroImage;
                var heroObj = ret.heros[key] = new Game.ActorClass(heroData);

                heroObj.items = [];
                for (var i = 0; i < heroObj.data.items.length; i++) {
                  if (heroObj.data.items[i]) {
                    heroObj.items[i] = {
                      id: heroObj.data.items[i].id,
                      count: heroObj.data.items[i].count,
                      item: new Game.ItemClass(heroObj.data.items[i].item),
                    };
                  }
                }

                heroObj.equipment = {};
                for (var equipment in heroObj.data.equipment) {
                  if (heroObj.data.equipment[equipment])
                    heroObj.equipment[equipment] = new Game.ItemClass(heroObj.data.equipment[equipment]);
                }

                heroObj.on("complete", AreaComplete);
              });
            })(key, ret.heros[key]);
          }

          // 处理地图角色（NPC或怪物）
          for (var key in ret.actors) {
            var actorObj = new Game.ActorClass(ret.actors[key]);
            ret.actors[key] = actorObj;
            actorObj.on("complete", AreaComplete);
          }

          // 处理地图物品，可能出现的物品
          for (var key in ret.items) {
            var itemObj = new Game.ItemClass(ret.items[key]);
            ret.items[key] = itemObj;
            itemObj.on("complete", AreaComplete);
          }

        });

      } else {
        console.log(ret.error || "Unknown Error");
      }
    });
  };

})();
