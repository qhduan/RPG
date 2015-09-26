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

  // 游戏总是需要预加载的内容
  function Preload (callback) {

    let done = 0;
    let Complete = function () {
      done++;
      if (done >= 0) {
        if (callback) {
          callback();
        }
      }
    }

    let preloadSoundEffects = {
      hurt: "sound/effect/hurt.ogg"
    };

    for (let key in preloadSoundEffects) {
      (function (key, url) {
        done--;
        if (Game.sounds && Game.sounds[key]) {
          Complete();
        } else {
          Sprite.load(url).then(function (data) {
            Game.sounds[key] = data[0];
            Complete();
          });
        }
      })(key, preloadSoundEffects[key]);
    }

    let preloadItems = ["bag", "gold"];

    preloadItems.forEach(function (id) {
      done--;
      if (Game.items && Game.items[id]) {
        Complete();
      } else {
        Game.Item.load(id).then(function (itemObj) {
          Complete();
        });
      }

    });

  }

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id) {
    return new Promise(function (resolve, reject) {

      Game.Map.load(id).then(function (mapObj) {

        let area = {
          actors: new Set(),
          bags: new Set(),
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        let done = 0;
        let Complete = () => {
          done++;
          if (done >= 0) {
            resolve(area);
          }
        };

        done--;
        Preload(function () {
          Complete();
        });

        if (mapObj.data.actors) {
          mapObj.data.actors.forEach(function (element) {
            done--;

            Game.Actor.load(element.id).then(function (actorObj) {

              for (let key in element) {
                actorObj.data[key] = element[key];
              }

              area.actors.add(actorObj);
              actorObj.draw(Game.layers.actorLayer);
              Complete();
            });

          });
        }

        if (
          mapObj.spawnMonster &&
          mapObj.spawnMonster.list &&
          mapObj.spawnMonster.count
        ) {
          for (let monsterId in mapObj.spawnMonster.list) {
            done--;
            Game.Actor.load(monsterId).then(function () {
              Complete();
            });
          }
        }

        if (
          mapObj.spawnItem &&
          mapObj.spawnItem.list &&
          mapObj.spawnItem.count
        ) {
          for (let oreId in mapObj.spawnItem.list) {
            done--;
            Game.Item.load(oreId).then(function () {
              Complete();
            });
          }
        }

        if (mapObj.data.onto) {
          mapObj.data.onto.forEach(function (element) {
            let onto = Sprite.copy(element);
            onto.type = "onto";
            area.onto.push(onto);
          });
        }

        if (mapObj.data.touch) {
          mapObj.data.touch.forEach(function (element) {
            let touch = Sprite.copy(element);
            area.touch.push(touch);
          });
        }

      }); //map

    });
  });

})();
