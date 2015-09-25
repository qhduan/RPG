/*


人物信息


*/
"use strict";
return {
  name: "绿色史莱姆",
  description: "实力很弱的妖兽",
  type: "monster",
  exp: 1,
  image: "resource\/slime.green.png",
  centerX: 16,
  centerY: 32,
  hitArea: [[0, 0]],
  level: 1,
  $str: 5,
  $dex: 5,
  $int: 2,
  $con: 4,
  $cha: 1,
  tileheight: 32,
  tilewidth: 32,
  skills: ["sword01"],
  buff: [],
  nerf: [],
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
