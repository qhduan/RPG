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

  function Fetch(url, callback) {
    var timeout = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

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

    if (!timeout) {
      if (Downloading.has(url)) {
        Downloading.get(url).push(callback);
        return;
      }

      Downloading.set(url, []);
    }

    var req = new XMLHttpRequest();
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

    if (typeof callback != "function") callback = function () {};

    req.ontimeout = function () {
      if (timeout >= 2) {
        console.error(url);
        throw new Error("Sprite.Loader.Fetch timeout 3 times");
      } else {
        Fetch(url, callback, timeout + 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBZTtRQUFiLE9BQU8seURBQUcsQ0FBQzs7QUFFeEMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNwQixVQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsRUFBRTtBQUNsRCxVQUFJLEdBQUcsT0FBTyxDQUFDO0tBQ2hCLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDdkMsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixVQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ2YsTUFBTTtBQUNMLGFBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQzdDOzs7QUFHRCxRQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxHQUFHLEVBQUs7QUFDcEIsV0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXBCLFVBQUksSUFBSSxJQUFJLE1B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Ozs7Ozs7Ozs7Ozs7O1dBQ0YsTUFBTTtBQUNMLG1CQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3QixrQkFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1dBQ3JEO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxVQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixTQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXpCLFVBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2YsWUFBSSxFQUFFLENBQUM7O0FBRVAsWUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUN0QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7T0FDRixDQUFBOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQy9CLGFBQUssQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDekIsYUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFJLEVBQUUsQ0FBQztTQUNSLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUVKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLkxvYWRlciwgZmV0Y2ggcmVzb3VyY2VcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBhbGwgdXJsIGFuZCBlbGVtZW50XG4gICAqL1xuICBsZXQgQ2FjaGUgPSBuZXcgTWFwKCk7XG4gIC8qKlxuICAgKiBXaGVuIHNvbWUgdXJsIGluIERvd25sb2FkaW5nLCB0aGUgdXJsIGlzIGRvd25sb2FkaW5nLFxuICAgKiBhbmQgb3RoZXIgdGhyZWFkIHdhbnQgaXQgaGF2ZSB0byB3YWl0XG4gICAqL1xuICBsZXQgRG93bmxvYWRpbmcgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gRmV0Y2ggKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQgPSAwKSB7XG5cbiAgICBsZXQgdHlwZSA9IG51bGw7XG4gICAgaWYgKHVybC5tYXRjaCgvanMkLykpIHtcbiAgICAgIHR5cGUgPSBcImpzXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL2pwZyR8anBlZyR8cG5nJHxibXAkfGdpZiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImltYWdlXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL3dhdiR8bXAzJHxvZ2ckL2kpKSB7XG4gICAgICB0eXBlID0gXCJhdWRpb1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qc29uJC9pKSkge1xuICAgICAgdHlwZSA9IFwianNvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBnb3QgYW4gaW52YWxpZCB1cmxcIik7XG4gICAgfVxuXG4gICAgLy8gZmluaXNoZWRcbiAgICBsZXQgRmluaXNoID0gKG9iaikgPT4ge1xuICAgICAgQ2FjaGUuc2V0KHVybCwgb2JqKTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgb2JqID0gU3ByaXRlLmNvcHkob2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICB9XG4gICAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IERvd25sb2FkaW5nLmdldCh1cmwpO1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIERvd25sb2FkaW5nLmRlbGV0ZSh1cmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDYWNoZS5oYXModXJsKSkge1xuICAgICAgRmluaXNoKENhY2hlLmdldCh1cmwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoICF0aW1lb3V0ICkge1xuICAgICAgaWYgKERvd25sb2FkaW5nLmhhcyh1cmwpKSB7XG4gICAgICAgIERvd25sb2FkaW5nLmdldCh1cmwpLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIERvd25sb2FkaW5nLnNldCh1cmwsIFtdKTtcbiAgICB9XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICByZXEudGltZW91dCA9IDUwMDA7IC8vIDUgc2Vjb25kc1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwianNcIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwidGV4dFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJpbWFnZVwiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImF1ZGlvXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJqc29uXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcih0eXBlLCB1cmwpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBzb21ldGhpbmcgd3JvbmdcIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgcmVxLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ID49IDIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIHRpbWVvdXQgMyB0aW1lc1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZldGNoKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQgKyAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgIWRvbmUpIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChyZXEucmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSBcImpzXCIpIHtcbiAgICAgICAgICAgIGxldCBmdW4gPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZnVuID0gbmV3IEZ1bmN0aW9uKHJlcS5yZXNwb25zZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnJlc3BvbnNlLCB1cmwpO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGZ1bik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgbGV0IGJsb2IgPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1hZ2Uuc3JjKTtcbiAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgRmluaXNoKGltYWdlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJhdWRpb1wiKSB7XG4gICAgICAgICAgICBsZXQgYmxvYiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGxldCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICAgICAgYXVkaW8ub25jYW5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyDlpoLmnpxyZW9rZeaOiWF1ZGlv77yM6YKj5LmIYXVkaW8ubG9hZCgp5pa55rOV5YiZ5LiN6IO955So5LqGXG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGF1ZGlvLnNyYyk7XG4gICAgICAgICAgICAgIGF1ZGlvLm9uY2FucGxheSA9IG51bGw7XG4gICAgICAgICAgICAgIEZpbmlzaChhdWRpbyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXVkaW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwianNvblwiKSB7XG4gICAgICAgICAgICBsZXQganNvbiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGlmICghanNvbikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIgaW52YWxpZCBqc29uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGpzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidXJsOiBcIiwgdXJsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwicmVzcG9uc2U6IFwiLCByZXEucmVzcG9uc2UsXG4gICAgICAgICAgXCIgcmVhZHlTdGF0ZTogXCIsIHJlcS5yZWFkeVN0YXRlLFxuICAgICAgICAgIFwiIHN0YXR1czogXCIsIHJlcS5zdGF0dXMsXG4gICAgICAgICAgXCIgc3RhdHVzVGV4dDogXCIsIHJlcS5zdGF0dXNUZXh0KTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIEVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXEuc2VuZCgpO1xuICB9XG5cbiAgU3ByaXRlLmFzc2lnbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IHVybHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBhcmdzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdXJscy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGZvciAobGV0IHVybCBvZiBlbGVtZW50KSB7XG4gICAgICAgICAgICB1cmxzLnB1c2godXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlbGVtZW50LCBhcmdzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUubG9hZCBnb3QgaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZG9uZSA9IDA7XG4gICAgICBsZXQgcmV0ID0gW107XG4gICAgICByZXQubGVuZ3RoID0gdXJscy5sZW5ndGg7XG5cbiAgICAgIGxldCBEb25lID0gKCkgPT4ge1xuICAgICAgICBkb25lKys7XG5cbiAgICAgICAgaWYgKGRvbmUgPj0gcmV0Lmxlbmd0aCkge1xuICAgICAgICAgIHJlc29sdmUocmV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cmxzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIEZldGNoKGVsZW1lbnQsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICByZXRbaW5kZXhdID0gcmVzdWx0O1xuICAgICAgICAgIERvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9KTtcblxufSkoKTtcbiJdfQ==
