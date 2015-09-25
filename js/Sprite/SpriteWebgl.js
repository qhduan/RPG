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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  function isPOT(value) {
    return value > 0 && (value - 1 & value) === 0;
  }

  /**
    Use mediump precision in WebGL when possible
    Highp in fragment shaders is an optional part of the OpenGL ES 2.0 spec,
    so not all hardware supports it
    lowp mediump highp
    https://developers.google.com/web/updates/2011/12/Use-mediump-precision-in-WebGL-when-possible?hl=en
     brightness and contrast's formular from https://github.com/evanw/glfx.js
  */
  var vertexShaderSrc = "\n  precision mediump float;\n  attribute vec2 a_texCoord;\n  varying vec2 texCoord;\n\n  attribute vec2 aVertex;\n  uniform vec2 resolution;\n\n  uniform vec4 position;\n\n  void main(void) {\n     vec2 a = aVertex * (position.zw / resolution) + (position.xy / resolution);\n     vec2 b = a * 2.0 - 1.0;\n\n     gl_Position = vec4(b * vec2(1.0, -1.0), 0.0, 1.0);\n     texCoord = a_texCoord;\n  }";

  var fragmentShaderSrc = "\n  precision mediump float;\n\n  uniform vec4 crop;\n  uniform float brightness;\n  uniform float alpha;\n  uniform float contrast;\n\n  uniform sampler2D image;\n\n  // the texCoords passed in from the vertex shader.\n  varying vec2 texCoord;\n\n  void main(void) {\n\n     vec4 color = texture2D(image,\n       vec2(texCoord.x * crop.z, texCoord.y * crop.w) + crop.xy).rgba;\n\n     if (contrast != 0.0) {\n       if (contrast > 0.0) {\n         color.xyz = (color.xyz - 0.5) / (1.0 - contrast) + 0.5;\n       } else {\n         color.xyz = (color.xyz - 0.5) * (1.0 + contrast) + 0.5;\n       }\n     }\n\n     if (brightness != 0.0) {\n       color.xyz += brightness;\n     }\n     if (alpha != 1.0) {\n       color.a *=  alpha;\n     }\n\n     gl_FragColor = color;\n  }";

  /**
   * Renderer using webgl
   * @class
   */
  Sprite.assign("Webgl", (function () {
    _createClass(SpriteWebgl, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support WebGL
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
          canvas.getContext("experimental-webgl");
        }
        if (!gl) {
          return false;
        }
        return true;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */
    }]);

    function SpriteWebgl(width, height) {
      _classCallCheck(this, SpriteWebgl);

      var privates = internal(this);

      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      var options = {
        antialias: false,
        preserveDrawingBuffer: true
      };

      var gl = canvas.getContext("webgl", options);
      if (!gl) {
        gl = canvas.getContext("experimental-webgl", options);
      }
      privates.gl = gl;

      if (!gl) {
        throw new Error("Sprite.Webgl webgl is not supported");
      }

      privates.color = [0, 0, 0];
      privates.filter = new Map();
      privates.textureCache = new Map();
      privates.canvas = canvas;
      privates.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      gl.viewport(0, 0, canvas.width, canvas.height);

      var vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
      var fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertShaderObj, vertexShaderSrc);
      gl.shaderSource(fragShaderObj, fragmentShaderSrc);
      gl.compileShader(vertShaderObj);
      gl.compileShader(fragShaderObj);

      var program = gl.createProgram();
      gl.attachShader(program, vertShaderObj);
      gl.attachShader(program, fragShaderObj);

      gl.linkProgram(program);
      gl.useProgram(program);

      gl.cullFace(gl.BACK);
      gl.frontFace(gl.CW);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      privates.cropLoc = gl.getUniformLocation(program, "crop");
      privates.brightnessLoc = gl.getUniformLocation(program, "brightness");
      privates.contrastLoc = gl.getUniformLocation(program, "contrast");
      privates.alphaLoc = gl.getUniformLocation(program, "alpha");
      privates.resolutionLoc = gl.getUniformLocation(program, "resolution");
      gl.uniform2f(privates.resolutionLoc, canvas.width, canvas.height);

      privates.positionLoc = gl.getUniformLocation(program, "position");

      privates.tLoc = gl.getAttribLocation(program, "a_texCoord");
      gl.enableVertexAttribArray(privates.tLoc);
      privates.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.texCoordBuffer);
      gl.vertexAttribPointer(privates.tLoc, 2, gl.FLOAT, false, 0, 0);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);

      privates.vLoc = gl.getAttribLocation(program, "aVertex");
      gl.enableVertexAttribArray(privates.vLoc);
      privates.vertexBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.vertexBuff);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(privates.vLoc);
      gl.vertexAttribPointer(privates.vLoc, 2, gl.FLOAT, false, 0, 0);

      privates.currentTexture = null;

      // setting, don't move
      this.filter("brightness", 0);
      this.filter("contrast", 0);
      this.alpha = 1;

      console.log("webgl inited. max texture size: %d", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    }

    _createClass(SpriteWebgl, [{
      key: "drawImage9",
      value: function drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var privates = internal(this);
        var gl = privates.gl;

        var texture = this.createTexture(gl, image);
        if (privates.currentTexture != texture) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          privates.currentTexture = texture;
        }

        gl.uniform4f(privates.cropLoc, sx / image.width, sy / image.height, sw / image.width, sh / image.height);
        gl.uniform4f(privates.positionLoc, dx, dy, dw, dh);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      }
    }, {
      key: "createTexture",
      value: function createTexture(gl, image) {
        var privates = internal(this);
        if (privates.textureCache.has(image)) {
          return privates.textureCache.get(image);
        } else {
          gl.activeTexture(gl.TEXTURE0);
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

          // test width&height is power of 2, eg. 256, 512, 1024
          // may speed up
          if (isPOT(image.width) && isPOT(image.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }

          gl.bindTexture(gl.TEXTURE_2D, null);
          privates.textureCache.set(image, texture);
          return texture;
        }
      }
    }, {
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
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

        /*
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
        */

        this.drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }, {
      key: "filter",

      /**
       * @param {string} name The name of filter you want get or set
       * @param {number} value Number or undefined, if undefined ,return current value
       */
      value: function filter(name, value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value)) {
          privates.filter.set(name, value);
          gl.uniform1f(privates.brightnessLoc, privates.filter.get("brightness"));
          gl.uniform1f(privates.contrastLoc, privates.filter.get("contrast"));
        } else {
          return privates.get(name);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var gl = privates.gl;
        var color = privates.color;
        gl.clearColor(color[0], color[1], color[2], 1); // black
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }, {
      key: "alpha",
      get: function get() {
        var privates = internal(this);
        return privates.alpha;
      },
      set: function set(value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value) && !isNaN(value) && value >= 0 && value <= 1) {
          if (value != privates.alpha) {
            privates.alpha = value;
            gl.uniform1f(privates.alphaLoc, privates.alpha);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid alpha number");
        }
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        var color = privates.color;
        var r = color[0].toString(16);
        var g = color[1].toString(16);
        var b = color[2].toString(16);
        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;
        return "#" + r + g + b;
      },

      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      set: function set(value) {
        var privates = internal(this);
        var m = value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/);
        if (m) {
          var r = m[1];
          var g = m[2];
          var b = m[3];
          privates.color[0] = parseInt(r, 16);
          privates.color[1] = parseInt(g, 16);
          privates.color[2] = parseInt(b, 16);
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl.color invalid color format");
        }
      }
    }, {
      key: "width",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.width;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.width) {
            privates.canvas.width = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(privates.resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid width number");
        }
      }
    }, {
      key: "height",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.height;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid height number");
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        console.error(value, this);
        throw new Error("Sprite.Webgl.canvas cannot write");
      }
    }]);

    return SpriteWebgl;
  })());
})();
//# sourceMappingURL=SpriteWebgl.js.map
