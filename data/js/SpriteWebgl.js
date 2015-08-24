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

/// @file SpriteWebgl.js
/// @namespace Sprite
/// class Sprite.Webgl

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  var vertexShaderSrc = "\n  attribute vec2 a_position;\n  attribute vec2 a_texCoord;\n\n  uniform vec2 u_resolution;\n\n  varying vec2 v_texCoord;\n\n  void main() {\n     // convert the rectangle from pixels to 0.0 to 1.0\n     vec2 zeroToOne = a_position / u_resolution;\n\n     // convert from 0->1 to 0->2\n     vec2 zeroToTwo = zeroToOne * 2.0;\n\n     // convert from 0->2 to -1->+1 (clipspace)\n     vec2 clipSpace = zeroToTwo - 1.0;\n\n     gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\n     // pass the texCoord to the fragment shader\n     // The GPU will interpolate this value between points.\n     v_texCoord = a_texCoord;\n  }";

  var fragmentShaderSrc = "\n  // precision mediump float;\n  precision highp float;\n\n  // texture crop\n  uniform vec4 u_crop;\n\n  // our texture\n  uniform sampler2D u_image;\n\n  // the texCoords passed in from the vertex shader.\n  varying vec2 v_texCoord;\n\n  void main() {\n     // Look up a color from the texture.\n     // gl_FragColor = texture2D(u_image, v_texCoord);\n     gl_FragColor = texture2D(\n       u_image,\n       vec2(v_texCoord.x * u_crop.z, v_texCoord.y * u_crop.w) + u_crop.xy\n     );\n  }";

  function setRectangle(gl, x, y, width, height) {
    var x2 = x + width;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x2, y, x, y2, x, y2, x2, y, x2, y2]), gl.STATIC_DRAW);
  }

  function isPOT(value) {
    return value > 0 && (value - 1 & value) === 0;
  }

  Sprite.Webgl = (function () {
    _createClass(Webgl, null, [{
      key: "support",
      value: function support() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          return true;
        }
        return false;
      }
    }]);

    function Webgl(width, height) {
      _classCallCheck(this, Webgl);

      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      this._textureCache = new Map();

      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        throw new Error("Sprite.Webgl webgl is not supported");
      }

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

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);

      console.log("webgl inited");

      console.log("webgl, max texture size: ", gl.getParameter(gl.MAX_TEXTURE_SIZE));

      var positionLocation = gl.getAttribLocation(program, "a_position");
      var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
      var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      var cropLocation = gl.getUniformLocation(program, 'u_crop');

      this._positionLocation = positionLocation;
      this._texCoordLocation = texCoordLocation;
      this._resolutionLocation = resolutionLocation;
      this._cropLocation = cropLocation;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      var texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      var buffer = gl.createBuffer();

      setRectangle(gl, 0, 0, 1, 1);

      this._texCoordBuffer = texCoordBuffer;
      this._buffer = buffer;

      this._canvas = canvas;
      this._gl = gl;
    }

    _createClass(Webgl, [{
      key: "createTexture",
      value: function createTexture(gl, image) {
        //var cacheIndex = imageCache.indexOf(image);

        if (this._textureCache.has(image)) {
          return this._textureCache.get(image);
        } else {
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
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

          this._textureCache.set(image, texture);
          gl.bindTexture(gl.TEXTURE_2D, null);
          return texture;
        }
      }
    }, {
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var gl = this._gl;

        if (!image.width || !image.height || image.width <= 0 || image.height <= 0) {
          console.error(image);
          throw new Error("drawImage invalid image");
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
            console.error(arguments);
            throw new Error("drawImage invalid arguments");
          }

        var texture = this.createTexture(gl, image);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        //setRectangle(gl, sx/image.width, sy/image.height, sw/image.width, sh/image.height);
        gl.uniform4f(this._cropLocation, sx / image.width, sy / image.height, sw / image.width, sh / image.height);
        //console.log(sx, sy, sw, sh, dx, dy, dw, dh, sx/image.width, sy/image.height, sw/image.width, sh/image.height)
        //setRectangle(gl, 0, 0, 1, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.enableVertexAttribArray(this._positionLocation);
        gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

        setRectangle(gl, dx, dy, dw, dh);

        // draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }, {
      key: "clear",
      value: function clear() {
        var gl = this._gl;
        gl.clearColor(0, 0, 0, 1); // black
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }, {
      key: "width",
      get: function get() {
        return this._canvas.width;
      },
      set: function set(value) {
        if (value != this._canvas.width) {
          this._canvas.width = value;
          this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
          this._gl.uniform2f(resolutionLocation, this._canvas.width, this._canvas.height);
        }
      }
    }, {
      key: "height",
      get: function get() {
        return this._canvas.height;
      },
      set: function set(value) {
        if (value != this._canvas.height) {
          this._canvas.height = value;
          this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
          this._gl.uniform2f(resolutionLocation, this._canvas.width, this._canvas.height);
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return this._canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Webgl.canvas cannot write");
      }
    }]);

    return Webgl;
  })();
})();
//# sourceMappingURL=SpriteWebgl.js.map
