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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

(function () {
  "use strict";

  Game.ItemClass = (function (_Game$EventClass) {
    function ItemClass(itemData) {
      var _this = this;

      _classCallCheck(this, ItemClass);

      _get(Object.getPrototypeOf(ItemClass.prototype), "constructor", this).call(this);

      this.data = itemData;
      this.id = this.data.id;

      var image = null;

      var ImageComplete = function ImageComplete() {
        _this.bitmap = new createjs.Bitmap(image);
        _this.bitmap.regX = image.width / 2;
        _this.bitmap.regY = image.height / 2;
        Game.items[_this.data.id] = self;
        Game.resources[_this.data.id] = image;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      };

      if (Game.resources.hasOwnProperty(this.data.id)) {
        image = Game.resources[this.data.id];
        ImageComplete();
      } else {
        image = new Image();
        image.onload = ImageComplete;
        image.src = this.data.image;
      }
    }

    _inherits(ItemClass, _Game$EventClass);

    _createClass(ItemClass, [{
      key: "clone",
      value: function clone(callback) {
        var self = this;

        var itemObj = new ItemClass(this.data);
        itemObj.oncomplete(callback);
      }
    }, {
      key: "draw",
      value: function draw(layer, x, y) {
        var self = this;

        this.bitmap.x = x;
        this.bitmap.y = y;

        layer.addChild(this.bitmap);
        Game.update();
      }
    }]);

    return ItemClass;
  })(Game.EventClass);
})();
//# sourceMappingURL=item.js.map