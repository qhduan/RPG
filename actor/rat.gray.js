/*


人物信息


*/
"use strict";
return {
  name: "灰老鼠",
  description: "灰色的老鼠",
  type: "monster",
  exp: 1,
  image: "resource\/rat.gray.png",
  centerX: 16,
  centerY: 32,
  hitArea: [[0, 0]],
  level: 1,
  $str: 1,
  $dex: 1,
  $int: 1,
  $con: 2,
  $cha: 1,
  tileheight: 32,
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
    attackup: [9, 11, "walkup", 100]
  }
};
