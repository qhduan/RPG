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
map.type = "outdoor";

map.onto.push({
  x: 18,
  y: 13,
  description: "通往坦德姆家",
  execute: function () {
    Game.hero.gotoArea("fystone.tandem", 7, 12);
  }
});

map.onto.push({
  x: 9,
  y: 25,
  description: "通往朗克家",
  execute: function () {
    Game.hero.gotoArea("fystone.ranc", 7, 12);
  }
});

map.onto.push({
  x: 8,
  y: 39,
  description: "通往旅馆",
  execute: function () {
    Game.hero.gotoArea("fystone.inn", 7, 12);
  }
});

map.onto.push({
  x: 36,
  y: 30,
  description: "通往伊寇家",
  execute: function () {
    Game.hero.gotoArea("fystone.echel", 7, 12);
  }
});

map.onto.push({
  x: 46,
  y: 38,
  description: "通往巴斯托森林北部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.north", 1, 15);
  }
});

map.touch.push({
  x: 30,
  y: 57,
  heroUse: function () {
    Game.hero.popup("欢迎来到法斯通镇");
  }
});

return map;
