/*


地图信息


*/
"use strict";


var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "斯塔特镇";

// 坦德姆 镇长
map.actors.push({
  id: "starttown.tandem",
  x: 58,
  y: 44
});

// 朗克 铁匠
map.actors.push({
  id: "starttown.ranc",
  x: 39,
  y: 66
});

// 伊寇 魔法师
map.actors.push({
  id: "starttown.echel",
  x: 75,
  y: 74
});

// 灰色老鼠
map.actors.push({
  id: "rat.gray",
  x: 81,
  y: 46,
  mode: "stay"
});

// 灰色老鼠
map.actors.push({
  id: "rat.gray",
  x: 84,
  y: 47,
  mode: "stay"
});

// 通往斯塔特南部森林
map.onto.push({
  x: 60,
  y: 119,
  dest: "starttown.southforest",
  destx: 60,
  desty: 1
});


return map;
