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
      return JSON.parse(window.localStorage.getItem(`SAVE_${last}`));
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

    window.localStorage.setItem(`SAVE_${id}`, JSON.stringify(data));
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
      Game.ShowWindow();

      var heroData = data.hero;

      Game.drawHero(heroData.custom, function (heroImage) {
        heroData.image = heroImage;
        Game.hero = new Game.ActorClass(heroData);

        function FindHint () {

          var minDistance = 999999;
          var minObject = null;

          function FindNearest (obj) {
            var d = Game.hero.distance(obj.x, obj.y);
            if (d < minDistance) {
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

          if (Game.hintObject) {
            if (Game.hero.distance(Game.hintObject.x, Game.hintObject.y) >= 30) {
              Game.dialogueLayer.removeChild(Game.hintFlag);
              Game.hintFlag = null;
              Game.hintObject = null;
              if (Game.ui.useButton) {
                Game.ui.useButton.visible = false;
              }
            }
          }

          if (minObject) {
            if (minObject != Game.hintObject && minDistance < 50) {
              Game.hintObject = minObject;
              if (Game.hintFlag) {
                Game.dialogueLayer.removeChild(Game.hintFlag);
                Game.hintFlag = null;
              }
              Game.hintFlag = new Sprite.Text({
                text: "!",
                fontSize: 30,
                color: "red"
              });
              Game.hintFlag.x = minObject.x;
              Game.hintFlag.y = minObject.y;
              Game.hintFlag.center.x = Math.floor(Game.hintFlag.width/2);
              Game.hintFlag.center.y = Game.hintFlag.height;
              Game.dialogueLayer.appendChild(Game.hintFlag);
              if (Game.ui.useButton) {
                Game.ui.useButton.visible = true;
              }
            }
          }

        }

        var skip = 0;
        Sprite.Ticker.on("tick", function () {
          if (Game.area && Game.area.actors && Game.area.bags) {
            skip++;
            if (skip % 5 == 0)
              FindHint();
          }
        });

        //FindHint();
        Game.hero.on("complete", function () {
          Game.loadArea(heroData.area, function (area) {
            Game.area = area;
            area.map.draw(Game.mapLayer);
            Game.hero.draw(Game.heroLayer);
            Game.hero.focus();
            Game.initInput();
            Game.ui.init();
            Game.ShowWindow("uiWindow");
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
