/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

(function () {
  "use strict";

  // 加载区域，把括地图，角色，物品
  Game.loadArea = function (id, callback) {

    var preloadItems = ["bag", "gold"];
    var itemLoader = new Sprite.Loader();
    preloadItems.forEach(function (element) {
      itemLoader.add("/item/" + element + ".json");
    });
    itemLoader.start();
    itemLoader.on("complete", function (event) {
      preloadItems.forEach(function (element, index) {
        var itemData = event.data[index];
        Game.items[element] = new Game.ItemClass(itemData);
      });
    });

    var loader = new Sprite.Loader();
    loader.add("/map/" + id + ".json", "/map/" + id + "_extra.json");
    loader.start();
    loader.on("complete", function (event) {
      var mapData = event.data[0];
      var mapExtra = event.data[1];

      var mapObj = new Game.MapClass(mapData);
      mapObj.on("complete", function () {
        var area = {
          actors: {},
          bags: {},
          map: mapObj,
          data: mapExtra
        };

        mapExtra.actors.forEach(function (element) {
          var actorLoader = new Sprite.Loader();
          actorLoader.add("/actor/" + element.id + ".json");
          actorLoader.start();
          actorLoader.on("complete", function (event) {
            var actorData = event.data[0];
            actorData.x = element.x;
            actorData.y = element.y;
            actorData.mode = element.mode;
            var actorObj = new Game.ActorClass(actorData);
            actorObj.on("complete", function () {
              area.actors[actorObj.id] = actorObj;
              actorObj.draw(Game.actorLayer);
            });
          });
        });

        callback(area);
      });
    });
  };
})();
//# sourceMappingURL=GameArea.js.map
