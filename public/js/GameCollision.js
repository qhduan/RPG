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

  // 粗略计算地块是否和角色碰撞，主要是利用位置计算上是否有矩形的重叠
  // 例如如果长方形A和长方形B左右重叠，则他们重叠在一起的宽会比AB各自的宽加一起要来的窄
  function rectngleCollide(spriteA, spriteB, rectA, rectB) {
    /*
    以下图为例：
    AA
    AA
        BB
        BB
    假设上面是两个图片，并且图片的x和y都在左上角
     */

    var data = {
      x1: spriteA.x - rectA.center.x, // A的左上角x坐标
      y1: spriteA.y - rectA.center.y, // A的左上角y坐标
      x2: spriteB.x - rectB.center.x, // B的左上角x坐标
      y2: spriteB.y - rectB.center.y, // B的左上角y坐标
      w1: rectA.width, // A的宽
      h1: rectA.height, // A的高
      w2: rectB.width, // B的宽
      h2: rectB.height, // B的高
      x3: spriteA.x - rectA.center.x + rectA.width, // A的右上角
      y3: spriteA.y - rectA.center.y + rectA.height, // A的左下角
      x4: spriteB.x - rectB.center.x + rectB.width, // B的右上角
      y4: spriteB.y - rectB.center.y + rectB.height // B的左下角
    };

    data.minX = Math.min(data.x1, data.x2); // 最小的x坐标，这里应该是A的左上角x坐标
    data.minY = Math.min(data.y1, data.y2); // 最小的y坐标，这里应该是A的左上角y坐标
    data.maxX = Math.max(data.x3, data.x4); // 最大的x坐标，这里应该是B的右上角x坐标
    data.maxY = Math.max(data.y3, data.y4); // 最大的y坐标，这里应该是B的左下角y坐标

    // 一个最大宽度和最大高度
    // 宽度就是从A的左上角x坐标到B的右上角x坐标
    // 高度就是从A的左上角y坐标到B的左下角y坐标
    data.width = data.maxX - data.minX;
    data.height = data.maxY - data.minY;

    // 如果两个图形组成的最大宽，大于两个图片分别的最大宽，说明可能有交集
    // 如果两个图形组成的最大高，大于两个图片分别的最大高，说明可能有交集
    if (data.width < rectA.width + rectB.width && data.height < rectA.height + rectB.height) return data;
    return false;
  }

  var canvasCollide = document.createElement("canvas");
  //document.body.appendChild(canvasCollide);

  // 检测像素级碰撞
  // 四个delta参数代表的是检测的偏移，例如为了只检测角色下半身，则设角色高度为h/2，把deltaY设置为h，把deltaH设置为-h/w即可
  // 如果只检测角色右半边，设角色宽度为w，则可以把deltaX设置为w/2，deltaW为-w/2
  function pixelCollide(spriteA, spriteB, rectA, rectB, data, deltaX, deltaY, deltaW, deltaH) {
    // 对图像进行某种意义上的移动，例如把上面的图的A和B都平移到左上角，也就是AA的左上角变为0,0坐标

    data.x1 -= data.minX;
    data.x2 -= data.minX;
    data.y1 -= data.minY;
    data.y2 -= data.minY;

    if (typeof deltaX != "number") deltaX = 0;
    if (typeof deltaY != "number") deltaY = 0;
    if (typeof deltaW != "number") deltaW = 0;
    if (typeof deltaH != "number") deltaH = 0;

    canvasCollide.width = data.width; //Game.area.map.width;//data.width;
    canvasCollide.height = data.height; //Game.area.map.height;//data.height;
    var context = canvasCollide.getContext("2d");

    // draw spriteA
    context.clearRect(0, 0, data.width, data.height);
    context.drawImage(rectA.image, rectA.x, rectA.y, data.w1, data.h1, data.x1, data.y1, data.w1, data.h1);

    var pixelOld = context.getImageData(data.x1 + deltaX, data.y1 + deltaY, data.w1 + deltaW, data.h1 + deltaH).data;

    // draw spriteB
    context.drawImage(rectB.image, rectB.x, rectB.y, data.w2, data.h2, data.x2, data.y2, data.w2, data.h2);

    var pixelNew = context.getImageData(data.x1 + deltaX, data.y1 + deltaY, data.w1 + deltaW, data.h1 + deltaH).data;

    for (var i = 3; i < pixelOld.length; i += 3) {
      if (pixelOld[i] > 0) {
        if (pixelOld[i] != pixelNew[i] || pixelOld[i - 1] != pixelNew[i - 1] || pixelOld[i - 2] != pixelNew[i - 2] || pixelOld[i - 3] != pixelNew[i - 3]) return true;
      }
    }

    return false;
  }

  // 角色碰撞检测，先简单的矩形检测，如有碰撞可能则进行像素级检测
  Game.actorCollision = function (actorSprite, blockSprite) {
    // 角色只检测frame 0，因为角色老变动，避免卡住，只检测第一个frame
    var actorRect = actorSprite.getFrame(0);
    // 阻挡的块则检测当前frame，因为地块一般无变化
    var blockRect = blockSprite.getFrame(blockSprite.currentFrame);

    var data = rectngleCollide(actorSprite, blockSprite, actorRect, blockRect);
    if (data) {
      var actorHeight = data.h1;
      // deltaY偏移0.8，大概意思是只检测角色最下方20%的地方
      var deltaY = parseInt(actorHeight * 0.8);
      var deltaH = actorHeight - deltaY;
      return pixelCollide(actorSprite, blockSprite, actorRect, blockRect, data, 0, deltaY, 0, deltaH);
    }
    return false;
  };

  // 技能碰撞检测
  Game.skillCollision = function (skillSprite, actorSprite) {
    // 角色只检测frame 0，因为角色老变动，避免卡住，只检测第一个frame
    var skillRect = skillSprite.getFrame(skillSprite.currentFrame);
    //console.log(skillSprite.currentFrame);
    // 阻挡的块则检测当前frame，因为地块一般无变化
    var actorRect = actorSprite.getFrame(actorSprite.currentFrame);

    var data = rectngleCollide(skillSprite, actorSprite, skillRect, actorRect);
    if (data) {
      //return true;
      // 和角色碰撞检测对比，技能碰撞检测无delta
      return pixelCollide(skillSprite, actorSprite, skillRect, actorRect, data);
    }
    return false;
  };
})();
//# sourceMappingURL=GameCollision.js.map
