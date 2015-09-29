/*


技能信息


*/
"use strict";
return {
  name: "火球攻击Level2",
  description: "火球攻击Level2",
  image: "resource\/fire.png",
  icon: "resource\/fire_icon.png",
  sound: "resource\/fire.ogg",
  cost: 3,
  next: {
    gold: 100,
    exp: 100,
    id: "fire.l3"
  },
  distance: 50,
  cooldown: 800,
  type: "magic",
  power: "2d4",
  tileheight: 64,
  tilewidth: 64,
  alpha: 0.5,
  animations: {
    attackdown: {
      frames: [0],
      speed: 50,
      next: "",
      centerX: 32,
      centerY: 65,
      actor: "spellcastdown"
    },
    attackleft: {
      frames: [1],
      speed: 20,
      next: "",
      centerX: 15,
      centerY: 40,
      actor: "spellcastleft"
    },
    attackright: {
      frames: [2],
      speed: 20,
      next: "",
      centerX: 50,
      centerY: 40,
      actor: "spellcastright"
    },
    attackup: {
      frames: [3],
      speed: 20,
      next: "",
      centerX: 32,
      centerY: 30,
      actor: "spellcastup"
    },
    hitted: {
      frames: [4, 5, 6],
      speed: 50,
      next: ""
    }
  }
};
