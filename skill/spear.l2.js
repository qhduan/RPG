/*


技能信息


*/
"use strict";
return {
  name: "枪攻击Level2",
  description: "枪攻击Level2",
  image: "resource\/spear.png",
  icon: "resource\/spear_icon.png",
  sound: "resource\/spear.ogg",
  cost: 1,
  next: {
    gold: 100,
    exp: 100,
    id: "spear.l3"
  },
  distance: 16,
  cooldown: 450,
  type: "normal",
  condition: function () {
    var weapon = Game.hero.data.equipment.weapon;
    if (!weapon || Game.items[weapon].data.type != "spear") {
      Game.hero.popup("需要装备枪");
      return false;
    }
    return true;
  },
  power: "2d5",
  tileheight: 64,
  tilewidth: 64,
  alpha: 0.5,
  animations: {
    attackdown: {
      frames: [0, 1, 2],
      speed: 40,
      next: "",
      centerX: 32,
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
      centerX: 32,
      centerY: 30,
      actor: "thrustup"
    }
  }
};
