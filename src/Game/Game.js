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

    // root级别api入口
  class GameCore {

    constructor () {
      let privates = internal(this);
      privates.items = {};
      privates.skills = {};
      privates.sounds = {};
      privates.layers = {};
      privates.windows = {};
      privates.config = { // 保存所有设置（默认设置）
        width: 800, // 渲染窗口的原始大小
        height: 450,
        scale: true, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
        fps: 35, // 锁定fps到指定数值，如果设置为<=0，则不限制
      };
      privates.paused = true;
      privates.stage = null;
    }

    addBag (x, y) {
      return new Promise(function (resolve, reject) {
        // 寻找已经存在的bag
        for (let bag of Game.area.bags) {
          if (bag.hitTest(x, y)) {
            return resolve(bag);
          }
        }
        // 如果没有已经存在的bag合适，新建一个
        Game.Item.load("bag").then((bag) => {
          bag.x = x;
          bag.y = y;
          bag.inner = {};
          bag.draw();
          Game.area.bags.add(bag);
          resolve(bag);
        });
      });
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
      internal(this).paused = false;
    }

    /** 暂停游戏 */
    pause () {
      internal(this).paused = true;
    }

    get paused () {
      return internal(this).paused;
    }

    set paused (value) {
      throw new Error("Game.paused readonly, use Game.pause() instead");
    }

    get windows () {
      return internal(this).windows;
    }

    set windows (value) {
      throw new Error("Game.windows readonly");
    }

    get config () {
      return internal(this).config;
    }

    set config (value) {
      throw new Error("Game.config readonly");
    }

    get items () {
      return internal(this).items;
    }

    set items (value) {
      throw new Error("Game.items readonly");
    }

    get skills () {
      return internal(this).skills;
    }

    set skills (value) {
      throw new Error("Game.skills readonly");
    }

    get sounds () {
      return internal(this).sounds;
    }

    set sounds (value) {
      throw new Error("Game.sounds readonly");
    }

    get layers () {
      return internal(this).layers;
    }

    set layers (value) {
      throw new Error("Game.layers readonly");
    }

    get stage () {
      return internal(this).stage;
    }

    set stage (value) {
      throw new Error("Game.stage readonly");
    }

    /** 清理舞台，即删除舞台上所有元素 */
    clearStage () {
      if (Game.area) {
        for (let actor of Game.area.actors) {
          actor.erase();
        }
        for (let bag of Game.area.bags) {
          bag.erase();
        }
      }
      this.layers.mapLayer.clear();
      this.layers.mapHideLayer.clear();
      for (let layer of this.stage.children) {
        layer.clear();
      }
      this.stage.releaseRenderer();
    }

    /** 游戏初始化 */
    init () {
      let privates = internal(this);
      // 舞台
      privates.stage = new Sprite.Stage(privates.config.width, privates.config.height);
      // 建立一个可以自动伸缩的窗口，并将舞台加入其中
      privates.windows.stage = Game.Window.create("stage")
        .appendChild(privates.stage.canvas)
        .show();

      // 地图层
      privates.layers.mapLayer = new Sprite.Container();
      privates.layers.mapLayer.name = "mapLayer";
      // 地图层 - 2
      privates.layers.mapHideLayer = new Sprite.Container();
      privates.layers.mapHideLayer.name = "mapHideLayer";
      // 物品层
      privates.layers.itemLayer = new Sprite.Container();
      privates.layers.itemLayer.name = "itemLayer";
      // 人物层，包括玩家
      privates.layers.actorLayer = new Sprite.Container();
      privates.layers.actorLayer.name = "actorLayer";
      // 信息层
      privates.layers.infoLayer = new Sprite.Container();
      privates.layers.infoLayer.name = "inforLayer";
      // 技能效果层
      privates.layers.skillLayer = new Sprite.Container();
      privates.layers.skillLayer.name = "skillLayer";
      // 对话层
      privates.layers.dialogueLayer = new Sprite.Container();
      privates.layers.dialogueLayer.name = "dialogueLayer";

      privates.stage.appendChild(
        privates.layers.mapLayer,
        privates.layers.mapHideLayer,
        privates.layers.itemLayer,
        privates.layers.actorLayer,
        privates.layers.infoLayer,
        privates.layers.skillLayer,
        privates.layers.dialogueLayer
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
      privates.stage.on("beforeDraw", function () {
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
        if (Game.paused == false) {
          Game.stage.update();
        }
      }, 0);
      */
      Sprite.Ticker.on("tick", () => {
        if (Game.paused == false) {
          Game.stage.update();
        }
      });

      /*
      let updateNext = false;
      Game.stage.on("change", function () {
        updateNext = true;
      });
      Sprite.Ticker.on("tick", function () {
       if (Game.paused == false && updateNext) {
         Game.stage.update();
         updateNext = false;
       }
      });
      */

      let fpsElement = document.createElement("div");
      fpsElement.style.position = "absolute";
      fpsElement.style.left = "0";
      fpsElement.style.top = "0";
      fpsElement.style.color = "white";
      fpsElement.style.zIndex = 999999;
      document.body.appendChild(fpsElement);

      let fps = 0;
      let start = new Date().getTime();
      privates.stage.on("afterDraw", function () {
        fps++;
      });
      setInterval(function () {
        let now = new Date().getTime();
        let f = fps / ((now - start)/1000);
        fps = 0;
        start = now;
        fpsElement.textContent = f.toFixed(1);
      }, 1000);

      console.log("RPG Game 0.1.1 Flying!");
    }
  };

  let Game = window.Game = new GameCore();

  // under node-webkit
  if (window.require) {
    Game.config.scale = true;
  }

  function GameBootstrap () {
    if (document.readyState == "complete") {
      Game.init();
      Game.Input.init();
      Game.windows.main.show();
      return true;
    }
    return false;
  }

  if (GameBootstrap() == false) {
    document.addEventListener("readystatechange", function () {
      GameBootstrap();
    });
  }

})();
