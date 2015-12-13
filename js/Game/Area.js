"use strict";

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
  "use strict"

  // 游戏无论什么时候都需要预加载的内容
  ;
  function Preload() {
    return new Promise(function (resolve, reject) {
      var promises = new Set();

      var preloadSoundEffects = {
        hurt: "sound/effect/hurt.ogg" // 伤害效果音
      };

      for (var key in preloadSoundEffects) {
        promises.add((function (key, url) {
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
        })(key, preloadSoundEffects[key]));
      }

      var preloadItems = ["bag", // 掉落物品用的小包
      "gold" // 金币图标
      ];

      preloadItems.forEach(function (id) {
        promises.add(new Promise(function (resolve, reject) {
          if (Game.items && Game.items[id]) {
            resolve();
          } else {
            Game.Item.load(id).then(function (itemObj) {
              resolve();
            });
          }
        }));
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

        var area = {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        var promises = new Set();

        promises.add(Preload());

        if (mapObj.data.actors) {
          mapObj.data.actors.forEach(function (element) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(element.id).then(function (actorObj) {

                for (var key in element) {
                  actorObj.data[key] = element[key];
                }

                area.actors.add(actorObj);
                actorObj.draw();
                resolve();
              });
            }));
          });
        }

        if (mapObj.spawnMonster && mapObj.spawnMonster.list && mapObj.spawnMonster.count) {
          var _loop = function _loop(monsterId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(monsterId).then(function () {
                resolve();
              });
            }));
          };

          for (var monsterId in mapObj.spawnMonster.list) {
            _loop(monsterId);
          }
        }

        if (mapObj.spawnItem && mapObj.spawnItem.list && mapObj.spawnItem.count) {
          var _loop2 = function _loop2(itemId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Item.load(itemId).then(function () {
                resolve();
              });
            }));
          };

          for (var itemId in mapObj.spawnItem.list) {
            _loop2(itemId);
          }
        }

        if (mapObj.data.onto) {
          mapObj.data.onto.forEach(function (element) {
            area.onto.push(element);
          });
        }

        if (mapObj.data.touch) {
          mapObj.data.touch.forEach(function (element) {
            area.touch.push(element);
          });
        }

        Promise.all(promises).then(function () {
          resolve(area);
        });
      }); //map
    });
  });
})();
