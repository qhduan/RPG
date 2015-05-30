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

  // 合并图片
  // 把images中的所有图片按顺序draw到一个canvas上面，然后用canvas.toDataURL返回一张叠好的图片
  function CombineHeroImage(images, address, width, height, callback) {
    var canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
    }

    var img = new Image();
    img.onload = function () {
      callback(img);
    };
    img.src = canvas.toDataURL();
  }

  // 把多张图片合成一张，并返回
  Game.drawHero = function (heroCustom, callback) {
    Game.io.get("/hero/generate", heroCustom, function (ret) {
      var need = [];

      for (var key in ret) {
        if (Game.resources.hasOwnProperty(ret[key]) == false) {
          need.push(ret[key]);
        }
      }

      function ImageComplete() {
        var images = [];

        if (ret.body) images.push(Game.resources[ret.body]);
        if (ret.eyes) images.push(Game.resources[ret.eyes]);
        if (ret.shirts) images.push(Game.resources[ret.shirts]);
        if (ret.pants) images.push(Game.resources[ret.pants]);
        if (ret.shoes) images.push(Game.resources[ret.shoes]);
        if (ret.armorchest) images.push(Game.resources[ret.armorchest]);
        if (ret.armorarm) images.push(Game.resources[ret.armorarm]);
        if (ret.armorlegs) images.push(Game.resources[ret.armorlegs]);
        if (ret.armorfeet) images.push(Game.resources[ret.armorfeet]);
        if (ret.hair) images.push(Game.resources[ret.hair]);
        if (ret.head) images.push(Game.resources[ret.head]);
        if (ret.armorhelms) images.push(Game.resources[ret.armorhelms]);
        if (ret.weapons) images.push(Game.resources[ret.weapons]);

        CombineHeroImage(images, ret, heroCustom.width, heroCustom.height, callback);
      }

      if (need.length) {
        var queue = new createjs.LoadQueue(true);
        queue.on("complete", function () {
          need.forEach(function (element) {
            Game.resources[element] = queue.getResult(element);
          });
          ImageComplete();
        });
        need.forEach(function (element) {
          queue.loadFile({ src: element });
        });
      } else {
        ImageComplete();
      }
    });
  };
})();
//# sourceMappingURL=hero.js.map