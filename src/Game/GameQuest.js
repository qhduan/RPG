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

  Game.assign("Quest", class GameQuest {

    static load (id, callback) {
      Sprite.Loader.create()
        .add(`quest/${id}.js`)
        .start()
        .on("complete", function (event) {
          let questData = event.data[0]();
          questData.id = id;
          if (callback) {
            callback(questData);
          }
        }
      );
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

  });


})();
