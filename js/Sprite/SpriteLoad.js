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
          console.error("url: ", url);
          console.error("response: ", req.response, " readyState: ", req.readyState, " status: ", req.status, " statusText: ", req.statusText);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXRDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDbEQsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3ZDLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNmLE1BQU07QUFDTCxhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFlBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM3Qzs7O0FBR0QsUUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3BCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixVQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDbEIsV0FBRyxH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QztBQUM3QixrQkFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1dBQ3JEO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxVQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixTQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXpCLFVBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2YsWUFBSSxFQUFFLENBQUM7O0FBRVAsWUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUN0QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7T0FDRixDQUFBOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQy9CLGFBQUssQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDekIsYUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFJLEVBQUUsQ0FBQztTQUNSLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUVKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6InNyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBTcHJpdGUuTG9hZGVyLCBmZXRjaCByZXNvdXJjZVxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAqIENhY2hlIGFsbCB1cmwgYW5kIGVsZW1lbnRcbiAgICovXG4gIGxldCBDYWNoZSA9IG5ldyBNYXAoKTtcbiAgLyoqXG4gICAqIFdoZW4gc29tZSB1cmwgaW4gRG93bmxvYWRpbmcsIHRoZSB1cmwgaXMgZG93bmxvYWRpbmcsXG4gICAqIGFuZCBvdGhlciB0aHJlYWQgd2FudCBpdCBoYXZlIHRvIHdhaXRcbiAgICovXG4gIGxldCBEb3dubG9hZGluZyA9IG5ldyBNYXAoKTtcblxuICBmdW5jdGlvbiBGZXRjaCAodXJsLCBjYWxsYmFjaywgdGltZW91dCkge1xuXG4gICAgbGV0IHR5cGUgPSBudWxsO1xuICAgIGlmICh1cmwubWF0Y2goL2pzJC8pKSB7XG4gICAgICB0eXBlID0gXCJqc1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qcGckfGpwZWckfHBuZyR8Ym1wJHxnaWYkL2kpKSB7XG4gICAgICB0eXBlID0gXCJpbWFnZVwiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC93YXYkfG1wMyR8b2dnJC9pKSkge1xuICAgICAgdHlwZSA9IFwiYXVkaW9cIjtcbiAgICB9IGVsc2UgaWYgKHVybC5tYXRjaCgvanNvbiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImpzb25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggZ290IGFuIGludmFsaWQgdXJsXCIpO1xuICAgIH1cblxuICAgIC8vIGZpbmlzaGVkXG4gICAgbGV0IEZpbmlzaCA9IChvYmopID0+IHtcbiAgICAgIENhY2hlLnNldCh1cmwsIG9iaik7XG5cbiAgICAgIGlmICh0eXBlID09IFwianNvblwiKSB7XG4gICAgICAgIG9iaiA9IFNwcml0ZS5jb3B5KG9iaik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgfVxuICAgICAgaWYgKERvd25sb2FkaW5nLmhhcyh1cmwpKSB7XG4gICAgICAgIGxldCBjYWxsYmFja3MgPSBEb3dubG9hZGluZy5nZXQodXJsKTtcbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBEb3dubG9hZGluZy5kZWxldGUodXJsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoQ2FjaGUuaGFzKHVybCkpIHtcbiAgICAgIEZpbmlzaChDYWNoZS5nZXQodXJsKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKERvd25sb2FkaW5nLmhhcyh1cmwpKSB7XG4gICAgICBEb3dubG9hZGluZy5nZXQodXJsKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBEb3dubG9hZGluZy5zZXQodXJsLCBbXSk7XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICByZXEudGltZW91dCA9IDE1MDAwOyAvLyAxNSBzZWNvbmRzXG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJqc1wiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImltYWdlXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYXVkaW9cIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImpzb25cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmVycm9yKHR5cGUsIHVybCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZldGNoIHNvbWV0aGluZyB3cm9uZ1wiKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9IFwiZnVuY3Rpb25cIilcbiAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cbiAgICByZXEub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIHRpbWVvdXQgdHdpY2VcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGZXRjaCh1cmwsIGNhbGxiYWNrLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgIWRvbmUpIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChyZXEucmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSBcImpzXCIpIHtcbiAgICAgICAgICAgIGxldCBmdW4gPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZnVuID0gbmV3IEZ1bmN0aW9uKHJlcS5yZXNwb25zZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnJlc3BvbnNlLCB1cmwpO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGZ1bik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgbGV0IGJsb2IgPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1hZ2Uuc3JjKTtcbiAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgRmluaXNoKGltYWdlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJhdWRpb1wiKSB7XG4gICAgICAgICAgICBsZXQgYmxvYiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGxldCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICAgICAgYXVkaW8ub25jYW5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyDlpoLmnpxyZW9rZeaOiWF1ZGlv77yM6YKj5LmIYXVkaW8ubG9hZCgp5pa55rOV5YiZ5LiN6IO955So5LqGXG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGF1ZGlvLnNyYyk7XG4gICAgICAgICAgICAgIGF1ZGlvLm9uY2FucGxheSA9IG51bGw7XG4gICAgICAgICAgICAgIEZpbmlzaChhdWRpbyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXVkaW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwianNvblwiKSB7XG4gICAgICAgICAgICBsZXQganNvbiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGlmICghanNvbikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIgaW52YWxpZCBqc29uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGpzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidXJsOiBcIiwgdXJsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwicmVzcG9uc2U6IFwiLCByZXEucmVzcG9uc2UsXG4gICAgICAgICAgXCIgcmVhZHlTdGF0ZTogXCIsIHJlcS5yZWFkeVN0YXRlLFxuICAgICAgICAgIFwiIHN0YXR1czogXCIsIHJlcS5zdGF0dXMsXG4gICAgICAgICAgXCIgc3RhdHVzVGV4dDogXCIsIHJlcS5zdGF0dXNUZXh0KTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIEVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXEuc2VuZCgpO1xuICB9XG5cbiAgU3ByaXRlLmFzc2lnbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IHVybHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBhcmdzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdXJscy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGZvciAobGV0IHVybCBvZiBlbGVtZW50KSB7XG4gICAgICAgICAgICB1cmxzLnB1c2godXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlbGVtZW50LCBhcmdzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUubG9hZCBnb3QgaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZG9uZSA9IDA7XG4gICAgICBsZXQgcmV0ID0gW107XG4gICAgICByZXQubGVuZ3RoID0gdXJscy5sZW5ndGg7XG5cbiAgICAgIGxldCBEb25lID0gKCkgPT4ge1xuICAgICAgICBkb25lKys7XG5cbiAgICAgICAgaWYgKGRvbmUgPj0gcmV0Lmxlbmd0aCkge1xuICAgICAgICAgIHJlc29sdmUocmV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cmxzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIEZldGNoKGVsZW1lbnQsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICByZXRbaW5kZXhdID0gcmVzdWx0O1xuICAgICAgICAgIERvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9KTtcblxufSkoKTtcbiJdfQ==