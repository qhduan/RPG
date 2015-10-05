/*


地图信息


*/
"use strict";


var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "法斯通镇";

// 坦德姆 镇长
map.actors.push({
  id: "fystone.tandem",
  x: 58,
  y: 44
});

// 朗克 铁匠
map.actors.push({
  id: "fystone.ranc",
  x: 39,
  y: 66
});

// 伊寇 魔法师
map.actors.push({
  id: "fystone.echel",
  x: 75,
  y: 74
});

// 盖诺 旅店老板
map.actors.push({
  id: "fystone.ganu",
  x: 85,
  y: 52
});

// 通往斯塔特南部森林
map.onto.push({
  x: 60,
  y: 119,
  description: "通往巴斯托北部森林",
  execute: function () {
    Game.hero.gotoArea("bastowforest.north", 60, 1);
  }
});

map.touch.push({
  x: 58,
  y: 111,
  heroUse: function () {
    Game.hero.popup("欢迎来到法斯通镇");
  }
})

return map;
