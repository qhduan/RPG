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

  Game.windows = {};

  var zIndex = 227;

  Game.Window = class GameWindow extends Sprite.Event {

    static clear () {
      var nodes = document.getElementsByClassName("GameWindowClass");
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.display = "none";
      }
    }

    whenPress (keys, callback) {
      Sprite.Input.whenPress(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
    }

    whenUp (keys, callback) {
      Sprite.Input.whenUp(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
    }

    whenDown (keys, callback) {
      Sprite.Input.whenDown(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
    }

    constructor (id) {
      super();
      this._id = id;
      this._css = null;
      this._index = -1;
      this._exec = {};

      this._html = document.createElement("div");
      this._html.id = this._id;
      this._html.classList.add("GameWindowClass");
      this._html.style.display = "none";
      document.body.appendChild(this._html);

      this._html.addEventListener("mousedown", (event) => {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (this._html.style.left) {
          let t = this._html.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (this._html.style.top) {
          let t = this._html.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (this._html.style.transform) {
          let t = this._html.style.transform.match(/scale\((\d+), (\d+)\)/);
          if (t) {
            scale = parseFloat(t[1]);
          }
        }

        if (typeof left == "number" && typeof top == "number" && typeof scale == "number") {
          x -= left;
          y -= top;
          x /= scale;
          y /= scale;
          this.emit("mousedown", false, {
            x: x,
            y: y
          });
        }
      });
    }

    register (name, callback) {
      this._exec[name] = callback;
    }

    execute () {
      var args = Array.prototype.slice.call(arguments);
      var name = args[0];
      args.splice(0, 1);
      this._exec[name].apply(this, args);
    }

    show () {
      if (this._html) {
        this.emit("beforeShow");
        this._index = zIndex;
        this._html.style.zIndex = this._index;
        this._html.style.display = "block";
        zIndex++;
        this.emit("afterShow");
      }
    }

    hide () {
      if (this._html) {
        this.emit("beforeHide");
        this._index = -1;
        this._html.style.zIndex = this._index;
        this._html.style.display = "none";
        this.emit("afterHide");
      }
    }

    get showing () {
      if (this._html && this._html.style.display != "none") {
        return true;
      }
      return false;
    }

    set showing (value) {
      throw new Error("Game.Window.showing readonly");
    }

    get atop () {
      var nodes = document.getElementsByClassName("GameWindowClass");
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].style.display != "none" && nodes[i].style.zIndex > this._index) {
          return false;
        }
      }
      return true;
    }

    set atop (value) {
      throw new Error("Game.Window.atop readonly");
    }

    html (html) {
      this._html.innerHTML = html;
    }

    clear () {
      this._html.innerHTML = "";
    }

    appendChild (domElement) {
      this._html.appendChild(domElement);
    }

    css (css) {
      if (this._css) {
        document.head.removeChild(this._css);
        this._css = null;
      }
      this._css = document.createElement("style");
      this._css.innerHTML = css;
      document.body.appendChild(this._css);
    }

    // 当窗口大小改变时改变游戏窗口大小
    static resize () {
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

        scale = Math.min(
          w / Game.config.width,
          h / Game.config.height
        );
      }

      // html窗口拉伸（css中控制了原始大小）
      var elements = document.getElementsByClassName("GameWindowClass");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.transformOrigin = "0 0 0";
        elements[i].style.transform = `scale(${scale}, ${scale})`;
        elements[i].style.left = `${leftMargin}px`;
        elements[i].style.top = `${topMargin}px`;
      }

      if (Game.hero) {
        Game.hero.focus();
      }

    };

  };

  Game.Window.resize();
  window.addEventListener("resize", function () {
    Game.Window.resize();
  });

}());
