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

var SOCKET_ROUTE = {};

var HERO_SOCKET = {};
var SOCKET_HERO = {};

var hero = require("./hero");
var area = require("./area");
var herodb = require("./db").hero;

function RegisterGetRoute (path, handler) {
  console.log("reg ", path);
  SOCKET_ROUTE[path] = handler;
}

function SocketGetClass (socket, id, path, data) {
  var self = this;
  self.socket = socket;
  self.id = id;
  self.path = path;
  self.data = data;
}

SocketGetClass.prototype.send = function (data) {
  var self = this;
  if (self.sent) {
    throw "Socket Get Only Send Once";
  } else {
    self.sent = true;
    self.socket.emit("get", {
      id: self.id,
      path: self.path,
      data: data
    });
  }
}

function GetRoute (socket, data) {
  if (SOCKET_ROUTE[data.path]) {
    SOCKET_ROUTE[data.path](new SocketGetClass(
      socket, data.id, data.path, data.data
    ));
  } else {
    socket.emit("get", {
      id: data.id,
      path: data.path,
      data: {error: "Invalid Path"}
    });
  }
}

function Init (io) {
  io.on("connection", function (socket) {

    socket.emit("message", "welcome");

    // 获取信息的请求
    socket.on("get", function (data) {
      GetRoute(socket, data);
    });

    socket.on("disconnect", function () {
      var heroId = SOCKET_HERO[socket.id];

      var heroObj = hero.get(heroId);

      area.remove(heroObj.area, heroId);

      delete SOCKET_HERO[socket.id];
      delete HERO_SOCKET[heroId];

      for (var key in HERO_SOCKET) {
        if (hero.get(key).area == heroObj.area) {
          HERO_SOCKET[key].emit("removeHero", {
            id: heroId
          });
        }
      }
    });

    // 聊天消息
    socket.on("message", function (data) {
      var heroId = SOCKET_HERO[socket.id];
      if (!heroId) return;

      var heroObj = hero.get(heroId);

      for (var key in HERO_SOCKET) {
        if (hero.get(key).area == heroObj.area) {
          HERO_SOCKET[key].emit("message", data);
        }
      }
    });

    socket.on("move", function (data) {
      var heroId = SOCKET_HERO[socket.id];
      if (!heroId) return;

      var heroObj = hero.get(heroId);
      heroObj.x = data.x;
      heroObj.y = data.y;

      for (var key in HERO_SOCKET) {
        var h = hero.get(key);
        if (h.id != heroObj.id) {
          HERO_SOCKET[key].emit("move", {
            id: heroObj.id,
            data: data
          });
        }
      }
    });

    socket.on("attack", function (data) {
      var heroId = SOCKET_HERO[socket.id];
      if (!heroId) return;

      var heroObj = hero.get(heroId);

      for (var key in HERO_SOCKET) {
        var h = hero.get(key);
        if (h.id != heroObj.id) {
          HERO_SOCKET[key].emit("attack", {
            id: heroObj.id,
            data: data
          });
        }
      }
    });

  });
}











function GetArea (req) {
  var id = req.data.id;

  if (typeof id != "string") {
    return req.send({error: "GetArea Invalid Argument"});
  }

  var data = area.get(id);

  if (data) {
    var resources = {};
    for (var key in data.resources) {
      resources[key] = data.resources[key];
    }

    // 因为一个区域的heros是动态的，所以动态的加载已有的英雄的资源（包括玩家自己英雄的资源）
    for (var key in data.heros) {
      var heroData = data.heros[key];

      for (var key in heroData.spells) {
        var spellData = heroData.spells[key];

        resources[spellData.image] = "image";
        resources[spellData.icon] = "image";
        resources[spellData.sound] = "sound";
      }
    }

    req.send({
      map: data.map,
      heros: data.heros,
      actors: data.actors,
      items: data.items,
      resources: resources
    });
  } else {
    req.send({error: "Area Not Found"});
  }
}

RegisterGetRoute("/area/get", GetArea);



function Login (req) {
  var name = req.data.name;
  var password = req.data.password;

  if (typeof name != "string" || name.length <= 0)
    return req.send({error: "Invalid Name"});

  if (typeof password != "string" || password.length <= 0)
    return req.send({error: "Invalid Password"});

  herodb.findOne({"name": name, "password": password}, function (err, doc) {
    if (err) {
      console.log("Login", err);
      req.send({error: "Server Error"});
    }

    if (doc) {
      area.add(doc.area, doc.id);
      var heroObj = hero.get(doc.id);

      for (var key in HERO_SOCKET) {
        if (hero.get(key).area == heroObj.area) {
          HERO_SOCKET[key].emit("addHero", {
            hero: heroObj
          });
        }
      }

      HERO_SOCKET[doc.id] = req.socket;
      SOCKET_HERO[req.socket.id] = doc.id;


      req.send({success: {
        heroId: doc.id,
        areaId: doc.area
      }});
    } else {
      req.send({error: "Invalid Name or Password"});
    }

  });

}

RegisterGetRoute("/login", Login);



