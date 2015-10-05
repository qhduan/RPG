/*


任务信息


*/
"use strict";
return {
  name: "蝙蝠翅膀",
  fromMap: "斯塔特镇",
  fromName: "伊寇",
  toMap: "斯塔特镇",
  toName: "伊寇",
  from: "starttown.echel",
  to: "starttown.echel",
  before: "我做一些实验需要4个蝙蝠翅膀，你能帮我去斯塔特南部森林找一些来吗",
  finish: "感谢你，这下我的实验又可以继续了",
  rewardText: "金币 5; 经验 5;",
  reward: {
    gold: 5,
    exp: 5
  },
  description: "把4个蝙蝠翅膀带给伊寇",
  target: {
    item: [
      {
        id: "junk.batWing",
        name: "蝙蝠翅膀",
        current: 0,
        need: 4
      }
    ]
  }
};
