"use strict";

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

  var choiceHTML = "\n    <div class=\"window-box\">\n      <button id=\"choiceWindowNo\" class=\"brownButton\">取消</button>\n      <div style=\"width: 100%; height: 100%;\">\n        <div style=\"height: 370px; overflow-y: auto; text-align: center;\">\n          <table id=\"choiceWindowTable\" style=\"width: 100%; height: 370px;\">\n            <tbody>\n              <tr>\n                <td id=\"choiceWindowButtonContainer\">\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  ";

  var choiceCSS = "\n    .choiceWindow {\n      text-align: center;\n    }\n\n    .choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      right: 100px;\n      top: 50px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 300px;\n      min-height: 60px;\n      font-size: 30px;\n      display: block;\n    }\n  ";

  Game.choice = function (options) {
    return new Promise(function (resolve, reject) {
      var win = Game.Window.create("choiceWindow");
      win.html = choiceHTML;
      win.css = choiceCSS;
      win.show();

      var choiceWindowButtonContainer = win.querySelector("#choiceWindowButtonContainer");
      var choiceWindowNo = win.querySelector("#choiceWindowNo");
      var buttonArray = [];

      Sprite.each(options, function (value, key) {
        var button = document.createElement("button");
        button.textContent = buttonArray.length + 1 + ". " + key;
        button.classList.add("brownButton");

        choiceWindowButtonContainer.appendChild(button);
        buttonArray.push(button);

        button.addEventListener("click", function () {
          win.hide();
          win.destroy();
          resolve(value);
        });
      });

      choiceWindowNo.addEventListener("click", function () {
        win.hide();
        win.destroy();
        resolve(null);
      });

      win.whenUp(["esc"], function () {
        setTimeout(function () {
          choiceWindowNo.click();
        }, 20);
      });

      win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
        // match 1 to 9
        var num = parseInt(key) - 1; // get 0 to 8
        var element = buttonArray[num];
        if (element) {
          element.click();
        }
      });
    });
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dDaG9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxVQUFVLG9pQkFnQmIsQ0FBQzs7QUFFRixNQUFJLFNBQVMsMmNBeUJaLENBQUM7O0FBRUYsTUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLE9BQU8sRUFBRTtBQUMvQixXQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1QyxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM3QyxTQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUN0QixTQUFHLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztBQUNwQixTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsVUFBSSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDcEYsVUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFELFVBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsWUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ3pDLFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsY0FBTSxDQUFDLFdBQVcsR0FBTSxXQUFXLENBQUMsTUFBTSxHQUFDLENBQUMsVUFBSyxHQUFHLEFBQUUsQ0FBQztBQUN2RCxjQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEMsbUNBQTJCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELG1CQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV6QixjQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDM0MsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2QsaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNmLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxvQkFBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZO0FBQ25ELFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNkLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsWUFBWTtBQUM5QixrQkFBVSxDQUFDLFlBQVk7QUFDckIsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN4QixFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ1IsQ0FBQyxDQUFDOztBQUVILFNBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFOztBQUV2RSxZQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUFDLEFBQzVCLFlBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDakI7T0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDO0NBRUgsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0Nob2ljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBjaG9pY2VIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwiY2hvaWNlV2luZG93Tm9cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y+W5raIPC9idXR0b24+XG4gICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDogMzcwcHg7IG92ZXJmbG93LXk6IGF1dG87IHRleHQtYWxpZ246IGNlbnRlcjtcIj5cbiAgICAgICAgICA8dGFibGUgaWQ9XCJjaG9pY2VXaW5kb3dUYWJsZVwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMzcwcHg7XCI+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgaWQ9XCJjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGxldCBjaG9pY2VDU1MgPSBgXG4gICAgLmNob2ljZVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLmNob2ljZVdpbmRvdyBkaXYge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIGJ1dHRvbiNjaG9pY2VXaW5kb3dObyB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgICB0b3A6IDUwcHg7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgfVxuXG4gICAgI2Nob2ljZVdpbmRvd1RhYmxlIGJ1dHRvbiB7XG4gICAgICBtYXJnaW46IDVweCBhdXRvO1xuICAgICAgbWluLXdpZHRoOiAzMDBweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gIGA7XG5cbiAgR2FtZS5jaG9pY2UgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBsZXQgd2luID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiY2hvaWNlV2luZG93XCIpO1xuICAgICAgd2luLmh0bWwgPSBjaG9pY2VIVE1MO1xuICAgICAgd2luLmNzcyA9IGNob2ljZUNTUztcbiAgICAgIHdpbi5zaG93KCk7XG5cbiAgICAgIGxldCBjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXIgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIik7XG4gICAgICBsZXQgY2hvaWNlV2luZG93Tm8gPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjaG9pY2VXaW5kb3dOb1wiKTtcbiAgICAgIGxldCBidXR0b25BcnJheSA9IFtdO1xuXG4gICAgICBTcHJpdGUuZWFjaChvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gYCR7YnV0dG9uQXJyYXkubGVuZ3RoKzF9LiAke2tleX1gO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImJyb3duQnV0dG9uXCIpO1xuXG4gICAgICAgIGNob2ljZVdpbmRvd0J1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICBidXR0b25BcnJheS5wdXNoKGJ1dHRvbik7XG5cbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd2luLmhpZGUoKTtcbiAgICAgICAgICB3aW4uZGVzdHJveSgpO1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNob2ljZVdpbmRvd05vLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgIH0pO1xuXG4gICAgICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjaG9pY2VXaW5kb3dOby5jbGljaygpO1xuICAgICAgICB9LCAyMCk7XG4gICAgICB9KTtcblxuICAgICAgd2luLndoZW5VcChbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgLy8gbWF0Y2ggMSB0byA5XG4gICAgICAgIGxldCBudW0gPSBwYXJzZUludChrZXkpIC0gMTsgLy8gZ2V0IDAgdG8gOFxuICAgICAgICBsZXQgZWxlbWVudCA9IGJ1dHRvbkFycmF5W251bV07XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5jbGljaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxufSkoKTtcbiJdfQ==
