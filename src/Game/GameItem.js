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

  Game.assign("Item", class GameItem extends Sprite.Event {

    static load (id, callback) {
      Sprite.Loader.create()
        .add(`item/${id}.json`)
        .start()
        .on("complete", (event) => {
        let itemData = event.data[0];
        itemData.id = id;
        let itemObj = new Game.Item(itemData);
        Game.items[id] = itemObj;
        itemObj.on("complete", () => {
          if (callback) {
            callback();
          }
        });
      });
    }

    constructor (itemData) {
      super();
      let privates = internal(this);

      privates.data = itemData;
      privates.inner = null;

      if (!this.data.x || !this.data.y) {
        this.data.x = 0;
        this.data.y = 0;
      }

      Sprite.Loader.create()
        .add(`item/${this.data.image}`)
        .start()
        .on("complete", (event) => {
        let image = event.data[0];

        privates.icon = image;

        privates.bitmap = new Sprite.Bitmap(image);
        privates.bitmap.x = this.data.x * 32 + 16;
        privates.bitmap.y = this.data.y * 32 + 16;

        if (Number.isInteger(this.data.centerX) && Number.isInteger(this.data.centerY)) {
          privates.bitmap.centerX = this.data.centerX;
          privates.bitmap.centerY = this.data.centerY;
        } else {
          console.log(this.data);
          throw new Error("Game.Item invalid centerX/centerY");
        }

        internal(this).bitmap.name = this.id;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    get id () {
      return internal(this).data.id;
    }

    set id (value) {
      throw new Error("Game.Item.id readonly");
    }

    get icon () {
      return internal(this).bitmap.image;
    }

    set icon (value) {
      throw new Error("Game.Item.icon readonly");
    }

    get data () {
      return internal(this).data;
    }

    set data (value) {
      console.error(this);
      throw new Error("Game.Item.data readonly");
    }

    get inner () {
      return internal(this).inner;
    }

    set inner (value) {
      internal(this).inner = value;
    }

    get x () {
      return internal(this).data.x;
    }

    set x (value) {
      let privates = internal(this);
      privates.data.x = value;
      privates.bitmap.x = value * 32 + 16;
    }

    get y () {
      return internal(this).data.y;
    }

    set y (value) {
      let privates = internal(this);
      privates.data.y = value;
      privates.bitmap.y = value * 32 + 16;
    }

    get visible () {
      return internal(this).bitmap.visible;
    }

    set visible (value) {
      internal(this).bitmap.visible = value;
    }

    get alpha () {
      return internal(this).bitmap.alpha;
    }

    set alpha (value) {
      if (Number.isFinite(value) && value >= 0 && value <= 1) {
        internal(this).bitmap.alpha = value;
      } else {
        console.error(value, this);
        throw new Error("Game.Item.alpha got invalid value");
      }
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

    heroUse () {
      if (this.inner) {
        Game.windows.pickup.open(this);
      }

      if (this.data.type == "potion") {
        for (let attribute in this.data.potion) {
          let effect = this.data.potion[attribute];
          if (attribute == "hp") {
            Game.hero.data.hp = Math.min(
              Game.hero.data.hp + effect,
              Game.hero.data.$hp
            );
            let text = new Sprite.Text({
              text: `hp+${effect}`,
              color: "black",
              fontSize: 20
            });
            text.centerX = Math.floor(text.width / 2);
            text.centerY = Math.floor(text.height);
            text.x = Game.hero.sprite.x;
            text.y = Game.hero.sprite.y;
            Game.layers.actorLayer.appendChild(text);
            Sprite.Ticker.whiles(100, (last) => {
              text.y -= 3;
              if (last) {
                Game.layers.actorLayer.removeChild(text);
              }
            });
          }
        }
        console.log(Game.hero.data.items[this.id])
        Game.hero.data.items[this.id]--;
        console.log(Game.hero.data.items[this.id])
        if (Game.hero.data.items[this.id] <= 0) {
          delete Game.hero.data.items[this.id];
        }
      } // potion

      if (this.data.type == "book") {
        Game.dialogue(this.data.read, `《${this.data.name}》`);
      } // book
    }

    clone (callback) {
      let itemObj = new Game.Item(Sprite.copy(this.data));
      itemObj.x = this.x;
      itemObj.y = this.y;
      itemObj.centerX = this.centerX;
      itemObj.centerY = this.centerY;
      itemObj.alpha = this.alpha;
      itemObj.visible = this.visible;
      itemObj.inner = this.inner;
      return itemObj;
    }

    erase (layer) {
      Game.layers.itemLayer.removeChild(internal(this).bitmap);
    }

    draw () {
      Game.layers.itemLayer.appendChild(internal(this).bitmap);
    }

  });


})();
