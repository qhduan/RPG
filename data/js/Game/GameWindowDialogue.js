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

  var win = Game.windows.dialogue = Game.Window.create("dialogueWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div style=\"width: 100%; height: 100%;\">\n        <span id=\"dialogueWindowSpeaker\"></span>\n        <table><tbody><tr><td>\n          <div id=\"dialogueWindowContent\"></div>\n        </td></tr></tbody></table>\n        <button id=\"dialogueWindowNext\" style=\"display: block;\" class=\"brownButton\">继续</button>\n        <button id=\"dialogueWindowClose\" style=\"display: none;\" class=\"brownButton\">结束</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    .dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {\n      margin: 0;\n      padding: 0;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n    }\n\n    #dialogueWindowSpeaker {\n      position: absolute;\n      left: 50px;\n      top: 50px;\n      font-size: 30px;\n      font-weight: bold;\n    }\n\n    .dialogueWindow button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      position: absolute;\n    }\n\n    #dialogueWindowNext {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowClose {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowContent {\n      margin-left: 50px;\n      margin-right: 50px;\n      max-width: 600px;\n      font-size: 24px;\n      text-align: center;\n    }\n  ";

  var dialogueWindowSpeaker = win.querySelector("#dialogueWindowSpeaker");

  var dialogueContent = [];
  var dialogueIndex = 0;
  var dialogueWindowNext = document.getElementById("dialogueWindowNext");
  var dialogueWindowClose = document.getElementById("dialogueWindowClose");
  var dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    DialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    setTimeout(function () {
      Game.windows.dialogue.hide();
      dialogueContent = [];
      dialogueIndex = 0;
    }, 20);
  });

  Game.dialogue = function (content, name) {
    dialogueWindowNext.style.display = "block";
    dialogueWindowClose.style.display = "none";
    if (name && name.length) {
      dialogueWindowSpeaker.textContent = name + "：";
    } else {
      dialogueWindowSpeaker.textContent = "";
    }
    dialogueContent = content;
    dialogueIndex = 0;
    DialogueNext();
    Game.windows.dialogue.show();
  };

  function DialogueNext() {
    dialogueWindowContent.textContent = dialogueContent[dialogueIndex];
    dialogueIndex++;
    if (dialogueIndex >= dialogueContent.length) {
      dialogueWindowNext.style.display = "none";
      dialogueWindowClose.style.display = "block";
    }
  };

  win.whenUp(["enter", "space", "esc"], function () {
    if (Game.windows.dialogue.showing) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dEaWFsb2d1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV2RSxLQUFHLENBQUMsSUFBSSwrZUFXUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLG96QkF5Q04sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixNQUFJLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2RSxNQUFJLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN6RSxNQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFN0Usb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdkQsZ0JBQVksRUFBRSxDQUFDO0dBQ2hCLENBQUMsQ0FBQzs7QUFFSCxxQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUN4RCxjQUFVLENBQUMsWUFBWTtBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixxQkFBZSxHQUFHLEVBQUUsQ0FBQztBQUNyQixtQkFBYSxHQUFHLENBQUMsQ0FBQztLQUNuQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1IsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLHNCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQzNDLHVCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzNDLFFBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDdkIsMkJBQXFCLENBQUMsV0FBVyxHQUFNLElBQUksTUFBRyxDQUFDO0tBQ2hELE1BQU07QUFDTCwyQkFBcUIsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3hDO0FBQ0QsbUJBQWUsR0FBRyxPQUFPLENBQUM7QUFDMUIsaUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDOUIsQ0FBQzs7QUFFRixXQUFTLFlBQVksR0FBSTtBQUN2Qix5QkFBcUIsQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25FLGlCQUFhLEVBQUUsQ0FBQztBQUNoQixRQUFJLGFBQWEsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQzNDLHdCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzFDLHlCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzdDO0dBQ0YsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxZQUFZO0FBQ2hELFFBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ2pDLFVBQUksa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUU7QUFDOUMsMEJBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDNUIsTUFBTSxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksTUFBTSxFQUFFO0FBQ3RELDJCQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO09BQzdCO0tBQ0Y7R0FDRixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93RGlhbG9ndWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmRpYWxvZ3VlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiZGlhbG9ndWVXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1wiPlxuICAgICAgICA8c3BhbiBpZD1cImRpYWxvZ3VlV2luZG93U3BlYWtlclwiPjwvc3Bhbj5cbiAgICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICAgIDxkaXYgaWQ9XCJkaWFsb2d1ZVdpbmRvd0NvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgPC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImRpYWxvZ3VlV2luZG93TmV4dFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPue7p+e7rTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlkPVwiZGlhbG9ndWVXaW5kb3dDbG9zZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+57uT5p2fPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5kaWFsb2d1ZVdpbmRvdyB0YWJsZSwgZGlhbG9ndWVXaW5kb3cudGJvZHksIGRpYWxvZ3VlV2luZG93IHRyLCBkaWFsb2d1ZVdpbmRvdyB0ZCB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93U3BlYWtlciB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgZm9udC1zaXplOiAzMHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuXG4gICAgLmRpYWxvZ3VlV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogMTIwcHg7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93TmV4dCB7XG4gICAgICBib3R0b206IDUwcHg7XG4gICAgICByaWdodDogMTAwcHg7XG4gICAgfVxuXG4gICAgI2RpYWxvZ3VlV2luZG93Q2xvc2Uge1xuICAgICAgYm90dG9tOiA1MHB4O1xuICAgICAgcmlnaHQ6IDEwMHB4O1xuICAgIH1cblxuICAgICNkaWFsb2d1ZVdpbmRvd0NvbnRlbnQge1xuICAgICAgbWFyZ2luLWxlZnQ6IDUwcHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDUwcHg7XG4gICAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgYDtcblxuICBsZXQgZGlhbG9ndWVXaW5kb3dTcGVha2VyID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9ndWVXaW5kb3dTcGVha2VyXCIpO1xuXG4gIGxldCBkaWFsb2d1ZUNvbnRlbnQgPSBbXTtcbiAgbGV0IGRpYWxvZ3VlSW5kZXggPSAwO1xuICBsZXQgZGlhbG9ndWVXaW5kb3dOZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd05leHRcIik7XG4gIGxldCBkaWFsb2d1ZVdpbmRvd0Nsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgZGlhbG9ndWVXaW5kb3dDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFsb2d1ZVdpbmRvd0NvbnRlbnRcIik7XG5cbiAgZGlhbG9ndWVXaW5kb3dOZXh0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgRGlhbG9ndWVOZXh0KCk7XG4gIH0pO1xuXG4gIGRpYWxvZ3VlV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIEdhbWUud2luZG93cy5kaWFsb2d1ZS5oaWRlKCk7XG4gICAgICBkaWFsb2d1ZUNvbnRlbnQgPSBbXTtcbiAgICAgIGRpYWxvZ3VlSW5kZXggPSAwO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgR2FtZS5kaWFsb2d1ZSA9IGZ1bmN0aW9uIChjb250ZW50LCBuYW1lKSB7XG4gICAgZGlhbG9ndWVXaW5kb3dOZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGgpIHtcbiAgICAgIGRpYWxvZ3VlV2luZG93U3BlYWtlci50ZXh0Q29udGVudCA9IGAke25hbWV977yaYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhbG9ndWVXaW5kb3dTcGVha2VyLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9XG4gICAgZGlhbG9ndWVDb250ZW50ID0gY29udGVudDtcbiAgICBkaWFsb2d1ZUluZGV4ID0gMDtcbiAgICBEaWFsb2d1ZU5leHQoKTtcbiAgICBHYW1lLndpbmRvd3MuZGlhbG9ndWUuc2hvdygpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIERpYWxvZ3VlTmV4dCAoKSB7XG4gICAgZGlhbG9ndWVXaW5kb3dDb250ZW50LnRleHRDb250ZW50ID0gZGlhbG9ndWVDb250ZW50W2RpYWxvZ3VlSW5kZXhdO1xuICAgIGRpYWxvZ3VlSW5kZXgrKztcbiAgICBpZiAoZGlhbG9ndWVJbmRleCA+PSBkaWFsb2d1ZUNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBkaWFsb2d1ZVdpbmRvd05leHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbiAgfTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCIsIFwic3BhY2VcIiwgXCJlc2NcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoR2FtZS53aW5kb3dzLmRpYWxvZ3VlLnNob3dpbmcpIHtcbiAgICAgIGlmIChkaWFsb2d1ZVdpbmRvd05leHQuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIikge1xuICAgICAgICBkaWFsb2d1ZVdpbmRvd05leHQuY2xpY2soKTtcbiAgICAgIH0gZWxzZSBpZiAoZGlhbG9ndWVXaW5kb3dDbG9zZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiKSB7XG4gICAgICAgIGRpYWxvZ3VlV2luZG93Q2xvc2UuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
