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
    <div id="registerWindowContainer">

      <div id="registerWindowDisplaySelect">

        <div>
          <label>
          性别
          </label>
          <select data-type="sex">
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        <div>
          <label>
          皮肤
          </label>
          <select data-type="body">
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
          <select data-type="eyes">
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
          <select data-type="malehair">
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
          <select data-type="femalehair">
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
          <select data-type="haircolor">
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
          <select data-type="head">
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
          <select data-type="shirts">
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
          <select data-type="pants">
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
          <select  data-type="shoes">
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
          <select data-type="armorhelms">
            <option value="">无</option>
            <option value="golden">黄金</option>
            <option value="metal">白银</option>
          </select>
        </div>

        <div>
          <label>
          胸甲
          </label>
          <select data-type="armorchest">
            <option value="">无</option>
            <option value="golden">黄金</option>
            <option value="metal">白银</option>
          </select>
        </div>

        <div>
          <label>
          臂甲
          </label>
          <select data-type="armorarm">
            <option value="">无</option>
            <option value="golden">黄金</option>
            <option value="metal">白银</option>
          </select>
        </div>

        <div>
          <label>
          腿甲
          </label>
          <select data-type="armorlegs">
            <option value="">无</option>
            <option value="golden">黄金</option>
            <option value="metal">白银</option>
          </select>
        </div>

        <div>
          <label>
          足甲
          </label>
          <select data-type="armorfeet">
            <option value="">无</option>
            <option value="golden">黄金</option>
            <option value="metal">白银</option>
          </select>
        </div>

      </div><!--registerWindowDisplaySelect-->

      <hr>

      <div id="registerWindowPersonal">

        <div>
          <label>
          信仰
          </label>
          <select id="registerWindowBeliefChoice" data-type="belief">
            <option value="None">无信仰</option>
            <option value="Elen">艾琳 - 知识女神</option>
            <option value="Enlon">恩朗 - 死亡主宰</option>
            <option value="Minare">密娜 - 丰收女神</option>
            <option value="Achiel">阿切奥 - 保护之神</option>
            <option value="Racha">拉克 - 魔法女神</option>
            <option value="Aestor">阿斯托 - 盗贼之神</option>
            <option value="Hielach">赫拉克 - 财富之神</option>
            <option value="Alik">阿丽克 - 治愈女神</option>
            <option value="Amarien">阿玛恩 - 力量之神</option>
          </select>
          <div id="registerWindowBelief"></div>
        </div>

        <div>
          <label>
          职业
          </label>
          <select id="registerWindowClassChoice" data-type="class">
            <option value="warrior">战士</option>
            <option value="archer">弓箭手</option>
            <option value="wizard">魔法师</option>
            <option value="priest">牧师</option>
            <option value="bard">吟游诗人</option>
            <option value="thief">盗贼</option>
            <option value="business">商人</option>
          </select>
          <div id="registerWindowClass"></div>
        </div>

        <div style="padding-top: 20px;">
          <input id="registerHeroName" placeholder="名字" type="text">
        </div>

      </div><!--registerWindowPersonal-->

      <div style="padding-bottom: 20px; padding-top: 10px;">
        <button id="registerWindowSubmit" class="brownButton">完成</button>
        <button id="registerWindowBack" class="brownButton">返回</button>
      </div>

    </div>

    <div id="registerWindowDisplay">
      <label id="loading">正在载入预览</label>
      <br>
      <canvas width="64" height="250"></canvas>
    </div>
  `;

  win.css = `

    #registerWindowDisplay {
      position: fixed;
      height: 250px;
      width: 64px;
      left: 80px;
      top: 25px;
      transform: scale(1.4);
      -webkit-transform: scale(1.4);
      transform-origin: left top 0;
      -webkit-transform-origin: left top 0;
    }

    #registerWindowContainer {
       overflow-x: hidden;
       overflow-y: scroll;
       left: 200px;
       top: 20px;
       width: 620px;
       height: 410px;
       position: fixed;
    }

    #registerWindowBelief, #registerWindowClass {
      text-align: center;
      width: 100%;
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

    .registerWindow hr {
      width: 90%;
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
