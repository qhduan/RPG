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
    req.timeout = 10000; // 10 seconds

    // looks like req.responseType=blob has some async problem, so I use arraybuffer
    switch (type) {
      case "js":
        req.responseType = "text";
        break;
      case "image":
        req.responseType = "arraybuffer";
        break;
      case "audio":
        req.responseType = "arraybuffer";
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
        alert("资源" + url + "超时没有加载成功！");
        throw new Error("Sprite.Loader.Fetch timeout 3 times");
      } else {
        console.error("Sprite.Loader.Fetch timeout try again, ", timeout + 1, " ", url);
        setTimeout(function () {
          Fetch(url, callback, timeout + 1);
        }, 50);
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
              var arraybuffer = req.response;
              var image = new Image();
              image.onload = function () {
                // window.URL.revokeObjectURL(image.src);
                image.onload = null;
                Finish(image);
              };
              image.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
            })();
          } else if (type == "audio") {
            (function () {
              var arraybuffer = req.response;
              var audio = new Audio();
              audio.oncanplay = function () {
                // 如果reoke掉audio，那么audio.load()方法则不能用了
                // window.URL.revokeObjectURL(audio.src);
                audio.oncanplay = null;
                Finish(audio);
              };
              audio.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
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
          if (timeout >= 2) {
            console.error(url);
            alert("资源" + url + "错误没有加载成功！");
            throw new Error("Sprite.Loader.Fetch error 3 times");
          } else {
            console.error("Sprite.Loader.Fetch error try again, ", timeout + 1, " ", url);
            setTimeout(function () {
              Fetch(url, callback, timeout + 1);
            }, 50);
          }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBZTtRQUFiLE9BQU8seURBQUcsQ0FBQzs7QUFFeEMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNwQixVQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsRUFBRTtBQUNsRCxVQUFJLEdBQUcsT0FBTyxDQUFDO0tBQ2hCLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDdkMsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixVQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ2YsTUFBTTtBQUNMLGFBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQzdDOzs7QUFHRCxRQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxHQUFHLEVBQUs7QUFDcEIsV0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXBCLFVBQUksSUFBSSxJQUFJLE1B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RTtBQUN0QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7T0FDRixDQUFBOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQy9CLGFBQUssQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDekIsYUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFJLEVBQUUsQ0FBQztTQUNSLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUVKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLkxvYWRlciwgZmV0Y2ggcmVzb3VyY2VcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBhbGwgdXJsIGFuZCBlbGVtZW50XG4gICAqL1xuICBsZXQgQ2FjaGUgPSBuZXcgTWFwKCk7XG4gIC8qKlxuICAgKiBXaGVuIHNvbWUgdXJsIGluIERvd25sb2FkaW5nLCB0aGUgdXJsIGlzIGRvd25sb2FkaW5nLFxuICAgKiBhbmQgb3RoZXIgdGhyZWFkIHdhbnQgaXQgaGF2ZSB0byB3YWl0XG4gICAqL1xuICBsZXQgRG93bmxvYWRpbmcgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gRmV0Y2ggKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQgPSAwKSB7XG5cbiAgICBsZXQgdHlwZSA9IG51bGw7XG4gICAgaWYgKHVybC5tYXRjaCgvanMkLykpIHtcbiAgICAgIHR5cGUgPSBcImpzXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL2pwZyR8anBlZyR8cG5nJHxibXAkfGdpZiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImltYWdlXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL3dhdiR8bXAzJHxvZ2ckL2kpKSB7XG4gICAgICB0eXBlID0gXCJhdWRpb1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qc29uJC9pKSkge1xuICAgICAgdHlwZSA9IFwianNvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBnb3QgYW4gaW52YWxpZCB1cmxcIik7XG4gICAgfVxuXG4gICAgLy8gZmluaXNoZWRcbiAgICBsZXQgRmluaXNoID0gKG9iaikgPT4ge1xuICAgICAgQ2FjaGUuc2V0KHVybCwgb2JqKTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgb2JqID0gU3ByaXRlLmNvcHkob2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICB9XG4gICAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IERvd25sb2FkaW5nLmdldCh1cmwpO1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIERvd25sb2FkaW5nLmRlbGV0ZSh1cmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDYWNoZS5oYXModXJsKSkge1xuICAgICAgRmluaXNoKENhY2hlLmdldCh1cmwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoICF0aW1lb3V0ICkge1xuICAgICAgaWYgKERvd25sb2FkaW5nLmhhcyh1cmwpKSB7XG4gICAgICAgIERvd25sb2FkaW5nLmdldCh1cmwpLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIERvd25sb2FkaW5nLnNldCh1cmwsIFtdKTtcbiAgICB9XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICByZXEudGltZW91dCA9IDEwMDAwOyAvLyAxMCBzZWNvbmRzXG5cbiAgICAvLyBsb29rcyBsaWtlIHJlcS5yZXNwb25zZVR5cGU9YmxvYiBoYXMgc29tZSBhc3luYyBwcm9ibGVtLCBzbyBJIHVzZSBhcnJheWJ1ZmZlclxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImpzXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW1hZ2VcIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYXVkaW9cIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJqc29uXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcih0eXBlLCB1cmwpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBzb21ldGhpbmcgd3JvbmdcIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgcmVxLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ID49IDIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgICBhbGVydChg6LWE5rqQJHt1cmx96LaF5pe25rKh5pyJ5Yqg6L295oiQ5Yqf77yBYCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggdGltZW91dCAzIHRpbWVzXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggdGltZW91dCB0cnkgYWdhaW4sIFwiLCB0aW1lb3V0ICsgMSwgXCIgXCIsIHVybCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEZldGNoKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQgKyAxKTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiAhZG9uZSkge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHJlcS5yZXNwb25zZSkge1xuICAgICAgICAgIGlmICh0eXBlID09IFwianNcIikge1xuICAgICAgICAgICAgbGV0IGZ1biA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmdW4gPSBuZXcgRnVuY3Rpb24ocmVxLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXEucmVzcG9uc2UsIHVybCk7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goZnVuKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJpbWFnZVwiKSB7XG4gICAgICAgICAgICBsZXQgYXJyYXlidWZmZXIgPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1hZ2Uuc3JjKTtcbiAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgRmluaXNoKGltYWdlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgd2luZG93LkJsb2IoW2FycmF5YnVmZmVyXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImF1ZGlvXCIpIHtcbiAgICAgICAgICAgIGxldCBhcnJheWJ1ZmZlciA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGxldCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICAgICAgYXVkaW8ub25jYW5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyDlpoLmnpxyZW9rZeaOiWF1ZGlv77yM6YKj5LmIYXVkaW8ubG9hZCgp5pa55rOV5YiZ5LiN6IO955So5LqGXG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGF1ZGlvLnNyYyk7XG4gICAgICAgICAgICAgIGF1ZGlvLm9uY2FucGxheSA9IG51bGw7XG4gICAgICAgICAgICAgIEZpbmlzaChhdWRpbyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXVkaW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobmV3IHdpbmRvdy5CbG9iKFthcnJheWJ1ZmZlcl0pKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIGxldCBqc29uID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKCFqc29uKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkxvYWRlciBpbnZhbGlkIGpzb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goanNvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1cmw6IFwiLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZXNwb25zZTogXCIsIHJlcS5yZXNwb25zZSxcbiAgICAgICAgICBcIiByZWFkeVN0YXRlOiBcIiwgcmVxLnJlYWR5U3RhdGUsXG4gICAgICAgICAgXCIgc3RhdHVzOiBcIiwgcmVxLnN0YXR1cyxcbiAgICAgICAgICBcIiBzdGF0dXNUZXh0OiBcIiwgcmVxLnN0YXR1c1RleHQpO1xuICAgICAgICAgIGlmICh0aW1lb3V0ID49IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgICAgIGFsZXJ0KGDotYTmupAke3VybH3plJnor6/msqHmnInliqDovb3miJDlip/vvIFgKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggZXJyb3IgMyB0aW1lc1wiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggZXJyb3IgdHJ5IGFnYWluLCBcIiwgdGltZW91dCArIDEsIFwiIFwiLCB1cmwpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIEZldGNoKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQgKyAxKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlcS5zZW5kKCk7XG4gIH1cblxuICBTcHJpdGUuYXNzaWduKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBsZXQgdXJscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB1cmxzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgZm9yIChsZXQgdXJsIG9mIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHVybHMucHVzaCh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVsZW1lbnQsIGFyZ3MpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5sb2FkIGdvdCBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBkb25lID0gMDtcbiAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgIHJldC5sZW5ndGggPSB1cmxzLmxlbmd0aDtcblxuICAgICAgbGV0IERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGRvbmUrKztcblxuICAgICAgICBpZiAoZG9uZSA+PSByZXQubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVybHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgRmV0Y2goZWxlbWVudCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldFtpbmRleF0gPSByZXN1bHQ7XG4gICAgICAgICAgRG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG59KSgpO1xuIl19
