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

var herodb = require("./db").hero;
var area = require("./area");

var spell = require("./spell");

var sessions = {};

function CreateSession (hero) {
  var id = Math.random().toString(16).substr(2);

  delete hero.password;

  hero.tileheight = 56;
  hero.tilewidth = 48;
  hero.animations = {
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

  sessions[id] = {
    hero: hero,
    time: new Date()
  };
  return id;
}

function GetSession (session) {
  return sessions[session];
}

function ReadHero (hero, callback) {
  var BASE = __dirname + "/data/hero";
  var result = {};

  // 一共有12个可能属性
  // 其中sex属性不需要回调，hair和haircolor属性一起用
  var count = -12;
  function Finish () {
    count++;
    if (count >= 0) {
      callback(result);
    }
  }

  // 身体
  if (hero.body && hero.body.length) {
    var path = BASE + "/body/" + hero.sex + "/" + hero.body + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.body = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 眼睛
  if (hero.eyes && hero.eyes.length) {
    var path = BASE + "/body/" + hero.sex + "/eyes/" + hero.eyes + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.eyes = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 头发 & 头发颜色
  if (hero.hair && hero.hair.length && hero.haircolor && hero.haircolor.length) {
    var path = BASE + "/hair/" + hero.sex + "/" + hero.hair + "/" + hero.haircolor + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.hair = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 帽子（头盔）
  if (hero.head && hero.head.length) {
    var path = BASE + "/head/" + hero.sex + "/" + hero.head + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.head = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 衬衫
  if (hero.shirts && hero.shirts.length) {
    var path = BASE + "/shirts/" + hero.sex + "/" + hero.shirts + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.shirts = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 裤子
  if (hero.pants && hero.pants.length) {
    var path = BASE + "/pants/" + hero.sex + "/" + hero.pants + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.pants = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 鞋
  if (hero.shoes && hero.shoes.length) {
    var path = BASE + "/shoes/" + hero.sex + "/" + hero.shoes + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.shoes = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 胸甲
  if (hero.armorchest && hero.armorchest.length) {
    var path = BASE + "/armor/chest/" + hero.sex + "/" + hero.armorchest + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.armorchest = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 臂甲
  if (hero.armorarm && hero.armorarm.length) {
    var path = BASE + "/armor/arm/" + hero.sex + "/" + hero.armorarm + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.armorarm = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 腿甲
  if (hero.armorlegs && hero.armorlegs.length) {
    var path = BASE + "/armor/legs/" + hero.sex + "/" + hero.armorlegs + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.armorlegs = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 头盔
  if (hero.armorhelms && hero.armorhelms.length) {
    var path = BASE + "/armor/helms/" + hero.sex + "/" + hero.armorhelms + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.armorhelms = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }

  // 足甲
  if (hero.armorfeet && hero.armorfeet.length) {
    var path = BASE + "/armor/feet/" + hero.sex + "/" + hero.armorfeet + ".png";
    fs.readFile(path, function (err, buf) {
      if (err) return Finish();
      result.armorfeet = "data:image/png;base64," + buf.toString("base64");
      Finish();
    });
  } else {
    Finish();
  }
}

// 用于根据客户端传来的参数，寻找到指定图片并返回
function GenerateHero (req, res) {

  var hero = {
    "sex": req.body.sex,
    "body": req.body.body,
    "eyes": req.body.eyes,

    "hair": req.body.hair,
    "haircolor": req.body.haircolor,

    "head": req.body.head,
    "shirts": req.body.shirts,
    "pants": req.body.pants,
    "shoes": req.body.shoes,

    "armorchest": req.body.armorchest,
    "armorarm": req.body.armorarm,
    "armorlegs": req.body.armorlegs,
    "armorhelms": req.body.armorhelms,
    "armorfeet": req.body.armorfeet
  };

  if (hero.sex != "male" && hero.sex != "female") {
    return res.json({error: "Invalid Sex"});
  }

  if (typeof hero.body != "string" || hero.body.length <= 0) {
    return res.json({error: "Invalid Body"});
  }

  ReadHero(hero, function (ret) {
    res.json(ret);
  });
} // HeroGenerate

function CreateHero (req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var custom = req.body.custom;

  if (typeof name != "string" || name.length <= 0) {
    return res.json({error: "Invalid Name"});
  }

  if (typeof password != "string" || password.length <= 0) {
    return res.json({error: "Invalid Password"});
  }

  if (typeof custom != "string" || custom.length <= 0) {
    return res.json({error: "Invalid Custom"});
  }

  try {
    custom = JSON.parse(custom);
  } catch (err) {
    return res.json({error: "Invalid Custom Parse"})
  }

  herodb.find({"name": name}, function (err, docs) {
    if (err) {
      console.log("CreateHero", err);
    }

    if (docs.length > 0) {
      res.json({error: "Name Exists"});
    } else {
      herodb.insert([{
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
        "type": "hero",
        "spells": [ // 招式，魔法
          "spell0001" // 普通攻击
        ],
        "skill": { // 技能，例如生活技能
        }
      }], function (err, newDocs) {
        if (err) {
          console.log(err);
          return res.json({error: "System Error"});
        }
        var hero = newDocs[0];
        res.json({session: CreateSession(hero)});
      });
    }
  });
}

function LoginHero (req, res) {
  var name = req.body.name;
  var password = req.body.password;

  if (typeof name != "string" || name.length <= 0) {
    return res.json({error: "Invalid Name"});
  }

  herodb.find({"name": name}, function (err, docs) {
    if (err) {
      console.log("GetHero", err);
    }
    if (docs.length <= 0) {
      res.json({error: "No Hero Found"});
    } else {
      var hero = docs[0];

      if (hero.password != password) {
        res.json({error: "Invalid Password"});
      } else {
        res.json({session: CreateSession(hero)});
      }
    }
  });
}

function GetHero (req, res) {
  var session = req.body.session;
  var obj = GetSession(session);
  if (obj) {
    ReadHero(obj.hero.custom, function (ret) {
      obj.hero.images = ret;
      obj.hero.spellData = spell.get(obj.hero.spells);
      res.json({hero: obj.hero});

      area.add(obj.hero);
    });
  } else {
    res.json({error: "Invalid Session"})
  }
}

exports.generate = GenerateHero;
exports.create = CreateHero;
exports.login = LoginHero;
exports.get = GetHero;
