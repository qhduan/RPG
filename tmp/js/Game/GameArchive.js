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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Game.assign("Archive", (function () {
    function GameArchive() {
      _classCallCheck(this, GameArchive);
    }

    _createClass(GameArchive, null, [{
      key: "remove",
      value: function remove(id) {
        if (window.localStorage.getItem(id)) {
          window.localStorage.removeItem(id);
        }
      }

      // 返回所有存档，Object格式
    }, {
      key: "list",
      value: function list() {
        var keys = [];
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
          }
        }
        keys.sort();
        keys.reverse();
        return keys;
      }

      // 返回最新存档，Object格式
    }, {
      key: "last",
      value: function last() {
        var list = Game.Archive.list();
        if (list.length > 0) {
          var last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + last));
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }, {
      key: "save",
      value: function save(data) {
        var now = new Date();
        var id = now.getTime();

        data.id = id;
        data.name = data.hero.name;
        data.date = now.toLocaleString();

        window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
      }
    }, {
      key: "get",
      value: function get(id) {
        if (id && window.localStorage.getItem(id)) {
          return JSON.parse(window.localStorage.getItem(id));
        }
        return null;
      }
    }, {
      key: "load",
      value: function load(id) {
        var data = Game.Archive.get(id);
        if (!data) {
          data = Game.Archive.last();
        }

        if (data) {

          if (Game.windows["interface"].showing) {
            Game.windows["interface"].hide();
          }

          Game.windows.loading.begin();

          setTimeout(function () {
            var heroData = data.hero;

            console.time("drawHero");

            Game.drawHero(heroData.custom).then(function (heroImage) {
              heroData.image = heroImage;
              Game.hero = new Game.ActorHero(heroData);

              console.timeEnd("drawHero");
              Game.windows.loading.update("20%");
              console.time("hero complete");

              Game.hero.on("complete", function () {

                console.timeEnd("hero complete");
                Game.windows.loading.update("40%");
                console.time("area");

                Game.loadArea(heroData.area).then(function (area) {

                  console.timeEnd("area");
                  Game.windows.loading.update("60%");
                  console.time("map");

                  Game.area = area;

                  area.map.draw();

                  console.timeEnd("map");
                  Game.windows.loading.update("80%");
                  console.time("other");

                  if (!Number.isInteger(Game.hero.data.x) || !Number.isInteger(Game.hero.data.y)) {
                    if (area.map.data.entry && Number.isInteger(area.map.data.entry.x) && Number.isInteger(area.map.data.entry.y)) {
                      Game.hero.data.x = area.map.data.entry.x;
                      Game.hero.data.y = area.map.data.entry.y;
                    } else {
                      console.error(Game.hero.data.x, Game.hero.data.y, area.map.data.entry, Game.hero, area.map.data);
                      throw new Error("Invalid hero position");
                    }
                  }

                  Game.windows.loading.update("100%");

                  area.actors.add(Game.hero);
                  Game.hero.draw();
                  Game.hero.focus();
                  Game.windows.main.hide();
                  Game.windows.loading.end();
                  Game.windows["interface"].refresh();
                  Game.windows["interface"].show();
                  Game.AI.attach(Game.hero);
                  Game.start();

                  console.timeEnd("other");
                });
              });
            });
          }, 20);
        } else {
          console.error("id:", id);
          throw new Error("Invalid id, Game.Archive.load");
        }
      }
    }]);

    return GameArchive;
  })());
})();
//# sourceMappingURL=GameArchive.js.map
