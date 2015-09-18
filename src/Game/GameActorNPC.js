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

  let internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorNPC", class GameHero extends Game.Actor {
    constructor (actorData) {
      super(actorData);
    }
    
    heroUse () {
      if (this.data.contact) {

        let options = {};

        if (this.data.contact) {
          Sprite.each(this.data.contact, (talk, key) => {
            let h = Game.hero;
            let d = Game.hero.data;
            let result = null;
            try {
              result = eval(talk.condition)
            } catch (e) {
              console.error(talk.condition);
              console.error(e);
              throw new Error("talk.condition eval error");
            }
            if (result) {
              options[key] = key;
            }
          });
        }

        if (this.data.trade) {
          options["买入"] = "buy";
          options["卖出"] = "sell";
        }

        Game.choice(options, (choice) => {
          switch (choice) {
            case "buy":
              Game.windows.buy.open(this.data.trade);
              break;
            case "sell":
              Game.windows.sell.open(this.data.trade);
              break;
            default:
              if (this.data.contact[choice]) {
                Game.dialogue(this.data.contact[choice].content, this.data.name);
              }
          }
        });
      }
    }

  });


})();
