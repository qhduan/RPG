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

  var win = Game.windows.trade = new Game.Window("tradeWindow");

  win.html("\n    <div class=\"window-box\">\n      <button id=\"tradeWindowClose\">关闭</button>\n      <table style=\"width: 740px; height: 360px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tbody>\n          <tr>\n            <td style=\"vertical-align: top;\">\n              <div style=\"width: 350px; overflow-y: auto;\">\n                <table style=\"width: 100%;\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n                  <thead>\n                    <tr>\n                      <td style=\"width: 40px;\"></td>\n                      <td></td>\n                      <td style=\"width: 30px;\"></td>\n                      <td style=\"width: 60px;\"></td>\n                    </tr>\n                  </thead>\n                  <tbody id=\"tradeWindowTable\">\n                  </tbody>\n                </table>\n              </div>\n            </td>\n            <td style=\"vertical-align: top;\">\n              <div style=\"width: 350px; overflow-y: auto;\">\n                <table style=\"width: 100%;\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\">\n                  <thead>\n                    <tr>\n                      <td style=\"width: 40px;\"></td>\n                      <td></td>\n                      <td style=\"width: 30px;\"></td>\n                      <td style=\"width: 30px;\"></td>\n                      <td style=\"width: 60px;\"></td>\n                    </tr>\n                  </thead>\n                  <tbody id=\"tradeWindowHero\">\n                  </tbody>\n                </table>\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  ");

  win.css("\n    #tradeWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #tradeWindowTable button, #tradeWindowHero button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n  ");

  document.querySelector("button#tradeWindowClose").addEventListener("click", function () {
    Game.windows.trade.hide();
  });

  win.register("trade", function (items) {
    var tradeTable = document.getElementById("tradeWindowTable");
    var tradeHeroTable = document.getElementById("tradeWindowHero");

    items.forEach(function (itemId) {
      var line = document.createElement("tr");

      var icon = document.createElement("td");
      icon.appendChild(Game.items[itemId].icon.cloneNode());
      line.appendChild(icon);

      var name = document.createElement("td");
      name.textContent = Game.items[itemId].data.name;
      line.appendChild(name);

      var value = document.createElement("td");
      value.textContent = Game.items[itemId].data.value + "G";
      value.style.textAlign = "center";
      value.style.color = "gold";
      line.appendChild(value);

      var buy = document.createElement("td");
      var buyButton = document.createElement("button");
      buyButton.textContent = "买入";
      buy.appendChild(buyButton);
      line.appendChild(buy);

      tradeTable.appendChild(line);
    });

    Sprite.Util.each(Game.hero.data.items, function (itemCount, itemId) {
      var line = document.createElement("tr");

      var icon = document.createElement("td");
      icon.appendChild(Game.items[itemId].icon.cloneNode());
      line.appendChild(icon);

      var name = document.createElement("td");
      name.textContent = Game.items[itemId].data.name;
      line.appendChild(name);

      var count = document.createElement("td");
      count.textContent = itemCount;
      count.style.textAlign = "center";
      line.appendChild(count);

      var value = document.createElement("td");
      value.textContent = Game.items[itemId].data.value + "G";
      value.style.textAlign = "center";
      value.style.color = "gold";
      line.appendChild(value);

      var sell = document.createElement("td");
      var sellButton = document.createElement("button");
      sellButton.textContent = "卖出";
      sell.appendChild(sellButton);
      line.appendChild(sell);

      tradeHeroTable.appendChild(line);
    });

    Game.windows.trade.show();
  });
})();
//# sourceMappingURL=GameWindowTrade.js.map
