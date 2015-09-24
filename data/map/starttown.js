/*


地图信息


*/
"use strict";
return {
  "name": "斯塔特镇",
  "bgm": "Dance",
  "actors": [
    {
      "id": "starttown.tandem",
      "x": 30,
      "y": 16
    },
    {
      "id": "starttown.ranc",
      "x": 10,
      "y": 38
    },
    {
      "id": "starttown.echel",
      "x": 46,
      "y": 46
    },
    {
      "id": "rat.gray",
      "x": 53,
      "y": 18,
      "mode": "stay"
    },
    {
      "id": "rat.gray",
      "x": 58,
      "y": 18,
      "mode": "stay"
    }
  ],
  "touch": [
    {
      "comment": "提示信息",
      "x": 35,
      "y": 22,
      "type": "message",
      "content": "斯塔特镇"
    }
  ],
  "onto": [
    {
      "comment": "通往斯塔特南部森林",
      "x": 28,
      "y": 63,
      "dest": "starttown.southforest",
      "destx": 30,
      "desty": 1
    }
  ]
};
