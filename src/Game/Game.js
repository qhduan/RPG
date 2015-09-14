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
      fps: 35, // 锁定fps到指定数值，如果设置为<=0，则不限制
    },
    paused: true // 默认暂停
  };

  Game.start = function () {
    Game.paused = false;
  };

  Game.pause = function () {
    Game.paused = true;
  };


  Game.clearStage = function () {
    for (let i = 0; i < Game.stage.children.length; i++) {
      Game.stage.children[i].clear();
    }
  };

  Game.init = function () {

    Game.stage = new Sprite.Stage(Game.config.width, Game.config.height);

    // 建立一个可以自动伸缩的窗口
    Game.windows.stage = new Game.Window("stageWindow");
    Game.windows.stage.appendChild(Game.stage.canvas);
    Game.windows.stage.show();

    Game.layers.mapLayer = new Sprite.Container();
    Game.layers.mapLayer.name = "mapLayer";

    Game.layers.itemLayer = new Sprite.Container();
    Game.layers.itemLayer.name = "itemLayer";

    Game.layers.actorLayer = new Sprite.Container();
    Game.layers.actorLayer.name = "actorLayer";

    Game.layers.infoLayer = new Sprite.Container();
    Game.layers.infoLayer.name = "inforLayer";

    Game.layers.skillLayer = new Sprite.Container();
    Game.layers.skillLayer.name = "skillLayer";

    Game.layers.dialogueLayer = new Sprite.Container();
    Game.layers.dialogueLayer.name = "dialogueLayer";

    Game.stage.appendChild(
      Game.layers.mapLayer,
      Game.layers.itemLayer,
      Game.layers.actorLayer,
      Game.layers.infoLayer,
      Game.layers.skillLayer,
      Game.layers.dialogueLayer
    );

    Game.stage.on("drawStart", function () {
      if (Game.hero) {
        Game.layers.actorLayer.children.sort(function (a, b) {
          if (a.y < b.y) return -1;
          if (a.y > b.y) return 1;
          return 0;
        });
      }
    });

    Sprite.Ticker.on("tick", function () {
      if (Game.paused == false) {
        Game.stage.update();
      }
    });

    var fps = 0;
    var start = new Date().getTime();
    Game.stage.on("drawEnd", function () {
      fps++;
    });
    setInterval(function () {
      var now = new Date().getTime();
      var f = fps / ((now - start)/1000);
      fps = 0;
      start = now;
      document.querySelector("#fps").textContent = f.toFixed(1);
    }, 1000);


    Game.Window.resize();

    console.log("RPG Game Flying!");
  };



})();
