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

  // 封装socket.io client的一些功能
  Game.io = {};

  var getList = {};

  Game.io.get = function (path, data, callback) {
    var id = Math.random().toString(16).substr(2);
    getList[id] = callback;
    Game.io.socket.emit("get", {
      id: id,
      path: path,
      data: data
    });
  };

  function GetHandle (data) {
    if (getList[data.id]) {
      getList[data.id](data.data);
    } else {
      throw "IO Error";
    }
  };

  Game.io.init = function (callback) {

    // 从页面地址找到服务器地址，服务器地址就是web地址的hostname，但是没有path
    var url = (function GetServerURL () {
      var a = document.createElement("a");
      a.href = document.URL;
      var u = "http://" + a.hostname;
      if (a.port && a.port.length) {
        u += ":" + a.port;
      }
      return u;
    })();

    var socket = Game.io.socket = io(url);

    Game.io.socket.on("connect", function () {
      
      socket.on("disconnect", function () {
        alert("Socket Disconnected");
        window.location.href = "/";
      });

      socket.on("message", function (data) {
        console.log("server message:", data);
      });

      socket.on("get", GetHandle);

      callback();
    });
  };

})();
