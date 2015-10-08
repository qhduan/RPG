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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      _get(Object.getPrototypeOf(SpriteTween.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.object = object;
      privates.callback = null;
      privates.action = [];
      privates.doing = false;
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
        var _this = this;

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
            _this.nextAction();
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
        var _this2 = this;

        this.doing = true;
        callback().then(function () {
          _this2.doing = false;
          _this2.nextAction();
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
        var _this3 = this;

        var privates = internal(this);
        privates.doing = true;
        setTimeout(function () {
          privates.doing = false;
          _this3.nextAction();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9TcHJpdGUvU3ByaXRlVHdlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0RBLENBQUMsWUFBWTtBQUNaLGNBQVksQ0FBQzs7QUFFWixNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O2lCQUFYLFdBQVc7O2FBRTNCLGFBQUMsTUFBTSxFQUFFO0FBQ2xCLGVBQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2pDOzs7QUFFVyxhQU5lLFdBQVcsQ0FNekIsTUFBTSxFQUFFOzRCQU5NLFdBQVc7O0FBT3BDLGlDQVB5QixXQUFXLDZDQU81QjtBQUNSLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixjQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN6QixjQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN6QixjQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNyQixjQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN4Qjs7aUJBYjBCLFdBQVc7O2FBZTNCLHNCQUFHO0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLFlBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pELGNBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsa0JBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixrQkFBUSxNQUFNLENBQUMsSUFBSTtBQUNqQixpQkFBSyxJQUFJO0FBQ1Asa0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsb0JBQU07QUFBQSxBQUNSLGlCQUFLLE1BQU07QUFDVCxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0Isb0JBQU07QUFBQSxBQUNSLGlCQUFLLE1BQU07QUFDVCxrQkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsb0JBQU07QUFBQSxBQUNSLGlCQUFLLFNBQVM7QUFDWixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsb0JBQU07QUFBQSxBQUNSO0FBQ0UscUJBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsb0JBQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUFBLFdBQ3REO1NBQ0Y7T0FDRjs7O2FBRVEsa0JBQUMsVUFBVSxFQUFFLElBQUksRUFBRTs7O0FBQzFCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRXRCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVkLGFBQUssSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQzFCLGNBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNwQyxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDO1dBQ3JCO1NBQ0Y7O0FBRUQsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLFlBQU07QUFDNUIsZUFBSyxFQUFFLENBQUM7QUFDUixjQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDbkIsaUJBQUssSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQzFCLHNCQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4QztBQUNELHlCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsb0JBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGtCQUFLLFVBQVUsRUFBRSxDQUFDO1dBQ25CLE1BQU07QUFDTCxpQkFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDcEIsc0JBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1dBQ0Y7U0FDRixFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ1A7OzthQUVFLFlBQUMsVUFBVSxFQUFFLElBQUksRUFBRTtBQUNwQixnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsY0FBSSxFQUFFLElBQUk7QUFDVixvQkFBVSxFQUFFLFVBQVU7QUFDdEIsY0FBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7O2FBRWEsdUJBQUMsUUFBUSxFQUFFOzs7QUFDdkIsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsZ0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3BCLGlCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsaUJBQUssVUFBVSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7OzthQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsY0FBSSxFQUFFLFNBQVM7QUFDZixrQkFBUSxFQUFFLFFBQVE7U0FDbkIsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLGVBQU8sSUFBSSxDQUFDO09BQ2I7OzthQUVVLG9CQUFDLFFBQVEsRUFBRTtBQUNwQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixnQkFBUSxFQUFFLENBQUM7QUFDWCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDbkI7OzthQUVJLGNBQUMsUUFBUSxFQUFFO0FBQ2QsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3pCLGNBQUksRUFBRSxNQUFNO0FBQ1osa0JBQVEsRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixlQUFPLElBQUksQ0FBQztPQUNiOzs7YUFFVSxvQkFBQyxJQUFJLEVBQUU7OztBQUNoQixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZ0JBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLGtCQUFVLENBQUMsWUFBTTtBQUNmLGtCQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN2QixpQkFBSyxVQUFVLEVBQUUsQ0FBQztTQUNuQixFQUFFLElBQUksQ0FBQyxDQUFDO09BQ1Y7OzthQUVJLGNBQUMsSUFBSSxFQUFFO0FBQ1YsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3pCLGNBQUksRUFBRSxNQUFNO0FBQ1osY0FBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7O1dBcEkwQixXQUFXO0tBQVMsTUFBTSxDQUFDLEtBQUssRUFxSTNELENBQUM7Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJzcmMvU3ByaXRlL1Nwcml0ZVR3ZWVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLypcblxuU3ByaXRlLlR3ZWVuLmdldChHYW1lLmhlcm8pXG4ucHJvbWlzZShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIEdhbWUuaGVyby5nb3RvKEdhbWUuaGVyby54LCBHYW1lLmhlcm8ueSArIDUsXCJ3YWxrXCIpLnRoZW4ocmVzb2x2ZSk7XG4gIH0pXG59KVxuLndhaXQoMjAwMClcbi5wcm9taXNlKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgR2FtZS5oZXJvLmdvdG8oR2FtZS5oZXJvLnggKyA1LCBHYW1lLmhlcm8ueSwgXCJ3YWxrXCIpLnRoZW4ocmVzb2x2ZSk7XG4gIH0pXG59KVxuLnRvKHthbHBoYTogMH0sIDUwMClcbi53YWl0KDUwMClcbi50byh7YWxwaGE6IDF9LCA1MDApXG4uY2FsbChmdW5jdGlvbiAoKSB7XG4gIEdhbWUucG9wdXAoR2FtZS5oZXJvLnNwcml0ZSwgXCJoZWxsb1wiLCAwLCAtNTApO1xufSlcbi53YWl0KDIwMDApXG4uY2FsbChmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUubG9nKFwib2tcIik7XG59KTtcblxuXG4qL1xuXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBTcHJpdGUuVHdlZW5cbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIFNwcml0ZS5hc3NpZ24oXCJUd2VlblwiLCBjbGFzcyBTcHJpdGVUd2VlbiBleHRlbmRzIFNwcml0ZS5FdmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IChvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgU3ByaXRlLlR3ZWVuKG9iamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKG9iamVjdCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgcHJpdmF0ZXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgcHJpdmF0ZXMuYWN0aW9uID0gW107XG4gICAgICBwcml2YXRlcy5kb2luZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG5leHRBY3Rpb24gKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMuZG9pbmcgPT0gZmFsc2UgJiYgcHJpdmF0ZXMuYWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGFjdGlvbiA9IHByaXZhdGVzLmFjdGlvblswXTtcbiAgICAgICAgcHJpdmF0ZXMuYWN0aW9uLnNwbGljZSgwLCAxKTtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJ0b1wiOlxuICAgICAgICAgICAgdGhpcy50b0FjdGlvbihhY3Rpb24uYXR0cmlidXRlcywgYWN0aW9uLnRpbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIndhaXRcIjpcbiAgICAgICAgICAgIHRoaXMud2FpdEFjdGlvbihhY3Rpb24udGltZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiY2FsbFwiOlxuICAgICAgICAgICAgdGhpcy5jYWxsQWN0aW9uKGFjdGlvbi5jYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwicHJvbWlzZVwiOlxuICAgICAgICAgICAgdGhpcy5wcm9taXNlQWN0aW9uKGFjdGlvbi5jYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihhY3Rpb24pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLlR3ZWVuIGdvdCBpbnZhbGlkIGFjdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvQWN0aW9uIChhdHRyaWJ1dGVzLCB0aW1lKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRvaW5nID0gdHJ1ZTtcblxuICAgICAgbGV0IHNwbGljZSA9IE1hdGgubWluKDEwMCwgdGltZSk7XG4gICAgICBsZXQgdCA9IHRpbWUgLyBzcGxpY2U7XG4gICAgICBsZXQgc3RlcCA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGF0dHJpYnV0ZXNba2V5XSkpIHtcbiAgICAgICAgICBzdGVwW2tleV0gPSBhdHRyaWJ1dGVzW2tleV0gLSBwcml2YXRlcy5vYmplY3Rba2V5XTtcbiAgICAgICAgICBzdGVwW2tleV0gLz0gc3BsaWNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBsZXQgaW50ZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA+PSBzcGxpY2UpIHtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcHJpdmF0ZXMub2JqZWN0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXIpO1xuICAgICAgICAgIHByaXZhdGVzLmRvaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIHN0ZXApIHtcbiAgICAgICAgICAgIHByaXZhdGVzLm9iamVjdFtrZXldICs9IHN0ZXBba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHQpO1xuICAgIH1cblxuICAgIHRvIChhdHRyaWJ1dGVzLCB0aW1lKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5hY3Rpb24ucHVzaCh7XG4gICAgICAgIHR5cGU6IFwidG9cIixcbiAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgdGltZTogdGltZVxuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHByb21pc2VBY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmRvaW5nID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuZG9pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm9taXNlIChjYWxsYmFjaykge1xuICAgICAgaW50ZXJuYWwodGhpcykuYWN0aW9uLnB1c2goe1xuICAgICAgICB0eXBlOiBcInByb21pc2VcIixcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FsbEFjdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZG9pbmcgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHRoaXMuZG9pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgIH1cblxuICAgIGNhbGwgKGNhbGxiYWNrKSB7XG4gICAgICBpbnRlcm5hbCh0aGlzKS5hY3Rpb24ucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiY2FsbFwiLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWl0QWN0aW9uICh0aW1lKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmRvaW5nID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBwcml2YXRlcy5kb2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgIH0sIHRpbWUpO1xuICAgIH1cblxuICAgIHdhaXQgKHRpbWUpIHtcbiAgICAgIGludGVybmFsKHRoaXMpLmFjdGlvbi5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJ3YWl0XCIsXG4gICAgICAgIHRpbWU6IHRpbWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0QWN0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xuXG59KSgpO1xuIl19