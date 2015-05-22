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

      Game.loadArea("town0001", function (area) {
        area.draw();

        Game.hero = hero;

        Game.hero.draw(area.entry.x, area.entry.y);
        Game.hero.focus();
        Game.updateStage();

        createjs.Ticker.on("tick", Game.stage);

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

        Game.drawHero(ret.hero, function (heroImage) {
          ret.hero.image = heroImage;
          delete ret.hero.images;

          var hero = new Game.ActorClass(ret.hero);

          if (hero.spellData) {
            var spellSound = [];
            hero.spellObj = {};
            for (var key in hero.spellData) {
              var spellData = hero.spellData[key];
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

      } else {
        alert(ret.error || "Unknown Error");
        window.location.href = "/";
      }
    });
  }



  Game.init();

})();
