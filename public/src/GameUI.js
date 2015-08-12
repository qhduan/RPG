/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  Game.ui = {};

  Game.ui.init = function () {

    // 设置技能栏
    for (var i = 0; i < 6; i++) {
      (function (buttonSkill, index) {
        buttonSkill.addEventListener("click", function () {
          var skillId = Game.hero.data.skillbar[index];
          if (skillId) {
            Game.hero.fire(skillId);
          }
        });
      })(document.getElementById(`buttonSkill${i}`), i);
    }

    document.getElementById("buttonMenu").addEventListener("click", function (event) {
      Game.ShowWindow("menuWindow");
    });

    Game.hero.data.skillbar.forEach((element, index) => {
      var skill = Game.hero.skills[element];
      var container = document.getElementById(`buttonSkill${index}`);
      container.appendChild(skill.icon);
    });
  };

}());
