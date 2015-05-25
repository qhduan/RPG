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

var ITEMS = {};

(function LoadItem () {
  var path = global.DATA_DIR + "/item";
  var files = fs.readdirSync(path);

  files.forEach(function (element) {
    if (element.indexOf(".json") == -1)
      return;

    var id = element.substr(0, element.length - 5);

    var itemFile = fs.readFileSync(path + "/" + element, {encoding: "utf8"});

    var itemData = JSON.parse(itemFile);

    itemData.image = "/item/" + itemData.image;

    ITEMS[itemData.id] = itemData;
  });

  console.log("Item loaded ", Object.keys(ITEMS).length);
})();


function GetItem (id) {
  if (typeof id == "string") {
    return ITEMS[id];
  } else if (id instanceof Array) {
    var ret = {};
    for (var i = 0; i < id.length; i++) {
      ret[id[i]] = ITEMS[id[i]];
    }
    return ret;
  } else {
    throw "Invalid Argument";
  }
}


exports.get = GetItem;
