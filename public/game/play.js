/*

Online A-RPG Game, Built using Node.js + createjs
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

  Game.oninit(function () {

    InitHero(function (hero) {
      var heroId = "hero_" + hero.name;

      Game.loadArea(hero.area, function (area) {
        area.draw();

        for (var key in area.data.actors) {
          if (heroId == key) {
            Game.hero = area.data.actors[key];
            Game.hero.draw(area.data.entry.x, area.data.entry.y);
            Game.hero.focus();
            Game.updateStage();
            break;
          }
        }

        //createjs.Ticker.on("tick", Game.stage);

      });

    });
  });

  function InitHero (callback) {
    var session = document.URL.match(/(session=)([a-f0-9]+)/);
    if (session == null) {
      alert("Lack of Session");
      window.location.href = "/";
    }

    session = session[2];

    $.post("/hero/get", {session: session}).done(function (ret) {
      if (ret.hero) {

        callback(ret.hero);

        /*
        Game.drawHero(ret.hero, function (heroImage) {
          ret.hero.image = heroImage;
          ret.hero.id = "hero_" + ret.hero.name;
          delete ret.hero.images;

          var hero = new Game.ActorClass(ret.hero);

          if (hero.data.spellData) {
            var spellSound = [];
            hero.spellObj = {};
            for (var key in hero.data.spellData) {
              var spellData = hero.data.spellData[key];
              hero.spellObj[spellData.id] = new Game.SpellClass(spellData);
              spellSound.push(spellData.sound);
            }

            var queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);

            spellSound.forEach(function (element) {
              queue.loadFile({
                src: element
              });
            });
          }

          callback(hero);
        });

        */

      } else {
        alert(ret.error || "Unknown Error");
        window.location.href = "/";
      }
    });
  }



  Game.init();

})();
