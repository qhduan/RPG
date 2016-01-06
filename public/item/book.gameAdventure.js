/*


物品信息


*/
document.currentScript["data-callback"](function (Game) {
  "use strict";
  var content = [
    "艾利韦斯大陆有很多势力，分布在这个世界的不同角落",
    "艾利韦斯大陆有各种不同的技能，有些是用于战斗的，但是也有采集，制造，甚至关于交易和社交的"
  ];

  return {
    name: "冒险者指南",
    description: "一本冒险者的初阶指导手册",
    use: function () {
      Game.Dialogue(content, "《冒险者指南》");
    },
    value: 1,
    type: "book",
    image: "resource\/book.png",
    centerX: 17,
    centerY: 25,
    hitArea: [[0, 0]]
  };

});
