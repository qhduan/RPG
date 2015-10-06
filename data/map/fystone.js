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
  x: 27,
  y: 21,
  description: "通往坦德姆家",
  execute: function () {
    Game.hero.gotoArea("fystone.tandem", 7, 12);
  }
});

map.onto.push({
  x: 15,
  y: 42,
  description: "通往朗克家",
  execute: function () {
    Game.hero.gotoArea("fystone.ranc", 7, 12);
  }
});

map.onto.push({
  x: 49,
  y: 25,
  description: "通往旅馆",
  execute: function () {
    Game.hero.gotoArea("fystone.inn", 7, 12);
  }
});

map.onto.push({
  x: 51,
  y: 45,
  description: "通往伊寇家",
  execute: function () {
    Game.hero.gotoArea("fystone.echel", 7, 12);
  }
});

map.onto.push({
  x: 31,
  y: 62,
  description: "通往巴斯托森林北部",
  execute: function () {
    Game.hero.gotoArea("bastowforest.north", 31, 1);
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
