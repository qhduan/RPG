"user strict";


var fs = require("fs");
var http = require("http");

var express = require('express');
var socketIO = require("socket.io")

var app = express();
var server = http.Server(app)
var io = socketIO(server);

function GetActor (socket, data) {
  fs.readFile(__dirname + "/actor/" + data.id + ".json",
  {encoding: "utf8"},
  function (err, jsonFile) {
    if (err) {
      socket.emit("get", {
        id: data.id,
        error: err
      });
      return;
    }

    var result;
    try {
      result = JSON.parse(jsonFile);
    } catch (e) {
      socket.emit("get", {
        id: data.id,
        error: err
      });
      return;
    }

    fs.readFile(__dirname + "/actor/" + result.image,
    function (err, imageFile) {
      if (err) {
        socket.emit("get", {
          id: data.id,
          error: err
        });
        return;
      }
      result.id = data.id;
      result.image = "data:image/png;base64," + imageFile.toString('base64');
      socket.emit("get", result);
    });

  });
}

function GetMap (socket, data) {
  fs.readFile(__dirname + "/map/" + data.id + ".json",
  {encoding: "utf8"},
  function (err, jsonFile) {
    if (err) {
      socket.emit("get", {
        id: data.id,
        error: err
      });
      return;
    }

    var result;
    try {
      result = JSON.parse(jsonFile);
    } catch (e) {
      socket.emit("get", {
        id: data.id,
        error: err
      });
      return;
    }

    var count = 0 - result.tilesets.length;

    result.tilesets.forEach(function (element) {
      fs.readFile(__dirname + "/map/" + element.image,
      function (err, imageFile) {
        result.id = data.id;
        element.image = "data:image/png;base64," + imageFile.toString('base64');
        count++;
        if (count >= 0) {
          socket.emit("get", result);
        }
      });
    });


  });
}

io.on("connection", function (socket) {
  socket.emit("message", "welcome");

  socket.on("get", function (data) {
    if (data.type == "actor") {
      GetActor(socket, data);
    } else if (data.type == "map") {
      GetMap(socket, data);
    }
  });
});


app.use(express.static(__dirname + "/public"));

var PORT = 9000;

server.listen(PORT);

console.log("Game Flying at ", PORT);
