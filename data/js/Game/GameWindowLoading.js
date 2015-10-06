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

  var win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = "\n    <div id=\"loadingWindowBox\">\n      <img src=\"image/window/loading.gif\" alt=\"loading\" style=\"z-index: 199876;\">\n      <br>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </div>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    #loadingWindowBox {\n      width: 500px;\n      height: 300px;\n      border-radius: 25px;\n      position: fixed;\n      top: 75px;\n      left: 150px;\n      background-color: gray;\n    }\n\n    .loadingWindow label {\n      color: white;\n      font-size: 48px;\n    }\n\n    #loadingWindowText {\n      color: white;\n    }\n  ";

  var loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  var loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  var text = ["打开游戏菜单之后，游戏是暂停的，你可以在这时思考下战斗策略", "记得出门带着矿工锄和采药铲，或许能从其中赚点小钱", "职业、信仰、技能，都可以任意改变，但是必须付出代价", "你的信仰决定了神对你的祝福，还有某些人或者组织对你的看法", "信仰是可以改变的，不过艾利韦斯的居民并不喜欢总是改变自己信仰的人", "艾利韦斯信仰自由，没有信仰也是一种信仰，但是你享受不到任何神的祝福"];

  win.assign("begin", function () {
    loadingWindowProgress.innerHTML = "";
    // 随机一个提示
    loadingWindowText.textContent = text[Math.floor(Math.random() * text.length)];
    win.show();
  });

  win.assign("update", function (value) {
    loadingWindowProgress.innerHTML = value;
  });

  win.assign("end", function () {
    win.hide();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9HYW1lL0dhbWVXaW5kb3dMb2FkaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSw0UkFRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGlaQXVCTixDQUFDOztBQUVGLE1BQUkscUJBQXFCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3hFLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHaEUsTUFBSSxJQUFJLEdBQUcsQ0FDVCwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLDJCQUEyQixFQUMzQiw4QkFBOEIsRUFDOUIsa0NBQWtDLEVBQ2xDLG1DQUFtQyxDQUNwQyxDQUFDOztBQUVGLEtBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDOUIseUJBQXFCLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFckMscUJBQWlCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5RSxPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDcEMseUJBQXFCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztHQUN6QyxDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWTtBQUM1QixPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJzcmMvR2FtZS9HYW1lV2luZG93TG9hZGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3MubG9hZGluZyA9IEdhbWUuV2luZG93LmNyZWF0ZShcImxvYWRpbmdXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBpZD1cImxvYWRpbmdXaW5kb3dCb3hcIj5cbiAgICAgIDxpbWcgc3JjPVwiaW1hZ2Uvd2luZG93L2xvYWRpbmcuZ2lmXCIgYWx0PVwibG9hZGluZ1wiIHN0eWxlPVwiei1pbmRleDogMTk5ODc2O1wiPlxuICAgICAgPGJyPlxuICAgICAgPGxhYmVsPuivt+eojeetiS4uLjxzbWFsbCBpZD1cImxvYWRpbmdXaW5kb3dQcm9ncmVzc1wiPjwvc21hbGw+PC9sYWJlbD5cbiAgICAgIDxicj5cbiAgICAgIDxoNSBpZD1cImxvYWRpbmdXaW5kb3dUZXh0XCI+PC9oNT5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5sb2FkaW5nV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd0JveCB7XG4gICAgICB3aWR0aDogNTAwcHg7XG4gICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogMjVweDtcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgIHRvcDogNzVweDtcbiAgICAgIGxlZnQ6IDE1MHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcbiAgICB9XG5cbiAgICAubG9hZGluZ1dpbmRvdyBsYWJlbCB7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICBmb250LXNpemU6IDQ4cHg7XG4gICAgfVxuXG4gICAgI2xvYWRpbmdXaW5kb3dUZXh0IHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGxvYWRpbmdXaW5kb3dQcm9ncmVzcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2xvYWRpbmdXaW5kb3dQcm9ncmVzc1wiKTtcbiAgbGV0IGxvYWRpbmdXaW5kb3dUZXh0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjbG9hZGluZ1dpbmRvd1RleHRcIik7XG5cbiAgLy8g5o+Q56S65L+h5oGvXG4gIGxldCB0ZXh0ID0gW1xuICAgIFwi5omT5byA5ri45oiP6I+c5Y2V5LmL5ZCO77yM5ri45oiP5piv5pqC5YGc55qE77yM5L2g5Y+v5Lul5Zyo6L+Z5pe25oCd6ICD5LiL5oiY5paX562W55WlXCIsXG4gICAgXCLorrDlvpflh7rpl6jluKbnnYDnn7/lt6XplITlkozph4foja/pk7LvvIzmiJborrjog73ku47lhbbkuK3otZrngrnlsI/pkrFcIixcbiAgICBcIuiBjOS4muOAgeS/oeS7sOOAgeaKgOiDve+8jOmDveWPr+S7peS7u+aEj+aUueWPmO+8jOS9huaYr+W/hemhu+S7mOWHuuS7o+S7t1wiLFxuICAgIFwi5L2g55qE5L+h5Luw5Yaz5a6a5LqG56We5a+55L2g55qE56Wd56aP77yM6L+Y5pyJ5p+Q5Lqb5Lq65oiW6ICF57uE57uH5a+55L2g55qE55yL5rOVXCIsXG4gICAgXCLkv6Hku7DmmK/lj6/ku6XmlLnlj5jnmoTvvIzkuI3ov4foib7liKnpn6bmlq/nmoTlsYXmsJHlubbkuI3llpzmrKLmgLvmmK/mlLnlj5joh6rlt7Hkv6Hku7DnmoTkurpcIixcbiAgICBcIuiJvuWIqemfpuaWr+S/oeS7sOiHqueUse+8jOayoeacieS/oeS7sOS5n+aYr+S4gOenjeS/oeS7sO+8jOS9huaYr+S9oOS6q+WPl+S4jeWIsOS7u+S9leelnueahOelneemj1wiXG4gIF07XG5cbiAgd2luLmFzc2lnbihcImJlZ2luXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkaW5nV2luZG93UHJvZ3Jlc3MuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAvLyDpmo/mnLrkuIDkuKrmj5DnpLpcbiAgICBsb2FkaW5nV2luZG93VGV4dC50ZXh0Q29udGVudCA9IHRleHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGV4dC5sZW5ndGgpXTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwidXBkYXRlXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGxvYWRpbmdXaW5kb3dQcm9ncmVzcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcImVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==