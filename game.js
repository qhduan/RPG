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


var fs = require("fs");
var http = require("http");

var express = require("express");
var bodyParser = require("body-parser");
var compression = require("compression");
var socketIO = require("socket.io");

var app = express();
var server = http.Server(app)
var io = socketIO(server);

app.use(bodyParser.json({limit: "1mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "1mb"}));
app.use(compression());

function GetSpell (socket, data) {
  fs.readFile(__dirname + "/data/spell/" + data.id + ".json",
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

    fs.readFile(__dirname + "/data/spell/" + result.image,
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

function GetActor (socket, data) {
  fs.readFile(__dirname + "/data/actor/" + data.id + ".json",
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

    fs.readFile(__dirname + "/data/actor/" + result.image,
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
  fs.readFile(__dirname + "/data/map/" + data.id + ".json",
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
      fs.readFile(__dirname + "/data/map/" + element.image,
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

function GetSound(socket, data) {
  fs.readFile(__dirname + "/data/sound/" + data.id + ".ogg",
  function (err, imageFile) {
    var sound = "data:audio/ogg;base64," + imageFile.toString('base64');
    socket.emit("get", {
      id: data.id,
      sound: sound
    });
  });
}

io.on("connection", function (socket) {
  socket.emit("message", "welcome");

  socket.on("get", function (data) {
    switch (data.type) {
      case "actor":
        GetActor(socket, data);
        break;
      case "map":
        GetMap(socket, data);
        break;
      case "spell":
        GetSpell(socket, data);
        break;
      case "sound":
        GetSound(socket, data);
        break;
      default:
        socket.emit("get", {
          id: data.id,
          error: "Unknown Type"
        });
    }
  });
});

app.post("/hero/generate", require("./hero").generate);
app.post("/hero/create", require("./hero").create);
app.post("/hero/login", require("./hero").login);
app.post("/hero/get", require("./hero").get);

app.post("/area/get", require("./area").get);

app.get("/create", function (req, res) {
  res.sendFile(__dirname + "/public/create.html");
});

app.get("/play", function (req, res) {
  res.sendFile(__dirname + "/public/play.html");
});


app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/data"));

var PORT = 9000;

server.listen(PORT);

console.log("Game Flying at ", PORT);
