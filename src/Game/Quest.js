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

export default class Quest {

  static load (id) {
    return new Promise( (resolve, reject) => {
      Sprite.Loader.load(`quest/${id}.js`).then( ([questDataFunc]) => {
        let questData = questDataFunc(Game);
        questData.id = id;
        resolve(questData);
      });
    });
  }

  static isComplete (quest) {
    if (quest.target) {
      if (quest.target.kill) {
        for (let k of quest.target.kill) {
          if (k.current < k.need) {
            return false;
          }
        }
      }
    }

    return true;
  }

}
