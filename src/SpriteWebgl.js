/// @file SpriteWebGL.js
///

(function () {

  var vertexShaderSrc = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform vec2 u_resolution;

  varying vec2 v_texCoord;

  void main() {
     // convert the rectangle from pixels to 0.0 to 1.0
     vec2 zeroToOne = a_position / u_resolution;

     // convert from 0->1 to 0->2
     vec2 zeroToTwo = zeroToOne * 2.0;

     // convert from 0->2 to -1->+1 (clipspace)
     vec2 clipSpace = zeroToTwo - 1.0;

     gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

     // pass the texCoord to the fragment shader
     // The GPU will interpolate this value between points.
     v_texCoord = a_texCoord;
  }`;

  var fragmentShaderSrc = `
  // precision mediump float;
  precision highp float;

  // texture crop
  uniform vec4 u_crop;

  // our texture
  uniform sampler2D u_image;

  // the texCoords passed in from the vertex shader.
  varying vec2 v_texCoord;

  void main() {
     // Look up a color from the texture.
     // gl_FragColor = texture2D(u_image, v_texCoord);
     gl_FragColor = texture2D(
       u_image,
       vec2(v_texCoord.x * u_crop.z, v_texCoord.y * u_crop.w) + u_crop.xy
     );
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

  //var imageCache = [];
  //var textureCache = [];

  var textureCache = new Map();

  function createTexture (gl, image) {
    //var cacheIndex = imageCache.indexOf(image);

    if (textureCache.has(image)) {
      return textureCache.get(image);
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

      //imageCache.push(image);
      //textureCache.push(texture);
      textureCache.set(image, texture);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    }
  }


  Sprite.Webgl = class Webgl {

    constructor (width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

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

      var texture = createTexture(gl, image);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      //setRectangle(gl, sx/image.width, sy/image.height, sw/image.width, sh/image.height);
      gl.uniform4f(this._cropLocation, sx/image.width, sy/image.height, sw/image.width, sh/image.height);
      //console.log(sx, sy, sw, sh, dx, dy, dw, dh, sx/image.width, sy/image.height, sw/image.width, sh/image.height)
      //setRectangle(gl, 0, 0, 1, 1);

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

})();
