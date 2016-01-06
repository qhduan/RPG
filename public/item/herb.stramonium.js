/*


物品信息


*/
document.currentScript["data-callback"](function (Game) {
  "use strict";
  return {
    name: "曼陀罗花",
    description: "药用",
    value: 1,
    type: "misc",
    image: "resource\/herb.stramonium.png",
    centerX: 10,
    centerY: 20,
    hitArea: [[0, 0]],
    pickupCondition: function () {
      if (Game.hero.hasItem("shovel")) {
        return true;
      } else {
        Game.hero.popup("需要采药铲");
        return false;
      }
    }
  };

});
