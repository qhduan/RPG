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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLE1BQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXhCLE1BQUksTUFBTSxHQUFHLEdBQUcsQ0FBQzs7QUFFakIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2NBQVEsVUFBVTs7aUJBQVYsVUFBVTs7YUFDdEIsZ0JBQUMsRUFBRSxFQUFFO0FBQ2pCLFlBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM3QixlQUFPLEdBQUcsQ0FBQztPQUNaOzs7Ozs7O0FBS1csYUFUYyxVQUFVLENBU3ZCLEVBQUUsRUFBRTs7OzRCQVRTLFVBQVU7O0FBVWxDLGlDQVZ3QixVQUFVLDZDQVUxQjs7QUFFUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLGNBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxjQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzs7QUFHcEIsY0FBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELGNBQVEsQ0FBQyxJQUFJLENBQUMsU0FB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ZSI6IkdhbWVXaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG4gIC8qKiDlhajpg6jnqpflj6MgKi9cbiAgbGV0IHdpbmRvd3MgPSBuZXcgU2V0KCk7XG4gIC8qKueql+WPo3otaW5kZXjvvIzkuI3mlq3pgJLlop4gKi9cbiAgbGV0IHpJbmRleCA9IDIyNztcblxuICBHYW1lLmFzc2lnbihcIldpbmRvd1wiLCBjbGFzcyBHYW1lV2luZG93IGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcbiAgICBzdGF0aWMgY3JlYXRlIChpZCkge1xuICAgICAgbGV0IHdpbiA9IG5ldyBHYW1lLldpbmRvdyhpZClcbiAgICAgIHJldHVybiB3aW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGlkKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmlkID0gaWQ7XG4gICAgICBwcml2YXRlcy5jc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICBwcml2YXRlcy5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHByaXZhdGVzLmluZGV4ID0gLTE7XG5cbiAgICAgIC8vIOmaj+acuuS4gOS4quWtl+espuS4suS9nOS4umRvbeeahGlkXG4gICAgICBwcml2YXRlcy5odG1sLmlkID0gXCJHV1wiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc3Vic3RyKDIpO1xuICAgICAgcHJpdmF0ZXMuaHRtbC5jbGFzc0xpc3QuYWRkKGlkKTtcbiAgICAgIHByaXZhdGVzLmh0bWwuY2xhc3NMaXN0LmFkZChcImdhbWUtd2luZG93XCIpO1xuICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByaXZhdGVzLmh0bWwpO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChwcml2YXRlcy5jc3MpXG5cbiAgICAgIHByaXZhdGVzLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICBsZXQgeSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICAgICAgbGV0IGxlZnQgPSBudWxsO1xuICAgICAgICBsZXQgdG9wID0gbnVsbDtcbiAgICAgICAgbGV0IHNjYWxlID0gbnVsbDtcblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS5sZWZ0KSB7XG4gICAgICAgICAgbGV0IHQgPSBwcml2YXRlcy5odG1sLnN0eWxlLmxlZnQubWF0Y2goLyhcXGQrKXB4Lyk7XG4gICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIGxlZnQgPSBwYXJzZUludCh0WzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS50b3ApIHtcbiAgICAgICAgICBsZXQgdCA9IHByaXZhdGVzLmh0bWwuc3R5bGUudG9wLm1hdGNoKC8oXFxkKylweC8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICB0b3AgPSBwYXJzZUludCh0WzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpdmF0ZXMuaHRtbC5zdHlsZS50cmFuc2Zvcm0pIHtcbiAgICAgICAgICBsZXQgdCA9IHByaXZhdGVzLmh0bWwuc3R5bGUudHJhbnNmb3JtLm1hdGNoKC9zY2FsZVxcKChbXFxkXFwuXSspLCAoW1xcZFxcLl0rKVxcKS8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICBzY2FsZSA9IHBhcnNlRmxvYXQodFsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjYWxlID0gMS4wO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZSA9IDEuMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobGVmdCkgJiYgTnVtYmVyLmlzRmluaXRlKHRvcCkgJiYgTnVtYmVyLmlzRmluaXRlKHNjYWxlKSkge1xuICAgICAgICAgIHggLT0gbGVmdDtcbiAgICAgICAgICB5IC09IHRvcDtcbiAgICAgICAgICB4IC89IHNjYWxlO1xuICAgICAgICAgIHkgLz0gc2NhbGU7XG4gICAgICAgICAgdGhpcy5lbWl0KFwibW91c2Vkb3duXCIsIGZhbHNlLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgd2luZG93cy5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLnNob3dpbmcpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHByaXZhdGVzLmh0bWwpO1xuICAgICAgICBwcml2YXRlcy5odG1sID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChwcml2YXRlcy5jc3MpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChwcml2YXRlcy5jc3MpO1xuICAgICAgICBwcml2YXRlcy5jc3MgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvd3MuaGFzKHRoaXMpKSB7XG4gICAgICAgIHdpbmRvd3MuZGVsZXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoZW5QcmVzcyAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIFNwcml0ZS5JbnB1dC53aGVuUHJlc3Moa2V5cywgKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdG9wKSB7XG4gICAgICAgICAgY2FsbGJhY2soa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3aGVuVXAgKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBTcHJpdGUuSW5wdXQud2hlblVwKGtleXMsIChrZXkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXRvcCkge1xuICAgICAgICAgIGNhbGxiYWNrKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2hlbkRvd24gKGtleXMsIGNhbGxiYWNrKSB7XG4gICAgICBTcHJpdGUuSW5wdXQud2hlbkRvd24oa2V5cywgKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdG9wKSB7XG4gICAgICAgICAgY2FsbGJhY2soa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc3NpZ24gKG5hbWUsIG9iamVjdCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG9iamVjdFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNob3cgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBHYW1lV2luZG93UmVzaXplKCk7XG4gICAgICBpZiAodGhpcy5zaG93aW5nID09IGZhbHNlICYmIHByaXZhdGVzLmh0bWwpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwiYmVmb3JlU2hvd1wiKTtcblxuICAgICAgICBmb3IgKGxldCB3aW4gb2Ygd2luZG93cykge1xuICAgICAgICAgIGlmICh3aW4uYXRvcCkge1xuICAgICAgICAgICAgd2luLmVtaXQoXCJkZWFjdGl2ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlcy5pbmRleCA9IHpJbmRleDtcbiAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS56SW5kZXggPSBwcml2YXRlcy5pbmRleDtcbiAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB6SW5kZXgrKztcbiAgICAgICAgdGhpcy5lbWl0KFwiYWZ0ZXJTaG93XCIpO1xuICAgICAgICB0aGlzLmVtaXQoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmh0bWwpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwiYmVmb3JlSGlkZVwiKTtcblxuICAgICAgICBwcml2YXRlcy5pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLmVtaXQoXCJhZnRlckhpZGVcIik7XG4gICAgICAgIHRoaXMuZW1pdChcImRlYWN0aXZlXCIpO1xuXG4gICAgICAgIGlmIChwcml2YXRlcyAmJiBwcml2YXRlcy5odG1sKSB7XG4gICAgICAgICAgcHJpdmF0ZXMuaHRtbC5zdHlsZS56SW5kZXggPSBwcml2YXRlcy5pbmRleDtcbiAgICAgICAgICBwcml2YXRlcy5odG1sLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICAgICAgaWYgKHdpbi5hdG9wKSB7XG4gICAgICAgICAgICB3aW4uZW1pdChcImFjdGl2ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHF1ZXJ5U2VsZWN0b3IgKHNlbGVjdG9yKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtwcml2YXRlcy5odG1sLmlkfSAke3NlbGVjdG9yfWApO1xuICAgIH1cblxuICAgIHF1ZXJ5U2VsZWN0b3JBbGwgKHNlbGVjdG9yKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtwcml2YXRlcy5odG1sLmlkfSAke3NlbGVjdG9yfWApO1xuICAgIH1cblxuICAgIGdldCBpbmRleCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5pbmRleDtcbiAgICB9XG5cbiAgICBzZXQgaW5kZXggKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5XaW5kb3cuaW5kZXggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dpbmcgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCAmJiBwcml2YXRlcy5odG1sLnN0eWxlLmRpc3BsYXkgIT0gXCJub25lXCIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0IHNob3dpbmcgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLldpbmRvdy5zaG93aW5nIHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIGdldCBhdG9wICgpIHtcbiAgICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICAgIGlmICh3aW4uc2hvd2luZyAmJiB3aW4uaW5kZXggPiB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzZXQgYXRvcCAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuV2luZG93LmF0b3AgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGh0bWwgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmh0bWwuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldCBodG1sICh2YWx1ZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaHRtbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgY3NzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jc3MuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldCBjc3MgKHZhbHVlKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5jc3MuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgfVxuXG4gICAgYXBwZW5kQ2hpbGQgKGRvbUVsZW1lbnQpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmh0bWwuYXBwZW5kQ2hpbGQoZG9tRWxlbWVudCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmVDaGlsZCAoZG9tRWxlbWVudCkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaHRtbC5yZW1vdmVDaGlsZChkb21FbGVtZW50KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8g5b2T56qX5Y+j5aSn5bCP5pS55Y+Y5pe25pS55Y+Y5ri45oiP56qX5Y+j5aSn5bCPXG4gIGZ1bmN0aW9uIEdhbWVXaW5kb3dSZXNpemUgKCkge1xuICAgIGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHNjYWxlID0gMTtcbiAgICBsZXQgbGVmdE1hcmdpbiA9IDA7XG4gICAgbGV0IHRvcE1hcmdpbiA9IDA7XG4gICAgbGV0IG1vYmlsZSA9IGZhbHNlO1xuXG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWR8aVBob25lfGlQb2R8QW5kcm9pZHxCbGFja0JlcnJ5fHdlYk9TfElFTW9iaWxlfE9wZXJhIE1pbmkvaSkpIHtcbiAgICAgIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgICBsZXQgdCA9IHdpZHRoO1xuICAgICAgICB3aWR0aCA9IGhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gdDtcbiAgICAgICAgbW9iaWxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoR2FtZS5jb25maWcuc2NhbGUgPT0gZmFsc2UpIHtcbiAgICAgIC8vIOS4jeaLieS8uOa4uOaIj+eql+WPo++8jOaMieWOn+Wni+Wkp+Wwj+iuoeeul+eql+WPo+WxheS4rVxuICAgICAgbGVmdE1hcmdpbiA9IE1hdGguZmxvb3IoKHdpZHRoIC0gR2FtZS5jb25maWcud2lkdGgpIC8gMik7XG4gICAgICB0b3BNYXJnaW4gPSBNYXRoLmZsb29yKChoZWlnaHQgLSBHYW1lLmNvbmZpZy5oZWlnaHQpIC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOaLieS8uOa4uOaIj+eql+WPo++8jOmmluWFiOiuoeeul+a4uOaIj+WOn+Wni+Wkp+Wwj+avlOS+i1xuICAgICAgbGV0IHJhdGlvID0gR2FtZS5jb25maWcud2lkdGggLyBHYW1lLmNvbmZpZy5oZWlnaHQ7XG4gICAgICAvLyB3aWR0aCBmaXJzdFxuICAgICAgbGV0IHcgPSB3aWR0aDtcbiAgICAgIGxldCBoID0gdyAvIHJhdGlvO1xuICAgICAgLy8gdGhlbiBoZWlnaHRcbiAgICAgIGlmIChoID4gaGVpZ2h0KSB7XG4gICAgICAgIGggPSBoZWlnaHQ7XG4gICAgICAgIHcgPSBoICogcmF0aW87XG4gICAgICB9XG5cbiAgICAgIHcgPSBNYXRoLmZsb29yKHcpO1xuICAgICAgaCA9IE1hdGguZmxvb3IoaCk7XG4gICAgICBsZWZ0TWFyZ2luID0gTWF0aC5mbG9vcigod2lkdGggLSB3KSAvIDIpO1xuICAgICAgdG9wTWFyZ2luID0gTWF0aC5mbG9vcigoaGVpZ2h0IC0gaCkgLyAyKTtcblxuICAgICAgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgdyAvIEdhbWUuY29uZmlnLndpZHRoLFxuICAgICAgICBoIC8gR2FtZS5jb25maWcuaGVpZ2h0XG4gICAgICApO1xuXG4gICAgICAvLyBzY2FsZSA9IHNjYWxlLnRvRml4ZWQoMyk7XG4gICAgfVxuXG4gICAgLy8gaHRtbOeql+WPo+aLieS8uO+8iGNzc+S4reaOp+WItuS6huWOn+Wni+Wkp+Wwj++8iVxuICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUubGVmdCA9IGAke2xlZnRNYXJnaW59cHhgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLnRvcCA9IGAke3RvcE1hcmdpbn1weGA7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gXCIwIDAgMFwiO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZX0pIHRyYW5zbGF0ZVooMClgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZX0pIHRyYW5zbGF0ZVooMClgO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLmZpbHRlciA9IFwibm9uZVwiO1xuICAgICAgaW50ZXJuYWwod2luKS5odG1sLnN0eWxlLndlYmtpdEZpbHRlciA9IFwiYmx1cigwcHgpXCI7XG4gICAgICBpbnRlcm5hbCh3aW4pLmh0bWwuc3R5bGUubW96RmlsdGVyID0gXCJibHVyKDBweClcIjtcbiAgICAgIGludGVybmFsKHdpbikuaHRtbC5zdHlsZS5tc0ZpbHRlciA9IFwiYmx1cigwcHgpXCI7XG5cbiAgICB9XG5cbiAgICBpZiAoR2FtZS5oZXJvKSB7XG4gICAgICBHYW1lLmhlcm8uZm9jdXMoKTtcbiAgICB9XG5cbiAgfVxuXG4gIEdhbWVXaW5kb3dSZXNpemUoKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xuICAgIEdhbWVXaW5kb3dSZXNpemUoKTtcbiAgfSk7XG5cbn0pKCk7XG4iXX0=
