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

var spells = {};

(function LoadSpell () {
  var path = __dirname + "/data/spell/";
  var files = fs.readdirSync(path);

  files = files.filter(function (element) {
    if (element.indexOf(".json") != -1)
      return true;
    return false;
  });

  files.forEach(function (element) {

    var spellId = element.substr(0, element.length - 5);

    var spell = fs.readFileSync(path + element, {encoding: "utf8"});
    spell = JSON.parse(spell);

    spell.image = "data:image/png;base64," + fs.readFileSync(path + spell.image).toString("base64");

    spell.sound = "/spell/" + spell.sound;

    spell.id = spellId;

    spells[spellId] = spell;
  });

  console.log("loaded", Object.keys(spells).length, "spells");
})();


function GetSpell (list) {
  var ret = {};

  list.forEach(function (element) {
    ret[element] = spells[element]
  });

  return ret;
}


exports.get = GetSpell;
