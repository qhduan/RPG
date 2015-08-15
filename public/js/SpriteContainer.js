
/// @file SpriteContainer.js
/// @namespace Sprite
/// class Sprite.Container

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

  "use strict";

  /// @class Sprite.Container
  /// inherit the Sprite.Display
  Sprite.Container = (function (_Sprite$Display) {
    _inherits(Container, _Sprite$Display);

    /// @function Sprite.Container.constructor
    /// construct a Sprite.Container object

    function Container() {
      _classCallCheck(this, Container);

      _get(Object.getPrototypeOf(Container.prototype), "constructor", this).call(this);
      this._children = [];
    }

    _createClass(Container, [{
      key: "cache",

      /// @function Sprite.Container.cache
      /// make a cache canvas of container
      value: function cache(x, y, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        this.draw(context);
        this._cacheCanvas = canvas;
      }

      /// @function Sprite.Container.hitTest
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this._cacheCanvas) {
          return _get(Object.getPrototypeOf(Container.prototype), "hitTest", this).call(this, x, y);
        } else {
          var hitted = [];
          for (var i = 0; i < this.children.length; i++) {
            var ret = this.children[i].hitTest(x, y);
            if (ret instanceof Array) {
              hitted = hitted.concat(ret);
            } else if (ret === true) {
              hitted.push(this.children[i]);
            }
          }
          return hitted;
        }
      }

      /// @function Sprite.Container.draw
      /// draw all children in this container on context
      /// @param context, a 2d context from canvas
    }, {
      key: "draw",
      value: function draw(context, callback) {
        if (this._cacheCanvas) {
          this.drawImage(context, this._cacheCanvas, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height);

          if (callback) callback();
        } else {
          if (this._children.length <= 0) {
            return;
          }

          this._children.forEach(function (element) {
            element.draw(context);
          });
        }
      }

      /// @function Sprite.Container.appendChild
      /// append one or more children into container
      /// eg. c.appendChild(childA) c.appendChild(childA, childB)
      /// @param one or more children
    }, {
      key: "appendChild",
      value: function appendChild() {
        if (arguments.length <= 0) {
          console.log(arguments, this);
          throw new TypeError("Sprite.Container.appendChild has an invalid arguments");
        }

        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] instanceof Sprite.Display == false) {
            console.log(arguments[i]);
            throw new TypeError("Sprite.Container.appendChild only can append Sprite.Display or it's sub-class");
          }
          arguments[i].parent = this;
          this._children.push(arguments[i]);
        }

        this.emit("addedChildren");
      }

      /// @function Sprite.Container.appendChildAt
      /// append one or more children into container at certain position
      /// eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
      /// @param one or more children
    }, {
      key: "appendChildAt",
      value: function appendChildAt() {
        if (arguments.length <= 1) {
          console.log(arguments, this);
          throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
        }

        var index = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
          if (arguments[i] instanceof Sprite.Display == false) {
            console.log(arguments[i]);
            throw new TypeError("Sprite.Container.appendChild only can append Sprite.Display or it's sub-class");
          }
          arguments[i].parent = this;
          this._children.splice(index, 0, arguments[i]);
        }

        this.emit("addedChildren");
      }

      /// @function Sprite.Container.removeChild
      /// remove one child from a container
      /// eg. c.removeChild(childA)
      /// @param the child you want to remove
    }, {
      key: "removeChild",
      value: function removeChild(element) {
        var index = this._children.indexOf(element);
        if (index != -1) {
          // 删除成功
          this._children[index].parent = null;
          this._children.splice(index, 1);
          this.emit("removedChildren");
          return true;
        } else {
          // 没有找到需要删除的对象
          return false;
        }
      }

      /// @function Sprite.Container.clear
      /// remove all children of container
    }, {
      key: "clear",
      value: function clear() {
        for (var i = 0; i < this._children.length; i++) {
          this._children[i].parent = null;
        }
        this._children = [];
        this.emit("removedChildren");
        return true;
      }
    }, {
      key: "children",
      get: function get() {
        return this._children;
      },
      set: function set(value) {
        throw new TypeError("Sprite.Container.children readonly");
      }
    }, {
      key: "cacheCanvas",
      get: function get() {
        return this._cacheCanvas;
      },
      set: function set(value) {
        throw new TypeError("Sprite.Container.cacheCanvas readonly");
      }
    }]);

    return Container;
  })(Sprite.Display);
})();
//# sourceMappingURL=SpriteContainer.js.map
