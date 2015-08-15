/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Sprite.Ticker.on("tick", function () {
    if (Game.uiLayer && Game.hero) {
      Game.uiLayer.center.x = -Game.hero.x;
      Game.uiLayer.center.y = -Game.hero.y;
    }
  });

  var BoxClass = (function () {
    function BoxClass(x, y, width, height) {
      _classCallCheck(this, BoxClass);

      var box = new Sprite.Shape();
      this.box = box;
      this.defaultColor = "gray";

      if (typeof width == "undefined") width = 50;
      if (typeof height == "undefined") height = 50;

      this.width = width;
      this.height = height;

      box.rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: this.defaultColor
      });

      box.center.x = Math.floor(width / 2);
      box.center.y = Math.floor(height / 2);
      box.x = x;
      box.y = y;
    }

    _createClass(BoxClass, [{
      key: "drawOn",
      value: function drawOn(container) {
        container.appendChild(this.box);
        Game.update();
      }
    }, {
      key: "distance",
      value: function distance(x, y) {
        var d = 0;
        d += Math.pow(this.box.x - x, 2);
        d += Math.pow(this.box.y - y, 2);
        return Math.sqrt(d);
      }
    }, {
      key: "on",
      value: function on() {
        this.box.on.apply(this.box, arguments);
      }
    }, {
      key: "off",
      value: function off() {
        this.box.off.apply(this.box, arguments);
      }
    }, {
      key: "x",
      get: function get() {
        return this.box.x;
      },
      set: function set(v) {
        this.box.x = v;
        Game.update();
      }
    }, {
      key: "y",
      get: function get() {
        return this.box.y;
      },
      set: function set(v) {
        this.box.y = v;
        Game.update();
      }
    }, {
      key: "visible",
      get: function get() {
        return this.box.visible;
      },
      set: function set(v) {
        this.box.visible = v;
        Game.update();
      }
    }, {
      key: "color",
      get: function get() {
        return this.defaultColor;
      },
      set: function set(v) {
        this.defaultColor = v;
        this.box.clear().rect({
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          fill: v
        });
        Game.update();
      }
    }]);

    return BoxClass;
  })();

  var TextClass = (function () {
    function TextClass(text, x, y, width, height) {
      _classCallCheck(this, TextClass);

      this.text = text;
      this.textObj = new Sprite.Text({
        text: text,
        maxWidth: width,
        fontSize: 20
      });
      this.textObj.x = x;
      this.textObj.y = y;

      var box = new Sprite.Shape();
      box.rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: "gray"
      });
      box.x = x;
      box.y = y;
      box.alpha = 0.01;
      this.box = box;
    }

    _createClass(TextClass, [{
      key: "drawOn",
      value: function drawOn(container) {
        container.appendChild(this.box);
        container.appendChild(this.textObj);
        Game.update();
      }
    }, {
      key: "on",
      value: function on() {
        this.box.on.apply(this.box, arguments);
      }
    }, {
      key: "off",
      value: function off() {
        this.box.off.apply(this.box, arguments);
      }
    }, {
      key: "x",
      get: function get() {
        return this.box.x;
      },
      set: function set(v) {
        this.box.x = v;
        this.textObj.x = v;
        Game.update();
      }
    }, {
      key: "y",
      get: function get() {
        return this.box.y;
      },
      set: function set(v) {
        this.box.y = v;
        this.textObj.y = v;
        Game.update();
      }
    }]);

    return TextClass;
  })();

  var BoxBitmapClass = (function (_BoxClass) {
    _inherits(BoxBitmapClass, _BoxClass);

    function BoxBitmapClass(bitmap, x, y) {
      _classCallCheck(this, BoxBitmapClass);

      _get(Object.getPrototypeOf(BoxBitmapClass.prototype), "constructor", this).call(this, x, y);

      if (bitmap instanceof Sprite.Bitmap) {
        this.bitmap = bitmap.clone();
      } else if (bitmap instanceof Image) {
        this.bitmap = new Sprite.Bitmap(bitmap);
        this.bitmap.center.x = Math.floor(this.bitmap.width / 2);
        this.bitmap.center.y = Math.floor(this.bitmap.height / 2);
      } else if (typeof bitmap == "string" && Game.resources.hasOwnProperty(bitmap)) {
        this.bitmap = new Sprite.Bitmap(Game.resources[bitmap]);
        this.bitmap.center.x = Math.floor(this.bitmap.width / 2);
        this.bitmap.center.y = Math.floor(this.bitmap.height / 2);
      } else {
        console.log(bitmap, typeof bitmap);
        throw new TypeError("BoxBitmapClass Invalid Arguments");
      }

      this.bitmap.x = x;
      this.bitmap.y = y;
    }

    _createClass(BoxBitmapClass, [{
      key: "drawOn",
      value: function drawOn(container) {
        container.appendChild(this.box);
        container.appendChild(this.bitmap);
        Game.update();
      }
    }, {
      key: "x",
      get: function get() {
        return this.box.x;
      },
      set: function set(v) {
        this.box.x = v;
        this.bitmap.x = v;
        Game.update();
      }
    }, {
      key: "y",
      get: function get() {
        return this.box.y;
      },
      set: function set(v) {
        this.box.y = v;
        this.bitmap.y = v;
        Game.update();
      }
    }]);

    return BoxBitmapClass;
  })(BoxClass);

  var BoxBitmapButtonClass = (function (_BoxBitmapClass) {
    _inherits(BoxBitmapButtonClass, _BoxBitmapClass);

    function BoxBitmapButtonClass(bitmap, x, y) {
      _classCallCheck(this, BoxBitmapButtonClass);

      _get(Object.getPrototypeOf(BoxBitmapButtonClass.prototype), "constructor", this).call(this, bitmap, x, y);
      //this.box.shadow = new Sprite.Shadow("black", 1, 1, 1);
    }

    return BoxBitmapButtonClass;
  })(BoxBitmapClass);

  var BoxButtonClass = (function (_BoxClass2) {
    _inherits(BoxButtonClass, _BoxClass2);

    function BoxButtonClass(x, y) {
      _classCallCheck(this, BoxButtonClass);

      _get(Object.getPrototypeOf(BoxButtonClass.prototype), "constructor", this).call(this, x, y);
      //this.box.shadow = new Sprite.Shadow("black", 1, 1, 1);
    }

    return BoxButtonClass;
  })(BoxClass);

  var BoxTextButtonClass = (function (_BoxClass3) {
    _inherits(BoxTextButtonClass, _BoxClass3);

    function BoxTextButtonClass(text, x, y, width, height) {
      _classCallCheck(this, BoxTextButtonClass);

      _get(Object.getPrototypeOf(BoxTextButtonClass.prototype), "constructor", this).call(this, x, y, width, height);
      //this.box.shadow = new Sprite.Shadow("black", 1, 1, 1);
      var text = new Sprite.Text(text, 200, "white", 25, "Arial");
      text.center.x = Math.floor(text.width / 2);
      text.center.y = Math.floor(text.height / 2);
      text.x = x;
      text.y = y;
      this.text = text;
    }

    // 调整窗口跟随玩家
    /*
    Game.oninit(function () {
      Game.stage.on("drawstart", function () {
        if (Game.uiLayer.numChildren) {
          Game.uiLayer.children.forEach(function (element) {
            element.x = parseInt(Game.hero.x);
            element.y = parseInt(Game.hero.y);
          });
           if (Game.ui.redPoint) {
            var heroX = parseInt(Game.hero.x / Game.area.map.width * Game.area.map.minimap.width);
            var heroY = parseInt(Game.hero.y / Game.area.map.height * Game.area.map.minimap.height);
            Game.ui.redPoint.x = heroX + 160;
            Game.ui.redPoint.y = heroY + 12;
          }
         }
      });
    });
    */

    _createClass(BoxTextButtonClass, [{
      key: "drawOn",
      value: function drawOn(container) {
        container.appendChild(this.box);
        container.appendChild(this.text);
        Game.update;
      }
    }, {
      key: "x",
      get: function get() {
        return this.box.x;
      },
      set: function set(v) {
        this.text.x = v;
        this.box.x = v;
        Game.update();
      }
    }, {
      key: "y",
      get: function get() {
        return this.box.y;
      },
      set: function set(v) {
        this.text.y = v;
        this.box.y = v;
        Game.update();
      }
    }]);

    return BoxTextButtonClass;
  })(BoxClass);

  Game.ui = {};

  Game.ui.clickSpell = function (num) {
    if (Game.hero && Game.hero.fire) {
      var cooldown = Game.hero.fire(num);
      if (cooldown > 0) {

        var spellIcon = Game.ui.spellBarIcon[num];
        //spellIcon.color = "green";

        cooldown -= 100;

        /*
        Sprite.Tween.get(spellIcon.box).to({alpha: 0}, cooldown).call(function () {
          spellIcon.color = "gray";
          spellIcon.box.alpha = 1;
          Game.update();
        }).on("change", function () {
          Game.update();
        });
        */
      }
    }
  };

  var indexToEquipment = {
    "0": "head",
    "1": "neck",
    "2": "body",
    "3": "feet",
    "4": "righthand",
    "5": "lefthand",
    "6": "leftring",
    "7": "rightring"
  };

  function ItemChanged() {
    var items = [];
    items.length = Game.hero.items.length;
    for (var i = 0; i < items.length; i++) {
      if (Game.hero.items[i]) items[i] = {
        id: Game.hero.items[i].id,
        count: Game.hero.items[i].count
      };
    }

    var equipment = {};

    for (var key in Game.hero.equipment) {
      if (Game.hero.equipment[key]) equipment[key] = Game.hero.equipment[key].id;else equipment[key] = null;
    }

    Game.io.updateHero({
      items: items,
      equipment: equipment
    });
  }

  // 物品选择，弹出物品信息
  function ItemSelect(type, index) {
    var itemObj = null;

    if (type == "equipment") {
      itemObj = Game.hero.equipment[indexToEquipment[index]];
      if (!itemObj) return;
    }

    if (type == "item") {
      if (!Game.hero.items[index]) return;
      itemObj = Game.hero.items[index].item;
      if (!itemObj) return;
    }

    // 分割，每行最多22个字符宽度
    var text = itemObj.data.description;

    var buffnerf = [];
    if (itemObj.data.buff) {
      for (var key in itemObj.data.buff) {
        var sign = "+";
        if (itemObj.data.buff[key] < 0) sign = "-";
        buffnerf.push(key + ": " + sign + itemObj.data.buff[key] + ";");
      }
    }
    if (itemObj.data.nerf) {
      for (var key in itemObj.data.nerf) {
        var sign = "+";
        if (itemObj.data.buff[key] < 0) sign = "-";
        buffnerf.push(key + ": " + sign + itemObj.data.nerf[key] + ";");
      }
    }

    if (buffnerf.length) {
      text += "\n" + buffnerf.join("   ");
    }

    if (Game.ui.itemText) {
      Game.ui.itemWindow.removeChild(Game.ui.itemText);
      Game.ui.itemText = null;
    }

    var itemText = Game.ui.itemText = new Sprite.Text({
      text: text,
      fontSize: 18,
      maxWidth: 360
    });
    itemText.x = 420;
    itemText.y = 290;
    Game.ui.itemWindow.appendChild(itemText);

    Game.update();
  }

  // 物品改变，装备，卸下装备，物品调整顺序等
  function ItemExchange(lastType, lastIndex, type, index) {

    if (lastType == "equipment" && type == "equipment") {

      Game.ui.armorBox[lastIndex].color = "gray";

      if (lastIndex != index) {
        lastIndex = -1;
        lastType = null;

        return ItemSelect(type, index);
      }
    }

    if (lastType == "item" && type == "item") {
      if (lastIndex == index) {
        Game.ui.itemBox[index].color = "gray";
      } else {
        var t = Game.hero.items[lastIndex];
        Game.hero.items[lastIndex] = Game.hero.items[index];
        Game.hero.items[index] = t;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      }
    }

    if (lastType == "equipment" && type == "item") {
      if (Game.hero.items[index]) {
        Game.ui.armorBox[lastIndex].color = "gray";
      } else {
        if (!Game.hero.items[index]) Game.hero.items[index] = {};
        Game.hero.items[index].id = Game.hero.equipment[indexToEquipment[lastIndex]].id;
        Game.hero.items[index].item = Game.hero.equipment[indexToEquipment[lastIndex]];
        Game.hero.items[index].count = 1;
        Game.hero.equipment[indexToEquipment[lastIndex]] = null;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
        Game.ui.openArmor();
      }
    }

    if (lastType == "item" && type == "equipment") {
      var CheckFit = function CheckFit(itemIndex, equipmentIndex) {
        var itemType = Game.hero.items[itemIndex].item.data.equip;
        var equipmentType = indexToEquipment[equipmentIndex];
        if (itemType == equipmentType) return true;
        if (itemType == "onehand" && (equipmentType == "righthand" || equipmentType == "lefthand")) return true;
        if (itemType == "twohand" && equipmentType == "righthand") return true;
        return false;
      };

      if (CheckFit(lastIndex, index)) {
        var t = Game.hero.equipment[indexToEquipment[index]];
        Game.hero.equipment[indexToEquipment[index]] = Game.hero.items[lastIndex].item;
        if (t) {
          Game.hero.items[lastIndex] = {
            id: t.id,
            item: t,
            count: 1
          };
        } else {
          Game.hero.items[lastIndex] = null;
        }

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
        Game.ui.openArmor();
      } else {
        Game.ui.itemBox[lastIndex].color = "gray";
      }
    }
  }

  function ItemIconCopy(item, box, type, index) {
    var t = new BoxBitmapClass(item.bitmap, box.x, box.y);

    if (type == "item") t.drawOn(Game.ui.itemWindow);else if (type == "equipment") t.drawOn(Game.ui.armorWindow);else throw new TypeError("invalid");

    var X = t.x;
    var Y = t.y;

    t.on("click", function () {
      ItemSelect(type, index);
    });

    var offset = {};

    t.on("pressdown", function (event) {
      offset.x = t.x - event.x / Game.stage.scale.x;
      offset.y = t.y - event.y / Game.stage.scale.y;
      console.log(event, offset);
    });

    t.on("pressmove", function (event) {
      t.x = event.x / Game.stage.scale.x + offset.x;
      t.y = event.y / Game.stage.scale.y + offset.y;
    });

    t.on("pressup", function (event) {
      var x = event.x / Game.stage.scale.x + offset.x;
      var y = event.y / Game.stage.scale.y + offset.y;

      var lastType = null;
      var lastIndex = -1;

      var minDistance = 9999;
      var minType = null;
      var minIndex = -1;

      if (Game.ui.itemBox) {
        Game.ui.itemBox.forEach(function (element, index) {
          if (element == box) {
            lastType = "item";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "item";
            minIndex = index;
          }
        });
      }

      if (Game.ui.armorBox) {
        Game.ui.armorBox.forEach(function (element, index) {
          if (element == box) {
            lastType = "equipment";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "equipment";
            minIndex = index;
          }
        });
      }

      t.x = X;
      t.y = Y;

      if (lastType && minType && minDistance < 30) {
        ItemExchange(lastType, lastIndex, minType, minIndex);
      }
    });
  }

  function SpellIconCopy(spell, box, type, index) {
    var t = new BoxBitmapClass(spell, box.x, box.y);

    if (Game.ui.spellBarIcon) {
      Game.ui.spellBarIcon[index] = t;
    }

    if (type == "book") {
      t.drawOn(Game.ui.spellWindow);
    } else if (type == "bar") {
      t.drawOn(Game.ui.spellBarWindow);
    }

    var X = t.x;
    var Y = t.y;

    t.on("click", function () {
      if (Game.ui.spellWindow) {
        SpellSelect("book", index);
      } else if (type == "bar") {
        Game.ui.clickSpell(index);
      }
    });

    var offset = {
      x: 0,
      y: 0
    };

    t.on("pressdown", function (event) {
      if (!Game.ui.spellWindow) return;
      offset.x = t.x - event.x / Game.stage.scale.x, offset.y = t.y - event.y / Game.stage.scale.y;
    });

    t.on("pressmove", function (event) {
      if (!Game.ui.spellWindow) return;
      t.x = event.x / Game.stage.scale.x + offset.x;
      t.y = event.y / Game.stage.scale.y + offset.y;
    });

    t.on("pressup", function (event) {
      if (!Game.ui.spellWindow) return;
      var x = event.x / Game.stage.scale.x + offset.x;
      var y = event.y / Game.stage.scale.y + offset.y;

      var lastType = null;
      var lastIndex = -1;

      var minDistance = 9999;
      var minType = null;
      var minIndex = -1;

      if (Game.ui.spellBar) {
        Game.ui.spellBar.forEach(function (element, index) {
          if (element == box) {
            lastType = "bar";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "bar";
            minIndex = index;
          }
        });
      }

      if (Game.ui.spellBook) {
        Game.ui.spellBook.forEach(function (element, index) {
          if (element == box) {
            lastType = "book";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "book";
            minIndex = index;
          }
        });
      }

      if (lastType && minType && minDistance < 30) {
        SpellExchange(lastType, lastIndex, minType, minIndex);
      } else if (lastType == "bar" && minDistance > 100) {
        Game.hero.data.spellbar[lastIndex] = null;
        Game.io.updateHero({ spellbar: Game.hero.data.spellbar });
        Game.ui.openSpellbar();
      }

      t.x = X;
      t.y = Y;
    });
  }

  // 打开物品栏（玩家口袋）
  Game.ui.openItem = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.itemWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.itemWindow);
      Game.ui.itemWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 390,
      height: 370
    });

    background.x = 405;
    background.y = 5;
    background.alpha = 0.8;

    var itemBox = [];
    var itemBoxWidth = 5;
    var itemBoxHeight = 4;
    itemBox.length = itemBoxWidth * itemBoxHeight;

    for (var i = 0; i < itemBoxHeight; i++) {
      for (var j = 0; j < itemBoxWidth; j++) {
        (function (i, j) {
          var index = i * itemBoxWidth + j;
          itemBox[index] = new BoxClass(440 + j * 60, 40 + i * 60);
        })(i, j);
      }
    }

    Game.ui.itemBox = itemBox;

    var itemUseButton = new BoxBitmapButtonClass("/image/use.png", 760, 40);
    var itemDropButton = new BoxBitmapButtonClass("/image/drop.png", 760, 100);
    var itemPrevButton = new BoxBitmapButtonClass("/image/up.png", 760, 160);
    var itemNextButton = new BoxBitmapButtonClass("/image/down.png", 760, 220);

    var itemGoldBox = new Sprite.Text({
      text: "资金：10000000G",
      fontSize: 24,
      color: "gold"
    });
    itemGoldBox.x = 415;
    itemGoldBox.y = 250;

    var itemText = new Sprite.Shape();
    itemText.rect({
      fill: "gray",
      x: 0,
      y: 0,
      width: 370,
      height: 80
    });

    itemText.x = 415;
    itemText.y = 285;

    var itemWindow = Game.ui.itemWindow = new Sprite.Container();
    itemWindow.center.x = 400;
    itemWindow.center.y = 225;

    itemWindow.appendChild(background);
    itemWindow.appendChild(itemGoldBox);
    itemWindow.appendChild(itemText);
    itemUseButton.drawOn(itemWindow);
    itemDropButton.drawOn(itemWindow);
    itemPrevButton.drawOn(itemWindow);
    itemNextButton.drawOn(itemWindow);

    itemBox.forEach(function (element) {
      element.drawOn(itemWindow);
    });

    heroObj.items.forEach(function (element, index) {
      if (element) {
        ItemIconCopy(element.item, itemBox[index], "item", index);
      }
    });

    Game.uiLayer.appendChild(itemWindow);

    Game.ui.initBottomBar();
  };

  // 打开技能栏
  Game.ui.openSkill = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.skillWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 390,
      height: 370
    });

    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var skillWindow = new Sprite.Container();
    skillWindow.center.x = 400;
    skillWindow.center.y = 225;

    skillWindow.appendChild(background);

    Game.uiLayer.appendChild(skillWindow);
    Game.ui.skillWindow = skillWindow;

    // 再次open，即关闭
    Game.ui.openInformation();
  };

  // 在招式窗口打开时，点击一个技能，则弹出技能介绍
  function SpellSelect(type, index) {

    var spellId = "";

    if (type == "book") {
      spellId = Object.keys(Game.hero.spells)[index];
      if (!spellId) return;
    }

    if (type == "bar") {
      spellId = Game.hero.data.spellbar[index];
      if (!spellId) return;
    }

    // 分割，每行最多40个字符宽度
    var text = Game.dialogue.textSplit(Game.hero.spells[spellId].data.description, 330);

    if (Game.ui.spellText) {
      Game.ui.spellWindow.removeChild(Game.ui.spellText);
      Game.ui.spellText = null;
    }

    var spellText = Game.ui.spellText = new Sprite.Text({
      text: text,
      fontSize: 18,
      maxWidth: 360
    });
    spellText.x = 20;
    spellText.y = 290;
    Game.ui.spellWindow.appendChild(spellText);

    Game.update();
  }

  // 在招式栏和招式书之间交换技能快捷方式
  function SpellExchange(lastType, lastIndex, type, index) {

    if (lastType == "book" && type == "bar") {
      var bookSelect = Object.keys(Game.hero.spells)[lastIndex];
      var barSelect = Game.hero.data.spellbar[index];
      if (bookSelect != barSelect) {
        Game.hero.data.spellbar[index] = bookSelect;
        Game.io.updateHero({ spellbar: Game.hero.data.spellbar });
        Game.ui.openSpellbar();
      }
    }

    if (lastType == "bar" && type == "bar") {

      if (lastIndex == index) {
        Game.hero.data.spellbar[index] = undefined;
        Game.ui.initBottomBar();
      } else {
        var barSelect1 = Game.hero.data.spellbar[lastIndex];
        var barSelect2 = Game.hero.data.spellbar[index];
        var t = barSelect1;
        Game.hero.data.spellbar[lastIndex] = barSelect2;
        Game.hero.data.spellbar[index] = t;
        Game.io.updateHero({ spellbar: Game.hero.data.spellbar });
        Game.ui.openSpellbar();
      }
    }
  }

  Game.ui.openSpell = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 390,
      height: 370
    });

    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var spellBook = Game.ui.spellBook = [];
    spellBook.length = heroObj.data.spellcount;

    var spellBookWidth = 6;
    var spellBookHeight = 7;
    var spellCount = 0;

    for (var i = 0; i < spellBookHeight; i++) {
      for (var j = 0; j < spellBookWidth; j++) {
        (function (i, j) {
          if (spellCount >= spellBook.length) return;
          var index = i * spellBookWidth + j;
          spellBook[index] = new BoxClass(50 + j * 60, 50 + i * 60);
          spellCount++;
        })(i, j);
      }
    }

    var spellText = new Sprite.Shape();
    spellText.rect({
      x: 0,
      y: 0,
      width: 370,
      height: 80,
      fill: "gray"
    });
    spellText.x = 15;
    spellText.y = 285;

    var spellWindow = Game.ui.spellWindow = new Sprite.Container();
    spellWindow.center.x = 400;
    spellWindow.center.y = 225;

    spellWindow.appendChild(background);
    spellWindow.appendChild(spellText);

    spellBook.forEach(function (element) {
      element.drawOn(spellWindow);
      spellWindow.appendChild(element.box.clone());
    });

    (function AddHeroSpellIcon() {
      var index = 0;
      for (var key in Game.hero.spells) {
        (function (element, index) {
          SpellIconCopy(element.icon, Game.ui.spellBook[index], "book", index);
        })(Game.hero.spells[key], index);
        index++;
      }
    })();

    Game.uiLayer.appendChild(spellWindow);

    // 再次open信息窗口，即关闭信息窗口
    Game.ui.openInformation();
  };

  Game.ui.openMap = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.mapWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.mapWindow);
      Game.ui.mapWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 790,
      height: 370
    });

    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var mapWindow = new Sprite.Container();
    mapWindow.center.x = 400;
    mapWindow.center.y = 225;

    mapWindow.appendChild(background);

    // 转换玩家位置为小地图位置，修正小地图位置
    var heroX = parseInt(Game.hero.x / Game.area.map.width * Game.area.map.minimap.width);
    var heroY = parseInt(Game.hero.y / Game.area.map.height * Game.area.map.minimap.height);
    Game.area.map.minimap.x = 400;
    Game.area.map.minimap.y = 190;

    var redPoint = new Sprite.Shape();
    redPoint.circle({
      cx: 2,
      cy: 2,
      r: 2,
      fill: "red"
    });
    redPoint.center.x = 2;
    redPoint.center.y = 2;

    mapWindow.appendChild(Game.area.map.minimap);
    mapWindow.appendChild(redPoint);

    Game.ui.redPoint = redPoint;

    Game.uiLayer.appendChild(mapWindow);
    Game.ui.mapWindow = mapWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.openSetting = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.settingWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.settingWindow);
      Game.ui.settingWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 790,
      height: 370
    });

    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var enterTalk = new BoxTextButtonClass("发送聊天", 200, 60, 360, 50);
    enterTalk.on("click", Game.dialogue.talk);

    var talkHistory = new BoxTextButtonClass("历史记录", 600, 60, 360, 50);

    var fullScreen = new BoxTextButtonClass("全屏切换", 200, 120, 360, 50);
    fullScreen.on("click", function () {
      // 下面的部分是兼容不同浏览器的全屏和取消全屏
      if (!document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });

    var settingWindow = new Sprite.Container();
    settingWindow.center.x = 400;
    settingWindow.center.y = 225;

    settingWindow.appendChild(background);
    enterTalk.drawOn(settingWindow);
    talkHistory.drawOn(settingWindow);
    fullScreen.drawOn(settingWindow);

    Game.uiLayer.appendChild(settingWindow);
    Game.ui.settingWindow = settingWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.openArmor = function (refresh) {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow && Game.ui.armorWindow) {
      Game.ui.informationWindow.removeChild(Game.ui.armorWindow);
    }

    var armorWindow = Game.ui.armorWindow = new Sprite.Container();

    // 装备
    var armorBox = Game.ui.armorBox = [];
    var armorBoxWidth = 4;
    var armorBoxHeight = 2;
    armorBox.length = armorBoxWidth * armorBoxHeight;

    var armorImageList = ["/image/head.png", "/image/neck.png", "/image/body.png", "/image/feet.png", "/image/righthand.png", "/image/lefthand.png", "/image/ring.png", "/image/ring.png"];

    for (var i = 0; i < armorBoxHeight; i++) {
      for (var j = 0; j < armorBoxWidth; j++) {
        (function (i, j) {
          var index = i * armorBoxWidth + j;
          armorBox[index] = new BoxBitmapClass(armorImageList[index], 180 + j * 60, 40 + i * 60);
        })(i, j);
      }
    }

    var headIcon = new BoxBitmapClass("/image/head.png", armorBox[0].x, armorBox[0].y);
    var neckIcon = new BoxBitmapClass("/image/neck.png", armorBox[1].x, armorBox[1].y);
    var bodyIcon = new BoxBitmapClass("/image/body.png", armorBox[2].x, armorBox[2].y);
    var feetIcon = new BoxBitmapClass("/image/feet.png", armorBox[3].x, armorBox[3].y);
    var righthandIcon = new BoxBitmapClass("/image/righthand.png", armorBox[4].x, armorBox[4].y);
    var lefthandIcon = new BoxBitmapClass("/image/lefthand.png", armorBox[5].x, armorBox[5].y);
    var leftringIcon = new BoxBitmapClass("/image/ring.png", armorBox[6].x, armorBox[6].y);
    var rightringIcon = new BoxBitmapClass("/image/ring.png", armorBox[7].x, armorBox[7].y);

    armorBox.forEach(function (element) {
      element.drawOn(armorWindow);
    });

    headIcon.drawOn(armorWindow);
    neckIcon.drawOn(armorWindow);
    bodyIcon.drawOn(armorWindow);
    feetIcon.drawOn(armorWindow);
    righthandIcon.drawOn(armorWindow);
    lefthandIcon.drawOn(armorWindow);
    leftringIcon.drawOn(armorWindow);
    rightringIcon.drawOn(armorWindow);

    if (heroObj.equipment.head) ItemIconCopy(heroObj.equipment.head, armorBox[0], "equipment", 0);
    if (heroObj.equipment.neck) ItemIconCopy(heroObj.equipment.neck, armorBox[1], "equipment", 1);
    if (heroObj.equipment.body) ItemIconCopy(heroObj.equipment.body, armorBox[2], "equipment", 2);
    if (heroObj.equipment.feet) ItemIconCopy(heroObj.equipment.feet, armorBox[3], "equipment", 3);
    if (heroObj.equipment.righthand) ItemIconCopy(heroObj.equipment.righthand, armorBox[4], "equipment", 4);
    if (heroObj.equipment.lefthand) ItemIconCopy(heroObj.equipment.lefthand, armorBox[5], "equipment", 5);
    if (heroObj.equipment.leftring) ItemIconCopy(heroObj.equipment.leftring, armorBox[6], "equipment", 6);
    if (heroObj.equipment.rightring) ItemIconCopy(heroObj.equipment.rightring, armorBox[7], "equipment", 7);

    if (Game.ui.informationWindow) Game.ui.informationWindow.appendChild(armorWindow);
  };

  function AttributeSelect(text) {
    if (Game.ui.attributeText) {
      Game.ui.informationWindow.removeChild(Game.ui.attributeText);
      Game.ui.attributeText = null;
    }

    var attributeText = Game.ui.attributeText = new Sprite.Text({
      text: text,
      maxWidth: 360,
      fontSize: 18
    });
    attributeText.x = 20;
    attributeText.y = 290;
    Game.ui.informationWindow.appendChild(Game.ui.attributeText);

    Game.update();
  }

  Game.ui.openAttribute = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var level = new TextClass("LEVEL: " + heroObj.data.level, 15, 15, 130, 25);
    level.on("click", function () {
      AttributeSelect("这是你的人物等级");
    });

    var hitpoint = new TextClass("HP: " + heroObj.data.hp + "/" + heroObj.data._hp, 15, 45, 130, 25);
    hitpoint.on("click", function () {
      AttributeSelect("这是你的生命值，当生命值降到0的时候会死呢");
    });

    var manapoint = new TextClass("SP: " + heroObj.data.sp + "/" + heroObj.data._sp, 15, 75, 130, 25);
    manapoint.on("click", function () {
      AttributeSelect("施展能力需要精神力，精神力代表自己身体与精神的原动力");
    });

    var strength = new TextClass("STR: " + heroObj.data.str, 15, 105, 130, 25);
    strength.on("click", function () {
      AttributeSelect("力量会影响你的普通攻击伤害");
    });

    var dexterity = new TextClass("DEX: " + heroObj.data.dex, 15, 135, 130, 25);
    dexterity.on("click", function () {
      AttributeSelect("敏捷会影响你的防御率");
    });

    var constitution = new TextClass("CON: " + heroObj.data.int, 15, 165, 130, 25);
    constitution.on("click", function () {
      AttributeSelect("体质影响你的生命值");
    });

    var intelligence = new TextClass("INT: " + heroObj.data.con, 15, 195, 130, 25);
    intelligence.on("click", function () {
      AttributeSelect("智力影响你的魔法攻击力与魔法防御力");
    });

    var charisma = new TextClass("CHA: " + heroObj.data.cha, 15, 225, 130, 25);
    charisma.on("click", function () {
      AttributeSelect("魅力影响人物的魅力 = = ");
    });

    var exp = new TextClass("EXP: " + heroObj.data.exp + " / 1000", 15, 255, 270, 25);
    exp.on("click", function () {
      AttributeSelect("经验值嘛");
    });

    var attack = new TextClass("ATK: " + heroObj.data.atk, 155, 135, 130, 25);
    attack.on("click", function () {
      AttributeSelect("普通攻击的攻击力");
    });

    var defense = new TextClass("DEF: " + heroObj.data.def, 155, 165, 130, 25);
    defense.on("click", function () {
      AttributeSelect("对普通攻击的伤害减免能力");
    });

    var magicAttack = new TextClass("MATK: " + heroObj.data.matk, 155, 195, 130, 25);
    magicAttack.on("click", function () {
      AttributeSelect("魔法攻击的攻击力");
    });

    var magicDefense = new TextClass("MDEF: " + heroObj.data.mdef, 155, 225, 130, 25);
    magicDefense.on("click", function () {
      AttributeSelect("防御魔法攻击的能力");
    });

    if (Game.ui.informationWindow && Game.ui.statusWindow) {
      Game.ui.informationWindow.removeChild(Game.ui.statusWindow);
    }

    var statusWindow = Game.ui.statusWindow = new Sprite.Container();

    level.drawOn(statusWindow);
    exp.drawOn(statusWindow);
    hitpoint.drawOn(statusWindow);
    manapoint.drawOn(statusWindow);
    strength.drawOn(statusWindow);
    dexterity.drawOn(statusWindow);
    intelligence.drawOn(statusWindow);
    constitution.drawOn(statusWindow);
    charisma.drawOn(statusWindow);
    attack.drawOn(statusWindow);
    defense.drawOn(statusWindow);
    magicAttack.drawOn(statusWindow);
    magicDefense.drawOn(statusWindow);

    if (Game.ui.informationWindow) {
      Game.ui.informationWindow.appendChild(Game.ui.statusWindow);
      Game.update();
    }
  };

  Game.ui.openInformation = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.informationWindow);
      Game.ui.informationWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.skillWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.spellWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.spellWindow);
      Game.ui.spellWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 390,
      height: 370
    });

    background.x = 5;
    background.y = 5;
    background.alpha = 0.8;

    var attributeText = new Sprite.Shape();
    attributeText.rect({
      x: 0,
      y: 0,
      width: 370,
      height: 80,
      fill: "gray"
    });
    attributeText.x = 15;
    attributeText.y = 285;

    var skillButton = new BoxBitmapButtonClass("/image/skill.png", 360, 190);
    skillButton.on("click", Game.ui.openSkill);

    var spellButton = new BoxBitmapButtonClass("/image/spell.png", 360, 250);
    spellButton.on("click", Game.ui.openSpell);

    var informationWindow = Game.ui.informationWindow = new Sprite.Container();
    informationWindow.center.x = 400;
    informationWindow.center.y = 225;

    informationWindow.appendChild(background);
    informationWindow.appendChild(attributeText);

    skillButton.drawOn(informationWindow);
    spellButton.drawOn(informationWindow);

    Game.uiLayer.appendChild(informationWindow);

    Game.ui.openAttribute();
    Game.ui.openArmor();

    Game.ui.initBottomBar();
  };

  Game.ui.openSpellbar = function () {

    if (Game.ui.spellBarWindow) {
      Game.ui.toolbar.removeChild(Game.ui.spellBarWindow);
      Game.ui.spellBarWindow = null;
    }

    var spellBarWindow = Game.ui.spellBarWindow = new Sprite.Container();

    var spellBar = Game.ui.spellBar = [];
    spellBar.length = 7;

    for (var i = 0; i < spellBar.length; i++) {
      (function (element, index, array) {
        spellBar[index] = new BoxClass(145 + index * 60, 415);
      })(spellBar[i], i, spellBar);
    }

    for (var i = 0; i < spellBar.length; i++) {
      spellBar[i].drawOn(spellBarWindow);
    }

    var spellBarIcon = Game.ui.spellBarIcon = [];

    Game.hero.data.spellbar.forEach(function (element, index) {
      if (!Game.hero.spells[element]) return;

      SpellIconCopy(Game.hero.spells[element].icon, Game.ui.spellBar[index], "bar", index);
    });

    if (Game.ui.toolbar) {
      Game.ui.toolbar.appendChild(spellBarWindow);
      Game.update();
    }
  };

  Game.ui.initBottomBar = function () {

    if (Game.ui.toolbar) {
      Game.uiLayer.removeChild(Game.ui.toolbar);
      Game.ui.toolbar = null;
    }

    var background = new Sprite.Shape();
    background.rect({
      stroke: "black",
      fill: "grey",
      x: 0,
      y: 0,
      width: 790,
      height: 60
    });

    background.x = 5;
    background.y = 385;
    background.alpha = 0.6;

    var barMax = 80;

    var hpbarBox = new Sprite.Shape();
    hpbarBox.rect({
      x: 0,
      y: 0,
      width: barMax,
      height: 20,
      stroke: "black"
    });
    hpbarBox.x = 10;
    hpbarBox.y = 392;

    var hpbar = new Sprite.Shape();
    hpbar.rect({
      x: 0,
      y: 0,
      width: parseInt(Game.hero.data.hp / Game.hero.data._hp * barMax),
      height: 20,
      fill: "green"
    });
    hpbar.x = hpbarBox.x;
    hpbar.y = hpbarBox.y;

    var mpbarBox = new Sprite.Shape();
    hpbarBox.rect({
      x: 0,
      y: 0,
      width: barMax,
      height: 20,
      stroke: "black"
    });
    mpbarBox.x = 10;
    mpbarBox.y = 418;

    var mpbar = new Sprite.Shape();
    mpbar.rect({
      x: 0,
      y: 0,
      width: parseInt(Game.hero.data.sp / Game.hero.data._sp * barMax),
      height: 20,
      fill: "blue"
    });
    mpbar.x = mpbarBox.x;
    mpbar.y = mpbarBox.y;

    // use 按钮

    var useButton = Game.ui.useButton = new BoxClass(770, 30);
    if (!Game.hintFlag) useButton.visible = false;
    useButton.on("click", function () {
      if (Game.hintObject && Game.hintObject.use) Game.hintObject.use();
    });

    // 四个按钮：

    var informationButton = Game.ui.informationButton = new BoxBitmapButtonClass("/image/information.png", 585, 415);
    informationButton.on("click", Game.ui.openInformation);

    var itemButton = Game.ui.itemButton = new BoxBitmapButtonClass("/image/item.png", 645, 415);
    itemButton.on("click", Game.ui.openItem);

    var mapButton = Game.ui.mapButton = new BoxBitmapButtonClass("/image/map.png", 705, 415);
    mapButton.on("click", Game.ui.openMap);

    var settingButton = Game.ui.settingButton = new BoxBitmapButtonClass("/image/setting.png", 765, 415);
    settingButton.on("click", Game.ui.openSetting);

    var toolbar = new Sprite.Container();
    toolbar.center.x = 400;
    toolbar.center.y = 225;

    toolbar.appendChild(background);
    toolbar.appendChild(hpbarBox);
    toolbar.appendChild(mpbarBox);
    toolbar.appendChild(hpbar);
    toolbar.appendChild(mpbar);

    useButton.drawOn(toolbar);
    informationButton.drawOn(toolbar);
    itemButton.drawOn(toolbar);
    mapButton.drawOn(toolbar);
    settingButton.drawOn(toolbar);

    // 让底部栏总在最下面
    Game.uiLayer.appendChildAt(0, toolbar);
    Game.ui.toolbar = toolbar;

    if (Game.ui.settingWindow) {
      // 如果开着，就要关
      Game.ui.settingButton.color = "green";
    }

    if (Game.ui.informationWindow || Game.ui.skillWindow || Game.ui.spellWindow) {
      // 如果开着，就要关
      Game.ui.informationButton.color = "green";
    }

    if (Game.ui.mapWindow) {
      // 如果开着，就要关
      Game.ui.mapButton.color = "green";
    }

    if (Game.ui.itemWindow) {
      // 如果开着，就要关
      Game.ui.itemButton.color = "green";
    }

    if (Game.ui.spellBarWindow) {
      toolbar.appendChild(Game.ui.spellBarWindow);
    } else {
      Game.ui.openSpellbar();
    }

    Game.update();
  }; // Game.ui.InitBottomBar
})();
//# sourceMappingURL=ui.js.map
