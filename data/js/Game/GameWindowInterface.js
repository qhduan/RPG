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

(function () {
  "use strict";

  var win = Game.windows["interface"] = Game.Window.create("interfaceWindow");

  win.html = "\n    <div id=\"interfaceWindowBar\"></div>\n\n    <div style=\"position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;\">\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowHP\" style=\"width: 100%; height: 100%; background-color: green;\"></div>\n      </div>\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowSP\" style=\"width: 100%; height: 100%; background-color: blue;\"></div>\n      </div>\n    </div>\n\n    <span id=\"interfaceWindowMap\"></span>\n    <span id=\"interfaceWindowDatetime\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ";

  win.css = "\n\n    #interfaceWindowBar {\n      text-align: center;\n      position: absolute;\n      bottom: 10px;\n      width: 100%;\n      height: 60px;\n    }\n\n    .interfaceWindow {\n      /** 让interface窗口的主要窗口，不接受事件 */\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      margin-left: 3px;\n      margin-right: 3px;\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      /** 让interface窗口的按钮，接受事件 */\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    span#interfaceWindowMap {\n      position: absolute:\n      top: 0px;\n      background-color: rgba(100, 100, 100, 0.7);\n      display: inline-block;\n    }\n\n    span#interfaceWindowDatetime {\n      position: absolute:\n      top: 200px;\n      left: 0;\n      background-color: rgba(100, 100, 100, 0.7);\n      display: inline-block;\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n\n    interfaceWindowButton:disabled {\n      cursor: default;\n      pointer-events: none;\n      background-color: gray;\n      opacity: 0.5;\n    }\n\n    .interfaceWindowButtonText {\n      position: absolute;\n      background-color: white;\n      margin-left: -26px;\n      margin-top: 12px;\n    }\n  ";

  // 使用按钮
  var interfaceWindowUse = win.querySelector("button#interfaceWindowUse");
  // 技能栏按钮组
  var interfaceWindowBar = win.querySelector("div#interfaceWindowBar");
  // 地图信息
  var interfaceWindowMap = win.querySelector("span#interfaceWindowMap");
  // 选项菜单
  var interfaceWindowMenu = win.querySelector("button#interfaceWindowMenu");
  // 玩家的hp
  var interfaceWindowHP = win.querySelector("#interfaceWindowHP");
  // 玩家的sp
  var interfaceWindowSP = win.querySelector("#interfaceWindowSP");

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
  });

  win.whenUp(["esc"], function (key) {
    if (Game.windows["interface"].atop) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  function InitInterfaceBar() {
    var buttonCount = 8;
    var buttonHTML = "";
    for (var i = 0; i < buttonCount; i++) {
      var line = "";
      line += "<button data-index=\"" + i + "\" class=\"interfaceWindowButton\">";
      line += "<label data-index=\"" + i + "\" class=\"interfaceWindowButtonText\"></label>";
      line += "</button>\n";
      buttonHTML += line;
    }
    interfaceWindowBar.innerHTML = buttonHTML;
  }

  setInterval(function () {
    if (Game.hero) {
      Game.hero.data.time++;
      Game.windows["interface"].datetime();
    }
  }, 1000);

  InitInterfaceBar();
  var buttons = win.querySelectorAll(".interfaceWindowButton");
  var buttonTexts = win.querySelectorAll(".interfaceWindowButtonText");

  interfaceWindowBar.addEventListener("click", function (event) {
    var index = event.target.getAttribute("data-index");
    if (index) {
      var element = Game.hero.data.bar[index];
      if (element) {
        if (element.type == "skill") {
          var cooldown = Game.hero.fire(element.id);
          if (cooldown) {
            event.target.disabled = true;
            setTimeout(function () {
              event.target.disabled = false;
            }, cooldown);
          }
        } else if (element.type == "item") {
          var itemId = element.id;
          var item = Game.items[itemId];
          item.heroUse();
          Game.windows["interface"].refresh();
        }
      }
    }
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    var num = parseInt(key);
    if (Number.isInteger(num) && num >= 0 && num < buttons.length) {
      buttons[num - 1].click();
    }
  });

  win.whenUp(["e", "E", "space", "enter"], function (key) {
    if (Game.windows["interface"].showing) {
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

  win.assign("status", function () {
    if (Game.hero) {
      var hp = Game.hero.data.hp / Game.hero.data.$hp;
      var sp = Game.hero.data.sp / Game.hero.data.$sp;
      interfaceWindowHP.style.width = hp * 100 + "%";
      interfaceWindowSP.style.width = sp * 100 + "%";
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
      var YEARMIN = 60 * 24 * 30 * 12;
      var MONTHMIN = 60 * 24 * 30;
      var DAYMIN = 60 * 24;
      var HOURMIN = 60;
      var datetime = win.querySelector("span#interfaceWindowDatetime");
      var time = Game.hero.data.time;
      var year = Math.floor(time / YEARMIN);
      time = time % YEARMIN;
      var month = Math.floor(time / MONTHMIN);
      time = time % MONTHMIN;
      var day = Math.floor(time / DAYMIN);
      time = time % DAYMIN;
      var hour = Math.floor(time / HOURMIN);
      time = time % HOURMIN;
      var minute = time;
      year++;
      month++;
      day++;
      hour = hour.toString();
      while (hour.length < 2) hour = "0" + hour;
      minute = minute.toString();
      while (minute.length < 2) minute = "0" + minute;
      datetime.textContent = "帝国历" + year + "年" + month + "月" + day + "日 " + hour + ":" + minute;

      if (hour >= 20 || hour < 4) {
        // 20:00 to 4:00
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

  win.assign("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var button = buttons[i];
      var text = buttonTexts[i];

      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          button.style.backgroundImage = "url(\"" + skill.icon.src + "\")";
          text.textContent = skill.data.cost;
        } else if (type == "item") {
          var item = Game.items[id];
          button.style.backgroundImage = "url(\"" + item.icon.src + "\")";
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

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();
//# sourceMappingURL=GameWindowInterface.js.map
