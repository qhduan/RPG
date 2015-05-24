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

    // 把所有地图图块的地址都转换分析出来
    mapData.tilesets.forEach(function (element) {
      element.image = "/map/" + element.image;
      resources.push(element.image);
    });

    // entry是地图入口的坐标，entry.x entry.y
    if (mapExtra.entry) {
      mapData.entry = mapExtra.entry;
    }

    // 如果有bgm，则转换地址
    if (mapExtra.bgm) {
      mapData.bgm = "/sound/bgm/" + mapExtra.bgm + ".ogg";
      resources.push(mapData.bgm);
    }

    // 读取地图相关角色的数据，这里是固定的角色，即固定的npc或怪物
    if (mapExtra.actors) {
      mapData.actors = {};

      mapExtra.actors.forEach(function (element) {
        var actorId = element.id;

        var actorData = fs.readFileSync(
          __dirname + "/data/actor/" + actorId + ".json",
          {encoding: "utf8"});

        actorData = JSON.parse(actorData);

        // 把map.actors中的属性复制到actor
        for (var key in element) {
          actorData[key] = element[key];
        }

        actorData.image = "/actor/" + actorData.image;
        resources.push(actorData.image);

        mapData.actors[actorId] = actorData;
      });
    }

    // 读取地图相关的物品
    if (mapExtra.items) {
      mapData.items = {};

      mapExtra.items.forEach(function (element) {
        var itemId = element;

        var itemData = fs.readFileSync(
          __dirname + "/data/item/" + itemId + ".json",
          {encoding: "utf8"});

        itemData = JSON.parse(itemData);

        itemData.image = "data:image/png;base64," +
          fs.readFileSync(__dirname + "/data/item/" + itemData.image)
          .toString("base64");

        itemData.id = itemId;
        mapData.items[itemId] = itemData;

      });
    }

    // 读取地图相关的效果音
    if (mapExtra.effects) {
      mapData.effects = {};

      mapExtra.effects.forEach(function (element) {
        var url = "/sound/effect/" + element + ".ogg";
        resources.push(url);
        mapData.effects[element] = url;
      });
    }

    // resources当中是需要 客户端 预先加载的图片和声音文件
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

function AddHero (heroData) {
  areas[heroData.area].actors["hero_" + heroData.name] = heroData;
}

exports.get = GetArea;
exports.add = AddHero;
