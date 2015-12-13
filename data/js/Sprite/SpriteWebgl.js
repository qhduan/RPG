"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      console.log("Sprite.Webgl inited, max texture size: %d", gl.getParameter(gl.MAX_TEXTURE_SIZE));
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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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
      }
      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      ,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlV2ViZ2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBR2xDLFdBQVMsS0FBSyxDQUFFLEtBQUssRUFBRTtBQUNyQixXQUFPLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxBQUFDLEtBQUssR0FBRyxDQUFDLEdBQUksS0FBSyxDQUFBLEtBQU0sQ0FBQyxDQUFDO0dBQ2pEOzs7Ozs7Ozs7O0FBQUEsQUFXRCxNQUFJLGVBQWUsc1pBZ0JqQixDQUFDOztBQUVILE1BQUksaUJBQWlCLHd5QkF1Q25COzs7Ozs7QUFBQyxBQU1ILFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztpQkFBUSxXQUFXOzs7Ozs7O2dDQU1wQjtBQUNoQixZQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFlBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNQLGdCQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDekM7QUFDRCxZQUFJLENBQUMsRUFBRSxFQUFFO0FBQ1AsaUJBQU8sS0FBSyxDQUFDO1NBQ2Q7QUFDRCxlQUFPLElBQUksQ0FBQztPQUNiOzs7Ozs7Ozs7QUFNRCxhQXRCMkIsV0FBVyxDQXNCekIsS0FBSyxFQUFFLE1BQU0sRUFBRTs0QkF0QkQsV0FBVzs7QUF1QnBDLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxZQUFNLENBQUMsS0FB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SyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixnQkFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQzNEO09BQ0Y7OzswQkFFYTtBQUNaLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM5Qjt3QkFFVyxLQUFLLEVBQUU7QUFDakIsZUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0IsY0FBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQ3JEOzs7V0FuWDBCLFdBQVc7T0FxWHRDLENBQUM7Q0FJSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVXZWJnbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEZWZpbmUgdGhlIFNwcml0ZS5XZWJnbCwgYSByZW5kZXJlciwgb3RoZXIgY2hvaWNlIGZyb20gU3ByaXRlLkNhbnZhc1xuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG5cbiAgZnVuY3Rpb24gaXNQT1QgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID4gMCAmJiAoKHZhbHVlIC0gMSkgJiB2YWx1ZSkgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICBVc2UgbWVkaXVtcCBwcmVjaXNpb24gaW4gV2ViR0wgd2hlbiBwb3NzaWJsZVxuICAgIEhpZ2hwIGluIGZyYWdtZW50IHNoYWRlcnMgaXMgYW4gb3B0aW9uYWwgcGFydCBvZiB0aGUgT3BlbkdMIEVTIDIuMCBzcGVjLFxuICAgIHNvIG5vdCBhbGwgaGFyZHdhcmUgc3VwcG9ydHMgaXRcbiAgICBsb3dwIG1lZGl1bXAgaGlnaHBcbiAgICBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdXBkYXRlcy8yMDExLzEyL1VzZS1tZWRpdW1wLXByZWNpc2lvbi1pbi1XZWJHTC13aGVuLXBvc3NpYmxlP2hsPWVuXG5cbiAgICBicmlnaHRuZXNzIGFuZCBjb250cmFzdCdzIGZvcm11bGFyIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2V2YW53L2dsZnguanNcbiAgKi9cbiAgbGV0IHZlcnRleFNoYWRlclNyYyA9IGBcbiAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gIGF0dHJpYnV0ZSB2ZWMyIGFfdGV4Q29vcmQ7XG4gIHZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xuXG4gIGF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXg7XG4gIHVuaWZvcm0gdmVjMiByZXNvbHV0aW9uO1xuXG4gIHVuaWZvcm0gdmVjNCBwb3NpdGlvbjtcblxuICB2b2lkIG1haW4odm9pZCkge1xuICAgICB2ZWMyIGEgPSBhVmVydGV4ICogKHBvc2l0aW9uLnp3IC8gcmVzb2x1dGlvbikgKyAocG9zaXRpb24ueHkgLyByZXNvbHV0aW9uKTtcbiAgICAgdmVjMiBiID0gYSAqIDIuMCAtIDEuMDtcblxuICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoYiAqIHZlYzIoMS4wLCAtMS4wKSwgMC4wLCAxLjApO1xuICAgICB2X3RleENvb3JkID0gYV90ZXhDb29yZDtcbiAgfWA7XG5cbiAgbGV0IGZyYWdtZW50U2hhZGVyU3JjID0gYFxuICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcblxuICB1bmlmb3JtIHZlYzQgY3JvcDtcbiAgdW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xuICB1bmlmb3JtIGZsb2F0IGFscGhhO1xuICB1bmlmb3JtIGZsb2F0IGNvbnRyYXN0O1xuXG4gIHVuaWZvcm0gc2FtcGxlcjJEIGltYWdlO1xuXG4gIC8vIHRoZSB0ZXhDb29yZHMgcGFzc2VkIGluIGZyb20gdGhlIHZlcnRleCBzaGFkZXIuXG4gIHZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xuXG4gIHZvaWQgbWFpbih2b2lkKSB7XG5cbiAgICB2ZWMyIHQgPSB2X3RleENvb3JkO1xuICAgIHQueCAqPSBjcm9wLno7XG4gICAgdC55ICo9IGNyb3AudztcbiAgICB0ICs9IGNyb3AueHk7XG5cbiAgICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRChpbWFnZSwgdCkucmdiYTtcblxuICAgICBpZiAoY29udHJhc3QgIT0gMC4wKSB7XG4gICAgICAgaWYgKGNvbnRyYXN0ID4gMC4wKSB7XG4gICAgICAgICBjb2xvci54eXogPSAoY29sb3IueHl6IC0gMC41KSAvICgxLjAgLSBjb250cmFzdCkgKyAwLjU7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGNvbG9yLnh5eiA9IChjb2xvci54eXogLSAwLjUpICogKDEuMCArIGNvbnRyYXN0KSArIDAuNTtcbiAgICAgICB9XG4gICAgIH1cblxuICAgICBpZiAoYnJpZ2h0bmVzcyAhPSAwLjApIHtcbiAgICAgICBjb2xvci54eXogKz0gYnJpZ2h0bmVzcztcbiAgICAgfVxuXG4gICAgIGlmIChhbHBoYSAhPSAxLjApIHtcbiAgICAgICBjb2xvci5hICo9ICBhbHBoYTtcbiAgICAgfVxuXG4gICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xuICB9YDtcblxuICAvKipcbiAgICogUmVuZGVyZXIgdXNpbmcgd2ViZ2xcbiAgICogQGNsYXNzXG4gICAqL1xuICBTcHJpdGUuYXNzaWduKFwiV2ViZ2xcIiwgY2xhc3MgU3ByaXRlV2ViZ2wge1xuXG4gICAgLyoqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRoZSBicm93c2VyIHdoZXRoZXIgb3Igbm90IHN1cHBvcnQgV2ViR0xcbiAgICAgKi9cbiAgICBzdGF0aWMgc3VwcG9ydCAoKSB7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG4gICAgICBpZiAoIWdsKSB7XG4gICAgICAgIGNhbnZhcy5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuICAgICAgfVxuICAgICAgaWYgKCFnbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSByZW5kZXJlciB3aWR0aCBjZXJ0YWluIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAod2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG5cbiAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY2FudmFzLndpZHRoID0gd2lkdGggfHwgNjQwO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCB8fCA0ODA7XG5cbiAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICBhbnRpYWxpYXM6IGZhbHNlLFxuICAgICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwgb3B0aW9ucyk7XG4gICAgICBpZiAoIWdsKSB7XG4gICAgICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIiwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBwcml2YXRlcy5nbCA9IGdsO1xuXG4gICAgICBpZiAoIWdsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5XZWJnbCB3ZWJnbCBpcyBub3Qgc3VwcG9ydGVkXCIpO1xuICAgICAgfVxuXG4gICAgICBwcml2YXRlcy5jb2xvciA9IFswLCAwLCAwXTtcbiAgICAgIHByaXZhdGVzLmZpbHRlciA9IG5ldyBNYXAoKTtcbiAgICAgIHByaXZhdGVzLnRleHR1cmVDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICAgIHByaXZhdGVzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgIHByaXZhdGVzLm1heFRleHR1cmVTaXplID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9URVhUVVJFX1NJWkUpO1xuXG4gICAgICBnbC52aWV3cG9ydCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICBsZXQgdmVydFNoYWRlck9iaiA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcbiAgICAgIGxldCBmcmFnU2hhZGVyT2JqID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG4gICAgICBnbC5zaGFkZXJTb3VyY2UodmVydFNoYWRlck9iaiwgdmVydGV4U2hhZGVyU3JjKTtcbiAgICAgIGdsLnNoYWRlclNvdXJjZShmcmFnU2hhZGVyT2JqLCBmcmFnbWVudFNoYWRlclNyYyk7XG4gICAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRTaGFkZXJPYmopO1xuICAgICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnU2hhZGVyT2JqKTtcblxuICAgICAgbGV0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydFNoYWRlck9iaik7XG4gICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlck9iaik7XG5cbiAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuICAgICAgZ2wuY3VsbEZhY2UoZ2wuQkFDSyk7XG4gICAgICBnbC5mcm9udEZhY2UoZ2wuQ1cpO1xuICAgICAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XG4gICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgZ2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICBwcml2YXRlcy5jcm9wTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwiY3JvcFwiKTtcbiAgICAgIHByaXZhdGVzLmJyaWdodG5lc3NMb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJicmlnaHRuZXNzXCIpO1xuICAgICAgcHJpdmF0ZXMuY29udHJhc3RMb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJjb250cmFzdFwiKTtcbiAgICAgIHByaXZhdGVzLmFscGhhTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwiYWxwaGFcIik7XG4gICAgICBwcml2YXRlcy5yZXNvbHV0aW9uTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwicmVzb2x1dGlvblwiKTtcbiAgICAgIGdsLnVuaWZvcm0yZihwcml2YXRlcy5yZXNvbHV0aW9uTG9jLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICBwcml2YXRlcy5wb3NpdGlvbkxvYyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcInBvc2l0aW9uXCIpO1xuXG5cbiAgICAgIHByaXZhdGVzLnRMb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBcImFfdGV4Q29vcmRcIik7XG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcml2YXRlcy50TG9jKTtcbiAgICAgIHByaXZhdGVzLnRleENvb3JkQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcHJpdmF0ZXMudGV4Q29vcmRCdWZmZXIpO1xuICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwcml2YXRlcy50TG9jLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMCwgMSxcbiAgICAgICAgICAgIDAsIDAsXG4gICAgICAgICAgICAxLCAwLFxuICAgICAgICAgICAgMSwgMVxuICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICAgICAgZ2wuU1RBVElDX0RSQVdcbiAgICAgICk7XG5cbiAgICAgIHByaXZhdGVzLnZMb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBcImFWZXJ0ZXhcIik7XG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcml2YXRlcy52TG9jKTtcbiAgICAgIHByaXZhdGVzLnZlcnRleEJ1ZmYgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwcml2YXRlcy52ZXJ0ZXhCdWZmKTtcbiAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgIGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgMCwgMSxcbiAgICAgICAgICAwLCAwLFxuICAgICAgICAgIDEsIDAsXG4gICAgICAgICAgMSwgMVxuICAgICAgICBdKSxcbiAgICAgICAgZ2wuU1RBVElDX0RSQVdcbiAgICAgICk7XG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcml2YXRlcy52TG9jKTtcbiAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocHJpdmF0ZXMudkxvYywgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgICAgcHJpdmF0ZXMuY3VycmVudFRleHR1cmUgPSBudWxsO1xuXG4gICAgICAvLyBzZXR0aW5nLCBkb24ndCBtb3ZlXG4gICAgICB0aGlzLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMCk7XG4gICAgICB0aGlzLmZpbHRlcihcImNvbnRyYXN0XCIsIDApO1xuICAgICAgdGhpcy5hbHBoYSA9IDE7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiU3ByaXRlLldlYmdsIGluaXRlZCwgbWF4IHRleHR1cmUgc2l6ZTogJWRcIixcbiAgICAgICAgZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9URVhUVVJFX1NJWkUpKTtcbiAgICB9XG5cbiAgICBkcmF3SW1hZ2U5IChpbWFnZSwgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBnbCA9IHByaXZhdGVzLmdsO1xuXG4gICAgICBsZXQgdGV4dHVyZSA9IHRoaXMuY3JlYXRlVGV4dHVyZShnbCwgaW1hZ2UpO1xuICAgICAgaWYgKHByaXZhdGVzLmN1cnJlbnRUZXh0dXJlICE9IHRleHR1cmUpIHtcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG4gICAgICAgIHByaXZhdGVzLmN1cnJlbnRUZXh0dXJlID0gdGV4dHVyZTtcbiAgICAgIH1cblxuICAgICAgZ2wudW5pZm9ybTRmKHByaXZhdGVzLmNyb3BMb2MsXG4gICAgICAgIHN4L2ltYWdlLndpZHRoLCBzeS9pbWFnZS5oZWlnaHQsIHN3L2ltYWdlLndpZHRoLCBzaC9pbWFnZS5oZWlnaHQpO1xuICAgICAgZ2wudW5pZm9ybTRmKHByaXZhdGVzLnBvc2l0aW9uTG9jLCBkeCwgZHksIGR3LCBkaCk7XG5cbiAgICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVfRkFOLCAwLCA0KTtcbiAgICB9XG5cbiAgICByZWxlYXNlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgZm9yIChsZXQgdGV4dHVyZSBvZiBwcml2YXRlcy50ZXh0dXJlQ2FjaGUudmFsdWVzKCkpIHtcbiAgICAgICAgcHJpdmF0ZXMuZ2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgIH1cbiAgICAgIHByaXZhdGVzLnRleHR1cmVDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVUZXh0dXJlIChnbCwgaW1hZ2UpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLnRleHR1cmVDYWNoZS5oYXMoaW1hZ2UpKSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy50ZXh0dXJlQ2FjaGUuZ2V0KGltYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xuICAgICAgICBsZXQgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgIGdsLlJHQkEsICBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWFnZSk7XG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QpO1xuXG4gICAgICAgIC8vIHRlc3Qgd2lkdGgmaGVpZ2h0IGlzIHBvd2VyIG9mIDIsIGVnLiAyNTYsIDUxMiwgMTAyNFxuICAgICAgICAvLyBtYXkgc3BlZWQgdXBcbiAgICAgICAgaWYgKGlzUE9UKGltYWdlLndpZHRoKSAmJiBpc1BPVChpbWFnZS5oZWlnaHQpKSB7XG4gICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUl9NSVBNQVBfTElORUFSKTtcbiAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XG4gICAgICAgIH1cblxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcbiAgICAgICAgcHJpdmF0ZXMudGV4dHVyZUNhY2hlLnNldChpbWFnZSwgdGV4dHVyZSk7XG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRyYXdJbWFnZSAoaW1hZ2UsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gOSkge1xuICAgICAgICAvLyBhbGwgcmlnaHRcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA1KSB7XG4gICAgICAgIC8vIGRyYXdJbWFnZSAoaW1hZ2UsIGR4LCBkeSwgZHcsIGRoKTtcbiAgICAgICAgZHggPSBzeDtcbiAgICAgICAgZHkgPSBzeTtcbiAgICAgICAgZHcgPSBzdztcbiAgICAgICAgZGggPSBzaDtcbiAgICAgICAgc3ggPSAwO1xuICAgICAgICBzeSA9IDA7XG4gICAgICAgIHN3ID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgIHNoID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcbiAgICAgICAgLy8gZHJhd0ltYWdlIChpbWFnZSwgZHgsIGR5KTtcbiAgICAgICAgZHggPSBzeDtcbiAgICAgICAgZHkgPSBzeTtcbiAgICAgICAgZHcgPSBpbWFnZS53aWR0aDtcbiAgICAgICAgZGggPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgIHN4ID0gMDtcbiAgICAgICAgc3kgPSAwO1xuICAgICAgICBzdyA9IGltYWdlLndpZHRoO1xuICAgICAgICBzaCA9IGltYWdlLmhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYXJndW1lbnRzLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsLmRyYXdJbWFnZSBpbnZhbGlkIGFyZ3VtZW50c1wiKTtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgIGlmIChkeCA+IHRoaXMud2lkdGggfHwgZHkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICgoZHggKyBkdykgPCAwIHx8IChkeSArIGRoKSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICFOdW1iZXIuaXNJbnRlZ2VyKGltYWdlLndpZHRoKSB8fFxuICAgICAgICAhTnVtYmVyLmlzSW50ZWdlcihpbWFnZS5oZWlnaHQpIHx8XG4gICAgICAgIGltYWdlLndpZHRoIDw9IDAgfHxcbiAgICAgICAgaW1hZ2UuaGVpZ2h0IDw9IDAgfHxcbiAgICAgICAgaW1hZ2Uud2lkdGggPiBwcml2YXRlcy5tYXhUZXh0dXJlU2l6ZSB8fFxuICAgICAgICBpbWFnZS5oZWlnaHQgPiBwcml2YXRlcy5tYXhUZXh0dXJlU2l6ZVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoaW1hZ2UsIHByaXZhdGVzLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsLmRyYXdJbWFnZSBpbnZhbGlkIGltYWdlXCIpO1xuICAgICAgfVxuICAgICAgKi9cblxuICAgICAgdGhpcy5kcmF3SW1hZ2U5KGltYWdlLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgpO1xuICAgIH1cblxuICAgIGdldCBhbHBoYSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5hbHBoYTtcbiAgICB9XG5cbiAgICBzZXQgYWxwaGEgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBnbCA9IHByaXZhdGVzLmdsO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiZcbiAgICAgICAgIWlzTmFOKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+PSAwICYmXG4gICAgICAgIHZhbHVlIDw9IDFcbiAgICAgICkge1xuICAgICAgICBpZiAodmFsdWUgIT0gcHJpdmF0ZXMuYWxwaGEpIHtcbiAgICAgICAgICBwcml2YXRlcy5hbHBoYSA9IHZhbHVlO1xuICAgICAgICAgIGdsLnVuaWZvcm0xZihwcml2YXRlcy5hbHBoYUxvYywgcHJpdmF0ZXMuYWxwaGEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsIGdvdCBpbnZhbGlkIGFscGhhIG51bWJlclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBjb2xvciwgZWcgXCIjMDBmZjAwXCJcbiAgICAgKi9cbiAgICBnZXQgY29sb3IgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgY29sb3IgPSBwcml2YXRlcy5jb2xvcjtcbiAgICAgIGxldCByID0gY29sb3JbMF0udG9TdHJpbmcoMTYpO1xuICAgICAgbGV0IGcgPSBjb2xvclsxXS50b1N0cmluZygxNik7XG4gICAgICBsZXQgYiA9IGNvbG9yWzJdLnRvU3RyaW5nKDE2KTtcbiAgICAgIGlmIChyLmxlbmd0aCA8IDIpIHIgPSBcIjBcIiArIHI7XG4gICAgICBpZiAoZy5sZW5ndGggPCAyKSBnID0gXCIwXCIgKyBnO1xuICAgICAgaWYgKGIubGVuZ3RoIDwgMikgYiA9IFwiMFwiICsgYjtcbiAgICAgIHJldHVybiBcIiNcIiArIHIgKyBnICsgYjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgY29sb3IsIGVnIFwiIzAwZmYwMFwiXG4gICAgICovXG4gICAgc2V0IGNvbG9yICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgbSA9IHZhbHVlLm1hdGNoKC9eIyhbXFxkYS1mQS1GXVtcXGRhLWZBLUZdKShbXFxkYS1mQS1GXVtcXGRhLWZBLUZdKShbXFxkYS1mQS1GXVtcXGRhLWZBLUZdKSQvKTtcbiAgICAgIGlmIChtKSB7XG4gICAgICAgIGxldCByID0gbVsxXTtcbiAgICAgICAgbGV0IGcgPSBtWzJdO1xuICAgICAgICBsZXQgYiA9IG1bM107XG4gICAgICAgIHByaXZhdGVzLmNvbG9yWzBdID0gcGFyc2VJbnQociwgMTYpO1xuICAgICAgICBwcml2YXRlcy5jb2xvclsxXSA9IHBhcnNlSW50KGcsIDE2KTtcbiAgICAgICAgcHJpdmF0ZXMuY29sb3JbMl0gPSBwYXJzZUludChiLCAxNik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsLmNvbG9yIGludmFsaWQgY29sb3IgZm9ybWF0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIGZpbHRlciB5b3Ugd2FudCBnZXQgb3Igc2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIE51bWJlciBvciB1bmRlZmluZWQsIGlmIHVuZGVmaW5lZCAscmV0dXJuIGN1cnJlbnQgdmFsdWVcbiAgICAgKi9cbiAgICBmaWx0ZXIgKG5hbWUsIHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIGxldCBnbCA9IHByaXZhdGVzLmdsO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcHJpdmF0ZXMuZmlsdGVyLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgIGdsLnVuaWZvcm0xZihwcml2YXRlcy5icmlnaHRuZXNzTG9jLCBwcml2YXRlcy5maWx0ZXIuZ2V0KFwiYnJpZ2h0bmVzc1wiKSk7XG4gICAgICAgIGdsLnVuaWZvcm0xZihwcml2YXRlcy5jb250cmFzdExvYywgcHJpdmF0ZXMuZmlsdGVyLmdldChcImNvbnRyYXN0XCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlcy5nZXQobmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgZ2wgPSBwcml2YXRlcy5nbDtcbiAgICAgIGxldCBjb2xvciA9IHByaXZhdGVzLmNvbG9yO1xuICAgICAgZ2wuY2xlYXJDb2xvcihjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCAxKTsgLy8gYmxhY2tcbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5jYW52YXMud2lkdGg7XG4gICAgfVxuXG4gICAgc2V0IHdpZHRoICh2YWx1ZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgICAhaXNOYU4odmFsdWUpICYmXG4gICAgICAgIHZhbHVlID4gMCAmJlxuICAgICAgICB2YWx1ZSA8PSA0MDk2XG4gICAgICApIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IHByaXZhdGVzLmNhbnZhcy53aWR0aCkge1xuICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy53aWR0aCA9IHZhbHVlO1xuICAgICAgICAgIHByaXZhdGVzLmdsLnZpZXdwb3J0KDAsIDAsIHByaXZhdGVzLmNhbnZhcy53aWR0aCwgcHJpdmF0ZXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgcHJpdmF0ZXMuZ2wudW5pZm9ybTJmKFxuICAgICAgICAgICAgcHJpdmF0ZXMucmVzb2x1dGlvbkxvYyxcbiAgICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgIHByaXZhdGVzLmNhbnZhcy5oZWlnaHRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlLCB0aGlzKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsIGdvdCBpbnZhbGlkIHdpZHRoIG51bWJlclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmNhbnZhcy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0IGhlaWdodCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiZcbiAgICAgICAgIWlzTmFOKHZhbHVlKSAmJlxuICAgICAgICB2YWx1ZSA+IDAgJiZcbiAgICAgICAgdmFsdWUgPD0gNDA5NlxuICAgICAgKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBwcml2YXRlcy5jYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgICAgcHJpdmF0ZXMuY2FudmFzLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgIHByaXZhdGVzLmdsLnZpZXdwb3J0KDAsIDAsIHByaXZhdGVzLmNhbnZhcy53aWR0aCwgcHJpdmF0ZXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgcHJpdmF0ZXMuZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Mb2MsIHByaXZhdGVzLmNhbnZhcy53aWR0aCwgcHJpdmF0ZXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIHRoaXMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuV2ViZ2wgZ290IGludmFsaWQgaGVpZ2h0IG51bWJlclwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY2FudmFzICgpIHtcbiAgICAgIHJldHVybiBpbnRlcm5hbCh0aGlzKS5jYW52YXM7XG4gICAgfVxuXG4gICAgc2V0IGNhbnZhcyAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUsIHRoaXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLldlYmdsLmNhbnZhcyBjYW5ub3Qgd3JpdGVcIik7XG4gICAgfVxuXG4gIH0pO1xuXG5cblxufSkoKTtcbiJdfQ==
