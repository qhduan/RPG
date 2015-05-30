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

var SocketModule = require("./socket");

var HeroModule = require("./hero");
var SpellModule = require("./spell");
var ActorModule = require("./actor");
var AreaModule = require("./area");

var HERO_SOCKET = {};
var SOCKET_HERO = {};
//var heroId = SOCKET_HERO[socket.id];


SocketModule.on("hit", function (socket, data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;
  TestDamage(socket, heroId, data.spellId, data.actorIds);
});

SocketModule.on("updateHero", function (socket, data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;
  HeroModule.update(heroId, data.object);
});

// 某个用户断开链接
SocketModule.on("disconnect", function (socket, data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;

  var heroObj = HeroModule.get(heroId);

  AreaModule.remove(heroObj.area, heroId);

  delete SOCKET_HERO[socket.id];
  delete HERO_SOCKET[heroId];

  for (var key in HERO_SOCKET) {
    if (HeroModule.get(key).area == heroObj.area) {
      HERO_SOCKET[key].emit("removeHero", {
        id: heroId
      });
    }
  }
});

// 聊天消息
SocketModule.on("message", function (data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;

  var heroObj = HeroModule.get(heroId);

  for (var key in HERO_SOCKET) {
    if (HeroModule.get(key).area == heroObj.area) {
      HERO_SOCKET[key].emit("message", data);
    }
  }
});

// 玩家行走
SocketModule.on("move", function (socket, data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;

  var heroObj = HeroModule.get(heroId);
  heroObj.x = data.x;
  heroObj.y = data.y;

  for (var key in HERO_SOCKET) {
    var h = HeroModule.get(key);
    if (h.id != heroObj.id) {
      HERO_SOCKET[key].emit("move", {
        id: heroObj.id,
        data: data
      });
    }
  }
});

// 玩家攻击
SocketModule.on("attack", function (socket, data) {
  var heroId = SOCKET_HERO[socket.id];
  if (!heroId) return;

  var heroObj = HeroModule.get(heroId);

  for (var key in HERO_SOCKET) {
    var h = HeroModule.get(key);
    if (h.id != heroObj.id) {
      HERO_SOCKET[key].emit("attack", {
        id: heroObj.id,
        data: data
      });
    }
  }
});



// 测试用户heroId以spellId攻击中了actorIds，如果成功，则返回actorIds中对应actor所应受到的伤害
function TestDamage (socket, heroId, spellId, actorIds) {
  var heroObj = HeroModule.get(heroId);
  var spellObj = SpellModule.get(spellId);

  var damage = 0;

  if (spellObj.type == "normal") {
    damage = spellObj.attack + heroObj.attack;
  }
  if (spellObj.type == "magic") {
    damage = spellObj.attack + heroObj.magicAttack;
  }

  var ret = {};

  var actors = AreaModule.get(heroObj.area).actors;

  // 计算actorIds中的列出的actor的可能的伤害
  actorIds.forEach(function (element) {
    if (actors[element]) {
      actors[element].hitpoint -= damage;
      ret[element] = damage;

      if (actors[element].hitpoint <= 0) {
        delete actors[element];
      }
    }
  });

  for (var key in HERO_SOCKET) {
    if (HeroModule.get(key).area == heroObj.area) {
      HERO_SOCKET[key].emit("damage", ret);
    }
  }
}











function GetArea (sock) {
  var id = sock.data.id;

  if (typeof id != "string") {
    return sock.send({error: "GetArea Invalid Argument"});
  }

  var areaData = AreaModule.get(id);

  if (areaData) {
    var resources = {};
    for (var key in areaData.resources) {
      resources[key] = areaData.resources[key];
    }

    // 因为一个区域的heros是动态的，所以动态的加载已有的英雄的资源（包括玩家自己英雄的资源）
    for (var key in areaData.heros) {
      var heroData = areaData.heros[key];

      // 统计英雄的技能相关图片
      for (var key in heroData.spells) {
        var spellData = heroData.spells[key];

        resources[spellData.image] = "image";
        resources[spellData.icon] = "image";
        resources[spellData.sound] = "sound";
      }

      // 统计英雄的物品图片
      for (var key in heroData.items) {
        var itemData = heroData.items[key];
        if (itemData)
          resources[itemData.image] = "image";
      }

      // 统计英雄的装备图片
      for (var key in heroData.equipment) {
        var equipmentData = heroData.equipment[key];
        if (equipmentData) {
          resources[equipmentData.image] = "image";
        }
      }

    }

    sock.send({
      map: areaData.map,
      heros: areaData.heros,
      actors: areaData.actors,
      items: areaData.items,
      drops: areaData.drops,
      resources: resources
    });
  } else {
    sock.send({error: "Area Not Found"});
  }
}

SocketModule.reg("/area/get", GetArea);



function Login (sock) {
  var name = sock.data.name;
  var password = sock.data.password;

  if (typeof name != "string" || name.length <= 0)
    return sock.send({error: "Invalid Name"});

  if (typeof password != "string" || password.length <= 0)
    return sock.send({error: "Invalid Password"});

  HeroModule.db.findOne({"name": name, "password": password}, function (err, doc) {
    if (err) {
      console.log("Login", err);
      sock.send({error: "Server Error"});
    }

    if (doc) {
      AreaModule.add(doc.area, doc.id);
      var heroObj = HeroModule.get(doc.id);

      for (var key in HERO_SOCKET) {
        if (HeroModule.get(key).area == heroObj.area) {
          HERO_SOCKET[key].emit("addHero", {
            hero: heroObj
          });
        }
      }

      HERO_SOCKET[doc.id] = sock.socket;
      SOCKET_HERO[sock.socket.id] = doc.id;


      sock.send({success: {
        heroId: doc.id,
        areaId: doc.area
      }});
    } else {
      sock.send({error: "Invalid Name or Password"});
    }

  });

}

SocketModule.reg("/login", Login);



// 用于根据客户端传来的参数，寻找到指定图片的相应地址
function GenerateHero (sock) {

  var heroCustom = {
    "sex": sock.data.sex,
    "body": sock.data.body,
    "eyes": sock.data.eyes,

    "hair": sock.data.hair,
    "haircolor": sock.data.haircolor,

    "head": sock.data.head,
    "shirts": sock.data.shirts,
    "pants": sock.data.pants,
    "shoes": sock.data.shoes,

    "armorchest": sock.data.armorchest,
    "armorarm": sock.data.armorarm,
    "armorlegs": sock.data.armorlegs,
    "armorhelms": sock.data.armorhelms,
    "armorfeet": sock.data.armorfeet
  };

  if (heroCustom.sex != "male" && heroCustom.sex != "female") {
    return sock.send({error: "Invalid Sex"});
  }

  if (typeof heroCustom.body != "string" || heroCustom.body.length <= 0) {
    return sock.send({error: "Invalid Body"});
  }

  var BASE = "/hero";
  var ret = {};
  // 身体
  if (heroCustom.body && heroCustom.body.length)
    ret.body = BASE + "/body/" + heroCustom.sex + "/" + heroCustom.body + ".png";
  // 眼睛
  if (heroCustom.eyes && heroCustom.eyes.length)
    ret.eyes = BASE + "/body/" + heroCustom.sex + "/eyes/" + heroCustom.eyes + ".png";
  // 头发 & 头发颜色
  if (heroCustom.hair && heroCustom.hair.length && heroCustom.haircolor && heroCustom.haircolor.length)
    ret.hair = BASE + "/hair/" + heroCustom.sex + "/" + heroCustom.hair + "/" + heroCustom.haircolor + ".png";
  // 帽子（头盔）
  if (heroCustom.head && heroCustom.head.length)
    ret.head = BASE + "/head/" + heroCustom.sex + "/" + heroCustom.head + ".png";
  // 衬衫
  if (heroCustom.shirts && heroCustom.shirts.length)
    ret.shirts = BASE + "/shirts/" + heroCustom.sex + "/" + heroCustom.shirts + ".png";
  // 裤子
  if (heroCustom.pants && heroCustom.pants.length)
    ret.pants = BASE + "/pants/" + heroCustom.sex + "/" + heroCustom.pants + ".png";
  // 鞋
  if (heroCustom.shoes && heroCustom.shoes.length)
    ret.shoes = BASE + "/shoes/" + heroCustom.sex + "/" + heroCustom.shoes + ".png";
  // 胸甲
  if (heroCustom.armorchest && heroCustom.armorchest.length)
    ret.armorchest = BASE + "/armor/chest/" + heroCustom.sex + "/" + heroCustom.armorchest + ".png";
  // 臂甲
  if (heroCustom.armorarm && heroCustom.armorarm.length)
    ret.armorarm = BASE + "/armor/arm/" + heroCustom.sex + "/" + heroCustom.armorarm + ".png";
  // 腿甲
  if (heroCustom.armorlegs && heroCustom.armorlegs.length)
    ret.armorlegs = BASE + "/armor/legs/" + heroCustom.sex + "/" + heroCustom.armorlegs + ".png";
  // 头盔
  if (heroCustom.armorhelms && heroCustom.armorhelms.length)
    ret.armorhelms = BASE + "/armor/helms/" + heroCustom.sex + "/" + heroCustom.armorhelms + ".png";
  // 足甲
  if (heroCustom.armorfeet && heroCustom.armorfeet.length)
    ret.armorfeet = BASE + "/armor/feet/" + heroCustom.sex + "/" + heroCustom.armorfeet + ".png";

  ret.weapons = BASE + "/weapons/" + heroCustom.sex + "/weapons.png";

  sock.send(ret);
} // GenerateHero


