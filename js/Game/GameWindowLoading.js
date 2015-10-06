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

  win.html = "\n    <div id=\"loadingWindowBox\">\n      <img id=\"loadingWindowLoadingIcon\" src=\"image/window/loading.svg\" alt=\"loading\">\n      <br>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </div>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    #loadingWindowLoadingIcon {\n      width: 50px;\n      height: 50px;\n      margin-top: 15px;\n      margin-bottom: 10px;\n      animation: loadingAnimation 1s linear infinite;\n    }\n\n    @keyframes loadingAnimation\n    {\n      0%   { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n\n    #loadingWindowBox {\n      width: 500px;\n      height: 300px;\n      border-radius: 25px;\n      position: fixed;\n      top: 75px;\n      left: 150px;\n      background-color: gray;\n    }\n\n    .loadingWindow label {\n      color: white;\n      font-size: 48px;\n    }\n\n    #loadingWindowText {\n      color: white;\n    }\n  ";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dMb2FkaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxpU0FRUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLHF0QkFxQ04sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RSxNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7O0FBR2hFLE1BQUksSUFBSSxHQUFHLENBQ1QsK0JBQStCLEVBQy9CLDBCQUEwQixFQUMxQiwyQkFBMkIsRUFDM0IsOEJBQThCLEVBQzlCLGtDQUFrQyxFQUNsQyxtQ0FBbUMsQ0FDcEMsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxZQUFZO0FBQzlCLHlCQUFxQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXJDLHFCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDOUUsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3BDLHlCQUFxQixDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDekMsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVk7QUFDNUIsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0xvYWRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmxvYWRpbmcgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJsb2FkaW5nV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgaWQ9XCJsb2FkaW5nV2luZG93Qm94XCI+XG4gICAgICA8aW1nIGlkPVwibG9hZGluZ1dpbmRvd0xvYWRpbmdJY29uXCIgc3JjPVwiaW1hZ2Uvd2luZG93L2xvYWRpbmcuc3ZnXCIgYWx0PVwibG9hZGluZ1wiPlxuICAgICAgPGJyPlxuICAgICAgPGxhYmVsPuivt+eojeetiS4uLjxzbWFsbCBpZD1cImxvYWRpbmdXaW5kb3dQcm9ncmVzc1wiPjwvc21hbGw+PC9sYWJlbD5cbiAgICAgIDxicj5cbiAgICAgIDxoNSBpZD1cImxvYWRpbmdXaW5kb3dUZXh0XCI+PC9oNT5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5sb2FkaW5nV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd0xvYWRpbmdJY29uIHtcbiAgICAgIHdpZHRoOiA1MHB4O1xuICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgbWFyZ2luLXRvcDogMTVweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICBhbmltYXRpb246IGxvYWRpbmdBbmltYXRpb24gMXMgbGluZWFyIGluZmluaXRlO1xuICAgIH1cblxuICAgIEBrZXlmcmFtZXMgbG9hZGluZ0FuaW1hdGlvblxuICAgIHtcbiAgICAgIDAlICAgeyB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTsgfVxuICAgICAgMTAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd0JveCB7XG4gICAgICB3aWR0aDogNTAwcHg7XG4gICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogMjVweDtcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgIHRvcDogNzVweDtcbiAgICAgIGxlZnQ6IDE1MHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcbiAgICB9XG5cbiAgICAubG9hZGluZ1dpbmRvdyBsYWJlbCB7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICBmb250LXNpemU6IDQ4cHg7XG4gICAgfVxuXG4gICAgI2xvYWRpbmdXaW5kb3dUZXh0IHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IGxvYWRpbmdXaW5kb3dQcm9ncmVzcyA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2xvYWRpbmdXaW5kb3dQcm9ncmVzc1wiKTtcbiAgbGV0IGxvYWRpbmdXaW5kb3dUZXh0ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjbG9hZGluZ1dpbmRvd1RleHRcIik7XG5cbiAgLy8g5o+Q56S65L+h5oGvXG4gIGxldCB0ZXh0ID0gW1xuICAgIFwi5omT5byA5ri45oiP6I+c5Y2V5LmL5ZCO77yM5ri45oiP5piv5pqC5YGc55qE77yM5L2g5Y+v5Lul5Zyo6L+Z5pe25oCd6ICD5LiL5oiY5paX562W55WlXCIsXG4gICAgXCLorrDlvpflh7rpl6jluKbnnYDnn7/lt6XplITlkozph4foja/pk7LvvIzmiJborrjog73ku47lhbbkuK3otZrngrnlsI/pkrFcIixcbiAgICBcIuiBjOS4muOAgeS/oeS7sOOAgeaKgOiDve+8jOmDveWPr+S7peS7u+aEj+aUueWPmO+8jOS9huaYr+W/hemhu+S7mOWHuuS7o+S7t1wiLFxuICAgIFwi5L2g55qE5L+h5Luw5Yaz5a6a5LqG56We5a+55L2g55qE56Wd56aP77yM6L+Y5pyJ5p+Q5Lqb5Lq65oiW6ICF57uE57uH5a+55L2g55qE55yL5rOVXCIsXG4gICAgXCLkv6Hku7DmmK/lj6/ku6XmlLnlj5jnmoTvvIzkuI3ov4foib7liKnpn6bmlq/nmoTlsYXmsJHlubbkuI3llpzmrKLmgLvmmK/mlLnlj5joh6rlt7Hkv6Hku7DnmoTkurpcIixcbiAgICBcIuiJvuWIqemfpuaWr+S/oeS7sOiHqueUse+8jOayoeacieS/oeS7sOS5n+aYr+S4gOenjeS/oeS7sO+8jOS9huaYr+S9oOS6q+WPl+S4jeWIsOS7u+S9leelnueahOelneemj1wiXG4gIF07XG5cbiAgd2luLmFzc2lnbihcImJlZ2luXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkaW5nV2luZG93UHJvZ3Jlc3MuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAvLyDpmo/mnLrkuIDkuKrmj5DnpLpcbiAgICBsb2FkaW5nV2luZG93VGV4dC50ZXh0Q29udGVudCA9IHRleHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGV4dC5sZW5ndGgpXTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwidXBkYXRlXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGxvYWRpbmdXaW5kb3dQcm9ncmVzcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcImVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==
