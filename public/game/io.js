/*

Online A-RPG Game, Built using Node.js + createjs
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

  Game.io = {}; // 封装socket.io client的一些功能

  var ioGetCallback = {};

  (function ConnectSocketServer () {

    var a = document.createElement("a");
    a.href = document.URL;
    var url = "http://" + a.hostname;
    if (a.port && a.port.length) {
      url += ":" + a.port;
    }

    Game.io.socket = io(url);

    Game.io.socket.on("connect", function (socket) {
      console.log("Socket Connected");
    });

    Game.io.socket.on("disconnect", function (socket) {
      console.log("Socket Disconnected");
    });

    Game.io.socket.on("message", function (data) {
      console.log(data);
    });

    Game.io.socket.on("get", function (data) {
      if (data.error) {
        console.log("error", data.id, data.error);
        data = null;
      }

      if (ioGetCallback[data.id]) {
        ioGetCallback[data.id].forEach(function (element) {
          element(data);
        });
        delete ioGetCallback[data.id];
      }
    });

  })();

})();
