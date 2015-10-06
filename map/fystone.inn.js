/*


地图信息


*/
"use strict";


var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "法斯通镇旅馆";
map.type = "indoor";

map.onto.push({
  x: 7,
  y: 13,
  description: "通往法斯通镇",
  execute: function () {
    Game.hero.gotoArea("fystone", 49, 26);
  }
});

return map;
