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

var MapModule = require("./map");
var ActorModule = require("./actor");
var ItemModule = require("./item");
var HeroModule = require("./hero");

var AREAS = {};

(function LoadArea () {
  MapModule.list().forEach(function (element) {
    var id = element;

    var mapData = MapModule.get(id);

    var result = {
      map: mapData,
      drops: {},
      heros: {}
    };

    // 获取mapData中的actors
    var actors = {};
    mapData.actors.forEach(function (element) {
      var actorData = ActorModule.get(element.id);
      for (var key in element) {
        actorData[key] = element[key];
      }
      actors[actorData.id] = actorData;
    });
    result.actors = actors;

    // 获取mapData中的items
    var items = {};
    mapData.items.forEach(function (element) {
      var itemData = ItemModule.get(element);
      items[itemData.id] = itemData;
    });
    result.items = items;


    // 处理地图中加载的资源
    var resources = {};

    // 地图图块
    mapData.tilesets.forEach(function (element) {
      resources[element.image] = "image";
    });

    // bgm
    if (mapData.bgm) {
      resources[mapData.bgm] = "sound";
    }

    // actors' images
    for (var key in actors) {
      resources[actors[key].image] = "image";

      // actors' spells' images
      for (var key in actors[key].spells) {
        var spell = actors[key].spells[key];

        resources[spell.image] = "image";
        resources[spell.sound] = "sound";
      }
    }

    // items' image
    for (var key in items) {
      resources[items[key].image] = "image;"
    }

    mapData.effects.forEach(function (element) {
      resources[element] = "sound";
    });

    result.resources = resources;
    AREAS[id] = result;
  });

  console.log("Areas loaded ", Object.keys(AREAS).length);
})();


function AddHero (areaId, heroId) {
  AREAS[areaId].heros[heroId] = HeroModule.get(heroId);
}

function RemoveHero (areaId, heroId) {
  if (AREAS[areaId].heros[heroId]) {
    delete AREAS[areaId].heros[heroId];
  }
}


function GetArea (id) {
  return AREAS[id]
}

exports.get = GetArea;
exports.add = AddHero;
exports.remove = RemoveHero;
