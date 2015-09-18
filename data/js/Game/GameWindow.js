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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  var windows = {};
  Game.windows = windows;

  var zIndex = 227;

  Game.Window = (function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
      key: "create",
      value: function create(id) {
        var win = new GameWindow(id);
        windows[id] = win;
        return win;
      }
    }, {
      key: "clear",
      value: function clear() {
        var nodes = document.getElementsByClassName("game-window");
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].style.display = "none";
        }
      }

      // 当窗口大小改变时改变游戏窗口大小
    }, {
      key: "resize",
      value: function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var scale = 1;
        var leftMargin = 0;
        var topMargin = 0;

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

          scale = scale.toFixed(3);
        }

        // html窗口拉伸（css中控制了原始大小）
        var elements = document.getElementsByClassName("game-window");
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.transformOrigin = "0 0 0";
          elements[i].style.transform = "scale(" + scale + ", " + scale + ")";
          elements[i].style.left = leftMargin + "px";
          elements[i].style.top = topMargin + "px";
        }

        if (Game.hero) {
          Game.hero.focus();
        }
      }
    }]);

    return _class;
  })();

  Game.Window.resize();
  window.addEventListener("resize", function () {
    Game.Window.resize();
  });

  var GameWindow = (function (_Sprite$Event) {
    _inherits(GameWindow, _Sprite$Event);

    /**
     * @constructor
     */

    function GameWindow(id) {
      var _this = this;

      _classCallCheck(this, GameWindow);

      _get(Object.getPrototypeOf(GameWindow.prototype), "constructor", this).call(this);

      var pp = internal(this);
      pp.id = id;
      pp.css = document.createElement("style");
      pp.html = document.createElement("div");
      pp.index = -1;

      pp.html.id = id + "Window";
      pp.html.classList.add("game-window");
      pp.html.style.display = "none";
      document.body.appendChild(pp.html);
      document.body.appendChild(pp.css);

      pp.html.addEventListener("mousedown", function (event) {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (pp.html.style.left) {
          var t = pp.html.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (pp.html.style.top) {
          var t = pp.html.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (pp.html.style.transform) {
          var t = pp.html.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
          if (t) {
            scale = parseFloat(t[1]);
          }
        }

        if (typeof left == "number" && typeof top == "number" && typeof scale == "number") {
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
    }

    _createClass(GameWindow, [{
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
      key: "register",
      value: function register(name, object) {
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
        if (this.showing == false && internal(this).html) {
          this.emit("beforeShow");

          for (var key in windows) {
            if (windows[key].atop) {
              windows[key].emit("deactive");
            }
          }

          internal(this).index = zIndex;
          internal(this).html.style.zIndex = internal(this).index;
          internal(this).html.style.display = "block";
          zIndex++;
          this.emit("afterShow");
          this.emit("active");
        }
        return this;
      }
    }, {
      key: "hide",
      value: function hide() {
        if (internal(this).html) {
          this.emit("beforeHide");
          internal(this).index = -1;
          internal(this).html.style.zIndex = this._index;
          internal(this).html.style.display = "none";
          this.emit("afterHide");
          this.emit("deactive");

          for (var key in windows) {
            if (windows[key].atop) {
              windows[key].emit("active");
            }
          }
        }
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        internal(this).html.innerHTML = "";
        return this;
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
        return internal(this).index;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Window.index readonly");
      }
    }, {
      key: "showing",
      get: function get() {
        if (internal(this).html && internal(this).html.style.display != "none") {
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
        for (var key in windows) {
          if (windows[key].showing && windows[key].index > this.index) {
            return false;
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
  })(Sprite.Event);

  ;
})();
//# sourceMappingURL=GameWindow.js.map
