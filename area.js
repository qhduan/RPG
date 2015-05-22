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

var areas = {};

(function LoadArea () {
  var path = __dirname + "/data/map/";
  var maps = fs.readdirSync(path);

  maps = maps.filter(function (element) {
    if (element.indexOf("_extra") != -1)
      return false;
    if (element == "resource")
      return false;
    if (element.indexOf(".json") == -1)
      return false;
    return true;
  });

  maps.forEach(function (element) {

    var mapId = element.substr(0, element.length - 5);

    var mapData = fs.readFileSync(path + mapId + ".json", {encoding: "utf8"});
    mapData = JSON.parse(mapData);

    mapData.id = mapId;

    var mapExtra = fs.readFileSync(path + mapId + "_extra.json", {encoding: "utf8"});
    mapExtra = JSON.parse(mapExtra);

    var resources = [];

    mapData.tilesets.forEach(function (element) {
      element.image = "/map/" + element.image;
      resources.push(element.image);
    });

    if (mapExtra.entry) {
      mapData.entry = mapExtra.entry;
    }

    if (mapExtra.bgm) {
      mapData.bgm = "/sound/bgm/" + mapExtra.bgm + ".ogg";
      resources.push(mapData.bgm);
    }

    if (mapExtra.actors) {
      mapData.actors = {};

      mapExtra.actors.forEach(function (element) {
        var actorId = element.id;
        var actorData = fs.readFileSync(
          __dirname + "/data/actor/" + actorId + ".json",
          {encoding: "utf8"});

        actorData = JSON.parse(actorData);

        actorData.id = actorId;
        actorData.x = element.x;
        actorData.y = element.y;

        actorData.image = "/actor/" + actorData.image;
        resources.push(actorData.image);

        mapData.actors[actorId] = actorData;
      });
    }

    mapData.resources = resources;

    areas[mapId] = mapData;

  });

  console.log("Area loaded");
  console.log(Object.keys(areas));

})();


function GetArea (req, res) {
  var id = req.body.id;

  if (typeof id != "string" || id.length <= 0)
    return res.json({error: "Invalid Id"});

  if (areas.hasOwnProperty(id)) {
    res.json({area: areas[id]});
  } else {
    return res.json({error: "Area Not Found"});
  }
}


exports.get = GetArea;
