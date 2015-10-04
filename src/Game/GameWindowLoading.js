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

(function () {
  "use strict";

  let win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = `
    <table><tbody><tr><td>
      <label>请稍等...<small id="loadingWindowProgress"></small></label>
      <br>
      <h5 id="loadingWindowText"></h5>
    </td></tr></tbody></table>
  `;

  win.css = `
    .loadingWindow {
      text-align: center;
    }

    .loadingWindow table, .loadingWindow tbody, .loadingWindow tr, .loadingWindow td {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .loadingWindow label {
      padding: 50px;
      padding-bottom: 100px;
      border-radius:25px;
      background-color: grey;
      font-size: 60px;
    }
  `;

  let loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  let loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  let text = [
    "打开游戏菜单之后，游戏是暂停的",
    "记得带着矿工锄和采药铲，或许能从其中赚点小钱",
    "改变职业的成本会随着你的等级越来越高",
    "你的信仰决定了神对你的祝福，和某些人对你的看法",
    "信仰是可以改变的，但人们不喜欢这样的人",
    "没有信仰，也是一种信仰，但是你享受不到神的祝福"
  ];

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
