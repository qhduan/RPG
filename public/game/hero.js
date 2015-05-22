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

  function Draw (images, width, height, callback) {
    var canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    function DrawOne () {
      var img = new Image();

      function ImageComplete () {
        //document.body.appendChild(img);
        context.drawImage(
          img, 0, 0, img.width, img.height,
          0, 0, width, height);
        images.splice(0, 1); // 删除第一个

        if (images.length) {
          DrawOne();
        } else {
          callback(canvas.toDataURL("image/png"));
        }
      };

      img.src = images[0];

      if (img.complete) {
        ImageComplete();
      } else {
        img.onload = ImageComplete;
      }
    }

    DrawOne();
  }

  Game.drawHero = function drawHero (heroData, callback) {
    var data = heroData.images;

    var images = [];

    images.push(data.body);
    images.push(data.eyes);
    images.push(data.hair);
    images.push(data.head);
    images.push(data.shirts);
    images.push(data.pants);
    images.push(data.shoes);
    images.push(data.armorchest);
    images.push(data.armorarm);
    images.push(data.armorlegs);
    images.push(data.armorhelms);
    images.push(data.armorfeet);
    images = images.filter(function (element) {
      if (typeof element != "string" || element.length <= 0)
        return false;
      return true;
    });

    Draw(images, heroData.custom.width, heroData.custom.height, callback);
  };

})();
