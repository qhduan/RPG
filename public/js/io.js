/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

  // 封装socket.io client的一些功能
  Game.io = {
    getList: {}
  };

  Game.io.get = function (path, data, callback) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = over;
    req.open("POST", path, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.responseType = "json";

    var parameters = "";
    for (var key in data) {
      if (parameters.length) parameters += "&";
      parameters += key + "=" + encodeURIComponent(data[key]);
    }
    req.send(parameters);

    function over() {
      if (req.readyState == 4) {
        if (req.status == 200) {
          callback(req.response);
        } else {
          console.log("Game.io.get failed", path, data);
        }
      }
    }
  };
})();
//# sourceMappingURL=io.js.map
