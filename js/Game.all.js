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
//# sourceMappingURL=Game.js.map

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
//# sourceMappingURL=GameWindowArchive.js.map

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
//# sourceMappingURL=GameWindowBuy.js.map

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
//# sourceMappingURL=GameWindowChoice.js.map

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
//# sourceMappingURL=GameWindowConfirm.js.map

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
//# sourceMappingURL=GameWindowDialogue.js.map

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
//# sourceMappingURL=GameWindowInterface.js.map

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
//# sourceMappingURL=GameWindowInventory.js.map

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

  win.html = "\n    <table><tbody><tr><td>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </td></tr></tbody></table>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    .loadingWindow table, .loadingWindow tbody, .loadingWindow tr, .loadingWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .loadingWindow label {\n      padding: 50px;\n      padding-bottom: 100px;\n      border-radius:25px;\n      background-color: grey;\n      font-size: 60px;\n    }\n  ";

  var loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  var loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  var text = ["打开游戏菜单之后，游戏是暂停的", "记得带着矿工锄和采药铲，或许能从其中赚点小钱", "改变职业的成本会随着你的等级越来越高", "你的信仰决定了神对你的祝福，和某些人对你的看法", "信仰是可以改变的，但人们不喜欢这样的人", "没有信仰，也是一种信仰，但是你享受不到神的祝福"];

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
//# sourceMappingURL=GameWindowLoading.js.map

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
//# sourceMappingURL=GameWindowMain.js.map

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
//# sourceMappingURL=GameWindowMap.js.map

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
//# sourceMappingURL=GameWindowOver.js.map

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
//# sourceMappingURL=GameWindowPickup.js.map

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
//# sourceMappingURL=GameWindowQuest.js.map

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
//# sourceMappingURL=GameWindowRegister.js.map

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
//# sourceMappingURL=GameWindowSell.js.map

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
//# sourceMappingURL=GameWindowSetting.js.map

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
//# sourceMappingURL=GameWindowSkill.js.map

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
//# sourceMappingURL=GameWindowStatus.js.map

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
//# sourceMappingURL=GameWindowSysmenu.js.map

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
//# sourceMappingURL=GameAstar.js.map

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
//# sourceMappingURL=GameAI.js.map

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
//# sourceMappingURL=GameCollision.js.map

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
//# sourceMappingURL=GameUI.js.map

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
//# sourceMappingURL=GameArea.js.map

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

          // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
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
//# sourceMappingURL=GameMap.js.map

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
//# sourceMappingURL=GameQuest.js.map

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
//# sourceMappingURL=GameItem.js.map

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
//# sourceMappingURL=GameSkill.js.map

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
//# sourceMappingURL=GameActorAlly.js.map

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
//# sourceMappingURL=GameActorMonster.js.map

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
//# sourceMappingURL=GameActorNPC.js.map

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
//# sourceMappingURL=GameActorPet.js.map

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
//# sourceMappingURL=GameDrawHero.js.map

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
//# sourceMappingURL=GameInput.js.map

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
//# sourceMappingURL=GameRegister.js.map

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
//# sourceMappingURL=GameArchive.js.map