// 用于根据客户端传来的参数，寻找到指定图片的相应地址
function GenerateHero (req) {

  var hero = {
    "sex": req.data.sex,
    "body": req.data.body,
    "eyes": req.data.eyes,

    "hair": req.data.hair,
    "haircolor": req.data.haircolor,

    "head": req.data.head,
    "shirts": req.data.shirts,
    "pants": req.data.pants,
    "shoes": req.data.shoes,

    "armorchest": req.data.armorchest,
    "armorarm": req.data.armorarm,
    "armorlegs": req.data.armorlegs,
    "armorhelms": req.data.armorhelms,
    "armorfeet": req.data.armorfeet
  };

  if (hero.sex != "male" && hero.sex != "female") {
    return req.send({error: "Invalid Sex"});
  }

  if (typeof hero.body != "string" || hero.body.length <= 0) {
    return req.send({error: "Invalid Body"});
  }

  var BASE = "/hero";
  var ret = {};
  // 身体
  if (hero.body && hero.body.length)
    ret.body = BASE + "/body/" + hero.sex + "/" + hero.body + ".png";
  // 眼睛
  if (hero.eyes && hero.eyes.length)
    ret.eyes = BASE + "/body/" + hero.sex + "/eyes/" + hero.eyes + ".png";
  // 头发 & 头发颜色
  if (hero.hair && hero.hair.length && hero.haircolor && hero.haircolor.length)
    ret.hair = BASE + "/hair/" + hero.sex + "/" + hero.hair + "/" + hero.haircolor + ".png";
  // 帽子（头盔）
  if (hero.head && hero.head.length)
    ret.head = BASE + "/head/" + hero.sex + "/" + hero.head + ".png";
  // 衬衫
  if (hero.shirts && hero.shirts.length)
    ret.shirts = BASE + "/shirts/" + hero.sex + "/" + hero.shirts + ".png";
  // 裤子
  if (hero.pants && hero.pants.length)
    ret.pants = BASE + "/pants/" + hero.sex + "/" + hero.pants + ".png";
  // 鞋
  if (hero.shoes && hero.shoes.length)
    ret.shoes = BASE + "/shoes/" + hero.sex + "/" + hero.shoes + ".png";
  // 胸甲
  if (hero.armorchest && hero.armorchest.length)
    ret.armorchest = BASE + "/armor/chest/" + hero.sex + "/" + hero.armorchest + ".png";
  // 臂甲
  if (hero.armorarm && hero.armorarm.length)
    ret.armorarm = BASE + "/armor/arm/" + hero.sex + "/" + hero.armorarm + ".png";
  // 腿甲
  if (hero.armorlegs && hero.armorlegs.length)
    ret.armorlegs = BASE + "/armor/legs/" + hero.sex + "/" + hero.armorlegs + ".png";
  // 头盔
  if (hero.armorhelms && hero.armorhelms.length)
    ret.armorhelms = BASE + "/armor/helms/" + hero.sex + "/" + hero.armorhelms + ".png";
  // 足甲
  if (hero.armorfeet && hero.armorfeet.length)
    ret.armorfeet = BASE + "/armor/feet/" + hero.sex + "/" + hero.armorfeet + ".png";

  ret.weapons = BASE + "/weapons/" + hero.sex + "/weapons.png";

  req.send(ret);
} // GenerateHero


RegisterGetRoute("/hero/generate", GenerateHero);



function CreateHero (req, res) {
  var name = req.data.name;
  var password = req.data.password;
  var custom = req.data.custom;

  if (typeof name != "string" || name.length <= 0) {
    return req.send({error: "Invalid Name"});
  }

  if (typeof password != "string" || password.length <= 0) {
    return req.send({error: "Invalid Password"});
  }

  if (typeof custom != "object") {
    return req.send({error: "Invalid Custom"});
  }

  if (!custom.body || !custom.sex) {
    return req.send({error: "Invalid Custom"});
  }

  herodb.find({"name": name}, function (err, docs) {
    if (err) {
      console.log("CreateHero", err);
      req.send({error: "System Error"});
      return;
    }

    if (docs.length > 0) {
      req.send({error: "Name Conflict"});
    } else {
      herodb.insert([{
        "id": "hero_" + name,
        "name": name,
        "password": password,
        "custom": custom, // 保存用户纸娃娃的配置
        "hitpoint": 100, //生命
        "manapoint": 100, // 魔法
        "strength": 10, // 力量
        "dexterity": 10, // 敏捷
        "intelligence": 10, // 智力
        "constitution": 10, // 体质
        "area": "town0001", // 当前所在地图
        "x": -1,
        "y": -1,
        "type": "hero",
        "spells": [ // 招式，魔法
          "spell0001", // 普通剑攻击
          "spell0002", // 普通枪攻击
          "spell0003", // 普通弓攻击
          "spell0004" // 火球术
        ],
        "skill": { // 技能，例如生活技能
        }
      }], function (err, newDocs) {
        if (err) {
          console.log(err);
          return req.send({error: "System Error"});
        }
        var hero = newDocs[0];
        req.send({success: "ok"});
      });
    }
  });
}

RegisterGetRoute("/hero/create", CreateHero);

exports.init = Init;
