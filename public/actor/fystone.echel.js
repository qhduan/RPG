/*


人物信息


*/
"use strict";
return {
  name: "伊寇",
  description: "法斯通镇里的魔法师",
  type: "npc",
  contact: [
    {
      name: "闲谈",
      content: [
        "法斯通镇的很安静，适合魔法师静心研究"
      ]
    },
    {
      name: "关于魔法",
      content: [
        "魔法是深刻的学问，全面的理论，需要细细研究的艺术",
        "如果你对魔法感兴趣，可以去法师学院，就在帝国首都卡诺，距离法斯通镇并不远"
      ]
    }
  ],
  trade: true,
  items: {
    "potion.healWeak": 5
  },
  quest: [],
  image: "resource\/fystone.echel.png",
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
