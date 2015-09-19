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
      if (this.data.contact) {

        let options = {};

        if (this.data.contact) {
          Sprite.each(this.data.contact, (talk, key) => {
            let h = Game.hero;
            let d = Game.hero.data;
            let result = null;
            try {
              result = eval(talk.condition)
            } catch (e) {
              console.error(talk.condition);
              console.error(e);
              throw new Error("talk.condition eval error");
            }
            if (result) {
              options[key] = key;
            }
          });
        }

        let quests = null;

        if (this.quests) {
          quests = this.quests.filter(function (quest) {
            if (Game.hero.hasQuest(quest.id)) {
              return false;
            }
            return true;
          });
          if (quests.length) {
            options["任务"] = "quest";
          }
        }

        let completeQuests = [];
        Game.hero.data.quest.current.forEach((quest) => {
          let complete = true;
          if (quest.target.type == "kill") {
            for (let key in quest.target.kill) {
              let t = quest.target.kill[key];
              if (t.current < t.need) {
                complete = false;
              }
            }
          }

          if (complete) {
            completeQuests.push(quest);
          }
        });
        if (completeQuests.length > 0) {
          options["完成任务"] = "completeQuest";
        }

        if (this.data.trade) {
          options["买入"] = "buy";
          options["卖出"] = "sell";
        }

        Game.choice(options, (choice) => {
          switch (choice) {
            case "buy":
              this.heroUse();
              Game.windows.buy.open(this.data.trade);
              break;
            case "sell":
              this.heroUse();
              Game.windows.sell.open(this.data.trade);
              break;
            case "quest":
              let questOptions = {};
              quests.forEach((quest, index) => {
                questOptions[quest.name] = index;
              });
              Game.choice(questOptions, (choice) => {
                if (Number.isInteger(choice)) {
                  let quest = quests[choice];
                  Game.confirm({
                    message: quest.before,
                    yes: "接受任务",
                    no: "拒绝"
                  }, () => {
                    Game.hero.data.quest.current.push(quest);
                    this.heroUse();
                  }, () => {
                    this.heroUse();
                  });
                } else {
                  this.heroUse();
                }
              });
              break;
            case "completeQuest":
              let completeQuestOptions = {};
              completeQuests.forEach((quest, index) => {
                completeQuestOptions[quest.name] = index;
              });
              Game.choice(completeQuestOptions, (choice) => {
                if (Number.isInteger(choice)) {
                  let quest = completeQuests[choice];

                  Game.hero.data.quest.current.splice(
                    Game.hero.data.quest.current.indexOf(quest), 1
                  );
                  Game.hero.data.quest.past.push(quest);

                  this.heroUse();
                  Game.dialogue([quest.finish], this.data.name);
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
            default:
              if (this.data.contact[choice]) {
                this.heroUse();
                Game.dialogue(this.data.contact[choice].content, this.data.name);
              }
          }
        });
      }
    }

  });


})();
