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

exports.init = function () {

  require("./socket").init(io);

  //app.post("/hero/generate", require("./hero").generate);
  //app.post("/hero/create", require("./hero").create);

  //app.post("/area/get", require("./area").get);
  //app.post("/session/get", require("./session").getHandle);
  //app.post("/session/login", require("./session").loginHandle);

  app.get("/create", function (req, res) {
    res.sendFile(global.PUBLIC_DIR + "/create.html");
  });

  app.get("/play", function (req, res) {
    res.sendFile(global.PUBLIC_DIR + "/play.html");
  });


  app.use(express.static(global.PUBLIC_DIR));
  app.use(express.static(global.DATA_DIR));

  var PORT = 9000;

  server.listen(PORT);

  console.log("Game Flying at ", PORT);

};
