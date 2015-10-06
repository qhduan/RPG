/*

A-RPG Game, Built using JavaScript ES6
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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Game.assign("Archive", (function () {
    function GameArchive() {
      _classCallCheck(this, GameArchive);
    }

    _createClass(GameArchive, null, [{
      key: "remove",
      value: function remove(id) {
        if (window.localStorage.getItem(id)) {
          window.localStorage.removeItem(id);
        }
      }

      // 返回所有存档，Object格式
    }, {
      key: "list",
      value: function list() {
        var keys = [];
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
          }
        }
        keys.sort();
        keys.reverse();
        return keys;
      }

      // 返回最新存档，Object格式
    }, {
      key: "last",
      value: function last() {
        var list = Game.Archive.list();
        if (list.length > 0) {
          var last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + last));
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }, {
      key: "save",
      value: function save(data) {
        var now = new Date();
        var id = now.getTime();

        data.id = id;
        data.name = data.hero.name;
        data.date = now.toLocaleString();

        window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
      }
    }, {
      key: "get",
      value: function get(id) {
        if (id && window.localStorage.getItem(id)) {
          return JSON.parse(window.localStorage.getItem(id));
        }
        return null;
      }
    }, {
      key: "load",
      value: function load(id) {
        var data = Game.Archive.get(id);
        if (!data) {
          data = Game.Archive.last();
        }

        if (data) {

          if (Game.windows["interface"].showing) {
            Game.windows["interface"].hide();
          }
          Game.windows.main.hide();

          Game.windows.loading.begin();

          setTimeout(function () {
            var heroData = data.hero;

            Game.drawHero(heroData.custom).then(function (heroImage) {
              heroData.image = heroImage;
              Game.hero = new Game.ActorHero(heroData);

              Game.hero.on("complete", function () {

                Game.hero.gotoArea(heroData.area, heroData.x, heroData.y);
              });
            });
          }, 20);
        } else {
          console.error("id:", id);
          throw new Error("Invalid id, Game.Archive.load");
        }
      }
    }]);

    return GameArchive;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7YUFBUSxXQUFXOzRCQUFYLFdBQVc7OztpQkFBWCxXQUFXOzthQUV4QixnQkFBQyxFQUFFLEVBQUU7QUFDakIsWUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxnQkFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEM7T0FDRjs7Ozs7YUFHVyxnQkFBRztBQUNiLFlBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLGFBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtBQUNuQyxjQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDN0IsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ25EO1NBQ0Y7QUFDRCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixlQUFPLElBQUksQ0FBQztPQUNiOzs7OzthQUdXLGdCQUFHO0FBQ2IsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixZQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ25CLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxXQUFTLElBQUks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cmNoaXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgR2FtZS5hc3NpZ24oXCJBcmNoaXZlXCIsIGNsYXNzIEdhbWVBcmNoaXZlIHtcblxuICAgIHN0YXRpYyByZW1vdmUgKGlkKSB7XG4gICAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOi/lOWbnuaJgOacieWtmOaho++8jE9iamVjdOagvOW8j1xuICAgIHN0YXRpYyBsaXN0ICgpIHtcbiAgICAgIGxldCBrZXlzID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgICBpZiAoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLykpIHtcbiAgICAgICAgICBrZXlzLnB1c2gocGFyc2VJbnQoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLylbMV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5cy5zb3J0KCk7XG4gICAgICBrZXlzLnJldmVyc2UoKTtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8vIOi/lOWbnuacgOaWsOWtmOaho++8jE9iamVjdOagvOW8j1xuICAgIHN0YXRpYyBsYXN0ICgpIHtcbiAgICAgIGxldCBsaXN0ID0gR2FtZS5BcmNoaXZlLmxpc3QoKTtcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGxhc3QgPSBsaXN0WzBdO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oYFNBVkVfJHtsYXN0fWApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBjbGVhciAoKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgICBpZiAoa2V5Lm1hdGNoKC9eU0FWRV8oXFxkKykkLykpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlIChkYXRhKSB7XG4gICAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgIGxldCBpZCA9IG5vdy5nZXRUaW1lKCk7XG5cbiAgICAgIGRhdGEuaWQgPSBpZDtcbiAgICAgIGRhdGEubmFtZSA9IGRhdGEuaGVyby5uYW1lO1xuICAgICAgZGF0YS5kYXRlID0gbm93LnRvTG9jYWxlU3RyaW5nKCk7XG5cbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShgU0FWRV8ke2lkfWAsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IChpZCkge1xuICAgICAgaWYgKGlkICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShpZCkpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIGxldCBkYXRhID0gR2FtZS5BcmNoaXZlLmdldChpZCk7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IEdhbWUuQXJjaGl2ZS5sYXN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhKSB7XG5cbiAgICAgICAgaWYgKEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvd2luZykge1xuICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIEdhbWUud2luZG93cy5tYWluLmhpZGUoKTtcblxuICAgICAgICBHYW1lLndpbmRvd3MubG9hZGluZy5iZWdpbigpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBoZXJvRGF0YSA9IGRhdGEuaGVybztcblxuICAgICAgICAgIEdhbWUuZHJhd0hlcm8oaGVyb0RhdGEuY3VzdG9tKS50aGVuKGZ1bmN0aW9uIChoZXJvSW1hZ2UpIHtcbiAgICAgICAgICAgIGhlcm9EYXRhLmltYWdlID0gaGVyb0ltYWdlO1xuICAgICAgICAgICAgR2FtZS5oZXJvID0gbmV3IEdhbWUuQWN0b3JIZXJvKGhlcm9EYXRhKTtcblxuICAgICAgICAgICAgR2FtZS5oZXJvLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIEdhbWUuaGVyby5nb3RvQXJlYShoZXJvRGF0YS5hcmVhLCBoZXJvRGF0YS54LCBoZXJvRGF0YS55KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMjApO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiaWQ6XCIsIGlkKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBpZCwgR2FtZS5BcmNoaXZlLmxvYWRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59KSgpO1xuIl19
