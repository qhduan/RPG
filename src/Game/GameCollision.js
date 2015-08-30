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

  function boxCollide (spriteA, spriteB, rectA, rectB) {
    var A = {
      x: spriteA.x - rectA.centerX,
      y: spriteA.y - rectA.centerY,
      w: rectA.width,
      h: rectA.height,
      sx: rectA.x,
      sy: rectA.y,
      sw: rectA.width,
      sh: rectA.height,
      image: rectA.image
    };

    var B = {
      x: spriteB.x - rectB.centerX,
      y: spriteB.y - rectB.centerY,
      w: rectB.width,
      h: rectB.height,
      sx: rectB.x,
      sy: rectB.y,
      sw: rectB.width,
      sh: rectB.height,
      image: rectB.image
    };

    var bigX = Math.max(A.x + A.w, B.x + B.w);
    var smallX = Math.min(A.x, B.x);
    var bigY = Math.max(A.y + A.h, B.y + B.h);
    var smallY = Math.min(A.y, B.y);

    var width = bigX - smallX;
    var height = bigY - smallY;

    if (width < (A.w + B.w) && height < (A.h + B.h)) {
      return {
        A: A,
        B: B
      };
    }
    return false;
  }

  var collideCavansCache = new Map();

  function pixelCollide (A, B) {
    // 对图像进行某种意义上的移动，例如把上面的图的A和B都平移到左上角，也就是AA的左上角变为0,0坐标

    var now = (new Date().getTime());

    // WWWHHH
    var key = A.w * 1000 + A.h;
    var canvas;
    var context;
    if (collideCavansCache.has(key)) {
      canvas = collideCavansCache.get(key).canvas;
      context = collideCavansCache.get(key).context;
    } else {
      canvas = document.createElement("canvas");
      canvas.width = A.w;
      canvas.height = A.h;
      context = canvas.getContext("2d");
      collideCavansCache.set(key, {
        canvas: canvas,
        context: context
      });
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw spriteA
    context.globalCompositeOperation="source-over"
    context.drawImage(A.image,
      A.sx, A.sy, A.sw, A.sh,
      0, 0, A.w, A.h);

    // draw spriteB
    // 在source-in模式下，图像如果相交则显示，不相交则透明，所以判断如果有非透明就是相交
    context.globalCompositeOperation="source-in"
    context.drawImage(B.image,
      B.sx, B.sy, B.sw, B.sh,
      B.x - A.x, B.y - A.y, B.w, B.h);

    var pixel = context.getImageData(0, 0, A.w, A.h).data;

    var collision = false;

    for (var i = 3; i < pixel.length; i += 3) {
      if (pixel[i] != 0) {
        collision = true;
      }
    }

    return collision;
  }

  // 角色碰撞检测，先简单的矩形检测，如有碰撞可能则进行像素级检测
  Game.actorCollision = function (actorSprite, blockSprite) {
    // 角色只检测frame 0，因为角色老变动，避免卡住，只检测第一个frame
    var actorRect = actorSprite.getFrame(0);
    // 阻挡的块则检测当前frame
    var blockRect = blockSprite.getFrame();
    var data = boxCollide(actorSprite, blockSprite, actorRect, blockRect);
    if (data) {
      // 计算一个delta，即只碰撞角色的下半部分
      // deltaY偏移0.85，大概意思是只检测角色最下方15%的地方
      var deltaY = Math.floor(actorRect.height * 0.85);
      data.A.y += deltaY;
      data.A.sy += deltaY;
      data.A.h -= deltaY;
      data.A.sh -= deltaY;

      return pixelCollide(data.A, data.B);
    }
    return false;
  };

  // 技能碰撞检测
  Game.skillCollision = function (skillSprite, actorSprite) {
    var skillRect = skillSprite.getFrame();
    var actorRect = actorSprite.getFrame();

    var data = boxCollide(skillSprite, actorSprite, skillRect, actorRect);
    if (data) {
      // 和角色碰撞检测对比，技能碰撞检测无delta
      return pixelCollide(data.A, data.B);
    }
    return false;
  };



})();
