"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
          var _last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + _last));
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

          if (Game.windows.interface.showing) {
            Game.windows.interface.hide();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVBcmNoaXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7YUFBUSxXQUFXOzRCQUFYLFdBQVc7OztpQkFBWCxXQUFXOzs2QkFFdkIsRUFBRSxFQUFFO0FBQ2pCLFlBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDO09BQ0Y7Ozs7Ozs2QkFHYztBQUNiLFlBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLGFBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtBQUNuQyxjQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDN0IsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ25EO1NBQ0Y7QUFDRCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixlQUFPLElBQUksQ0FBQztPQUNiOzs7Ozs7NkJBR2M7QUFDYixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLFlBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbkIsY0FBSSxLQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLFdBQVMsS0FBSSxDQUFHLENBQUMsQ0FB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b250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIEdhbWUuYXNzaWduKFwiQXJjaGl2ZVwiLCBjbGFzcyBHYW1lQXJjaGl2ZSB7XG5cbiAgICBzdGF0aWMgcmVtb3ZlIChpZCkge1xuICAgICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShpZCkpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDov5Tlm57miYDmnInlrZjmoaPvvIxPYmplY3TmoLzlvI9cbiAgICBzdGF0aWMgbGlzdCAoKSB7XG4gICAgICBsZXQga2V5cyA9IFtdO1xuICAgICAgZm9yIChsZXQga2V5IGluIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgaWYgKGtleS5tYXRjaCgvXlNBVkVfKFxcZCspJC8pKSB7XG4gICAgICAgICAga2V5cy5wdXNoKHBhcnNlSW50KGtleS5tYXRjaCgvXlNBVkVfKFxcZCspJC8pWzFdKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGtleXMuc29ydCgpO1xuICAgICAga2V5cy5yZXZlcnNlKCk7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9XG5cbiAgICAvLyDov5Tlm57mnIDmlrDlrZjmoaPvvIxPYmplY3TmoLzlvI9cbiAgICBzdGF0aWMgbGFzdCAoKSB7XG4gICAgICBsZXQgbGlzdCA9IEdhbWUuQXJjaGl2ZS5saXN0KCk7XG4gICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBsYXN0ID0gbGlzdFswXTtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGBTQVZFXyR7bGFzdH1gKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXIgKCkge1xuICAgICAgZm9yIChsZXQga2V5IGluIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgaWYgKGtleS5tYXRjaCgvXlNBVkVfKFxcZCspJC8pKSB7XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZSAoZGF0YSkge1xuICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICBsZXQgaWQgPSBub3cuZ2V0VGltZSgpO1xuXG4gICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICBkYXRhLm5hbWUgPSBkYXRhLmhlcm8ubmFtZTtcbiAgICAgIGRhdGEuZGF0ZSA9IG5vdy50b0xvY2FsZVN0cmluZygpO1xuXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oYFNBVkVfJHtpZH1gLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCAoaWQpIHtcbiAgICAgIGlmIChpZCAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oaWQpKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShpZCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWQgKGlkKSB7XG4gICAgICBsZXQgZGF0YSA9IEdhbWUuQXJjaGl2ZS5nZXQoaWQpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSBHYW1lLkFyY2hpdmUubGFzdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YSkge1xuXG4gICAgICAgIGlmIChHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnNob3dpbmcpIHtcbiAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBHYW1lLndpbmRvd3MubWFpbi5oaWRlKCk7XG5cbiAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgaGVyb0RhdGEgPSBkYXRhLmhlcm87XG5cbiAgICAgICAgICBHYW1lLmRyYXdIZXJvKGhlcm9EYXRhLmN1c3RvbSkudGhlbihmdW5jdGlvbiAoaGVyb0ltYWdlKSB7XG4gICAgICAgICAgICBoZXJvRGF0YS5pbWFnZSA9IGhlcm9JbWFnZTtcbiAgICAgICAgICAgIEdhbWUuaGVybyA9IG5ldyBHYW1lLkFjdG9ySGVybyhoZXJvRGF0YSk7XG5cbiAgICAgICAgICAgIEdhbWUuaGVyby5vbihcImNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICBHYW1lLmhlcm8uZ290b0FyZWEoaGVyb0RhdGEuYXJlYSwgaGVyb0RhdGEueCwgaGVyb0RhdGEueSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIDIwKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImlkOlwiLCBpZCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaWQsIEdhbWUuQXJjaGl2ZS5sb2FkXCIpO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxufSkoKTtcbiJdfQ==
