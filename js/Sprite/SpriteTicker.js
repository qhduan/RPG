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
 * @fileoverview Sprite.Ticker
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  "use strict";

  var tickerCount = 0;

  var SpriteTicker = (function (_Sprite$Event) {
    _inherits(SpriteTicker, _Sprite$Event);

    function SpriteTicker() {
      _classCallCheck(this, SpriteTicker);

      _get(Object.getPrototypeOf(SpriteTicker.prototype), "constructor", this).call(this);
      this.tick();
    }

    _createClass(SpriteTicker, [{
      key: "tick",
      value: function tick() {
        var _this = this;

        tickerCount++;
        this.emit("tick", false, tickerCount);
        window.requestAnimationFrame(function () {
          _this.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this2 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this2.off("tick", id);
            if (callback) {
              callback();
            }
          }
        });
        return id;
      }
    }, {
      key: "clearAfter",
      value: function clearAfter(id) {
        this.off("tick", id);
      }
    }, {
      key: "whiles",
      value: function whiles(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (callback) {
              callback(true);
            }
            _this3.off("tick", id);
          } else {
            if (callback) {
              callback(false);
            }
          }
        });
        return id;
      }
    }, {
      key: "clearWhiles",
      value: function clearWhiles(id) {
        this.off("tick", id);
      }
    }]);

    return SpriteTicker;
  })(Sprite.Event);

  ;

  Sprite.assign("Ticker", new SpriteTicker());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7O01BRWQsWUFBWTtjQUFaLFlBQVk7O0FBQ0osYUFEUixZQUFZLEdBQ0Q7NEJBRFgsWUFBWTs7QUFFZCxpQ0FGRSxZQUFZLDZDQUVOO0FBQ1IsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7O2lCQUpHLFlBQVk7O2FBTVgsZ0JBQUc7OztBQUNOLG1CQUFXLEVBQUUsQ0FBQztBQUNkLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN0QyxjQUFNLENBQUMscUJBQXFCLENBQUMsWUFBTTtBQUNqQyxnQkFBSyxJQUFJLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FBQztPQUNKOzs7YUFFSyxlQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7OztBQUN0QixZQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQzdCLGVBQUssRUFBRSxDQUFDO0FBQ1IsY0FBSSxLQUFLLElBQUksS0FBSyxFQUFFO0FBQ2xCLG1CQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckIsZ0JBQUksUUFBUSxFQUFFO0FBQ1osc0JBQVEsRUFBRSxDQUFDO2FBQ1o7V0FDRjtTQUNGLENBQUMsQ0FBQztBQUNILGVBQU8sRUFBRSxDQUFDO09BQ1g7OzthQUVVLG9CQUFDLEVBQUUsRUFBRTtBQUNkLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ3RCOzs7YUFFTSxnQkFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFOzs7QUFDdkIsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBTTtBQUM3QixlQUFLLEVBQUUsQ0FBQztBQUNSLGNBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUNsQixnQkFBSSxRQUFRLEVBQUU7QUFDWixzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hCO0FBQ0QsbUJBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztXQUN0QixNQUFNO0FBQ0wsZ0JBQUksUUFBUSxFQUFFO0FBQ1osc0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQjtXQUNGO1NBQ0YsQ0FBQyxDQUFDO0FBQ0gsZUFBTyxFQUFFLENBQUM7T0FDWDs7O2FBRVcscUJBQUMsRUFBRSxFQUFFO0FBQ2YsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDdEI7OztXQXBERyxZQUFZO0tBQVMsTUFBTSxDQUFDLEtBQUs7O0FBc0R0QyxHQUFDOztBQUVGLFFBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztDQUU3QyxDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVUaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLlRpY2tlclxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgdGlja2VyQ291bnQgPSAwO1xuXG4gIGNsYXNzIFNwcml0ZVRpY2tlciBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudGljaygpO1xuICAgIH1cblxuICAgIHRpY2sgKCkge1xuICAgICAgdGlja2VyQ291bnQrKztcbiAgICAgIHRoaXMuZW1pdChcInRpY2tcIiwgZmFsc2UsIHRpY2tlckNvdW50KTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLnRpY2soKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFmdGVyICh0aW1lcywgY2FsbGJhY2spIHtcbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaWQgPSB0aGlzLm9uKFwidGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSB0aW1lcykge1xuICAgICAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgY2xlYXJBZnRlciAoaWQpIHtcbiAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgfVxuXG4gICAgd2hpbGVzICh0aW1lcywgY2FsbGJhY2spIHtcbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaWQgPSB0aGlzLm9uKFwidGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSB0aW1lcykge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBjbGVhcldoaWxlcyAoaWQpIHtcbiAgICAgIHRoaXMub2ZmKFwidGlja1wiLCBpZCk7XG4gICAgfVxuXG4gIH07XG5cbiAgU3ByaXRlLmFzc2lnbihcIlRpY2tlclwiLCBuZXcgU3ByaXRlVGlja2VyKCkpO1xuXG59KSgpO1xuIl19
