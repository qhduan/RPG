/*

A-RPG Game, Built using JavaScript ES6
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

  var win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = "\n    <table><tbody><tr><td>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </td></tr></tbody></table>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    .loadingWindow table, .loadingWindow tbody, .loadingWindow tr, .loadingWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .loadingWindow label {\n      padding: 50px;\n      padding-bottom: 100px;\n      border-radius:25px;\n      background-color: grey;\n      font-size: 60px;\n    }\n  ";

  var loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  var loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  var text = ["打开游戏菜单之后，游戏是暂停的", "记得带着矿工锄和采药铲，或许能从其中赚点小钱", "改变职业的成本会随着你的等级越来越高", "你的信仰决定了神对你的祝福，和某些人对你的看法", "信仰是可以改变的，但人们不喜欢这样的人", "没有信仰，也是一种信仰，但是你享受不到神的祝福"];

  win.assign("begin", function () {
    loadingWindowProgress.innerHTML = "";
    // 随机一个提示
    loadingWindowText.textContent = text[Math.floor(Math.random() * text.length)];
    win.show();
  });

  win.assign("update", function (value) {
    loadingWindowProgress.innerHTML = value;
  });

  win.assign("end", function () {
    win.hide();
  });
})();
//# sourceMappingURL=GameWindowLoading.js.map
