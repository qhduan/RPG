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

  Game.ui = {};

  Game.ui.showMessage = function (data) {
    console.log("message", data);
  };

  Game.oninit(function () {
    Game.ui.toolbar = new createjs.Container();
    Game.ui.toolbar.regX = 400;
    Game.ui.toolbar.regY = 225;

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(5, 395, 790, 50, 5);
    background.alpha = 0.6;

    var hpbarBox = new createjs.Shape();
    hpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(10, 400, 100, 18, 3);

    var hpbar = new createjs.Shape();
    hpbar.graphics
    .beginFill("green")
    .drawRoundRect(10, 400, 100, 18, 3);

    var mpbarBox = new createjs.Shape();
    mpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(10, 422, 100, 18, 3);

    var mpbar = new createjs.Shape();
    mpbar.graphics
    .beginFill("blue")
    .drawRoundRect(10, 422, 80, 18, 3);

    var attackBox = new createjs.Shape();
    attackBox.graphics
    .beginStroke("black")
    .drawRect(120, 400, 40, 40);

    Game.ui.attackBox = attackBox;

    var spellBox = [];
    spellBox.length = 7;

    for (var i = 0; i < spellBox.length; i++) {
      spellBox[i] = new createjs.Shape();
      spellBox[i].graphics
      .beginStroke("black")
      .beginFill("gray")
      .drawRect(170 + i * 50, 400, 40, 40);
      spellBox[i].on("click", function () {
        alert(11);
      });
    }

    Game.ui.spellBox = spellBox;

    var informationBox = new createjs.Shape();
    informationBox.graphics
    .beginStroke("black")
    .drawRect(550, 400, 40, 40);

    var spellbookBox = new createjs.Shape();
    spellbookBox.graphics
    .beginStroke("black")
    .drawRect(600, 400, 40, 40);

    var bagBox = new createjs.Shape();
    bagBox.graphics
    .beginStroke("black")
    .drawRect(650, 400, 40, 40);

    var helpBox = new createjs.Shape();
    helpBox.graphics
    .beginStroke("black")
    .drawRect(700, 400, 40, 40);

    var settingBox = new createjs.Shape();
    settingBox.graphics
    .beginStroke("black")
    .drawRect(750, 400, 40, 40);

    Game.ui.toolbar.addChild(background);
    Game.ui.toolbar.addChild(hpbarBox);
    Game.ui.toolbar.addChild(mpbarBox);
    Game.ui.toolbar.addChild(hpbar);
    Game.ui.toolbar.addChild(mpbar);

    Game.ui.toolbar.addChild(attackBox);
    Game.ui.toolbar.addChild(informationBox);
    Game.ui.toolbar.addChild(spellbookBox);
    Game.ui.toolbar.addChild(bagBox);
    Game.ui.toolbar.addChild(helpBox);
    Game.ui.toolbar.addChild(settingBox);

    for (var i = 0; i < spellBox.length; i++) {
      Game.ui.toolbar.addChild(spellBox[i]);
    }

    Game.uiLayer.addChild(Game.ui.toolbar);

    Game.stage.on("drawstart", function () {
      if (Game.hero && Game.hero.sprite) {
        Game.ui.toolbar.x = Game.hero.sprite.x;
        Game.ui.toolbar.y = Game.hero.sprite.y;
      }
    });


  });


}());
