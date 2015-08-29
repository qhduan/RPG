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

/// @file SpriteShape.js
/// @namespace Sprite
/// class Sprite.Shape

(function () {
  "use strict";

  Sprite.Shape = class Shape extends Sprite.Display {
    constructor () {
      super();
      this._children = [];
      this._width = 0;
      this._height = 0;
      this._image = null;
    }

    clone () {
      var shape = new Shape();
      shape._children = this._children.slice();
      shape._width = this._width;
      shape._height = this._height;
      shape._image = this._image;
      shape.x = this.x;
      shape.y = this.y;
      shape.centerX = this.centerX;
      shape.centerY = this.centerY;
      shape.scaleX = this.scaleX;
      shape.scaleY = this.scaleY;
      return shape;
    }

    get svg () {
      return this._svg;
    }

    set svg (value) {
      throw new TypeError("Sprite.Shape.svg readonly");
    }

    get width () {
      return this._width;
    }

    set width (value) {
      this._width = value;
      this.generate();
    }

    get height () {
      return this._height;
    }

    set height (value) {
      this._height = value;
      this.generate();
    }

    clear () {
      this._children = [];
      this._width = 0;
      this._height = 0;
      this.generate();
      return this;
    }

    makeConfig (defaultConfig, userConfig) {
      if (userConfig) {
        for (let key in userConfig) {
          defaultConfig[key] = userConfig[key];
        }
      }
      var ret = [];
      for (let key in defaultConfig) {
        ret.push(`${key}="${defaultConfig[key]}"`);
      }
      return ret.join(" ");
    }

    rect (userConfig) {
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
        "opacity": 1,
      };

      this._children.push(`<rect ${this.makeConfig(config, userConfig)} />`);

      if (config.x + config.width > this._width) {
        this._width = config.x + config.width;
      }
      if (config.y + config.height > this._height) {
        this._height = config.y + config.height;
      }
      this.generate();
    }

    circle (userConfig) {
      var config = {
        "cx": 10,
        "cy": 10,
        "r": 10,
        "stroke": "black",
        "stroke-width": 1,
        "fill": "white",
        "fill-opacity": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      this._children.push(`<circle ${this.makeConfig(config, userConfig)} />`);

      if (config.cx + config.r > this._width) {
        this._width = config.cx + config.r;
      }
      if (config.cy + config.r > this._height) {
        this._height = config.cy + config.r;
      }
      this.generate();
    }

    ellipse (userConfig) {
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
        "opacity": 1,
      };

      this._children.push(`<ellipse ${this.makeConfig(config, userConfig)} />`);

      if (config.cx + config.rx > this._width) {
        this._width = config.cx + config.rx;
      }
      if (config.cy + config.ry > this._height) {
        this._height = config.cy + config.ry;
      }
      this.generate();
    }

    line (userConfig) {
      var config = {
        "x1": 10,
        "y1": 10,
        "x2": 20,
        "y2": 20,
        "stroke": "black",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      this._children.push(`<line ${this.makeConfig(config, userConfig)} />`);

      if (Math.max(config.x1, config.x2) > this._width) {
        this._width = Math.max(config.x1, config.x2);
      }
      if (Math.max(config.y1, config.y2) > this._height) {
        this._height = Math.max(config.y1, config.y2);
      }
      this.generate();
    }

    polyline (userConfig) {
      var defaultConfig = {
        "points": "20, 20, 30, 20, 30, 30, 20, 30",
        "stroke": "black",
        "stroke-width": 1,
        "fill": "white",
        "fill-opacity": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      this._children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

      var max = -1;
      config.points.split(/, /).forEach((element) => {
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

    polygon (userConfig) {
      var config = {
        "points": "20,20 30,20 30,30 20,30",
        "stroke": "black",
        "stroke-width": 1,
        "fill": "white",
        "fill-opacity": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      this._children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

      var width = -1;
      var height = -1;
      // split points by comma or space
      config.points.split(/,| /).forEach((element, index) => {
        var number = parseInt(element);
        if (index % 2 == 0) { // even
          if (number > width)
            width = number;
        } else { // odds
          if (number > height)
            height = number;
        }
      });

      if (width > 0 && width > this._width)
        this._width = width;
      if (height > 0 && height > this._height)
        this._height = height;
      this.generate();
    }

    generate () {
      var svg = `<?xml version="1.0"?>\n<svg width="${this._width}" height="${this._height}" ` +
        `style="width: ${this._width}px; height: ${this._height}px;" ` +
        `xmlns="http://www.w3.org/2000/svg" version="1.1">\n`;

      this._children.forEach((shape) => {
        svg += `  ${shape}\n`;
      });

      svg += "</svg>";
      this._svg = svg;

      var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
      var url = window.URL.createObjectURL(blob);
      var image = new Image();
      image.src = url;

      var Done = () => {
        this._image = image;
        this._width = image.width;
        this._height = image.height;
        window.URL.revokeObjectURL(url);
        this.emit("change");
      };

      if (image.complete) {
        Done();
      } else {
        image.onload = Done;
      }

    }

    draw (context) {
      if (this._image instanceof Image && this._image.width > 0 && this._image.height > 0) {
        this.drawImage(context, this._image,
          0, 0, this._image.width, this._image.height,
          0, 0, this._image.width, this._image.height
        );
      }
    }
  };

})();
