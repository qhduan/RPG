"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * @fileoverview Create a shape
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Shape
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Shape", (function (_Sprite$Display) {
    _inherits(SpriteShape, _Sprite$Display);

    /**
     * construct Sprite.Shape
     * @constructor
     */

    function SpriteShape() {
      _classCallCheck(this, SpriteShape);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteShape).call(this));

      var privates = internal(_this);
      privates.children = [];
      _this.width = 0;
      _this.height = 0;
      privates.image = null;
      return _this;
    }

    _createClass(SpriteShape, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var shape = new Sprite.Shape();
        internal(shape).children = privates.children.slice();
        internal(shape).image = privates.image;
        shape.width = this.width;
        shape.height = this.height;
        shape.x = this.x;
        shape.y = this.y;
        shape.centerX = this.centerX;
        shape.centerY = this.centerY;
        return shape;
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.children = [];
        this.width = 0;
        this.height = 0;
        this.generate();
        return this;
      }
    }, {
      key: "makeConfig",
      value: function makeConfig(defaultConfig, userConfig) {
        if (userConfig) {
          for (var key in userConfig) {
            defaultConfig[key] = userConfig[key];
          }
        }
        var ret = [];
        for (var key in defaultConfig) {
          ret.push(key + "=\"" + defaultConfig[key] + "\"");
        }
        return ret.join(" ");
      }
    }, {
      key: "rect",
      value: function rect(userConfig) {
        var privates = internal(this);
        var config = {
          "x": 0,
          "y": 0,
          "width": 10,
          "height": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<rect " + this.makeConfig(config, userConfig) + " />");

        if (config.x + config.width > this.width) {
          this.width = config.x + config.width;
        }
        if (config.y + config.height > this.height) {
          this.height = config.y + config.height;
        }
        this.generate();
      }
    }, {
      key: "circle",
      value: function circle(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "r": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<circle " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.r > this.width) {
          this.width = config.cx + config.r;
        }
        if (config.cy + config.r > this.height) {
          this.height = config.cy + config.r;
        }
        this.generate();
      }
    }, {
      key: "ellipse",
      value: function ellipse(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "rx": 5,
          "ry": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<ellipse " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.rx > this.width) {
          this.width = config.cx + config.rx;
        }
        if (config.cy + config.ry > this.height) {
          this.height = config.cy + config.ry;
        }
        this.generate();
      }
    }, {
      key: "line",
      value: function line(userConfig) {
        var privates = internal(this);
        var config = {
          "x1": 10,
          "y1": 10,
          "x2": 20,
          "y2": 20,
          "stroke": "black",
          "stroke-width": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<line " + this.makeConfig(config, userConfig) + " />");

        if (Math.max(config.x1, config.x2) > this.width) {
          this.width = Math.max(config.x1, config.x2);
        }
        if (Math.max(config.y1, config.y2) > this.height) {
          this.height = Math.max(config.y1, config.y2);
        }
        this.generate();
      }
    }, {
      key: "polyline",
      value: function polyline(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20, 20, 30, 20, 30, 30, 20, 30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var max = -1;
        config.points.split(/, /).forEach(function (element) {
          var number = parseInt(element);
          if (!isNaN(number) && number > max) {
            max = number;
          }
        });

        if (max != -1 && max > this.width) {
          this.width = max;
        }
        if (max != -1 && max > this.height) {
          this.height = max;
        }
        this.generate();
      }
    }, {
      key: "polygon",
      value: function polygon(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20,20 30,20 30,30 20,30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var width = -1;
        var height = -1;
        // split points by comma or space
        config.points.split(/,| /).forEach(function (element, index) {
          var number = parseInt(element);
          if (index % 2 == 0) {
            // even
            if (number > width) width = number;
          } else {
            // odds
            if (number > height) height = number;
          }
        });

        if (width > 0 && width > this.width) this.width = width;
        if (height > 0 && height > this.height) this.height = height;
        this.generate();
      }
    }, {
      key: "generate",
      value: function generate() {
        var _this2 = this;

        var privates = internal(this);
        var svg = "<?xml version=\"1.0\"?>\n<svg width=\"" + this.width + "\" height=\"" + this.height + "\" " + ("style=\"width: " + this.width + "px; height: " + this.height + "px;\" ") + "xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            svg += "  " + child + "\n";
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

        svg += "</svg>";

        var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        var url = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = url;

        var Done = function Done() {
          privates.image = image;
          window.URL.revokeObjectURL(url);
          _this2.emit("change");
        };

        if (image.complete) {
          Done();
        } else {
          image.onload = Done;
        }
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        var image = privates.image;
        if (image instanceof Image && image.width > 0 && image.height > 0) {
          this.drawImage(renderer, image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        }
      }
    }]);

    return SpriteShape;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hhcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7Ozs7QUFBQyxBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7O0FBS3RDLGFBTDJCLFdBQVcsR0FLdkI7NEJBTFksV0FBVzs7eUVBQVgsV0FBVzs7QUFPcEMsVUFBSSxRQUFRLEdBQUcsUUFBUSxPQUFNLENBQUM7QUFDOUIsY0FBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsWUFBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsWUFBSyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztLQUN2Qjs7aUJBWjBCLFdBQVc7OzhCQWM3QjtBQUNQLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixnQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JELGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDdkMsYUFBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pCLGFBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixhQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakIsYUFBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENB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Q0FBQyxLQUFLLENBQUM7QUFDM0IsWUFBSSxLQUFLLFlBQVksS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pFLGNBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssRUFDNUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQy9CLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUNoQyxDQUFDO1NBQ0g7T0FDRjs7O1dBalEwQixXQUFXO0tBQVMsTUFBTSxDQUFDLE9BQU8sRUFrUTdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVTaGFwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDcmVhdGUgYSBzaGFwZVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAqIENsYXNzIFNwcml0ZS5TaGFwZVxuICAgKiBAY2xhc3NcbiAgICogQGV4dGVuZHMgU3ByaXRlLkRpc3BsYXlcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJTaGFwZVwiLCBjbGFzcyBTcHJpdGVTaGFwZSBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLlNoYXBlXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgcHJpdmF0ZXMuaW1hZ2UgPSBudWxsO1xuICAgIH1cblxuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IHNoYXBlID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgaW50ZXJuYWwoc2hhcGUpLmNoaWxkcmVuID0gcHJpdmF0ZXMuY2hpbGRyZW4uc2xpY2UoKTtcbiAgICAgIGludGVybmFsKHNoYXBlKS5pbWFnZSA9IHByaXZhdGVzLmltYWdlO1xuICAgICAgc2hhcGUud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgc2hhcGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICBzaGFwZS54ID0gdGhpcy54O1xuICAgICAgc2hhcGUueSA9IHRoaXMueTtcbiAgICAgIHNoYXBlLmNlbnRlclggPSB0aGlzLmNlbnRlclg7XG4gICAgICBzaGFwZS5jZW50ZXJZID0gdGhpcy5jZW50ZXJZO1xuICAgICAgcmV0dXJuIHNoYXBlO1xuICAgIH1cblxuICAgIGNsZWFyICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWFrZUNvbmZpZyAoZGVmYXVsdENvbmZpZywgdXNlckNvbmZpZykge1xuICAgICAgaWYgKHVzZXJDb25maWcpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHVzZXJDb25maWcpIHtcbiAgICAgICAgICBkZWZhdWx0Q29uZmlnW2tleV0gPSB1c2VyQ29uZmlnW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XG4gICAgICAgIHJldC5wdXNoKGAke2tleX09XCIke2RlZmF1bHRDb25maWdba2V5XX1cImApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldC5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICByZWN0ICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwieFwiOiAwLFxuICAgICAgICBcInlcIjogMCxcbiAgICAgICAgXCJ3aWR0aFwiOiAxMCxcbiAgICAgICAgXCJoZWlnaHRcIjogMTAsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxyZWN0ICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGlmIChjb25maWcueCArIGNvbmZpZy53aWR0aCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy54ICsgY29uZmlnLndpZHRoO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy55ICsgY29uZmlnLmhlaWdodCA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLnkgKyBjb25maWcuaGVpZ2h0O1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGNpcmNsZSAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcImN4XCI6IDEwLFxuICAgICAgICBcImN5XCI6IDEwLFxuICAgICAgICBcInJcIjogMTAsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxjaXJjbGUgJHt0aGlzLm1ha2VDb25maWcoY29uZmlnLCB1c2VyQ29uZmlnKX0gLz5gKTtcblxuICAgICAgaWYgKGNvbmZpZy5jeCArIGNvbmZpZy5yID4gdGhpcy53aWR0aCkge1xuICAgICAgICB0aGlzLndpZHRoID0gY29uZmlnLmN4ICsgY29uZmlnLnI7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLmN5ICsgY29uZmlnLnIgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5jeSArIGNvbmZpZy5yO1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGVsbGlwc2UgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJjeFwiOiAxMCxcbiAgICAgICAgXCJjeVwiOiAxMCxcbiAgICAgICAgXCJyeFwiOiA1LFxuICAgICAgICBcInJ5XCI6IDEwLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8ZWxsaXBzZSAke3RoaXMubWFrZUNvbmZpZyhjb25maWcsIHVzZXJDb25maWcpfSAvPmApO1xuXG4gICAgICBpZiAoY29uZmlnLmN4ICsgY29uZmlnLnJ4ID4gdGhpcy53aWR0aCkge1xuICAgICAgICB0aGlzLndpZHRoID0gY29uZmlnLmN4ICsgY29uZmlnLnJ4O1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5jeSArIGNvbmZpZy5yeSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmN5ICsgY29uZmlnLnJ5O1xuICAgICAgfVxuICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGxpbmUgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJ4MVwiOiAxMCxcbiAgICAgICAgXCJ5MVwiOiAxMCxcbiAgICAgICAgXCJ4MlwiOiAyMCxcbiAgICAgICAgXCJ5MlwiOiAyMCxcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPGxpbmUgJHt0aGlzLm1ha2VDb25maWcoY29uZmlnLCB1c2VyQ29uZmlnKX0gLz5gKTtcblxuICAgICAgaWYgKE1hdGgubWF4KGNvbmZpZy54MSwgY29uZmlnLngyKSA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IE1hdGgubWF4KGNvbmZpZy54MSwgY29uZmlnLngyKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLm1heChjb25maWcueTEsIGNvbmZpZy55MikgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IE1hdGgubWF4KGNvbmZpZy55MSwgY29uZmlnLnkyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBwb2x5bGluZSAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcInBvaW50c1wiOiBcIjIwLCAyMCwgMzAsIDIwLCAzMCwgMzAsIDIwLCAzMFwiLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8cG9seWxpbmUgJHt0aGlzLm1ha2VDb25maWcoY29uZmlnLCB1c2VyQ29uZmlnKX0gLz5gKTtcblxuICAgICAgbGV0IG1heCA9IC0xO1xuICAgICAgY29uZmlnLnBvaW50cy5zcGxpdCgvLCAvKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGxldCBudW1iZXIgPSBwYXJzZUludChlbGVtZW50KTtcbiAgICAgICAgaWYgKCFpc05hTihudW1iZXIpICYmIG51bWJlciA+IG1heCkge1xuICAgICAgICAgIG1heCA9IG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChtYXggIT0gLTEgJiYgbWF4ID4gdGhpcy53aWR0aCkge1xuICAgICAgICB0aGlzLndpZHRoID0gbWF4O1xuICAgICAgfVxuICAgICAgaWYgKG1heCAhPSAtMSAmJiBtYXggPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IG1heDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBwb2x5Z29uICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwicG9pbnRzXCI6IFwiMjAsMjAgMzAsMjAgMzAsMzAgMjAsMzBcIixcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPHBvbHlsaW5lICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGxldCB3aWR0aCA9IC0xO1xuICAgICAgbGV0IGhlaWdodCA9IC0xO1xuICAgICAgLy8gc3BsaXQgcG9pbnRzIGJ5IGNvbW1hIG9yIHNwYWNlXG4gICAgICBjb25maWcucG9pbnRzLnNwbGl0KC8sfCAvKS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgbnVtYmVyID0gcGFyc2VJbnQoZWxlbWVudCk7XG4gICAgICAgIGlmIChpbmRleCAlIDIgPT0gMCkgeyAvLyBldmVuXG4gICAgICAgICAgaWYgKG51bWJlciA+IHdpZHRoKVxuICAgICAgICAgICAgd2lkdGggPSBudW1iZXI7XG4gICAgICAgIH0gZWxzZSB7IC8vIG9kZHNcbiAgICAgICAgICBpZiAobnVtYmVyID4gaGVpZ2h0KVxuICAgICAgICAgICAgaGVpZ2h0ID0gbnVtYmVyO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHdpZHRoID4gMCAmJiB3aWR0aCA+IHRoaXMud2lkdGgpXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGlmIChoZWlnaHQgPiAwICYmIGhlaWdodCA+IHRoaXMuaGVpZ2h0KVxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBzdmcgPSBgPD94bWwgdmVyc2lvbj1cIjEuMFwiPz5cXG48c3ZnIHdpZHRoPVwiJHt0aGlzLndpZHRofVwiIGhlaWdodD1cIiR7dGhpcy5oZWlnaHR9XCIgYCArXG4gICAgICAgIGBzdHlsZT1cIndpZHRoOiAke3RoaXMud2lkdGh9cHg7IGhlaWdodDogJHt0aGlzLmhlaWdodH1weDtcIiBgICtcbiAgICAgICAgYHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCI+XFxuYDtcblxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgcHJpdmF0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgc3ZnICs9IGAgICR7Y2hpbGR9XFxuYDtcbiAgICAgIH1cblxuICAgICAgc3ZnICs9IFwiPC9zdmc+XCI7XG5cbiAgICAgIGxldCBibG9iID0gbmV3IEJsb2IoW3N2Z10sIHt0eXBlOiBcImltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOFwifSk7XG4gICAgICBsZXQgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltYWdlLnNyYyA9IHVybDtcblxuICAgICAgbGV0IERvbmUgPSAoKSA9PiB7XG4gICAgICAgIHByaXZhdGVzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChpbWFnZS5jb21wbGV0ZSkge1xuICAgICAgICBEb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZS5vbmxvYWQgPSBEb25lO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZHJhdyAocmVuZGVyZXIpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGltYWdlID0gcHJpdmF0ZXMuaW1hZ2U7XG4gICAgICBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBJbWFnZSAmJiBpbWFnZS53aWR0aCA+IDAgJiYgaW1hZ2UuaGVpZ2h0ID4gMCkge1xuICAgICAgICB0aGlzLmRyYXdJbWFnZShyZW5kZXJlciwgaW1hZ2UsXG4gICAgICAgICAgMCwgMCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCxcbiAgICAgICAgICAwLCAwLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG59KSgpO1xuIl19
