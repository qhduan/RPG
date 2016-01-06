/*


任务信息


*/
document.currentScript["data-callback"](function (Game) {
  "use strict";
  return {
    name: "清理蝙蝠",
    fromMap: "斯塔特镇",
    fromName: "坦德姆",
    toMap: "斯塔特镇",
    toName: "坦德姆",
    from: "fystone.tandem",
    to: "fystone.tandem",
    before: "在南方的斯塔特南方森林里面有一些紫色蝙蝠，偶尔会袭击过往行人，你能帮帮忙吗？",
    finish: "感谢你的帮助，这下道路就更安全了",
    rewardText: "金币 20; 经验 20;",
    reward: {
      gold: 20,
      exp: 20
    },
    description: "杀掉2只斯塔特南方森林中的紫色蝙蝠",
    target: {
      kill: [
        {
          id: "bat.purple",
          name: "紫色蝙蝠",
          current: 0,
          need: 2
        }
      ]
    }
  };

});
