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

/*

Sprite.Tween.get(Game.hero)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x, Game.hero.y + 5,"walk").then(resolve);
  })
})
.wait(2000)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x + 5, Game.hero.y, "walk").then(resolve);
  })
})
.to({alpha: 0}, 500)
.wait(500)
.to({alpha: 1}, 500)
.call(function () {
  Game.popup(Game.hero.sprite, "hello", 0, -50);
})
.wait(2000)
.call(function () {
  console.log("ok");
});


*/

/**
 * @fileoverview Sprite.Tween
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Sprite.assign("Tween", (function (_Sprite$Event) {
    _inherits(SpriteTween, _Sprite$Event);

    _createClass(SpriteTween, null, [{
      key: "get",
      value: function get(object) {
        return new Sprite.Tween(object);
      }
    }]);

    function SpriteTween(object) {
      _classCallCheck(this, SpriteTween);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteTween).call(this));

      var privates = internal(_this);
      privates.object = object;
      privates.callback = null;
      privates.action = [];
      privates.doing = false;
      return _this;
    }

    _createClass(SpriteTween, [{
      key: "nextAction",
      value: function nextAction() {
        var privates = internal(this);
        if (privates.doing == false && privates.action.length > 0) {
          var action = privates.action[0];
          privates.action.splice(0, 1);
          switch (action.type) {
            case "to":
              this.toAction(action.attributes, action.time);
              break;
            case "wait":
              this.waitAction(action.time);
              break;
            case "call":
              this.callAction(action.callback);
              break;
            case "promise":
              this.promiseAction(action.callback);
              break;
            default:
              console.error(action);
              throw new Error("Sprite.Tween got invalid action");
          }
        }
      }
    }, {
      key: "toAction",
      value: function toAction(attributes, time) {
        var _this2 = this;

        var privates = internal(this);
        privates.doing = true;

        var splice = Math.min(100, time);
        var t = time / splice;
        var step = {};

        for (var key in attributes) {
          if (Number.isFinite(attributes[key])) {
            step[key] = attributes[key] - privates.object[key];
            step[key] /= splice;
          }
        }

        var count = 0;
        var inter = setInterval(function () {
          count++;
          if (count >= splice) {
            for (var key in attributes) {
              privates.object[key] = attributes[key];
            }
            clearInterval(inter);
            privates.doing = false;
            _this2.nextAction();
          } else {
            for (var key in step) {
              privates.object[key] += step[key];
            }
          }
        }, t);
      }
    }, {
      key: "to",
      value: function to(attributes, time) {
        internal(this).action.push({
          type: "to",
          attributes: attributes,
          time: time
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "promiseAction",
      value: function promiseAction(callback) {
        var _this3 = this;

        this.doing = true;
        callback().then(function () {
          _this3.doing = false;
          _this3.nextAction();
        });
      }
    }, {
      key: "promise",
      value: function promise(callback) {
        internal(this).action.push({
          type: "promise",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "callAction",
      value: function callAction(callback) {
        this.doing = true;
        callback();
        this.doing = false;
        this.nextAction();
      }
    }, {
      key: "call",
      value: function call(callback) {
        internal(this).action.push({
          type: "call",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "waitAction",
      value: function waitAction(time) {
        var _this4 = this;

        var privates = internal(this);
        privates.doing = true;
        setTimeout(function () {
          privates.doing = false;
          _this4.nextAction();
        }, time);
      }
    }, {
      key: "wait",
      value: function wait(time) {
        internal(this).action.push({
          type: "wait",
          time: time
        });
        this.nextAction();
        return this;
      }
    }]);

    return SpriteTween;
  })(Sprite.Event));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlVHdlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0RBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O2lCQUFYLFdBQVc7OzBCQUUxQixNQUFNLEVBQUU7QUFDbEIsZUFBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDakM7OztBQUVELGFBTjJCLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O3lFQUFYLFdBQVc7O0FBUXBDLFVBQUksUUFBUSxHQUFHLFFBQVEsT0FBTSxDQUFDO0FBQzlCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLGNBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLGNBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztLQUN4Qjs7aUJBYjBCLFdBQVc7O21DQWV4QjtBQUNaLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6RCxjQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLGtCQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0Isa0JBQVEsTUFBTSxDQUFDLElBQUk7QUFDakIsaUJB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LENBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBcEkwQixXQUFXO0tBQVMsTUFBTSxDQUFDLEtBQUssRUFxSTNELENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVUd2Vlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qXG5cblNwcml0ZS5Ud2Vlbi5nZXQoR2FtZS5oZXJvKVxuLnByb21pc2UoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBHYW1lLmhlcm8uZ290byhHYW1lLmhlcm8ueCwgR2FtZS5oZXJvLnkgKyA1LFwid2Fsa1wiKS50aGVuKHJlc29sdmUpO1xuICB9KVxufSlcbi53YWl0KDIwMDApXG4ucHJvbWlzZShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIEdhbWUuaGVyby5nb3RvKEdhbWUuaGVyby54ICsgNSwgR2FtZS5oZXJvLnksIFwid2Fsa1wiKS50aGVuKHJlc29sdmUpO1xuICB9KVxufSlcbi50byh7YWxwaGE6IDB9LCA1MDApXG4ud2FpdCg1MDApXG4udG8oe2FscGhhOiAxfSwgNTAwKVxuLmNhbGwoZnVuY3Rpb24gKCkge1xuICBHYW1lLnBvcHVwKEdhbWUuaGVyby5zcHJpdGUsIFwiaGVsbG9cIiwgMCwgLTUwKTtcbn0pXG4ud2FpdCgyMDAwKVxuLmNhbGwoZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcIm9rXCIpO1xufSk7XG5cblxuKi9cblxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3ByaXRlLlR3ZWVuXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICBTcHJpdGUuYXNzaWduKFwiVHdlZW5cIiwgY2xhc3MgU3ByaXRlVHdlZW4gZXh0ZW5kcyBTcHJpdGUuRXZlbnQge1xuXG4gICAgc3RhdGljIGdldCAob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IFNwcml0ZS5Ud2VlbihvYmplY3QpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yIChvYmplY3QpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgIHByaXZhdGVzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgIHByaXZhdGVzLmFjdGlvbiA9IFtdO1xuICAgICAgcHJpdmF0ZXMuZG9pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZXh0QWN0aW9uICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmRvaW5nID09IGZhbHNlICYmIHByaXZhdGVzLmFjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBhY3Rpb24gPSBwcml2YXRlcy5hY3Rpb25bMF07XG4gICAgICAgIHByaXZhdGVzLmFjdGlvbi5zcGxpY2UoMCwgMSk7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwidG9cIjpcbiAgICAgICAgICAgIHRoaXMudG9BY3Rpb24oYWN0aW9uLmF0dHJpYnV0ZXMsIGFjdGlvbi50aW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ3YWl0XCI6XG4gICAgICAgICAgICB0aGlzLndhaXRBY3Rpb24oYWN0aW9uLnRpbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImNhbGxcIjpcbiAgICAgICAgICAgIHRoaXMuY2FsbEFjdGlvbihhY3Rpb24uY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInByb21pc2VcIjpcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZUFjdGlvbihhY3Rpb24uY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYWN0aW9uKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5Ud2VlbiBnb3QgaW52YWxpZCBhY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b0FjdGlvbiAoYXR0cmlidXRlcywgdGltZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kb2luZyA9IHRydWU7XG5cbiAgICAgIGxldCBzcGxpY2UgPSBNYXRoLm1pbigxMDAsIHRpbWUpO1xuICAgICAgbGV0IHQgPSB0aW1lIC8gc3BsaWNlO1xuICAgICAgbGV0IHN0ZXAgPSB7fTtcblxuICAgICAgZm9yIChsZXQga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShhdHRyaWJ1dGVzW2tleV0pKSB7XG4gICAgICAgICAgc3RlcFtrZXldID0gYXR0cmlidXRlc1trZXldIC0gcHJpdmF0ZXMub2JqZWN0W2tleV07XG4gICAgICAgICAgc3RlcFtrZXldIC89IHNwbGljZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgbGV0IGludGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPj0gc3BsaWNlKSB7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHByaXZhdGVzLm9iamVjdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVyKTtcbiAgICAgICAgICBwcml2YXRlcy5kb2luZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBzdGVwKSB7XG4gICAgICAgICAgICBwcml2YXRlcy5vYmplY3Rba2V5XSArPSBzdGVwW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0KTtcbiAgICB9XG5cbiAgICB0byAoYXR0cmlidXRlcywgdGltZSkge1xuICAgICAgaW50ZXJuYWwodGhpcykuYWN0aW9uLnB1c2goe1xuICAgICAgICB0eXBlOiBcInRvXCIsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgIHRpbWU6IHRpbWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcm9taXNlQWN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5kb2luZyA9IHRydWU7XG4gICAgICBjYWxsYmFjaygpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmRvaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSAoY2FsbGJhY2spIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmFjdGlvbi5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJwcm9taXNlXCIsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhbGxBY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmRvaW5nID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB0aGlzLmRvaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICB9XG5cbiAgICBjYWxsIChjYWxsYmFjaykge1xuICAgICAgaW50ZXJuYWwodGhpcykuYWN0aW9uLnB1c2goe1xuICAgICAgICB0eXBlOiBcImNhbGxcIixcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2FpdEFjdGlvbiAodGltZSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5kb2luZyA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcHJpdmF0ZXMuZG9pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICB9LCB0aW1lKTtcbiAgICB9XG5cbiAgICB3YWl0ICh0aW1lKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5hY3Rpb24ucHVzaCh7XG4gICAgICAgIHR5cGU6IFwid2FpdFwiLFxuICAgICAgICB0aW1lOiB0aW1lXG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxufSkoKTtcbiJdfQ==
