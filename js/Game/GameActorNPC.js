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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorNPC", (function (_Game$Actor) {
    _inherits(GameActorNPC, _Game$Actor);

    function GameActorNPC(actorData) {
      _classCallCheck(this, GameActorNPC);

      _get(Object.getPrototypeOf(GameActorNPC.prototype), "constructor", this).call(this, actorData);
    }

    _createClass(GameActorNPC, [{
      key: "heroUse",
      value: function heroUse() {
        var _this = this;

        if (this.data.contact) {
          (function () {

            var options = {};

            if (_this.data.contact) {
              Sprite.each(_this.data.contact, function (talk, key) {
                var h = Game.hero;
                var d = Game.hero.data;
                var result = null;
                try {
                  result = eval(talk.condition);
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

            var quests = null;

            if (_this.quests) {
              quests = _this.quests.filter(function (quest) {
                if (Game.hero.hasQuest(quest.id)) {
                  return false;
                }
                return true;
              });
              if (quests.length) {
                options["任务"] = "quest";
              }
            }

            var completeQuests = [];
            Game.hero.data.quest.current.forEach(function (quest) {
              var complete = true;
              if (quest.target.type == "kill") {
                for (var key in quest.target.kill) {
                  var t = quest.target.kill[key];
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

            if (_this.data.trade) {
              options["买入"] = "buy";
              options["卖出"] = "sell";
            }

            Game.choice(options, function (choice) {
              switch (choice) {
                case "buy":
                  _this.heroUse();
                  Game.windows.buy.open(_this.data.trade);
                  break;
                case "sell":
                  _this.heroUse();
                  Game.windows.sell.open(_this.data.trade);
                  break;
                case "quest":
                  var questOptions = {};
                  quests.forEach(function (quest, index) {
                    questOptions[quest.name] = index;
                  });
                  Game.choice(questOptions, function (choice) {
                    if (Number.isInteger(choice)) {
                      (function () {
                        var quest = quests[choice];
                        Game.confirm({
                          message: quest.before,
                          yes: "接受任务",
                          no: "拒绝"
                        }, function () {
                          Game.hero.data.quest.current.push(quest);
                          _this.heroUse();
                        }, function () {
                          _this.heroUse();
                        });
                      })();
                    } else {
                      _this.heroUse();
                    }
                  });
                  break;
                case "completeQuest":
                  var completeQuestOptions = {};
                  completeQuests.forEach(function (quest, index) {
                    completeQuestOptions[quest.name] = index;
                  });
                  Game.choice(completeQuestOptions, function (choice) {
                    if (Number.isInteger(choice)) {
                      var quest = completeQuests[choice];

                      Game.hero.data.quest.current.splice(Game.hero.data.quest.current.indexOf(quest), 1);
                      Game.hero.data.quest.past.push(quest);

                      _this.heroUse();
                      Game.dialogue([quest.finish], _this.data.name);
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
                  if (_this.data.contact[choice]) {
                    _this.heroUse();
                    Game.dialogue(_this.data.contact[choice].content, _this.data.name);
                  }
              }
            });
          })();
        }
      }
    }]);

    return GameActorNPC;
  })(Game.Actor));
})();
//# sourceMappingURL=GameActorNPC.js.map
