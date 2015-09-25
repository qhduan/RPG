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

    var Finish = function Finish(obj) {
      Cache.set(url, obj);
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

    var type = null;
    if (url.match(/js$/)) {
      req.responseType = "text";
      type = "js";
    } else if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      req.responseType = "blob";
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      req.responseType = "blob";
      type = "audio";
    } else if (url.match(/json$/i)) {
      // req.responseType = "text"
      req.responseType = "json";
      type = "json";
    } else {
      console.error(url);
      throw new Error("Sprite.Loader.Fetch got an invalid url");
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