/*


技能信息


*/
"use strict";
return {
  id: "fist01",
  name: "拳攻击Level1",
  description: "拳攻击Level1",
  image: "resource\/fist.png",
  icon: "resource\/fist_icon.png",
  sound: "resource\/fist.ogg",
  cost: 1,
  distance: 0,
  cooldown: 350,
  type: "normal",
  power: "1d3",
  tileheight: 64,
  tilewidth: 64,
  alpha: 0.5,
  animations: {
    attackdown: {
      frames: [0],
      speed: 20,
      next: "",
      centerX: 0,
      centerY: 40,
      actor: "meleedown"
    },
    attackleft: {
      frames: [1],
      speed: 20,
      next: "",
      centerX: 35,
      centerY: 50,
      actor: "meleeleft"
    },
    attackright: {
      frames: [2],
      speed: 20,
      next: "",
      centerX: 30,
      centerY: 50,
      actor: "meleeright"
    },
    attackup: {
      frames: [3],
      speed: 20,
      next: "",
      centerX: 0,
      centerY: 60,
      actor: "meleeup"
    }
  }
};
