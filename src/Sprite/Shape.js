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

 import SpriteUtil from "./Util.js";
 import SpriteDisplay from "./Display.js";

 let internal = SpriteUtil.namespace();

/**
 * Class SpriteShape
 * @class
 * @extends SpriteDisplay
*/
export default class SpriteShape extends SpriteDisplay {
  /**
   * construct SpriteShape
   * @constructor
   */
  constructor () {
    super();
    let privates = internal(this);
    privates.children = [];
    this.width = 0;
    this.height = 0;
    privates.image = null;
  }

  clone () {
    let privates = internal(this);
    let shape = new SpriteShape();
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

  clear () {
    let privates = internal(this);
    privates.children = [];
    this.width = 0;
    this.height = 0;
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
    let privates = internal(this);
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

    privates.children.push(`<rect ${this.makeConfig(config, userConfig)} />`);

    if (config.x + config.width > this.width) {
      this.width = config.x + config.width;
    }
    if (config.y + config.height > this.height) {
      this.height = config.y + config.height;
    }
    this.generate();
  }

  circle (userConfig) {
    let privates = internal(this);
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

    privates.children.push(`<circle ${this.makeConfig(config, userConfig)} />`);

    if (config.cx + config.r > this.width) {
      this.width = config.cx + config.r;
    }
    if (config.cy + config.r > this.height) {
      this.height = config.cy + config.r;
    }
    this.generate();
  }

  ellipse (userConfig) {
    let privates = internal(this);
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

    privates.children.push(`<ellipse ${this.makeConfig(config, userConfig)} />`);

    if (config.cx + config.rx > this.width) {
      this.width = config.cx + config.rx;
    }
    if (config.cy + config.ry > this.height) {
      this.height = config.cy + config.ry;
    }
    this.generate();
  }

  line (userConfig) {
    let privates = internal(this);
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

    privates.children.push(`<line ${this.makeConfig(config, userConfig)} />`);

    if (Math.max(config.x1, config.x2) > this.width) {
      this.width = Math.max(config.x1, config.x2);
    }
    if (Math.max(config.y1, config.y2) > this.height) {
      this.height = Math.max(config.y1, config.y2);
    }
    this.generate();
  }

  polyline (userConfig) {
    let privates = internal(this);
    let config = {
      "points": "20, 20, 30, 20, 30, 30, 20, 30",
      "stroke": "black",
      "stroke-width": 1,
      "fill": "white",
      "fill-opacity": 1,
      "stroke-opacity": 1,
      "opacity": 1,
    };

    privates.children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

    let max = -1;
    config.points.split(/, /).forEach((element) => {
      let number = parseInt(element);
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

  polygon (userConfig) {
    let privates = internal(this);
    let config = {
      "points": "20,20 30,20 30,30 20,30",
      "stroke": "black",
      "stroke-width": 1,
      "fill": "white",
      "fill-opacity": 1,
      "stroke-opacity": 1,
      "opacity": 1,
    };

    privates.children.push(`<polyline ${this.makeConfig(config, userConfig)} />`);

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

    if (width > 0 && width > this.width)
      this.width = width;
    if (height > 0 && height > this.height)
      this.height = height;
    this.generate();
  }

  generate () {
    let privates = internal(this);
    let svg = `<?xml version="1.0"?>\n<svg width="${this.width}" height="${this.height}" ` +
      `style="width: ${this.width}px; height: ${this.height}px;" ` +
      `xmlns="http://www.w3.org/2000/svg" version="1.1">\n`;

    for (let child of privates.children) {
      svg += `  ${child}\n`;
    }

    svg += "</svg>";

    let blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
    let url = window.URL.createObjectURL(blob);
    let image = new Image();
    image.src = url;

    let Done = () => {
      privates.image = image;
      window.URL.revokeObjectURL(url);
      this.emit("change");
    };

    if (image.complete) {
      Done();
    } else {
      image.onload = Done;
    }

  }

  draw (renderer) {
    let privates = internal(this);
    let image = privates.image;
    if (image instanceof Image && image.width > 0 && image.height > 0) {
      this.drawImage(renderer, image,
        0, 0, image.width, image.height,
        0, 0, image.width, image.height
      );
    }
  }
}
