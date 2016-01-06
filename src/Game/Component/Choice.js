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


import css from "../CSS/Choice.scss";
import html from "../HTML/Choice.html";

export default function Choice (options) {
  return new Promise( (resolve, reject) => {

    let win = Window.create("choiceWindow");
    win.css = css;
    win.html = html;
    win.show();

    let choiceWindowButtonContainer = win.querySelector("#choiceWindowButtonContainer");
    let choiceWindowNo = win.querySelector("#choiceWindowNo");
    let buttonArray = [];

    Object.keys(options).forEach(key => {
      let value = options[key];
      
      let button = document.createElement("button");
      button.textContent = `${buttonArray.length+1}. ${key}`;
      button.classList.add("brownButton");

      choiceWindowButtonContainer.appendChild(button);
      buttonArray.push(button);

      button.addEventListener("click", () => {
        win.hide();
        win.destroy();
        resolve(value)
      });
    });

    choiceWindowNo.addEventListener("click", () => {
      win.hide();
      win.destroy();
      resolve(null)
    });

    win.whenUp(["esc"], () => {
      setTimeout( () => {
        choiceWindowNo.click();
      }, 20);
    });

    win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], (key) => {
      // match 1 to 9
      let num = parseInt(key) - 1; // get 0 to 8
      let element = buttonArray[num];
      if (element) {
        element.click();
      }
    });

  });
};
