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

  let choiceHTML = `
    <div class="window-box">
      <button id="choiceWindowNo" class="brownButton">取消</button>
      <div style="width: 100%; height: 100%;">
        <div style="height: 370px; overflow-y: auto; text-align: center;">
          <table id="choiceWindowTable" style="width: 100%; height: 370px;">
            <tbody>
              <tr>
                <td id="choiceWindowButtonContainer">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  let choiceCSS = `
    .choiceWindow {
      text-align: center;
    }

    .choiceWindow div {
      text-align: center;
    }

    button#choiceWindowNo {
      position: absolute;
      right: 100px;
      top: 50px;
      width: 100px;
      height: 60px;
      font-size: 30px;
    }

    #choiceWindowTable button {
      margin: 5px auto;
      min-width: 300px;
      min-height: 60px;
      font-size: 30px;
      display: block;
    }
  `;

  Game.choice = function (options, callback) {

    let win = Game.Window.create("choiceWindow");
    win.html = choiceHTML;
    win.css = choiceCSS;
    win.show();

    let choiceWindowButtonContainer = win.querySelector("#choiceWindowButtonContainer");
    let choiceWindowNo = win.querySelector("#choiceWindowNo");
    let buttonArray = [];

    Sprite.each(options, function (value, key) {
      let button = document.createElement("button");
      button.textContent = `${buttonArray.length+1}. ${key}`;
      button.classList.add("brownButton");

      choiceWindowButtonContainer.appendChild(button);
      buttonArray.push(button);

      button.addEventListener("click", function () {
        win.hide();
        win.destroy();
        if (callback) {
          callback(value);
        }
      });
    });

    choiceWindowNo.addEventListener("click", function () {
      win.hide();
      win.destroy();
      if (callback) {
        callback(null);
      }
    });

    win.whenUp(["esc"], function () {
      setTimeout(function () {
        choiceWindowNo.click();
      }, 20);
    });

    win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
      // match 1 to 9
      let num = parseInt(key) - 1; // get 0 to 8
      let element = buttonArray[num];
      if (element) {
        element.click();
      }
    });

  };

})();
