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

(function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    items: {
      // 保存items的Game.Item对象缓存
    },
    skills: {
      // 保存skills的Game.Skill对象缓存
    },
    layers: {
      // 保存Stage中的Layer的对象
    },
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      width: 800, // 渲染窗口的原始大小
      height: 450,
      scale: false, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
      fps: 35 }
  };

  // 锁定fps到指定数值，如果设置为<=0，则不限制
  Game.clearStage = function () {
    for (var i = 0; i < Game.stage.children.length; i++) {
      Game.stage.children[i].clear();
    }
  };

  Game.init = function () {

    Game.stage = new Sprite.Stage(Game.config.width, Game.config.height);
    document.body.appendChild(Game.stage.canvas);
    Game.stage.canvas.style.position = "fixed";

    Game.layers.mapLayer = new Sprite.Container();
    Game.layers.mapLayer.name = "mapLayer";

    Game.layers.actorLayer = new Sprite.Container();
    Game.layers.actorLayer.name = "actorLayer";

    Game.layers.itemLayer = new Sprite.Container();
    Game.layers.itemLayer.name = "itemLayer";

    Game.layers.heroLayer = new Sprite.Container();
    Game.layers.heroLayer.name = "heroLayer";

    Game.layers.skillLayer = new Sprite.Container();
    Game.layers.skillLayer.name = "skillLayer";

    Game.layers.dialogueLayer = new Sprite.Container();
    Game.layers.dialogueLayer.name = "dialogueLayer";

    Game.stage.appendChild(Game.layers.mapLayer, Game.layers.actorLayer, Game.layers.itemLayer, Game.layers.heroLayer, Game.layers.skillLayer, Game.layers.dialogueLayer);

    Sprite.Ticker.on("tick", function () {
      Game.stage.update();
    });

    var fps = 0;
    var start = new Date().getTime();
    Game.stage.on("drawEnd", function () {
      fps++;
    });
    setInterval(function () {
      var now = new Date().getTime();
      var f = fps / ((now - start) / 1000);
      fps = 0;
      start = now;
      document.getElementById("fps").innerHTML = f.toFixed(2);
    }, 1000);

    Game.Window.resize();

    console.log("RPG Game Flying!");
  };
})();
//# sourceMappingURL=GameCore.js.map
