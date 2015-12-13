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
    Game.windows.interface.hide();
    win.show();
  });

  overWindowClose.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dPdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSwwVEFVUCxDQUFDOztBQUVGLEtBQUcsQ0FBQyxHQUFHLGtmQXlCTixDQUFDOztBQUVGLE1BQUksaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxNQUFJLFFBQVEsR0FBRyxDQUNiLDBCQUEwQixFQUMxQiwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLGtDQUFrQyxFQUNsQyxnQ0FBZ0MsRUFDaEMsdUNBQXVDLEVBQ3ZDLHVDQUF1QyxFQUN2QyxtQ0FBbUMsRUFDbkMsZ0NBQWdDLEVBQ2hDLDRCQUE0QixFQUM1QiwwQkFBMEIsQ0FDM0IsQ0FBQzs7QUFFRixLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUNuQyxRQUFJLE1BQU0sRUFBRTtBQUNWLHNCQUFnQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDdkMsTUFBTTtBQUNMLHNCQUFnQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDakM7QUFDRCxxQkFBaUIsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxpQkFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6RCxRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsT0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDMUIsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd092ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLm92ZXIgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJvdmVyV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwib3ZlcldpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPui/lOWbnuS4u+iPnOWNlTwvYnV0dG9uPlxuICAgICAgPHRhYmxlPjx0Ym9keT48dHI+PHRkPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMSBpZD1cIm92ZXJXaW5kb3dNZXNzYWdlXCI+PC9oMT5cbiAgICAgICAgICA8aDIgaWQ9XCJvdmVyV2luZG93UmVhc29uXCI+PC9oMj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLm92ZXJXaW5kb3cgdGFibGUsIC5vdmVyV2luZG93IHRib2R5LCAub3ZlcldpbmRvdyB0ciwgLm92ZXJXaW5kb3cgdGQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtYWdyaW46IDA7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5vdmVyV2luZG93IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAjb3ZlcldpbmRvd0Nsb3NlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiA1MHB4O1xuICAgICAgdG9wOiA1MHB4O1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgICNvdmVyV2luZG93TWFwIGltZywgI292ZXJXaW5kb3dNYXAgY2FudmFzIHtcbiAgICAgIG1heC13aWR0aDogNzAwcHg7XG4gICAgICBtYXgtaGVpZ2h0OiAzMjBweDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IG92ZXJXaW5kb3dNZXNzYWdlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcldpbmRvd01lc3NhZ2VcIik7XG4gIGxldCBvdmVyV2luZG93UmVhc29uID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcldpbmRvd1JlYXNvblwiKTtcblxuICBsZXQgZGVhZFRleHQgPSBbXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbljbPkvr/kvaDnmoTlhoXlv4Pmm77lr7nnpZ7ngbXnpYjnpbdcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOWwseefpemBk+iHquW3seS7iuWkqeS4jeW6lOivpeepv+eZveiJsueahOiinOWtkFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5piO5piO6L+Y5rKh5pyJ5L2T6aqM6L+H5aSp5Lym5LmL5LmQXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDnmoTlopPnopHkuIrlhpnnnYDvvJrigJzkuIvmrKHkuI3og73pmo/kvr/ouKLlsI/liqjnianigJ1cIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS9oOaEn+inieiHquW3seeahOi6q+S9k+WPmOi9u+S6huKApui9u+S6huKApui9u+S6huKAplwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g5pG45LqG5pG46Ieq5bex55qE6ISW5a2Q77yM5Ly85LmO5om+5LiN5Yiw6ISR6KKL5LqG77yM5LqO5piv5L2g5LiA6LWM5rCUXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkvaDnmoTlopPnopHkuIrlhpnnnYDvvJrigJzkuIvmrKHlho3kuZ/kuI3miormsrvnlpfoja/msLTlgJ/nu5nliKvkurrkuobigJ1cIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuabvue7j+acieS4gOeTtuayu+eWl+iNr+awtOaRhuWcqOS9oOmdouWJje+8jOiAjOS9oOayoeacieePjeaDnFwiLFxuICAgIFwi5LiN5bm455qE5LqL5oOF57uI5LqO5Y+R55Sf5LqG4oCm4oCm5L2g5Zue5oOz6LW35pu+57uP5Zyo5bm/6ZiU55qE5Y6f6YeO5LiK5bC95oOF55qE5aWU6LeRXCIsXG4gICAgXCLkuI3lubjnmoTkuovmg4Xnu4jkuo7lj5HnlJ/kuobigKbigKbkuI3ov4flpb3mtojmga/mmK/kvaDlho3kuZ/kuI3nlKjlh4/ogqXkuoZcIixcbiAgICBcIuS4jeW5uOeahOS6i+aDhee7iOS6juWPkeeUn+S6huKApuKApuS4i+asoeWcqOWGkumZqeWJjeS4gOWumuimgeWQg+mlsemlrVwiXG4gIF07XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIGlmIChyZWFzb24pIHtcbiAgICAgIG92ZXJXaW5kb3dSZWFzb24udGV4dENvbnRlbnQgPSByZWFzb247XG4gICAgfSBlbHNlIHtcbiAgICAgIG92ZXJXaW5kb3dSZWFzb24uaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9XG4gICAgb3ZlcldpbmRvd01lc3NhZ2UudGV4dENvbnRlbnQgPSBkZWFkVGV4dFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkZWFkVGV4dC5sZW5ndGgpXTtcbiAgICBHYW1lLndpbmRvd3Muc3RhZ2UuaGlkZSgpO1xuICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuaGlkZSgpO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG4gIG92ZXJXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgR2FtZS5jbGVhclN0YWdlKCk7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MubWFpbi5zaG93KCk7XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
