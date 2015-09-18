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

  let win = Game.Window.create("interface");

  win.html = `
    <div id="interfaceWindowBar"></div>

    <div style="position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;">
      <div style="width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;">
        <div id="interfaceWindowHP" style="width: 100%; height: 100%; background-color: green;"></div>
      </div>
      <div style="width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;">
        <div id="interfaceWindowSP" style="width: 100%; height: 100%; background-color: blue;"></div>
      </div>
    </div>

    <span id="interfaceWindowMap"></span>
    <span id="interfaceWindowDatetime"></span>

    <button id="interfaceWindowUse" class="interfaceWindowButton"></button>
    <button id="interfaceWindowMenu" class="interfaceWindowButton"></button>
  `;

  win.css = `

    #interfaceWindowBar {
      text-align: center;
      position: absolute;
      bottom: 10px;
      width: 100%;
      height: 60px;
    }

    #interfaceWindow {
      /** 让interface窗口的主要窗口，不接受事件 */
      pointer-events: none;
    }

    button.interfaceWindowButton {
      margin-left: 3px;
      margin-right: 3px;
      width: 60px;
      height: 60px;
      border: 4px solid gray;
      border-radius: 10px;
      background-color: rgba(100, 100, 100, 0.5);
      display: inline-block;
      /** 让interface窗口的按钮，接受事件 */
      pointer-events: auto;
      background-repeat: no-repeat;
      background-size: cover;
    }

    button.interfaceWindowButton:hover {
      opacity: 0.5;
    }

    button.interfaceWindowButton > img {
      width: 100%;
      height: 100%;
    }

    span#interfaceWindowMap {
      position: absolute:
      top: 0px;
      background-color: rgba(100, 100, 100, 0.7);
      display: inline-block;
    }

    span#interfaceWindowDatetime {
      position: absolute:
      top: 200px;
      left: 0;
      background-color: rgba(100, 100, 100, 0.7);
      display: inline-block;
    }

    button#interfaceWindowUse {
      position: absolute;
      top: 5px;
      right: 85px;
      visibility: hidden;
      background-image: url("image/hint.png");
    }

    button#interfaceWindowMenu {
      position: absolute;
      top: 5px;
      right: 5px;
      background-image: url("image/setting.png");
    }

    button.interfaceWindowButton:disabled {
      cursor: default;
      pointer-events: none;
      background-color: gray;
      opacity: 0.5;
    }
  `;

  let interfaceWindowUse = document.querySelector("button#interfaceWindowUse");

  win.assign("hideUse", function () {
    interfaceWindowUse.style.visibility = "hidden";
  });

  win.assign("showUse", function () {
    interfaceWindowUse.style.visibility = "visible";
  });

  win.on("active", function () {
    Game.start();
  });

  win.on("deactive", function () {
    Game.pause();
  })

  let interfaceWindowBar = document.querySelector("div#interfaceWindowBar");

  let interfaceWindowMap = document.querySelector("span#interfaceWindowMap");
  let interfaceWindowMenu = document.querySelector("button#interfaceWindowMenu");

  win.whenUp(["esc"], function (key) {
    if (Game.windows.interface.atop) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  // 设置技能栏
  for (let i = 0; i < 8; i++) {
    (function (index) {
      let button = document.createElement("button");
      button.id = `interfaceWindowButton-${index}`;
      button.classList.add("interfaceWindowButton");
      interfaceWindowBar.appendChild(button);

      let text = document.createElement("label");
      text.id = `interfaceWindowButtonText-${index}`;
      text.style.position = "absolute";
      text.style.backgroundColor = "white";
      text.style.marginLeft = "-26px";
      text.style.marginTop = "12px";
      button.appendChild(text);

      button.addEventListener("click", function (event) {
        let element = Game.hero.data.bar[index];
        if (element) {
          if (element.type == "skill")
            Game.hero.fire(element.id);
          else if (element.type == "item") {
            let itemId = element.id;
            let item = Game.items[itemId];
            item.use(Game.hero);
            Game.hero.data.items[itemId]--;
            if (Game.hero.data.items[itemId] <= 0) {
              delete Game.hero.data.items[itemId];
              Game.hero.data.bar[index] = null;
            }
            Game.windows.interface.refresh();
          }
        }
      });
    })(i);
  }

  function SkillFire (num) {
    let element = Game.hero.data.bar[num];
    if (element) {
      if (element.type == "skill") {
        let cooldown = Game.hero.fire(element.id);
        let button = document.querySelector(`#interfaceWindowButton-${num}`);
        button.disabled = true;
        setTimeout(function () {
          button.disabled = false;
        }, cooldown);
        //button.style.disabled = "true";
      } else if (element.type == "item") {

      }
    }
  }

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    let num = parseInt(key);
    // 只有在interface窗口是only存在的时候才使用快捷键
    if (Number.isInteger(num) && Game.windows.interface.atop) {
      SkillFire(num - 1);
    }
  });

  win.whenUp(["e", "E", "space", "enter"], function (key) {
    if (Game.windows.interface.showing) {
      if (Game.hintObject && Game.hintObject.heroUse) {
        Game.hintObject.heroUse();
      }
    }
  });

  interfaceWindowUse.addEventListener("click", function (event) {
    if (Game.hintObject && Game.hintObject.heroUse) {
      Game.hintObject.heroUse();
    }
  });

  let interfaceWindowHP = document.querySelector("#interfaceWindowHP");
  let interfaceWindowSP = document.querySelector("#interfaceWindowSP");

  win.assign("status", function () {
    if (Game.hero) {
      let hp = Game.hero.data.hp / Game.hero.data.$hp;
      let sp = Game.hero.data.sp / Game.hero.data.$sp;
      interfaceWindowHP.style.width = `${hp*100}%`;
      interfaceWindowSP.style.width = `${sp*100}%`;
      if (hp >= 0.5) {
        interfaceWindowHP.style.backgroundColor = "green";
      } else if (hp >= 0.25) {
        interfaceWindowHP.style.backgroundColor = "yellow";
      } else {
        interfaceWindowHP.style.backgroundColor = "red";
      }
    }
  });

  win.assign("datetime", function () {
    if (Game.hero && Game.hero.data && Number.isInteger(Game.hero.data.time)) {
      let YEARMIN = 60*24*30*12;
      let MONTHMIN = 60*24*30;
      let DAYMIN = 60*24;
      let HOURMIN = 60;
      let datetime = document.querySelector("span#interfaceWindowDatetime");
      let time = Game.hero.data.time;
      let year = Math.floor(time/YEARMIN);
      time = time % YEARMIN;
      let month = Math.floor(time/MONTHMIN);
      time = time % MONTHMIN;
      let day = Math.floor(time/DAYMIN);
      time = time % DAYMIN;
      let hour = Math.floor(time/HOURMIN);
      time = time % HOURMIN;
      let minute = time;
      year++;
      month++;
      day++;
      hour = hour.toString();
      while (hour.length < 2) hour = "0"+hour;
      minute = minute.toString();
      while (minute.length < 2) minute = "0"+minute;
      datetime.textContent = `帝国历${year}年${month}月${day}日 ${hour}:${minute}`;

      if (hour >= 20 || hour < 4) { // 20:00 to 4:00
        Game.stage.filter("brightness", -0.15);
      } else if (hour >= 4 && hour < 6) {
        Game.stage.filter("brightness", -0.1);
      } else if (hour >= 6 && hour < 8) {
        Game.stage.filter("brightness", -0.05);
      } else if (hour >= 8 && hour < 10) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 10 && hour < 12) {
        Game.stage.filter("brightness", 0.05);
      } else if (hour >= 12 && hour < 14) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 14 && hour < 16) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 16 && hour < 18) {
        Game.stage.filter("brightness", -0.05);
      } else if (hour >= 18 && hour < 20) {
        Game.stage.filter("brightness", -0.1);
      }

    }
  });

  setInterval(function () {
    if (Game.hero) {
      Game.hero.data.time++;
      Game.windows.interface.datetime();
    }
  }, 1000);

  win.assign("refresh", function () {
    for (let i = 0; i < 8; i++) {
      let element = Game.hero.data.bar[i];
      let button = document.querySelector(`#interfaceWindowButton-${i}`);
      let text = document.querySelector(`#interfaceWindowButtonText-${i}`);

      if (element) {
        let id = element.id;
        let type = element.type;
        if (type == "skill") {
          let skill = Game.skills[id];
          button.style.backgroundImage = `url("${skill.icon.src}")`;
          text.textContent = skill.data.cost;
        } else if (type == "item") {
          let item = Game.items[id];
          button.style.backgroundImage = `url("${item.icon.src}")`;
          text.textContent = Game.hero.data.items[id];
        }
      } else {
        // empty bar element
        text.textContent = "";
        button.style.backgroundImage = "";
      }
    }

    interfaceWindowMap.textContent = Game.area.map.data.name;
  });

  win.on("beforeShow", function () {
    Game.windows.interface.refresh();
  });

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });


})();
