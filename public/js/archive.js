/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  Game.archive.load = function (id) {
    var data = null;
    if (id && window.localStorage.getItem(id)) {
      data = JSON.parse(window.localStorage.getItem(id));
    } else {
      data = Game.archive.last();
    }

    if (data) {
      window.ShowGameWindow();

      var heroData = data.hero;

      Game.drawHero(heroData.custom, function (heroImage) {
        heroData.image = heroImage;
        Game.hero = new Game.ActorClass(heroData);

        Game.loadArea(heroData.area, function (area) {
          Game.area = area;
          area.map.draw(Game.mapLayer);
          Game.hero.draw(Game.heroLayer);
          Game.hero.focus();
          Game.initInput();
        });
      });
      return;

      Game.loadArea(heroData.area, function (area) {
        Game.area = area;

        area.map.draw(Game.mapLayer);

        for (var key in area.actors) {
          area.actors[key].draw(Game.actorLayer);
        }

        for (var key in area.heros) {
          if (key == data.success.heroId) area.heros[key].draw(Game.playerLayer);else area.heros[key].draw(Game.heroLayer);
        }

        for (var key in area.heros) {
          if (key == data.success.heroId) {
            Game.hero = area.heros[key];
            Game.hero.focus();

            Game.ui.initBottomBar();

            Game.update();
            break;
          }
        }
      });
    } else {
      console.error("id:", id);
      throw "Invalid id, Game.archive.load";
    }
    //return archive[id];
  };
})();
//# sourceMappingURL=archive.js.map
