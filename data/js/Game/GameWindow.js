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

  Game.windows = {};

  var zIndex = 227;

  Game.Window = (function (_Sprite$Event) {
    _inherits(GameWindow, _Sprite$Event);

    _createClass(GameWindow, null, [{
      key: "clear",
      value: function clear() {
        var nodes = document.getElementsByClassName("GameWindowClass");
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].style.display = "none";
        }
      }
    }]);

    function GameWindow(id) {
      _classCallCheck(this, GameWindow);

      _get(Object.getPrototypeOf(GameWindow.prototype), "constructor", this).call(this);
      this._id = id;
      this._html = null;
      this._css = null;
      this._exec = {};
    }

    _createClass(GameWindow, [{
      key: "register",
      value: function register(name, callback) {
        this._exec[name] = callback;
      }
    }, {
      key: "execute",
      value: function execute() {
        var args = Array.prototype.slice.call(arguments);
        var name = args[0];
        args.splice(0, 1);
        this._exec[name].apply(this, args);
      }
    }, {
      key: "show",
      value: function show() {
        if (this._html) {
          this.emit("beforeShow");
          this._html.style.zIndex = zIndex;
          this._html.style.display = "block";
          zIndex++;
          this.emit("afterShow");
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        if (this._html) {
          this.emit("beforeHide");
          this._html.style.display = "none";
          this.emit("afterHide");
        }
      }
    }, {
      key: "showing",
      value: function showing() {
        if (this._html && this._html.style.display != "none") {
          return true;
        }
        return false;
      }
    }, {
      key: "only",
      value: function only() {
        var nodes = document.getElementsByClassName("GameWindowClass");
        var showing = 0;
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].style.display != "none") {
            showing++;
          }
        }
        if (showing == 1 && this.showing()) {
          return true;
        }
        return false;
      }
    }, {
      key: "html",
      value: function html(_html) {
        if (this._html) {
          document.body.removeChild(this._html);
          this._html = null;
        }
        this._html = document.createElement("div");
        this._html.id = this._id;
        this._html.innerHTML = _html;
        this._html.classList.add("GameWindowClass");
        this._html.style.display = "none";
        document.body.appendChild(this._html);
      }
    }, {
      key: "css",
      value: function css(_css) {
        if (this._css) {
          document.head.removeChild(this._css);
          this._css = null;
        }
        this._css = document.createElement("style");
        this._css.innerHTML = _css;
        document.body.appendChild(this._css);
      }

      // 当窗口大小改变时改变游戏窗口大小
    }], [{
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
        }

        // html窗口拉伸（css中控制了原始大小）
        var elements = document.getElementsByClassName("GameWindowClass");
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.transformOrigin = "0 0 0";
          // elements[i].style.transform = `scale(${scale}, ${scale})`;
          elements[i].style.transform = "scale3d(" + scale + ", " + scale + ", 1.0)";
          elements[i].style.left = leftMargin + "px";
          elements[i].style.top = topMargin + "px";
        }

        // 游戏画布拉伸
        if (Game.stage && Game.stage.canvas) {
          Game.stage.canvas.style.transformOrigin = "0 0 0";
          // Game.stage.canvas.style.transform = `scale(${scale}, ${scale})`;
          Game.stage.canvas.style.transform = "scale3d(" + scale + ", " + scale + ", 1.0)";
          Game.stage.canvas.style.left = leftMargin + "px";
          Game.stage.canvas.style.top = topMargin + "px";
        }

        if (Game.hero) {
          Game.hero.focus();
        }
      }
    }]);

    return GameWindow;
  })(Sprite.Event);

  Game.Window.resize();
  window.addEventListener("resize", function () {
    Game.Window.resize();
  });
})();
//# sourceMappingURL=GameWindow.js.map
