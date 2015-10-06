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

  let win = Game.windows.register = Game.Window.create("registerWindow");

  win.html = `
        <div style="position: fixed; height: 250px; width: 64px; left: 50px; top: 70px;">
          <label id="loading">正在载入预览</label>
          <br>
          <canvas id="registerPreview" width="64" height="250"></canvas>
        </div>

        <div style="overflow-y: scroll; height: 100%; position: fixed; width: 100%;">
          <div>
            <label>
            性别
            </label>
            <select onchange="SelectHero(event)" data-type="sex" class="">
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>

          <div>
            <label>
            皮肤
            </label>
            <select onchange="SelectHero(event)" data-type="body" class="">
              <option value="light">粉白</option>
              <option value="dark">深色</option>
              <option value="dark2">更深</option>
              <option value="tanned">黄白</option>
              <option value="tanned2">黄灰</option>
            </select>
          </div>

          <div>
            <label>
            眼睛
            </label>
            <select onchange="SelectHero(event)" data-type="eyes" class="">
              <option value="blue">蓝色</option>
              <option value="brown">棕色</option>
              <option value="gray">灰色</option>
              <option value="green">绿色</option>
              <option value="orange">橙色</option>
              <option value="purple">紫色</option>
              <option value="red">红色</option>
              <option value="yellow">黄色</option>
            </select>
          </div>

          <div id="customMaleHair">
            <label>
            头发
            </label>
            <select onchange="SelectHero(event)" data-type="hair" class="">
              <option value="">无</option>
              <option value="bedhead">Bedhead</option>
              <option value="long">Long</option>
              <option value="longhawk">Longhawk</option>
              <option value="messy1">messy1</option>
              <option value="messy2">messy2</option>
              <option value="mohawk">Mohawk</option>
              <option value="page">Page</option>
              <option value="parted">Parted</option>
              <option value="plain">Plain</option>
              <option value="shorthawk">Shorthawk</option>
            </select>
          </div>

          <div id="customFemaleHair" style="display: none;">
            <label>
            头发
            </label>
            <select onchange="SelectHero(event)" data-type="hair" class="">
              <option value="">无</option>
              <option value="bangs">bangs</option>
              <option value="bangslong">bangslong</option>
              <option value="bangslong2">bangslong2</option>
              <option value="bunches">bunches</option>
              <option value="loose">loose</option>
              <option value="pixie">pixie</option>
              <option value="ponytail">ponytail</option>
              <option value="ponytail2">ponytail2</option>
              <option value="princess">princess</option>
              <option value="shoulderl">shoulderl</option>
              <option value="shoulderr">shoulderr</option>
              <option value="swoop">swoop</option>
              <option value="unkempt">unkempt</option>
            </select>
          </div>

          <div>
            <label>
            发色
            </label>
            <select onchange="SelectHero(event)" data-type="haircolor" class="">
              <option value="black">Black</option>
              <option value="blonde">Blonde</option>
              <option value="blonde2">blonde2</option>
              <option value="blue">blue</option>
              <option value="blue2">blue2</option>
              <option value="brown">brown</option>
              <option value="brown2">brown2</option>
              <option value="brunette">brunette</option>
              <option value="brunette2">brunette2</option>
              <option value="dark-blonde">dark-blonde</option>
              <option value="gold">gold</option>
              <option value="gray">gray</option>
              <option value="gray2">gray2</option>
              <option value="green">green</option>
              <option value="green2">green2</option>
              <option value="light-blonde">light-blonde</option>
              <option value="light-blonde2">light-blonde2</option>
              <option value="pink">pink</option>
              <option value="pink2">pink2</option>
              <option value="purple">purple</option>
              <option value="raven">raven</option>
              <option value="raven2">raven2</option>
              <option value="redhead">redhead</option>
              <option value="redhead2">redhead2</option>
              <option value="ruby-red">ruby-red</option>
              <option value="white">white</option>
              <option value="white-blonde">white-blonde</option>
              <option value="white-blonde2">white-blonde2</option>
              <option value="white.centerYan">white.centerYan</option>
            </select>
          </div>

          <div>
            <label>
            帽子
            </label>
            <select onchange="SelectHero(event)" data-type="head" class="">
              <option value="">无</option>
              <option value="chainhat">chainhat</option>
              <option value="chain_hood">chain_hood</option>
              <option value="cloth_hood">cloth_hood</option>
              <option value="leather_cap">leather_cap</option>
              <option value="red">red</option>
            </select>
          </div>

          <div>
            <label>
            上衣
            </label>
            <select onchange="SelectHero(event)" data-type="shirts" class="">
              <option value="">无</option>
              <option value="brown">brown</option>
              <option value="maroon">maroon</option>
              <option value="teal">teal</option>
              <option value="white">white</option>
            </select>
          </div>

          <div>
            <label>
            裤子
            </label>
            <select onchange="SelectHero(event)" data-type="pants" class="">
              <option value="">无</option>
              <option value="magenta">magenta</option>
              <option value="red">red</option>
              <option value="teal">teal</option>
              <option value="white">white</option>
            </select>
          </div>

          <div>
            <label>
            鞋子
            </label>
            <select onchange="SelectHero(event)"  data-type="shoes" class="">
              <option value="">无</option>
              <option value="black">black</option>
              <option value="brown">brown</option>
              <option value="maroon">maroon</option>
            </select>
          </div>

          <div>
            <label>
            头盔
            </label>
            <select onchange="SelectHero(event)" data-type="armorhelms" class="">
              <option value="">无</option>
              <option value="golden">黄金</option>
              <option value="metal">白银</option>
            </select>
          </div>

          <div>
            <label>
            胸甲
            </label>
            <select onchange="SelectHero(event)" data-type="armorchest" class="">
              <option value="">无</option>
              <option value="golden">黄金</option>
              <option value="metal">白银</option>
            </select>
          </div>

          <div>
            <label>
            臂甲
            </label>
            <select onchange="SelectHero(event)" data-type="armorarm" class="">
              <option value="">无</option>
              <option value="golden">黄金</option>
              <option value="metal">白银</option>
            </select>
          </div>

          <div>
            <label>
            腿甲
            </label>
            <select onchange="SelectHero(event)" data-type="armorlegs" class="">
              <option value="">无</option>
              <option value="golden">黄金</option>
              <option value="metal">白银</option>
            </select>
          </div>

          <div>
            <label>
            足甲
            </label>
            <select onchange="SelectHero(event)" data-type="armorfeet" class="">
              <option value="">无</option>
              <option value="golden">黄金</option>
              <option value="metal">白银</option>
            </select>
          </div>

          <hr>

          <div>
            <label>
            信仰
            </label>
            <select onchange="" class="">
              <option value="">无信仰（没有加成）</option>
              <option value="">魔法之神（智力）</option>
            </select>
          </div>

          <div>
            <label>
            职业
            </label>
            <select onchange="" class="">
              <option value="">剑士</option>
              <option value="">弓箭手</option>
              <option value="">魔法师</option>
              <option value="">牧师</option>
              <option value="">吟游诗人</option>
              <option value="">盗贼</option>
              <option value="">商人</option>
            </select>
          </div>

          <div>
            <input id="registerHeroName" placeholder="名字" type="text">
          </div>

          <div style="padding-bottom: 20px; padding-top: 10px;">
            <button id="registerWindowSubmit" class="brownButton">完成</button>
            <button id="registerWindowBack" class="brownButton">返回</button>
          </div>

        </div>


  `;

  win.css = `

    .registerWindow table, .registerWindow tbody, .registerWindow tr {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    #registerWindowSubmit, #registerWindowBack {
      width: 100px;
      height: 60px;
    }

    .registerWindow {
      text-align: center;
      height: 412px;
      background-color: rgba(240, 217, 194, 0.85);
      border: 20px solid rgba(134, 93, 52, 0.85);
    }

    .registerWindow input {
      width: 240px;
      height: 40px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      text-align: center;
      font-size: 16px;
      background-color: #d5ab63;
      margin: 10px;
    }

    .registerWindow label {
      font-size: 20px;
      color: white;
    }

    .registerWindow select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 200px;
      height: 40px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      text-align: center;
      font-size: 16px;
      background-color: #d5ab63;
      margin: 10px;
    }
  `;

  let registerWindowSubmit = win.querySelector("#registerWindowSubmit");
  let registerWindowBack = win.querySelector("#registerWindowBack");

  registerWindowSubmit.addEventListener("click", function () {
    Game.register.submit();
  });

  registerWindowBack.addEventListener("click", function () {
    win.hide();
    Game.windows.main.show();
  });


})();
