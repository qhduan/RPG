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

var area = require("./area");
var hero = require("./hero");
var herodb = require("./db").hero;

var SESSIONS = {};

function CreateSession (hero) {
  var id = Math.random().toString(16).substr(2);

  SESSIONS[id] = {
    heroId: hero.id,
    areaId: hero.area
  };

  return id;
}

function Login (name, password) {
  herodb.find({"name": name}, function (err, docs) {
    if (err) {
      console.log("Login", err);
    }
    if (docs.length <= 0) {
      res.json({error: "No Hero Found"});
    } else {
      var hero = docs[0];
      area.add(hero.area, hero.id);
      return ({success: CreateSession(hero)});
    }
  });
}

function GetSession (session) {
  return SESSIONS[session];
}

exports.login = Login;
//exports.getHandle = GetSessionHandle;
exports.get = GetSession;
