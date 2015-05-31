/*

Online A-RPG Game, Built using Node.js + createjs
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

  Game.io.init(function () {
    console.log("Socket Connected");
  });

  // 登录模块
  window.Login = function Login (event) {
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;

    if (!name.trim().length) {
      alert("角色名不能为空");
      return;
    }

    if (!password.trim().length) {
      alert("密码不能为空");
      return;
    }

    // 用socket登录
    Game.io.get("/login", {name: name, password: password}, function (data) {
      if (data.success) {
        document.getElementById("loginBox").style.display = "none";
        // 登录成功后
        Game.oninit(function () {
          Game.loadArea(data.success.areaId, function (area) {
            Game.area = area;

            area.map.draw(Game.mapLayer);

            for (var key in area.actors) {
              area.actors[key].draw(Game.actorLayer);
            }

            for (var key in area.heros) {
              if (key == data.success.heroId)
                area.heros[key].draw(Game.playerLayer);
              else
                area.heros[key].draw(Game.heroLayer);
            }

            for (var key in area.heros) {
              if (key == data.success.heroId) {
                Game.hero = area.heros[key];
                Game.hero.focus();

                Game.ui.initBottomBar();

                Game.update();
                break;
              }
            }
          });
        });

        Game.init();

      } else {
        alert(data.error || "Unknown Error");
      }
    });
  };

})();
