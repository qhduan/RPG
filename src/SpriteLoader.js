
(function () {
  "use strict";

  Sprite.Cache = {};

  function Fetch (url, callback, timeout) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 15000;

    var type = null;
    if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      req.responseType = "blob";
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      req.responseType = "blob"
      type = "audio";
    } else if (url.match(/json$/i)) {
      // req.responseType = "text"
      req.responseType = "json";
      type = "json";
    } else {
      console.error(url);
      throw new Error("Sprite.Loader.Fetch got an invalid url");
    }

    if (typeof callback != "function")
      callback = function () {};

    req.ontimeout = function () {
      if (timeout) {
        console.error(url);
        throw new Error("Sprite.Loader.Fetch timeout twice");
      } else {
        Fetch(url, callback, true);
      }
    };

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          if (type == "image") {
            var blob = req.response;
            var image = new Image();
            image.onload = function () {
              // window.URL.revokeObjectURL(image.src);
              image.onload = null;
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
              audio.oncanplay = null;
              Sprite.Cache[url] = audio;
              callback(audio);
            };
            audio.src = window.URL.createObjectURL(blob);
          } else if (type == "json") {
            var json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Sprite.Cache[url] = json;
            callback(json);
          }
        } else {
          console.error(req.readyState, req.status, req.statusText);
          throw new Error("Sprite.Loader.Fetch Error");
        }
      }
    };
    req.send();
  }

  Sprite.Loader = class Loader extends Sprite.Event {

    constructor () {
      super();
      this._list = [];
      this._progress = 0;
    }

    get progress () {
      return this._progress;
    }

    set progress (value) {
      throw new Error("Sprite.Loader progress readonly");
    }

    add () {
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

    start () {
      var done = 0;
      var ret = [];
      ret.length = this._list.length;

      var Done = () => {
        done++;

        this._progress = done / this._list.length;
        this.emit("progress");

        if (done >= this._list.length) {
          this.emit("complete", true, ret);
        }
      }

      this._list.forEach((element, index) => {
        if (Sprite.Cache.hasOwnProperty(element)) {
          ret[index] = Sprite.Cache[element];
          Done();
        } else {
          Fetch(element, (result) => {
            ret[index] = result;
            Done();
          });
        }
      });

    }
  }


})();
