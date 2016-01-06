/*


技能信息


*/
document.currentScript["data-callback"](function (Game) {
  "use strict";
  return {
    name: "剑攻击Level1",
    description: "剑攻击Level1",
    image: "resource\/sword.png",
    icon: "resource\/sword_icon.png",
    sound: "resource\/sword.ogg",
    cost: 1,
    next: {
      gold: 10,
      exp: 10,
      id: "sword.l2"
    },
    distance: 8,
    cooldown: 450,
    type: "normal",
    condition: function () {
      var weapon = Game.hero.data.equipment.weapon;
      if (!weapon || Game.items[weapon].data.type != "sword") {
        Game.hero.popup("需要装备刀剑");
        return false;
      }
      return true;
    },
    power: "1d5",
    tileheight: 64,
    tilewidth: 64,
    alpha: 0.5,
    animations: {
      attackdown: {
        frames: [0],
        speed: 40,
        next: "",
        centerX: 25,
        centerY: 70,
        actor: "slashdown"
      },
      attackleft: {
        frames: [1],
        speed: 40,
        next: "",
        centerX: 20,
        centerY: 60,
        actor: "slashleft"
      },
      attackright: {
        frames: [2],
        speed: 40,
        next: "",
        centerX: 50,
        centerY: 60,
        actor: "slashright"
      },
      attackup: {
        frames: [3],
        speed: 40,
        next: "",
        centerX: 25,
        centerY: 40,
        actor: "slashup"
      }
    }
  };

});
