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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var BoxClass = (function () {
    function BoxClass(x, y) {
      _classCallCheck(this, BoxClass);

      var box = new createjs.Shape();
      this.box = box;

      box.graphics.beginFill("gray").drawRect(0, 0, 50, 50);
      box.regX = 25;
      box.regY = 25;
      box.x = x;
      box.y = y;
    }

    _createClass(BoxClass, [{
      key: "x",
      get: function () {
        return this.box.x;
      },
      set: function (v) {
        this.box.x = v;
      }
    }, {
      key: "y",
      get: function () {
        return this.box.y;
      },
      set: function (v) {
        this.box.y = v;
      }
    }, {
      key: "color",
      set: function (v) {
        this.box.graphics.clear().beginFill(v).drawRect(0, 0, 50, 50);
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
    }]);

    return BoxClass;
  })();

  var IconClass = (function () {
    function IconClass(url, x, y) {
      _classCallCheck(this, IconClass);

      var icon = new createjs.Bitmap(Game.resources[url]);
      this.icon = icon;

      icon.regX = icon.image.width / 2;
      icon.regY = icon.image.height / 2;
      icon.x = x;
      icon.y = y;
    }

    _createClass(IconClass, [{
      key: "x",
      get: function () {
        return this.icon.x;
      },
      set: function (v) {
        this.icon.x = v;
      }
    }, {
      key: "y",
      get: function () {
        return this.icon.y;
      },
      set: function (v) {
        this.icon.y = v;
      }
    }, {
      key: "on",
      value: function on(event, callback) {
        this.icon.on.apply(this.icon, arguments);
      }
    }, {
      key: "off",
      value: function off() {
        this.icon.off.apply(this.icon, arguments);
      }
    }]);

    return IconClass;
  })();

  var ButtonClass = (function () {
    function ButtonClass(x, y) {
      _classCallCheck(this, ButtonClass);

      var button = new createjs.Shape();
      this.button = button;

      button.graphics.clear().beginFill("gray").drawRect(0, 0, 50, 50);
      button.regX = 25;
      button.regY = 25;
      button.x = x;
      button.y = y;
      button.shadow = new createjs.Shadow("black", 2, 2, 2);
    }

    _createClass(ButtonClass, [{
      key: "x",
      get: function () {
        return this.button.x;
      },
      set: function (v) {
        this.button.x = v;
      }
    }, {
      key: "y",
      get: function () {
        return this.button.y;
      },
      set: function (v) {
        this.button.y = v;
      }
    }, {
      key: "color",
      set: function (v) {
        this.button.graphics.clear().beginFill(v).drawRect(0, 0, 50, 50);
        Game.update();
      }
    }, {
      key: "on",
      value: function on() {
        this.button.on.apply(this.button, arguments);
      }
    }, {
      key: "off",
      value: function off() {
        this.button.off.apply(this.button, arguments);
      }
    }]);

    return ButtonClass;
  })();

  Game.oninit(function () {
    Game.stage.on("drawstart", function () {
      if (Game.uiLayer.numChildren) {
        Game.uiLayer.children.forEach(function (element) {
          element.x = parseInt(Game.hero.sprite.x);
          element.y = parseInt(Game.hero.sprite.y);
        });

        if (Game.ui.redPoint) {
          var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
          var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
          Game.ui.redPoint.x = heroX + 187;
          Game.ui.redPoint.y = heroY + 12;
        }
      }
    });
  });

  Game.ui = {};

  Game.ui.showMessage = function (data) {
    console.log("message", data);
  };

  Game.ui.clickSpell = function (num) {
    if (Game.hero && Game.hero.fire) {
      var cooldown = Game.hero.fire(num);
      if (cooldown > 0) {

        var spellIcon = Game.ui.spellBar[num];
        spellIcon.color = "green";

        cooldown -= 100;

        createjs.Tween.get(spellIcon.box).to({ alpha: 0 }, cooldown).call(function () {
          spellIcon.color = "gray";
          spellIcon.box.alpha = 1;
          Game.update();
        }).on("change", function () {
          Game.update();
        });
      }
    }
  };

  var lastItemSelectIndex = -1;
  var lastItemSelectType = null;

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
    items.length = Game.hero.data.items.length;
    for (var i = 0; i < items.length; i++) {
      if (Game.hero.data.items[i]) items[i] = Game.hero.data.items[i].id;
    }

    var equipment = {};

    for (var key in Game.hero.data.equipment) {
      if (Game.hero.data.equipment[key]) equipment[key] = Game.hero.data.equipment[key].id;else equipment[key] = null;
    }

    Game.io.updateHero({
      items: items,
      equipment: equipment
    });
  }

  function ItemSelect(type, index) {
    var itemObj = null;

    if (type == "equipment") {
      itemObj = Game.hero.data.equipment[indexToEquipment[index]];
      if (!itemObj) return;
    }

    if (type == "item") {
      itemObj = Game.hero.data.items[index];
      if (!itemObj) return;
    }

    // 分割，每行最多22个字符宽度
    var text = Game.dialogue.textSplit(itemObj.data.description, 22);

    if (Game.ui.itemText) {
      Game.ui.itemWindow.removeChild(Game.ui.itemText);
      Game.ui.itemText = null;
    }

    var itemText = new createjs.Text(text);
    itemText.x = 770;
    itemText.y = 40;
    Game.ui.itemWindow.addChild(itemText);
    Game.ui.itemText = itemText;

    lastItemSelectType = type;
    lastItemSelectIndex = index;

    Game.ui.armorBox.forEach(function (element) {
      element.color = "gray";
    });

    Game.ui.itemBox.forEach(function (element) {
      element.color = "gray";
    });

    if (type == "equipment") {
      Game.ui.armorBox[index].color = "green";
    } else if (type == "item") {
      Game.ui.itemBox[index].color = "green";
    }
    Game.update();
  }
  /*
    ItemSelect = function (type, index) {
      if (lastItemSelectType == null) {
  
        var itemObj = null;
  
        if (type == "equipment") {
          itemObj = Game.hero.data.equipment[indexToEquipment[index]];
          if (!itemObj) return;
        }
  
        if (type == "item") {
          itemObj = Game.hero.data.items[index];
          if (!itemObj) return;
        }
  
        // 分割，每行最多22个字符宽度
        var text = Game.dialogue.textSplit(itemObj.data.description, 22);
  
        if (Game.ui.itemText) {
          Game.ui.itemWindow.removeChild(Game.ui.itemText);
          Game.ui.itemText = null;
        }
  
        var itemText = new createjs.Text(text);
        itemText.x = 770;
        itemText.y = 40;
        Game.ui.itemWindow.addChild(itemText);
        Game.ui.itemText = itemText;
  
        lastItemSelectType = type;
        lastItemSelectIndex = index;
  
        if (type == "equipment") {
          Game.ui.armorBox[index].color = "green";
        } else if (type == "item") {
          Game.ui.itemBox[index].color = "green";
        }
        Game.update();
      } else {
  
        if (lastItemSelectType == "equipment" && type == "equipment") {
  
          Game.ui.armorBox[lastItemSelectIndex].color = "gray";
  
          if (lastItemSelectIndex != index) {
            lastItemSelectIndex = -1;
            lastItemSelectType = null;
  
            return ItemSelect(type, index);
          }
        }
  
        if (lastItemSelectType == "item" && type == "item") {
          if (lastItemSelectIndex == index) {
            Game.ui.itemBox[index].color = "gray";
          } else {
            var t = Game.hero.data.items[lastItemSelectIndex];
            Game.hero.data.items[lastItemSelectIndex] = Game.hero.data.items[index];
            Game.hero.data.items[index] = t;
  
            ItemChanged();
  
            Game.uiLayer.removeChild(Game.ui.itemWindow);
            Game.ui.itemWindow = null;
            Game.ui.openItem();
          }
        }
  
        if (lastItemSelectType == "equipment" && type == "item") {
          if (Game.hero.data.items[index]) {
            Game.ui.armorBox[lastItemSelectIndex].color = "gray";
          } else {
            Game.hero.data.items[index] = Game.hero.data.equipment[indexToEquipment[lastItemSelectIndex]];
            Game.hero.data.equipment[indexToEquipment[lastItemSelectIndex]] = null;
  
            ItemChanged();
  
            Game.uiLayer.removeChild(Game.ui.itemWindow);
            Game.ui.itemWindow = null;
            Game.ui.openItem();
          }
        }
  
        if (lastItemSelectType == "item" && type == "equipment") {
          var CheckFit = function (itemIndex, equipmentIndex) {
            var itemType = Game.hero.data.items[itemIndex].data.equip;
            var equipmentType = indexToEquipment[equipmentIndex];
            if (itemType == equipmentType)
              return true;
            if (itemType == "onehand" && (equipmentType == "righthand" || equipmentType == "lefthand"))
              return true;
            if (itemType == "twohand" && equipmentType == "righthand")
              return true;
            return false;
          }
  
          if (CheckFit(lastItemSelectIndex, index)) {
            var t = Game.hero.data.equipment[indexToEquipment[index]];
            Game.hero.data.equipment[indexToEquipment[index]] = Game.hero.data.items[lastItemSelectIndex];
            Game.hero.data.items[lastItemSelectIndex] = t;
  
            ItemChanged();
  
            Game.uiLayer.removeChild(Game.ui.itemWindow);
            Game.ui.itemWindow = null;
            Game.ui.openItem();
          } else {
            Game.ui.itemBox[lastItemSelectIndex].color = "gray";
          }
        }
  
        lastItemSelectIndex = -1;
        lastItemSelectType = null;
      }
    };
  */
  function ItemExchange(lastItemSelectType, lastItemSelectIndex, type, index) {

    if (lastItemSelectType == "equipment" && type == "equipment") {

      Game.ui.armorBox[lastItemSelectIndex].color = "gray";

      if (lastItemSelectIndex != index) {
        lastItemSelectIndex = -1;
        lastItemSelectType = null;

        return ItemSelect(type, index);
      }
    }

    if (lastItemSelectType == "item" && type == "item") {
      if (lastItemSelectIndex == index) {
        Game.ui.itemBox[index].color = "gray";
      } else {
        var t = Game.hero.data.items[lastItemSelectIndex];
        Game.hero.data.items[lastItemSelectIndex] = Game.hero.data.items[index];
        Game.hero.data.items[index] = t;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      }
    }

    if (lastItemSelectType == "equipment" && type == "item") {
      if (Game.hero.data.items[index]) {
        Game.ui.armorBox[lastItemSelectIndex].color = "gray";
      } else {
        Game.hero.data.items[index] = Game.hero.data.equipment[indexToEquipment[lastItemSelectIndex]];
        Game.hero.data.equipment[indexToEquipment[lastItemSelectIndex]] = null;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      }
    }

    if (lastItemSelectType == "item" && type == "equipment") {
      var CheckFit = function CheckFit(itemIndex, equipmentIndex) {
        var itemType = Game.hero.data.items[itemIndex].data.equip;
        var equipmentType = indexToEquipment[equipmentIndex];
        if (itemType == equipmentType) return true;
        if (itemType == "onehand" && (equipmentType == "righthand" || equipmentType == "lefthand")) return true;
        if (itemType == "twohand" && equipmentType == "righthand") return true;
        return false;
      };

      if (CheckFit(lastItemSelectIndex, index)) {
        var t = Game.hero.data.equipment[indexToEquipment[index]];
        Game.hero.data.equipment[indexToEquipment[index]] = Game.hero.data.items[lastItemSelectIndex];
        Game.hero.data.items[lastItemSelectIndex] = t;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      } else {
        Game.ui.itemBox[lastItemSelectIndex].color = "gray";
      }
    }

    lastItemSelectIndex = -1;
    lastItemSelectType = null;
  }

  Game.ui.openItem = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.itemWindow) {
      // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.itemWindow);
      Game.ui.itemWindow = null;
      Game.ui.initBottomBar();
      lastItemSelectIndex = -1;
      lastItemSelectType = null;
      return;
    }

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 475, 450, 5);
    background.x = 480;
    background.y = 5;
    background.alpha = 0.6;

    var armorBox = [];
    var armorBoxWidth = 4;
    var armorBoxHeight = 2;
    armorBox.length = armorBoxWidth * armorBoxHeight;

    for (var i = 0; i < armorBoxHeight; i++) {
      for (var j = 0; j < armorBoxWidth; j++) {
        (function (i, j) {
          var index = i * armorBoxWidth + j;
          var armorIcon = armorBox[index] = new BoxClass(540 + j * 60, 50 + i * 60);

          armorIcon.on("click", function () {
            ItemSelect("equipment", index);
          });
        })(i, j);
      }
    }

    Game.ui.armorBox = armorBox;

    var itemBox = [];
    var itemBoxWidth = 6;
    var itemBoxHeight = 4;
    itemBox.length = itemBoxWidth * itemBoxHeight;

    for (var i = 0; i < itemBoxHeight; i++) {
      for (var j = 0; j < itemBoxWidth; j++) {
        (function (i, j) {
          var index = i * itemBoxWidth + j;
          var itemIcon = itemBox[index] = new BoxClass(540 + j * 60, 170 + i * 60);

          itemIcon.on("click", function () {
            ItemSelect("item", index);
          });
        })(i, j);
      }
    }

    Game.ui.itemBox = itemBox;

    var itemUseButton = new ButtonClass(900, 170);
    var itemDropButton = new ButtonClass(900, 230);
    var itemPrevButton = new ButtonClass(900, 290);
    var itemNextButton = new ButtonClass(900, 350);
    var useIcon = new IconClass("/image/use.png", itemUseButton.x, itemUseButton.y);
    var dropIcon = new IconClass("/image/drop.png", itemDropButton.x, itemDropButton.y);
    var prevIcon = new IconClass("/image/up.png", itemPrevButton.x, itemPrevButton.y);
    var nextIcon = new IconClass("/image/down.png", itemNextButton.x, itemNextButton.y);

    var itemGoldBox = new createjs.Text("10000000G");
    itemGoldBox.color = "gold";
    itemGoldBox.x = 510;
    itemGoldBox.y = 410;

    var itemText = new createjs.Shape();
    itemText.graphics.beginFill("gray").drawRect(0, 0, 170, 110);
    itemText.x = 755;
    itemText.y = 25;

    // 装备栏的8个空

    var headIcon = new IconClass("/image/head.png", armorBox[0].x, armorBox[0].y);
    var neckIcon = new IconClass("/image/neck.png", armorBox[1].x, armorBox[1].y);
    var bodyIcon = new IconClass("/image/body.png", armorBox[2].x, armorBox[2].y);
    var feetIcon = new IconClass("/image/feet.png", armorBox[3].x, armorBox[3].y);
    var righthandIcon = new IconClass("/image/righthand.png", armorBox[4].x, armorBox[4].y);
    var lefthandIcon = new IconClass("/image/lefthand.png", armorBox[5].x, armorBox[5].y);
    var leftringIcon = new IconClass("/image/ring.png", armorBox[6].x, armorBox[6].y);
    var rightringIcon = new IconClass("/image/ring.png", armorBox[7].x, armorBox[7].y);

    var itemWindow = new createjs.Container();
    itemWindow.regX = 480;
    itemWindow.regY = 270;

    itemWindow.addChild(background);
    itemWindow.addChild(itemGoldBox);
    itemWindow.addChild(itemText);

    itemWindow.addChild(itemUseButton.button);
    itemWindow.addChild(itemDropButton.button);
    itemWindow.addChild(itemPrevButton.button);
    itemWindow.addChild(itemNextButton.button);

    itemWindow.addChild(useIcon.icon);
    itemWindow.addChild(dropIcon.icon);
    itemWindow.addChild(prevIcon.icon);
    itemWindow.addChild(nextIcon.icon);

    armorBox.forEach(function (element) {
      itemWindow.addChild(element.box);
    });

    itemBox.forEach(function (element) {
      itemWindow.addChild(element.box);
    });

    itemWindow.addChild(headIcon.icon);
    itemWindow.addChild(neckIcon.icon);
    itemWindow.addChild(bodyIcon.icon);
    itemWindow.addChild(feetIcon.icon);
    itemWindow.addChild(righthandIcon.icon);
    itemWindow.addChild(lefthandIcon.icon);
    itemWindow.addChild(leftringIcon.icon);
    itemWindow.addChild(rightringIcon.icon);

    function CopyIcon(item, icon) {
      var t = item.bitmap.clone();
      t.x = icon.x;
      t.y = icon.y;
      itemWindow.addChild(t);

      var X = icon.x;
      var Y = icon.y;

      icon.on("mousedown", function (event) {
        icon.offset = {
          x: icon.x - event.stageX / Game.stage.scaleX,
          y: icon.y - event.stageY / Game.stage.scaleY
        };
        t.offset = icon.offset;
        Game.update();
      });

      icon.on("pressmove", function (event) {
        icon.x = event.stageX / Game.stage.scaleX + icon.offset.x;
        icon.y = event.stageY / Game.stage.scaleY + icon.offset.y;
        t.x = icon.x;
        t.y = icon.y;
        Game.update();
      });

      icon.on("pressup", function (event) {
        var x = event.stageX / Game.stage.scaleX + icon.offset.x;
        var y = event.stageY / Game.stage.scaleY + icon.offset.y;

        var iconType = null;
        var iconIndex = -1;

        var minDistance = 9999;
        var minType = null;
        var minIndex = -1;

        itemBox.forEach(function (element, index) {
          if (element == icon) {
            iconType = "item";
            iconIndex = index;
            return;
          }
          var d = 0;
          d += Math.pow(element.x - icon.x, 2);
          d += Math.pow(element.y - icon.y, 2);
          d = Math.sqrt(d);
          if (d < minDistance) {
            minDistance = d;
            minType = "item";
            minIndex = index;
          }
        });

        armorBox.forEach(function (element, index) {
          if (element == icon) {
            iconType = "equipment";
            iconIndex = index;
            return;
          }
          var d = 0;
          d += Math.pow(element.x - icon.x, 2);
          d += Math.pow(element.y - icon.y, 2);
          d = Math.sqrt(d);
          if (d < minDistance) {
            minDistance = d;
            minType = "equipment";
            minIndex = index;
          }
        });

        icon.x = X;
        icon.y = Y;
        t.x = icon.x;
        t.y = icon.y;

        if (iconType && minType && minDistance < 20) {
          ItemExchange(iconType, iconIndex, minType, minIndex);
          //console.log(minType, minDistance, minIndex);
        }

        Game.update();
      });
    }

    if (heroObj.data.equipment.head) CopyIcon(heroObj.data.equipment.head, armorBox[0]);
    if (heroObj.data.equipment.neck) CopyIcon(heroObj.data.equipment.neck, armorBox[1]);
    if (heroObj.data.equipment.body) CopyIcon(heroObj.data.equipment.body, armorBox[2]);
    if (heroObj.data.equipment.feet) CopyIcon(heroObj.data.equipment.feet, armorBox[3]);
    if (heroObj.data.equipment.righthand) CopyIcon(heroObj.data.equipment.righthand, armorBox[4]);
    if (heroObj.data.equipment.lefthand) CopyIcon(heroObj.data.equipment.lefthand, armorBox[5]);
    if (heroObj.data.equipment.leftring) CopyIcon(heroObj.data.equipment.leftring, armorBox[6]);
    if (heroObj.data.equipment.rightring) CopyIcon(heroObj.data.equipment.rightring, armorBox[7]);

    heroObj.data.items.forEach(function (element, index) {
      if (element) CopyIcon(element, itemBox[index]);
    });

    Game.uiLayer.addChild(itemWindow);
    Game.ui.itemWindow = itemWindow;

    Game.ui.initBottomBar();
  };

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

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var skillWindow = new createjs.Container();
    skillWindow.regX = 480;
    skillWindow.regY = 270;

    skillWindow.addChild(background);

    Game.uiLayer.addChild(skillWindow);
    Game.ui.skillWindow = skillWindow;

    // 再次open，即关闭
    Game.ui.openInformation();
  };

  var lastSpellSelectIndex = -1;
  var lastSpellSelectType = null;

  Game.ui.spellSelect = function (type, index) {
    if (lastSpellSelectType == null) {

      var spellId = "";

      if (type == "book") {
        spellId = Object.keys(Game.hero.data.spells)[index];
        if (!spellId) return;
      }

      if (type == "bar") {
        spellId = Game.hero.data.spellbar[index];
        if (!spellId) return;
      }

      // 分割，每行最多40个字符宽度
      var text = Game.dialogue.textSplit(Game.hero.data.spells[spellId].data.description, 40);

      if (Game.ui.spellText) {
        Game.ui.spellWindow.removeChild(Game.ui.spellText);
        Game.ui.spellText = null;
      }

      var spellText = new createjs.Text(text);
      spellText.x = 50;
      spellText.y = 340;
      Game.ui.spellWindow.addChild(spellText);
      Game.ui.spellText = spellText;

      lastSpellSelectType = type;
      lastSpellSelectIndex = index;
      if (type == "bar") {
        Game.ui.spellBar[index].color = "green";
      } else if (type == "book") {
        Game.ui.spellBook[index].color = "green";
      }
      Game.update();
    } else {
      if (lastSpellSelectType == "book" && type == "bar") {
        var spellBookSelect = Object.keys(Game.hero.data.spells)[lastSpellSelectIndex];
        var spellBarSelect = Game.hero.data.spellbar[index];
        if (spellBookSelect != spellBarSelect) {
          if (Game.hero.data.spellbar.indexOf(spellBookSelect) == -1) {
            Game.hero.data.spellbar[index] = spellBookSelect;

            Game.ui.spellBook[lastSpellSelectIndex].color = "green";

            Game.io.updateHero({ spellbar: Game.hero.data.spellbar });

            Game.ui.initBottomBar();
          } else {
            Game.ui.spellBook[lastSpellSelectIndex].color = "green";
          }
        } else {
          Game.ui.spellBook[lastSpellSelectIndex].color = "gray";
        }
      }

      if (lastSpellSelectType == "book" && type == "book") {
        Game.ui.spellBook[lastSpellSelectIndex].color = "gray";

        if (lastSpellSelectIndex != index) {
          lastSpellSelectIndex = -1;
          lastSpellSelectType = null;

          return Game.ui.spellSelect(type, index);
        }
      }

      if (lastSpellSelectType == "bar" && type == "bar") {

        if (lastSpellSelectIndex == index) {
          Game.hero.data.spellbar[index] = undefined;
          Game.ui.initBottomBar();
        } else {
          var spellBarSelect1 = Game.hero.data.spellbar[lastSpellSelectIndex];
          var spellBarSelect2 = Game.hero.data.spellbar[index];
          var t = spellBarSelect1;
          Game.hero.data.spellbar[lastSpellSelectIndex] = spellBarSelect2;
          Game.hero.data.spellbar[index] = t;

          Game.io.updateHero({ spellbar: Game.hero.data.spellbar });
          Game.ui.initBottomBar();
        }
      }

      lastSpellSelectIndex = -1;
      lastSpellSelectType = null;
    }
  };

  Game.ui.openSpell = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var spellBook = [];
    spellBook.length = heroObj.data.spellcount;

    var spellBookWidth = 7;
    var spellBookHeight = 7;
    var spellCount = 0;

    for (var i = 0; i < spellBookHeight; i++) {
      for (var j = 0; j < spellBookWidth; j++) {
        (function (i, j) {
          if (spellCount >= spellBook.length) return;
          var index = i * spellBookWidth + j;
          spellBook[index] = new BoxClass(60 + j * 60, 50 + i * 60);

          spellBook[index].on("click", function () {
            Game.ui.spellSelect("book", index);
          });
          spellCount++;
        })(i, j);
      }
    }

    Game.ui.spellBook = spellBook;

    var releaseButton = new ButtonClass(420, 350);
    var releaseIcon = new IconClass("/image/release.png", releaseButton.x, releaseButton.y);

    var spellText = new createjs.Shape();
    spellText.graphics.beginFill("gray").drawRect(0, 0, 350, 110);
    spellText.x = 35;
    spellText.y = 325;

    var spellWindow = new createjs.Container();
    spellWindow.regX = 480;
    spellWindow.regY = 270;

    spellWindow.addChild(background);
    spellWindow.addChild(releaseButton.button);
    spellWindow.addChild(releaseIcon.icon);
    spellWindow.addChild(spellText);

    spellBook.forEach(function (element) {
      spellWindow.addChild(element.box);
    });

    (function AddHeroSpellIcon() {
      var index = 0;
      for (var key in Game.hero.data.spells) {
        (function (element) {
          var t = element.icon.clone();
          t.x = Game.ui.spellBook[index].x;
          t.y = Game.ui.spellBook[index].y;
          spellWindow.addChild(t);
          index++;
        })(Game.hero.data.spells[key]);
      }
    })();

    Game.uiLayer.addChild(spellWindow);
    Game.ui.spellWindow = spellWindow;

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

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 950, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var mapWindow = new createjs.Container();
    mapWindow.regX = 480;
    mapWindow.regY = 270;

    mapWindow.addChild(background);

    // 转换玩家位置为小地图位置，修正小地图位置
    var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
    var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
    Game.area.map.minimap.x = 480;
    Game.area.map.minimap.y = 230;

    var redPoint = new createjs.Shape();
    redPoint.graphics.beginFill("red").drawRoundRect(0, 0, 4, 4, 3);
    redPoint.regX = 2;
    redPoint.regY = 2;
    redPoint.x = heroX + 185;
    redPoint.y = heroY + 30;

    mapWindow.addChild(Game.area.map.minimap);
    mapWindow.addChild(redPoint);

    Game.ui.redPoint = redPoint;

    Game.uiLayer.addChild(mapWindow);
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

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 950, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var settingWindow = new createjs.Container();
    settingWindow.regX = 480;
    settingWindow.regY = 270;

    settingWindow.addChild(background);

    Game.uiLayer.addChild(settingWindow);
    Game.ui.settingWindow = settingWindow;

    Game.ui.initBottomBar();
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

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var hitpoint = new createjs.Text("生命: " + heroObj.data.hitpoint);
    hitpoint.x = 40;
    hitpoint.y = 40;
    var manapoint = new createjs.Text("精神力: " + heroObj.data.manapoint);
    manapoint.x = 40;
    manapoint.y = 60;

    var strength = new createjs.Text("力量: " + heroObj.data.strength);
    strength.x = 40;
    strength.y = 80;
    var dexterity = new createjs.Text("敏捷: " + heroObj.data.dexterity);
    dexterity.x = 40;
    dexterity.y = 100;
    var intelligence = new createjs.Text("体质: " + heroObj.data.intelligence);
    intelligence.x = 40;
    intelligence.y = 120;
    var constitution = new createjs.Text("智力: " + heroObj.data.constitution);
    constitution.x = 40;
    constitution.y = 140;

    var attack = new createjs.Text("攻击力: " + heroObj.data.attack);
    attack.x = 40;
    attack.y = 160;
    var defense = new createjs.Text("防御力: " + heroObj.data.defense);
    defense.x = 40;
    defense.y = 180;
    var magicAttack = new createjs.Text("魔法攻击: " + heroObj.data.magicAttack);
    magicAttack.x = 40;
    magicAttack.y = 200;
    var magicDefense = new createjs.Text("魔法防御: " + heroObj.data.magicDefense);
    magicDefense.x = 40;
    magicDefense.y = 220;

    var skillButton = new ButtonClass(60, 400);
    var skillIcon = new IconClass("/image/skill.png", skillButton.x, skillButton.y);
    skillButton.on("click", Game.ui.openSkill);

    var spellButton = new ButtonClass(120, 400);
    var spellIcon = new IconClass("/image/spell.png", spellButton.x, spellButton.y);
    spellButton.on("click", Game.ui.openSpell);

    var informationWindow = new createjs.Container();
    informationWindow.regX = 480;
    informationWindow.regY = 270;

    informationWindow.addChild(background);

    informationWindow.addChild(hitpoint);
    informationWindow.addChild(manapoint);
    informationWindow.addChild(strength);
    informationWindow.addChild(dexterity);
    informationWindow.addChild(intelligence);
    informationWindow.addChild(constitution);
    informationWindow.addChild(attack);
    informationWindow.addChild(defense);
    informationWindow.addChild(magicAttack);
    informationWindow.addChild(magicDefense);

    informationWindow.addChild(skillButton.button);
    informationWindow.addChild(spellButton.button);
    informationWindow.addChild(skillIcon.icon);
    informationWindow.addChild(spellIcon.icon);

    Game.uiLayer.addChild(informationWindow);

    Game.ui.informationWindow = informationWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.initBottomBar = function () {

    if (Game.ui.toolbar) {
      Game.uiLayer.removeChild(Game.ui.toolbar);
      Game.ui.toolbar = null;
    }

    var background = new createjs.Shape();
    background.graphics.beginStroke("black").beginFill("grey").drawRoundRect(0, 0, 950, 70, 5);
    background.x = 5;
    background.y = 465;
    background.alpha = 0.6;

    var hpbarBox = new createjs.Shape();
    hpbarBox.graphics.beginStroke("black").drawRoundRect(0, 0, 110, 20, 3);
    hpbarBox.x = 15;
    hpbarBox.y = 475;

    var hpbar = new createjs.Shape();
    hpbar.graphics.beginFill("green").drawRoundRect(0, 0, 100, 20, 3);
    hpbar.x = 15;
    hpbar.y = 475;

    var mpbarBox = new createjs.Shape();
    mpbarBox.graphics.beginStroke("black").drawRoundRect(0, 0, 110, 20, 3);
    mpbarBox.x = 15;
    mpbarBox.y = 505;

    var mpbar = new createjs.Shape();
    mpbar.graphics.beginFill("blue").drawRoundRect(0, 0, 80, 20, 3);
    mpbar.x = 15;
    mpbar.y = 505;

    var spellBar = [];
    spellBar.length = 9;

    for (var i = 0; i < spellBar.length; i++) {
      (function (element, index, array) {
        var spellIcon = spellBar[index] = new BoxClass(180 + index * 60, 500);

        spellIcon.on("click", function () {
          if (Game.ui.spellWindow) {
            Game.ui.spellSelect("bar", index);
          } else {
            Game.ui.clickSpell(index);
          }
        });
      })(spellBar[i], i, spellBar);
    }

    Game.ui.spellBar = spellBar;

    // 四个按钮：

    var informationButton = new ButtonClass(740, 500);
    var informationIcon = new IconClass("/image/information.png", informationButton.x, informationButton.y);
    informationButton.on("click", Game.ui.openInformation);
    Game.ui.informationButton = informationButton;

    var itemButton = new ButtonClass(800, 500);
    var itemIcon = new IconClass("/image/item.png", itemButton.x, itemButton.y);
    itemButton.on("click", Game.ui.openItem);
    Game.ui.itemButton = itemButton;

    var mapButton = new ButtonClass(860, 500);
    var mapIcon = new IconClass("/image/map.png", mapButton.x, mapButton.y);
    mapButton.on("click", Game.ui.openMap);
    Game.ui.mapButton = mapButton;

    var settingButton = new ButtonClass(920, 500);
    var settingIcon = new IconClass("/image/setting.png", settingButton.x, settingButton.y);
    settingButton.on("click", Game.ui.openSetting);
    Game.ui.settingButton = settingButton;

    var toolbar = new createjs.Container();
    toolbar.regX = 480;
    toolbar.regY = 270;

    toolbar.addChild(background);
    toolbar.addChild(hpbarBox);
    toolbar.addChild(mpbarBox);
    toolbar.addChild(hpbar);
    toolbar.addChild(mpbar);

    toolbar.addChild(informationButton.button);
    toolbar.addChild(itemButton.button);
    toolbar.addChild(mapButton.button);
    toolbar.addChild(settingButton.button);

    toolbar.addChild(informationIcon.icon);
    toolbar.addChild(itemIcon.icon);
    toolbar.addChild(mapIcon.icon);
    toolbar.addChild(settingIcon.icon);

    for (var i = 0; i < spellBar.length; i++) {
      toolbar.addChild(spellBar[i].box);
    }

    Game.uiLayer.addChild(toolbar);
    Game.ui.toolbar = toolbar;

    (function AddHeroSpellBarIcon() {
      Game.hero.data.spellbar.forEach(function (element, index) {
        if (!Game.hero.data.spells[element]) return;
        var t = Game.hero.data.spells[element].icon.clone();
        t.x = Game.ui.spellBar[index].x;
        t.y = Game.ui.spellBar[index].y;
        Game.ui.toolbar.addChild(t);
      });
    })();

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

    Game.update();
  }; // Game.ui.InitBottomBar

  Game.oninit(function () {

    window.addEventListener("keydown", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;
    });
  });
})();
//# sourceMappingURL=ui.js.map