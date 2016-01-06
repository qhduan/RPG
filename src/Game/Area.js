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

import Sprite from "../Sprite/Sprite.js";
import Game   from "./Base.js";

let internal = Sprite.Util.namespace();

// 游戏无论什么时候都需要预加载的内容
function Preload () {
  return new Promise( (resolve, reject) => {
    let promises = new Set();

    let preloadSoundEffects = {
      hurt: "sound/effect/hurt.ogg" // 伤害效果音
    };

    for (const key in preloadSoundEffects) {
      promises.add(
        ((key, url) => {
          return new Promise( (resolve, reject) => {
            if (Game.sounds && Game.sounds[key]) {
              resolve();
            } else {
              Sprite.Loader.load(url).then( (data) => {
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

    preloadItems.forEach((id) => {
      promises.add(
        new Promise( (resolve, reject) => {
          if (Game.items && Game.items[id]) {
            resolve();
          } else {
            Game.Item.load(id).then( (itemObj) => {
              resolve();
            });
          }
        })
      );
    });

    Promise.all(promises).then(resolve, reject);
  });
}

export default class Area {

  static load (id) {
    return new Promise( (resolve, reject) => {

      Promise.all([
        Game.Map.load(id),
        Preload()
      ]).then( ([mapObj]) => {
        return {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };
      }).then( (area) => {

        let promises = new Set();

        if (area.map.data.actors) {
          area.map.data.actors.forEach( (element) => {
            promises.add( Game.Actor.load(element.id).then( (actorObj) => {
              for (const key in element) {
                actorObj.data[key] = element[key];
              }
              area.actors.add(actorObj);
              actorObj.draw();
            }));
          });
        }

        if (
          area.map.spawnMonster &&
          area.map.spawnMonster.list &&
          area.map.spawnMonster.count
        ) {
          for (const monsterId in area.map.spawnMonster.list) {
            promises.add( Game.Actor.load(monsterId) );
          }
        }

        if (
          area.map.spawnItem &&
          area.map.spawnItem.list &&
          area.map.spawnItem.count
        ) {
          for (const itemId in area.map.spawnItem.list) {
            promises.add( Game.Item.load(itemId) );
          }
        }

        if (area.map.data.onto) {
          area.map.data.onto.forEach( (element) => {
            area.onto.push(element);
          });
        }

        if (area.map.data.touch) {
          area.map.data.touch.forEach( (element) => {
            area.touch.push(element);
          });
        }

        Promise.all(promises)
        .then( () => {
          resolve(area);
        });

      });

    });
  }

}
