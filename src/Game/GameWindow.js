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

  let windows = {};

  Game.windows = windows;

  let zIndex = 227;

  Game.Window = class {
    static create (id) {
      let win = new GameWindow(id)
      windows[id] = win;
      return win;
    }

    static clear () {
      var nodes = document.getElementsByClassName("game-window");
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.display = "none";
      }
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

        scale = scale.toFixed(3);
      }

      // html窗口拉伸（css中控制了原始大小）
      var elements = document.getElementsByClassName("game-window");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.transformOrigin = "0 0 0";
        elements[i].style.transform = `scale(${scale}, ${scale})`;
        elements[i].style.left = `${leftMargin}px`;
        elements[i].style.top = `${topMargin}px`;
      }

      if (Game.hero) {
        Game.hero.focus();
      }

    }
  };

  Game.Window.resize();
  window.addEventListener("resize", function () {
    Game.Window.resize();
  });

  class GameWindow extends Sprite.Event {
    /**
     * @constructor
     */
    constructor (id) {
      super();

      let pp = internal(this);
      pp.id = id;
      pp.css = document.createElement("style");
      pp.html = document.createElement("div");
      pp.index = -1;
      pp.exec = {};

      pp.html.id = id + "Window";
      pp.html.classList.add("game-window");
      pp.html.style.display = "none";
      document.body.appendChild(pp.html);
      document.body.appendChild(pp.css)

      pp.html.addEventListener("mousedown", (event) => {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (pp.html.style.left) {
          let t = pp.html.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (pp.html.style.top) {
          let t = pp.html.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (pp.html.style.transform) {
          let t = pp.html.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
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

    whenPress (keys, callback) {
      Sprite.Input.whenPress(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
      return this;
    }

    whenUp (keys, callback) {
      Sprite.Input.whenUp(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
      return this;
    }

    whenDown (keys, callback) {
      Sprite.Input.whenDown(keys, (key) => {
        if (this.atop) {
          callback(key);
        }
      });
      return this;
    }

    register (name, callback) {
      internal(this).exec[name] = callback;
      return this;
    }

    execute (name) {
      let args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      internal(this).exec[name].apply(this, args);
      return this;
    }

    show () {
      if (this.showing == false && internal(this).html) {
        this.emit("beforeShow");

        for (let key in windows) {
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

    hide () {
      if (internal(this).html) {
        this.emit("beforeHide");
        internal(this).index = -1;
        internal(this).html.style.zIndex = this._index;
        internal(this).html.style.display = "none";
        this.emit("afterHide");
        this.emit("deactive");

        for (let key in windows) {
          if (windows[key].atop) {
            windows[key].emit("active");
          }
        }
      }
      return this;
    }

    get index () {
      return internal(this).index;
    }

    set index (value) {
      console.error(this);
      throw new Error("Game.Window.index readonly");
    }

    get showing () {
      if (internal(this).html && internal(this).html.style.display != "none") {
        return true;
      }
      return false;
    }

    set showing (value) {
      throw new Error("Game.Window.showing readonly");
    }

    get atop () {
      for (let key in windows) {
        if (windows[key].showing && windows[key].index > this.index) {
          return false;
        }
      }
      return true;
    }

    set atop (value) {
      throw new Error("Game.Window.atop readonly");
    }

    get html () {
      return internal(this).html.innerHTML;
    }

    set html (value) {
      internal(this).html.innerHTML = value;
    }

    get css () {
      return internal(this).css.innerHTML;
    }

    set css (value) {
      internal(this).css.innerHTML = value;
    }

    clear () {
      internal(this).html.innerHTML = "";
      return this;
    }

    appendChild (domElement) {
      internal(this).html.appendChild(domElement);
      return this;
    }

    removeChild (domElement) {
      internal(this).html.removeChild(domElement);
      return this;
    }

  };

}());
