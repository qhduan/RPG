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
      key: "addBag",
      value: function addBag(x, y) {
        return new Promise(function (resolve, reject) {
          // 寻找已经存在的bag
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.bags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var bag = _step.value;

              if (bag.hitTest(x, y)) {
                return resolve(bag);
              }
            }
            // 如果没有已经存在的bag合适，新建一个
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

          Game.Item.load("bag").then(function (bag) {
            bag.x = x;
            bag.y = y;
            bag.inner = {};
            bag.draw();
            Game.area.bags.add(bag);
            resolve(bag);
          });
        });
      }
    }, {
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
        if (Game.area) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Game.area.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var actor = _step2.value;

              actor.erase();
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
            for (var _iterator3 = Game.area.bags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var bag = _step3.value;

              bag.erase();
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
        }
        this.layers.mapLayer.clear();
        this.layers.mapHideLayer.clear();
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.stage.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var layer = _step4.value;

            layer.clear();
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

        this.stage.releaseRenderer();
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

        console.log("RPG Game 0.1.1 Flying!");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7OztNQUc1QixRQUFRO0FBRUEsYUFGUixRQUFRLEdBRUc7NEJBRlgsUUFBUTs7QUFHVixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsY0FBUSxDQUFDLE1BQU0sR0FBRztBQUNoQixhQUFLLEVBQUUsR0FBRztBQUNWLGNBQU0sRUFBRSxHQUFHO0FBQ1gsYUFBSyxFQUFFLElBQUk7QUFDWCxXQUFHLEVBQUUsRUFBRSxFQUNSLENBQUM7O0FBQ0YsY0FBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDdkIsY0FBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDdkI7O2lCQWpCRyxRQUFROzthQW1CTCxnQkFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ1osZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7Ozs7Ozs7QUFFNUMsaUNBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSw4SEFBRTtrQkFBdkIsR0FBRzs7QUFDVixrQkFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNyQix1QkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFD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QUFVLEVBQUU7QUFDckMsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixhQUFPLElBQUksQ0FBQztLQUNiO0FBQ0QsV0FBTyxLQUFLLENBQUM7R0FDZDs7QUFFRCxNQUFJLGFBQWEsRUFBRSxJQUFJLEtBQUssRUFBRTtBQUM1QixZQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN4RCxtQkFBYSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDO0dBQ0o7Q0FFRixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gICAgLy8gcm9vdOe6p+WIq2FwaeWFpeWPo1xuICBjbGFzcyBHYW1lQ29yZSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLml0ZW1zID0ge307XG4gICAgICBwcml2YXRlcy5za2lsbHMgPSB7fTtcbiAgICAgIHByaXZhdGVzLnNvdW5kcyA9IHt9O1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzID0ge307XG4gICAgICBwcml2YXRlcy53aW5kb3dzID0ge307XG4gICAgICBwcml2YXRlcy5jb25maWcgPSB7IC8vIOS/neWtmOaJgOacieiuvue9ru+8iOm7mOiupOiuvue9ru+8iVxuICAgICAgICB3aWR0aDogODAwLCAvLyDmuLLmn5Pnqpflj6PnmoTljp/lp4vlpKflsI9cbiAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgIHNjYWxlOiB0cnVlLCAvLyDlpoLmnpzkuI3mi4nkvLjvvIzpgqPkuYjml6DorrrmtY/op4jlmajnqpflj6PlpJrlpKfvvIzpg73mmK/ljp/lp4vlpKflsI/vvJvmi4nkvLjliJnmjInmr5Tkvovloavmu6Hnqpflj6NcbiAgICAgICAgZnBzOiAzNSwgLy8g6ZSB5a6aZnBz5Yiw5oyH5a6a5pWw5YC877yM5aaC5p6c6K6+572u5Li6PD0w77yM5YiZ5LiN6ZmQ5Yi2XG4gICAgICB9O1xuICAgICAgcHJpdmF0ZXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgIHByaXZhdGVzLnN0YWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRCYWcgKHgsIHkpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIOWvu+aJvuW3sue7j+WtmOWcqOeahGJhZ1xuICAgICAgICBmb3IgKGxldCBiYWcgb2YgR2FtZS5hcmVhLmJhZ3MpIHtcbiAgICAgICAgICBpZiAoYmFnLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGJhZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOayoeacieW3sue7j+WtmOWcqOeahGJhZ+WQiOmAgu+8jOaWsOW7uuS4gOS4qlxuICAgICAgICBHYW1lLkl0ZW0ubG9hZChcImJhZ1wiKS50aGVuKChiYWcpID0+IHtcbiAgICAgICAgICBiYWcueCA9IHg7XG4gICAgICAgICAgYmFnLnkgPSB5O1xuICAgICAgICAgIGJhZy5pbm5lciA9IHt9O1xuICAgICAgICAgIGJhZy5kcmF3KCk7XG4gICAgICAgICAgR2FtZS5hcmVhLmJhZ3MuYWRkKGJhZyk7XG4gICAgICAgICAgcmVzb2x2ZShiYWcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzc2lnbiAobmFtZSwgb2JqZWN0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogb2JqZWN0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKiDorr7nva7muLjmiI/mmoLlgZzmoIflv5fkuLpmYWxzZe+8jOWQr+WKqOa4uOaIj+S4u+W+queOr++8jOaOpeWPl+i+k+WFpSAqL1xuICAgIHN0YXJ0ICgpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiDmmoLlgZzmuLjmiI8gKi9cbiAgICBwYXVzZSAoKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5wYXVzZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldCBwYXVzZWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnBhdXNlZDtcbiAgICB9XG5cbiAgICBzZXQgcGF1c2VkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5wYXVzZWQgcmVhZG9ubHksIHVzZSBHYW1lLnBhdXNlKCkgaW5zdGVhZFwiKTtcbiAgICB9XG5cbiAgICBnZXQgd2luZG93cyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykud2luZG93cztcbiAgICB9XG5cbiAgICBzZXQgd2luZG93cyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUud2luZG93cyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgY29uZmlnICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jb25maWc7XG4gICAgfVxuXG4gICAgc2V0IGNvbmZpZyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuY29uZmlnIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpdGVtcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaXRlbXM7XG4gICAgfVxuXG4gICAgc2V0IGl0ZW1zICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5pdGVtcyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc2tpbGxzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5za2lsbHM7XG4gICAgfVxuXG4gICAgc2V0IHNraWxscyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuc2tpbGxzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBzb3VuZHMgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnNvdW5kcztcbiAgICB9XG5cbiAgICBzZXQgc291bmRzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5zb3VuZHMgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGxheWVycyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykubGF5ZXJzO1xuICAgIH1cblxuICAgIHNldCBsYXllcnMgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLmxheWVycyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhZ2UgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnN0YWdlO1xuICAgIH1cblxuICAgIHNldCBzdGFnZSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuc3RhZ2UgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqIOa4heeQhuiInuWPsO+8jOWNs+WIoOmZpOiInuWPsOS4iuaJgOacieWFg+e0oCAqL1xuICAgIGNsZWFyU3RhZ2UgKCkge1xuICAgICAgaWYgKEdhbWUuYXJlYSkge1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICAgYWN0b3IuZXJhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBiYWcgb2YgR2FtZS5hcmVhLmJhZ3MpIHtcbiAgICAgICAgICBiYWcuZXJhc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5sYXllcnMubWFwTGF5ZXIuY2xlYXIoKTtcbiAgICAgIHRoaXMubGF5ZXJzLm1hcEhpZGVMYXllci5jbGVhcigpO1xuICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcy5zdGFnZS5jaGlsZHJlbikge1xuICAgICAgICBsYXllci5jbGVhcigpO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGFnZS5yZWxlYXNlUmVuZGVyZXIoKTtcbiAgICB9XG5cbiAgICAvKiog5ri45oiP5Yid5aeL5YyWICovXG4gICAgaW5pdCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8vIOiInuWPsFxuICAgICAgcHJpdmF0ZXMuc3RhZ2UgPSBuZXcgU3ByaXRlLlN0YWdlKHByaXZhdGVzLmNvbmZpZy53aWR0aCwgcHJpdmF0ZXMuY29uZmlnLmhlaWdodCk7XG4gICAgICAvLyDlu7rnq4vkuIDkuKrlj6/ku6Xoh6rliqjkvLjnvKnnmoTnqpflj6PvvIzlubblsIboiJ7lj7DliqDlhaXlhbbkuK1cbiAgICAgIHByaXZhdGVzLndpbmRvd3Muc3RhZ2UgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzdGFnZVwiKVxuICAgICAgICAuYXBwZW5kQ2hpbGQocHJpdmF0ZXMuc3RhZ2UuY2FudmFzKVxuICAgICAgICAuc2hvdygpO1xuXG4gICAgICAvLyDlnLDlm77lsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5tYXBMYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMubWFwTGF5ZXIubmFtZSA9IFwibWFwTGF5ZXJcIjtcbiAgICAgIC8vIOWcsOWbvuWxgiAtIDJcbiAgICAgIHByaXZhdGVzLmxheWVycy5tYXBIaWRlTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLm1hcEhpZGVMYXllci5uYW1lID0gXCJtYXBIaWRlTGF5ZXJcIjtcbiAgICAgIC8vIOeJqeWTgeWxglxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLml0ZW1MYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMuaXRlbUxheWVyLm5hbWUgPSBcIml0ZW1MYXllclwiO1xuICAgICAgLy8g5Lq654mp5bGC77yM5YyF5ous546p5a62XG4gICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllci5uYW1lID0gXCJhY3RvckxheWVyXCI7XG4gICAgICAvLyDkv6Hmga/lsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5pbmZvTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmluZm9MYXllci5uYW1lID0gXCJpbmZvckxheWVyXCI7XG4gICAgICAvLyDmioDog73mlYjmnpzlsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5za2lsbExheWVyID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgIHByaXZhdGVzLmxheWVycy5za2lsbExheWVyLm5hbWUgPSBcInNraWxsTGF5ZXJcIjtcbiAgICAgIC8vIOWvueivneWxglxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmRpYWxvZ3VlTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmRpYWxvZ3VlTGF5ZXIubmFtZSA9IFwiZGlhbG9ndWVMYXllclwiO1xuXG4gICAgICBwcml2YXRlcy5zdGFnZS5hcHBlbmRDaGlsZChcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLm1hcExheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMubWFwSGlkZUxheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMuaXRlbUxheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLmluZm9MYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLnNraWxsTGF5ZXIsXG4gICAgICAgIHByaXZhdGVzLmxheWVycy5kaWFsb2d1ZUxheWVyXG4gICAgICApO1xuXG4gICAgICAvLyDosIPmlbTkurrnianlsYLpobrluo/vvIzkuZ/lsLHmmK/kuIrmlrnnmoTkurrniankvJrooqvkuIvmlrnnmoTkurrnianpga7nm5bvvIzkvovlpoJcbiAgICAgIC8qKlxuICAgICAgICogQUEgQkJcbiAgICAgICAqIEFBIEJCXG4gICAgICAgKiDov5nmoLfkurrnialB5ZKMQumDveS4jeW5sua2ie+8jOS9huaYr0HnmoTkvY3nva7lpoLmnpzlnKhC55qE5LiK6Z2i77yM5bm25LiU57Sn5oyo552A5bCx5Y+Y5oiQ5LqGXG4gICAgICAgKiBBQVxuICAgICAgICogQkJcbiAgICAgICAqIEJCXG4gICAgICAgKiDov5nmoLfkurrnialB55qE5LiL5Y2K6Lqr5bCx6KKr5Lq654mpQumBrueblu+8jOi/meWwseaYr+i/m+ihjOaOkuW6j++8jOWQpuWImeWmguaenOWPmOaIkFxuICAgICAgICogQUFcbiAgICAgICAqIEFBXG4gICAgICAgKiBCQlxuICAgICAgICog6L+Z5qC35bCx5pivQueahOS4iuWNiui6q+iiq+S6uueJqUHpga7nm5bvvIzov5nlsLHlvojlpYfmgKpcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuc3RhZ2Uub24oXCJiZWZvcmVEcmF3XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKEdhbWUuaGVybykge1xuICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuY2hpbGRyZW4uc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEueSA8IGIueSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEueSA+IGIueSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChHYW1lLnBhdXNlZCA9PSBmYWxzZSkge1xuICAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgICAgKi9cbiAgICAgIFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKEdhbWUucGF1c2VkID09IGZhbHNlKSB7XG4gICAgICAgICAgR2FtZS5zdGFnZS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICBsZXQgdXBkYXRlTmV4dCA9IGZhbHNlO1xuICAgICAgR2FtZS5zdGFnZS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZU5leHQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgICBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgaWYgKEdhbWUucGF1c2VkID09IGZhbHNlICYmIHVwZGF0ZU5leHQpIHtcbiAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgICB1cGRhdGVOZXh0ID0gZmFsc2U7XG4gICAgICAgfVxuICAgICAgfSk7XG4gICAgICAqL1xuXG4gICAgICBsZXQgZnBzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBmcHNFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICBmcHNFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGZwc0VsZW1lbnQuc3R5bGUuekluZGV4ID0gOTk5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcHNFbGVtZW50KTtcblxuICAgICAgbGV0IGZwcyA9IDA7XG4gICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHByaXZhdGVzLnN0YWdlLm9uKFwiYWZ0ZXJEcmF3XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnBzKys7XG4gICAgICB9KTtcbiAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgZiA9IGZwcyAvICgobm93IC0gc3RhcnQpLzEwMDApO1xuICAgICAgICBmcHMgPSAwO1xuICAgICAgICBzdGFydCA9IG5vdztcbiAgICAgICAgZnBzRWxlbWVudC50ZXh0Q29udGVudCA9IGYudG9GaXhlZCgxKTtcbiAgICAgIH0sIDEwMDApO1xuXG4gICAgICBjb25zb2xlLmxvZyhcIlJQRyBHYW1lIDAuMS4xIEZseWluZyFcIik7XG4gICAgfVxuICB9O1xuXG4gIGxldCBHYW1lID0gd2luZG93LkdhbWUgPSBuZXcgR2FtZUNvcmUoKTtcblxuICAvLyB1bmRlciBub2RlLXdlYmtpdFxuICBpZiAod2luZG93LnJlcXVpcmUpIHtcbiAgICBHYW1lLmNvbmZpZy5zY2FsZSA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBHYW1lQm9vdHN0cmFwICgpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIEdhbWUuaW5pdCgpO1xuICAgICAgR2FtZS5JbnB1dC5pbml0KCk7XG4gICAgICBHYW1lLndpbmRvd3MubWFpbi5zaG93KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKEdhbWVCb290c3RyYXAoKSA9PSBmYWxzZSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIEdhbWVCb290c3RyYXAoKTtcbiAgICB9KTtcbiAgfVxuXG59KSgpO1xuIl19

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
  /** 全部窗口 */
  var windows = new Set();
  /**窗口z-index，不断递增 */
  var zIndex = 227;

  Game.assign("Window", (function (_Sprite$Event) {
    _inherits(GameWindow, _Sprite$Event);

    _createClass(GameWindow, null, [{
      key: "create",
      value: function create(id) {
        var win = new Game.Window(id);
        return win;
      }

      /**
       * @constructor
       */
    }]);

    function GameWindow(id) {
      var _this = this;

      _classCallCheck(this, GameWindow);

      _get(Object.getPrototypeOf(GameWindow.prototype), "constructor", this).call(this);

      var privates = internal(this);
      privates.id = id;
      privates.css = document.createElement("style");
      privates.html = document.createElement("div");
      privates.index = -1;

      // 随机一个字符串作为dom的id
      privates.html.id = "GW" + Math.random().toString(16).substr(2);
      privates.html.classList.add(id);
      privates.html.classList.add("game-window");
      privates.html.style.display = "none";
      document.body.appendChild(privates.html);
      document.head.appendChild(privates.css);

      privates.html.addEventListener("mousedown", function (event) {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (privates.html.style.left) {
          var t = privates.html.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (privates.html.style.top) {
          var t = privates.html.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (privates.html.style.transform) {
          var t = privates.html.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
          if (t) {
            scale = parseFloat(t[1]);
          } else {
            scale = 1.0;
          }
        } else {
          scale = 1.0;
        }

        if (Number.isFinite(left) && Number.isFinite(top) && Number.isFinite(scale)) {
          x -= left;
          y -= top;
          x /= scale;
          y /= scale;
          _this.emit("mousedown", false, {
            x: x,
            y: y
          });
        }
      });

      windows.add(this);
    }

    _createClass(GameWindow, [{
      key: "destroy",
      value: function destroy() {
        var privates = internal(this);
        if (this.showing) {
          this.hide();
        }
        if (privates.html) {
          document.body.removeChild(privates.html);
          privates.html = null;
        }
        if (privates.css) {
          document.head.removeChild(privates.css);
          privates.css = null;
        }
        if (windows.has(this)) {
          windows["delete"](this);
        }
      }
    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        var _this2 = this;

        Sprite.Input.whenPress(keys, function (key) {
          if (_this2.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        var _this3 = this;

        Sprite.Input.whenUp(keys, function (key) {
          if (_this3.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        var _this4 = this;

        Sprite.Input.whenDown(keys, function (key) {
          if (_this4.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
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
    }, {
      key: "show",
      value: function show() {
        var privates = internal(this);
        GameWindowResize();
        if (this.showing == false && privates.html) {
          this.emit("beforeShow");

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = windows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var win = _step.value;

              if (win.atop) {
                win.emit("deactive");
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

          privates.index = zIndex;
          privates.html.style.zIndex = privates.index;
          privates.html.style.display = "block";
          zIndex++;
          this.emit("afterShow");
          this.emit("active");
        }
        return this;
      }
    }, {
      key: "hide",
      value: function hide() {
        var privates = internal(this);
        if (privates.html) {
          this.emit("beforeHide");

          privates.index = -1;
          this.emit("afterHide");
          this.emit("deactive");

          if (privates && privates.html) {
            privates.html.style.zIndex = privates.index;
            privates.html.style.display = "none";
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = windows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var win = _step2.value;

              if (win.atop) {
                win.emit("active");
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
        }
        return this;
      }
    }, {
      key: "querySelector",
      value: function querySelector(selector) {
        var privates = internal(this);
        return document.querySelector("#" + privates.html.id + " " + selector);
      }
    }, {
      key: "querySelectorAll",
      value: function querySelectorAll(selector) {
        var privates = internal(this);
        return document.querySelectorAll("#" + privates.html.id + " " + selector);
      }
    }, {
      key: "appendChild",
      value: function appendChild(domElement) {
        internal(this).html.appendChild(domElement);
        return this;
      }
    }, {
      key: "removeChild",
      value: function removeChild(domElement) {
        internal(this).html.removeChild(domElement);
        return this;
      }
    }, {
      key: "index",
      get: function get() {
        var privates = internal(this);
        return privates.index;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Window.index readonly");
      }
    }, {
      key: "showing",
      get: function get() {
        var privates = internal(this);
        if (privates.html && privates.html.style.display != "none") {
          return true;
        }
        return false;
      },
      set: function set(value) {
        throw new Error("Game.Window.showing readonly");
      }
    }, {
      key: "atop",
      get: function get() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = windows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var win = _step3.value;

            if (win.showing && win.index > this.index) {
              return false;
            }
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

        return true;
      },
      set: function set(value) {
        throw new Error("Game.Window.atop readonly");
      }
    }, {
      key: "html",
      get: function get() {
        return internal(this).html.innerHTML;
      },
      set: function set(value) {
        internal(this).html.innerHTML = value;
      }
    }, {
      key: "css",
      get: function get() {
        return internal(this).css.innerHTML;
      },
      set: function set(value) {
        internal(this).css.innerHTML = value;
      }
    }]);

    return GameWindow;
  })(Sprite.Event));

  // 当窗口大小改变时改变游戏窗口大小
  function GameWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var scale = 1;
    var leftMargin = 0;
    var topMargin = 0;
    var mobile = false;

    if (navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS|IEMobile|Opera Mini/i)) {
      if (width < height) {
        var t = width;
        width = height;
        height = t;
        mobile = true;
      }
    }

    if (Game.config.scale == false) {
      // 不拉伸游戏窗口，按原始大小计算窗口居中
      leftMargin = Math.floor((width - Game.config.width) / 2);
      topMargin = Math.floor((height - Game.config.height) / 2);
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
      topMargin = Math.floor((height - h) / 2);

      scale = Math.min(w / Game.config.width, h / Game.config.height);

      // scale = scale.toFixed(3);
    }

    // html窗口拉伸（css中控制了原始大小）
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = windows[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var win = _step4.value;

        internal(win).html.style.left = leftMargin + "px";
        internal(win).html.style.top = topMargin + "px";
        internal(win).html.style.transformOrigin = "0 0 0";
        internal(win).html.style.transform = "scale(" + scale + ", " + scale + ") translateZ(0)";
        internal(win).html.style.webkitTransform = "scale(" + scale + ", " + scale + ") translateZ(0)";
        internal(win).html.style.filter = "none";
        internal(win).html.style.webkitFilter = "blur(0px)";
        internal(win).html.style.mozFilter = "blur(0px)";
        internal(win).html.style.msFilter = "blur(0px)";
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

    if (Game.hero) {
      Game.hero.focus();
    }
  }

  GameWindowResize();
  window.addEventListener("resize", function () {
    GameWindowResize();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLE1BQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXhCLE1BQUksTUFBTSxHQUFHLEdBQUcsQ0FBQzs7QUFFakIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2NBQVEsVUFBVTs7aUJBQVYsVUFBVTs7YUFDdEIsZ0JBQUMsRUFBRSxFQUFFO0FBQ2pCLFlBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM3QixlQUFPLEdBQUcsQ0FBQztPQUNaOzs7Ozs7O0FBS1csYUFUYyxVQUFVLENBU3ZCLEVBQUUsRUFBRTs7OzRCQVRTLFVBQVU7O0FBVWxDLGlDQVZ3QixVQUFVLDZDQVUxQjs7QUFFUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLGNBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxjQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7QUFHcEIsY0FBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELGNBQVEsQ0FBQyxJQUFJLENBQUMsU0FB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ZSI6IkdhbWVXaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG4gIC8qKiDlhajpg6jnqpflj6MgKi9cbiAgbGV0IHdpbmRvd3MgPSBuZXcgU2V0KCk7XG4gIC8qKueql+WPo3otaW5kZXjvvIzkuI3mlq3pgJLlop4gKi9cbiAgbGV0IHpJbmRleCA9IDIyNztcblxuICBHYW1lLmFzc2lnbihcIldpbmRvd1wiLCBjbGFzcyBHYW1lV2luZG93IGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcbiAgICBzdGF0aWMgY3JlYXRlIChpZCkge1xuICAgICAgbGV0IHdpbiA9IG5ldyBHYW1lLldpbmRvdyhpZClcbiAgICAgIHJldHVybiB3aW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGlkKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmlkID0gaWQ7XG4gICAgICBwcml2YXRlcy5jc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICBwcml2YXRlcy5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHByaXZhdGVzLmluZGV4ID0gLTE7XG5cbiAgICAgIC8vIOmaj+acuuS4gOS4quWtl+espuS4suS9nOS4umRvbeeahGlkXG4gICAgICBwcml2YXRlcy5odG1sLmlkID0gXCJHV1wiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc3Vic3RyKDIpO1xuICAgICAgcHJpdmF0ZXMuaHRtbC5jbGFzc0xpc3QuYWRkKGlkKTtcbiAgICAgIHByaXZhdGVzLmh0bWwuY2xhc3NMaXN0LmFkZChcImdhbWUtd2luZG93XCIpO1xuICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByaXZhdGVzLmh0bWwpO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChwcml2YXRlcy5jc3MpXG5cbiAgICAgIHByaXZhdGVzLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICBsZXQgeSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICAgICAgbGV0IGxlZnQgPSBudWxsO1xuICAgICAgICBsZXQgdG9wID0gbnVsbDtcbiAgICAgICAgbGV0IHNjYWxlID0gbnVsbDtcblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS5sZWZ0KSB7XG4gICAgICAgICAgbGV0IHQgPSBwcml2YXRlcy5odG1sLnN0eWxlLmxlZnQubWF0Y2goLyhcXGQrKXB4Lyk7XG4gICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIGxlZnQgPSBwYXJzZUludCh0WzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS50b3ApIHtcbiAgICAgICAgICBsZXQgdCA9IHByaXZhdGVzLmh0bWwuc3R5bGUudG9wLm1hdGNoKC8oXFxkKylweC8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludCh0WzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS50cmFuc2Zvcm0pIHtcbiAgICAgICAgICBsZXQgdCA9IHByaXZhdGVzLmh0bWwuc3R5bGUudHJhbnNmb3JtLm1hdGNoKC9zY2FsZVxcKChbXFxkXFwuXSspLCAoW1xcZFxcLl0rKVxcKS8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICBzY2FsZSA9IHBhcnNlRmxvYXQodFsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjYWxlID0gMS4wO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZSA9IDEuMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobGVmdCkgJiYgTnVtYmVyLmlzRmluaXRlKHRvcCkgJiYgTnVtYmVyLmlzRmluaXRlKHNjYWxlKSkge1xuICAgICAgICAgIHggLT0gbGVmdDtcbiAgICAgICAgICB5IC09IHRvcDtcbiAgICAgICAgICB4IC89IHNjYWxlO1xuICAgICAgICAgIHkgLz0gc2NhbGU7XG4gICAgICAgICAgdGhpcy5lbWl0KFwibW91c2Vkb3duXCIsIGZhbHNlLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgd2luZG93cy5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLnNob3dpbmcpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHByaXZhdGVzLmh0bWwpO1xuICAgICAgICBwcml2YXRlcy5odG1sID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChwcml2YXRlcy5jc3MpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChwcml2YXRlcy5jc3MpO1xuICAgICAgICBwcml2YXRlcy5jc3MgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvd3MuaGFzKHRoaXMpKSB7XG4gICAgICAgIHdpbmRvd3MuZGVsZXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoZW5QcmVzcyAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIFNwcml0ZS5JbnB1dC53aGVuUHJlc3Moa2V5cywgKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdG9wKSB7XG4gICAgICAgICAgY2FsbGJhY2soa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3aGVuVXAgKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBTcHJpdGUuSW5wdXQud2hlblVwKGtleXMsIChrZXkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXRvcCkge1xuICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2hlbkRvd24gKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBTcHJpdGUuSW5wdXQud2hlbkRvd24oa2V5cywgKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdG9wKSB7XG4gICAgICAgICAgY2FsbGJhY2soa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc3NpZ24gKG5hbWUsIG9iamVjdCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG9iamVjdFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNob3cgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBHYW1lV2luZG93UmVzaXplKCk7XG4gICAgICBpZiAodGhpcy5zaG93aW5nID09IGZhbHNlICYmIHByaXZhdGVzLmh0bWwpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwiYmVmb3JlU2hvd1wiKTtcblxuICAgICAgICBmb3IgKGxldCB3aW4gb2Ygd2luZG93cykge1xuICAgICAgICAgIGlmICh3aW4uYXRvcCkge1xuICAgICAgICAgICAgd2luLmVtaXQoXCJkZWFjdGl2ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlcy5pbmRleCA9IHpJbmRleDtcbiAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS56SW5kZXggPSBwcml2YXRlcy5pbmRleDtcbiAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB6SW5kZXgrKztcbiAgICAgICAgdGhpcy5lbWl0KFwiYWZ0ZXJTaG93XCIpO1xuICAgICAgICB0aGlzLmVtaXQoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmh0bWwpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwiYmVmb3JlSGlkZVwiKTtcblxuICAgICAgICBwcml2YXRlcy5pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLmVtaXQoXCJhZnRlckhpZGVcIik7XG4gICAgICAgIHRoaXMuZW1pdChcImRlYWN0aXZlXCIpO1xuXG4gICAgICAgIGlmIChwcml2YXRlcyAmJiBwcml2YXRlcy5odG1sKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS56SW5kZXggPSBwcml2YXRlcy5pbmRleDtcbiAgICAgICAgICBwcml2YXRlcy5odG1sLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICAgICAgaWYgKHdpbi5hdG9wKSB7XG4gICAgICAgICAgICB3aW4uZW1pdChcImFjdGl2ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHF1ZXJ5U2VsZWN0b3IgKHNlbGVjdG9yKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtwcml2YXRlcy5odG1sLmlkfSAke3NlbGVjdG9yfWApO1xuICAgIH1cblxuICAgIHF1ZXJ5U2VsZWN0b3JBbGwgKHNlbGVjdG9yKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtwcml2YXRlcy5odG1sLmlkfSAke3NlbGVjdG9yfWApO1xuICAgIH1cblxuICAgIGdldCBpbmRleCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5pbmRleDtcbiAgICB9XG5cbiAgICBzZXQgaW5kZXggKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5XaW5kb3cuaW5kZXggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dpbmcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCAmJiBwcml2YXRlcy5odG1sLnN0eWxlLmRpc3BsYXkgIT0gXCJub25lXCIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0IHNob3dpbmcgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLldpbmRvdy5zaG93aW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBhdG9wICgpIHtcbiAgICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICAgIGlmICh3aW4uc2hvd2luZyAmJiB3aW4uaW5kZXggPiB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXQgYXRvcCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuV2luZG93LmF0b3AgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGh0bWwgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmh0bWwuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldCBodG1sICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaHRtbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgY3NzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jc3MuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldCBjc3MgKHZhbHVlKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5jc3MuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgfVxuXG4gICAgYXBwZW5kQ2hpbGQgKGRvbUVsZW1lbnQpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmh0bWwuYXBwZW5kQ2hpbGQoZG9tRWxlbWVudCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmVDaGlsZCAoZG9tRWxlbWVudCkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaHRtbC5yZW1vdmVDaGlsZChkb21FbGVtZW50KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8g5b2T56qX5Y+j5aSn5bCP5pS55Y+Y5pe25pS55Y+Y5ri45oiP56qX5Y+j5aSn5bCPXG4gIGZ1bmN0aW9uIEdhbWVXaW5kb3dSZXNpemUgKCkge1xuICAgIGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjYWxlID0gMTtcbiAgICBsZXQgbGVmdE1hcmdpbiA9IDA7XG4gICAgbGV0IHRvcE1hcmdpbiA9IDA7XG4gICAgbGV0IG1vYmlsZSA9IGZhbHNlO1xuXG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWR8aVBob25lfGlQb2R8QW5kcm9pZHxCbGFja0JlcnJ5fHdlYk9TfElFTW9iaWxlfE9wZXJhIE1pbmkvaSkpIHtcbiAgICAgIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgICBsZXQgdCA9IHdpZHRoO1xuICAgICAgICB3aWR0aCA9IGhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gdDtcbiAgICAgICAgbW9iaWxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoR2FtZS5jb25maWcuc2NhbGUgPT0gZmFsc2UpIHtcbiAgICAgIC8vIOS4jeaLieS8uOa4uOaIj+eql+WPo++8jOaMieWOn+Wni+Wkp+Wwj+iuoeeul+eql+WPo+WxheS4rVxuICAgICAgbGVmdE1hcmdpbiA9IE1hdGguZmxvb3IoKHdpZHRoIC0gR2FtZS5jb25maWcud2lkdGgpIC8gMik7XG4gICAgICB0b3BNYXJnaW4gPSBNYXRoLmZsb29yKChoZWlnaHQgLSBHYW1lLmNvbmZpZy5oZWlnaHQpIC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOaLieS8uOa4uOaIj+eql+WPo++8jOmmluWFiOiuoeeul+a4uOaIj+WOn+Wni+Wkp+Wwj+avlOS+i1xuICAgICAgbGV0IHJhdGlvID0gR2FtZS5jb25maWcud2lkdGggLyBHYW1lLmNvbmZpZy5oZWlnaHQ7XG4gICAgICAvLyB3aWR0aCBmaXJzdFxuICAgICAgbGV0IHcgPSB3aWR0aDtcbiAgICAgIGxldCBoID0gdyAvIHJhdGlvO1xuICAgICAgLy8gdGhlbiBoZWlnaHRcbiAgICAgIGlmIChoID4gaGVpZ2h0KSB7XG4gICAgICAgIGggPSBoZWlnaHQ7XG4gICAgICAgIHcgPSBoICogcmF0aW87XG4gICAgICB9XG5cbiAgICAgIHcgPSBNYXRoLmZsb29yKHcpO1xuICAgICAgaCA9IE1hdGguZmxvb3IoaCk7XG4gICAgICBsZWZ0TWFyZ2luID0gTWF0aC5mbG9vcigod2lkdGggLSB3KSAvIDIpO1xuICAgICAgdG9wTWFyZ2luID0gTWF0aC5mbG9vcigoaGVpZ2h0IC0gaCkgLyAyKTtcblxuICAgICAgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgdyAvIEdhbWUuY29uZmlnLndpZHRoLFxuICAgICAgICBoIC8gR2FtZS5jb25maWcuaGVpZ2h0XG4gICAgICApO1xuXG4gICAgICAvLyBzY2FsZSA9IHNjYWxlLnRvRml4ZWQoMyk7XG4gICAgfVxuXG4gICAgLy8gaHRtbOeql+WPo+aLieS8uO+8iGNzc+S4reaOp+WItuS6huWOn+Wni+Wkp+Wwj++8iVxuICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUubGVmdCA9IGAke2xlZnRNYXJnaW59cHhgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLnRvcCA9IGAke3RvcE1hcmdpbn1weGA7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gXCIwIDAgMFwiO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZX0pIHRyYW5zbGF0ZVooMClgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZX0pIHRyYW5zbGF0ZVooMClgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLmZpbHRlciA9IFwibm9uZVwiO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLndlYmtpdEZpbHRlciA9IFwiYmx1cigwcHgpXCI7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUubW96RmlsdGVyID0gXCJibHVyKDBweClcIjtcbiAgICAgIGludGVybmFsKHdpbikuaHRtbC5zdHlsZS5tc0ZpbHRlciA9IFwiYmx1cigwcHgpXCI7XG5cbiAgICB9XG5cbiAgICBpZiAoR2FtZS5oZXJvKSB7XG4gICAgICBHYW1lLmhlcm8uZm9jdXMoKTtcbiAgICB9XG5cbiAgfVxuXG4gIEdhbWVXaW5kb3dSZXNpemUoKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xuICAgIEdhbWVXaW5kb3dSZXNpemUoKTtcbiAgfSk7XG5cbn0pKCk7XG4iXX0=

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

  var win = Game.windows.archive = Game.Window.create("archiveWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"archiveWindowItemBar\">\n        <button id=\"archiveWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"archiveWindowSave\" class=\"brownButton\">保存</button>\n      </div>\n      <div id=\"archiveWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #archiveWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .archiveWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .archiveWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #archiveWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      display: block;\n      margin-bottom: 5px;\n    }\n\n    #archiveWindowClose {\n      float: right;\n    }\n  ";

  var archiveWindowSave = win.querySelector("button#archiveWindowSave");
  var archiveWindowClose = win.querySelector("button#archiveWindowClose");
  var archiveWindowTable = win.querySelector("#archiveWindowTable");

  archiveWindowSave.addEventListener("click", function () {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 45;
    var context = canvas.getContext("2d");
    context.drawImage(Game.stage.canvas, 0, 0, Game.stage.canvas.width, Game.stage.canvas.height, 0, 0, 80, 45);

    Game.Archive.save({
      hero: Game.hero.data,
      screenshot: canvas.toDataURL("image/jpeg")
    });

    win.open();
  });

  archiveWindowClose.addEventListener("click", function () {
    win.hide();
    if (!Game.hero) {
      Game.windows.main.show();
    }
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      archiveWindowClose.click();
    }, 20);
  });

  win.assign("open", function () {

    if (Game.hero) {
      archiveWindowSave.style.visibility = "visible";
    } else {
      archiveWindowSave.style.visibility = "hidden";
    }

    var table = "";
    var list = Game.Archive.list();
    list.forEach(function (element) {
      var line = "<div class=\"archiveWindowItem\">\n";
      var archive = Game.Archive.get("SAVE_" + element);
      line += "  <button data-type=\"remove\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">删除</button>\n";
      line += "  <button data-type=\"load\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">读取</button>\n";
      line += "  <img alt=\"\" src=\"" + (archive.screenshot || "") + "\" width=\"80\" height=\"45\" style=\"display: inline-block; margin: 5px;\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + archive.name + "</label>\n";
      line += "  <label style=\"margin: 10px;\">" + archive.date + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    archiveWindowTable.innerHTML = table;
    Game.windows.archive.show();
  });

  archiveWindowTable.addEventListener("click", function (event) {
    var type = event.target.getAttribute("data-type");
    var id = event.target.getAttribute("data-id");
    if (type && id) {
      if (type == "remove") {
        Game.Archive.remove(id);
        win.open();
      } else if (type == "load") {
        Game.Archive.load(id);
        win.hide();
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUdiLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxrVEFRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGlqQkE4Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbEUsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdEQsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxVQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFF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LENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93QXJjaGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5hcmNoaXZlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiYXJjaGl2ZVdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGRpdiBpZD1cImFyY2hpdmVXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhcmNoaXZlV2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6ZetPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhcmNoaXZlV2luZG93U2F2ZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7kv53lrZg8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBpZD1cImFyY2hpdmVXaW5kb3dUYWJsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgI2FyY2hpdmVXaW5kb3dUYWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICBoZWlnaHQ6IDMyMHB4O1xuICAgIH1cblxuICAgIC5hcmNoaXZlV2luZG93SXRlbSB7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgIG1hcmdpbjogMTBweCAxMHB4O1xuICAgIH1cblxuICAgIC5hcmNoaXZlV2luZG93SXRlbSA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfVxuXG4gICAgI2FyY2hpdmVXaW5kb3dJdGVtQmFyIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjYXJjaGl2ZVdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGFyY2hpdmVXaW5kb3dTYXZlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jYXJjaGl2ZVdpbmRvd1NhdmVcIik7XG4gIGxldCBhcmNoaXZlV2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNhcmNoaXZlV2luZG93Q2xvc2VcIik7XG4gIGxldCBhcmNoaXZlV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNhcmNoaXZlV2luZG93VGFibGVcIik7XG5cbiAgYXJjaGl2ZVdpbmRvd1NhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMud2lkdGggPSA4MDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gNDU7XG4gICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnRleHQuZHJhd0ltYWdlKEdhbWUuc3RhZ2UuY2FudmFzLCAwLCAwLCBHYW1lLnN0YWdlLmNhbnZhcy53aWR0aCwgR2FtZS5zdGFnZS5jYW52YXMuaGVpZ2h0LCAwLCAwLCA4MCwgNDUpO1xuXG4gICAgR2FtZS5BcmNoaXZlLnNhdmUoe1xuICAgICAgaGVybzogR2FtZS5oZXJvLmRhdGEsXG4gICAgICBzY3JlZW5zaG90OiBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiKVxuICAgIH0pO1xuXG4gICAgd2luLm9wZW4oKTtcbiAgfSk7XG5cbiAgYXJjaGl2ZVdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBpZiAoIUdhbWUuaGVybykge1xuICAgICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGFyY2hpdmVXaW5kb3dDbG9zZS5jbGljaygpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKEdhbWUuaGVybykge1xuICAgICAgYXJjaGl2ZVdpbmRvd1NhdmUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmNoaXZlV2luZG93U2F2ZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICB9XG5cbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIGxldCBsaXN0ID0gR2FtZS5BcmNoaXZlLmxpc3QoKTtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIGxldCBsaW5lID0gYDxkaXYgY2xhc3M9XCJhcmNoaXZlV2luZG93SXRlbVwiPlxcbmA7XG4gICAgICBsZXQgYXJjaGl2ZSA9IEdhbWUuQXJjaGl2ZS5nZXQoYFNBVkVfJHtlbGVtZW50fWApO1xuICAgICAgbGluZSArPSBgICA8YnV0dG9uIGRhdGEtdHlwZT1cInJlbW92ZVwiIGRhdGEtaWQ9XCJTQVZFXyR7ZWxlbWVudH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCIgc3R5bGU9XCJmbG9hdDogcmlnaHQ7XCI+5Yig6ZmkPC9idXR0b24+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGJ1dHRvbiBkYXRhLXR5cGU9XCJsb2FkXCIgZGF0YS1pZD1cIlNBVkVfJHtlbGVtZW50fVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIiBzdHlsZT1cImZsb2F0OiByaWdodDtcIj7or7vlj5Y8L2J1dHRvbj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8aW1nIGFsdD1cIlwiIHNyYz1cIiR7YXJjaGl2ZS5zY3JlZW5zaG90IHx8IFwiXCJ9XCIgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjQ1XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IG1hcmdpbjogNXB4O1wiPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cImZvbnQtc2l6ZTogMjBweDsgbWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5uYW1lfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPiR7YXJjaGl2ZS5kYXRlfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L2Rpdj5cXG5cIlxuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICB9KTtcblxuICAgIGFyY2hpdmVXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICBHYW1lLndpbmRvd3MuYXJjaGl2ZS5zaG93KCk7XG4gIH0pO1xuXG4gIGFyY2hpdmVXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IHR5cGUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpO1xuICAgIGxldCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmICh0eXBlICYmIGlkKSB7XG4gICAgICBpZiAodHlwZSA9PSBcInJlbW92ZVwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5yZW1vdmUoaWQpO1xuICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwibG9hZFwiKSB7XG4gICAgICAgIEdhbWUuQXJjaGl2ZS5sb2FkKGlkKTtcbiAgICAgICAgd2luLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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

  var win = Game.windows.buy = Game.Window.create("buyWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"buyWindowItemBar\">\n\n      <button id=\"buyWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"buyWindowSell\" class=\"brownButton\">卖出</button>\n\n      <button id=\"buyWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"buyWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"buyWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"buyWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"buyWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"buyWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"buyWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"buyWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"buyWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n    #buyWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #buyWindowClose {\n      float: right;\n    }\n\n    #buyWindowStatus {\n      float: right;\n    }\n\n    .buyWindow table {\n      width: 100%;\n    }\n\n    .buyWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .buyWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #buyWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var buyWindowClose = win.querySelector("button#buyWindowClose");
  var buyWindowSell = win.querySelector("button#buyWindowSell");

  var buyWindowAll = win.querySelector("button#buyWindowAll");
  var buyWindowWeapon = win.querySelector("button#buyWindowWeapon");
  var buyWindowArmor = win.querySelector("button#buyWindowArmor");
  var buyWindowPotion = win.querySelector("button#buyWindowPotion");
  var buyWindowMaterial = win.querySelector("button#buyWindowMaterial");
  var buyWindowBook = win.querySelector("button#buyWindowBook");
  var buyWindowMisc = win.querySelector("button#buyWindowMisc");

  var buyWindowGold = win.querySelector("span#buyWindowGold");
  var buyWindowTable = win.querySelector("#buyWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  buyWindowClose.addEventListener("click", function () {
    win.hide();
  });

  buyWindowSell.addEventListener("click", function () {
    win.hide();
    Game.windows.sell.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.sell.open(lastItems);
    }, 20);
  });

  buyWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  buyWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  buyWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  buyWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  buyWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  buyWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  buyWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    buyWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    buyWindowAll.style.color = defaultColor;
    buyWindowWeapon.style.color = defaultColor;
    buyWindowArmor.style.color = defaultColor;
    buyWindowPotion.style.color = defaultColor;
    buyWindowMaterial.style.color = defaultColor;
    buyWindowBook.style.color = defaultColor;
    buyWindowMisc.style.color = defaultColor;

    if (filter == null) {
      buyWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      buyWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      buyWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      buyWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      buyWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      buyWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      buyWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 1.2) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";

      if (Math.ceil(item.data.value * 1.2) > Game.hero.data.gold || items[itemId] <= 0) {
        line += "  <td><button disabled style=\"Opacity: 0.5;\" class=\"brownButton\">买入</button></td>\n";
      } else {
        line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">买入</button></td>\n";
      }

      line += "</tr>\n";
      table += line;
      index++;
    });

    buyWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = buyWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = buyWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword|spear|bow";
      } else if (filter.match(/sword/)) {
        filter = "head|body|feet";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book|scroll|letter";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword|spear|bow";
      } else if (filter.match(/potion/)) {
        filter = "head|body|feet";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book|scroll|letter";
      }
      win.open(lastItems, filter);
    }
  });

  buyWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && lastItems.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];

      Game.hero.data.gold -= Math.ceil(item.data.value * 1.2);
      if (Game.hero.data.items[itemId]) {
        Game.hero.data.items[itemId]++;
      } else {
        Game.hero.data.items[itemId] = 1;
      }

      lastItems[itemId]--;

      if (lastItems[itemId] == 0) {
        delete lastItems[itemId];
      }

      win.open(lastItems, lastFilter);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dCdXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdELEtBQUcsQ0FBQyxJQUFJLGd4Q0FrQ1AsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxpc0JBeUNOLENBQUM7O0FBRUYsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFOUQsTUFBSSxZQUFZLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzVELE1BQUksZUFBZSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRSxNQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDaEUsTUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xFLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3RFLE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM5RCxNQUFJLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRTlELE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1RCxNQUFJLGNB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QUFDLEVBQUU7QUFDMUIsZUFBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDMUI7O0FBRUQsU0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDakM7R0FDRixDQUFDLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93QnV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5idXkgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJidXlXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgPGRpdiBpZD1cImJ1eVdpbmRvd0l0ZW1CYXJcIj5cblxuICAgICAgPGJ1dHRvbiBpZD1cImJ1eVdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBpZD1cImJ1eVdpbmRvd1NlbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y2W5Ye6PC9idXR0b24+XG5cbiAgICAgIDxidXR0b24gaWQ9XCJidXlXaW5kb3dBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWo6YOoPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwiYnV5V2luZG93V2VhcG9uXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuatpuWZqDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBpZD1cImJ1eVdpbmRvd0FybW9yXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuaKpOeUsjwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBpZD1cImJ1eVdpbmRvd1BvdGlvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7oja/msLQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJidXlXaW5kb3dNYXRlcmlhbFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mnZDmlpk8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJidXlXaW5kb3dCb29rXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuS5puexjTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBpZD1cImJ1eVdpbmRvd01pc2NcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YW25LuWPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBpZD1cImJ1eVdpbmRvd0dvbGRcIj48L3NwYW4+XG5cbiAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3c6IGF1dG87IGhlaWdodDogMzAwcHg7XCI+XG4gICAgICA8dGFibGUgYm9yZGVyPVwiMVwiIGNlbGxzcGFjaW5nPVwiMFwiIGNlbGxwYWRkaW5nPVwiMFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDQwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAxMjBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDMwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQ+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPjwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5IGlkPVwiYnV5V2luZG93VGFibGVcIj48L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAjYnV5V2luZG93SXRlbUJhciA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjYnV5V2luZG93Q2xvc2Uge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgICNidXlXaW5kb3dTdGF0dXMge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgIC5idXlXaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgLmJ1eVdpbmRvdyB0YWJsZSBpbWcge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgLmJ1eVdpbmRvdyB0YWJsZSBidXR0b24ge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgI2J1eVdpbmRvd0dvbGQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgICAgYm90dG9tOiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgIH1cbiAgYDtcblxuICBsZXQgYnV5V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IGJ1eVdpbmRvd1NlbGwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dTZWxsXCIpO1xuXG4gIGxldCBidXlXaW5kb3dBbGwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dBbGxcIik7XG4gIGxldCBidXlXaW5kb3dXZWFwb24gPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dXZWFwb25cIik7XG4gIGxldCBidXlXaW5kb3dBcm1vciA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2J1eVdpbmRvd0FybW9yXCIpO1xuICBsZXQgYnV5V2luZG93UG90aW9uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jYnV5V2luZG93UG90aW9uXCIpO1xuICBsZXQgYnV5V2luZG93TWF0ZXJpYWwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dNYXRlcmlhbFwiKTtcbiAgbGV0IGJ1eVdpbmRvd0Jvb2sgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNidXlXaW5kb3dCb29rXCIpO1xuICBsZXQgYnV5V2luZG93TWlzYyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2J1eVdpbmRvd01pc2NcIik7XG5cbiAgbGV0IGJ1eVdpbmRvd0dvbGQgPSB3aW4ucXVlcnlTZWxlY3RvcihcInNwYW4jYnV5V2luZG93R29sZFwiKTtcbiAgbGV0IGJ1eVdpbmRvd1RhYmxlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjYnV5V2luZG93VGFibGVcIik7XG5cbiAgbGV0IGxhc3RJdGVtcyA9IG51bGw7XG4gIGxldCBsYXN0RmlsdGVyID0gbnVsbDtcbiAgbGV0IGxhc3RTZWxlY3QgPSAtMTtcblxuICBidXlXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHdpbi5oaWRlKCk7XG4gIH0pO1xuXG4gIGJ1eVdpbmRvd1NlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zZWxsLm9wZW4obGFzdEl0ZW1zKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJ0YWJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3Muc2VsbC5vcGVuKGxhc3RJdGVtcyk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICBidXlXaW5kb3dBbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbnVsbCk7XG4gIH0pO1xuXG4gIGJ1eVdpbmRvd1dlYXBvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcInN3b3JkfHNwZWFyfGJvd1wiKTtcbiAgfSk7XG5cbiAgYnV5V2luZG93QXJtb3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJoZWFkfGJvZHl8ZmVldFwiKTtcbiAgfSk7XG5cbiAgYnV5V2luZG93UG90aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwicG90aW9uXCIpO1xuICB9KTtcblxuICBidXlXaW5kb3dNYXRlcmlhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcIm1hdGVyaWFsXCIpO1xuICB9KTtcblxuICBidXlXaW5kb3dCb29rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwiYm9va3xzY3JvbGx8bGV0dGVyXCIpO1xuICB9KTtcblxuICBidXlXaW5kb3dNaXNjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwibWlzY1wiKTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKGl0ZW1zLCBmaWx0ZXIsIHNlbGVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3QgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZWN0ID0gLTE7XG4gICAgfVxuXG4gICAgbGFzdEl0ZW1zID0gaXRlbXM7XG4gICAgbGFzdEZpbHRlciA9IGZpbHRlcjtcbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgYnV5V2luZG93R29sZC50ZXh0Q29udGVudCA9IEdhbWUuaGVyby5kYXRhLmdvbGQgKyBcIkdcIjtcblxuICAgIGxldCBkZWZhdWx0Q29sb3IgPSBcIndoaXRlXCI7XG4gICAgbGV0IGFjdGl2ZUNvbG9yID0gXCJ5ZWxsb3dcIjtcblxuICAgIGJ1eVdpbmRvd0FsbC5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBidXlXaW5kb3dXZWFwb24uc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgYnV5V2luZG93QXJtb3Iuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgYnV5V2luZG93UG90aW9uLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGJ1eVdpbmRvd01hdGVyaWFsLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGJ1eVdpbmRvd0Jvb2suc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgYnV5V2luZG93TWlzYy5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcblxuICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgYnV5V2luZG93QWxsLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgIGJ1eVdpbmRvd1dlYXBvbi5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgIGJ1eVdpbmRvd0FybW9yLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICBidXlXaW5kb3dQb3Rpb24uc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWF0ZXJpYWwvKSkge1xuICAgICAgYnV5V2luZG93TWF0ZXJpYWwuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICBidXlXaW5kb3dCb29rLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgYnV5V2luZG93TWlzYy5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBTcHJpdGUuZWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW1Db3VudCwgaXRlbUlkKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaW5kZXhPZihpdGVtLmRhdGEudHlwZSkgPT0gLTEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IGluZGV4KSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuXG4gICAgICBpZiAoaXRlbS5pY29uKSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPjxpbWcgYWx0PVwiXCIgc3JjPVwiJHtpdGVtLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPiA8L3RkPlxcbmA7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7TWF0aC5jZWlsKGl0ZW0uZGF0YS52YWx1ZSAqIDEuMil9RzwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbUNvdW50fTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7aXRlbS5kYXRhLmRlc2NyaXB0aW9ufTwvdGQ+XFxuYDtcblxuICAgICAgaWYgKE1hdGguY2VpbChpdGVtLmRhdGEudmFsdWUgKiAxLjIpID4gR2FtZS5oZXJvLmRhdGEuZ29sZCB8fCBpdGVtc1tpdGVtSWRdIDw9IDApIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQ+PGJ1dHRvbiBkaXNhYmxlZCBzdHlsZT1cIk9wYWNpdHk6IDAuNTtcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Lmw5YWlPC9idXR0b24+PC90ZD5cXG5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQ+PGJ1dHRvbiBkYXRhLWlkPVwiJHtpdGVtSWR9XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuS5sOWFpTwvYnV0dG9uPjwvdGQ+XFxuYDtcbiAgICAgIH1cblxuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIGJ1eVdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZW50ZXJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IGJ1eVdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gYnV5V2luZG93VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKS5sZW5ndGg7XG4gICAgaWYgKGNvdW50IDw9IDApIHJldHVybjtcblxuICAgIGlmIChsYXN0U2VsZWN0ID09IC0xKSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlciwgMCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0IC0gMTtcbiAgICAgICAgaWYgKHNlbGVjdCA8IDApIHtcbiAgICAgICAgICBzZWxlY3QgPSBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImxlZnRcIiwgXCJyaWdodFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkgPT0gXCJyaWdodFwiKSB7XG4gICAgICBsZXQgZmlsdGVyID0gbGFzdEZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICBmaWx0ZXIgPSBcInN3b3JkfHNwZWFyfGJvd1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJoZWFkfGJvZHl8ZmVldFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2hlYWQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcInBvdGlvblwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWF0ZXJpYWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiYm9va3xzY3JvbGx8bGV0dGVyXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWlzY1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgICBmaWx0ZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBmaWx0ZXIpO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09IFwibGVmdFwiKSB7XG4gICAgICBsZXQgZmlsdGVyID0gbGFzdEZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICBmaWx0ZXIgPSBcIm1pc2NcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9zd29yZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwic3dvcmR8c3BlYXJ8Ym93XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJoZWFkfGJvZHl8ZmVldFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJwb3Rpb25cIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtYXRlcmlhbFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImJvb2t8c2Nyb2xsfGxldHRlclwiO1xuICAgICAgfVxuICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBmaWx0ZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgYnV5V2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpdGVtSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICBpZiAoaXRlbUlkICYmIGxhc3RJdGVtcy5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgR2FtZS5oZXJvLmRhdGEuZ29sZCAtPSBNYXRoLmNlaWwoaXRlbS5kYXRhLnZhbHVlICogMS4yKTtcbiAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdKSB7XG4gICAgICAgIEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0rKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0gPSAxO1xuICAgICAgfVxuXG4gICAgICBsYXN0SXRlbXNbaXRlbUlkXS0tO1xuXG4gICAgICBpZiAobGFzdEl0ZW1zW2l0ZW1JZF0gPT0gMCkge1xuICAgICAgICBkZWxldGUgbGFzdEl0ZW1zW2l0ZW1JZF07XG4gICAgICB9XG5cbiAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlcik7XG4gICAgfVxuICB9KTtcblxufSkoKTtcbiJdfQ==

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

  var choiceHTML = "\n    <div class=\"window-box\">\n      <button id=\"choiceWindowNo\" class=\"brownButton\">取消</button>\n      <div style=\"width: 100%; height: 100%;\">\n        <div style=\"height: 370px; overflow-y: auto; text-align: center;\">\n          <table id=\"choiceWindowTable\" style=\"width: 100%; height: 370px;\">\n            <tbody>\n              <tr>\n                <td id=\"choiceWindowButtonContainer\">\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  ";

  var choiceCSS = "\n    .choiceWindow {\n      text-align: center;\n    }\n\n    .choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      right: 100px;\n      top: 50px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 300px;\n      min-height: 60px;\n      font-size: 30px;\n      display: block;\n    }\n  ";

  Game.choice = function (options, callback) {

    var win = Game.Window.create("choiceWindow");
    win.html = choiceHTML;
    win.css = choiceCSS;
    win.show();

    var choiceWindowButtonContainer = win.querySelector("#choiceWindowButtonContainer");
    var choiceWindowNo = win.querySelector("#choiceWindowNo");
    var buttonArray = [];

    Sprite.each(options, function (value, key) {
      var button = document.createElement("button");
      button.textContent = buttonArray.length + 1 + ". " + key;
      button.classList.add("brownButton");

      choiceWindowButtonContainer.appendChild(button);
      buttonArray.push(button);

      button.addEventListener("click", function () {
        win.hide();
        win.destroy();
        if (callback) {
          callback(value);
        }
      });
    });

    choiceWindowNo.addEventListener("click", function () {
      win.hide();
      win.destroy();
      if (callback) {
        callback(null);
      }
    });

    win.whenUp(["esc"], function () {
      setTimeout(function () {
        choiceWindowNo.click();
      }, 20);
    });

    win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
      // match 1 to 9
      var num = parseInt(key) - 1; // get 0 to 8
      var element = buttonArray[num];
      if (element) {
        element.click();
      }
    });
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dDaG9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxVQUFVLG9pQkFnQmIsQ0FBQzs7QUFFRixNQUFJLFNBQVMsMmNBeUJaLENBQUM7O0FBRUYsTUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRXpDLFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzdDLE9BQUcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLE9BQUcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO0FBQ3BCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxRQUFJLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNwRixRQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUQsUUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUVyQixVQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDekMsVUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxZQUFNLENBQUMsV0FBVyxHQUFNLFdBQVcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxVQUFLLEdBQUcsQUFBRSxDQUFDO0FBQ3ZELFlBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVwQyxpQ0FBMkIsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsaUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXpCLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUMzQyxXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakI7T0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsa0JBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNuRCxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLFFBQVEsRUFBRTtBQUNaLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDaEI7S0FDRixDQUFDLENBQUM7O0FBRUgsT0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVk7QUFDOUIsZ0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLHNCQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDeEIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSLENBQUMsQ0FBQzs7QUFFSCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRTs7QUFFdkUsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsVUFBSSxPQUFPLEVBQUU7QUFDWCxlQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDakI7S0FDRixDQUFDLENBQUM7R0FFSixDQUFDO0NBRUgsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0Nob2ljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBjaG9pY2VIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwiY2hvaWNlV2luZG93Tm9cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y+W5raIPC9idXR0b24+XG4gICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDogMzcwcHg7IG92ZXJmbG93LXk6IGF1dG87IHRleHQtYWxpZ246IGNlbnRlcjtcIj5cbiAgICAgICAgICA8dGFibGUgaWQ9XCJjaG9pY2VXaW5kb3dUYWJsZVwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMzcwcHg7XCI+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgaWQ9XCJjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGxldCBjaG9pY2VDU1MgPSBgXG4gICAgLmNob2ljZVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLmNob2ljZVdpbmRvdyBkaXYge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIGJ1dHRvbiNjaG9pY2VXaW5kb3dObyB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgICB0b3A6IDUwcHg7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgfVxuXG4gICAgI2Nob2ljZVdpbmRvd1RhYmxlIGJ1dHRvbiB7XG4gICAgICBtYXJnaW46IDVweCBhdXRvO1xuICAgICAgbWluLXdpZHRoOiAzMDBweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gIGA7XG5cbiAgR2FtZS5jaG9pY2UgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcblxuICAgIGxldCB3aW4gPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJjaG9pY2VXaW5kb3dcIik7XG4gICAgd2luLmh0bWwgPSBjaG9pY2VIVE1MO1xuICAgIHdpbi5jc3MgPSBjaG9pY2VDU1M7XG4gICAgd2luLnNob3coKTtcblxuICAgIGxldCBjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXIgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIik7XG4gICAgbGV0IGNob2ljZVdpbmRvd05vID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjY2hvaWNlV2luZG93Tm9cIik7XG4gICAgbGV0IGJ1dHRvbkFycmF5ID0gW107XG5cbiAgICBTcHJpdGUuZWFjaChvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBgJHtidXR0b25BcnJheS5sZW5ndGgrMX0uICR7a2V5fWA7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImJyb3duQnV0dG9uXCIpO1xuXG4gICAgICBjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgIGJ1dHRvbkFycmF5LnB1c2goYnV0dG9uKTtcblxuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjaG9pY2VXaW5kb3dOby5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNob2ljZVdpbmRvd05vLmNsaWNrKCk7XG4gICAgICB9LCAyMCk7XG4gICAgfSk7XG5cbiAgICB3aW4ud2hlblVwKFtcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCIsIFwiOVwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgLy8gbWF0Y2ggMSB0byA5XG4gICAgICBsZXQgbnVtID0gcGFyc2VJbnQoa2V5KSAtIDE7IC8vIGdldCAwIHRvIDhcbiAgICAgIGxldCBlbGVtZW50ID0gYnV0dG9uQXJyYXlbbnVtXTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9O1xuXG59KSgpO1xuIl19

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

  var internal = Sprite.Namespace();

  var confirmHTML = "\n  <div class=\"window-box\">\n    <div style=\"width: 100%; height: 100%;\">\n      <table>\n        <tr><td><span id=\"confirmWindowMessage\"></span></td></tr>\n        <tr><td>\n          <button id=\"confirmWindowYes\" class=\"brownButton\">确定</button>\n          <button id=\"confirmWindowNo\" class=\"brownButton\">取消</button>\n        </td></tr>\n      </table>\n    </div>\n  </div>\n  ";

  var confirmCSS = "\n    .confirmWindow {\n      text-align: center;\n    }\n\n    .confirmWindow table {\n      width: 100%;\n      height: 100%;\n    }\n\n    .confirmWindow span {\n      font-size: 16px;\n    }\n\n    .confirmWindow button {\n      width: 100px;\n      height: 60px;\n      font-size: 16px;\n      margin: 20px;\n    }\n\n    #confirmWindowMessage {\n      color: black;\n      font-size: 20px;\n    }\n  ";

  Game.assign("confirm", function (message, yes, no) {

    var win = Game.Window.create("confirmWindow");
    win.html = confirmHTML;
    win.css = confirmCSS;
    win.show();

    var confirmWindowMessage = win.querySelector("#confirmWindowMessage");
    var confirmWindowYes = win.querySelector("#confirmWindowYes");
    var confirmWindowNo = win.querySelector("#confirmWindowNo");

    if (typeof message == "string") {
      confirmWindowMessage.textContent = message;
    } else if (message.message) {
      confirmWindowMessage.textContent = message.message;
      if (message.yes) {
        confirmWindowYes.textContent = message.yes;
      }
      if (message.no) {
        confirmWindowNo.textContent = message.no;
      }
    } else {
      console.error(message, yes, no);
      throw new Error("Game.confirm got invalid arguments");
    }

    win.whenUp(["esc"], function () {
      setTimeout(function () {
        confirmWindowNo.click();
      }, 20);
    });

    win.whenUp(["y", "Y"], function () {
      confirmWindowYes.click();
    });

    win.whenUp(["n", "N"], function () {
      confirmWindowNo.click();
    });

    confirmWindowYes.addEventListener("click", function () {
      win.destroy();
      if (yes) {
        yes();
      }
    });

    confirmWindowNo.addEventListener("click", function () {
      win.destroy();
      if (no) {
        no();
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dDb25maXJtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxXQUFXLGdaQVlkLENBQUM7O0FBRUYsTUFBSSxVQUFVLDJaQXlCYixDQUFDOztBQUVGLE1BQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7O0FBRWpELFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlDLE9BQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0FBQ3ZCLE9BQUcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ3JCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxRQUFJLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0RSxRQUFJLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxRQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTVELFFBQUksT0FBTyxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzlCLDBCQUFvQixDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7S0FDNUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDMUIsMEJBQW9CLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDbkQsVUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2Ysd0JBQWdCLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7T0FDNUM7QUFDRCxVQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDZCx1QkFBZSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO09BQzFDO0tBQ0YsTUFBTTtBQUNMLGFBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxZQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7S0FDdkQ7O0FBR0QsT0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVk7QUFDOUIsZ0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLHVCQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDekIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSLENBQUMsQ0FBQzs7QUFFSCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFlBQVk7QUFDakMsc0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDMUIsQ0FBQyxDQUFDOztBQUVILE9BQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsWUFBWTtBQUNqQyxxQkFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3pCLENBQUMsQ0FBQzs7QUFFSCxvQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNyRCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLEdBQUcsRUFBRTtBQUNQLFdBQUcsRUFBRSxDQUFDO09BQ1A7S0FDRixDQUFDLENBQUM7O0FBRUgsbUJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNwRCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLEVBQUUsRUFBRTtBQUNOLFVBQUUsRUFBRSxDQUFDO09BQ047S0FDRixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93Q29uZmlybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBsZXQgY29uZmlybUhUTUwgPSBgXG4gIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XCI+XG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0cj48dGQ+PHNwYW4gaWQ9XCJjb25maXJtV2luZG93TWVzc2FnZVwiPjwvc3Bhbj48L3RkPjwvdHI+XG4gICAgICAgIDx0cj48dGQ+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbmZpcm1XaW5kb3dZZXNcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+56Gu5a6aPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbmZpcm1XaW5kb3dOb1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lj5bmtog8L2J1dHRvbj5cbiAgICAgICAgPC90ZD48L3RyPlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGA7XG5cbiAgbGV0IGNvbmZpcm1DU1MgPSBgXG4gICAgLmNvbmZpcm1XaW5kb3cge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IHRhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IHNwYW4ge1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgIC5jb25maXJtV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBtYXJnaW46IDIwcHg7XG4gICAgfVxuXG4gICAgI2NvbmZpcm1XaW5kb3dNZXNzYWdlIHtcbiAgICAgIGNvbG9yOiBibGFjaztcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICB9XG4gIGA7XG5cbiAgR2FtZS5hc3NpZ24oXCJjb25maXJtXCIsIGZ1bmN0aW9uIChtZXNzYWdlLCB5ZXMsIG5vKSB7XG5cbiAgICBsZXQgd2luID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiY29uZmlybVdpbmRvd1wiKTtcbiAgICB3aW4uaHRtbCA9IGNvbmZpcm1IVE1MO1xuICAgIHdpbi5jc3MgPSBjb25maXJtQ1NTO1xuICAgIHdpbi5zaG93KCk7XG5cbiAgICBsZXQgY29uZmlybVdpbmRvd01lc3NhZ2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjb25maXJtV2luZG93TWVzc2FnZVwiKTtcbiAgICBsZXQgY29uZmlybVdpbmRvd1llcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2NvbmZpcm1XaW5kb3dZZXNcIik7XG4gICAgbGV0IGNvbmZpcm1XaW5kb3dObyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2NvbmZpcm1XaW5kb3dOb1wiKTtcblxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25maXJtV2luZG93TWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLm1lc3NhZ2UpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dNZXNzYWdlLnRleHRDb250ZW50ID0gbWVzc2FnZS5tZXNzYWdlO1xuICAgICAgaWYgKG1lc3NhZ2UueWVzKSB7XG4gICAgICAgIGNvbmZpcm1XaW5kb3dZZXMudGV4dENvbnRlbnQgPSBtZXNzYWdlLnllcztcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlLm5vKSB7XG4gICAgICAgIGNvbmZpcm1XaW5kb3dOby50ZXh0Q29udGVudCA9IG1lc3NhZ2Uubm87XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgeWVzLCBubyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLmNvbmZpcm0gZ290IGludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgIH1cblxuXG4gICAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25maXJtV2luZG93Tm8uY2xpY2soKTtcbiAgICAgIH0sIDIwKTtcbiAgICB9KTtcblxuICAgIHdpbi53aGVuVXAoW1wieVwiLCBcIllcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dZZXMuY2xpY2soKTtcbiAgICB9KTtcblxuICAgIHdpbi53aGVuVXAoW1wiblwiLCBcIk5cIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbmZpcm1XaW5kb3dOby5jbGljaygpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybVdpbmRvd1llcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmRlc3Ryb3koKTtcbiAgICAgIGlmICh5ZXMpIHtcbiAgICAgICAgeWVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25maXJtV2luZG93Tm8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICBpZiAobm8pIHtcbiAgICAgICAgbm8oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.dialogue = Game.Window.create("dialogueWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div style=\"width: 100%; height: 100%;\">\n        <span id=\"dialogueWindowSpeaker\"></span>\n        <table><tbody><tr><td>\n          <div id=\"dialogueWindowContent\"></div>\n        </td></tr></tbody></table>\n        <button id=\"dialogueWindowNext\" style=\"display: block;\" class=\"brownButton\">继续</button>\n        <button id=\"dialogueWindowClose\" style=\"display: none;\" class=\"brownButton\">结束</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    .dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {\n      margin: 0;\n      padding: 0;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n    }\n\n    #dialogueWindowSpeaker {\n      position: absolute;\n      left: 50px;\n      top: 50px;\n      font-size: 30px;\n      font-weight: bold;\n    }\n\n    .dialogueWindow button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      position: absolute;\n    }\n\n    #dialogueWindowNext {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowClose {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowContent {\n      margin-left: 50px;\n      margin-right: 50px;\n      max-width: 600px;\n      font-size: 24px;\n      text-align: center;\n    }\n  ";

  var dialogueWindowSpeaker = win.querySelector("#dialogueWindowSpeaker");

  var dialogueContent = [];
  var dialogueIndex = 0;
  var dialogueWindowNext = document.getElementById("dialogueWindowNext");
  var dialogueWindowClose = document.getElementById("dialogueWindowClose");
  var dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    DialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    setTimeout(function () {
      Game.windows.dialogue.hide();
      dialogueContent = [];
      dialogueIndex = 0;
    }, 20);
  });

  Game.dialogue = function (content, name) {
    dialogueWindowNext.style.display = "block";
    dialogueWindowClose.style.display = "none";
    if (name && name.length) {
      dialogueWindowSpeaker.textContent = name + "：";
    } else {
      dialogueWindowSpeaker.textContent = "";
    }
    dialogueContent = content;
    dialogueIndex = 0;
    DialogueNext();
    Game.windows.dialogue.show();
  };

  function DialogueNext() {
    dialogueWindowContent.textContent = dialogueContent[dialogueIndex];
    dialogueIndex++;
    if (dialogueIndex >= dialogueContent.length) {
      dialogueWindowNext.style.display = "none";
      dialogueWindowClose.style.display = "block";
    }
  };

  win.whenUp(["enter", "space", "esc"], function () {
    if (Game.windows.dialogue.showing) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dEaWFsb2d1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV2RSxLQUFHLENBQUMsSUFBSSwrZUFXUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLG96QkF5Q04sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixNQUFJLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2RSxNQUFJLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN6RSxNQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFN0Usb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdkQsZ0JBQVksRUFBRSxDQUFDO0dBQ2hCLENBQUMsQ0FBQzs7QUFFSCxxQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUN4RCxjQUFVLENBQUMsWUFBWTtBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixxQkFBZSxHQUFHLEVBQUUsQ0FBQztBQUNyQixtQkFBYSxHQUFHLENBQUMsQ0FBQztLQUNuQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1IsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLHNCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQzNDLHVCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzNDLFFBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDdkIsMkJBQXFCLENBQUMsV0FBVyxHQUFNLElBQUksTUFBRyxDQUFDO0tBQ2hELE1BQU07QUFDTCwyQkFBcUIsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3hDO0FBQ0QsbUJBQWUsR0FBRyxPQUFPLENBQUM7QUFDMUIsaUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDOUIsQ0FBQzs7QUFFRixXQUFTLFlBQVksR0FBSTtBQUN2Qix5QkFBcUIsQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25FLGlCQUFhLEVBQUUsQ0FBQztBQUNoQixRQUFJLGFBQWEsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQzNDLHdCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzFDLHlCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzdDO0dBQ0YsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxZQUFZO0FBQ2hELFFBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ2pDLFVBQUksa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUU7QUFDOUMsMEJBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDNUIsTUFBTSxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksTUFBTSxFQUFFO0FBQ3RELDJCQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO09BQzdCO0tBQ0Y7R0FDRixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93RGlhbG9ndWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmRpYWxvZ3VlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiZGlhbG9ndWVXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1wiPlxuICAgICAgICA8c3BhbiBpZD1cImRpYWxvZ3VlV2luZG93U3BlYWtlclwiPjwvc3Bhbj5cbiAgICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICAgIDxkaXYgaWQ9XCJkaWFsb2d1ZVdpbmRvd0NvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgPC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImRpYWxvZ3VlV2luZG93TmV4dFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPue7p+e7rTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiZGlhbG9ndWVXaW5kb3dDbG9zZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+57uT5p2fPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5kaWFsb2d1ZVdpbmRvdyB0YWJsZSwgZGlhbG9ndWVXaW5kb3cudGJvZHksIGRpYWxvZ3VlV2luZG93IHRyLCBkaWFsb2d1ZVdpbmRvdyB0ZCB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93U3BlYWtlciB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgZm9udC1zaXplOiAzMHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuXG4gICAgLmRpYWxvZ3VlV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTIwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93TmV4dCB7XG4gICAgICBib3R0b206IDUwcHg7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93Q2xvc2Uge1xuICAgICAgYm90dG9tOiA1MHB4O1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgIH1cblxuICAgICNkaWFsb2d1ZVdpbmRvd0NvbnRlbnQge1xuICAgICAgbWFyZ2luLWxlZnQ6IDUwcHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDUwcHg7XG4gICAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgYDtcblxuICBsZXQgZGlhbG9ndWVXaW5kb3dTcGVha2VyID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9ndWVXaW5kb3dTcGVha2VyXCIpO1xuXG4gIGxldCBkaWFsb2d1ZUNvbnRlbnQgPSBbXTtcbiAgbGV0IGRpYWxvZ3VlSW5kZXggPSAwO1xuICBsZXQgZGlhbG9ndWVXaW5kb3dOZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd05leHRcIik7XG4gIGxldCBkaWFsb2d1ZVdpbmRvd0Nsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgZGlhbG9ndWVXaW5kb3dDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd0NvbnRlbnRcIik7XG5cbiAgZGlhbG9ndWVXaW5kb3dOZXh0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgRGlhbG9ndWVOZXh0KCk7XG4gIH0pO1xuXG4gIGRpYWxvZ3VlV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIEdhbWUud2luZG93cy5kaWFsb2d1ZS5oaWRlKCk7XG4gICAgICBkaWFsb2d1ZUNvbnRlbnQgPSBbXTtcbiAgICAgIGRpYWxvZ3VlSW5kZXggPSAwO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgR2FtZS5kaWFsb2d1ZSA9IGZ1bmN0aW9uIChjb250ZW50LCBuYW1lKSB7XG4gICAgZGlhbG9ndWVXaW5kb3dOZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGgpIHtcbiAgICAgIGRpYWxvZ3VlV2luZG93U3BlYWtlci50ZXh0Q29udGVudCA9IGAke25hbWV977yaYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhbG9ndWVXaW5kb3dTcGVha2VyLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9XG4gICAgZGlhbG9ndWVDb250ZW50ID0gY29udGVudDtcbiAgICBkaWFsb2d1ZUluZGV4ID0gMDtcbiAgICBEaWFsb2d1ZU5leHQoKTtcbiAgICBHYW1lLndpbmRvd3MuZGlhbG9ndWUuc2hvdygpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIERpYWxvZ3VlTmV4dCAoKSB7XG4gICAgZGlhbG9ndWVXaW5kb3dDb250ZW50LnRleHRDb250ZW50ID0gZGlhbG9ndWVDb250ZW50W2RpYWxvZ3VlSW5kZXhdO1xuICAgIGRpYWxvZ3VlSW5kZXgrKztcbiAgICBpZiAoZGlhbG9ndWVJbmRleCA+PSBkaWFsb2d1ZUNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBkaWFsb2d1ZVdpbmRvd05leHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbiAgfTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCIsIFwic3BhY2VcIiwgXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoR2FtZS53aW5kb3dzLmRpYWxvZ3VlLnNob3dpbmcpIHtcbiAgICAgIGlmIChkaWFsb2d1ZVdpbmRvd05leHQuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIikge1xuICAgICAgICBkaWFsb2d1ZVdpbmRvd05leHQuY2xpY2soKTtcbiAgICAgIH0gZWxzZSBpZiAoZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiKSB7XG4gICAgICAgIGRpYWxvZ3VlV2luZG93Q2xvc2UuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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

  var win = Game.windows["interface"] = Game.Window.create("interfaceWindow");

  win.html = "\n    <div id=\"interfaceWindowBar\"></div>\n\n    <div style=\"position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;\">\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowHP\" style=\"width: 100%; height: 100%; background-color: green;\"></div>\n      </div>\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowSP\" style=\"width: 100%; height: 100%; background-color: blue;\"></div>\n      </div>\n    </div>\n\n    <span id=\"interfaceWindowDatetime\"></span>\n    <span id=\"interfaceWindowMap\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ";

  win.css = "\n\n    #interfaceWindowBar {\n      text-align: center;\n      position: absolute;\n      bottom: 10px;\n      width: 100%;\n      height: 60px;\n    }\n\n    .interfaceWindow {\n      /** 让interface窗口的主要窗口，不接受事件 */\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      margin-left: 3px;\n      margin-right: 3px;\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      /** 让interface窗口的按钮，接受事件 */\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #interfaceWindowMap {\n      position: absolute;\n      top: 35px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    #interfaceWindowDatetime {\n      position: absolute;\n      top: 10px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n\n    interfaceWindowButton:disabled {\n      cursor: default;\n      pointer-events: none;\n      background-color: gray;\n      opacity: 0.5;\n    }\n\n    .interfaceWindowButtonText {\n      position: absolute;\n      background-color: white;\n      margin-left: -26px;\n      margin-top: 12px;\n    }\n  ";

  // 使用按钮
  var interfaceWindowUse = win.querySelector("button#interfaceWindowUse");
  // 技能栏按钮组
  var interfaceWindowBar = win.querySelector("div#interfaceWindowBar");
  // 地图信息
  var interfaceWindowMap = win.querySelector("#interfaceWindowMap");
  // 选项菜单
  var interfaceWindowMenu = win.querySelector("button#interfaceWindowMenu");
  // 玩家的hp
  var interfaceWindowHP = win.querySelector("#interfaceWindowHP");
  // 玩家的sp
  var interfaceWindowSP = win.querySelector("#interfaceWindowSP");

  win.assign("hideUse", function () {
    interfaceWindowUse.style.visibility = "hidden";
  });

  win.assign("showUse", function () {
    interfaceWindowUse.style.visibility = "visible";
  });

  win.on("active", function () {
    Game.start();
  });

  win.on("deactive", function () {
    Game.pause();
  });

  win.whenUp(["esc"], function (key) {
    if (Game.windows["interface"].atop) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  function InitInterfaceBar() {
    var buttonCount = 8;
    var buttonHTML = "";
    for (var i = 0; i < buttonCount; i++) {
      var line = "";
      line += "<button data-index=\"" + i + "\" class=\"interfaceWindowButton\">";
      line += "<label data-index=\"" + i + "\" class=\"interfaceWindowButtonText\"></label>";
      line += "</button>\n";
      buttonHTML += line;
    }
    interfaceWindowBar.innerHTML = buttonHTML;
  }

  setInterval(function () {
    if (Game.hero && Game.paused == false) {
      Game.hero.data.time++;
      Game.windows["interface"].datetime();
    }
  }, 1000);

  InitInterfaceBar();
  var buttons = win.querySelectorAll(".interfaceWindowButton");
  var buttonTexts = win.querySelectorAll(".interfaceWindowButtonText");

  interfaceWindowBar.addEventListener("click", function (event) {
    var index = event.target.getAttribute("data-index");
    if (index) {
      var element = Game.hero.data.bar[index];
      if (element) {
        if (element.type == "skill") {
          var cooldown = Game.hero.fire(element.id);
          if (cooldown) {
            event.target.disabled = true;
            setTimeout(function () {
              event.target.disabled = false;
            }, cooldown);
          }
        } else if (element.type == "item") {
          var itemId = element.id;
          var item = Game.items[itemId];
          item.heroUse();
          Game.windows["interface"].refresh();
        }
      }
    }
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    var num = parseInt(key);
    if (Number.isInteger(num) && num >= 0 && num < buttons.length) {
      buttons[num - 1].click();
    }
  });

  win.whenUp(["e", "E", "space", "enter"], function (key) {
    if (Game.windows["interface"].showing) {
      if (Game.hintObject && Game.hintObject.heroUse) {
        Game.hintObject.heroUse();
      }
    }
  });

  interfaceWindowUse.addEventListener("click", function (event) {
    if (Game.hintObject && Game.hintObject.heroUse) {
      Game.hintObject.heroUse();
    }
  });

  win.assign("status", function () {
    if (Game.hero) {
      var hp = Game.hero.data.hp / Game.hero.data.$hp;
      var sp = Game.hero.data.sp / Game.hero.data.$sp;
      interfaceWindowHP.style.width = hp * 100 + "%";
      interfaceWindowSP.style.width = sp * 100 + "%";
      if (hp >= 0.5) {
        interfaceWindowHP.style.backgroundColor = "green";
      } else if (hp >= 0.25) {
        interfaceWindowHP.style.backgroundColor = "yellow";
      } else {
        interfaceWindowHP.style.backgroundColor = "red";
      }
    }
  });

  win.assign("datetime", function () {
    if (Game.hero && Game.hero.data && Number.isInteger(Game.hero.data.time)) {
      var YEARMIN = 60 * 24 * 30 * 12;
      var MONTHMIN = 60 * 24 * 30;
      var DAYMIN = 60 * 24;
      var HOURMIN = 60;
      var datetime = win.querySelector("#interfaceWindowDatetime");
      var time = Game.hero.data.time;
      var year = Math.floor(time / YEARMIN);
      time = time % YEARMIN;
      var month = Math.floor(time / MONTHMIN);
      time = time % MONTHMIN;
      var day = Math.floor(time / DAYMIN);
      time = time % DAYMIN;
      var hour = Math.floor(time / HOURMIN);
      time = time % HOURMIN;
      var minute = time;
      year++;
      month++;
      day++;
      hour = hour.toString();
      while (hour.length < 2) hour = "0" + hour;
      minute = minute.toString();
      while (minute.length < 2) minute = "0" + minute;
      datetime.textContent = month + "月" + day + "日 " + hour + ":" + minute;

      if (hour >= 20 || hour < 4) {
        // 20:00 to 4:00
        Game.stage.filter("brightness", -0.15);
      } else if (hour >= 4 && hour < 6) {
        Game.stage.filter("brightness", -0.1);
      } else if (hour >= 6 && hour < 8) {
        Game.stage.filter("brightness", -0.05);
      } else if (hour >= 8 && hour < 10) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 10 && hour < 12) {
        Game.stage.filter("brightness", 0.05);
      } else if (hour >= 12 && hour < 14) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 14 && hour < 16) {
        Game.stage.filter("brightness", 0.0);
      } else if (hour >= 16 && hour < 18) {
        Game.stage.filter("brightness", -0.05);
      } else if (hour >= 18 && hour < 20) {
        Game.stage.filter("brightness", -0.1);
      }
    }
  });

  win.assign("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var button = buttons[i];
      var text = buttonTexts[i];
      button.disabled = false;
      text.disabled = false;

      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          button.style.backgroundImage = "url(\"" + skill.icon.src + "\")";
          text.textContent = skill.data.cost;
        } else if (type == "item") {
          var item = Game.items[id];
          button.style.backgroundImage = "url(\"" + item.icon.src + "\")";
          if (Game.hero.data.items[id]) {
            text.textContent = Game.hero.data.items[id];
          } else {
            text.textContent = "0";
            button.disabled = true;
            text.disabled = true;
          }
        }
      } else {
        // empty bar element
        text.textContent = "";
        button.style.backgroundImage = "";
      }
    }

    interfaceWindowMap.textContent = Game.area.map.data.name;
  });

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dJbnRlcmZhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sYUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRXpFLEtBQUcsQ0FBQyxJQUFJLGc0QkFpQlAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxxeURBbUZOLENBQUM7OztBQUdGLE1BQUksa0JBQWtCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztBQUV4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7QUFFckUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWxFLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxRSxNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFaEUsTUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWhFLEtBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDaEMsc0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7R0FDaEQsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDaEMsc0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7R0FDakQsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxF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SSxDQUFDLElBQUksQ0FBQztTQUNwQyxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUN6QixjQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLGdCQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsY0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBSSxDQUFDO0FBQ3pELGNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzVCLGdCQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUM3QyxNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLGtCQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN2QixnQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7V0FDdEI7U0FDRjtPQUNGLE1BQU07O0FBRUwsWUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsY0FBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO09BQ25DO0tBQ0Y7O0FBRUQsc0JBQWtCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7R0FDMUQsQ0FBQyxDQUFDOztBQUVILHFCQUFtQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUM3RCxRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUM3QixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93SW50ZXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5pbnRlcmZhY2UgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJpbnRlcmZhY2VXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBpZD1cImludGVyZmFjZVdpbmRvd0JhclwiPjwvZGl2PlxuXG4gICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAxMHB4OyBsZWZ0OiAyMHB4OyB3aWR0aDogMTAwcHg7IGhlaWdodDogNjBweDtcIj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwcHg7IGhlaWdodDogMjBweDsgbWFyZ2luOiA1cHggMDsgYm9yZGVyOiAxcHggc29saWQgZ3JheTsgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJpbnRlcmZhY2VXaW5kb3dIUFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwcHg7IGhlaWdodDogMjBweDsgbWFyZ2luOiA1cHggMDsgYm9yZGVyOiAxcHggc29saWQgZ3JheTsgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XCI+XG4gICAgICAgIDxkaXYgaWQ9XCJpbnRlcmZhY2VXaW5kb3dTUFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPHNwYW4gaWQ9XCJpbnRlcmZhY2VXaW5kb3dEYXRldGltZVwiPjwvc3Bhbj5cbiAgICA8c3BhbiBpZD1cImludGVyZmFjZVdpbmRvd01hcFwiPjwvc3Bhbj5cblxuICAgIDxidXR0b24gaWQ9XCJpbnRlcmZhY2VXaW5kb3dVc2VcIiBjbGFzcz1cImludGVyZmFjZVdpbmRvd0J1dHRvblwiPjwvYnV0dG9uPlxuICAgIDxidXR0b24gaWQ9XCJpbnRlcmZhY2VXaW5kb3dNZW51XCIgY2xhc3M9XCJpbnRlcmZhY2VXaW5kb3dCdXR0b25cIj48L2J1dHRvbj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuXG4gICAgI2ludGVyZmFjZVdpbmRvd0JhciB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBib3R0b206IDEwcHg7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogNjBweDtcbiAgICB9XG5cbiAgICAuaW50ZXJmYWNlV2luZG93IHtcbiAgICAgIC8qKiDorqlpbnRlcmZhY2Xnqpflj6PnmoTkuLvopoHnqpflj6PvvIzkuI3mjqXlj5fkuovku7YgKi9cbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cblxuICAgIGJ1dHRvbi5pbnRlcmZhY2VXaW5kb3dCdXR0b24ge1xuICAgICAgbWFyZ2luLWxlZnQ6IDNweDtcbiAgICAgIG1hcmdpbi1yaWdodDogM3B4O1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBib3JkZXI6IDRweCBzb2xpZCBncmF5O1xuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTAwLCAxMDAsIDEwMCwgMC41KTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIC8qKiDorqlpbnRlcmZhY2Xnqpflj6PnmoTmjInpkq7vvIzmjqXlj5fkuovku7YgKi9cbiAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgfVxuXG4gICAgYnV0dG9uLmludGVyZmFjZVdpbmRvd0J1dHRvbjpob3ZlciB7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuXG4gICAgYnV0dG9uLmludGVyZmFjZVdpbmRvd0J1dHRvbiA+IGltZyB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAjaW50ZXJmYWNlV2luZG93TWFwIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMzVweDtcbiAgICAgIGxlZnQ6IDVweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTAwLCAxMDAsIDEwMCwgMC43KTtcbiAgICAgIHBhZGRpbmc6IDJweDtcbiAgICB9XG5cbiAgICAjaW50ZXJmYWNlV2luZG93RGF0ZXRpbWUge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAxMHB4O1xuICAgICAgbGVmdDogNXB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDAsIDEwMCwgMTAwLCAwLjcpO1xuICAgICAgcGFkZGluZzogMnB4O1xuICAgIH1cblxuICAgIGJ1dHRvbiNpbnRlcmZhY2VXaW5kb3dVc2Uge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiA1cHg7XG4gICAgICByaWdodDogODVweDtcbiAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImltYWdlL2hpbnQucG5nXCIpO1xuICAgIH1cblxuICAgIGJ1dHRvbiNpbnRlcmZhY2VXaW5kb3dNZW51IHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogNXB4O1xuICAgICAgcmlnaHQ6IDVweDtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImltYWdlL3NldHRpbmcucG5nXCIpO1xuICAgIH1cblxuICAgIGludGVyZmFjZVdpbmRvd0J1dHRvbjpkaXNhYmxlZCB7XG4gICAgICBjdXJzb3I6IGRlZmF1bHQ7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuXG4gICAgLmludGVyZmFjZVdpbmRvd0J1dHRvblRleHQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgICBtYXJnaW4tbGVmdDogLTI2cHg7XG4gICAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICAgIH1cbiAgYDtcblxuICAvLyDkvb/nlKjmjInpkq5cbiAgbGV0IGludGVyZmFjZVdpbmRvd1VzZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludGVyZmFjZVdpbmRvd1VzZVwiKTtcbiAgLy8g5oqA6IO95qCP5oyJ6ZKu57uEXG4gIGxldCBpbnRlcmZhY2VXaW5kb3dCYXIgPSB3aW4ucXVlcnlTZWxlY3RvcihcImRpdiNpbnRlcmZhY2VXaW5kb3dCYXJcIik7XG4gIC8vIOWcsOWbvuS/oeaBr1xuICBsZXQgaW50ZXJmYWNlV2luZG93TWFwID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaW50ZXJmYWNlV2luZG93TWFwXCIpO1xuICAvLyDpgInpobnoj5zljZVcbiAgbGV0IGludGVyZmFjZVdpbmRvd01lbnUgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnRlcmZhY2VXaW5kb3dNZW51XCIpO1xuICAvLyDnjqnlrrbnmoRocFxuICBsZXQgaW50ZXJmYWNlV2luZG93SFAgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNpbnRlcmZhY2VXaW5kb3dIUFwiKTtcbiAgLy8g546p5a6255qEc3BcbiAgbGV0IGludGVyZmFjZVdpbmRvd1NQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaW50ZXJmYWNlV2luZG93U1BcIik7XG5cbiAgd2luLmFzc2lnbihcImhpZGVVc2VcIiwgZnVuY3Rpb24gKCkge1xuICAgIGludGVyZmFjZVdpbmRvd1VzZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcInNob3dVc2VcIiwgZnVuY3Rpb24gKCkge1xuICAgIGludGVyZmFjZVdpbmRvd1VzZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gIH0pO1xuXG4gIHdpbi5vbihcImFjdGl2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgR2FtZS5zdGFydCgpO1xuICB9KTtcblxuICB3aW4ub24oXCJkZWFjdGl2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgR2FtZS5wYXVzZSgpO1xuICB9KVxuXG4gIHdpbi53aGVuVXAoW1wiZXNjXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKEdhbWUud2luZG93cy5pbnRlcmZhY2UuYXRvcCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVyZmFjZVdpbmRvd01lbnUuY2xpY2soKTtcbiAgICAgIH0sIDIwKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIEluaXRJbnRlcmZhY2VCYXIgKCkge1xuICAgIGxldCBidXR0b25Db3VudCA9IDg7XG4gICAgbGV0IGJ1dHRvbkhUTUwgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnV0dG9uQ291bnQ7IGkrKykge1xuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuICAgICAgbGluZSArPSBgPGJ1dHRvbiBkYXRhLWluZGV4PVwiJHtpfVwiIGNsYXNzPVwiaW50ZXJmYWNlV2luZG93QnV0dG9uXCI+YDtcbiAgICAgIGxpbmUgKz0gYDxsYWJlbCBkYXRhLWluZGV4PVwiJHtpfVwiIGNsYXNzPVwiaW50ZXJmYWNlV2luZG93QnV0dG9uVGV4dFwiPjwvbGFiZWw+YFxuICAgICAgbGluZSArPSBgPC9idXR0b24+XFxuYDtcbiAgICAgIGJ1dHRvbkhUTUwgKz0gbGluZTtcbiAgICB9XG4gICAgaW50ZXJmYWNlV2luZG93QmFyLmlubmVySFRNTCA9IGJ1dHRvbkhUTUw7XG4gIH1cblxuICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEdhbWUuaGVybyAmJiBHYW1lLnBhdXNlZCA9PSBmYWxzZSkge1xuICAgICAgR2FtZS5oZXJvLmRhdGEudGltZSsrO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5kYXRldGltZSgpO1xuICAgIH1cbiAgfSwgMTAwMCk7XG5cbiAgSW5pdEludGVyZmFjZUJhcigpO1xuICBsZXQgYnV0dG9ucyA9IHdpbi5xdWVyeVNlbGVjdG9yQWxsKFwiLmludGVyZmFjZVdpbmRvd0J1dHRvblwiKTtcbiAgbGV0IGJ1dHRvblRleHRzID0gd2luLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW50ZXJmYWNlV2luZG93QnV0dG9uVGV4dFwiKTtcblxuICBpbnRlcmZhY2VXaW5kb3dCYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpbmRleCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpO1xuICAgIGlmIChpbmRleCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSBHYW1lLmhlcm8uZGF0YS5iYXJbaW5kZXhdO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQudHlwZSA9PSBcInNraWxsXCIpIHtcbiAgICAgICAgICBsZXQgY29vbGRvd24gPSBHYW1lLmhlcm8uZmlyZShlbGVtZW50LmlkKTtcbiAgICAgICAgICBpZiAoY29vbGRvd24pIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBjb29sZG93bik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSA9PSBcIml0ZW1cIikge1xuICAgICAgICAgIGxldCBpdGVtSWQgPSBlbGVtZW50LmlkO1xuICAgICAgICAgIGxldCBpdGVtID0gR2FtZS5pdGVtc1tpdGVtSWRdO1xuICAgICAgICAgIGl0ZW0uaGVyb1VzZSgpO1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IG51bSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIobnVtKSAmJiBudW0gPj0gMCAmJiBudW0gPCBidXR0b25zLmxlbmd0aCkge1xuICAgICAgYnV0dG9uc1tudW0gLSAxXS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlXCIsIFwiRVwiLCBcInNwYWNlXCIsIFwiZW50ZXJcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93aW5nKSB7XG4gICAgICBpZiAoR2FtZS5oaW50T2JqZWN0ICYmIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKSB7XG4gICAgICAgIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpbnRlcmZhY2VXaW5kb3dVc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChHYW1lLmhpbnRPYmplY3QgJiYgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UpIHtcbiAgICAgIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4uYXNzaWduKFwic3RhdHVzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoR2FtZS5oZXJvKSB7XG4gICAgICBsZXQgaHAgPSBHYW1lLmhlcm8uZGF0YS5ocCAvIEdhbWUuaGVyby5kYXRhLiRocDtcbiAgICAgIGxldCBzcCA9IEdhbWUuaGVyby5kYXRhLnNwIC8gR2FtZS5oZXJvLmRhdGEuJHNwO1xuICAgICAgaW50ZXJmYWNlV2luZG93SFAuc3R5bGUud2lkdGggPSBgJHtocCoxMDB9JWA7XG4gICAgICBpbnRlcmZhY2VXaW5kb3dTUC5zdHlsZS53aWR0aCA9IGAke3NwKjEwMH0lYDtcbiAgICAgIGlmIChocCA+PSAwLjUpIHtcbiAgICAgICAgaW50ZXJmYWNlV2luZG93SFAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmVlblwiO1xuICAgICAgfSBlbHNlIGlmIChocCA+PSAwLjI1KSB7XG4gICAgICAgIGludGVyZmFjZVdpbmRvd0hQLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwieWVsbG93XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnRlcmZhY2VXaW5kb3dIUC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJlZFwiO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcImRhdGV0aW1lXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoR2FtZS5oZXJvICYmIEdhbWUuaGVyby5kYXRhICYmIE51bWJlci5pc0ludGVnZXIoR2FtZS5oZXJvLmRhdGEudGltZSkpIHtcbiAgICAgIGxldCBZRUFSTUlOID0gNjAqMjQqMzAqMTI7XG4gICAgICBsZXQgTU9OVEhNSU4gPSA2MCoyNCozMDtcbiAgICAgIGxldCBEQVlNSU4gPSA2MCoyNDtcbiAgICAgIGxldCBIT1VSTUlOID0gNjA7XG4gICAgICBsZXQgZGF0ZXRpbWUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNpbnRlcmZhY2VXaW5kb3dEYXRldGltZVwiKTtcbiAgICAgIGxldCB0aW1lID0gR2FtZS5oZXJvLmRhdGEudGltZTtcbiAgICAgIGxldCB5ZWFyID0gTWF0aC5mbG9vcih0aW1lL1lFQVJNSU4pO1xuICAgICAgdGltZSA9IHRpbWUgJSBZRUFSTUlOO1xuICAgICAgbGV0IG1vbnRoID0gTWF0aC5mbG9vcih0aW1lL01PTlRITUlOKTtcbiAgICAgIHRpbWUgPSB0aW1lICUgTU9OVEhNSU47XG4gICAgICBsZXQgZGF5ID0gTWF0aC5mbG9vcih0aW1lL0RBWU1JTik7XG4gICAgICB0aW1lID0gdGltZSAlIERBWU1JTjtcbiAgICAgIGxldCBob3VyID0gTWF0aC5mbG9vcih0aW1lL0hPVVJNSU4pO1xuICAgICAgdGltZSA9IHRpbWUgJSBIT1VSTUlOO1xuICAgICAgbGV0IG1pbnV0ZSA9IHRpbWU7XG4gICAgICB5ZWFyKys7XG4gICAgICBtb250aCsrO1xuICAgICAgZGF5Kys7XG4gICAgICBob3VyID0gaG91ci50b1N0cmluZygpO1xuICAgICAgd2hpbGUgKGhvdXIubGVuZ3RoIDwgMikgaG91ciA9IFwiMFwiK2hvdXI7XG4gICAgICBtaW51dGUgPSBtaW51dGUudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChtaW51dGUubGVuZ3RoIDwgMikgbWludXRlID0gXCIwXCIrbWludXRlO1xuICAgICAgZGF0ZXRpbWUudGV4dENvbnRlbnQgPSBgJHttb250aH3mnIgke2RheX3ml6UgJHtob3VyfToke21pbnV0ZX1gO1xuXG4gICAgICBpZiAoaG91ciA+PSAyMCB8fCBob3VyIDwgNCkgeyAvLyAyMDowMCB0byA0OjAwXG4gICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAtMC4xNSk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXIgPj0gNCAmJiBob3VyIDwgNikge1xuICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgLTAuMSk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXIgPj0gNiAmJiBob3VyIDwgOCkge1xuICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgLTAuMDUpO1xuICAgICAgfSBlbHNlIGlmIChob3VyID49IDggJiYgaG91ciA8IDEwKSB7XG4gICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAwLjApO1xuICAgICAgfSBlbHNlIGlmIChob3VyID49IDEwICYmIGhvdXIgPCAxMikge1xuICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMC4wNSk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXIgPj0gMTIgJiYgaG91ciA8IDE0KSB7XG4gICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAwLjApO1xuICAgICAgfSBlbHNlIGlmIChob3VyID49IDE0ICYmIGhvdXIgPCAxNikge1xuICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMC4wKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91ciA+PSAxNiAmJiBob3VyIDwgMTgpIHtcbiAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIC0wLjA1KTtcbiAgICAgIH0gZWxzZSBpZiAoaG91ciA+PSAxOCAmJiBob3VyIDwgMjApIHtcbiAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIC0wLjEpO1xuICAgICAgfVxuXG4gICAgfVxuICB9KTtcblxuICB3aW4uYXNzaWduKFwicmVmcmVzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gR2FtZS5oZXJvLmRhdGEuYmFyW2ldO1xuICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG4gICAgICBsZXQgdGV4dCA9IGJ1dHRvblRleHRzW2ldO1xuICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB0ZXh0LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGxldCBpZCA9IGVsZW1lbnQuaWQ7XG4gICAgICAgIGxldCB0eXBlID0gZWxlbWVudC50eXBlO1xuICAgICAgICBpZiAodHlwZSA9PSBcInNraWxsXCIpIHtcbiAgICAgICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tpZF07XG4gICAgICAgICAgYnV0dG9uLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoXCIke3NraWxsLmljb24uc3JjfVwiKWA7XG4gICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHNraWxsLmRhdGEuY29zdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaXRlbVwiKSB7XG4gICAgICAgICAgbGV0IGl0ZW0gPSBHYW1lLml0ZW1zW2lkXTtcbiAgICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChcIiR7aXRlbS5pY29uLnNyY31cIilgO1xuICAgICAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5pdGVtc1tpZF0pIHtcbiAgICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpZF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBcIjBcIjtcbiAgICAgICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0ZXh0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVtcHR5IGJhciBlbGVtZW50XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbnRlcmZhY2VXaW5kb3dNYXAudGV4dENvbnRlbnQgPSBHYW1lLmFyZWEubWFwLmRhdGEubmFtZTtcbiAgfSk7XG5cbiAgaW50ZXJmYWNlV2luZG93TWVudS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgR2FtZS53aW5kb3dzLnN5c21lbnUuc2hvdygpO1xuICB9KTtcblxuXG59KSgpO1xuIl19

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

  var win = Game.windows.inventory = Game.Window.create("inventoryWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"inventoryWindowItemBar\">\n\n        <button id=\"inventoryWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"inventoryWindowStatus\" class=\"brownButton\">状态</button>\n\n        <button id=\"inventoryWindowAll\" class=\"brownButton\">全部</button>\n        <button id=\"inventoryWindowWeapon\" class=\"brownButton\">武器</button>\n        <button id=\"inventoryWindowArmor\" class=\"brownButton\">护甲</button>\n        <button id=\"inventoryWindowPotion\" class=\"brownButton\">药水</button>\n        <button id=\"inventoryWindowMaterial\" class=\"brownButton\">材料</button>\n        <button id=\"inventoryWindowBook\" class=\"brownButton\">书籍</button>\n        <button id=\"inventoryWindowMisc\" class=\"brownButton\">其他</button>\n      </div>\n\n      <span id=\"inventoryWindowGold\"></span>\n\n      <div style=\"overflow: auto; height: 300px;\">\n        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n          <thead>\n            <tr>\n              <td style=\"width: 40px;\"></td>\n              <td style=\"width: 120px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td></td>\n              <td style=\"width: 60px;\"></td>\n            </tr>\n          </thead>\n          <tbody id=\"inventoryWindowTable\"></tbody>\n        </table>\n      </div>\n    </div>\n  ";

  win.css = "\n    #inventoryWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #inventoryWindowClose {\n      float: right;\n    }\n\n    #inventoryWindowStatus {\n      float: right;\n    }\n\n    .inventoryWindow table {\n      width: 100%;\n    }\n\n    .inventoryWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .inventoryWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    .inventoryWindow td {\n      border-bottom:1px solid #ccc;\n    }\n\n    .inventoryWindow tr:nth-child(odd) {\n      background-color: #ccc;\n    }\n\n    #inventoryWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var inventoryWindowClose = win.querySelector("button#inventoryWindowClose");
  var inventoryWindowStatus = win.querySelector("button#inventoryWindowStatus");

  var inventoryWindowAll = win.querySelector("button#inventoryWindowAll");
  var inventoryWindowWeapon = win.querySelector("button#inventoryWindowWeapon");
  var inventoryWindowArmor = win.querySelector("button#inventoryWindowArmor");
  var inventoryWindowPotion = win.querySelector("button#inventoryWindowPotion");
  var inventoryWindowMaterial = win.querySelector("button#inventoryWindowMaterial");
  var inventoryWindowBook = win.querySelector("button#inventoryWindowBook");
  var inventoryWindowMisc = win.querySelector("button#inventoryWindowMisc");

  var inventoryWindowGold = win.querySelector("span#inventoryWindowGold");
  var inventoryWindowTable = win.querySelector("#inventoryWindowTable");

  inventoryWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  inventoryWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.status.open();
    }, 20);
  });

  inventoryWindowAll.addEventListener("click", function (event) {
    win.open();
  });

  inventoryWindowWeapon.addEventListener("click", function (event) {
    win.open("sword|spear|bow");
  });

  inventoryWindowArmor.addEventListener("click", function (event) {
    win.open("head|body|feet");
  });

  inventoryWindowPotion.addEventListener("click", function (event) {
    win.open("potion");
  });

  inventoryWindowMaterial.addEventListener("click", function (event) {
    win.open("material");
  });

  inventoryWindowBook.addEventListener("click", function (event) {
    win.open("book|scroll|letter");
  });

  inventoryWindowMisc.addEventListener("click", function (event) {
    win.open("misc");
  });

  var lastFilter = null;
  var lastSelect = -1;

  win.assign("open", function (filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastFilter = filter;
    lastSelect = select;

    var defaultColor = "white";
    var activeColor = "yellow";

    inventoryWindowAll.style.color = defaultColor;
    inventoryWindowWeapon.style.color = defaultColor;
    inventoryWindowArmor.style.color = defaultColor;
    inventoryWindowPotion.style.color = defaultColor;
    inventoryWindowMaterial.style.color = defaultColor;
    inventoryWindowBook.style.color = defaultColor;
    inventoryWindowMisc.style.color = defaultColor;

    if (filter == null) {
      inventoryWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      inventoryWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      inventoryWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      inventoryWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      inventoryWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      inventoryWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      inventoryWindowMisc.style.color = activeColor;
    }

    inventoryWindowGold.textContent = Game.hero.data.gold + "G";

    var table = "";
    var index = 0;
    var ids = Object.keys(Game.hero.data.items);
    ids.sort();
    ids.forEach(function (itemId) {
      var itemCount = Game.hero.data.items[itemId];
      var item = Game.items[itemId];
      var equipment = null;

      Sprite.each(Game.hero.data.equipment, function (element, key) {
        if (element == item.id) equipment = key;
      });

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + (equipment ? "*" : "") + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">操作</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    inventoryWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = inventoryWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = inventoryWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastFilter, 0);
      } else if (key == "up") {
        win.open(lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastFilter, select);
      }
    }
  });

  inventoryWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      (function () {
        var item = Game.items[itemId];
        var itemCount = Game.hero.data.items[itemId];
        var equipment = null;

        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == item.id) equipment = key;
        });

        var options = {};
        if (item.data.type.match(/potion/)) {
          options["使用"] = "use";
          options["快捷键"] = "shortcut";
        } else if (item.data.type.match(/sword|spear|bow|head|body|feet|neck|ring/)) {
          if (equipment) options["卸下"] = "takeoff";else options["装备"] = "puton";
        } else if (item.data.type.match(/book/)) {
          options["阅读"] = "read";
        }

        options["丢弃"] = "drop";

        Game.choice(options, function (choice) {
          switch (choice) {
            case "puton":
              var type = item.data.type;
              if (type.match(/sword|spear|bow/)) {
                type = "weapon";
              }
              Game.hero.data.equipment[type] = item.id;
              return win.open(lastFilter);
              break;
            case "takeoff":
              if (item.data.type.match(/sword|spear|bow/)) Game.hero.data.equipment.weapon = null;else Game.hero.data.equipment[item.data.type] = null;
              return win.open(lastFilter);
              break;
            case "use":
              if (item.heroUse) {
                item.heroUse();
              }
              break;
            case "read":
              if (item.heroUse) {
                item.heroUse();
              }
              break;
            case "drop":
              if (equipment) {
                Game.hero.data.equipment[equipment] = null;
              }

              Game.addBag(Game.hero.x, Game.hero.y).then(function (bag) {
                if (bag.inner.hasOwnProperty(itemId)) {
                  bag.inner[itemId] += itemCount;
                } else {
                  bag.inner[itemId] = itemCount;
                }
              });

              delete Game.hero.data.items[itemId];

              Game.hero.data.bar.forEach(function (element, index, array) {
                if (element && element.id == itemId) {
                  array[index] = null;
                }
              });

              Game.windows["interface"].refresh();
              return win.open(lastFilter);
              break;
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }, function (choice) {
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: item.id,
                    type: "item"
                  };
                  Game.windows["interface"].refresh();
                }
              });
              break;
          }
        });
      })();
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword|spear|bow";
      } else if (filter.match(/sword/)) {
        filter = "head|body|feet";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book|scroll|letter";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(filter, -1);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword|spear|bow";
      } else if (filter.match(/potion/)) {
        filter = "head|body|feet";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book|scroll|letter";
      }
      win.open(filter, -1);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dJbnZlbnRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFekUsS0FBRyxDQUFDLElBQUksbzVDQWtDUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLHM0QkFpRE4sQ0FBQzs7QUFFRixNQUFJLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUM1RSxNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFOUUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDNUUsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDOUUsTUFBSSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEYsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUUsTUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRTFFLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFB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R2FtZVdpbmRvd0ludmVudG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3MuaW52ZW50b3J5ID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiaW52ZW50b3J5V2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwiaW52ZW50b3J5V2luZG93SXRlbUJhclwiPlxuXG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd1N0YXR1c1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7nirbmgIE8L2J1dHRvbj5cblxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93QWxsXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFqOmDqDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93V2VhcG9uXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuatpuWZqDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiaW52ZW50b3J5V2luZG93QXJtb3JcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5oqk55SyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dQb3Rpb25cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+6I2v5rC0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mnZDmlpk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImludmVudG9yeVdpbmRvd0Jvb2tcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Lmm57GNPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJpbnZlbnRvcnlXaW5kb3dNaXNjXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFtuS7ljwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzcGFuIGlkPVwiaW52ZW50b3J5V2luZG93R29sZFwiPjwvc3Bhbj5cblxuICAgICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93OiBhdXRvOyBoZWlnaHQ6IDMwMHB4O1wiPlxuICAgICAgICA8dGFibGUgYm9yZGVyPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGNlbGxwYWRkaW5nPVwiMFwiPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDQwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDEyMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNjBweDtcIj48L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keSBpZD1cImludmVudG9yeVdpbmRvd1RhYmxlXCI+PC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgI2ludmVudG9yeVdpbmRvd0l0ZW1CYXIgPiBidXR0b24ge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBtYXJnaW4tbGVmdDogNXB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gICAgICBtYXJnaW4tdG9wOiAwcHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAjaW52ZW50b3J5V2luZG93U3RhdHVzIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAuaW52ZW50b3J5V2luZG93IHRhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5pbnZlbnRvcnlXaW5kb3cgdGFibGUgaW1nIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIC5pbnZlbnRvcnlXaW5kb3cgdGFibGUgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgIC5pbnZlbnRvcnlXaW5kb3cgdGQge1xuICAgICAgYm9yZGVyLWJvdHRvbToxcHggc29saWQgI2NjYztcbiAgICB9XG5cbiAgICAuaW52ZW50b3J5V2luZG93IHRyOm50aC1jaGlsZChvZGQpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gICAgfVxuXG4gICAgI2ludmVudG9yeVdpbmRvd0dvbGQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgICAgYm90dG9tOiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgIH1cbiAgYDtcblxuICBsZXQgaW52ZW50b3J5V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd1N0YXR1cyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd1N0YXR1c1wiKTtcblxuICBsZXQgaW52ZW50b3J5V2luZG93QWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93QWxsXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93V2VhcG9uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93V2VhcG9uXCIpO1xuICBsZXQgaW52ZW50b3J5V2luZG93QXJtb3IgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dBcm1vclwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd1BvdGlvbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI2ludmVudG9yeVdpbmRvd1BvdGlvblwiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd01hdGVyaWFsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93TWF0ZXJpYWxcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dCb29rID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW52ZW50b3J5V2luZG93Qm9va1wiKTtcbiAgbGV0IGludmVudG9yeVdpbmRvd01pc2MgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnZlbnRvcnlXaW5kb3dNaXNjXCIpO1xuXG4gIGxldCBpbnZlbnRvcnlXaW5kb3dHb2xkID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJzcGFuI2ludmVudG9yeVdpbmRvd0dvbGRcIik7XG4gIGxldCBpbnZlbnRvcnlXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2ludmVudG9yeVdpbmRvd1RhYmxlXCIpO1xuXG4gIGludmVudG9yeVdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dTdGF0dXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLnN0YXR1cy5vcGVuKCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widGFiXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW4uaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLnN0YXR1cy5vcGVuKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dBbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKCk7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd1dlYXBvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJzd29yZHxzcGVhcnxib3dcIik7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd0FybW9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihcImhlYWR8Ym9keXxmZWV0XCIpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dQb3Rpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwicG90aW9uXCIpO1xuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJtYXRlcmlhbFwiKTtcbiAgfSk7XG5cbiAgaW52ZW50b3J5V2luZG93Qm9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4oXCJib29rfHNjcm9sbHxsZXR0ZXJcIik7XG4gIH0pO1xuXG4gIGludmVudG9yeVdpbmRvd01pc2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKFwibWlzY1wiKTtcbiAgfSk7XG5cbiAgbGV0IGxhc3RGaWx0ZXIgPSBudWxsO1xuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIHdpbi5hc3NpZ24oXCJvcGVuXCIsIGZ1bmN0aW9uIChmaWx0ZXIsIHNlbGVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3QgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZWN0ID0gLTE7XG4gICAgfVxuXG4gICAgbGFzdEZpbHRlciA9IGZpbHRlcjtcbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgbGV0IGRlZmF1bHRDb2xvciA9IFwid2hpdGVcIjtcbiAgICBsZXQgYWN0aXZlQ29sb3IgPSBcInllbGxvd1wiO1xuXG4gICAgaW52ZW50b3J5V2luZG93QWxsLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIGludmVudG9yeVdpbmRvd1dlYXBvbi5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dBcm1vci5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dQb3Rpb24uc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93TWF0ZXJpYWwuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgaW52ZW50b3J5V2luZG93Qm9vay5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBpbnZlbnRvcnlXaW5kb3dNaXNjLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuXG4gICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dBbGwuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93V2VhcG9uLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2hlYWQvKSkge1xuICAgICAgaW52ZW50b3J5V2luZG93QXJtb3Iuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd1BvdGlvbi5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dNYXRlcmlhbC5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgIGludmVudG9yeVdpbmRvd0Jvb2suc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICBpbnZlbnRvcnlXaW5kb3dNaXNjLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfVxuXG4gICAgaW52ZW50b3J5V2luZG93R29sZC50ZXh0Q29udGVudCA9IEdhbWUuaGVyby5kYXRhLmdvbGQgKyBcIkdcIjtcblxuICAgIGxldCB0YWJsZSA9IFwiXCI7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgaWRzID0gT2JqZWN0LmtleXMoR2FtZS5oZXJvLmRhdGEuaXRlbXMpO1xuICAgIGlkcy5zb3J0KCk7XG4gICAgaWRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW1JZCkge1xuICAgICAgbGV0IGl0ZW1Db3VudCA9IEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF07XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcbiAgICAgIGxldCBlcXVpcG1lbnQgPSBudWxsO1xuXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnQsIGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gaXRlbS5pZClcbiAgICAgICAgICBlcXVpcG1lbnQgPSBrZXk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaW5kZXhPZihpdGVtLmRhdGEudHlwZSkgPT0gLTEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IGluZGV4KSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uaWNvbikge1xuICAgICAgICBsaW5lICs9IGAgIDx0ZD48aW1nIGFsdD1cIlwiIHNyYz1cIiR7aXRlbS5pY29uLnNyY31cIj48L3RkPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGAgIDx0ZD4gPC90ZD5cXG5gO1xuICAgICAgfVxuICAgICAgbGluZSArPSBgICA8dGQ+JHtlcXVpcG1lbnQ/XCIqXCI6XCJcIn0ke2l0ZW0uZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbS5kYXRhLnZhbHVlfUc8L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4ke2l0ZW1Db3VudH08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5kZXNjcmlwdGlvbn08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD48YnV0dG9uIGRhdGEtaWQ9XCIke2l0ZW1JZH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5pON5L2cPC9idXR0b24+PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIGludmVudG9yeVdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZW50ZXJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IGludmVudG9yeVdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gaW52ZW50b3J5V2luZG93VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKS5sZW5ndGg7XG5cbiAgICBpZiAobGFzdFNlbGVjdCA9PSAtMSkge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICB3aW4ub3BlbihsYXN0RmlsdGVyLCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICB3aW4ub3BlbihsYXN0RmlsdGVyLCBjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEZpbHRlciwgc2VsZWN0KTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCAtIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPCAwKSB7XG4gICAgICAgICAgc2VsZWN0ID0gY291bnQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKGxhc3RGaWx0ZXIsIHNlbGVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpbnZlbnRvcnlXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGl0ZW1JZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmIChpdGVtSWQgJiYgR2FtZS5oZXJvLmRhdGEuaXRlbXMuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgbGV0IGl0ZW0gPSBHYW1lLml0ZW1zW2l0ZW1JZF07XG4gICAgICBsZXQgaXRlbUNvdW50ID0gR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXTtcbiAgICAgIGxldCBlcXVpcG1lbnQgPSBudWxsO1xuXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnQsIGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gaXRlbS5pZClcbiAgICAgICAgICBlcXVpcG1lbnQgPSBrZXk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICAgIGlmIChpdGVtLmRhdGEudHlwZS5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgICAgb3B0aW9uc1tcIuS9v+eUqFwiXSA9IFwidXNlXCI7XG4gICAgICAgIG9wdGlvbnNbXCLlv6vmjbfplK5cIl0gPSBcInNob3J0Y3V0XCI7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uZGF0YS50eXBlLm1hdGNoKC9zd29yZHxzcGVhcnxib3d8aGVhZHxib2R5fGZlZXR8bmVja3xyaW5nLykpIHtcbiAgICAgICAgaWYgKGVxdWlwbWVudClcbiAgICAgICAgICBvcHRpb25zW1wi5Y245LiLXCJdID0gXCJ0YWtlb2ZmXCI7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvcHRpb25zW1wi6KOF5aSHXCJdID0gXCJwdXRvblwiO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLmRhdGEudHlwZS5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIG9wdGlvbnNbXCLpmIXor7tcIl0gPSBcInJlYWRcIjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9uc1tcIuS4ouW8g1wiXSA9IFwiZHJvcFwiO1xuXG4gICAgICBHYW1lLmNob2ljZShvcHRpb25zLCBmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XG4gICAgICAgICAgY2FzZSBcInB1dG9uXCI6XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGl0ZW0uZGF0YS50eXBlO1xuICAgICAgICAgICAgaWYgKHR5cGUubWF0Y2goL3N3b3JkfHNwZWFyfGJvdy8pKSB7XG4gICAgICAgICAgICAgIHR5cGUgPSBcIndlYXBvblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W3R5cGVdID0gaXRlbS5pZDtcbiAgICAgICAgICAgIHJldHVybiB3aW4ub3BlbihsYXN0RmlsdGVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ0YWtlb2ZmXCI6XG4gICAgICAgICAgICBpZiAoaXRlbS5kYXRhLnR5cGUubWF0Y2goL3N3b3JkfHNwZWFyfGJvdy8pKVxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnQud2VhcG9uID0gbnVsbDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2l0ZW0uZGF0YS50eXBlXSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gd2luLm9wZW4obGFzdEZpbHRlcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidXNlXCI6XG4gICAgICAgICAgICBpZiAoaXRlbS5oZXJvVXNlKSB7XG4gICAgICAgICAgICAgIGl0ZW0uaGVyb1VzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInJlYWRcIjpcbiAgICAgICAgICAgIGlmIChpdGVtLmhlcm9Vc2UpIHtcbiAgICAgICAgICAgICAgaXRlbS5oZXJvVXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZHJvcFwiOlxuICAgICAgICAgICAgaWYgKGVxdWlwbWVudCkge1xuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnRbZXF1aXBtZW50XSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEdhbWUuYWRkQmFnKEdhbWUuaGVyby54ICxHYW1lLmhlcm8ueSkudGhlbigoYmFnKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChiYWcuaW5uZXIuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgICAgICAgICAgIGJhZy5pbm5lcltpdGVtSWRdICs9IGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWcuaW5uZXJbaXRlbUlkXSA9IGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdO1xuXG4gICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXIuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuaWQgPT0gaXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHdpbi5vcGVuKGxhc3RGaWx0ZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInNob3J0Y3V0XCI6XG4gICAgICAgICAgICBHYW1lLmNob2ljZSh7XG4gICAgICAgICAgICAgIDE6MCxcbiAgICAgICAgICAgICAgMjoxLFxuICAgICAgICAgICAgICAzOjIsXG4gICAgICAgICAgICAgIDQ6MyxcbiAgICAgICAgICAgICAgNTo0LFxuICAgICAgICAgICAgICA2OjUsXG4gICAgICAgICAgICAgIDc6NixcbiAgICAgICAgICAgICAgODo3XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2hvaWNlKSAmJiBjaG9pY2UgPj0gMCkge1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmJhcltjaG9pY2VdID0ge1xuICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcIml0ZW1cIlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wibGVmdFwiLCBcInJpZ2h0XCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleSA9PSBcInJpZ2h0XCIpIHtcbiAgICAgIGxldCBmaWx0ZXIgPSBsYXN0RmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICAgIGZpbHRlciA9IFwic3dvcmR8c3BlYXJ8Ym93XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImhlYWR8Ym9keXxmZWV0XCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtYXRlcmlhbFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rfHNjcm9sbHxsZXR0ZXJcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtaXNjXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICAgIGZpbHRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICB3aW4ub3BlbihmaWx0ZXIsIC0xKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PSBcImxlZnRcIikge1xuICAgICAgbGV0IGZpbHRlciA9IGxhc3RGaWx0ZXI7XG4gICAgICBpZiAoZmlsdGVyID09IG51bGwpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtaXNjXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2hlYWQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcInN3b3JkfHNwZWFyfGJvd1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiaGVhZHxib2R5fGZlZXRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWF0ZXJpYWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9taXNjLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rfHNjcm9sbHxsZXR0ZXJcIjtcbiAgICAgIH1cbiAgICAgIHdpbi5vcGVuKGZpbHRlciwgLTEpO1xuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = "\n    <div id=\"loadingWindowBox\">\n      <img id=\"loadingWindowLoadingIcon\" src=\"image/window/loading.svg\" alt=\"loading\">\n      <br>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </div>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    #loadingWindowLoadingIcon {\n      width: 50px;\n      height: 50px;\n      margin-top: 15px;\n      margin-bottom: 10px;\n      animation: loadingAnimation 1s linear infinite;\n    }\n\n    @keyframes loadingAnimation\n    {\n      0%   { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n\n    #loadingWindowBox {\n      width: 500px;\n      height: 300px;\n      border-radius: 25px;\n      position: fixed;\n      top: 75px;\n      left: 150px;\n      background-color: gray;\n    }\n\n    .loadingWindow label {\n      color: white;\n      font-size: 48px;\n    }\n\n    #loadingWindowText {\n      color: white;\n    }\n  ";

  var loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  var loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  var text = ["打开游戏菜单之后，游戏是暂停的，你可以在这时思考下战斗策略", "记得出门带着矿工锄和采药铲，或许能从其中赚点小钱", "职业、信仰、技能，都可以任意改变，但是必须付出代价", "你的信仰决定了神对你的祝福，还有某些人或者组织对你的看法", "信仰是可以改变的，不过艾利韦斯的居民并不喜欢总是改变自己信仰的人", "艾利韦斯信仰自由，没有信仰也是一种信仰，但是你享受不到任何神的祝福"];

  win.assign("begin", function () {
    loadingWindowProgress.innerHTML = "";
    // 随机一个提示
    loadingWindowText.textContent = text[Math.floor(Math.random() * text.length)];
    win.show();
  });

  win.assign("update", function (value) {
    loadingWindowProgress.innerHTML = value;
  });

  win.assign("end", function () {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dMb2FkaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxpU0FRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLHF0QkFxQ04sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7O0FBR2hFLE1BQUksSUFBSSxHQUFHLENBQ1QsK0JBQStCLEVBQy9CLDBCQUEwQixFQUMxQiwyQkFBMkIsRUFDM0IsOEJBQThCLEVBQzlCLGtDQUFrQyxFQUNsQyxtQ0FBbUMsQ0FDcEMsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxZQUFZO0FBQzlCLHlCQUFxQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXJDLHFCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDOUUsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3BDLHlCQUFxQixDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDekMsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVk7QUFDNUIsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0xvYWRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmxvYWRpbmcgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJsb2FkaW5nV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgaWQ9XCJsb2FkaW5nV2luZG93Qm94XCI+XG4gICAgICA8aW1nIGlkPVwibG9hZGluZ1dpbmRvd0xvYWRpbmdJY29uXCIgc3JjPVwiaW1hZ2Uvd2luZG93L2xvYWRpbmcuc3ZnXCIgYWx0PVwibG9hZGluZ1wiPlxuICAgICAgPGJyPlxuICAgICAgPGxhYmVsPuivt+eojeetiS4uLjxzbWFsbCBpZD1cImxvYWRpbmdXaW5kb3dQcm9ncmVzc1wiPjwvc21hbGw+PC9sYWJlbD5cbiAgICAgIDxicj5cbiAgICAgIDxoNSBpZD1cImxvYWRpbmdXaW5kb3dUZXh0XCI+PC9oNT5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5sb2FkaW5nV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd0xvYWRpbmdJY29uIHtcbiAgICAgIHdpZHRoOiA1MHB4O1xuICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgbWFyZ2luLXRvcDogMTVweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICBhbmltYXRpb246IGxvYWRpbmdBbmltYXRpb24gMXMgbGluZWFyIGluZmluaXRlO1xuICAgIH1cblxuICAgIEBrZXlmcmFtZXMgbG9hZGluZ0FuaW1hdGlvblxuICAgIHtcbiAgICAgIDAlICAgeyB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTsgfVxuICAgICAgMTAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd0JveCB7XG4gICAgICB3aWR0aDogNTAwcHg7XG4gICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogMjVweDtcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgIHRvcDogNzVweDtcbiAgICAgIGxlZnQ6IDE1MHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcbiAgICB9XG5cbiAgICAubG9hZGluZ1dpbmRvdyBsYWJlbCB7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICBmb250LXNpemU6IDQ4cHg7XG4gICAgfVxuXG4gICAgI2xvYWRpbmdXaW5kb3dUZXh0IHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGxvYWRpbmdXaW5kb3dQcm9ncmVzcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2xvYWRpbmdXaW5kb3dQcm9ncmVzc1wiKTtcbiAgbGV0IGxvYWRpbmdXaW5kb3dUZXh0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjbG9hZGluZ1dpbmRvd1RleHRcIik7XG5cbiAgLy8g5o+Q56S65L+h5oGvXG4gIGxldCB0ZXh0ID0gW1xuICAgIFwi5omT5byA5ri45oiP6I+c5Y2V5LmL5ZCO77yM5ri45oiP5piv5pqC5YGc55qE77yM5L2g5Y+v5Lul5Zyo6L+Z5pe25oCd6ICD5LiL5oiY5paX562W55WlXCIsXG4gICAgXCLorrDlvpflh7rpl6jluKbnnYDnn7/lt6XplITlkozph4foja/pk7LvvIzmiJborrjog73ku47lhbbkuK3otZrngrnlsI/pkrFcIixcbiAgICBcIuiBjOS4muOAgeS/oeS7sOOAgeaKgOiDve+8jOmDveWPr+S7peS7u+aEj+aUueWPmO+8jOS9huaYr+W/hemhu+S7mOWHuuS7o+S7t1wiLFxuICAgIFwi5L2g55qE5L+h5Luw5Yaz5a6a5LqG56We5a+55L2g55qE56Wd56aP77yM6L+Y5pyJ5p+Q5Lqb5Lq65oiW6ICF57uE57uH5a+55L2g55qE55yL5rOVXCIsXG4gICAgXCLkv6Hku7DmmK/lj6/ku6XmlLnlj5jnmoTvvIzkuI3ov4foib7liKnpn6bmlq/nmoTlsYXmsJHlubbkuI3llpzmrKLmgLvmmK/mlLnlj5joh6rlt7Hkv6Hku7DnmoTkurpcIixcbiAgICBcIuiJvuWIqemfpuaWr+S/oeS7sOiHqueUse+8jOayoeacieS/oeS7sOS5n+aYr+S4gOenjeS/oeS7sO+8jOS9huaYr+S9oOS6q+WPl+S4jeWIsOS7u+S9leelnueahOelneemj1wiXG4gIF07XG5cbiAgd2luLmFzc2lnbihcImJlZ2luXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkaW5nV2luZG93UHJvZ3Jlc3MuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAvLyDpmo/mnLrkuIDkuKrmj5DnpLpcbiAgICBsb2FkaW5nV2luZG93VGV4dC50ZXh0Q29udGVudCA9IHRleHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGV4dC5sZW5ndGgpXTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwidXBkYXRlXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGxvYWRpbmdXaW5kb3dQcm9ncmVzcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcImVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = "\n    <div>\n      <h1>维加大陆</h1>\n      <button id=\"mainWindowContinue\" class=\"brownButton\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\" class=\"brownButton\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\" class=\"brownButton\">读取进度</button>\n      <br>\n    </div>\n  ";

  win.css = "\n    .mainWindow {\n      text-align: center;\n      background-image: url(\"image/main.jpeg\");\n    }\n\n    .mainWindow h1 {\n      font-size: 60px;\n    }\n\n    .mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ";

  var mainWindowContinue = win.querySelector("button#mainWindowContinue");
  var mainWindowNew = win.querySelector("button#mainWindowNew");
  var mainWindowLoad = win.querySelector("button#mainWindowLoad");

  win.on("beforeShow", function () {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", function (event) {
    win.hide();
    setTimeout(function () {
      Game.Archive.load();
    }, 20);
  });

  mainWindowNew.addEventListener("click", function (event) {
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dNYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSx1VEFVUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLDhRQWVOLENBQUM7O0FBRUYsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzlELE1BQUksY0FBYyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEUsS0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWTtBQUMvQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUN4Qix3QkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztLQUNoRCxNQUFNO0FBQ0wsd0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7S0FDakQ7R0FDRixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzVELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDckIsRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLENBQUMsQ0FBQzs7QUFFSCxlQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3ZELFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDckIsQ0FBQyxDQUFDOztBQUVILGdCQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3hELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzdCLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dNYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5tYWluID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwibWFpbldpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2PlxuICAgICAgPGgxPue7tOWKoOWkp+mZhjwvaDE+XG4gICAgICA8YnV0dG9uIGlkPVwibWFpbldpbmRvd0NvbnRpbnVlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPue7p+e7reaXheeoizwvYnV0dG9uPlxuICAgICAgPGJyPlxuICAgICAgPGJ1dHRvbiBpZD1cIm1haW5XaW5kb3dOZXdcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5paw55qE5peF56iLPC9idXR0b24+XG4gICAgICA8YnI+XG4gICAgICA8YnV0dG9uIGlkPVwibWFpbldpbmRvd0xvYWRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+6K+75Y+W6L+b5bqmPC9idXR0b24+XG4gICAgICA8YnI+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAubWFpbldpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJpbWFnZS9tYWluLmpwZWdcIik7XG4gICAgfVxuXG4gICAgLm1haW5XaW5kb3cgaDEge1xuICAgICAgZm9udC1zaXplOiA2MHB4O1xuICAgIH1cblxuICAgIC5tYWluV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTIwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIH1cbiAgYDtcblxuICBsZXQgbWFpbldpbmRvd0NvbnRpbnVlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jbWFpbldpbmRvd0NvbnRpbnVlXCIpO1xuICBsZXQgbWFpbldpbmRvd05ldyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI21haW5XaW5kb3dOZXdcIik7XG4gIGxldCBtYWluV2luZG93TG9hZCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI21haW5XaW5kb3dMb2FkXCIpO1xuXG4gIHdpbi5vbihcImJlZm9yZVNob3dcIiwgZnVuY3Rpb24gKCkge1xuICAgIGlmICghR2FtZS5BcmNoaXZlLmxhc3QoKSkge1xuICAgICAgbWFpbldpbmRvd0NvbnRpbnVlLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYWluV2luZG93Q29udGludWUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH1cbiAgfSk7XG5cbiAgbWFpbldpbmRvd0NvbnRpbnVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgR2FtZS5BcmNoaXZlLmxvYWQoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIG1haW5XaW5kb3dOZXcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIEdhbWUucmVnaXN0ZXIucmVnKCk7XG4gIH0pO1xuXG4gIG1haW5XaW5kb3dMb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5hcmNoaXZlLm9wZW4oKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.map = Game.Window.create("mapWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"mapWindowClose\" class=\"brownButton\">关闭</button>\n      <table><tbody><tr><td>\n        <div id=\"mapWindowMap\"></div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .mapWindow table, .mapWindow tbody, .mapWindow tr, .mapWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .mapWindow {\n      text-align: center;\n    }\n\n    #mapWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #mapWindowMap img, #mapWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var mapWindowClose = win.querySelector("#mapWindowClose");
  var mapWindowMap = win.querySelector("#mapWindowMap");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      mapWindowClose.click();
    }, 20);
  });

  win.on("beforeShow", function (event) {
    if (Game.stage && Game.area && Game.area.map) {
      var stage = {
        x: Game.stage.x,
        y: Game.stage.y,
        centerX: Game.stage.centerX,
        centerY: Game.stage.centerY
      };
      Game.stage.x = 0;
      Game.stage.y = 0;
      Game.stage.centerX = 0;
      Game.stage.centerY = 0;
      var canvas = document.createElement("canvas");
      canvas.width = Game.area.map.width;
      canvas.height = Game.area.map.height;
      var context = canvas.getContext("2d");
      Game.stage.draw(context);
      var minimap = document.createElement("canvas");
      minimap.width = Math.floor(canvas.width / 8);
      minimap.height = Math.floor(canvas.height / 8);
      var minimapContext = minimap.getContext("2d");
      minimapContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, minimap.width, minimap.height);
      context = null;
      canvas = null;
      mapWindowMap.innerHTML = "";
      mapWindowMap.appendChild(minimap);
      Game.stage.x = stage.x;
      Game.stage.y = stage.y;
      Game.stage.centerX = stage.centerX;
      Game.stage.centerY = stage.centerY;
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdELEtBQUcsQ0FBQyxJQUFJLHFPQU9QLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcsMGVBeUJOLENBQUM7O0FBRUYsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFELE1BQUksWUFBWSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXRELGdCQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3hELFFBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ3pCLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFDakMsY0FBVSxDQUFDLFlBQVk7QUFDckIsb0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN4QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1IsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3BDLFFBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQzVDLFVBQUksS0FBSyxHQUFHO0FBQ1YsU0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNmLFNBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDZixlQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO0FBQzNCLGVBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87T0FDNUIsQ0FBQztBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixVQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUN2QixVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ25DLFlBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3JDLFVBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekIsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxhQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3QyxhQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvQyxVQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLG9CQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDN0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQ2pDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsYUFBTyxHQUFHLElBQUksQ0FBQztBQUNmLFlBQU0sR0FBRyxJQUFJLENBQUM7QUFDZCxrQkFBWSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDNUIsa0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDbkMsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztLQUNwQztHQUNGLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLm1hcCA9IEdhbWUuV2luZG93LmNyZWF0ZShcIm1hcFdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGJ1dHRvbiBpZD1cIm1hcFdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICA8ZGl2IGlkPVwibWFwV2luZG93TWFwXCI+PC9kaXY+XG4gICAgICA8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLm1hcFdpbmRvdyB0YWJsZSwgLm1hcFdpbmRvdyB0Ym9keSwgLm1hcFdpbmRvdyB0ciwgLm1hcFdpbmRvdyB0ZCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG1hZ3JpbjogMDtcbiAgICAgIHBhZGRpbmc6IDA7XG4gICAgfVxuXG4gICAgLm1hcFdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgI21hcFdpbmRvd0Nsb3NlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgICNtYXBXaW5kb3dNYXAgaW1nLCAjbWFwV2luZG93TWFwIGNhbnZhcyB7XG4gICAgICBtYXgtd2lkdGg6IDcwMHB4O1xuICAgICAgbWF4LWhlaWdodDogMzIwcHg7XG4gICAgfVxuICBgO1xuXG4gIGxldCBtYXBXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI21hcFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgbWFwV2luZG93TWFwID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjbWFwV2luZG93TWFwXCIpO1xuXG4gIG1hcFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLndpbmRvd3MubWFwLmhpZGUoKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIG1hcFdpbmRvd0Nsb3NlLmNsaWNrKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ub24oXCJiZWZvcmVTaG93XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChHYW1lLnN0YWdlICYmIEdhbWUuYXJlYSAmJiBHYW1lLmFyZWEubWFwKSB7XG4gICAgICBsZXQgc3RhZ2UgPSB7XG4gICAgICAgIHg6IEdhbWUuc3RhZ2UueCxcbiAgICAgICAgeTogR2FtZS5zdGFnZS55LFxuICAgICAgICBjZW50ZXJYOiBHYW1lLnN0YWdlLmNlbnRlclgsXG4gICAgICAgIGNlbnRlclk6IEdhbWUuc3RhZ2UuY2VudGVyWVxuICAgICAgfTtcbiAgICAgIEdhbWUuc3RhZ2UueCA9IDA7XG4gICAgICBHYW1lLnN0YWdlLnkgPSAwO1xuICAgICAgR2FtZS5zdGFnZS5jZW50ZXJYID0gMDtcbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWSA9IDA7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IEdhbWUuYXJlYS5tYXAud2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gR2FtZS5hcmVhLm1hcC5oZWlnaHQ7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBHYW1lLnN0YWdlLmRyYXcoY29udGV4dCk7XG4gICAgICBsZXQgbWluaW1hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBtaW5pbWFwLndpZHRoID0gTWF0aC5mbG9vcihjYW52YXMud2lkdGggLyA4KTtcbiAgICAgIG1pbmltYXAuaGVpZ2h0ID0gTWF0aC5mbG9vcihjYW52YXMuaGVpZ2h0IC8gOCk7XG4gICAgICBsZXQgbWluaW1hcENvbnRleHQgPSBtaW5pbWFwLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIG1pbmltYXBDb250ZXh0LmRyYXdJbWFnZShjYW52YXMsXG4gICAgICAgIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCxcbiAgICAgICAgMCwgMCwgbWluaW1hcC53aWR0aCwgbWluaW1hcC5oZWlnaHQpO1xuICAgICAgY29udGV4dCA9IG51bGw7XG4gICAgICBjYW52YXMgPSBudWxsO1xuICAgICAgbWFwV2luZG93TWFwLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBtYXBXaW5kb3dNYXAuYXBwZW5kQ2hpbGQobWluaW1hcCk7XG4gICAgICBHYW1lLnN0YWdlLnggPSBzdGFnZS54O1xuICAgICAgR2FtZS5zdGFnZS55ID0gc3RhZ2UueTtcbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWCA9IHN0YWdlLmNlbnRlclg7XG4gICAgICBHYW1lLnN0YWdlLmNlbnRlclkgPSBzdGFnZS5jZW50ZXJZO1xuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.over = Game.Window.create("overWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"overWindowClose\" class=\"brownButton\">返回主菜单</button>\n      <table><tbody><tr><td>\n        <div>\n          <h1 id=\"overWindowMessage\"></h1>\n          <h2 id=\"overWindowReason\"></h2>\n        </div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .overWindow table, .overWindow tbody, .overWindow tr, .overWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .overWindow {\n      text-align: center;\n    }\n\n    #overWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #overWindowMap img, #overWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var overWindowMessage = win.querySelector("#overWindowMessage");
  var overWindowReason = win.querySelector("#overWindowReason");

  var deadText = ["不幸的事情终于发生了……即便你的内心曾对神灵祈祷", "不幸的事情终于发生了……你就知道自己今天不应该穿白色的袜子", "不幸的事情终于发生了……明明还没有体验过天伦之乐", "不幸的事情终于发生了……你的墓碑上写着：“下次不能随便踢小动物”", "不幸的事情终于发生了……你感觉自己的身体变轻了…轻了…轻了…", "不幸的事情终于发生了……你摸了摸自己的脖子，似乎找不到脑袋了，于是你一赌气", "不幸的事情终于发生了……你的墓碑上写着：“下次再也不把治疗药水借给别人了”", "不幸的事情终于发生了……曾经有一瓶治疗药水摆在你面前，而你没有珍惜", "不幸的事情终于发生了……你回想起曾经在广阔的原野上尽情的奔跑", "不幸的事情终于发生了……不过好消息是你再也不用减肥了", "不幸的事情终于发生了……下次在冒险前一定要吃饱饭"];

  win.assign("open", function (reason) {
    if (reason) {
      overWindowReason.textContent = reason;
    } else {
      overWindowReason.innerHTML = "";
    }
    overWindowMessage.textContent = deadText[Math.floor(Math.random() * deadText.length)];
    win.show();
  });

  overWindowClose.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dPdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSwwVEFVUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGtmQXlCTixDQUFDOztBQUVGLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxNQUFJLFFBQVEsR0FBRyxDQUNiLDBCQUEwQixFQUMxQiwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLGtDQUFrQyxFQUNsQyxnQ0FBZ0MsRUFDaEMsdUNBQXVDLEVBQ3ZDLHVDQUF1QyxFQUN2QyxtQ0FBbUMsRUFDbkMsZ0NBQWdDLEVBQ2hDLDRCQUE0QixFQUM1QiwwQkFBMEIsQ0FDM0IsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUNuQyxRQUFJLE1BQU0sRUFBRTtBQUNWLHNCQUFnQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDdkMsTUFBTTtBQUNMLHNCQUFnQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDakM7QUFDRCxxQkFBaUIsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxpQkFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6RCxRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDMUIsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd092ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLm92ZXIgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJvdmVyV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwib3ZlcldpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPui/lOWbnuS4u+iPnOWNlTwvYnV0dG9uPlxuICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMSBpZD1cIm92ZXJXaW5kb3dNZXNzYWdlXCI+PC9oMT5cbiAgICAgICAgICA8aDIgaWQ9XCJvdmVyV2luZG93UmVhc29uXCI+PC9oMj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLm92ZXJXaW5kb3cgdGFibGUsIC5vdmVyV2luZG93IHRib2R5LCAub3ZlcldpbmRvdyB0ciwgLm92ZXJXaW5kb3cgdGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtYWdyaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5vdmVyV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjb3ZlcldpbmRvd0Nsb3NlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgICNvdmVyV2luZG93TWFwIGltZywgI292ZXJXaW5kb3dNYXAgY2FudmFzIHtcbiAgICAgIG1heC13aWR0aDogNzAwcHg7XG4gICAgICBtYXgtaGVpZ2h0OiAzMjBweDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IG92ZXJXaW5kb3dNZXNzYWdlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcldpbmRvd01lc3NhZ2VcIik7XG4gIGxldCBvdmVyV2luZG93UmVhc29uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcldpbmRvd1JlYXNvblwiKTtcblxuICBsZXQgZGVhZFRleHQgPSBbXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbljbPkvr/kvaDnmoTlhoXlv4Pmm77lr7nnpZ7ngbXnpYjnpbdcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOWwseefpemBk+iHquW3seS7iuWkqeS4jeW6lOivpeepv+eZveiJsueahOiinOWtkFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5piO5piO6L+Y5rKh5pyJ5L2T6aqM6L+H5aSp5Lym5LmL5LmQXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDnmoTlopPnopHkuIrlhpnnnYDvvJrigJzkuIvmrKHkuI3og73pmo/kvr/ouKLlsI/liqjnianigJ1cIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOaEn+inieiHquW3seeahOi6q+S9k+WPmOi9u+S6huKApui9u+S6huKApui9u+S6huKAplwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g5pG45LqG5pG46Ieq5bex55qE6ISW5a2Q77yM5Ly85LmO5om+5LiN5Yiw6ISR6KKL5LqG77yM5LqO5piv5L2g5LiA6LWM5rCUXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDnmoTlopPnopHkuIrlhpnnnYDvvJrigJzkuIvmrKHlho3kuZ/kuI3miormsrvnlpfoja/msLTlgJ/nu5nliKvkurrkuobigJ1cIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuabvue7j+acieS4gOeTtuayu+eWl+iNr+awtOaRhuWcqOS9oOmdouWJje+8jOiAjOS9oOayoeacieePjeaDnFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g5Zue5oOz6LW35pu+57uP5Zyo5bm/6ZiU55qE5Y6f6YeO5LiK5bC95oOF55qE5aWU6LeRXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkuI3ov4flpb3mtojmga/mmK/kvaDlho3kuZ/kuI3nlKjlh4/ogqXkuoZcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS4i+asoeWcqOWGkumZqeWJjeS4gOWumuimgeWQg+mlsemlrVwiXG4gIF07XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIGlmIChyZWFzb24pIHtcbiAgICAgIG92ZXJXaW5kb3dSZWFzb24udGV4dENvbnRlbnQgPSByZWFzb247XG4gICAgfSBlbHNlIHtcbiAgICAgIG92ZXJXaW5kb3dSZWFzb24uaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG4gICAgb3ZlcldpbmRvd01lc3NhZ2UudGV4dENvbnRlbnQgPSBkZWFkVGV4dFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkZWFkVGV4dC5sZW5ndGgpXTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICBvdmVyV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICB9KTtcblxuXG59KSgpO1xuIl19

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

  var win = Game.windows.pickup = Game.Window.create("pickupWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"pickupWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"pickupWindowAll\" class=\"brownButton\">A 全部</button>\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"pickupWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    .pickupWindow table {\n      width: 100%;\n    }\n\n    .pickupWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .pickupWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16;\n    }\n\n    #pickupWindowClose {\n\n    }\n\n    #pickupWindowAll {\n\n    }\n  ";

  var pickupWindowClose = win.querySelector("button#pickupWindowClose");
  var pickupWindowAll = win.querySelector("button#pickupWindowAll");
  var pickupWindowTable = win.querySelector("#pickupWindowTable");

  var currentItemObj = null;
  var lastSelect = -1;

  pickupWindowClose.addEventListener("click", function (event) {
    Game.windows.pickup.hide();
  });

  pickupWindowAll.addEventListener("click", function (event) {
    var itemObj = currentItemObj;
    if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
      Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
        if (itemId == "gold") {
          Game.hero.data.gold += itemCount;
        } else {
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId] += itemCount;
          } else {
            Game.hero.data.items[itemId] = itemCount;
          }
        }
        delete inner[itemId];
      });
      Game.windows.pickup.open(itemObj);
    }
  });

  win.whenUp(["a", "A"], function (key) {
    pickupWindowAll.click();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    var buttons = pickupWindowTable.querySelectorAll("button");
    for (var i = 0, len = buttons.length; i < len; i++) {
      var buttonIndex = buttons[i].getAttribute("data-index");
      if (buttonIndex) {
        if (buttonIndex == key) {
          buttons[i].click();
        }
      }
    }
  });

  win.assign("open", function (itemObj, select) {
    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Game.area.bags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var bag = _step.value;

          if (bag == itemObj) {
            Game.area.bags["delete"](bag);
            itemObj.erase();
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

      Game.windows.pickup.hide();
      return;
    }

    currentItemObj = itemObj;

    var index = 1;
    var table = "";
    Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
      var item = Game.items[itemId];

      var line = "";

      if (select == index - 1) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" data-index=\"" + index + "\" class=\"brownButton\">" + (index <= 9 ? index : "") + " 拿取</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    pickupWindowTable.innerHTML = table;
    Game.windows.pickup.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = pickupWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = pickupWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(currentItemObj, 0);
      } else if (key == "up") {
        win.open(currentItemObj, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(currentItemObj, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(currentItemObj, select);
      }
    }
  });

  pickupWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && currentItemObj.inner && currentItemObj.inner.hasOwnProperty(itemId)) {
      var itemCount = currentItemObj.inner[itemId];
      if (itemId == "gold") {
        Game.hero.data.gold += itemCount;
      } else {
        if (Game.hero.data.items.hasOwnProperty(itemId)) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
      }
      delete currentItemObj.inner[itemId];
      win.open(currentItemObj);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dQaWNrdXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5FLEtBQUcsQ0FBQyxJQUFJLDZvQkFrQlAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyw0VEF1Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsTUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWhFLE1BQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixNQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzNELFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzVCLENBQUMsQ0FBQzs7QUFFSCxpQkFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6RCxRQUFJLE9BQU8sR0FBRyxjQUFjLENBQUM7QUFDN0IsUUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JFLFlBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93UGlja3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5waWNrdXAgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJwaWNrdXBXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxidXR0b24gaWQ9XCJwaWNrdXBXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJwaWNrdXBXaW5kb3dBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+QSDlhajpg6g8L2J1dHRvbj5cbiAgICAgIDx0YWJsZSBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNDBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDEyMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMzBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDMwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDYwcHg7XCI+PC90ZD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHkgaWQ9XCJwaWNrdXBXaW5kb3dUYWJsZVwiPjwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLnBpY2t1cFdpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAucGlja3VwV2luZG93IHRhYmxlIGltZyB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAucGlja3VwV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTY7XG4gICAgfVxuXG4gICAgI3BpY2t1cFdpbmRvd0Nsb3NlIHtcblxuICAgIH1cblxuICAgICNwaWNrdXBXaW5kb3dBbGwge1xuXG4gICAgfVxuICBgO1xuXG4gIGxldCBwaWNrdXBXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3BpY2t1cFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgcGlja3VwV2luZG93QWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jcGlja3VwV2luZG93QWxsXCIpO1xuICBsZXQgcGlja3VwV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNwaWNrdXBXaW5kb3dUYWJsZVwiKTtcblxuICBsZXQgY3VycmVudEl0ZW1PYmogPSBudWxsO1xuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIHBpY2t1cFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLndpbmRvd3MucGlja3VwLmhpZGUoKTtcbiAgfSk7XG5cbiAgcGlja3VwV2luZG93QWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaXRlbU9iaiA9IGN1cnJlbnRJdGVtT2JqO1xuICAgIGlmIChpdGVtT2JqICYmIGl0ZW1PYmouaW5uZXIgJiYgT2JqZWN0LmtleXMoaXRlbU9iai5pbm5lcikubGVuZ3RoID4gMCkge1xuICAgICAgU3ByaXRlLmVhY2goaXRlbU9iai5pbm5lciwgZnVuY3Rpb24gKGl0ZW1Db3VudCwgaXRlbUlkLCBpbm5lcikge1xuICAgICAgICBpZiAoaXRlbUlkID09IFwiZ29sZFwiKSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZ29sZCArPSBpdGVtQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0pIHtcbiAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0gKz0gaXRlbUNvdW50O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdID0gaXRlbUNvdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgaW5uZXJbaXRlbUlkXTtcbiAgICAgIH0pO1xuICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKGl0ZW1PYmopO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJhXCIsIFwiQVwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHBpY2t1cFdpbmRvd0FsbC5jbGljaygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBwaWNrdXBXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBidXR0b25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgYnV0dG9uSW5kZXggPSBidXR0b25zW2ldLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XG4gICAgICBpZiAoYnV0dG9uSW5kZXgpIHtcbiAgICAgICAgaWYgKGJ1dHRvbkluZGV4ID09IGtleSkge1xuICAgICAgICAgIGJ1dHRvbnNbaV0uY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKGl0ZW1PYmosIHNlbGVjdCkge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHNlbGVjdCA9IC0xO1xuICAgIH1cblxuICAgIGxhc3RTZWxlY3QgPSBzZWxlY3Q7XG5cbiAgICBpZiAoIWl0ZW1PYmouaW5uZXIgfHwgT2JqZWN0LmtleXMoaXRlbU9iai5pbm5lcikubGVuZ3RoIDw9IDApIHtcbiAgICAgIGZvciAobGV0IGJhZyBvZiBHYW1lLmFyZWEuYmFncykge1xuICAgICAgICBpZiAoYmFnID09IGl0ZW1PYmopIHtcbiAgICAgICAgICBHYW1lLmFyZWEuYmFncy5kZWxldGUoYmFnKTtcbiAgICAgICAgICBpdGVtT2JqLmVyYXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEdhbWUud2luZG93cy5waWNrdXAuaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRJdGVtT2JqID0gaXRlbU9iajtcblxuICAgIGxldCBpbmRleCA9IDE7XG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBTcHJpdGUuZWFjaChpdGVtT2JqLmlubmVyLCBmdW5jdGlvbiAoaXRlbUNvdW50LCBpdGVtSWQsIGlubmVyKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IChpbmRleCAtIDEpKSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuXG4gICAgICBpZiAoaXRlbS5pY29uKSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPjxpbWcgYWx0PVwiXCIgc3JjPVwiJHtpdGVtLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPiA8L3RkPlxcbmA7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbS5kYXRhLnZhbHVlfUc8L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4ke2l0ZW1Db3VudH08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5kZXNjcmlwdGlvbn08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD48YnV0dG9uIGRhdGEtaWQ9XCIke2l0ZW1JZH1cIiBkYXRhLWluZGV4PVwiJHtpbmRleH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+JHtpbmRleDw9OT8oaW5kZXgpOlwiXCJ9IOaLv+WPljwvYnV0dG9uPjwvdGQ+XFxuYDtcblxuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIHBpY2t1cFdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIEdhbWUud2luZG93cy5waWNrdXAuc2hvdygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBwaWNrdXBXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGlmIChsYXN0U2VsZWN0ID49IDAgJiYgbGFzdFNlbGVjdCA8IGJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBidXR0b25zW2xhc3RTZWxlY3RdLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInVwXCIsIFwiZG93blwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBjb3VudCA9IHBpY2t1cFdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIikubGVuZ3RoO1xuXG4gICAgaWYgKGxhc3RTZWxlY3QgPT0gLTEpIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgd2luLm9wZW4oY3VycmVudEl0ZW1PYmosIDApO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGN1cnJlbnRJdGVtT2JqLCBjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4oY3VycmVudEl0ZW1PYmosIHNlbGVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgLSAxO1xuICAgICAgICBpZiAoc2VsZWN0IDwgMCkge1xuICAgICAgICAgIHNlbGVjdCA9IGNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihjdXJyZW50SXRlbU9iaiwgc2VsZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHBpY2t1cFdpbmRvd1RhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaXRlbUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgaWYgKGl0ZW1JZCAmJiBjdXJyZW50SXRlbU9iai5pbm5lciAmJiBjdXJyZW50SXRlbU9iai5pbm5lci5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICBsZXQgaXRlbUNvdW50ID0gY3VycmVudEl0ZW1PYmouaW5uZXJbaXRlbUlkXTtcbiAgICAgIGlmKGl0ZW1JZCA9PSBcImdvbGRcIikge1xuICAgICAgICBHYW1lLmhlcm8uZGF0YS5nb2xkICs9IGl0ZW1Db3VudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5pdGVtcy5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXSArPSBpdGVtQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXSA9IGl0ZW1Db3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGVsZXRlIGN1cnJlbnRJdGVtT2JqLmlubmVyW2l0ZW1JZF07XG4gICAgICB3aW4ub3BlbihjdXJyZW50SXRlbU9iaik7XG4gICAgfVxuICB9KTtcblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.quest = Game.Window.create("questWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"questWindowItemBar\">\n        <button id=\"questWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"questWindowCurrent\" class=\"brownButton\">当前任务</button>\n        <button id=\"questWindowPast\" class=\"brownButton\">已完成</button>\n      </div>\n      <div id=\"questWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #questWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .questWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .questWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #questWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      margin-bottom: 5px;\n    }\n\n    #questWindowClose {\n      float: right;\n    }\n  ";

  var questWindowClose = win.querySelector("#questWindowClose");
  var questWindowCurrent = win.querySelector("#questWindowCurrent");
  var questWindowPast = win.querySelector("#questWindowPast");
  var questWindowTable = win.querySelector("#questWindowTable");

  questWindowClose.addEventListener("click", function () {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      questWindowClose.click();
    }, 20);
  });

  questWindowCurrent.addEventListener("click", function () {
    win.hide();
    win.current();
  });

  questWindowPast.addEventListener("click", function () {
    win.hide();
    win.past();
  });

  win.assign("current", function () {

    questWindowCurrent.disabled = true;
    questWindowPast.disabled = false;

    var table = "";
    var list = Game.hero.data.currentQuest;
    list.forEach(function (quest) {

      var complete = Game.Quest.isComplete(quest);

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + (complete ? "[已完成]" : "[未完成]") + "</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target && quest.target.kill == "kill") {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
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

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有正在进行的任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  win.assign("past", function () {

    questWindowCurrent.disabled = false;
    questWindowPast.disabled = true;

    var table = "";
    var list = Game.hero.data.completeQuest;
    list.forEach(function (quest) {

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + "[已完成]</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target && quest.target.type == "kill") {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
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
      }

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有已完成任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  questWindowTable.addEventListener("click", function (event) {
    var id = event.target.getAttribute("data-id");
    if (id) {
      if (type == "remove") {
        Game.Archive.remove(id);
        win.open();
      } else if (type == "load") {
        Game.Archive.load(id);
        win.hide();
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dRdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFHYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakUsS0FBRyxDQUFDLElBQUksMFhBU1AsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxnaEJBNkJOLENBQUM7O0FBRUYsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUQsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbEUsTUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVELE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUc5RCxrQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNyRCxPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQ2pDLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLHNCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzFCLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDUixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdkQsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsT0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2Ys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QUMsQ0FBQzs7QUFFSCxrQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDMUQsUUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUMsUUFBSSxFQUFFLEVBQUU7QUFDTixVQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDcEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ1osTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDekIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ1o7S0FDRjtHQUNGLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dRdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5xdWVzdCA9IEdhbWUuV2luZG93LmNyZWF0ZShcInF1ZXN0V2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwicXVlc3RXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJxdWVzdFdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwicXVlc3RXaW5kb3dDdXJyZW50XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuW9k+WJjeS7u+WKoTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwicXVlc3RXaW5kb3dQYXN0XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuW3suWujOaIkDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGlkPVwicXVlc3RXaW5kb3dUYWJsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgI3F1ZXN0V2luZG93VGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgaGVpZ2h0OiAzMjBweDtcbiAgICB9XG5cbiAgICAucXVlc3RXaW5kb3dJdGVtIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgbWFyZ2luOiAxMHB4IDEwcHg7XG4gICAgfVxuXG4gICAgLnF1ZXN0V2luZG93SXRlbSA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfVxuXG4gICAgI3F1ZXN0V2luZG93SXRlbUJhciBidXR0b24ge1xuICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgICNxdWVzdFdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHF1ZXN0V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNxdWVzdFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgcXVlc3RXaW5kb3dDdXJyZW50ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjcXVlc3RXaW5kb3dDdXJyZW50XCIpO1xuICBsZXQgcXVlc3RXaW5kb3dQYXN0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjcXVlc3RXaW5kb3dQYXN0XCIpO1xuICBsZXQgcXVlc3RXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3F1ZXN0V2luZG93VGFibGVcIik7XG5cblxuICBxdWVzdFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHF1ZXN0V2luZG93Q2xvc2UuY2xpY2soKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHF1ZXN0V2luZG93Q3VycmVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgd2luLmN1cnJlbnQoKTtcbiAgfSk7XG5cbiAgcXVlc3RXaW5kb3dQYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICB3aW4ucGFzdCgpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwiY3VycmVudFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBxdWVzdFdpbmRvd0N1cnJlbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHF1ZXN0V2luZG93UGFzdC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgbGlzdCA9IEdhbWUuaGVyby5kYXRhLmN1cnJlbnRRdWVzdDtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKHF1ZXN0KSB7XG5cbiAgICAgIGxldCBjb21wbGV0ZSA9IEdhbWUuUXVlc3QuaXNDb21wbGV0ZShxdWVzdCk7XG5cbiAgICAgIGxldCBsaW5lID0gYDxkaXYgY2xhc3M9XCJxdWVzdFdpbmRvd0l0ZW1cIj5cXG5gO1xuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJmb250LXNpemU6IDIwcHg7IG1hcmdpbjogMTBweDtcIj4ke3F1ZXN0Lm5hbWV9JHtjb21wbGV0ZT9cIlvlt7LlrozmiJBdXCI6XCJb5pyq5a6M5oiQXVwifTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj7nroDku4vvvJoke3F1ZXN0LmRlc2NyaXB0aW9ufTwvZGl2PlxcbmA7XG5cbiAgICAgIGlmIChxdWVzdC5yZXdhcmQpIHtcbiAgICAgICAgbGluZSArPSBgICA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPuS7u+WKoeWlluWKse+8mmA7XG4gICAgICAgIGlmIChxdWVzdC5yZXdhcmQuZ29sZCkge1xuICAgICAgICAgIGxpbmUgKz0gYDxsYWJlbCBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjBweDtcIj7ph5HluIHvvJoke3F1ZXN0LnJld2FyZC5nb2xkfTwvbGFiZWw+YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocXVlc3QucmV3YXJkLmV4cCkge1xuICAgICAgICAgIGxpbmUgKz0gYDxsYWJlbCBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjBweDtcIj7nu4/pqozvvJoke3F1ZXN0LnJld2FyZC5leHB9PC9sYWJlbD5gO1xuICAgICAgICB9XG4gICAgICAgIGxpbmUgKz0gYCAgPC9kaXY+YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHF1ZXN0LnRhcmdldCAmJiBxdWVzdC50YXJnZXQua2lsbCA9PSBcImtpbGxcIikge1xuICAgICAgICBmb3IgKGxldCBrIG9mIHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgbGluZSArPSBgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj4ke2submFtZX3vvJoke2suY3VycmVudH0gLyAke3QubmVlZH08L2Rpdj5gO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPue7meS6iOS6uu+8miR7cXVlc3QuZnJvbU1hcH0g55qEICR7cXVlc3QuZnJvbU5hbWV9PC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+5Lqk5LuY5Lq677yaJHtxdWVzdC50b01hcH0g55qEICR7cXVlc3QudG9OYW1lfTwvbGFiZWw+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L2Rpdj5cXG5cIlxuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICB9KTtcblxuICAgIGlmICh0YWJsZS5sZW5ndGggPD0gMCkge1xuICAgICAgdGFibGUgPSBcIjxkaXY+PGxhYmVsPuayoeacieato+WcqOi/m+ihjOeahOS7u+WKoTwvbGFiZWw+PC9kaXY+XCI7XG4gICAgfVxuXG4gICAgcXVlc3RXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwicGFzdFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBxdWVzdFdpbmRvd0N1cnJlbnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBxdWVzdFdpbmRvd1Bhc3QuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBsZXQgbGlzdCA9IEdhbWUuaGVyby5kYXRhLmNvbXBsZXRlUXVlc3Q7XG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChxdWVzdCkge1xuXG4gICAgICBsZXQgbGluZSA9IGA8ZGl2IGNsYXNzPVwicXVlc3RXaW5kb3dJdGVtXCI+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPGxhYmVsIHN0eWxlPVwiZm9udC1zaXplOiAyMHB4OyBtYXJnaW46IDEwcHg7XCI+JHtxdWVzdC5uYW1lfVvlt7LlrozmiJBdPC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPueugOS7i++8miR7cXVlc3QuZGVzY3JpcHRpb259PC9kaXY+XFxuYDtcblxuICAgICAgaWYgKHF1ZXN0LnJld2FyZCkge1xuICAgICAgICBsaW5lICs9IGAgIDxkaXYgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+5Lu75Yqh5aWW5Yqx77yaYDtcbiAgICAgICAgaWYgKHF1ZXN0LnJld2FyZC5nb2xkKSB7XG4gICAgICAgICAgbGluZSArPSBgPGxhYmVsIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAyMHB4O1wiPumHkeW4ge+8miR7cXVlc3QucmV3YXJkLmdvbGR9PC9sYWJlbD5gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVzdC5yZXdhcmQuZXhwKSB7XG4gICAgICAgICAgbGluZSArPSBgPGxhYmVsIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAyMHB4O1wiPue7j+mqjO+8miR7cXVlc3QucmV3YXJkLmV4cH08L2xhYmVsPmA7XG4gICAgICAgIH1cbiAgICAgICAgbGluZSArPSBgICA8L2Rpdj5gO1xuICAgICAgfVxuXG4gICAgICBpZiAocXVlc3QudGFyZ2V0ICYmIHF1ZXN0LnRhcmdldC50eXBlID09IFwia2lsbFwiKSB7XG4gICAgICAgIGZvciAobGV0IGsgb2YgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICBsaW5lICs9IGA8ZGl2IHN0eWxlPVwibWFyZ2luOiAxMHB4O1wiPiR7ay5uYW1lfe+8miR7ay5jdXJyZW50fSAvICR7dC5uZWVkfTwvZGl2PmA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZSArPSBgICA8bGFiZWwgc3R5bGU9XCJtYXJnaW46IDEwcHg7XCI+57uZ5LqI5Lq677yaJHtxdWVzdC5mcm9tTWFwfSDnmoQgJHtxdWVzdC5mcm9tTmFtZX08L2xhYmVsPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDxsYWJlbCBzdHlsZT1cIm1hcmdpbjogMTBweDtcIj7kuqTku5jkurrvvJoke3F1ZXN0LnRvTWFwfSDnmoQgJHtxdWVzdC50b05hbWV9PC9sYWJlbD5cXG5gO1xuICAgICAgbGluZSArPSBcIjwvZGl2PlxcblwiXG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgIH0pO1xuXG4gICAgaWYgKHRhYmxlLmxlbmd0aCA8PSAwKSB7XG4gICAgICB0YWJsZSA9IFwiPGRpdj48bGFiZWw+5rKh5pyJ5bey5a6M5oiQ5Lu75YqhPC9sYWJlbD48L2Rpdj5cIjtcbiAgICB9XG5cbiAgICBxdWVzdFdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHF1ZXN0V2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmIChpZCkge1xuICAgICAgaWYgKHR5cGUgPT0gXCJyZW1vdmVcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUucmVtb3ZlKGlkKTtcbiAgICAgICAgd2luLm9wZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImxvYWRcIikge1xuICAgICAgICBHYW1lLkFyY2hpdmUubG9hZChpZCk7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19

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

  var win = Game.windows.register = Game.Window.create("registerWindow");

  win.html = "\n        <div style=\"position: fixed; height: 250px; width: 64px; left: 50px; top: 70px;\">\n          <label id=\"loading\">正在载入预览</label>\n          <br>\n          <canvas id=\"registerPreview\" width=\"64\" height=\"250\"></canvas>\n        </div>\n\n        <div style=\"overflow-y: scroll; height: 100%; position: fixed; width: 100%;\">\n          <div>\n            <label>\n            性别\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"sex\" class=\"\">\n              <option value=\"male\">男性</option>\n              <option value=\"female\">女性</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            皮肤\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"body\" class=\"\">\n              <option value=\"light\">粉白</option>\n              <option value=\"dark\">深色</option>\n              <option value=\"dark2\">更深</option>\n              <option value=\"tanned\">黄白</option>\n              <option value=\"tanned2\">黄灰</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            眼睛\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"eyes\" class=\"\">\n              <option value=\"blue\">蓝色</option>\n              <option value=\"brown\">棕色</option>\n              <option value=\"gray\">灰色</option>\n              <option value=\"green\">绿色</option>\n              <option value=\"orange\">橙色</option>\n              <option value=\"purple\">紫色</option>\n              <option value=\"red\">红色</option>\n              <option value=\"yellow\">黄色</option>\n            </select>\n          </div>\n\n          <div id=\"customMaleHair\">\n            <label>\n            头发\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"hair\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"bedhead\">Bedhead</option>\n              <option value=\"long\">Long</option>\n              <option value=\"longhawk\">Longhawk</option>\n              <option value=\"messy1\">messy1</option>\n              <option value=\"messy2\">messy2</option>\n              <option value=\"mohawk\">Mohawk</option>\n              <option value=\"page\">Page</option>\n              <option value=\"parted\">Parted</option>\n              <option value=\"plain\">Plain</option>\n              <option value=\"shorthawk\">Shorthawk</option>\n            </select>\n          </div>\n\n          <div id=\"customFemaleHair\" style=\"display: none;\">\n            <label>\n            头发\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"hair\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"bangs\">bangs</option>\n              <option value=\"bangslong\">bangslong</option>\n              <option value=\"bangslong2\">bangslong2</option>\n              <option value=\"bunches\">bunches</option>\n              <option value=\"loose\">loose</option>\n              <option value=\"pixie\">pixie</option>\n              <option value=\"ponytail\">ponytail</option>\n              <option value=\"ponytail2\">ponytail2</option>\n              <option value=\"princess\">princess</option>\n              <option value=\"shoulderl\">shoulderl</option>\n              <option value=\"shoulderr\">shoulderr</option>\n              <option value=\"swoop\">swoop</option>\n              <option value=\"unkempt\">unkempt</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            发色\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"haircolor\" class=\"\">\n              <option value=\"black\">Black</option>\n              <option value=\"blonde\">Blonde</option>\n              <option value=\"blonde2\">blonde2</option>\n              <option value=\"blue\">blue</option>\n              <option value=\"blue2\">blue2</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"brown2\">brown2</option>\n              <option value=\"brunette\">brunette</option>\n              <option value=\"brunette2\">brunette2</option>\n              <option value=\"dark-blonde\">dark-blonde</option>\n              <option value=\"gold\">gold</option>\n              <option value=\"gray\">gray</option>\n              <option value=\"gray2\">gray2</option>\n              <option value=\"green\">green</option>\n              <option value=\"green2\">green2</option>\n              <option value=\"light-blonde\">light-blonde</option>\n              <option value=\"light-blonde2\">light-blonde2</option>\n              <option value=\"pink\">pink</option>\n              <option value=\"pink2\">pink2</option>\n              <option value=\"purple\">purple</option>\n              <option value=\"raven\">raven</option>\n              <option value=\"raven2\">raven2</option>\n              <option value=\"redhead\">redhead</option>\n              <option value=\"redhead2\">redhead2</option>\n              <option value=\"ruby-red\">ruby-red</option>\n              <option value=\"white\">white</option>\n              <option value=\"white-blonde\">white-blonde</option>\n              <option value=\"white-blonde2\">white-blonde2</option>\n              <option value=\"white.centerYan\">white.centerYan</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            帽子\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"head\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"chainhat\">chainhat</option>\n              <option value=\"chain_hood\">chain_hood</option>\n              <option value=\"cloth_hood\">cloth_hood</option>\n              <option value=\"leather_cap\">leather_cap</option>\n              <option value=\"red\">red</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            上衣\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"shirts\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"maroon\">maroon</option>\n              <option value=\"teal\">teal</option>\n              <option value=\"white\">white</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            裤子\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"pants\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"magenta\">magenta</option>\n              <option value=\"red\">red</option>\n              <option value=\"teal\">teal</option>\n              <option value=\"white\">white</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            鞋子\n            </label>\n            <select onchange=\"SelectHero(event)\"  data-type=\"shoes\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"black\">black</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"maroon\">maroon</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            头盔\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorhelms\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"golden\">黄金</option>\n              <option value=\"metal\">白银</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            胸甲\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorchest\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"golden\">黄金</option>\n              <option value=\"metal\">白银</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            臂甲\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorarm\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"golden\">黄金</option>\n              <option value=\"metal\">白银</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            腿甲\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorlegs\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"golden\">黄金</option>\n              <option value=\"metal\">白银</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            足甲\n            </label>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorfeet\" class=\"\">\n              <option value=\"\">无</option>\n              <option value=\"golden\">黄金</option>\n              <option value=\"metal\">白银</option>\n            </select>\n          </div>\n\n          <hr>\n\n          <div>\n            <label>\n            信仰\n            </label>\n            <select onchange=\"\" class=\"\">\n              <option value=\"\">无信仰（没有加成）</option>\n              <option value=\"\">魔法之神（智力）</option>\n            </select>\n          </div>\n\n          <div>\n            <label>\n            职业\n            </label>\n            <select onchange=\"\" class=\"\">\n              <option value=\"\">剑士</option>\n              <option value=\"\">弓箭手</option>\n              <option value=\"\">魔法师</option>\n              <option value=\"\">牧师</option>\n              <option value=\"\">吟游诗人</option>\n              <option value=\"\">盗贼</option>\n              <option value=\"\">商人</option>\n            </select>\n          </div>\n\n          <div>\n            <input id=\"registerHeroName\" placeholder=\"名字\" type=\"text\">\n          </div>\n\n          <div style=\"padding-bottom: 20px; padding-top: 10px;\">\n            <button id=\"registerWindowSubmit\" class=\"brownButton\">完成</button>\n            <button id=\"registerWindowBack\" class=\"brownButton\">返回</button>\n          </div>\n\n        </div>\n\n\n  ";

  win.css = "\n\n    .registerWindow table, .registerWindow tbody, .registerWindow tr {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    #registerWindowSubmit, #registerWindowBack {\n      width: 100px;\n      height: 60px;\n    }\n\n    .registerWindow {\n      text-align: center;\n      background-image: url(\"image/main.jpeg\");\n    }\n\n    .registerWindow input {\n      width: 240px;\n      height: 40px;\n      -webkit-border-radius: 5px;\n      -moz-border-radius: 5px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 16px;\n      background-color: #d5ab63;\n      margin: 10px;\n    }\n\n    .registerWindow label {\n      font-size: 20px;\n      color: white;\n    }\n\n    .registerWindow select {\n      -webkit-appearance: none;\n      -moz-appearance: none;\n      appearance: none;\n      width: 200px;\n      height: 40px;\n      -webkit-border-radius: 5px;\n      -moz-border-radius: 5px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 16px;\n      background-color: #d5ab63;\n      margin: 10px;\n    }\n  ";

  var registerWindowSubmit = win.querySelector("#registerWindowSubmit");
  var registerWindowBack = win.querySelector("#registerWindowBack");

  registerWindowSubmit.addEventListener("click", function () {
    Game.register.submit();
  });

  registerWindowBack.addEventListener("click", function () {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dSZWdpc3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV2RSxLQUFHLENBQUMsSUFBSSwrbVVBK1FQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcsdWxDQWtETixDQUFDOztBQUVGLE1BQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RFLE1BQUksa0JBQWtCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVsRSxzQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUN6RCxRQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ3hCLENBQUMsQ0FBQzs7QUFFSCxvQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUN2RCxPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93UmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLnJlZ2lzdGVyID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwicmVnaXN0ZXJXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IGhlaWdodDogMjUwcHg7IHdpZHRoOiA2NHB4OyBsZWZ0OiA1MHB4OyB0b3A6IDcwcHg7XCI+XG4gICAgICAgICAgPGxhYmVsIGlkPVwibG9hZGluZ1wiPuato+WcqOi9veWFpemihOiniDwvbGFiZWw+XG4gICAgICAgICAgPGJyPlxuICAgICAgICAgIDxjYW52YXMgaWQ9XCJyZWdpc3RlclByZXZpZXdcIiB3aWR0aD1cIjY0XCIgaGVpZ2h0PVwiMjUwXCI+PC9jYW52YXM+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9XCJvdmVyZmxvdy15OiBzY3JvbGw7IGhlaWdodDogMTAwJTsgcG9zaXRpb246IGZpeGVkOyB3aWR0aDogMTAwJTtcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg5oCn5YirXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwic2V4XCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1hbGVcIj7nlLfmgKc8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImZlbWFsZVwiPuWls+aApzwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg55qu6IKkXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwiYm9keVwiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsaWdodFwiPueyieeZvTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGFya1wiPua3seiJsjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGFyazJcIj7mm7Tmt7E8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInRhbm5lZFwiPum7hOeZvTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidGFubmVkMlwiPum7hOeBsDwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg55y8552bXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwiZXllc1wiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJibHVlXCI+6JOd6ImyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJicm93blwiPuajleiJsjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JheVwiPueBsOiJsjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JlZW5cIj7nu7/oibI8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9yYW5nZVwiPuapmeiJsjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicHVycGxlXCI+57Sr6ImyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWRcIj7nuqLoibI8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInllbGxvd1wiPum7hOiJsjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGlkPVwiY3VzdG9tTWFsZUhhaXJcIj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIOWktOWPkVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9XCJTZWxlY3RIZXJvKGV2ZW50KVwiIGRhdGEtdHlwZT1cImhhaXJcIiBjbGFzcz1cIlwiPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+5pegPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJiZWRoZWFkXCI+QmVkaGVhZDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibG9uZ1wiPkxvbmc8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxvbmdoYXdrXCI+TG9uZ2hhd2s8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1lc3N5MVwiPm1lc3N5MTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWVzc3kyXCI+bWVzc3kyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb2hhd2tcIj5Nb2hhd2s8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBhZ2VcIj5QYWdlPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYXJ0ZWRcIj5QYXJ0ZWQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWluXCI+UGxhaW48L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNob3J0aGF3a1wiPlNob3J0aGF3azwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGlkPVwiY3VzdG9tRmVtYWxlSGFpclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIOWktOWPkVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9XCJTZWxlY3RIZXJvKGV2ZW50KVwiIGRhdGEtdHlwZT1cImhhaXJcIiBjbGFzcz1cIlwiPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+5pegPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJiYW5nc1wiPmJhbmdzPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJiYW5nc2xvbmdcIj5iYW5nc2xvbmc8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJhbmdzbG9uZzJcIj5iYW5nc2xvbmcyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJidW5jaGVzXCI+YnVuY2hlczwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibG9vc2VcIj5sb29zZTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGl4aWVcIj5waXhpZTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicG9ueXRhaWxcIj5wb255dGFpbDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicG9ueXRhaWwyXCI+cG9ueXRhaWwyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwcmluY2Vzc1wiPnByaW5jZXNzPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzaG91bGRlcmxcIj5zaG91bGRlcmw8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNob3VsZGVyclwiPnNob3VsZGVycjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic3dvb3BcIj5zd29vcDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidW5rZW1wdFwiPnVua2VtcHQ8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIOWPkeiJslxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9XCJTZWxlY3RIZXJvKGV2ZW50KVwiIGRhdGEtdHlwZT1cImhhaXJjb2xvclwiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJibGFja1wiPkJsYWNrPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJibG9uZGVcIj5CbG9uZGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJsb25kZTJcIj5ibG9uZGUyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJibHVlXCI+Ymx1ZTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmx1ZTJcIj5ibHVlMjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnJvd25cIj5icm93bjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnJvd24yXCI+YnJvd24yPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJicnVuZXR0ZVwiPmJydW5ldHRlPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJicnVuZXR0ZTJcIj5icnVuZXR0ZTI8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRhcmstYmxvbmRlXCI+ZGFyay1ibG9uZGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImdvbGRcIj5nb2xkPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJncmF5XCI+Z3JheTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JheTJcIj5ncmF5Mjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JlZW5cIj5ncmVlbjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JlZW4yXCI+Z3JlZW4yPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsaWdodC1ibG9uZGVcIj5saWdodC1ibG9uZGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpZ2h0LWJsb25kZTJcIj5saWdodC1ibG9uZGUyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwaW5rXCI+cGluazwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGluazJcIj5waW5rMjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicHVycGxlXCI+cHVycGxlPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyYXZlblwiPnJhdmVuPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyYXZlbjJcIj5yYXZlbjI8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlZGhlYWRcIj5yZWRoZWFkPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWRoZWFkMlwiPnJlZGhlYWQyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJydWJ5LXJlZFwiPnJ1YnktcmVkPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aGl0ZVwiPndoaXRlPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aGl0ZS1ibG9uZGVcIj53aGl0ZS1ibG9uZGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIndoaXRlLWJsb25kZTJcIj53aGl0ZS1ibG9uZGUyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aGl0ZS5jZW50ZXJZYW5cIj53aGl0ZS5jZW50ZXJZYW48L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIOW4veWtkFxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9XCJTZWxlY3RIZXJvKGV2ZW50KVwiIGRhdGEtdHlwZT1cImhlYWRcIiBjbGFzcz1cIlwiPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+5pegPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJjaGFpbmhhdFwiPmNoYWluaGF0PC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJjaGFpbl9ob29kXCI+Y2hhaW5faG9vZDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY2xvdGhfaG9vZFwiPmNsb3RoX2hvb2Q8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxlYXRoZXJfY2FwXCI+bGVhdGhlcl9jYXA8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlZFwiPnJlZDwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg5LiK6KGjXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwic2hpcnRzXCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnJvd25cIj5icm93bjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWFyb29uXCI+bWFyb29uPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ0ZWFsXCI+dGVhbDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2hpdGVcIj53aGl0ZTwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6KOk5a2QXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwicGFudHNcIiBjbGFzcz1cIlwiPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+5pegPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtYWdlbnRhXCI+bWFnZW50YTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVkXCI+cmVkPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ0ZWFsXCI+dGVhbDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2hpdGVcIj53aGl0ZTwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6Z6L5a2QXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgIGRhdGEtdHlwZT1cInNob2VzXCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmxhY2tcIj5ibGFjazwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnJvd25cIj5icm93bjwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWFyb29uXCI+bWFyb29uPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICDlpLTnm5RcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8c2VsZWN0IG9uY2hhbmdlPVwiU2VsZWN0SGVybyhldmVudClcIiBkYXRhLXR5cGU9XCJhcm1vcmhlbG1zXCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29sZGVuXCI+6buE6YeRPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtZXRhbFwiPueZvemTtjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6IO455SyXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwiYXJtb3JjaGVzdFwiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7ml6A8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImdvbGRlblwiPum7hOmHkTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWV0YWxcIj7nmb3pk7Y8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIOiHgueUslxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9XCJTZWxlY3RIZXJvKGV2ZW50KVwiIGRhdGEtdHlwZT1cImFybW9yYXJtXCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29sZGVuXCI+6buE6YeRPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtZXRhbFwiPueZvemTtjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6IW/55SyXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwiYXJtb3JsZWdzXCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29sZGVuXCI+6buE6YeRPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtZXRhbFwiPueZvemTtjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6Laz55SyXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlNlbGVjdEhlcm8oZXZlbnQpXCIgZGF0YS10eXBlPVwiYXJtb3JmZWV0XCIgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuaXoDwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29sZGVuXCI+6buE6YeRPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtZXRhbFwiPueZvemTtjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8aHI+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg5L+h5LuwXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlwiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7ml6Dkv6Hku7DvvIjmsqHmnInliqDmiJDvvIk8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPumtlOazleS5i+elnu+8iOaZuuWKm++8iTwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAg6IGM5LiaXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBvbmNoYW5nZT1cIlwiIGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7liZHlo6s8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuW8k+eureaJizwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+6a2U5rOV5biIPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7niafluIg8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuWQn+a4uOivl+S6ujwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+55uX6LS8PC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7llYbkuro8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInJlZ2lzdGVySGVyb05hbWVcIiBwbGFjZWhvbGRlcj1cIuWQjeWtl1wiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZy1ib3R0b206IDIwcHg7IHBhZGRpbmctdG9wOiAxMHB4O1wiPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZ2lzdGVyV2luZG93U3VibWl0XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWujOaIkDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZ2lzdGVyV2luZG93QmFja1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ov5Tlm548L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cblxuXG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcblxuICAgIC5yZWdpc3RlcldpbmRvdyB0YWJsZSwgLnJlZ2lzdGVyV2luZG93IHRib2R5LCAucmVnaXN0ZXJXaW5kb3cgdHIge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgICNyZWdpc3RlcldpbmRvd1N1Ym1pdCwgI3JlZ2lzdGVyV2luZG93QmFjayB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgfVxuXG4gICAgLnJlZ2lzdGVyV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImltYWdlL21haW4uanBlZ1wiKTtcbiAgICB9XG5cbiAgICAucmVnaXN0ZXJXaW5kb3cgaW5wdXQge1xuICAgICAgd2lkdGg6IDI0MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgICAtbW96LWJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNkNWFiNjM7XG4gICAgICBtYXJnaW46IDEwcHg7XG4gICAgfVxuXG4gICAgLnJlZ2lzdGVyV2luZG93IGxhYmVsIHtcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG5cbiAgICAucmVnaXN0ZXJXaW5kb3cgc2VsZWN0IHtcbiAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICB3aWR0aDogMjAwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgIC1tb3otYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Q1YWI2MztcbiAgICAgIG1hcmdpbjogMTBweDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHJlZ2lzdGVyV2luZG93U3VibWl0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjcmVnaXN0ZXJXaW5kb3dTdWJtaXRcIik7XG4gIGxldCByZWdpc3RlcldpbmRvd0JhY2sgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNyZWdpc3RlcldpbmRvd0JhY2tcIik7XG5cbiAgcmVnaXN0ZXJXaW5kb3dTdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBHYW1lLnJlZ2lzdGVyLnN1Ym1pdCgpO1xuICB9KTtcblxuICByZWdpc3RlcldpbmRvd0JhY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuXG59KSgpO1xuIl19

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

  var win = Game.windows.sell = Game.Window.create("sellWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"sellWindowItemBar\">\n\n      <button id=\"sellWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"sellWindowBuy\" class=\"brownButton\">买入</button>\n\n      <button id=\"sellWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"sellWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"sellWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"sellWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"sellWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"sellWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"sellWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"sellWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"sellWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n    #sellWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #sellWindowClose {\n      float: right;\n    }\n\n    #sellWindowStatus {\n      float: right;\n    }\n\n    .sellWindow table {\n      width: 100%;\n    }\n\n    .sellWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .sellWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #sellWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var sellWindowClose = win.querySelector("button#sellWindowClose");
  var sellWindowBuy = win.querySelector("button#sellWindowBuy");

  var sellWindowAll = win.querySelector("button#sellWindowAll");
  var sellWindowWeapon = win.querySelector("button#sellWindowWeapon");
  var sellWindowArmor = win.querySelector("button#sellWindowArmor");
  var sellWindowPotion = win.querySelector("button#sellWindowPotion");
  var sellWindowMaterial = win.querySelector("button#sellWindowMaterial");
  var sellWindowBook = win.querySelector("button#sellWindowBook");
  var sellWindowMisc = win.querySelector("button#sellWindowMisc");

  var sellWindowGold = win.querySelector("span#sellWindowGold");
  var sellWindowTable = win.querySelector("#sellWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  sellWindowClose.addEventListener("click", function () {
    win.hide();
  });

  sellWindowBuy.addEventListener("click", function () {
    win.hide();
    Game.windows.buy.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.buy.open(lastItems);
    }, 20);
  });

  sellWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  sellWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  sellWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  sellWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  sellWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  sellWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  sellWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    sellWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    sellWindowAll.style.color = defaultColor;
    sellWindowWeapon.style.color = defaultColor;
    sellWindowArmor.style.color = defaultColor;
    sellWindowPotion.style.color = defaultColor;
    sellWindowMaterial.style.color = defaultColor;
    sellWindowBook.style.color = defaultColor;
    sellWindowMisc.style.color = defaultColor;

    if (filter == null) {
      sellWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      sellWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      sellWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      sellWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      sellWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      sellWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      sellWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(Game.hero.data.items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 0.8) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">卖出</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    sellWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = sellWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = sellWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword";
      } else if (filter.match(/sword/)) {
        filter = "head";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword";
      } else if (filter.match(/potion/)) {
        filter = "head";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book";
      }
      win.open(lastItems, filter);
    }
  });

  sellWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];
      var itemCount = Game.hero.data.items[itemId];

      if (lastItems.hasOwnProperty(itemId)) {
        lastItems[itemId]++;
      } else {
        lastItems[itemId] = 1;
      }

      if (itemCount == 1) {
        Game.hero.data.bar.forEach(function (element, index, array) {
          if (element && element.id == itemId) {
            array[index] = null;
          }
        });
        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == itemId) {
            Game.hero.data.equipment[key] = null;
          }
        });
        delete Game.hero.data.items[itemId];
      } else {
        Game.hero.data.items[itemId]--;
      }

      Game.hero.data.gold += Math.ceil(item.data.value * 0.8);
      Game.windows["interface"].refresh();
      win.open(lastItems, lastFilter);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTZWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSwyeENBa0NQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcsd3NCQXlDTixDQUFDOztBQUVGLE1BQUksZUFBZSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRSxNQUFJLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRTlELE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM5RCxNQUFJLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRSxNQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksY0FBYyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEUsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzlELE1B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R0FBRyxFQUFFO0FBQzVELGNBQUksT0FBTyxJQUFJLE1BQU0sRUFBRTtBQUNyQixnQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztXQUN0QztTQUNGLENBQUMsQ0FBQztBQUNILGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3JDLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztPQUNoQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsU0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDakM7R0FDRixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93U2VsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3Muc2VsbCA9IEdhbWUuV2luZG93LmNyZWF0ZShcInNlbGxXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgPGRpdiBpZD1cInNlbGxXaW5kb3dJdGVtQmFyXCI+XG5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6ZetPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd0J1eVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7kubDlhaU8L2J1dHRvbj5cblxuICAgICAgPGJ1dHRvbiBpZD1cInNlbGxXaW5kb3dBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWo6YOoPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd1dlYXBvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mrablmag8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93QXJtb3JcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5oqk55SyPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd1BvdGlvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7oja/msLQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93TWF0ZXJpYWxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5p2Q5paZPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd0Jvb2tcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Lmm57GNPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd01pc2NcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YW25LuWPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBpZD1cInNlbGxXaW5kb3dHb2xkXCI+PC9zcGFuPlxuXG4gICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93OiBhdXRvOyBoZWlnaHQ6IDMwMHB4O1wiPlxuICAgICAgPHRhYmxlIGJvcmRlcj1cIjFcIiBjZWxsc3BhY2luZz1cIjBcIiBjZWxscGFkZGluZz1cIjBcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA0MHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMTIwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMzBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNjBweDtcIj48L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keSBpZD1cInNlbGxXaW5kb3dUYWJsZVwiPjwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgICNzZWxsV2luZG93SXRlbUJhciA+IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjc2VsbFdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAjc2VsbFdpbmRvd1N0YXR1cyB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuXG4gICAgLnNlbGxXaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgLnNlbGxXaW5kb3cgdGFibGUgaW1nIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIC5zZWxsV2luZG93IHRhYmxlIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG5cbiAgICAjc2VsbFdpbmRvd0dvbGQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgICAgYm90dG9tOiAzMHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgIH1cbiAgYDtcblxuICBsZXQgc2VsbFdpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2VsbFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgc2VsbFdpbmRvd0J1eSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dCdXlcIik7XG5cbiAgbGV0IHNlbGxXaW5kb3dBbGwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93QWxsXCIpO1xuICBsZXQgc2VsbFdpbmRvd1dlYXBvbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dXZWFwb25cIik7XG4gIGxldCBzZWxsV2luZG93QXJtb3IgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93QXJtb3JcIik7XG4gIGxldCBzZWxsV2luZG93UG90aW9uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2VsbFdpbmRvd1BvdGlvblwiKTtcbiAgbGV0IHNlbGxXaW5kb3dNYXRlcmlhbCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dNYXRlcmlhbFwiKTtcbiAgbGV0IHNlbGxXaW5kb3dCb29rID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2VsbFdpbmRvd0Jvb2tcIik7XG4gIGxldCBzZWxsV2luZG93TWlzYyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dNaXNjXCIpO1xuXG4gIGxldCBzZWxsV2luZG93R29sZCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwic3BhbiNzZWxsV2luZG93R29sZFwiKTtcbiAgbGV0IHNlbGxXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NlbGxXaW5kb3dUYWJsZVwiKTtcblxuICBsZXQgbGFzdEl0ZW1zID0gbnVsbDtcbiAgbGV0IGxhc3RGaWx0ZXIgPSBudWxsO1xuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIHNlbGxXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHdpbi5oaWRlKCk7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dCdXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5idXkub3BlbihsYXN0SXRlbXMpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInRhYlwiXSwgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICAgIEdhbWUud2luZG93cy5idXkub3BlbihsYXN0SXRlbXMpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgc2VsbFdpbmRvd0FsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBudWxsKTtcbiAgfSk7XG5cbiAgc2VsbFdpbmRvd1dlYXBvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcInN3b3JkfHNwZWFyfGJvd1wiKTtcbiAgfSk7XG5cbiAgc2VsbFdpbmRvd0FybW9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwiaGVhZHxib2R5fGZlZXRcIik7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dQb3Rpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJwb3Rpb25cIik7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dNYXRlcmlhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcIm1hdGVyaWFsXCIpO1xuICB9KTtcblxuICBzZWxsV2luZG93Qm9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcImJvb2t8c2Nyb2xsfGxldHRlclwiKTtcbiAgfSk7XG5cbiAgc2VsbFdpbmRvd01pc2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJtaXNjXCIpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwib3BlblwiLCBmdW5jdGlvbiAoaXRlbXMsIGZpbHRlciwgc2VsZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxlY3QgPSAtMTtcbiAgICB9XG5cbiAgICBsYXN0SXRlbXMgPSBpdGVtcztcbiAgICBsYXN0RmlsdGVyID0gZmlsdGVyO1xuICAgIGxhc3RTZWxlY3QgPSBzZWxlY3Q7XG5cbiAgICBzZWxsV2luZG93R29sZC50ZXh0Q29udGVudCA9IEdhbWUuaGVyby5kYXRhLmdvbGQgKyBcIkdcIjtcblxuICAgIGxldCBkZWZhdWx0Q29sb3IgPSBcIndoaXRlXCI7XG4gICAgbGV0IGFjdGl2ZUNvbG9yID0gXCJ5ZWxsb3dcIjtcblxuICAgIHNlbGxXaW5kb3dBbGwuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd1dlYXBvbi5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBzZWxsV2luZG93QXJtb3Iuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd1BvdGlvbi5zdHlsZS5jb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgICBzZWxsV2luZG93TWF0ZXJpYWwuc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd0Jvb2suc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd01pc2Muc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG5cbiAgICBpZiAoZmlsdGVyID09IG51bGwpIHtcbiAgICAgIHNlbGxXaW5kb3dBbGwuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgc2VsbFdpbmRvd1dlYXBvbi5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgIHNlbGxXaW5kb3dBcm1vci5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgc2VsbFdpbmRvd1BvdGlvbi5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICBzZWxsV2luZG93TWF0ZXJpYWwuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICBzZWxsV2luZG93Qm9vay5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9taXNjLykpIHtcbiAgICAgIHNlbGxXaW5kb3dNaXNjLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIFNwcml0ZS5lYWNoKEdhbWUuaGVyby5kYXRhLml0ZW1zLCBmdW5jdGlvbiAoaXRlbUNvdW50LCBpdGVtSWQpIHtcbiAgICAgIGxldCBpdGVtID0gR2FtZS5pdGVtc1tpdGVtSWRdO1xuXG4gICAgICBpZiAoZmlsdGVyICYmIGZpbHRlci5pbmRleE9mKGl0ZW0uZGF0YS50eXBlKSA9PSAtMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgbGluZSA9IFwiXCI7XG5cbiAgICAgIGlmIChzZWxlY3QgPT0gaW5kZXgpIHtcbiAgICAgICAgbGluZSArPSBgPHRyIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XCI+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYDx0cj5cXG5gO1xuICAgICAgfVxuXG5cbiAgICAgIGlmIChpdGVtLmljb24pIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQ+PGltZyBhbHQ9XCJcIiBzcmM9XCIke2l0ZW0uaWNvbi5zcmN9XCI+PC90ZD5cXG5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZSArPSBgICA8dGQ+IDwvdGQ+XFxuYDtcbiAgICAgIH1cbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7aXRlbS5kYXRhLm5hbWV9PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHtNYXRoLmNlaWwoaXRlbS5kYXRhLnZhbHVlICogMC44KX1HPC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHtpdGVtQ291bnR9PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+JHtpdGVtLmRhdGEuZGVzY3JpcHRpb259PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+PGJ1dHRvbiBkYXRhLWlkPVwiJHtpdGVtSWR9XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNluWHujwvYnV0dG9uPjwvdGQ+XFxuYDtcblxuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIHNlbGxXaW5kb3dUYWJsZS5pbm5lckhUTUwgPSB0YWJsZTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBzZWxsV2luZG93VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICBpZiAobGFzdFNlbGVjdCA+PSAwICYmIGxhc3RTZWxlY3QgPCBidXR0b25zLmxlbmd0aCkge1xuICAgICAgYnV0dG9uc1tsYXN0U2VsZWN0XS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJ1cFwiLCBcImRvd25cIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBsZXQgY291bnQgPSBzZWxsV2luZG93VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKS5sZW5ndGg7XG4gICAgaWYgKGNvdW50IDw9IDApIHJldHVybjtcblxuICAgIGlmIChsYXN0U2VsZWN0ID09IC0xKSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlciwgMCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0IC0gMTtcbiAgICAgICAgaWYgKHNlbGVjdCA8IDApIHtcbiAgICAgICAgICBzZWxlY3QgPSBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBsYXN0RmlsdGVyLCBzZWxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImxlZnRcIiwgXCJyaWdodFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkgPT0gXCJyaWdodFwiKSB7XG4gICAgICBsZXQgZmlsdGVyID0gbGFzdEZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICBmaWx0ZXIgPSBcInN3b3JkXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvc3dvcmQvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImhlYWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJwb3Rpb25cIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgICBmaWx0ZXIgPSBcIm1hdGVyaWFsXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWF0ZXJpYWwvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImJvb2tcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtaXNjXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICAgIGZpbHRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICB3aW4ub3BlbihsYXN0SXRlbXMsIGZpbHRlcik7XG4gICAgfSBlbHNlIGlmIChrZXkgPT0gXCJsZWZ0XCIpIHtcbiAgICAgIGxldCBmaWx0ZXIgPSBsYXN0RmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWlzY1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgICAgZmlsdGVyID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9oZWFkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJzd29yZFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3BvdGlvbi8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwiaGVhZFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJwb3Rpb25cIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9ib29rLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtYXRlcmlhbFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImJvb2tcIjtcbiAgICAgIH1cbiAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgZmlsdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGl0ZW1JZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgIGlmIChpdGVtSWQgJiYgR2FtZS5oZXJvLmRhdGEuaXRlbXMuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgbGV0IGl0ZW0gPSBHYW1lLml0ZW1zW2l0ZW1JZF07XG4gICAgICBsZXQgaXRlbUNvdW50ID0gR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgaWYgKGxhc3RJdGVtcy5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICAgIGxhc3RJdGVtc1tpdGVtSWRdKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0SXRlbXNbaXRlbUlkXSA9IDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtQ291bnQgPT0gMSkge1xuICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXIuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5pZCA9PSBpdGVtSWQpIHtcbiAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgU3ByaXRlLmVhY2goR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LCBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQgPT0gaXRlbUlkKSB7XG4gICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5lcXVpcG1lbnRba2V5XSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdLS07XG4gICAgICB9XG5cbiAgICAgIEdhbWUuaGVyby5kYXRhLmdvbGQgKz0gTWF0aC5jZWlsKGl0ZW0uZGF0YS52YWx1ZSAqIDAuOCk7XG4gICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlcik7XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19

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

  var win = Game.windows.setting = Game.Window.create("settingWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"settingWindowClose\" class=\"brownButton\">关闭</button>\n\n      <div id=\"settingWindowRendererType\"></div>\n\n      <div id=\"settingWindowBox\">\n        <button id=\"settingWindowFullscreen\" class=\"brownButton\">全屏</button>\n        <button id=\"settingWindowScale\" class=\"brownButton\">缩放</button>\n        <button id=\"settingWindowShortcut\" class=\"brownButton\">清除快捷栏</button>\n        <button id=\"settingWindowShortcutAll\" class=\"brownButton\">清除全部快捷栏</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    #settingWindowBox {\n      width: 100%;\n      height: 360px;\n    }\n\n    #settingWindowBox button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      display: block;\n    }\n\n    #settingWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      float: right;\n    }\n  ";

  var settingWindowShortcut = win.querySelector("#settingWindowShortcut");
  var settingWindowShortcutAll = win.querySelector("#settingWindowShortcutAll");

  var settingWindowClose = win.querySelector("#settingWindowClose");
  var settingWindowScale = win.querySelector("#settingWindowScale");

  var settingWindowFullscreen = win.querySelector("#settingWindowFullscreen");
  var settingWindowRendererType = win.querySelector("#settingWindowRendererType");

  settingWindowShortcut.addEventListener("click", function (event) {
    Game.choice({ 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 }, function (choice) {
      if (Number.isFinite(choice)) {
        Game.hero.data.bar[choice] = null;
        Game.windows["interface"].refresh();
      }
    });
  });

  settingWindowShortcutAll.addEventListener("click", function (event) {
    Game.confirm("确定要删除所有快捷栏图表吗？", function () {
      for (var i = 0; i < 8; i++) {
        Game.hero.data.bar[i] = null;
      }
      Game.windows["interface"].refresh();
    });
  });

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    win.show();
  });

  win.whenUp(["esc"], function (key) {
    settingWindowClose.click();
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  settingWindowFullscreen.addEventListener("click", function (event) {
    toggleFullScreen();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTZXR0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxxakJBYVAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRywrVUFtQk4sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RSxNQUFJLHdCQUF3QixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFOUUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbEUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWxFLE1BQUksdUJBQXVCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzVFLE1BQUkseUJBQXlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUVoRix1QkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDL0QsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxF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LENBQUM7T0FDaEMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLG9CQUFvQixFQUFFLENBQUM7T0FDakM7S0FDRjtHQUNGOztBQUVELHlCQUF1QixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNqRSxvQkFBZ0IsRUFBRSxDQUFDO0dBQ3BCLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dTZXR0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zZXR0aW5nID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwic2V0dGluZ1dpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGJ1dHRvbiBpZD1cInNldHRpbmdXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cblxuICAgICAgPGRpdiBpZD1cInNldHRpbmdXaW5kb3dSZW5kZXJlclR5cGVcIj48L2Rpdj5cblxuICAgICAgPGRpdiBpZD1cInNldHRpbmdXaW5kb3dCb3hcIj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInNldHRpbmdXaW5kb3dGdWxsc2NyZWVuXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFqOWxjzwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic2V0dGluZ1dpbmRvd1NjYWxlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPue8qeaUvjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic2V0dGluZ1dpbmRvd1Nob3J0Y3V0XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPua4hemZpOW/q+aNt+agjzwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic2V0dGluZ1dpbmRvd1Nob3J0Y3V0QWxsXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPua4hemZpOWFqOmDqOW/q+aNt+agjzwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAjc2V0dGluZ1dpbmRvd0JveCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMzYwcHg7XG4gICAgfVxuXG4gICAgI3NldHRpbmdXaW5kb3dCb3ggYnV0dG9uIHtcbiAgICAgIHdpZHRoOiAxMjBweDtcbiAgICAgIGhlaWdodDogNjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cblxuICAgICNzZXR0aW5nV2luZG93Q2xvc2Uge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuICBgO1xuXG4gIGxldCBzZXR0aW5nV2luZG93U2hvcnRjdXQgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nV2luZG93U2hvcnRjdXRcIik7XG4gIGxldCBzZXR0aW5nV2luZG93U2hvcnRjdXRBbGwgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nV2luZG93U2hvcnRjdXRBbGxcIik7XG5cbiAgbGV0IHNldHRpbmdXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IHNldHRpbmdXaW5kb3dTY2FsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dTY2FsZVwiKTtcblxuICBsZXQgc2V0dGluZ1dpbmRvd0Z1bGxzY3JlZW4gPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nV2luZG93RnVsbHNjcmVlblwiKTtcbiAgbGV0IHNldHRpbmdXaW5kb3dSZW5kZXJlclR5cGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nV2luZG93UmVuZGVyZXJUeXBlXCIpO1xuXG4gIHNldHRpbmdXaW5kb3dTaG9ydGN1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgR2FtZS5jaG9pY2UoezE6MCwgMjoxLCAzOjIsIDQ6MywgNTo0LCA2OjUsIDc6NiwgODo3fSwgZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjaG9pY2UpKSB7XG4gICAgICAgIEdhbWUuaGVyby5kYXRhLmJhcltjaG9pY2VdID0gbnVsbDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgc2V0dGluZ1dpbmRvd1Nob3J0Y3V0QWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLmNvbmZpcm0oXCLnoa7lrpropoHliKDpmaTmiYDmnInlv6vmjbfmoI/lm77ooajlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuYmFyW2ldID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgIH0pO1xuICB9KTtcblxuICB3aW4ub24oXCJiZWZvcmVTaG93XCIsIGZ1bmN0aW9uICgpIHtcbiAgICBzZXR0aW5nV2luZG93UmVuZGVyZXJUeXBlLnRleHRDb250ZW50ID0gR2FtZS5zdGFnZS5yZW5kZXJlclR5cGU7XG4gIH0pO1xuXG4gIHNldHRpbmdXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgc2V0dGluZ1dpbmRvd1NjYWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLmNvbmZpZy5zY2FsZSA9ICFHYW1lLmNvbmZpZy5zY2FsZTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuXG4gIHdpbi53aGVuVXAoW1wiZXNjXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgc2V0dGluZ1dpbmRvd0Nsb3NlLmNsaWNrKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUZ1bGxTY3JlZW4gKCkge1xuICAgIGlmICghZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgJiYgICAgLy8gYWx0ZXJuYXRpdmUgc3RhbmRhcmQgbWV0aG9kXG4gICAgICAgICFkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCAmJlxuICAgICAgICAhZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgJiZcbiAgICAgICAgIWRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnRcbiAgICApIHsgIC8vIGN1cnJlbnQgd29ya2luZyBtZXRob2RzXG4gICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oRWxlbWVudC5BTExPV19LRVlCT0FSRF9JTlBVVCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0dGluZ1dpbmRvd0Z1bGxzY3JlZW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRvZ2dsZUZ1bGxTY3JlZW4oKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  var win = Game.windows.skill = Game.Window.create("skillWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"skillWindowItemBar\">\n        <button id=\"skillWindowClose\" class=\"brownButton\">关闭</button>\n      </div>\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"skillWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    .skillWindow table {\n      width: 100%;\n    }\n\n    .skillWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .skillWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #skillWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #skillWindowClose {\n      float: right;\n    }\n  ";

  var skillWindowClose = win.querySelector("button#skillWindowClose");
  var skillWindowTable = win.querySelector("#skillWindowTable");

  var lastSelect = -1;

  skillWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("open", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    var index = 0;
    var table = "";
    Game.hero.data.skills.forEach(function (skillId) {
      var skill = Game.skills[skillId];

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      line += "  <td><img alt=\"\" src=\"" + skill.icon.src + "\"></td>\n";
      line += "  <td>" + skill.data.name + "</td>\n";
      line += "  <td>" + skill.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + skillId + "\" class=\"brownButton skillWindowManage\">管理</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    skillWindowTable.innerHTML = table;
    Game.windows.skill.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = win.querySelectorAll(".skillWindowManage");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = win.querySelectorAll(".skillWindowManage").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  skillWindowTable.addEventListener("click", function (event) {
    var skillId = event.target.getAttribute("data-id");
    var index = Game.hero.data.skills.indexOf(skillId);
    if (skillId && Game.skills.hasOwnProperty(skillId) && index != -1) {
      (function () {

        var skill = Game.skills[skillId];

        var options = {};

        options["快捷栏"] = "shortcut";
        options["遗忘"] = "remove";
        if (skill.data.next) {
          options["升级"] = "levelup";
        }

        Game.choice(options, function (choice) {
          switch (choice) {
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }, function (choice) {
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: skillId,
                    type: "skill"
                  };
                  Game.windows["interface"].refresh();
                }
              });
              break;
            case "levelup":
              if (skill.data.next) {
                var cannot = [];
                if (Game.hero.data.gold < skill.data.next.gold) {
                  cannot.push("金币不足，需要金币" + skill.data.next.gold + "，当前您有金币" + Game.hero.data.gold);
                }
                if (Game.hero.data.exp < skill.data.next.exp) {
                  cannot.push("经验不足，需要经验" + skill.data.next.exp + "，当前您有经验" + Game.hero.data.exp);
                }
                if (cannot.length) {
                  Game.dialogue(cannot);
                  return;
                }
                Game.confirm("确定要升级这个技能吗？共需要金币" + skill.data.next.gold + "，经验" + skill.data.next.exp, function () {
                  var nextId = skill.data.next.id;
                  Game.hero.data.skills.splice(index, 1);
                  Game.hero.data.skills.push(nextId);
                  Game.hero.data.gold -= skill.data.next.gold;
                  Game.hero.data.exp -= skill.data.next.exp;
                  Game.windows.loading.begin();
                  Game.Skill.load(nextId).then(function (skillObj) {
                    Game.windows.loading.end();
                    win.open();
                  });
                });
              }
              break;
            case "remove":
              Game.confirm("真的要遗忘 " + skill.data.name + " 技能吗？", function () {
                Game.hero.data.bar.forEach(function (element, index, array) {
                  if (element && element.id == skillId) {
                    array[index] = null;
                  }
                });
                Game.hero.data.skills.splice(index, 1);
                Game.windows["interface"].refresh();
                win.open();
              });
              break;
          }
        });
      })();
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTa2lsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakUsS0FBRyxDQUFDLElBQUksNGhCQWlCUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLDRmQTZCTixDQUFDOztBQUVGLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BFLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxNQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsa0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzFELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFDakMsY0FBVSxDQUFDLFlBQVk7QUFDckIsU0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTs7QUFFbkMsUUFBSSxPQUFPLE1BQU0sSUFBSSxXQUFXLEVBQUU7QUFDaEMsWUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2I7O0FBRUQsY0FBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFcEIsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FB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QyxDQUFDO0FBQ3ZDLG9CQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsbUJBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztlQUNaLENBQUMsQ0FBQztBQUNILG9CQUFNO0FBQUEsV0FDVDtTQUNGLENBQUMsQ0FBQzs7S0FFSjtHQUNGLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dTa2lsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3Muc2tpbGwgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJza2lsbFdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGRpdiBpZD1cInNraWxsV2luZG93SXRlbUJhclwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwic2tpbGxXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHRhYmxlIGJvcmRlcj1cIjFcIiBjZWxsc3BhY2luZz1cIjBcIiBjZWxscGFkZGluZz1cIjBcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA0MHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMTIwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDYwcHg7XCI+PC90ZD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHkgaWQ9XCJza2lsbFdpbmRvd1RhYmxlXCI+PC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAuc2tpbGxXaW5kb3cgdGFibGUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgLnNraWxsV2luZG93IHRhYmxlIGltZyB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAuc2tpbGxXaW5kb3cgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgICNza2lsbFdpbmRvd0l0ZW1CYXIgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICAgICAgbWFyZ2luLXRvcDogMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgICNza2lsbFdpbmRvd0Nsb3NlIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHNraWxsV2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNza2lsbFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgc2tpbGxXaW5kb3dUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NraWxsV2luZG93VGFibGVcIik7XG5cbiAgbGV0IGxhc3RTZWxlY3QgPSAtMTtcblxuICBza2lsbFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJvcGVuXCIsIGZ1bmN0aW9uIChzZWxlY3QpIHtcblxuICAgIGlmICh0eXBlb2Ygc2VsZWN0ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHNlbGVjdCA9IC0xO1xuICAgIH1cblxuICAgIGxhc3RTZWxlY3QgPSBzZWxlY3Q7XG5cbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCB0YWJsZSA9IFwiXCI7XG4gICAgR2FtZS5oZXJvLmRhdGEuc2tpbGxzLmZvckVhY2goZnVuY3Rpb24gKHNraWxsSWQpIHtcbiAgICAgIGxldCBza2lsbCA9IEdhbWUuc2tpbGxzW3NraWxsSWRdO1xuXG4gICAgICBsZXQgbGluZSA9IFwiXCI7XG5cbiAgICAgIGlmIChzZWxlY3QgPT0gaW5kZXgpIHtcbiAgICAgICAgbGluZSArPSBgPHRyIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XCI+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYDx0cj5cXG5gO1xuICAgICAgfVxuXG4gICAgICBsaW5lICs9IGAgIDx0ZD48aW1nIGFsdD1cIlwiIHNyYz1cIiR7c2tpbGwuaWNvbi5zcmN9XCI+PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+JHtza2lsbC5kYXRhLm5hbWV9PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBgICA8dGQ+JHtza2lsbC5kYXRhLmRlc2NyaXB0aW9ufTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPjxidXR0b24gZGF0YS1pZD1cIiR7c2tpbGxJZH1cIiBjbGFzcz1cImJyb3duQnV0dG9uIHNraWxsV2luZG93TWFuYWdlXCI+566h55CGPC9idXR0b24+PC90ZD5cXG5gO1xuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIHNraWxsV2luZG93VGFibGUuaW5uZXJIVE1MID0gdGFibGU7XG4gICAgR2FtZS53aW5kb3dzLnNraWxsLnNob3coKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlbnRlclwiXSwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBidXR0b25zID0gd2luLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2tpbGxXaW5kb3dNYW5hZ2VcIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gd2luLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2tpbGxXaW5kb3dNYW5hZ2VcIikubGVuZ3RoO1xuXG4gICAgaWYgKGxhc3RTZWxlY3QgPT0gLTEpIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgd2luLm9wZW4oMCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgd2luLm9wZW4oY291bnQgLSAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCArIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPj0gY291bnQpIHtcbiAgICAgICAgICBzZWxlY3QgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKHNlbGVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgLSAxO1xuICAgICAgICBpZiAoc2VsZWN0IDwgMCkge1xuICAgICAgICAgIHNlbGVjdCA9IGNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihzZWxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgc2tpbGxXaW5kb3dUYWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IHNraWxsSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICBsZXQgaW5kZXggPSBHYW1lLmhlcm8uZGF0YS5za2lsbHMuaW5kZXhPZihza2lsbElkKTtcbiAgICBpZiAoc2tpbGxJZCAmJiBHYW1lLnNraWxscy5oYXNPd25Qcm9wZXJ0eShza2lsbElkKSAmJiBpbmRleCAhPSAtMSkge1xuXG4gICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tza2lsbElkXTtcblxuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgb3B0aW9uc1tcIuW/q+aNt+agj1wiXSA9IFwic2hvcnRjdXRcIjtcbiAgICAgIG9wdGlvbnNbXCLpgZflv5hcIl0gPSBcInJlbW92ZVwiO1xuICAgICAgaWYgKHNraWxsLmRhdGEubmV4dCkge1xuICAgICAgICBvcHRpb25zW1wi5Y2H57qnXCJdID0gXCJsZXZlbHVwXCI7XG4gICAgICB9XG5cbiAgICAgIEdhbWUuY2hvaWNlKG9wdGlvbnMsIGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgc3dpdGNoKGNob2ljZSkge1xuICAgICAgICAgIGNhc2UgXCJzaG9ydGN1dFwiOlxuICAgICAgICAgICAgR2FtZS5jaG9pY2Uoe1xuICAgICAgICAgICAgICAxOjAsXG4gICAgICAgICAgICAgIDI6MSxcbiAgICAgICAgICAgICAgMzoyLFxuICAgICAgICAgICAgICA0OjMsXG4gICAgICAgICAgICAgIDU6NCxcbiAgICAgICAgICAgICAgNjo1LFxuICAgICAgICAgICAgICA3OjYsXG4gICAgICAgICAgICAgIDg6N1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNob2ljZSkgJiYgY2hvaWNlID49IDApIHtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXJbY2hvaWNlXSA9IHtcbiAgICAgICAgICAgICAgICAgIGlkOiBza2lsbElkLFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJza2lsbFwiXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwibGV2ZWx1cFwiOlxuICAgICAgICAgICAgaWYgKHNraWxsLmRhdGEubmV4dCkge1xuICAgICAgICAgICAgICBsZXQgY2Fubm90ID0gW107XG4gICAgICAgICAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5nb2xkIDwgc2tpbGwuZGF0YS5uZXh0LmdvbGQpIHtcbiAgICAgICAgICAgICAgICBjYW5ub3QucHVzaChg6YeR5biB5LiN6Laz77yM6ZyA6KaB6YeR5biBJHtza2lsbC5kYXRhLm5leHQuZ29sZH3vvIzlvZPliY3mgqjmnInph5HluIEke0dhbWUuaGVyby5kYXRhLmdvbGR9YCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLmV4cCA8IHNraWxsLmRhdGEubmV4dC5leHApIHtcbiAgICAgICAgICAgICAgICBjYW5ub3QucHVzaChg57uP6aqM5LiN6Laz77yM6ZyA6KaB57uP6aqMJHtza2lsbC5kYXRhLm5leHQuZXhwfe+8jOW9k+WJjeaCqOaciee7j+mqjCR7R2FtZS5oZXJvLmRhdGEuZXhwfWApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChjYW5ub3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgR2FtZS5kaWFsb2d1ZShjYW5ub3QpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBHYW1lLmNvbmZpcm0oYOehruWumuimgeWNh+e6p+i/meS4quaKgOiDveWQl++8n+WFsemcgOimgemHkeW4gSR7c2tpbGwuZGF0YS5uZXh0LmdvbGR977yM57uP6aqMJHtza2lsbC5kYXRhLm5leHQuZXhwfWAsIGZ1bmN0aW9uICgpIHsgICAgICAgICAgICAgICAgbGV0IG5leHRJZCA9IHNraWxsLmRhdGEubmV4dC5pZDtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5za2lsbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5za2lsbHMucHVzaChuZXh0SWQpO1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmdvbGQgLT0gc2tpbGwuZGF0YS5uZXh0LmdvbGQ7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXhwIC09IHNraWxsLmRhdGEubmV4dC5leHA7XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcbiAgICAgICAgICAgICAgICBHYW1lLlNraWxsLmxvYWQobmV4dElkKS50aGVuKGZ1bmN0aW9uIChza2lsbE9iaikge1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuZW5kKCk7XG4gICAgICAgICAgICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyZW1vdmVcIjpcbiAgICAgICAgICAgIEdhbWUuY29uZmlybShg55yf55qE6KaB6YGX5b+YICR7c2tpbGwuZGF0YS5uYW1lfSDmioDog73lkJfvvJ9gLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmJhci5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LmlkID09IHNraWxsSWQpIHtcbiAgICAgICAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuc2tpbGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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

  var win = Game.windows.status = Game.Window.create("statusWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"statusWindowInventory\" class=\"brownButton\">物品</button>\n        <label id=\"heroName\"></label>\n      </div>\n      <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tr>\n          <td id=\"statusWindowTable\">\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td style=\"width: 50%;\">\n            <table id=\"statusWindowEquipmentTable\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n              <tbody>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">头部</td>\n                  <td id=\"equipment-head\"></td>\n                  <td style=\"width: 60px;\"><button id=\"equipmentButton-head\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">身体</td>\n                  <td id=\"equipment-body\"></td>\n                  <td><button id=\"equipmentButton-body\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">足部</td>\n                  <td id=\"equipment-feet\"></td>\n                  <td><button id=\"equipmentButton-feet\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">武器</td>\n                  <td id=\"equipment-weapon\"></td>\n                  <td><button id=\"equipmentButton-weapon\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">项链</td>\n                  <td id=\"equipment-neck\"></td>\n                  <td><button id=\"equipmentButton-neck\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">戒指</td>\n                  <td id=\"equipment-ring\"></td>\n                  <td><button id=\"equipmentButton-ring\" class=\"brownButton\">卸下</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ";

  win.css = "\n    #heroName {\n      font-size: 24px;\n      margin-left: 240px;\n    }\n\n    #statusWindowTable {\n      width: 50%;\n    }\n\n    #statusWindowTable label {\n      font-size: 18px;\n      margin-left: 80px;\n    }\n\n    #statusWindowEquipmentTable button {\n      width: 60px;\n      height: 40px;\n    }\n\n    .statusWindowEquipmentText {\n      width: 60px;\n      font-size: 20px;\n      text-align: center;\n    }\n\n    .statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n      text-align: center;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    .statusWindow table {\n      width: 100%;\n      height: 320px;\n    }\n  ";

  var statusWindowEquipment = {
    head: win.querySelector("#equipment-head"),
    body: win.querySelector("#equipment-body"),
    feet: win.querySelector("#equipment-feet"),
    weapon: win.querySelector("#equipment-weapon"),
    neck: win.querySelector("#equipment-neck"),
    ring: win.querySelector("#equipment-ring")
  };

  var statusWindowEquipmentButton = {
    head: win.querySelector("#equipmentButton-head"),
    body: win.querySelector("#equipmentButton-body"),
    feet: win.querySelector("#equipmentButton-feet"),
    weapon: win.querySelector("#equipmentButton-weapon"),
    neck: win.querySelector("#equipmentButton-neck"),
    ring: win.querySelector("#equipmentButton-ring")
  };

  var lastSelect = -1;

  Sprite.each(statusWindowEquipmentButton, function (button, key) {
    button.addEventListener("click", function () {
      if (Game.hero.data.equipment[key]) {
        Game.hero.data.equipment[key] = null;
      } else {
        if (key == "weapon") {
          Game.windows.inventory.open("sword|spear|bow");
        } else {
          Game.windows.inventory.open("head|body|feet");
        }
      }
      win.update();
    });
  });

  var heroName = win.querySelector("#heroName");
  var heroHP = win.querySelector("#heroHP");
  var heroSP = win.querySelector("#heroSP");
  var heroLevel = win.querySelector("#heroLevel");
  var heroEXP = win.querySelector("#heroEXP");
  var heroSTR = win.querySelector("#heroSTR");
  var heroDEX = win.querySelector("#heroDEX");
  var heroCON = win.querySelector("#heroCON");
  var heroINT = win.querySelector("#heroINT");
  var heroCHA = win.querySelector("#heroCHA");
  var heroATK = win.querySelector("#heroATK");
  var heroDEF = win.querySelector("#heroDEF");
  var heroMATK = win.querySelector("#heroMATK");
  var heroMDEF = win.querySelector("#heroMDEF");

  var statusWindowClose = win.querySelector("button#statusWindowClose");
  var statusWindowInventory = win.querySelector("button#statusWindowInventory");
  var statusWindowEquipmentTable = win.querySelector("#statusWindowEquipmentTable");

  statusWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.inventory.open();
    }, 20);
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("update", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    heroName.textContent = "名字：" + Game.hero.data.name;
    heroHP.textContent = "生命力：" + Game.hero.data.hp + "/" + Game.hero.data.$hp;
    heroSP.textContent = "精神力：" + Game.hero.data.sp + "/" + Game.hero.data.$sp;
    heroLevel.textContent = "等级：" + Game.hero.data.level;
    heroEXP.textContent = "经验：" + Game.hero.data.exp;
    heroSTR.textContent = "力量：" + Game.hero.data.str;
    heroDEX.textContent = "敏捷：" + Game.hero.data.dex;
    heroCON.textContent = "耐力：" + Game.hero.data.con;
    heroINT.textContent = "智力：" + Game.hero.data.int;
    heroCHA.textContent = "魅力：" + Game.hero.data.cha;
    heroATK.textContent = "攻击：" + Game.hero.data.atk;
    heroDEF.textContent = "防御：" + Game.hero.data.def;
    heroMATK.textContent = "魔法攻击：" + Game.hero.data.matk;
    heroMDEF.textContent = "魔法防御：" + Game.hero.data.mdef;

    var lines = statusWindowEquipmentTable.querySelectorAll("tr");
    for (var i = 0, len = lines.length; i < len; i++) {
      if (select == i) {
        lines[i].style.backgroundColor = "green";
      } else {
        lines[i].style.backgroundColor = "";
      }
    }

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      var button = statusWindowEquipmentButton[key];

      if (element) {
        var line = "";
        line += "<img alt=\"\" src=\"" + Game.items[element].icon.src + "\">";
        line += "<span>" + Game.items[element].data.name + "</span>";
        statusWindowEquipment[key].innerHTML = line;
        button.textContent = "卸下";
      } else {
        statusWindowEquipment[key].innerHTML = "";
        button.textContent = "装备";
      }
    });
  });

  win.whenUp(["enter"], function () {
    var buttons = statusWindowEquipmentTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = statusWindowEquipmentTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  win.assign("open", function (select) {
    win.update(select);
    win.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5FLEtBQUcsQ0FBQyxJQUFJLGt6RkErRFAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyw4NUJBcUROLENBQUM7O0FBRUYsTUFBSSxxQkFBcUIsR0FBRztBQUMxQixRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxVQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztBQUM5QyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUMxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztHQUMzQyxDQUFDOztBQUVGLE1BQUksMkJBQTJCLEdBQUc7QUFDaEMsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsVUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUM7QUFDcEQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7QUFDaEQsUUFB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LEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93U3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zdGF0dXMgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzdGF0dXNXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgaWQ9XCJzdGF0dXNXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzdGF0dXNXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1dpbmRvd0ludmVudG9yeVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7nianlk4E8L2J1dHRvbj5cbiAgICAgICAgPGxhYmVsIGlkPVwiaGVyb05hbWVcIj48L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8dGFibGUgYm9yZGVyPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGNlbGxwYWRkaW5nPVwiMFwiPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIGlkPVwic3RhdHVzV2luZG93VGFibGVcIj5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9IUFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvU1BcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0xldmVsXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9FWFBcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb1NUUlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvREVYXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9DT05cIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0lOVFwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvQ0hBXCI+PC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBpZD1cImhlcm9BVEtcIj48L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGlkPVwiaGVyb0RFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTUFUS1wiPjwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgaWQ9XCJoZXJvTURFRlwiPjwvbGFiZWw+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNTAlO1wiPlxuICAgICAgICAgICAgPHRhYmxlIGlkPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGFibGVcIiBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCI+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+5aS06YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1oZWFkXCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24taGVhZFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPui6q+S9kzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtYm9keVwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1ib2R5XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJzdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0XCI+6Laz6YOoPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBpZD1cImVxdWlwbWVudC1mZWV0XCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIGlkPVwiZXF1aXBtZW50QnV0dG9uLWZlZXRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7mrablmag8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LXdlYXBvblwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi13ZWFwb25cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y245LiLPC9idXR0b24+PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInN0YXR1c1dpbmRvd0VxdWlwbWVudFRleHRcIj7pobnpk748L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGlkPVwiZXF1aXBtZW50LW5lY2tcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPjxidXR0b24gaWQ9XCJlcXVpcG1lbnRCdXR0b24tbmVja1wiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljbjkuIs8L2J1dHRvbj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic3RhdHVzV2luZG93RXF1aXBtZW50VGV4dFwiPuaIkuaMhzwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgaWQ9XCJlcXVpcG1lbnQtcmluZ1wiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImVxdWlwbWVudEJ1dHRvbi1yaW5nXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWNuOS4izwvYnV0dG9uPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAjaGVyb05hbWUge1xuICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDI0MHB4O1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dUYWJsZSB7XG4gICAgICB3aWR0aDogNTAlO1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dUYWJsZSBsYWJlbCB7XG4gICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICBtYXJnaW4tbGVmdDogODBweDtcbiAgICB9XG5cbiAgICAjc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgIH1cblxuICAgIC5zdGF0dXNXaW5kb3dFcXVpcG1lbnRUZXh0IHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIC5zdGF0dXNXaW5kb3cgbGFiZWwge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuXG4gICAgI3N0YXR1c1dpbmRvd0l0ZW1CYXIgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICAgICAgbWFyZ2luLXRvcDogMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICNzdGF0dXNXaW5kb3dDbG9zZSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuXG4gICAgI3N0YXR1c1dpbmRvd0ludmVudG9yeSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuXG4gICAgLnN0YXR1c1dpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMzIwcHg7XG4gICAgfVxuICBgO1xuXG4gIGxldCBzdGF0dXNXaW5kb3dFcXVpcG1lbnQgPSB7XG4gICAgaGVhZDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWhlYWRcIiksXG4gICAgYm9keTogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWJvZHlcIiksXG4gICAgZmVldDogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50LWZlZXRcIiksXG4gICAgd2VhcG9uOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnQtd2VhcG9uXCIpLFxuICAgIG5lY2s6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1uZWNrXCIpLFxuICAgIHJpbmc6IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudC1yaW5nXCIpXG4gIH07XG5cbiAgbGV0IHN0YXR1c1dpbmRvd0VxdWlwbWVudEJ1dHRvbiA9IHtcbiAgICBoZWFkOiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24taGVhZFwiKSxcbiAgICBib2R5OiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24tYm9keVwiKSxcbiAgICBmZWV0OiB3aW4ucXVlcnlTZWxlY3RvcihcIiNlcXVpcG1lbnRCdXR0b24tZmVldFwiKSxcbiAgICB3ZWFwb246IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2VxdWlwbWVudEJ1dHRvbi13ZWFwb25cIiksXG4gICAgbmVjazogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLW5lY2tcIiksXG4gICAgcmluZzogd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZXF1aXBtZW50QnV0dG9uLXJpbmdcIilcbiAgfTtcblxuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIFNwcml0ZS5lYWNoKHN0YXR1c1dpbmRvd0VxdWlwbWVudEJ1dHRvbiwgZnVuY3Rpb24gKGJ1dHRvbiwga2V5KSB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2tleV0pIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2tleV0gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PSBcIndlYXBvblwiKSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKFwic3dvcmR8c3BlYXJ8Ym93XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbihcImhlYWR8Ym9keXxmZWV0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aW4udXBkYXRlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGxldCBoZXJvTmFtZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9OYW1lXCIpO1xuICBsZXQgaGVyb0hQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0hQXCIpXG4gIGxldCBoZXJvU1AgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvU1BcIik7XG4gIGxldCBoZXJvTGV2ZWwgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvTGV2ZWxcIik7XG4gIGxldCBoZXJvRVhQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0VYUFwiKTtcbiAgbGV0IGhlcm9TVFIgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvU1RSXCIpO1xuICBsZXQgaGVyb0RFWCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9ERVhcIik7XG4gIGxldCBoZXJvQ09OID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0NPTlwiKTtcbiAgbGV0IGhlcm9JTlQgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvSU5UXCIpO1xuICBsZXQgaGVyb0NIQSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2hlcm9DSEFcIik7XG4gIGxldCBoZXJvQVRLID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb0FUS1wiKTtcbiAgbGV0IGhlcm9ERUYgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvREVGXCIpO1xuICBsZXQgaGVyb01BVEsgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNoZXJvTUFUS1wiKTtcbiAgbGV0IGhlcm9NREVGID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaGVyb01ERUZcIik7XG5cbiAgbGV0IHN0YXR1c1dpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3RhdHVzV2luZG93Q2xvc2VcIik7XG4gIGxldCBzdGF0dXNXaW5kb3dJbnZlbnRvcnkgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzdGF0dXNXaW5kb3dJbnZlbnRvcnlcIik7XG4gIGxldCBzdGF0dXNXaW5kb3dFcXVpcG1lbnRUYWJsZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3N0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlXCIpO1xuXG4gIHN0YXR1c1dpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICBzdGF0dXNXaW5kb3dJbnZlbnRvcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widGFiXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW4uaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludmVudG9yeS5vcGVuKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMClcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcInVwZGF0ZVwiLCBmdW5jdGlvbiAoc2VsZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxlY3QgPSAtMTtcbiAgICB9XG5cbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgaGVyb05hbWUudGV4dENvbnRlbnQgPSBg5ZCN5a2X77yaJHtHYW1lLmhlcm8uZGF0YS5uYW1lfWA7XG4gICAgaGVyb0hQLnRleHRDb250ZW50ID0gYOeUn+WRveWKm++8miR7R2FtZS5oZXJvLmRhdGEuaHB9LyR7R2FtZS5oZXJvLmRhdGEuJGhwfWA7XG4gICAgaGVyb1NQLnRleHRDb250ZW50ID0gYOeyvuelnuWKm++8miR7R2FtZS5oZXJvLmRhdGEuc3B9LyR7R2FtZS5oZXJvLmRhdGEuJHNwfWA7XG4gICAgaGVyb0xldmVsLnRleHRDb250ZW50ID0gYOetiee6p++8miR7R2FtZS5oZXJvLmRhdGEubGV2ZWx9YDtcbiAgICBoZXJvRVhQLnRleHRDb250ZW50ID0gYOe7j+mqjO+8miR7R2FtZS5oZXJvLmRhdGEuZXhwfWA7XG4gICAgaGVyb1NUUi50ZXh0Q29udGVudCA9IGDlipvph4/vvJoke0dhbWUuaGVyby5kYXRhLnN0cn1gO1xuICAgIGhlcm9ERVgudGV4dENvbnRlbnQgPSBg5pWP5o2377yaJHtHYW1lLmhlcm8uZGF0YS5kZXh9YDtcbiAgICBoZXJvQ09OLnRleHRDb250ZW50ID0gYOiAkOWKm++8miR7R2FtZS5oZXJvLmRhdGEuY29ufWA7XG4gICAgaGVyb0lOVC50ZXh0Q29udGVudCA9IGDmmbrlipvvvJoke0dhbWUuaGVyby5kYXRhLmludH1gO1xuICAgIGhlcm9DSEEudGV4dENvbnRlbnQgPSBg6a2F5Yqb77yaJHtHYW1lLmhlcm8uZGF0YS5jaGF9YDtcbiAgICBoZXJvQVRLLnRleHRDb250ZW50ID0gYOaUu+WHu++8miR7R2FtZS5oZXJvLmRhdGEuYXRrfWA7XG4gICAgaGVyb0RFRi50ZXh0Q29udGVudCA9IGDpmLLlvqHvvJoke0dhbWUuaGVyby5kYXRhLmRlZn1gO1xuICAgIGhlcm9NQVRLLnRleHRDb250ZW50ID0gYOmtlOazleaUu+WHu++8miR7R2FtZS5oZXJvLmRhdGEubWF0a31gO1xuICAgIGhlcm9NREVGLnRleHRDb250ZW50ID0gYOmtlOazlemYsuW+oe+8miR7R2FtZS5oZXJvLmRhdGEubWRlZn1gO1xuXG4gICAgbGV0IGxpbmVzID0gc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHNlbGVjdCA9PSBpKSB7XG4gICAgICAgIGxpbmVzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmVzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgU3ByaXRlLmVhY2goR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50LCBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XG4gICAgICBsZXQgYnV0dG9uID0gc3RhdHVzV2luZG93RXF1aXBtZW50QnV0dG9uW2tleV07XG5cbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGxldCBsaW5lID0gXCJcIjtcbiAgICAgICAgbGluZSArPSBgPGltZyBhbHQ9XCJcIiBzcmM9XCIke0dhbWUuaXRlbXNbZWxlbWVudF0uaWNvbi5zcmN9XCI+YDtcbiAgICAgICAgbGluZSArPSBgPHNwYW4+JHtHYW1lLml0ZW1zW2VsZW1lbnRdLmRhdGEubmFtZX08L3NwYW4+YDtcbiAgICAgICAgc3RhdHVzV2luZG93RXF1aXBtZW50W2tleV0uaW5uZXJIVE1MID0gbGluZTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCLljbjkuItcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1c1dpbmRvd0VxdWlwbWVudFtrZXldLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwi6KOF5aSHXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZW50ZXJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IHN0YXR1c1dpbmRvd0VxdWlwbWVudFRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gc3RhdHVzV2luZG93RXF1aXBtZW50VGFibGUucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKS5sZW5ndGg7XG5cbiAgICBpZiAobGFzdFNlbGVjdCA9PSAtMSkge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICB3aW4ub3BlbigwKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICB3aW4ub3Blbihjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4oc2VsZWN0KTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCAtIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPCAwKSB7XG4gICAgICAgICAgc2VsZWN0ID0gY291bnQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKHNlbGVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB3aW4uYXNzaWduKFwib3BlblwiLCBmdW5jdGlvbiAoc2VsZWN0KSB7XG4gICAgd2luLnVwZGF0ZShzZWxlY3QpO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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

  var win = Game.windows.sysmenu = Game.Window.create("sysmenuWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"sysmenuWindowClose\" class=\"brownButton\">关闭窗口</button>\n\n      <table><tbody><tr><td>\n        <button id=\"sysmenuWindowInventory\" class=\"brownButton\">1、背包物品</button>\n        <button id=\"sysmenuWindowStatus\" class=\"brownButton\">2、状态装备</button>\n        <br>\n        <button id=\"sysmenuWindowSkill\" class=\"brownButton\">3、查看技能</button>\n        <button id=\"sysmenuWindowQuest\" class=\"brownButton\">4、任务列表</button>\n        <br>\n        <button id=\"sysmenuWindowMap\" class=\"brownButton\">5、迷你地图</button>\n        <button id=\"sysmenuWindowSetting\" class=\"brownButton\">6、游戏设置</button>\n        <br>\n        <button id=\"sysmenuWindowArchive\" class=\"brownButton\">7、存档管理</button>\n        <button id=\"sysmenuWindowExit\" class=\"brownButton\">8、退出游戏</button>\n        <br>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .sysmenuWindow {\n      text-align: center;\n    }\n\n    .sysmenuWindow table, .sysmenuWindow tbody, .sysmenuWindow tr, .sysmenuWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .sysmenuWindow button {\n      width: 200px;\n      height: 60px;\n      margin: 2px;\n      font-size: 16px;\n    }\n\n    button#sysmenuWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n  ";

  var sysmenuWindowInventory = win.querySelector("button#sysmenuWindowInventory");
  var sysmenuWindowStatus = win.querySelector("button#sysmenuWindowStatus");

  var sysmenuWindowSkill = win.querySelector("button#sysmenuWindowSkill");
  var sysmenuWindowQuest = win.querySelector("button#sysmenuWindowQuest");

  var sysmenuWindowMap = win.querySelector("button#sysmenuWindowMap");
  var sysmenuWindowSetting = win.querySelector("button#sysmenuWindowSetting");

  var sysmenuWindowArchive = win.querySelector("button#sysmenuWindowArchive");
  var sysmenuWindowExit = win.querySelector("button#sysmenuWindowExit");

  var sysmenuWindowClose = win.querySelector("button#sysmenuWindowClose");

  win.whenUp(["esc"], function (key) {
    sysmenuWindowClose.click();
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    switch (key) {
      case "1":
        sysmenuWindowInventory.click();
        break;
      case "2":
        sysmenuWindowStatus.click();
        break;
      case "3":
        sysmenuWindowSkill.click();
        break;
      case "4":
        sysmenuWindowQuest.click();
        break;
      case "5":
        sysmenuWindowMap.click();
        break;
      case "6":
        sysmenuWindowSetting.click();
        break;
      case "7":
        sysmenuWindowArchive.click();
        break;
      case "8":
        sysmenuWindowExit.click();
        break;
    }
  });

  sysmenuWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  sysmenuWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  sysmenuWindowSkill.addEventListener("click", function (event) {
    win.hide();
    Game.windows.skill.open();
  });

  sysmenuWindowQuest.addEventListener("click", function (event) {
    win.hide();
    Game.windows.quest.current();
  });

  sysmenuWindowMap.addEventListener("click", function (event) {
    win.hide();
    Game.windows.map.show();
  });

  sysmenuWindowSetting.addEventListener("click", function (event) {
    win.hide();
    Game.windows.setting.show();
  });

  sysmenuWindowArchive.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });

  sysmenuWindowExit.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTeXNtZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSwwNEJBbUJQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcseWhCQTJCTixDQUFDOztBQUVGLE1BQUksc0JBQXNCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hGLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxRSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsTUFBSSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTVFLE1BQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzVFLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV0RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFeEUsS0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVB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RUgsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzNELFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUMxQixDQUFDLENBQUM7O0FBRUgsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzVELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dTeXNtZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5zeXNtZW51ID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwic3lzbWVudVdpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl63nqpflj6M8L2J1dHRvbj5cblxuICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd0ludmVudG9yeVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4x44CB6IOM5YyF54mp5ZOBPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93U3RhdHVzXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjLjgIHnirbmgIHoo4XlpIc8L2J1dHRvbj5cbiAgICAgICAgPGJyPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd1NraWxsXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPjPjgIHmn6XnnIvmioDog708L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dRdWVzdFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4044CB5Lu75Yqh5YiX6KGoPC9idXR0b24+XG4gICAgICAgIDxicj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInN5c21lbnVXaW5kb3dNYXBcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+NeOAgei/t+S9oOWcsOWbvjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwic3lzbWVudVdpbmRvd1NldHRpbmdcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+NuOAgea4uOaIj+iuvue9rjwvYnV0dG9uPlxuICAgICAgICA8YnI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93QXJjaGl2ZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4344CB5a2Y5qGj566h55CGPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzeXNtZW51V2luZG93RXhpdFwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj4444CB6YCA5Ye65ri45oiPPC9idXR0b24+XG4gICAgICAgIDxicj5cbiAgICAgIDwvdGQ+PC90cj48L3Rib2R5PjwvdGFibGU+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcbiAgICAuc3lzbWVudVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLnN5c21lbnVXaW5kb3cgdGFibGUsIC5zeXNtZW51V2luZG93IHRib2R5LCAuc3lzbWVudVdpbmRvdyB0ciwgLnN5c21lbnVXaW5kb3cgdGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5zeXNtZW51V2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMjAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBtYXJnaW46IDJweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG5cbiAgICBidXR0b24jc3lzbWVudVdpbmRvd0Nsb3NlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cbiAgYDtcblxuICBsZXQgc3lzbWVudVdpbmRvd0ludmVudG9yeSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dJbnZlbnRvcnlcIik7XG4gIGxldCBzeXNtZW51V2luZG93U3RhdHVzID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1N0YXR1c1wiKTtcblxuICBsZXQgc3lzbWVudVdpbmRvd1NraWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1NraWxsXCIpO1xuICBsZXQgc3lzbWVudVdpbmRvd1F1ZXN0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1F1ZXN0XCIpO1xuXG4gIGxldCBzeXNtZW51V2luZG93TWFwID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd01hcFwiKTtcbiAgbGV0IHN5c21lbnVXaW5kb3dTZXR0aW5nID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd1NldHRpbmdcIik7XG5cbiAgbGV0IHN5c21lbnVXaW5kb3dBcmNoaXZlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc3lzbWVudVdpbmRvd0FyY2hpdmVcIik7XG4gIGxldCBzeXNtZW51V2luZG93RXhpdCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3N5c21lbnVXaW5kb3dFeGl0XCIpO1xuXG4gIGxldCBzeXNtZW51V2luZG93Q2xvc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzeXNtZW51V2luZG93Q2xvc2VcIik7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzeXNtZW51V2luZG93Q2xvc2UuY2xpY2soKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIFwiMVwiOlxuICAgICAgICBzeXNtZW51V2luZG93SW52ZW50b3J5LmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjJcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd1N0YXR1cy5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIzXCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dTa2lsbC5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI0XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dRdWVzdC5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI1XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dNYXAuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiNlwiOlxuICAgICAgICBzeXNtZW51V2luZG93U2V0dGluZy5jbGljaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI3XCI6XG4gICAgICAgIHN5c21lbnVXaW5kb3dBcmNoaXZlLmNsaWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjhcIjpcbiAgICAgICAgc3lzbWVudVdpbmRvd0V4aXQuY2xpY2soKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxuICBzeXNtZW51V2luZG93SW52ZW50b3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5pbnZlbnRvcnkub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93U3RhdHVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zdGF0dXMub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93U2tpbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLnNraWxsLm9wZW4oKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd1F1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5xdWVzdC5jdXJyZW50KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dNYXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLm1hcC5zaG93KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dTZXR0aW5nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4uaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5zZXR0aW5nLnNob3coKTtcbiAgfSk7XG5cbiAgc3lzbWVudVdpbmRvd0FyY2hpdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLmFyY2hpdmUub3BlbigpO1xuICB9KTtcblxuICBzeXNtZW51V2luZG93RXhpdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgR2FtZS5jbGVhclN0YWdlKCk7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MubWFpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHN5c21lbnVXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  /**
   * 自动寻路算法 A*
   */
  Game.assign("Astar", (function () {
    function GameAstar() {
      _classCallCheck(this, GameAstar);
    }

    _createClass(GameAstar, null, [{
      key: "getPath",

      /**
       * @param {function} collisionFunction 测试是否阻挡
       * @param {Object} start 起始位置 eg. {x: 0, y: 0}
       * @param {Object} end
       */
      value: function getPath(start, end, callback) {

        // console.time("t");

        var blocked = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var actor = _step.value;

            if (actor.x != start.x || actor.y != start.y) {
              blocked[actor.x * 10000 + actor.y] = true;
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

        var result = path(function (x, y) {
          // 判断函数，判断是否阻挡
          if (x < 0 || x >= Game.area.map.col) {
            return true; // 有阻挡，返回true
          }
          if (y < 0 || y >= Game.area.map.row) {
            return true; // 有阻挡，返回true
          }
          var key = x * 10000 + y;
          if (Game.area.map.blockedMap[key]) {
            return true; // 有阻挡，返回true
          }
          if (blocked[key]) {
            return true; // 有阻挡，返回true
          }
          return false; // 没有阻挡
        }, start, end);

        // console.timeEnd("t");

        callback(result);
      }
    }]);

    return GameAstar;
  })());

  /*
  * reference from http://eloquentjavascript.net/1st_edition/appendix2.html
  */

  var BinaryHeap = (function () {
    function BinaryHeap(scoreFunction) {
      _classCallCheck(this, BinaryHeap);

      this.content = [];
      this.scoreFunction = scoreFunction;
      this.scores = new Map();
    }

    _createClass(BinaryHeap, [{
      key: "push",
      value: function push(element) {
        this.scores.set(element, this.scoreFunction(element));
        this.content.push(element);
        this.bubbleUp(this.content.length - 1);
      }
    }, {
      key: "pop",
      value: function pop() {
        var r = this.content[0];
        var e = this.content.pop();
        if (this.content.length > 0) {
          this.content[0] = e;
          this.sinkDown(0);
        }
        return r;
      }
    }, {
      key: "delete",
      value: function _delete(node) {
        for (var i = 0, len = this.content.length; i < len; i++) {
          if (this.content[i] == node) {
            this.scores["delete"](this.content[i]);
            var e = this.content.pop();
            if (i == len - 1) {
              break;
            }
            this.content[i] = e;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
          }
        }
      }
    }, {
      key: "bubbleUp",
      value: function bubbleUp(n) {
        var element = this.content[n];
        var score = this.scores.get(element);
        while (n > 0) {
          var parentN = Math.floor((n + 1) / 2) - 1;
          var _parent = this.content[parentN];
          if (score >= this.scores.get(_parent)) break;
          this.content[parentN] = element;
          this.content[n] = _parent;
          n = parentN;
        }
      }
    }, {
      key: "sinkDown",
      value: function sinkDown(n) {
        var len = this.content.length;
        var element = this.content[n];
        var score = this.scores.get(element);

        while (true) {
          var child2N = (n + 1) * 2;
          var child1N = child2N - 1;
          var swap = null;
          var child1score = undefined,
              child2score = undefined;

          if (child1N < len) {
            var child1 = this.content[child1N];
            child1score = this.scores.get(child1);
            if (child1score < score) {
              swap = child1N;
            }
          }

          if (child2N < len) {
            var child2 = this.content[child2N];
            child2score = this.scores.get(child2);
            if (child2score < (swap == null ? score : child1score)) {
              swap = child2N;
            }
          }

          if (swap == null) {
            break;
          }

          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
      }
    }, {
      key: "size",
      get: function get() {
        return this.content.length;
      },
      set: function set(value) {
        throw new Error("BinaryHeap.size readonly");
      }
    }]);

    return BinaryHeap;
  })();

  ; // BinaryHeap

  // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
  function manhattan(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }

  // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
  function make(x, y, end, best, addition) {
    var t = {
      key: x * 10000 + y,
      x: x,
      y: y,
      g: best.g + addition,
      h: manhattan(x, y, end.x, end.y),
      front: []
    };
    t.f = t.g + t.h;
    var len = best.front.length;
    t.front.length = len;
    for (var i = 0; i < len; i++) {
      t.front[i] = best.front[i];
    }
    t.front.push(best.x);
    t.front.push(best.y);
    return t;
  }

  function path(collisionFunction, start, end) {

    // 开启列表和关闭列表
    var open = new BinaryHeap(function (element) {
      return element.f;
    });
    var openIndex = new Set();
    var closeIndex = new Set();

    //构建起始节点
    var startElement = {
      key: start.x * 10000 + start.y,
      x: start.x,
      y: start.y,
      f: 0,
      g: 0,
      h: manhattan(start.x, start.y, end.x, end.y),
      front: []
    };
    openIndex.add(startElement.key);
    open.push(startElement);

    var push2open = function push2open(x, y, end, best) {
      if (!collisionFunction(x, y)) {
        // 验证up
        var key = x * 10000 + y;
        if (!openIndex.has(key) && !closeIndex.has(key)) {
          openIndex.add(key);
          open.push(make(x, y, end, best, 10));
        }
      }
    };

    while (open.size) {
      // F值最小的节点，就是堆顶
      var best = open.pop();
      // 从开启列表中删除，加入关闭列表
      open["delete"](best);
      openIndex["delete"](best.key);
      closeIndex.add(best.key);

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        var result = [];
        for (var i = 0, len = best.front.length; i < len; i += 2) {
          result.push({
            x: best.front[i],
            y: best.front[i + 1]
          });
        }
        result.push({
          x: end.x,
          y: end.y
        });
        return result;
      }

      // 记录上下左右四方向的可能值
      push2open(best.x, best.y - 1, end, best);
      push2open(best.x, best.y + 1, end, best);
      push2open(best.x - 1, best.y, end, best);
      push2open(best.x + 1, best.y, end, best);
    } // while

    return null;
  }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7Ozs7O0FBS2IsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7Ozs7Ozs7YUFNbEIsaUJBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7Ozs7QUFJcEMsWUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDakIsK0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSw4SEFBRTtnQkFBM0IsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzVDLHFCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUMzQztXQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7QUFFaEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDbkMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNuQyxtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGNBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGNBQUksSUFBSSxDQUFDLElBQUksQ0FB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RyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGVBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUUxQzs7QUFFRCxXQUFPLElBQUksQ0FBQztHQUNiO0NBR0YsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFzdGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyoqXG4gICAqIOiHquWKqOWvu+i3r+eul+azlSBBKlxuICAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBc3RhclwiLCBjbGFzcyBHYW1lQXN0YXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbGxpc2lvbkZ1bmN0aW9uIOa1i+ivleaYr+WQpumYu+aMoVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGFydCDotbflp4vkvY3nva4gZWcuIHt4OiAwLCB5OiAwfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbmRcbiAgICAgKi9cbiAgICAgc3RhdGljIGdldFBhdGggKHN0YXJ0LCBlbmQsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAvLyBjb25zb2xlLnRpbWUoXCJ0XCIpO1xuXG4gICAgICAgbGV0IGJsb2NrZWQgPSB7fTtcbiAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICBpZiAoYWN0b3IueCAhPSBzdGFydC54IHx8IGFjdG9yLnkgIT0gc3RhcnQueSkge1xuICAgICAgICAgICBibG9ja2VkW2FjdG9yLnggKiAxMDAwMCArIGFjdG9yLnldID0gdHJ1ZTtcbiAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBsZXQgcmVzdWx0ID0gcGF0aChmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgLy8g5Yik5pat5Ye95pWw77yM5Yik5pat5piv5ZCm6Zi75oyhXG4gICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBHYW1lLmFyZWEubWFwLmNvbCkge1xuICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5pyJ6Zi75oyh77yM6L+U5ZuedHJ1ZVxuICAgICAgICAgfVxuICAgICAgICAgaWYgKHkgPCAwIHx8IHkgPj0gR2FtZS5hcmVhLm1hcC5yb3cpIHtcbiAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIOaciemYu+aMoe+8jOi/lOWbnnRydWVcbiAgICAgICAgIH1cbiAgICAgICAgIGxldCBrZXkgPSB4ICogMTAwMDAgKyB5O1xuICAgICAgICAgaWYgKEdhbWUuYXJlYS5tYXAuYmxvY2tlZE1hcFtrZXldKSB7XG4gICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICB9XG4gICAgICAgICBpZiAoYmxvY2tlZFtrZXldKSB7XG4gICAgICAgICAgIHJldHVybiB0cnVlOyAvLyDmnInpmLvmjKHvvIzov5Tlm550cnVlXG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gZmFsc2U7IC8vIOayoeaciemYu+aMoVxuICAgICAgIH0sIHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwidFwiKTtcblxuICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgIH1cblxuXG4gIH0pO1xuXG4gIC8qXG4gICogcmVmZXJlbmNlIGZyb20gaHR0cDovL2Vsb3F1ZW50amF2YXNjcmlwdC5uZXQvMXN0X2VkaXRpb24vYXBwZW5kaXgyLmh0bWxcbiAgKi9cbiAgY2xhc3MgQmluYXJ5SGVhcCB7XG5cbiAgICBjb25zdHJ1Y3RvciAoc2NvcmVGdW5jdGlvbikge1xuICAgICAgdGhpcy5jb250ZW50ID0gW107XG4gICAgICB0aGlzLnNjb3JlRnVuY3Rpb24gPSBzY29yZUZ1bmN0aW9uO1xuICAgICAgdGhpcy5zY29yZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgcHVzaCAoZWxlbWVudCkge1xuICAgICAgdGhpcy5zY29yZXMuc2V0KGVsZW1lbnQsIHRoaXMuc2NvcmVGdW5jdGlvbihlbGVtZW50KSk7XG4gICAgICB0aGlzLmNvbnRlbnQucHVzaChlbGVtZW50KTtcbiAgICAgIHRoaXMuYnViYmxlVXAodGhpcy5jb250ZW50Lmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHBvcCAoKSB7XG4gICAgICBsZXQgciA9IHRoaXMuY29udGVudFswXTtcbiAgICAgIGxldCBlID0gdGhpcy5jb250ZW50LnBvcCgpO1xuICAgICAgaWYgKHRoaXMuY29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuY29udGVudFswXSA9IGU7XG4gICAgICAgIHRoaXMuc2lua0Rvd24oMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBkZWxldGUgKG5vZGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudFtpXSA9PSBub2RlKSB7XG4gICAgICAgICAgdGhpcy5zY29yZXMuZGVsZXRlKHRoaXMuY29udGVudFtpXSk7XG4gICAgICAgICAgbGV0IGUgPSB0aGlzLmNvbnRlbnQucG9wKCk7XG4gICAgICAgICAgaWYgKGkgPT0gbGVuIC0gMSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29udGVudFtpXSA9IGU7XG4gICAgICAgICAgdGhpcy5idWJibGVVcChpKTtcbiAgICAgICAgICB0aGlzLnNpbmtEb3duKGkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHNpemUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2V0IHNpemUgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaW5hcnlIZWFwLnNpemUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgYnViYmxlVXAgKG4pIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jb250ZW50W25dO1xuICAgICAgbGV0IHNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGVsZW1lbnQpO1xuICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIGxldCBwYXJlbnROID0gTWF0aC5mbG9vcigobiArIDEpIC8gMikgLSAxO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jb250ZW50W3BhcmVudE5dO1xuICAgICAgICBpZiAoc2NvcmUgPj0gdGhpcy5zY29yZXMuZ2V0KHBhcmVudCkpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIHRoaXMuY29udGVudFtwYXJlbnROXSA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY29udGVudFtuXSA9IHBhcmVudDtcbiAgICAgICAgbiA9IHBhcmVudE47XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2lua0Rvd24gKG4pIHtcbiAgICAgIGxldCBsZW4gPSB0aGlzLmNvbnRlbnQubGVuZ3RoO1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNvbnRlbnRbbl07XG4gICAgICBsZXQgc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoZWxlbWVudCk7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGxldCBjaGlsZDJOID0gKG4gKyAxKSAqIDI7XG4gICAgICAgIGxldCBjaGlsZDFOID0gY2hpbGQyTiAtIDE7XG4gICAgICAgIGxldCBzd2FwID0gbnVsbDtcbiAgICAgICAgbGV0IGNoaWxkMXNjb3JlLCBjaGlsZDJzY29yZTtcblxuICAgICAgICBpZiAoY2hpbGQxTiA8IGxlbikge1xuICAgICAgICAgIGxldCBjaGlsZDEgPSB0aGlzLmNvbnRlbnRbY2hpbGQxTl07XG4gICAgICAgICAgY2hpbGQxc2NvcmUgPSB0aGlzLnNjb3Jlcy5nZXQoY2hpbGQxKTtcbiAgICAgICAgICBpZiAoY2hpbGQxc2NvcmUgPCBzY29yZSkge1xuICAgICAgICAgICAgc3dhcCA9IGNoaWxkMU47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkMk4gPCBsZW4pIHtcbiAgICAgICAgICBsZXQgY2hpbGQyID0gdGhpcy5jb250ZW50W2NoaWxkMk5dO1xuICAgICAgICAgIGNoaWxkMnNjb3JlID0gdGhpcy5zY29yZXMuZ2V0KGNoaWxkMik7XG4gICAgICAgICAgaWYgKGNoaWxkMnNjb3JlIDwgKHN3YXAgPT0gbnVsbCA/IHNjb3JlIDogY2hpbGQxc2NvcmUpKSB7XG4gICAgICAgICAgICBzd2FwID0gY2hpbGQyTjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3dhcCA9PSBudWxsKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRlbnRbbl0gPSB0aGlzLmNvbnRlbnRbc3dhcF07XG4gICAgICAgIHRoaXMuY29udGVudFtzd2FwXSA9IGVsZW1lbnQ7XG4gICAgICAgIG4gPSBzd2FwO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH07IC8vIEJpbmFyeUhlYXBcblxuICAvLyDorqHnrpfngrnnu5PmnoRh5ZKMYuS5i+mXtOeahOabvOWTiOmhv+i3neemu++8jOWNs+S4jeW4puaWnOi1sOeahOebtOe6v+i3neemu1xuICBmdW5jdGlvbiBtYW5oYXR0YW4gKGF4LCBheSwgYngsIGJ5KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGF4IC0gYngpICsgTWF0aC5hYnMoYXkgLSBieSk7XG4gIH1cblxuICAvLyDpgJrov4flnZDmoId477yMee+8jOW9k+WJjeacgOWlveeahOiKgueCuWJlc3TlkozkuIDkuKrpmYTliqDlgLzvvIjnm7Tnur8xMO+8jOaWnOe6vzE077yJ77yM6L+U5Zue5LiA5Liq5paw6IqC54K5XG4gIGZ1bmN0aW9uIG1ha2UgKHgsIHksIGVuZCwgYmVzdCwgYWRkaXRpb24pIHtcbiAgICBsZXQgdCA9IHtcbiAgICAgIGtleTogeCAqIDEwMDAwICsgeSxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5LFxuICAgICAgZzogYmVzdC5nICsgYWRkaXRpb24sXG4gICAgICBoOiBtYW5oYXR0YW4oeCwgeSwgZW5kLngsIGVuZC55KSxcbiAgICAgIGZyb250OiBbXVxuICAgIH07XG4gICAgdC5mID0gdC5nICsgdC5oO1xuICAgIGxldCBsZW4gID0gYmVzdC5mcm9udC5sZW5ndGg7XG4gICAgdC5mcm9udC5sZW5ndGggPSBsZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdC5mcm9udFtpXSA9IGJlc3QuZnJvbnRbaV07XG4gICAgfVxuICAgIHQuZnJvbnQucHVzaChiZXN0LngpO1xuICAgIHQuZnJvbnQucHVzaChiZXN0LnkpO1xuICAgIHJldHVybiB0O1xuICB9XG5cbiAgZnVuY3Rpb24gcGF0aCAoY29sbGlzaW9uRnVuY3Rpb24sIHN0YXJ0LCBlbmQpIHtcblxuICAgIC8vIOW8gOWQr+WIl+ihqOWSjOWFs+mXreWIl+ihqFxuICAgIGxldCBvcGVuID0gbmV3IEJpbmFyeUhlYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmY7XG4gICAgfSk7XG4gICAgbGV0IG9wZW5JbmRleCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgY2xvc2VJbmRleCA9IG5ldyBTZXQoKTtcblxuICAgIC8v5p6E5bu66LW35aeL6IqC54K5XG4gICAgbGV0IHN0YXJ0RWxlbWVudCA9IHtcbiAgICAgIGtleTogc3RhcnQueCoxMDAwMCtzdGFydC55LFxuICAgICAgeDogc3RhcnQueCxcbiAgICAgIHk6IHN0YXJ0LnksXG4gICAgICBmOiAwLFxuICAgICAgZzogMCxcbiAgICAgIGg6IG1hbmhhdHRhbihzdGFydC54LCBzdGFydC55LCBlbmQueCwgZW5kLnkpLFxuICAgICAgZnJvbnQ6IFtdXG4gICAgfTtcbiAgICBvcGVuSW5kZXguYWRkKHN0YXJ0RWxlbWVudC5rZXkpO1xuICAgIG9wZW4ucHVzaChzdGFydEVsZW1lbnQpO1xuXG4gICAgbGV0IHB1c2gyb3BlbiA9IGZ1bmN0aW9uICh4LCB5LCBlbmQsIGJlc3QpIHtcbiAgICAgIGlmICghY29sbGlzaW9uRnVuY3Rpb24oeCwgeSkpIHsgLy8g6aqM6K+BdXBcbiAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgIGlmICghb3BlbkluZGV4LmhhcyhrZXkpICYmICFjbG9zZUluZGV4LmhhcyhrZXkpKSB7XG4gICAgICAgICAgb3BlbkluZGV4LmFkZChrZXkpO1xuICAgICAgICAgIG9wZW4ucHVzaChtYWtlKHgsIHksIGVuZCwgYmVzdCwgMTApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB3aGlsZSAob3Blbi5zaXplKSB7XG4gICAgICAvLyBG5YC85pyA5bCP55qE6IqC54K577yM5bCx5piv5aCG6aG2XG4gICAgICBsZXQgYmVzdCA9IG9wZW4ucG9wKCk7XG4gICAgICAvLyDku47lvIDlkK/liJfooajkuK3liKDpmaTvvIzliqDlhaXlhbPpl63liJfooahcbiAgICAgIG9wZW4uZGVsZXRlKGJlc3QpO1xuICAgICAgb3BlbkluZGV4LmRlbGV0ZShiZXN0LmtleSk7XG4gICAgICBjbG9zZUluZGV4LmFkZChiZXN0LmtleSk7XG5cbiAgICAgIC8vIOWmguaenOi/meS4quacgOWlveeahOiKgueCueWwseaYr+e7k+WwvuiKgueCue+8jOWImei/lOWbnlxuICAgICAgaWYgKGJlc3QueCA9PSBlbmQueCAmJiBiZXN0LnkgPT0gZW5kLnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYmVzdC5mcm9udC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIHg6IGJlc3QuZnJvbnRbaV0sXG4gICAgICAgICAgICB5OiBiZXN0LmZyb250W2kgKyAxXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICB4OiBlbmQueCxcbiAgICAgICAgICB5OiBlbmQueVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgLy8g6K6w5b2V5LiK5LiL5bem5Y+z5Zub5pa55ZCR55qE5Y+v6IO95YC8XG4gICAgICBwdXNoMm9wZW4oYmVzdC54LCBiZXN0LnkgLSAxLCBlbmQsIGJlc3QpO1xuICAgICAgcHVzaDJvcGVuKGJlc3QueCwgYmVzdC55ICsgMSwgZW5kLCBiZXN0KTtcbiAgICAgIHB1c2gyb3BlbihiZXN0LnggLSAxLCBiZXN0LnksIGVuZCwgYmVzdCk7XG4gICAgICBwdXNoMm9wZW4oYmVzdC54ICsgMSwgYmVzdC55LCBlbmQsIGJlc3QpO1xuXG4gICAgfSAvLyB3aGlsZVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG59KSgpO1xuIl19

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

  Game.assign("AI", (function () {
    function GameAI() {
      _classCallCheck(this, GameAI);
    }

    _createClass(GameAI, null, [{
      key: "attach",
      value: function attach(hero) {}
    }]);

    return GameAI;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBSS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO2FBQVEsTUFBTTs0QkFBTixNQUFNOzs7aUJBQU4sTUFBTTs7YUFFZCxnQkFBQyxJQUFJLEVBQUUsRUFDcEI7OztXQUhxQixNQUFNO09BSzVCLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQUkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIEdhbWUuYXNzaWduKFwiQUlcIiwgY2xhc3MgR2FtZUFJIHtcblxuICAgIHN0YXRpYyBhdHRhY2ggKGhlcm8pIHtcbiAgICB9XG5cbiAgfSk7XG5cbn0pKCk7XG4iXX0=

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

  function boxCollide(spriteA, spriteB, rectA, rectB) {
    var A = {
      x: spriteA.x - rectA.centerX,
      y: spriteA.y - rectA.centerY,
      w: rectA.width,
      h: rectA.height,
      sx: rectA.x,
      sy: rectA.y,
      sw: rectA.width,
      sh: rectA.height,
      image: rectA.image
    };

    var B = {
      x: spriteB.x - rectB.centerX,
      y: spriteB.y - rectB.centerY,
      w: rectB.width,
      h: rectB.height,
      sx: rectB.x,
      sy: rectB.y,
      sw: rectB.width,
      sh: rectB.height,
      image: rectB.image
    };

    var bigX = Math.max(A.x + A.w, B.x + B.w);
    var smallX = Math.min(A.x, B.x);
    var bigY = Math.max(A.y + A.h, B.y + B.h);
    var smallY = Math.min(A.y, B.y);

    var width = bigX - smallX;
    var height = bigY - smallY;

    if (width < A.w + B.w && height < A.h + B.h) {
      return {
        A: A,
        B: B
      };
    }
    return false;
  }

  var collideCavansCache = new Map();

  function pixelCollide(A, B) {
    // 对图像进行某种意义上的移动，例如把上面的图的A和B都平移到左上角，也就是AA的左上角变为0,0坐标

    var now = new Date().getTime();

    // WWWHHH
    var key = A.w * 1000 + A.h;
    var canvas = undefined;
    var context = undefined;
    if (collideCavansCache.has(key)) {
      canvas = collideCavansCache.get(key).canvas;
      context = collideCavansCache.get(key).context;
    } else {
      canvas = document.createElement("canvas");
      canvas.width = A.w;
      canvas.height = A.h;
      context = canvas.getContext("2d");
      collideCavansCache.set(key, {
        canvas: canvas,
        context: context
      });
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw spriteA
    context.globalCompositeOperation = "source-over";
    context.drawImage(A.image, A.sx, A.sy, A.sw, A.sh, 0, 0, A.w, A.h);

    // draw spriteB
    // 在source-in模式下，图像如果相交则显示，不相交则透明，所以判断如果有非透明就是相交
    context.globalCompositeOperation = "source-in";
    context.drawImage(B.image, B.sx, B.sy, B.sw, B.sh, B.x - A.x, B.y - A.y, B.w, B.h);

    var pixel = context.getImageData(0, 0, A.w, A.h).data;

    var collision = false;

    for (var i = 3, len = pixel.length; i < len; i += 3) {
      if (pixel[i] != 0) {
        collision = true;
      }
    }

    return collision;
  }

  // 角色碰撞检测，先简单的矩形检测，如有碰撞可能则进行像素级检测
  Game.assign("actorCollision", function (actorSprite, blockSprite) {
    // 角色只检测frame 0，因为角色老变动，避免卡住，只检测第一个frame
    var actorRect = actorSprite.getFrame(0);
    // 阻挡的块则检测当前frame
    var blockRect = blockSprite.getFrame();
    var data = boxCollide(actorSprite, blockSprite, actorRect, blockRect);
    if (data) {
      // 计算一个delta，即只碰撞角色的下半部分
      // deltaY偏移0.85，大概意思是只检测角色最下方15%的地方
      var deltaY = Math.floor(actorRect.height * 0.85);
      data.A.y += deltaY;
      data.A.sy += deltaY;
      data.A.h -= deltaY;
      data.A.sh -= deltaY;

      return pixelCollide(data.A, data.B);
    }
    return false;
  });

  // 技能碰撞检测
  Game.assign("skillCollision", function (skillSprite, actorSprite) {
    var skillRect = skillSprite.getFrame();
    var actorRect = actorSprite.getFrame();

    var data = boxCollide(skillSprite, actorSprite, skillRect, actorRect);
    if (data) {
      // 和角色碰撞检测对比，技能碰撞检测无delta
      return pixelCollide(data.A, data.B);
    }
    return false;
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVDb2xsaXNpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsV0FBUyxVQUFVLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ25ELFFBQUksQ0FBQyxHQUFHO0FBQ04sT0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDNUIsT0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDNUIsT0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2QsT0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ2YsUUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ1gsUUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ1gsUUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2YsUUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ2hCLFdBQUssRUFBRSxLQUFLLENBQUMsS0FBSztLQUNuQixDQUFDOztBQUVGLFFBQUksQ0FBQyxHQUFHO0FBQ04sT0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDNUIsT0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDNUIsT0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2QsT0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ2YsUUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ1gsUUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ1gsUUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2YsUUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ2hCLFdBQUssRUFBRSxLQUFLLENBQUMsS0FBSztLQUNuQixDQUFDOztBQUVGLFFBQUks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SSxFQUFFOzs7QUFHUixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQztBQUNwQixVQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDbkIsVUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDOztBQUVwQixhQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyQztBQUNELFdBQU8sS0FBSyxDQUFDO0dBQ2QsQ0FBQyxDQUFDOzs7QUFHSCxNQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsV0FBVyxFQUFFLFdBQVcsRUFBRTtBQUNoRSxRQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDdkMsUUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUV2QyxRQUFJLElBQUksR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdEUsUUFBSSxJQUFJLEVBQUU7O0FBRVIsYUFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDckM7QUFDRCxXQUFPLEtBQUssQ0FBQztHQUNkLENBQUMsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVDb2xsaXNpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBmdW5jdGlvbiBib3hDb2xsaWRlIChzcHJpdGVBLCBzcHJpdGVCLCByZWN0QSwgcmVjdEIpIHtcbiAgICBsZXQgQSA9IHtcbiAgICAgIHg6IHNwcml0ZUEueCAtIHJlY3RBLmNlbnRlclgsXG4gICAgICB5OiBzcHJpdGVBLnkgLSByZWN0QS5jZW50ZXJZLFxuICAgICAgdzogcmVjdEEud2lkdGgsXG4gICAgICBoOiByZWN0QS5oZWlnaHQsXG4gICAgICBzeDogcmVjdEEueCxcbiAgICAgIHN5OiByZWN0QS55LFxuICAgICAgc3c6IHJlY3RBLndpZHRoLFxuICAgICAgc2g6IHJlY3RBLmhlaWdodCxcbiAgICAgIGltYWdlOiByZWN0QS5pbWFnZVxuICAgIH07XG5cbiAgICBsZXQgQiA9IHtcbiAgICAgIHg6IHNwcml0ZUIueCAtIHJlY3RCLmNlbnRlclgsXG4gICAgICB5OiBzcHJpdGVCLnkgLSByZWN0Qi5jZW50ZXJZLFxuICAgICAgdzogcmVjdEIud2lkdGgsXG4gICAgICBoOiByZWN0Qi5oZWlnaHQsXG4gICAgICBzeDogcmVjdEIueCxcbiAgICAgIHN5OiByZWN0Qi55LFxuICAgICAgc3c6IHJlY3RCLndpZHRoLFxuICAgICAgc2g6IHJlY3RCLmhlaWdodCxcbiAgICAgIGltYWdlOiByZWN0Qi5pbWFnZVxuICAgIH07XG5cbiAgICBsZXQgYmlnWCA9IE1hdGgubWF4KEEueCArIEEudywgQi54ICsgQi53KTtcbiAgICBsZXQgc21hbGxYID0gTWF0aC5taW4oQS54LCBCLngpO1xuICAgIGxldCBiaWdZID0gTWF0aC5tYXgoQS55ICsgQS5oLCBCLnkgKyBCLmgpO1xuICAgIGxldCBzbWFsbFkgPSBNYXRoLm1pbihBLnksIEIueSk7XG5cbiAgICBsZXQgd2lkdGggPSBiaWdYIC0gc21hbGxYO1xuICAgIGxldCBoZWlnaHQgPSBiaWdZIC0gc21hbGxZO1xuXG4gICAgaWYgKHdpZHRoIDwgKEEudyArIEIudykgJiYgaGVpZ2h0IDwgKEEuaCArIEIuaCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEE6IEEsXG4gICAgICAgIEI6IEJcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCBjb2xsaWRlQ2F2YW5zQ2FjaGUgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gcGl4ZWxDb2xsaWRlIChBLCBCKSB7XG4gICAgLy8g5a+55Zu+5YOP6L+b6KGM5p+Q56eN5oSP5LmJ5LiK55qE56e75Yqo77yM5L6L5aaC5oqK5LiK6Z2i55qE5Zu+55qEQeWSjELpg73lubPnp7vliLDlt6bkuIrop5LvvIzkuZ/lsLHmmK9BQeeahOW3puS4iuinkuWPmOS4ujAsMOWdkOagh1xuXG4gICAgbGV0IG5vdyA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG5cbiAgICAvLyBXV1dISEhcbiAgICBsZXQga2V5ID0gQS53ICogMTAwMCArIEEuaDtcbiAgICBsZXQgY2FudmFzO1xuICAgIGxldCBjb250ZXh0O1xuICAgIGlmIChjb2xsaWRlQ2F2YW5zQ2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIGNhbnZhcyA9IGNvbGxpZGVDYXZhbnNDYWNoZS5nZXQoa2V5KS5jYW52YXM7XG4gICAgICBjb250ZXh0ID0gY29sbGlkZUNhdmFuc0NhY2hlLmdldChrZXkpLmNvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjYW52YXMud2lkdGggPSBBLnc7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gQS5oO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjb2xsaWRlQ2F2YW5zQ2FjaGUuc2V0KGtleSwge1xuICAgICAgICBjYW52YXM6IGNhbnZhcyxcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBkcmF3IHNwcml0ZUFcbiAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cInNvdXJjZS1vdmVyXCJcbiAgICBjb250ZXh0LmRyYXdJbWFnZShBLmltYWdlLFxuICAgICAgQS5zeCwgQS5zeSwgQS5zdywgQS5zaCxcbiAgICAgIDAsIDAsIEEudywgQS5oKTtcblxuICAgIC8vIGRyYXcgc3ByaXRlQlxuICAgIC8vIOWcqHNvdXJjZS1pbuaooeW8j+S4i++8jOWbvuWDj+WmguaenOebuOS6pOWImeaYvuekuu+8jOS4jeebuOS6pOWImemAj+aYju+8jOaJgOS7peWIpOaWreWmguaenOaciemdnumAj+aYjuWwseaYr+ebuOS6pFxuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwic291cmNlLWluXCJcbiAgICBjb250ZXh0LmRyYXdJbWFnZShCLmltYWdlLFxuICAgICAgQi5zeCwgQi5zeSwgQi5zdywgQi5zaCxcbiAgICAgIEIueCAtIEEueCwgQi55IC0gQS55LCBCLncsIEIuaCk7XG5cbiAgICBsZXQgcGl4ZWwgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBBLncsIEEuaCkuZGF0YTtcblxuICAgIGxldCBjb2xsaXNpb24gPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAzLCBsZW4gPSBwaXhlbC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMykge1xuICAgICAgaWYgKHBpeGVsW2ldICE9IDApIHtcbiAgICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29sbGlzaW9uO1xuICB9XG5cbiAgLy8g6KeS6Imy56Kw5pKe5qOA5rWL77yM5YWI566A5Y2V55qE55+p5b2i5qOA5rWL77yM5aaC5pyJ56Kw5pKe5Y+v6IO95YiZ6L+b6KGM5YOP57Sg57qn5qOA5rWLXG4gIEdhbWUuYXNzaWduKFwiYWN0b3JDb2xsaXNpb25cIiwgZnVuY3Rpb24gKGFjdG9yU3ByaXRlLCBibG9ja1Nwcml0ZSkge1xuICAgIC8vIOinkuiJsuWPquajgOa1i2ZyYW1lIDDvvIzlm6DkuLrop5LoibLogIHlj5jliqjvvIzpgb/lhY3ljaHkvY/vvIzlj6rmo4DmtYvnrKzkuIDkuKpmcmFtZVxuICAgIGxldCBhY3RvclJlY3QgPSBhY3RvclNwcml0ZS5nZXRGcmFtZSgwKTtcbiAgICAvLyDpmLvmjKHnmoTlnZfliJnmo4DmtYvlvZPliY1mcmFtZVxuICAgIGxldCBibG9ja1JlY3QgPSBibG9ja1Nwcml0ZS5nZXRGcmFtZSgpO1xuICAgIGxldCBkYXRhID0gYm94Q29sbGlkZShhY3RvclNwcml0ZSwgYmxvY2tTcHJpdGUsIGFjdG9yUmVjdCwgYmxvY2tSZWN0KTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgLy8g6K6h566X5LiA5LiqZGVsdGHvvIzljbPlj6rnorDmkp7op5LoibLnmoTkuIvljYrpg6jliIZcbiAgICAgIC8vIGRlbHRhWeWBj+enuzAuODXvvIzlpKfmpoLmhI/mgJ3mmK/lj6rmo4DmtYvop5LoibLmnIDkuIvmlrkxNSXnmoTlnLDmlrlcbiAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmZsb29yKGFjdG9yUmVjdC5oZWlnaHQgKiAwLjg1KTtcbiAgICAgIGRhdGEuQS55ICs9IGRlbHRhWTtcbiAgICAgIGRhdGEuQS5zeSArPSBkZWx0YVk7XG4gICAgICBkYXRhLkEuaCAtPSBkZWx0YVk7XG4gICAgICBkYXRhLkEuc2ggLT0gZGVsdGFZO1xuXG4gICAgICByZXR1cm4gcGl4ZWxDb2xsaWRlKGRhdGEuQSwgZGF0YS5CKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvLyDmioDog73norDmkp7mo4DmtYtcbiAgR2FtZS5hc3NpZ24oXCJza2lsbENvbGxpc2lvblwiLCBmdW5jdGlvbiAoc2tpbGxTcHJpdGUsIGFjdG9yU3ByaXRlKSB7XG4gICAgbGV0IHNraWxsUmVjdCA9IHNraWxsU3ByaXRlLmdldEZyYW1lKCk7XG4gICAgbGV0IGFjdG9yUmVjdCA9IGFjdG9yU3ByaXRlLmdldEZyYW1lKCk7XG5cbiAgICBsZXQgZGF0YSA9IGJveENvbGxpZGUoc2tpbGxTcHJpdGUsIGFjdG9yU3ByaXRlLCBza2lsbFJlY3QsIGFjdG9yUmVjdCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIC8vIOWSjOinkuiJsueisOaSnuajgOa1i+WvueavlO+8jOaKgOiDveeisOaSnuajgOa1i+aXoGRlbHRhXG4gICAgICByZXR1cm4gcGl4ZWxDb2xsaWRlKGRhdGEuQSwgZGF0YS5CKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxufSkoKTtcbiJdfQ==

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

  var popupCache = new Map();

  Game.assign("popup", function (obj, text) {
    var adjustX = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var adjustY = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    if (popupCache.has(obj)) {
      var popup = popupCache.get(obj);
      Game.layers.dialogueLayer.removeChild(popup.container);
      clearInterval(popup.timer);
      popupCache["delete"](obj);
    }

    var dialogueText = new Sprite.Text({
      text: text,
      maxWidth: 200
    });

    var w = dialogueText.width;
    var h = dialogueText.height;
    var middle = Math.round((w + 10) / 2);

    var dialogueBox = new Sprite.Shape();

    dialogueBox.polygon({
      points: "0,0 " + (w + 10) + ",0 " + (w + 10) + "," + (h + 10) + " " + (middle + 5) + "," + (h + 10) + " " + middle + "," + (h + 15) + " " + (middle - 5) + "," + (h + 10) + " 0," + (h + 10) + " 0,0",
      fill: "white"
    });

    var dialogueContainer = new Sprite.Container();
    dialogueContainer.appendChild(dialogueBox, dialogueText);
    dialogueText.x = 5;
    dialogueText.y = 5;
    dialogueContainer.x = obj.x + adjustX;
    dialogueContainer.y = obj.y + adjustY;
    dialogueContainer.centerX = middle;
    dialogueContainer.centerY = h + 15;

    Game.layers.dialogueLayer.appendChild(dialogueContainer);

    if (obj instanceof Sprite.Event) {
      obj.on("change", function () {
        dialogueContainer.x = obj.x + adjustX;
        dialogueContainer.y = obj.y + adjustY;
      });
    }

    var timer = setTimeout(function () {
      if (popupCache.has(obj)) {
        var popup = popupCache.get(obj);
        Game.layers.dialogueLayer.removeChild(popup.container);
        popupCache["delete"](obj);
      }
    }, 3000);

    popupCache.set(obj, {
      container: dialogueContainer,
      timer: timer
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVVSS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUUzQixNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQTRCO1FBQTFCLE9BQU8seURBQUcsQ0FBQztRQUFFLE9BQU8seURBQUcsQ0FBQzs7QUFFaEUsUUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFVBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2RCxtQkFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixnQkFBVSxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEI7O0FBRUQsUUFBSSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2pDLFVBQUksRUFBRSxJQUFJO0FBQ1YsY0FBUSxFQUFFLEdBQUc7S0FDZCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztBQUMzQixRQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0FBQzVCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXRDLFFBQUksV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVyQyxlQUFXLENBQUMsT0FBTyxDQUFDO0FBQ2xCLFlBQU0sWUFBUyxDQUFDLEdBQUMsRUFBRSxDQUFBLFlBQU0sQ0FBQyxHQUFDLEVBQUUsQ0FBQSxVQUFJLENBQUMsR0FBQyxFQUFFLENBQUEsVUFBSSxNQUFNLEdBQUMsQ0FBQyxDQUFBLFVBQUksQ0FBQyxHQUFDLEVBQUUsQ0FBQSxTQUFJLE1BQU0sVUFBSSxDQUFDLEdBQUMsRUFBRSxDQUFBLFVBQUksTUFBTSxHQUFDLENBQUMsQ0FBQSxVQUFJLENBQUMsR0FBQyxFQUFFLENBQUEsWUFBTSxDQUFDLEdBQUMsRUFBRSxDQUFBLFNBQU07QUFDL0csVUFBSSxFQUFFLE9BQU87S0FDZCxDQUFDLENBQUM7O0FBRUgsUUFBSSxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMvQyxxQkFBaUIsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3pELGdCQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixnQkFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIscUJBQWlCLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3RDLHFCQUFpQixDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUN0QyxxQkFBaUIsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ25DLHFCQUFpQixDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVuQyxRQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxHQUFHLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRTtBQUMvQixTQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxZQUFZO0FBQzNCLHlCQUFpQixDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUN0Qyx5QkFBaUIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7T0FDdkMsQ0FBQyxDQUFDO0tBQ0o7O0FBRUQsUUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLFlBQU07QUFDM0IsVUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFlBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2RCxrQkFBVSxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDeEI7S0FDRixFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVULGNBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ2xCLGVBQVMsRUFBRSxpQkFBaUI7QUFDNUIsV0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lVUkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgcG9wdXBDYWNoZSA9IG5ldyBNYXAoKTtcblxuICBHYW1lLmFzc2lnbihcInBvcHVwXCIsIGZ1bmN0aW9uIChvYmosIHRleHQsIGFkanVzdFggPSAwLCBhZGp1c3RZID0gMCkge1xuXG4gICAgaWYgKHBvcHVwQ2FjaGUuaGFzKG9iaikpIHtcbiAgICAgIGxldCBwb3B1cCA9IHBvcHVwQ2FjaGUuZ2V0KG9iaik7XG4gICAgICBHYW1lLmxheWVycy5kaWFsb2d1ZUxheWVyLnJlbW92ZUNoaWxkKHBvcHVwLmNvbnRhaW5lcik7XG4gICAgICBjbGVhckludGVydmFsKHBvcHVwLnRpbWVyKTtcbiAgICAgIHBvcHVwQ2FjaGUuZGVsZXRlKG9iaik7XG4gICAgfVxuXG4gICAgbGV0IGRpYWxvZ3VlVGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgbWF4V2lkdGg6IDIwMCxcbiAgICB9KTtcblxuICAgIGxldCB3ID0gZGlhbG9ndWVUZXh0LndpZHRoO1xuICAgIGxldCBoID0gZGlhbG9ndWVUZXh0LmhlaWdodDtcbiAgICBsZXQgbWlkZGxlID0gTWF0aC5yb3VuZCgodyArIDEwKSAvIDIpO1xuXG4gICAgbGV0IGRpYWxvZ3VlQm94ID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuXG4gICAgZGlhbG9ndWVCb3gucG9seWdvbih7XG4gICAgICBwb2ludHM6IGAwLDAgJHt3KzEwfSwwICR7dysxMH0sJHtoKzEwfSAke21pZGRsZSs1fSwke2grMTB9ICR7bWlkZGxlfSwke2grMTV9ICR7bWlkZGxlLTV9LCR7aCsxMH0gMCwke2grMTB9IDAsMGAsXG4gICAgICBmaWxsOiBcIndoaXRlXCJcbiAgICB9KTtcblxuICAgIGxldCBkaWFsb2d1ZUNvbnRhaW5lciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgZGlhbG9ndWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZGlhbG9ndWVCb3gsIGRpYWxvZ3VlVGV4dCk7XG4gICAgZGlhbG9ndWVUZXh0LnggPSA1O1xuICAgIGRpYWxvZ3VlVGV4dC55ID0gNTtcbiAgICBkaWFsb2d1ZUNvbnRhaW5lci54ID0gb2JqLnggKyBhZGp1c3RYO1xuICAgIGRpYWxvZ3VlQ29udGFpbmVyLnkgPSBvYmoueSArIGFkanVzdFk7XG4gICAgZGlhbG9ndWVDb250YWluZXIuY2VudGVyWCA9IG1pZGRsZTtcbiAgICBkaWFsb2d1ZUNvbnRhaW5lci5jZW50ZXJZID0gaCArIDE1O1xuXG4gICAgR2FtZS5sYXllcnMuZGlhbG9ndWVMYXllci5hcHBlbmRDaGlsZChkaWFsb2d1ZUNvbnRhaW5lcik7XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgU3ByaXRlLkV2ZW50KSB7XG4gICAgICBvYmoub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkaWFsb2d1ZUNvbnRhaW5lci54ID0gb2JqLnggKyBhZGp1c3RYO1xuICAgICAgICBkaWFsb2d1ZUNvbnRhaW5lci55ID0gb2JqLnkgKyBhZGp1c3RZO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAocG9wdXBDYWNoZS5oYXMob2JqKSkge1xuICAgICAgICBsZXQgcG9wdXAgPSBwb3B1cENhY2hlLmdldChvYmopO1xuICAgICAgICBHYW1lLmxheWVycy5kaWFsb2d1ZUxheWVyLnJlbW92ZUNoaWxkKHBvcHVwLmNvbnRhaW5lcik7XG4gICAgICAgIHBvcHVwQ2FjaGUuZGVsZXRlKG9iaik7XG4gICAgICB9XG4gICAgfSwgMzAwMCk7XG5cbiAgICBwb3B1cENhY2hlLnNldChvYmosIHtcbiAgICAgIGNvbnRhaW5lcjogZGlhbG9ndWVDb250YWluZXIsXG4gICAgICB0aW1lcjogdGltZXJcbiAgICB9KTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  // 游戏无论什么时候都需要预加载的内容
  function Preload() {
    return new Promise(function (resolve, reject) {
      var promises = new Set();

      var preloadSoundEffects = {
        hurt: "sound/effect/hurt.ogg" // 伤害效果音
      };

      for (var key in preloadSoundEffects) {
        promises.add((function (key, url) {
          return new Promise(function (resolve, reject) {
            if (Game.sounds && Game.sounds[key]) {
              resolve();
            } else {
              Sprite.load(url).then(function (data) {
                Game.sounds[key] = data[0];
                resolve();
              });
            }
          });
        })(key, preloadSoundEffects[key]));
      }

      var preloadItems = ["bag", // 掉落物品用的小包
      "gold" // 金币图标
      ];

      preloadItems.forEach(function (id) {
        promises.add(new Promise(function (resolve, reject) {
          if (Game.items && Game.items[id]) {
            resolve();
          } else {
            Game.Item.load(id).then(function (itemObj) {
              resolve();
            });
          }
        }));
      });

      Promise.all(promises).then(function () {
        resolve();
      });
    });
  }

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id) {
    return new Promise(function (resolve, reject) {

      Game.Map.load(id).then(function (mapObj) {

        var area = {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        var promises = new Set();

        promises.add(Preload());

        if (mapObj.data.actors) {
          mapObj.data.actors.forEach(function (element) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(element.id).then(function (actorObj) {

                for (var key in element) {
                  actorObj.data[key] = element[key];
                }

                area.actors.add(actorObj);
                actorObj.draw();
                resolve();
              });
            }));
          });
        }

        if (mapObj.spawnMonster && mapObj.spawnMonster.list && mapObj.spawnMonster.count) {
          var _loop = function (monsterId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(monsterId).then(function () {
                resolve();
              });
            }));
          };

          for (var monsterId in mapObj.spawnMonster.list) {
            _loop(monsterId);
          }
        }

        if (mapObj.spawnItem && mapObj.spawnItem.list && mapObj.spawnItem.count) {
          var _loop2 = function (itemId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Item.load(itemId).then(function () {
                resolve();
              });
            }));
          };

          for (var itemId in mapObj.spawnItem.list) {
            _loop2(itemId);
          }
        }

        if (mapObj.data.onto) {
          mapObj.data.onto.forEach(function (element) {
            area.onto.push(element);
          });
        }

        if (mapObj.data.touch) {
          mapObj.data.touch.forEach(function (element) {
            area.touch.push(element);
          });
        }

        Promise.all(promises).then(function () {
          resolve(area);
        });
      }); //map
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBcmVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOzs7QUFHYixXQUFTLE9BQU8sR0FBSTtBQUNsQixXQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxVQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUV6QixVQUFJLG1CQUFtQixHQUFHO0FBQ3hCLFlBQUksRUFBRSx1QkFBdUI7T0FDOUIsQ0FBQzs7QUFFRixXQUFLLElBQUksR0FBRyxJQUFJLG1CQUFtQixFQUFFO0FBQ25DLGdCQUFRLENBQUMsR0FBRyxDQUNWLENBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ25CLGlCQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxnQkFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbkMscUJBQU8sRUFBRSxDQUFDO2FBQ1gsTUFBTTtBQUNMLG9CQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNwQyxvQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsdUJBQU8sRUFBRSxDQUFDO2VBQ1gsQ0FBQyxDQUFDO2FBQ0o7V0FDRixDQUFDLENBQUM7U0FDSixDQUFBLENBQUUsR0FBRyxFQUFFLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ2xDLENBQUM7T0FDSDs7QUFFRCxVQUFJLFlBQVksR0FBRyxDQUNqQixLQUFLO0FBQ0wsWUFBTTtPQUNQLENBQUM7O0FBRUYsa0JBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVB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ZUFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIOa4uOaIj+aXoOiuuuS7gOS5iOaXtuWAmemDvemcgOimgemihOWKoOi9veeahOWGheWuuVxuICBmdW5jdGlvbiBQcmVsb2FkICgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IHByb21pc2VzID0gbmV3IFNldCgpO1xuXG4gICAgICBsZXQgcHJlbG9hZFNvdW5kRWZmZWN0cyA9IHtcbiAgICAgICAgaHVydDogXCJzb3VuZC9lZmZlY3QvaHVydC5vZ2dcIiAvLyDkvKTlrrPmlYjmnpzpn7NcbiAgICAgIH07XG5cbiAgICAgIGZvciAobGV0IGtleSBpbiBwcmVsb2FkU291bmRFZmZlY3RzKSB7XG4gICAgICAgIHByb21pc2VzLmFkZChcbiAgICAgICAgICAoZnVuY3Rpb24gKGtleSwgdXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBpZiAoR2FtZS5zb3VuZHMgJiYgR2FtZS5zb3VuZHNba2V5XSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBTcHJpdGUubG9hZCh1cmwpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIEdhbWUuc291bmRzW2tleV0gPSBkYXRhWzBdO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KShrZXksIHByZWxvYWRTb3VuZEVmZmVjdHNba2V5XSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHByZWxvYWRJdGVtcyA9IFtcbiAgICAgICAgXCJiYWdcIiwgLy8g5o6J6JC954mp5ZOB55So55qE5bCP5YyFXG4gICAgICAgIFwiZ29sZFwiIC8vIOmHkeW4geWbvuagh1xuICAgICAgXTtcblxuICAgICAgcHJlbG9hZEl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHByb21pc2VzLmFkZChcbiAgICAgICAgICBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoR2FtZS5pdGVtcyAmJiBHYW1lLml0ZW1zW2lkXSkge1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBHYW1lLkl0ZW0ubG9hZChpZCkudGhlbihmdW5jdGlvbiAoaXRlbU9iaikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g5Yqg6L295Yy65Z+f77yM5oqK5ous5Zyw5Zu+77yM6KeS6Imy77yM54mp5ZOBXG4gIEdhbWUuYXNzaWduKFwibG9hZEFyZWFcIiwgZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgR2FtZS5NYXAubG9hZChpZCkudGhlbihmdW5jdGlvbiAobWFwT2JqKSB7XG5cbiAgICAgICAgbGV0IGFyZWEgPSB7XG4gICAgICAgICAgYWN0b3JzOiBuZXcgU2V0KCksIC8vIOinkuiJslxuICAgICAgICAgIGJhZ3M6IG5ldyBTZXQoKSwgLy8g5o6J6JC95bCP5YyFXG4gICAgICAgICAgaXRlbXM6IG5ldyBTZXQoKSwgLy8g5YW25LuW54mp5ZOB77yI5pyJ56Kw5pKe77yJXG4gICAgICAgICAgdG91Y2g6IFtdLCAvLyB0b3VjaOaIlm9udG/kvJrop6blj5HnmoTlnLDngrkv54mp5ZOBXG4gICAgICAgICAgb250bzogW10sIC8vIG9udG/kvJrop6blj5HnmoTlnLDngrkv54mp5ZOBXG4gICAgICAgICAgbWFwOiBtYXBPYmpcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAgICAgcHJvbWlzZXMuYWRkKFByZWxvYWQoKSk7XG5cbiAgICAgICAgaWYgKG1hcE9iai5kYXRhLmFjdG9ycykge1xuICAgICAgICAgIG1hcE9iai5kYXRhLmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5hZGQoXG4gICAgICAgICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICBHYW1lLkFjdG9yLmxvYWQoZWxlbWVudC5pZCkudGhlbihmdW5jdGlvbiAoYWN0b3JPYmopIHtcblxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0b3JPYmouZGF0YVtrZXldID0gZWxlbWVudFtrZXldO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBhcmVhLmFjdG9ycy5hZGQoYWN0b3JPYmopO1xuICAgICAgICAgICAgICAgICAgYWN0b3JPYmouZHJhdygpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBtYXBPYmouc3Bhd25Nb25zdGVyICYmXG4gICAgICAgICAgbWFwT2JqLnNwYXduTW9uc3Rlci5saXN0ICYmXG4gICAgICAgICAgbWFwT2JqLnNwYXduTW9uc3Rlci5jb3VudFxuICAgICAgICApIHtcbiAgICAgICAgICBmb3IgKGxldCBtb25zdGVySWQgaW4gbWFwT2JqLnNwYXduTW9uc3Rlci5saXN0KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5hZGQoXG4gICAgICAgICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICBHYW1lLkFjdG9yLmxvYWQobW9uc3RlcklkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG1hcE9iai5zcGF3bkl0ZW0gJiZcbiAgICAgICAgICBtYXBPYmouc3Bhd25JdGVtLmxpc3QgJiZcbiAgICAgICAgICBtYXBPYmouc3Bhd25JdGVtLmNvdW50XG4gICAgICAgICkge1xuICAgICAgICAgIGZvciAobGV0IGl0ZW1JZCBpbiBtYXBPYmouc3Bhd25JdGVtLmxpc3QpIHtcbiAgICAgICAgICAgIHByb21pc2VzLmFkZChcbiAgICAgICAgICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIEdhbWUuSXRlbS5sb2FkKGl0ZW1JZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBPYmouZGF0YS5vbnRvKSB7XG4gICAgICAgICAgbWFwT2JqLmRhdGEub250by5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBhcmVhLm9udG8ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBPYmouZGF0YS50b3VjaCkge1xuICAgICAgICAgIG1hcE9iai5kYXRhLnRvdWNoLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGFyZWEudG91Y2gucHVzaChlbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXNvbHZlKGFyZWEpO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7IC8vbWFwXG5cbiAgICB9KTtcbiAgfSk7XG5cbn0pKCk7XG4iXX0=

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

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Game.assign("Map", (function (_Sprite$Event) {
    _inherits(GameMap, _Sprite$Event);

    _createClass(GameMap, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (internal(this).blockedMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitWater",
      value: function hitWater(x, y) {
        if (internal(this).waterMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitAutoHide",
      value: function hitAutoHide(x, y) {
        if (internal(this).autoHideMap[x * 10000 + y]) {
          return internal(this).autoHideMap[x * 10000 + y];
        }
        return null;
      }
    }, {
      key: "blockedMap",
      get: function get() {
        return internal(this).blockedMap;
      },
      set: function set(value) {
        throw new Error("Game.Map.blockedMap readonly");
      }
    }], [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("map/" + id + ".json", "map/" + id + ".js").then(function (data) {
            var _data = _slicedToArray(data, 2);

            var mapData = _data[0];
            var mapInfo = _data[1];

            mapInfo = mapInfo(); // map/id.js文件会返回一个函数
            mapData.id = id;

            for (var key in mapInfo) {
              if (mapData.hasOwnProperty(key)) {
                console.log(key, mapData[key], mapInfo[key], mapInfo, mapData);
                throw new Error("Game.loadArea invalid data");
              }
              mapData[key] = mapInfo[key];
            }

            var mapObj = new Game.Map(mapData);
            mapObj.on("complete", function () {
              resolve(mapObj);
            });
          });
        });
      }
    }]);

    function GameMap(mapData) {
      var _this = this;

      _classCallCheck(this, GameMap);

      _get(Object.getPrototypeOf(GameMap.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.data = mapData;

      var images = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.data.tilesets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          images.push("map/" + element.image);
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

      ;

      Sprite.load(images).then(function (data) {

        // 释放空间
        privates.data.tilesets = null;

        privates.sheet = new Sprite.Sheet({
          images: data,
          width: privates.data.tilewidth,
          height: privates.data.tileheight
        });

        // 水地图，用来进行hitWater测试
        privates.waterMap = {};
        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        privates.blockedMap = {};
        // 某些层在玩家走到其中后会自动隐藏
        privates.autoHideMap = {};

        // 保存这个地图的所有地图块
        // 这个空间在draw后会释放
        privates.layers = [];

        console.time("do map");

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.data.layers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var layerData = _step2.value;

            var layerObj = null;
            if (layerData.name != "block" && layerData.name != "water") {
              layerObj = new Sprite.Container();
              layerObj.name = layerData.name;
              privates.layers.push(layerObj);
            }

            var width = _this.col;
            var height = _this.row;
            for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                var position = x + y * width;
                var key = x * 10000 + y;
                var picture = layerData.data[position] - 1;

                if (picture >= 0) {
                  if (layerData.name == "block") {
                    privates.blockedMap[key] = true;
                  } else if (layerData.name == "water") {
                    privates.waterMap[key] = true;
                  } else {
                    var frame = privates.sheet.getFrame(picture);
                    frame.x = x * privates.data.tilewidth;
                    frame.y = y * privates.data.tileheight;

                    if (layerData.properties && layerData.properties.autohide) {
                      privates.autoHideMap[key] = layerData.properties.autohide;
                    }

                    layerObj.appendChild(frame);
                  }
                }
              }
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

        console.timeEnd("do map");

        // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
        _this.emit("complete", true);
      });
    }

    _createClass(GameMap, [{
      key: "tile",

      // 返回某个坐标点所在的地格
      value: function tile(x, y) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
          return {
            x: Math.floor(x / this.data.tilewidth),
            y: Math.floor(y / this.data.tileheight)
          };
        } else {
          console.error(x, y, this.data);
          throw new Error("Game.Map.tile got invalid arguments");
        }
      }

      // 绘制图片，会改变Game.currentArea
    }, {
      key: "draw",
      value: function draw() {
        var _this2 = this;

        var privates = internal(this);
        Game.layers.mapLayer.clear();
        Game.layers.mapHideLayer.clear();

        var autohideLayer = {};

        privates.layers.forEach(function (element, index) {
          var layerData = privates.data.layers[index];

          if (Number.isFinite(layerData.opacity)) {
            element.alpha = layerData.opacity;
          }

          if (layerData.properties && layerData.properties.autohide) {
            var group = layerData.properties.autohide;
            if (!autohideLayer[group]) {
              autohideLayer[group] = new Sprite.Container();
            }
            autohideLayer[group].appendChild(element);
          } else {
            Game.layers.mapLayer.appendChild(element);
          }
        });

        // 释放冗余空间
        privates.layers = null;
        privates.data.layers = null;

        // 给所有自动隐藏的地图缓冲层
        for (var group in autohideLayer) {
          autohideLayer[group].cache();
          var autohideMap = new Sprite.Bitmap(autohideLayer[group].cacheCanvas);
          autohideMap.x = autohideLayer[group].cacheX;
          autohideMap.y = autohideLayer[group].cacheY;
          autohideMap.name = group;
          Game.layers.mapHideLayer.appendChild(autohideMap);
        }
        autohideLayer = null;

        // 给其他地图缓冲层
        Game.layers.mapLayer.cache();
        var map = new Sprite.Bitmap(Game.layers.mapLayer.cacheCanvas);
        Game.layers.mapLayer.clear();
        Game.layers.mapLayer.appendChild(map);

        var minimap = document.createElement("canvas");
        minimap.width = this.col * 8; // 原地图的四倍
        minimap.height = this.row * 8;
        var minimapContext = minimap.getContext("2d");
        minimapContext.drawImage(map.image, 0, 0, map.width, map.height, 0, 0, minimap.width, minimap.height);

        privates.minimap = minimap;

        if (privates.data.bgm) {
          // set loop = -1, 无限循环
          //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
          //bgm.setVolume(0.2);
        }

        var block = {};

        // 预设人物占位
        if (privates.data.actors) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = privates.data.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var actor = _step3.value;

              block[actor.x * 10000 + actor.y] = true;
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
        }

        // 生成怪物
        if (privates.data.spawnMonster && privates.data.spawnMonster.list && privates.data.spawnMonster.count) {
          for (var i = 0, len = privates.data.spawnMonster.count; i < len; i++) {
            var monsterId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnMonster.list) {
              prob += privates.data.spawnMonster.list[key];
              if (r < prob) {
                monsterId = key;
                break;
              }
            }
            if (!monsterId) {
              monsterId = Object.keys(privates.data.spawnMonster.list)[0];
            }
            Game.Actor.load(monsterId).then(function (actorObj) {
              var x = undefined,
                  y = undefined;
              while (true) {
                x = Sprite.rand(0, _this2.col);
                y = Sprite.rand(0, _this2.row);
                if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                  break;
                }
              }
              block[x * 10000 + y] = true;
              actorObj.x = x;
              actorObj.y = y;
              Game.area.actors.add(actorObj);
              actorObj.draw();
            });
          }
        }

        if (privates.data.spawnItem && privates.data.spawnItem.list && privates.data.spawnItem.count) {
          var _loop = function (i, len) {
            var itemId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnItem.list) {
              prob += privates.data.spawnItem.list[key];
              if (r < prob) {
                itemId = key;
                break;
              }
            }
            if (!itemId) {
              itemId = Object.keys(privates.data.spawnItem.list)[0];
            }
            Game.Item.load(itemId).then(function (itemObj) {
              var x = undefined,
                  y = undefined;
              while (true) {
                x = Sprite.rand(0, _this2.col);
                y = Sprite.rand(0, _this2.row);
                if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                  break;
                }
              }
              block[x * 10000 + y] = true;
              itemObj.x = x;
              itemObj.y = y;
              itemObj.inner = {};
              itemObj.inner[itemId] = 1;
              Game.area.items.add(itemObj);
              itemObj.draw();
            });
          };

          for (var i = 0, len = privates.data.spawnItem.count; i < len; i++) {
            _loop(i, len);
          }
        }
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        throw new Error("Game.Map.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).id;
      },
      set: function set(value) {
        throw new Error("Game.Map.id readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return this.data.width * this.data.tilewidth;
      },
      set: function set(value) {
        throw new Error("Game.Map.width readonly");
      }
    }, {
      key: "height",
      get: function get() {
        return this.data.height * this.data.tileheight;
      },
      set: function set(value) {
        throw new Error("Game.Map.height readonly");
      }
    }, {
      key: "col",
      get: function get() {
        // width / tilewidth
        return this.data.width;
      },
      set: function set(value) {
        throw new Error("Game.Map.col readonly");
      }
    }, {
      key: "row",
      get: function get() {
        // height / tileheight
        return this.data.height;
      },
      set: function set(value) {
        throw new Error("Game.Map.row readonly");
      }
    }, {
      key: "minimap",
      get: function get() {
        return internal(this).minimap;
      },
      set: function set(value) {
        throw new Error("Game.Map.minimap readonly");
      }
    }]);

    return GameMap;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2NBQVEsT0FBTzs7aUJBQVAsT0FBTzs7YUF5QnRCLGlCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN4QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0QyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVXLHFCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakIsWUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekMsaUJBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0FBQ0QsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBRWMsZUFBRztBQUNoQixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUM7T0FDbEM7V0FFYyxhQUFDLEtBQUssRUFBRTtBQUNyQixjQUFNLElBQUks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SUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7T0FDOUM7V0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixjQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7T0FDNUM7OztXQUVVLGVBQUc7QUFDWixlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO09BQ2hEO1dBRVUsYUFBQyxLQUFLLEVBQUU7QUFDakIsY0FBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO09BQzdDOzs7V0FFTyxlQUFHOztBQUNULGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDeEI7V0FFTyxhQUFDLEtBQUssRUFBRTtBQUNkLGNBQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztPQUMxQzs7O1dBRU8sZUFBRzs7QUFDVCxlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO09BQ3hCO1dBRU8sYUFBQyxLQUFLLEVBQUU7QUFDZCxjQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7T0FDMUM7OztXQUVXLGVBQUc7QUFDYixlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7T0FDL0I7V0FFVyxhQUFDLEtBQUssRUFBRTtBQUNsQixjQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7T0FDOUM7OztXQTVMc0IsT0FBTztLQUFTLE1BQU0sQ0FBQyxLQUFLLEVBbVduRCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZU1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBHYW1lLmFzc2lnbihcIk1hcFwiLCBjbGFzcyBHYW1lTWFwIGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcblxuICAgIHN0YXRpYyBsb2FkIChpZCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgU3ByaXRlLmxvYWQoYG1hcC8ke2lkfS5qc29uYCwgYG1hcC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgW21hcERhdGEsIG1hcEluZm9dID0gZGF0YTtcbiAgICAgICAgICBtYXBJbmZvID0gbWFwSW5mbygpOyAvLyBtYXAvaWQuanPmlofku7bkvJrov5Tlm57kuIDkuKrlh73mlbBcbiAgICAgICAgICBtYXBEYXRhLmlkID0gaWQ7XG5cbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWFwSW5mbykge1xuICAgICAgICAgICAgaWYgKG1hcERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhrZXksIG1hcERhdGFba2V5XSwgbWFwSW5mb1trZXldLCBtYXBJbmZvLCBtYXBEYXRhKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5sb2FkQXJlYSBpbnZhbGlkIGRhdGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBEYXRhW2tleV0gPSBtYXBJbmZvW2tleV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IG1hcE9iaiA9IG5ldyBHYW1lLk1hcChtYXBEYXRhKTtcbiAgICAgICAgICBtYXBPYmoub24oXCJjb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlKG1hcE9iaik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoaXRUZXN0ICh4LCB5KSB7XG4gICAgICBpZiAoaW50ZXJuYWwodGhpcykuYmxvY2tlZE1hcFt4KjEwMDAwK3ldKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpdFdhdGVyICh4LCB5KSB7XG4gICAgICBpZiAoaW50ZXJuYWwodGhpcykud2F0ZXJNYXBbeCoxMDAwMCt5XSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXRBdXRvSGlkZSAoeCwgeSkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmF1dG9IaWRlTWFwW3gqMTAwMDAreV0pIHtcbiAgICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmF1dG9IaWRlTWFwW3gqMTAwMDAreV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYmxvY2tlZE1hcCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmxvY2tlZE1hcDtcbiAgICB9XG5cbiAgICBzZXQgYmxvY2tlZE1hcCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmJsb2NrZWRNYXAgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKG1hcERhdGEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRhdGEgPSBtYXBEYXRhO1xuXG4gICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHByaXZhdGVzLmRhdGEudGlsZXNldHMpIHtcbiAgICAgICAgaW1hZ2VzLnB1c2goYG1hcC8ke2VsZW1lbnQuaW1hZ2V9YCk7XG4gICAgICB9O1xuXG4gICAgICBTcHJpdGUubG9hZChpbWFnZXMpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAvLyDph4rmlL7nqbrpl7RcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS50aWxlc2V0cyA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZXMuc2hlZXQgPSBuZXcgU3ByaXRlLlNoZWV0KHtcbiAgICAgICAgICBpbWFnZXM6IGRhdGEsXG4gICAgICAgICAgd2lkdGg6IHByaXZhdGVzLmRhdGEudGlsZXdpZHRoLFxuICAgICAgICAgIGhlaWdodDogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDmsLTlnLDlm77vvIznlKjmnaXov5vooYxoaXRXYXRlcua1i+ivlVxuICAgICAgICBwcml2YXRlcy53YXRlck1hcCA9IHt9O1xuICAgICAgICAvLyDorqHnrpfpmLvmjKHlnLDlm77vvIzlpoLmnpzkuLpvYmplY3TliJnmnInpmLvmjKHvvIx1bmRlZmluZWTliJnml6DpmLvmjKFcbiAgICAgICAgcHJpdmF0ZXMuYmxvY2tlZE1hcCA9IHt9O1xuICAgICAgICAvLyDmn5DkupvlsYLlnKjnjqnlrrbotbDliLDlhbbkuK3lkI7kvJroh6rliqjpmpDol49cbiAgICAgICAgcHJpdmF0ZXMuYXV0b0hpZGVNYXAgPSB7fTtcblxuICAgICAgICAvLyDkv53lrZjov5nkuKrlnLDlm77nmoTmiYDmnInlnLDlm77lnZdcbiAgICAgICAgLy8g6L+Z5Liq56m66Ze05ZyoZHJhd+WQjuS8mumHiuaUvlxuICAgICAgICBwcml2YXRlcy5sYXllcnMgPSBbXTtcblxuICAgICAgICBjb25zb2xlLnRpbWUoXCJkbyBtYXBcIik7XG5cbiAgICAgICAgZm9yIChsZXQgbGF5ZXJEYXRhIG9mIHByaXZhdGVzLmRhdGEubGF5ZXJzKSB7XG4gICAgICAgICAgbGV0IGxheWVyT2JqID0gbnVsbDtcbiAgICAgICAgICBpZiAobGF5ZXJEYXRhLm5hbWUgIT0gXCJibG9ja1wiICYmIGxheWVyRGF0YS5uYW1lICE9IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgbGF5ZXJPYmogPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgbGF5ZXJPYmoubmFtZSA9IGxheWVyRGF0YS5uYW1lO1xuICAgICAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLnB1c2gobGF5ZXJPYmopO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuY29sO1xuICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLnJvdztcbiAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0geCArIHkgKiB3aWR0aDtcbiAgICAgICAgICAgICAgbGV0IGtleSA9IHggKiAxMDAwMCArIHk7XG4gICAgICAgICAgICAgIGxldCBwaWN0dXJlID0gbGF5ZXJEYXRhLmRhdGFbcG9zaXRpb25dIC0gMTtcblxuICAgICAgICAgICAgICBpZiAocGljdHVyZSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxheWVyRGF0YS5uYW1lID09IFwiYmxvY2tcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYmxvY2tlZE1hcFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxheWVyRGF0YS5uYW1lID09IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMud2F0ZXJNYXBba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IHByaXZhdGVzLnNoZWV0LmdldEZyYW1lKHBpY3R1cmUpO1xuICAgICAgICAgICAgICAgICAgZnJhbWUueCA9IHggKiBwcml2YXRlcy5kYXRhLnRpbGV3aWR0aDtcbiAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSB5ICogcHJpdmF0ZXMuZGF0YS50aWxlaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICBpZiAobGF5ZXJEYXRhLnByb3BlcnRpZXMgJiYgbGF5ZXJEYXRhLnByb3BlcnRpZXMuYXV0b2hpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZXMuYXV0b0hpZGVNYXBba2V5XSA9IGxheWVyRGF0YS5wcm9wZXJ0aWVzLmF1dG9oaWRlO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBsYXllck9iai5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJkbyBtYXBcIik7XG5cbiAgICAgICAgLy8g5Y+R6YCB5a6M5oiQ5LqL5Lu277yM56ys5LqM5Liq5Y+C5pWw5Luj6KGo5q2k5LqL5Lu25piv5LiA5qyh5oCn5LqL5Lu277yM5Y2z5LiN5Lya5YaN5qyhY29tcGxldGVcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgdHJ1ZSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgIH1cblxuICAgIHNldCBkYXRhICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmlkIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoICogdGhpcy5kYXRhLnRpbGV3aWR0aDtcbiAgICB9XG5cbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC53aWR0aCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEuaGVpZ2h0ICogdGhpcy5kYXRhLnRpbGVoZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmhlaWdodCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgY29sICgpIHsgLy8gd2lkdGggLyB0aWxld2lkdGhcbiAgICAgIHJldHVybiB0aGlzLmRhdGEud2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IGNvbCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuTWFwLmNvbCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcm93ICgpIHsgLy8gaGVpZ2h0IC8gdGlsZWhlaWdodFxuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oZWlnaHRcbiAgICB9XG5cbiAgICBzZXQgcm93ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAucm93IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBtaW5pbWFwICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5taW5pbWFwO1xuICAgIH1cblxuICAgIHNldCBtaW5pbWFwICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5NYXAubWluaW1hcCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvLyDov5Tlm57mn5DkuKrlnZDmoIfngrnmiYDlnKjnmoTlnLDmoLxcbiAgICB0aWxlICh4LCB5KSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHgpICYmIE51bWJlci5pc0Zpbml0ZSh5KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IE1hdGguZmxvb3IoeCAvIHRoaXMuZGF0YS50aWxld2lkdGgpLFxuICAgICAgICAgIHk6IE1hdGguZmxvb3IoeSAvIHRoaXMuZGF0YS50aWxlaGVpZ2h0KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih4LCB5LCB0aGlzLmRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLk1hcC50aWxlIGdvdCBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDnu5jliLblm77niYfvvIzkvJrmlLnlj5hHYW1lLmN1cnJlbnRBcmVhXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNsZWFyKCk7XG4gICAgICBHYW1lLmxheWVycy5tYXBIaWRlTGF5ZXIuY2xlYXIoKTtcblxuICAgICAgbGV0IGF1dG9oaWRlTGF5ZXIgPSB7fTtcblxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBsYXllckRhdGEgPSBwcml2YXRlcy5kYXRhLmxheWVyc1tpbmRleF07XG5cbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShsYXllckRhdGEub3BhY2l0eSkpIHtcbiAgICAgICAgICBlbGVtZW50LmFscGhhID0gbGF5ZXJEYXRhLm9wYWNpdHk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGF5ZXJEYXRhLnByb3BlcnRpZXMgJiYgbGF5ZXJEYXRhLnByb3BlcnRpZXMuYXV0b2hpZGUpIHtcbiAgICAgICAgICBsZXQgZ3JvdXAgPSBsYXllckRhdGEucHJvcGVydGllcy5hdXRvaGlkZTtcbiAgICAgICAgICBpZiAoIWF1dG9oaWRlTGF5ZXJbZ3JvdXBdKSB7XG4gICAgICAgICAgICBhdXRvaGlkZUxheWVyW2dyb3VwXSA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGF1dG9oaWRlTGF5ZXJbZ3JvdXBdLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6YeK5pS+5YaX5L2Z56m66Ze0XG4gICAgICBwcml2YXRlcy5sYXllcnMgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuZGF0YS5sYXllcnMgPSBudWxsO1xuXG4gICAgICAvLyDnu5nmiYDmnInoh6rliqjpmpDol4/nmoTlnLDlm77nvJPlhrLlsYJcbiAgICAgIGZvciAobGV0IGdyb3VwIGluIGF1dG9oaWRlTGF5ZXIpIHtcbiAgICAgICAgYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGUoKTtcbiAgICAgICAgbGV0IGF1dG9oaWRlTWFwID0gbmV3IFNwcml0ZS5CaXRtYXAoYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVDYW52YXMpO1xuICAgICAgICBhdXRvaGlkZU1hcC54ID0gYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVYO1xuICAgICAgICBhdXRvaGlkZU1hcC55ID0gYXV0b2hpZGVMYXllcltncm91cF0uY2FjaGVZO1xuICAgICAgICBhdXRvaGlkZU1hcC5uYW1lID0gZ3JvdXA7XG4gICAgICAgIEdhbWUubGF5ZXJzLm1hcEhpZGVMYXllci5hcHBlbmRDaGlsZChhdXRvaGlkZU1hcCk7XG4gICAgICB9XG4gICAgICBhdXRvaGlkZUxheWVyID0gbnVsbDtcblxuICAgICAgLy8g57uZ5YW25LuW5Zyw5Zu+57yT5Yay5bGCXG4gICAgICBHYW1lLmxheWVycy5tYXBMYXllci5jYWNoZSgpO1xuICAgICAgbGV0IG1hcCA9IG5ldyBTcHJpdGUuQml0bWFwKEdhbWUubGF5ZXJzLm1hcExheWVyLmNhY2hlQ2FudmFzKTtcbiAgICAgIEdhbWUubGF5ZXJzLm1hcExheWVyLmNsZWFyKCk7XG4gICAgICBHYW1lLmxheWVycy5tYXBMYXllci5hcHBlbmRDaGlsZChtYXApO1xuXG4gICAgICBsZXQgbWluaW1hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBtaW5pbWFwLndpZHRoID0gdGhpcy5jb2wgKiA4OyAvLyDljp/lnLDlm77nmoTlm5vlgI1cbiAgICAgIG1pbmltYXAuaGVpZ2h0ID0gdGhpcy5yb3cgKiA4O1xuICAgICAgbGV0IG1pbmltYXBDb250ZXh0ID0gbWluaW1hcC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBtaW5pbWFwQ29udGV4dC5kcmF3SW1hZ2UobWFwLmltYWdlLFxuICAgICAgICAwLCAwLCBtYXAud2lkdGgsIG1hcC5oZWlnaHQsXG4gICAgICAgIDAsIDAsIG1pbmltYXAud2lkdGgsIG1pbmltYXAuaGVpZ2h0KTtcblxuICAgICAgcHJpdmF0ZXMubWluaW1hcCA9IG1pbmltYXA7XG5cblxuICAgICAgaWYgKHByaXZhdGVzLmRhdGEuYmdtKSB7XG4gICAgICAgIC8vIHNldCBsb29wID0gLTEsIOaXoOmZkOW+queOr1xuICAgICAgICAvL2xldCBiZ20gPSBjcmVhdGVqcy5Tb3VuZC5wbGF5KHRoaXMuZGF0YS5iZ20sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIC0xKTtcbiAgICAgICAgLy9iZ20uc2V0Vm9sdW1lKDAuMik7XG4gICAgICB9XG5cbiAgICAgIGxldCBibG9jayA9IHt9O1xuXG4gICAgICAvLyDpooTorr7kurrnianljaDkvY1cbiAgICAgIGlmIChwcml2YXRlcy5kYXRhLmFjdG9ycykge1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBwcml2YXRlcy5kYXRhLmFjdG9ycykge1xuICAgICAgICAgIGJsb2NrW2FjdG9yLngqMTAwMDArYWN0b3IueV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOeUn+aIkOaAqueJqVxuICAgICAgaWYgKFxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3RlciAmJlxuICAgICAgICBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0ICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmNvdW50XG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmNvdW50OyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgbW9uc3RlcklkID0gbnVsbDtcbiAgICAgICAgICBsZXQgcHJvYiA9IDA7XG4gICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBwcml2YXRlcy5kYXRhLnNwYXduTW9uc3Rlci5saXN0KSB7XG4gICAgICAgICAgICBwcm9iICs9IHByaXZhdGVzLmRhdGEuc3Bhd25Nb25zdGVyLmxpc3Rba2V5XTtcbiAgICAgICAgICAgIGlmIChyIDwgcHJvYikge1xuICAgICAgICAgICAgICBtb25zdGVySWQgPSBrZXk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW1vbnN0ZXJJZCkge1xuICAgICAgICAgICAgbW9uc3RlcklkID0gT2JqZWN0LmtleXMocHJpdmF0ZXMuZGF0YS5zcGF3bk1vbnN0ZXIubGlzdClbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIEdhbWUuQWN0b3IubG9hZChtb25zdGVySWQpLnRoZW4oKGFjdG9yT2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgeCwgeTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHggPSBTcHJpdGUucmFuZCgwLCB0aGlzLmNvbCk7XG4gICAgICAgICAgICAgIHkgPSBTcHJpdGUucmFuZCgwLCB0aGlzLnJvdyk7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5oaXRUZXN0KHgsIHkpICYmICFibG9ja1t4KjEwMDAwK3ldKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrW3gqMTAwMDAreV0gPSB0cnVlO1xuICAgICAgICAgICAgYWN0b3JPYmoueCA9IHg7XG4gICAgICAgICAgICBhY3Rvck9iai55ID0geTtcbiAgICAgICAgICAgIEdhbWUuYXJlYS5hY3RvcnMuYWRkKGFjdG9yT2JqKTtcbiAgICAgICAgICAgIGFjdG9yT2JqLmRyYXcoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtICYmXG4gICAgICAgIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QgJiZcbiAgICAgICAgcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0uY291bnRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0uY291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtSWQgPSBudWxsO1xuICAgICAgICAgIGxldCBwcm9iID0gMDtcbiAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHByaXZhdGVzLmRhdGEuc3Bhd25JdGVtLmxpc3QpIHtcbiAgICAgICAgICAgIHByb2IgKz0gcHJpdmF0ZXMuZGF0YS5zcGF3bkl0ZW0ubGlzdFtrZXldO1xuICAgICAgICAgICAgaWYgKHIgPCBwcm9iKSB7XG4gICAgICAgICAgICAgIGl0ZW1JZCA9IGtleTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbUlkKSB7XG4gICAgICAgICAgICBpdGVtSWQgPSBPYmplY3Qua2V5cyhwcml2YXRlcy5kYXRhLnNwYXduSXRlbS5saXN0KVswXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgR2FtZS5JdGVtLmxvYWQoaXRlbUlkKS50aGVuKChpdGVtT2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgeCwgeTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHggPSBTcHJpdGUucmFuZCgwLCB0aGlzLmNvbCk7XG4gICAgICAgICAgICAgIHkgPSBTcHJpdGUucmFuZCgwLCB0aGlzLnJvdyk7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5oaXRUZXN0KHgsIHkpICYmICFibG9ja1t4KjEwMDAwK3ldKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrW3gqMTAwMDAreV0gPSB0cnVlO1xuICAgICAgICAgICAgaXRlbU9iai54ID0geDtcbiAgICAgICAgICAgIGl0ZW1PYmoueSA9IHk7XG4gICAgICAgICAgICBpdGVtT2JqLmlubmVyID0ge307XG4gICAgICAgICAgICBpdGVtT2JqLmlubmVyW2l0ZW1JZF0gPSAxO1xuICAgICAgICAgICAgR2FtZS5hcmVhLml0ZW1zLmFkZChpdGVtT2JqKTtcbiAgICAgICAgICAgIGl0ZW1PYmouZHJhdygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  Game.assign("Quest", (function () {
    function GameQuest() {
      _classCallCheck(this, GameQuest);
    }

    _createClass(GameQuest, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("quest/" + id + ".js").then(function (data) {
            var questData = data[0]();
            questData.id = id;
            resolve(questData);
          });
        });
      }
    }, {
      key: "isComplete",
      value: function isComplete(quest) {
        if (quest.target) {
          if (quest.target.kill) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                if (k.current < k.need) {
                  return false;
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
        }

        return true;
      }
    }]);

    return GameQuest;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVRdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7YUFFdEIsY0FBQyxFQUFFLEVBQUU7QUFDZixlQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxnQkFBTSxDQUFDLElBQUksWUFBVSxFQUFFLFNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDakQsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFCLHFCQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNsQixtQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1dBQ3BCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOzs7YUFFaUIsb0JBQUMsS0FBSyxFQUFFO0FBQ3hCLFlBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixjQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzs7Ozs7QUFDckIsbUNBQWMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLDhIQUFFO29CQUF4QixDQUFDOztBQUNSLG9CQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUN0Qix5QkFBTyxLQUFLLENBQUM7aUJBQ2Q7ZUFDRjs7Ozs7Ozs7Ozs7Ozs7O1dBQ0Y7U0FDRjs7QUFFRCxlQUFPLElBQUksQ0FBQztPQUNiOzs7V0F4QndCLFNBQVM7T0EwQmxDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lUXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBHYW1lLmFzc2lnbihcIlF1ZXN0XCIsIGNsYXNzIEdhbWVRdWVzdCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBxdWVzdC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgcXVlc3REYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIHF1ZXN0RGF0YS5pZCA9IGlkO1xuICAgICAgICAgIHJlc29sdmUocXVlc3REYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNDb21wbGV0ZSAocXVlc3QpIHtcbiAgICAgIGlmIChxdWVzdC50YXJnZXQpIHtcbiAgICAgICAgaWYgKHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgZm9yIChsZXQgayBvZiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgaWYgKGsuY3VycmVudCA8IGsubmVlZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19

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

  Game.assign("Item", (function (_Sprite$Event) {
    _inherits(GameItem, _Sprite$Event);

    _createClass(GameItem, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("item/" + id + ".js").then(function (data) {
            var itemData = data[0]();
            itemData.id = id;
            var itemObj = new Game.Item(itemData);
            Game.items[id] = itemObj;
            itemObj.on("complete", function () {
              resolve(itemObj);
            });
          });
        });
      }
    }]);

    function GameItem(itemData) {
      var _this = this;

      _classCallCheck(this, GameItem);

      _get(Object.getPrototypeOf(GameItem.prototype), "constructor", this).call(this);
      var privates = internal(this);

      privates.data = itemData;
      privates.inner = null;

      if (!this.data.x || !this.data.y) {
        this.data.x = 0;
        this.data.y = 0;
      }

      if (this.data.image) {
        Sprite.load("item/" + this.data.image).then(function (data) {
          var image = data[0];
          privates.icon = image;

          privates.bitmap = new Sprite.Bitmap(image);
          privates.bitmap.x = _this.data.x * 32 + 16;
          privates.bitmap.y = _this.data.y * 32 + 16;
          privates.bitmap.name = _this.id;

          if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
            privates.bitmap.centerX = _this.data.centerX;
            privates.bitmap.centerY = _this.data.centerY;
          } else {
            console.log(_this.data);
            throw new Error("Game.Item invalid centerX/centerY");
          }

          // 发送完成事件，第二个参数代表一次性事件
          _this.emit("complete", true);
        });
      } else {
        this.emit("complete", true);
      }
    }

    _createClass(GameItem, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.data.hitArea[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var p = _step.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
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

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "heroUse",
      value: function heroUse() {
        if (this.inner) {
          if (this.data.pickupCondition) {
            if (this.data.pickupCondition()) {
              Game.windows.pickup.open(this);
            } else {
              // 不符合条件
            }
          } else {
              Game.windows.pickup.open(this);
            }
        }

        if (typeof this.data.use == "function") {
          this.data.use();
        }

        if (this.data.type == "potion") {
          for (var attribute in this.data.potion) {
            var effect = this.data.potion[attribute];
            if (attribute == "hp") {
              (function () {
                Game.hero.data.hp = Math.min(Game.hero.data.hp + effect, Game.hero.data.$hp);
                var text = new Sprite.Text({
                  text: "hp+" + effect,
                  color: "black",
                  fontSize: 20
                });
                text.centerX = Math.floor(text.width / 2);
                text.centerY = Math.floor(text.height);
                text.x = Game.hero.sprite.x;
                text.y = Game.hero.sprite.y;
                Game.layers.actorLayer.appendChild(text);
                Sprite.Ticker.whiles(100, function (last) {
                  text.y -= 3;
                  if (last) {
                    Game.layers.actorLayer.removeChild(text);
                  }
                });
              })();
            }
          }
          Game.hero.data.items[this.id]--;
          if (Game.hero.data.items[this.id] <= 0) {
            delete Game.hero.data.items[this.id];
          }
        } // potion
      }
    }, {
      key: "erase",
      value: function erase(layer) {
        Game.layers.itemLayer.removeChild(internal(this).bitmap);
      }
    }, {
      key: "draw",
      value: function draw() {
        Game.layers.itemLayer.appendChild(internal(this).bitmap);
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Item.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        if (internal(this).bitmap) {
          return internal(this).bitmap.image;
        }
        return null;
      },
      set: function set(value) {
        throw new Error("Game.Item.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Item.data readonly");
      }
    }, {
      key: "inner",
      get: function get() {
        return internal(this).inner;
      },
      set: function set(value) {
        internal(this).inner = value;
      }
    }, {
      key: "x",
      get: function get() {
        return internal(this).data.x;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.x = value;
        privates.bitmap.x = value * 32 + 16;
      }
    }, {
      key: "y",
      get: function get() {
        return internal(this).data.y;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.y = value;
        privates.bitmap.y = value * 32 + 16;
      }
    }, {
      key: "visible",
      get: function get() {
        return internal(this).bitmap.visible;
      },
      set: function set(value) {
        internal(this).bitmap.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).bitmap.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).bitmap.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Item.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        console.error(this.data);
        throw new Error("Game.Item.position readonly");
      }
    }]);

    return GameItem;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVsQyxNQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07Y0FBUSxRQUFROztpQkFBUixRQUFROzthQUVwQixjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxXQUFTLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNoRCxnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekIsb0JBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGdCQUFJLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsZ0JBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLG1CQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQzNCLHFCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztBQUVXLGFBaEJZLFFBQVEsQ0FnQm5CLFFBQVEsRUFBRTs7OzRCQWhCQyxRQUFROztBQWlCOUIsaUNBakJzQixRQUFRLDZDQWlCdEI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLGNBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxD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QUU7QUFDbkIsZUFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsY0FBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO09BQ2hEOzs7V0E3SXVCLFFBQVE7S0FBUyxNQUFNLENBQUMsS0FBSyxFQXdOckQsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIEdhbWUuYXNzaWduKFwiSXRlbVwiLCBjbGFzcyBHYW1lSXRlbSBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBpdGVtLyR7aWR9LmpzYCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCBpdGVtRGF0YSA9IGRhdGFbMF0oKTtcbiAgICAgICAgICBpdGVtRGF0YS5pZCA9IGlkO1xuICAgICAgICAgIGxldCBpdGVtT2JqID0gbmV3IEdhbWUuSXRlbShpdGVtRGF0YSk7XG4gICAgICAgICAgR2FtZS5pdGVtc1tpZF0gPSBpdGVtT2JqO1xuICAgICAgICAgIGl0ZW1PYmoub24oXCJjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGl0ZW1PYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChpdGVtRGF0YSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBwcml2YXRlcy5kYXRhID0gaXRlbURhdGE7XG4gICAgICBwcml2YXRlcy5pbm5lciA9IG51bGw7XG5cbiAgICAgIGlmICghdGhpcy5kYXRhLnggfHwgIXRoaXMuZGF0YS55KSB7XG4gICAgICAgIHRoaXMuZGF0YS54ID0gMDtcbiAgICAgICAgdGhpcy5kYXRhLnkgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRhLmltYWdlKSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBpdGVtLyR7dGhpcy5kYXRhLmltYWdlfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBkYXRhWzBdO1xuICAgICAgICAgIHByaXZhdGVzLmljb24gPSBpbWFnZTtcblxuICAgICAgICAgIHByaXZhdGVzLmJpdG1hcCA9IG5ldyBTcHJpdGUuQml0bWFwKGltYWdlKTtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAueCA9IHRoaXMuZGF0YS54ICogMzIgKyAxNjtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAueSA9IHRoaXMuZGF0YS55ICogMzIgKyAxNjtcbiAgICAgICAgICBwcml2YXRlcy5iaXRtYXAubmFtZSA9IHRoaXMuaWQ7XG5cbiAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLmRhdGEuY2VudGVyWCkgJiYgTnVtYmVyLmlzSW50ZWdlcih0aGlzLmRhdGEuY2VudGVyWSkpIHtcbiAgICAgICAgICAgIHByaXZhdGVzLmJpdG1hcC5jZW50ZXJYID0gdGhpcy5kYXRhLmNlbnRlclg7XG4gICAgICAgICAgICBwcml2YXRlcy5iaXRtYXAuY2VudGVyWSA9IHRoaXMuZGF0YS5jZW50ZXJZO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5JdGVtIGludmFsaWQgY2VudGVyWC9jZW50ZXJZXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIOWPkemAgeWujOaIkOS6i+S7tu+8jOesrOS6jOS4quWPguaVsOS7o+ihqOS4gOasoeaAp+S6i+S7tlxuICAgICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBpZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS5pZDtcbiAgICB9XG5cbiAgICBzZXQgaWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGljb24gKCkge1xuICAgICAgaWYgKGludGVybmFsKHRoaXMpLmJpdG1hcCkge1xuICAgICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYml0bWFwLmltYWdlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc2V0IGljb24gKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uaWNvbiByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgZGF0YSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkl0ZW0uZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXIgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmlubmVyO1xuICAgIH1cblxuICAgIHNldCBpbm5lciAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmlubmVyID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHggKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEueDtcbiAgICB9XG5cbiAgICBzZXQgeCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuZGF0YS54ID0gdmFsdWU7XG4gICAgICBwcml2YXRlcy5iaXRtYXAueCA9IHZhbHVlICogMzIgKyAxNjtcbiAgICB9XG5cbiAgICBnZXQgeSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS55O1xuICAgIH1cblxuICAgIHNldCB5ICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kYXRhLnkgPSB2YWx1ZTtcbiAgICAgIHByaXZhdGVzLmJpdG1hcC55ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgIH1cblxuICAgIGdldCB2aXNpYmxlICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iaXRtYXAudmlzaWJsZTtcbiAgICB9XG5cbiAgICBzZXQgdmlzaWJsZSAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmJpdG1hcC52aXNpYmxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGFscGhhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5iaXRtYXAuYWxwaGE7XG4gICAgfVxuXG4gICAgc2V0IGFscGhhICh2YWx1ZSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiYgdmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSAxKSB7XG4gICAgICAgIGludGVybmFsKHRoaXMpLmJpdG1hcC5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuSXRlbS5hbHBoYSBnb3QgaW52YWxpZCB2YWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogdGhpcy54LFxuICAgICAgICB5OiB0aGlzLnlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IHBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5JdGVtLnBvc2l0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaGl0QXJlYSAmJiB0aGlzLmRhdGEuaGl0QXJlYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5kYXRhLmhpdEFyZWEpIHtcbiAgICAgICAgICBpZiAoeCA9PSB0aGlzLnggKyBwWzBdICYmIHkgPT0gdGhpcy55ICsgcFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5oaXRUZXN0IGludmFsaWQgZGF0YVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZXJvVXNlICgpIHtcbiAgICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEucGlja3VwQ29uZGl0aW9uKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5waWNrdXBDb25kaXRpb24oKSkge1xuICAgICAgICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDkuI3nrKblkIjmnaHku7ZcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhLnVzZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5kYXRhLnVzZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRhLnR5cGUgPT0gXCJwb3Rpb25cIikge1xuICAgICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gdGhpcy5kYXRhLnBvdGlvbikge1xuICAgICAgICAgIGxldCBlZmZlY3QgPSB0aGlzLmRhdGEucG90aW9uW2F0dHJpYnV0ZV07XG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PSBcImhwXCIpIHtcbiAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmhwID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmhwICsgZWZmZWN0LFxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS4kaHBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgICAgIHRleHQ6IGBocCske2VmZmVjdH1gLFxuICAgICAgICAgICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGV4dC5jZW50ZXJYID0gTWF0aC5mbG9vcih0ZXh0LndpZHRoIC8gMik7XG4gICAgICAgICAgICB0ZXh0LmNlbnRlclkgPSBNYXRoLmZsb29yKHRleHQuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRleHQueCA9IEdhbWUuaGVyby5zcHJpdGUueDtcbiAgICAgICAgICAgIHRleHQueSA9IEdhbWUuaGVyby5zcHJpdGUueTtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBTcHJpdGUuVGlja2VyLndoaWxlcygxMDAsIChsYXN0KSA9PiB7XG4gICAgICAgICAgICAgIHRleHQueSAtPSAzO1xuICAgICAgICAgICAgICBpZiAobGFzdCkge1xuICAgICAgICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIucmVtb3ZlQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBHYW1lLmhlcm8uZGF0YS5pdGVtc1t0aGlzLmlkXS0tO1xuICAgICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuaXRlbXNbdGhpcy5pZF0gPD0gMCkge1xuICAgICAgICAgIGRlbGV0ZSBHYW1lLmhlcm8uZGF0YS5pdGVtc1t0aGlzLmlkXTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBwb3Rpb25cblxuICAgIH1cblxuICAgIGVyYXNlIChsYXllcikge1xuICAgICAgR2FtZS5sYXllcnMuaXRlbUxheWVyLnJlbW92ZUNoaWxkKGludGVybmFsKHRoaXMpLmJpdG1hcCk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBHYW1lLmxheWVycy5pdGVtTGF5ZXIuYXBwZW5kQ2hpbGQoaW50ZXJuYWwodGhpcykuYml0bWFwKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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

  Game.assign("Skill", (function (_Sprite$Event) {
    _inherits(GameSkill, _Sprite$Event);

    _createClass(GameSkill, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("skill/" + id + ".js").then(function (data) {
            var skillData = data[0]();
            var skillObj = new Game.Skill(skillData);
            Game.skills[id] = skillObj;
            skillObj.on("complete", function () {
              resolve(skillObj);
            });
          });
        });
      }
    }]);

    function GameSkill(skillData) {
      var _this = this;

      _classCallCheck(this, GameSkill);

      _get(Object.getPrototypeOf(GameSkill.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.data = skillData;

      Sprite.load("skill/" + this.data.image, "skill/" + this.data.icon, "skill/" + this.data.sound).then(function (data) {
        var image = data[0];
        privates.icon = data[1];
        privates.sound = data[2];

        var sheet = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        sheet.centerX = Math.floor(_this.data.tilewidth / 2);
        sheet.centerY = Math.floor(_this.data.tileheight / 2);

        if (_this.data.alpha) {
          sheet.alpha = _this.data.alpha;
        }

        privates.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
    }

    _createClass(GameSkill, [{
      key: "fire",
      value: function fire(attacker, direction, callback) {
        var _this2 = this;

        var privates = internal(this);

        if (privates.sound) {
          privates.sound.load();
          privates.sound.play();
        }

        var animation = "attack" + direction;
        var weaponAnimation = this.data.animations[animation];
        var sprite = privates.sprite.clone();

        // 矫正武器效果位置
        sprite.x = attacker.facePosition.x * 32 + 16;
        sprite.y = attacker.facePosition.y * 32 + 16;

        // 矫正武器效果中心
        if (Number.isFinite(weaponAnimation.centerX) && Number.isFinite(weaponAnimation.centerY)) {
          sprite.centerX = weaponAnimation.centerX;
          sprite.centerY = weaponAnimation.centerY;
        } else {
          console.error(weaponAnimation, this.data);
          throw new Error("Game.Skill.fire invalid centerX/centerY");
        }

        // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的距离
        var distance = 0;
        // 被命中的actor列表
        var hitted = [];
        var CheckHit = function CheckHit() {
          // 技能所在当前方格
          var l1 = Game.area.map.tile(sprite.x, sprite.y);
          // 碰撞检测
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var actor = _step.value;

              if (actor != attacker && hitted.length <= 0) {
                if (actor.hitTest(l1.x, l1.y)) {
                  hitted.push(actor);
                }
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
        };

        var listener = Sprite.Ticker.on("tick", function () {

          if (_this2.data.distance > 0) {
            // 飞行速度是4
            distance += 4;
          }

          switch (animation) {
            case "attackdown":
              sprite.y += distance;
              break;
            case "attackleft":
              sprite.x -= distance;
              break;
            case "attackright":
              sprite.x += distance;
              break;
            case "attackup":
              sprite.y -= distance;
              break;
          }

          CheckHit();

          // 测试碰撞到墙
          var grid = Game.area.map.tile(sprite.x, sprite.y);
          if (Game.area.map.hitTest(grid.x, grid.y)) {
            Finish();
          }

          // 如果击中了一个敌人（单体伤害）
          if (hitted.length > 0) {
            Finish();
          }

          // 如果是远程攻击，并且攻击距离已经到了
          if (_this2.data.distance > 0 && distance >= _this2.data.distance) {
            Finish();
          }
        });

        // 攻击结束时运行Stop函数
        var Finish = function Finish() {
          Sprite.Ticker.off("tick", listener);

          if (hitted.length > 0 && _this2.data.animations["hitted"]) {
            var actor = hitted[0];
            sprite.x = actor.sprite.x;
            sprite.y = actor.sprite.y;
            sprite.play("hitted");
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          } else {
            // 如果动画已经播完，则停止
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          }

          if (callback) {
            callback(hitted);
          }
        };

        Game.layers.skillLayer.appendChild(sprite);
        sprite.play(animation);

        if (this.data.animations[animation].actor && attacker.data.animations[this.data.animations[animation].actor]) {
          attacker.play(this.data.animations[animation].actor, 3);
        } else {
          attacker.play("face" + direction, 0);
          attacker.play("attack" + direction, 3);
        }
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Skill.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        return internal(this).icon;
      },
      set: function set(value) {
        throw new Error("Game.Skill.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Skill.data readonly");
      }
    }, {
      key: "power",
      get: function get() {
        if (Number.isFinite(this.data.power)) {
          // 固定伤害
          return this.data.power;
        } else if (typeof this.data.power == "string") {
          // 骰子伤害，例如1d5就是投一个五面骰子，数值在1到5之间
          var m = this.data.power.match(/(\d+)d(\d+)/);
          if (!m) {
            console.error(this.data.power, this.data);
            throw new Error("Sprite.Skill got invalid power data");
          }
          var times = parseInt(m[1]);
          var dice = parseInt(m[2]);
          var sum = 0;
          for (var i = 0; i < times; i++) {
            sum += Sprite.rand(0, dice) + 1;
          }
          return sum;
        } else {
          console.error(this.data.power, this.data);
          throw new Error("Game.Skill.power invalid power");
        }
      },
      set: function set(value) {
        throw new Error("Game.Skill.power readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return this.data.type;
      },
      set: function set(value) {
        throw new Error("Game.Skill.type readonly");
      }
    }]);

    return GameSkill;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVTa2lsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2NBQVEsU0FBUzs7aUJBQVQsU0FBUzs7YUFFdEIsY0FBQyxFQUFFLEVBQUU7QUFDZixlQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxnQkFBTSxDQUFDLElBQUksWUFBVSxFQUFFLFNBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDakQsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQzNCLG9CQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQzVCLHFCQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbkIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztBQUVXLGFBZmEsU0FBUyxDQWVyQixTQUFTLEVBQUU7Ozs0QkFmQyxTQUFTOztBQWdCaEMsaUNBaEJ1QixTQUFTLDZDQWdCdkI7QUFDVCxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRTFCLFlBQU0sQ0FBQyxJQUFJLFlBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQ2YsSUFBSSxDQUFDLElBQUks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QyxDQUFDLENBQUM7QUFDM0IsY0FBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGNBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUIsZUFBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNqQztBQUNELGlCQUFPLEdBQUcsQ0FBQztTQUNaLE1BQU07QUFDTCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsZ0JBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUNuRDtPQUNGO1dBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsY0FBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO09BQzlDOzs7V0FFUSxlQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUN2QjtXQUVRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsY0FBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO09BQzdDOzs7V0E3R3dCLFNBQVM7S0FBUyxNQUFNLENBQUMsS0FBSyxFQStPdkQsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVTa2lsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBHYW1lLmFzc2lnbihcIlNraWxsXCIsIGNsYXNzIEdhbWVTa2lsbCBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBza2lsbC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgc2tpbGxEYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIGxldCBza2lsbE9iaiA9IG5ldyBHYW1lLlNraWxsKHNraWxsRGF0YSk7XG4gICAgICAgICAgR2FtZS5za2lsbHNbaWRdID0gc2tpbGxPYmo7XG4gICAgICAgICAgc2tpbGxPYmoub24oXCJjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHNraWxsT2JqKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoc2tpbGxEYXRhKSB7XG4gICAgICBzdXBlciAoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuZGF0YSA9IHNraWxsRGF0YTtcblxuICAgICAgU3ByaXRlLmxvYWQoXG4gICAgICAgIGBza2lsbC8ke3RoaXMuZGF0YS5pbWFnZX1gLFxuICAgICAgICBgc2tpbGwvJHt0aGlzLmRhdGEuaWNvbn1gLFxuICAgICAgICBgc2tpbGwvJHt0aGlzLmRhdGEuc291bmR9YFxuICAgICAgKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBpbWFnZSA9IGRhdGFbMF07XG4gICAgICAgIHByaXZhdGVzLmljb24gPSBkYXRhWzFdO1xuICAgICAgICBwcml2YXRlcy5zb3VuZCA9IGRhdGFbMl07XG5cbiAgICAgICAgbGV0IHNoZWV0ID0gbmV3IFNwcml0ZS5TaGVldCh7XG4gICAgICAgICAgaW1hZ2VzOiBbaW1hZ2VdLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLmRhdGEudGlsZXdpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5kYXRhLnRpbGVoZWlnaHQsXG4gICAgICAgICAgYW5pbWF0aW9uczogdGhpcy5kYXRhLmFuaW1hdGlvbnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2hlZXQuY2VudGVyWCA9IE1hdGguZmxvb3IodGhpcy5kYXRhLnRpbGV3aWR0aCAvIDIpO1xuICAgICAgICBzaGVldC5jZW50ZXJZID0gTWF0aC5mbG9vcih0aGlzLmRhdGEudGlsZWhlaWdodCAvIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLmRhdGEuYWxwaGEpIHtcbiAgICAgICAgICBzaGVldC5hbHBoYSA9IHRoaXMuZGF0YS5hbHBoYTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGVzLnNwcml0ZSA9IHNoZWV0O1xuXG4gICAgICAgIC8vIOWPkemAgeWujOaIkOS6i+S7tu+8jOesrOS6jOS4quWPguaVsOS7o+ihqOS4gOasoeaAp+S6i+S7tlxuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBpZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuZGF0YS5pZDtcbiAgICB9XG5cbiAgICBzZXQgaWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLlNraWxsLmlkIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpY29uICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pY29uO1xuICAgIH1cblxuICAgIHNldCBpY29uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5pY29uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgIH1cblxuICAgIHNldCBkYXRhICh2YWx1ZSkge1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwuZGF0YSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgcG93ZXIgKCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh0aGlzLmRhdGEucG93ZXIpKSB7XG4gICAgICAgIC8vIOWbuuWumuS8pOWus1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnBvd2VyO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5kYXRhLnBvd2VyID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgLy8g6aqw5a2Q5Lyk5a6z77yM5L6L5aaCMWQ15bCx5piv5oqV5LiA5Liq5LqU6Z2i6aqw5a2Q77yM5pWw5YC85ZyoMeWIsDXkuYvpl7RcbiAgICAgICAgbGV0IG0gPSB0aGlzLmRhdGEucG93ZXIubWF0Y2goLyhcXGQrKWQoXFxkKykvKTtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEucG93ZXIsIHRoaXMuZGF0YSk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlNraWxsIGdvdCBpbnZhbGlkIHBvd2VyIGRhdGFcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRpbWVzID0gcGFyc2VJbnQobVsxXSk7XG4gICAgICAgIGxldCBkaWNlID0gcGFyc2VJbnQobVsyXSk7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcbiAgICAgICAgICBzdW0gKz0gU3ByaXRlLnJhbmQoMCwgZGljZSkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZGF0YS5wb3dlciwgdGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC5wb3dlciBpbnZhbGlkIHBvd2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldCBwb3dlciAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwucG93ZXIgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS50eXBlO1xuICAgIH1cblxuICAgIHNldCB0eXBlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5Ta2lsbC50eXBlIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGZpcmUgKGF0dGFja2VyLCBkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLnNvdW5kKSB7XG4gICAgICAgIHByaXZhdGVzLnNvdW5kLmxvYWQoKTtcbiAgICAgICAgcHJpdmF0ZXMuc291bmQucGxheSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgYW5pbWF0aW9uID0gXCJhdHRhY2tcIiArIGRpcmVjdGlvbjtcbiAgICAgIGxldCB3ZWFwb25BbmltYXRpb24gPSB0aGlzLmRhdGEuYW5pbWF0aW9uc1thbmltYXRpb25dO1xuICAgICAgbGV0IHNwcml0ZSA9IHByaXZhdGVzLnNwcml0ZS5jbG9uZSgpO1xuXG4gICAgICAvLyDnn6vmraPmrablmajmlYjmnpzkvY3nva5cbiAgICAgIHNwcml0ZS54ID0gYXR0YWNrZXIuZmFjZVBvc2l0aW9uLnggKiAzMiArIDE2O1xuICAgICAgc3ByaXRlLnkgPSBhdHRhY2tlci5mYWNlUG9zaXRpb24ueSAqIDMyICsgMTY7XG5cbiAgICAgIC8vIOefq+ato+atpuWZqOaViOaenOS4reW/g1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh3ZWFwb25BbmltYXRpb24uY2VudGVyWCkgJiYgTnVtYmVyLmlzRmluaXRlKHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJZKSkge1xuICAgICAgICBzcHJpdGUuY2VudGVyWCA9IHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJYO1xuICAgICAgICBzcHJpdGUuY2VudGVyWSA9IHdlYXBvbkFuaW1hdGlvbi5jZW50ZXJZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih3ZWFwb25BbmltYXRpb24sIHRoaXMuZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuU2tpbGwuZmlyZSBpbnZhbGlkIGNlbnRlclgvY2VudGVyWVwiKTtcbiAgICAgIH1cblxuICAgICAgLy8g5aaC5p6c5piv6L+c6Led56a75pS75Ye777yIdGhpcy5kYXRhLmRpc3RhbmNlID4gMO+8ie+8jOmCo+S5iGRpc3RhbmNl5piv5a6D5bey57uP6LWw6L+H55qE6Led56a7XG4gICAgICBsZXQgZGlzdGFuY2UgPSAwO1xuICAgICAgLy8g6KKr5ZG95Lit55qEYWN0b3LliJfooahcbiAgICAgIGxldCBoaXR0ZWQgPSBbXTtcbiAgICAgIGxldCBDaGVja0hpdCA9ICgpID0+IHtcbiAgICAgICAgLy8g5oqA6IO95omA5Zyo5b2T5YmN5pa55qC8XG4gICAgICAgIGxldCBsMSA9IEdhbWUuYXJlYS5tYXAudGlsZShzcHJpdGUueCwgc3ByaXRlLnkpO1xuICAgICAgICAvLyDnorDmkp7mo4DmtYtcbiAgICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAgIGlmIChhY3RvciAhPSBhdHRhY2tlciAmJiBoaXR0ZWQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChhY3Rvci5oaXRUZXN0KGwxLngsIGwxLnkpKSB7XG4gICAgICAgICAgICAgIGhpdHRlZC5wdXNoKGFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxldCBsaXN0ZW5lciA9IFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsICgpID0+IHtcblxuICAgICAgICBpZiAodGhpcy5kYXRhLmRpc3RhbmNlID4gMCkge1xuICAgICAgICAgIC8vIOmjnuihjOmAn+W6puaYrzRcbiAgICAgICAgICBkaXN0YW5jZSArPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChhbmltYXRpb24pIHtcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrZG93blwiOlxuICAgICAgICAgICAgc3ByaXRlLnkgKz0gZGlzdGFuY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrbGVmdFwiOlxuICAgICAgICAgICAgc3ByaXRlLnggLT0gZGlzdGFuY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXR0YWNrcmlnaHRcIjpcbiAgICAgICAgICAgIHNwcml0ZS54ICs9IGRpc3RhbmNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImF0dGFja3VwXCI6XG4gICAgICAgICAgICBzcHJpdGUueSAtPSBkaXN0YW5jZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgQ2hlY2tIaXQoKTtcblxuICAgICAgICAvLyDmtYvor5XnorDmkp7liLDloplcbiAgICAgICAgbGV0IGdyaWQgPSBHYW1lLmFyZWEubWFwLnRpbGUoc3ByaXRlLngsIHNwcml0ZS55KTtcbiAgICAgICAgaWYgKEdhbWUuYXJlYS5tYXAuaGl0VGVzdChncmlkLngsIGdyaWQueSkpIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOWHu+S4reS6huS4gOS4quaVjOS6uu+8iOWNleS9k+S8pOWus++8iVxuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOaYr+i/nOeoi+aUu+WHu++8jOW5tuS4lOaUu+WHu+i3neemu+W3sue7j+WIsOS6hlxuICAgICAgICBpZiAodGhpcy5kYXRhLmRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA+PSB0aGlzLmRhdGEuZGlzdGFuY2UpIHtcbiAgICAgICAgICBGaW5pc2goKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgLy8g5pS75Ye757uT5p2f5pe26L+Q6KGMU3RvcOWHveaVsFxuICAgICAgbGV0IEZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgU3ByaXRlLlRpY2tlci5vZmYoXCJ0aWNrXCIsIGxpc3RlbmVyKTtcblxuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDAgJiYgdGhpcy5kYXRhLmFuaW1hdGlvbnNbXCJoaXR0ZWRcIl0pIHtcbiAgICAgICAgICBsZXQgYWN0b3IgPSBoaXR0ZWRbMF07XG4gICAgICAgICAgc3ByaXRlLnggPSBhY3Rvci5zcHJpdGUueDtcbiAgICAgICAgICBzcHJpdGUueSA9IGFjdG9yLnNwcml0ZS55O1xuICAgICAgICAgIHNwcml0ZS5wbGF5KFwiaGl0dGVkXCIpO1xuICAgICAgICAgIGlmIChzcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLnNraWxsTGF5ZXIucmVtb3ZlQ2hpbGQoc3ByaXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ByaXRlLm9uKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOWmguaenOWKqOeUu+W3sue7j+aSreWujO+8jOWImeWBnOatolxuICAgICAgICAgIGlmIChzcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgICAgIEdhbWUubGF5ZXJzLnNraWxsTGF5ZXIucmVtb3ZlQ2hpbGQoc3ByaXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ByaXRlLm9uKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgR2FtZS5sYXllcnMuc2tpbGxMYXllci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soaGl0dGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBHYW1lLmxheWVycy5za2lsbExheWVyLmFwcGVuZENoaWxkKHNwcml0ZSk7XG4gICAgICBzcHJpdGUucGxheShhbmltYXRpb24pO1xuXG4gICAgICBpZiAoIHRoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3JcbiAgICAgICAgJiYgYXR0YWNrZXIuZGF0YS5hbmltYXRpb25zW3RoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3JdICkge1xuICAgICAgICBhdHRhY2tlci5wbGF5KHRoaXMuZGF0YS5hbmltYXRpb25zW2FuaW1hdGlvbl0uYWN0b3IsIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0YWNrZXIucGxheShcImZhY2VcIiArIGRpcmVjdGlvbiwgMCk7XG4gICAgICAgIGF0dGFja2VyLnBsYXkoXCJhdHRhY2tcIiArIGRpcmVjdGlvbiwgMyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59KSgpO1xuIl19

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

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.assign("Actor", (function (_Sprite$Event) {
    _inherits(Actor, _Sprite$Event);

    _createClass(Actor, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("actor/" + id + ".js").then(function (data) {
            var actorData = data[0]();
            actorData.id = id;

            var actorObj = null;
            if (actorData.type == "npc") {
              actorObj = new Game.ActorNPC(actorData);
            } else if (actorData.type == "monster") {
              actorObj = new Game.ActorMonster(actorData);
            } else if (actorData.type == "ally") {
              actorObj = new Game.ActorAlly(actorData);
            } else if (actorData.type == "pet") {
              actorObj = new Game.ActorPet(actorData);
            } else {
              console.error(actorData.type, actorData);
              throw new Error("Game.Actor.load invalid actor type");
            }
            actorObj.on("complete", function () {
              resolve(actorObj);
            });
          });
        });
      }
    }]);

    function Actor(actorData) {
      var _this = this;

      _classCallCheck(this, Actor);

      _get(Object.getPrototypeOf(Actor.prototype), "constructor", this).call(this);
      var privates = internal(this);

      privates.data = actorData;

      this.makeInfoBox();

      if (this.data.image instanceof Array) {
        this.init(this.data.image);
      } else if (typeof this.data.image == "string") {
        Sprite.load("actor/" + this.data.image).then(function (data) {
          // data is Array
          _this.init(data);
        });
      } else {
        console.error(this.id, this.data, this.data.image, this);
        throw new Error("Invalid Actor Image");
      }
    }

    _createClass(Actor, [{
      key: "init",
      value: function init(images) {
        var _this2 = this;

        var privates = internal(this);
        var data = privates.data;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var image = _step.value;

            if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
              console.error(image, images, this);
              throw new Error("Game.Actor got invalid image, not Image or Canvas");
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

        ;

        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: data.tilewidth,
          height: data.tileheight,
          animations: data.animations
        });

        if (Number.isInteger(data.centerX) && Number.isInteger(data.centerY)) {
          sprite.centerX = data.centerX;
          sprite.centerY = data.centerY;
        } else {
          console.log(data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        sprite.play("facedown");
        privates.sprite = sprite;

        sprite.on("change", function () {
          privates.infoBox.x = sprite.x;
          privates.infoBox.y = sprite.y - sprite.centerY - 20;
        });

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            _this2.calculate();
            _this2.refreshBar();
            _this2.emit("complete", true);
          }
        };

        // 加载NPC可能有的任务
        if (data.quest) {
          privates.quest = [];
          privates.quest.length = data.quest.length;
          data.quest.forEach(function (questId, index) {
            completeCount--;

            Game.Quest.load(questId).then(function (questData) {
              privates.quest.push(questData);
              Complete();
            });
          });
        }

        // 加载人物技能
        if (data.skills) {
          data.skills.forEach(function (skillId) {
            completeCount--;
            Game.Skill.load(skillId).then(function () {
              Complete();
            });
          });
        }

        // 加载人物装备（暂时只有玩家）
        if (data.equipment) {
          for (var key in data.equipment) {
            var itemId = data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId).then(function () {
                Complete();
              });
            }
          }
        }

        // 加载人物物品
        if (data.items) {
          for (var itemId in data.items) {
            completeCount--;
            Game.Item.load(itemId).then(function () {
              Complete();
            });
          }
        }

        Complete();
      }
    }, {
      key: "makeInfoBox",
      value: function makeInfoBox() {
        var privates = internal(this);
        // 名字
        var text = new Sprite.Text({
          text: privates.data.name,
          maxWidth: 200,
          color: "white",
          fontSize: 12
        });
        text.centerY = Math.floor(text.height / 2);
        text.centerX = Math.floor(text.width / 2);
        text.x = 0;
        text.y = 0;

        // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
        privates.infoBox = new Sprite.Container();

        if (privates.data.type != "hero") {
          // 血条外面的黑框
          var hpbarBox = new Sprite.Shape();
          hpbarBox.centerX = 15;
          hpbarBox.centerY = 2;
          hpbarBox.x = 0;
          hpbarBox.y = 9;

          // 魔法条外面的黑框
          var mpbarBox = new Sprite.Shape();
          mpbarBox.centerX = 15;
          mpbarBox.centerY = 2;
          mpbarBox.x = 0;
          mpbarBox.y = 12;

          hpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          mpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          // 生命条
          privates.hpbar = new Sprite.Shape();
          privates.hpbar.centerX = 15;
          privates.hpbar.centerY = 2;
          privates.hpbar.x = 0;
          privates.hpbar.y = 9;

          // 精力条
          privates.mpbar = new Sprite.Shape();
          privates.mpbar.centerX = 15;
          privates.mpbar.centerY = 2;
          privates.mpbar.x = 0;
          privates.mpbar.y = 12;

          privates.infoBox.appendChild(text, hpbarBox, mpbarBox, privates.hpbar, privates.mpbar);
        }
      }
    }, {
      key: "calculate",
      value: function calculate() {
        var data = internal(this).data;
        if (data.$str && data.$dex && data.$con && data.$int && data.$cha) {

          data.str = data.$str;
          data.dex = data.$dex;
          data.con = data.$con;
          data.int = data.$int;
          data.cha = data.$cha;

          // 然后可以针对一级属性计算buff

          // 计算完一级属性的buff之后，开始计算二级属性

          data.$hp = data.con * 5;
          data.$sp = data.int * 5;

          data.atk = Math.floor(data.str * 0.25);
          data.matk = Math.floor(data.int * 0.25);
          data.def = 0;
          data.mdef = 0;
          data.critical = data.dex * 0.005;
          data.dodge = data.dex * 0.005;

          // 然后可以对二级属性计算buff

          // 对二级属性计算完buff之后，可以计算会变动的值
          // 例如.$hp是buff之后的生命值上限，.hp是当前生命值
          data.hp = data.$hp;
          data.sp = data.$sp;

          if (data.buff && data.nerf) {
            data.buff.forEach(function (element) {});
            data.nerf.forEach(function (element) {});
          }
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        var privates = internal(this);

        if (privates.hpbar && privates.mpbar) {
          var hpcolor = "green";
          if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

          privates.hpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.hp / this.data.$hp * 28),
            height: 2,
            fill: hpcolor,
            "stroke-width": 0
          });

          privates.mpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.sp / this.data.$sp * 28),
            height: 2,
            fill: "blue",
            "stroke-width": 0
          });
        }
      }
    }, {
      key: "distance",
      value: function distance() {
        var x = null,
            y = null;
        if (arguments.length == 2 && Number.isFinite(arguments[0]) && Number.isFinite(arguments[1])) {
          x = arguments[0];
          y = arguments[1];
        } else if (arguments.length == 1 && Number.isFinite(arguments[0].x) && Number.isFinite(arguments[0].y)) {
          x = arguments[0].x;
          y = arguments[0].y;
        } else {
          console.error(arguments);
          throw new Error("Game.Actor.distance Invalid arguments");
        }
        var d = 0;
        d += Math.pow(this.x - x, 2);
        d += Math.pow(this.y - y, 2);
        d = Math.sqrt(d);
        return d;
      }
    }, {
      key: "decreaseHP",
      value: function decreaseHP(power) {
        this.data.hp -= power;
        this.refreshBar();
      }
    }, {
      key: "decreaseSP",
      value: function decreaseSP(sp) {
        this.data.sp -= sp;
        this.refreshBar();
      }
    }, {
      key: "dead",
      value: function dead(attacker) {
        var _this3 = this;

        if (this.data.hp <= 0) {
          if (this.data.type == "hero") {
            Game.windows.over.open("你被" + attacker.data.name + "打死了");
          } else {
            (function () {

              _this3.erase();
              Game.area.actors["delete"](_this3);

              var items = _this3.data.items || { gold: 1 };

              Game.addBag(_this3.x, _this3.y).then(function (bag) {
                for (var itemId in items) {
                  if (bag.inner.hasOwnProperty(itemId)) {
                    bag.inner[itemId] += items[itemId];
                  } else {
                    bag.inner[itemId] = items[itemId];
                  }
                }
              });

              attacker.emit("kill", false, _this3);
            })();
          }
        }
      }

      /** 闪一闪人物，例如被击中时的效果 */
    }, {
      key: "flash",
      value: function flash() {
        var _this4 = this;

        this.sprite.alpha = 0.5;
        setTimeout(function () {
          _this4.sprite.alpha = 1;
        }, 200);
      }

      /** 受到attacker的skill技能的伤害 */
    }, {
      key: "damage",
      value: function damage(attacker, skill) {

        this.emit("damaged");

        var power = skill.power;
        var type = skill.type;

        var color = "white";
        if (this.data.type == "hero") {
          color = "red";
        }

        if (type == "normal") {
          power += attacker.data.atk;
          power -= this.data.def;
          power = Math.max(0, power);
        } else {
          // type == magic
          power += attacker.data.matk;
          power - this.data.mdef;
          power = Math.max(0, power);
        }

        var text = null;
        var state = null;

        if (Math.random() < this.data.dodge) {
          // 闪避了
          state = "dodge";
          text = new Sprite.Text({
            text: "miss",
            color: color,
            fontSize: 16
          });
        } else if (Math.random() < attacker.data.critical) {
          // 重击了
          state = "critical";
          power *= 2;
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 32
          });
          this.flash();
          this.decreaseHP(power);
        } else {
          // 普通击中
          state = "hit";
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 16
          });
          this.flash();
          this.decreaseHP(power);
        }

        /*
        if (state != "dodge" && this != Game.hero) {
          if (Game.sounds.hurt) {
            Game.sounds.hurt.load();
            Game.sounds.hurt.play();
          }
        }
        */

        text.centerX = Math.floor(text.width / 2);
        text.centerY = Math.floor(text.height);
        text.x = this.sprite.x;
        text.y = this.sprite.y;

        text.x += Sprite.rand(-10, 10);

        Game.layers.actorLayer.appendChild(text);

        var speed = Sprite.rand(1, 3);

        Sprite.Ticker.whiles(100, function (last) {
          text.y -= speed;
          if (last) {
            Game.layers.actorLayer.removeChild(text);
          }
        });

        // 测试是否死亡
        this.dead(attacker);
      }

      /** 播放一个动画 */
    }, {
      key: "play",
      value: function play(animation, priority) {
        // 新动画默认优先级为0
        if (!Number.isFinite(priority)) {
          priority = 0;
        }

        // 无动画或者停止状态，现有优先级为-1（最低级）
        if (typeof this.animationPriority == "undefined" || this.sprite.paused == true) {
          this.animationPriority = -1;
        }

        if (this.data.animations.hasOwnProperty(animation) && priority >= this.animationPriority && animation != this.sprite.currentAnimation) {
          this.animationPriority = priority;
          this.sprite.play(animation);
        }
      }

      /** 停止 */
    }, {
      key: "stop",
      value: function stop() {
        if (!this.sprite.currentAnimation) return;

        if (this.sprite.paused && !this.sprite.currentAnimation.match(/face/) || this.sprite.currentAnimation.match(/walk|run/)) {
          switch (this.direction) {
            case "up":
              this.sprite.play("faceup");
              break;
            case "down":
              this.sprite.play("facedown");
              break;
            case "left":
              this.sprite.play("faceleft");
              break;
            case "right":
              this.sprite.play("faceright");
              break;
          }
        }
      }

      /** 向指定direction方向释放一个技能 */
    }, {
      key: "fire",
      value: function fire(id, direction) {
        var _this5 = this;

        // 同一时间只能施展一个skill
        if (this.attacking) return 0;

        var skill = Game.skills[id];
        if (!skill) return 0;

        // 只有当这个skill的cooldown结
        var now = new Date().getTime();
        if (Number.isFinite(this.lastAttack) && Number.isFinite(this.lastAttackCooldown) && now - this.lastAttack < this.lastAttackCooldown) {
          return 0;
        }

        if (skill.data.cost > this.data.sp) {
          return 0;
        }

        if (!direction) {
          direction = this.direction;
        }

        if ( // 玩家使用技能是可能有条件的，例如剑技能需要装备剑
        this.type == "hero" && skill.data.condition && skill.data.condition() == false) {
          return 0;
        }

        this.lastAttack = now;
        this.lastAttackCooldown = skill.data.cooldown;
        this.attacking = true;

        this.data.sp -= skill.data.cost;
        this.refreshBar();

        skill.fire(this, direction, function (hitted) {
          _this5.attacking = false;
          if (hitted.length > 0) {
            hitted[0].damage(_this5, skill);
          }
          _this5.emit("change");
        });

        return skill.data.cooldown;
      }

      /** 行走到指定地点 */
    }, {
      key: "goto",
      value: function goto(x, y, state, callback) {
        var _this6 = this;

        if (this.going) {
          this.goingNext = function () {
            _this6.goto(x, y, state, callback);
          };
          return false;
        }

        var destBlocked = this.checkCollision(x, y);

        if (destBlocked) {
          if (this.x == x) {
            if (this.y - y == -1) {
              this.stop();
              this.face("down");
              if (callback) callback();
              return false;
            } else if (this.y - y == 1) {
              this.stop();
              this.face("up");
              if (callback) callback();
              return false;
            }
          } else if (this.y == y) {
            if (this.x - x == -1) {
              this.stop();
              this.face("right");
              if (callback) callback();
              return false;
            } else if (this.x - x == 1) {
              this.stop();
              this.face("left");
              if (callback) callback();
              return false;
            }
          }
        }

        var positionChoice = [];
        // 上下左右
        if (this.checkCollision(x, y - 1) == false) {
          positionChoice.push({ x: x, y: y - 1, after: "down" });
        }
        if (this.checkCollision(x, y + 1) == false) {
          positionChoice.push({ x: x, y: y + 1, after: "up" });
        }
        if (this.checkCollision(x - 1, y) == false) {
          positionChoice.push({ x: x - 1, y: y, after: "right" });
        }
        if (this.checkCollision(x + 1, y) == false) {
          positionChoice.push({ x: x + 1, y: y, after: "left" });
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = positionChoice[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var element = _step2.value;
            // 计算地址距离
            element.distance = this.distance(element.x, element.y);
          }

          // 按照地址的距离从近到远排序（从小到大）
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

        positionChoice.sort(function (a, b) {
          return a.distance - b.distance;
        });

        // 如果真正的目的地有可能走，插入到第一位，写在这里是因为目的地并不一定是distance最小的
        if (this.checkCollision(x, y) == false) {
          positionChoice.splice(0, 0, { x: x, y: y });
        }

        var index = 0;
        var otherChoice = false;

        var TestPosition = function TestPosition() {
          if (index < positionChoice.length) {
            (function () {
              var dest = positionChoice[index]; // 保存第一个选项
              index++;
              Game.Astar.getPath({ x: _this6.x, y: _this6.y }, dest, function (result) {
                _this6.gettingPath = false;
                if (_this6.goingNext) {
                  var c = _this6.goingNext;
                  _this6.goingNext = null;
                  _this6.going = false;
                  if (_this6 == Game.hero) {
                    Game.Input.clearDest();
                  }
                  c();
                  return false;
                }
                if (_this6.going) {
                  return false;
                }
                if (result) {
                  if (_this6 == Game.hero) {
                    Game.Input.setDest(dest.x, dest.y);
                  } else {
                    // not hero
                    if (result.length > 30) {
                      // too far
                      return false;
                    }
                  }
                  _this6.gotoPath(result, state, dest.after, callback);
                  return true;
                } else {
                  return TestPosition();
                }
              });
            })();
          } else {
            if (otherChoice == false) {
              otherChoice = true;
              var otherPositionChoice = [];
              // 四个角
              if (_this6.checkCollision(x - 1, y - 1) == false) {
                otherPositionChoice.push({ x: x - 1, y: y - 1, after: "right" });
              }
              if (_this6.checkCollision(x + 1, y - 1) == false) {
                otherPositionChoice.push({ x: x + 1, y: y - 1, after: "left" });
              }
              if (_this6.checkCollision(x - 1, y + 1) == false) {
                otherPositionChoice.push({ x: x - 1, y: y + 1, after: "right" });
              }
              if (_this6.checkCollision(x + 1, y + 1) == false) {
                otherPositionChoice.push({ x: x + 1, y: y + 1, after: "left" });
              }
              // 四个远方向
              if (_this6.checkCollision(x, y - 2) == false) {
                otherPositionChoice.push({ x: x, y: y - 2, after: "down" });
              }
              if (_this6.checkCollision(x, y + 2) == false) {
                otherPositionChoice.push({ x: x, y: y + 2, after: "up" });
              }
              if (_this6.checkCollision(x - 2, y) == false) {
                otherPositionChoice.push({ x: x - 2, y: y, after: "right" });
              }
              if (_this6.checkCollision(x + 2, y) == false) {
                otherPositionChoice.push({ x: x + 2, y: y, after: "left" });
              }

              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = otherPositionChoice[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var element = _step3.value;
                  // 计算地址距离
                  element.distance = _this6.distance(element.x, element.y);
                }

                // 按照地址的距离从近到远排序（从小到大）
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

              otherPositionChoice.sort(function (a, b) {
                return a.distance - b.distance;
              });

              if (otherPositionChoice.length) {
                index = 0;
                positionChoice = otherPositionChoice;
                TestPosition();
              }
            }
          } // 再次尝试离地点最近的地点
        };

        return TestPosition();
      }
    }, {
      key: "gotoPath",
      value: function gotoPath(path, state, after, callback) {
        var _this7 = this;

        this.going = true;
        var index = 1;
        var Walk = function Walk() {
          if (Game.paused) {
            _this7.stop();
            _this7.going = false;
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            return;
          }
          if (_this7.goingNext) {
            var c = _this7.goingNext;
            _this7.goingNext = null;
            _this7.going = false;
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            c();
            return;
          }

          if (index < path.length) {
            var current = { x: _this7.x, y: _this7.y };
            var dest = path[index];
            var direction = null;
            if (dest.x == current.x) {
              if (dest.y > current.y) {
                direction = "down";
              } else if (dest.y < current.y) {
                direction = "up";
              }
            } else if (dest.y == current.y) {
              if (dest.x > current.x) {
                direction = "right";
              } else if (dest.x < current.x) {
                direction = "left";
              }
            }

            if (direction) {
              var currentDirection = _this7.direction;
              if (direction != currentDirection) {
                _this7.stop();
                _this7.face(direction);
              }
              var goResult = _this7.go(state, direction, function () {
                return Walk();
              });
              if (goResult != true) {
                _this7.going = false;
              }
              index++;
            }
          } else {
            // 正常结束
            if (after) {
              _this7.stop();
              _this7.face(after);
            }
            if (_this7 == Game.hero) {
              Game.Input.clearDest();
            }
            _this7.going = false;
            if (callback) callback();
          }
        };
        Walk();
      }
    }, {
      key: "face",
      value: function face(direction) {
        var animation = "face" + direction;
        if (this.animation != animation) {
          this.sprite.play(animation);
          this.emit("change");
        }
      }

      // 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
      // 返回true为有碰撞，返回false为无碰撞
    }, {
      key: "checkCollision",
      value: function checkCollision(x, y) {
        // 地图边缘碰撞
        if (x < 0 || y < 0 || x >= Game.area.map.data.width || y >= Game.area.map.data.height) {
          return true;
        }
        // 地图碰撞
        if (Game.area.map.hitTest(x, y)) {
          return true;
        }

        // 角色碰撞
        if (Game.area.actors) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Game.area.actors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var actor = _step4.value;

              if (actor != this && actor.hitTest(x, y)) {
                return true;
              }
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
        }

        if (Game.area.items) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = Game.area.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var item = _step5.value;

              if (item.hitTest(x, y)) {
                return true;
              }
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

        return false;
      }
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = this.data.hitArea[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var p = _step6.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "go",
      value: function go(state, direction) {
        var _this8 = this;

        var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        if (Game.paused) {
          return false;
        }

        // 如果正在战斗动画，则不走
        if (this.sprite.paused == false && this.sprite.currentAnimation.match(/skillcast|thrust|slash|shoot/)) {
          return false;
        }

        if (this.walking) {
          return false;
        }

        if (this.attacking) {
          return false;
        }

        if (this.direction != direction) {
          this.walking = true;
          this.stop();
          this.face(direction);
          // wait 4 ticks
          Sprite.Ticker.after(4, function () {
            _this8.walking = false;
          });
          return false;
        }

        var newPosition = this.facePosition;

        if (this.checkCollision(newPosition.x, newPosition.y) == false) {
          var _ret3 = (function () {
            // 没碰撞，开始行走
            _this8.walking = true;

            // 把角色位置设置为新位置，为了占领这个位置，这样其他角色就会碰撞
            // 但是不能用this.x = newX这样设置，因为this.x的设置会同时设置this.sprite.x
            var oldX = _this8.data.x;
            var oldY = _this8.data.y;
            _this8.data.x = newPosition.x;
            _this8.data.y = newPosition.y;

            // walk
            // 这些数组和必须是32，为了保证一次go行走32个像素
            var speed = [3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2]; // 和是32
            if (state == "run") {
              // speed = [6,7,6,7,6]; // 和是32
              speed = [4, 4, 4, 4, 4, 4, 4, 4]; // 和是32
            }
            // 比预计多一个，这样是为了流畅
            // 因为下一次go可能紧挨着这次
            var times = speed.length + 1;

            var whilesId = Sprite.Ticker.whiles(times, function (last) {
              if (Game.paused) {
                _this8.data.x = oldX;
                _this8.data.y = oldY;
                _this8.walking = false;
                _this8.emit("change");
                Sprite.Ticker.clearWhiles(whilesId);
                if (callback) {
                  callback();
                }
                return;
              }

              if (last) {
                _this8.x = newPosition.x;
                _this8.y = newPosition.y;
                _this8.walking = false;
                _this8.emit("change");

                if (callback) {
                  callback();
                }
              } else {
                switch (direction) {
                  case "up":
                    _this8.sprite.y -= speed.pop();
                    break;
                  case "down":
                    _this8.sprite.y += speed.pop();
                    break;
                  case "left":
                    _this8.sprite.x -= speed.pop();
                    break;
                  case "right":
                    _this8.sprite.x += speed.pop();
                    break;
                }
              }
            });

            // 播放行走动画
            _this8.play(state + direction, 1);
            return {
              v: true
            };
          })();

          if (typeof _ret3 === "object") return _ret3.v;
        }

        return false;
      }

      /** 在Game.actorLayer上删除人物 */
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        Game.layers.actorLayer.removeChild(this.sprite);
        Game.layers.infoLayer.removeChild(privates.infoBox);
      }

      /** 在Game.actorLayer上显示人物 */
    }, {
      key: "draw",
      value: function draw() {
        var privates = internal(this);
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
          this.x = this.data.x;
          this.y = this.data.y;

          internal(this).infoBox.x = this.sprite.x;
          internal(this).infoBox.y = this.sprite.y - this.sprite.centerY - 20;

          Game.layers.actorLayer.appendChild(this.sprite);
          Game.layers.infoLayer.appendChild(privates.infoBox);
        } else {
          console.error(this.data.x, this.data.y, this.data);
          throw new Error("Game.Actor.draw invalid data.x/data.y");
        }
      }

      /** 镜头集中 */
    }, {
      key: "focus",
      value: function focus() {
        var privates = internal(this);
        privates.infoBox.x = this.sprite.x;
        privates.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
      }
    }, {
      key: "data",
      get: function get() {
        var privates = internal(this);
        return privates.data;
      },
      set: function set(value) {
        throw new Error("Game.Actor.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Actor.id readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return internal(this).data.type;
      },
      set: function set(value) {
        throw new Error("Game.Actor.type readonly");
      }
    }, {
      key: "sprite",
      get: function get() {
        var privates = internal(this);
        return privates.sprite;
      },
      set: function set(value) {
        throw new Error("Game.Actor.sprite readonly");
      }
    }, {
      key: "quest",
      get: function get() {
        var privates = internal(this);
        if (privates.quest) {
          return privates.quest;
        } else {
          return null;
        }
      },
      set: function set(value) {
        throw new Error("Game.Actor.quests readonly");
      }
    }, {
      key: "x",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.x = value;
          this.sprite.x = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid x, x has to be a number and integer");
        }
      }
    }, {
      key: "y",
      get: function get() {
        return this.data.y;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.y = value;
          this.sprite.y = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid y, y has to be a number and integer");
        }
      }
    }, {
      key: "visible",
      get: function get() {
        return this.sprite.visible;
      },
      set: function set(value) {
        this.sprite.visible = value;
        internal(this).infoBox.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return this.sprite.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          this.sprite.alpha = value;
          internal(this).infoBox.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Actor.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        throw new Error("Game.Actor.position readonly");
      }
    }, {
      key: "direction",
      get: function get() {
        return this.sprite.currentAnimation.match(/up|left|down|right/)[0];
      },
      set: function set(value) {
        throw new Error("Game.Actor.direction readonly");
      }
    }, {
      key: "facePosition",
      get: function get() {
        var p = this.position;
        switch (this.direction) {
          case "up":
            p.y -= 1;
            break;
          case "down":
            p.y += 1;
            break;
          case "left":
            p.x -= 1;
            break;
          case "right":
            p.x += 1;
            break;
        }
        return p;
      },
      set: function set(value) {
        throw new Error("Game.Actor.facePosition readonly");
      }
    }]);

    return Actor;
  })(Sprite.Event)); // Game.Actor
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxLQUFLOztpQkFBTCxLQUFLOzthQUVsQixjQUFDLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxZQUFVLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUIscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOztBQUVsQixnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGdCQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQzNCLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUN0QyxzQkFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM3QyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDbkMsc0JBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDMUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2xDLHNCQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFD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QUFDLEtBQUssRUFBRTtBQUNwQixjQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7T0FDbEQ7OztXQUVnQixlQUFHO0FBQ2xCLFlBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDdEIsZ0JBQVEsSUFBSSxDQUFDLFNBQVM7QUFDcEIsZUFBSyxJQUFJO0FBQ1AsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxNQUFNO0FBQ1QsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1YsYUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDVCxrQkFBTTtBQUFBLFNBQ1Q7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWO1dBRWdCLGFBQUMsS0FBSyxFQUFFO0FBQ3ZCLGNBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztPQUNyRDs7O1dBelp3QixLQUFLO0tBQVMsTUFBTSxDQUFDLEtBQUssRUFzbENuRCxDQUFDO0NBRUosQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qXG4gICAg6KeS6Imy57G777yM5YyF5ous5raJ5Y+K5YiwaGVyb+WSjG5wY1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JcIiwgY2xhc3MgQWN0b3IgZXh0ZW5kcyBTcHJpdGUuRXZlbnQge1xuXG4gICAgc3RhdGljIGxvYWQgKGlkKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBTcHJpdGUubG9hZChgYWN0b3IvJHtpZH0uanNgKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IGFjdG9yRGF0YSA9IGRhdGFbMF0oKTtcbiAgICAgICAgICBhY3RvckRhdGEuaWQgPSBpZDtcblxuICAgICAgICAgIGxldCBhY3Rvck9iaiA9IG51bGw7XG4gICAgICAgICAgaWYgKGFjdG9yRGF0YS50eXBlID09IFwibnBjXCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JOUEMoYWN0b3JEYXRhKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yRGF0YS50eXBlID09IFwibW9uc3RlclwiKSB7XG4gICAgICAgICAgICBhY3Rvck9iaiA9IG5ldyBHYW1lLkFjdG9yTW9uc3RlcihhY3RvckRhdGEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3JEYXRhLnR5cGUgPT0gXCJhbGx5XCIpIHtcbiAgICAgICAgICAgIGFjdG9yT2JqID0gbmV3IEdhbWUuQWN0b3JBbGx5KGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhY3RvckRhdGEudHlwZSA9PSBcInBldFwiKSB7XG4gICAgICAgICAgICBhY3Rvck9iaiA9IG5ldyBHYW1lLkFjdG9yUGV0KGFjdG9yRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYWN0b3JEYXRhLnR5cGUsIGFjdG9yRGF0YSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmxvYWQgaW52YWxpZCBhY3RvciB0eXBlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3Rvck9iai5vbihcImNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoYWN0b3JPYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgY29uc3RydWN0b3IgKGFjdG9yRGF0YSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuXG4gICAgICBwcml2YXRlcy5kYXRhID0gYWN0b3JEYXRhO1xuXG4gICAgICB0aGlzLm1ha2VJbmZvQm94KCk7XG5cbiAgICAgIGlmICh0aGlzLmRhdGEuaW1hZ2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLmluaXQodGhpcy5kYXRhLmltYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuZGF0YS5pbWFnZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKFwiYWN0b3IvXCIgKyB0aGlzLmRhdGEuaW1hZ2UpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAvLyBkYXRhIGlzIEFycmF5XG4gICAgICAgICAgdGhpcy5pbml0KGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5pZCwgdGhpcy5kYXRhLCB0aGlzLmRhdGEuaW1hZ2UsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEFjdG9yIEltYWdlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgKGltYWdlcykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZGF0YSA9IHByaXZhdGVzLmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGltYWdlIG9mIGltYWdlcykge1xuICAgICAgICBpZiAoIShpbWFnZSBpbnN0YW5jZW9mIEltYWdlKSAmJiAhKGltYWdlLmdldENvbnRleHQgJiYgaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpKSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIGltYWdlcywgdGhpcyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3RvciBnb3QgaW52YWxpZCBpbWFnZSwgbm90IEltYWdlIG9yIENhbnZhc1wiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgbGV0IHNwcml0ZSA9IG5ldyBTcHJpdGUuU2hlZXQoe1xuICAgICAgICBpbWFnZXM6IGltYWdlcywgLy8gaW1hZ2VzIGlzIEFycmF5XG4gICAgICAgIHdpZHRoOiBkYXRhLnRpbGV3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkYXRhLnRpbGVoZWlnaHQsXG4gICAgICAgIGFuaW1hdGlvbnM6IGRhdGEuYW5pbWF0aW9uc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihkYXRhLmNlbnRlclgpICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIoZGF0YS5jZW50ZXJZKVxuICAgICAgKSB7XG4gICAgICAgIHNwcml0ZS5jZW50ZXJYID0gZGF0YS5jZW50ZXJYO1xuICAgICAgICBzcHJpdGUuY2VudGVyWSA9IGRhdGEuY2VudGVyWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGludmFsaWQgY2VudGVyWC9jZW50ZXJZXCIpO1xuICAgICAgfVxuXG4gICAgICBzcHJpdGUucGxheShcImZhY2Vkb3duXCIpO1xuICAgICAgcHJpdmF0ZXMuc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICBzcHJpdGUub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5pbmZvQm94LnggPSBzcHJpdGUueDtcbiAgICAgICAgcHJpdmF0ZXMuaW5mb0JveC55ID0gc3ByaXRlLnkgLSBzcHJpdGUuY2VudGVyWSAtIDIwXG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbXBsZXRlQ291bnQgPSAtMTtcbiAgICAgIGxldCBDb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgY29tcGxldGVDb3VudCsrO1xuICAgICAgICBpZiAoY29tcGxldGVDb3VudCA+PSAwKSB7XG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGUoKTtcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8g5Yqg6L29TlBD5Y+v6IO95pyJ55qE5Lu75YqhXG4gICAgICBpZiAoZGF0YS5xdWVzdCkge1xuICAgICAgICBwcml2YXRlcy5xdWVzdCA9IFtdO1xuICAgICAgICBwcml2YXRlcy5xdWVzdC5sZW5ndGggPSBkYXRhLnF1ZXN0Lmxlbmd0aDtcbiAgICAgICAgZGF0YS5xdWVzdC5mb3JFYWNoKChxdWVzdElkLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcblxuICAgICAgICAgIEdhbWUuUXVlc3QubG9hZChxdWVzdElkKS50aGVuKChxdWVzdERhdGEpID0+IHtcbiAgICAgICAgICAgIHByaXZhdGVzLnF1ZXN0LnB1c2gocXVlc3REYXRhKTtcbiAgICAgICAgICAgIENvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOWKoOi9veS6uueJqeaKgOiDvVxuICAgICAgaWYgKGRhdGEuc2tpbGxzKSB7XG4gICAgICAgIGRhdGEuc2tpbGxzLmZvckVhY2goKHNraWxsSWQpID0+IHtcbiAgICAgICAgICBjb21wbGV0ZUNvdW50LS07XG4gICAgICAgICAgR2FtZS5Ta2lsbC5sb2FkKHNraWxsSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOWKoOi9veS6uueJqeijheWkh++8iOaaguaXtuWPquacieeOqeWutu+8iVxuICAgICAgaWYgKGRhdGEuZXF1aXBtZW50KSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhLmVxdWlwbWVudCkge1xuICAgICAgICAgIGxldCBpdGVtSWQgPSBkYXRhLmVxdWlwbWVudFtrZXldO1xuICAgICAgICAgIGlmIChpdGVtSWQpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICAgIEdhbWUuSXRlbS5sb2FkKGl0ZW1JZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIENvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g5Yqg6L295Lq654mp54mp5ZOBXG4gICAgICBpZiAoZGF0YS5pdGVtcykge1xuICAgICAgICBmb3IgKGxldCBpdGVtSWQgaW4gZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbXBsZXRlQ291bnQtLTtcbiAgICAgICAgICBHYW1lLkl0ZW0ubG9hZChpdGVtSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQ29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBDb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGdldCBkYXRhICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmRhdGE7XG4gICAgfVxuXG4gICAgc2V0IGRhdGEgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmRhdGEgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5kYXRhLmlkO1xuICAgIH1cblxuICAgIHNldCBpZCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuaWQgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmRhdGEudHlwZTtcbiAgICB9XG5cbiAgICBzZXQgdHlwZSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IudHlwZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc3ByaXRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnNwcml0ZTtcbiAgICB9XG5cbiAgICBzZXQgc3ByaXRlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5zcHJpdGUgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHF1ZXN0ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLnF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy5xdWVzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldCBxdWVzdCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IucXVlc3RzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIG1ha2VJbmZvQm94ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgLy8g5ZCN5a2XXG4gICAgICBsZXQgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgIHRleHQ6IHByaXZhdGVzLmRhdGEubmFtZSxcbiAgICAgICAgbWF4V2lkdGg6IDIwMCxcbiAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgZm9udFNpemU6IDEyXG4gICAgICB9KTtcbiAgICAgIHRleHQuY2VudGVyWSA9IE1hdGguZmxvb3IodGV4dC5oZWlnaHQgLyAyKTtcbiAgICAgIHRleHQuY2VudGVyWCA9IE1hdGguZmxvb3IodGV4dC53aWR0aCAvIDIpO1xuICAgICAgdGV4dC54ID0gMDtcbiAgICAgIHRleHQueSA9IDA7XG5cbiAgICAgIC8vIOS4gOS4quS4iumdouWbm+S4queyvuelnuadoeOAgeihgOadoeeahOiBmuWQiO+8jOe7n+S4gOeuoeeQhuaUvuWFpei/meS4qkNvbnRhaW5lclxuICAgICAgcHJpdmF0ZXMuaW5mb0JveCA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG5cbiAgICAgIGlmIChwcml2YXRlcy5kYXRhLnR5cGUgIT0gXCJoZXJvXCIpIHtcbiAgICAgICAgLy8g6KGA5p2h5aSW6Z2i55qE6buR5qGGXG4gICAgICAgIGxldCBocGJhckJveCA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgaHBiYXJCb3guY2VudGVyWCA9IDE1O1xuICAgICAgICBocGJhckJveC5jZW50ZXJZID0gMjtcbiAgICAgICAgaHBiYXJCb3gueCA9IDA7XG4gICAgICAgIGhwYmFyQm94LnkgPSA5O1xuXG4gICAgICAgIC8vIOmtlOazleadoeWklumdoueahOm7keahhlxuICAgICAgICBsZXQgbXBiYXJCb3ggPSBuZXcgU3ByaXRlLlNoYXBlKCk7XG4gICAgICAgIG1wYmFyQm94LmNlbnRlclggPSAxNTtcbiAgICAgICAgbXBiYXJCb3guY2VudGVyWSA9IDI7XG4gICAgICAgIG1wYmFyQm94LnggPSAwO1xuICAgICAgICBtcGJhckJveC55ID0gMTI7XG5cbiAgICAgICAgaHBiYXJCb3gucmVjdCh7XG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwLFxuICAgICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMFxuICAgICAgICB9KTtcblxuICAgICAgICBtcGJhckJveC5yZWN0KHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOeUn+WRveadoVxuICAgICAgICBwcml2YXRlcy5ocGJhciA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIuY2VudGVyWCA9IDE1O1xuICAgICAgICBwcml2YXRlcy5ocGJhci5jZW50ZXJZID0gMjtcbiAgICAgICAgcHJpdmF0ZXMuaHBiYXIueCA9IDA7XG4gICAgICAgIHByaXZhdGVzLmhwYmFyLnkgPSA5O1xuXG4gICAgICAgIC8vIOeyvuWKm+adoVxuICAgICAgICBwcml2YXRlcy5tcGJhciA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIuY2VudGVyWCA9IDE1O1xuICAgICAgICBwcml2YXRlcy5tcGJhci5jZW50ZXJZID0gMjtcbiAgICAgICAgcHJpdmF0ZXMubXBiYXIueCA9IDA7XG4gICAgICAgIHByaXZhdGVzLm1wYmFyLnkgPSAxMjtcblxuICAgICAgICBwcml2YXRlcy5pbmZvQm94LmFwcGVuZENoaWxkKFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgaHBiYXJCb3gsXG4gICAgICAgICAgbXBiYXJCb3gsXG4gICAgICAgICAgcHJpdmF0ZXMuaHBiYXIsXG4gICAgICAgICAgcHJpdmF0ZXMubXBiYXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxjdWxhdGUgKCkge1xuICAgICAgbGV0IGRhdGEgPSBpbnRlcm5hbCh0aGlzKS5kYXRhO1xuICAgICAgaWYgKFxuICAgICAgICBkYXRhLiRzdHIgJiZcbiAgICAgICAgZGF0YS4kZGV4ICYmXG4gICAgICAgIGRhdGEuJGNvbiAmJlxuICAgICAgICBkYXRhLiRpbnQgJiZcbiAgICAgICAgZGF0YS4kY2hhXG4gICAgICApIHtcblxuICAgICAgICBkYXRhLnN0ciA9IGRhdGEuJHN0cjtcbiAgICAgICAgZGF0YS5kZXggPSBkYXRhLiRkZXg7XG4gICAgICAgIGRhdGEuY29uID0gZGF0YS4kY29uO1xuICAgICAgICBkYXRhLmludCA9IGRhdGEuJGludDtcbiAgICAgICAgZGF0YS5jaGEgPSBkYXRhLiRjaGE7XG5cbiAgICAgICAgLy8g54S25ZCO5Y+v5Lul6ZKI5a+55LiA57qn5bGe5oCn6K6h566XYnVmZlxuXG5cbiAgICAgICAgLy8g6K6h566X5a6M5LiA57qn5bGe5oCn55qEYnVmZuS5i+WQju+8jOW8gOWni+iuoeeul+S6jOe6p+WxnuaAp1xuXG4gICAgICAgIGRhdGEuJGhwID0gZGF0YS5jb24gKiA1O1xuICAgICAgICBkYXRhLiRzcCA9IGRhdGEuaW50ICogNTtcblxuICAgICAgICBkYXRhLmF0ayA9IE1hdGguZmxvb3IoZGF0YS5zdHIgKiAwLjI1KTtcbiAgICAgICAgZGF0YS5tYXRrID0gTWF0aC5mbG9vcihkYXRhLmludCAqIDAuMjUpO1xuICAgICAgICBkYXRhLmRlZiA9IDA7XG4gICAgICAgIGRhdGEubWRlZiA9IDA7XG4gICAgICAgIGRhdGEuY3JpdGljYWwgPSBkYXRhLmRleCAqIDAuMDA1O1xuICAgICAgICBkYXRhLmRvZGdlID0gZGF0YS5kZXggKiAwLjAwNTtcblxuICAgICAgICAvLyDnhLblkI7lj6/ku6Xlr7nkuoznuqflsZ7mgKforqHnrpdidWZmXG5cblxuXG4gICAgICAgIC8vIOWvueS6jOe6p+WxnuaAp+iuoeeul+WujGJ1ZmbkuYvlkI7vvIzlj6/ku6XorqHnrpfkvJrlj5jliqjnmoTlgLxcbiAgICAgICAgLy8g5L6L5aaCLiRocOaYr2J1ZmbkuYvlkI7nmoTnlJ/lkb3lgLzkuIrpmZDvvIwuaHDmmK/lvZPliY3nlJ/lkb3lgLxcbiAgICAgICAgZGF0YS5ocCA9IGRhdGEuJGhwO1xuICAgICAgICBkYXRhLnNwID0gZGF0YS4kc3A7XG5cbiAgICAgICAgaWYgKGRhdGEuYnVmZiAmJiBkYXRhLm5lcmYpIHtcbiAgICAgICAgICBkYXRhLmJ1ZmYuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGF0YS5uZXJmLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHggKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS54O1xuICAgIH1cblxuICAgIHNldCB4ICh2YWx1ZSkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiYgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5kYXRhLnggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5zcHJpdGUueCA9IHZhbHVlICogMzIgKyAxNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIGludGVybmFsKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3RvciBnb3QgaW52YWxpZCB4LCB4IGhhcyB0byBiZSBhIG51bWJlciBhbmQgaW50ZWdlclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgeSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnk7XG4gICAgfVxuXG4gICAgc2V0IHkgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmRhdGEueSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNwcml0ZS55ID0gdmFsdWUgKiAzMiArIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgaW50ZXJuYWwodGhpcyksIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yIGdvdCBpbnZhbGlkIHksIHkgaGFzIHRvIGJlIGEgbnVtYmVyIGFuZCBpbnRlZ2VyXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCB2aXNpYmxlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlICh2YWx1ZSkge1xuICAgICAgdGhpcy5zcHJpdGUudmlzaWJsZSA9IHZhbHVlO1xuICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC52aXNpYmxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGFscGhhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwcml0ZS5hbHBoYTtcbiAgICB9XG5cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDEpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuYWxwaGEgPSB2YWx1ZTtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC5hbHBoYSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih2YWx1ZSwgdGhpcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuYWxwaGEgZ290IGludmFsaWQgdmFsdWVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHBvc2l0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgeTogdGhpcy55XG4gICAgICB9O1xuICAgIH1cblxuICAgIHNldCBwb3NpdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IucG9zaXRpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGRpcmVjdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvdXB8bGVmdHxkb3dufHJpZ2h0LylbMF07XG4gICAgfVxuXG4gICAgc2V0IGRpcmVjdGlvbiAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZGlyZWN0aW9uIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBmYWNlUG9zaXRpb24gKCkge1xuICAgICAgbGV0IHAgPSB0aGlzLnBvc2l0aW9uO1xuICAgICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICBwLnkgLT0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICBwLnkgKz0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICBwLnggLT0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgcC54ICs9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBzZXQgZmFjZVBvc2l0aW9uICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5mYWNlUG9zaXRpb24gcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmhwYmFyICYmIHByaXZhdGVzLm1wYmFyKSB7XG4gICAgICAgIGxldCBocGNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICBpZiAoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApIDwgMC4yNSlcbiAgICAgICAgICBocGNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgZWxzZSBpZiAoKHRoaXMuZGF0YS5ocCAvIHRoaXMuZGF0YS4kaHApIDwgMC41KVxuICAgICAgICAgIGhwY29sb3IgPSBcInllbGxvd1wiO1xuXG4gICAgICAgIHByaXZhdGVzLmhwYmFyLmNsZWFyKCkucmVjdCh7XG4gICAgICAgICAgeDogMSxcbiAgICAgICAgICB5OiAxLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmZsb29yKCh0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwKSAqIDI4KSxcbiAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgZmlsbDogaHBjb2xvcixcbiAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGVzLm1wYmFyLmNsZWFyKCkucmVjdCh7XG4gICAgICAgICAgeDogMSxcbiAgICAgICAgICB5OiAxLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmZsb29yKCh0aGlzLmRhdGEuc3AgLyB0aGlzLmRhdGEuJHNwKSAqIDI4KSxcbiAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgZmlsbDogXCJibHVlXCIsXG4gICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXN0YW5jZSAoKSB7XG4gICAgICBsZXQgeCA9IG51bGwsIHkgPSBudWxsO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMiAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdKSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzFdKSkge1xuICAgICAgICB4ID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzFdO1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgTnVtYmVyLmlzRmluaXRlKGFyZ3VtZW50c1swXS54KSAmJiBOdW1iZXIuaXNGaW5pdGUoYXJndW1lbnRzWzBdLnkpKSB7XG4gICAgICAgIHggPSBhcmd1bWVudHNbMF0ueDtcbiAgICAgICAgeSA9IGFyZ3VtZW50c1swXS55O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihhcmd1bWVudHMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLkFjdG9yLmRpc3RhbmNlIEludmFsaWQgYXJndW1lbnRzXCIpO1xuICAgICAgfVxuICAgICAgbGV0IGQgPSAwO1xuICAgICAgZCArPSBNYXRoLnBvdyh0aGlzLnggLSB4LCAyKTtcbiAgICAgIGQgKz0gTWF0aC5wb3codGhpcy55IC0geSwgMik7XG4gICAgICBkID0gTWF0aC5zcXJ0KGQpO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VIUCAocG93ZXIpIHtcbiAgICAgIHRoaXMuZGF0YS5ocCAtPSBwb3dlcjtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgIH1cblxuICAgIGRlY3JlYXNlU1AgKHNwKSB7XG4gICAgICB0aGlzLmRhdGEuc3AgLT0gc3A7XG4gICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICB9XG5cbiAgICBkZWFkIChhdHRhY2tlcikge1xuICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8PSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEudHlwZSA9PSBcImhlcm9cIikge1xuICAgICAgICAgIEdhbWUud2luZG93cy5vdmVyLm9wZW4oYOS9oOiiqyR7YXR0YWNrZXIuZGF0YS5uYW1lfeaJk+atu+S6hmApO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgdGhpcy5lcmFzZSgpO1xuICAgICAgICAgIEdhbWUuYXJlYS5hY3RvcnMuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhLml0ZW1zIHx8IHsgZ29sZDogMSB9O1xuXG4gICAgICAgICAgR2FtZS5hZGRCYWcodGhpcy54ICx0aGlzLnkpLnRoZW4oKGJhZykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaXRlbUlkIGluIGl0ZW1zKSB7XG4gICAgICAgICAgICAgIGlmIChiYWcuaW5uZXIuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgICAgICAgICAgIGJhZy5pbm5lcltpdGVtSWRdICs9IGl0ZW1zW2l0ZW1JZF07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFnLmlubmVyW2l0ZW1JZF0gPSBpdGVtc1tpdGVtSWRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhdHRhY2tlci5lbWl0KFwia2lsbFwiLCBmYWxzZSwgdGhpcyk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDpl6rkuIDpl6rkurrnianvvIzkvovlpoLooqvlh7vkuK3ml7bnmoTmlYjmnpwgKi9cbiAgICBmbGFzaCAoKSB7XG4gICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDAuNTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDE7XG4gICAgICB9LCAyMDApO1xuICAgIH1cblxuICAgIC8qKiDlj5fliLBhdHRhY2tlcueahHNraWxs5oqA6IO955qE5Lyk5a6zICovXG4gICAgZGFtYWdlIChhdHRhY2tlciwgc2tpbGwpIHtcblxuICAgICAgdGhpcy5lbWl0KFwiZGFtYWdlZFwiKTtcblxuICAgICAgbGV0IHBvd2VyID0gc2tpbGwucG93ZXI7XG4gICAgICBsZXQgdHlwZSA9IHNraWxsLnR5cGU7XG5cbiAgICAgIGxldCBjb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGlmICh0aGlzLmRhdGEudHlwZSA9PSBcImhlcm9cIikge1xuICAgICAgICBjb2xvciA9IFwicmVkXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgcG93ZXIgKz0gYXR0YWNrZXIuZGF0YS5hdGs7XG4gICAgICAgIHBvd2VyIC09IHRoaXMuZGF0YS5kZWZcbiAgICAgICAgcG93ZXIgPSBNYXRoLm1heCgwLCBwb3dlcik7XG4gICAgICB9IGVsc2UgeyAvLyB0eXBlID09IG1hZ2ljXG4gICAgICAgIHBvd2VyICs9IGF0dGFja2VyLmRhdGEubWF0aztcbiAgICAgICAgcG93ZXIgLSB0aGlzLmRhdGEubWRlZlxuICAgICAgICBwb3dlciA9IE1hdGgubWF4KDAsIHBvd2VyKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHQgPSBudWxsO1xuICAgICAgbGV0IHN0YXRlID0gbnVsbDtcblxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCB0aGlzLmRhdGEuZG9kZ2UpIHsgLy8g6Zeq6YG/5LqGXG4gICAgICAgIHN0YXRlID0gXCJkb2RnZVwiO1xuICAgICAgICB0ZXh0ID0gbmV3IFNwcml0ZS5UZXh0KHtcbiAgICAgICAgICB0ZXh0OiBcIm1pc3NcIixcbiAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IDE2XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChNYXRoLnJhbmRvbSgpIDwgYXR0YWNrZXIuZGF0YS5jcml0aWNhbCkgeyAvLyDph43lh7vkuoZcbiAgICAgICAgc3RhdGUgPSBcImNyaXRpY2FsXCI7XG4gICAgICAgIHBvd2VyICo9IDI7XG4gICAgICAgIHRleHQgPSBuZXcgU3ByaXRlLlRleHQoe1xuICAgICAgICAgIHRleHQ6IFwiLVwiICsgcG93ZXIsXG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIGZvbnRTaXplOiAzMlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFzaCgpO1xuICAgICAgICB0aGlzLmRlY3JlYXNlSFAocG93ZXIpO1xuICAgICAgfSBlbHNlIHsgLy8g5pmu6YCa5Ye75LitXG4gICAgICAgIHN0YXRlID0gXCJoaXRcIjtcbiAgICAgICAgdGV4dCA9IG5ldyBTcHJpdGUuVGV4dCh7XG4gICAgICAgICAgdGV4dDogXCItXCIgKyBwb3dlcixcbiAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IDE2XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZsYXNoKCk7XG4gICAgICAgIHRoaXMuZGVjcmVhc2VIUChwb3dlcik7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBpZiAoc3RhdGUgIT0gXCJkb2RnZVwiICYmIHRoaXMgIT0gR2FtZS5oZXJvKSB7XG4gICAgICAgIGlmIChHYW1lLnNvdW5kcy5odXJ0KSB7XG4gICAgICAgICAgR2FtZS5zb3VuZHMuaHVydC5sb2FkKCk7XG4gICAgICAgICAgR2FtZS5zb3VuZHMuaHVydC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICovXG5cbiAgICAgIHRleHQuY2VudGVyWCA9IE1hdGguZmxvb3IodGV4dC53aWR0aCAvIDIpO1xuICAgICAgdGV4dC5jZW50ZXJZID0gTWF0aC5mbG9vcih0ZXh0LmhlaWdodCk7XG4gICAgICB0ZXh0LnggPSB0aGlzLnNwcml0ZS54O1xuICAgICAgdGV4dC55ID0gdGhpcy5zcHJpdGUueTtcblxuICAgICAgdGV4dC54ICs9IFNwcml0ZS5yYW5kKC0xMCwgMTApO1xuXG4gICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICBsZXQgc3BlZWQgPSBTcHJpdGUucmFuZCgxLCAzKTtcblxuICAgICAgU3ByaXRlLlRpY2tlci53aGlsZXMoMTAwLCAobGFzdCkgPT4ge1xuICAgICAgICB0ZXh0LnkgLT0gc3BlZWQ7XG4gICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOa1i+ivleaYr+WQpuatu+S6oVxuICAgICAgdGhpcy5kZWFkKGF0dGFja2VyKTtcblxuICAgIH1cblxuICAgIC8qKiDmkq3mlL7kuIDkuKrliqjnlLsgKi9cbiAgICBwbGF5IChhbmltYXRpb24sIHByaW9yaXR5KSB7XG4gICAgICAvLyDmlrDliqjnlLvpu5jorqTkvJjlhYjnuqfkuLowXG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwcmlvcml0eSkpIHtcbiAgICAgICAgcHJpb3JpdHkgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyDml6DliqjnlLvmiJbogIXlgZzmraLnirbmgIHvvIznjrDmnInkvJjlhYjnuqfkuLotMe+8iOacgOS9jue6p++8iVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmFuaW1hdGlvblByaW9yaXR5ID09IFwidW5kZWZpbmVkXCIgfHwgdGhpcy5zcHJpdGUucGF1c2VkID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Qcmlvcml0eSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuZGF0YS5hbmltYXRpb25zLmhhc093blByb3BlcnR5KGFuaW1hdGlvbikgJiZcbiAgICAgICAgcHJpb3JpdHkgPj0gdGhpcy5hbmltYXRpb25Qcmlvcml0eSAmJlxuICAgICAgICBhbmltYXRpb24gIT0gdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvblxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uUHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgdGhpcy5zcHJpdGUucGxheShhbmltYXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDlgZzmraIgKi9cbiAgICBzdG9wICgpIHtcbiAgICAgIGlmICghdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbikgcmV0dXJuO1xuXG4gICAgICBpZiAoKHRoaXMuc3ByaXRlLnBhdXNlZCAmJiAhdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvZmFjZS8pKVxuICAgICAgICB8fCB0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uLm1hdGNoKC93YWxrfHJ1bi8pKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNldXBcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2Vkb3duXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBsYXkoXCJmYWNlbGVmdFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucGxheShcImZhY2VyaWdodFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOWQkeaMh+WummRpcmVjdGlvbuaWueWQkemHiuaUvuS4gOS4quaKgOiDvSAqL1xuICAgIGZpcmUgKGlkLCBkaXJlY3Rpb24pIHtcbiAgICAgIC8vIOWQjOS4gOaXtumXtOWPquiDveaWveWxleS4gOS4qnNraWxsXG4gICAgICBpZiAodGhpcy5hdHRhY2tpbmcpXG4gICAgICAgIHJldHVybiAwO1xuXG4gICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tpZF07XG4gICAgICBpZiAoIXNraWxsKVxuICAgICAgICByZXR1cm4gMDtcblxuICAgICAgLy8g5Y+q5pyJ5b2T6L+Z5Liqc2tpbGznmoRjb29sZG93bue7k1xuICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgaWYgKFxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrKSAmJlxuICAgICAgICBOdW1iZXIuaXNGaW5pdGUodGhpcy5sYXN0QXR0YWNrQ29vbGRvd24pICYmXG4gICAgICAgIChub3cgLSB0aGlzLmxhc3RBdHRhY2spIDwgdGhpcy5sYXN0QXR0YWNrQ29vbGRvd25cbiAgICAgICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNraWxsLmRhdGEuY29zdCA+IHRoaXMuZGF0YS5zcCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICB9XG5cbiAgICAgIGlmICggLy8g546p5a625L2/55So5oqA6IO95piv5Y+v6IO95pyJ5p2h5Lu255qE77yM5L6L5aaC5YmR5oqA6IO96ZyA6KaB6KOF5aSH5YmRXG4gICAgICAgIHRoaXMudHlwZSA9PSBcImhlcm9cIiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbiAmJlxuICAgICAgICBza2lsbC5kYXRhLmNvbmRpdGlvbigpID09IGZhbHNlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEF0dGFjayA9IG5vdztcbiAgICAgIHRoaXMubGFzdEF0dGFja0Nvb2xkb3duID0gc2tpbGwuZGF0YS5jb29sZG93bjtcbiAgICAgIHRoaXMuYXR0YWNraW5nID0gdHJ1ZTtcblxuICAgICAgdGhpcy5kYXRhLnNwIC09IHNraWxsLmRhdGEuY29zdDtcbiAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuXG4gICAgICBza2lsbC5maXJlKHRoaXMsIGRpcmVjdGlvbiwgKGhpdHRlZCkgPT4ge1xuICAgICAgICB0aGlzLmF0dGFja2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAoaGl0dGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBoaXR0ZWRbMF0uZGFtYWdlKHRoaXMsIHNraWxsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNraWxsLmRhdGEuY29vbGRvd247XG4gICAgfVxuXG4gICAgLyoqIOihjOi1sOWIsOaMh+WumuWcsOeCuSAqL1xuICAgIGdvdG8gKHgsIHksIHN0YXRlLCBjYWxsYmFjaykge1xuXG4gICAgICBpZiAodGhpcy5nb2luZykge1xuICAgICAgICB0aGlzLmdvaW5nTmV4dCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvdG8oeCwgeSwgc3RhdGUsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGVzdEJsb2NrZWQgPSB0aGlzLmNoZWNrQ29sbGlzaW9uKHgsIHkpO1xuXG4gICAgICBpZiAoZGVzdEJsb2NrZWQpIHtcbiAgICAgICAgaWYgKHRoaXMueCA9PSB4KSB7XG4gICAgICAgICAgaWYgKHRoaXMueSAtIHkgPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5mYWNlKFwiZG93blwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSAtIHkgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJ1cFwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy55ID09IHkpIHtcbiAgICAgICAgICBpZiAodGhpcy54IC0geCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJyaWdodFwiKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueCAtIHggPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZhY2UoXCJsZWZ0XCIpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcG9zaXRpb25DaG9pY2UgPSBbXTtcbiAgICAgIC8vIOS4iuS4i+W3puWPs1xuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5LTEsIGFmdGVyOiBcImRvd25cIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSsxKSA9PSBmYWxzZSkge1xuICAgICAgICBwb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5KzEsIGFmdGVyOiBcInVwXCJ9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgcG9zaXRpb25DaG9pY2UucHVzaCh7eDogeC0xLCB5OiB5LCBhZnRlcjogXCJyaWdodFwifSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHkpID09IGZhbHNlKSB7XG4gICAgICAgIHBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgrMSwgeTogeSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgcG9zaXRpb25DaG9pY2UpIHsgLy8g6K6h566X5Zyw5Z2A6Led56a7XG4gICAgICAgIGVsZW1lbnQuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlKGVsZW1lbnQueCwgZWxlbWVudC55KTtcbiAgICAgIH1cblxuICAgICAgLy8g5oyJ54Wn5Zyw5Z2A55qE6Led56a75LuO6L+R5Yiw6L+c5o6S5bqP77yI5LuO5bCP5Yiw5aSn77yJXG4gICAgICBwb3NpdGlvbkNob2ljZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyDlpoLmnpznnJ/mraPnmoTnm67nmoTlnLDmnInlj6/og73otbDvvIzmj5LlhaXliLDnrKzkuIDkvY3vvIzlhpnlnKjov5nph4zmmK/lm6DkuLrnm67nmoTlnLDlubbkuI3kuIDlrprmmK9kaXN0YW5jZeacgOWwj+eahFxuICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgcG9zaXRpb25DaG9pY2Uuc3BsaWNlKDAsIDAsIHt4OiB4LCB5OiB5fSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBsZXQgb3RoZXJDaG9pY2UgPSBmYWxzZTtcblxuICAgICAgbGV0IFRlc3RQb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4IDwgcG9zaXRpb25DaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGRlc3QgPSBwb3NpdGlvbkNob2ljZVtpbmRleF07IC8vIOS/neWtmOesrOS4gOS4qumAiemhuVxuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgR2FtZS5Bc3Rhci5nZXRQYXRoKHt4OiB0aGlzLngsIHk6IHRoaXMueX0sIGRlc3QsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0dGluZ1BhdGggPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdvaW5nTmV4dCkge1xuICAgICAgICAgICAgICBsZXQgYyA9IHRoaXMuZ29pbmdOZXh0O1xuICAgICAgICAgICAgICB0aGlzLmdvaW5nTmV4dCA9IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmdvaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICAgICAgR2FtZS5JbnB1dC5zZXREZXN0KGRlc3QueCwgZGVzdC55KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gbm90IGhlcm9cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDMwKSB7XG4gICAgICAgICAgICAgICAgICAvLyB0b28gZmFyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuZ290b1BhdGgocmVzdWx0LCBzdGF0ZSwgZGVzdC5hZnRlciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUZXN0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3RoZXJDaG9pY2UgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG90aGVyQ2hvaWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBvdGhlclBvc2l0aW9uQ2hvaWNlID0gW107XG4gICAgICAgICAgICAvLyDlm5vkuKrop5JcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMSwgeS0xKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnB1c2goe3g6IHgtMSwgeTogeS0xLCBhZnRlcjogXCJyaWdodFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4KzEsIHktMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzEsIHk6IHktMSwgYWZ0ZXI6IFwibGVmdFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LTEsIHkrMSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTEsIHk6IHkrMSwgYWZ0ZXI6IFwicmlnaHRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oeCsxLCB5KzEpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCsxLCB5OiB5KzEsIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5Zub5Liq6L+c5pa55ZCRXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvbGxpc2lvbih4LCB5LTIpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIG90aGVyUG9zaXRpb25DaG9pY2UucHVzaCh7eDogeCwgeTogeS0yLCBhZnRlcjogXCJkb3duXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgsIHkrMikgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LCB5OiB5KzIsIGFmdGVyOiBcInVwXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgtMiwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4LTIsIHk6IHksIGFmdGVyOiBcInJpZ2h0XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKHgrMiwgeSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3RoZXJQb3NpdGlvbkNob2ljZS5wdXNoKHt4OiB4KzIsIHk6IHksIGFmdGVyOiBcImxlZnRcIn0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIG90aGVyUG9zaXRpb25DaG9pY2UpIHsgLy8g6K6h566X5Zyw5Z2A6Led56a7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlKGVsZW1lbnQueCwgZWxlbWVudC55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5oyJ54Wn5Zyw5Z2A55qE6Led56a75LuO6L+R5Yiw6L+c5o6S5bqP77yI5LuO5bCP5Yiw5aSn77yJXG4gICAgICAgICAgICBvdGhlclBvc2l0aW9uQ2hvaWNlLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvdGhlclBvc2l0aW9uQ2hvaWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgIHBvc2l0aW9uQ2hvaWNlID0gb3RoZXJQb3NpdGlvbkNob2ljZTtcbiAgICAgICAgICAgICAgVGVzdFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vIOWGjeasoeWwneivleemu+WcsOeCueacgOi/keeahOWcsOeCuVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gVGVzdFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgZ290b1BhdGggKHBhdGgsIHN0YXRlLCBhZnRlciwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZ29pbmcgPSB0cnVlO1xuICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgIGxldCBXYWxrID0gKCkgPT4ge1xuICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHtcbiAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgICBHYW1lLklucHV0LmNsZWFyRGVzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ29pbmdOZXh0KSB7XG4gICAgICAgICAgbGV0IGMgPSB0aGlzLmdvaW5nTmV4dDtcbiAgICAgICAgICB0aGlzLmdvaW5nTmV4dCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGN1cnJlbnQgPSB7eDogdGhpcy54LCB5OiB0aGlzLnl9O1xuICAgICAgICAgIGxldCBkZXN0ID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgaWYgKGRlc3QueCA9PSBjdXJyZW50LngpIHtcbiAgICAgICAgICAgIGlmIChkZXN0LnkgPiBjdXJyZW50LnkpIHtcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlc3QueSA8IGN1cnJlbnQueSkge1xuICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBcInVwXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChkZXN0LnkgPT0gY3VycmVudC55KSB7XG4gICAgICAgICAgICBpZiAoZGVzdC54ID4gY3VycmVudC54KSB7XG4gICAgICAgICAgICAgIGRpcmVjdGlvbiA9IFwicmlnaHRcIlxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXN0LnggPCBjdXJyZW50LngpIHtcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnREaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gIT0gY3VycmVudERpcmVjdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgdGhpcy5mYWNlKGRpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29SZXN1bHQgPSB0aGlzLmdvKHN0YXRlLCBkaXJlY3Rpb24sICgpID0+IFdhbGsoKSk7XG4gICAgICAgICAgICBpZiAoZ29SZXN1bHQgIT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB0aGlzLmdvaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8g5q2j5bi457uT5p2fXG4gICAgICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjZShhZnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzID09IEdhbWUuaGVybykge1xuICAgICAgICAgICAgR2FtZS5JbnB1dC5jbGVhckRlc3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgV2FsaygpO1xuICAgIH1cblxuICAgIGZhY2UgKGRpcmVjdGlvbikge1xuICAgICAgbGV0IGFuaW1hdGlvbiA9IFwiZmFjZVwiICsgZGlyZWN0aW9uO1xuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICE9IGFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnNwcml0ZS5wbGF5KGFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlj4LmlbB05Lit6K6w5b2V5LqG5p+Q5Liq5pa55qC855qE5pa55L2NeHnvvIzmtYvor5Xov5nkuKrmlrnmoLzmmK/lkKblkoznjqnlrrbmnInlhrLnqoFcbiAgICAvLyDov5Tlm550cnVl5Li65pyJ56Kw5pKe77yM6L+U5ZueZmFsc2XkuLrml6DnorDmkp5cbiAgICBjaGVja0NvbGxpc2lvbiAoeCwgeSkge1xuICAgICAgLy8g5Zyw5Zu+6L6557yY56Kw5pKeXG4gICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSBHYW1lLmFyZWEubWFwLmRhdGEud2lkdGggfHwgeSA+PSBHYW1lLmFyZWEubWFwLmRhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8g5Zyw5Zu+56Kw5pKeXG4gICAgICBpZiAoR2FtZS5hcmVhLm1hcC5oaXRUZXN0KHgsIHkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyDop5LoibLnorDmkp5cbiAgICAgIGlmIChHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgIGZvciAobGV0IGFjdG9yIG9mIEdhbWUuYXJlYS5hY3RvcnMpIHtcbiAgICAgICAgICBpZiAoYWN0b3IgIT0gdGhpcyAmJiBhY3Rvci5oaXRUZXN0KHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIEdhbWUuYXJlYS5pdGVtcykge1xuICAgICAgICAgIGlmIChpdGVtLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGhpdFRlc3QgKHgsIHkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaGl0QXJlYSAmJiB0aGlzLmRhdGEuaGl0QXJlYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5kYXRhLmhpdEFyZWEpIHtcbiAgICAgICAgICBpZiAoeCA9PSB0aGlzLnggKyBwWzBdICYmIHkgPT0gdGhpcy55ICsgcFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5kYXRhKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5BY3Rvci5oaXRUZXN0IGludmFsaWQgZGF0YVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnbyAoc3RhdGUsIGRpcmVjdGlvbiwgY2FsbGJhY2sgPSBudWxsKSB7XG5cbiAgICAgIGlmIChHYW1lLnBhdXNlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIOWmguaenOato+WcqOaImOaWl+WKqOeUu++8jOWImeS4jei1sFxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnNwcml0ZS5wYXVzZWQgPT0gZmFsc2UgJiZcbiAgICAgICAgdGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbi5tYXRjaCgvc2tpbGxjYXN0fHRocnVzdHxzbGFzaHxzaG9vdC8pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy53YWxraW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYXR0YWNraW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9IGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5mYWNlKGRpcmVjdGlvbik7XG4gICAgICAgIC8vIHdhaXQgNCB0aWNrc1xuICAgICAgICBTcHJpdGUuVGlja2VyLmFmdGVyKDQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLndhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG5cbiAgICAgIGlmICh0aGlzLmNoZWNrQ29sbGlzaW9uKG5ld1Bvc2l0aW9uLngsIG5ld1Bvc2l0aW9uLnkpID09IGZhbHNlKSB7XG4gICAgICAgIC8vIOayoeeisOaSnu+8jOW8gOWni+ihjOi1sFxuICAgICAgICB0aGlzLndhbGtpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIOaKiuinkuiJsuS9jee9ruiuvue9ruS4uuaWsOS9jee9ru+8jOS4uuS6huWNoOmihui/meS4quS9jee9ru+8jOi/meagt+WFtuS7luinkuiJsuWwseS8mueisOaSnlxuICAgICAgICAvLyDkvYbmmK/kuI3og73nlKh0aGlzLnggPSBuZXdY6L+Z5qC36K6+572u77yM5Zug5Li6dGhpcy5455qE6K6+572u5Lya5ZCM5pe26K6+572udGhpcy5zcHJpdGUueFxuICAgICAgICBsZXQgb2xkWCA9IHRoaXMuZGF0YS54O1xuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuZGF0YS55O1xuICAgICAgICB0aGlzLmRhdGEueCA9IG5ld1Bvc2l0aW9uLng7XG4gICAgICAgIHRoaXMuZGF0YS55ID0gbmV3UG9zaXRpb24ueTtcblxuICAgICAgICAvLyB3YWxrXG4gICAgICAgIC8vIOi/meS6m+aVsOe7hOWSjOW/hemhu+aYrzMy77yM5Li65LqG5L+d6K+B5LiA5qyhZ2/ooYzotbAzMuS4quWDj+e0oFxuICAgICAgICBsZXQgc3BlZWQgPSBbMywzLDIsMywzLDIsMywzLDIsMywzLDJdOyAvLyDlkozmmK8zMlxuICAgICAgICBpZiAoc3RhdGUgPT0gXCJydW5cIikge1xuICAgICAgICAgIC8vIHNwZWVkID0gWzYsNyw2LDcsNl07IC8vIOWSjOaYrzMyXG4gICAgICAgICAgc3BlZWQgPSBbNCw0LDQsNCw0LDQsNCw0XTsgLy8g5ZKM5pivMzJcbiAgICAgICAgfVxuICAgICAgICAvLyDmr5TpooTorqHlpJrkuIDkuKrvvIzov5nmoLfmmK/kuLrkuobmtYHnlYVcbiAgICAgICAgLy8g5Zug5Li65LiL5LiA5qyhZ2/lj6/og73ntKfmjKjnnYDov5nmrKFcbiAgICAgICAgbGV0IHRpbWVzID0gc3BlZWQubGVuZ3RoICsgMTtcblxuICAgICAgICBsZXQgd2hpbGVzSWQgPSBTcHJpdGUuVGlja2VyLndoaWxlcyh0aW1lcywgKGxhc3QpID0+IHtcbiAgICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS54ID0gb2xkWDtcbiAgICAgICAgICAgIHRoaXMuZGF0YS55ID0gb2xkWTtcbiAgICAgICAgICAgIHRoaXMud2Fsa2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgU3ByaXRlLlRpY2tlci5jbGVhcldoaWxlcyh3aGlsZXNJZCk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobGFzdCkge1xuICAgICAgICAgICAgdGhpcy54ID0gbmV3UG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRoaXMueSA9IG5ld1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICB0aGlzLndhbGtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLnkgLT0gc3BlZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUueSArPSBzcGVlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS54IC09IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS54ICs9IHNwZWVkLnBvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5pKt5pS+6KGM6LWw5Yqo55S7XG4gICAgICAgIHRoaXMucGxheShzdGF0ZSArIGRpcmVjdGlvbiwgMSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIOWcqEdhbWUuYWN0b3JMYXllcuS4iuWIoOmZpOS6uueJqSAqL1xuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgR2FtZS5sYXllcnMuYWN0b3JMYXllci5yZW1vdmVDaGlsZCh0aGlzLnNwcml0ZSk7XG4gICAgICBHYW1lLmxheWVycy5pbmZvTGF5ZXIucmVtb3ZlQ2hpbGQocHJpdmF0ZXMuaW5mb0JveCk7XG4gICAgfVxuXG4gICAgLyoqIOWcqEdhbWUuYWN0b3JMYXllcuS4iuaYvuekuuS6uueJqSAqL1xuICAgIGRyYXcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLngpICYmIE51bWJlci5pc0ludGVnZXIodGhpcy55KSkge1xuICAgICAgICB0aGlzLnggPSB0aGlzLmRhdGEueDtcbiAgICAgICAgdGhpcy55ID0gdGhpcy5kYXRhLnk7XG5cbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC54ID0gdGhpcy5zcHJpdGUueDtcbiAgICAgICAgaW50ZXJuYWwodGhpcykuaW5mb0JveC55ID0gdGhpcy5zcHJpdGUueSAtIHRoaXMuc3ByaXRlLmNlbnRlclkgLSAyMDtcblxuICAgICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmFwcGVuZENoaWxkKHRoaXMuc3ByaXRlKTtcbiAgICAgICAgR2FtZS5sYXllcnMuaW5mb0xheWVyLmFwcGVuZENoaWxkKHByaXZhdGVzLmluZm9Cb3gpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLmRhdGEueCwgdGhpcy5kYXRhLnksIHRoaXMuZGF0YSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuQWN0b3IuZHJhdyBpbnZhbGlkIGRhdGEueC9kYXRhLnlcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOmVnOWktOmbhuS4rSAqL1xuICAgIGZvY3VzICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuaW5mb0JveC54ID0gdGhpcy5zcHJpdGUueDtcbiAgICAgIHByaXZhdGVzLmluZm9Cb3gueSA9IHRoaXMuc3ByaXRlLnkgLSB0aGlzLnNwcml0ZS5jZW50ZXJZIC0gMjA7XG5cbiAgICAgIEdhbWUuc3RhZ2UuY2VudGVyWCA9IE1hdGgucm91bmQodGhpcy5zcHJpdGUueCAtIEdhbWUuY29uZmlnLndpZHRoIC8gMik7XG4gICAgICBHYW1lLnN0YWdlLmNlbnRlclkgPSBNYXRoLnJvdW5kKHRoaXMuc3ByaXRlLnkgLSBHYW1lLmNvbmZpZy5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgfSk7IC8vIEdhbWUuQWN0b3JcblxufSkoKTtcbiJdfQ==

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
  Game.assign("ActorAlly", (function (_Game$Actor) {
    _inherits(GameActorAlly, _Game$Actor);

    function GameActorAlly(actorData) {
      _classCallCheck(this, GameActorAlly);

      _get(Object.getPrototypeOf(GameActorAlly.prototype), "constructor", this).call(this, actorData);
    }

    return GameActorAlly;
  })(Game.Actor));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3RvckFsbHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7O0FBT2xDLE1BQUksQ0FBQyxNQUFNLENBQUMsV0FBVztjQUFRLGFBQWE7O0FBQzlCLGFBRGlCLGFBQWEsQ0FDN0IsU0FBUyxFQUFFOzRCQURLLGFBQWE7O0FBRXhDLGlDQUYyQixhQUFhLDZDQUVsQyxTQUFTLEVBQUU7S0FDbEI7O1dBSDRCLGFBQWE7S0FBUyxJQUFJLENBQUMsS0FBSyxFQU03RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUFjdG9yQWxseS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICDoi7Hpm4TnsbtcbiAgICDlsZ7mgKfvvJpcbiAgICAgIHRoaXMuc3ByaXRlIOeyvueBtVxuICAqL1xuICBHYW1lLmFzc2lnbihcIkFjdG9yQWxseVwiLCBjbGFzcyBHYW1lQWN0b3JBbGx5IGV4dGVuZHMgR2FtZS5BY3RvciB7XG4gICAgY29uc3RydWN0b3IgKGFjdG9yRGF0YSkge1xuICAgICAgc3VwZXIoYWN0b3JEYXRhKTtcbiAgICB9XG5cblxuICB9KTtcblxuXG59KSgpO1xuIl19

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
  Game.assign("ActorHero", (function (_Game$Actor) {
    _inherits(GameActorHero, _Game$Actor);

    function GameActorHero(actorData) {
      var _this = this;

      _classCallCheck(this, GameActorHero);

      _get(Object.getPrototypeOf(GameActorHero.prototype), "constructor", this).call(this, actorData);
      var privates = internal(this);
      privates.ai = null;
      privates.beAttacking = new Set();

      this.on("kill", function (event) {
        var actor = event.data;

        if (_this.beAttacking.has(actor)) {
          _this.beAttacking["delete"](actor);
        }

        if (actor.data.exp) {
          _this.data.exp += actor.data.exp;
        } else {
          _this.data.exp += 1;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this.data.currentQuest[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var quest = _step.value;

            if (quest.target && quest.target.kill) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var k = _step2.value;

                  if (actor.id == k.id && k.current < k.need) {
                    k.current++;
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
      });

      this.on("change", function () {
        _this.autoHide();
        _this.onto();
        _this.touch();
      });

      setInterval(function () {
        if (Game.paused == false) {
          _this.autoHide();
          _this.onto();
          _this.touch();
        }
      }, 500);
    }

    _createClass(GameActorHero, [{
      key: "popup",
      value: function popup(text) {
        Game.popup(this.sprite, text, 0, -50);
      }
    }, {
      key: "hasItem",
      value: function hasItem(id, count) {
        if (Number.isFinite(count) == false || count <= 0) {
          count = 1;
        }
        for (var key in this.data.items) {
          if (key == id) {
            if (this.data.items[key] >= count) {
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    }, {
      key: "hasQuest",
      value: function hasQuest(id) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.data.currentQuest[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var quest = _step3.value;

            if (id == quest.id) {
              return true;
            }
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
          for (var _iterator4 = this.data.completeQuest[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var quest = _step4.value;

            if (id == quest.id) {
              return true;
            }
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

        return false;
      }
    }, {
      key: "damage",
      value: function damage(attacker, skill) {
        var _this2 = this;

        _get(Object.getPrototypeOf(GameActorHero.prototype), "damage", this).call(this, attacker, skill);

        // 如果英雄受到了伤害
        var touchActor = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = Game.area.actors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var actor = _step5.value;

            // 找到所有邻接英雄的怪物
            if (actor != this && actor.data.type == "monster" && actor.distance(this) == 1) {
              touchActor.push(actor);
            }
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

        if (touchActor.length) {
          (function () {
            var faceAttacker = false;
            var facePosition = _this2.facePosition;
            touchActor.forEach(function (actor) {
              if (actor.hitTest(facePosition.x, facePosition.y)) {
                faceAttacker = true;
              }
            });
            // 如果英雄现在没面对任何一个邻接的怪物，面向它
            if (faceAttacker == false) {
              _this2.goto(touchActor[0].x, touchActor[0].y);
            }
          })();
        }
      }
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        _get(Object.getPrototypeOf(GameActorHero.prototype), "refreshBar", this).call(this);
        Game.windows["interface"].status(this.data.hp / this.data.$hp, // 生命百分比
        this.data.sp / this.data.$sp // 精神力百分比
        );
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this3 = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "draw", this).call(this);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          var tickCount = event.data;

          // 每秒16个tick
          if (tickCount % 16 == 0) {
            var barChanged = false;

            if (_this3.data.hp < _this3.data.$hp && _this3.beAttacking.size <= 0) {
              _this3.data.hp++;
              barChanged = true;
            }

            if (_this3.data.sp < _this3.data.$sp) {
              _this3.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this3.refreshBar();
              if (Game.windows.status.atop) {
                Game.windows.status.update();
              }
            }
          }
        });
      }
    }, {
      key: "autoHide",
      value: function autoHide() {
        if (!Game.area) return;
        if (!Game.hero) return;

        var heroHide = Game.area.map.hitAutoHide(Game.hero.x, Game.hero.y);

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = Game.layers.mapHideLayer.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var layer = _step6.value;

            // console.log(heroHide, layer.name);
            if (layer.name == heroHide) {
              layer.visible = false;
            } else {
              layer.visible = true;
            }
          }

          // 检查需要隐藏的角色，例如建筑物里的npc
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
              _iterator6["return"]();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = Game.area.actors[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var actor = _step7.value;

            if (actor != Game.hero) {
              var actorHide = Game.area.map.hitAutoHide(actor.x, actor.y);
              if (actorHide && actorHide == heroHide) {
                actor.visible = true;
              } else {
                if (actorHide) {
                  actor.visible = false;
                } else {
                  actor.visible = true;
                }
              }

              // 当npc紧挨着玩家所在格子的时候，自动面向玩家
              if (actor.distance(Game.hero) == 1) {
                var actorFace = actor.facePosition;
                if (actorFace.x != Game.hero.x || actorFace.y != Game.hero.y) {
                  if (actor.y == Game.hero.y) {
                    // 同一水平
                    if (actor.x < Game.hero.x) {
                      // npc 在玩家左边
                      actor.face("right");
                    } else if (actor.x > Game.hero.x) {
                      // npc在玩家右边
                      actor.face("left");
                    }
                  } else if (actor.x == Game.hero.x) {
                    // 同一垂直
                    if (actor.y < Game.hero.y) {
                      actor.face("down");
                    } else if (actor.y > Game.hero.y) {
                      actor.face("up");
                    }
                  }
                }
              }
            }
          }

          // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = Game.area.bags[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var bag = _step8.value;

            var bagHide = Game.area.map.hitAutoHide(bag.x, bag.y);
            if (bagHide && bagHide == heroHide) {
              bag.visible = true;
            } else {
              if (bagHide) {
                bag.visible = false;
              } else {
                bag.visible = true;
              }
            }
          }

          // 检查需要隐藏的小包包，例如建筑物中地下玩家扔下的物品
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
              _iterator8["return"]();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Game.area.items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var item = _step9.value;

            var itemHide = Game.area.map.hitAutoHide(item.x, item.y);
            if (itemHide && itemHide == heroHide) {
              item.visible = true;
            } else {
              if (itemHide) {
                item.visible = false;
              } else {
                item.visible = true;
              }
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
              _iterator9["return"]();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }
      }
    }, {
      key: "gotoArea",
      value: function gotoArea(dest, x, y) {
        var privates = internal(this);
        privates.beAttacking = new Set();
        Game.pause();
        Game.windows["interface"].hide();
        Game.windows.stage.hide();
        Game.windows.loading.begin();
        Game.windows.loading.update("20%");
        setTimeout(function () {

          Game.clearStage();
          Game.windows.loading.update("50%");

          setTimeout(function () {

            Game.loadArea(dest).then(function (area) {

              Game.area = area;
              Game.windows.loading.update("80%");

              setTimeout(function () {

                Game.hero.data.area = dest;
                Game.hero.draw();
                Game.hero.x = x;
                Game.hero.y = y;
                area.actors.add(Game.hero);

                area.map.draw();
                Game.windows.loading.update("100%");

                setTimeout(function () {

                  Game.hero.x = x;
                  Game.hero.y = y;
                  Game.hero.data.time += 60; // 加一小时
                  Game.windows.loading.end();
                  Game.windows["interface"].datetime();
                  Game.windows["interface"].refresh();
                  Game.start();
                  setTimeout(function () {
                    Game.stage.update();
                    Game.windows.stage.show();
                    Game.windows["interface"].show();
                  }, 20);
                }, 20);
              }, 20);
            });
          }, 20);
        }, 20);
      }
    }, {
      key: "onto",
      value: function onto() {
        if (!Game.area) return;
        if (!Game.area.onto) return;

        var heroPosition = Game.hero.position;
        var onto = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (onto != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            onto = element;
            return;
          } else if (element.points) {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = element.points[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var p = _step10.value;

                if (p.x == heroPosition.x && p.y == heroPosition.y) {
                  onto = element;
                  return;
                }
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
                  _iterator10["return"]();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
            onto = element;
            return;
          }
        };
        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.execute) {
            onto.execute();
          }
        } // touch
      }
    }, {
      key: "touch",
      value: function touch() {
        if (!Game.area) return;
        if (!Game.area.touch) return;

        var heroPosition = Game.hero.position;
        var heroFace = Game.hero.facePosition;
        var touch = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
              touch = element;
              return;
            } else if (element.points) {
              var _iteratorNormalCompletion11 = true;
              var _didIteratorError11 = false;
              var _iteratorError11 = undefined;

              try {
                for (var _iterator11 = element.points[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                  var p = _step11.value;

                  if (p.x == heroPosition.x && p.y == heroPosition.y) {
                    onto = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
                    _iterator11["return"]();
                  }
                } finally {
                  if (_didIteratorError11) {
                    throw _iteratorError11;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
              touch = element;
              return;
            }
          }
        };

        var FindFaceHero = function FindFaceHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
              touch = element;
            } else if (element.points) {
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = element.points[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var p = _step12.value;

                  if (p.x == heroFace.x && p.y == heroFace.y) {
                    onto = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
                    _iterator12["return"]();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroFace.x && element.y == heroFace.y) {
              touch = element;
              return;
            }
          }
        };

        // 用FindUnderHero函数寻找到玩家当前格子的地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindUnderHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindUnderHero);
        // 找最近物品 Game.area.items
        Sprite.each(Game.area.items, FindUnderHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindUnderHero);

        // 用FindFaceHero寻找面对着玩家的格子地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindFaceHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindFaceHero);
        // 找最近尸体 Game.area.items
        Sprite.each(Game.area.items, FindFaceHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindFaceHero);
        // 水源
        if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
          touch = {
            type: "water",
            heroUse: function heroUse() {
              Game.popup(Game.hero.sprite, "This is water", 0, -50);
            }
          };
        }

        if (!touch) {
          Game.hintObject = null;
          Game.windows["interface"].hideUse();
        } else {
          Game.hintObject = touch;
          Game.windows["interface"].showUse();
        }
      }
    }, {
      key: "beAttacking",
      get: function get() {
        return internal(this).beAttacking;
      },
      set: function set(value) {
        throw new Error("Game.hero.beAttacking readonly");
      }
    }]);

    return GameActorHero;
  })(Game.Actor));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvckhlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO2NBQVEsYUFBYTs7QUFDOUIsYUFEaUIsYUFBYSxDQUM3QixTQUFTLEVBQUU7Ozs0QkFESyxhQUFhOztBQUV4QyxpQ0FGMkIsYUFBYSw2Q0FFbEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUksTUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGdCQUFLLFdBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOztBQUVELFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDbEIsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNqQyxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDcEI7Ozs7Ozs7QUFFRCwrQkFBa0IsTUFBSyxJQUFJLENBQUMsWUFBWSw4SEFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzs7Ozs7QUFDckMsc0NBQWMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1JQUFFO3NCQUF4QixDQUFDOztBQUNSLHNCQUFJLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDMUMscUJBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzttQkFDYjtpQkFDRjs7Ozs7Ozs7Ozs7Ozs7O2FBQ0Y7V0FDRjs7Ozs7Ozs7Ozs7Ozs7O09BRUYsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEIsY0FBSyxRQUFRLEVBQUUsQ0FBQztBQUNoQixjQUFLLElBQUksRUFBRSxDQUFDO0FBQ1osY0FBSyxLQUFLLEVBQUUsQ0FBQztPQUNkLENBQUMsQ0FBQzs7QUFFSCxpQkFBVyxDQUFDLFlBQU07QUFDaEIsWUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtBQUN4QixnQkFBSyxRQUFRLEVBQUUsQ0FBQztBQUNoQixnQkFBSyxJQUFJLEVBQUUsQ0FBQztBQUNaLGdCQUFLLEtBQUssRUFBRSxDQUFDO1NBQ2Q7T0FDRixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ1Q7O2lCQTdDNEIsYUFBYTs7YUErQ3BDLGVBQUMsSUFBSSxFQUFFO0FBQ1gsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUN2Qzs7O2FBVU8saUJBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUNsQixZQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDakQsZUFBSyxHQUFHLENBQUMsQ0FBQztTQUNYO0FBQ0QsYUFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUMvQixjQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUU7QUFDYixnQkFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDakMscUJBQU8sSUFBSSxDQUFDO2FBQ2IsTUFBTTtBQUNMLHFCQUFPLEtBQUssQ0FBQzthQUNkO1dBQ0Y7U0FDRjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7OzthQUVRLGtCQUFDLEVBQUUsRUFBRTs7Ozs7O0FBQ1osZ0NBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxtSUFBRTtnQkFBakMsS0FBSzs7QUFDWixnQkFBSSxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtBQUNsQixxQkFBTyxJQUFJLENBQUM7YUFDYjtXQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxnQ0FBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLG1JQUFFO2dCQUFsQyxLQUFLOztBQUNaLGdCQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO0FBQ2xCLHFCQUFPLElBQUksQ0FBQzthQUNiO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxlQUFPLEtBQUssQ0FBQztPQUNkOzs7YUFFTSxnQkFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFOzs7QUFDdkIsbUNBMUYyQixhQUFhLHdDQTBGM0IsUUFBUSxFQUFFLEtBQUssRUFBRTs7O0FBRzlCLFlBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQ3BCLGdDQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sbUlBQUU7Z0JBQTNCLEtBQUs7OztBQUVaLGdCQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlFLHdCQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxZQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7O0FBQ3JCLGdCQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDekIsZ0JBQUksWUFBWSxHQUFHLE9BQUssWUFBWSxDQUFDO0FBQ3JDLHNCQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQ2xDLGtCQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakQsNEJBQVksR0FBRyxJQUFJLENBQUM7ZUFDckI7YUFDRixDQUFDLENBQUM7O0FBRUgsZ0JBQUksWUFBWSxJQUFJLEtBQUssRUFBRTtBQUN6QixxQkFBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0M7O1NBQ0Y7T0FDRjs7O2FBRUssaUJBQUc7QUFDUCxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsbUNBckgyQixhQUFhLHVDQXFIMUI7O0FBRWQsWUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQ2YsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkMsa0JBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO09BQ0Y7OzthQUVVLHNCQUFHO0FBQ1osbUNBOUgyQixhQUFhLDRDQThIckI7QUFDbkIsWUFBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLE1BQU0sQ0FDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQzVCLFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztTQUM3QixDQUFDO09BQ0g7OzthQUVJLGdCQUFHOzs7QUFDTixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsbUNBdkkyQixhQUFhLHNDQXVJM0I7O0FBRWIsZ0JBQVEsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVoRCxjQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7QUFHM0IsY0FBSSxTQUFTLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUN2QixnQkFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOztBQUV2QixnQkFBSSxPQUFLLElBQUksQ0FBQyxFQUFFLEdBQUcsT0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQUssV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDOUQscUJBQUssSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2Ysd0JBQVUsR0FBRyxJQUFJLENBQUM7YUFDbkI7O0FBRUQsZ0JBQUksT0FBSyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQUssSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNoQyxxQkFBSyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDZix3QkFBVSxHQUFHLElBQUksQ0FBQzthQUNuQjs7QUFFRCxnQkFBSSxVQUFVLEVBQUU7QUFDZCxxQkFBSyxVQUFVLEVBQUUsQ0FBQztBQUNsQixrQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDNUIsb0JBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2VBQzlCO2FBQ0Y7V0FDRjtTQUVGLENBQUMsQ0FBQztPQUdKOzs7YUFFUSxvQkFBRztBQUNWLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU87QUFDdkIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFdkIsWUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7QUFFbkUsZ0NBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsbUlBQUU7Z0JBQTVDLEtBQUs7OztBQUdaLGdCQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO0FBQzFCLG1CQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzthQUN2QixNQUFNO0FBQ0wsbUJBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0QsZ0NBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxtSUFBRTtnQkFBM0IsS0FBSzs7QUFDWixnQkFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN0QixrQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELGtCQUFJLFNBQVMsSUFBSSxTQUFTLElBQUksUUFBUSxFQUFFO0FBQ3RDLHFCQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztlQUN0QixNQUFNO0FBQ0wsb0JBQUksU0FBUyxFQUFFO0FBQ2IsdUJBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2lCQUN2QixNQUFNO0FBQ0wsdUJBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUN0QjtlQUNGOzs7QUFHRCxrQkFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEMsb0JBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7QUFDbkMsb0JBQUksU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzVELHNCQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O0FBQzFCLHdCQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O0FBQ3pCLDJCQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTs7QUFDaEMsMkJBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3BCO21CQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFOztBQUNqQyx3QkFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLDJCQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNoQywyQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbEI7bUJBQ0Y7aUJBQ0Y7ZUFDRjthQUlGO1dBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0QsZ0NBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxtSUFBRTtnQkFBdkIsR0FBRzs7QUFDVixnQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELGdCQUFJLE9BQU8sSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQ2xDLGlCQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUNwQixNQUFNO0FBQ0wsa0JBQUksT0FBTyxFQUFFO0FBQ1gsbUJBQUcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2VBQ3JCLE1BQU07QUFDTCxtQkFBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7ZUFDcEI7YUFDRjtXQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELGdDQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssbUlBQUU7Z0JBQXpCLElBQUk7O0FBQ1gsZ0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxnQkFBSSxRQUFRLElBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUNwQyxrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDckIsTUFBTTtBQUNMLGtCQUFJLFFBQVEsRUFBRTtBQUNaLG9CQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztlQUN0QixNQUFNO0FBQ0wsb0JBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2VBQ3JCO2FBQ0Y7V0FDRjs7Ozs7Ozs7Ozs7Ozs7O09BRUY7OzthQUVRLGtCQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLFlBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsa0JBQVUsQ0FBQyxZQUFZOztBQUVyQixjQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxvQkFBVSxDQUFDLFlBQVk7O0FBRXJCLGdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTs7QUFFdkMsa0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGtCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLHdCQUFVLENBQUMsWUFBWTs7QUFFckIsb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDM0Isb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsb0JBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixvQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLG9CQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLG9CQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLG9CQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBDLDBCQUFVLENBQUMsWUFBWTs7QUFFckIsc0JBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixzQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLHNCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzFCLHNCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixzQkFBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2xDLHNCQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsc0JBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLDRCQUFVLENBQUMsWUFBWTtBQUNyQix3QkFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQix3QkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsd0JBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzttQkFDL0IsRUFBRSxFQUFFLENBQUMsQ0FBQztpQkFDUixFQUFFLEVBQUUsQ0FBQyxDQUFDO2VBQ1IsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNSLENBQUMsQ0FBQztXQUVKLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDUixFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ1I7OzthQUVJLGdCQUFHO0FBQ04sWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUN2QixZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFNUIsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDdEMsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixZQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQWEsT0FBTyxFQUFFO0FBQ3JDLGNBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN4QyxtQkFBTztXQUNSO0FBQ0QsY0FBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEUsZ0JBQUksR0FBRyxPQUFPLENBQUM7QUFDZixtQkFBTztXQUNSLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFOzs7Ozs7QUFDekIscUNBQWMsT0FBTyxDQUFDLE1BQU0sd0lBQUU7b0JBQXJCLENBQUM7O0FBQ1Isb0JBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsRUFBRTtBQUNsRCxzQkFBSSxHQUFHLE9BQU8sQ0FBQztBQUNmLHlCQUFPO2lCQUNSO2VBQ0Y7Ozs7Ozs7Ozs7Ozs7OztXQUNGLE1BQU0sSUFDTCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsSUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUMzQjtBQUNBLGdCQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsbUJBQU87V0FDUjtTQUNGLENBQUE7O0FBRUQsY0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUMzQyxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1dBQ2hCO1NBQ0Y7T0FDRjs7O2FBRUssaUJBQUc7QUFDUCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPO0FBQ3ZCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPOztBQUU3QixZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN0QyxZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUN0QyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFlBQUksYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBYSxPQUFPLEVBQUU7QUFDckMsY0FBSSxLQUFLLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3pDLG1CQUFPO1dBQ1I7QUFDRCxjQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsZ0JBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RFLG1CQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLHFCQUFPO2FBQ1IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Ozs7OztBQUN6Qix1Q0FBYyxPQUFPLENBQUMsTUFBTSx3SUFBRTtzQkFBckIsQ0FBQzs7QUFDUixzQkFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQ2xELHdCQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2YsMkJBQU87bUJBQ1I7aUJBQ0Y7Ozs7Ozs7Ozs7Ozs7OzthQUNGLE1BQU0sSUFDTCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsSUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUMzQjtBQUNBLG1CQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLHFCQUFPO2FBQ1I7V0FDRjtTQUNGLENBQUE7O0FBRUQsWUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQWEsT0FBTyxFQUFFO0FBQ3BDLGNBQUksS0FBSyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUN6QyxtQkFBTztXQUNSO0FBQ0QsY0FBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGdCQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM5RCxtQkFBSyxHQUFHLE9BQU8sQ0FBQzthQUNqQixNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTs7Ozs7O0FBQ3pCLHVDQUFjLE9BQU8sQ0FBQyxNQUFNLHdJQUFFO3NCQUFyQixDQUFDOztBQUNSLHNCQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUMsd0JBQUksR0FBRyxPQUFPLENBQUM7QUFDZiwyQkFBTzttQkFDUjtpQkFDRjs7Ozs7Ozs7Ozs7Ozs7O2FBQ0YsTUFBTSxJQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFDMUIsT0FBTyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUN2QixPQUFPLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQ3ZCO0FBQ0EsbUJBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIscUJBQU87YUFDUjtXQUNGO1NBQ0YsQ0FBQTs7Ozs7QUFLRCxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUU3QyxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUUzQyxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUU1QyxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7O0FBS3ZDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTVDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTFDLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRTNDLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUQsZUFBSyxHQUFHO0FBQ04sZ0JBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQU8sRUFBRSxtQkFBWTtBQUNuQixrQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDdkQ7V0FDRixDQUFDO1NBQ0g7O0FBRUQsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLGNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsY0FBSSxDQUFDLE9BQU8sYUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO09BQ0Y7OztXQTFZZSxlQUFHO0FBQ2pCLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztPQUNuQztXQUVlLGFBQUMsS0FBSyxFQUFFO0FBQ3RCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztPQUNuRDs7O1dBekQ0QixhQUFhO0tBQVMsSUFBSSxDQUFDLEtBQUssRUFnYzdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3JIZXJvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgIOiLsembhOexu1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JIZXJvXCIsIGNsYXNzIEdhbWVBY3Rvckhlcm8gZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICBwcml2YXRlcy5iZUF0dGFja2luZyA9IG5ldyBTZXQoKTtcblxuICAgICAgdGhpcy5vbihcImtpbGxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCBhY3RvciA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuYmVBdHRhY2tpbmcuaGFzKGFjdG9yKSkge1xuICAgICAgICAgIHRoaXMuYmVBdHRhY2tpbmcuZGVsZXRlKGFjdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhY3Rvci5kYXRhLmV4cCkge1xuICAgICAgICAgIHRoaXMuZGF0YS5leHAgKz0gYWN0b3IuZGF0YS5leHA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kYXRhLmV4cCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcXVlc3Qgb2YgdGhpcy5kYXRhLmN1cnJlbnRRdWVzdCkge1xuICAgICAgICAgIGlmIChxdWVzdC50YXJnZXQgJiYgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgb2YgcXVlc3QudGFyZ2V0LmtpbGwpIHtcbiAgICAgICAgICAgICAgaWYgKGFjdG9yLmlkID09IGsuaWQgJiYgay5jdXJyZW50IDwgay5uZWVkKSB7XG4gICAgICAgICAgICAgICAgay5jdXJyZW50Kys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmF1dG9IaWRlKCk7XG4gICAgICAgIHRoaXMub250bygpO1xuICAgICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICB9KTtcblxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoR2FtZS5wYXVzZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLmF1dG9IaWRlKCk7XG4gICAgICAgICAgdGhpcy5vbnRvKCk7XG4gICAgICAgICAgdGhpcy50b3VjaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIHBvcHVwICh0ZXh0KSB7XG4gICAgICBHYW1lLnBvcHVwKHRoaXMuc3ByaXRlLCB0ZXh0LCAwLCAtNTApO1xuICAgIH1cblxuICAgIGdldCBiZUF0dGFja2luZyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuYmVBdHRhY2tpbmc7XG4gICAgfVxuXG4gICAgc2V0IGJlQXR0YWNraW5nICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5oZXJvLmJlQXR0YWNraW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGhhc0l0ZW0gKGlkLCBjb3VudCkge1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb3VudCkgPT0gZmFsc2UgfHwgY291bnQgPD0gMCkge1xuICAgICAgICBjb3VudCA9IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5kYXRhLml0ZW1zKSB7XG4gICAgICAgIGlmIChrZXkgPT0gaWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLml0ZW1zW2tleV0gPj0gY291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzUXVlc3QgKGlkKSB7XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY3VycmVudFF1ZXN0KSB7XG4gICAgICAgIGlmIChpZCA9PSBxdWVzdC5pZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBxdWVzdCBvZiB0aGlzLmRhdGEuY29tcGxldGVRdWVzdCkge1xuICAgICAgICBpZiAoaWQgPT0gcXVlc3QuaWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRhbWFnZSAoYXR0YWNrZXIsIHNraWxsKSB7XG4gICAgICBzdXBlci5kYW1hZ2UoYXR0YWNrZXIsIHNraWxsKTtcblxuICAgICAgLy8g5aaC5p6c6Iux6ZuE5Y+X5Yiw5LqG5Lyk5a6zXG4gICAgICBsZXQgdG91Y2hBY3RvciA9IFtdO1xuICAgICAgZm9yIChsZXQgYWN0b3Igb2YgR2FtZS5hcmVhLmFjdG9ycykge1xuICAgICAgICAvLyDmib7liLDmiYDmnInpgrvmjqXoi7Hpm4TnmoTmgKrnialcbiAgICAgICAgaWYgKGFjdG9yICE9IHRoaXMgJiYgYWN0b3IuZGF0YS50eXBlID09IFwibW9uc3RlclwiICYmIGFjdG9yLmRpc3RhbmNlKHRoaXMpID09IDEpIHtcbiAgICAgICAgICB0b3VjaEFjdG9yLnB1c2goYWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodG91Y2hBY3Rvci5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGZhY2VBdHRhY2tlciA9IGZhbHNlO1xuICAgICAgICBsZXQgZmFjZVBvc2l0aW9uID0gdGhpcy5mYWNlUG9zaXRpb247XG4gICAgICAgIHRvdWNoQWN0b3IuZm9yRWFjaChmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgICBpZiAoYWN0b3IuaGl0VGVzdChmYWNlUG9zaXRpb24ueCwgZmFjZVBvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICBmYWNlQXR0YWNrZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWmguaenOiLsembhOeOsOWcqOayoemdouWvueS7u+S9leS4gOS4qumCu+aOpeeahOaAqueJqe+8jOmdouWQkeWug1xuICAgICAgICBpZiAoZmFjZUF0dGFja2VyID09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5nb3RvKHRvdWNoQWN0b3JbMF0ueCwgdG91Y2hBY3RvclswXS55KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoQmFyICgpIHtcbiAgICAgIHN1cGVyLnJlZnJlc2hCYXIoKTtcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc3RhdHVzKFxuICAgICAgICB0aGlzLmRhdGEuaHAgLyB0aGlzLmRhdGEuJGhwLCAvLyDnlJ/lkb3nmb7liIbmr5RcbiAgICAgICAgdGhpcy5kYXRhLnNwIC8gdGhpcy5kYXRhLiRzcCAvLyDnsr7npZ7lipvnmb7liIbmr5RcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHN1cGVyLmRyYXcoKTtcblxuICAgICAgcHJpdmF0ZXMuYWkgPSBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCAoZXZlbnQpID0+IHtcblxuICAgICAgICBsZXQgdGlja0NvdW50ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAvLyDmr4/np5IxNuS4qnRpY2tcbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDE2ID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgdGhpcy5iZUF0dGFja2luZy5zaXplIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ocCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5zcCA8IHRoaXMuZGF0YS4kc3ApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zcCsrO1xuICAgICAgICAgICAgYmFyQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJhckNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEJhcigpO1xuICAgICAgICAgICAgaWYgKEdhbWUud2luZG93cy5zdGF0dXMuYXRvcCkge1xuICAgICAgICAgICAgICBHYW1lLndpbmRvd3Muc3RhdHVzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuXG4gICAgfVxuXG4gICAgYXV0b0hpZGUgKCkge1xuICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgIGlmICghR2FtZS5oZXJvKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvSGlkZSA9IEdhbWUuYXJlYS5tYXAuaGl0QXV0b0hpZGUoR2FtZS5oZXJvLngsIEdhbWUuaGVyby55KTtcblxuICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgR2FtZS5sYXllcnMubWFwSGlkZUxheWVyLmNoaWxkcmVuKSB7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKGhlcm9IaWRlLCBsYXllci5uYW1lKTtcbiAgICAgICAgaWYgKGxheWVyLm5hbWUgPT0gaGVyb0hpZGUpIHtcbiAgICAgICAgICBsYXllci52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGF5ZXIudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8g5qOA5p+l6ZyA6KaB6ZqQ6JeP55qE6KeS6Imy77yM5L6L5aaC5bu6562R54mp6YeM55qEbnBjXG4gICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgIGlmIChhY3RvciAhPSBHYW1lLmhlcm8pIHtcbiAgICAgICAgICBsZXQgYWN0b3JIaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShhY3Rvci54LCBhY3Rvci55KTtcbiAgICAgICAgICBpZiAoYWN0b3JIaWRlICYmIGFjdG9ySGlkZSA9PSBoZXJvSGlkZSkge1xuICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhY3RvckhpZGUpIHtcbiAgICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0b3IudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g5b2TbnBj57Sn5oyo552A546p5a625omA5Zyo5qC85a2Q55qE5pe25YCZ77yM6Ieq5Yqo6Z2i5ZCR546p5a62XG4gICAgICAgICAgaWYgKGFjdG9yLmRpc3RhbmNlKEdhbWUuaGVybykgPT0gMSkge1xuICAgICAgICAgICAgbGV0IGFjdG9yRmFjZSA9IGFjdG9yLmZhY2VQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChhY3RvckZhY2UueCAhPSBHYW1lLmhlcm8ueCB8fCBhY3RvckZhY2UueSAhPSBHYW1lLmhlcm8ueSkge1xuICAgICAgICAgICAgICBpZiAoYWN0b3IueSA9PSBHYW1lLmhlcm8ueSkgeyAvLyDlkIzkuIDmsLTlubNcbiAgICAgICAgICAgICAgICBpZiAoYWN0b3IueCA8IEdhbWUuaGVyby54KSB7IC8vIG5wYyDlnKjnjqnlrrblt6bovrlcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdG9yLnggPiBHYW1lLmhlcm8ueCkgeyAvLyBucGPlnKjnjqnlrrblj7PovrlcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJsZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rvci54ID09IEdhbWUuaGVyby54KSB7IC8vIOWQjOS4gOWeguebtFxuICAgICAgICAgICAgICAgIGlmIChhY3Rvci55IDwgR2FtZS5oZXJvLnkpIHtcbiAgICAgICAgICAgICAgICAgIGFjdG9yLmZhY2UoXCJkb3duXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0b3IueSA+IEdhbWUuaGVyby55KSB7XG4gICAgICAgICAgICAgICAgICBhY3Rvci5mYWNlKFwidXBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpemcgOimgemakOiXj+eahOWwj+WMheWMhe+8jOS+i+WmguW7uuetkeeJqeS4reWcsOS4i+eOqeWutuaJlOS4i+eahOeJqeWTgVxuICAgICAgZm9yIChsZXQgYmFnIG9mIEdhbWUuYXJlYS5iYWdzKSB7XG4gICAgICAgIGxldCBiYWdIaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShiYWcueCwgYmFnLnkpO1xuICAgICAgICBpZiAoYmFnSGlkZSAmJiBiYWdIaWRlID09IGhlcm9IaWRlKSB7XG4gICAgICAgICAgYmFnLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiYWdIaWRlKSB7XG4gICAgICAgICAgICBiYWcudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYWcudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpemcgOimgemakOiXj+eahOWwj+WMheWMhe+8jOS+i+WmguW7uuetkeeJqeS4reWcsOS4i+eOqeWutuaJlOS4i+eahOeJqeWTgVxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBHYW1lLmFyZWEuaXRlbXMpIHtcbiAgICAgICAgbGV0IGl0ZW1IaWRlID0gR2FtZS5hcmVhLm1hcC5oaXRBdXRvSGlkZShpdGVtLngsIGl0ZW0ueSk7XG4gICAgICAgIGlmIChpdGVtSGlkZSAmJiBpdGVtSGlkZSA9PSBoZXJvSGlkZSkge1xuICAgICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW1IaWRlKSB7XG4gICAgICAgICAgICBpdGVtLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIGdvdG9BcmVhIChkZXN0LCB4LCB5KSB7XG4gICAgICB2YXIgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmJlQXR0YWNraW5nID0gbmV3IFNldCgpO1xuICAgICAgR2FtZS5wYXVzZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3Muc3RhZ2UuaGlkZSgpO1xuICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcbiAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjIwJVwiKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy51cGRhdGUoXCI1MCVcIik7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBHYW1lLmxvYWRBcmVhKGRlc3QpLnRoZW4oZnVuY3Rpb24gKGFyZWEpIHtcblxuICAgICAgICAgICAgR2FtZS5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjgwJVwiKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuYXJlYSA9IGRlc3Q7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby54ID0geDtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICBhcmVhLmFjdG9ycy5hZGQoR2FtZS5oZXJvKTtcblxuICAgICAgICAgICAgICBhcmVhLm1hcC5kcmF3KCk7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLnVwZGF0ZShcIjEwMCVcIik7XG5cbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8ueCA9IHg7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLnkgPSB5O1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLnRpbWUgKz0gNjA7IC8vIOWKoOS4gOWwj+aXtlxuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5sb2FkaW5nLmVuZCgpO1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuZGF0ZXRpbWUoKTtcbiAgICAgICAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICBHYW1lLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBHYW1lLnN0YWdlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLnNob3coKTtcbiAgICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sIDIwKTtcbiAgICAgICAgICAgICAgfSwgMjApO1xuICAgICAgICAgICAgfSwgMjApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIDIwKTtcbiAgICAgIH0sIDIwKTtcbiAgICB9XG5cbiAgICBvbnRvICgpIHtcbiAgICAgIGlmICghR2FtZS5hcmVhKSByZXR1cm47XG4gICAgICBpZiAoIUdhbWUuYXJlYS5vbnRvKSByZXR1cm47XG5cbiAgICAgIGxldCBoZXJvUG9zaXRpb24gPSBHYW1lLmhlcm8ucG9zaXRpb247XG4gICAgICBsZXQgb250byA9IG51bGw7XG5cbiAgICAgIGxldCBGaW5kVW5kZXJIZXJvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG9udG8gIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgaWYgKHAueCA9PSBoZXJvUG9zaXRpb24ueCAmJiBwLnkgPT0gaGVyb1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgICAgICAgb250byA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueCkgJiZcbiAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC55KSAmJlxuICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvUG9zaXRpb24ueCAmJlxuICAgICAgICAgIGVsZW1lbnQueSA9PSBoZXJvUG9zaXRpb24ueVxuICAgICAgICApIHtcbiAgICAgICAgICBvbnRvID0gZWxlbWVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEub250bywgRmluZFVuZGVySGVybyk7XG4gICAgICBpZiAob250bykge1xuICAgICAgICBpZiAob250by5leGVjdXRlKSB7XG4gICAgICAgICAgb250by5leGVjdXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gdG91Y2hcbiAgICB9XG5cbiAgICB0b3VjaCAoKSB7XG4gICAgICBpZiAoIUdhbWUuYXJlYSkgcmV0dXJuO1xuICAgICAgaWYgKCFHYW1lLmFyZWEudG91Y2gpIHJldHVybjtcblxuICAgICAgbGV0IGhlcm9Qb3NpdGlvbiA9IEdhbWUuaGVyby5wb3NpdGlvbjtcbiAgICAgIGxldCBoZXJvRmFjZSA9IEdhbWUuaGVyby5mYWNlUG9zaXRpb247XG4gICAgICBsZXQgdG91Y2ggPSBudWxsO1xuXG4gICAgICBsZXQgRmluZFVuZGVySGVybyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0b3VjaCAhPSBudWxsIHx8IGVsZW1lbnQgPT0gR2FtZS5oZXJvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmhlcm9Vc2UpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oaXRUZXN0ICYmIGVsZW1lbnQuaGl0VGVzdChoZXJvUG9zaXRpb24ueCwgaGVyb1Bvc2l0aW9uLnkpKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBlbGVtZW50LnBvaW50cykge1xuICAgICAgICAgICAgICBpZiAocC54ID09IGhlcm9Qb3NpdGlvbi54ICYmIHAueSA9PSBoZXJvUG9zaXRpb24ueSkge1xuICAgICAgICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvUG9zaXRpb24ueCAmJlxuICAgICAgICAgICAgZWxlbWVudC55ID09IGhlcm9Qb3NpdGlvbi55XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b3VjaCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBGaW5kRmFjZUhlcm8gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAodG91Y2ggIT0gbnVsbCB8fCBlbGVtZW50ID09IEdhbWUuaGVybykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5oZXJvVXNlKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaGl0VGVzdCAmJiBlbGVtZW50LmhpdFRlc3QoaGVyb0ZhY2UueCwgaGVyb0ZhY2UueSkpIHtcbiAgICAgICAgICAgIHRvdWNoID0gZWxlbWVudDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIGVsZW1lbnQucG9pbnRzKSB7XG4gICAgICAgICAgICAgIGlmIChwLnggPT0gaGVyb0ZhY2UueCAmJiBwLnkgPT0gaGVyb0ZhY2UueSkge1xuICAgICAgICAgICAgICAgIG9udG8gPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBOdW1iZXIuaXNGaW5pdGUoZWxlbWVudC54KSAmJlxuICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKGVsZW1lbnQueSkgJiZcbiAgICAgICAgICAgIGVsZW1lbnQueCA9PSBoZXJvRmFjZS54ICYmXG4gICAgICAgICAgICBlbGVtZW50LnkgPT0gaGVyb0ZhY2UueVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG91Y2ggPSBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDnlKhGaW5kVW5kZXJIZXJv5Ye95pWw5a+75om+5Yiw546p5a625b2T5YmN5qC85a2Q55qE5Zyw54K5XG5cbiAgICAgIC8vIOaJvuacgOi/keWPr+KAnOS6i+S7tuKAneS6uueJqSBHYW1lLmFyZWEuYWN0b3JzXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuYWN0b3JzLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRVbmRlckhlcm8pO1xuICAgICAgLy8g5om+5pyA6L+R54mp5ZOBIEdhbWUuYXJlYS5pdGVtc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLml0ZW1zLCBGaW5kVW5kZXJIZXJvKTtcbiAgICAgIC8vIOWFtuS7lueJqeWTge+8iOeUseWcsOWbvuaWh+S7tuWumuS5ie+8iVxuICAgICAgR2FtZS5hcmVhLnRvdWNoLmZvckVhY2goRmluZFVuZGVySGVybyk7XG5cbiAgICAgIC8vIOeUqEZpbmRGYWNlSGVyb+Wvu+aJvumdouWvueedgOeOqeWutueahOagvOWtkOWcsOeCuVxuXG4gICAgICAvLyDmib7mnIDov5Hlj6/igJzkuovku7bigJ3kurrniakgR2FtZS5hcmVhLmFjdG9yc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmFjdG9ycywgRmluZEZhY2VIZXJvKTtcbiAgICAgIC8vIOaJvuacgOi/keWwuOS9kyBHYW1lLmFyZWEuYmFnc1xuICAgICAgU3ByaXRlLmVhY2goR2FtZS5hcmVhLmJhZ3MsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmib7mnIDov5HlsLjkvZMgR2FtZS5hcmVhLml0ZW1zXG4gICAgICBTcHJpdGUuZWFjaChHYW1lLmFyZWEuaXRlbXMsIEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDlhbbku5bnianlk4HvvIjnlLHlnLDlm77mlofku7blrprkuYnvvIlcbiAgICAgIEdhbWUuYXJlYS50b3VjaC5mb3JFYWNoKEZpbmRGYWNlSGVybyk7XG4gICAgICAvLyDmsLTmupBcbiAgICAgIGlmICghdG91Y2ggJiYgR2FtZS5hcmVhLm1hcC5oaXRXYXRlcihoZXJvRmFjZS54LCBoZXJvRmFjZS55KSkge1xuICAgICAgICB0b3VjaCA9IHtcbiAgICAgICAgICB0eXBlOiBcIndhdGVyXCIsXG4gICAgICAgICAgaGVyb1VzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR2FtZS5wb3B1cChHYW1lLmhlcm8uc3ByaXRlLCBcIlRoaXMgaXMgd2F0ZXJcIiwgMCwgLTUwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gpIHtcbiAgICAgICAgR2FtZS5oaW50T2JqZWN0ID0gbnVsbDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5oaWRlVXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QgPSB0b3VjaDtcbiAgICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5zaG93VXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

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
  Game.assign("ActorMonster", (function (_Game$Actor) {
    _inherits(GameActorMonster, _Game$Actor);

    function GameActorMonster(actorData) {
      _classCallCheck(this, GameActorMonster);

      _get(Object.getPrototypeOf(GameActorMonster.prototype), "constructor", this).call(this, actorData);
      var privates = internal(this);
      privates.ai = null;
      privates.attacking = false;
    }

    _createClass(GameActorMonster, [{
      key: "damage",
      value: function damage(attacker, skill) {
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "damage", this).call(this, attacker, skill);
        var privates = internal(this);

        if (privates.attacking == false) {
          this.goto(attacker.x, attacker.y, "walk");
        }
      }
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "draw", this).call(this);

        var dodo = Sprite.rand(30, 60);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          if (Game.paused) return;

          var tickCount = event.data;

          if (tickCount % 20 == 0) {
            var barChanged = false;

            if (_this.data.hp < _this.data.$hp && privates.attacking == false) {
              _this.data.hp++;
              barChanged = true;
            }

            if (_this.data.sp < _this.data.$sp) {
              _this.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this.refreshBar();
            }
          }

          if (privates.attacking) {
            if (tickCount % dodo == 0) {
              if (Game.hero && _this.facePosition.x == Game.hero.x && _this.facePosition.y == Game.hero.y) {
                if (_this.y == Game.hero.y) {
                  // left or right
                  if (_this.x < Game.hero.x) {
                    // left
                    _this.fire(_this.data.skills[0], "right");
                  } else {
                    // right
                    _this.fire(_this.data.skills[0], "left");
                  }
                } else {
                  // up or down
                  if (_this.y < Game.hero.y) {
                    // up
                    _this.fire(_this.data.skills[0], "down");
                  } else {
                    // down
                    _this.fire(_this.data.skills[0], "up");
                  }
                }
              }
            } else if (Game.hero && Game.hero.distance(_this) < 12) {
              _this.goto(Game.hero.x, Game.hero.y, "walk");
            } else {
              privates.attacking = false;
              if (Game.hero.beAttacking.has(_this)) {
                Game.hero.beAttacking["delete"](_this);
              }
            }
          } else {
            if (tickCount % dodo == 0) {
              if (Game.hero && Game.hero.distance(_this) < 8) {
                _this.goto(Game.hero.x, Game.hero.y, "walk");
                privates.attacking = true;
                Game.hero.beAttacking.add(_this);
              } else if (_this.data.mode == "patrol") {
                if (Math.random() > 0.3) {
                  _this.stop();
                  return;
                }
                var directions = ["down", "left", "right", "up"];
                _this.go("walk", directions[Math.floor(Math.random() * directions.length)], function () {
                  _this.stop();
                });
              }
            }
          } // not attacking
        });
      }
    }]);

    return GameActorMonster;
  })(Game.Actor));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3Rvck1vbnN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjO2NBQVEsZ0JBQWdCOztBQUNwQyxhQURvQixnQkFBZ0IsQ0FDbkMsU0FBUyxFQUFFOzRCQURRLGdCQUFnQjs7QUFFOUMsaUNBRjhCLGdCQUFnQiw2Q0FFeEMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFRLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUM1Qjs7aUJBTitCLGdCQUFnQjs7YUFRekMsZ0JBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUN2QixtQ0FUOEIsZ0JBQWdCLHdDQVNqQyxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQzlCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxRQUFRLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRTtBQUMvQixjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMzQztPQUNGOzs7YUFFSyxpQkFBRztBQUNQLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixtQ0FuQjhCLGdCQUFnQix1Q0FtQmhDOztBQUVkLFlBQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNmLGdCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxD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QyIsImZpbGUiOiJHYW1lQWN0b3JNb25zdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgIOiLsembhOexu1xuICAgIOWxnuaAp++8mlxuICAgICAgdGhpcy5zcHJpdGUg57K+54G1XG4gICovXG4gIEdhbWUuYXNzaWduKFwiQWN0b3JNb25zdGVyXCIsIGNsYXNzIEdhbWVBY3Rvck1vbnN0ZXIgZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5haSA9IG51bGw7XG4gICAgICBwcml2YXRlcy5hdHRhY2tpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBkYW1hZ2UgKGF0dGFja2VyLCBza2lsbCkge1xuICAgICAgc3VwZXIuZGFtYWdlKGF0dGFja2VyLCBza2lsbCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmF0dGFja2luZyA9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmdvdG8oYXR0YWNrZXIueCwgYXR0YWNrZXIueSwgXCJ3YWxrXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVyYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZXJhc2UoKTtcblxuICAgICAgaWYgKHByaXZhdGVzLmFpKSB7XG4gICAgICAgIFNwcml0ZS5UaWNrZXIub2ZmKFwidGlja1wiLCBwcml2YXRlcy5haSk7XG4gICAgICAgIHByaXZhdGVzLmFpID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgc3VwZXIuZHJhdygpO1xuXG4gICAgICBsZXQgZG9kbyA9IFNwcml0ZS5yYW5kKDMwLCA2MCk7XG5cbiAgICAgIHByaXZhdGVzLmFpID0gU3ByaXRlLlRpY2tlci5vbihcInRpY2tcIiwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgaWYgKEdhbWUucGF1c2VkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHRpY2tDb3VudCA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgaWYgKHRpY2tDb3VudCAlIDIwID09IDApIHtcbiAgICAgICAgICBsZXQgYmFyQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5ocCA8IHRoaXMuZGF0YS4kaHAgJiYgcHJpdmF0ZXMuYXR0YWNraW5nID09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuaHArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc3AgPCB0aGlzLmRhdGEuJHNwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc3ArKztcbiAgICAgICAgICAgIGJhckNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiYXJDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hCYXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuYXR0YWNraW5nKSB7XG4gICAgICAgICAgaWYgKHRpY2tDb3VudCAlIGRvZG8gPT0gMCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBHYW1lLmhlcm8gJiZcbiAgICAgICAgICAgICAgdGhpcy5mYWNlUG9zaXRpb24ueCA9PSBHYW1lLmhlcm8ueCAmJlxuICAgICAgICAgICAgICB0aGlzLmZhY2VQb3NpdGlvbi55ID09IEdhbWUuaGVyby55XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMueSA9PSBHYW1lLmhlcm8ueSkgeyAvLyBsZWZ0IG9yIHJpZ2h0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueCA8IEdhbWUuaGVyby54KSB7IC8vIGxlZnRcbiAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSh0aGlzLmRhdGEuc2tpbGxzWzBdLCBcInJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgICB0aGlzLmZpcmUodGhpcy5kYXRhLnNraWxsc1swXSwgXCJsZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gdXAgb3IgZG93blxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnkgPCBHYW1lLmhlcm8ueSkgeyAvLyB1cFxuICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKHRoaXMuZGF0YS5za2lsbHNbMF0sIFwiZG93blwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBkb3duXG4gICAgICAgICAgICAgICAgICB0aGlzLmZpcmUodGhpcy5kYXRhLnNraWxsc1swXSwgXCJ1cFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKEdhbWUuaGVybyAmJiBHYW1lLmhlcm8uZGlzdGFuY2UodGhpcykgPCAxMikge1xuICAgICAgICAgICAgdGhpcy5nb3RvKEdhbWUuaGVyby54LCBHYW1lLmhlcm8ueSwgXCJ3YWxrXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcml2YXRlcy5hdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChHYW1lLmhlcm8uYmVBdHRhY2tpbmcuaGFzKHRoaXMpKSB7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5iZUF0dGFja2luZy5kZWxldGUodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aWNrQ291bnQgJSBkb2RvID09IDApIHtcbiAgICAgICAgICAgIGlmIChHYW1lLmhlcm8gJiYgR2FtZS5oZXJvLmRpc3RhbmNlKHRoaXMpIDwgOCkge1xuICAgICAgICAgICAgICB0aGlzLmdvdG8oR2FtZS5oZXJvLngsIEdhbWUuaGVyby55LCBcIndhbGtcIik7XG4gICAgICAgICAgICAgIHByaXZhdGVzLmF0dGFja2luZyA9IHRydWU7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5iZUF0dGFja2luZy5hZGQodGhpcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS5tb2RlID09IFwicGF0cm9sXCIpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbnMgPSBbXCJkb3duXCIsIFwibGVmdFwiLCBcInJpZ2h0XCIsIFwidXBcIl07XG4gICAgICAgICAgICAgIHRoaXMuZ28oXCJ3YWxrXCIsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkaXJlY3Rpb25zLmxlbmd0aCldLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBub3QgYXR0YWNraW5nXG5cblxuICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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
  Game.assign("ActorPet", (function (_Game$Actor) {
    _inherits(GameActorPet, _Game$Actor);

    function GameActorPet(actorData) {
      _classCallCheck(this, GameActorPet);

      _get(Object.getPrototypeOf(GameActorPet.prototype), "constructor", this).call(this, actorData);
    }

    return GameActorPet;
  })(Game.Actor));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBY3RvclBldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO2NBQVEsWUFBWTs7QUFDNUIsYUFEZ0IsWUFBWSxDQUMzQixTQUFTLEVBQUU7NEJBREksWUFBWTs7QUFFdEMsaUNBRjBCLFlBQVksNkNBRWhDLFNBQVMsRUFBRTtLQUNsQjs7V0FIMkIsWUFBWTtLQUFTLElBQUksQ0FBQyxLQUFLLEVBTTNELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lQWN0b3JQZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAg6Iux6ZuE57G7XG4gICAg5bGe5oCn77yaXG4gICAgICB0aGlzLnNwcml0ZSDnsr7ngbVcbiAgKi9cbiAgR2FtZS5hc3NpZ24oXCJBY3RvclBldFwiLCBjbGFzcyBHYW1lQWN0b3JQZXQgZXh0ZW5kcyBHYW1lLkFjdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0b3JEYXRhKSB7XG4gICAgICBzdXBlcihhY3RvckRhdGEpO1xuICAgIH1cblxuXG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

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

  // 合并图片
  // 把images中的所有图片按顺序draw到一个canvas上面，然后用canvas.toDataURL返回一张叠好的图片
  function CombineHeroImage(images, width, height) {
    return new Promise(function (resolve, reject) {
      var canvas = document.createElement("canvas");
      canvas.height = height;
      canvas.width = width;
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, width, height);

      var length = images.length - 1; // 最后一张图是武器
      for (var i = 0; i < length; i++) {
        var img = images[i];
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
      }

      var withoutWeapon = null;
      var withWeapon = null;

      var promises = new Set();

      withoutWeapon = new Image();
      withoutWeapon.src = canvas.toDataURL("image/png");

      promises.add(new Promise(function (resolve, reject) {
        if (withoutWeapon.complete) {
          resolve();
        } else {
          withoutWeapon.onload = function () {
            resolve();
          };
        }
      }));

      context.drawImage(images[length], 0, 0, images[length].width, images[length].height, 0, 0, width, height);

      withWeapon = new Image();
      withWeapon.src = canvas.toDataURL("image/png");

      promises.add(new Promise(function (resolve, reject) {
        if (withWeapon.complete) {
          resolve();
        } else {
          withWeapon.onload = function () {
            resolve();
          };
        }
      }));

      // Promise es6
      Promise.all(promises).then(function () {
        resolve([withoutWeapon, withWeapon]);
      });
    });
  }

  function Check(str) {
    if (typeof str == "string" && str.length > 0) return true;
    return false;
  }

  // 把多张图片合成一张，并返回
  Game.assign("drawHero", function (heroCustom) {
    return new Promise(function (resolve, reject) {
      var BASE = "hero";
      var imageUrls = [];

      if (Check(heroCustom.sex) && Check(heroCustom.body)) {
        // 必须按顺序
        // 身体
        imageUrls.push(BASE + "/body/" + heroCustom.sex + "/" + heroCustom.body + ".png");
        // 眼睛
        if (Check(heroCustom.eyes)) imageUrls.push(BASE + "/body/" + heroCustom.sex + "/eyes/" + heroCustom.eyes + ".png");
        // 衣服
        if (Check(heroCustom.shirts)) imageUrls.push(BASE + "/shirts/" + heroCustom.sex + "/" + heroCustom.shirts + ".png");
        if (Check(heroCustom.pants)) imageUrls.push(BASE + "/pants/" + heroCustom.sex + "/" + heroCustom.pants + ".png");
        if (Check(heroCustom.shoes))
          // 盔甲
          imageUrls.push(BASE + "/shoes/" + heroCustom.sex + "/" + heroCustom.shoes + ".png");
        if (Check(heroCustom.armorchest)) imageUrls.push(BASE + "/armor/chest/" + heroCustom.sex + "/" + heroCustom.armorchest + ".png");
        if (Check(heroCustom.armorarm)) imageUrls.push(BASE + "/armor/arm/" + heroCustom.sex + "/" + heroCustom.armorarm + ".png");
        if (Check(heroCustom.armorlegs)) imageUrls.push(BASE + "/armor/legs/" + heroCustom.sex + "/" + heroCustom.armorlegs + ".png");
        if (Check(heroCustom.armorfeet)) imageUrls.push(BASE + "/armor/feet/" + heroCustom.sex + "/" + heroCustom.armorfeet + ".png");
        // 头发
        if (Check(heroCustom.hair) && Check(heroCustom.haircolor)) imageUrls.push(BASE + "/hair/" + heroCustom.sex + "/" + heroCustom.hair + "/" + heroCustom.haircolor + ".png");
        // 头
        if (Check(heroCustom.head)) imageUrls.push(BASE + "/head/" + heroCustom.sex + "/" + heroCustom.head + ".png");
        // 头盔
        if (Check(heroCustom.armorhelms)) imageUrls.push(BASE + "/armor/helms/" + heroCustom.sex + "/" + heroCustom.armorhelms + ".png");
        // 武器（包括所有武器）
        imageUrls.push(BASE + "/weapons/" + heroCustom.sex + "/weapons.png");
      }

      Sprite.load(imageUrls).then(function (data) {
        CombineHeroImage(data, heroCustom.width, heroCustom.height).then(function (data) {
          resolve(data);
        });
      });
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVEcmF3SGVyby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7OztBQUliLFdBQVMsZ0JBQWdCLENBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDaEQsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsVUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxZQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN2QixZQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixVQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLGFBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXZDLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsWUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGVBQU8sQ0FBQyxTQUFTLENBQ2YsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUNoQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQ3BCLENBQUM7T0FDSDs7QUFFRCxVQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDekIsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV0QixVQUFJLFFBQVEsR0FBRyxJ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VSxDQUFDLEdBQUcsU0FBSSxVQUFVLENBQUMsSUFBSSxVQUFPLENBQUM7O0FBRTFFLFlBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFDOUIsU0FBUyxDQUFDLElBQUksQ0FBSSxJQUFJLHFCQUFnQixVQUFVLENBQUMsR0FBRyxTQUFJLFVBQVUsQ0FBQyxVQUFVLFVBQU8sQ0FBQzs7QUFFdkYsaUJBQVMsQ0FBQyxJQUFJLENBQUksSUFBSSxpQkFBWSxVQUFVLENBQUMsR0FBRyxrQkFBZSxDQUFDO09BQ2pFOztBQUVELFlBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQzFDLHdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDL0UsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNmLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUdKLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVEcmF3SGVyby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8g5ZCI5bm25Zu+54mHXG4gIC8vIOaKimltYWdlc+S4reeahOaJgOacieWbvueJh+aMiemhuuW6j2RyYXfliLDkuIDkuKpjYW52YXPkuIrpnaLvvIznhLblkI7nlKhjYW52YXMudG9EYXRhVVJM6L+U5Zue5LiA5byg5Y+g5aW955qE5Zu+54mHXG4gIGZ1bmN0aW9uIENvbWJpbmVIZXJvSW1hZ2UgKGltYWdlcywgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICBsZXQgbGVuZ3RoID0gaW1hZ2VzLmxlbmd0aCAtIDE7IC8vIOacgOWQjuS4gOW8oOWbvuaYr+atpuWZqFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaW1nID0gaW1hZ2VzW2ldO1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgICBpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCxcbiAgICAgICAgICAwLCAwLCB3aWR0aCwgaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGxldCB3aXRob3V0V2VhcG9uID0gbnVsbDtcbiAgICAgIGxldCB3aXRoV2VhcG9uID0gbnVsbDtcblxuICAgICAgbGV0IHByb21pc2VzID0gbmV3IFNldCgpO1xuXG4gICAgICB3aXRob3V0V2VhcG9uID0gbmV3IEltYWdlKCk7XG4gICAgICB3aXRob3V0V2VhcG9uLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG5cbiAgICAgIHByb21pc2VzLmFkZChcbiAgICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGlmICh3aXRob3V0V2VhcG9uLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpdGhvdXRXZWFwb24ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZXNbbGVuZ3RoXSwgMCwgMCwgaW1hZ2VzW2xlbmd0aF0ud2lkdGgsIGltYWdlc1tsZW5ndGhdLmhlaWdodCxcbiAgICAgICAgMCwgMCwgd2lkdGgsIGhlaWdodFxuICAgICAgKTtcblxuICAgICAgd2l0aFdlYXBvbiA9IG5ldyBJbWFnZSgpO1xuICAgICAgd2l0aFdlYXBvbi5zcmMgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xuXG4gICAgICBwcm9taXNlcy5hZGQoXG4gICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpZiAod2l0aFdlYXBvbi5jb21wbGV0ZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aXRoV2VhcG9uLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICAvLyBQcm9taXNlIGVzNiBcbiAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzb2x2ZShbd2l0aG91dFdlYXBvbiwgd2l0aFdlYXBvbl0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIENoZWNrIChzdHIpIHtcbiAgICBpZiAodHlwZW9mIHN0ciA9PSBcInN0cmluZ1wiICYmIHN0ci5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8g5oqK5aSa5byg5Zu+54mH5ZCI5oiQ5LiA5byg77yM5bm26L+U5ZueXG4gIEdhbWUuYXNzaWduKFwiZHJhd0hlcm9cIiwgZnVuY3Rpb24gKGhlcm9DdXN0b20pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IEJBU0UgPSBcImhlcm9cIjtcbiAgICAgIGxldCBpbWFnZVVybHMgPSBbXTtcblxuICAgICAgaWYgKENoZWNrKGhlcm9DdXN0b20uc2V4KSAmJiBDaGVjayhoZXJvQ3VzdG9tLmJvZHkpKSB7XG4gICAgICAgIC8vIOW/hemhu+aMiemhuuW6j1xuICAgICAgICAvLyDouqvkvZNcbiAgICAgICAgaW1hZ2VVcmxzLnB1c2goYCR7QkFTRX0vYm9keS8ke2hlcm9DdXN0b20uc2V4fS8ke2hlcm9DdXN0b20uYm9keX0ucG5nYCk7XG4gICAgICAgIC8vIOecvOedm1xuICAgICAgICBpZiAoQ2hlY2soaGVyb0N1c3RvbS5leWVzKSlcbiAgICAgICAgICBpbWFnZVVybHMucHVzaChgJHtCQVNFfS9ib2R5LyR7aGVyb0N1c3RvbS5zZXh9L2V5ZXMvJHtoZXJvQ3VzdG9tLmV5ZXN9LnBuZ2ApO1xuICAgICAgICAvLyDooaPmnI1cbiAgICAgICAgaWYgKENoZWNrKGhlcm9DdXN0b20uc2hpcnRzKSlcbiAgICAgICAgICBpbWFnZVVybHMucHVzaChgJHtCQVNFfS9zaGlydHMvJHtoZXJvQ3VzdG9tLnNleH0vJHtoZXJvQ3VzdG9tLnNoaXJ0c30ucG5nYCk7XG4gICAgICAgIGlmIChDaGVjayhoZXJvQ3VzdG9tLnBhbnRzKSlcbiAgICAgICAgICBpbWFnZVVybHMucHVzaChgJHtCQVNFfS9wYW50cy8ke2hlcm9DdXN0b20uc2V4fS8ke2hlcm9DdXN0b20ucGFudHN9LnBuZ2ApO1xuICAgICAgICBpZiAoQ2hlY2soaGVyb0N1c3RvbS5zaG9lcykpXG4gICAgICAgIC8vIOeblOeUslxuICAgICAgICAgIGltYWdlVXJscy5wdXNoKGAke0JBU0V9L3Nob2VzLyR7aGVyb0N1c3RvbS5zZXh9LyR7aGVyb0N1c3RvbS5zaG9lc30ucG5nYCk7XG4gICAgICAgIGlmIChDaGVjayhoZXJvQ3VzdG9tLmFybW9yY2hlc3QpKVxuICAgICAgICAgIGltYWdlVXJscy5wdXNoKGAke0JBU0V9L2FybW9yL2NoZXN0LyR7aGVyb0N1c3RvbS5zZXh9LyR7aGVyb0N1c3RvbS5hcm1vcmNoZXN0fS5wbmdgKTtcbiAgICAgICAgaWYgKENoZWNrKGhlcm9DdXN0b20uYXJtb3Jhcm0pKVxuICAgICAgICAgIGltYWdlVXJscy5wdXNoKGAke0JBU0V9L2FybW9yL2FybS8ke2hlcm9DdXN0b20uc2V4fS8ke2hlcm9DdXN0b20uYXJtb3Jhcm19LnBuZ2ApO1xuICAgICAgICBpZiAoQ2hlY2soaGVyb0N1c3RvbS5hcm1vcmxlZ3MpKVxuICAgICAgICAgIGltYWdlVXJscy5wdXNoKGAke0JBU0V9L2FybW9yL2xlZ3MvJHtoZXJvQ3VzdG9tLnNleH0vJHtoZXJvQ3VzdG9tLmFybW9ybGVnc30ucG5nYCk7XG4gICAgICAgIGlmIChDaGVjayhoZXJvQ3VzdG9tLmFybW9yZmVldCkpXG4gICAgICAgICAgaW1hZ2VVcmxzLnB1c2goYCR7QkFTRX0vYXJtb3IvZmVldC8ke2hlcm9DdXN0b20uc2V4fS8ke2hlcm9DdXN0b20uYXJtb3JmZWV0fS5wbmdgKTtcbiAgICAgICAgLy8g5aS05Y+RXG4gICAgICAgIGlmIChDaGVjayhoZXJvQ3VzdG9tLmhhaXIpICYmIENoZWNrKGhlcm9DdXN0b20uaGFpcmNvbG9yKSlcbiAgICAgICAgICBpbWFnZVVybHMucHVzaChgJHtCQVNFfS9oYWlyLyR7aGVyb0N1c3RvbS5zZXh9LyR7aGVyb0N1c3RvbS5oYWlyfS8ke2hlcm9DdXN0b20uaGFpcmNvbG9yfS5wbmdgKTtcbiAgICAgICAgLy8g5aS0XG4gICAgICAgIGlmIChDaGVjayhoZXJvQ3VzdG9tLmhlYWQpKVxuICAgICAgICAgIGltYWdlVXJscy5wdXNoKGAke0JBU0V9L2hlYWQvJHtoZXJvQ3VzdG9tLnNleH0vJHtoZXJvQ3VzdG9tLmhlYWR9LnBuZ2ApO1xuICAgICAgICAvLyDlpLTnm5RcbiAgICAgICAgaWYgKENoZWNrKGhlcm9DdXN0b20uYXJtb3JoZWxtcykpXG4gICAgICAgICAgaW1hZ2VVcmxzLnB1c2goYCR7QkFTRX0vYXJtb3IvaGVsbXMvJHtoZXJvQ3VzdG9tLnNleH0vJHtoZXJvQ3VzdG9tLmFybW9yaGVsbXN9LnBuZ2ApO1xuICAgICAgICAvLyDmrablmajvvIjljIXmi6zmiYDmnInmrablmajvvIlcbiAgICAgICAgaW1hZ2VVcmxzLnB1c2goYCR7QkFTRX0vd2VhcG9ucy8ke2hlcm9DdXN0b20uc2V4fS93ZWFwb25zLnBuZ2ApO1xuICAgICAgfVxuXG4gICAgICBTcHJpdGUubG9hZChpbWFnZVVybHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgQ29tYmluZUhlcm9JbWFnZShkYXRhLCBoZXJvQ3VzdG9tLndpZHRoLCBoZXJvQ3VzdG9tLmhlaWdodCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cblxuICB9KTtcblxuXG59KSgpO1xuIl19

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

  function CheckHeroAction() {
    if (Game.paused) return;

    var state = "run";
    if (Sprite.Input.isPressed("shift")) {
      state = "walk";
    }

    if (Sprite.Input.isPressed("left")) {
      Game.hero.go(state, "left", CheckHeroAction);
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up", CheckHeroAction);
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right", CheckHeroAction);
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down", CheckHeroAction);
    }
  }

  var destIcon = null;

  Game.assign("Input", (function () {
    function GameInput() {
      _classCallCheck(this, GameInput);
    }

    _createClass(GameInput, null, [{
      key: "clearDest",
      value: function clearDest() {
        destIcon.visible = false;
      }
    }, {
      key: "setDest",
      value: function setDest(x, y) {
        destIcon.x = x * 32 + 16;
        destIcon.y = y * 32 + 16;
        destIcon.visible = true;
      }
    }, {
      key: "init",
      value: function init() {

        destIcon = new Sprite.Shape();
        destIcon.circle({
          cx: 5,
          cy: 5,
          r: 5,
          stroke: "red",
          fill: "green"
        });
        destIcon.visible = false;
        destIcon.centerX = 5;
        destIcon.centerY = 5;

        Game.windows.stage.on("mousedown", function (event) {
          var data = event.data;

          data.x += Game.stage.centerX;
          data.y += Game.stage.centerY;

          data.x = Math.floor(data.x / 32);
          data.y = Math.floor(data.y / 32);

          if (!Game.layers.infoLayer.hasChild(destIcon)) {
            Game.layers.infoLayer.appendChild(destIcon);
          }

          if (Game.hero.x != data.x || Game.hero.y != data.y) {
            Game.hero.goto(data.x, data.y, "run", function () {
              destIcon.visible = false;
              if (Game.hintObject && Game.hintObject.heroUse) {
                Game.hintObject.heroUse();
              }
            });
            /*
            if (destPosition) {
              destIcon.x = data.x * 32 + 16;
              destIcon.y = data.y * 32 + 16;
              destIcon.visible = true;
            }
            */
          }
        });

        Sprite.Ticker.on("tick", function () {

          if (Game.paused) return;
          if (!Game.hero) return;
          if (!Game.area) return;
          if (!Game.area.map) return;

          CheckHeroAction();
          if (!Game.hero.walking) {
            Game.hero.stop();
          }

          Game.hero.focus();
        });
      }
    }]);

    return GameInput;
  })());

  Game.assign("initInput", function () {

    /*
      let mousePressed = false;
       Game.stage.on("stagemousedown", function (event) {
        mousePressed = true;
      });
       Game.stage.on("stagemouseup", function (event) {
        mousePressed = false;
      });
       Game.stage.on("mouseleave", function (event) { // mouse leave canvas
        mousePressed = false;
      });
      */
  }); // Game.oninit
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBR2IsV0FBUyxlQUFlLEdBQUk7QUFDMUIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRXhCLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ25DLFdBQUssR0FBRyxNQUFNLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzlDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzVDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQy9DLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzlDO0dBQ0Y7O0FBRUQsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVwQixNQUFJLENBQUMsTUFB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LENBQUMsT0FBTyxFQUFFO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2xCOztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7OztXQXRFd0IsU0FBUztPQXVFbEMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZOzs7Ozs7Ozs7Ozs7OztHQXFCcEMsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICBmdW5jdGlvbiBDaGVja0hlcm9BY3Rpb24gKCkge1xuICAgIGlmIChHYW1lLnBhdXNlZCkgcmV0dXJuO1xuXG4gICAgbGV0IHN0YXRlID0gXCJydW5cIjtcbiAgICBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcInNoaWZ0XCIpKSB7XG4gICAgICBzdGF0ZSA9IFwid2Fsa1wiO1xuICAgIH1cblxuICAgIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwibGVmdFwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcImxlZnRcIiwgQ2hlY2tIZXJvQWN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKFNwcml0ZS5JbnB1dC5pc1ByZXNzZWQoXCJ1cFwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcInVwXCIsIENoZWNrSGVyb0FjdGlvbik7XG4gICAgfSBlbHNlIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwicmlnaHRcIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJyaWdodFwiLCBDaGVja0hlcm9BY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcImRvd25cIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJkb3duXCIsIENoZWNrSGVyb0FjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbGV0IGRlc3RJY29uID0gbnVsbDtcblxuICBHYW1lLmFzc2lnbihcIklucHV0XCIsIGNsYXNzIEdhbWVJbnB1dCB7XG5cbiAgICBzdGF0aWMgY2xlYXJEZXN0ICgpIHtcbiAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RGVzdCAoeCwgeSkge1xuICAgICAgZGVzdEljb24ueCA9IHggKiAzMiArIDE2O1xuICAgICAgZGVzdEljb24ueSA9IHkgKiAzMiArIDE2O1xuICAgICAgZGVzdEljb24udmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQgKCkge1xuXG4gICAgICBkZXN0SWNvbiA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgIGRlc3RJY29uLmNpcmNsZSh7XG4gICAgICAgIGN4OiA1LFxuICAgICAgICBjeTogNSxcbiAgICAgICAgcjogNSxcbiAgICAgICAgc3Ryb2tlOiBcInJlZFwiLFxuICAgICAgICBmaWxsOiBcImdyZWVuXCJcbiAgICAgIH0pO1xuICAgICAgZGVzdEljb24udmlzaWJsZSA9IGZhbHNlO1xuICAgICAgZGVzdEljb24uY2VudGVyWCA9IDU7XG4gICAgICBkZXN0SWNvbi5jZW50ZXJZID0gNTtcblxuICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgZGF0YS54ICs9IEdhbWUuc3RhZ2UuY2VudGVyWDtcbiAgICAgICAgZGF0YS55ICs9IEdhbWUuc3RhZ2UuY2VudGVyWTtcblxuICAgICAgICBkYXRhLnggPSBNYXRoLmZsb29yKGRhdGEueCAvIDMyKTtcbiAgICAgICAgZGF0YS55ID0gTWF0aC5mbG9vcihkYXRhLnkgLyAzMik7XG5cbiAgICAgICAgaWYgKCFHYW1lLmxheWVycy5pbmZvTGF5ZXIuaGFzQ2hpbGQoZGVzdEljb24pKSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMuaW5mb0xheWVyLmFwcGVuZENoaWxkKGRlc3RJY29uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChHYW1lLmhlcm8ueCAhPSBkYXRhLnggfHwgR2FtZS5oZXJvLnkgIT0gZGF0YS55KSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmdvdG8oZGF0YS54LCBkYXRhLnksIFwicnVuXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChHYW1lLmhpbnRPYmplY3QgJiYgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UpIHtcbiAgICAgICAgICAgICAgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvKlxuICAgICAgICAgIGlmIChkZXN0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIGRlc3RJY29uLnggPSBkYXRhLnggKiAzMiArIDE2O1xuICAgICAgICAgICAgZGVzdEljb24ueSA9IGRhdGEueSAqIDMyICsgMTY7XG4gICAgICAgICAgICBkZXN0SWNvbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmhlcm8pIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEubWFwKSByZXR1cm47XG5cbiAgICAgICAgQ2hlY2tIZXJvQWN0aW9uKCk7XG4gICAgICAgIGlmICghR2FtZS5oZXJvLndhbGtpbmcpIHtcbiAgICAgICAgICBHYW1lLmhlcm8uc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgR2FtZS5oZXJvLmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIEdhbWUuYXNzaWduKFwiaW5pdElucHV0XCIsIGZ1bmN0aW9uICgpIHtcblxuXG5cblxuXG4gIC8qXG4gICAgbGV0IG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuXG4gICAgR2FtZS5zdGFnZS5vbihcInN0YWdlbW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbW91c2VQcmVzc2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJzdGFnZW1vdXNldXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBtb3VzZVByZXNzZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uIChldmVudCkgeyAvLyBtb3VzZSBsZWF2ZSBjYW52YXNcbiAgICAgIG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgICovXG4gIH0pOyAvLyBHYW1lLm9uaW5pdFxuXG5cbn0pKCk7XG4iXX0=

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

  // 英雄组件数据
  var heroCustom = {
    sex: "male",
    body: "light",
    eyes: "blue",
    hair: "",
    haircolor: "black",

    head: "",
    shirts: "",
    pants: "",
    shoes: "",

    armorchest: "",
    armorarm: "",
    armorlegs: "",
    armorhelms: "",
    armorfeet: ""
  };

  // 13x21
  heroCustom.width = 64 * 13; // 832;
  heroCustom.height = 64 * 21; // 1344;
  heroCustom.width *= 0.8125;
  heroCustom.height *= 0.9375;
  heroCustom.tilewidth = heroCustom.width / 13; // 52
  heroCustom.tileheight = heroCustom.height / 21; // 60

  Init();

  function Init() {

    window.SelectHero = function (event) {
      var value = event.target.value;
      var type = event.target.getAttribute("data-type");
      if (heroCustom[type] != value) {
        if (type == "sex") {
          heroCustom.hair = "";
        }
        heroCustom[type] = value;
        DisplayHero();
      }
      if (heroCustom.sex == "male") {
        document.getElementById("customMaleHair").style.display = "block";
        document.getElementById("customFemaleHair").style.display = "none";
      } else {
        document.getElementById("customMaleHair").style.display = "none";
        document.getElementById("customFemaleHair").style.display = "block";
      }
    };

    DisplayHero();

    function DisplayHero() {

      var canvas = document.getElementById("registerPreview");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      document.getElementById("loading").innerHTML = "正在载入预览";
      Game.drawHero(heroCustom).then(function (images) {
        var img = images[0];
        context.drawImage(img, 0, 0, img.width, img.height);
        document.getElementById("loading").innerHTML = "预览";
      });
    }
  }

  Game.assign("register", (function () {
    function GameRegister() {
      _classCallCheck(this, GameRegister);
    }

    _createClass(GameRegister, null, [{
      key: "reg",

      // 注册模块
      value: function reg() {
        document.getElementById("registerHeroName").value = "";
        Game.windows.register.show();
        Init();
      }
    }, {
      key: "back",
      value: function back() {
        Game.windows.main.show();
      }
    }, {
      key: "submit",
      value: function submit() {
        var name = document.getElementById("registerHeroName").value;

        if (name.trim().length <= 0) {
          alert("Invalid Name");
          return;
        }

        HeroDefault.id = "hero_" + name;
        HeroDefault.name = name;
        HeroDefault.custom = heroCustom;
        HeroDefault.tilewidth = heroCustom.tilewidth;
        HeroDefault.tileheight = heroCustom.tileheight;

        // 保存一个存档
        Game.Archive.save({
          hero: HeroDefault
        });

        Game.windows.register.hide();

        // 空调用，代表读取最新一个存档（last），即刚刚新建的存档
        Game.Archive.load();
      }
    }]);

    return GameRegister;
  })());

  // 含有$开头的代表是基础值
  // 不含$的同名属性是计算后值，即经过各种加成，buff，nerf之后的值
  var HeroDefault = {
    "level": 1, // 等级
    "exp": 0, // 经验值
    "type": "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

    "class": "", // 职业，不同职业有不同加成

    // 233年2月27日 09时30分
    "time": 233 * (60 * 24 * 30 * 12) + 1 * (60 * 24 * 30) + 26 * (60 * 24) + 9 * 60 + 30,

    // 最基本的属性，其他属性都由此延伸
    "$str": 10, // strength 力量： 物理攻击力
    "$dex": 10, // dexterity 敏捷： 闪避，暴击
    "$con": 10, // constitution 耐力： 生命值
    "$int": 10, // intelligence 智力： 精神力，魔法攻击
    "$cha": 10, // charisma 魅力： 队友能力

    // 下面为0的值将由上面的基本属性计算出来

    "str": 0,
    "dex": 0,
    "int": 0,
    "con": 0,
    "cha": 0,

    "$hp": 0, // 生命力
    "$sp": 0, // 精神力

    "critical": 0, // 暴击率
    "dodge": 0, // 闪避

    "hp": 0,
    "sp": 0,

    "$atk": 0, // 攻击
    "$def": 0, // 防御
    "$matk": 0, // 魔法攻击
    "$mdef": 0, // 魔法防御

    "atk": 0,
    "def": 0,
    "matk": 0,
    "mdef": 0,

    "buff": [], // 有益状态
    "nerf": [], // 有害状态

    "currentQuest": [/* 当前任务 */],
    "completeQuest": [/* 完成了的任务 */],

    // 初始位置
    "area": "fystone", // 地图id
    "x": 54,
    "y": 58,

    "centerX": 26,
    "centerY": 55,
    "hitArea": [[0, 0]],

    // 能力
    "skills": ["fist.l1", "sword.l1", // 剑攻击Level1
    "spear.l1", // 枪攻击Level1
    "bow.l1", // 弓攻击Level1
    "fire.l1"],

    // 火球术Level1
    // 技能快捷方式列表
    "bar": [{
      "id": "sword.l1",
      "type": "skill"
    }, {
      "id": "bow.l1",
      "type": "skill"
    }, null, null, null, null, null, {
      "id": "potion.healWeak",
      "type": "item"
    }],

    // 技能，例如生活技能，说服技能，交易技能
    //skills: {
    //  _trade: 0, // 交易，交易时的价格
    //  _negotiate: 0, // 交涉，具体剧情，招揽同伴时的费用
    //  _lock: 0, // 开锁
    //  _knowledge: 0, // 知识，具体剧情，鉴定物品
    //  _treatment: 0, // 医疗，在使用医疗物品时的效果
    //  _animal: 0, // 动物战斗加成，动物驯养
    //},

    "equipment": {
      "head": null,
      "body": "cloth.normal",
      "feet": "shoes.normal",
      "weapon": "sword.iron",
      "neck": null,
      "ring": null
    },

    "items": {
      "sword.iron": 1,
      "spear.iron": 1,
      "bow.wood": 1,
      "cloth.normal": 1,
      "shoes.normal": 1,
      "potion.healWeak": 5,
      "book.gameAdventure": 1,
      "book.elliorwisHistory": 1
    },

    "gold": 0,

    "animations": {

      "spellcastup": [0, 6, "", 40],
      "spellcastleft": [13, 19, "", 40],
      "spellcastdown": [26, 32, "", 40],
      "spellcastright": [39, 45, "", 40],

      "walkup": [104, 112, "walkup", 70],
      "walkleft": [117, 125, "walkleft", 70],
      "walkdown": [130, 138, "walkdown", 70],
      "walkright": [143, 151, "walkright", 70],

      "meleeup": [156, 161, "", 40],
      "meleeleft": [169, 174, "", 40],
      "meleedown": [182, 187, "", 40],
      "meleeright": [195, 200, "", 40],

      // 273+是一张图的总数，hero一共两张图，第一张图没武器，第二张图有武器，所以以下动作在第二张图

      "thrustup": [273 + 52, 273 + 59, "", 40],
      "thrustleft": [273 + 65, 273 + 72, "", 40],
      "thrustdown": [273 + 78, 273 + 85, "", 40],
      "thrustright": [273 + 91, 273 + 98, "", 40],

      "runup": [273 + 105, 273 + 112, "runup", 30],
      "runleft": [273 + 118, 273 + 125, "runleft", 30],
      "rundown": [273 + 131, 273 + 138, "rundown", 30],
      "runright": [273 + 144, 273 + 151, "runright", 30],

      "slashup": [273 + 156, 273 + 161, "", 40],
      "slashleft": [273 + 169, 273 + 174, "", 40],
      "slashdown": [273 + 182, 273 + 187, "", 40],
      "slashright": [273 + 195, 273 + 200, "", 40],

      "shootup": [273 + 208, 273 + 220, "", 40],
      "shootleft": [273 + 221, 273 + 233, "", 40],
      "shootdown": [273 + 234, 273 + 246, "", 40],
      "shootright": [273 + 247, 273 + 259, "", 40],

      "hurt": [260, 265, "", 60],

      "dead": 265,

      "faceup": 104,
      "faceleft": 117,
      "facedown": 130,
      "faceright": 143
    }
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVSZWdpc3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7OztBQUdiLE1BQUksVUFBVSxHQUFHO0FBQ2YsT0FBRyxFQUFFLE1BQU07QUFDWCxRQUFJLEVBQUUsT0FBTztBQUNiLFFBQUksRUFBRSxNQUFNO0FBQ1osUUFBSSxFQUFFLEVBQUU7QUFDUixhQUFTLEVBQUUsT0FBTzs7QUFFbEIsUUFBSSxFQUFFLEVBQUU7QUFDUixVQUFNLEVBQUUsRUFBRTtBQUNWLFNBQUssRUFBRSxFQUFFO0FBQ1QsU0FBSyxFQUFFLEVBQUU7O0FBRVQsY0FBVSxFQUFFLEVBQUU7QUFDZCxZQUFRLEVBQUUsRUFBRTtBQUNaLGFBQVMsRUFBRSxFQUFFO0FBQ2IsY0FBVSxFQUFFLEVBQUU7QUFDZCxhQUFTLEVBQUUsRUFBRTtHQUNkLENBQUM7OztBQUdGLFlBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUMzQixZQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBVSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7QUFDM0IsWUFBVSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7QUFDNUIsWUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUM3QyxZQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUUvQyxNQUFJLEVBQUUsQ0FBQzs7QUFFUCxXQUFTLElBQUksR0FBSTs7QUFFZixVQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ25DLFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQy9CLFVBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxN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RyxHQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDdkMsa0JBQVksRUFBRSxDQUFDLEdBQUcsR0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDOztBQUV4QyxlQUFTLEVBQUUsQ0FBQyxHQUFHLEdBQUMsR0FBRyxFQUFFLEdBQUcsR0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNyQyxpQkFBVyxFQUFFLENBQUMsR0FBRyxHQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDdkMsaUJBQVcsRUFBRSxDQUFDLEdBQUcsR0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3ZDLGtCQUFZLEVBQUUsQ0FBQyxHQUFHLEdBQUMsR0FBRyxFQUFFLEdBQUcsR0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFFeEMsWUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDOztBQUUxQixZQUFNLEVBQUUsR0FBRzs7QUFFWCxjQUFRLEVBQUUsR0FBRztBQUNiLGdCQUFVLEVBQUUsR0FBRztBQUNmLGdCQUFVLEVBQUUsR0FBRztBQUNmLGlCQUFXLEVBQUUsR0FBRztLQUNqQjtHQUNGLENBQUM7Q0FHSCxDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lUmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyDoi7Hpm4Tnu4Tku7bmlbDmja5cbiAgbGV0IGhlcm9DdXN0b20gPSB7XG4gICAgc2V4OiBcIm1hbGVcIixcbiAgICBib2R5OiBcImxpZ2h0XCIsXG4gICAgZXllczogXCJibHVlXCIsXG4gICAgaGFpcjogXCJcIixcbiAgICBoYWlyY29sb3I6IFwiYmxhY2tcIixcblxuICAgIGhlYWQ6IFwiXCIsXG4gICAgc2hpcnRzOiBcIlwiLFxuICAgIHBhbnRzOiBcIlwiLFxuICAgIHNob2VzOiBcIlwiLFxuXG4gICAgYXJtb3JjaGVzdDogXCJcIixcbiAgICBhcm1vcmFybTogXCJcIixcbiAgICBhcm1vcmxlZ3M6IFwiXCIsXG4gICAgYXJtb3JoZWxtczogXCJcIixcbiAgICBhcm1vcmZlZXQ6IFwiXCJcbiAgfTtcblxuICAvLyAxM3gyMVxuICBoZXJvQ3VzdG9tLndpZHRoID0gNjQgKiAxMzsgLy8gODMyO1xuICBoZXJvQ3VzdG9tLmhlaWdodCA9IDY0ICogMjE7IC8vIDEzNDQ7XG4gIGhlcm9DdXN0b20ud2lkdGggKj0gMC44MTI1O1xuICBoZXJvQ3VzdG9tLmhlaWdodCAqPSAwLjkzNzU7XG4gIGhlcm9DdXN0b20udGlsZXdpZHRoID0gaGVyb0N1c3RvbS53aWR0aCAvIDEzOyAvLyA1MlxuICBoZXJvQ3VzdG9tLnRpbGVoZWlnaHQgPSBoZXJvQ3VzdG9tLmhlaWdodCAvIDIxOyAvLyA2MFxuXG4gIEluaXQoKTtcblxuICBmdW5jdGlvbiBJbml0ICgpIHtcblxuICAgIHdpbmRvdy5TZWxlY3RIZXJvID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICBsZXQgdHlwZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIik7XG4gICAgICBpZiAoaGVyb0N1c3RvbVt0eXBlXSAhPSB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZSA9PSBcInNleFwiKSB7XG4gICAgICAgICAgaGVyb0N1c3RvbS5oYWlyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBoZXJvQ3VzdG9tW3R5cGVdID0gdmFsdWU7XG4gICAgICAgIERpc3BsYXlIZXJvKCk7XG4gICAgICB9XG4gICAgICBpZiAoaGVyb0N1c3RvbS5zZXggPT0gXCJtYWxlXCIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXN0b21NYWxlSGFpclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1c3RvbUZlbWFsZUhhaXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXN0b21NYWxlSGFpclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VzdG9tRmVtYWxlSGFpclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBEaXNwbGF5SGVybygpO1xuXG4gICAgZnVuY3Rpb24gRGlzcGxheUhlcm8gKCkge1xuXG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3RlclByZXZpZXdcIik7XG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmdcIikuaW5uZXJIVE1MID0gXCLmraPlnKjovb3lhaXpooTop4hcIjtcbiAgICAgIEdhbWUuZHJhd0hlcm8oaGVyb0N1c3RvbSkudGhlbihmdW5jdGlvbiAoaW1hZ2VzKSB7XG4gICAgICAgIGxldCBpbWcgPSBpbWFnZXNbMF07XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nXCIpLmlubmVySFRNTCA9IFwi6aKE6KeIXCI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIEdhbWUuYXNzaWduKFwicmVnaXN0ZXJcIiwgY2xhc3MgR2FtZVJlZ2lzdGVyIHtcblxuICAgIC8vIOazqOWGjOaooeWdl1xuICAgIHN0YXRpYyByZWcgKCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3Rlckhlcm9OYW1lXCIpLnZhbHVlID0gXCJcIjtcbiAgICAgIEdhbWUud2luZG93cy5yZWdpc3Rlci5zaG93KCk7XG4gICAgICBJbml0KCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGJhY2sgKCkge1xuICAgICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdWJtaXQgKCkge1xuICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVySGVyb05hbWVcIikudmFsdWU7XG5cbiAgICAgIGlmIChuYW1lLnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICBhbGVydChcIkludmFsaWQgTmFtZVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBIZXJvRGVmYXVsdC5pZCA9IFwiaGVyb19cIiArIG5hbWU7XG4gICAgICBIZXJvRGVmYXVsdC5uYW1lID0gbmFtZTtcbiAgICAgIEhlcm9EZWZhdWx0LmN1c3RvbSA9IGhlcm9DdXN0b207XG4gICAgICBIZXJvRGVmYXVsdC50aWxld2lkdGggPSBoZXJvQ3VzdG9tLnRpbGV3aWR0aDtcbiAgICAgIEhlcm9EZWZhdWx0LnRpbGVoZWlnaHQgPSBoZXJvQ3VzdG9tLnRpbGVoZWlnaHQ7XG5cbiAgICAgIC8vIOS/neWtmOS4gOS4quWtmOaho1xuICAgICAgR2FtZS5BcmNoaXZlLnNhdmUoe1xuICAgICAgICBoZXJvOiBIZXJvRGVmYXVsdFxuICAgICAgfSk7XG5cbiAgICAgIEdhbWUud2luZG93cy5yZWdpc3Rlci5oaWRlKCk7XG5cbiAgICAgIC8vIOepuuiwg+eUqO+8jOS7o+ihqOivu+WPluacgOaWsOS4gOS4quWtmOaho++8iGxhc3TvvInvvIzljbPliJrliJrmlrDlu7rnmoTlrZjmoaNcbiAgICAgIEdhbWUuQXJjaGl2ZS5sb2FkKCk7XG4gICAgfVxuXG4gIH0pO1xuXG5cbiAgLy8g5ZCr5pyJJOW8gOWktOeahOS7o+ihqOaYr+WfuuehgOWAvFxuICAvLyDkuI3lkKsk55qE5ZCM5ZCN5bGe5oCn5piv6K6h566X5ZCO5YC877yM5Y2z57uP6L+H5ZCE56eN5Yqg5oiQ77yMYnVmZu+8jG5lcmbkuYvlkI7nmoTlgLxcbiAgbGV0IEhlcm9EZWZhdWx0ID0ge1xuICAgIFwibGV2ZWxcIjogMSwgLy8g562J57qnXG4gICAgXCJleHBcIjogMCwgLy8g57uP6aqM5YC8XG4gICAgXCJ0eXBlXCI6IFwiaGVyb1wiLCAvLyDmoIfor4bov5nkuKphY3RvcueahOexu+WIq+aYr2hlcm/vvIzlhbbku5bnsbvliKvlpoJucGPvvIxtb25zdGVyXG5cbiAgICBcImNsYXNzXCI6IFwiXCIsIC8vIOiBjOS4mu+8jOS4jeWQjOiBjOS4muacieS4jeWQjOWKoOaIkFxuXG4gICAgLy8gMjMz5bm0MuaciDI35pelIDA55pe2MzDliIZcbiAgICBcInRpbWVcIjogMjMzKig2MCoyNCozMCoxMikgKyAxKig2MCoyNCozMCkgKyAyNiooNjAqMjQpICsgOSooNjApICsgMzAsXG5cbiAgICAvLyDmnIDln7rmnKznmoTlsZ7mgKfvvIzlhbbku5blsZ7mgKfpg73nlLHmraTlu7bkvLhcbiAgICBcIiRzdHJcIjogMTAsIC8vIHN0cmVuZ3RoIOWKm+mHj++8miDniannkIbmlLvlh7vliptcbiAgICBcIiRkZXhcIjogMTAsIC8vIGRleHRlcml0eSDmlY/mjbfvvJog6Zeq6YG/77yM5pq05Ye7XG4gICAgXCIkY29uXCI6IDEwLCAvLyBjb25zdGl0dXRpb24g6ICQ5Yqb77yaIOeUn+WRveWAvFxuICAgIFwiJGludFwiOiAxMCwgLy8gaW50ZWxsaWdlbmNlIOaZuuWKm++8miDnsr7npZ7lipvvvIzprZTms5XmlLvlh7tcbiAgICBcIiRjaGFcIjogMTAsIC8vIGNoYXJpc21hIOmtheWKm++8miDpmJ/lj4vog73liptcblxuICAgIC8vIOS4i+mdouS4ujDnmoTlgLzlsIbnlLHkuIrpnaLnmoTln7rmnKzlsZ7mgKforqHnrpflh7rmnaVcblxuICAgIFwic3RyXCI6IDAsXG4gICAgXCJkZXhcIjogMCxcbiAgICBcImludFwiOiAwLFxuICAgIFwiY29uXCI6IDAsXG4gICAgXCJjaGFcIjogMCxcblxuICAgIFwiJGhwXCI6IDAsIC8vIOeUn+WRveWKm1xuICAgIFwiJHNwXCI6IDAsIC8vIOeyvuelnuWKm1xuXG4gICAgXCJjcml0aWNhbFwiOiAwLCAvLyDmmrTlh7vnjodcbiAgICBcImRvZGdlXCI6IDAsIC8vIOmXqumBv1xuXG4gICAgXCJocFwiOiAwLFxuICAgIFwic3BcIjogMCxcblxuICAgIFwiJGF0a1wiOiAwLCAvLyDmlLvlh7tcbiAgICBcIiRkZWZcIjogMCwgLy8g6Ziy5b6hXG4gICAgXCIkbWF0a1wiOiAwLCAvLyDprZTms5XmlLvlh7tcbiAgICBcIiRtZGVmXCI6IDAsIC8vIOmtlOazlemYsuW+oVxuXG4gICAgXCJhdGtcIjogMCxcbiAgICBcImRlZlwiOiAwLFxuICAgIFwibWF0a1wiOiAwLFxuICAgIFwibWRlZlwiOiAwLFxuXG4gICAgXCJidWZmXCI6IFtdLCAvLyDmnInnm4rnirbmgIFcbiAgICBcIm5lcmZcIjogW10sIC8vIOacieWus+eKtuaAgVxuXG4gICAgXCJjdXJyZW50UXVlc3RcIjogWyAvKiDlvZPliY3ku7vliqEgKi8gXSxcbiAgICBcImNvbXBsZXRlUXVlc3RcIjogWyAvKiDlrozmiJDkuobnmoTku7vliqEgKi8gXSxcblxuICAgIC8vIOWIneWni+S9jee9rlxuICAgIFwiYXJlYVwiOiBcImZ5c3RvbmVcIiwgLy8g5Zyw5Zu+aWRcbiAgICBcInhcIjogNTQsXG4gICAgXCJ5XCI6IDU4LFxuXG5cbiAgICBcImNlbnRlclhcIjogMjYsXG4gICAgXCJjZW50ZXJZXCI6IDU1LFxuICAgIFwiaGl0QXJlYVwiOiBbWzAsIDBdXSxcblxuICAgIC8vIOiDveWKm1xuICAgIFwic2tpbGxzXCI6IFtcbiAgICAgIFwiZmlzdC5sMVwiLFxuICAgICAgXCJzd29yZC5sMVwiLCAvLyDliZHmlLvlh7tMZXZlbDFcbiAgICAgIFwic3BlYXIubDFcIiwgLy8g5p6q5pS75Ye7TGV2ZWwxXG4gICAgICBcImJvdy5sMVwiLCAvLyDlvJPmlLvlh7tMZXZlbDFcbiAgICAgIFwiZmlyZS5sMVwiLCAvLyDngavnkIPmnK9MZXZlbDFcbiAgICBdLFxuXG4gICAgLy8g5oqA6IO95b+r5o235pa55byP5YiX6KGoXG4gICAgXCJiYXJcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IFwic3dvcmQubDFcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic2tpbGxcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiBcImJvdy5sMVwiLFxuICAgICAgICBcInR5cGVcIjogXCJza2lsbFwiXG4gICAgICB9LFxuICAgICAgbnVsbCxcbiAgICAgIG51bGwsXG4gICAgICBudWxsLFxuICAgICAgbnVsbCxcbiAgICAgIG51bGwsXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogXCJwb3Rpb24uaGVhbFdlYWtcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiaXRlbVwiXG4gICAgICB9XG4gICAgXSxcblxuICAgIC8vIOaKgOiDve+8jOS+i+WmgueUn+a0u+aKgOiDve+8jOivtOacjeaKgOiDve+8jOS6pOaYk+aKgOiDvVxuICAgIC8vc2tpbGxzOiB7XG4gICAgLy8gIF90cmFkZTogMCwgLy8g5Lqk5piT77yM5Lqk5piT5pe255qE5Lu35qC8XG4gICAgLy8gIF9uZWdvdGlhdGU6IDAsIC8vIOS6pOa2ie+8jOWFt+S9k+WJp+aDhe+8jOaLm+aPveWQjOS8tOaXtueahOi0ueeUqFxuICAgIC8vICBfbG9jazogMCwgLy8g5byA6ZSBXG4gICAgLy8gIF9rbm93bGVkZ2U6IDAsIC8vIOefpeivhu+8jOWFt+S9k+WJp+aDhe+8jOmJtOWumueJqeWTgVxuICAgIC8vICBfdHJlYXRtZW50OiAwLCAvLyDljLvnlpfvvIzlnKjkvb/nlKjljLvnlpfnianlk4Hml7bnmoTmlYjmnpxcbiAgICAvLyAgX2FuaW1hbDogMCwgLy8g5Yqo54mp5oiY5paX5Yqg5oiQ77yM5Yqo54mp6amv5YW7XG4gICAgLy99LFxuXG4gICAgXCJlcXVpcG1lbnRcIjoge1xuICAgICAgXCJoZWFkXCI6IG51bGwsXG4gICAgICBcImJvZHlcIjogXCJjbG90aC5ub3JtYWxcIixcbiAgICAgIFwiZmVldFwiOiBcInNob2VzLm5vcm1hbFwiLFxuICAgICAgXCJ3ZWFwb25cIjogXCJzd29yZC5pcm9uXCIsXG4gICAgICBcIm5lY2tcIjogbnVsbCxcbiAgICAgIFwicmluZ1wiOiBudWxsXG4gICAgfSxcblxuICAgIFwiaXRlbXNcIjoge1xuICAgICAgXCJzd29yZC5pcm9uXCI6IDEsXG4gICAgICBcInNwZWFyLmlyb25cIjogMSxcbiAgICAgIFwiYm93Lndvb2RcIjogMSAsXG4gICAgICBcImNsb3RoLm5vcm1hbFwiOiAxLFxuICAgICAgXCJzaG9lcy5ub3JtYWxcIjogMSxcbiAgICAgIFwicG90aW9uLmhlYWxXZWFrXCI6IDUsXG4gICAgICBcImJvb2suZ2FtZUFkdmVudHVyZVwiOiAxLFxuICAgICAgXCJib29rLmVsbGlvcndpc0hpc3RvcnlcIjogMVxuICAgIH0sXG5cbiAgICBcImdvbGRcIjogMCxcblxuICAgIFwiYW5pbWF0aW9uc1wiOiB7XG5cbiAgICAgIFwic3BlbGxjYXN0dXBcIjogWzAsIDYsIFwiXCIsIDQwXSxcbiAgICAgIFwic3BlbGxjYXN0bGVmdFwiOiBbMTMsIDE5LCBcIlwiLCA0MF0sXG4gICAgICBcInNwZWxsY2FzdGRvd25cIjogWzI2LCAzMiwgXCJcIiwgNDBdLFxuICAgICAgXCJzcGVsbGNhc3RyaWdodFwiOiBbMzksIDQ1LCBcIlwiLCA0MF0sXG5cbiAgICAgIFwid2Fsa3VwXCI6IFsxMDQsIDExMiwgXCJ3YWxrdXBcIiwgNzBdLFxuICAgICAgXCJ3YWxrbGVmdFwiOiBbMTE3LCAxMjUsIFwid2Fsa2xlZnRcIiwgNzBdLFxuICAgICAgXCJ3YWxrZG93blwiOiBbMTMwLCAxMzgsIFwid2Fsa2Rvd25cIiwgNzBdLFxuICAgICAgXCJ3YWxrcmlnaHRcIjogWzE0MywgMTUxLCBcIndhbGtyaWdodFwiLCA3MF0sXG5cbiAgICAgIFwibWVsZWV1cFwiOiBbMTU2LCAxNjEsIFwiXCIsIDQwXSxcbiAgICAgIFwibWVsZWVsZWZ0XCI6IFsxNjksIDE3NCwgXCJcIiwgNDBdLFxuICAgICAgXCJtZWxlZWRvd25cIjogWzE4MiwgMTg3LCBcIlwiLCA0MF0sXG4gICAgICBcIm1lbGVlcmlnaHRcIjogWzE5NSwgMjAwLCBcIlwiLCA0MF0sXG5cbiAgICAgIC8vIDI3MyvmmK/kuIDlvKDlm77nmoTmgLvmlbDvvIxoZXJv5LiA5YWx5Lik5byg5Zu+77yM56ys5LiA5byg5Zu+5rKh5q2m5Zmo77yM56ys5LqM5byg5Zu+5pyJ5q2m5Zmo77yM5omA5Lul5Lul5LiL5Yqo5L2c5Zyo56ys5LqM5byg5Zu+XG5cbiAgICAgIFwidGhydXN0dXBcIjogWzI3Mys1MiwgMjczKzU5LCBcIlwiLCA0MF0sXG4gICAgICBcInRocnVzdGxlZnRcIjogWzI3Mys2NSwgMjczKzcyLCBcIlwiLCA0MF0sXG4gICAgICBcInRocnVzdGRvd25cIjogWzI3Mys3OCwgMjczKzg1LCBcIlwiLCA0MF0sXG4gICAgICBcInRocnVzdHJpZ2h0XCI6IFsyNzMrOTEsIDI3Mys5OCwgXCJcIiwgNDBdLFxuXG4gICAgICBcInJ1bnVwXCI6IFsyNzMrMTA1LCAyNzMrMTEyLCBcInJ1bnVwXCIsIDMwXSxcbiAgICAgIFwicnVubGVmdFwiOiBbMjczKzExOCwgMjczKzEyNSwgXCJydW5sZWZ0XCIsIDMwXSxcbiAgICAgIFwicnVuZG93blwiOiBbMjczKzEzMSwgMjczKzEzOCwgXCJydW5kb3duXCIsIDMwXSxcbiAgICAgIFwicnVucmlnaHRcIjogWzI3MysxNDQsIDI3MysxNTEsIFwicnVucmlnaHRcIiwgMzBdLFxuXG4gICAgICBcInNsYXNodXBcIjogWzI3MysxNTYsIDI3MysxNjEsIFwiXCIsIDQwXSxcbiAgICAgIFwic2xhc2hsZWZ0XCI6IFsyNzMrMTY5LCAyNzMrMTc0LCBcIlwiLCA0MF0sXG4gICAgICBcInNsYXNoZG93blwiOiBbMjczKzE4MiwgMjczKzE4NywgXCJcIiwgNDBdLFxuICAgICAgXCJzbGFzaHJpZ2h0XCI6IFsyNzMrMTk1LCAyNzMrMjAwLCBcIlwiLCA0MF0sXG5cbiAgICAgIFwic2hvb3R1cFwiOiBbMjczKzIwOCwgMjczKzIyMCwgXCJcIiwgNDBdLFxuICAgICAgXCJzaG9vdGxlZnRcIjogWzI3MysyMjEsIDI3MysyMzMsIFwiXCIsIDQwXSxcbiAgICAgIFwic2hvb3Rkb3duXCI6IFsyNzMrMjM0LCAyNzMrMjQ2LCBcIlwiLCA0MF0sXG4gICAgICBcInNob290cmlnaHRcIjogWzI3MysyNDcsIDI3MysyNTksIFwiXCIsIDQwXSxcblxuICAgICAgXCJodXJ0XCI6IFsyNjAsIDI2NSwgXCJcIiwgNjBdLFxuXG4gICAgICBcImRlYWRcIjogMjY1LFxuXG4gICAgICBcImZhY2V1cFwiOiAxMDQsXG4gICAgICBcImZhY2VsZWZ0XCI6IDExNyxcbiAgICAgIFwiZmFjZWRvd25cIjogMTMwLFxuICAgICAgXCJmYWNlcmlnaHRcIjogMTQzXG4gICAgfVxuICB9O1xuXG5cbn0pKCk7XG4iXX0=

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

  Game.assign("Archive", (function () {
    function GameArchive() {
      _classCallCheck(this, GameArchive);
    }

    _createClass(GameArchive, null, [{
      key: "remove",
      value: function remove(id) {
        if (window.localStorage.getItem(id)) {
          window.localStorage.removeItem(id);
        }
      }

      // 返回所有存档，Object格式
    }, {
      key: "list",
      value: function list() {
        var keys = [];
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
          }
        }
        keys.sort();
        keys.reverse();
        return keys;
      }

      // 返回最新存档，Object格式
    }, {
      key: "last",
      value: function last() {
        var list = Game.Archive.list();
        if (list.length > 0) {
          var last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + last));
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }, {
      key: "save",
      value: function save(data) {
        var now = new Date();
        var id = now.getTime();

        data.id = id;
        data.name = data.hero.name;
        data.date = now.toLocaleString();

        window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
      }
    }, {
      key: "get",
      value: function get(id) {
        if (id && window.localStorage.getItem(id)) {
          return JSON.parse(window.localStorage.getItem(id));
        }
        return null;
      }
    }, {
      key: "load",
      value: function load(id) {
        var data = Game.Archive.get(id);
        if (!data) {
          data = Game.Archive.last();
        }

        if (data) {

          if (Game.windows["interface"].showing) {
            Game.windows["interface"].hide();
          }
          Game.windows.main.hide();

          Game.windows.loading.begin();

          setTimeout(function () {
            var heroData = data.hero;

            Game.drawHero(heroData.custom).then(function (heroImage) {
              heroData.image = heroImage;
              Game.hero = new Game.ActorHero(heroData);

              Game.hero.on("complete", function () {

                Game.hero.gotoArea(heroData.area, heroData.x, heroData.y);
              });
            });
          }, 20);
        } else {
          console.error("id:", id);
          throw new Error("Invalid id, Game.Archive.load");
        }
      }
    }]);

    return GameArchive;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7YUFBUSxXQUFXOzRCQUFYLFdBQVc7OztpQkFBWCxXQUFXOzthQUV4QixnQkFBQyxFQUFFLEVBQUU7QUFDakIsWUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxnQkFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEM7T0FDRjs7Ozs7YUFHVyxnQkFBRztBQUNiLFlBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLGFBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtBQUNuQyxjQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDN0IsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ25EO1NBQ0Y7QUFDRCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixlQUFPLElBQUksQ0FBQztPQUNiOzs7OzthQUdXLGdCQUFHO0FBQ2IsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixZQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ25CLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxXQUFTLElBQUks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cmNoaXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgR2FtZS5hc3NpZ24oXCJBcmNoaXZlXCIsIGNsYXNzIEdhbWVBcmNoaXZlIHtcblxuICAgIHN0YXRpYyByZW1vdmUgKGlkKSB7XG4gICAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOi/lOWbnuaJgOacieWtmOaho++8jE9iamVjdOagvOW8j1xuICAgIHN0YXRpYyBsaXN0ICgpIHtcbiAgICAgIGxldCBrZXlzID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgICBpZiAoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLykpIHtcbiAgICAgICAgICBrZXlzLnB1c2gocGFyc2VJbnQoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLylbMV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5cy5zb3J0KCk7XG4gICAgICBrZXlzLnJldmVyc2UoKTtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8vIOi/lOWbnuacgOaWsOWtmOaho++8jE9iamVjdOagvOW8j1xuICAgIHN0YXRpYyBsYXN0ICgpIHtcbiAgICAgIGxldCBsaXN0ID0gR2FtZS5BcmNoaXZlLmxpc3QoKTtcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGxhc3QgPSBsaXN0WzBdO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oYFNBVkVfJHtsYXN0fWApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBjbGVhciAoKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgICBpZiAoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLykpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlIChkYXRhKSB7XG4gICAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgIGxldCBpZCA9IG5vdy5nZXRUaW1lKCk7XG5cbiAgICAgIGRhdGEuaWQgPSBpZDtcbiAgICAgIGRhdGEubmFtZSA9IGRhdGEuaGVyby5uYW1lO1xuICAgICAgZGF0YS5kYXRlID0gbm93LnRvTG9jYWxlU3RyaW5nKCk7XG5cbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShgU0FWRV8ke2lkfWAsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IChpZCkge1xuICAgICAgaWYgKGlkICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShpZCkpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIGxldCBkYXRhID0gR2FtZS5BcmNoaXZlLmdldChpZCk7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IEdhbWUuQXJjaGl2ZS5sYXN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhKSB7XG5cbiAgICAgICAgaWYgKEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvd2luZykge1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIEdhbWUud2luZG93cy5tYWluLmhpZGUoKTtcblxuICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5iZWdpbigpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBoZXJvRGF0YSA9IGRhdGEuaGVybztcblxuICAgICAgICAgIEdhbWUuZHJhd0hlcm8oaGVyb0RhdGEuY3VzdG9tKS50aGVuKGZ1bmN0aW9uIChoZXJvSW1hZ2UpIHtcbiAgICAgICAgICAgIGhlcm9EYXRhLmltYWdlID0gaGVyb0ltYWdlO1xuICAgICAgICAgICAgR2FtZS5oZXJvID0gbmV3IEdhbWUuQWN0b3JIZXJvKGhlcm9EYXRhKTtcblxuICAgICAgICAgICAgR2FtZS5oZXJvLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5nb3RvQXJlYShoZXJvRGF0YS5hcmVhLCBoZXJvRGF0YS54LCBoZXJvRGF0YS55KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMjApO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiaWQ6XCIsIGlkKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBpZCwgR2FtZS5BcmNoaXZlLmxvYWRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59KSgpO1xuIl19
