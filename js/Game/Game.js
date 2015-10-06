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
