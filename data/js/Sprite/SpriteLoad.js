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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7QUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7O0FBRXRDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDbEQsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3ZDLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNmLE1BQU07QUFDTCxhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFlBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM3Qzs7O0FBR0QsUUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3BCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixVQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFD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LEdBQUcsQ0FBQyxDQUFDO0FBQ2IsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsU0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV6QixVQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNmLFlBQUksRUFBRSxDQUFDOztBQUVQLFlBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDdEIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO09BQ0YsQ0FBQTs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBSztBQUMvQixhQUFLLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3pCLGFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDcEIsY0FBSSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FFSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVMb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNwcml0ZS5Mb2FkZXIsIGZldGNoIHJlc291cmNlXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2FjaGUgYWxsIHVybCBhbmQgZWxlbWVudFxuICAgKi9cbiAgbGV0IENhY2hlID0gbmV3IE1hcCgpO1xuICAvKipcbiAgICogV2hlbiBzb21lIHVybCBpbiBEb3dubG9hZGluZywgdGhlIHVybCBpcyBkb3dubG9hZGluZyxcbiAgICogYW5kIG90aGVyIHRocmVhZCB3YW50IGl0IGhhdmUgdG8gd2FpdFxuICAgKi9cbiAgbGV0IERvd25sb2FkaW5nID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIEZldGNoICh1cmwsIGNhbGxiYWNrLCB0aW1lb3V0KSB7XG5cbiAgICBsZXQgdHlwZSA9IG51bGw7XG4gICAgaWYgKHVybC5tYXRjaCgvanMkLykpIHtcbiAgICAgIHR5cGUgPSBcImpzXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL2pwZyR8anBlZyR8cG5nJHxibXAkfGdpZiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImltYWdlXCI7XG4gICAgfSBlbHNlIGlmICh1cmwubWF0Y2goL3dhdiR8bXAzJHxvZ2ckL2kpKSB7XG4gICAgICB0eXBlID0gXCJhdWRpb1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qc29uJC9pKSkge1xuICAgICAgdHlwZSA9IFwianNvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGZXRjaCBnb3QgYW4gaW52YWxpZCB1cmxcIik7XG4gICAgfVxuXG4gICAgLy8gZmluaXNoZWRcbiAgICBsZXQgRmluaXNoID0gKG9iaikgPT4ge1xuICAgICAgQ2FjaGUuc2V0KHVybCwgb2JqKTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgb2JqID0gU3ByaXRlLmNvcHkob2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICB9XG4gICAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IERvd25sb2FkaW5nLmdldCh1cmwpO1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIERvd25sb2FkaW5nLmRlbGV0ZSh1cmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChDYWNoZS5oYXModXJsKSkge1xuICAgICAgRmluaXNoKENhY2hlLmdldCh1cmwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoRG93bmxvYWRpbmcuaGFzKHVybCkpIHtcbiAgICAgIERvd25sb2FkaW5nLmdldCh1cmwpLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIERvd25sb2FkaW5nLnNldCh1cmwsIFtdKTtcblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICAgIHJlcS50aW1lb3V0ID0gMTUwMDA7IC8vIDE1IHNlY29uZHNcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImpzXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW1hZ2VcIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhdWRpb1wiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodHlwZSwgdXJsKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggc29tZXRoaW5nIHdyb25nXCIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggdGltZW91dCB0d2ljZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZldGNoKHVybCwgY2FsbGJhY2ssIHRydWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiAhZG9uZSkge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHJlcS5yZXNwb25zZSkge1xuICAgICAgICAgIGlmICh0eXBlID09IFwianNcIikge1xuICAgICAgICAgICAgbGV0IGZ1biA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmdW4gPSBuZXcgRnVuY3Rpb24ocmVxLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXEucmVzcG9uc2UsIHVybCk7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goZnVuKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJpbWFnZVwiKSB7XG4gICAgICAgICAgICBsZXQgYmxvYiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChpbWFnZS5zcmMpO1xuICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBudWxsO1xuICAgICAgICAgICAgICBGaW5pc2goaW1hZ2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImF1ZGlvXCIpIHtcbiAgICAgICAgICAgIGxldCBibG9iID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgbGV0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgICAgICBhdWRpby5vbmNhbnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIOWmguaenHJlb2tl5o6JYXVkaW/vvIzpgqPkuYhhdWRpby5sb2FkKCnmlrnms5XliJnkuI3og73nlKjkuoZcbiAgICAgICAgICAgICAgLy8gd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoYXVkaW8uc3JjKTtcbiAgICAgICAgICAgICAgYXVkaW8ub25jYW5wbGF5ID0gbnVsbDtcbiAgICAgICAgICAgICAgRmluaXNoKGF1ZGlvKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdWRpby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIGxldCBqc29uID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKCFqc29uKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkxvYWRlciBpbnZhbGlkIGpzb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5pc2goanNvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnJlc3BvbnNlLCByZXEucmVhZHlTdGF0ZSwgcmVxLnN0YXR1cywgcmVxLnN0YXR1c1RleHQpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIuRmV0Y2ggRXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJlcS5zZW5kKCk7XG4gIH1cblxuICBTcHJpdGUuYXNzaWduKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBsZXQgdXJscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB1cmxzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgZm9yIChsZXQgdXJsIG9mIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHVybHMucHVzaCh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVsZW1lbnQsIGFyZ3MpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5sb2FkIGdvdCBpbnZhbGlkIGFyZ3VtZW50XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBkb25lID0gMDtcbiAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgIHJldC5sZW5ndGggPSB1cmxzLmxlbmd0aDtcblxuICAgICAgbGV0IERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGRvbmUrKztcblxuICAgICAgICBpZiAoZG9uZSA+PSByZXQubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVybHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgRmV0Y2goZWxlbWVudCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldFtpbmRleF0gPSByZXN1bHQ7XG4gICAgICAgICAgRG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG59KSgpO1xuIl19
