/*


地图信息


*/
"use strict";
return {
  name: "史莱姆北部森林",
  bgm: "Dance",
  spawnMonster: {
    list: {
      "slime.green": 0.7,
      "bat.purple": 0.2,
      "robber.green": 0.1
    },
    position: [
      [34, 18],
      [19, 31],
      [52, 33],
      [49, 52],
      [26, 39]
    ]
  },
  actors: [
  ],
  touch: [
  ],
  onto: [
    {
      x: 32,
      y: 0,
      dest: "starttown.southforest",
      description: "通往斯塔特南部森林",
      destx: 32,
      desty: 62
    },
    {
      x: 32,
      y: 63,
      dest: "slimeforest.center",
      description: "通往史莱姆中部森林",
      destx: 32,
      desty: 1
    }
  ]
};
