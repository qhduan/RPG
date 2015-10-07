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

map.touch.push({
  points: [
    { x: 16, y: 4 },
    { x: 16, y: 5 },
    { x: 24, y: 4 },
    { x: 24, y: 5 },
  ],
  description: "床",
  heroUse: function () {
    Game.confirm("要睡觉吗？", function () {
      Game.windows.interface.hide();
      Game.windows.stage.hide();
      setTimeout(function () {
        Game.windows.stage.show();
        Game.windows.interface.show();
      }, 500);
    });
  }
});

return map;
