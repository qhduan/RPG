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
    keys.reverse();
    return keys;
  };

  // 返回最新存档，Object格式
  Game.archive.last = function () {
    var list = Game.archive.list();
    if (list.length > 0) {
      var last = list[0];
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

          if (Game.area && Game.area.map && Game.hero) {}

          var heroPosition = Game.area.map.tile(Game.hero.x, Game.hero.y);
          var heroDirection = Game.hero.sprite.currentAnimation.match(/up|left|down|right/)[0];
          var heroFace = Sprite.copy(heroPosition);

          switch (heroDirection) {
            case "up":
              heroFace.y -= 1;
              break;
            case "down":
              heroFace.y += 1;
              break;
            case "left":
              heroFace.x -= 1;
              break;
            case "right":
              heroFace.x += 1;
              break;
          }

          var hint = null;

          function FindUnderHero(element) {
            if (hint != null || element == Game.hero) {
              return;
            }
            var t = Game.area.map.tile(element.x, element.y);
            if (t.x == heroPosition.x && t.y == heroPosition.y) {
              hint = element;
            }
          }

          function FindFaceHero(element) {
            if (hint != null || element == Game.hero) {
              return;
            }
            var t = Game.area.map.tile(element.x, element.y);
            if (t.x == heroFace.x && t.y == heroFace.y) {
              hint = element;
            }
          }

          // 找最近可“事件”人物 Game.area.actors
          Sprite.each(Game.area.actors, FindUnderHero);
          // 找最近尸体 Game.area.actors
          Sprite.each(Game.area.bags, FindUnderHero);
          // 最近的门
          Game.area.doors.forEach(FindUnderHero);
          // 最近的箱子
          Game.area.chests.forEach(FindUnderHero);
          // 最近的提示物（例如牌子）
          Game.area.hints.forEach(FindUnderHero);

          // 找最近可“事件”人物 Game.area.actors
          Sprite.each(Game.area.actors, FindFaceHero);
          // 找最近尸体 Game.area.actors
          Sprite.each(Game.area.bags, FindFaceHero);
          // 最近的门
          Game.area.doors.forEach(FindFaceHero);
          // 最近的箱子
          Game.area.chests.forEach(FindFaceHero);
          // 最近的提示物（例如牌子）
          Game.area.hints.forEach(FindFaceHero);

          if (Game.hintObject && Game.hintObject != hint) {
            Game.hintObject = null;
            Game.windows["interface"].use.style.visibility = "hidden";
          }

          if (hint != null) {
            Game.hintObject = hint;
            Game.windows["interface"].use.style.visibility = "visible";
            if (hint.type == "door") {
              Game.popup(hint, hint.description, 0, -30);
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

            if (!Game.hero.data.x && !Game.hero.data.x) {
              if (area.map.data.entry.x && area.map.data.entry.y) {
                Game.hero.data.x = area.map.data.entry.x;
                Game.hero.data.y = area.map.data.entry.y;
              } else {
                throw new Error("Invalid Hero Position");
              }
            }

            area.actors["hero"] = Game.hero;
            Game.hero.draw(Game.layers.actorLayer);
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