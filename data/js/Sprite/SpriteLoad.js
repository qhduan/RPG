"use strict";

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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        Downloading.delete(url);
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
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
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
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlTG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7O0FBQUMsQUFLbEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUU7Ozs7O0FBQUMsQUFLdEIsTUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBZTtRQUFiLE9BQU8seURBQUcsQ0FBQzs7QUFFeEMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNwQixVQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsRUFBRTtBQUNsRCxVQUFJLEdBQUcsT0FBTyxDQUFDO0tBQ2hCLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDdkMsVUFBSSxHQUFHLE9BQU8sQ0FBQztLQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixVQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ2YsTUFBTTtBQUNMLGFBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQzdDOzs7QUFBQSxBQUdELFFBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLEdBQUcsRUFBSztBQUNwQixXQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFcEIsVUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO0FBQ2xCLFdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3hCOztBQUVELFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNmO0FBQ0QsVUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLFlBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7OztBQUNyQywrQkFBcUIsU0FBUyw4SEFBRTtnQkFBdkIsU0FBUTs7QUFDZixnQkFBSSxTQUFRLEVBQUU7QUFDWix1QkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7V0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELG1CQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3pCO0tBQ0YsQ0FBQTs7QUFFRCxRQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbEIsWUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QixhQUFPO0tBQ1I7O0FBRUQsUUFBSyxDQUFDLE9BQU8sRUFBRztBQUNkLFVBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN4QixtQkFBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsZUFBTztPQUNSOztBQUVELGlCQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMxQjs7QUFFRCxRQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQy9CLE9BQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixPQUFHLENBQUMsT0FBTyxHQUFHLEtBQUs7OztBQUFDLEFBR3BCLFlBQVEsSUFBSTtBQUNWLFdBQUssSUFBSTtBQUNQLFdBQUcsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzFCLGNBQU07QUFBQSxBQUNSLFdBQUssT0FBTztBQUNWLFdBQUcsQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO0FBQ2pDLGNBQU07QUFBQSxBQUNSLFdBQUssT0FBTztBQUNWLFdBQUcsQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO0FBQ2pDLGNBQU07QUFBQSxBQUNSLFdBQUssTUFBTTtBQUNULFdBQUcsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzFCLGNBQU07QUFBQSxBQUNSO0FBQ0UsZUFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDekIsY0FBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQUEsS0FDNUM7O0FBRUQsUUFBSSxPQUFPLFFBQVEsSUFBSSxVQUFVLEVBQy9CLFFBQVEsR0FBRyxZQUFZLEVBQUUsQ0FBQzs7QUFFNUIsT0FBRyxDQUFDLFNBQVMsR0FBRyxZQUFZO0FBQzFCLFVBQUksT0FBTyxJQUFJLENBQUMsRUFBRTtBQUNoQixlQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLGFBQUssUUFBTSxHQUFHLGVBQVksQ0FBQztBQUMzQixjQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7T0FDeEQsTUFBTTtBQUNMLGVBQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEYsa0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLGVBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ1I7S0FDRixDQUFDOztBQUVGLFFBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNqQixPQUFHLENBQUMsa0JBQWtCLEdBQUcsWUFBWTtBQUNuQyxVQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2hDLFlBQUksR0FBRyxJQUFJLENBQUM7QUFDWixZQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7QUFDaEIsY0FBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2hCLGdCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixnQkFBSTtBQUNGLGlCQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixxQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLG9CQUFNLENBQUMsQ0FBQzthQUNUO0FBQ0Qsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNiLE1BQU0sSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFOztBQUMxQixrQkFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUMvQixrQkFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUN4QixtQkFBSyxDQUFDLE1BQU0sR0FBRyxZQUFZOztBQUV6QixxQkFBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDcEIsc0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztlQUNmLENBQUM7QUFDRixtQkFBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7O1dBQ3hFLE1BQU0sSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFOztBQUMxQixrQkFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUMvQixrQkFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUN4QixtQkFBSyxDQUFDLFNBQVMsR0FBRyxZQUFZOzs7QUFHNUIscUJBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLHNCQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7ZUFDZixDQUFDO0FBQ0YsbUJBQUssQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOztXQUN4RSxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUN6QixnQkFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN4QixnQkFBSSxDQUFDLElBQUksRUFBRTtBQUNULHFCQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLG9CQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDL0M7QUFDRCxrQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2Q7U0FDRixNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLGlCQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsUUFBUSxFQUN4QyxlQUFlLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFDL0IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQ3ZCLGVBQWUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsY0FBSSxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ2hCLG1CQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLGlCQUFLLFFBQU0sR0FBRyxlQUFZLENBQUM7QUFDM0Isa0JBQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztXQUN0RCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUUsc0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLG1CQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbkMsRUFBRSxFQUFFLENBQUMsQ0FBQztXQUNSO1NBQ0Y7T0FDRjtLQUNGLENBQUM7QUFDRixPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWjs7QUFFRCxRQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZO0FBQ2hDLFFBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxXQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFFZCw4QkFBb0IsSUFBSSxtSUFBRTtjQUFqQixPQUFPOztBQUNkLGNBQUksT0FBTyxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzlCLGdCQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ3BCLE1BQU0sSUFBSSxPQUFPLFlBQVksS0FBSyxFQUFFOzs7Ozs7QUFDbkMsb0NBQWdCLE9BQU8sbUlBQUU7b0JBQWhCLEdBQUc7O0FBQ1Ysb0JBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFDaEI7Ozs7Ozs7Ozs7Ozs7OztXQUNGLE1BQU07QUFDTCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0Isa0JBQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztXQUNyRDtTQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsU0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV6QixVQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNmLFlBQUksRUFBRSxDQUFDOztBQUVQLFlBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDdEIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO09BQ0YsQ0FBQTs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBSztBQUMvQixhQUFLLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3pCLGFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDcEIsY0FBSSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FFSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVMb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNwcml0ZS5Mb2FkZXIsIGZldGNoIHJlc291cmNlXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2FjaGUgYWxsIHVybCBhbmQgZWxlbWVudFxuICAgKi9cbiAgbGV0IENhY2hlID0gbmV3IE1hcCgpO1xuICAvKipcbiAgICogV2hlbiBzb21lIHVybCBpbiBEb3dubG9hZGluZywgdGhlIHVybCBpcyBkb3dubG9hZGluZyxcbiAgICogYW5kIG90aGVyIHRocmVhZCB3YW50IGl0IGhhdmUgdG8gd2FpdFxuICAgKi9cbiAgbGV0IERvd25sb2FkaW5nID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIEZldGNoICh1cmwsIGNhbGxiYWNrLCB0aW1lb3V0ID0gMCkge1xuXG4gICAgbGV0IHR5cGUgPSBudWxsO1xuICAgIGlmICh1cmwubWF0Y2goL2pzJC8pKSB7XG4gICAgICB0eXBlID0gXCJqc1wiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC9qcGckfGpwZWckfHBuZyR8Ym1wJHxnaWYkL2kpKSB7XG4gICAgICB0eXBlID0gXCJpbWFnZVwiO1xuICAgIH0gZWxzZSBpZiAodXJsLm1hdGNoKC93YXYkfG1wMyR8b2dnJC9pKSkge1xuICAgICAgdHlwZSA9IFwiYXVkaW9cIjtcbiAgICB9IGVsc2UgaWYgKHVybC5tYXRjaCgvanNvbiQvaSkpIHtcbiAgICAgIHR5cGUgPSBcImpzb25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcih1cmwpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggZ290IGFuIGludmFsaWQgdXJsXCIpO1xuICAgIH1cblxuICAgIC8vIGZpbmlzaGVkXG4gICAgbGV0IEZpbmlzaCA9IChvYmopID0+IHtcbiAgICAgIENhY2hlLnNldCh1cmwsIG9iaik7XG5cbiAgICAgIGlmICh0eXBlID09IFwianNvblwiKSB7XG4gICAgICAgIG9iaiA9IFNwcml0ZS5jb3B5KG9iaik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgfVxuICAgICAgaWYgKERvd25sb2FkaW5nLmhhcyh1cmwpKSB7XG4gICAgICAgIGxldCBjYWxsYmFja3MgPSBEb3dubG9hZGluZy5nZXQodXJsKTtcbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBEb3dubG9hZGluZy5kZWxldGUodXJsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoQ2FjaGUuaGFzKHVybCkpIHtcbiAgICAgIEZpbmlzaChDYWNoZS5nZXQodXJsKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCAhdGltZW91dCApIHtcbiAgICAgIGlmIChEb3dubG9hZGluZy5oYXModXJsKSkge1xuICAgICAgICBEb3dubG9hZGluZy5nZXQodXJsKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBEb3dubG9hZGluZy5zZXQodXJsLCBbXSk7XG4gICAgfVxuXG4gICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgcmVxLnRpbWVvdXQgPSAxMDAwMDsgLy8gMTAgc2Vjb25kc1xuXG4gICAgLy8gbG9va3MgbGlrZSByZXEucmVzcG9uc2VUeXBlPWJsb2IgaGFzIHNvbWUgYXN5bmMgcHJvYmxlbSwgc28gSSB1c2UgYXJyYXlidWZmZXJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJqc1wiOlxuICAgICAgICByZXEucmVzcG9uc2VUeXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImltYWdlXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImF1ZGlvXCI6XG4gICAgICAgIHJlcS5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgcmVxLnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodHlwZSwgdXJsKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmV0Y2ggc29tZXRoaW5nIHdyb25nXCIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGltZW91dCA+PSAyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodXJsKTtcbiAgICAgICAgYWxlcnQoYOi1hOa6kCR7dXJsfei2heaXtuayoeacieWKoOi9veaIkOWKn++8gWApO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIHRpbWVvdXQgMyB0aW1lc1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIHRpbWVvdXQgdHJ5IGFnYWluLCBcIiwgdGltZW91dCArIDEsIFwiIFwiLCB1cmwpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBGZXRjaCh1cmwsIGNhbGxiYWNrLCB0aW1lb3V0ICsgMSk7XG4gICAgICAgIH0sIDUwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgIWRvbmUpIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChyZXEucmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSBcImpzXCIpIHtcbiAgICAgICAgICAgIGxldCBmdW4gPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZnVuID0gbmV3IEZ1bmN0aW9uKHJlcS5yZXNwb25zZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnJlc3BvbnNlLCB1cmwpO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGZ1bik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgbGV0IGFycmF5YnVmZmVyID0gcmVxLnJlc3BvbnNlO1xuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGltYWdlLnNyYyk7XG4gICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IG51bGw7XG4gICAgICAgICAgICAgIEZpbmlzaChpbWFnZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobmV3IHdpbmRvdy5CbG9iKFthcnJheWJ1ZmZlcl0pKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJhdWRpb1wiKSB7XG4gICAgICAgICAgICBsZXQgYXJyYXlidWZmZXIgPSByZXEucmVzcG9uc2U7XG4gICAgICAgICAgICBsZXQgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgICAgIGF1ZGlvLm9uY2FucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8g5aaC5p6ccmVva2XmjolhdWRpb++8jOmCo+S5iGF1ZGlvLmxvYWQoKeaWueazleWImeS4jeiDveeUqOS6hlxuICAgICAgICAgICAgICAvLyB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChhdWRpby5zcmMpO1xuICAgICAgICAgICAgICBhdWRpby5vbmNhbnBsYXkgPSBudWxsO1xuICAgICAgICAgICAgICBGaW5pc2goYXVkaW8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF1ZGlvLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyB3aW5kb3cuQmxvYihbYXJyYXlidWZmZXJdKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwianNvblwiKSB7XG4gICAgICAgICAgICBsZXQganNvbiA9IHJlcS5yZXNwb25zZTtcbiAgICAgICAgICAgIGlmICghanNvbikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Mb2FkZXIgaW52YWxpZCBqc29uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluaXNoKGpzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidXJsOiBcIiwgdXJsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwicmVzcG9uc2U6IFwiLCByZXEucmVzcG9uc2UsXG4gICAgICAgICAgXCIgcmVhZHlTdGF0ZTogXCIsIHJlcS5yZWFkeVN0YXRlLFxuICAgICAgICAgIFwiIHN0YXR1czogXCIsIHJlcS5zdGF0dXMsXG4gICAgICAgICAgXCIgc3RhdHVzVGV4dDogXCIsIHJlcS5zdGF0dXNUZXh0KTtcbiAgICAgICAgICBpZiAodGltZW91dCA+PSAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHVybCk7XG4gICAgICAgICAgICBhbGVydChg6LWE5rqQJHt1cmx96ZSZ6K+v5rKh5pyJ5Yqg6L295oiQ5Yqf77yBYCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIGVycm9yIDMgdGltZXNcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTcHJpdGUuTG9hZGVyLkZldGNoIGVycm9yIHRyeSBhZ2FpbiwgXCIsIHRpbWVvdXQgKyAxLCBcIiBcIiwgdXJsKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBGZXRjaCh1cmwsIGNhbGxiYWNrLCB0aW1lb3V0ICsgMSk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXEuc2VuZCgpO1xuICB9XG5cbiAgU3ByaXRlLmFzc2lnbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IHVybHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBhcmdzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdXJscy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGZvciAobGV0IHVybCBvZiBlbGVtZW50KSB7XG4gICAgICAgICAgICB1cmxzLnB1c2godXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlbGVtZW50LCBhcmdzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUubG9hZCBnb3QgaW52YWxpZCBhcmd1bWVudFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZG9uZSA9IDA7XG4gICAgICBsZXQgcmV0ID0gW107XG4gICAgICByZXQubGVuZ3RoID0gdXJscy5sZW5ndGg7XG5cbiAgICAgIGxldCBEb25lID0gKCkgPT4ge1xuICAgICAgICBkb25lKys7XG5cbiAgICAgICAgaWYgKGRvbmUgPj0gcmV0Lmxlbmd0aCkge1xuICAgICAgICAgIHJlc29sdmUocmV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cmxzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIEZldGNoKGVsZW1lbnQsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICByZXRbaW5kZXhdID0gcmVzdWx0O1xuICAgICAgICAgIERvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9KTtcblxufSkoKTtcbiJdfQ==
