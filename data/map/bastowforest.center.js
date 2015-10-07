/*


地图信息


*/
"use strict";

var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "巴斯托森林中部";
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
  x: 38,
  y: 9,
  description: "通往巴斯托森林洞穴",
  execute: function () {
    Game.hero.gotoArea("bastowforest.cave", 3, 61);
  }
});

map.onto.push({
  x: 31,
  y: 0,
  description: "通往巴斯托森林北部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.north", 31, 61);
  }
});

map.onto.push({
  x: 31,
  y: 62,
  description: "通往巴斯托森林南部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.south", 31, 1);
  }
});

return map;
