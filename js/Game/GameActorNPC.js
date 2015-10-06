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
        Game.choice(options, function (choice) {
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
              Game.choice(questOption, function (choice) {
                if (Number.isInteger(choice)) {
                  (function () {
                    var q = quest[choice];
                    Game.confirm({
                      message: q.before,
                      yes: "接受任务",
                      no: "拒绝"
                    }, function () {
                      Game.hero.data.currentQuest.push(q);
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
              // 玩家完成了某个任务的选择
              var completeQuestOption = {};
              completeQuest.forEach(function (quest, index) {
                completeQuestOption[quest.name] = index;
              });
              Game.choice(completeQuestOption, function (choice) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvck5QQy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7Y0FBUSxZQUFZOztBQUM1QixhQURnQixZQUFZLENBQzNCLFNBQVMsRUFBRTs0QkFESSxZQUFZOztBQUV0QyxpQ0FGMEIsWUFBWSw2Q0FFaEMsU0FBUyxFQUFFO0tBQ2xCOztpQkFIMkIsWUFBWTs7YUFLaEMsbUJBQUc7OztBQUNULFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXJCLFlBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQzs7O0FBR2pCLFlBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixZQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Ozs7OztBQUNoQixpQ0FBaUIsSUFBSSxDQUFDLE9BQU8sOEhBQUU7a0JBQXRCLElBQUk7O0FBQ1gsa0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsa0JBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLFVBQVUsRUFBRTtBQUN2QyxvQkFBSTtBQUNGLHdCQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUMzQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YseUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMseUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlCLHlCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6Qyx3QkFB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LEVBQUU7QUFDaEIsd0JBQUksT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsMEJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztxQkFDMUM7QUFDRCx3QkFBSSxPQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQiwwQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUN4QzttQkFDRjtpQkFDRixDQUFDO2VBQ0gsQ0FBQyxDQUFDO0FBQ0gsb0JBQU07QUFBQSxBQUNSOztBQUNFLGtCQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNuQixzQkFBSyxPQUFPLEVBQUUsQ0FBQztBQUNmLG9CQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ25EO0FBQUEsV0FDSjtTQUNGLENBQUMsQ0FBQztPQUNKOzs7V0EzSTJCLFlBQVk7S0FBUyxJQUFJLENBQUMsS0FBSyxFQTZJM0QsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVBY3Rvck5QQy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICDoi7Hpm4TnsbtcbiAgICDlsZ7mgKfvvJpcbiAgICAgIHRoaXMuc3ByaXRlIOeyvueBtVxuICAqL1xuICBHYW1lLmFzc2lnbihcIkFjdG9yTlBDXCIsIGNsYXNzIEdhbWVBY3Rvck5QQyBleHRlbmRzIEdhbWUuQWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChhY3RvckRhdGEpIHtcbiAgICAgIHN1cGVyKGFjdG9yRGF0YSk7XG4gICAgfVxuXG4gICAgaGVyb1VzZSAoKSB7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgLy8gbnBj5a+56K+d77yM5L6L5aaC4oCc6Zey6LCI4oCdXG4gICAgICBsZXQgY29udGFjdCA9IHt9O1xuICAgICAgaWYgKGRhdGEuY29udGFjdCkge1xuICAgICAgICBmb3IgKGxldCB0YWxrIG9mIGRhdGEuY29udGFjdCkge1xuICAgICAgICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIC8vIHRhbGsuY29uZGl0aW9uIOaYr+WvueivneadoeS7tu+8jOWmguaenOWtmOWcqO+8jOWug+aYr+S4gOS4quWHveaVsFxuICAgICAgICAgIGlmICh0eXBlb2YgdGFsay5jb25kaXRpb24gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXN1bHQgPSB0YWxrLmNvbmRpdGlvbigpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuaWQsIHRoaXMuZGF0YSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGFsay5jb25kaXRpb24pO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRhbGsuY29uZGl0aW9uLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBvcHRpb25zW3RhbGsubmFtZV0gPSB0YWxrLm5hbWU7XG4gICAgICAgICAgICBjb250YWN0W3RhbGsubmFtZV0gPSB0YWxrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDnjqnlrrbmjqXlj5fku7vliqFcbiAgICAgIGxldCBxdWVzdCA9IG51bGw7XG4gICAgICBpZiAodGhpcy5xdWVzdCkge1xuICAgICAgICBxdWVzdCA9IHRoaXMucXVlc3QuZmlsdGVyKGZ1bmN0aW9uIChxdWVzdCkge1xuICAgICAgICAgIGlmIChHYW1lLmhlcm8uaGFzUXVlc3QocXVlc3QuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHF1ZXN0ICYmIHF1ZXN0Lmxlbmd0aCkge1xuICAgICAgICAgIG9wdGlvbnNbXCLku7vliqFcIl0gPSBcInF1ZXN0XCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g546p5a625a6M5oiQ5Lu75YqhXG4gICAgICBsZXQgY29tcGxldGVRdWVzdCA9IG51bGw7XG4gICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuY3VycmVudFF1ZXN0Lmxlbmd0aCkge1xuICAgICAgICBjb21wbGV0ZVF1ZXN0ID0gW107XG4gICAgICAgIGZvciAobGV0IHF1ZXN0IG9mIEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdCkge1xuICAgICAgICAgIGlmIChxdWVzdC50byA9PSB0aGlzLmlkICYmIEdhbWUuUXVlc3QuaXNDb21wbGV0ZShxdWVzdCkpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlUXVlc3QucHVzaChxdWVzdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wbGV0ZVF1ZXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBvcHRpb25zW1wi5a6M5oiQ5Lu75YqhXCJdID0gXCJjb21wbGV0ZVF1ZXN0XCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTlBD5pyJ55qE5Lqk5piTXG4gICAgICBpZiAoZGF0YS50cmFkZSAmJiBkYXRhLml0ZW1zKSB7XG4gICAgICAgIG9wdGlvbnNbXCLkuqTmmJNcIl0gPSBcInRyYWRlXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIOayoeaciemAiemhuVxuICAgICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAg5LiL6Z2i55qE5Luj56CB5Lit6aKR57mB6LCD55So5LqGdGhpcy5oZXJvVXNlKClcbiAgICAgICAg5piv5Li65LqG5L+d6K+BTlBD5a+56K+d5qGG5LiN5Lya5YWz6Zet77yM5oiW6ICF6K+0546p5a625Zyo5omn6KGM5a6M5p+Q5Liq6YCJ6aG55LmL5ZCO5L6d54S25a2Y5ZyoXG4gICAgICAgIOS9huaYr+WPiOS4jeiDveeugOWNleeahOS4jeWFs+mXreWvueivneahhu+8jOWboOS4uumAiemhueS8muacieWPmOWMlu+8jOaJgOS7peimgee7j+W4uOmHjeaWsOaJk+W8gFxuICAgICAgKi9cbiAgICAgIEdhbWUuY2hvaWNlKG9wdGlvbnMsIChjaG9pY2UpID0+IHtcbiAgICAgICAgc3dpdGNoIChjaG9pY2UpIHtcbiAgICAgICAgICBjYXNlIFwidHJhZGVcIjogLy8g546p5a625Lqk5piT55qE6YCJ5oup77yM6buY6K6k5piv5LmwXG4gICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIEdhbWUud2luZG93cy5idXkub3BlbihkYXRhLml0ZW1zKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJxdWVzdFwiOiAvLyDnjqnlrrbmjqXlj5fku7vliqHnmoTpgInmi6lcbiAgICAgICAgICAgIGxldCBxdWVzdE9wdGlvbiA9IHt9O1xuICAgICAgICAgICAgcXVlc3QuZm9yRWFjaCgocXVlc3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIHF1ZXN0T3B0aW9uW3F1ZXN0Lm5hbWVdID0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEdhbWUuY2hvaWNlKHF1ZXN0T3B0aW9uLCAoY2hvaWNlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGNob2ljZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcSA9IHF1ZXN0W2Nob2ljZV07XG4gICAgICAgICAgICAgICAgR2FtZS5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHEuYmVmb3JlLFxuICAgICAgICAgICAgICAgICAgeWVzOiBcIuaOpeWPl+S7u+WKoVwiLFxuICAgICAgICAgICAgICAgICAgbm86IFwi5ouS57udXCJcbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5jdXJyZW50UXVlc3QucHVzaChxKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaGVyb1VzZSgpO1xuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaGVyb1VzZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVyb1VzZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJjb21wbGV0ZVF1ZXN0XCI6IC8vIOeOqeWutuWujOaIkOS6huafkOS4quS7u+WKoeeahOmAieaLqVxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlUXVlc3RPcHRpb24gPSB7fTtcbiAgICAgICAgICAgIGNvbXBsZXRlUXVlc3QuZm9yRWFjaCgocXVlc3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbXBsZXRlUXVlc3RPcHRpb25bcXVlc3QubmFtZV0gPSBpbmRleDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgR2FtZS5jaG9pY2UoY29tcGxldGVRdWVzdE9wdGlvbiwgKGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihjaG9pY2UpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0ID0gY29tcGxldGVRdWVzdFtjaG9pY2VdO1xuXG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuY3VycmVudFF1ZXN0LnNwbGljZShcbiAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdC5pbmRleE9mKHF1ZXN0KSwgMVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuY29tcGxldGVRdWVzdC5wdXNoKHF1ZXN0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGVyb1VzZSgpO1xuICAgICAgICAgICAgICAgIEdhbWUuZGlhbG9ndWUoW3F1ZXN0LmZpbmlzaF0sIGRhdGEubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0LnJld2FyZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHF1ZXN0LnJld2FyZC5nb2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmdvbGQgKz0gcXVlc3QucmV3YXJkLmdvbGQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAocXVlc3QucmV3YXJkLmV4cCkge1xuICAgICAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5leHAgKz0gcXVlc3QucmV3YXJkLmV4cDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6IC8vIOWFtuS7lumAieaLqemDveayoemAieeahOaDheWGteS4i++8jOWwseaYr+WvueivnemAieaLqe+8jOS+i+WmguKAnOmXsuiwiOKAnVxuICAgICAgICAgICAgaWYgKGNvbnRhY3RbY2hvaWNlXSkge1xuICAgICAgICAgICAgICB0aGlzLmhlcm9Vc2UoKTtcbiAgICAgICAgICAgICAgR2FtZS5kaWFsb2d1ZShjb250YWN0W2Nob2ljZV0uY29udGVudCwgZGF0YS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
