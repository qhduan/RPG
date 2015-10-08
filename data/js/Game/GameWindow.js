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
          privates.html.parentNode.removeChild(privates.html);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLE1BQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXhCLE1BQUksTUFBTSxHQUFHLEdBQUcsQ0FBQzs7QUFFakIsTUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxpQkFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLE9BQUksQ0FBQztBQUN2RCxpQkFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLE9BQUksQ0FBQztBQUN6RCxpQkFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLFVBQVUsQ0FBQztBQUN6QyxVQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFM0MsTUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2NBQVEsVUFBVTs7aUJBQVYsVUFBVTs7Ozs7O2FBS3RCLGdCQUFDLEVBQUUsRUFBRTtBQUNqQixZQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDN0IsZUFBTyxHQUFHLENBQUM7T0FDWjs7Ozs7OztBQUtXLGFBYmMsVUFBVSxDQWF2QixFQUFFLEVBQUU7Ozs0QkFiUyxVQUFVOztBQWNsQyxpQ0Fkd0IsVUFBVSw2Q0FjMUI7O0FBRVIsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLGNBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGNBQVEsQ0FBQyxH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QUFLLENBQUM7QUFDbEMsU0FBSyxDQUFDLElBQUksR0FBdUIsVUFBVSxPQUFJLENBQUM7QUFDaEQsU0FBSyxDQUFDLEdBQUcsR0FBd0IsU0FBUyxPQUFJLENBQUM7QUFDL0MsU0FBSyxDQUFDLGVBQWUsZUFBcUIsQ0FBQztBQUMzQyxTQUFLLENBQUMscUJBQXFCLGVBQWUsQ0FBQztBQUMzQyxTQUFLLENBQUMsU0FBUyxjQUF3QixLQUFLLFVBQUssS0FBSyxvQkFBaUIsQ0FBQztBQUN4RSxTQUFLLENBQUMsZUFBZSxjQUFrQixLQUFLLFVBQUssS0FBSyxvQkFBaUIsQ0FBQztBQUN4RSxTQUFLLENBQUMsTUFBTSxTQUF3QixDQUFDO0FBQ3JDLFNBQUssQ0FBQyxZQUFZLGNBQXVCLENBQUM7R0FDM0M7O0FBRUQsa0JBQWdCLEVBQUUsQ0FBQztBQUNuQixRQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVk7QUFDNUMsb0JBQWdCLEVBQUUsQ0FBQztHQUNwQixDQUFDLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuICAvKiog5YWo6YOo56qX5Y+jICovXG4gIGxldCB3aW5kb3dzID0gbmV3IFNldCgpO1xuICAvKirnqpflj6N6LWluZGV477yM5LiN5pat6YCS5aKeICovXG4gIGxldCB6SW5kZXggPSAyMjc7XG5cbiAgbGV0IHdpbmRvd0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHdpbmRvd0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke0dhbWUuY29uZmlnLndpZHRofXB4YDtcbiAgd2luZG93Q29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke0dhbWUuY29uZmlnLmhlaWdodH1weGA7XG4gIHdpbmRvd0NvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IGBmaXhlZGA7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod2luZG93Q29udGFpbmVyKTtcblxuICBHYW1lLmFzc2lnbihcIldpbmRvd1wiLCBjbGFzcyBHYW1lV2luZG93IGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZSAoaWQpIHtcbiAgICAgIGxldCB3aW4gPSBuZXcgR2FtZS5XaW5kb3coaWQpXG4gICAgICByZXR1cm4gd2luO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChpZCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5pZCA9IGlkO1xuICAgICAgcHJpdmF0ZXMuY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgcHJpdmF0ZXMuaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwcml2YXRlcy5pbmRleCA9IC0xO1xuXG4gICAgICAvLyDpmo/mnLrkuIDkuKrlrZfnrKbkuLLkvZzkuLpkb23nmoRpZFxuICAgICAgcHJpdmF0ZXMuaHRtbC5pZCA9IFwiR1dcIiArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnN1YnN0cigyKTtcbiAgICAgIHByaXZhdGVzLmh0bWwuY2xhc3NMaXN0LmFkZChpZCk7XG4gICAgICBwcml2YXRlcy5odG1sLmNsYXNzTGlzdC5hZGQoXCJnYW1lLXdpbmRvd1wiKTtcbiAgICAgIHByaXZhdGVzLmh0bWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICB3aW5kb3dDb250YWluZXIuYXBwZW5kQ2hpbGQocHJpdmF0ZXMuaHRtbCk7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHByaXZhdGVzLmNzcyk7XG5cbiAgICAgIHByaXZhdGVzLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICBsZXQgeSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICAgICAgbGV0IGxlZnQgPSBudWxsO1xuICAgICAgICBsZXQgdG9wID0gbnVsbDtcbiAgICAgICAgbGV0IHNjYWxlID0gbnVsbDtcblxuICAgICAgICBpZiAod2luZG93Q29udGFpbmVyLnN0eWxlLmxlZnQpIHtcbiAgICAgICAgICBsZXQgdCA9IHdpbmRvd0NvbnRhaW5lci5zdHlsZS5sZWZ0Lm1hdGNoKC8oXFxkKylweC8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICBsZWZ0ID0gcGFyc2VJbnQodFsxXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpbmRvd0NvbnRhaW5lci5zdHlsZS50b3ApIHtcbiAgICAgICAgICBsZXQgdCA9IHdpbmRvd0NvbnRhaW5lci5zdHlsZS50b3AubWF0Y2goLyhcXGQrKXB4Lyk7XG4gICAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHRbMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5kb3dDb250YWluZXIuc3R5bGUudHJhbnNmb3JtKSB7XG4gICAgICAgICAgbGV0IHQgPSB3aW5kb3dDb250YWluZXIuc3R5bGUudHJhbnNmb3JtLm1hdGNoKC9zY2FsZVxcKChbXFxkXFwuXSspLCAoW1xcZFxcLl0rKVxcKS8pO1xuICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICBzY2FsZSA9IHBhcnNlRmxvYXQodFsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjYWxlID0gMS4wO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZSA9IDEuMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobGVmdCkgJiYgTnVtYmVyLmlzRmluaXRlKHRvcCkgJiYgTnVtYmVyLmlzRmluaXRlKHNjYWxlKSkge1xuICAgICAgICAgIHggLT0gbGVmdDtcbiAgICAgICAgICB5IC09IHRvcDtcbiAgICAgICAgICB4IC89IHNjYWxlO1xuICAgICAgICAgIHkgLz0gc2NhbGU7XG4gICAgICAgICAgdGhpcy5lbWl0KFwibW91c2Vkb3duXCIsIGZhbHNlLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgd2luZG93cy5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLnNob3dpbmcpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCkge1xuICAgICAgICBwcml2YXRlcy5odG1sLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocHJpdmF0ZXMuaHRtbCk7XG4gICAgICAgIHByaXZhdGVzLmh0bWwgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHByaXZhdGVzLmNzcykge1xuICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHByaXZhdGVzLmNzcyk7XG4gICAgICAgIHByaXZhdGVzLmNzcyA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAod2luZG93cy5oYXModGhpcykpIHtcbiAgICAgICAgd2luZG93cy5kZWxldGUodGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hlblByZXNzIChrZXlzLCBjYWxsYmFjaykge1xuICAgICAgU3ByaXRlLklucHV0LndoZW5QcmVzcyhrZXlzLCAoa2V5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmF0b3ApIHtcbiAgICAgICAgICBjYWxsYmFjayhrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdoZW5VcCAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIFNwcml0ZS5JbnB1dC53aGVuVXAoa2V5cywgKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdG9wKSB7XG4gICAgICAgICAgY2FsbGJhY2soa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3aGVuRG93biAoa2V5cywgY2FsbGJhY2spIHtcbiAgICAgIFNwcml0ZS5JbnB1dC53aGVuRG93bihrZXlzLCAoa2V5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmF0b3ApIHtcbiAgICAgICAgICBjYWxsYmFjayhrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFzc2lnbiAobmFtZSwgb2JqZWN0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogb2JqZWN0XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2hvdyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIEdhbWVXaW5kb3dSZXNpemUoKTtcbiAgICAgIGlmICh0aGlzLnNob3dpbmcgPT0gZmFsc2UgJiYgcHJpdmF0ZXMuaHRtbCkge1xuICAgICAgICB0aGlzLmVtaXQoXCJiZWZvcmVTaG93XCIpO1xuXG4gICAgICAgIGZvciAobGV0IHdpbiBvZiB3aW5kb3dzKSB7XG4gICAgICAgICAgaWYgKHdpbi5hdG9wKSB7XG4gICAgICAgICAgICB3aW4uZW1pdChcImRlYWN0aXZlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGVzLmluZGV4ID0gekluZGV4O1xuICAgICAgICBwcml2YXRlcy5odG1sLnN0eWxlLnpJbmRleCA9IHByaXZhdGVzLmluZGV4O1xuICAgICAgICBwcml2YXRlcy5odG1sLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHpJbmRleCsrO1xuICAgICAgICB0aGlzLmVtaXQoXCJhZnRlclNob3dcIik7XG4gICAgICAgIHRoaXMuZW1pdChcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuaHRtbCkge1xuICAgICAgICB0aGlzLmVtaXQoXCJiZWZvcmVIaWRlXCIpO1xuXG4gICAgICAgIHByaXZhdGVzLmluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMuZW1pdChcImFmdGVySGlkZVwiKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiZGVhY3RpdmVcIik7XG5cbiAgICAgICAgaWYgKHByaXZhdGVzICYmIHByaXZhdGVzLmh0bWwpIHtcbiAgICAgICAgICBwcml2YXRlcy5odG1sLnN0eWxlLnpJbmRleCA9IHByaXZhdGVzLmluZGV4O1xuICAgICAgICAgIHByaXZhdGVzLmh0bWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgd2luIG9mIHdpbmRvd3MpIHtcbiAgICAgICAgICBpZiAod2luLmF0b3ApIHtcbiAgICAgICAgICAgIHdpbi5lbWl0KFwiYWN0aXZlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcXVlcnlTZWxlY3RvciAoc2VsZWN0b3IpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3ByaXZhdGVzLmh0bWwuaWR9ICR7c2VsZWN0b3J9YCk7XG4gICAgfVxuXG4gICAgcXVlcnlTZWxlY3RvckFsbCAoc2VsZWN0b3IpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3ByaXZhdGVzLmh0bWwuaWR9ICR7c2VsZWN0b3J9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmluZGV4O1xuICAgIH1cblxuICAgIHNldCBpbmRleCAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lLldpbmRvdy5pbmRleCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgc2hvd2luZyAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlcy5odG1sICYmIHByaXZhdGVzLmh0bWwuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXQgc2hvd2luZyAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWUuV2luZG93LnNob3dpbmcgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgZ2V0IGF0b3AgKCkge1xuICAgICAgZm9yIChsZXQgd2luIG9mIHdpbmRvd3MpIHtcbiAgICAgICAgaWYgKHdpbi5zaG93aW5nICYmIHdpbi5pbmRleCA+IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNldCBhdG9wICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZS5XaW5kb3cuYXRvcCByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBnZXQgaHRtbCAoKSB7XG4gICAgICByZXR1cm4gaW50ZXJuYWwodGhpcykuaHRtbC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgc2V0IGh0bWwgKHZhbHVlKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5odG1sLmlubmVySFRNTCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBjc3MgKCkge1xuICAgICAgcmV0dXJuIGludGVybmFsKHRoaXMpLmNzcy5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgc2V0IGNzcyAodmFsdWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmNzcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBhcHBlbmRDaGlsZCAoZG9tRWxlbWVudCkge1xuICAgICAgaW50ZXJuYWwodGhpcykuaHRtbC5hcHBlbmRDaGlsZChkb21FbGVtZW50KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZUNoaWxkIChkb21FbGVtZW50KSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5odG1sLnJlbW92ZUNoaWxkKGRvbUVsZW1lbnQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxuICAvLyDlvZPnqpflj6PlpKflsI/mlLnlj5jml7bmlLnlj5jmuLjmiI/nqpflj6PlpKflsI9cbiAgZnVuY3Rpb24gR2FtZVdpbmRvd1Jlc2l6ZSAoKSB7XG4gICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBsZXQgc2NhbGUgPSAxO1xuICAgIGxldCBsZWZ0TWFyZ2luID0gMDtcbiAgICBsZXQgdG9wTWFyZ2luID0gMDtcbiAgICBsZXQgbW9iaWxlID0gZmFsc2U7XG5cbiAgICBpZiAoR2FtZS5jb25maWcuc2NhbGUgPT0gZmFsc2UpIHtcbiAgICAgIC8vIOS4jeaLieS8uOa4uOaIj+eql+WPo++8jOaMieWOn+Wni+Wkp+Wwj+iuoeeul+eql+WPo+WxheS4rVxuICAgICAgbGVmdE1hcmdpbiA9IE1hdGguZmxvb3IoKHdpZHRoIC0gR2FtZS5jb25maWcud2lkdGgpIC8gMik7XG4gICAgICB0b3BNYXJnaW4gPSBNYXRoLmZsb29yKChoZWlnaHQgLSBHYW1lLmNvbmZpZy5oZWlnaHQpIC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOaLieS8uOa4uOaIj+eql+WPo++8jOmmluWFiOiuoeeul+a4uOaIj+WOn+Wni+Wkp+Wwj+avlOS+i1xuICAgICAgbGV0IHJhdGlvID0gR2FtZS5jb25maWcud2lkdGggLyBHYW1lLmNvbmZpZy5oZWlnaHQ7XG4gICAgICAvLyB3aWR0aCBmaXJzdFxuICAgICAgbGV0IHcgPSB3aWR0aDtcbiAgICAgIGxldCBoID0gdyAvIHJhdGlvO1xuICAgICAgLy8gdGhlbiBoZWlnaHRcbiAgICAgIGlmIChoID4gaGVpZ2h0KSB7XG4gICAgICAgIGggPSBoZWlnaHQ7XG4gICAgICAgIHcgPSBoICogcmF0aW87XG4gICAgICB9XG5cbiAgICAgIHcgPSBNYXRoLmZsb29yKHcpO1xuICAgICAgaCA9IE1hdGguZmxvb3IoaCk7XG4gICAgICBsZWZ0TWFyZ2luID0gTWF0aC5mbG9vcigod2lkdGggLSB3KSAvIDIpO1xuICAgICAgdG9wTWFyZ2luID0gTWF0aC5mbG9vcigoaGVpZ2h0IC0gaCkgLyAyKTtcblxuICAgICAgc2NhbGUgPSBNYXRoLm1pbihcbiAgICAgICAgdyAvIEdhbWUuY29uZmlnLndpZHRoLFxuICAgICAgICBoIC8gR2FtZS5jb25maWcuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBzdHlsZSA9IHdpbmRvd0NvbnRhaW5lci5zdHlsZTtcbiAgICBzdHlsZS5sZWZ0ID0gICAgICAgICAgICAgICAgICBgJHtsZWZ0TWFyZ2lufXB4YDtcbiAgICBzdHlsZS50b3AgPSAgICAgICAgICAgICAgICAgICBgJHt0b3BNYXJnaW59cHhgO1xuICAgIHN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICAgICAgIGBsZWZ0IHRvcCAwYDtcbiAgICBzdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4gPSBgbGVmdCB0b3AgMGA7XG4gICAgc3R5bGUudHJhbnNmb3JtID0gICAgICAgICAgICAgYHNjYWxlKCR7c2NhbGV9LCAke3NjYWxlfSkgdHJhbnNsYXRlWigwKWA7XG4gICAgc3R5bGUud2Via2l0VHJhbnNmb3JtID0gICAgICAgYHNjYWxlKCR7c2NhbGV9LCAke3NjYWxlfSkgdHJhbnNsYXRlWigwKWA7XG4gICAgc3R5bGUuZmlsdGVyID0gICAgICAgICAgICAgICAgYG5vbmVgO1xuICAgIHN0eWxlLndlYmtpdEZpbHRlciA9ICAgICAgICAgIGBibHVyKDBweClgO1xuICB9XG5cbiAgR2FtZVdpbmRvd1Jlc2l6ZSgpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgR2FtZVdpbmRvd1Jlc2l6ZSgpO1xuICB9KTtcblxufSkoKTtcbiJdfQ==
