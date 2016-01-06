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

import Window from "../Window.js";
import html   from "../HTML/Confirm.html";
import "../CSS/Confirm.scss";

export default function Confirm (message) {
  return new Promise((resolve, reject) => {

    let win = Window.create("confirmWindow", html);
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
      throw new Error("Confirm got invalid arguments");
    }


    win.whenUp(["esc"], () => {
      setTimeout( () => {
        confirmWindowNo.click();
      }, 20);
    });

    win.whenUp(["y", "Y"], () => {
      confirmWindowYes.click();
    });

    win.whenUp(["n", "N"], () => {
      confirmWindowNo.click();
    });

    confirmWindowYes.addEventListener("click", () => {
      win.destroy();
      resolve();
    });

    confirmWindowNo.addEventListener("click", () => {
      win.destroy();
      reject();
    });

  });
}
