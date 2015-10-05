/*


人物信息


*/
"use strict";
return {
  name: "盖诺",
  description: "法斯通镇里的旅店老板",
  type: "npc",
  contact: [
    {
      name: "闲谈",
      content: [
        "法斯通镇是不错的地方"
      ]
    }
  ],
  trade: true,
  items: {
    "food.beer": 5,
    "food.bread": 5,
    "food.cheese": 5
  },
  quest: [],
  image: "resource\/fystone.ganu.png",
  centerX: 16,
  centerY: 42,
  hitArea: [[0, 0]],
  level: 1,
  $str: 10,
  $dex: 10,
  $int: 10,
  $con: 10,
  $cha: 10,
  tileheight: 48,
  tilewidth: 32,
  animations: {
    walkdown: [0, 2, "walkdown", 100],
    walkleft: [3, 5, "walkleft", 100],
    walkright: [6, 8, "walkright", 100],
    walkup: [9, 11, "walkup", 100],
    rundown: [0, 2, "rundown", 50],
    runleft: [3, 5, "walkleft", 50],
    runright: [6, 8, "runright", 50],
    runup: [9, 11, "runup", 50],
    facedown: 1,
    faceleft: 4,
    faceright: 7,
    faceup: 10,
    attackdown: [0, 2, "walkdown", 100],
    attackleft: [3, 5, "walkleft", 100],
    attackright: [6, 8, "walkright", 100],
    attackup: [9, 11, "walkup", 100],
  }
};
