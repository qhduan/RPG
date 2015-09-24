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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  // root级别api入口

  var GameCore = (function () {
    function GameCore() {
      _classCallCheck(this, GameCore);

      var privates = internal(this);
      privates.items = {};
      privates.skills = {};
      privates.sounds = {};
      privates.layers = {};
      privates.windows = {};
      privates.config = { // 保存所有设置（默认设置）
        width: 800, // 渲染窗口的原始大小
        height: 450,
        scale: true, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
        fps: 35 };
      // 锁定fps到指定数值，如果设置为<=0，则不限制
      privates.paused = true;
      privates.stage = null;
    }

    _createClass(GameCore, [{
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });
        return this;
      }

      /** 设置游戏暂停标志为false，启动游戏主循环，接受输入 */
    }, {
      key: "start",
      value: function start() {
        internal(this).paused = false;
      }

      /** 暂停游戏 */
    }, {
      key: "pause",
      value: function pause() {
        internal(this).paused = true;
      }
    }, {
      key: "clearStage",

      /** 清理舞台，即删除舞台上所有元素 */
      value: function clearStage() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var actor = _step.value;

            actor.erase();
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Game.area.bags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var bag = _step2.value;

            bag.erase();
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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.layers.mapLayer.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var child = _step3.value;

            child.clear();
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.layers.mapHideLayer.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var child = _step4.value;

            child.clear();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = internal(this).stage.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var layer = _step5.value;

            layer.clear();
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }

      /** 游戏初始化 */
    }, {
      key: "init",
      value: function init() {
        var privates = internal(this);
        // 舞台
        privates.stage = new Sprite.Stage(privates.config.width, privates.config.height);
        // 建立一个可以自动伸缩的窗口，并将舞台加入其中
        privates.windows.stage = Game.Window.create("stage").appendChild(privates.stage.canvas).show();

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

        privates.stage.appendChild(privates.layers.mapLayer, privates.layers.mapHideLayer, privates.layers.itemLayer, privates.layers.actorLayer, privates.layers.infoLayer, privates.layers.skillLayer, privates.layers.dialogueLayer);

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
        Sprite.Ticker.on("tick", function () {
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

        var fpsElement = document.createElement("div");
        fpsElement.style.position = "absolute";
        fpsElement.style.left = "0";
        fpsElement.style.top = "0";
        fpsElement.style.color = "white";
        fpsElement.style.zIndex = 999999;
        document.body.appendChild(fpsElement);

        var fps = 0;
        var start = new Date().getTime();
        privates.stage.on("afterDraw", function () {
          fps++;
        });
        setInterval(function () {
          var now = new Date().getTime();
          var f = fps / ((now - start) / 1000);
          fps = 0;
          start = now;
          fpsElement.textContent = f.toFixed(1);
        }, 1000);

        console.log("RPG Game Flying!");
      }
    }, {
      key: "paused",
      get: function get() {
        return internal(this).paused;
      },
      set: function set(value) {
        throw new Error("Game.paused readonly, use Game.pause() instead");
      }
    }, {
      key: "windows",
      get: function get() {
        return internal(this).windows;
      },
      set: function set(value) {
        throw new Error("Game.windows readonly");
      }
    }, {
      key: "config",
      get: function get() {
        return internal(this).config;
      },
      set: function set(value) {
        throw new Error("Game.config readonly");
      }
    }, {
      key: "items",
      get: function get() {
        return internal(this).items;
      },
      set: function set(value) {
        throw new Error("Game.items readonly");
      }
    }, {
      key: "skills",
      get: function get() {
        return internal(this).skills;
      },
      set: function set(value) {
        throw new Error("Game.skills readonly");
      }
    }, {
      key: "sounds",
      get: function get() {
        return internal(this).sounds;
      },
      set: function set(value) {
        throw new Error("Game.sounds readonly");
      }
    }, {
      key: "layers",
      get: function get() {
        return internal(this).layers;
      },
      set: function set(value) {
        throw new Error("Game.layers readonly");
      }
    }, {
      key: "stage",
      get: function get() {
        return internal(this).stage;
      },
      set: function set(value) {
        throw new Error("Game.stage readonly");
      }
    }]);

    return GameCore;
  })();

  ;

  var Game = window.Game = new GameCore();

  // under node-webkit
  if (window.require) {
    Game.config.scale = true;
  }

  function GameBootstrap() {
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