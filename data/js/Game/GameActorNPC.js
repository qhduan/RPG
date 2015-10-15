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

        var data = this.data;

        var options = {};

        // npc对话，例如“闲谈”
        var contact = {};
        if (data.contact) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.contact[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var talk = _step.value;

              var result = true;
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
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        // 玩家接受任务
        var quest = null;
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
        var completeQuest = null;
        if (Game.hero.data.currentQuest.length) {
          completeQuest = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Game.hero.data.currentQuest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _quest = _step2.value;

              console.log(Game.Quest.isComplete(_quest), _quest.to, this.id);
              if (_quest.to == this.id && Game.Quest.isComplete(_quest)) {
                completeQuest.push(_quest);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
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
        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "trade":
              // 玩家交易的选择，默认是买
              _this.heroUse();
              Game.windows.buy.open(data.items);
              break;
            case "quest":
              // 玩家接受任务的选择
              var questOption = {};
              quest.forEach(function (quest, index) {
                questOption[quest.name] = index;
              });
              Game.choice(questOption).then(function (choice) {
                if (Number.isInteger(choice)) {
                  (function () {
                    var q = quest[choice];
                    Game.confirm({
                      message: q.before,
                      yes: "接受任务",
                      no: "拒绝"
                    }).then(function () {
                      Game.hero.data.currentQuest.push(q);
                      _this.heroUse();
                    })["catch"](function () {
                      _this.heroUse();
                    });
                  })();
                } else {
                  _this.heroUse();
                }
              });
              break;
            case "completeQuest":
              // 玩家完成了某个任务的选择
              var completeQuestOption = {};
              completeQuest.forEach(function (quest, index) {
                completeQuestOption[quest.name] = index;
              });
              Game.choice(completeQuestOption).then(function (choice) {
                if (Number.isInteger(choice)) {
                  var _quest2 = completeQuest[choice];

                  Game.hero.data.currentQuest.splice(Game.hero.data.currentQuest.indexOf(_quest2), 1);
                  Game.hero.data.completeQuest.push(_quest2);

                  _this.heroUse();
                  Game.dialogue([_quest2.finish], data.name);
                  if (_quest2.reward) {
                    if (_quest2.reward.gold) {
                      Game.hero.data.gold += _quest2.reward.gold;
                    }
                    if (_quest2.reward.exp) {
                      Game.hero.data.exp += _quest2.reward.exp;
                    }
                  }
                };
              });
              break;
            default:
              // 其他选择都没选的情况下，就是对话选择，例如“闲谈”
              if (contact[choice]) {
                _this.heroUse();
                Game.dialogue(contact[choice].content, data.name);
              }
          }
        });
      }
    }]);

    return GameActorNPC;
  })(Game.Actor));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvck5QQy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7Y0FBUSxZQUFZOztBQUM1QixhQURnQixZQUFZLENBQzNCLFNBQVMsRUFBRTs0QkFESSxZQUFZOztBQUV0QyxpQ0FGMEIsWUFBWSw2Q0FFaEMsU0FBUyxFQUFFO0tBQ2xCOztpQkFIMkIsWUFBWTs7YUFLaEMsbUJBQUc7OztBQUNULFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXJCLFlBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQzs7O0FBR2pCLFlBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixZQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Ozs7OztBQUNoQixpQ0FBaUIsSUFBSSxDQUFDLE9BQU8sOEhBQUU7a0JBQXRCLElBQUk7O0FBQ1gsa0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsa0JBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLFVBQVUsRUFBRTtBQUN2QyxvQkFBSTtBQUNGLHdCQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUMzQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YseUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMseUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlCLHlCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6Qyx3QkFB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SSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQUssQ0FBQyxDQUFDOztBQUV6Qyx3QkFBSyxPQUFPLEVBQUUsQ0FBQztBQUNmLHNCQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxzQkFBSSxPQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2hCLHdCQUFJLE9BQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3JCLDBCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7cUJBQzFDO0FBQ0Qsd0JBQUksT0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsMEJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztxQkFDeEM7bUJBQ0Y7aUJBQ0YsQ0FBQztlQUNILENBQUMsQ0FBQztBQUNILG9CQUFNO0FBQUEsQUFDUjs7QUFDRSxrQkFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkIsc0JBQUssT0FBTyxFQUFFLENBQUM7QUFDZixvQkFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztlQUNuRDtBQUFBLFdBQ0o7U0FDRixDQUFDLENBQUM7T0FDSjs7O1dBNUkyQixZQUFZO0tBQVMsSUFBSSxDQUFDLEtBQUssRUE4STNELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3JOUEMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAg6Iux6ZuE57G7XG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3Rvck5QQ1wiLCBjbGFzcyBHYW1lQWN0b3JOUEMgZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgIH1cblxuICAgIGhlcm9Vc2UgKCkge1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICAgIGxldCBvcHRpb25zID0ge307XG5cbiAgICAgIC8vIG5wY+Wvueivne+8jOS+i+WmguKAnOmXsuiwiOKAnVxuICAgICAgbGV0IGNvbnRhY3QgPSB7fTtcbiAgICAgIGlmIChkYXRhLmNvbnRhY3QpIHtcbiAgICAgICAgZm9yIChsZXQgdGFsayBvZiBkYXRhLmNvbnRhY3QpIHtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAvLyB0YWxrLmNvbmRpdGlvbiDmmK/lr7nor53mnaHku7bvvIzlpoLmnpzlrZjlnKjvvIzlroPmmK/kuIDkuKrlh73mlbBcbiAgICAgICAgICBpZiAodHlwZW9mIHRhbGsuY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gdGFsay5jb25kaXRpb24oKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmlkLCB0aGlzLmRhdGEpO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRhbGsuY29uZGl0aW9uKTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0YWxrLmNvbmRpdGlvbi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgb3B0aW9uc1t0YWxrLm5hbWVdID0gdGFsay5uYW1lO1xuICAgICAgICAgICAgY29udGFjdFt0YWxrLm5hbWVdID0gdGFsaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g546p5a625o6l5Y+X5Lu75YqhXG4gICAgICBsZXQgcXVlc3QgPSBudWxsO1xuICAgICAgaWYgKHRoaXMucXVlc3QpIHtcbiAgICAgICAgcXVlc3QgPSB0aGlzLnF1ZXN0LmZpbHRlcihmdW5jdGlvbiAocXVlc3QpIHtcbiAgICAgICAgICBpZiAoR2FtZS5oZXJvLmhhc1F1ZXN0KHF1ZXN0LmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChxdWVzdCAmJiBxdWVzdC5sZW5ndGgpIHtcbiAgICAgICAgICBvcHRpb25zW1wi5Lu75YqhXCJdID0gXCJxdWVzdFwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeOqeWutuWujOaIkOS7u+WKoVxuICAgICAgbGV0IGNvbXBsZXRlUXVlc3QgPSBudWxsO1xuICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdC5sZW5ndGgpIHtcbiAgICAgICAgY29tcGxldGVRdWVzdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBxdWVzdCBvZiBHYW1lLmhlcm8uZGF0YS5jdXJyZW50UXVlc3QpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhHYW1lLlF1ZXN0LmlzQ29tcGxldGUocXVlc3QpLCBxdWVzdC50bywgdGhpcy5pZClcbiAgICAgICAgICBpZiAocXVlc3QudG8gPT0gdGhpcy5pZCAmJiBHYW1lLlF1ZXN0LmlzQ29tcGxldGUocXVlc3QpKSB7XG4gICAgICAgICAgICBjb21wbGV0ZVF1ZXN0LnB1c2gocXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcGxldGVRdWVzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgb3B0aW9uc1tcIuWujOaIkOS7u+WKoVwiXSA9IFwiY29tcGxldGVRdWVzdFwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE5QQ+acieeahOS6pOaYk1xuICAgICAgaWYgKGRhdGEudHJhZGUgJiYgZGF0YS5pdGVtcykge1xuICAgICAgICBvcHRpb25zW1wi5Lqk5piTXCJdID0gXCJ0cmFkZVwiO1xuICAgICAgfVxuXG4gICAgICAvLyDmsqHmnInpgInpoblcbiAgICAgIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgIOS4i+mdoueahOS7o+eggeS4remikee5geiwg+eUqOS6hnRoaXMuaGVyb1VzZSgpXG4gICAgICAgIOaYr+S4uuS6huS/neivgU5QQ+WvueivneahhuS4jeS8muWFs+mXre+8jOaIluiAheivtOeOqeWutuWcqOaJp+ihjOWujOafkOS4qumAiemhueS5i+WQjuS+neeEtuWtmOWcqFxuICAgICAgICDkvYbmmK/lj4jkuI3og73nroDljZXnmoTkuI3lhbPpl63lr7nor53moYbvvIzlm6DkuLrpgInpobnkvJrmnInlj5jljJbvvIzmiYDku6XopoHnu4/luLjph43mlrDmiZPlvIBcbiAgICAgICovXG4gICAgICBHYW1lLmNob2ljZShvcHRpb25zKS50aGVuKChjaG9pY2UpID0+IHtcbiAgICAgICAgc3dpdGNoIChjaG9pY2UpIHtcbiAgICAgICAgICBjYXNlIFwidHJhZGVcIjogLy8g546p5a625Lqk5piT55qE6YCJ5oup77yM6buY6K6k5piv5LmwXG4gICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIEdhbWUud2luZG93cy5idXkub3BlbihkYXRhLml0ZW1zKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJxdWVzdFwiOiAvLyDnjqnlrrbmjqXlj5fku7vliqHnmoTpgInmi6lcbiAgICAgICAgICAgIGxldCBxdWVzdE9wdGlvbiA9IHt9O1xuICAgICAgICAgICAgcXVlc3QuZm9yRWFjaCgocXVlc3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIHF1ZXN0T3B0aW9uW3F1ZXN0Lm5hbWVdID0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEdhbWUuY2hvaWNlKHF1ZXN0T3B0aW9uKS50aGVuKChjaG9pY2UpID0+IHtcbiAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoY2hvaWNlKSkge1xuICAgICAgICAgICAgICAgIGxldCBxID0gcXVlc3RbY2hvaWNlXTtcbiAgICAgICAgICAgICAgICBHYW1lLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcS5iZWZvcmUsXG4gICAgICAgICAgICAgICAgICB5ZXM6IFwi5o6l5Y+X5Lu75YqhXCIsXG4gICAgICAgICAgICAgICAgICBubzogXCLmi5Lnu51cIlxuICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuY3VycmVudFF1ZXN0LnB1c2gocSk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiY29tcGxldGVRdWVzdFwiOiAvLyDnjqnlrrblrozmiJDkuobmn5DkuKrku7vliqHnmoTpgInmi6lcbiAgICAgICAgICAgIGxldCBjb21wbGV0ZVF1ZXN0T3B0aW9uID0ge307XG4gICAgICAgICAgICBjb21wbGV0ZVF1ZXN0LmZvckVhY2goKHF1ZXN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb21wbGV0ZVF1ZXN0T3B0aW9uW3F1ZXN0Lm5hbWVdID0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEdhbWUuY2hvaWNlKGNvbXBsZXRlUXVlc3RPcHRpb24pLnRoZW4oKGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihjaG9pY2UpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0ID0gY29tcGxldGVRdWVzdFtjaG9pY2VdO1xuXG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuY3VycmVudFF1ZXN0LnNwbGljZShcbiAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdC5pbmRleE9mKHF1ZXN0KSwgMVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuY29tcGxldGVRdWVzdC5wdXNoKHF1ZXN0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGVyb1VzZSgpO1xuICAgICAgICAgICAgICAgIEdhbWUuZGlhbG9ndWUoW3F1ZXN0LmZpbmlzaF0sIGRhdGEubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0LnJld2FyZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHF1ZXN0LnJld2FyZC5nb2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmdvbGQgKz0gcXVlc3QucmV3YXJkLmdvbGQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAocXVlc3QucmV3YXJkLmV4cCkge1xuICAgICAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5leHAgKz0gcXVlc3QucmV3YXJkLmV4cDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6IC8vIOWFtuS7lumAieaLqemDveayoemAieeahOaDheWGteS4i++8jOWwseaYr+WvueivnemAieaLqe+8jOS+i+WmguKAnOmXsuiwiOKAnVxuICAgICAgICAgICAgaWYgKGNvbnRhY3RbY2hvaWNlXSkge1xuICAgICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgICAgR2FtZS5kaWFsb2d1ZShjb250YWN0W2Nob2ljZV0uY29udGVudCwgZGF0YS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
