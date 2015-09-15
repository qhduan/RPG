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

(function (Sprite) {
  "use strict";

  let internal = Sprite.Namespace();

  /**
   * Class Sprite.Shape
   * @class
   * @extends Sprite.Display
   */
  Sprite.Shape = class SpriteShape extends Sprite.Display {
    /**
     * construct Sprite.Shape
     * @constructor
     */
    constructor () {
      super();
      internal(this).children = [];
      internal(this).width = 0;
      internal(this).height = 0;
      internal(this).image = null;
    }

    clone () {
      let shape = new Sprite.Shape();
      internal(shape).children = internal(this).children.slice();
      internal(shape).image = internal(this).image;
      internal(shape).width = internal(this).width;
      internal(shape).height = internal(this).height;
      shape.x = this.x;
      shape.y = this.y;
      shape.centerX = this.centerX;
      shape.centerY = this.centerY;
      return shape;
    }

    get width () {
      return internal(this).width;
    }

    set width (value) {
      internal(this).width = value;
      this.generate();
    }

    get height () {
      return internal(this).height;
    }

    set height (value) {
      internal(this).height = value;
      this.generate();
    }

    clear () {
      internal(this).children = [];
      internal(this).width = 0;
      internal(this).height = 0;
      this.generate();
      return this;
    }

    makeConfig (defaultConfig, userConfig) {
      if (userConfig) {
        for (let key in userConfig) {
          defaultConfig[key] = userConfig[key];
        }
      }
      let ret = [];
      for (let key in defaultConfig) {
        ret.push(`${key}="${defaultConfig[key]}"`);
      }
      return ret.join(" ");
    }

    rect (userConfig) {
      let config = {
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

      internal(this).children.push(`<rect ${this.makeConfig(config, userConfig)} />`);

      if (config.x + config.width > internal(this).width) {
        internal(this).width = config.x + config.width;
      }
      if (config.y + config.height > internal(this).height) {
        internal(this).height = config.y + config.height;
      }
      this.generate();
    }

    circle (userConfig) {
      let config = {
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

      internal(this).children.push(`<circle ${this.makeConfig(config, userConfig)} />`);

      if (config.cx + config.r > internal(this).width) {
        internal(this).width = config.cx + config.r;
      }
      if (config.cy + config.r > internal(this).height) {
        internal(this).height = config.cy + config.r;
      }
      this.generate();
    }

    ellipse (userConfig) {
      let config = {
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

      internal(this).children.push(`<ellipse ${this.makeConfig(config, userConfig)} />`);

      if (config.cx + config.rx > internal(this).width) {
        internal(this).width = config.cx + config.rx;
      }
      if (config.cy + config.ry > internal(this).height) {
        internal(this).height = config.cy + config.ry;
      }
      this.generate();
    }

    line (userConfig) {
      let config = {
        "x1": 10,
        "y1": 10,
        "x2": 20,
        "y2": 20,
        "stroke": "black",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      internal(this).children.push(`<line ${this.makeConfig(config, userConfig)} />`);

      if (Math.max(config.x1, config.x2) > internal(this).width) {
        internal(this).width = Math.max(config.x1, config.x2);
      }
      if (Math.max(config.y1, config.y2) > internal(this).height) {
        internal(this).height = Math.max(config.y1, config.y2);
      }
      this.generate();
    }

    polyline (userConfig) {
      let config = {
        "points": "20, 20, 30, 20, 30, 30, 20, 30",
        "stroke": "black",
        "stroke-width": 1,
        "fill": "white",
        "fill-opacity": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      this._children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

      let max = -1;
      config.points.split(/, /).forEach((element) => {
        let number = parseInt(element);
        if (!isNaN(number) && number > max) {
          max = number;
        }
      });

      if (max != -1 && max > internal(this).width) {
        internal(this).width = max;
      }
      if (max != -1 && max > internal(this).height) {
        internal(this).height = max;
      }
      this.generate();
    }

    polygon (userConfig) {
      let config = {
        "points": "20,20 30,20 30,30 20,30",
        "stroke": "black",
        "stroke-width": 1,
        "fill": "white",
        "fill-opacity": 1,
        "stroke-opacity": 1,
        "opacity": 1,
      };

      internal(this).children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

      let width = -1;
      let height = -1;
      // split points by comma or space
      config.points.split(/,| /).forEach((element, index) => {
        let number = parseInt(element);
        if (index % 2 == 0) { // even
          if (number > width)
            width = number;
        } else { // odds
          if (number > height)
            height = number;
        }
      });

      if (width > 0 && width > internal(this).width)
        internal(this).width = width;
      if (height > 0 && height > internal(this).height)
        internal(this).height = height;
      this.generate();
    }

    generate () {
      let svg = `<?xml version="1.0"?>\n<svg width="${this._width}" height="${this._height}" ` +
        `style="width: ${this._width}px; height: ${this._height}px;" ` +
        `xmlns="http://www.w3.org/2000/svg" version="1.1">\n`;

      for (let child of internal(this).children) {
        svg += `  ${child}\n`;
      }

      svg += "</svg>";

      let blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
      let url = window.URL.createObjectURL(blob);
      let image = new Image();
      image.src = url;

      let Done = () => {
        internal(this).image = image;
        internal(this).width = image.width;
        internal(this).height = image.height;
        // window.URL.revokeObjectURL(url);
        this.emit("change");
      };

      if (image.complete) {
        Done();
      } else {
        image.onload = Done;
      }

    }

    draw (renderer) {
      let image = internal(this).image;
      if (image instanceof Image && image.width > 0 && image.height > 0) {
        this.drawImage(renderer, image,
          0, 0, image.width, image.height,
          0, 0, image.width, image.height
        );
      }
    }
  };

})(Sprite);
