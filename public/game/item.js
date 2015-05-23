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

  var ItemClass = Game.ItemClass = function (itemData, callback) {
    var self = this;

    self.data = itemData;
    self.id = self.data.id;

    var image = null;

    function ImageComplete () {
      self.bitmap = new createjs.Bitmap(image);
      self.bitmap.regX = image.width / 2;
      self.bitmap.regX = image.height / 2;
      Game.items[self.data.id] = self;
      Game.resources[self.data.id] = image;
      if (callback) callback(self);
    }

    if (Game.resources.hasOwnProperty(self.data.id)) {
      image = Game.resources[self.data.id];
      ImageComplete();
    } else {
      image = new Image();
      image.onload = ImageComplete;
      image.src = self.data.image;
    }
  };

  ItemClass.prototype.draw = function (x, y) {
    self.bitmap.x = x;
    self.bitmap.y = y;

    Game.stage.addChild(self.bitmap);
    Game.updateStage();
  };

  ItemClass.prototype.clone = function (callback) {
    var self = this;

    new ItemClass(self.data, callback);
  };

})();
