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

(function (Sprite) {
  "use strict";

  var vertexShaderSrc = `
  attribute vec2 position;
  attribute vec2 a_texCoord;

  uniform vec2 resolution;

  varying vec2 texCoord;

  void main() {
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

  var fragmentShaderSrc = `
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

  void main() {
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
    var x2 = x + width;
    var y2 = y + height;
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

  function isPOT (value) {
    return value > 0 && ((value - 1) & value) === 0;
  }


  Sprite.Webgl = class Webgl {

    static support () {
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
        || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
      if (gl) {
        return true;
      }
      return false;
    }

    constructor (width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      this._alpha = 1;
      this._filters = {};
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

      var positionLocation = gl.getAttribLocation(program, "position");
      var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
      var resolutionLocation = gl.getUniformLocation(program, "resolution");
      var cropLocation = gl.getUniformLocation(program, "crop");
      var brightnessLocation = gl.getUniformLocation(program, "brightness");
      var contrastLocation = gl.getUniformLocation(program, "contrast");
      var alphaLocation = gl.getUniformLocation(program, "alpha");

      this._positionLocation = positionLocation;
      this._texCoordLocation = texCoordLocation;
      this._resolutionLocation = resolutionLocation;
      this._cropLocation = cropLocation;
      this._brightnessLocation = brightnessLocation;
      this._contrastLocation = contrastLocation;
      this._alphaLocation = alphaLocation;

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

    get alpha () {
      return this._alpha;
    }

    set alpha (value) {
      this._alpha = value;
    }

    filter (name, value) {
      this._filters[name] = value;
    }

    createTexture (gl, image) {
      //var cacheIndex = imageCache.indexOf(image);

      if (this._textureCache.has(image)) {
        return this._textureCache.get(image);
      } else {
        var texture = gl.createTexture();
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

        this._textureCache.set(image, texture);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
      }
    }

    drawImage (image, sx, sy, sw, sh, dx, dy, dw, dh) {
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
      gl.uniform4f(this._cropLocation, sx/image.width, sy/image.height, sw/image.width, sh/image.height);
      //console.log(sx, sy, sw, sh, dx, dy, dw, dh, sx/image.width, sy/image.height, sw/image.width, sh/image.height)
      //setRectangle(gl, 0, 0, 1, 1);

      if (this._filters["brightness"]) {
        gl.uniform1f(this._brightnessLocation, this._filters["brightness"]);
      } else {
        gl.uniform1f(this._brightnessLocation, 0.0);
      }

      if (this._filters["contrast"]) {
        gl.uniform1f(this._contrastLocation, this._filters["contrast"]);
      } else {
        gl.uniform1f(this._contrastLocation, 0.0);
      }

      gl.uniform1f(this._alphaLocation, this._alpha);

      gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
      gl.enableVertexAttribArray(this._positionLocation);
      gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

      setRectangle(gl, dx, dy, dw, dh);

      // draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    clear () {
      var gl = this._gl;
      gl.clearColor(0, 0, 0, 1); // black
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    get width () {
      return this._canvas.width;
    }

    set width (value) {
      if (value != this._canvas.width) {
        this._canvas.width = value;
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        this._gl.uniform2f(resolutionLocation, this._canvas.width, this._canvas.height);
      }
    }

    get height () {
      return this._canvas.height;
    }

    set height (value) {
      if (value != this._canvas.height) {
        this._canvas.height = value;
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        this._gl.uniform2f(resolutionLocation, this._canvas.width, this._canvas.height);
      }
    }

    get canvas () {
      return this._canvas;
    }

    set canvas (value) {
      throw new Error("Sprite.Webgl.canvas cannot write");
    }


  };

})(Sprite);
