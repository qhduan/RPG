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
      Game.hero.go(state, "left", CheckHeroAction);
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up", CheckHeroAction);
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right", CheckHeroAction);
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down", CheckHeroAction);
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
            Game.hero.goto(data.x, data.y, "run", function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBR2IsV0FBUyxlQUFlLEdBQUk7QUFDMUIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRXhCLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ25DLFdBQUssR0FBRyxNQUFNLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzlDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzVDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQy9DLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQzlDO0dBQ0Y7O0FBRUQsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVwQixNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87YUFBUSxTQUFTOzRCQUFULFNBQVM7OztpQkFBVCxTQUFTOzthQUVqQixxQkFBRztBQUNsQixnQkFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDMUI7OzthQUVjLGlCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDcEIsZ0JBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDekIsZ0JBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDekIsZ0JBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO09BQ3pCOzs7YUFFVyxnQkFBRzs7QUFFYixnQkFBUSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzlCLGdCQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2QsWUFBRSxFQUFFLENBQUM7QUFDTCxZQUFFLEVBQUUsQ0FBQztBQUNMLFdBQUMsRUFBRSxDQUFDO0FBQ0osZ0JBQU0sRUFBRSxLQUFLO0FBQ2IsY0FBSSxFQUFFLE9BQU87U0FDZCxDQUFDLENBQUM7QUFDSCxnQkFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDekIsZ0JBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLGdCQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzs7QUFFckIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNsRCxjQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOztBQUV0QixjQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzdCLGNBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7O0FBRTdCLGNBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLGNBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDOztBQUVqQyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdDLGdCQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7V0FDN0M7O0FBRUQsY0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDbEQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsWUFBWTtBQUNoRCxzQkFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDekIsa0JBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUM5QyxvQkFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztlQUMzQjthQUNGLENBQUMsQ0FBQzs7Ozs7Ozs7V0FRSjtTQUNGLENBQUMsQ0FBQzs7QUFFSCxjQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBWTs7QUFFbkMsY0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDeEIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUN2QixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPO0FBQ3ZCLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPOztBQUUzQix5QkFBZSxFQUFFLENBQUM7QUFDbEIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3RCLGdCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2xCOztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO09BQ0o7OztXQXRFd0IsU0FBUztPQXVFbEMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZOzs7Ozs7Ozs7Ozs7OztHQXFCcEMsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZUlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICBmdW5jdGlvbiBDaGVja0hlcm9BY3Rpb24gKCkge1xuICAgIGlmIChHYW1lLnBhdXNlZCkgcmV0dXJuO1xuXG4gICAgbGV0IHN0YXRlID0gXCJydW5cIjtcbiAgICBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcInNoaWZ0XCIpKSB7XG4gICAgICBzdGF0ZSA9IFwid2Fsa1wiO1xuICAgIH1cblxuICAgIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwibGVmdFwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcImxlZnRcIiwgQ2hlY2tIZXJvQWN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKFNwcml0ZS5JbnB1dC5pc1ByZXNzZWQoXCJ1cFwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcInVwXCIsIENoZWNrSGVyb0FjdGlvbik7XG4gICAgfSBlbHNlIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwicmlnaHRcIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJyaWdodFwiLCBDaGVja0hlcm9BY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoU3ByaXRlLklucHV0LmlzUHJlc3NlZChcImRvd25cIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJkb3duXCIsIENoZWNrSGVyb0FjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbGV0IGRlc3RJY29uID0gbnVsbDtcblxuICBHYW1lLmFzc2lnbihcIklucHV0XCIsIGNsYXNzIEdhbWVJbnB1dCB7XG5cbiAgICBzdGF0aWMgY2xlYXJEZXN0ICgpIHtcbiAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0RGVzdCAoeCwgeSkge1xuICAgICAgZGVzdEljb24ueCA9IHggKiAzMiArIDE2O1xuICAgICAgZGVzdEljb24ueSA9IHkgKiAzMiArIDE2O1xuICAgICAgZGVzdEljb24udmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQgKCkge1xuXG4gICAgICBkZXN0SWNvbiA9IG5ldyBTcHJpdGUuU2hhcGUoKTtcbiAgICAgIGRlc3RJY29uLmNpcmNsZSh7XG4gICAgICAgIGN4OiA1LFxuICAgICAgICBjeTogNSxcbiAgICAgICAgcjogNSxcbiAgICAgICAgc3Ryb2tlOiBcInJlZFwiLFxuICAgICAgICBmaWxsOiBcImdyZWVuXCJcbiAgICAgIH0pO1xuICAgICAgZGVzdEljb24udmlzaWJsZSA9IGZhbHNlO1xuICAgICAgZGVzdEljb24uY2VudGVyWCA9IDU7XG4gICAgICBkZXN0SWNvbi5jZW50ZXJZID0gNTtcblxuICAgICAgR2FtZS53aW5kb3dzLnN0YWdlLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgZGF0YS54ICs9IEdhbWUuc3RhZ2UuY2VudGVyWDtcbiAgICAgICAgZGF0YS55ICs9IEdhbWUuc3RhZ2UuY2VudGVyWTtcblxuICAgICAgICBkYXRhLnggPSBNYXRoLmZsb29yKGRhdGEueCAvIDMyKTtcbiAgICAgICAgZGF0YS55ID0gTWF0aC5mbG9vcihkYXRhLnkgLyAzMik7XG5cbiAgICAgICAgaWYgKCFHYW1lLmxheWVycy5pbmZvTGF5ZXIuaGFzQ2hpbGQoZGVzdEljb24pKSB7XG4gICAgICAgICAgR2FtZS5sYXllcnMuaW5mb0xheWVyLmFwcGVuZENoaWxkKGRlc3RJY29uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChHYW1lLmhlcm8ueCAhPSBkYXRhLnggfHwgR2FtZS5oZXJvLnkgIT0gZGF0YS55KSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmdvdG8oZGF0YS54LCBkYXRhLnksIFwicnVuXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChHYW1lLmhpbnRPYmplY3QgJiYgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UpIHtcbiAgICAgICAgICAgICAgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvKlxuICAgICAgICAgIGlmIChkZXN0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIGRlc3RJY29uLnggPSBkYXRhLnggKiAzMiArIDE2O1xuICAgICAgICAgICAgZGVzdEljb24ueSA9IGRhdGEueSAqIDMyICsgMTY7XG4gICAgICAgICAgICBkZXN0SWNvbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmhlcm8pIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEubWFwKSByZXR1cm47XG5cbiAgICAgICAgQ2hlY2tIZXJvQWN0aW9uKCk7XG4gICAgICAgIGlmICghR2FtZS5oZXJvLndhbGtpbmcpIHtcbiAgICAgICAgICBHYW1lLmhlcm8uc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgR2FtZS5oZXJvLmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIEdhbWUuYXNzaWduKFwiaW5pdElucHV0XCIsIGZ1bmN0aW9uICgpIHtcblxuXG5cblxuXG4gIC8qXG4gICAgbGV0IG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuXG4gICAgR2FtZS5zdGFnZS5vbihcInN0YWdlbW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbW91c2VQcmVzc2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJzdGFnZW1vdXNldXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBtb3VzZVByZXNzZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uIChldmVudCkgeyAvLyBtb3VzZSBsZWF2ZSBjYW52YXNcbiAgICAgIG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgICovXG4gIH0pOyAvLyBHYW1lLm9uaW5pdFxuXG5cbn0pKCk7XG4iXX0=
