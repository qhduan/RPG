/*


物品信息


*/
"use strict";
return {
  name: "铁矿石",
  description: "用锻造可以提炼出铁锭",
  value: 1,
  type: "misc",
  image: "resource\/ore.iron.png",
  centerX: 12,
  centerY: 24,
  hitArea: [[0, 0]],
  pickupCondition: function () {
    if (Game.hero.hasItem("pickaxe")) {
      return true;
    } else {
      Game.hero.popup("需要矿工锄");
      return false;
    }
  }
};
