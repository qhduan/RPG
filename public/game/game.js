


~function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    maps: {}, // 缓存所有地图和地图对象，结构为 { mapId: mapObj }
    actors: {}, // 缓存所有角色和角色对象，结构为 { actorId: actorObj }
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      width: 800, // 渲染窗口的大小，更大的大小是经过收缩的
      height: 450
    }
  };
  // 如果为true，则在下一次tick事件后会调用stage.update，然后再自动置为false
  var updateStageNextTick = false;

  Game.updateStage = function () {
    updateStageNextTick = true;
  };

  ~function RPGStageInit () {

    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

    var canvasObj = document.getElementById("canvas");
    canvasObj.width = Game.config.width;
    canvasObj.height = Game.config.height;
    Game.stage = new createjs.Stage(canvasObj);

    createjs.Ticker.on("tick", function () {
      if (updateStageNextTick) {
        Game.stage.update();
        updateStageNextTick = false;
      }
    });

    console.log("RPG Game Flying!");
  }();


  // 当窗口大小改变时改变游戏窗口大小
  function CalculateWindowSize () {
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;

    var ratio = Game.config.width / Game.config.height;

    // width first
    var w = width;
    var h = w / ratio;

    // then height
    if (h > height) {
      h = height;
      w = h * ratio;
    }

    w = parseInt(w);
    h = parseInt(h);

    Game.width = w;
    Game.height = h;

    var scale = Math.min(
      w / Game.config.width,
      h / Game.config.height
    );

    Game.stage.setTransform(0, 0, scale, scale);
    Game.stage.canvas.width = w;
    Game.stage.canvas.height = h;

    if (Game.hero) Game.hero.focus();

    Game.stage.update();

  };

  CalculateWindowSize();
  window.addEventListener("resize", function () {
    CalculateWindowSize();
  });


  function actorRectngleCollide (actorSprite, blockSprite, actorRect, blockRect) {
    /*
    以下图为例：
    AA
    AA
        BB
        BB
    假设上面是两个图片，并且图片的x和y都在左上角
     */

    var data = {
      x1: actorSprite.x - actorRect.regX, // A的左上角x坐标
      y1: actorSprite.y - actorRect.regY, // A的左上角y坐标
      x2: blockSprite.x - blockRect.regX, // B的左上角x坐标
      y2: blockSprite.y - blockRect.regY, // B的左上角y坐标
      w1: actorRect.rect.width, // A的宽
      h1: actorRect.rect.height, // A的高
      w2: blockRect.rect.width, // B的宽
      h2: blockRect.rect.height, // B的高
      x3: actorSprite.x - actorRect.regX + actorRect.rect.width, // A的右上角
      y3: actorSprite.y - actorRect.regY + actorRect.rect.height, // A的左下角
      x4: blockSprite.x - blockRect.regX + blockRect.rect.width, // B的右上角
      y4: blockSprite.y - blockRect.regY + blockRect.rect.height // B的左下角
    };

    data.minX = Math.min(data.x1, data.x2); // 最小的x坐标，这里应该是A的左上角x坐标
    data.minY = Math.min(data.y2, data.y2); // 最小的y坐标，这里应该是A的左上角y坐标
    data.maxX = Math.max(data.x3, data.x4); // 最大的x坐标，这里应该是B的右上角x坐标
    data.maxY = Math.max(data.y3, data.y4); // 最大的y坐标，这里应该是B的左下角y坐标

    // 一个最大宽度和最大高度
    // 宽度就是从A的左上角x坐标到B的右上角x坐标
    // 高度就是从A的左上角y坐标到B的左下角y坐标
    data.width = data.maxX - data.minX;
    data.height = data.maxY - data.minY;

    // 如果两个图形组成的最大宽，大于两个图片分别的最大宽，说明可能有交集
    // 如果两个图形组成的最大高，大于两个图片分别的最大高，说明可能有交集
    if( data.width < (actorRect.rect.width + blockRect.rect.width)
    && data.height < (actorRect.rect.height + blockRect.rect.height) )
      return data;
    return false;
  }

  var canvasCollide = document.createElement("canvas");
  //document.body.appendChild(canvasCollide);

  function pixelCollide (actorSprite, blockSprite, actorRect, blockRect, data) {
    // 对图像进行某种意义上的移动，例如把上面的图的A和B都平移到左上角，也就是AA的左上角变为0,0坐标
    data.x1 -= data.minX;
    data.x2 -= data.minX;
    data.y1 -= data.minY;
    data.y2 -= data.minY;

    canvasCollide.width = data.width;
    canvasCollide.height = data.height;
    var context = canvasCollide.getContext("2d");

    // draw actorSprite
    context.clearRect(0, 0, data.width, data.height)
    context.drawImage(actorRect.image,
      actorRect.rect.x, actorRect.rect.y, data.w1, data.h1,
      data.x1, data.y1, data.w1, data.h1);
    // 只检测角色的下半身
    var pixelOld = context.getImageData(data.x1, data.y1 + data.h1/2, data.w1, data.h1/2).data;
    
    // draw blockSprite
    context.drawImage(blockRect.image,
      blockRect.rect.x, blockRect.rect.y, data.w2, data.h2,
      data.x2, data.y2, data.w2, data.h2);
    // 只检测角色的下半身
    var pixelNew = context.getImageData(data.x1, data.y1 + data.h1/2, data.w1, data.h1/2).data;

    for (var i = 3; i < pixelOld.length; i += 3) {
      if (pixelOld[i] > 0) {
        if ( pixelOld[i] != pixelNew[i]
          || pixelOld[i - 1] != pixelNew[i - 1]
          || pixelOld[i - 2] != pixelNew[i - 2]
          || pixelOld[i - 3] != pixelNew[i - 3]
        ) return true;
      }
    }

    return false;
  }

  // 碰撞检测，先简单的矩形检测，如有碰撞可能则进行像素级检测
  // frameA 和 frameB 是为了方便角色的frame的判断，因为角色不同的frame是不同的，这样会很不方便
  Game.actorCollision = function (actorSprite, blockSprite) {
    var actorRect = actorSprite.spriteSheet.getFrame(0);
    var blockRect = blockSprite.spriteSheet.getFrame(blockSprite.currentFrame);

    var data = actorRectngleCollide(actorSprite, blockSprite, actorRect, blockRect);
    if (data)
      return pixelCollide(actorSprite, blockSprite, actorRect, blockRect, data);
    return false;
  };



}();
