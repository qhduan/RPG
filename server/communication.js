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

function Init (app) {
  app.post("/area/get", GetArea);
  app.post("/hero/generate", GenerateHero);
  app.post("/hero/create", CreateHero);
}


function GetArea (req, res) {
  var id = req.body.id;

  if (typeof id != "string") {
    return res.json({error: "GetArea Invalid Argument"});
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
        if (heroData.items[key]) {
          var itemData = heroData.items[key].item;
          resources[itemData.image] = "image";
        }
      }

      // 统计英雄的装备图片
      for (var key in heroData.equipment) {
        var equipmentData = heroData.equipment[key];
        if (equipmentData) {
          resources[equipmentData.image] = "image";
        }
      }

    }

    res.json({
      map: areaData.map,
      heros: areaData.heros,
      actors: areaData.actors,
      items: areaData.items,
      drops: areaData.drops,
      resources: resources
    });
  } else {
    res.json({error: "Area Not Found"});
  }
}




// 用于根据客户端传来的参数，寻找到指定图片的相应地址
function GenerateHero (req, res) {

  var heroCustom = {
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

  if (heroCustom.sex != "male" && heroCustom.sex != "female") {
    return res.json({error: "Invalid Sex"});
  }

  if (typeof heroCustom.body != "string" || heroCustom.body.length <= 0) {
    return res.json({error: "Invalid Body"});
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

  res.json(ret);
} // GenerateHero



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

  if (typeof custom != "object") {
    return res.json({error: "Invalid Custom"});
  }

  if (!custom.body || !custom.sex) {
    return res.json({error: "Invalid Custom"});
  }

  HeroModule.db.findOne({"name": name}, function (err, doc) {
    if (err) {
      console.log("CreateHero", err);
      res.json({error: "System Error"});
      return;
    }

    if (doc) {
      res.json({error: "Name Conflict"});
    } else {
      HeroModule.db.insert([{
        "id": "hero_" + name,
        "name": name,
        "password": password,
        "custom": custom, // 保存用户纸娃娃的配置

        "level": 1, // 等级
        "exp": 0, // 经验值

        // 最基本的属性，其他属性都由此延伸
        "_str": 10, // strength 攻击
        "_dex": 10, // dexterity 闪避
        "_int": 10, // intelligence 魔法攻击
        "_con": 10, // constitution 生命值
        "_cha": 10, // charisma 队友能力

        buff: [],
        nerf: [],

        "currentQuest": { }, // 当前任务
        "pastQuest": { }, // 完成的任务

        "area": "town0001", // 当前所在地图

        "type": "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

        // 能力
        "spells": [
          "spell0001", // 普通剑攻击
          "spell0002", // 普通枪攻击
          "spell0003", // 普通弓攻击
          "spell0004", // 火球术
        ],
        // 一共能学习多少能力
        "spellcount": 14,
        // 技能快捷方式列表
        "spellbar": [
          "spell0001",
        ],

        // 技能，例如生活技能，说服技能，交易技能
        "skills": {
          "_trade": 0, // 交易，交易时的价格
          "_negotiate": 0, // 交涉，具体剧情，招揽同伴时的费用
          "_lock": 0, // 开锁
          "_knowledge": 0, // 知识，具体剧情，鉴定物品
          "_treatment": 0, // 医疗，在使用医疗物品时的效果
          "_animal": 0, // 动物战斗加成，动物驯养
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
          { id: "item0003", count: 1 },
          { id: "item0004", count: 1 },
        ],
        "gold": 0
      }], function (err, newDocs) {
        if (err) {
          console.log(err);
          return res.json({error: "System Error"});
        }
        var heroData = newDocs[0];
        HeroModule.add(heroData);
        res.json({success: "ok"});
      });
    }
  });
}

exports.init = Init;
