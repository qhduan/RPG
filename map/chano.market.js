/*


地图信息


*/
"use strict";

var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "卡诺城市场区";
map.type = "outdoor";

map.onto.push({
  x: 15,
  y: 0,
  description: "通往巴斯托森林南部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.center", 31, 61);
  }
});

map.onto.push({
  x: 15,
  y: 30,
  description: "通往首都卡诺城神庙区",
  execute: function () {
    Game.hero.gotoArea("chano.temple", 15, 1);
  }
});

map.onto.push({
  x: 0,
  y: 22,
  description: "通往首都卡诺城贵族区",
  execute: function () {
    Game.hero.gotoArea("chano.noble", 15, 1);
  }
});

map.onto.push({
  x: 30,
  y: 22,
  description: "通往首都卡诺城猎人区",
  execute: function () {
    Game.hero.gotoArea("chano.hunter", 15, 1);
  }
});

return map;
