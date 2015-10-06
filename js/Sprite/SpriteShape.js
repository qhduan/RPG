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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      _get(Object.getPrototypeOf(SpriteShape.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.children = [];
      this.width = 0;
      this.height = 0;
      privates.image = null;
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
        var _this = this;

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
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
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
          _this.emit("change");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlU2hhcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Y0FBUSxXQUFXOzs7Ozs7O0FBSzFCLGFBTGUsV0FBVyxHQUt2Qjs0QkFMWSxXQUFXOztBQU1wQyxpQ0FOeUIsV0FBVyw2Q0FNNUI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixjQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUN2Qjs7aUJBWjBCLFdBQVc7O2FBY2hDLGlCQUFHO0FBQ1AsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckQsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUN2QyxhQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsYUFBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLGFBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FB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LFFBQVEsRUFBRTtBQUNkLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNCLFlBQUksS0FBSyxZQUFZLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqRSxjQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQzVCLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxFQUMvQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FDaEMsQ0FBQztTQUNIO09BQ0Y7OztXQWpRMEIsV0FBVztLQUFTLE1BQU0sQ0FBQyxPQUFPLEVBa1E3RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlU2hhcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ3JlYXRlIGEgc2hhcGVcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuU2hhcGVcbiAgICogQGNsYXNzXG4gICAqIEBleHRlbmRzIFNwcml0ZS5EaXNwbGF5XG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiU2hhcGVcIiwgY2xhc3MgU3ByaXRlU2hhcGUgZXh0ZW5kcyBTcHJpdGUuRGlzcGxheSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0IFNwcml0ZS5TaGFwZVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuID0gW107XG4gICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgIHByaXZhdGVzLmltYWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBzaGFwZSA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgIGludGVybmFsKHNoYXBlKS5jaGlsZHJlbiA9IHByaXZhdGVzLmNoaWxkcmVuLnNsaWNlKCk7XG4gICAgICBpbnRlcm5hbChzaGFwZSkuaW1hZ2UgPSBwcml2YXRlcy5pbWFnZTtcbiAgICAgIHNoYXBlLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgIHNoYXBlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgc2hhcGUueCA9IHRoaXMueDtcbiAgICAgIHNoYXBlLnkgPSB0aGlzLnk7XG4gICAgICBzaGFwZS5jZW50ZXJYID0gdGhpcy5jZW50ZXJYO1xuICAgICAgc2hhcGUuY2VudGVyWSA9IHRoaXMuY2VudGVyWTtcbiAgICAgIHJldHVybiBzaGFwZTtcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuID0gW107XG4gICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1ha2VDb25maWcgKGRlZmF1bHRDb25maWcsIHVzZXJDb25maWcpIHtcbiAgICAgIGlmICh1c2VyQ29uZmlnKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB1c2VyQ29uZmlnKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZ1trZXldID0gdXNlckNvbmZpZ1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgcmV0ID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gZGVmYXVsdENvbmZpZykge1xuICAgICAgICByZXQucHVzaChgJHtrZXl9PVwiJHtkZWZhdWx0Q29uZmlnW2tleV19XCJgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgcmVjdCAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcInhcIjogMCxcbiAgICAgICAgXCJ5XCI6IDAsXG4gICAgICAgIFwid2lkdGhcIjogMTAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDEwLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8cmVjdCAke3RoaXMubWFrZUNvbmZpZyhjb25maWcsIHVzZXJDb25maWcpfSAvPmApO1xuXG4gICAgICBpZiAoY29uZmlnLnggKyBjb25maWcud2lkdGggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBjb25maWcueCArIGNvbmZpZy53aWR0aDtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcueSArIGNvbmZpZy5oZWlnaHQgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy55ICsgY29uZmlnLmhlaWdodDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBjaXJjbGUgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJjeFwiOiAxMCxcbiAgICAgICAgXCJjeVwiOiAxMCxcbiAgICAgICAgXCJyXCI6IDEwLFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDEsXG4gICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJvcGFjaXR5XCI6IDEsXG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlcy5jaGlsZHJlbi5wdXNoKGA8Y2lyY2xlICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGlmIChjb25maWcuY3ggKyBjb25maWcuciA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy5jeCArIGNvbmZpZy5yO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5jeSArIGNvbmZpZy5yID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBjb25maWcuY3kgKyBjb25maWcucjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBlbGxpcHNlICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwiY3hcIjogMTAsXG4gICAgICAgIFwiY3lcIjogMTAsXG4gICAgICAgIFwicnhcIjogNSxcbiAgICAgICAgXCJyeVwiOiAxMCxcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPGVsbGlwc2UgJHt0aGlzLm1ha2VDb25maWcoY29uZmlnLCB1c2VyQ29uZmlnKX0gLz5gKTtcblxuICAgICAgaWYgKGNvbmZpZy5jeCArIGNvbmZpZy5yeCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNvbmZpZy5jeCArIGNvbmZpZy5yeDtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuY3kgKyBjb25maWcucnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5jeSArIGNvbmZpZy5yeTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICB9XG5cbiAgICBsaW5lICh1c2VyQ29uZmlnKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIFwieDFcIjogMTAsXG4gICAgICAgIFwieTFcIjogMTAsXG4gICAgICAgIFwieDJcIjogMjAsXG4gICAgICAgIFwieTJcIjogMjAsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxsaW5lICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGlmIChNYXRoLm1heChjb25maWcueDEsIGNvbmZpZy54MikgPiB0aGlzLndpZHRoKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBNYXRoLm1heChjb25maWcueDEsIGNvbmZpZy54Mik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0aC5tYXgoY29uZmlnLnkxLCBjb25maWcueTIpID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChjb25maWcueTEsIGNvbmZpZy55Mik7XG4gICAgICB9XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgcG9seWxpbmUgKHVzZXJDb25maWcpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgXCJwb2ludHNcIjogXCIyMCwgMjAsIDMwLCAyMCwgMzAsIDMwLCAyMCwgMzBcIixcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiAxLFxuICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiAxLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDEsXG4gICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZXMuY2hpbGRyZW4ucHVzaChgPHBvbHlsaW5lICR7dGhpcy5tYWtlQ29uZmlnKGNvbmZpZywgdXNlckNvbmZpZyl9IC8+YCk7XG5cbiAgICAgIGxldCBtYXggPSAtMTtcbiAgICAgIGNvbmZpZy5wb2ludHMuc3BsaXQoLywgLykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBsZXQgbnVtYmVyID0gcGFyc2VJbnQoZWxlbWVudCk7XG4gICAgICAgIGlmICghaXNOYU4obnVtYmVyKSAmJiBudW1iZXIgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBudW1iZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobWF4ICE9IC0xICYmIG1heCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IG1heDtcbiAgICAgIH1cbiAgICAgIGlmIChtYXggIT0gLTEgJiYgbWF4ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBtYXg7XG4gICAgICB9XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgcG9seWdvbiAodXNlckNvbmZpZykge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBcInBvaW50c1wiOiBcIjIwLDIwIDMwLDIwIDMwLDMwIDIwLDMwXCIsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogMSxcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAxLFxuICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVzLmNoaWxkcmVuLnB1c2goYDxwb2x5bGluZSAke3RoaXMubWFrZUNvbmZpZyhjb25maWcsIHVzZXJDb25maWcpfSAvPmApO1xuXG4gICAgICBsZXQgd2lkdGggPSAtMTtcbiAgICAgIGxldCBoZWlnaHQgPSAtMTtcbiAgICAgIC8vIHNwbGl0IHBvaW50cyBieSBjb21tYSBvciBzcGFjZVxuICAgICAgY29uZmlnLnBvaW50cy5zcGxpdCgvLHwgLykuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IG51bWJlciA9IHBhcnNlSW50KGVsZW1lbnQpO1xuICAgICAgICBpZiAoaW5kZXggJSAyID09IDApIHsgLy8gZXZlblxuICAgICAgICAgIGlmIChudW1iZXIgPiB3aWR0aClcbiAgICAgICAgICAgIHdpZHRoID0gbnVtYmVyO1xuICAgICAgICB9IGVsc2UgeyAvLyBvZGRzXG4gICAgICAgICAgaWYgKG51bWJlciA+IGhlaWdodClcbiAgICAgICAgICAgIGhlaWdodCA9IG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh3aWR0aCA+IDAgJiYgd2lkdGggPiB0aGlzLndpZHRoKVxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICBpZiAoaGVpZ2h0ID4gMCAmJiBoZWlnaHQgPiB0aGlzLmhlaWdodClcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgc3ZnID0gYDw/eG1sIHZlcnNpb249XCIxLjBcIj8+XFxuPHN2ZyB3aWR0aD1cIiR7dGhpcy53aWR0aH1cIiBoZWlnaHQ9XCIke3RoaXMuaGVpZ2h0fVwiIGAgK1xuICAgICAgICBgc3R5bGU9XCJ3aWR0aDogJHt0aGlzLndpZHRofXB4OyBoZWlnaHQ6ICR7dGhpcy5oZWlnaHR9cHg7XCIgYCArXG4gICAgICAgIGB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiPlxcbmA7XG5cbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHByaXZhdGVzLmNoaWxkcmVuKSB7XG4gICAgICAgIHN2ZyArPSBgICAke2NoaWxkfVxcbmA7XG4gICAgICB9XG5cbiAgICAgIHN2ZyArPSBcIjwvc3ZnPlwiO1xuXG4gICAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFtzdmddLCB7dHlwZTogXCJpbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLThcIn0pO1xuICAgICAgbGV0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZS5zcmMgPSB1cmw7XG5cbiAgICAgIGxldCBEb25lID0gKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VcIik7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcbiAgICAgICAgRG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gRG9uZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBpbWFnZSA9IHByaXZhdGVzLmltYWdlO1xuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSW1hZ2UgJiYgaW1hZ2Uud2lkdGggPiAwICYmIGltYWdlLmhlaWdodCA+IDApIHtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UocmVuZGVyZXIsIGltYWdlLFxuICAgICAgICAgIDAsIDAsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgMCwgMCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
