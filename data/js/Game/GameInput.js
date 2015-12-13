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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBR2IsV0FBUyxlQUFlLEdBQUk7QUFDMUIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRXhCLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ25DLFdBQUssR0FBRyxNQUFNLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNsQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ25ELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ2pELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3BELE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QyxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tB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LE9BQU87O0FBRTNCLHlCQUFlLEVBQUUsQ0FBQztBQUNsQixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDdEIsZ0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDbEI7O0FBRUQsY0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNuQixDQUFDLENBQUM7T0FDSjs7O1dBdEV3QixTQUFTO09BdUVsQyxDQUFDOztBQUVILE1BQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0dBcUJwQyxDQUFDO0NBR0gsQ0FBQSxFQUFHLENBQUM7QUFIQSIsImZpbGUiOiJHYW1lSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuXG4gIGZ1bmN0aW9uIENoZWNrSGVyb0FjdGlvbiAoKSB7XG4gICAgaWYgKEdhbWUucGF1c2VkKSByZXR1cm47XG5cbiAgICBsZXQgc3RhdGUgPSBcInJ1blwiO1xuICAgIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwic2hpZnRcIikpIHtcbiAgICAgIHN0YXRlID0gXCJ3YWxrXCI7XG4gICAgfVxuXG4gICAgaWYgKFNwcml0ZS5JbnB1dC5pc1ByZXNzZWQoXCJsZWZ0XCIpKSB7XG4gICAgICBHYW1lLmhlcm8uZ28oc3RhdGUsIFwibGVmdFwiKS50aGVuKENoZWNrSGVyb0FjdGlvbik7XG4gICAgfSBlbHNlIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwidXBcIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJ1cFwiKS50aGVuKENoZWNrSGVyb0FjdGlvbik7XG4gICAgfSBlbHNlIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwicmlnaHRcIikpIHtcbiAgICAgIEdhbWUuaGVyby5nbyhzdGF0ZSwgXCJyaWdodFwiKS50aGVuKENoZWNrSGVyb0FjdGlvbik7XG4gICAgfSBlbHNlIGlmIChTcHJpdGUuSW5wdXQuaXNQcmVzc2VkKFwiZG93blwiKSkge1xuICAgICAgR2FtZS5oZXJvLmdvKHN0YXRlLCBcImRvd25cIikudGhlbihDaGVja0hlcm9BY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGxldCBkZXN0SWNvbiA9IG51bGw7XG5cbiAgR2FtZS5hc3NpZ24oXCJJbnB1dFwiLCBjbGFzcyBHYW1lSW5wdXQge1xuXG4gICAgc3RhdGljIGNsZWFyRGVzdCAoKSB7XG4gICAgICBkZXN0SWNvbi52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldERlc3QgKHgsIHkpIHtcbiAgICAgIGRlc3RJY29uLnggPSB4ICogMzIgKyAxNjtcbiAgICAgIGRlc3RJY29uLnkgPSB5ICogMzIgKyAxNjtcbiAgICAgIGRlc3RJY29uLnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0ICgpIHtcblxuICAgICAgZGVzdEljb24gPSBuZXcgU3ByaXRlLlNoYXBlKCk7XG4gICAgICBkZXN0SWNvbi5jaXJjbGUoe1xuICAgICAgICBjeDogNSxcbiAgICAgICAgY3k6IDUsXG4gICAgICAgIHI6IDUsXG4gICAgICAgIHN0cm9rZTogXCJyZWRcIixcbiAgICAgICAgZmlsbDogXCJncmVlblwiXG4gICAgICB9KTtcbiAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIGRlc3RJY29uLmNlbnRlclggPSA1O1xuICAgICAgZGVzdEljb24uY2VudGVyWSA9IDU7XG5cbiAgICAgIEdhbWUud2luZG93cy5zdGFnZS5vbihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBldmVudC5kYXRhO1xuXG4gICAgICAgIGRhdGEueCArPSBHYW1lLnN0YWdlLmNlbnRlclg7XG4gICAgICAgIGRhdGEueSArPSBHYW1lLnN0YWdlLmNlbnRlclk7XG5cbiAgICAgICAgZGF0YS54ID0gTWF0aC5mbG9vcihkYXRhLnggLyAzMik7XG4gICAgICAgIGRhdGEueSA9IE1hdGguZmxvb3IoZGF0YS55IC8gMzIpO1xuXG4gICAgICAgIGlmICghR2FtZS5sYXllcnMuaW5mb0xheWVyLmhhc0NoaWxkKGRlc3RJY29uKSkge1xuICAgICAgICAgIEdhbWUubGF5ZXJzLmluZm9MYXllci5hcHBlbmRDaGlsZChkZXN0SWNvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoR2FtZS5oZXJvLnggIT0gZGF0YS54IHx8IEdhbWUuaGVyby55ICE9IGRhdGEueSkge1xuICAgICAgICAgIEdhbWUuaGVyby5nb3RvKGRhdGEueCwgZGF0YS55LCBcInJ1blwiKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGRlc3RJY29uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChHYW1lLmhpbnRPYmplY3QgJiYgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UpIHtcbiAgICAgICAgICAgICAgR2FtZS5oaW50T2JqZWN0Lmhlcm9Vc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvKlxuICAgICAgICAgIGlmIChkZXN0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIGRlc3RJY29uLnggPSBkYXRhLnggKiAzMiArIDE2O1xuICAgICAgICAgICAgZGVzdEljb24ueSA9IGRhdGEueSAqIDMyICsgMTY7XG4gICAgICAgICAgICBkZXN0SWNvbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFNwcml0ZS5UaWNrZXIub24oXCJ0aWNrXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoR2FtZS5wYXVzZWQpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmhlcm8pIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEpIHJldHVybjtcbiAgICAgICAgaWYgKCFHYW1lLmFyZWEubWFwKSByZXR1cm47XG5cbiAgICAgICAgQ2hlY2tIZXJvQWN0aW9uKCk7XG4gICAgICAgIGlmICghR2FtZS5oZXJvLndhbGtpbmcpIHtcbiAgICAgICAgICBHYW1lLmhlcm8uc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgR2FtZS5oZXJvLmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIEdhbWUuYXNzaWduKFwiaW5pdElucHV0XCIsIGZ1bmN0aW9uICgpIHtcblxuXG5cblxuXG4gIC8qXG4gICAgbGV0IG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuXG4gICAgR2FtZS5zdGFnZS5vbihcInN0YWdlbW91c2Vkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbW91c2VQcmVzc2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJzdGFnZW1vdXNldXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBtb3VzZVByZXNzZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIEdhbWUuc3RhZ2Uub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uIChldmVudCkgeyAvLyBtb3VzZSBsZWF2ZSBjYW52YXNcbiAgICAgIG1vdXNlUHJlc3NlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgICovXG4gIH0pOyAvLyBHYW1lLm9uaW5pdFxuXG5cbn0pKCk7XG4iXX0=
