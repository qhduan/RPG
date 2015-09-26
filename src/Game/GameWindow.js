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
  /** 全部窗口 */
  let windows = new Set();
  /**窗口z-index，不断递增 */
  let zIndex = 227;

  Game.assign("Window", class GameWindow extends Sprite.Event {
    static create (id) {
      let win = new Game.Window(id)
      return win;
    }

    /**
     * @constructor
     */
    constructor (id) {
      super();

      let privates = internal(this);
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
      document.head.appendChild(privates.css)

      privates.html.addEventListener("mousedown", (event) => {
        let x = event.clientX;
        let y = event.clientY;

        let left = null;
        let top = null;
        let scale = null;

        if (privates.html.style.left) {
          let t = privates.html.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (privates.html.style.top) {
          let t = privates.html.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (privates.html.style.transform) {
          let t = privates.html.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
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
          this.emit("mousedown", false, {
            x: x,
            y: y
          });
        }
      });

      windows.add(this);
    }

    destroy () {
      let privates = internal(this);
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
        windows.delete(this);
      }
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

    assign (name, object) {
      Object.defineProperty(this, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: object
      });

      return this;
    }

    show () {
      let privates = internal(this);
      GameWindowResize();
      if (this.showing == false && privates.html) {
        this.emit("beforeShow");

        for (let win of windows) {
          if (win.atop) {
            win.emit("deactive");
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

    hide () {
      let privates = internal(this);
      if (privates.html) {
        this.emit("beforeHide");
        privates.index = -1;
        privates.html.style.zIndex = privates.index;
        privates.html.style.display = "none";
        this.emit("afterHide");
        this.emit("deactive");

        for (let win of windows) {
          if (win.atop) {
            win.emit("active");
          }
        }
      }
      return this;
    }

    querySelector (selector) {
      let privates = internal(this);
      return document.querySelector(`#${privates.html.id} ${selector}`);
    }

    querySelectorAll (selector) {
      let privates = internal(this);
      return document.querySelectorAll(`#${privates.html.id} ${selector}`);
    }

    get index () {
      let privates = internal(this);
      return privates.index;
    }

    set index (value) {
      console.error(this);
      throw new Error("Game.Window.index readonly");
    }

    get showing () {
      let privates = internal(this);
      if (privates.html && privates.html.style.display != "none") {
        return true;
      }
      return false;
    }

    set showing (value) {
      throw new Error("Game.Window.showing readonly");
    }

    get atop () {
      for (let win of windows) {
        if (win.showing && win.index > this.index) {
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

    appendChild (domElement) {
      internal(this).html.appendChild(domElement);
      return this;
    }

    removeChild (domElement) {
      internal(this).html.removeChild(domElement);
      return this;
    }
  });

  // 当窗口大小改变时改变游戏窗口大小
  function GameWindowResize () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let leftMargin = 0;
    let topMargin = 0;
    let mobile = false;

    if (navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS|IEMobile|Opera Mini/i)) {
      if (width < height) {
        let t = width;
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
      let ratio = Game.config.width / Game.config.height;
      // width first
      let w = width;
      let h = w / ratio;
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

      // scale = scale.toFixed(3);
    }

    // html窗口拉伸（css中控制了原始大小）
    for (let win of windows) {
      internal(win).html.style.transformOrigin = "0 0 0";
      internal(win).html.style.left = `${leftMargin}px`;
      internal(win).html.style.top = `${topMargin}px`;

      if (scale > 1.01 || scale < 0.99) {
        internal(win).html.style.transform = `scale(${scale}, ${scale}) translateZ(0)`;
        internal(win).html.style.webkitTransform = `scale(${scale}, ${scale}) translateZ(0)`;
        internal(win).html.style.filter = "none";
        internal(win).html.style.webkitFilter = "blur(0px)";
        internal(win).html.style.mozFilter = "blur(0px)";
        internal(win).html.style.msFilter = "blur(0px)";
      } else {
        internal(win).html.style.transform = "";
        //internal(win).html.style.webkitTransform = "";
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
