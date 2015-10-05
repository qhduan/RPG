/*


任务信息


*/
"use strict";
return {
  name: "通知镇长",
  fromMap: "斯塔特镇",
  fromName: "朗克",
  toMap: "斯塔特镇",
  toName: "坦德姆",
  from: "starttown.ranc",
  to: "starttown.tandem",
  before: "坦德姆镇长要求的武器铸造好了，我有点忙，能去告诉镇长武器已经完成了吗",
  finish: "这批武器终于做好了啊，谢谢你的消息",
  rewardText: "金币 5; 经验 5;",
  reward: {
    gold: 5,
    exp: 5
  },
  description: "把武器完成的消息告诉坦德姆镇长",
  target: {
    // empty
  }
};
