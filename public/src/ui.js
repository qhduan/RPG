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

  class BoxClass {
    constructor (x, y, width, height) {
      var box = new createjs.Shape();
      this.box = box;
      this.defaultColor = "gray";

      if (typeof width == "undefined")
        width = 50;
      if (typeof height == "undefined")
        height = 50;

      this.width = width;
      this.height = height;

      box.graphics
      .beginFill(this.defaultColor)
      .drawRect(0, 0, width, height);
      box.regX = Math.floor(width / 2);
      box.regY = Math.floor(height / 2);
      box.x = x;
      box.y = y;
    }

    drawOn (container) {
      container.addChild(this.box);
      Game.update();
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.box.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.box.y = v;
      Game.update();
    }

    get color () {
      return this.defaultColor;
    }

    set color (v) {
      this.defaultColor = v;
      this.box.graphics
      .clear()
      .beginFill(v)
      .drawRect(0, 0, 50, 50);
      Game.update();
    }

    distance (x, y) {
      var d = 0;
      d += Math.pow(this.box.x - x, 2);
      d += Math.pow(this.box.y - y, 2);
      return Math.sqrt(d);
    }

    on () {
      this.box.on.apply(this.box, arguments);
    }

    off () {
      this.box.off.apply(this.box, arguments);
    }
  }

  class TextClass {
    constructor (text, font, x, y, width, height) {
      this.text = text;
      this.textObj = new createjs.Text(Game.dialogue.textSplit(text, width), font);
      this.textObj.x = x;
      this.textObj.y = y;

      this.box = new createjs.Shape();
      this.box.graphics
      .beginFill("gray")
      .drawRect(0, 0, width, height);
      this.box.x = x;
      this.box.y = y;
      this.box.alpha = 0.01
    }

    drawOn (container) {
      container.addChild(this.box);
      container.addChild(this.textObj);
      Game.update();
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.box.x = v;
      this.textObj.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.box.y = v;
      this.textObj.y = v;
      Game.update();
    }

    on () {
      this.box.on.apply(this.box, arguments);
    }

    off () {
      this.box.off.apply(this.box, arguments);
    }
  }

  class BoxBitmapClass extends BoxClass {
    constructor (bitmap, x, y) {
      super(x, y);

      if (bitmap instanceof createjs.Bitmap) {
        this.bitmap = bitmap.clone();
      } else if (bitmap instanceof Image) {
        this.bitmap = new createjs.Bitmap(bitmap);
        this.bitmap.regX = Math.floor(this.bitmap.image.width/2);
        this.bitmap.regY = Math.floor(this.bitmap.image.height/2);
      } else if (typeof bitmap == "string" && Game.resources.hasOwnProperty(bitmap)) {
        this.bitmap = new createjs.Bitmap(Game.resources[bitmap]);
        this.bitmap.regX = Math.floor(this.bitmap.image.width/2);
        this.bitmap.regY = Math.floor(this.bitmap.image.height/2);
      } else {
        throw new TypeError("BoxBitmapClass Invalid Arguments");
      }

      this.bitmap.x = x;
      this.bitmap.y = y;
    }

    drawOn (container) {
      container.addChild(this.box);
      container.addChild(this.bitmap);
      Game.update();
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.box.x = v;
      this.bitmap.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.box.y = v;
      this.bitmap.y = v;
      Game.update();
    }
  }

  class BoxBitmapButtonClass extends BoxBitmapClass {
    constructor (bitmap, x, y) {
      super(bitmap, x, y);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
    }
  }

  class BoxButtonClass extends BoxClass {
    constructor (x, y) {
      super(x, y);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
    }
  }

  class BoxTextButtonClass extends BoxClass {
    constructor (text, x, y, width, height) {
      super(x, y, width, height);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
      var text = new createjs.Text(text, "25px Arial", "white");
      text.regX = Math.floor(text.getMeasuredWidth() / 2);
      text.regY = Math.floor(text.getMeasuredHeight() / 2);
      text.x = x;
      text.y = y;
      this.text = text;
    }

    drawOn (container) {
      container.addChild(this.box);
      container.addChild(this.text);
      Game.update;
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.text.x = v;
      this.box.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.text.y = v;
      this.box.y = v;
      Game.update();
    }
  }

  // 调整窗口跟随玩家
  Game.oninit(function () {
    Game.stage.on("drawstart", function () {
      if (Game.uiLayer.numChildren) {
        Game.uiLayer.children.forEach(function (element) {
          element.x = parseInt(Game.hero.x);
          element.y = parseInt(Game.hero.y);
        });

        if (Game.ui.redPoint) {
          var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
          var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
          Game.ui.redPoint.x = heroX + 160;
          Game.ui.redPoint.y = heroY + 12;
        }

      }
    });
  });


  Game.ui = {};

  Game.ui.clickSpell = function (num) {
    if (Game.hero && Game.hero.fire) {
      var cooldown = Game.hero.fire(num);
      if (cooldown > 0) {

        var spellIcon = Game.ui.spellIcon[num];
        spellIcon.color = "green";

        cooldown -= 100;

        createjs.Tween.get(spellIcon.box).to({alpha: 0}, cooldown).call(function () {
          spellIcon.color = "gray";
          spellIcon.box.alpha = 1;
          Game.update();
        }).on("change", function () {
          Game.update();
        });

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
  }

  function ItemChanged () {
    var items = [];
    items.length = Game.hero.items.length;
    for (var i = 0; i < items.length; i++) {
      if (Game.hero.items[i])
        items[i] = {
          id: Game.hero.items[i].id,
          count: Game.hero.items[i].count
        };
    }

    var equipment = {};

    for (var key in Game.hero.equipment) {
      if (Game.hero.equipment[key])
        equipment[key] = Game.hero.equipment[key].id;
      else
        equipment[key] = null;
    }

    Game.io.updateHero({
      items: items,
      equipment: equipment
    });
  }

  // 物品选择，弹出物品信息
  function ItemSelect (type, index) {
    var itemObj = null;

    if (type == "equipment") {
      itemObj = Game.hero.equipment[indexToEquipment[index]];
      if (!itemObj) return;
    }

    if (type == "item") {
      itemObj = Game.hero.items[index].item;
      if (!itemObj) return;
    }

    var font = "18px Ariel";
    // 分割，每行最多22个字符宽度
    var text = Game.dialogue.textSplit(itemObj.data.description, 360, font);

    var buffnerf = [];
    if (itemObj.data.buff) {
      for (let key in itemObj.data.buff) {
        var sign = "+";
        if (itemObj.data.buff[key] < 0) sign = "-";
        buffnerf.push(key + ": " + sign + itemObj.data.buff[key] + ";");
      }
    }
    if (itemObj.data.nerf) {
      for (let key in itemObj.data.nerf) {
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


    var itemText = Game.ui.itemText = new createjs.Text(text, font);
    itemText.x = 420;
    itemText.y = 290;
    Game.ui.itemWindow.addChild(itemText);

    Game.update();
  }

  // 物品改变，装备，卸下装备，物品调整顺序等
  function ItemExchange (lastType, lastIndex, type, index) {

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
        if (!Game.hero.items[index])
          Game.hero.items[index] = {};
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
      var CheckFit = function (itemIndex, equipmentIndex) {
        var itemType = Game.hero.items[itemIndex].item.data.equip;
        var equipmentType = indexToEquipment[equipmentIndex];
        if (itemType == equipmentType)
          return true;
        if (itemType == "onehand" && (equipmentType == "righthand" || equipmentType == "lefthand"))
          return true;
        if (itemType == "twohand" && equipmentType == "righthand")
          return true;
        return false;
      }

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

  function ItemIconCopy (item, box, type, index) {
    var t = new BoxBitmapClass(item.bitmap, box.x, box.y);

    if (type == "item")
      t.drawOn(Game.ui.itemWindow);
    else if (type == "equipment")
      t.drawOn(Game.ui.armorWindow);
    else
      throw new TypeError("invalid");

    var X = t.x;
    var Y = t.y;

    t.on("click", function () {
      ItemSelect(type, index);
    });

    var offset = {};

    t.on("mousedown", function (event) {
      offset.x = t.x - event.stageX / Game.stage.scaleX;
      offset.y = t.y - event.stageY / Game.stage.scaleY;
    });

    t.on("pressmove", function (event) {
      t.x = event.stageX / Game.stage.scaleX + offset.x;
      t.y = event.stageY / Game.stage.scaleY + offset.y;
    });

    t.on("pressup", function (event) {
      var x = event.stageX / Game.stage.scaleX + offset.x;
      var y = event.stageY / Game.stage.scaleY + offset.y;

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

  // 打开物品栏（玩家口袋）
  Game.ui.openItem = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.itemWindow);
      Game.ui.itemWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 390, 370, 5);
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

    var itemGoldBox = new createjs.Text("资金：10000000G", "24px Ariel");
    itemGoldBox.color = "gold";
    itemGoldBox.x = 415;
    itemGoldBox.y = 250;

    var itemText = new createjs.Shape();
    itemText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 370, 80);
    itemText.x = 415;
    itemText.y = 285;

    var itemWindow = Game.ui.itemWindow = new createjs.Container();
    itemWindow.regX = 400;
    itemWindow.regY = 225;

    itemWindow.addChild(background);
    itemWindow.addChild(itemGoldBox);
    itemWindow.addChild(itemText);

    itemUseButton.drawOn(itemWindow);
    itemDropButton.drawOn(itemWindow);
    itemPrevButton.drawOn(itemWindow);
    itemNextButton.drawOn(itemWindow);

    itemBox.forEach(function (element) {
      element.drawOn(itemWindow);
      itemWindow.addChild(element.box.clone());
    });

    heroObj.items.forEach(function (element, index) {
      if (element) {
        ItemIconCopy(element.item, itemBox[index], "item", index);
      }
    });

    Game.uiLayer.addChild(itemWindow);

    Game.ui.initBottomBar();
  };

  // 打开技能栏
  Game.ui.openSkill = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.skillWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 390, 370, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var skillWindow = new createjs.Container();
    skillWindow.regX = 400;
    skillWindow.regY = 225;

    skillWindow.addChild(background);

    Game.uiLayer.addChild(skillWindow);
    Game.ui.skillWindow = skillWindow;

    // 再次open，即关闭
    Game.ui.openInformation();
  };

  // 在招式窗口打开时，点击一个技能，则弹出技能介绍
  function SpellSelect (type, index) {
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


    var font = "18px Ariel";
    var formatedText = Game.dialogue.textSplit(text, 360, font);

    var spellText = Game.ui.spellText = new createjs.Text(formatedText, font);
    spellText.x = 20;
    spellText.y = 290;
    Game.ui.spellWindow.addChild(spellText);

    Game.update();
  }

  // 在招式栏和招式书之间交换技能快捷方式
  function SpellExchange (lastType, lastIndex, type, index) {
    if (lastType == "book" && type == "bar") {
      var spellBookSelect = Object.keys(Game.hero.spells)[lastIndex];
      var spellBarSelect = Game.hero.data.spellbar[index];
      if (spellBookSelect != spellBarSelect) {
        Game.hero.data.spellbar[index] = spellBookSelect;
        Game.io.updateHero({spellbar: Game.hero.data.spellbar});
        Game.ui.initBottomBar();
      }
    }

    if (lastType == "bar" && type == "bar") {

      if (lastIndex == index) {
        Game.hero.data.spellbar[index] = undefined;
        Game.ui.initBottomBar();
      } else {
        var spellBarSelect1 = Game.hero.data.spellbar[lastIndex];
        var spellBarSelect2 = Game.hero.data.spellbar[index];
        var t = spellBarSelect1;
        Game.hero.data.spellbar[lastIndex] = spellBarSelect2;
        Game.hero.data.spellbar[index] = t;
        Game.io.updateHero({spellbar: Game.hero.data.spellbar});
        Game.ui.initBottomBar();
      }

    }
  }

  Game.ui.openSpell = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 390, 370, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;


    var spellBook = [];
    spellBook.length = heroObj.data.spellcount;

    var spellBookWidth = 6;
    var spellBookHeight = 7;
    var spellCount = 0;

    for (var i = 0; i < spellBookHeight; i++) {
      for (var j = 0; j < spellBookWidth; j++) {
        (function (i, j) {
          if (spellCount >= spellBook.length)
            return;
          var index = i * spellBookWidth + j;
          spellBook[index] = new BoxClass(50 + j * 60, 50 + i * 60);
          spellCount++;
        })(i, j);
      }
    }

    Game.ui.spellBook = spellBook;

    var releaseButton = new BoxButtonClass(420, 350);
    var releaseIcon = new BoxBitmapClass("/image/release.png", releaseButton.x, releaseButton.y);

    var spellText = new createjs.Shape();
    spellText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 370, 80);
    spellText.x = 15;
    spellText.y = 285;

    var spellWindow = new createjs.Container();
    spellWindow.regX = 400;
    spellWindow.regY = 225;

    spellWindow.addChild(background);

    releaseButton.drawOn(spellWindow);
    releaseIcon.drawOn(spellWindow);
    spellWindow.addChild(spellText);

    spellBook.forEach(function (element) {
      spellWindow.addChild(element.box);
      spellWindow.addChild(element.box.clone());
    });

    (function AddHeroSpellIcon () {
      var index = 0;
      for (var key in Game.hero.spells) {
        (function (element, index) {

          var box = Game.ui.spellBook[index];
          var t = new BoxBitmapClass(element.icon, box.x, box.y);
          t.drawOn(spellWindow);

          var X = t.x;
          var Y = t.y;

          t.on("click", function () {
            SpellSelect("book", index);
          });

          t.on("mousedown", function (event) {
            t.offset = {
              x: t.x - event.stageX / Game.stage.scaleX,
              y: t.y - event.stageY / Game.stage.scaleY
            };
          });

          t.on("pressmove", function (event) {
            t.x = event.stageX / Game.stage.scaleX + t.offset.x;
            t.y = event.stageY / Game.stage.scaleY + t.offset.y;
          });

          t.on("pressup", function (event) {
            var x = event.stageX / Game.stage.scaleX + t.offset.x;
            var y = event.stageY / Game.stage.scaleY + t.offset.y;

            var lastType = null;
            var lastIndex = -1;

            var minDistance = 9999;
            var minType = null;
            var minIndex = -1;

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

            if (lastType && minType && minDistance < 30) {
              SpellExchange(lastType, lastIndex, minType, minIndex);
            }

            t.x = X;
            t.y = Y;
          });

        })(Game.hero.spells[key], index);
        index++;
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

    if (Game.ui.mapWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.mapWindow);
      Game.ui.mapWindow = null;
      Game.ui.initBottomBar();
      return;
    }

     var background = new createjs.Shape();
     background.graphics
     .beginStroke("black")
     .beginFill("grey")
     .drawRoundRect(0, 0, 790, 370, 5);
     background.x = 5;
     background.y = 5;
     background.alpha = 0.6;

     var mapWindow = new createjs.Container();
     mapWindow.regX = 400;
     mapWindow.regY = 225;

     mapWindow.addChild(background);

     // 转换玩家位置为小地图位置，修正小地图位置
     var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
     var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
     Game.area.map.minimap.x = 400;
     Game.area.map.minimap.y = 190;

     var redPoint = new createjs.Shape();
     redPoint.graphics
     .beginFill("red")
     .drawRoundRect(0, 0, 4, 4, 3);
     redPoint.regX = 2;
     redPoint.regY = 2;

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

    if (Game.ui.settingWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.settingWindow);
      Game.ui.settingWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 790, 370, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var enterTalk = new BoxTextButtonClass("聊天", 240, 60, 400, 50);
    enterTalk.on("click", Game.dialogue.talk);

    var settingWindow = new createjs.Container();
    settingWindow.regX = 400;
    settingWindow.regY = 225;

    settingWindow.addChild(background);
    enterTalk.drawOn(settingWindow);

    Game.uiLayer.addChild(settingWindow);
    Game.ui.settingWindow = settingWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.openArmor = function (refresh) {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow && Game.ui.armorWindow) {
      Game.ui.informationWindow.removeChild(Game.ui.armorWindow);
    }

    var armorWindow = Game.ui.armorWindow = new createjs.Container();

    // 装备
    var armorBox = Game.ui.armorBox =  [];
    var armorBoxWidth = 4;
    var armorBoxHeight = 2;
    armorBox.length = armorBoxWidth * armorBoxHeight;

    var armorImageList = [
      "/image/head.png",
      "/image/neck.png",
      "/image/body.png",
      "/image/feet.png",
      "/image/righthand.png",
      "/image/lefthand.png",
      "/image/ring.png",
      "/image/ring.png"
    ];

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
      armorWindow.addChild(element.box.clone());
    });

    headIcon.drawOn(armorWindow);
    neckIcon.drawOn(armorWindow);
    bodyIcon.drawOn(armorWindow);
    feetIcon.drawOn(armorWindow);
    righthandIcon.drawOn(armorWindow);
    lefthandIcon.drawOn(armorWindow);
    leftringIcon.drawOn(armorWindow);
    rightringIcon.drawOn(armorWindow);

    if (heroObj.equipment.head)
      ItemIconCopy(heroObj.equipment.head, armorBox[0], "equipment", 0);
    if (heroObj.equipment.neck)
      ItemIconCopy(heroObj.equipment.neck, armorBox[1], "equipment", 1);
    if (heroObj.equipment.body)
      ItemIconCopy(heroObj.equipment.body, armorBox[2], "equipment", 2);
    if (heroObj.equipment.feet)
      ItemIconCopy(heroObj.equipment.feet, armorBox[3], "equipment", 3);
    if (heroObj.equipment.righthand)
      ItemIconCopy(heroObj.equipment.righthand, armorBox[4], "equipment", 4);
    if (heroObj.equipment.lefthand)
      ItemIconCopy(heroObj.equipment.lefthand, armorBox[5], "equipment", 5);
    if (heroObj.equipment.leftring)
      ItemIconCopy(heroObj.equipment.leftring, armorBox[6], "equipment", 6);
    if (heroObj.equipment.rightring)
      ItemIconCopy(heroObj.equipment.rightring, armorBox[7], "equipment", 7);

    if (Game.ui.informationWindow)
      Game.ui.informationWindow.addChild(armorWindow);
  };

  function AttributeSelect (text) {
    if (Game.ui.attributeText) {
      Game.ui.informationWindow.removeChild(Game.ui.attributeText);
      Game.ui.attributeText = null;
    }

    var font = "18px Ariel";
    var formatedText = Game.dialogue.textSplit(text, 360, font);

    var attributeText = Game.ui.attributeText = new createjs.Text(formatedText, font);
    attributeText.x = 20;
    attributeText.y = 290;
    Game.ui.informationWindow.addChild(Game.ui.attributeText);

    Game.update();
  }

  Game.ui.openAttribute = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var font = "20px Ariel";

    var level = new TextClass("LEVEL: " + heroObj.data.level, font, 15, 15, 130, 25);
    level.on("click", function () {
      AttributeSelect("这是你的人物等级");
    });

    var hitpoint = new TextClass("HP: " + heroObj.data.hp + "/" + heroObj.data._hp, font, 15, 45, 130, 25);
    hitpoint.on("click", function () {
      AttributeSelect("这是你的生命值，当生命值降到0的时候会死呢");
    });

    var manapoint = new TextClass("SP: " + heroObj.data.sp + "/" + heroObj.data._sp, font, 15, 75, 130, 25);
    manapoint.on("click", function () {
      AttributeSelect("施展能力需要精神力，精神力代表自己身体与精神的原动力");
    });

    var strength = new TextClass("STR: " + heroObj.data.str, font, 15, 105, 130, 25);
    strength.on("click", function () {
      AttributeSelect("力量会影响你的普通攻击伤害");
    });

    var dexterity = new TextClass("DEX: " + heroObj.data.dex, font, 15, 135, 130, 25);
    dexterity.on("click", function () {
      AttributeSelect("敏捷会影响你的防御率");
    });

    var constitution = new TextClass("CON: " + heroObj.data.int, font, 15, 165, 130, 25);
    constitution.on("click", function () {
      AttributeSelect("体质影响你的生命值");
    });

    var intelligence = new TextClass("INT: " + heroObj.data.con, font, 15, 195, 130, 25);
    intelligence.on("click", function () {
      AttributeSelect("智力影响你的魔法攻击力与魔法防御力");
    });

    var charisma = new TextClass("CHA: " + heroObj.data.cha, font, 15, 225, 130, 25);
    charisma.on("click", function () {
      AttributeSelect("魅力影响人物的魅力 = = ");
    });

    var exp = new TextClass("EXP: " + heroObj.data.exp + " / 1000", font, 15, 255, 270, 25);
    exp.on("click", function () {
      AttributeSelect("经验值嘛");
    });

    var attack = new TextClass("ATK: " + heroObj.data.atk, font, 155, 135, 130, 25);
    attack.on("click", function () {
      AttributeSelect("普通攻击的攻击力");
    });

    var defense = new TextClass("DEF: " + heroObj.data.def, font, 155, 165, 130, 25);
    defense.on("click", function () {
      AttributeSelect("对普通攻击的伤害减免能力");
    });

    var magicAttack = new TextClass("MATK: " + heroObj.data.matk, font, 155, 195, 130, 25);
    magicAttack.on("click", function () {
      AttributeSelect("魔法攻击的攻击力");
    });

    var magicDefense = new TextClass("MDEF: " + heroObj.data.mdef, font, 155, 225, 130, 25);
    magicDefense.on("click", function () {
      AttributeSelect("防御魔法攻击的能力");
    });

    if (Game.ui.informationWindow && Game.ui.statusWindow) {
      Game.ui.informationWindow.removeChild(Game.ui.statusWindow);
    }

    var statusWindow = Game.ui.statusWindow = new createjs.Container();

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
      Game.ui.informationWindow.addChild(Game.ui.statusWindow);
      Game.update();
    }
  }

  Game.ui.openInformation = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.informationWindow);
      Game.ui.informationWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.skillWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.spellWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.spellWindow);
      Game.ui.spellWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 390, 370, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.8;

    var attributeText = new createjs.Shape();
    attributeText.graphics
    .beginFill("grey")
    .drawRoundRect(0, 0, 370, 80, 5);
    attributeText.x = 15;
    attributeText.y = 285;

    var skillButton = new BoxBitmapButtonClass("/image/skill.png", 360, 190);
    skillButton.on("click", Game.ui.openSkill);

    var spellButton = new BoxBitmapButtonClass("/image/spell.png", 360, 250);
    spellButton.on("click", Game.ui.openSpell);

    var informationWindow = Game.ui.informationWindow = new createjs.Container();
    informationWindow.regX = 400;
    informationWindow.regY = 225;

    informationWindow.addChild(background);
    informationWindow.addChild(attributeText);

    skillButton.drawOn(informationWindow);
    spellButton.drawOn(informationWindow);

    Game.uiLayer.addChild(informationWindow);

    Game.ui.openAttribute();
    Game.ui.openArmor();

    Game.ui.initBottomBar();
  }

  Game.ui.initBottomBar = function () {

    if (Game.ui.toolbar) {
      Game.uiLayer.removeChild(Game.ui.toolbar);
      Game.ui.toolbar = null;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 790, 60, 5);
    background.x = 5;
    background.y = 385;
    background.alpha = 0.6;

    var barMax = 80;

    var hpbarBox = new createjs.Shape();
    hpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, barMax, 20, 5);
    hpbarBox.x = 10;
    hpbarBox.y = 390;

    var hpbar = new createjs.Shape();
    hpbar.graphics
    .beginFill("green")
    .drawRoundRect(0, 0, parseInt(Game.hero.data.hp / Game.hero.data._hp * barMax), 20, 5);
    hpbar.x = hpbarBox.x;
    hpbar.y = hpbarBox.y;

    var mpbarBox = new createjs.Shape();
    mpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, barMax, 20, 5);
    mpbarBox.x = 10;
    mpbarBox.y = 420;

    var mpbar = new createjs.Shape();
    mpbar.graphics
    .beginFill("blue")
    .drawRoundRect(0, 0, parseInt(Game.hero.data.sp / Game.hero.data._sp * barMax), 20, 5);
    mpbar.x = mpbarBox.x;
    mpbar.y = mpbarBox.y;

    var spellBar = [];
    spellBar.length = 7;

    for (var i = 0; i < spellBar.length; i++) {
      (function (element, index, array) {
        spellBar[index] = new BoxClass(145 + index * 60, 415);
      })(spellBar[i], i, spellBar);
    }

    Game.ui.spellBar = spellBar;

    // 四个按钮：

    var informationButton = new BoxBitmapButtonClass("/image/information.png", 585, 415);
    informationButton.on("click", Game.ui.openInformation);
    Game.ui.informationButton = informationButton;

    var itemButton = new BoxBitmapButtonClass("/image/item.png", 645, 415);
    itemButton.on("click", Game.ui.openItem);
    Game.ui.itemButton = itemButton;

    var mapButton = new BoxBitmapButtonClass("/image/map.png", 705, 415);
    mapButton.on("click", Game.ui.openMap);
    Game.ui.mapButton = mapButton;

    var settingButton = new BoxBitmapButtonClass("/image/setting.png", 765, 415);
    settingButton.on("click", Game.ui.openSetting);
    Game.ui.settingButton = settingButton;

    var toolbar = new createjs.Container();
    toolbar.regX = 400;
    toolbar.regY = 225;

    toolbar.addChild(background);
    toolbar.addChild(hpbarBox);
    toolbar.addChild(mpbarBox);
    toolbar.addChild(hpbar);
    toolbar.addChild(mpbar);

    informationButton.drawOn(toolbar);
    itemButton.drawOn(toolbar);
    mapButton.drawOn(toolbar);
    settingButton.drawOn(toolbar);

    for (var i = 0; i < spellBar.length; i++) {
      toolbar.addChild(spellBar[i].box);
    }

    // 让底部栏总在最下面
    Game.uiLayer.addChildAt(toolbar, 0);
    Game.ui.toolbar = toolbar;

    Game.ui.spellIcon = [];

    (function AddHeroSpellBarIcon () {
      Game.hero.data.spellbar.forEach(function (element, index) {
        if (!Game.hero.spells[element])
          return;

        var box = Game.ui.spellBar[index];
        var t = new BoxBitmapClass(Game.hero.spells[element].icon, box.x, box.y);
        t.drawOn(Game.ui.toolbar);

        Game.ui.spellIcon[index] = t;

        var X = t.x;
        var Y = t.y;

        t.on("click", function (event) {
          event.stopImmediatePropagation();
          if (Game.ui.spellWindow) {
            SpellSelect("bar", index);
          } else {
            Game.ui.clickSpell(index);
          }
        });

        t.on("mousedown", function (event) {
          if (!Game.ui.spellBook) return;

          t.offset = {
            x: t.x - event.stageX / Game.stage.scaleX,
            y: t.y - event.stageY / Game.stage.scaleY
          };
        });

        t.on("pressmove", function (event) {
          if (!Game.ui.spellBook) return;

          t.x = event.stageX / Game.stage.scaleX + t.offset.x;
          t.y = event.stageY / Game.stage.scaleY + t.offset.y;
        });

        t.on("pressup", function (event) {
          if (!Game.ui.spellBook) return;

          var x = event.stageX / Game.stage.scaleX + t.offset.x;
          var y = event.stageY / Game.stage.scaleY + t.offset.y;

          var lastType = null;
          var lastIndex = -1;

          var minDistance = 9999;
          var minType = null;
          var minIndex = -1;

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

          if (lastType && minType) {
            if (minDistance < 30) {
              SpellExchange(lastType, lastIndex, minType, minIndex);
            } else if (t.distance(X, Y) >= 30) {
              Game.hero.data.spellbar[lastIndex] = null;
              Game.io.updateHero({spellbar: Game.hero.data.spellbar});
              Game.ui.initBottomBar();
            }
          }

          t.x = X;
          t.y = Y;
        });

      });
    })();

    if (Game.ui.settingWindow) { // 如果开着，就要关
      Game.ui.settingButton.color = "green";
    }

    if (Game.ui.informationWindow || Game.ui.skillWindow || Game.ui.spellWindow) { // 如果开着，就要关
      Game.ui.informationButton.color = "green";
    }

    if (Game.ui.mapWindow) { // 如果开着，就要关
      Game.ui.mapButton.color = "green";
    }

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.ui.itemButton.color = "green";
    }

    Game.update();

  } // Game.ui.InitBottomBar


}());
