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
"use strict";

(function () {
  "use strict";

  // 当窗口大小改变时改变游戏窗口大小
  function CalculateWindowSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var scale = 1;
    var leftMargin = 0;

    if (Game.config.scale == false) {
      // 不拉伸游戏窗口，按原始大小计算窗口居中
      leftMargin = Math.floor((width - Game.config.width) / 2);
    } else {
      // 拉伸游戏窗口，首先计算游戏原始大小比例
      var ratio = Game.config.width / Game.config.height;
      // width first
      var w = width;
      var h = w / ratio;
      // then height
      if (h > height) {
        h = height;
        w = h * ratio;
      }

      w = Math.floor(w);
      h = Math.floor(h);
      leftMargin = Math.floor((width - w) / 2);

      scale = Math.min(w / Game.config.width, h / Game.config.height);
    }

    // html窗口拉伸（css中控制了原始大小）
    var elements = document.getElementsByClassName("game-window");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.transformOrigin = "0 0";
      elements[i].style.transform = "scale(" + scale + ", " + scale + ")";
      elements[i].style.left = leftMargin + "px";
    }
    // 游戏画布拉伸
    if (Game.stage && Game.stage.canvas) {
      Game.stage.canvas.style.transformOrigin = "0 0";
      Game.stage.canvas.style.transform = "scale(" + scale + ", " + scale + ")";
      Game.stage.canvas.style.left = leftMargin + "px";
    }

    if (Game.hero) {
      Game.hero.focus();
    }
  };

  CalculateWindowSize();
  window.addEventListener("resize", function () {
    CalculateWindowSize();
  });

  window.ShowGameWindow = function (id) {
    var elements = document.getElementsByClassName("game-window");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    if (id && document.getElementById(id)) {
      document.getElementById(id).style.display = "block";
    }
  };

  window.ShowGameWindow("mainWindow");
  Game.init();
  CalculateWindowSize();
})();
//# sourceMappingURL=bootstrap.js.map
