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
      Sprite.Loader.create()
        .add(`/item/${id}.json`)
        .start()
        .on("complete", (event) => {
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

      if (!this.data.x || !this.data.y) {
        this.data.x = 0;
        this.data.y = 0;
      }

      Sprite.Loader.create()
        .add(`/item/${this.data.image}`)
        .start()
        .on("complete", (event) => {
        var image = event.data[0];

        this.icon = image;

        this.bitmap = new Sprite.Bitmap(image);
        this.bitmap.x = this.data.x * 32 + 16;
        this.bitmap.y = this.data.y * 32 + 16;

        if (Number.isInteger(this.data.centerX) && Number.isInteger(this.data.centerY)) {
          this.bitmap.centerX = this.data.centerX;
          this.bitmap.centerY = this.data.centerY;
        } else {
          console.log(this.data);
          throw new Error("Game.Item invalid centerX/centerY");
        }

        this.bitmap.name = this.id;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    get x () {
      return this.data.x;
    }

    set x (value) {
      this.data.x = value;
      this.bitmap.x = value * 32 + 16;
    }

    get y () {
      return this.data.x;
    }

    set y (value) {
      this.data.y = value;
      this.bitmap.y = value * 32 + 16;
    }

    get position () {
      return {
        x: this.x,
        y: this.y
      };
    }

    set position (value) {
      console.error(this.data);
      throw new Error("Game.Item.position readonly");
    }

    hitTest (x, y) {
      if (this.data.hitArea && this.data.hitArea instanceof Array) {
        for (let p of this.data.hitArea) {
          if (x == this.x + p[0] && y == this.y + p[1]) {
            return true;
          }
        }
        return false;
      } else {
        console.error(this.data);
        throw new Error("Game.Actor.hitTest invalid data");
      }
    }

    pickup () {
      if (this.inner) {
        Game.windows.pickup.execute("pickup", this);
      }
    }

    use (actor) {
      if (this.data.type == "potion") {
        for (let attribute in this.data.potion) {
          var effect = this.data.potion[attribute];
          if (attribute == "hp") {
            actor.data.hp += effect;
            if (actor.data.hp > actor.data.$hp) {
              actor.data.hp = actor.data.$hp;
            }
          }
        }
      }
    }

    clone (callback) {
      var itemObj = new Game.Item(this.data);
      itemObj.x = this.x;
      itemObj.y = this.y;
      itemObj.inner = this.inner;
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
