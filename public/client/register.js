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
(function () {
  "use strict";

  var loginBox = document.getElementById("loginBox");
  var registerBox = document.getElementById("registerBox");
  var previewBox = document.getElementById("previewBox");

  // 注册模块
  window.Register = function () {
    loginBox.style.display = "none";
    registerBox.style.display = "block";
    previewBox.style.display = "block";
    Init();
  };

  window.ReturnLogin = function () {
    loginBox.style.display = "block";
    registerBox.style.display = "none";
    previewBox.style.display = "none";
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

  function Init () {

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

    function DisplayHero () {
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

        function SheetComplete () {
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
