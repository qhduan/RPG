/*


地图信息


*/
"use strict";
return {
  name: "斯塔特南部森林",
  bgm: "Dance",
  actors: [
    {
      id: "bat.purple",
      x: 15,
      y: 15,
      mode: "patrol"
    }, {
      id: "bat.purple",
      x: 44,
      y: 29,
      mode: "patrol"
    }, {
      id: "robber.green",
      x: 48,
      y: 53,
      mode: "patrol"
    }
  ],
  touch: [

  ],
  onto: [
    {
      x: 32,
      y: 0,
      dest: "starttown",
      description: "通往斯塔特镇",
      destx: 28,
      desty: 62
    },
    {
      x: 32,
      y: 63,
      dest: "slimeforest.north",
      description: "通往史莱姆北部森林",
      destx: 32,
      desty: 1
    }
  ]
};
