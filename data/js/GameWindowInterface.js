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

  win.html("\n    <div style=\"text-align: center; position: absolute; bottom: 10px; width: 100%; height: 70px;\">\n      <button id=\"interfaceWindowButton-0\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-1\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-2\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-3\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-4\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-5\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-6\" class=\"interfaceWindowButton\"></button>\n      <button id=\"interfaceWindowButton-7\" class=\"interfaceWindowButton\"></button>\n    </div>\n\n    <span id=\"interfaceWindowMap\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ");

  win.css("\n    #interfaceWindow {\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    span#interfaceWindowMap {\n      position: absolute:\n      top: 0px;\n      background-color: rgba(100, 100, 100, 0.7);\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n  ");

  win.use = document.querySelector("button#interfaceWindowUse");

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
          Game.hero.fire(element.id);
        } else if (element.type == "item") {}
      }
    }

    Sprite.Input.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
      var num = parseInt(key);
      if (Number.isInteger(num) && Game.windows["interface"].showing()) {
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
          var destx = Game.hintObject.destx;
          var desty = Game.hintObject.desty;
          Game.clearStage();
          Game.loadArea(Game.hintObject.dest, function (area) {
            Game.area = area;
            area.map.draw(Game.layers.mapLayer);
            Game.hero.draw(Game.layers.heroLayer);
            Game.hero.x = destx;
            Game.hero.y = desty;
            Game.windows["interface"].show();
            Game.stage.update();
          });
        } else if (Game.hintObject.type && Game.hintObject.type == "chest") {} else if (Game.hintObject.type && Game.hintObject.type == "hint") {
          Game.hero.popup(Game.hintObject.message);
        } else if (Game.hintObject instanceof Game.Actor) {
          Game.hintObject.contact();
        } else if (Game.hintObject instanceof Game.Item) {
          Game.hintObject.pickup();
        }
      }
    });
  })();

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

    document.querySelector("span#interfaceWindowMap").textContent = Game.area.map.data.name;
  });

  win.on("beforeShow", function () {
    Game.windows["interface"].execute("refresh");
  });

  document.querySelector("button#interfaceWindowMenu").addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();