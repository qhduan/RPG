/*


地图信息


*/
"use strict";


var map = {
  actors: [],
  touch: [],
  onto: []
};

map.name = "朗克家";
map.type = "indoor";

map.actors.push({
  id: "fystone.ranc",
  x: 7,
  y: 7
});

map.onto.push({
  x: 7,
  y: 13,
  description: "通往法斯通镇",
  execute: function () {
    Game.hero.gotoArea("fystone", 15, 43);
  }
});

return map;
