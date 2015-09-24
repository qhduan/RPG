/*


技能信息


*/
"use strict";
return {
  id: "spear01",
  name: "枪攻击Level1",
  description: "枪攻击Level1",
  image: "resource\/spear.png",
  icon: "resource\/spear_icon.png",
  sound: "resource\/spear.ogg",
  cost: 1,
  distance: 0,
  cooldown: 450,
  type: "normal",
  needweapontype: "spear",
  power: "1d8",
  tileheight: 64,
  tilewidth: 64,
  alpha: 0.5,
  animations: {
    attackdown: {
      frames: [0, 1, 2],
      speed: 40,
      next: "",
      centerX: 0,
      centerY: 65,
      actor: "thrustdown"
    },
    attackleft: {
      frames: [3, 4, 5],
      speed: 40,
      next: "",
      centerX: 15,
      centerY: 45,
      actor: "thrustleft"
    },
    attackright: {
      frames: [6, 7, 8],
      speed: 40,
      next: "",
      centerX: 50,
      centerY: 45,
      actor: "thrustright"
    },
    attackup: {
      frames: [9, 10, 11],
      speed: 40,
      next: "",
      centerX: 0,
      centerY: 30,
      actor: "thrustup"
    }
  }
};
