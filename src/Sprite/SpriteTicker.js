/*

2D Game Sprite Library, Built using JavaScript ES6
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

/**
 * @fileoverview Sprite.Ticker
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
 "use strict";

  let tickerCount = 0;

  class SpriteTicker extends Sprite.Event {
    constructor () {
      super();
      this.tick();
    }

    tick () {
      tickerCount++;
      this.emit("tick", false, tickerCount);
      window.requestAnimationFrame(() => {
        this.tick();
      });
    }

    after (times, callback) {
      let count = 0;
      let id = this.on("tick", () => {
        count++;
        if (count >= times) {
          this.off("tick", id);
          if (callback) {
            callback();
          }
        }
      });
      return id;
    }

    clearAfter (id) {
      this.off("tick", id);
    }

    whiles (times, callback) {
      let count = 0;
      let id = this.on("tick", () => {
        count++;
        if (count >= times) {
          if (callback) {
            callback(true);
          }
          this.off("tick", id);
        } else {
          if (callback) {
            callback(false);
          }
        }
      });
      return id;
    }

    clearWhiles (id) {
      this.off("tick", id);
    }

  };

  Sprite.assign("Ticker", new SpriteTicker());

})();
