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
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var SpriteCore = (function () {
    function SpriteCore() {
      _classCallCheck(this, SpriteCore);
    }

    _createClass(SpriteCore, [{
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });
        return this;
      }
    }]);

    return SpriteCore;
  })();

  ;

  var Sprite = window.Sprite = new SpriteCore();

  /**
   * Function Sprite.Namespace, return an unique Private-Properties function
   * for javascript private properties need, for es6
   */
  Sprite.assign("Namespace", function () {
    /**
     * Using closure variable store private properties
     * and different file have different "privateProperties"
     */
    var privates = new WeakMap();
    return function (object) {
      if (privates.has(object) == false) {
        privates.set(object, {});
      }
      return privates.get(object);
    };
  });

  /**
   * @param {number} N The min number
   * @param {number} M The max number
   * @return {number} A random integer N <= return < M, aka. [N, M)
   */
  Sprite.assign("rand", function (N, M) {
    var r = M - N;
    r *= Math.random();
    return N + Math.floor(r);
  });

  /**
   * @param {Object} object The object we require copy
   * @return {Object} A deep copy of object
   */
  Sprite.assign("copy", function (object) {
    return JSON.parse(JSON.stringify(object));
  });

  Sprite.assign("each", function (obj, functional) {
    if (obj.forEach) {
      obj.forEach(functional);
    } else {
      for (var key in obj) {
        functional(obj[key], key, obj);
      }
    }
  });

  Sprite.assign("uuid", function () {
    // generate a UUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, function (c) {
      var r = Math.floor(Math.random() * 16);
      if (c == "x") {
        return r.toString(16);
      } else {
        return (r & 0x03 | 0x08).toString(16);
      }
    });
  });

  Sprite.assign("btoa", function (str) {
    // convert str to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  });

  Sprite.assign("atob", function (str) {
    // convert base64 str to original
    return decodeURIComponent(escape(window.atob(str)));
  });
})();
//# sourceMappingURL=Sprite.js.map

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
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Canvas, an renderer using canvas.getContext("2d")
   * @class
   */
  Sprite.assign("Canvas", (function () {
    _createClass(SpriteCanvas, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support HTML5 canvas
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        if (context) {
          return true;
        }
        return false;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */
    }]);

    function SpriteCanvas(width, height) {
      _classCallCheck(this, SpriteCanvas);

      var privates = internal(this);
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;
      var context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("canvas inited");

      /**
       * Color after clear canvas
       */
      privates.color = "#000000";
      /**
       * The canvas object
       */
      privates.canvas = canvas;
      /**
       * Context of canvas
       */
      privates.context = context;
      /**
       * Global alpha
       */
      privates.alpha = 1;
      /**
       * Save some filter paramters, eg. brightness/contrast
       */
      privates.filter = new Map();
      this.filter("brightness", 0);
      this.filter("contrast", 0);
    }

    /**
     * @param {string} name The name of filter you want get or set
     * @param {number} value Number or undefined, if undefined ,return current value
     */

    _createClass(SpriteCanvas, [{
      key: "filter",
      value: function filter(name, value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (name == "brightness") {
            value += 1;
          }
          if (name == "contrast") {
            value += 1;
          }
          if (privates.filter.get(name) != value) {
            (function () {
              privates.filter.set(name, value);
              var filter = [];
              privates.filter.forEach(function (value, key, object) {
                filter.push(key + "(" + value + ")");
              });
              filter = filter.join(" ");
              privates.canvas.style.filter = filter;
              privates.canvas.style.webkitFilter = filter;
            })();
          }
        } else {
          return privates.filter.get(name);
        }
      }

      /**
       * Draw an image on the canvas
       * arguments same as canvas.getContext("2d")
       */
    }, {
      key: "drawImage",
      value: function drawImage() {
        var privates = internal(this);
        privates.context.globalAlpha = this.alpha;
        privates.context.drawImage.apply(privates.context, arguments);
      }
    }, {
      key: "release",
      value: function release() {}
      // nothing

      /**
       * Remove everything on canvas but a single color
       */

    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.context.fillStyle = privates.color;
        privates.context.fillRect(0, 0, this.width, this.height);
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */
    }, {
      key: "color",
      get: function get() {
        return internal(this).color;
      },

      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      set: function set(value) {
        if (value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/)) {
          internal(this).color = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas invalid color value");
        }
      }

      /**
       * @return {number} The alpha, 0 to 1
       */
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).alpha;
      },

      /**
       * @param {number} value The new alpha number
       */
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid alpha number");
        }
      }

      /**
       * @return {number} Width of canvas
       */
    }, {
      key: "width",
      get: function get() {
        return internal(this).canvas.width;
      },

      /**
       * @param {number} value New width
       */
      set: function set(value) {
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          internal(this).canvas.width = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid width number");
        }
      }

      /**
       * @return {number} Height of canvas
       */
    }, {
      key: "height",
      get: function get() {
        return internal(this).canvas.height;
      },

      /**
       * @param {number} value New height
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid height number");
        }
      }

      /**
       * @return {Object} Canvas
       */
    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Canvas.canvas cannot write");
      }
    }]);

    return SpriteCanvas;
  })());
})();
//# sourceMappingURL=SpriteCanvas.js.map

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
  var vertexShaderSrc = "\n  precision mediump float;\n  attribute vec2 a_texCoord;\n  varying vec2 v_texCoord;\n\n  attribute vec2 aVertex;\n  uniform vec2 resolution;\n\n  uniform vec4 position;\n\n  void main(void) {\n     vec2 a = aVertex * (position.zw / resolution) + (position.xy / resolution);\n     vec2 b = a * 2.0 - 1.0;\n\n     gl_Position = vec4(b * vec2(1.0, -1.0), 0.0, 1.0);\n     v_texCoord = a_texCoord;\n  }";

  var fragmentShaderSrc = "\n  precision mediump float;\n\n  uniform vec4 crop;\n  uniform float brightness;\n  uniform float alpha;\n  uniform float contrast;\n\n  uniform sampler2D image;\n\n  // the texCoords passed in from the vertex shader.\n  varying vec2 v_texCoord;\n\n  void main(void) {\n\n    vec2 t = v_texCoord;\n    t.x *= crop.z;\n    t.y *= crop.w;\n    t += crop.xy;\n\n     vec4 color = texture2D(image, t).rgba;\n\n     if (contrast != 0.0) {\n       if (contrast > 0.0) {\n         color.xyz = (color.xyz - 0.5) / (1.0 - contrast) + 0.5;\n       } else {\n         color.xyz = (color.xyz - 0.5) * (1.0 + contrast) + 0.5;\n       }\n     }\n\n     if (brightness != 0.0) {\n       color.xyz += brightness;\n     }\n\n     if (alpha != 1.0) {\n       color.a *=  alpha;\n     }\n\n     gl_FragColor = color;\n  }";

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
      key: "release",
      value: function release() {
        var privates = internal(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.textureCache.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var texture = _step.value;

            privates.gl.deleteTexture(texture);
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

        privates.textureCache = new Map();
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
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

          // test width&height is power of 2, eg. 256, 512, 1024
          // may speed up
          if (isPOT(image.width) && isPOT(image.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
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
 * @fileoverview Class Sprite.Event
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Event, hold all events emit, bubble
   * @class
   */
  Sprite.assign("Event", (function () {
    /**
     * construct Sprite.Event
     * @constructor
     */

    function SpriteEvent() {
      _classCallCheck(this, SpriteEvent);

      var privates = internal(this);
      /**
       * Contain all event and its' listeners
       @type {Object}
       @private
       */
      privates.listeners = new Map();
      /**
       * Contain an event is once or not
       * @type {Object}
       * @private
       */
      privates.once = new Map();
      /**
       * Parent of this object
       * @type {Object}
       */
      privates.parent = null;
    }

    /**
     * @return {Object} parent we hold, an object or null
     */

    _createClass(SpriteEvent, [{
      key: "on",

      /**
       * Register an event
       * @param {string} event The event type, eg. "click"
       * @param {function} listener The callback function when event fired
       */
      value: function on(event, listener) {
        var privates = internal(this);
        // If event is an once event, when some client register this event after event fired, we just return it
        if (privates.once.has(event)) {
          listener({
            type: event,
            target: this,
            data: privates.once.get(event)
          });
          return null;
        } else {
          if (privates.listeners.has(event) == false) {
            privates.listeners.set(event, new Map());
          }

          var id = Sprite.uuid();
          privates.listeners.get(event).set(id, listener);
          return id;
        }
      }

      /**
       * Remove an event Register
       * @param {string} event The event type you want to remove. eg. "click"
       * @param {string} id The id of event, the id is what returned by "on" function
       */
    }, {
      key: "off",
      value: function off(event, id) {
        var privates = internal(this);
        if (privates.listeners.has(event) && privates.listeners.get(event).has(id)) {
          privates.listeners.get(event)["delete"](id);
          if (privates.listeners.get(event).size <= 0) {
            privates.listeners["delete"](event);
          }
          return true;
        }
        return false;
      }

      /**
       * Fire an event from children
       * @param {string} event Event type
       * @param {Object} target Event target
       * @param {Object} data Data
       */
    }, {
      key: "emitBubble",
      value: function emitBubble(event, target, data) {
        var privates = internal(this);
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = privates.listeners.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var listener = _step.value;

              if (listener({ type: event, target: target, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
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
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, target, data);
        }
      }

      /**
       * Fire an event
       * @param {string} event The event type you want to fire
       * @param {boolean} once Whether or not the event is once, if true, the event fire should only once, like "complete"
       * @param {Object} data The data to listener, undefined or null is OK
       */
    }, {
      key: "emit",
      value: function emit(event, once, data) {
        var privates = internal(this);
        if (once) {
          if (typeof data != "undefined") {
            privates.once.set(event, data);
          } else {
            privates.once.set(event, null);
          }
        }

        // wheter or not bubble the event, default true
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = privates.listeners.get(event).values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var listener = _step2.value;

              if (listener({ type: event, target: this, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, this, data);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        var privates = internal(this);
        return privates.parent;
      },

      /**
       * Set parent of object
       * @param {Object} value New parent value, or null
       */
      set: function set(value) {
        var privates = internal(this);
        privates.parent = value;
      }
    }]);

    return SpriteEvent;
  })());
})();
//# sourceMappingURL=SpriteEvent.js.map

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

/*

Sprite.Tween.get(Game.hero)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x, Game.hero.y + 5,"walk", resolve);
  })
})
.wait(2000)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x + 5, Game.hero.y, "walk", resolve);
  })
})
.to({alpha: 0}, 500)
.wait(500)
.to({alpha: 1}, 500)
.call(function () {
  Game.popup(Game.hero.sprite, "hello", 0, -50);
})
.wait(2000)
.call(function () {
  console.log("ok");
});


*/

/**
 * @fileoverview Sprite.Tween
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

  Sprite.assign("Tween", (function (_Sprite$Event) {
    _inherits(SpriteTween, _Sprite$Event);

    _createClass(SpriteTween, null, [{
      key: "get",
      value: function get(object) {
        return new Sprite.Tween(object);
      }
    }]);

    function SpriteTween(object) {
      _classCallCheck(this, SpriteTween);

      _get(Object.getPrototypeOf(SpriteTween.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.object = object;
      privates.callback = null;
      privates.action = [];
      privates.doing = false;
    }

    _createClass(SpriteTween, [{
      key: "nextAction",
      value: function nextAction() {
        var privates = internal(this);
        if (privates.doing == false && privates.action.length > 0) {
          var action = privates.action[0];
          privates.action.splice(0, 1);
          switch (action.type) {
            case "to":
              this.toAction(action.attributes, action.time);
              break;
            case "wait":
              this.waitAction(action.time);
              break;
            case "call":
              this.callAction(action.callback);
              break;
            case "promise":
              this.promiseAction(action.callback);
              break;
            default:
              console.error(action);
              throw new Error("Sprite.Tween got invalid action");
          }
        }
      }
    }, {
      key: "toAction",
      value: function toAction(attributes, time) {
        var _this = this;

        var privates = internal(this);
        privates.doing = true;

        var splice = Math.min(100, time);
        var t = time / splice;
        var step = {};

        for (var key in attributes) {
          if (Number.isFinite(attributes[key])) {
            step[key] = attributes[key] - privates.object[key];
            step[key] /= splice;
          }
        }

        var count = 0;
        var inter = setInterval(function () {
          count++;
          if (count >= splice) {
            for (var key in attributes) {
              privates.object[key] = attributes[key];
            }
            clearInterval(inter);
            privates.doing = false;
            _this.nextAction();
          } else {
            for (var key in step) {
              privates.object[key] += step[key];
            }
          }
        }, t);
      }
    }, {
      key: "to",
      value: function to(attributes, time) {
        internal(this).action.push({
          type: "to",
          attributes: attributes,
          time: time
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "promiseAction",
      value: function promiseAction(callback) {
        var _this2 = this;

        this.doing = true;
        callback().then(function () {
          _this2.doing = false;
          _this2.nextAction();
        });
      }
    }, {
      key: "promise",
      value: function promise(callback) {
        internal(this).action.push({
          type: "promise",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "callAction",
      value: function callAction(callback) {
        this.doing = true;
        callback();
        this.doing = false;
        this.nextAction();
      }
    }, {
      key: "call",
      value: function call(callback) {
        internal(this).action.push({
          type: "call",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "waitAction",
      value: function waitAction(time) {
        var _this3 = this;

        var privates = internal(this);
        privates.doing = true;
        setTimeout(function () {
          privates.doing = false;
          _this3.nextAction();
        }, time);
      }
    }, {
      key: "wait",
      value: function wait(time) {
        internal(this).action.push({
          type: "wait",
          time: time
        });
        this.nextAction();
        return this;
      }
    }]);

    return SpriteTween;
  })(Sprite.Event));
})();
//# sourceMappingURL=SpriteTween.js.map

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
 * @fileoverview Sprite.Loader, fetch resource
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Cache all url and element
   */
  var Cache = new Map();
  /**
   * When some url in Downloading, the url is downloading,
   * and other thread want it have to wait
   */
  var Downloading = new Map();

  function Fetch(url, callback, timeout) {

    var type = null;
    if (url.match(/js$/)) {
      type = "js";
    } else if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      type = "audio";
    } else if (url.match(/json$/i)) {
      type = "json";
    } else {
      console.error(url);
      throw new Error("Fetch got an invalid url");
    }

    // finished
    var Finish = function Finish(obj) {
      Cache.set(url, obj);

      if (type == "json") {
        obj = Sprite.copy(obj);
      }

      if (callback) {
        callback(obj);
      }
      if (Downloading.has(url)) {
        var callbacks = Downloading.get(url);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _callback = _step.value;

            if (_callback) {
              _callback(obj);
            }
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

        Downloading["delete"](url);
      }
    };

    if (Cache.has(url)) {
      Finish(Cache.get(url));
      return;
    }

    if (Downloading.has(url)) {
      Downloading.get(url).push(callback);
      return;
    }

    Downloading.set(url, []);

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 15000; // 15 seconds

    switch (type) {
      case "js":
        req.responseType = "text";
        break;
      case "image":
        req.responseType = "blob";
        break;
      case "audio":
        req.responseType = "blob";
        break;
      case "json":
        req.responseType = "json";
        break;
      default:
        console.error(type, url);
        throw new Error("Fetch something wrong");
    }

    if (typeof callback != "function") callback = function () {};

    req.ontimeout = function () {
      if (timeout) {
        console.error(url);
        throw new Error("Sprite.Loader.Fetch timeout twice");
      } else {
        Fetch(url, callback, true);
      }
    };

    var done = false;
    req.onreadystatechange = function () {
      if (req.readyState == 4 && !done) {
        done = true;
        if (req.response) {
          if (type == "js") {
            var fun = null;
            try {
              fun = new Function(req.response);
            } catch (e) {
              console.error(req.response, url);
              throw e;
            }
            Finish(fun);
          } else if (type == "image") {
            (function () {
              var blob = req.response;
              var image = new Image();
              image.onload = function () {
                // window.URL.revokeObjectURL(image.src);
                image.onload = null;
                Finish(image);
              };
              image.src = window.URL.createObjectURL(blob);
            })();
          } else if (type == "audio") {
            (function () {
              var blob = req.response;
              var audio = new Audio();
              audio.oncanplay = function () {
                // 如果reoke掉audio，那么audio.load()方法则不能用了
                // window.URL.revokeObjectURL(audio.src);
                audio.oncanplay = null;
                Finish(audio);
              };
              audio.src = window.URL.createObjectURL(blob);
            })();
          } else if (type == "json") {
            var json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Finish(json);
          }
        } else {
          console.error(req.response, req.readyState, req.status, req.statusText);
          throw new Error("Sprite.Loader.Fetch Error");
        }
      }
    };
    req.send();
  }

  Sprite.assign("load", function () {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      var urls = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;

          if (typeof element == "string") {
            urls.push(element);
          } else if (element instanceof Array) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = element[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var url = _step3.value;

                urls.push(url);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          } else {
            console.error(element, args);
            throw new Error("Sprite.load got invalid argument");
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var done = 0;
      var ret = [];
      ret.length = urls.length;

      var Done = function Done() {
        done++;

        if (done >= ret.length) {
          resolve(ret);
        }
      };

      urls.forEach(function (element, index) {
        Fetch(element, function (result) {
          ret[index] = result;
          Done();
        });
      });
    });
  });
})();
//# sourceMappingURL=SpriteLoad.js.map

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
 * @fileoverview Sprite.Ticker
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var tickerCount = 0;

  var SpriteTicker = (function (_Sprite$Event) {
    _inherits(SpriteTicker, _Sprite$Event);

    function SpriteTicker() {
      _classCallCheck(this, SpriteTicker);

      _get(Object.getPrototypeOf(SpriteTicker.prototype), "constructor", this).call(this);
      this.tick();
    }

    _createClass(SpriteTicker, [{
      key: "tick",
      value: function tick() {
        var _this = this;

        tickerCount++;
        this.emit("tick", false, tickerCount);
        window.requestAnimationFrame(function () {
          _this.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this2 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this2.off("tick", id);
            if (callback) {
              callback();
            }
          }
        });
        return id;
      }
    }, {
      key: "clearAfter",
      value: function clearAfter(id) {
        this.off("tick", id);
      }
    }, {
      key: "whiles",
      value: function whiles(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (callback) {
              callback(true);
            }
            _this3.off("tick", id);
          } else {
            if (callback) {
              callback(false);
            }
          }
        });
        return id;
      }
    }, {
      key: "clearWhiles",
      value: function clearWhiles(id) {
        this.off("tick", id);
      }
    }]);

    return SpriteTicker;
  })(Sprite.Event);

  ;

  Sprite.assign("Ticker", new SpriteTicker());
})();
//# sourceMappingURL=SpriteTicker.js.map

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
 * @fileoverview Class Sprite.Display
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

  var hitCanvas = document.createElement("canvas");
  hitCanvas.width = 1;
  hitCanvas.height = 1;
  var hitContext = hitCanvas.getContext("2d");
  hitContext.clearRect(0, 0, 1, 1);
  var hitData = hitContext.getImageData(0, 0, 1, 1).data;

  /**
   * Class Sprite.Display, base class for all other classes
   * @class
   * @extends Sprite.Event
   */
  Sprite.assign("Display", (function (_Sprite$Event) {
    _inherits(SpriteDisplay, _Sprite$Event);

    /**
     * construct Sprite.Display
     * @constructor
     */

    function SpriteDisplay() {
      _classCallCheck(this, SpriteDisplay);

      _get(Object.getPrototypeOf(SpriteDisplay.prototype), "constructor", this).call(this);
      var privates = internal(this);
      /**
       * x position of object
       @type {number}
       */
      privates.x = 0;
      /**
       * y position of object
       @type {number}
       */
      privates.y = 0;
      /**
       * object's center x
       @type {number}
       */
      privates.centerX = 0;
      /**
       * object's center y
       @type {number}
       */
      privates.centerY = 0;
      /**
       * object's alpha, from 0 to 1, when alpha is 0, object is invisible
       @type {number}
       */
      privates.alpha = 1;
      /**
       * object's visibility
       @type {boolean}
       */
      privates.visible = true;

      privates.width = 0;
      privates.height = 0;
    }

    _createClass(SpriteDisplay, [{
      key: "draw",

      /**
       * Interface, sub-class should overload this method
       * @param {Object} renderer
       */
      value: function draw(renderer) {
        console.error("sub-class should override this function");
        throw new Error("Invalid call Sprite.Display.draw");
      }

      /**
       * Check if the x,y hit this object or not
       * @param {number} x the x position of screen (may 0 to 640) for test
       * @param {number} y the y position of screen (may 0 to 480) for test
       */
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        hitContext.clearRect(0, 0, 1, 1);
        hitContext.save();
        hitContext.translate(-x, -y);
        this.draw(hitContext);
        hitContext.restore();
        var newData = hitContext.getImageData(0, 0, 1, 1).data;

        if (hitData[0] != newData[0] || hitData[1] != newData[1] || hitData[2] != newData[2]) {
          return true;
        }
        return false;
      }
    }, {
      key: "drawPosition",
      value: function drawPosition() {

        var centerX = this.centerX;
        var centerY = this.centerY;
        var x = this.x;
        var y = this.y;
        var alpha = this.alpha;

        var parent = this.parent;
        while (parent) {
          centerX += parent.centerX;
          centerY += parent.centerY;
          x += parent.x;
          y += parent.y;
          alpha *= parent.alpha;
          if (alpha <= 0.001) {
            return null;
          }
          if (parent.visible == false) {
            return null;
          }
          parent = parent.parent;
        }

        return {
          x: x - centerX,
          y: y - centerY,
          alpha: alpha
        };
      }

      /**
       * Draw an image to renderer
       * x, y-----------------------------------------
       * -                                           -
       * -    sx.sy------------                      -
       * -    -               -                      -
       * -    ---swidth,sheight                      -
       * -                                           -
       * ---------------------------------------------image.width, image.height
       * Crop image with sx, sy, swidth and sheight, draw it on renderer
       * x, y will be calculated by this.x, this.y, this.centerX, this.centerY and some parents' attributes
       * @param {Object} renderer A object who has drawImage method, eg. Sprite.Webgl
       * @param {Object} image
       * @param {number} sx
       * @param {number} sy
       * @param {number} swidth
       * @param {number} sheight
       */
    }, {
      key: "drawImage",
      value: function drawImage(renderer, image, sx, sy, swidth, sheight) {
        if (this.visible != true || this.alpha < 0.01) {
          return;
        }

        var d = this.drawPosition();
        if (!d) {
          return;
        }
        renderer.alpha = d.alpha;

        try {
          renderer.drawImage(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
        } catch (e) {
          console.error(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
          throw e;
        }
      }
    }, {
      key: "width",
      get: function get() {
        return internal(this).width;
      },
      set: function set(value) {
        internal(this).width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).height;
      },
      set: function set(value) {
        internal(this).height = value;
      }

      /**
       * @return {number} return x position
       */
    }, {
      key: "x",
      get: function get() {
        return internal(this).x;
      },

      /**
       * @param {number} value new x position
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.x) {
            privates.x = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set x : invalid argument");
        }
      }

      /**
       * @return {number} return y position
       */
    }, {
      key: "y",
      get: function get() {
        return internal(this).y;
      },

      /**
       * @param {number} value new y position
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.y) {
            privates.y = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set y : invalid argument");
        }
      }

      /**
       * @return {number} return center x
       */
    }, {
      key: "centerX",
      get: function get() {
        return internal(this).centerX;
      },

      /**
       * @param {number} value new center x
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerX) {
            privates.centerX = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerX : invalid argument");
        }
      }

      /**
       * @return {number} return center y
       */
    }, {
      key: "centerY",
      get: function get() {
        return internal(this).centerY;
      },

      /**
       * @param {number} value new center y
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerY) {
            privates.centerY = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerY : invalid argument");
        }
      }

      /**
       * @return {number} return alpha
       */
    }, {
      key: "alpha",
      get: function get() {
        var privates = internal(this);
        return privates.alpha;
      },

      /**
       * @param {number} value new alpha
       */
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && (value >= 0 || value <= 1)) {
          if (value != privates.alpha) {
            privates.alpha = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set alpha : invalid argument");
        }
      }

      /**
       * @return {boolean} return alpha
       */
    }, {
      key: "visible",
      get: function get() {
        var privates = internal(this);
        return privates.visible;
      },

      /**
       * @param {boolean} value new visible
       */
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.visible) {
          privates.visible = value;
          this.emit("change");
        }
      }
    }]);

    return SpriteDisplay;
  })(Sprite.Event));
})();
//# sourceMappingURL=SpriteDisplay.js.map

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
 * @fileoverview Class Sprite.Container, it's a general container
 * Contain Sprite.Sheet, Sprite.Bitmap, Sprite.Shape, Sprite.Text, Sprite.Frame or Sprite.Container
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
   * Contain everything which inherit from Sprite.Display
   * @class
   */
  Sprite.assign("Container", (function (_Sprite$Display) {
    _inherits(SpriteContainer, _Sprite$Display);

    /**
     * Construct Sprite.Container
     * @constructor
     */

    function SpriteContainer() {
      _classCallCheck(this, SpriteContainer);

      _get(Object.getPrototypeOf(SpriteContainer.prototype), "constructor", this).call(this);
      var privates = internal(this);
      /**
       * Contain all children element
       * @private
       */
      privates.children = [];
      /**
       * Cached canvas
       */
      privates.cacheCanvas = null;
    }

    /**
     * @return {Array} Children array
     */

    _createClass(SpriteContainer, [{
      key: "findMinMax",
      value: function findMinMax() {
        var minX = null,
            minY = null,
            maxX = null,
            maxY = null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            if (child.findMinMax) {
              var r = child.findMinMax();
              if (minX === null || minX > r.minX) {
                minX = r.minX;
              }
              if (minY === null || minY > r.minY) {
                minY = r.minY;
              }
              if (maxX === null || maxX < r.maxX) {
                maxX = r.maxX;
              }
              if (maxY === null || maxY < r.maxY) {
                maxY = r.maxY;
              }
            } else {
              if (minX === null || minX > child.x) {
                minX = child.x;
              }
              if (minY === null || minY > child.y) {
                minY = child.y;
              }
              if (child.width && child.height) {
                if (maxX === null || maxX < child.x + child.width) {
                  maxX = child.x + child.width;
                }
                if (maxY === null || maxY < child.y + child.height) {
                  maxY = child.y + child.height;
                }
              }
            }
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

        return {
          minX: minX, minY: minY, maxX: maxX, maxY: maxY
        };
      }

      /**
       * Remove canvas cache
       */
    }, {
      key: "clearCache",
      value: function clearCache() {
        var privates = internal(this);
        privates.cacheCanvas = null;
        if (privates.cacheX) {
          delete privates.cacheX;
        }
        if (privates.cacheY) {
          delete privates.cacheY;
        }
        if (privates.cacheWidth) {
          delete privates.cacheWidth;
        }
        if (privates.cacheHeight) {
          delete privates.cacheHeight;
        }
      }

      /**
       * Prerender all children as cache
       * generate a just size cache
       */
    }, {
      key: "cache",
      value: function cache(x, y, width, height) {
        var privates = internal(this);
        if (privates.cacheCanvas) {
          this.clearCache();
        }
        var p = this.parent;
        this.parent = null;

        var r = this.findMinMax();
        if (r && Number.isFinite(r.minX) && Number.isFinite(r.minY) && Number.isFinite(r.maxX) && Number.isFinite(r.maxY)) {
          var _width = r.maxX - r.minX;
          var _height = r.maxY - r.minY;
          var canvas = document.createElement("canvas");
          canvas.width = _width;
          canvas.height = _height;
          var context = canvas.getContext("2d");
          context.save();
          context.translate(-r.minX, -r.minY);
          this.draw(context);
          context.restore();
          privates.cacheX = r.minX;
          privates.cacheY = r.minY;
          privates.cacheWidth = _width;
          privates.cacheHeight = _height;
          privates.cacheCanvas = canvas;
        } else {
          console.error(r);
          throw new Error("Sprite.Container.cache cannot work something wrong");
        }

        this.parent = p;
      }
    }, {
      key: "hitTest",

      /**
       * Hit test
       */
      value: function hitTest(x, y) {
        var privates = internal(this);
        if (this.cacheCanvas) {
          return _get(Object.getPrototypeOf(SpriteContainer.prototype), "hitTest", this).call(this, x, y);
        } else {
          var hitted = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var child = _step2.value;

              var ret = child.hitTest(x, y);
              if (ret instanceof Array) {
                hitted = hitted.concat(ret);
              } else if (ret === true) {
                hitted.push(child);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return hitted;
        }
      }

      /**
       * Draw all children in this container on context
       * @param {Object} renderer Sprite.Webgl/Sprite.Canvas/Context
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        if (this.alpha < 0.01 || this.visible != true) {
          return;
        }

        if (this.cacheCanvas) {
          var x = this.x;
          var y = this.y;
          this.x += privates.cacheX;
          this.y += privates.cacheY;
          this.drawImage(renderer, this.cacheCanvas, 0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
          this.x = x;
          this.y = y;
        } else {
          if (this.children.length > 0) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var child = _step3.value;

                if (child.visible == true && child.alpha >= 0.01) {
                  child.draw(renderer);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }
      }

      /**
      */
    }, {
      key: "hasChild",
      value: function hasChild(element) {
        if (this.children.indexOf(element) != -1) {
          return true;
        }
        return false;
      }

      /**
       * Append one or more children into container
       * eg. c.appendChild(childA) c.appendChild(childA, childB)
       * @param one or more children
       */
    }, {
      key: "appendChild",
      value: function appendChild() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 0) {
          throw new Error("Sprite.Container.appendChild got an invalid arguments");
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = args[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var element = _step4.value;

            if (element instanceof Sprite.Display == false) {
              console.error(element);
              throw new Error("Sprite.Container.appendChild only accept Sprite.Display or it's sub-class");
            }
            element.parent = this;
            this.children.push(element);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.emit("addedChildren");
      }

      /**
       * Append one or more children into container at certain position
       * eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
       * @param one or more children
       */
    }, {
      key: "appendChildAt",
      value: function appendChildAt() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 1) {
          console.log(arguments, this);
          throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
        }

        var index = args[0];
        for (var i = 1, len = args.length; i < len; i++) {
          if (args[i] instanceof Sprite.Display == false) {
            console.error(args[i]);
            throw new Error("Sprite.Container.appendChildAt only can accept Sprite.Display or it's sub-class");
          }
          args[i].parent = this;
          this.children.splice(index, 0, args[i]);
        }

        this.emit("addedChildren");
      }

      /**
       * Remove one child from a container
       * eg. c.removeChild(childA)
       * @param {Object} element The child you want to remove
       * @return {boolean} If found and removed element, return true, otherwise, false
       */
    }, {
      key: "removeChild",
      value: function removeChild(element) {
        var index = this.children.indexOf(element);
        if (index != -1) {
          // found it
          this.children[index].parent = null;
          this.children.splice(index, 1);
          this.emit("removedChildren");
          return true;
        } else {
          // not found, element not a child
          return false;
        }
      }

      /**
       * remove all children of container
       */
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = privates.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var child = _step5.value;

            child.parent = null;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        privates.children = [];
        this.clearCache();
        this.emit("removedChildren");
      }
    }, {
      key: "children",
      get: function get() {
        return internal(this).children;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.children readonly");
      }

      /**
       * @return {Object} Cached canvas
       */
    }, {
      key: "cacheCanvas",
      get: function get() {
        return internal(this).cacheCanvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheCanvas readonly");
      }
    }, {
      key: "cacheX",
      get: function get() {
        return internal(this).cacheX;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheX readonly");
      }
    }, {
      key: "cacheY",
      get: function get() {
        return internal(this).cacheY;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheY readonly");
      }
    }]);

    return SpriteContainer;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteContainer.js.map

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
      key: "releaseRenderer",
      value: function releaseRenderer() {
        internal(this).renderer.release();
      }
    }, {
      key: "filter",
      value: function filter(name, value) {
        return internal(this).renderer.filter(name, value);
      }
    }, {
      key: "findHit",
      value: function findHit(event) {
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
        this.emit("beforeDraw");
        this.draw(this.renderer);
        this.emit("afterDraw");
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
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

            child.draw(renderer);
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
      }
    }, {
      key: "renderer",
      get: function get() {
        return internal(this).renderer;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage renderer readonly");
      }
    }, {
      key: "rendererType",
      get: function get() {
        return internal(this).rendererType;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.rendererType readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return internal(this).renderer.width;
      },
      set: function set(value) {
        internal(this).renderer.width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).renderer.height;
      },
      set: function set(value) {
        internal(this).renderer.height = value;
      }
    }, {
      key: "color",
      get: function get() {
        return internal(this).renderer.color;
      },
      set: function set(value) {
        internal(this).renderer.color = value;
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
 * @fileoverview Define the Sprite.Text to show text in game
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

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  /**
   * Class Sprite.Text, contain text
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Text", (function (_Sprite$Display) {
    _inherits(SpriteText, _Sprite$Display);

    /**
     * construct Sprite.Text
     * @constructor
     */

    function SpriteText(config) {
      _classCallCheck(this, SpriteText);

      _get(Object.getPrototypeOf(SpriteText.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      this.generate();
    }

    _createClass(SpriteText, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var text = new Text({
          text: privates.text,
          maxWidth: privates.maxWidth,
          color: privates.color,
          fontSize: privates.fontSize,
          fontFamily: privates.fontFamily
        });
        text.x = this.x;
        text.y = this.y;
        text.centerX = this.centerX;
        text.centerY = this.centerY;
        text.alpha = this.alpha;
        text.visible = this.visible;
        return text;
      }
    }, {
      key: "generate",
      value: function generate() {
        var privates = internal(this);
        textContext.font = this.fontSize + "px " + privates.fontFamily;
        // "龍" is the max-width & max-height Chinese word I think
        var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
        this.width = 0;

        // find the real-maximum-width of multiline text, base user's maxWidth
        var lines = [];
        var lineText = "";
        for (var i = 0, len = this.text.length; i < len; i++) {
          if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
            lines.push(lineText);
            lineText = this.text[i];
          } else {
            lineText += this.text[i];
          }
          if (textContext.measureText(lineText).width > this.width) this.width = Math.ceil(textContext.measureText(lineText).width);
        }

        if (lineText.length) {
          lines.push(lineText);
        }

        this.height = lines.length * lineHeight;

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext("2d");
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "top";
        // draw each line
        lines.forEach(function (element, index) {
          context.fillText(element, canvas.width / 2, index * lineHeight);
        });

        privates.image = null;
        privates.image = canvas;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var privates = internal(this);
        var image = privates.image;
        if (image && image.width > 0 && image.height > 0) {
          this.drawImage(context, image, 0, 0, image.width, image.height);
        }
      }
    }, {
      key: "text",
      get: function get() {
        var privates = internal(this);
        return privates.text;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.text) {
          privates.text = value;
          this.generate();
        }
      }
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        return privates.color;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.color) {
          privates.color = value;
          this.generate();
        }
      }
    }, {
      key: "fontSize",
      get: function get() {
        var privates = internal(this);
        return privates.fontSize;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.fontSize) {
          privates.fontSize = value;
          this.generate();
        }
      }
    }, {
      key: "fontFamily",
      get: function get() {
        return internal(this).fontFamily;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.fontFamily) {
          privates.fontFamily = value;
          this.generate();
        }
      }
    }]);

    return SpriteText;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteText.js.map

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
 * @fileoverview Class Sprite.Frame
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
   * Class Sprite.Frame, a frame of Sprite.Sheet
   * @class
   */
  Sprite.assign("Frame", (function (_Sprite$Display) {
    _inherits(SpriteFrame, _Sprite$Display);

    function SpriteFrame(image, sx, sy, width, height) {
      _classCallCheck(this, SpriteFrame);

      _get(Object.getPrototypeOf(SpriteFrame.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      this.width = width;
      this.height = height;
    }

    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */

    _createClass(SpriteFrame, [{
      key: "print",
      value: function print() {
        console.log(internal(this));
      }

      /**
       * @return {Object} Clone this Sprite.Frame
       */
    }, {
      key: "clone",
      value: function clone() {
        var frame = new Sprite.Frame(this.image, this.sx, this.sy, this.width, this.height);
        frame.x = this.x;
        frame.y = this.y;
        frame.parent = this.parent;
        return frame;
      }

      /**
       * @param {Object} renderer
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        this.drawImage(renderer, this.image, this.sx, this.sy, this.width, this.height);
      }
    }, {
      key: "image",
      get: function get() {
        var privates = internal(this);
        return privates.image;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.image readonly");
      }

      /**
       * @return {number} Return sx
       */
    }, {
      key: "sx",
      get: function get() {
        var privates = internal(this);
        return privates.sx;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sx readonly");
      }

      /**
       * @return {number} Return sy
       */
    }, {
      key: "sy",
      get: function get() {
        var privates = internal(this);
        return privates.sy;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sy readonly");
      }
    }]);

    return SpriteFrame;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteFrame.js.map

/*import "js/Sprite/SpriteDisplay";

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
 * @fileoverview Class Sprite.Sheet, maybe the most importent class
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
   * Class Sprite.Sheet, contain sprite's sheet and it's animation
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Sheet", (function (_Sprite$Display) {
    _inherits(SpriteSheet, _Sprite$Display);

    /**
     * construct Sprite.Sheet
     * @param config
     * @constructor
     */

    function SpriteSheet(config) {
      _classCallCheck(this, SpriteSheet);

      _get(Object.getPrototypeOf(SpriteSheet.prototype), "constructor", this).call(this);
      var privates = internal(this);

      if (!config.images || !config.images.length || !Number.isFinite(config.width) || config.width <= 0 || config.width > 4096 || !Number.isFinite(config.height) || config.height <= 0 || config.height > 4096) {
        console.error(config);
        throw new Error("Sprite.Sheet.constructor get invalid arguments");
      }

      /**
       * Contain one or more images
       @type {Array}
       @private
       */
      privates.images = config.images;
      /**
       * Width of each frame
       @type {number}
       @private
       */
      privates.tilewidth = config.width;
      this.width = config.width;
      /**
       * Height of each frame
       @type {number}
       @private
       */
      privates.tileheight = config.height;
      this.height = config.height;
      /**
       * Animations of this sprite sheet, eg. { "walkdown": [0, 2, "", 40], "walkup", [3, 5, "", 40] }
       @type {Object}
       @private
       */
      privates.animations = config.animations || {};
      /**
       * Current animation's name, eg. "walkdown", "attackright"
       @type {string}
       @private
       */
      privates.currentAnimation = null;
      /**
       * Current frame number, eg. 0, 1, 2, 3
       @type {number}
       @private
       */
      privates.currentFrame = 0;
      /**
       * If animationTimer is not null, it points an animation is running
       * it will be null or an handler from setInterval
       @type {Object}
       @private
       */
      privates.animationTimer = null;

      /**
       * The number of frames we have
       @type {number}
       @private
       */
      privates.frameCount = 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;

          if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, not Image or Canvas");
          }

          if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
            console.error(image, privates, this);
            throw new Error("Sprite.Sheet got invalid image, invalid width or height");
          }

          var col = Math.floor(image.width / privates.tilewidth);
          var row = Math.floor(image.height / privates.tileheight);
          privates.frameCount += col * row;
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
    }

    /**
     * Clone Sprite.Sheet object itself
     * @return {Object} Return an copy of this
     */

    _createClass(SpriteSheet, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var sheet = new Sprite.Sheet({
          images: privates.images,
          width: privates.tilewidth,
          height: privates.tileheight,
          animations: privates.animations
        });
        sheet.x = this.x;
        sheet.y = this.y;
        sheet.centerX = this.centerX;
        sheet.centerY = this.centerY;
        sheet.play(this.currentFrame);
        sheet.alpha = this.alpha;
        sheet.visible = this.visible;
        return sheet;
      }

      /**
       * @return {boolean} Return false if an animation is running
       */
    }, {
      key: "play",

      /**
       * Play a frame or an animation
       * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
       */
      value: function play(choice) {
        var _this = this;

        var privates = internal(this);
        if (privates.animationTimer) {
          clearInterval(privates.animationTimer);
          privates.animationTimer = null;
        }

        if (Number.isInteger(choice)) {
          // Argument points a frame
          privates.currentFrame = choice;
          this.emit("change");
        } else if (typeof choice == "string") {
          var _ret = (function () {
            // Argument points an animation name
            var animation = privates.animations[choice];

            if (!animation) {
              // if animation is not exist
              console.error(animation, privates.animations, choice);
              throw new Error("Sprite.Sheet.play invalid animation");
            }

            // if animation is single frame number
            if (Number.isFinite(animation)) {
              privates.currentAnimation = choice;
              return {
                v: _this.play(animation)
              };
            }

            // start frame number
            var begin = null;
            // finish frame number
            var end = null;
            // what action after animation finished
            var next = null;
            // the space between each frame, ms
            var time = null;

            if (animation instanceof Array) {
              // if animation format is like [begin, end, next, time]
              begin = animation[0];
              end = animation[1];
              next = animation[2];
              time = animation[3];
            } else if (animation.frames && animation.frames instanceof Array) {
              // if animation format is like { frames: [begin, end], next: "next", speed: "time" }
              begin = animation.frames[0];
              end = animation.frames[animation.frames.length - 1];
              next = animation.next;
              time = animation.speed;
            }

            if ( // Data ensure
            !Number.isFinite(begin) || begin < 0 || begin >= privates.frameCount || !Number.isFinite(end) || end < 0 || end >= privates.frameCount || !Number.isFinite(time) || time <= 0) {
              console.error(begin, end, time, _this);
              throw new Error("Sprite.Sheet.play Invalid animation data");
            }

            // Play first frame in animation
            privates.currentAnimation = choice;
            privates.currentFrame = begin;
            _this.emit("change");

            // Play other frame in animation
            privates.animationTimer = setInterval(function () {
              privates.currentFrame++;

              if (privates.currentFrame > end) {
                clearInterval(privates.animationTimer);
                privates.animationTimer = null;

                if (next && next.length && privates.animations[next]) {
                  _this.play(next);
                } else {
                  privates.currentFrame--;
                }
                _this.emit("animationend");
              }

              _this.emit("change");
            }, time);
          })();

          if (typeof _ret === "object") return _ret.v;
        } else {
          console.error(choice, internal(this).animations, this);
          throw new Error("Sprite.Sheet.play has an invalid argument");
        }
      }

      /**
       * Get a certain frame
       * @param {number} index The index of frame
       * @return {Object} An Sprite.Frame object
       */
    }, {
      key: "getFrame",
      value: function getFrame(index) {
        var privates = internal(this);
        if (!Number.isInteger(index)) {
          index = privates.currentFrame;
        }

        if (index < 0 || index >= privates.frameCount) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame index out of range");
        }

        var frame = null;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var image = _step2.value;

            var col = Math.floor(image.width / privates.tilewidth);
            var row = Math.floor(image.height / privates.tileheight);
            if (index < col * row) {
              // which row
              var j = Math.floor(index / col);
              // which column
              var i = index - col * j;
              frame = new Sprite.Frame(image, i * privates.tilewidth, // x
              j * privates.tileheight, // y
              privates.tilewidth, privates.tileheight);
              frame.parent = this;
              break;
            }
            index -= col * row;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (!frame) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame unknown error");
        }

        return frame;
      }

      /**
       * Draw this sheet on certain renderer
       * @param {Object} renderer A renderer engine, eg. Sprite.Webgl
       */
    }, {
      key: "draw",
      value: function draw(renderer) {
        if (this.visible == false || this.alpha <= 0.01) {
          return;
        }

        var privates = internal(this);
        var frame = this.getFrame(this.currentFrame);

        if (!frame || !frame.image) {
          console.error(frame, this.currentFrame, this);
          throw new Error("Sprite.Sheet.draw invalid frame");
        }

        frame.draw(renderer);
      }
    }, {
      key: "paused",
      get: function get() {
        var privates = internal(this);
        if (privates.animationTimer) {
          return false;
        }
        return true;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.paused readonly");
      }

      /**
       * @return {number} Return current frame number
       */
    }, {
      key: "currentFrame",
      get: function get() {
        var privates = internal(this);
        return privates.currentFrame;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentFrame readonly");
      }

      /**
       * @return {string} Return
       */
    }, {
      key: "currentAnimation",
      get: function get() {
        var privates = internal(this);
        return privates.currentAnimation;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentAnimation readonly");
      }
    }]);

    return SpriteSheet;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteSheet.js.map

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
 * @fileoverview Class Sprite.Input
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var keyTable = {
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "esc": 27,
    "space": 32,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "A": 65, // A
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90, // Z
    "a": 97, // a
    "b": 98,
    "c": 99,
    "d": 100,
    "e": 101,
    "f": 102,
    "g": 103,
    "h": 104,
    "i": 105,
    "j": 106,
    "k": 107,
    "l": 108,
    "m": 109,
    "n": 110,
    "o": 111,
    "p": 112,
    "q": 113,
    "r": 114,
    "s": 115,
    "t": 116,
    "u": 117,
    "v": 118,
    "w": 119,
    "x": 120,
    "y": 121,
    "z": 122 // z
  };

  var pressed = new Map();

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    pressed.set(keyCode, true);
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    if (pressed.has(keyCode)) {
      pressed["delete"](keyCode);
    }
  });

  /**
   * Sprite.Input, only has static methods
   * @class
   */
  Sprite.assign("Input", (function () {
    function SpriteInput() {
      _classCallCheck(this, SpriteInput);
    }

    _createClass(SpriteInput, null, [{
      key: "isPressed",

      /**
       * @param {string} key Key-string ('A', 'a') or key-number (65, 97)
       * @return {boolean} If the key is pressing, return true, otherwise, false
       */
      value: function isPressed(key) {
        if (Number.isFinite(key)) {
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else if (typeof key == "string") {
          key = keyTable[key];
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else {
          console.error(key);
          throw new Error("Sprite.Input.isPressed got invalid argument");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        if (callback) {
          window.addEventListener("keypress", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
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
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenPress got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        if (callback) {
          window.addEventListener("keydown", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenDown got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */
    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        if (callback) {
          window.addEventListener("keyup", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenUp got invalid arguments");
        }
      }
    }]);

    return SpriteInput;
  })());
})();
//# sourceMappingURL=SpriteInput.js.map

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
//# sourceMappingURL=SpriteShape.js.map

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
 * @fileoverview Define Sprite.Bitmap
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

  Sprite.assign("Bitmap", (function (_Sprite$Display) {
    _inherits(SpriteBitmap, _Sprite$Display);

    /**
     * Sprite.Bitmap's constructor
     * @constructor
     */

    function SpriteBitmap(image) {
      _classCallCheck(this, SpriteBitmap);

      _get(Object.getPrototypeOf(SpriteBitmap.prototype), "constructor", this).call(this);

      if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
        console.error(image, this);
        throw new Error("Sprite.Bitmap got invalid image, not Image or Canvas");
      }

      if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
        console.error(image);
        throw new Error("Sprite.Bitmap got invalid image, invalid width or height");
      }

      internal(this).image = image;
    }

    _createClass(SpriteBitmap, [{
      key: "clone",
      value: function clone() {
        var bitmap = new Sprite.Bitmap(internal(this).image);
        bitmap.x = this.x;
        bitmap.y = this.y;
        bitmap.centerX = this.centerX;
        bitmap.centerY = this.centerY;
        bitmap.alpha = this.alpha;
        bitmap.visible = this.visible;
        return bitmap;
      }

      /**
       * @return {Image} Return Sprite.Bitmap's image
       */
    }, {
      key: "draw",

      /**
       * @param {Object} renderer Draw image on the renderer
       */
      value: function draw(renderer) {
        if (this.alpha <= 0.01 || this.visible != true) {
          return;
        }
        var image = internal(this).image;
        this.drawImage(renderer, image, 0, 0, image.width, image.height);
      }
    }, {
      key: "image",
      get: function get() {
        return internal(this).image;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.image readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's width
       */
    }, {
      key: "width",
      get: function get() {
        return internal(this).image.width;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.width readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's height
       */
    }, {
      key: "height",
      get: function get() {
        return internal(this).image.height;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.height readonly");
      }
    }]);

    return SpriteBitmap;
  })(Sprite.Display));
})();
//# sourceMappingURL=SpriteBitmap.js.map
