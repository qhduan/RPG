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
  Game.archive = {};

  Game.archive.remove = function (id) {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
  };

  // 返回所有存档，Object格式
  Game.archive.list = function () {
    var keys = [];
    for (var key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
      }
    }
    keys.sort();
    return keys;
  };

  // 返回最新存档，Object格式
  Game.archive.last = function () {
    var list = Game.archive.list();
    if (list.length > 0) {
      var last = list[list.length - 1];
      return JSON.parse(window.localStorage.getItem("SAVE_" + last));
    } else {
      throw new Error("Game.archive.last Error");
    }
  };

  Game.archive.clear = function () {
    for (var key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        window.localStorage.removeItem(key);
      }
    }
  };

  Game.archive.save = function (data) {
    var now = new Date();
    var id = now.getTime();

    data.id = id;
    data.name = data.hero.name;
    data.date = now.toLocaleString();

    window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
  };

  Game.archive.get = function (id) {
    if (id && window.localStorage.getItem(id)) {
      return JSON.parse(window.localStorage.getItem(id));
    }
    return null;
  };

  Game.archive.load = function (id) {
    var data = Game.archive.get(id);
    if (!data) {
      data = Game.archive.last();
    }

    if (data) {
      var heroData = data.hero;

      Game.drawHero(heroData.custom, function (heroImage) {
        heroData.image = heroImage;
        Game.hero = new Game.Actor(heroData);

        function FindHint() {

          var buttonUse = document.getElementById("buttonUse");
          var minDistance = -1;
          var minObject = null;
          var distanceLimit = 40;

          function FindNearest(obj) {
            var d = Game.hero.distance(obj.x, obj.y);
            if (minDistance == -1 || d < minDistance) {
              minDistance = d;
              minObject = obj;
            }
          }

          // 找最近可“事件”人物 Game.area.actors
          Sprite.Util.each(Game.area.actors, function (element) {
            if (element.data.contact) FindNearest(element);
          });

          // 找最近尸体 Game.area.actors
          Sprite.Util.each(Game.area.bags, function (element) {
            FindNearest(element);
          });

          // 最近的门
          Game.area.doors.forEach(function (element) {
            FindNearest(element);
          });

          // 最近的箱子
          Game.area.chests.forEach(function (element) {
            FindNearest(element);
          });

          // 最近的提示物（例如牌子）
          Game.area.hints.forEach(function (element) {
            FindNearest(element);
          });

          if (minDistance > distanceLimit) {
            minDistance = -1;
            minObject = null;
          }

          if (Game.hintObject && Game.hintObject != minObject) {
            Game.hintObject = null;
            Game.windows["interface"].use.style.visibility = "hidden";
          }

          if (minObject && minDistance < distanceLimit && Game.hintObject != minObject) {
            Game.hintObject = minObject;
            Game.windows["interface"].use.style.visibility = "visible";
            if (minObject.type == "door") {
              Game.popup(minObject, minObject.description, 0, -30);
            } else if (minObject instanceof Game.Actor) {
              Game.popup(minObject, minObject.data.name, 0, -50);
            }
          }
        }

        var skip = 0;
        Sprite.Ticker.on("tick", function () {
          if (Game.area && Game.area.actors && Game.area.bags) {
            skip++;
            if (skip % 5 == 0) FindHint();
          }
        });

        //FindHint();
        Game.hero.on("complete", function () {
          Game.loadArea(heroData.area, function (area) {
            Game.area = area;
            area.map.draw(Game.layers.mapLayer);
            Game.hero.draw(Game.layers.heroLayer);
            Game.hero.focus();
            Game.windows.main.hide();
            Game.windows["interface"].show();
          });
        });
      });
    } else {
      console.error("id:", id);
      throw "Invalid id, Game.archive.load";
    }
    //return archive[id];
  };
})();
//# sourceMappingURL=GameArchive.js.map
