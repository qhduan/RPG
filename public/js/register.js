/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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
      if (heroCustom.sex == "male") {
        document.getElementById("customMaleHair").style.display = "block";
        document.getElementById("customFemaleHair").style.display = "none";
      } else {
        document.getElementById("customMaleHair").style.display = "none";
        document.getElementById("customFemaleHair").style.display = "block";
      }
      var value = event.target.value;
      var type = event.target.getAttribute("data-type");
      if (heroCustom[type] != value) {
        heroCustom[type] = value;
        DisplayHero();
      }
    };

    DisplayHero();

    function DisplayHero() {

      var canvas = document.getElementById("registerPreview");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      document.getElementById("loading").innerHTML = "正在载入预览";
      Game.drawHero(heroCustom, function (img) {
        context.drawImage(img, 0, -128, img.width, img.height);
        document.getElementById("loading").innerHTML = "预览";
      });
    }
  }

  // 注册模块
  Game.register.reg = function () {
    document.getElementById("registerHeroName").value = "";
    window.ShowGameWindow("registerWindow");
    Init();
  };

  Game.register.back = function () {
    window.ShowGameWindow("mainWindow");
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

    // 空调用，代表读取最新一个存档（last），即刚刚新建的存档
    Game.archive.load();
  };

  var HeroDefault = {
    level: 1, // 等级
    exp: 0, // 经验值

    // 最基本的属性，其他属性都由此延伸
    $str: 10, // strength 攻击
    $dex: 10, // dexterity 闪避
    $int: 10, // intelligence 魔法攻击
    $con: 10, // constitution 生命值
    $cha: 10, // charisma 队友能力

    str: 10,
    dex: 10,
    int: 10,
    con: 10,
    cha: 10,

    $hp: 1, // 生命力
    $sp: 1, // 精神力

    hp: 1,
    sp: 1,

    atk: 1, // 攻击
    def: 1, // 防御
    matk: 1, // 魔法攻击
    mdef: 1, // 魔法防御

    buff: [], // 有益状态
    nerf: [], // 有害状态

    currentQuest: {}, // 当前任务
    pastQuest: {}, // 完成的任务

    area: "town0001", // 当前所在地图

    type: "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

    // 能力
    skills: ["spell0001", // 普通剑攻击
    "spell0002", // 普通枪攻击
    "spell0003", // 普通弓攻击
    "spell0004"],
    // 火球术
    // 一共能学习多少能力
    spellcount: 14,
    // 技能快捷方式列表
    spellbar: ["spell0001"],

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
      neck: null,
      body: "item0005",
      feet: "item0006",
      righthand: "item0002",
      lefthand: null,
      leftring: null,
      rightring: null
    },

    items: [{ id: "item0003", count: 1 }, { id: "item0004", count: 1 }],

    gold: 0,

    animations: {
      spellcastup: [0, 6, "", 800],
      spellcastleft: [13, 19, "", 800],
      spellcastdown: [26, 32, "", 800],
      spellcastright: [39, 45, "", 800],

      thrustup: [52, 59, "", 800],
      thrustleft: [65, 72, "", 800],
      thrustdown: [78, 85, "", 800],
      thrustright: [91, 98, "", 800],

      walkup: [104, 112, "walkup", 500],
      walkleft: [117, 125, "walkleft", 500],
      walkdown: [130, 138, "walkdown", 500],
      walkright: [143, 151, "walkright", 500],

      runup: [104, 112, "runup", 300],
      runleft: [117, 125, "runleft", 300],
      rundown: [130, 138, "rundown", 300],
      runright: [143, 151, "runright", 300],

      slashup: [156, 161, "", 800],
      slashleft: [169, 174, "", 800],
      slashdown: [182, 187, "", 800],
      slashright: [195, 200, "", 800],

      shootup: [208, 220, "", 800],
      shootleft: [221, 233, "", 800],
      shootdown: [234, 246, "", 800],
      shootright: [247, 259, "", 800],

      hurt: [260, 265, "", 0.3],

      dead: 265,

      faceup: 104,
      faceleft: 117,
      facedown: 130,
      faceright: 143
    }
  };
})();
//# sourceMappingURL=register.js.map
