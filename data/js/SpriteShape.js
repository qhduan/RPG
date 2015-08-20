"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  Sprite.Shape = (function (_Sprite$Display) {
    _inherits(Shape, _Sprite$Display);

    function Shape() {
      _classCallCheck(this, Shape);

      _get(Object.getPrototypeOf(Shape.prototype), "constructor", this).call(this);
      this._children = [];
      this._width = 0;
      this._height = 0;
      this._image = null;
    }

    _createClass(Shape, [{
      key: "clone",
      value: function clone() {
        var shape = new Shape();
        shape._children = this._children.slice();
        shape._width = this._width;
        shape._height = this._height;
        shape._image = this._image;
        shape.x = this.x;
        shape.y = this.y;
        shape.center.x = this.center.x;
        shape.center.y = this.center.y;
        shape.scale.x = this.scale.x;
        shape.scale.y = this.scale.y;
        return shape;
      }
    }, {
      key: "clear",
      value: function clear() {
        this._children = [];
        this._width = 0;
        this._height = 0;
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

        this._children.push("<rect " + this.makeConfig(config, userConfig) + " />");

        if (config.x + config.width > this._width) {
          this._width = config.x + config.width;
        }
        if (config.y + config.height > this._height) {
          this._height = config.y + config.height;
        }
        this.generate();
      }
    }, {
      key: "circle",
      value: function circle(userConfig) {
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

        this._children.push("<circle " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.r > this._width) {
          this._width = config.cx + config.r;
        }
        if (config.cy + config.r > this._height) {
          this._height = config.cy + config.r;
        }
        this.generate();
      }
    }, {
      key: "ellipse",
      value: function ellipse(userConfig) {
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

        this._children.push("<ellipse " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.rx > this._width) {
          this._width = config.cx + config.rx;
        }
        if (config.cy + config.ry > this._height) {
          this._height = config.cy + config.ry;
        }
        this.generate();
      }
    }, {
      key: "line",
      value: function line(userConfig) {
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

        this._children.push("<line " + this.makeConfig(config, userConfig) + " />");

        if (Math.max(config.x1, config.x2) > this._width) {
          this._width = Math.max(config.x1, config.x2);
        }
        if (Math.max(config.y1, config.y2) > this._height) {
          this._height = Math.max(config.y1, config.y2);
        }
        this.generate();
      }
    }, {
      key: "polyline",
      value: function polyline(userConfig) {
        var defaultConfig = {
          "points": "20, 20, 30, 20, 30, 30, 20, 30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        this._children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var max = -1;
        config.points.split(/, /).forEach(function (element) {
          var number = parseInt(element);
          if (!isNaN(number) && number > max) {
            max = number;
          }
        });

        if (max != -1) {
          this._width = max;
          this._height = max;
        }
        this.generate();
      }
    }, {
      key: "polygon",
      value: function polygon(userConfig) {
        var config = {
          "points": "20,20 30,20 30,30 20,30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        this._children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

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

        if (width > 0 && width > this._width) this._width = width;
        if (height > 0 && height > this._height) this._height = height;
        this.generate();
      }
    }, {
      key: "generate",
      value: function generate() {
        var _this = this;

        var svg = "<?xml version=\"1.0\"?>\n<svg width=\"" + this._width + "\" height=\"" + this._height + "\" " + ("style=\"width: " + this._width + "px; height: " + this._height + "px;\" ") + "xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n";

        this._children.forEach(function (shape) {
          svg += "  " + shape + "\n";
        });

        svg += "</svg>";
        this._svg = svg;

        var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        var url = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = url;

        var Done = function Done() {
          _this._image = image;
          _this._width = image.width;
          _this._height = image.height;
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
      value: function draw(context) {
        if (this._image instanceof Image && this._image.width > 0 && this._image.height > 0) {
          this.drawImage(context, this._image, 0, 0, this._image.width, this._image.height, 0, 0, this._image.width, this._image.height);
        }
      }
    }, {
      key: "svg",
      get: function get() {
        return this._svg;
      },
      set: function set(value) {
        throw new TypeError("Sprite.Shape.svg readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this._width = value;
        this.generate();
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this._height = value;
        this.generate();
      }
    }]);

    return Shape;
  })(Sprite.Display);
})();
//# sourceMappingURL=SpriteShape.js.map
