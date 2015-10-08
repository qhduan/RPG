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

  function CheckHeroAction() {
    if (Game.paused) return;

    var state = "run";
    if (Sprite.Input.isPressed("shift")) {
      state = "walk";
    }

    if (Sprite.Input.isPressed("left")) {
      Game.hero.go(state, "left").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down").then(CheckHeroAction);
    }
  }

  var destIcon = null;

  Game.assign("Input", (function () {
    function GameInput() {
      _classCallCheck(this, GameInput);
    }

    _createClass(GameInput, null, [{
      key: "clearDest",
      value: function clearDest() {
        destIcon.visible = false;
      }
    }, {
      key: "setDest",
      value: function setDest(x, y) {
        destIcon.x = x * 32 + 16;
        destIcon.y = y * 32 + 16;
        destIcon.visible = true;
      }
    }, {
      key: "init",
      value: function init() {

        destIcon = new Sprite.Shape();
        destIcon.circle({
          cx: 5,
          cy: 5,
          r: 5,
          stroke: "red",
          fill: "green"
        });
        destIcon.visible = false;
        destIcon.centerX = 5;
        destIcon.centerY = 5;

        Game.windows.stage.on("mousedown", function (event) {
          var data = event.data;

          data.x += Game.stage.centerX;
          data.y += Game.stage.centerY;

          data.x = Math.floor(data.x / 32);
          data.y = Math.floor(data.y / 32);

          if (!Game.layers.infoLayer.hasChild(destIcon)) {
            Game.layers.infoLayer.appendChild(destIcon);
          }

          if (Game.hero.x != data.x || Game.hero.y != data.y) {
            Game.hero.goto(data.x, data.y, "run").then(function () {
              destIcon.visible = false;
              if (Game.hintObject && Game.hintObject.heroUse) {
                Game.hintObject.heroUse();
              }
            });
            /*
            if (destPosition) {
              destIcon.x = data.x * 32 + 16;
              destIcon.y = data.y * 32 + 16;
              destIcon.visible = true;
            }
            */
          }
        });

        Sprite.Ticker.on("tick", function () {

          if (Game.paused) return;
          if (!Game.hero) return;
          if (!Game.area) return;
          if (!Game.area.map) return;

          CheckHeroAction();
          if (!Game.hero.walking) {
            Game.hero.stop();
          }

          Game.hero.focus();
        });
      }
    }]);

    return GameInput;
  })());

  Game.assign("initInput", function () {

    /*
      let mousePressed = false;
       Game.stage.on("stagemousedown", function (event) {
        mousePressed = true;
      });
       Game.stage.on("stagemouseup", function (event) {
        mousePressed = false;
      });
       Game.stage.on("mouseleave", function (event) { // mouse leave canvas
        mousePressed = false;
      });
      */
  }); // Game.oninit
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBR2IsV0FBUyxlQUFlLEdBQUk7QUFDMUIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRXhCLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ25DLFdBQUssR0FBRyxNQUFNLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ25ELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ2pELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3BELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tB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SSxDQUFDLEdBQUcsRUFBRSxPQUFPOztBQUUzQix5QkFBZSxFQUFFLENBQUM7QUFDbEIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2xCOztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7OztXQXRFd0IsU0FBUztPQXVFbEMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZOzs7Ozs7Ozs7Ozs7OztHQXFCcEMsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICBmdW5jdGlvbiBDaGVja0hlcm9BY3Rpb24gKCkge1xuICAgIGlmIChHYW1lLnBhdXNlZCkgcmV0dXJuO1xuXG4gICAgbGV0IHN0YXRlID0gXCJydW5cIjtcbiAgICBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcInNoaWZ0XCIpKSB7XG4gICAgICBzdGF0ZSA9IFwid2Fsa1wiO1xuICAgIH1cblxuICAgIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwibGVmdFwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcImxlZnRcIikudGhlbihDaGVja0hlcm9BY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcInVwXCIpKSB7XG4gICAgICBHYW1lLmhlcm8uZ28oc3RhdGUsIFwidXBcIikudGhlbihDaGVja0hlcm9BY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcInJpZ2h0XCIpKSB7XG4gICAgICBHYW1lLmhlcm8uZ28oc3RhdGUsIFwicmlnaHRcIikudGhlbihDaGVja0hlcm9BY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcImRvd25cIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJkb3duXCIpLnRoZW4oQ2hlY2tIZXJvQWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBsZXQgZGVzdEljb24gPSBudWxsO1xuXG4gIEdhbWUuYXNzaWduKFwiSW5wdXRcIiwgY2xhc3MgR2FtZUlucHV0IHtcblxuICAgIHN0YXRpYyBjbGVhckRlc3QgKCkge1xuICAgICAgZGVzdEljb24udmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREZXN0ICh4LCB5KSB7XG4gICAgICBkZXN0SWNvbi54ID0geCAqIDMyICsgMTY7XG4gICAgICBkZXN0SWNvbi55ID0geSAqIDMyICsgMTY7XG4gICAgICBkZXN0SWNvbi52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCAoKSB7XG5cbiAgICAgIGRlc3RJY29uID0gbmV3IFNwcml0ZS5TaGFwZSgpO1xuICAgICAgZGVzdEljb24uY2lyY2xlKHtcbiAgICAgICAgY3g6IDUsXG4gICAgICAgIGN5OiA1LFxuICAgICAgICByOiA1LFxuICAgICAgICBzdHJva2U6IFwicmVkXCIsXG4gICAgICAgIGZpbGw6IFwiZ3JlZW5cIlxuICAgICAgfSk7XG4gICAgICBkZXN0SWNvbi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBkZXN0SWNvbi5jZW50ZXJYID0gNTtcbiAgICAgIGRlc3RJY29uLmNlbnRlclkgPSA1O1xuXG4gICAgICBHYW1lLndpbmRvd3Muc3RhZ2Uub24oXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gZXZlbnQuZGF0YTtcblxuICAgICAgICBkYXRhLnggKz0gR2FtZS5zdGFnZS5jZW50ZXJYO1xuICAgICAgICBkYXRhLnkgKz0gR2FtZS5zdGFnZS5jZW50ZXJZO1xuXG4gICAgICAgIGRhdGEueCA9IE1hdGguZmxvb3IoZGF0YS54IC8gMzIpO1xuICAgICAgICBkYXRhLnkgPSBNYXRoLmZsb29yKGRhdGEueSAvIDMyKTtcblxuICAgICAgICBpZiAoIUdhbWUubGF5ZXJzLmluZm9MYXllci5oYXNDaGlsZChkZXN0SWNvbikpIHtcbiAgICAgICAgICBHYW1lLmxheWVycy5pbmZvTGF5ZXIuYXBwZW5kQ2hpbGQoZGVzdEljb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEdhbWUuaGVyby54ICE9IGRhdGEueCB8fCBHYW1lLmhlcm8ueSAhPSBkYXRhLnkpIHtcbiAgICAgICAgICBHYW1lLmhlcm8uZ290byhkYXRhLngsIGRhdGEueSwgXCJydW5cIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBkZXN0SWNvbi52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoR2FtZS5oaW50T2JqZWN0ICYmIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKSB7XG4gICAgICAgICAgICAgIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLypcbiAgICAgICAgICBpZiAoZGVzdFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBkZXN0SWNvbi54ID0gZGF0YS54ICogMzIgKyAxNjtcbiAgICAgICAgICAgIGRlc3RJY29uLnkgPSBkYXRhLnkgKiAzMiArIDE2O1xuICAgICAgICAgICAgZGVzdEljb24udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBTcHJpdGUuVGlja2VyLm9uKFwidGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKEdhbWUucGF1c2VkKSByZXR1cm47XG4gICAgICAgIGlmICghR2FtZS5oZXJvKSByZXR1cm47XG4gICAgICAgIGlmICghR2FtZS5hcmVhKSByZXR1cm47XG4gICAgICAgIGlmICghR2FtZS5hcmVhLm1hcCkgcmV0dXJuO1xuXG4gICAgICAgIENoZWNrSGVyb0FjdGlvbigpO1xuICAgICAgICBpZiAoIUdhbWUuaGVyby53YWxraW5nKSB7XG4gICAgICAgICAgR2FtZS5oZXJvLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEdhbWUuaGVyby5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBHYW1lLmFzc2lnbihcImluaXRJbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG5cblxuXG5cblxuICAvKlxuICAgIGxldCBtb3VzZVByZXNzZWQgPSBmYWxzZTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJzdGFnZW1vdXNlZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIG1vdXNlUHJlc3NlZCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBHYW1lLnN0YWdlLm9uKFwic3RhZ2Vtb3VzZXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbW91c2VQcmVzc2VkID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBHYW1lLnN0YWdlLm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHsgLy8gbW91c2UgbGVhdmUgY2FudmFzXG4gICAgICBtb3VzZVByZXNzZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICAqL1xuICB9KTsgLy8gR2FtZS5vbmluaXRcblxuXG59KSgpO1xuIl19
