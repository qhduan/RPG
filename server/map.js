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

var MAPS = {};

(function LoadArea () {
  var path = global.DATA_DIR + "/map";
  var maps = fs.readdirSync(path);

  maps.forEach(function (element) {
    if (element.indexOf("_extra.json") != -1)
      return;
    if (element.indexOf(".json") == -1)
      return;

    var id = element.substr(0, element.length - 5);

    var mapFile = fs.readFileSync(path + "/" + element, {encoding: "utf8"});
    var mapData = JSON.parse(mapFile);

    var extraFile = fs.readFileSync(path + "/" + id + "_extra.json", {encoding: "utf8"});
    var extra = JSON.parse(extraFile);

    // 把extra中的内容复制到map
    // 包括bgm, entry, actors, items, effects
    for (var key in extra) {
      mapData[key] = extra[key];
    }
    mapData.id = id;

    // 把所有地图图块的地址转换
    mapData.tilesets.forEach(function (element) {
      element.image = "/map/" + element.image;
    });

    // 替换effects音效到真实地址
    mapData.effects.forEach(function (element, index, array) {
      array[index] = "/sound/effect/" + element + ".ogg";
    });

    // 替换bgm到真实地址
    mapData.bgm = "/sound/bgm/" + mapData.bgm + ".ogg";

    MAPS[id] = mapData;

  });

  console.log("Maps loaded ", Object.keys(MAPS).length);

})();


function GetMap (id) {
  if (typeof id == "string") {
    return MAPS[id];
  } else if (id instanceof Array) {
    var ret = {};
    for (var i = 0; i < id.length; i++) {
      ret[id[i]] = MAPS[id[i]];
    }
    return ret;
  } else {
    throw "GetMap Invalid Argument";
  }
}

function ListMap () {
  return Object.keys(MAPS);
}

exports.get = GetMap;
exports.list = ListMap;
