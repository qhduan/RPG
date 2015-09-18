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

  let win = Game.Window.create("status");

  win.html = `
    <div class="window-box">
      <div id="statusWindowItemBar">
        <button id="statusWindowClose" class="brownButton">关闭</button>
        <button id="statusWindowInventory" class="brownButton">物品</button>
        <label id="heroName"></label>
      </div>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td id="statusWindowTable">
            <label id="heroHP"></label>
            <label id="heroSP"></label>
            <label id="heroLevel"></label>
            <label id="heroEXP"></label>
            <label id="heroSTR"></label>
            <label id="heroDEX"></label>
            <label id="heroCON"></label>
            <label id="heroINT"></label>
            <label id="heroCHA"></label>
            <label id="heroATK"></label>
            <label id="heroDEF"></label>
            <label id="heroMATK"></label>
            <label id="heroMDEF"></label>
          </td>
          <td style="width: 50%;">
            <table id="statusWindowEquipmentTable" border="1" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td class="statusWindowEquipmentText">头部</td>
                  <td id="equipment-head"></td>
                  <td style="width: 60px;"><button id="equipmentButton-head" class="brownButton">卸下</button></td>
                </tr>
                <tr>
                  <td class="statusWindowEquipmentText">身体</td>
                  <td id="equipment-body"></td>
                  <td><button id="equipmentButton-body" class="brownButton">卸下</button></td>
                </tr>
                <tr>
                  <td class="statusWindowEquipmentText">足部</td>
                  <td id="equipment-feet"></td>
                  <td><button id="equipmentButton-feet" class="brownButton">卸下</button></td>
                </tr>
                <tr>
                  <td class="statusWindowEquipmentText">武器</td>
                  <td id="equipment-weapon"></td>
                  <td><button id="equipmentButton-weapon" class="brownButton">卸下</button></td>
                </tr>
                <tr>
                  <td class="statusWindowEquipmentText">项链</td>
                  <td id="equipment-neck"></td>
                  <td><button id="equipmentButton-neck" class="brownButton">卸下</button></td>
                </tr>
                <tr>
                  <td class="statusWindowEquipmentText">戒指</td>
                  <td id="equipment-ring"></td>
                  <td><button id="equipmentButton-ring" class="brownButton">卸下</button></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  win.css = `
    #heroName {
      font-size: 24px;
      margin-left: 240px;
    }

    #statusWindowTable {
      width: 50%;
    }

    #statusWindowTable label {
      font-size: 18px;
      margin-left: 80px;
    }

    #statusWindowEquipmentTable button {
      width: 60px;
      height: 40px;
    }

    .statusWindowEquipmentText {
      width: 60px;
      font-size: 20px;
      text-align: center;
    }

    #statusWindow label {
      display: block;
    }

    #statusWindowItemBar button {
      width: 60px;
      height: 40px;
      font-size: 16px;
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 0px;
      margin-bottom: 5px;
      text-align: center;
    }

    #statusWindowClose {
      float: right;
    }

    #statusWindowInventory {
      float: right;
    }

    #statusWindow table {
      width: 100%;
      height: 320px;
    }
  `;

  let statusWindowEquipment = {
    head: document.querySelector("#equipment-head"),
    body: document.querySelector("#equipment-body"),
    feet: document.querySelector("#equipment-feet"),
    weapon: document.querySelector("#equipment-weapon"),
    neck: document.querySelector("#equipment-neck"),
    ring: document.querySelector("#equipment-ring")
  };

  let statusWindowEquipmentButton = {
    head: document.querySelector("#equipmentButton-head"),
    body: document.querySelector("#equipmentButton-body"),
    feet: document.querySelector("#equipmentButton-feet"),
    weapon: document.querySelector("#equipmentButton-weapon"),
    neck: document.querySelector("#equipmentButton-neck"),
    ring: document.querySelector("#equipmentButton-ring")
  };

  let lastSelect = -1;

  Sprite.each(statusWindowEquipmentButton, function (button, key) {
    button.addEventListener("click", function () {
      if (Game.hero.data.equipment[key]) {
        Game.hero.data.equipment[key] = null;
      } else {
        if (key == "weapon") {
          Game.windows.inventory.open("sword|spear|bow");
        } else {
          Game.windows.inventory.open("head|body|feet");
        }
      }
      win.update();
    });
  });

  let heroName = document.querySelector("#heroName");
  let heroHP = document.querySelector("#heroHP")
  let heroSP = document.querySelector("#heroSP");
  let heroLevel = document.querySelector("#heroLevel");
  let heroEXP = document.querySelector("#heroEXP");
  let heroSTR = document.querySelector("#heroSTR");
  let heroDEX = document.querySelector("#heroDEX");
  let heroCON = document.querySelector("#heroCON");
  let heroINT = document.querySelector("#heroINT");
  let heroCHA = document.querySelector("#heroCHA");
  let heroATK = document.querySelector("#heroATK");
  let heroDEF = document.querySelector("#heroDEF");
  let heroMATK = document.querySelector("#heroMATK");
  let heroMDEF = document.querySelector("#heroMDEF");

  let statusWindowClose = document.querySelector("button#statusWindowClose");
  let statusWindowInventory = document.querySelector("button#statusWindowInventory");
  let statusWindowEquipmentTable = document.querySelector("#statusWindowEquipmentTable");

  statusWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.inventory.open();
    }, 20);
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20)
  });

  win.register("update", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    heroName.textContent = `名字：${Game.hero.data.name}`;
    heroHP.textContent = `生命力：${Game.hero.data.hp}/${Game.hero.data.$hp}`;
    heroSP.textContent = `精神力：${Game.hero.data.sp}/${Game.hero.data.$sp}`;
    heroLevel.textContent = `等级：${Game.hero.data.level}`;
    heroEXP.textContent = `经验：${Game.hero.data.exp}`;
    heroSTR.textContent = `力量：${Game.hero.data.str}`;
    heroDEX.textContent = `敏捷：${Game.hero.data.dex}`;
    heroCON.textContent = `耐力：${Game.hero.data.con}`;
    heroINT.textContent = `智力：${Game.hero.data.int}`;
    heroCHA.textContent = `魅力：${Game.hero.data.cha}`;
    heroATK.textContent = `攻击：${Game.hero.data.atk}`;
    heroDEF.textContent = `防御：${Game.hero.data.def}`;
    heroMATK.textContent = `魔法攻击：${Game.hero.data.matk}`;
    heroMDEF.textContent = `魔法防御：${Game.hero.data.mdef}`;

    let lines = statusWindowEquipmentTable.querySelectorAll("tr");
    for (let i = 0; i < lines.length; i++) {
      if (select == i) {
        lines[i].style.backgroundColor = "green";
      } else {
        lines[i].style.backgroundColor = "";
      }
    }

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      let button = statusWindowEquipmentButton[key];

      if (element) {
        let line = "";
        line += `<img alt="" src="${Game.items[element].icon.src}">`;
        line += `<span>${Game.items[element].data.name}</span>`;
        statusWindowEquipment[key].innerHTML = line;
        button.textContent = "卸下";
      } else {
        statusWindowEquipment[key].innerHTML = "";
        button.textContent = "装备";
      }
    });
  });

  win.whenUp(["enter"], function () {
    let buttons = statusWindowEquipmentTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    let count = statusWindowEquipmentTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        let select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        let select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  win.register("open", function (select) {
    win.update(select);
    win.show();
  });


})();
