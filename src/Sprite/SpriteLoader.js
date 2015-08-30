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

/// @file SpriteLoader.js
/// @namespace Sprite
/// class Sprite.Loader

(function (Sprite) {
  "use strict";

  var Cache = {};
  var Downloading = {};

  function Fetch (url, callback, timeout) {

    function Finish (obj) {
      Cache[url] = obj;
      if (typeof callback == "function") {
        callback(obj);
      }
      if (Downloading.hasOwnProperty(url)) {
        Downloading[url].forEach(function (callback) {
          if (typeof callback == "function") {
            callback(obj);
          }
        });
        delete Downloading[url];
      }
    }

    if (Cache.hasOwnProperty(url)) {
      Finish(Cache[url]);
      return;
    }

    if (Downloading.hasOwnProperty(url)) {
      Downloading[url].push(callback);
      return;
    }

    Downloading[url] = [];

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 15000; // 15 seconds

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
              Finish(image);
            };
            image.src = window.URL.createObjectURL(blob);
          } else if (type == "audio") {
            var blob = req.response;
            var audio = new Audio();
            audio.oncanplay = function () {
              // 如果reoke掉audio，那么audio.load()方法则不能用了
              // window.URL.revokeObjectURL(audio.src);
              audio.oncanplay = null;
              Finish(audio);
            };
            audio.src = window.URL.createObjectURL(blob);
          } else if (type == "json") {
            var json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Finish(json);
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
        Fetch(element, (result) => {
          ret[index] = result;
          Done();
        });
      });

    }
  }


})(Sprite);
