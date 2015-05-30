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

(function () {
  "use strict";

  document.getElementById("registerBox").innerHTML = "\n    <h4>预览：</h4>\n    <canvas id=\"preview\" width=\"256\" height=\"64\"></canvas>\n\n    <table>\n      <tr>\n        <td>\n          <div>\n            <span class=\"ui button\">\n            Sex\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"sex\" class=\"\">\n              <option value=\"male\">Male</option>\n              <option value=\"female\">Female</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Body\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"body\" class=\"\">\n              <option value=\"light\">Light</option>\n              <option value=\"dark\">Dark</option>\n              <option value=\"dark2\">Dark 2</option>\n              <option value=\"tanned\">Tanned</option>\n              <option value=\"tanned2\">Tanned 2</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Eyes\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"eyes\" class=\"\">\n              <option value=\"blue\">Blue</option>\n              <option value=\"brown\">Brown</option>\n              <option value=\"gray\">Gray</option>\n              <option value=\"green\">Green</option>\n              <option value=\"orange\">Orange</option>\n              <option value=\"purple\">Purple</option>\n              <option value=\"red\">Red</option>\n              <option value=\"yellow\">Yellow</option>\n            </select>\n          </div>\n        </td><!--左上-->\n        <td>\n\n          <div id=\"customMaleHair\">\n            <span class=\"ui button\">\n            Hair Style\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"hair\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"bedhead\">Bedhead</option>\n              <option value=\"long\">Long</option>\n              <option value=\"longhawk\">Longhawk</option>\n              <option value=\"messy1\">Messy1</option>\n              <option value=\"messy2\">Messy2</option>\n              <option value=\"mohawk\">Mohawk</option>\n              <option value=\"page\">Page</option>\n              <option value=\"parted\">Parted</option>\n              <option value=\"plain\">Plain</option>\n              <option value=\"shorthawk\">Shorthawk</option>\n            </select>\n          </div>\n\n          <div id=\"customFemaleHair\" style=\"display: none;\">\n            <span class=\"ui button\">\n            Hair Style\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"hair\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"bangs\">bangs</option>\n              <option value=\"bangslong\">bangslong</option>\n              <option value=\"bangslong2\">bangslong2</option>\n              <option value=\"bunches\">bunches</option>\n              <option value=\"loose\">loose</option>\n              <option value=\"pixie\">pixie</option>\n              <option value=\"ponytail\">ponytail</option>\n              <option value=\"ponytail2\">ponytail2</option>\n              <option value=\"princess\">princess</option>\n              <option value=\"shoulderl\">shoulderl</option>\n              <option value=\"shoulderr\">shoulderr</option>\n              <option value=\"swoop\">swoop</option>\n              <option value=\"unkempt\">unkempt</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Hair Color\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"haircolor\" class=\"\">\n              <option value=\"black\">Black</option>\n              <option value=\"blonde\">Blonde</option>\n              <option value=\"blonde2\">blonde2</option>\n              <option value=\"blue\">blue</option>\n              <option value=\"blue2\">blue2</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"brown2\">brown2</option>\n              <option value=\"brunette\">brunette</option>\n              <option value=\"brunette2\">brunette2</option>\n              <option value=\"dark-blonde\">dark-blonde</option>\n              <option value=\"gold\">gold</option>\n              <option value=\"gray\">gray</option>\n              <option value=\"gray2\">gray2</option>\n              <option value=\"green\">green</option>\n              <option value=\"green2\">green2</option>\n              <option value=\"light-blonde\">light-blonde</option>\n              <option value=\"light-blonde2\">light-blonde2</option>\n              <option value=\"pink\">pink</option>\n              <option value=\"pink2\">pink2</option>\n              <option value=\"purple\">purple</option>\n              <option value=\"raven\">raven</option>\n              <option value=\"raven2\">raven2</option>\n              <option value=\"redhead\">redhead</option>\n              <option value=\"redhead2\">redhead2</option>\n              <option value=\"ruby-red\">ruby-red</option>\n              <option value=\"white\">white</option>\n              <option value=\"white-blonde\">white-blonde</option>\n              <option value=\"white-blonde2\">white-blonde2</option>\n              <option value=\"white-cyan\">white-cyan</option>\n            </select>\n          </div>\n        </td><!--右上-->\n      </tr>\n      <tr>\n        <td>\n          <div>\n            <span class=\"ui button\">\n            Head\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"head\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"chainhat\">chainhat</option>\n              <option value=\"chain_hood\">chain_hood</option>\n              <option value=\"cloth_hood\">cloth_hood</option>\n              <option value=\"leather_cap\">leather_cap</option>\n              <option value=\"red\">red</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Shirts\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"shirts\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"maroon\">maroon</option>\n              <option value=\"teal\">teal</option>\n              <option value=\"white\">white</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Pants\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"pants\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"magenta\">magenta</option>\n              <option value=\"red\">red</option>\n              <option value=\"teal\">teal</option>\n              <option value=\"white\">white</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Shoes\n            </span>\n            <select onchange=\"SelectHero(event)\"  data-type=\"shoes\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"black\">black</option>\n              <option value=\"brown\">brown</option>\n              <option value=\"maroon\">maroon</option>\n            </select>\n          </div>\n        </td><!--左下-->\n        <td>\n\n          <div>\n            <span class=\"ui button\">\n            Armor Helms\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorhelms\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"golden\">golden</option>\n              <option value=\"metal\">metal</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Armor Chest\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorchest\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"golden\">golden</option>\n              <option value=\"metal\">metal</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Armor Arm\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorarm\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"golden\">golden</option>\n              <option value=\"metal\">metal</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Armor Legs\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorlegs\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"golden\">golden</option>\n              <option value=\"metal\">metal</option>\n            </select>\n          </div>\n\n          <div>\n            <span class=\"ui button\">\n            Armor Feet\n            </span>\n            <select onchange=\"SelectHero(event)\" data-type=\"armorfeet\" class=\"\">\n              <option value=\"\">None</option>\n              <option value=\"golden\">golden</option>\n              <option value=\"metal\">metal</option>\n            </select>\n          </div>\n\n        </td><!--右上-->\n      </tr>\n    </table>\n\n    <br>\n    <input id=\"regName\" placeholder=\"角色名\" type=\"text\">\n    <br>\n    <input id=\"regPassword\" placeholder=\"密码\" type=\"password\">\n    <br>\n    <input id=\"regRepeat\" placeholder=\"密码确认\" type=\"password\">\n    <br>\n    <button onclick=\"RegSubmit()\" class=\"button\" type=\"button\">注册</button>\n    <button onclick=\"ReturnLogin()\" class=\"button\" type=\"button\">返回</button>\n  ";

  var loginBox = document.getElementById("loginBox");
  var registerBox = document.getElementById("registerBox");

  // 注册模块
  window.Register = function () {
    loginBox.style.display = "none";
    registerBox.style.display = "block";
    Init();
  };

  window.ReturnLogin = function () {
    loginBox.style.display = "block";
    registerBox.style.display = "none";
  };

  window.RegSubmit = function () {
    var name = document.getElementById("regName").value;
    var password = document.getElementById("regPassword").value;
    var repeat = document.getElementById("regRepeat").value;

    if (name.trim().length <= 0) {
      alert("Invalid Name");
      return;
    }

    if (password.trim().length <= 0) {
      alert("Invalid Password");
      return;
    }

    if (password != repeat) {
      alert("Passwor Different from Repeat");
      return;
    }

    Game.io.get("/hero/create", {
      name: name,
      password: password,
      custom: heroCustom
    }, function (data) {
      if (data.success) {
        ReturnLogin();
      } else {
        alert(data.error || "Unknown Error");
      }
    });
  };

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

    var heroDisplay = new createjs.Stage("preview");
    DisplayHero();

    function DisplayHero() {
      Game.drawHero(heroCustom, function (img) {
        heroDisplay.removeAllChildren();

        var sheet = new createjs.SpriteSheet({
          images: [img],
          frames: {
            width: heroCustom.tilewidth,
            height: heroCustom.tileheight
          },
          animations: {
            faceup: 104,
            faceleft: 117,
            facedown: 130,
            faceright: 143
          }
        });

        function SheetComplete() {
          var spriteDown = new createjs.Sprite(sheet, "facedown");
          spriteDown.x = 0;
          spriteDown.y = 0;
          var spriteLeft = new createjs.Sprite(sheet, "faceleft");
          spriteLeft.x = 64;
          spriteLeft.y = 0;
          var spriteRight = new createjs.Sprite(sheet, "faceright");
          spriteRight.x = 128;
          spriteRight.y = 0;
          var spriteUp = new createjs.Sprite(sheet, "faceup");
          spriteUp.x = 192;
          spriteUp.y = 0;
          heroDisplay.addChild(spriteDown);
          heroDisplay.addChild(spriteLeft);
          heroDisplay.addChild(spriteRight);
          heroDisplay.addChild(spriteUp);
          heroDisplay.update();
        }

        if (sheet.complete) {
          SheetComplete();
        } else {
          sheet.on("complete", SheetComplete);
        }
      });
    }
  };
})();
//# sourceMappingURL=register.js.map