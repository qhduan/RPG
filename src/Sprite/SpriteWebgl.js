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
 * @fileoverview Define the Sprite.Webgl, a renderer, other choice from Sprite.Canvas
 * @author mail@qhduan.com (QH Duan)
 */


(function () {
 "use strict";

  let internal = Sprite.Namespace();

  let vertexShaderSrc = `
  precision lowp float;
  attribute vec2 position;
  attribute vec2 a_texCoord;

  uniform vec2 resolution;

  varying vec2 texCoord;

  void main(void) {
     // convert the rectangle from pixels to 0.0 to 1.0
     vec2 zeroToOne = position / resolution;

     // convert from 0->1 to 0->2
     vec2 zeroToTwo = zeroToOne * 2.0;

     // convert from 0->2 to -1->+1 (clipspace)
     vec2 clipSpace = zeroToTwo - 1.0;

     gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

     // pass the texCoord to the fragment shader
     // The GPU will interpolate this value between points.
     texCoord = a_texCoord;
  }`;

  let fragmentShaderSrc = `
  // precision mediump float;
  precision highp float;

  // texture crop
  uniform vec4 crop;

  // texture brightness
  uniform float brightness;

  // texture alpha
  uniform float alpha;

  // texture contrast
  uniform float contrast;

  // our texture
  uniform sampler2D image;

  // the texCoords passed in from the vertex shader.
  varying vec2 texCoord;

  void main(void) {
     // Look up a color from the texture.
     // gl_FragColor = texture2D(image, texCoord);

     // use crop to cut image
     vec4 color = texture2D(
       image,
       vec2(texCoord.x * crop.z, texCoord.y * crop.w) + crop.xy
     ).rgba;

     // brightness and contrast's formular from https://github.com/evanw/glfx.js

     // add the brightness to rgb, but not alpha (a of rgba)
     color.xyz = color.xyz + brightness;

     // apply contrast
     if (contrast > 0.0) {
       color.xyz = (color.xyz - 0.5) / (1.0 - contrast) + 0.5;
     } else {
       color.xyz = (color.xyz - 0.5) * (1.0 + contrast) + 0.5;
     }

     // apply alpha
     color.a = color.a * alpha;

     gl_FragColor = color;
  }`;

  function setRectangle(gl, x, y, width, height) {
    let x2 = x + width;
    let y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(
        [
          x, y,
          x2, y,
          x, y2,
          x, y2,
          x2, y,
          x2, y2
        ]
      ),
      gl.STATIC_DRAW
    );
  }

  /**
   * Test a value is power of 2 or not, eg. 2 is true, 2048 is ture, 2000 is false
   * @param {number} value The number to check
   * @return {boolean} Whether or not the input number is power of 2
   */
  function isPOT (value) {
    return value > 0 && ((value - 1) & value) === 0;
  }

  /**
   * Renderer using webgl
   * @class
   */
  Sprite.assign("Webgl", class SpriteWebgl {

    /**
     * @static
     * @return {boolean} The browser whether or not support WebGL
     */
    static support () {
      let canvas = document.createElement("canvas");
      let gl = canvas.getContext("webgl")
        || canvas.getContext("experimental-webgl");
      if (gl) {
        return true;
      }
      return false;
    }

    /**
     * Construct a renderer width certain width and height
     * @constructor
     */
    constructor (width, height) {
      let privates = internal(this);
      let canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      privates.alpha = 1;
      privates.color = [0, 0, 0];
      privates.filter = new Map();
      privates.filter.set("brightness", 0);
      privates.filter.set("contrast", 0);
      privates.textureCache = new Map();

      let gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
        || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});

      if (!gl) {
        throw new Error("Sprite.Webgl webgl is not supported");
      }

      window.addEventListener("beforeunload", function (event) {
        console.log("release webgl resources");
        for (let texture of privates.textureCache.values()) {
          gl.deleteTexture(texture);
        }
      });

      gl.viewport(0, 0, canvas.width, canvas.height);

      let vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
      let fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertShaderObj, vertexShaderSrc);
      gl.shaderSource(fragShaderObj, fragmentShaderSrc);
      gl.compileShader(vertShaderObj);
      gl.compileShader(fragShaderObj);

      let program = gl.createProgram();
      gl.attachShader(program, vertShaderObj);
      gl.attachShader(program, fragShaderObj);

      gl.linkProgram(program);
      gl.useProgram(program);

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);

      privates.positionLocation = gl.getAttribLocation(program, "position");
      privates.texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
      privates.resolutionLocation = gl.getUniformLocation(program, "resolution");
      privates.cropLocation = gl.getUniformLocation(program, "crop");
      privates.brightnessLocation = gl.getUniformLocation(program, "brightness");
      privates.contrastLocation = gl.getUniformLocation(program, "contrast");
      privates.alphaLocation = gl.getUniformLocation(program, "alpha");

      gl.uniform2f(privates.resolutionLocation, canvas.width, canvas.height);

      let texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.enableVertexAttribArray(privates.texCoordLocation);
      gl.vertexAttribPointer(privates.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      let buffer = gl.createBuffer();

      setRectangle(gl, 0, 0, 1, 1);

      privates.texCoordBuffer = texCoordBuffer;
      privates.buffer = buffer;

      privates.canvas = canvas;
      privates.gl = gl;
      privates.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      console.log("webgl inited. max texture size: %d", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    }

    get alpha () {
      let privates = internal(this);
      return privates.alpha;
    }

    set alpha (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value >= 0 &&
        value <= 1
      ) {
        if (value != privates.alpha) {
          privates.alpha = value;
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Webgl got invalid alpha number");
      }
    }

    /**
     * @return {string} The color, eg "#00ff00"
     */
    get color () {
      let privates = internal(this);
      let color = privates.color;
      let r = color[0].toString(16);
      let g = color[1].toString(16);
      let b = color[2].toString(16);
      if (r.length < 2) r = "0" + r;
      if (g.length < 2) g = "0" + g;
      if (b.length < 2) b = "0" + b;
      return "#" + r + g + b;
    }
    /**
     * @param {string} value The new color, eg "#00ff00"
     */
    set color (value) {
      let privates = internal(this);
      let m = value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/);
      if (m) {
        let r = m[1];
        let g = m[2];
        let b = m[3];
        privates.color[0] = parseInt(r, 16);
        privates.color[1] = parseInt(g, 16);
        privates.color[2] = parseInt(b, 16);
      } else {
        console.error(value, this);
        throw new Error("Sprite.Webgl.color invalid color format");
      }
    }

    /**
     * @param {string} name The name of filter you want get or set
     * @param {number} value Number or undefined, if undefined ,return current value
     */
    filter (name, value) {
      let privates = internal(this);
      if (typeof value == "number") {
        privates.filter.set(name, value);
      } else {
        return privates.get(name);
      }
    }

    createTexture (gl, image) {
      let privates = internal(this);
      if (privates.textureCache.has(image)) {
        return privates.textureCache.get(image);
      } else {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0,  gl.RGBA,  gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // if image size is power of 2
        if (isPOT(image.width) && isPOT(image.height)) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        privates.textureCache.set(image, texture);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
      }
    }

    drawImage (image, sx, sy, sw, sh, dx, dy, dw, dh) {
      let privates = internal(this);
      let gl = privates.gl;

      if (dx > this.width || dy > this.height) {
        return;
      }

      if ((dx + dw) < 0 || (dy + dh) < 0) {
        return;
      }

      if (
        !Number.isInteger(image.width) ||
        !Number.isInteger(image.height) ||
        image.width <= 0 ||
        image.height <= 0 ||
        image.width > privates.maxTextureSize ||
        image.height > privates.maxTextureSize
      ) {
        console.error(image, privates, this);
        throw new Error("Sprite.Webgl.drawImage invalid image");
      }

      if (arguments.length == 9) {
        // all right
      } else if (arguments.length == 5) {
        // drawImage (image, dx, dy, dw, dh);
        dx = sx;
        dy = sy;
        dw = sw;
        dh = sh;
        sx = 0;
        sy = 0;
        sw = image.width;
        sh = image.height;
      } else if (arguments.length == 3) {
        // drawImage (image, dx, dy);
        dx = sx;
        dy = sy;
        dw = image.width;
        dh = image.height;
        sx = 0;
        sy = 0;
        sw = image.width;
        sh = image.height;
      } else {
        console.error(arguments, this);
        throw new Error("Sprite.Webgl.drawImage invalid arguments");
      }

      let texture = this.createTexture(gl, image);

      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set sx, sy, sw, sh, aka. image's crop
      gl.uniform4f(privates.cropLocation,
        sx/image.width, sy/image.height, sw/image.width, sh/image.height);

      gl.uniform1f(privates.brightnessLocation, privates.filter.get("brightness"));
      gl.uniform1f(privates.contrastLocation, privates.filter.get("contrast"));
      gl.uniform1f(privates.alphaLocation, privates.alpha);

      gl.bindBuffer(gl.ARRAY_BUFFER, privates.buffer);
      gl.enableVertexAttribArray(privates.positionLocation);
      gl.vertexAttribPointer(privates.positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set dx, dy, dw, dh, aka. image's position, width and height
      setRectangle(gl, dx, dy, dw, dh);

      // draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    clear () {
      let privates = internal(this);
      let gl = privates.gl;
      let color = privates.color;
      gl.clearColor(color[0], color[1], color[2], 1); // black
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    get width () {
      let privates = internal(this);
      return privates.canvas.width;
    }

    set width (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != privates.canvas.width) {
          privates.canvas.width = value;
          privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
          privates.gl.uniform2f(
            privates.resolutionLocation,
            privates.canvas.width,
            privates.canvas.height
          );
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Webgl got invalid width number");
      }
    }

    get height () {
      let privates = internal(this);
      return privates.canvas.height;
    }

    set height (value) {
      let privates = internal(this);
      if (typeof value == "number" &&
        !isNaN(value) &&
        value > 0 &&
        value < 10000
      ) {
        if (value != privates.canvas.height) {
          privates.canvas.height = value;
          privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
          privates.gl.uniform2f(resolutionLocation, privates.canvas.width, privates.canvas.height);
        }
      } else {
        console.error(value, this);
        throw new Error("Sprite.Webgl got invalid height number");
      }
    }

    get canvas () {
      let privates = internal(this);
      return privates.canvas;
    }

    set canvas (value) {
      console.error(value, this);
      throw new Error("Sprite.Webgl.canvas cannot write");
    }

  });



})();
