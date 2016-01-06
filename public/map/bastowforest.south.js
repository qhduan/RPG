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

  map.name = "巴斯托森林南部";
  map.type = "outdoor";

  // 自动生成怪物
  map.spawnMonster = {
    list: {
      "bat.purple": 0.8,
      "robber.green": 0.1,
      "slime.green": 0.1
    },
    count: 6
  };

  // 自动生成矿产
  map.spawnItem = {
    list: {
      "ore.iron": 0.5,
      "herb.stramonium": 0.5
    },
    count: 6
  };

  map.onto.push({
    x: 31,
    y: 0,
    description: "通往巴斯托森林中部",
    execute: function () {
      Game.hero.gotoArea("bastowforest.center", 31, 61);
    }
  });

  map.onto.push({
    x: 62,
    y: 16,
    description: "通往首都卡诺城南门",
    execute: function () {
      Game.hero.gotoArea("chano.southgate", 1, 20);
    }
  });

  return map;

});
