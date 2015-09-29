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

  // 游戏无论什么时候都需要预加载的内容
  function Preload () {
    return new Promise(function (resolve, reject) {
      let promises = new Set();

      let preloadSoundEffects = {
        hurt: "sound/effect/hurt.ogg" // 伤害效果音
      };

      for (let key in preloadSoundEffects) {
        promises.add(
          (function (key, url) {
            return new Promise(function (resolve, reject) {
              if (Game.sounds && Game.sounds[key]) {
                resolve();
              } else {
                Sprite.load(url).then(function (data) {
                  Game.sounds[key] = data[0];
                  resolve();
                });
              }
            });
          })(key, preloadSoundEffects[key])
        );
      }

      let preloadItems = [
        "bag", // 掉落物品用的小包
        "gold" // 金币图标
      ];

      preloadItems.forEach(function (id) {
        promises.add(
          new Promise(function (resolve, reject) {
            if (Game.items && Game.items[id]) {
              resolve();
            } else {
              Game.Item.load(id).then(function (itemObj) {
                resolve();
              });
            }
          })
        );
      });

      Promise.all(promises).then(function () {
        resolve();
      });
    });
  }

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id) {
    return new Promise(function (resolve, reject) {

      Game.Map.load(id).then(function (mapObj) {

        let area = {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        let promises = new Set();

        promises.add(Preload());

        if (mapObj.data.actors) {
          mapObj.data.actors.forEach(function (element) {
            promises.add(
              new Promise(function (resolve, reject) {
                Game.Actor.load(element.id).then(function (actorObj) {

                  for (let key in element) {
                    actorObj.data[key] = element[key];
                  }

                  area.actors.add(actorObj);
                  actorObj.draw();
                  resolve();
                });
              })
            );
          });
        }

        if (
          mapObj.spawnMonster &&
          mapObj.spawnMonster.list &&
          mapObj.spawnMonster.count
        ) {
          for (let monsterId in mapObj.spawnMonster.list) {
            promises.add(
              new Promise(function (resolve, reject) {
                Game.Actor.load(monsterId).then(function () {
                  resolve();
                });
              })
            );
          }
        }

        if (
          mapObj.spawnItem &&
          mapObj.spawnItem.list &&
          mapObj.spawnItem.count
        ) {
          for (let itemId in mapObj.spawnItem.list) {
            promises.add(
              new Promise(function (resolve, reject) {
                Game.Item.load(itemId).then(function () {
                  resolve();
                });
              })
            );
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

        Promise.all(promises).then(function () {
          resolve(area);
        });

      }); //map

    });
  });

})();
