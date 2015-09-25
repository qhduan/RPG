/*


地图信息


*/
"use strict";
return {
  name: "史莱姆中部森林",
  bgm: "Dance",
  actors: [
  ],
  touch: [
  ],
  onto: [
    {
      x: 32,
      y: 0,
      dest: "slimeforest.north",
      description: "通往史莱姆北部森林",
      destx: 32,
      desty: 62
    },
    {
      x: 32,
      y: 63,
      dest: "slimeforest.south",
      description: "通往史莱姆南部森林",
      destx: 32,
      desty: 1
    },
    {
      x: 0,
      y: 32,
      dest: "slimeforest.west",
      description: "通往史莱姆西部森林",
      destx: 62,
      desty: 32
    },
    {
      x: 63,
      y: 32,
      dest: "slimeforest.east",
      description: "通往史莱姆东部森林",
      destx: 1,
      desty: 32
    }
  ]
};
