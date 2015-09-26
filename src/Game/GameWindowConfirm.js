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

  let internal = Sprite.Namespace();

  let confirmHTML = `
  <div class="window-box">
    <div style="width: 100%; height: 100%;">
      <table>
        <tr><td><span id="confirmWindowMessage"></span></td></tr>
        <tr><td>
          <button id="confirmWindowYes" class="brownButton">确定</button>
          <button id="confirmWindowNo" class="brownButton">取消</button>
        </td></tr>
      </table>
    </div>
  </div>
  `;

  let confirmCSS = `
    .confirmWindow {
      text-align: center;
    }

    .confirmWindow table {
      width: 100%;
      height: 100%;
    }

    .confirmWindow span {
      font-size: 16px;
    }

    .confirmWindow button {
      width: 100px;
      height: 60px;
      font-size: 16px;
      margin: 20px;
    }

    #confirmWindowMessage {
      color: black;
      font-size: 20px;
    }
  `;

  Game.assign("confirm", function (message, yes, no) {

    let win = Game.Window.create("confirmWindow");
    win.html = confirmHTML;
    win.css = confirmCSS;
    win.show();

    let confirmWindowMessage = win.querySelector("#confirmWindowMessage");
    let confirmWindowYes = win.querySelector("#confirmWindowYes");
    let confirmWindowNo = win.querySelector("#confirmWindowNo");

    if (typeof message == "string") {
      confirmWindowMessage.textContent = message;
    } else if (message.message) {
      confirmWindowMessage.textContent = message.message;
      if (message.yes) {
        confirmWindowYes.textContent = message.yes;
      }
      if (message.no) {
        confirmWindowNo.textContent = message.no;
      }
    } else {
      console.error(message, yes, no);
      throw new Error("Game.confirm got invalid arguments");
    }


    win.whenUp(["esc"], function () {
      setTimeout(function () {
        confirmWindowNo.click();
      }, 20);
    });

    win.whenUp(["y", "Y"], function () {
      confirmWindowYes.click();
    });

    win.whenUp(["n", "N"], function () {
      confirmWindowNo.click();
    });

    confirmWindowYes.addEventListener("click", function () {
      win.destroy();
      if (yes) {
        yes();
      }
    });

    confirmWindowNo.addEventListener("click", function () {
      win.destroy();
      if (no) {
        no();
      }
    });
  });


})();
