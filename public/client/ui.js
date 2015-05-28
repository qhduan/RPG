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
          Game.ui.redPoint.x = heroX + 185;
          Game.ui.redPoint.y = heroY + 30;
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

        spellIcon.graphics
        .clear()
        .beginFill("green")
        .drawRect(0, 0, 40, 40);

        cooldown -= 100;

        createjs.Tween.get(spellIcon).to({alpha: 0}, cooldown).call(function () {
          spellIcon.graphics
          .clear()
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);
          spellIcon.alpha = 1;
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
  }

  function ItemChanged () {
    var items = [];
    items.length = Game.hero.data.items.length;
    for (var i = 0; i < items.length; i++) {
      if (Game.hero.data.items[i])
        items[i] = Game.hero.data.items[i].id;
    }

    var equipment = {};

    for (var key in Game.hero.data.equipment) {
      if (Game.hero.data.equipment[key])
        equipment[key] = Game.hero.data.equipment[key].id;
      else
        equipment[key] = null;
    }

    Game.io.updateHero({
      items: items,
      equipment: equipment
    });
  }

  Game.ui.itemSelect = function (type, index) {
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
      itemText.x = 630;
      itemText.y = 40;
      Game.ui.itemWindow.addChild(itemText);
      Game.ui.itemText = itemText;

      lastItemSelectType = type;
      lastItemSelectIndex = index;

      if (type == "equipment") {
        Game.ui.armorBox[index].graphics
        .clear()
        .beginFill("green")
        .drawRect(0, 0, 40, 40);
      } else if (type == "item") {
        Game.ui.itemBox[index].graphics
        .clear()
        .beginFill("green")
        .drawRect(0, 0, 40, 40);
      }
      Game.update();
    } else {

      if (lastItemSelectType == "equipment" && type == "equipment") {

        Game.ui.armorBox[lastItemSelectIndex].graphics
        .clear()
        .beginFill("gray")
        .drawRect(0, 0, 40, 40);
        Game.update();

        if (lastItemSelectIndex != index) {
          lastItemSelectIndex = -1;
          lastItemSelectType = null;

          return Game.ui.itemSelect(type, index);
        }
      }

      if (lastItemSelectType == "item" && type == "item") {
        if (lastItemSelectIndex == index) {
          Game.ui.itemBox[index].graphics
          .clear()
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);
          Game.update();
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
          Game.ui.armorBox[lastItemSelectIndex].graphics
          .clear()
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);
          Game.update();
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
          Game.ui.itemBox[lastItemSelectIndex].graphics
          .clear()
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);
          Game.update();
        }
      }

      lastItemSelectIndex = -1;
      lastItemSelectType = null;
    }
  };

  Game.ui.openItem = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.itemWindow);
      Game.ui.itemWindow = null;
      Game.ui.initBottomBar();
      lastItemSelectIndex = -1;
      lastItemSelectType = null;
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 370, 350, 5);
    background.x = 410;
    background.y = 20;
     background.alpha = 0.6;

    var armorBox = [];
    var armorBoxWidth = 4;
    var armorBoxHeight = 2;
    armorBox.length = armorBoxWidth * armorBoxHeight;

    for (var i = 0; i < armorBoxHeight; i++) {
      for (var j = 0; j < armorBoxWidth; j++) {
        (function (i, j) {
          var index = i * armorBoxWidth + j;
          var armorIcon = armorBox[index] = new createjs.Shape();
          armorIcon.graphics
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);

          armorIcon.x = 445 + j * 50;
          armorIcon.y = 55 + i * 50;
          armorIcon.regX = 20;
          armorIcon.regY = 20;

          armorIcon.on("click", function () {
            Game.ui.itemSelect("equipment", index);
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
          var itemIcon = itemBox[index] = new createjs.Shape();
          itemIcon.graphics
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);

          itemIcon.x = 445 + j * 50;
          itemIcon.y = 155 + i * 50;
          itemIcon.regX = 20;
          itemIcon.regY = 20;

          itemIcon.on("click", function () {
            Game.ui.itemSelect("item", index);
          });
        })(i, j);
      }
    }

    Game.ui.itemBox = itemBox;

    var itemUseBox = new createjs.Shape();
    itemUseBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    itemUseBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    itemUseBox.x = 745;
    itemUseBox.y = 155;
    itemUseBox.regX = 20;
    itemUseBox.regY = 20;

    var itemDropBox = new createjs.Shape();
    itemDropBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    itemDropBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    itemDropBox.x = 745;
    itemDropBox.y = 205;
    itemDropBox.regX = 20;
    itemDropBox.regY = 20;

    var itemPrevBox = new createjs.Shape();
    itemPrevBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    itemPrevBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    itemPrevBox.x = 745;
    itemPrevBox.y = 255;
    itemPrevBox.regX = 20;
    itemPrevBox.regY = 20;

    var itemNextBox = new createjs.Shape();
    itemNextBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    itemNextBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    itemNextBox.x = 745;
    itemNextBox.y = 305;
    itemNextBox.regX = 20;
    itemNextBox.regY = 20;

    var itemGoldBox = new createjs.Text("10000000G");
    itemGoldBox.color = "gold";
    itemGoldBox.x = 425;
    itemGoldBox.y = 345;

    var itemText = new createjs.Shape();
    itemText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 140, 90);
    itemText.x = 625;
    itemText.y = 35;

    // 装备栏的8个空

    var headIcon = new createjs.Bitmap(Game.resources["/image/head.png"]);
    headIcon.regX = headIcon.image.width / 2;
    headIcon.regY = headIcon.image.height / 2;
    headIcon.x = armorBox[0].x;
    headIcon.y = armorBox[0].y;

    var neckIcon = new createjs.Bitmap(Game.resources["/image/neck.png"]);
    neckIcon.regX = neckIcon.image.width / 2;
    neckIcon.regY = neckIcon.image.height / 2;
    neckIcon.x = armorBox[1].x;
    neckIcon.y = armorBox[1].y;

    var bodyIcon = new createjs.Bitmap(Game.resources["/image/body.png"]);
    bodyIcon.regX = bodyIcon.image.width / 2;
    bodyIcon.regY = bodyIcon.image.height / 2;
    bodyIcon.x = armorBox[2].x;
    bodyIcon.y = armorBox[2].y;

    var feetIcon = new createjs.Bitmap(Game.resources["/image/feet.png"]);
    feetIcon.regX = feetIcon.image.width / 2;
    feetIcon.regY = feetIcon.image.height / 2;
    feetIcon.x = armorBox[3].x;
    feetIcon.y = armorBox[3].y;

    var righthandIcon = new createjs.Bitmap(Game.resources["/image/righthand.png"]);
    righthandIcon.regX = righthandIcon.image.width / 2;
    righthandIcon.regY = righthandIcon.image.height / 2;
    righthandIcon.x = armorBox[4].x;
    righthandIcon.y = armorBox[4].y;

    var lefthandIcon = new createjs.Bitmap(Game.resources["/image/lefthand.png"]);
    lefthandIcon.regX = lefthandIcon.image.width / 2;
    lefthandIcon.regY = lefthandIcon.image.height / 2;
    lefthandIcon.x = armorBox[5].x;
    lefthandIcon.y = armorBox[5].y;

    var leftringIcon = new createjs.Bitmap(Game.resources["/image/ring.png"]);
    leftringIcon.regX = leftringIcon.image.width / 2;
    leftringIcon.regY = leftringIcon.image.height / 2;
    leftringIcon.x = armorBox[6].x;
    leftringIcon.y = armorBox[6].y;

    var rightringIcon = new createjs.Bitmap(Game.resources["/image/ring.png"]);
    rightringIcon.regX = rightringIcon.image.width / 2;
    rightringIcon.regY = rightringIcon.image.height / 2;
    rightringIcon.x = armorBox[7].x;
    rightringIcon.y = armorBox[7].y;

    // 物品栏的四个空

    var useButton = new createjs.Bitmap(Game.resources["/image/use.png"]);
    useButton.regX = useButton.image.width / 2;
    useButton.regY = useButton.image.height / 2;
    useButton.x = itemUseBox.x;
    useButton.y = itemUseBox.y;

    var dropButton = new createjs.Bitmap(Game.resources["/image/drop.png"]);
    dropButton.regX = dropButton.image.width / 2;
    dropButton.regY = dropButton.image.height / 2;
    dropButton.x = itemDropBox.x;
    dropButton.y = itemDropBox.y;

    var upButton = new createjs.Bitmap(Game.resources["/image/up.png"]);
    upButton.regX = upButton.image.width / 2;
    upButton.regY = upButton.image.height / 2;
    upButton.x = itemPrevBox.x;
    upButton.y = itemPrevBox.y;

    var downButton = new createjs.Bitmap(Game.resources["/image/down.png"]);
    downButton.regX = downButton.image.width / 2;
    downButton.regY = downButton.image.height / 2;
    downButton.x = itemNextBox.x;
    downButton.y = itemNextBox.y;


    var itemWindow = new createjs.Container();
    itemWindow.regX = 400;
    itemWindow.regY = 225;

    itemWindow.addChild(background);
    itemWindow.addChild(itemGoldBox);
    itemWindow.addChild(itemText);
    itemWindow.addChild(itemUseBox);
    itemWindow.addChild(itemDropBox);
    itemWindow.addChild(itemPrevBox);
    itemWindow.addChild(itemNextBox);

    itemWindow.addChild(useButton);
    itemWindow.addChild(dropButton);
    itemWindow.addChild(upButton);
    itemWindow.addChild(downButton);

    armorBox.forEach(function (element) {
     itemWindow.addChild(element);
    });

    itemBox.forEach(function (element) {
     itemWindow.addChild(element);
    });

    itemWindow.addChild(headIcon);
    itemWindow.addChild(neckIcon);
    itemWindow.addChild(bodyIcon);
    itemWindow.addChild(feetIcon);
    itemWindow.addChild(righthandIcon);
    itemWindow.addChild(lefthandIcon);
    itemWindow.addChild(leftringIcon);
    itemWindow.addChild(rightringIcon);

    function CopyIcon (item, icon) {
      var t = item.bitmap.clone();
      t.x = icon.x;
      t.y = icon.y;
      itemWindow.addChild(t);
    }

    if (heroObj.data.equipment.head)
      CopyIcon(heroObj.data.equipment.head, headIcon);
    if (heroObj.data.equipment.neck)
      CopyIcon(heroObj.data.equipment.neck, neckIcon);
    if (heroObj.data.equipment.body)
      CopyIcon(heroObj.data.equipment.body, bodyIcon);
    if (heroObj.data.equipment.feet)
      CopyIcon(heroObj.data.equipment.feet, feetIcon);
    if (heroObj.data.equipment.righthand)
      CopyIcon(heroObj.data.equipment.righthand, righthandIcon);
    if (heroObj.data.equipment.lefthand)
      CopyIcon(heroObj.data.equipment.lefthand, lefthandIcon);
    if (heroObj.data.equipment.leftring)
      CopyIcon(heroObj.data.equipment.leftring, leftringIcon);
    if (heroObj.data.equipment.rightring)
      CopyIcon(heroObj.data.equipment.rightring, rightringIcon);

    heroObj.data.items.forEach(function (element, index) {
      if (element)
        CopyIcon(element, itemBox[index]);
    });

    Game.uiLayer.addChild(itemWindow);
    Game.ui.itemWindow = itemWindow;

    Game.ui.initBottomBar();
  };



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
    .drawRoundRect(0, 0, 370, 350, 5);
    background.x = 20;
    background.y = 20;
    background.alpha = 0.6;

    var closeBox = new createjs.Shape();
    closeBox.graphics
    .beginStroke("black")
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    closeBox.x = 50;
    closeBox.y = 305;
    closeBox.regX = 20;
    closeBox.regY = 20;

    closeBox.on("click", Game.ui.openSkill);

    var skillWindow = new createjs.Container();
    skillWindow.regX = 400;
    skillWindow.regY = 225;

    skillWindow.addChild(background);
    skillWindow.addChild(closeBox);

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
      spellText.x = 40;
      spellText.y = 270;
      Game.ui.spellWindow.addChild(spellText);
      Game.ui.spellText = spellText;

      lastSpellSelectType = type;
      lastSpellSelectIndex = index;
      if (type == "bar") {
        Game.ui.spellBar[index].graphics
        .clear()
        .beginFill("green")
        .drawRect(0, 0, 40, 40);
      } else if (type == "book") {
        Game.ui.spellBook[index].graphics
        .clear()
        .beginFill("green")
        .drawRect(0, 0, 40, 40);
      }
      Game.update();
    } else {
      if (lastSpellSelectType == "book" && type == "bar") {
        var spellBookSelect = Object.keys(Game.hero.data.spells)[lastSpellSelectIndex];
        var spellBarSelect = Game.hero.data.spellbar[index];
        if (spellBookSelect != spellBarSelect) {
          if (Game.hero.data.spellbar.indexOf(spellBookSelect) == -1) {
            Game.hero.data.spellbar[index] = spellBookSelect;

            Game.ui.spellBook[lastSpellSelectIndex].graphics
            .clear()
            .beginFill("gray")
            .drawRect(0, 0, 40, 40);

            Game.io.updateHero({spellbar: Game.hero.data.spellbar});

            Game.ui.initBottomBar();
          } else {
            Game.ui.spellBook[lastSpellSelectIndex].graphics
            .clear()
            .beginFill("gray")
            .drawRect(0, 0, 40, 40);
            Game.update();
          }
        } else {
          Game.ui.spellBook[lastSpellSelectIndex].graphics
          .clear()
          .beginFill("gray")
          .drawRect(0, 0, 40, 40);
          Game.update();
        }
      }

      if (lastSpellSelectType == "book" && type == "book") {
        Game.ui.spellBook[lastSpellSelectIndex].graphics
        .clear()
        .beginFill("gray")
        .drawRect(0, 0, 40, 40);

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

          Game.io.updateHero({spellbar: Game.hero.data.spellbar});
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

    if (Game.ui.spellWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.spellWindow);
      Game.ui.spellWindow = null;
      Game.ui.initBottomBar();
      lastSpellSelectIndex = -1;
      lastSpellSelectType = null;
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 370, 350, 5);
    background.x = 20;
    background.y = 20;
    background.alpha = 0.6;


    var spellBook = [];
    spellBook.length = heroObj.data.spellcount;

    var spellBookWidth = 7;
    var spellBookHeight = 7;
    var spellCount = 0;

    for (var i = 0; i < spellBookHeight; i++) {
      for (var j = 0; j < spellBookWidth; j++) {
        (function (i, j) {
          if (spellCount >= spellBook.length)
            return;
          var index = i * spellBookWidth + j;
          spellBook[index] = new createjs.Shape();
          spellBook[index].graphics
          .beginFill("grey")
          .drawRect(0, 0, 40, 40);
          spellBook[index].regX = 20;
          spellBook[index].regY = 20;
          spellBook[index].x = 55 + j * 50;
          spellBook[index].y = 55 + i * 50;
          spellBook[index].on("click", function () {
            Game.ui.spellSelect("book", index);
          });
          spellCount++;
        })(i, j);
      }
    }

    Game.ui.spellBook = spellBook;

    var releaseBox = new createjs.Shape();
    releaseBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    releaseBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    releaseBox.x = 355;
    releaseBox.y = 285;
    releaseBox.regX = 20;
    releaseBox.regY = 20;

    var closeBox = new createjs.Shape();
    closeBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    closeBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    closeBox.x = 355;
    closeBox.y = 335;
    closeBox.regX = 20;
    closeBox.regY = 20;

    closeBox.on("click", Game.ui.openSpell);

    var spellText = new createjs.Shape();
    spellText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 290, 90);
    spellText.x = 35;
    spellText.y = 265;

    var spellWindow = new createjs.Container();
    spellWindow.regX = 400;
    spellWindow.regY = 225;

    spellWindow.addChild(background);
    spellWindow.addChild(closeBox);
    spellWindow.addChild(releaseBox);
    spellWindow.addChild(spellText);

    spellBook.forEach(function (element) {
      spellWindow.addChild(element);
    });

    (function AddHeroSpellIcon () {
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
     .drawRoundRect(0, 0, 760, 350, 5);
     background.x = 20;
     background.y = 20;
     background.alpha = 0.6;

     var mapWindow = new createjs.Container();
     mapWindow.regX = 400;
     mapWindow.regY = 225;

     mapWindow.addChild(background);

     var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
     var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
     Game.area.map.minimap.x = 400;
     Game.area.map.minimap.y = 195;

     var redPoint = new createjs.Shape();
     redPoint.graphics
     .beginFill("red")
     .drawRoundRect(0, 0, 10, 10, 3);
     redPoint.regX = 5;
     redPoint.regY = 5;
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
    .drawRoundRect(0, 0, 760, 350, 5);
    background.x = 20;
    background.y = 20;
    background.alpha = 0.6;

    var settingWindow = new createjs.Container();
    settingWindow.regX = 400;
    settingWindow.regY = 225;

    settingWindow.addChild(background);

    Game.uiLayer.addChild(settingWindow);
    Game.ui.settingWindow = settingWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.openInformation = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.informationWindow);
      Game.ui.informationWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 370, 350, 5);
    background.x = 20;
    background.y = 20;
    background.alpha = 0.6;

    var hitpoint = new createjs.Text("生命: " + heroObj.data.hitpoint);
    hitpoint.x = 50;
    hitpoint.y = 50;
    var manapoint = new createjs.Text("精神力: " + heroObj.data.manapoint);
    manapoint.x = 50;
    manapoint.y = 70;

    var strength = new createjs.Text("力量: " + heroObj.data.strength);
    strength.x = 50;
    strength.y = 90;
    var dexterity = new createjs.Text("敏捷: " + heroObj.data.dexterity);
    dexterity.x = 50;
    dexterity.y = 110;
    var intelligence = new createjs.Text("体质: " + heroObj.data.intelligence);
    intelligence.x = 50;
    intelligence.y = 130;
    var constitution = new createjs.Text("智力: " + heroObj.data.constitution);
    constitution.x = 50;
    constitution.y = 150;

    var attack = new createjs.Text("攻击力: " + heroObj.data.attack);
    attack.x = 50;
    attack.y = 170;
    var defense = new createjs.Text("防御力: " + heroObj.data.defense);
    defense.x = 50;
    defense.y = 190;
    var magicAttack = new createjs.Text("魔法攻击: " + heroObj.data.magicAttack);
    magicAttack.x = 50;
    magicAttack.y = 210;
    var magicDefense = new createjs.Text("魔法防御: " + heroObj.data.magicDefense);
    magicDefense.x = 50;
    magicDefense.y = 230;

    var skillBox = new createjs.Shape();
    skillBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    skillBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    skillBox.x = 70;
    skillBox.y = 300;
    skillBox.regX = 20;
    skillBox.regY = 20;

    var skillButton = new createjs.Bitmap(Game.resources["/image/skill.png"]);
    skillButton.regX = skillButton.image.width / 2;
    skillButton.regY = skillButton.image.height / 2;
    skillButton.x = 70;
    skillButton.y = 300;

    skillBox.on("click", Game.ui.openSkill);

    var spellBox = new createjs.Shape();
    spellBox.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    spellBox.shadow = new createjs.Shadow("black", 2, 2, 2);
    spellBox.x = 120;
    spellBox.y = 300;
    spellBox.regX = 20;
    spellBox.regY = 20;

    var spellButton = new createjs.Bitmap(Game.resources["/image/spell.png"]);
    spellButton.regX = spellButton.image.width / 2;
    spellButton.regY = spellButton.image.height / 2;
    spellButton.x = 120;
    spellButton.y = 300;

    spellBox.on("click", Game.ui.openSpell);

    var informationWindow = new createjs.Container();
    informationWindow.regX = 400;
    informationWindow.regY = 225;

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

    informationWindow.addChild(skillBox);
    informationWindow.addChild(spellBox);
    informationWindow.addChild(skillButton);
    informationWindow.addChild(spellButton);

    Game.uiLayer.addChild(informationWindow);

    Game.ui.informationWindow = informationWindow;

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
    .drawRoundRect(0, 0, 790, 50, 5);
    background.x = 5;
    background.y = 395;
    background.alpha = 0.6;

    var hpbarBox = new createjs.Shape();
    hpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, 100, 18, 3);
    hpbarBox.x = 10;
    hpbarBox.y = 400;

    var hpbar = new createjs.Shape();
    hpbar.graphics
    .beginFill("green")
    .drawRoundRect(0, 0, 100, 18, 3);
    hpbar.x = 10;
    hpbar.y = 400;

    var mpbarBox = new createjs.Shape();
    mpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, 100, 18, 3);
    mpbarBox.x = 10;
    mpbarBox.y = 422;

    var mpbar = new createjs.Shape();
    mpbar.graphics
    .beginFill("blue")
    .drawRoundRect(0, 0, 80, 18, 3);
    mpbar.x = 10;
    mpbar.y = 422;

    var spellBar = [];
    spellBar.length = 9;

    for (var i = 0; i < spellBar.length; i++) {
      (function (element, index, array) {
        spellBar[index] = new createjs.Shape();
        var spellIcon = array[index];

        spellIcon.graphics
        .beginFill("gray")
        .drawRect(0, 0, 40, 40);

        spellIcon.x = 140 + index * 50;
        spellIcon.y = 420;
        spellIcon.regX = 20;
        spellIcon.regY = 20;

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

    var informationButton = new createjs.Shape();
    informationButton.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    informationButton.shadow = new createjs.Shadow("black", 2, 2, 2);
    informationButton.x = 620;
    informationButton.y = 420;
    informationButton.regX = 20;
    informationButton.regY = 20;
    var informationIcon = new createjs.Bitmap(Game.resources["/image/information.png"]);
    informationIcon.regX = informationIcon.image.width / 2;
    informationIcon.regY = informationIcon.image.height / 2;
    informationIcon.x = informationButton.x;
    informationIcon.y = informationButton.y;

    informationButton.on("click", Game.ui.openInformation);
    Game.ui.informationButton = informationButton;


    var itemButton = new createjs.Shape();
    itemButton.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    itemButton.shadow = new createjs.Shadow("black", 2, 2, 2);
    itemButton.x = 670;
    itemButton.y = 420;
    itemButton.regX = 20;
    itemButton.regY = 20;
    var itemIcon = new createjs.Bitmap(Game.resources["/image/item.png"]);
    itemIcon.regX = itemIcon.image.width / 2;
    itemIcon.regY = itemIcon.image.height / 2;
    itemIcon.x = itemButton.x;
    itemIcon.y = itemButton.y;

    itemButton.on("click", Game.ui.openItem);
    Game.ui.itemButton = itemButton;


    var mapButton = new createjs.Shape();
    mapButton.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    mapButton.shadow = new createjs.Shadow("black", 2, 2, 2);
    mapButton.x = 720;
    mapButton.y = 420;
    mapButton.regX = 20;
    mapButton.regY = 20;
    var mapIcon = new createjs.Bitmap(Game.resources["/image/map.png"]);
    mapIcon.regX = mapIcon.image.width / 2;
    mapIcon.regY = mapIcon.image.height / 2;
    mapIcon.x = mapButton.x;
    mapIcon.y = mapButton.y;

    mapButton.on("click", Game.ui.openMap);
    Game.ui.mapButton = mapButton;


    var settingButton = new createjs.Shape();
    settingButton.graphics
    .beginFill("gray")
    .drawRect(0, 0, 40, 40);
    settingButton.shadow = new createjs.Shadow("black", 2, 2, 2);
    settingButton.x = 770;
    settingButton.y = 420;
    settingButton.regX = 20;
    settingButton.regY = 20;
    var settingIcon = new createjs.Bitmap(Game.resources["/image/setting.png"]);
    settingIcon.regX = settingIcon.image.width / 2;
    settingIcon.regY = settingIcon.image.height / 2;
    settingIcon.x = settingButton.x;
    settingIcon.y = settingButton.y;

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

    toolbar.addChild(informationButton);
    toolbar.addChild(itemButton);
    toolbar.addChild(mapButton);
    toolbar.addChild(settingButton);

    toolbar.addChild(informationIcon);
    toolbar.addChild(itemIcon);
    toolbar.addChild(mapIcon);
    toolbar.addChild(settingIcon);

    for (var i = 0; i < spellBar.length; i++) {
      toolbar.addChild(spellBar[i]);
    }

    Game.uiLayer.addChild(toolbar);
    Game.ui.toolbar = toolbar;

    (function AddHeroSpellBarIcon () {
      Game.hero.data.spellbar.forEach(function (element, index) {
        if (!Game.hero.data.spells[element])
          return;
        var t = Game.hero.data.spells[element].icon.clone();
        t.x = Game.ui.spellBar[index].x;
        t.y = Game.ui.spellBar[index].y;
        Game.ui.toolbar.addChild(t);
      });
    })();

    if (Game.ui.settingWindow) { // 如果开着，就要关
      Game.ui.settingButton.graphics
      .clear()
      .beginFill("green")
      .drawRect(0, 0, 40, 40);
    }

    if (Game.ui.informationWindow) { // 如果开着，就要关
      Game.ui.informationButton.graphics
      .clear()
      .beginFill("green")
      .drawRect(0, 0, 40, 40);
    }

    if (Game.ui.mapWindow) { // 如果开着，就要关
      Game.ui.mapButton.graphics
      .clear()
      .beginFill("green")
      .drawRect(0, 0, 40, 40);
    }

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.ui.itemButton.graphics
      .clear()
      .beginFill("green")
      .drawRect(0, 0, 40, 40);
    }

    Game.update();

  } // Game.ui.InitBottomBar

  Game.oninit(function () {



    window.addEventListener("keydown", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

    });



  });


}());
