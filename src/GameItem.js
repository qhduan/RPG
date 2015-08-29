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

  Game.Item = class GameItem extends Sprite.Event {

    static load (id, callback) {
      var itemLoader = new Sprite.Loader();
      itemLoader.add(`/item/${id}.json`);
      itemLoader.start();
      itemLoader.on("complete", (event) => {
        var itemData = event.data[0];
        var itemObj = new Game.Item(itemData);
        Game.items[id] = itemObj;
        itemObj.on("complete", () => {
          if (typeof callback == "function") {
            callback();
          }
        });
      });
    }

    constructor (itemData) {
      super();

      this.data = itemData;
      this.id = this.data.id;
      this.inner = null;

      var loader = new Sprite.Loader();
      loader.add(`/item/${this.data.image}`);
      loader.start();
      loader.on("complete", (event) => {
        var image = event.data[0];

        this.icon = image;

        this.bitmap = new Sprite.Bitmap(image);
        this.bitmap.centerX = image.width / 2;
        this.bitmap.centerY = image.height / 2;
        this.bitmap.name = this.id;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    get x () {
      return this.bitmap.x;
    }

    get y () {
      return this.bitmap.y;
    }

    set x (v) {
      this.bitmap.x = v;
    }

    set y (v) {
      this.bitmap.y = v;
    }

    pickup () {
      if (this.inner) {
        Game.windows.pickup.execute("pickup", this);
      }
    }

    clone (callback) {
      var self = this;

      var itemObj = new Game.Item(this.data);
      return itemObj;
    }

    erase (layer) {
      layer.removeChild(this.bitmap);
    }

    draw (layer) {
      layer.appendChild(this.bitmap);
    }

  };

})();
