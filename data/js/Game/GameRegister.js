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

"use strict";

(function () {
  "use strict";

  Game.register = {};

  // 英雄组件数据
  var heroCustom = {
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
  heroCustom.tilewidth = heroCustom.width / 13;
  heroCustom.tileheight = heroCustom.height / 21;

  Init();

  function Init() {

    window.SelectHero = function (event) {
      var value = event.target.value;
      var type = event.target.getAttribute("data-type");
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

    function DisplayHero() {

      var canvas = document.getElementById("registerPreview");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      document.getElementById("loading").innerHTML = "正在载入预览";
      Game.drawHero(heroCustom, function (img) {
        context.drawImage(img, 0, 0, img.width, img.height);
        document.getElementById("loading").innerHTML = "预览";
      });
    }
  }

  // 注册模块
  Game.register.reg = function () {
    document.getElementById("registerHeroName").value = "";
    Game.windows.register.show();
    Init();
  };

  Game.register.back = function () {
    Game.windows.main.show();
  };

  Game.register.submit = function () {
    var name = document.getElementById("registerHeroName").value;

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
    Game.archive.save({
      hero: HeroDefault
    });

    Game.windows.register.hide();

    // 空调用，代表读取最新一个存档（last），即刚刚新建的存档
    Game.archive.load();
  };

  // 含有$开头的代表是基础值
  // 不含$的同名属性是计算后值，即经过各种加成，buff，nerf之后的值
  var HeroDefault = {
    level: 1, // 等级
    exp: 0, // 经验值
    // 337年6月4日 9时25分
    time: 336 * (60 * 24 * 30 * 12) + 5 * (60 * 24 * 30) + 3 * (60 * 24) + 9 * 60 + 25,

    // 最基本的属性，其他属性都由此延伸
    $str: 10, // strength 力量： 物理攻击力
    $dex: 10, // dexterity 敏捷： 闪避，暴击
    $con: 10, // constitution 耐力： 生命值
    $int: 10, // intelligence 智力： 精神力，魔法攻击
    $cha: 10, // charisma 魅力： 队友能力

    // 下面为0的值将由上面的基本属性计算出来

    str: 0,
    dex: 0,
    int: 0,
    con: 0,
    cha: 0,

    $hp: 0, // 生命力
    $sp: 0, // 精神力

    critical: 0, // 暴击率
    doge: 0, // 闪避

    hp: 0,
    sp: 0,

    $atk: 0, // 攻击
    $def: 0, // 防御
    $matk: 0, // 魔法攻击
    $mdef: 0, // 魔法防御

    atk: 0,
    def: 0,
    matk: 0,
    mdef: 0,

    buff: [], // 有益状态
    nerf: [], // 有害状态

    currentQuest: {}, // 当前任务
    pastQuest: {}, // 完成的任务
    area: "starttown", // 当前所在地图， 初始地图为starttown

    type: "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

    // 能力
    skills: ["sword01", // 剑攻击Level1
    "spear01", // 枪攻击Level1
    "bow01", // 弓攻击Level1
    "fire01"],

    // 火球术Level1
    // 一共能学习多少能力
    skillcount: 10,
    // 技能快捷方式列表
    bar: [{
      id: "sword01",
      type: "skill"
    }, {
      id: "bow01",
      type: "skill"
    }, null, null, null, null, null, {
      id: "potionHealWeak",
      type: "item"
    }],

    // 技能，例如生活技能，说服技能，交易技能
    //skills: {
    //  _trade: 0, // 交易，交易时的价格
    //  _negotiate: 0, // 交涉，具体剧情，招揽同伴时的费用
    //  _lock: 0, // 开锁
    //  _knowledge: 0, // 知识，具体剧情，鉴定物品
    //  _treatment: 0, // 医疗，在使用医疗物品时的效果
    //  _animal: 0, // 动物战斗加成，动物驯养
    //},

    equipment: {
      head: null,
      body: "clothNormal",
      feet: "shoesNormal",
      weapon: "swordIron",
      neck: null,
      ring: null
    },

    items: {
      "swordIron": 1,
      "spearIron": 1,
      "bowWood": 1,
      "clothNormal": 1,
      "shoesNormal": 1,
      "potionHealWeak": 5
    },

    gold: 0,

    animations: {
      spellcastup: [0, 6, "", 40],
      spellcastleft: [13, 19, "", 40],
      spellcastdown: [26, 32, "", 40],
      spellcastright: [39, 45, "", 40],

      thrustup: [52, 59, "", 40],
      thrustleft: [65, 72, "", 40],
      thrustdown: [78, 85, "", 40],
      thrustright: [91, 98, "", 40],

      walkup: [104, 112, "walkup", 70],
      walkleft: [117, 125, "walkleft", 70],
      walkdown: [130, 138, "walkdown", 70],
      walkright: [143, 151, "walkright", 70],

      runup: [105, 112, "runup", 30],
      runleft: [118, 125, "runleft", 30],
      rundown: [131, 138, "rundown", 30],
      runright: [144, 151, "runright", 30],

      slashup: [156, 161, "", 40],
      slashleft: [169, 174, "", 40],
      slashdown: [182, 187, "", 40],
      slashright: [195, 200, "", 40],

      shootup: [208, 220, "", 40],
      shootleft: [221, 233, "", 40],
      shootdown: [234, 246, "", 40],
      shootright: [247, 259, "", 40],

      hurt: [260, 265, "", 60],

      dead: 265,

      faceup: 104,
      faceleft: 117,
      facedown: 130,
      faceright: 143
    }
  };
})();