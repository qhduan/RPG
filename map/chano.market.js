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
  y: 30,
  description: "通往卡诺城南门",
  execute: function () {
    Game.hero.gotoArea("chano.southgate", 15, 4);
  }
});


return map;
