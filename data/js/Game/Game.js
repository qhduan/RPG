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

        privates.stage.appendChild(privates.layers.mapLayer, privates.layers.itemLayer, privates.layers.actorLayer, privates.layers.infoLayer, privates.layers.skillLayer, privates.layers.dialogueLayer);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7OztNQUc1QixRQUFRO0FBRUEsYUFGUixRQUFRLEdBRUc7NEJBRlgsUUFBUTs7QUFHVixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdEIsY0FBUSxDQUFDLE1BQU0sR0FBRztBQUNoQixhQUFLLEVBQUUsR0FBRztBQUNWLGNBQU0sRUFBRSxHQUFHO0FBQ1gsYUFBSyxFQUFFLElBQUk7QUFDWCxXQUFHLEVBQUUsRUFBRSxFQUNSLENBQUM7O0FBQ0YsY0FBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDdkIsY0FBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDdkI7O2lCQWpCRyxRQUFROzthQW1CTCxnQkFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ1osZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7Ozs7Ozs7QUFFNUMsaUNBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSw4SEFBRTtrQkFBdkIsR0FBRzs7QUFDVixrQkFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNyQix1QkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFD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LEtBQUssRUFBRTtBQUM1QixZQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN4RCxtQkFBYSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDO0dBQ0o7Q0FFRixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gICAgLy8gcm9vdOe6p+WIq2FwaeWFpeWPo1xuICBjbGFzcyBHYW1lQ29yZSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLml0ZW1zID0ge307XG4gICAgICBwcml2YXRlcy5za2lsbHMgPSB7fTtcbiAgICAgIHByaXZhdGVzLnNvdW5kcyA9IHt9O1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzID0ge307XG4gICAgICBwcml2YXRlcy53aW5kb3dzID0ge307XG4gICAgICBwcml2YXRlcy5jb25maWcgPSB7IC8vIOS/neWtmOaJgOacieiuvue9ru+8iOm7mOiupOiuvue9ru+8iVxuICAgICAgICB3aWR0aDogODAwLCAvLyDmuLLmn5Pnqpflj6PnmoTljp/lp4vlpKflsI9cbiAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgIHNjYWxlOiB0cnVlLCAvLyDlpoLmnpzkuI3mi4nkvLjvvIzpgqPkuYjml6DorrrmtY/op4jlmajnqpflj6PlpJrlpKfvvIzpg73mmK/ljp/lp4vlpKflsI/vvJvmi4nkvLjliJnmjInmr5Tkvovloavmu6Hnqpflj6NcbiAgICAgICAgZnBzOiAzNSwgLy8g6ZSB5a6aZnBz5Yiw5oyH5a6a5pWw5YC877yM5aaC5p6c6K6+572u5Li6PD0w77yM5YiZ5LiN6ZmQ5Yi2XG4gICAgICB9O1xuICAgICAgcHJpdmF0ZXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgIHByaXZhdGVzLnN0YWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRCYWcgKHgsIHkpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIOWvu+aJvuW3sue7j+WtmOWcqOeahGJhZ1xuICAgICAgICBmb3IgKGxldCBiYWcgb2YgR2FtZS5hcmVhLmJhZ3MpIHtcbiAgICAgICAgICBpZiAoYmFnLmhpdFRlc3QoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGJhZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOayoeacieW3sue7j+WtmOWcqOeahGJhZ+WQiOmAgu+8jOaWsOW7uuS4gOS4qlxuICAgICAgICBHYW1lLkl0ZW0ubG9hZChcImJhZ1wiKS50aGVuKChiYWcpID0+IHtcbiAgICAgICAgICBiYWcueCA9IHg7XG4gICAgICAgICAgYmFnLnkgPSB5O1xuICAgICAgICAgIGJhZy5pbm5lciA9IHt9O1xuICAgICAgICAgIGJhZy5kcmF3KCk7XG4gICAgICAgICAgR2FtZS5hcmVhLmJhZ3MuYWRkKGJhZyk7XG4gICAgICAgICAgcmVzb2x2ZShiYWcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzc2lnbiAobmFtZSwgb2JqZWN0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogb2JqZWN0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKiDorr7nva7muLjmiI/mmoLlgZzmoIflv5fkuLpmYWxzZe+8jOWQr+WKqOa4uOaIj+S4u+W+queOr++8jOaOpeWPl+i+k+WFpSAqL1xuICAgIHN0YXJ0ICgpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiDmmoLlgZzmuLjmiI8gKi9cbiAgICBwYXVzZSAoKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5wYXVzZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldCBwYXVzZWQgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnBhdXNlZDtcbiAgICB9XG5cbiAgICBzZXQgcGF1c2VkICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5wYXVzZWQgcmVhZG9ubHksIHVzZSBHYW1lLnBhdXNlKCkgaW5zdGVhZFwiKTtcbiAgICB9XG5cbiAgICBnZXQgd2luZG93cyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykud2luZG93cztcbiAgICB9XG5cbiAgICBzZXQgd2luZG93cyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUud2luZG93cyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgY29uZmlnICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jb25maWc7XG4gICAgfVxuXG4gICAgc2V0IGNvbmZpZyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuY29uZmlnIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBpdGVtcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaXRlbXM7XG4gICAgfVxuXG4gICAgc2V0IGl0ZW1zICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5pdGVtcyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc2tpbGxzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5za2lsbHM7XG4gICAgfVxuXG4gICAgc2V0IHNraWxscyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuc2tpbGxzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBzb3VuZHMgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnNvdW5kcztcbiAgICB9XG5cbiAgICBzZXQgc291bmRzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5zb3VuZHMgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGxheWVycyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykubGF5ZXJzO1xuICAgIH1cblxuICAgIHNldCBsYXllcnMgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLmxheWVycyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc3RhZ2UgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnN0YWdlO1xuICAgIH1cblxuICAgIHNldCBzdGFnZSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuc3RhZ2UgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqIOa4heeQhuiInuWPsO+8jOWNs+WIoOmZpOiInuWPsOS4iuaJgOacieWFg+e0oCAqL1xuICAgIGNsZWFyU3RhZ2UgKCkge1xuICAgICAgaWYgKEdhbWUuYXJlYSkge1xuICAgICAgICBmb3IgKGxldCBhY3RvciBvZiBHYW1lLmFyZWEuYWN0b3JzKSB7XG4gICAgICAgICAgYWN0b3IuZXJhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBiYWcgb2YgR2FtZS5hcmVhLmJhZ3MpIHtcbiAgICAgICAgICBiYWcuZXJhc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5sYXllcnMubWFwTGF5ZXIuY2xlYXIoKTtcbiAgICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMuc3RhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgbGF5ZXIuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhZ2UucmVsZWFzZVJlbmRlcmVyKCk7XG4gICAgfVxuXG4gICAgLyoqIOa4uOaIj+WIneWni+WMliAqL1xuICAgIGluaXQgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvLyDoiJ7lj7BcbiAgICAgIHByaXZhdGVzLnN0YWdlID0gbmV3IFNwcml0ZS5TdGFnZShwcml2YXRlcy5jb25maWcud2lkdGgsIHByaXZhdGVzLmNvbmZpZy5oZWlnaHQpO1xuICAgICAgLy8g5bu656uL5LiA5Liq5Y+v5Lul6Ieq5Yqo5Ly457yp55qE56qX5Y+j77yM5bm25bCG6Iie5Y+w5Yqg5YWl5YW25LitXG4gICAgICBwcml2YXRlcy53aW5kb3dzLnN0YWdlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwic3RhZ2VcIilcbiAgICAgICAgLmFwcGVuZENoaWxkKHByaXZhdGVzLnN0YWdlLmNhbnZhcylcbiAgICAgICAgLnNob3coKTtcblxuICAgICAgLy8g5Zyw5Zu+5bGCXG4gICAgICBwcml2YXRlcy5sYXllcnMubWFwTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLm1hcExheWVyLm5hbWUgPSBcIm1hcExheWVyXCI7XG4gICAgICAvLyDnianlk4HlsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5pdGVtTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLml0ZW1MYXllci5uYW1lID0gXCJpdGVtTGF5ZXJcIjtcbiAgICAgIC8vIOS6uueJqeWxgu+8jOWMheaLrOeOqeWutlxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmFjdG9yTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmFjdG9yTGF5ZXIubmFtZSA9IFwiYWN0b3JMYXllclwiO1xuICAgICAgLy8g5L+h5oGv5bGCXG4gICAgICBwcml2YXRlcy5sYXllcnMuaW5mb0xheWVyID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgIHByaXZhdGVzLmxheWVycy5pbmZvTGF5ZXIubmFtZSA9IFwiaW5mb3JMYXllclwiO1xuICAgICAgLy8g5oqA6IO95pWI5p6c5bGCXG4gICAgICBwcml2YXRlcy5sYXllcnMuc2tpbGxMYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMuc2tpbGxMYXllci5uYW1lID0gXCJza2lsbExheWVyXCI7XG4gICAgICAvLyDlr7nor53lsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5kaWFsb2d1ZUxheWVyID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgIHByaXZhdGVzLmxheWVycy5kaWFsb2d1ZUxheWVyLm5hbWUgPSBcImRpYWxvZ3VlTGF5ZXJcIjtcblxuICAgICAgcHJpdmF0ZXMuc3RhZ2UuYXBwZW5kQ2hpbGQoXG4gICAgICAgIHByaXZhdGVzLmxheWVycy5tYXBMYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLml0ZW1MYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLmFjdG9yTGF5ZXIsXG4gICAgICAgIHByaXZhdGVzLmxheWVycy5pbmZvTGF5ZXIsXG4gICAgICAgIHByaXZhdGVzLmxheWVycy5za2lsbExheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMuZGlhbG9ndWVMYXllclxuICAgICAgKTtcblxuICAgICAgLy8g6LCD5pW05Lq654mp5bGC6aG65bqP77yM5Lmf5bCx5piv5LiK5pa555qE5Lq654mp5Lya6KKr5LiL5pa555qE5Lq654mp6YGu55uW77yM5L6L5aaCXG4gICAgICAvKipcbiAgICAgICAqIEFBIEJCXG4gICAgICAgKiBBQSBCQlxuICAgICAgICog6L+Z5qC35Lq654mpQeWSjELpg73kuI3lubLmtonvvIzkvYbmmK9B55qE5L2N572u5aaC5p6c5ZyoQueahOS4iumdou+8jOW5tuS4lOe0p+aMqOedgOWwseWPmOaIkOS6hlxuICAgICAgICogQUFcbiAgICAgICAqIEJCXG4gICAgICAgKiBCQlxuICAgICAgICog6L+Z5qC35Lq654mpQeeahOS4i+WNiui6q+Wwseiiq+S6uueJqULpga7nm5bvvIzov5nlsLHmmK/ov5vooYzmjpLluo/vvIzlkKbliJnlpoLmnpzlj5jmiJBcbiAgICAgICAqIEFBXG4gICAgICAgKiBBQVxuICAgICAgICogQkJcbiAgICAgICAqIOi/meagt+WwseaYr0LnmoTkuIrljYrouqvooqvkurrnialB6YGu55uW77yM6L+Z5bCx5b6I5aWH5oCqXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLnN0YWdlLm9uKFwiYmVmb3JlRHJhd1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChHYW1lLmhlcm8pIHtcbiAgICAgICAgICBHYW1lLmxheWVycy5hY3RvckxheWVyLmNoaWxkcmVuLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmIChhLnkgPCBiLnkpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmIChhLnkgPiBiLnkpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvKlxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoR2FtZS5wYXVzZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICBHYW1lLnN0YWdlLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICAgICovXG4gICAgICBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChHYW1lLnBhdXNlZCA9PSBmYWxzZSkge1xuICAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvKlxuICAgICAgbGV0IHVwZGF0ZU5leHQgPSBmYWxzZTtcbiAgICAgIEdhbWUuc3RhZ2Uub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVOZXh0ID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgICAgU3ByaXRlLlRpY2tlci5vbihcInRpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgIGlmIChHYW1lLnBhdXNlZCA9PSBmYWxzZSAmJiB1cGRhdGVOZXh0KSB7XG4gICAgICAgICBHYW1lLnN0YWdlLnVwZGF0ZSgpO1xuICAgICAgICAgdXBkYXRlTmV4dCA9IGZhbHNlO1xuICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgKi9cblxuICAgICAgbGV0IGZwc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIGZwc0VsZW1lbnQuc3R5bGUubGVmdCA9IFwiMFwiO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS50b3AgPSBcIjBcIjtcbiAgICAgIGZwc0VsZW1lbnQuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICBmcHNFbGVtZW50LnN0eWxlLnpJbmRleCA9IDk5OTk5OTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnBzRWxlbWVudCk7XG5cbiAgICAgIGxldCBmcHMgPSAwO1xuICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICBwcml2YXRlcy5zdGFnZS5vbihcImFmdGVyRHJhd1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZwcysrO1xuICAgICAgfSk7XG4gICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IGYgPSBmcHMgLyAoKG5vdyAtIHN0YXJ0KS8xMDAwKTtcbiAgICAgICAgZnBzID0gMDtcbiAgICAgICAgc3RhcnQgPSBub3c7XG4gICAgICAgIGZwc0VsZW1lbnQudGV4dENvbnRlbnQgPSBmLnRvRml4ZWQoMSk7XG4gICAgICB9LCAxMDAwKTtcblxuICAgICAgY29uc29sZS5sb2coXCJSUEcgR2FtZSAwLjEuMSBGbHlpbmchXCIpO1xuICAgIH1cbiAgfTtcblxuICBsZXQgR2FtZSA9IHdpbmRvdy5HYW1lID0gbmV3IEdhbWVDb3JlKCk7XG5cbiAgLy8gdW5kZXIgbm9kZS13ZWJraXRcbiAgaWYgKHdpbmRvdy5yZXF1aXJlKSB7XG4gICAgR2FtZS5jb25maWcuc2NhbGUgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gR2FtZUJvb3RzdHJhcCAoKSB7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICBHYW1lLmluaXQoKTtcbiAgICAgIEdhbWUuSW5wdXQuaW5pdCgpO1xuICAgICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChHYW1lQm9vdHN0cmFwKCkgPT0gZmFsc2UpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBHYW1lQm9vdHN0cmFwKCk7XG4gICAgfSk7XG4gIH1cblxufSkoKTtcbiJdfQ==
