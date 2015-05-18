

~function () {
  "use strict";

  Game.loads([
    {
      type: "map",
      id: "town0001"
    },
    {
      type: "actor",
      id: "actor0001"
    },
    {
      type: "actor",
      id: "actor0002"
    }
  ], function (result) {
    result.town0001.draw();

    result.actor0001.draw({
      x: 750, y: 750
    });

    result.actor0002.draw({
      x: 840, y: 840
    });

    Game.hero = result.actor0001;
    Game.hero.focus();

    Game.updateStage();
  });

  createjs.Ticker.on("tick", function () {
    Game.updateStage();
  });

}();
