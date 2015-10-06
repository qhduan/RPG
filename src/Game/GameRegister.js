/*

A-RPG Game, Built using JavaScript ES6
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

(function () {
  "use strict";

  // 英雄组件数据
  let heroCustom = {
    sex: "male",
    body: "light",
    eyes: "blue",
    hair: "",
    haircolor: "black",

    head: "",
    shirts: "",
    pants: "",
    shoes: "",

    armorchest: "",
    armorarm: "",
    armorlegs: "",
    armorhelms: "",
    armorfeet: ""
  };

  // 13x21
  heroCustom.width = 64 * 13; // 832;
  heroCustom.height = 64 * 21; // 1344;
  heroCustom.width *= 0.8125;
  heroCustom.height *= 0.9375;
  heroCustom.tilewidth = heroCustom.width / 13; // 52
  heroCustom.tileheight = heroCustom.height / 21; // 60

  function Init () {

    window.SelectHero = function (event) {
      let value = event.target.value;
      let type = event.target.getAttribute("data-type");
      if (heroCustom[type] != value) {
        if (type == "sex") {
          heroCustom.hair = "";
        }
        heroCustom[type] = value;
        DisplayHero();
      }
      if (heroCustom.sex == "male") {
        document.getElementById("customMaleHair").style.display = "block";
        document.getElementById("customFemaleHair").style.display = "none";
      } else {
        document.getElementById("customMaleHair").style.display = "none";
        document.getElementById("customFemaleHair").style.display = "block";
      }
    };

    DisplayHero();

    function DisplayHero () {

      let canvas = document.getElementById("registerPreview");
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      document.getElementById("loading").innerHTML = "正在载入预览";
      Game.drawHero(heroCustom).then(function (images) {
        let img = images[0];
        context.drawImage(img, 0, 0, img.width, img.height);
        document.getElementById("loading").innerHTML = "预览";
      });
    }

  }

  Game.assign("register", class GameRegister {

    // 注册模块
    static reg () {
      document.getElementById("registerHeroName").value = "";
      Game.windows.register.show();
      Init();
    }

    static back () {
      Game.windows.main.show();
    }

    static submit () {
      let name = document.getElementById("registerHeroName").value;

      if (name.trim().length <= 0) {
        alert("Invalid Name");
        return;
      }

      HeroDefault.id = "hero_" + name;
      HeroDefault.name = name;
      HeroDefault.custom = heroCustom;
      HeroDefault.tilewidth = heroCustom.tilewidth;
      HeroDefault.tileheight = heroCustom.tileheight;

      // 保存一个存档
      Game.Archive.save({
        hero: HeroDefault
      });

      Game.windows.register.hide();

      // 空调用，代表读取最新一个存档（last），即刚刚新建的存档
      Game.Archive.load();
    }

  });


  // 含有$开头的代表是基础值
  // 不含$的同名属性是计算后值，即经过各种加成，buff，nerf之后的值
  let HeroDefault = {
    "level": 1, // 等级
    "exp": 0, // 经验值
    "type": "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

    "class": "", // 职业，不同职业有不同加成

    // 233年2月27日 09时30分
    "time": 233*(60*24*30*12) + 1*(60*24*30) + 26*(60*24) + 9*(60) + 30,

    // 最基本的属性，其他属性都由此延伸
    "$str": 10, // strength 力量： 物理攻击力
    "$dex": 10, // dexterity 敏捷： 闪避，暴击
    "$con": 10, // constitution 耐力： 生命值
    "$int": 10, // intelligence 智力： 精神力，魔法攻击
    "$cha": 10, // charisma 魅力： 队友能力

    // 下面为0的值将由上面的基本属性计算出来

    "str": 0,
    "dex": 0,
    "int": 0,
    "con": 0,
    "cha": 0,

    "$hp": 0, // 生命力
    "$sp": 0, // 精神力

    "critical": 0, // 暴击率
    "dodge": 0, // 闪避

    "hp": 0,
    "sp": 0,

    "$atk": 0, // 攻击
    "$def": 0, // 防御
    "$matk": 0, // 魔法攻击
    "$mdef": 0, // 魔法防御

    "atk": 0,
    "def": 0,
    "matk": 0,
    "mdef": 0,

    "buff": [], // 有益状态
    "nerf": [], // 有害状态

    "currentQuest": [ /* 当前任务 */ ],
    "completeQuest": [ /* 完成了的任务 */ ],

    // 初始位置
    "area": "fystone", // 地图id
    "x": 54,
    "y": 58,


    "centerX": 26,
    "centerY": 55,
    "hitArea": [[0, 0]],

    // 能力
    "skills": [
      "fist.l1",
      "sword.l1", // 剑攻击Level1
      "spear.l1", // 枪攻击Level1
      "bow.l1", // 弓攻击Level1
      "fire.l1", // 火球术Level1
    ],

    // 技能快捷方式列表
    "bar": [
      {
        "id": "sword.l1",
        "type": "skill"
      },
      {
        "id": "bow.l1",
        "type": "skill"
      },
      null,
      null,
      null,
      null,
      null,
      {
        "id": "potion.healWeak",
        "type": "item"
      }
    ],

    // 技能，例如生活技能，说服技能，交易技能
    //skills: {
    //  _trade: 0, // 交易，交易时的价格
    //  _negotiate: 0, // 交涉，具体剧情，招揽同伴时的费用
    //  _lock: 0, // 开锁
    //  _knowledge: 0, // 知识，具体剧情，鉴定物品
    //  _treatment: 0, // 医疗，在使用医疗物品时的效果
    //  _animal: 0, // 动物战斗加成，动物驯养
    //},

    "equipment": {
      "head": null,
      "body": "cloth.normal",
      "feet": "shoes.normal",
      "weapon": "sword.iron",
      "neck": null,
      "ring": null
    },

    "items": {
      "sword.iron": 1,
      "spear.iron": 1,
      "bow.wood": 1 ,
      "cloth.normal": 1,
      "shoes.normal": 1,
      "potion.healWeak": 5,
      "book.gameAdventure": 1,
      "book.elliorwisHistory": 1
    },

    "gold": 0,

    "animations": {

      "spellcastup": [0, 6, "", 40],
      "spellcastleft": [13, 19, "", 40],
      "spellcastdown": [26, 32, "", 40],
      "spellcastright": [39, 45, "", 40],

      "walkup": [104, 112, "walkup", 70],
      "walkleft": [117, 125, "walkleft", 70],
      "walkdown": [130, 138, "walkdown", 70],
      "walkright": [143, 151, "walkright", 70],

      "meleeup": [156, 161, "", 40],
      "meleeleft": [169, 174, "", 40],
      "meleedown": [182, 187, "", 40],
      "meleeright": [195, 200, "", 40],

      // 273+是一张图的总数，hero一共两张图，第一张图没武器，第二张图有武器，所以以下动作在第二张图

      "thrustup": [273+52, 273+59, "", 40],
      "thrustleft": [273+65, 273+72, "", 40],
      "thrustdown": [273+78, 273+85, "", 40],
      "thrustright": [273+91, 273+98, "", 40],

      "runup": [273+105, 273+112, "runup", 30],
      "runleft": [273+118, 273+125, "runleft", 30],
      "rundown": [273+131, 273+138, "rundown", 30],
      "runright": [273+144, 273+151, "runright", 30],

      "slashup": [273+156, 273+161, "", 40],
      "slashleft": [273+169, 273+174, "", 40],
      "slashdown": [273+182, 273+187, "", 40],
      "slashright": [273+195, 273+200, "", 40],

      "shootup": [273+208, 273+220, "", 40],
      "shootleft": [273+221, 273+233, "", 40],
      "shootdown": [273+234, 273+246, "", 40],
      "shootright": [273+247, 273+259, "", 40],

      "hurt": [260, 265, "", 60],

      "dead": 265,

      "faceup": 104,
      "faceleft": 117,
      "facedown": 130,
      "faceright": 143
    }
  };


})();
