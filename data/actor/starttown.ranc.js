/*


人物信息


*/
"use strict";
return {
  name: "朗克",
  description: "斯塔特镇里的武器商人",
  type: "npc",
  contact: [
    {
      name: "闲谈",
      content: [
        "斯塔特镇的商店当然比不过都城的大，不过还是应该在这里购买一些初期的冒险装备呢"
      ]
    },
    {
      name: "关于剑术",
      condition: function () {
        if (Game.hero.data.equipment.weapon) {
          if (Game.items[Game.hero.data.equipment.weapon].data.type == "sword") {
            return true;
          }
        }
      },
      content: [
        "剑是优雅的武器，攻击速度快，在领主时代的时候流传下来了不少好剑啊",
        "如果你对剑术感兴趣，可以去试试报名帝国骑士学院，就在帝国首都"
      ]
    },
    {
      name: "关于枪",
      condition: function () {
        if (Game.hero.data.equipment.weapon) {
          if (Game.items[Game.hero.data.equipment.weapon].data.type == "spear") {
            return true;
          }
        }
      },
      content: [
        "枪很适合战场厮杀，攻击速度稍慢，但是伤害高一些",
        "如果你对枪法感兴趣，可以去试试报名帝国骑士学院，就在帝国首都"
      ]
    },
    {
      name: "关于弓",
      condition: function () {
        if (Game.hero.data.equipment.weapon) {
          if (Game.items[Game.hero.data.equipment.weapon].data.type == "bow") {
            return true;
          }
        }
      },
      content: [
        "弓箭是远程武器，相比近战武器，攻击力低了一点，不过因为远离敌人，可以躲避敌人的近战攻击",
        "如果你对弓术感兴趣，可以去猎人学院走走，就在帝国首都"
      ]
    }
  ],
  trade: {
    "sword.iron": 5,
    "spear.iron": 5,
    "bow.wood": 5
  },
  quest: ["starttown.deliverWeapon"],
  image: "resource\/starttown.ranc.png",
  centerX: 16,
  centerY: 42,
  hitArea: [[0, 0]],
  level: 1,
  $str: 10,
  $dex: 10,
  $int: 10,
  $con: 10,
  $cha: 10,
  tileheight: 48,
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
    attackup: [9, 11, "walkup", 100],
  }
};
