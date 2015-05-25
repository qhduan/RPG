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

var map = require("./map");
var hero = require("./hero");

var AREAS = {};

(function LoadArea () {
  map.list().forEach(function (element) {
    var id = element;

    var mapData = map.get(id);

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

    // actors's image
    for (var key in mapData.actors) {
      var actor = mapData.actors[key];

      resources[actor.image] = "image";

      for (var key in actor.spells) {
        var spell = actor.spells[key];

        resources[spell.image] = "image";
        resources[spell.sound] = "sound";
      }
    }

    // items' image
    for (var key in mapData.items) {
      var item = mapData.items[key];

      resources[item.image] = "image;"
    }

    mapData.effects.forEach(function (element) {
      resources[element] = "sound";
    });

    AREAS[id] = {
      map: mapData,
      resources: resources,
      heros: {}
    };
  });

  console.log("Areas loaded ", Object.keys(AREAS).length);
})();


function AddHero (areaId, heroId) {
  AREAS[areaId].heros[heroId] = hero.get(heroId);
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
