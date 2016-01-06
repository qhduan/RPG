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

import Game   from "../Base.js";
import Window from "../Window.js";
import html   from "../HTML/Loading.html";
import "../CSS/Loading.scss";

let win = Window.create("loadingWindow", html);
let WindowLoading = win;
export default WindowLoading;

let loadingWindowProgress = win.querySelector("#loadingWindowProgress");
let loadingWindowText = win.querySelector("#loadingWindowText");

// 提示信息
let text = [
  "打开游戏菜单之后，游戏是暂停的，你可以在这时思考下战斗策略",
  "记得出门带着矿工锄和采药铲，或许能从其中赚点小钱",
  "职业、信仰、技能，都可以任意改变，但是必须付出代价",
  "你的信仰决定了神对你的祝福，还有某些人或者组织对你的看法",
  "信仰是可以改变的，不过艾利韦斯的居民并不喜欢总是改变自己信仰的人",
  "艾利韦斯信仰自由，没有信仰也是一种信仰，但是你享受不到任何神的祝福"
];

win.assign("begin", () => {
  loadingWindowProgress.innerHTML = "";
  // 随机一个提示
  loadingWindowText.textContent = text[Math.floor(Math.random() * text.length)];
  win.show();
});

win.assign("update", (value) => {
  loadingWindowProgress.innerHTML = value;
});

win.assign("end", () => {
  win.hide();
});
