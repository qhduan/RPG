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

var app = express();

app.use(bodyParser.json({limit: "1mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "1mb"}));
app.use(compression());

var server = http.Server(app);

exports.init = function () {

  require("./socket").init(server);

  require("./communication");

  app.use(express.static(global.PUBLIC_DIR));
  app.use(express.static(global.DATA_DIR));

  app.get("/image.json", function (req, res) {
    var imagedir = fs.readdirSync(global.DATA_DIR + "/image");
    var files = {};
    imagedir.forEach(function (element) {
      if (element.match(/\.png$/)) {
        var imagefile = "data:image/png;base64," + fs.readFileSync(global.DATA_DIR + "/image/" + element).toString("base64");
        files["/image/" + element] = imagefile;
      }
    });
    res.json(files);
  });

  var PORT = 9000;

  server.listen(PORT);

  console.log("Game Flying at ", PORT);

};
