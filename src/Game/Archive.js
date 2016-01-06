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
import Game from "./Base.js";
import DrawHero from "./Component/DrawHero.js";

let internal = Sprite.Util.namespace();

export default class Archive {

  static remove (id) {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
  }

  // 返回所有存档，Object格式
  static list () {
    let keys = [];
    for (let key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
      }
    }
    keys.sort();
    keys.reverse();
    return keys;
  }

  // 返回最新存档，Object格式
  static last () {
    let list = Archive.list();
    if (list.length > 0) {
      let last = list[0];
      return JSON.parse(window.localStorage.getItem(`SAVE_${last}`));
    } else {
      return null;
    }
  }

  static clear () {
    for (let key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        window.localStorage.removeItem(key);
      }
    }
  }

  static save (data) {
    let now = new Date();
    let id = now.getTime();

    data.id = id;
    data.name = data.hero.name;
    data.date = now.toLocaleString();

    window.localStorage.setItem(`SAVE_${id}`, JSON.stringify(data));
  }

  static get (id) {
    if (id && window.localStorage.getItem(id)) {
      return JSON.parse(window.localStorage.getItem(id));
    }
    return null;
  }

  static load (id) {
    let data = Archive.get(id);
    if (!data) {
      data = Archive.last();
    }

    if (data) {

      if (Game.windows.interface.showing) {
        Game.windows.interface.hide();
      }
      Game.windows.main.hide();

      Game.windows.loading.begin();

      setTimeout( () => {
        let heroData = data.hero;

        DrawHero(heroData.custom).then( (heroImage) => {
          heroData.image = heroImage;
          Game.hero = new Game.ActorHero(heroData);

          Game.hero.on("complete", () => {

            Game.hero.gotoArea(heroData.area, heroData.x, heroData.y);

          });

        });
      }, 20);

    } else {
      console.error("id:", id);
      throw new Error("Invalid id, GameArchive.load");
    }
  }

}
