"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
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
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
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
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7OztBQUFDO01BRzVCLFFBQVE7QUFFWixhQUZJLFFBQVEsR0FFRzs0QkFGWCxRQUFROztBQUdWLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQixjQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixjQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixjQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixjQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN0QixjQUFRLENBQUMsTUFBTSxHQUFHO0FBQ2hCLGFBQUssRUFBRSxHQUFHO0FBQ1YsY0FBTSxFQUFFLEdBQUc7QUFDWCxhQUFLLEVBQUUsSUFBSTtBQUNYLFdBQUcsRUFBRSxFQUFFLEVBQ1IsQ0FBQzs7QUFDRixjQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUN2QixjQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUN2Qjs7aUJBakJHLFFBQVE7OzZCQW1CSixDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ1osZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7Ozs7Ozs7QUFFNUMsaUNBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSw4SEFBRTtrQkFBdkIsR0FBRzs7QUFDVixrQkFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNyQix1QkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFDckI7YUFD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LENBQUM7R0FDSjtDQUVGLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgICAvLyByb29057qn5YirYXBp5YWl5Y+jXG4gIGNsYXNzIEdhbWVDb3JlIHtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuaXRlbXMgPSB7fTtcbiAgICAgIHByaXZhdGVzLnNraWxscyA9IHt9O1xuICAgICAgcHJpdmF0ZXMuc291bmRzID0ge307XG4gICAgICBwcml2YXRlcy5sYXllcnMgPSB7fTtcbiAgICAgIHByaXZhdGVzLndpbmRvd3MgPSB7fTtcbiAgICAgIHByaXZhdGVzLmNvbmZpZyA9IHsgLy8g5L+d5a2Y5omA5pyJ6K6+572u77yI6buY6K6k6K6+572u77yJXG4gICAgICAgIHdpZHRoOiA4MDAsIC8vIOa4suafk+eql+WPo+eahOWOn+Wni+Wkp+Wwj1xuICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgc2NhbGU6IHRydWUsIC8vIOWmguaenOS4jeaLieS8uO+8jOmCo+S5iOaXoOiuuua1j+iniOWZqOeql+WPo+WkmuWkp++8jOmDveaYr+WOn+Wni+Wkp+Wwj++8m+aLieS8uOWImeaMieavlOS+i+Whq+a7oeeql+WPo1xuICAgICAgICBmcHM6IDM1LCAvLyDplIHlrppmcHPliLDmjIflrprmlbDlgLzvvIzlpoLmnpzorr7nva7kuLo8PTDvvIzliJnkuI3pmZDliLZcbiAgICAgIH07XG4gICAgICBwcml2YXRlcy5wYXVzZWQgPSB0cnVlO1xuICAgICAgcHJpdmF0ZXMuc3RhZ2UgPSBudWxsO1xuICAgIH1cblxuICAgIGFkZEJhZyAoeCwgeSkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgLy8g5a+75om+5bey57uP5a2Y5Zyo55qEYmFnXG4gICAgICAgIGZvciAobGV0IGJhZyBvZiBHYW1lLmFyZWEuYmFncykge1xuICAgICAgICAgIGlmIChiYWcuaGl0VGVzdCh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoYmFnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5bey57uP5a2Y5Zyo55qEYmFn5ZCI6YCC77yM5paw5bu65LiA5LiqXG4gICAgICAgIEdhbWUuSXRlbS5sb2FkKFwiYmFnXCIpLnRoZW4oKGJhZykgPT4ge1xuICAgICAgICAgIGJhZy54ID0geDtcbiAgICAgICAgICBiYWcueSA9IHk7XG4gICAgICAgICAgYmFnLmlubmVyID0ge307XG4gICAgICAgICAgYmFnLmRyYXcoKTtcbiAgICAgICAgICBHYW1lLmFyZWEuYmFncy5hZGQoYmFnKTtcbiAgICAgICAgICByZXNvbHZlKGJhZyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXNzaWduIChuYW1lLCBvYmplY3QpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvYmplY3RcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqIOiuvue9rua4uOaIj+aaguWBnOagh+W/l+S4umZhbHNl77yM5ZCv5Yqo5ri45oiP5Li75b6q546v77yM5o6l5Y+X6L6T5YWlICovXG4gICAgc3RhcnQgKCkge1xuICAgICAgaW50ZXJuYWwodGhpcykucGF1c2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIOaaguWBnOa4uOaIjyAqL1xuICAgIHBhdXNlICgpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLnBhdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0IHBhdXNlZCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykucGF1c2VkO1xuICAgIH1cblxuICAgIHNldCBwYXVzZWQgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLnBhdXNlZCByZWFkb25seSwgdXNlIEdhbWUucGF1c2UoKSBpbnN0ZWFkXCIpO1xuICAgIH1cblxuICAgIGdldCB3aW5kb3dzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS53aW5kb3dzO1xuICAgIH1cblxuICAgIHNldCB3aW5kb3dzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS53aW5kb3dzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBjb25maWcgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNvbmZpZztcbiAgICB9XG5cbiAgICBzZXQgY29uZmlnICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5jb25maWcgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGl0ZW1zICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5pdGVtcztcbiAgICB9XG5cbiAgICBzZXQgaXRlbXMgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLml0ZW1zIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBza2lsbHMgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLnNraWxscztcbiAgICB9XG5cbiAgICBzZXQgc2tpbGxzICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5za2lsbHMgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHNvdW5kcyAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuc291bmRzO1xuICAgIH1cblxuICAgIHNldCBzb3VuZHMgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLnNvdW5kcyByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgbGF5ZXJzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5sYXllcnM7XG4gICAgfVxuXG4gICAgc2V0IGxheWVycyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUubGF5ZXJzIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBzdGFnZSAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuc3RhZ2U7XG4gICAgfVxuXG4gICAgc2V0IHN0YWdlICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5zdGFnZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKiog5riF55CG6Iie5Y+w77yM5Y2z5Yig6Zmk6Iie5Y+w5LiK5omA5pyJ5YWD57SgICovXG4gICAgY2xlYXJTdGFnZSAoKSB7XG4gICAgICBpZiAoR2FtZS5hcmVhKSB7XG4gICAgICAgIGZvciAobGV0IGFjdG9yIG9mIEdhbWUuYXJlYS5hY3RvcnMpIHtcbiAgICAgICAgICBhY3Rvci5lcmFzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGJhZyBvZiBHYW1lLmFyZWEuYmFncykge1xuICAgICAgICAgIGJhZy5lcmFzZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmxheWVycy5tYXBMYXllci5jbGVhcigpO1xuICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcy5zdGFnZS5jaGlsZHJlbikge1xuICAgICAgICBsYXllci5jbGVhcigpO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGFnZS5yZWxlYXNlUmVuZGVyZXIoKTtcbiAgICB9XG5cbiAgICAvKiog5ri45oiP5Yid5aeL5YyWICovXG4gICAgaW5pdCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8vIOiInuWPsFxuICAgICAgcHJpdmF0ZXMuc3RhZ2UgPSBuZXcgU3ByaXRlLlN0YWdlKHByaXZhdGVzLmNvbmZpZy53aWR0aCwgcHJpdmF0ZXMuY29uZmlnLmhlaWdodCk7XG4gICAgICAvLyDlu7rnq4vkuIDkuKrlj6/ku6Xoh6rliqjkvLjnvKnnmoTnqpflj6PvvIzlubblsIboiJ7lj7DliqDlhaXlhbbkuK1cbiAgICAgIHByaXZhdGVzLndpbmRvd3Muc3RhZ2UgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzdGFnZVwiKVxuICAgICAgICAuYXBwZW5kQ2hpbGQocHJpdmF0ZXMuc3RhZ2UuY2FudmFzKVxuICAgICAgICAuc2hvdygpO1xuXG4gICAgICAvLyDlnLDlm77lsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5tYXBMYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMubWFwTGF5ZXIubmFtZSA9IFwibWFwTGF5ZXJcIjtcbiAgICAgIC8vIOeJqeWTgeWxglxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLml0ZW1MYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMuaXRlbUxheWVyLm5hbWUgPSBcIml0ZW1MYXllclwiO1xuICAgICAgLy8g5Lq654mp5bGC77yM5YyF5ous546p5a62XG4gICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllciA9IG5ldyBTcHJpdGUuQ29udGFpbmVyKCk7XG4gICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllci5uYW1lID0gXCJhY3RvckxheWVyXCI7XG4gICAgICAvLyDkv6Hmga/lsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5pbmZvTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmluZm9MYXllci5uYW1lID0gXCJpbmZvckxheWVyXCI7XG4gICAgICAvLyDmioDog73mlYjmnpzlsYJcbiAgICAgIHByaXZhdGVzLmxheWVycy5za2lsbExheWVyID0gbmV3IFNwcml0ZS5Db250YWluZXIoKTtcbiAgICAgIHByaXZhdGVzLmxheWVycy5za2lsbExheWVyLm5hbWUgPSBcInNraWxsTGF5ZXJcIjtcbiAgICAgIC8vIOWvueivneWxglxuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmRpYWxvZ3VlTGF5ZXIgPSBuZXcgU3ByaXRlLkNvbnRhaW5lcigpO1xuICAgICAgcHJpdmF0ZXMubGF5ZXJzLmRpYWxvZ3VlTGF5ZXIubmFtZSA9IFwiZGlhbG9ndWVMYXllclwiO1xuXG4gICAgICBwcml2YXRlcy5zdGFnZS5hcHBlbmRDaGlsZChcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLm1hcExheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMuaXRlbUxheWVyLFxuICAgICAgICBwcml2YXRlcy5sYXllcnMuYWN0b3JMYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLmluZm9MYXllcixcbiAgICAgICAgcHJpdmF0ZXMubGF5ZXJzLnNraWxsTGF5ZXIsXG4gICAgICAgIHByaXZhdGVzLmxheWVycy5kaWFsb2d1ZUxheWVyXG4gICAgICApO1xuXG4gICAgICAvLyDosIPmlbTkurrnianlsYLpobrluo/vvIzkuZ/lsLHmmK/kuIrmlrnnmoTkurrniankvJrooqvkuIvmlrnnmoTkurrnianpga7nm5bvvIzkvovlpoJcbiAgICAgIC8qKlxuICAgICAgICogQUEgQkJcbiAgICAgICAqIEFBIEJCXG4gICAgICAgKiDov5nmoLfkurrnialB5ZKMQumDveS4jeW5sua2ie+8jOS9huaYr0HnmoTkvY3nva7lpoLmnpzlnKhC55qE5LiK6Z2i77yM5bm25LiU57Sn5oyo552A5bCx5Y+Y5oiQ5LqGXG4gICAgICAgKiBBQVxuICAgICAgICogQkJcbiAgICAgICAqIEJCXG4gICAgICAgKiDov5nmoLfkurrnialB55qE5LiL5Y2K6Lqr5bCx6KKr5Lq654mpQumBrueblu+8jOi/meWwseaYr+i/m+ihjOaOkuW6j++8jOWQpuWImeWmguaenOWPmOaIkFxuICAgICAgICogQUFcbiAgICAgICAqIEFBXG4gICAgICAgKiBCQlxuICAgICAgICog6L+Z5qC35bCx5pivQueahOS4iuWNiui6q+iiq+S6uueJqUHpga7nm5bvvIzov5nlsLHlvojlpYfmgKpcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMuc3RhZ2Uub24oXCJiZWZvcmVEcmF3XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKEdhbWUuaGVybykge1xuICAgICAgICAgIEdhbWUubGF5ZXJzLmFjdG9yTGF5ZXIuY2hpbGRyZW4uc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEueSA8IGIueSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEueSA+IGIueSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChHYW1lLnBhdXNlZCA9PSBmYWxzZSkge1xuICAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgICAgKi9cbiAgICAgIFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKEdhbWUucGF1c2VkID09IGZhbHNlKSB7XG4gICAgICAgICAgR2FtZS5zdGFnZS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICBsZXQgdXBkYXRlTmV4dCA9IGZhbHNlO1xuICAgICAgR2FtZS5zdGFnZS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVwZGF0ZU5leHQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgICBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgaWYgKEdhbWUucGF1c2VkID09IGZhbHNlICYmIHVwZGF0ZU5leHQpIHtcbiAgICAgICAgIEdhbWUuc3RhZ2UudXBkYXRlKCk7XG4gICAgICAgICB1cGRhdGVOZXh0ID0gZmFsc2U7XG4gICAgICAgfVxuICAgICAgfSk7XG4gICAgICAqL1xuXG4gICAgICBsZXQgZnBzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBmcHNFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICBmcHNFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGZwc0VsZW1lbnQuc3R5bGUuekluZGV4ID0gOTk5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcHNFbGVtZW50KTtcblxuICAgICAgbGV0IGZwcyA9IDA7XG4gICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHByaXZhdGVzLnN0YWdlLm9uKFwiYWZ0ZXJEcmF3XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnBzKys7XG4gICAgICB9KTtcbiAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgZiA9IGZwcyAvICgobm93IC0gc3RhcnQpLzEwMDApO1xuICAgICAgICBmcHMgPSAwO1xuICAgICAgICBzdGFydCA9IG5vdztcbiAgICAgICAgZnBzRWxlbWVudC50ZXh0Q29udGVudCA9IGYudG9GaXhlZCgxKTtcbiAgICAgIH0sIDEwMDApO1xuXG4gICAgICBjb25zb2xlLmxvZyhcIlJQRyBHYW1lIDAuMS4xIEZseWluZyFcIik7XG4gICAgfVxuICB9O1xuXG4gIGxldCBHYW1lID0gd2luZG93LkdhbWUgPSBuZXcgR2FtZUNvcmUoKTtcblxuICAvLyB1bmRlciBub2RlLXdlYmtpdFxuICBpZiAod2luZG93LnJlcXVpcmUpIHtcbiAgICBHYW1lLmNvbmZpZy5zY2FsZSA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBHYW1lQm9vdHN0cmFwICgpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIEdhbWUuaW5pdCgpO1xuICAgICAgR2FtZS5JbnB1dC5pbml0KCk7XG4gICAgICBHYW1lLndpbmRvd3MubWFpbi5zaG93KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKEdhbWVCb290c3RyYXAoKSA9PSBmYWxzZSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIEdhbWVCb290c3RyYXAoKTtcbiAgICB9KTtcbiAgfVxuXG59KSgpO1xuIl19
