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

(function () {
  "use strict";

  var choiceHTML = "\n    <div class=\"window-box\">\n      <button id=\"choiceWindowNo\" class=\"brownButton\">取消</button>\n      <div style=\"width: 100%; height: 100%;\">\n        <div style=\"height: 370px; overflow-y: auto; text-align: center;\">\n          <table id=\"choiceWindowTable\" style=\"width: 100%; height: 370px;\">\n            <tbody>\n              <tr>\n                <td id=\"choiceWindowButtonContainer\">\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  ";

  var choiceCSS = "\n    .choiceWindow {\n      text-align: center;\n    }\n\n    .choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      right: 100px;\n      top: 50px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 300px;\n      min-height: 60px;\n      font-size: 30px;\n      display: block;\n    }\n  ";

  Game.choice = function (options, callback) {

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
        if (callback) {
          callback(value);
        }
      });
    });

    choiceWindowNo.addEventListener("click", function () {
      win.hide();
      win.destroy();
      if (callback) {
        callback(null);
      }
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
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dDaG9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxVQUFVLG9pQkFnQmIsQ0FBQzs7QUFFRixNQUFJLFNBQVMsMmNBeUJaLENBQUM7O0FBRUYsTUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRXpDLFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzdDLE9BQUcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLE9BQUcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO0FBQ3BCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxRQUFJLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNwRixRQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUQsUUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUVyQixVQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDekMsVUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxZQUFNLENBQUMsV0FBVyxHQUFNLFdBQVcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxVQUFLLEdBQUcsQUFBRSxDQUFDO0FBQ3ZELFlBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVwQyxpQ0FBMkIsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsaUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXpCLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUMzQyxXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakI7T0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsa0JBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUNuRCxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZCxVQUFJLFFBQVEsRUFBRTtBQUNaLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDaEI7S0FDRixDQUFDLENBQUM7O0FBRUgsT0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQVk7QUFDOUIsZ0JBQVUsQ0FBQyxZQUFZO0FBQ3JCLHNCQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDeEIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSLENBQUMsQ0FBQzs7QUFFSCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRTs7QUFFdkUsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsVUFBSSxPQUFPLEVBQUU7QUFDWCxlQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDakI7S0FDRixDQUFDLENBQUM7R0FFSixDQUFDO0NBRUgsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0Nob2ljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBjaG9pY2VIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwiY2hvaWNlV2luZG93Tm9cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Y+W5raIPC9idXR0b24+XG4gICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDogMzcwcHg7IG92ZXJmbG93LXk6IGF1dG87IHRleHQtYWxpZ246IGNlbnRlcjtcIj5cbiAgICAgICAgICA8dGFibGUgaWQ9XCJjaG9pY2VXaW5kb3dUYWJsZVwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMzcwcHg7XCI+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgaWQ9XCJjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIGxldCBjaG9pY2VDU1MgPSBgXG4gICAgLmNob2ljZVdpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLmNob2ljZVdpbmRvdyBkaXYge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIGJ1dHRvbiNjaG9pY2VXaW5kb3dObyB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgICB0b3A6IDUwcHg7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgfVxuXG4gICAgI2Nob2ljZVdpbmRvd1RhYmxlIGJ1dHRvbiB7XG4gICAgICBtYXJnaW46IDVweCBhdXRvO1xuICAgICAgbWluLXdpZHRoOiAzMDBweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDMwcHg7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gIGA7XG5cbiAgR2FtZS5jaG9pY2UgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcblxuICAgIGxldCB3aW4gPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJjaG9pY2VXaW5kb3dcIik7XG4gICAgd2luLmh0bWwgPSBjaG9pY2VIVE1MO1xuICAgIHdpbi5jc3MgPSBjaG9pY2VDU1M7XG4gICAgd2luLnNob3coKTtcblxuICAgIGxldCBjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXIgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXJcIik7XG4gICAgbGV0IGNob2ljZVdpbmRvd05vID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjY2hvaWNlV2luZG93Tm9cIik7XG4gICAgbGV0IGJ1dHRvbkFycmF5ID0gW107XG5cbiAgICBTcHJpdGUuZWFjaChvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBgJHtidXR0b25BcnJheS5sZW5ndGgrMX0uICR7a2V5fWA7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImJyb3duQnV0dG9uXCIpO1xuXG4gICAgICBjaG9pY2VXaW5kb3dCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgIGJ1dHRvbkFycmF5LnB1c2goYnV0dG9uKTtcblxuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbi5oaWRlKCk7XG4gICAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjaG9pY2VXaW5kb3dOby5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICAgIHdpbi5kZXN0cm95KCk7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNob2ljZVdpbmRvd05vLmNsaWNrKCk7XG4gICAgICB9LCAyMCk7XG4gICAgfSk7XG5cbiAgICB3aW4ud2hlblVwKFtcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCIsIFwiOVwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgLy8gbWF0Y2ggMSB0byA5XG4gICAgICBsZXQgbnVtID0gcGFyc2VJbnQoa2V5KSAtIDE7IC8vIGdldCAwIHRvIDhcbiAgICAgIGxldCBlbGVtZW50ID0gYnV0dG9uQXJyYXlbbnVtXTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9O1xuXG59KSgpO1xuIl19
