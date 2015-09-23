/*

2D Game Sprite Library, Built using JavaScript ES6
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

/**
 * @fileoverview Class Sprite.Stage
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Main Stage, display object
   * @class
   * @extends Sprite.Container
   */
  Sprite.assign("Stage", (function (_Sprite$Container) {
    _inherits(SpriteStage, _Sprite$Container);

    /** @function Sprite.Stage.constructor
     * consturct a Sprite.Stage with width and height
     * @constructor
     * @param width, the width of stage you need
     * @param height, the height of stage you need
     */

    function SpriteStage(width, height) {
      _classCallCheck(this, SpriteStage);

      _get(Object.getPrototypeOf(SpriteStage.prototype), "constructor", this).call(this);
      var privates = internal(this);

      if (!privates.renderer && Sprite.Webgl.support()) {
        privates.renderer = new Sprite.Webgl(width, height);
        privates.rendererType = "webgl";
      }

      // canvas 2d first
      if (!privates.renderer && Sprite.Canvas.support()) {
        privates.renderer = new Sprite.Canvas(width, height);
        privates.rendererType = "canvas";
      }

      if (!privates.renderer) {
        throw new Error("Sprite.Stage all renderer not support");
      }

      /**
      * color when stage is empty
      */
      privates.color = "#000000";
    }

    _createClass(SpriteStage, [{
      key: "filter",
      value: function filter(name, value) {
        var privates = internal(this);
        return privates.renderer.filter(name, value);
      }
    }, {
      key: "findHit",
      value: function findHit(event) {
        var privates = internal(this);
        var hitted = this.hitTest(this.mouseX, this.mouseY);
        hitted.reverse();
        if (hitted.length) return hitted;
        return null;
      }
    }, {
      key: "clear",

      /// @function Sprite.Stage.clear
      /// clear the stage
      value: function clear() {
        internal(this).renderer.clear();
      }
    }, {
      key: "update",
      value: function update() {
        this.draw();
      }
    }, {
      key: "draw",
      value: function draw() {
        var privates = internal(this);
        this.emit("beforeDraw");

        /** this.children, never privates.children, because children are super's */
        if (this.children.length <= 0) {
          return false;
        }

        this.clear();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            child.draw(this.renderer);
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

        this.emit("afterDraw");
      }
    }, {
      key: "renderer",
      get: function get() {
        var privates = internal(this);
        return privates.renderer;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage renderer readonly");
      }
    }, {
      key: "rendererType",
      get: function get() {
        var privates = internal(this);
        return privates.rendererType;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.rendererType readonly");
      }
    }, {
      key: "width",
      get: function get() {
        var privates = internal(this);
        return privates.renderer.width;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.renderer.width = value;
      }
    }, {
      key: "height",
      get: function get() {
        var privates = internal(this);
        return privates.renderer.height;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.renderer.height = value;
      }
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        return privates.renderer.color;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.renderer.color = value;
      }
    }, {
      key: "canvas",
      get: function get() {
        return this.renderer.canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.canvas readonly");
      }
    }]);

    return SpriteStage;
  })(Sprite.Container));
})();
//# sourceMappingURL=SpriteStage.js.map
