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

import Sprite from "../Sprite/Sprite.js";
import Game from "./Base.js";

let internal = Sprite.Util.namespace();

/** 全部窗口 */
let windows = new Set();
/**窗口z-index，不断递增 */
let zIndex = 227;

let windowContainer = document.createElement("div");
windowContainer.style.width = `${Game.config.width}px`;
windowContainer.style.height = `${Game.config.height}px`;
windowContainer.style.position = `fixed`;
document.body.appendChild(windowContainer);

export default class Window extends Sprite.Event {

  /**
   *
   */
  static create (id, html) {
    let win = new Window(id, html)
    return win;
  }

  /**
   * @constructor
   */
  constructor (id, html) {
    super();

    let privates = internal(this);
    privates.id = id;
    privates.html = document.createElement("div");
    privates.index = -1;

    // 随机一个字符串作为dom的id
    privates.html.classList.add(id);
    privates.html.classList.add("game-window");
    privates.html.style.display = "none";
    privates.html.innerHTML = html;
    windowContainer.appendChild(privates.html);

    privates.html.addEventListener("mousedown", (event) => {
      let x = event.clientX;
      let y = event.clientY;

      let left = null;
      let top = null;
      let scale = null;

      if (windowContainer.style.left) {
        let t = windowContainer.style.left.match(/(\d+)px/);
        if (t) {
          left = parseInt(t[1]);
        }
      }

      if (windowContainer.style.top) {
        let t = windowContainer.style.top.match(/(\d+)px/);
        if (t) {
          top = parseInt(t[1]);
        }
      }

      if (windowContainer.style.transform) {
        let t = windowContainer.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
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
      privates.html.parentNode.removeChild(privates.html);
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
      this.emit("afterHide");
      this.emit("deactive");

      if (privates && privates.html) {
        privates.html.style.zIndex = privates.index;
        privates.html.style.display = "none";
      }

      for (let win of windows) {
        if (win.atop) {
          win.emit("active");
        }
      }
    }
    return this;
  }

  querySelector (selector) {
    return internal(this).html.querySelector(selector);
    // let privates = internal(this);
    // return document.querySelector(`#${privates.html.id} ${selector}`);
  }

  querySelectorAll (selector) {
    return internal(this).html.querySelectorAll(selector);
    // let privates = internal(this);
    // return document.querySelectorAll(`#${privates.html.id} ${selector}`);
  }

  get index () {
    return internal(this).index;
  }

  set index (value) {
    console.error(this);
    throw new Error("Window.index readonly");
  }

  get showing () {
    let privates = internal(this);
    if (privates.html && privates.html.style.display != "none") {
      return true;
    }
    return false;
  }

  set showing (value) {
    throw new Error("Window.showing readonly");
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
    throw new Error("Window.atop readonly");
  }

  appendChild (domElement) {
    internal(this).html.appendChild(domElement);
    return this;
  }

  removeChild (domElement) {
    internal(this).html.removeChild(domElement);
    return this;
  }
}

// 当窗口大小改变时改变游戏窗口大小
function GameWindowResize () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let scale = 1;
  let leftMargin = 0;
  let topMargin = 0;
  let mobile = false;

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
  }

  let style = windowContainer.style;
  style.left =                  `${leftMargin}px`;
  style.top =                   `${topMargin}px`;
  style.transformOrigin =       `left top 0`;
  style.webkitTransformOrigin = `left top 0`;
  style.transform =             `scale(${scale}, ${scale}) translateZ(0)`;
  style.webkitTransform =       `scale(${scale}, ${scale}) translateZ(0)`;
  style.filter =                `none`;
  style.webkitFilter =          `blur(0px)`;
}

GameWindowResize();
window.addEventListener("resize", () => {
  GameWindowResize();
});
