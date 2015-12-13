"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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
              Sprite.Loader.load(url).then(function (data) {
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

      Promise.all(promises).then(resolve, reject);
    });
  }

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id) {
    return new Promise(function (resolve, reject) {

      Promise.all([Game.Map.load(id), Preload()]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1);

        var mapObj = _ref2[0];

        return {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };
      }).then(function (area) {

        var promises = new Set();

        if (area.map.data.actors) {
          area.map.data.actors.forEach(function (element) {
            promises.add(Game.Actor.load(element.id).then(function (actorObj) {
              for (var key in element) {
                actorObj.data[key] = element[key];
              }
              area.actors.add(actorObj);
              actorObj.draw();
            }));
          });
        }

        if (area.map.spawnMonster && area.map.spawnMonster.list && area.map.spawnMonster.count) {
          for (var monsterId in area.map.spawnMonster.list) {
            promises.add(Game.Actor.load(monsterId));
          }
        }

        if (area.map.spawnItem && area.map.spawnItem.list && area.map.spawnItem.count) {
          for (var itemId in area.map.spawnItem.list) {
            promises.add(Game.Item.load(itemId));
          }
        }

        if (area.map.data.onto) {
          area.map.data.onto.forEach(function (element) {
            area.onto.push(element);
          });
        }

        if (area.map.data.touch) {
          area.map.data.touch.forEach(function (element) {
            area.touch.push(element);
          });
        }

        Promise.all(promises).then(function () {
          resolve(area);
        });
      });
    });
  });
})();
