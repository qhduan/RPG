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
map.type = "cave";

// 自动生成怪物
map.spawnMonster = {
  list: {
    "bat.purple": 0.9,
    "slime.green": 0.1
  },
  count: 8
};

map.onto.push({
  x: 3,
  y: 62,
  description: "通往巴斯托森林中部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.center", 38, 10);
  }
});

map.touch.push({
  x: 47,
  y: 46,
  description: "通往巴斯托森林中部",
  heroUse: function () {
    Game.Confirm("这条梯子看上去只能爬上去，很难爬回来，是否回到巴斯托森林中部？").then(function () {
      Game.hero.gotoArea("bastowforest.center", 53, 13);
    }).catch(function () {
      // no
    });
  }
});

return map;
