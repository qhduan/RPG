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
  class GameCore {

    constructor () {
      this.items = {};
      this.skills = {};
      this.layers = {};
      this.config = { // 保存所有设置（默认设置）
        width: 800, // 渲染窗口的原始大小
        height: 450,
        scale: false, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
        fps: 35, // 锁定fps到指定数值，如果设置为<=0，则不限制
      };
      this.paused = true;
      this.stage = null;
    }

    assign (name, object) {
      Object.defineProperty(this, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: object
      });

      return this;
    }

    /** 设置游戏暂停标志为false，启动游戏主循环，接受输入 */
    start () {
      this.paused = false;
    }

    /** 暂停游戏 */
    pause () {
      this.paused = true;
    }

    /** 清理舞台，即删除舞台上所有元素 */
    clearStage () {
      for (let actor of Game.area.actors) {
        actor.erase();
      }
      for (let bag of Game.area.bags) {
        bag.erase();
      }
      for (let i = 0; i < Game.stage.children.length; i++) {
        this.stage.children[i].clear();
      }
    }

    /** 游戏初始化 */
    init () {

      // 舞台
      this.stage = new Sprite.Stage(this.config.width, this.config.height);
      // 建立一个可以自动伸缩的窗口，并将舞台加入其中
      Game.Window.create("stage").appendChild(this.stage.canvas).show();

      // 地图层
      this.layers.mapLayer = new Sprite.Container();
      this.layers.mapLayer.name = "mapLayer";
      // 物品层
      this.layers.itemLayer = new Sprite.Container();
      this.layers.itemLayer.name = "itemLayer";
      // 人物层，包括玩家
      this.layers.actorLayer = new Sprite.Container();
      this.layers.actorLayer.name = "actorLayer";
      // 信息层
      this.layers.infoLayer = new Sprite.Container();
      this.layers.infoLayer.name = "inforLayer";
      // 技能效果层
      this.layers.skillLayer = new Sprite.Container();
      this.layers.skillLayer.name = "skillLayer";
      // 对话层
      this.layers.dialogueLayer = new Sprite.Container();
      this.layers.dialogueLayer.name = "dialogueLayer";

      this.stage.appendChild(
        Game.layers.mapLayer,
        Game.layers.itemLayer,
        Game.layers.actorLayer,
        Game.layers.infoLayer,
        Game.layers.skillLayer,
        Game.layers.dialogueLayer
      );

      // 调整人物层顺序，也就是上方的人物会被下方的人物遮盖，例如
      /**
       * AA BB
       * AA BB
       * 这样人物A和B都不干涉，但是A的位置如果在B的上面，并且紧挨着就变成了
       * AA
       * BB
       * BB
       * 这样人物A的下半身就被人物B遮盖，这就是进行排序，否则如果变成
       * AA
       * AA
       * BB
       * 这样就是B的上半身被人物A遮盖，这就很奇怪
       */
      this.stage.on("beforeDraw", function () {
        if (Game.hero) {
          Game.layers.actorLayer.children.sort(function (a, b) {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            return 0;
          });
        }
      });

      /*
      setInterval(() => {
        Game.stage.update();
      }, 0);
       */
      Sprite.Ticker.on("tick", function () {
        if (Game.paused == false) {
          Game.stage.update();
        }
      });

      let fpsElement = document.createElement("div");
      fpsElement.style.position = "absolute";
      fpsElement.style.left = "0";
      fpsElement.style.top = "0";
      fpsElement.style.color = "white";
      fpsElement.style.zIndex = 999999;
      document.body.appendChild(fpsElement);

      let fps = 0;
      let start = new Date().getTime();
      this.stage.on("afterDraw", function () {
        fps++;
      });
      setInterval(function () {
        let now = new Date().getTime();
        let f = fps / ((now - start)/1000);
        fps = 0;
        start = now;
        fpsElement.textContent = f.toFixed(1);
      }, 1000);


      Game.Window.resize();

      console.log("RPG Game Flying!");
    }
  };

  let Game = window.Game = new GameCore();

  document.body.onload = function () {
    Game.init();
    Game.initInput();
    Game.windows.main.show();
  };

})();
