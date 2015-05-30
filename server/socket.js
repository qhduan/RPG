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
"use strict";

var socketIO = require("socket.io");

function Init (server) {
  
  socketIO(server).on("connection", function (socket) {

    socket.emit("system", "welcome");

    socket.on("get", function (data) {
      GetRoute(socket, data);
    });

    for (var key in SOCKET_LISTENERS) {
      (function (event, callback) {
        socket.on(event, function (data) {
          callback.forEach(function (element) {
            element(socket, data);
          });
        });
      })(key, SOCKET_LISTENERS[key]);
    }

  });
}

var SOCKET_LISTENERS = {};

function SocketAddEventListener (event, callback) {
  if (!SOCKET_LISTENERS[event])
    SOCKET_LISTENERS[event] = [];

  SOCKET_LISTENERS[event].push(callback);
}

var SOCKET_GET_ROUTE = {};

// 对客户端传来的get请求作route
function GetRoute (socket, data) {
  if (SOCKET_GET_ROUTE[data.path]) {
    SOCKET_GET_ROUTE[data.path](new SocketGetClass(
      socket, data.id, data.path, data.data
    ));
  } else {
    socket.emit("get", {
      id: data.id,
      path: data.path,
      data: {error: "Invalid Path"}
    });
  }
}

function RegisterGetRoute (path, handler) {
  console.log("SocketModule get reg ", path);
  SOCKET_GET_ROUTE[path] = handler;
}

function SocketGetClass (socket, id, path, data) {
  var self = this;
  self.socket = socket;
  self.id = id;
  self.path = path;
  self.data = data;
}

SocketGetClass.prototype.send = function (data) {
  var self = this;
  if (self.sent) {
    throw "Socket Get Only Send Once";
  } else {
    self.sent = true;
    self.socket.emit("get", {
      id: self.id,
      path: self.path,
      data: data
    });
  }
}


exports.on = SocketAddEventListener;
exports.reg = RegisterGetRoute;
exports.init = Init;
