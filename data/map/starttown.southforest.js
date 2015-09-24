/*


地图信息


*/
"use strict";
return {
  "name": "斯塔特南部森林",
  "bgm": "Dance",
  "actors": [
    {
      "id": "bat.purple",
      "x": 15,
      "y": 15,
      "mode": "patrol"
    }, {
      "id": "bat.purple",
      "x": 48,
      "y": 29,
      "mode": "patrol"
    }, {
      "id": "robber.green",
      "x": 48,
      "y": 53,
      "mode": "patrol"
    }
  ],
  "touch": [

  ],
  "onto": [
    {
      "x": 30,
      "y": 0,
      "dest": "starttown",
      "description": "通往斯塔特镇",
      "destx": 28,
      "desty": 62
    }
  ]
};
