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

var item = require("./item");

var HEROS = {};

(function LoadHero () {
  herodb.find({}, function (err, heros) {
    heros.forEach(function (element) {
      var id = element.id;
      AddHero(element);
    });

    console.log("Heros loaded ", Object.keys(HEROS).length);
  });
})();

function AddHero (element) {
  var id = element.id;
  HEROS[id] = element;
  HEROS[id].animations = HERO_ANIMATIONS;
  HEROS[id].width = HEROS[id].custom.width;
  HEROS[id].height = HEROS[id].custom.height;
  HEROS[id].tilewidth = HEROS[id].custom.tilewidth;
  HEROS[id].tileheight = HEROS[id].custom.tileheight;
  // 读取角色技能
  HEROS[id].spells = spell.get(HEROS[id].spells);
  // 读取角色物品
  HEROS[id].items.forEach(function (element, index, array) {
    if (element)
      array[index] = item.get(element)
  });
  // 读取角色装备（物品）
  if (HEROS[id].equipment.head)
    HEROS[id].equipment.head = item.get(HEROS[id].equipment.head);
  if (HEROS[id].equipment.neck)
    HEROS[id].equipment.neck = item.get(HEROS[id].equipment.neck);
  if (HEROS[id].equipment.body)
    HEROS[id].equipment.body = item.get(HEROS[id].equipment.body);
  if (HEROS[id].equipment.feet)
    HEROS[id].equipment.feet = item.get(HEROS[id].equipment.feet);
  if (HEROS[id].equipment.righthand)
    HEROS[id].equipment.righthand = item.get(HEROS[id].equipment.righthand);
  if (HEROS[id].equipment.lefthand)
    HEROS[id].equipment.lefthand = item.get(HEROS[id].equipment.lefthand);
  if (HEROS[id].equipment.leftring)
    HEROS[id].equipment.leftring = item.get(HEROS[id].equipment.leftring);
  if (HEROS[id].equipment.rightring)
    HEROS[id].equipment.rightring = item.get(HEROS[id].equipment.rightring);
}

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
    console.log(typeof id, id);
    throw "GetHero Invalid Argument";
  }
}

function UpdateHero (id, object) {
  var obj = {
    "$set": object
  };
  herodb.update({id: id}, obj, {}, function (err) {
    if (err) {
      console.log("hero.UpdateHero ", err);
    }
    herodb.findOne({id: id}, function (err, doc) {
      AddHero(doc);
    });
  });
}

function ListHero () {
  return Object.keys(HEROS);
}

exports.add = AddHero;
exports.get = GetHero;
exports.update = UpdateHero;
exports.list = ListHero;
