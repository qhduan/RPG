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

  var win = Game.windows.interface = new Game.Window("interfaceWindow");

  win.html(`
    <div style="text-align: center; position: absolute; bottom: 10px; width: 100%; height: 70px;">
      <button id="interfaceWindowButton-0" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-1" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-2" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-3" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-4" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-5" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-6" class="interfaceWindowButton"></button>
      <button id="interfaceWindowButton-7" class="interfaceWindowButton"></button>
    </div>

    <span id="interfaceWindowMap"></span>

    <button id="interfaceWindowUse" class="interfaceWindowButton"></button>
    <button id="interfaceWindowMenu" class="interfaceWindowButton"></button>
  `);

  win.css(`
    #interfaceWindow {
      pointer-events: none;
    }

    button.interfaceWindowButton {
      width: 60px;
      height: 60px;
      border: 4px solid gray;
      border-radius: 10px;
      background-color: rgba(100, 100, 100, 0.5);
      display: inline-block;
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
  `);

  win.use = document.querySelector("button#interfaceWindowUse");

  (function SettingBar () {
    // 设置技能栏
    for (var i = 0; i < 8; i++) {
      (function (button, index) {
        button.addEventListener("click", function (event) {
          var element = Game.hero.data.bar[index];
          if (element) {
            if (element.type == "skill")
              Game.hero.fire(element.id);
            else if (element.type == "item") {

            }
          }
        });
      })(document.querySelector(`button#interfaceWindowButton-${i}`), i);
    }

    function SkillFire (num) {
      var element = Game.hero.data.bar[num];
      if (element) {
        if (element.type == "skill") {
          Game.hero.fire(element.id);
        } else if (element.type == "item") {

        }
      }
    }

    Sprite.Input.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
      var num = parseInt(key);
      if (Number.isInteger(num) && Game.windows.interface.showing()) {
        SkillFire(num - 1);
      }
    });

    Sprite.Input.whenUp(["e", "E"], function (key) {
      if (Game.windows.interface.showing()) {
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
            Game.windows.interface.show();
            Game.stage.update();
          });

        } else if (Game.hintObject.type && Game.hintObject.type == "chest") {
        } else if (Game.hintObject.type && Game.hintObject.type == "hint") {
          Game.hero.popup(Game.hintObject.message);
        } else if (Game.hintObject instanceof Game.Actor) {
          Game.hintObject.contact();
        }
        else if (Game.hintObject instanceof Game.Item) {
          Game.hintObject.pickup();
        }
      }
    });

  })();

  win.register("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var container = document.querySelector(`button#interfaceWindowButton-${i}`);
      while (container.hasChildNodes())
        container.removeChild(container.lastChild);
      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          //container.appendChild(skill.icon.cloneNode());
          container.style.backgroundImage = `url("${skill.icon.src}")`;
        } else if (type == "item") {
          var item = Game.items[id];
          container.style.backgroundImage = `url("${item.icon.src}")`;
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
    Game.windows.interface.execute("refresh");
  });

  document.querySelector("button#interfaceWindowMenu").addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });

}());
