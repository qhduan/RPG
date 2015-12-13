"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  /** 全部窗口 */
  var windows = new Set();
  /**窗口z-index，不断递增 */
  var zIndex = 227;

  var windowContainer = document.createElement("div");
  windowContainer.style.width = Game.config.width + "px";
  windowContainer.style.height = Game.config.height + "px";
  windowContainer.style.position = "fixed";
  document.body.appendChild(windowContainer);

  Game.assign("Window", (function (_Sprite$Event) {
    _inherits(GameWindow, _Sprite$Event);

    _createClass(GameWindow, null, [{
      key: "create",

      /**
       *
       */
      value: function create(id) {
        var win = new Game.Window(id);
        return win;
      }

      /**
       * @constructor
       */

    }]);

    function GameWindow(id) {
      _classCallCheck(this, GameWindow);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameWindow).call(this));

      var privates = internal(_this);
      privates.id = id;
      privates.css = document.createElement("style");
      privates.html = document.createElement("div");
      privates.index = -1;

      // 随机一个字符串作为dom的id
      privates.html.id = "GW" + Math.random().toString(16).substr(2);
      privates.html.classList.add(id);
      privates.html.classList.add("game-window");
      privates.html.style.display = "none";

      windowContainer.appendChild(privates.html);
      document.head.appendChild(privates.css);

      privates.html.addEventListener("mousedown", function (event) {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (windowContainer.style.left) {
          var t = windowContainer.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (windowContainer.style.top) {
          var t = windowContainer.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (windowContainer.style.transform) {
          var t = windowContainer.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
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

      windows.add(_this);
      return _this;
    }

    _createClass(GameWindow, [{
      key: "destroy",
      value: function destroy() {
        var privates = internal(this);
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
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
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
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
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

    var style = windowContainer.style;
    style.left = leftMargin + "px";
    style.top = topMargin + "px";
    style.transformOrigin = "left top 0";
    style.webkitTransformOrigin = "left top 0";
    style.transform = "scale(" + scale + ", " + scale + ") translateZ(0)";
    style.webkitTransform = "scale(" + scale + ", " + scale + ") translateZ(0)";
    style.filter = "none";
    style.webkitFilter = "blur(0px)";
  }

  GameWindowResize();
  window.addEventListener("resize", function () {
    GameWindowResize();
  });
})();
