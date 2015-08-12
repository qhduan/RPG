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

  Game.archive.ui = function () {
    Game.ShowWindow("archiveWindow");
    var table = document.getElementById("archiveTable");

    while(table.hasChildNodes()) {
      table.removeChild(table.lastChild);
    }

    var list = Game.archive.list();
    list.forEach(function (element) {
      var div = document.createElement("div");
      div.classList.add("archiveItem");

      var archive = Game.archive.get(`SAVE_${element}`);

      var removeButton = document.createElement("button");
      removeButton.style.float = "right";
      removeButton.textContent = "REMOVE";
      div.appendChild(removeButton);
      removeButton.addEventListener("click", function () {
        Game.archive.remove(`SAVE_${element}`);
      });

      var loadButton = document.createElement("button");
      loadButton.style.float = "right";
      loadButton.style.marginBottom = "40px";
      loadButton.textContent = "LOAD";
      div.appendChild(loadButton);
      loadButton.addEventListener("click", function () {
        Game.archive.load(`SAVE_${element}`);
      });

      var heroName = document.createElement("h4");
      heroName.innerHTML = archive.name;
      div.appendChild(heroName);

      var time = document.createElement("h5");
      time.innerHTML = archive.date;
      div.appendChild(time);

      table.appendChild(div);
    });
  };

  Game.archive.remove = function (id) {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
      Game.archive.ui();
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

    } else {
      console.error("id:", id);
      throw "Invalid id, Game.archive.load";
    }
      //return archive[id];

  };
})();
