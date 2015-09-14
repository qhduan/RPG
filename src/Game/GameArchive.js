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
  Game.Archive = {};

  Game.Archive.remove = function (id) {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
  };

  // 返回所有存档，Object格式
  Game.Archive.list = function () {
    var keys = [];
    for (let key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
      }
    }
    keys.sort();
    keys.reverse();
    return keys;
  };

  // 返回最新存档，Object格式
  Game.Archive.last = function () {
    var list = Game.Archive.list();
    if (list.length > 0) {
      var last = list[0];
      return JSON.parse(window.localStorage.getItem(`SAVE_${last}`));
    } else {
      throw new Error("Game.Archive.last Error");
    }
  };

  Game.Archive.clear = function () {
    for (let key in window.localStorage) {
      if (key.match(/^SAVE_(\d+)$/)) {
        window.localStorage.removeItem(key);
      }
    }
  };

  Game.Archive.save = function (data) {
    var now = new Date();
    var id = now.getTime();

    data.id = id;
    data.name = data.hero.name;
    data.date = now.toLocaleString();

    window.localStorage.setItem(`SAVE_${id}`, JSON.stringify(data));
  };

  Game.Archive.get = function (id) {
    if (id && window.localStorage.getItem(id)) {
      return JSON.parse(window.localStorage.getItem(id));
    }
    return null;
  };

  Game.Archive.load = function (id) {
    var data = Game.Archive.get(id);
    if (!data) {
      data = Game.Archive.last();
    }

    if (data) {

      Game.windows.loading.execute("begin");

      var heroData = data.hero;

      Game.drawHero(heroData.custom, function (heroImage) {
        heroData.image = heroImage;
        Game.hero = new Game.Actor(heroData);

        Game.hero.on("complete", function () {

          Game.loadArea(heroData.area, function (area) {

            Game.area = area;
            area.map.draw(Game.layers.mapLayer);

            if (!Game.hero.data.x && !Game.hero.data.x) {
              if (area.map.data.entry.x && area.map.data.entry.y) {
                Game.hero.data.x = area.map.data.entry.x;
                Game.hero.data.y = area.map.data.entry.y;
              } else {
                throw new Error("Invalid Hero Position");
              }
            }

            area.actors.add(Game.hero);
            Game.hero.draw(Game.layers.actorLayer);
            Game.hero.focus();
            Game.windows.main.hide();
            Game.windows.interface.show();
            Game.start();

            Game.windows.loading.execute("end");
          });
        });

      });

    } else {
      console.error("id:", id);
      throw "Invalid id, Game.Archive.load";
    }
      //return archive[id];

  };
})();
