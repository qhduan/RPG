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

  var win = Game.windows.pickup = Game.Window.create("pickupWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"pickupWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"pickupWindowAll\" class=\"brownButton\">A 全部</button>\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"pickupWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    .pickupWindow table {\n      width: 100%;\n    }\n\n    .pickupWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .pickupWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16;\n    }\n\n    #pickupWindowClose {\n\n    }\n\n    #pickupWindowAll {\n\n    }\n  ";

  var pickupWindowClose = win.querySelector("button#pickupWindowClose");
  var pickupWindowAll = win.querySelector("button#pickupWindowAll");
  var pickupWindowTable = win.querySelector("#pickupWindowTable");

  var currentItemObj = null;
  var lastSelect = -1;

  pickupWindowClose.addEventListener("click", function (event) {
    Game.windows.pickup.hide();
  });

  pickupWindowAll.addEventListener("click", function (event) {
    var itemObj = currentItemObj;
    if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
      Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
        if (itemId == "gold") {
          Game.hero.data.gold += itemCount;
        } else {
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId] += itemCount;
          } else {
            Game.hero.data.items[itemId] = itemCount;
          }
        }
        delete inner[itemId];
      });
      Game.windows.pickup.open(itemObj);
    }
  });

  win.whenUp(["a", "A"], function (key) {
    pickupWindowAll.click();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    var buttons = pickupWindowTable.querySelectorAll("button");
    for (var i = 0, len = buttons.length; i < len; i++) {
      var buttonIndex = buttons[i].getAttribute("data-index");
      if (buttonIndex) {
        if (buttonIndex == key) {
          buttons[i].click();
        }
      }
    }
  });

  win.assign("open", function (itemObj, select) {
    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Game.area.bags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var bag = _step.value;

          if (bag == itemObj) {
            Game.area.bags["delete"](bag);
            itemObj.erase();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      Game.windows.pickup.hide();
      return;
    }

    currentItemObj = itemObj;

    var index = 1;
    var table = "";
    Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
      var item = Game.items[itemId];

      var line = "";

      if (select == index - 1) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" data-index=\"" + index + "\" class=\"brownButton\">" + (index <= 9 ? index : "") + " 拿取</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    pickupWindowTable.innerHTML = table;
    Game.windows.pickup.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = pickupWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = pickupWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(currentItemObj, 0);
      } else if (key == "up") {
        win.open(currentItemObj, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(currentItemObj, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(currentItemObj, select);
      }
    }
  });

  pickupWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && currentItemObj.inner && currentItemObj.inner.hasOwnProperty(itemId)) {
      var itemCount = currentItemObj.inner[itemId];
      if (itemId == "gold") {
        Game.hero.data.gold += itemCount;
      } else {
        if (Game.hero.data.items.hasOwnProperty(itemId)) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
      }
      delete currentItemObj.inner[itemId];
      win.open(currentItemObj);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dQaWNrdXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5FLEtBQUcsQ0FBQyxJQUFJLDZvQkFrQlAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyw0VEF1Qk4sQ0FBQzs7QUFFRixNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RSxNQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsTUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWhFLE1BQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixNQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsbUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzNELFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzVCLENBQUMsQ0FBQzs7QUFFSCxpQkFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6RCxRQUFJLE9BQU8sR0FBRyxjQUFjLENBQUM7QUFDN0IsUUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JFLFlBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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Q0FFSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJHYW1lV2luZG93UGlja3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5waWNrdXAgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJwaWNrdXBXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIndpbmRvdy1ib3hcIj5cbiAgICAgIDxidXR0b24gaWQ9XCJwaWNrdXBXaW5kb3dDbG9zZVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7lhbPpl608L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJwaWNrdXBXaW5kb3dBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+QSDlhajpg6g8L2J1dHRvbj5cbiAgICAgIDx0YWJsZSBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNDBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDEyMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMzBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDMwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDYwcHg7XCI+PC90ZD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHkgaWQ9XCJwaWNrdXBXaW5kb3dUYWJsZVwiPjwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICBgO1xuXG4gIHdpbi5jc3MgPSBgXG4gICAgLnBpY2t1cFdpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAucGlja3VwV2luZG93IHRhYmxlIGltZyB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAucGlja3VwV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTY7XG4gICAgfVxuXG4gICAgI3BpY2t1cFdpbmRvd0Nsb3NlIHtcblxuICAgIH1cblxuICAgICNwaWNrdXBXaW5kb3dBbGwge1xuXG4gICAgfVxuICBgO1xuXG4gIGxldCBwaWNrdXBXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3BpY2t1cFdpbmRvd0Nsb3NlXCIpO1xuICBsZXQgcGlja3VwV2luZG93QWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jcGlja3VwV2luZG93QWxsXCIpO1xuICBsZXQgcGlja3VwV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNwaWNrdXBXaW5kb3dUYWJsZVwiKTtcblxuICBsZXQgY3VycmVudEl0ZW1PYmogPSBudWxsO1xuICBsZXQgbGFzdFNlbGVjdCA9IC0xO1xuXG4gIHBpY2t1cFdpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLndpbmRvd3MucGlja3VwLmhpZGUoKTtcbiAgfSk7XG5cbiAgcGlja3VwV2luZG93QWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaXRlbU9iaiA9IGN1cnJlbnRJdGVtT2JqO1xuICAgIGlmIChpdGVtT2JqICYmIGl0ZW1PYmouaW5uZXIgJiYgT2JqZWN0LmtleXMoaXRlbU9iai5pbm5lcikubGVuZ3RoID4gMCkge1xuICAgICAgU3ByaXRlLmVhY2goaXRlbU9iai5pbm5lciwgZnVuY3Rpb24gKGl0ZW1Db3VudCwgaXRlbUlkLCBpbm5lcikge1xuICAgICAgICBpZiAoaXRlbUlkID09IFwiZ29sZFwiKSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZ29sZCArPSBpdGVtQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0pIHtcbiAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF0gKz0gaXRlbUNvdW50O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdID0gaXRlbUNvdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgaW5uZXJbaXRlbUlkXTtcbiAgICAgIH0pO1xuICAgICAgR2FtZS53aW5kb3dzLnBpY2t1cC5vcGVuKGl0ZW1PYmopO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJhXCIsIFwiQVwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHBpY2t1cFdpbmRvd0FsbC5jbGljaygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd2luLmhpZGUoKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBwaWNrdXBXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBidXR0b25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgYnV0dG9uSW5kZXggPSBidXR0b25zW2ldLmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIik7XG4gICAgICBpZiAoYnV0dG9uSW5kZXgpIHtcbiAgICAgICAgaWYgKGJ1dHRvbkluZGV4ID09IGtleSkge1xuICAgICAgICAgIGJ1dHRvbnNbaV0uY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKGl0ZW1PYmosIHNlbGVjdCkge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0ID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHNlbGVjdCA9IC0xO1xuICAgIH1cblxuICAgIGxhc3RTZWxlY3QgPSBzZWxlY3Q7XG5cbiAgICBpZiAoIWl0ZW1PYmouaW5uZXIgfHwgT2JqZWN0LmtleXMoaXRlbU9iai5pbm5lcikubGVuZ3RoIDw9IDApIHtcbiAgICAgIGZvciAobGV0IGJhZyBvZiBHYW1lLmFyZWEuYmFncykge1xuICAgICAgICBpZiAoYmFnID09IGl0ZW1PYmopIHtcbiAgICAgICAgICBHYW1lLmFyZWEuYmFncy5kZWxldGUoYmFnKTtcbiAgICAgICAgICBpdGVtT2JqLmVyYXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEdhbWUud2luZG93cy5waWNrdXAuaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRJdGVtT2JqID0gaXRlbU9iajtcblxuICAgIGxldCBpbmRleCA9IDE7XG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBTcHJpdGUuZWFjaChpdGVtT2JqLmlubmVyLCBmdW5jdGlvbiAoaXRlbUNvdW50LCBpdGVtSWQsIGlubmVyKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IChpbmRleCAtIDEpKSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuXG4gICAgICBpZiAoaXRlbS5pY29uKSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPjxpbWcgYWx0PVwiXCIgc3JjPVwiJHtpdGVtLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPiA8L3RkPlxcbmA7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbS5kYXRhLnZhbHVlfUc8L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4ke2l0ZW1Db3VudH08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5kZXNjcmlwdGlvbn08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD48YnV0dG9uIGRhdGEtaWQ9XCIke2l0ZW1JZH1cIiBkYXRhLWluZGV4PVwiJHtpbmRleH1cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+JHtpbmRleDw9OT8oaW5kZXgpOlwiXCJ9IOaLv+WPljwvYnV0dG9uPjwvdGQ+XFxuYDtcblxuICAgICAgbGluZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICB0YWJsZSArPSBsaW5lO1xuICAgICAgaW5kZXgrKztcbiAgICB9KTtcblxuICAgIHBpY2t1cFdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIEdhbWUud2luZG93cy5waWNrdXAuc2hvdygpO1xuICB9KTtcblxuICB3aW4ud2hlblVwKFtcImVudGVyXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBwaWNrdXBXaW5kb3dUYWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIGlmIChsYXN0U2VsZWN0ID49IDAgJiYgbGFzdFNlbGVjdCA8IGJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBidXR0b25zW2xhc3RTZWxlY3RdLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInVwXCIsIFwiZG93blwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBjb3VudCA9IHBpY2t1cFdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIikubGVuZ3RoO1xuXG4gICAgaWYgKGxhc3RTZWxlY3QgPT0gLTEpIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgd2luLm9wZW4oY3VycmVudEl0ZW1PYmosIDApO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGN1cnJlbnRJdGVtT2JqLCBjb3VudCAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0ICsgMTtcbiAgICAgICAgaWYgKHNlbGVjdCA+PSBjb3VudCkge1xuICAgICAgICAgIHNlbGVjdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4oY3VycmVudEl0ZW1PYmosIHNlbGVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInVwXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgLSAxO1xuICAgICAgICBpZiAoc2VsZWN0IDwgMCkge1xuICAgICAgICAgIHNlbGVjdCA9IGNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihjdXJyZW50SXRlbU9iaiwgc2VsZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHBpY2t1cFdpbmRvd1RhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaXRlbUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgaWYgKGl0ZW1JZCAmJiBjdXJyZW50SXRlbU9iai5pbm5lciAmJiBjdXJyZW50SXRlbU9iai5pbm5lci5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICBsZXQgaXRlbUNvdW50ID0gY3VycmVudEl0ZW1PYmouaW5uZXJbaXRlbUlkXTtcbiAgICAgIGlmKGl0ZW1JZCA9PSBcImdvbGRcIikge1xuICAgICAgICBHYW1lLmhlcm8uZGF0YS5nb2xkICs9IGl0ZW1Db3VudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChHYW1lLmhlcm8uZGF0YS5pdGVtcy5oYXNPd25Qcm9wZXJ0eShpdGVtSWQpKSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXSArPSBpdGVtQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXSA9IGl0ZW1Db3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGVsZXRlIGN1cnJlbnRJdGVtT2JqLmlubmVyW2l0ZW1JZF07XG4gICAgICB3aW4ub3BlbihjdXJyZW50SXRlbU9iaik7XG4gICAgfVxuICB9KTtcblxufSkoKTtcbiJdfQ==
