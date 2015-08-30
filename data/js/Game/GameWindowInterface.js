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

  var win = Game.windows["interface"] = new Game.Window("interfaceWindow");

  win.html("\n    <div style=\"text-align: center; position: absolute; bottom: 10px; width: 100%; height: 60px;\">\n      <button id=\"interfaceWindowButton-0\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-1\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-2\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-3\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-4\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-5\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-6\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-7\" class=\"interfaceWindowButton\"></button>\n    </div>\n\n    <div style=\"position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;\">\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowHP\" style=\"width: 100%; height: 100%; background-color: green;\"></div>\n      </div>\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowSP\" style=\"width: 100%; height: 100%; background-color: blue;\"></div>\n      </div>\n    </div>\n\n    <span id=\"interfaceWindowMap\"></span>\n    <span id=\"interfaceWindowDatetime\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ");

  win.css("\n    #interfaceWindow {\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    span#interfaceWindowMap {\n      position: absolute:\n      top: 0px;\n      background-color: rgba(100, 100, 100, 0.7);\n      display: inline-block;\n    }\n\n    span#interfaceWindowDatetime {\n      position: absolute:\n      top: 200px;\n      left: 0;\n      background-color: rgba(100, 100, 100, 0.7);\n      display: inline-block;\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n\n    button.interfaceWindowButton:disabled {\n      cursor: default;\n      pointer-events: none;\n      background-color: gray;\n      opacity: 0.5;\n    }\n  ");

  win.use = document.querySelector("button#interfaceWindowUse");

  var interfaceWindowMap = document.querySelector("span#interfaceWindowMap");
  var interfaceWindowMenu = document.querySelector("button#interfaceWindowMenu");

  Sprite.Input.whenUp(["esc"], function (key) {
    if (Game.windows["interface"].only()) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  (function SettingBar() {
    // 设置技能栏
    for (var i = 0; i < 8; i++) {
      (function (button, index) {
        button.addEventListener("click", function (event) {
          var element = Game.hero.data.bar[index];
          if (element) {
            if (element.type == "skill") Game.hero.fire(element.id);else if (element.type == "item") {}
          }
        });
      })(document.querySelector("button#interfaceWindowButton-" + i), i);
    }

    function SkillFire(num) {
      var element = Game.hero.data.bar[num];
      if (element) {
        if (element.type == "skill") {
          var cooldown = Game.hero.fire(element.id);
          var button = document.querySelector("button#interfaceWindowButton-" + num);
          button.disabled = true;
          setTimeout(function () {
            button.disabled = false;
          }, cooldown);
          //button.style.disabled = "true";
        } else if (element.type == "item") {}
      }
    }

    Sprite.Input.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
      var num = parseInt(key);
      // 只有在interface窗口是only存在的时候才使用快捷键
      if (Number.isInteger(num) && Game.windows["interface"].only()) {
        SkillFire(num - 1);
      }
    });

    Sprite.Input.whenUp(["e", "E"], function (key) {
      if (Game.windows["interface"].showing()) {
        if (Game.hintObject) {
          win.use.click();
        }
      }
    });

    win.use.addEventListener("click", function (event) {
      if (Game.hintObject) {
        if (Game.hintObject.type && Game.hintObject.type == "door") {

          Game.windows.loading.execute("begin");

          setTimeout(function () {
            var destx = Game.hintObject.destx;
            var desty = Game.hintObject.desty;
            Game.clearStage();
            var newArea = Game.hintObject.dest;

            Game.loadArea(newArea, function (area) {

              Game.area = area;
              area.map.draw(Game.layers.mapLayer);

              Game.hero.data.area = newArea;
              Game.hero.draw(Game.layers.actorLayer);
              area.actors["hero"] = Game.hero;
              Game.hero.x = destx;
              Game.hero.y = desty;
              Game.windows["interface"].show();

              Game.windows.loading.execute("end");
            });
          }, 100);
        } else if (Game.hintObject.type && Game.hintObject.type == "chest") {} else if (Game.hintObject.type && Game.hintObject.type == "hint") {
          Game.popup(Game.hintObject, Game.hintObject.message);
        } else if (Game.hintObject instanceof Game.Actor) {
          Game.hintObject.contact();
        } else if (Game.hintObject instanceof Game.Item) {
          Game.hintObject.pickup();
        }
      }
    });
  })();

  win.register("status", function (hp, sp) {
    var interfaceWindowHP = document.querySelector("#interfaceWindowHP");
    var interfaceWindowSP = document.querySelector("#interfaceWindowSP");
    interfaceWindowHP.style.width = hp * 100 + "%";
    interfaceWindowSP.style.width = sp * 100 + "%";
    if (hp >= 0.5) {
      interfaceWindowHP.style.backgroundColor = "green";
    } else if (hp >= 0.25) {
      interfaceWindowHP.style.backgroundColor = "yellow";
    } else {
      interfaceWindowHP.style.backgroundColor = "red";
    }
  });

  win.register("datetime", function () {
    if (Game.hero && Game.hero.data && Number.isInteger(Game.hero.data.time)) {
      var YEARMIN = 60 * 24 * 30 * 12;
      var MONTHMIN = 60 * 24 * 30;
      var DAYMIN = 60 * 24;
      var HOURMIN = 60;
      var datetime = document.querySelector("span#interfaceWindowDatetime");
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

      if (Game.area && Game.area.map && Game.area.map.data.type == "outdoor") {
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
    }
  });

  setInterval(function () {
    if (Game.hero) {
      Game.hero.data.time++;
      Game.windows["interface"].execute("datetime");
    }
  }, 1000);

  win.register("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var container = document.querySelector("button#interfaceWindowButton-" + i);
      while (container.hasChildNodes()) container.removeChild(container.lastChild);
      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          //container.appendChild(skill.icon.cloneNode());
          container.style.backgroundImage = "url(\"" + skill.icon.src + "\")";
        } else if (type == "item") {
          var item = Game.items[id];
          container.style.backgroundImage = "url(\"" + item.icon.src + "\")";
          //container.appendChild(item.icon.cloneNode());
        }
      } else {
          // empty bar element
          container.style.backgroundImage = "";
          //container.appendChild(document.createElement("img"));
        }
    }

    interfaceWindowMap.textContent = Game.area.map.data.name;
  });

  win.on("beforeShow", function () {
    Game.windows["interface"].execute("refresh");
  });

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();