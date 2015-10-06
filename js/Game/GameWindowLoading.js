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

  var loadingIconSrc = "data:image/svg+xml;base64," + window.btoa("\n  <svg id=\"loadingIcon\" width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"#808080\" />\n    <path d=\"M50,50 h-40 a40,40 0 1,0 40,-40 z\" fill=\"white\" />\n    <path d=\"M49,49 h-30 a30,30 0 1,0 30,-30 z\" fill=\"#808080\" />\n  </svg>");

  var win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = "\n    <div id=\"loadingWindowBox\">\n      <img id=\"loadingWindowLoadingIcon\" src=\"" + loadingIconSrc + "\" alt=\"loading\">\n      <br>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </div>\n  ";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dMb2FkaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUdiLE1BQUksY0FBYyxHQUFHLDRCQUE0QixHQUFHLE1BQU0sQ0FBQyxJQUFJLHNUQUt2RCxDQUFDOztBQUdULE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSw4RkFFc0MsY0FBYyxtTEFNM0QsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxxdEJBcUNOLENBQUM7O0FBRUYsTUFBSSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDeEUsTUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7OztBQUdoRSxNQUFJLElBQUksR0FBRyxDQUNULCtCQUErQixFQUMvQiwwQkFBMEIsRUFDMUIsMkJBQTJCLEVBQzNCLDhCQUE4QixFQUM5QixrQ0FBa0MsRUFDbEMsbUNBQW1DLENBQ3BDLENBQUM7O0FBRUYsS0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUM5Qix5QkFBcUIsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVyQyxxQkFBaUIsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzlFLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNwQyx5QkFBcUIsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0dBQ3pDLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZO0FBQzVCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dMb2FkaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuICBsZXQgbG9hZGluZ0ljb25TcmMgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsXCIgKyB3aW5kb3cuYnRvYShgXG4gIDxzdmcgaWQ9XCJsb2FkaW5nSWNvblwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNTBcIiBmaWxsPVwiIzgwODA4MFwiIC8+XG4gICAgPHBhdGggZD1cIk01MCw1MCBoLTQwIGE0MCw0MCAwIDEsMCA0MCwtNDAgelwiIGZpbGw9XCJ3aGl0ZVwiIC8+XG4gICAgPHBhdGggZD1cIk00OSw0OSBoLTMwIGEzMCwzMCAwIDEsMCAzMCwtMzAgelwiIGZpbGw9XCIjODA4MDgwXCIgLz5cbiAgPC9zdmc+YCk7XG5cblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLmxvYWRpbmcgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJsb2FkaW5nV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgaWQ9XCJsb2FkaW5nV2luZG93Qm94XCI+XG4gICAgICA8aW1nIGlkPVwibG9hZGluZ1dpbmRvd0xvYWRpbmdJY29uXCIgc3JjPVwiJHtsb2FkaW5nSWNvblNyY31cIiBhbHQ9XCJsb2FkaW5nXCI+XG4gICAgICA8YnI+XG4gICAgICA8bGFiZWw+6K+356iN562JLi4uPHNtYWxsIGlkPVwibG9hZGluZ1dpbmRvd1Byb2dyZXNzXCI+PC9zbWFsbD48L2xhYmVsPlxuICAgICAgPGJyPlxuICAgICAgPGg1IGlkPVwibG9hZGluZ1dpbmRvd1RleHRcIj48L2g1PlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLmxvYWRpbmdXaW5kb3cge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICNsb2FkaW5nV2luZG93TG9hZGluZ0ljb24ge1xuICAgICAgd2lkdGg6IDUwcHg7XG4gICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICBtYXJnaW4tdG9wOiAxNXB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgIGFuaW1hdGlvbjogbG9hZGluZ0FuaW1hdGlvbiAxcyBsaW5lYXIgaW5maW5pdGU7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBsb2FkaW5nQW5pbWF0aW9uXG4gICAge1xuICAgICAgMCUgICB7IHRyYW5zZm9ybTogcm90YXRlKDBkZWcpOyB9XG4gICAgICAxMDAlIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfVxuICAgIH1cblxuICAgICNsb2FkaW5nV2luZG93Qm94IHtcbiAgICAgIHdpZHRoOiA1MDBweDtcbiAgICAgIGhlaWdodDogMzAwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiAyNXB4O1xuICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgdG9wOiA3NXB4O1xuICAgICAgbGVmdDogMTUwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xuICAgIH1cblxuICAgIC5sb2FkaW5nV2luZG93IGxhYmVsIHtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgIGZvbnQtc2l6ZTogNDhweDtcbiAgICB9XG5cbiAgICAjbG9hZGluZ1dpbmRvd1RleHQge1xuICAgICAgY29sb3I6IHdoaXRlO1xuICAgIH1cbiAgYDtcblxuICBsZXQgbG9hZGluZ1dpbmRvd1Byb2dyZXNzID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjbG9hZGluZ1dpbmRvd1Byb2dyZXNzXCIpO1xuICBsZXQgbG9hZGluZ1dpbmRvd1RleHQgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNsb2FkaW5nV2luZG93VGV4dFwiKTtcblxuICAvLyDmj5DnpLrkv6Hmga9cbiAgbGV0IHRleHQgPSBbXG4gICAgXCLmiZPlvIDmuLjmiI/oj5zljZXkuYvlkI7vvIzmuLjmiI/mmK/mmoLlgZznmoTvvIzkvaDlj6/ku6XlnKjov5nml7bmgJ3ogIPkuIvmiJjmlpfnrZbnlaVcIixcbiAgICBcIuiusOW+l+WHuumXqOW4puedgOefv+W3pemUhOWSjOmHh+iNr+mTsu+8jOaIluiuuOiDveS7juWFtuS4rei1mueCueWwj+mSsVwiLFxuICAgIFwi6IGM5Lia44CB5L+h5Luw44CB5oqA6IO977yM6YO95Y+v5Lul5Lu75oSP5pS55Y+Y77yM5L2G5piv5b+F6aG75LuY5Ye65Luj5Lu3XCIsXG4gICAgXCLkvaDnmoTkv6Hku7DlhrPlrprkuobnpZ7lr7nkvaDnmoTnpZ3npo/vvIzov5jmnInmn5DkupvkurrmiJbogIXnu4Tnu4flr7nkvaDnmoTnnIvms5VcIixcbiAgICBcIuS/oeS7sOaYr+WPr+S7peaUueWPmOeahO+8jOS4jei/h+iJvuWIqemfpuaWr+eahOWxheawkeW5tuS4jeWWnOasouaAu+aYr+aUueWPmOiHquW3seS/oeS7sOeahOS6ulwiLFxuICAgIFwi6Im+5Yip6Z+m5pav5L+h5Luw6Ieq55Sx77yM5rKh5pyJ5L+h5Luw5Lmf5piv5LiA56eN5L+h5Luw77yM5L2G5piv5L2g5Lqr5Y+X5LiN5Yiw5Lu75L2V56We55qE56Wd56aPXCJcbiAgXTtcblxuICB3aW4uYXNzaWduKFwiYmVnaW5cIiwgZnVuY3Rpb24gKCkge1xuICAgIGxvYWRpbmdXaW5kb3dQcm9ncmVzcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIC8vIOmaj+acuuS4gOS4quaPkOekulxuICAgIGxvYWRpbmdXaW5kb3dUZXh0LnRleHRDb250ZW50ID0gdGV4dFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXh0Lmxlbmd0aCldO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJ1cGRhdGVcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgbG9hZGluZ1dpbmRvd1Byb2dyZXNzLmlubmVySFRNTCA9IHZhbHVlO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwiZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuXG59KSgpO1xuIl19
