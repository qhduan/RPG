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

  Game.assign("Quest", (function () {
    function GameQuest() {
      _classCallCheck(this, GameQuest);
    }

    _createClass(GameQuest, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("quest/" + id + ".js").then(function (data) {
            var questData = data[0]();
            questData.id = id;
            resolve(questData);
          });
        });
      }
    }, {
      key: "isComplete",
      value: function isComplete(quest) {
        if (quest.target) {
          if (quest.target.kill) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                if (k.current < k.need) {
                  return false;
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
          }
        }

        return true;
      }
    }]);

    return GameQuest;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVRdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2FBQVEsU0FBUzs0QkFBVCxTQUFTOzs7aUJBQVQsU0FBUzs7MkJBRXJCLEVBQUUsRUFBRTtBQUNmLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVDLGdCQUFNLENBQUMsSUFBSSxZQUFVLEVBQUUsU0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUIscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLG1CQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7V0FDcEIsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztpQ0FFa0IsS0FBSyxFQUFFO0FBQ3hCLFlBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixjQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzs7Ozs7QUFDckIsbUNBQWMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLDhIQUFFO29CQUF4QixDQUFDOztBQUNSLG9CQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUN0Qix5QkFBTyxLQUFLLENBQUM7aUJBQ2Q7ZUFDRjs7Ozs7Ozs7Ozs7Ozs7O1dBQ0Y7U0FDRjs7QUFFRCxlQUFPLElBQUksQ0FBQztPQUNiOzs7V0F4QndCLFNBQVM7T0EwQmxDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lUXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBHYW1lLmFzc2lnbihcIlF1ZXN0XCIsIGNsYXNzIEdhbWVRdWVzdCB7XG5cbiAgICBzdGF0aWMgbG9hZCAoaWQpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIFNwcml0ZS5sb2FkKGBxdWVzdC8ke2lkfS5qc2ApLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQgcXVlc3REYXRhID0gZGF0YVswXSgpO1xuICAgICAgICAgIHF1ZXN0RGF0YS5pZCA9IGlkO1xuICAgICAgICAgIHJlc29sdmUocXVlc3REYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNDb21wbGV0ZSAocXVlc3QpIHtcbiAgICAgIGlmIChxdWVzdC50YXJnZXQpIHtcbiAgICAgICAgaWYgKHF1ZXN0LnRhcmdldC5raWxsKSB7XG4gICAgICAgICAgZm9yIChsZXQgayBvZiBxdWVzdC50YXJnZXQua2lsbCkge1xuICAgICAgICAgICAgaWYgKGsuY3VycmVudCA8IGsubmVlZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19
