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

  let win = Game.windows.over = Game.Window.create("overWindow");

  win.html = `
    <div class="window-box">
      <button id="overWindowClose" class="brownButton">返回主菜单</button>
      <table><tbody><tr><td>
        <div>
          <h1 id="overWindowMessage"></h1>
          <h2 id="overWindowReason"></h2>
        </div>
      </td></tr></tbody></table>
    </div>
  `;

  win.css = `
    .overWindow table, .overWindow tbody, .overWindow tr, .overWindow td {
      width: 100%;
      height: 100%;
      magrin: 0;
      padding: 0;
    }

    .overWindow {
      text-align: center;
    }

    #overWindowClose {
      position: absolute;
      right: 50px;
      top: 50px;
      width: 120px;
      height: 60px;
      font-size: 16px;
    }

    #overWindowMap img, #overWindowMap canvas {
      max-width: 700px;
      max-height: 320px;
    }
  `;

  let overWindowMessage = win.querySelector("#overWindowMessage");
  let overWindowReason = win.querySelector("#overWindowReason");

  let deadText = [
    "不幸的事情终于发生了……即便你的内心曾对神灵祈祷",
    "不幸的事情终于发生了……你就知道自己今天不应该穿白色的袜子",
    "不幸的事情终于发生了……明明还没有体验过天伦之乐",
    "不幸的事情终于发生了……你的墓碑上写着：“下次不能随便踢小动物”",
    "不幸的事情终于发生了……你感觉自己的身体变轻了…轻了…轻了…",
    "不幸的事情终于发生了……你摸了摸自己的脖子，似乎找不到脑袋了，于是你一赌气",
    "不幸的事情终于发生了……你的墓碑上写着：“下次再也不把治疗药水借给别人了”",
    "不幸的事情终于发生了……曾经有一瓶治疗药水摆在你面前，而你没有珍惜"
  ];

  win.assign("open", function (reason) {
    if (reason) {
      overWindowReason.textContent = reason;
    } else {
      overWindowReason.innerHTML = "";
    }
    overWindowMessage.textContent = deadText[Math.floor(Math.random() * deadText.length)];
    win.show();
  });

  overWindowClose.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });


})();
