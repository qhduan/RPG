/*

Online A-RPG Game, Built using Node.js + createjs
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

  Game.ItemClass = class ItemClass extends Game.EventClass {
    constructor (itemData) {
      super();

      this.data = itemData;
      this.id = this.data.id;

      if (!Game.resources[this.data.image]) {
        console.log(this.id, this.data.image);
        throw new TypeError("Invalid Item Image");
      }

      var image = Game.resources[this.data.image];
      this.bitmap = new createjs.Bitmap(image);
      this.bitmap.regX = image.width / 2;
      this.bitmap.regY = image.height / 2;
      this.bitmap.name = this.id;
      Game.items[this.id] = this;

      // 发送完成事件，第二个参数代表一次性事件
      this.emit("complete", true);
    }

    clone (callback) {
      var self = this;

      var itemObj = new ItemClass(this.data);
      itemObj.on("complete", callback);
    }

    draw (layer, x, y) {
      var self = this;

      this.bitmap.x = x;
      this.bitmap.y = y;

      layer.addChild(this.bitmap);
      Game.update();
    }

  };

})();
