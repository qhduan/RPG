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

(function () {
  "use strict";

  Game.dialogue = {};

  // Textplit函数用来把文字分行，因为easeljs的lineWidth的wrap机制不支持中文
  Game.dialogue.textSplit = function (text, lineMax) {
    //var lineMax = 78; // 一行最多的字符数（中文和中文标点算两个字符）
    var result = [];
    var realLength = 0;
    var breakPoint = 0;
    for (var i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 128) // 大于128，则不是ascii字符，假定为是中文
        realLength += 2;else realLength += 1;
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
  };
})();
//# sourceMappingURL=dialogue.js.map