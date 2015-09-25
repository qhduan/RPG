/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  let internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorNPC", class GameActorNPC extends Game.Actor {
    constructor (actorData) {
      super(actorData);
    }

    heroUse () {
      let data = this.data;

      let options = {};

      // npc对话，例如“闲谈”
      let contact = {};
      if (data.contact) {
        for (let talk of data.contact) {
          let result = true;
          // talk.condition 是对话条件，如果存在，它是一个函数
          if (typeof talk.condition == "function") {
            try {
              result = talk.condition();
            } catch (e) {
              console.error(this.id, this.data);
              console.error(talk.condition);
              console.error(talk.condition.toString());
              throw e;
            }
          }
          if (result) {
            options[talk.name] = talk.name;
            contact[talk.name] = talk;
          }
        }
      }

      // 玩家接受任务
      let quest = null;
      if (this.quest) {
        quest = this.quest.filter(function (quest) {
          if (Game.hero.hasQuest(quest.id)) {
            return false;
          }
          return true;
        });
        if (quest && quest.length) {
          options["任务"] = "quest";
        }
      }

      // 玩家完成任务
      let completeQuest = null;
      if (Game.hero.data.currentQuest.length) {
        completeQuest = [];
        for (let quest of Game.hero.data.currentQuest) {
          if (quest.to == this.id && Game.Quest.isComplete(quest)) {
            completeQuest.push(quest);
          }
        }
        if (completeQuest.length > 0) {
          options["完成任务"] = "completeQuest";
        }
      }

      // NPC有的交易
      if (data.trade && data.items) {
        options["交易"] = "trade";
      }

      // 没有选项
      if (Object.keys(options).length <= 0) {
        return;
      }

      /*
        下面的代码中频繁调用了this.heroUse()
        是为了保证NPC对话框不会关闭，或者说玩家在执行完某个选项之后依然存在
        但是又不能简单的不关闭对话框，因为选项会有变化，所以要经常重新打开
      */
      Game.choice(options, (choice) => {
        switch (choice) {
          case "trade": // 玩家交易的选择，默认是买
            this.heroUse();
            Game.windows.buy.open(data.items);
            break;
          case "quest": // 玩家接受任务的选择
            let questOption = {};
            quest.forEach((quest, index) => {
              questOption[quest.name] = index;
            });
            Game.choice(questOption, (choice) => {
              if (Number.isInteger(choice)) {
                let q = quest[choice];
                Game.confirm({
                  message: q.before,
                  yes: "接受任务",
                  no: "拒绝"
                }, () => {
                  Game.hero.data.currentQuest.push(q);
                  this.heroUse();
                }, () => {
                  this.heroUse();
                });
              } else {
                this.heroUse();
              }
            });
            break;
          case "completeQuest": // 玩家完成了某个任务的选择
            let completeQuestOption = {};
            completeQuest.forEach((quest, index) => {
              completeQuestOption[quest.name] = index;
            });
            Game.choice(completeQuestOption, (choice) => {
              if (Number.isInteger(choice)) {
                let quest = completeQuest[choice];

                Game.hero.data.currentQuest.splice(
                  Game.hero.data.currentQuest.indexOf(quest), 1
                );
                Game.hero.data.completeQuest.push(quest);

                this.heroUse();
                Game.dialogue([quest.finish], data.name);
                if (quest.reward) {
                  if (quest.reward.gold) {
                    Game.hero.data.gold += quest.reward.gold;
                  }
                  if (quest.reward.exp) {
                    Game.hero.data.exp += quest.reward.exp;
                  }
                }
              };
            });
            break;
          default: // 其他选择都没选的情况下，就是对话选择，例如“闲谈”
            if (contact[choice]) {
              this.heroUse();
              Game.dialogue(contact[choice].content, data.name);
            }
        }
      });
    }

  });


})();
