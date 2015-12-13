"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

(function () {
  "use strict";

  var tickerCount = 0;

  var SpriteTicker = (function (_Sprite$Event) {
    _inherits(SpriteTicker, _Sprite$Event);

    function SpriteTicker() {
      _classCallCheck(this, SpriteTicker);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteTicker).call(this));

      _this.tick();
      return _this;
    }

    _createClass(SpriteTicker, [{
      key: "tick",
      value: function tick() {
        var _this2 = this;

        tickerCount++;
        this.emit("tick", false, tickerCount);
        window.requestAnimationFrame(function () {
          _this2.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this3.off("tick", id);
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
        var _this4 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (callback) {
              callback(true);
            }
            _this4.off("tick", id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7O01BRWQsWUFBWTtjQUFaLFlBQVk7O0FBQ2hCLGFBREksWUFBWSxHQUNEOzRCQURYLFlBQVk7O3lFQUFaLFlBQVk7O0FBR2QsWUFBSyxJQUFJLEVBQUUsQ0FBQzs7S0FDYjs7aUJBSkcsWUFBWTs7NkJBTVI7OztBQUNOLG1CQUFXLEVBQUUsQ0FBQztBQUNkLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN0QyxjQUFNLENBQUMscUJBQXFCLENBQUMsWUFBTTtBQUNqQyxpQkFBSyxJQUFJLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FBQztPQUNKOzs7NEJBRU0sS0FBSyxFQUFFLFFBQVEsRUFBRTs7O0FBQ3RCLFlBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDN0IsZUFBSyxFQUFFLENBQUM7QUFDUixjQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFDbEIsbUJBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNyQixnQkFBSSxRQUFRLEVBQUU7QUFDWixzQkFBUSxFQUFFLENBQUM7YUFDWjtXQUNGO1NBQ0YsQ0FBQyxDQUFDO0FBQ0gsZUFBTyxFQUFFLENBQUM7T0FDWDs7O2lDQUVXLEVBQUUsRUFBRTtBQUNkLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ3RCOzs7NkJBRU8sS0FBSyxFQUFFLFFBQVEsRUFBRTs7O0FBQ3ZCLFlBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDN0IsZUFBSyxFQUFFLENBQUM7QUFDUixjQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFDbEIsZ0JBQUksUUFBUSxFQUFFO0FBQ1osc0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQjtBQUNELG1CQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDdEIsTUFBTTtBQUNMLGdCQUFJLFFBQVEsRUFBRTtBQUNaLHNCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakI7V0FDRjtTQUNGLENBQUMsQ0FBQztBQUNILGVBQU8sRUFBRSxDQUFDO09BQ1g7OztrQ0FFWSxFQUFFLEVBQUU7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztPQUN0Qjs7O1dBcERHLFlBQVk7S0FBUyxNQUFNLENBQUMsS0FBSzs7QUFzRHRDLEdBQUM7O0FBRUYsUUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0NBRTdDLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZVRpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBTcHJpdGUuVGlja2VyXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB0aWNrZXJDb3VudCA9IDA7XG5cbiAgY2xhc3MgU3ByaXRlVGlja2VyIGV4dGVuZHMgU3ByaXRlLkV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50aWNrKCk7XG4gICAgfVxuXG4gICAgdGljayAoKSB7XG4gICAgICB0aWNrZXJDb3VudCsrO1xuICAgICAgdGhpcy5lbWl0KFwidGlja1wiLCBmYWxzZSwgdGlja2VyQ291bnQpO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWZ0ZXIgKHRpbWVzLCBjYWxsYmFjaykge1xuICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgIGxldCBpZCA9IHRoaXMub24oXCJ0aWNrXCIsICgpID0+IHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKGNvdW50ID49IHRpbWVzKSB7XG4gICAgICAgICAgdGhpcy5vZmYoXCJ0aWNrXCIsIGlkKTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBjbGVhckFmdGVyIChpZCkge1xuICAgICAgdGhpcy5vZmYoXCJ0aWNrXCIsIGlkKTtcbiAgICB9XG5cbiAgICB3aGlsZXMgKHRpbWVzLCBjYWxsYmFjaykge1xuICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgIGxldCBpZCA9IHRoaXMub24oXCJ0aWNrXCIsICgpID0+IHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKGNvdW50ID49IHRpbWVzKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5vZmYoXCJ0aWNrXCIsIGlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGNsZWFyV2hpbGVzIChpZCkge1xuICAgICAgdGhpcy5vZmYoXCJ0aWNrXCIsIGlkKTtcbiAgICB9XG5cbiAgfTtcblxuICBTcHJpdGUuYXNzaWduKFwiVGlja2VyXCIsIG5ldyBTcHJpdGVUaWNrZXIoKSk7XG5cbn0pKCk7XG4iXX0=
