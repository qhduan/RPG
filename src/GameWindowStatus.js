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
      <button id="statusWindowClose">关闭</button>
      <button id="statusWindowInventory">物品</button>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
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
          <td>
            <table border="1" cellspacing="0" cellpadding="0">
              <tr>
                <td>头部</td>
                <td id="equipment-head"></td>
              </tr>
              <tr>
                <td>身体</td>
                <td id="equipment-body"></td>
              </tr>
              <tr>
                <td>足部</td>
                <td id="equipment-feet"></td>
              </tr>
              <tr>
                <td>武器</td>
                <td id="equipment-weapon"></td>
              </tr>
              <tr>
                <td>项链</td>
                <td id="equipment-neck"></td>
              </tr>
              <tr>
                <td>戒指</td>
                <td id="equipment-ring"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `);

  win.css(`
    #statusWindow label {
      display: block;
    }

    #statusWindow button {
      width: 60px;
      height: 40px;
      font-size: 16px;
    }

    #statusWindow table {
      width: 100%;
      height: 360px;
    }
  `);

  document.querySelector("button#statusWindowClose").addEventListener("click", function (event) {
    Game.windows.status.hide();
  });

  document.querySelector("button#statusWindowInventory").addEventListener("click", function (event) {
    Game.windows.inventory.excute("open");
  });

  win.register("open", function () {
    document.getElementById("heroName").textContent = `名字：${Game.hero.data.name}`;
    document.getElementById("heroHP").textContent = `生命力：${Game.hero.data.hp}/${Game.hero.data.$hp}`;
    document.getElementById("heroSP").textContent = `精神力：${Game.hero.data.sp}/${Game.hero.data.$sp}`;
    document.getElementById("heroLevel").textContent = `等级：${Game.hero.data.level}`;
    document.getElementById("heroEXP").textContent = `经验：${Game.hero.data.exp}`;
    document.getElementById("heroSTR").textContent = `力量：${Game.hero.data.str}`;
    document.getElementById("heroDEX").textContent = `敏捷：${Game.hero.data.dex}`;
    document.getElementById("heroCON").textContent = `耐力：${Game.hero.data.con}`;
    document.getElementById("heroINT").textContent = `智力：${Game.hero.data.int}`;
    document.getElementById("heroCHA").textContent = `魅力：${Game.hero.data.cha}`;
    document.getElementById("heroATK").textContent = `攻击：${Game.hero.data.atk}`;
    document.getElementById("heroDEF").textContent = `防御：${Game.hero.data.def}`;
    document.getElementById("heroMATK").textContent = `魔法攻击：${Game.hero.data.matk}`;
    document.getElementById("heroMDEF").textContent = `魔法防御：${Game.hero.data.mdef}`;

    Sprite.Util.each(Game.hero.data.equipment, function (element, key) {
      if (!element) return;
      var dom = document.getElementById(`equipment-${key}`);
      while (dom.hasChildNodes())
        dom.removeChild(dom.lastChild);
      dom.appendChild(Game.items[element].icon);
      var text = document.createElement("span");
      text.textContent = Game.items[element].data.name;
      dom.appendChild(text);
    });

    Game.windows.status.show();
  });

}());
