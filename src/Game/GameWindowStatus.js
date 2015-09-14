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

  var win = Game.windows.status = new Game.Window("statusWindow");

  win.html(`
    <div class="window-box">
      <div id="statusWindowItemBar">
        <button id="statusWindowClose" class="brownButton">关闭</button>
        <button id="statusWindowInventory" class="brownButton">物品</button>
      </div>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="width: 60%;">
            <label id="heroName"></label>
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
          <td style="width: 40%;">
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
  `);

  win.css(`
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
    }

    #statusWindowClose {
      float: right;
    }

    #statusWindowInventory {
      float: right;
    }

    #statusWindow table {
      width: 100%;
      height: 360px;
    }
  `);

  var statusWindowEquipment = {
    head: document.querySelector("#equipment-head"),
    body: document.querySelector("#equipment-body"),
    feet: document.querySelector("#equipment-feet"),
    weapon: document.querySelector("#equipment-weapon"),
    neck: document.querySelector("#equipment-neck"),
    ring: document.querySelector("#equipment-ring")
  };

  var statusWindowEquipmentButton = {
    head: document.querySelector("#equipmentButton-head"),
    body: document.querySelector("#equipmentButton-body"),
    feet: document.querySelector("#equipmentButton-feet"),
    weapon: document.querySelector("#equipmentButton-weapon"),
    neck: document.querySelector("#equipmentButton-neck"),
    ring: document.querySelector("#equipmentButton-ring")
  };

  Sprite.each(statusWindowEquipmentButton, function (button, key) {
    button.addEventListener("click", function () {
      if (Game.hero.data.equipment[key]) {
        Game.hero.data.equipment[key] = null;
        Game.windows.status.execute("update");
      }
    });
  });

  var heroName = document.getElementById("heroName");
  var heroHP = document.getElementById("heroHP")
  var heroSP = document.getElementById("heroSP");
  var heroLevel = document.getElementById("heroLevel");
  var heroEXP = document.getElementById("heroEXP");
  var heroSTR = document.getElementById("heroSTR");
  var heroDEX = document.getElementById("heroDEX");
  var heroCON = document.getElementById("heroCON");
  var heroINT = document.getElementById("heroINT");
  var heroCHA = document.getElementById("heroCHA");
  var heroATK = document.getElementById("heroATK");
  var heroDEF = document.getElementById("heroDEF");
  var heroMATK = document.getElementById("heroMATK");
  var heroMDEF = document.getElementById("heroMDEF");

  var statusWindowClose = document.querySelector("button#statusWindowClose");
  var statusWindowInventory = document.querySelector("button#statusWindowInventory");

  statusWindowClose.addEventListener("click", function (event) {
    Game.windows.status.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    Game.windows.status.hide();
    Game.windows.inventory.execute("open");
  });

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows.status.showing) {
      statusWindowClose.click();
    }
  });

  win.register("update", function () {

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

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      var dom = statusWindowEquipment[key];
      while (dom.hasChildNodes())
        dom.removeChild(dom.lastChild);

      var button = statusWindowEquipmentButton[key];

      if (element) {
        dom.appendChild(Game.items[element].icon);
        var text = document.createElement("span");
        text.textContent = Game.items[element].data.name;
        dom.appendChild(text);
        button.style.visibility = "visible";
      } else {
        button.style.visibility = "hidden";
      }
    });
  });

  win.register("open", function () {
    Game.windows.status.execute("update");
    Game.windows.status.show();
  });

}());
