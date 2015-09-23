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

(function () {
  "use strict";

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id, callback) {

    var preloadSoundEffects = {
      hurt: "sound/effect/hurt.ogg"
    };

    for (var key in preloadSoundEffects) {
      (function (key, url) {
        Sprite.Loader.create().add(url).start().on("complete", function (event) {
          Game.sounds[key] = event.data[0];
        });
      })(key, preloadSoundEffects[key]);
    }

    var preloadItems = ["bag", "gold"];
    preloadItems = preloadItems.filter(function (element) {
      if (Game.items && Game.items.hasOwnProperty(element)) {
        return false;
      }
      return true;
    });

    if (preloadItems.length > 0) {
      var itemLoader = Sprite.Loader.create();
      preloadItems.forEach(function (id) {
        Game.Item.load(id);
      });
    }

    Sprite.Loader.create().add("map/" + id + ".json", "map/" + id + ".extra.json").start().on("complete", function (event) {

      var mapData = event.data[0];
      var mapExtra = event.data[1];
      mapData.id = id;

      for (var key in mapExtra) {
        mapData[key] = mapExtra[key];
      }

      var mapObj = new Game.Map(mapData);
      mapObj.on("complete", function () {

        var area = {
          actors: new Set(),
          bags: new Set(),
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            callback(area);
          }
        };

        if (mapExtra.actors) {
          mapExtra.actors.forEach(function (element) {
            completeCount--;
            Sprite.Loader.create().add("actor/" + element.id + ".json").start().on("complete", function (event) {
              var actorData = Sprite.copy(event.data[0]);
              actorData.id = id;
              for (var key in element) {
                actorData[key] = element[key];
              }
              var actorObj = null;

              if (actorData.type == "ally") {
                actorObj = new Game.ActorAlly(actorData);
              } else if (actorData.type == "monster") {
                actorObj = new Game.ActorMonster(actorData);
              } else if (actorData.type == "npc") {
                actorObj = new Game.ActorNPC(actorData);
              } else if (actorData.type == "pet") {
                actorObj = new Game.ActorPet(actorData);
              } else {
                console.error(actorData.type, actorData);
                throw new Error("Invalid actor type");
              }

              actorObj.on("complete", function () {
                area.actors.add(actorObj);
                actorObj.draw(Game.layers.actorLayer);
                Complete();
              });
            });
          });
        }

        if (mapExtra.onto) {
          mapExtra.onto.forEach(function (element) {
            var onto = Sprite.copy(element);
            onto.type = "onto";
            area.onto.push(onto);
          });
        }

        if (mapExtra.touch) {
          mapExtra.touch.forEach(function (element) {
            var touch = Sprite.copy(element);
            area.touch.push(touch);
          });
        }

        Complete();
      });
    });
  });
})();
//# sourceMappingURL=GameArea.js.map
