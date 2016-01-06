/*


地图信息


*/
document.currentScript["data-callback"](function (Game) {
  "use strict";
  var map = {
    actors: [],
    touch: [],
    onto: []
  };

  map.name = "卡诺城南门";
  map.type = "outdoor";

  map.onto.push({
    x: 0,
    y: 20,
    description: "通往巴斯托森林南部",
    execute: function () {
      Game.hero.gotoArea("bastowforest.south", 61, 16);
    }
  });

  map.onto.push({
    x: 15,
    y: 3,
    description: "通往首都卡诺城市场区",
    execute: function () {
      Game.hero.gotoArea("chano.market", 15, 29);
    }
  });

  return map;

});
