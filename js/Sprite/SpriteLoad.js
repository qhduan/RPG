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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXRDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDbEQsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3ZDLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNmLE1BQU07QUFDTCxhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFlBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM3Qzs7O0FBR0QsUUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3BCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixVQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFD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LENBQUMsQ0FBQztBQUM3QixrQkFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1dBQ3JEO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxVQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixTQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXpCLFVBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2YsWUFBSSxFQUFFLENBQUM7O0FBRVAsWUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUN0QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7T0FDRixDQUFBOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQy9CLGFBQUssQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDekIsYUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFJLEVBQUUsQ0FBQztTQUNSLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUVKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLkxvYWRlciwgZmV0Y2ggcmVzb3VyY2VcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBhbGwgdXJsIGFuZCBlbGVtZW50XG4gICAqL1xuICBsZXQgQ2FjaGUgPSBuZXcgTWFwKCk7XG4gIC8qKlxuICAgKiBXaGVuIHNvbWUgdXJsIGluIERvd25sb2FkaW5nLCB0aGUgdXJsIGlzIGRvd25sb2FkaW5nLFxuICAgKiBhbmQgb3RoZXIgdGhyZWFkIHdhbnQgaXQgaGF2ZSB0byB3YWl0XG4gICAqL1xuICBsZXQgRG93bmxvYWRpbmcgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gRmV0Y2ggKHVybCwgY2FsbGJhY2ssIHRpbWVvdXQpIHtcblxuICAgIGxldCB0eXBlID0gbnVsbDtcbiAgICBpZiAodXJsLm1hdGNoKC9qcyQvKSkge1xuICAgICAgdHlwZSA9IFwianNcIjtcbiAgICB9IGVsc2UgaWYgKHVybC5tYXRjaCgvanBnJHxqcGVnJHxwbmckfGJtcCR8Z2lmJC9pKSkge1xuICAgICAgdHlwZSA9IFwiaW1hZ2VcIjtcbiAgICB9IGVsc2UgaWYgKHVybC5tYXRjaCgvd2F2JHxtcDMkfG9nZyQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImF1ZGlvXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL2pzb24kL2kpKSB7XG4gICAgICB0eXBlID0gXCJqc29uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZldGNoIGdvdCBhbiBpbnZhbGlkIHVybFwiKTtcbiAgICB9XG5cbiAgICAvLyBmaW5pc2hlZFxuICAgIGxldCBGaW5pc2ggPSAob2JqKSA9PiB7XG4gICAgICBDYWNoZS5zZXQodXJsLCBvYmopO1xuXG4gICAgICBpZiAodHlwZSA9PSBcImpzb25cIikge1xuICAgICAgICBvYmogPSBTcHJpdGUuY29weShvYmopO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sob2JqKTtcbiAgICAgIH1cbiAgICAgIGlmIChEb3dubG9hZGluZy5oYXModXJsKSkge1xuICAgICAgICBsZXQgY2FsbGJhY2tzID0gRG93bmxvYWRpbmcuZ2V0KHVybCk7XG4gICAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sob2JqKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgRG93bmxvYWRpbmcuZGVsZXRlKHVybCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKENhY2hlLmhhcyh1cmwpKSB7XG4gICAgICBGaW5pc2goQ2FjaGUuZ2V0KHVybCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChEb3dubG9hZGluZy5oYXModXJsKSkge1xuICAgICAgRG93bmxvYWRpbmcuZ2V0KHVybCkucHVzaChjYWxsYmFjayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgRG93bmxvYWRpbmcuc2V0KHVybCwgW10pO1xuXG4gICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgcmVxLnRpbWVvdXQgPSAxNTAwMDsgLy8gMTUgc2Vjb25kc1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwianNcIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwidGV4dFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJpbWFnZVwiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImF1ZGlvXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJqc29uXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcih0eXBlLCB1cmwpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBzb21ldGhpbmcgd3JvbmdcIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgcmVxLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkxvYWRlci5GZXRjaCB0aW1lb3V0IHR3aWNlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmV0Y2godXJsLCBjYWxsYmFjaywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmICFkb25lKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBpZiAocmVxLnJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT0gXCJqc1wiKSB7XG4gICAgICAgICAgICBsZXQgZnVuID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZ1biA9IG5ldyBGdW5jdGlvbihyZXEucmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcS5yZXNwb25zZSwgdXJsKTtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEZpbmlzaChmdW4pO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImltYWdlXCIpIHtcbiAgICAgICAgICAgIGxldCBibG9iID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGltYWdlLnNyYyk7XG4gICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IG51bGw7XG4gICAgICAgICAgICAgIEZpbmlzaChpbWFnZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiYXVkaW9cIikge1xuICAgICAgICAgICAgbGV0IGJsb2IgPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgICAgIGF1ZGlvLm9uY2FucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8g5aaC5p6ccmVva2XmjolhdWRpb++8jOmCo+S5iGF1ZGlvLmxvYWQoKeaWueazleWImeS4jeiDveeUqOS6hlxuICAgICAgICAgICAgICAvLyB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChhdWRpby5zcmMpO1xuICAgICAgICAgICAgICBhdWRpby5vbmNhbnBsYXkgPSBudWxsO1xuICAgICAgICAgICAgICBGaW5pc2goYXVkaW8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF1ZGlvLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImpzb25cIikge1xuICAgICAgICAgICAgbGV0IGpzb24gPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBpZiAoIWpzb24pIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyIGludmFsaWQganNvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEZpbmlzaChqc29uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInVybDogXCIsIHVybCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInJlc3BvbnNlOiBcIiwgcmVxLnJlc3BvbnNlLFxuICAgICAgICAgIFwiIHJlYWR5U3RhdGU6IFwiLCByZXEucmVhZHlTdGF0ZSxcbiAgICAgICAgICBcIiBzdGF0dXM6IFwiLCByZXEuc3RhdHVzLFxuICAgICAgICAgIFwiIHN0YXR1c1RleHQ6IFwiLCByZXEuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkxvYWRlci5GZXRjaCBFcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuXG4gIFNwcml0ZS5hc3NpZ24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGxldCB1cmxzID0gW107XG5cbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgYXJncykge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIHVybHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICBmb3IgKGxldCB1cmwgb2YgZWxlbWVudCkge1xuICAgICAgICAgICAgdXJscy5wdXNoKHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZWxlbWVudCwgYXJncyk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLmxvYWQgZ290IGludmFsaWQgYXJndW1lbnRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGRvbmUgPSAwO1xuICAgICAgbGV0IHJldCA9IFtdO1xuICAgICAgcmV0Lmxlbmd0aCA9IHVybHMubGVuZ3RoO1xuXG4gICAgICBsZXQgRG9uZSA9ICgpID0+IHtcbiAgICAgICAgZG9uZSsrO1xuXG4gICAgICAgIGlmIChkb25lID49IHJldC5sZW5ndGgpIHtcbiAgICAgICAgICByZXNvbHZlKHJldCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXJscy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBGZXRjaChlbGVtZW50LCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcmV0W2luZGV4XSA9IHJlc3VsdDtcbiAgICAgICAgICBEb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbn0pKCk7XG4iXX0=
