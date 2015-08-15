"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  Sprite.Cache = {};

  function Fetch(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);

    var type = null;
    if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      req.responseType = "blob";
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      req.responseType = "blob";
      type = "audio";
    } else if (url.match(/json$/i)) {
      req.responseType = "text";
      type = "json";
    } else {
      console.error(url);
      throw new Error("Fetch has an invalid argument");
    }

    req.onreadystatechange = function () {
      if (req.readyState == req.DONE) {
        if (type == "image") {
          var blob = req.response;
          var image = new Image();
          image.onload = function () {
            // window.URL.revokeObjectURL(image.src);
            Sprite.Cache[url] = image;
            callback(image);
          };
          image.src = window.URL.createObjectURL(blob);
        } else if (type == "audio") {
          var blob = req.response;
          var audio = new Audio();
          audio.oncanplay = function () {
            // 如果reoke掉audio，那么audio.load()方法则不能用了
            // window.URL.revokeObjectURL(audio.src);
            Sprite.Cache[url] = audio;
            callback(audio);
          };
          audio.src = window.URL.createObjectURL(blob);
        } else if (type == "json") {
          var json = JSON.parse(req.response);
          Sprite.Cache[url] = json;
          callback(json);
        }
      }
    };
    req.send();
  }

  Sprite.Loader = (function (_Sprite$Event) {
    _inherits(Loader, _Sprite$Event);

    function Loader() {
      _classCallCheck(this, Loader);

      _get(Object.getPrototypeOf(Loader.prototype), "constructor", this).call(this);
      this._list = [];
      this._progress = 0;
    }

    _createClass(Loader, [{
      key: "add",
      value: function add() {
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] instanceof Array) {
            this._list = this._list.concat(arguments[i]);
          } else if (typeof arguments[i] == "string" && arguments[i].length > 0) {
            this._list.push(arguments[i]);
          } else {
            console.error(i, arguments[i], arguments);
            throw new Error("Sprite.Loader.add Error");
          }
        }
      }
    }, {
      key: "start",
      value: function start() {
        var _this = this;

        var done = 0;
        var ret = [];
        ret.length = this._list.length;

        var Done = function Done() {
          done++;

          _this._progress = done / _this._list.length;
          _this.emit("progress");

          if (done >= _this._list.length) {
            _this.emit("complete", true, ret);
          }
        };

        this._list.forEach(function (element, index) {
          if (Sprite.Cache.hasOwnProperty(element)) {
            ret[index] = Sprite.Cache[element];
            Done();
          } else {
            Fetch(element, function (result) {
              ret[index] = result;
              Done();
            });
          }
        });
      }
    }, {
      key: "progress",
      get: function get() {
        return this._progress;
      },
      set: function set(value) {
        throw new Error("Sprite.Loader progress readonly");
      }
    }]);

    return Loader;
  })(Sprite.Event);
})();