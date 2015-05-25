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

var HERO_ANIMATIONS = {
  spellcastup: [0, 6, "", 0.8],
  spellcastleft: [13, 19, "", 0.8],
  spellcastdown: [26, 32, "", 0.8],
  spellcastright: [39, 45, "", 0.8],

  thrustup: [52, 59, "", 0.8],
  thrustleft: [65, 72, "", 0.8],
  thrustdown: [78, 85, "", 0.8],
  thrustright: [91, 98, "", 0.8],

  walkup: [104, 112, "walkup", 0.4],
  walkleft: [117, 125, "walkleft", 0.4],
  walkdown: [130, 138, "walkdown", 0.4],
  walkright: [143, 151, "walkright", 0.4],

  runup: [104, 112, "runup", 0.7],
  runleft: [117, 125, "runleft", 0.7],
  rundown: [130, 138, "rundown", 0.7],
  runright: [143, 151, "runright", 0.7],

  slashup: [156, 161, "", 0.8],
  slashleft: [169, 174, "", 0.8],
  slashdown: [182, 187, "", 0.8],
  slashright: [195, 200, "", 0.8],

  shootup: [208, 220, "", 0.8],
  shootleft: [221, 233, "", 0.8],
  shootdown: [234, 246, "", 0.8],
  shootright: [247, 259, "", 0.8],

  hurt: [260, 265, "", 0.3],

  dead: 265,

  faceup: 104,
  faceleft: 117,
  facedown: 130,
  faceright: 143
};

var fs = require("fs");

var herodb = require("./db").hero;

var spell = require("./spell");

var HEROS = {};

(function LoadHero () {
  herodb.find({}, function (err, heros) {
    heros.forEach(function (element) {
      var id = "hero_" + element.name;

      HEROS[id] = element;

      HEROS[id].id = id;
      HEROS[id].animations = HERO_ANIMATIONS;
      HEROS[id].width = HEROS[id].custom.width;
      HEROS[id].height = HEROS[id].custom.height;
      HEROS[id].tilewidth = HEROS[id].custom.tilewidth;
      HEROS[id].tileheight = HEROS[id].custom.tileheight;
      // 读取角色技能
      HEROS[id].spells = spell.get(HEROS[id].spells);
    });

    console.log("Heros loaded ", Object.keys(HEROS).length);
  });
})();

function GetHero (id) {
  if (typeof id == "string") {
    return HEROS[id];
  } else if (id instanceof Array) {
    var ret = {};
    for (var i = 0; i < id.length; i++) {
      ret[id[i]] = HEROS[id[i]];
    }
    return ret;
  } else {
    throw "Invalid Argument";
  }
}

function ListHero () {
  return Object.keys(HEROS);
}

exports.get = GetHero;
exports.list = ListHero;
