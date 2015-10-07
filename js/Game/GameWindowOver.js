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

  var win = Game.windows.over = Game.Window.create("overWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"overWindowClose\" class=\"brownButton\">返回主菜单</button>\n      <table><tbody><tr><td>\n        <div>\n          <h1 id=\"overWindowMessage\"></h1>\n          <h2 id=\"overWindowReason\"></h2>\n        </div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .overWindow table, .overWindow tbody, .overWindow tr, .overWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .overWindow {\n      text-align: center;\n    }\n\n    #overWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #overWindowMap img, #overWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var overWindowMessage = win.querySelector("#overWindowMessage");
  var overWindowReason = win.querySelector("#overWindowReason");

  var deadText = ["不幸的事情终于发生了……即便你的内心曾对神灵祈祷", "不幸的事情终于发生了……你就知道自己今天不应该穿白色的袜子", "不幸的事情终于发生了……明明还没有体验过天伦之乐", "不幸的事情终于发生了……你的墓碑上写着：“下次不能随便踢小动物”", "不幸的事情终于发生了……你感觉自己的身体变轻了…轻了…轻了…", "不幸的事情终于发生了……你摸了摸自己的脖子，似乎找不到脑袋了，于是你一赌气", "不幸的事情终于发生了……你的墓碑上写着：“下次再也不把治疗药水借给别人了”", "不幸的事情终于发生了……曾经有一瓶治疗药水摆在你面前，而你没有珍惜", "不幸的事情终于发生了……你回想起曾经在广阔的原野上尽情的奔跑", "不幸的事情终于发生了……不过好消息是你再也不用减肥了", "不幸的事情终于发生了……下次在冒险前一定要吃饱饭"];

  win.assign("open", function (reason) {
    if (reason) {
      overWindowReason.textContent = reason;
    } else {
      overWindowReason.innerHTML = "";
    }
    overWindowMessage.textContent = deadText[Math.floor(Math.random() * deadText.length)];
    Game.windows.stage.hide();
    Game.windows["interface"].hide();
    win.show();
  });

  overWindowClose.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dPdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSwwVEFVUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGtmQXlCTixDQUFDOztBQUVGLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxNQUFJLFFBQVEsR0FBRyxDQUNiLDBCQUEwQixFQUMxQiwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLGtDQUFrQyxFQUNsQyxnQ0FBZ0MsRUFDaEMsdUNBQXVDLEVBQ3ZDLHVDQUF1QyxFQUN2QyxtQ0FBbUMsRUFDbkMsZ0NBQWdDLEVBQ2hDLDRCQUE0QixFQUM1QiwwQkFBMEIsQ0FDM0IsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUNuQyxRQUFJLE1BQU0sRUFBRTtBQUNWLHNCQUFnQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDdkMsTUFBTTtBQUNMLHNCQUFnQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDakM7QUFDRCxxQkFBaUIsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixPQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7O0FBRUgsaUJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDekQsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFFBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzFCLENBQUMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IkdhbWVXaW5kb3dPdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5vdmVyID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwib3ZlcldpbmRvd1wiKTtcblxuICB3aW4uaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwid2luZG93LWJveFwiPlxuICAgICAgPGJ1dHRvbiBpZD1cIm92ZXJXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ov5Tlm57kuLvoj5zljZU8L2J1dHRvbj5cbiAgICAgIDx0YWJsZT48dGJvZHk+PHRyPjx0ZD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDEgaWQ9XCJvdmVyV2luZG93TWVzc2FnZVwiPjwvaDE+XG4gICAgICAgICAgPGgyIGlkPVwib3ZlcldpbmRvd1JlYXNvblwiPjwvaDI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5vdmVyV2luZG93IHRhYmxlLCAub3ZlcldpbmRvdyB0Ym9keSwgLm92ZXJXaW5kb3cgdHIsIC5vdmVyV2luZG93IHRkIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgbWFncmluOiAwO1xuICAgICAgcGFkZGluZzogMDtcbiAgICB9XG5cbiAgICAub3ZlcldpbmRvdyB7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgI292ZXJXaW5kb3dDbG9zZSB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogNTBweDtcbiAgICAgIHRvcDogNTBweDtcbiAgICAgIHdpZHRoOiAxMjBweDtcbiAgICAgIGhlaWdodDogNjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG5cbiAgICAjb3ZlcldpbmRvd01hcCBpbWcsICNvdmVyV2luZG93TWFwIGNhbnZhcyB7XG4gICAgICBtYXgtd2lkdGg6IDcwMHB4O1xuICAgICAgbWF4LWhlaWdodDogMzIwcHg7XG4gICAgfVxuICBgO1xuXG4gIGxldCBvdmVyV2luZG93TWVzc2FnZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI292ZXJXaW5kb3dNZXNzYWdlXCIpO1xuICBsZXQgb3ZlcldpbmRvd1JlYXNvbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI292ZXJXaW5kb3dSZWFzb25cIik7XG5cbiAgbGV0IGRlYWRUZXh0ID0gW1xuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5Y2z5L6/5L2g55qE5YaF5b+D5pu+5a+556We54G156WI56W3XCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDlsLHnn6XpgZPoh6rlt7Hku4rlpKnkuI3lupTor6Xnqb/nmb3oibLnmoToopzlrZBcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuaYjuaYjui/mOayoeacieS9k+mqjOi/h+WkqeS8puS5i+S5kFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g55qE5aKT56KR5LiK5YaZ552A77ya4oCc5LiL5qyh5LiN6IO96ZqP5L6/6Lii5bCP5Yqo54mp4oCdXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDmhJ/op4noh6rlt7HnmoTouqvkvZPlj5jovbvkuobigKbovbvkuobigKbovbvkuobigKZcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOaRuOS6huaRuOiHquW3seeahOiEluWtkO+8jOS8vOS5juaJvuS4jeWIsOiEkeiii+S6hu+8jOS6juaYr+S9oOS4gOi1jOawlFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g55qE5aKT56KR5LiK5YaZ552A77ya4oCc5LiL5qyh5YaN5Lmf5LiN5oqK5rK755aX6I2v5rC05YCf57uZ5Yir5Lq65LqG4oCdXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbmm77nu4/mnInkuIDnk7bmsrvnlpfoja/msLTmkYblnKjkvaDpnaLliY3vvIzogIzkvaDmsqHmnInnj43mg5xcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOWbnuaDs+i1t+abvue7j+WcqOW5v+mYlOeahOWOn+mHjuS4iuWwveaDheeahOWllOi3kVwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5LiN6L+H5aW95raI5oGv5piv5L2g5YaN5Lmf5LiN55So5YeP6IKl5LqGXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkuIvmrKHlnKjlhpLpmanliY3kuIDlrpropoHlkIPppbHppa1cIlxuICBdO1xuXG4gIHdpbi5hc3NpZ24oXCJvcGVuXCIsIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICBpZiAocmVhc29uKSB7XG4gICAgICBvdmVyV2luZG93UmVhc29uLnRleHRDb250ZW50ID0gcmVhc29uO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdmVyV2luZG93UmVhc29uLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuICAgIG92ZXJXaW5kb3dNZXNzYWdlLnRleHRDb250ZW50ID0gZGVhZFRleHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGVhZFRleHQubGVuZ3RoKV07XG4gICAgR2FtZS53aW5kb3dzLnN0YWdlLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmhpZGUoKTtcbiAgICB3aW4uc2hvdygpO1xuICB9KTtcblxuICBvdmVyV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIEdhbWUuY2xlYXJTdGFnZSgpO1xuICAgIHdpbi5oaWRlKCk7XG4gICAgR2FtZS53aW5kb3dzLm1haW4uc2hvdygpO1xuICB9KTtcblxuXG59KSgpO1xuIl19
