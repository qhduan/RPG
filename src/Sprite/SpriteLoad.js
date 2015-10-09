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

(function () {
 "use strict";

  let internal = Sprite.Namespace();

  /**
   * Cache all url and element
   */
  let Cache = new Map();
  /**
   * When some url in Downloading, the url is downloading,
   * and other thread want it have to wait
   */
  let Downloading = new Map();

  function Fetch (url, callback, timeout = 0) {

    let type = null;
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
    let Finish = (obj) => {
      Cache.set(url, obj);

      if (type == "json") {
        obj = Sprite.copy(obj);
      }

      if (callback) {
        callback(obj);
      }
      if (Downloading.has(url)) {
        let callbacks = Downloading.get(url);
        for (let callback of callbacks) {
          if (callback) {
            callback(obj);
          }
        }
        Downloading.delete(url);
      }
    }

    if (Cache.has(url)) {
      Finish(Cache.get(url));
      return;
    }

    if ( !timeout ) {
      if (Downloading.has(url)) {
        Downloading.get(url).push(callback);
        return;
      }

      Downloading.set(url, []);
    }

    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 5000; // 5 seconds

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

    if (typeof callback != "function")
      callback = function () {};

    req.ontimeout = function () {
      if (timeout >= 2) {
        console.error(url);
        throw new Error("Sprite.Loader.Fetch timeout 3 times");
      } else {
        Fetch(url, callback, timeout + 1);
      }
    };

    let done = false;
    req.onreadystatechange = function () {
      if (req.readyState == 4 && !done) {
        done = true;
        if (req.response) {
          if (type == "js") {
            let fun = null;
            try {
              fun = new Function(req.response);
            } catch (e) {
              console.error(req.response, url);
              throw e;
            }
            Finish(fun);
          } else if (type == "image") {
            let blob = req.response;
            let image = new Image();
            image.onload = function () {
              // window.URL.revokeObjectURL(image.src);
              image.onload = null;
              Finish(image);
            };
            image.src = window.URL.createObjectURL(blob);
          } else if (type == "audio") {
            let blob = req.response;
            let audio = new Audio();
            audio.oncanplay = function () {
              // 如果reoke掉audio，那么audio.load()方法则不能用了
              // window.URL.revokeObjectURL(audio.src);
              audio.oncanplay = null;
              Finish(audio);
            };
            audio.src = window.URL.createObjectURL(blob);
          } else if (type == "json") {
            let json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Finish(json);
          }
        } else {
          console.error("url: ", url);
          console.error("response: ", req.response,
          " readyState: ", req.readyState,
          " status: ", req.status,
          " statusText: ", req.statusText);
          throw new Error("Sprite.Loader.Fetch Error");
        }
      }
    };
    req.send();
  }

  Sprite.assign("load", function () {
    let args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      let urls = [];

      for (let element of args) {
        if (typeof element == "string") {
          urls.push(element);
        } else if (element instanceof Array) {
          for (let url of element) {
            urls.push(url);
          }
        } else {
          console.error(element, args);
          throw new Error("Sprite.load got invalid argument");
        }
      }

      let done = 0;
      let ret = [];
      ret.length = urls.length;

      let Done = () => {
        done++;

        if (done >= ret.length) {
          resolve(ret);
        }
      }

      urls.forEach((element, index) => {
        Fetch(element, (result) => {
          ret[index] = result;
          Done();
        });
      });

    });
  });

})();
