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

  // Textplit函数用来把文字分行，因为easeljs的lineWidth的wrap机制不支持中文
  function TextSplit (text) {
    var lineMax = 78; // 一行最多的字符数（中文和中文标点算两个字符）
    var result = [];
    var realLength = 0;
    var breakPoint = 0;
    for (var i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 128) // 大于128，则不是ascii字符，假定为是中文
        realLength += 2;
      else
        realLength += 1;
      if (realLength > lineMax) {
        realLength = 0;
        result.push(text.substring(breakPoint, i));
        breakPoint = i;
      }
    }
    if (breakPoint < text.length) {
      result.push(text.substring(breakPoint));
    }

    return result.join("\n\n");
  }

  var DialogueClass = Game.DialogueClass = function (text, color, bgColor) {
    var self = this;

    text = TextSplit(text);

    self.color = color;
    self.bgColor = bgColor;

    var graphics = new createjs.Graphics()
      .beginFill(self.bgColor)
      .drawRect(20, Game.config.height - 120, Game.config.width - 40, 100);
    self.shape = new createjs.Shape(graphics);

    self.text = new createjs.Text(text, "18px Arial", color);
    self.text.lineHeight = 12;
    self.text.x = 20 + 10;
    self.text.y = Game.config.height - 100;
    self.text.lineWidth = Game.config.width - 40 - 20;
    self.text.textBaseline = "alphabetic";

    //shape.x = Game.stage.regX;
    //shape.y = Game.stage.regY;
    self.shape.alpha = 0.3;

    self.container = new createjs.Container();
    self.container.addChild(self.shape);
    self.container.addChild(self.text);
    //    Game.stage.addChild(text);

    Game.stage.addChild(self.container);
    //Game.stage.addChild(shape);
    //Game.stage.addChild(text);

    self.listener = createjs.Ticker.on("tick", function () {
      self.container.x = Game.stage.regX;
      self.container.y = Game.stage.regY;
    });
  }

  Game.dialogue = {
    create: function (text, color, bgColor) {
      return new DialogueClass(text, color, bgColor);
    }
  };

})();
