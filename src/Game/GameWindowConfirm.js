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

  let win = Game.Window.create("confirm");

  win.html = `
    <div style="width: 100%; height: 100%; background-color: rgba(100, 100, 100, 0.8);">
      <table>
        <tr><td><span id="confirmWindowMessage"></span></td></tr>
        <tr><td>
          <button id="confirmWindowYes">确定</button>
          <button id="confirmWindowNo">取消</button>
        </td></tr>
      </table>
    </div>
  `;

  win.css = `
    #confirmWindow {
      text-align: center;
    }

    #confirmWindow table {
      width: 100%;
      height: 100%;
    }

    #confirmWindow span {
      font-size: 16px;
    }

    #confirmWindow button {
      width: 100px;
      height: 60px;
      font-size: 16px;
      margin: 20px;
    }
  `;


  var confirmHandle = null;

  Game.confirm = function (message, callback) {
    document.getElementById("confirmWindowMessage").textContent = message;
    confirmHandle = callback;
    Game.windows.confirm.show();
  };

  document.querySelector("button#confirmWindowYes").addEventListener("click", function () {
    Game.windows.confirm.hide();
    if (typeof confirmHandle == "function") {
      confirmHandle(true);
    }
  });

  document.querySelector("button#confirmWindowNo").addEventListener("click", function () {
    Game.windows.confirm.hide();
    if (typeof confirmHandle == "function") {
      confirmHandle(false);
    }
  });

}());