SocketModule.reg("/hero/generate", GenerateHero);



function CreateHero (sock) {
  var name = sock.data.name;
  var password = sock.data.password;
  var custom = sock.data.custom;

  if (typeof name != "string" || name.length <= 0) {
    return sock.send({error: "Invalid Name"});
  }

  if (typeof password != "string" || password.length <= 0) {
    return sock.send({error: "Invalid Password"});
  }

  if (typeof custom != "object") {
    return sock.send({error: "Invalid Custom"});
  }

  if (!custom.body || !custom.sex) {
    return sock.send({error: "Invalid Custom"});
  }

  HeroModule.db.findOne({"name": name}, function (err, doc) {
    if (err) {
      console.log("CreateHero", err);
      sock.send({error: "System Error"});
      return;
    }

    if (doc) {
      sock.send({error: "Name Conflict"});
    } else {
      HeroModule.db.insert([{
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
        "attack": 10, // 攻击力
        "defense": 10, // 防御力
        "magicAttack": 10, // 魔法攻击
        "magicDefense": 10, // 魔法防御

        "area": "town0001", // 当前所在地图
        "type": "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

        "spells": [ // 招式，魔法
          "spell0001", // 普通剑攻击
          "spell0002", // 普通枪攻击
          "spell0003", // 普通弓攻击
          "spell0004" // 火球术
        ],

        "spellcount": 14, // 一共能学习多少招式

        "spellbar": [ // 技能快捷方式列表
          "spell0001"
        ],

        "skill": { // 技能，例如生活技能，说服技能，交易技能
        },

        "equipment": {
          "head": null,
          "neck": null,
          "body": "item0005",
          "feet": "item0006",
          "righthand": "item0002",
          "lefthand": null,
          "leftring": null,
          "rightring": null
        },

        "items": [
          "item0003",
          "item0004"
        ],
        "gold": 0
      }], function (err, newDocs) {
        if (err) {
          console.log(err);
          return sock.send({error: "System Error"});
        }
        var heroData = newDocs[0];
        HeroModule.add(heroData);
        sock.send({success: "ok"});
      });
    }
  });
}

SocketModule.reg("/hero/create", CreateHero);