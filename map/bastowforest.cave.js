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

// 自动生成怪物
map.spawnMonster = {
  list: {
    "bat.purple": 0.9,
    "slime.green": 0.1
  },
  count: 5
};

map.onto.push({
  x: 31,
  y: 39,
  description: "通往巴斯托森林中部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.center", 16, 12);
  }
});

map.touch.push({
  x: 9,
  y: 26,
  description: "通往巴斯托森林中部",
  heroUse: function () {
    Game.confirm("这条梯子看上去只能爬上去，很难爬回来，是否回到巴斯托森林中部？", function () {
      Game.hero.gotoArea("bastowforest.center", 7, 22);
    });
  }
});

return map;
