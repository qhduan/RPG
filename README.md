# 艾利韦斯 Elliorwis 奇幻角色扮演游戏 Fantasy RPG Game

## 中文游戏 Elliorwis is a Chinese Game

Created by mail@qhduan.com ( http://qhduan.com )

本项目是个人作品，希望制作一个自己觉得不错的开放沙盘2D RPG游戏，即时战斗模式。

游戏引擎使用作者自己开发的Sprite引擎，使用webgl或canvas作为游戏后端。所有代码使用JavaScript ES2015(ES6)开发，代码没使用任何第三方库。

背景设定 | backgroundsetting：

[世界观 | World view](https://github.com/qhduan/RPG/blob/master/background/world.md)

[游戏操作 | Game control](https://github.com/qhduan/RPG/blob/master/background/control.md)

[角色信息 | Actor Information](https://github.com/qhduan/RPG/blob/master/background/actor.md)

## 游戏特性 | Feature

我所希望的游戏特性（很多地方还未实现）

- 无结尾，但是会有主线剧情结局，类似D&D类游戏的模组模式
- 有职业，但是职业可变，不同职业可以提供不同的buff，例如战士加力量，魔法师加智力，然后各自降低对应技能的升级经验要求
- 多支线任务，会分为主线任务，支线任务，随机任务（暂定），不同派系的任务（暂定的派系有：帝国，旧贵族，神庙，法师学院，骑士学院，猎人公会）
- 自由的地图，尽量不进行任何剧情限制，一开始就可以旅行到任意地方（但是等级低的时候到高等级区会很容易被怪物打死，某些任务可能也会有限制）
- 生活技能，构思中，暂定会有：厨艺，钓鱼，口才，交易，开锁，偷窃
- 模拟养成要素，布置房间，生存，饥饿值，劳累值
- 大型战斗，带领NPC，对抗其他NPC，构建大型战场，会建设要塞，攻城，守城，野战，空战
- 穿插的小游戏，暂定的设想有：钓鱼，赛车比赛（奇幻赛车？oh no！），打飞机（雷电），赌博（骰子和扑克），开锁（暂时设想是解迷宫），偷窃，等各种小游戏
- 尽量真实的奇幻世界

## 协议 | License

所有原创代码采用GPL-v3协议（详情在文件GPLv3.txt），包括Sprite引擎(src/Sprite目录)，和游戏本体(src/Game目录)

项目中原创资源(非代码)采用CC-BY-SA 3.0协议共享，（详情在文件CC-BY-SA.txt）

游戏中部分设定，人物名称，世界地图，城市名称，部分剧情，内容，来自donjon网站（ http://donjon.bin.sh ），采用OpenGameLicense协议（详情在文件OpenGameLicense.txt）

其他非原创资源(非代码)列表，会以credits的方式列出，大部分的资源都会是GPL，CC，或其他兼容协议

### 开发环境 | Develop Environment

node.js 系统运行和测试，非必要，游戏可以完全的以静态HTML的方式运行，只是开发与测试需要，实际运行不需要

babel.js 为了写es6代码，非必要，在短暂的未来chrome，node-webkit等更好的支持es6之后就会放弃

地图使用tiled软件(mapeditor)，格式为json， [网址](http://www.mapeditor.org/)

图片压缩使用pngquant

地图和一些svg使用Method-Draw编辑

### 鸣谢 | Credits

游戏所用的地图资源存储在tilesets文件夹中，地图是使用 [tiled](http://www.mapeditor.org/) 编辑的，版权文件列在其中分别列出了（游戏中的地图资源用pngquant压缩过）

大部分资源来自 OpenGameArt.org (http://opengameart.org)
因为项目还在不断改进，以后我会列出详细的列表，感谢所有资源提供者

### 关于HTML5 网页游戏 | About HTML5

###### 为什么是网页游戏 | Why HTML5 and JavaScript

- 跨平台方便 | cross platform
- 开发简单，例如让我直接用c++/opengl开发，可能就需要数倍的精力 | easy for use

其实可能主要的原因还是我比较熟悉，我就熟悉两个语言，一个c++，一个js。
其他很多语言我都写过东西，但是比较精通的就这两个吧。

JS的跨平台简直太容易了，当然这是在牺牲了一定性能的前提下，不过实在太容易了。
比如说我做的这个游戏，我在windows上我想用node-webkit封装也行，想用cordova/phonegap封装也行，想随便写个server用浏览器打开本地服务器也行，这一点，应该没有任何其他编程语言能做到。
但是你要说跨平台这一点到底有什么用，或许，也只是让我觉得舒服而已。

###### HTML5的缺陷

缺陷1：绘图速度慢。
webgl的速度实际上还可以，对于2D游戏来说，基本足够

缺陷2：在线资源加载的异步性，游戏的有些资源可能很大，例如bgm，中文字体。
不过可以用客户端解决，只要把网页用node-webkit或者cordova包装成原生应用，就没什么问题了。

缺陷3：存档等保存的局限性。因为没有文件系统，所以存档智能保存在localStorage或者indexDB里面，有容量，和可能有危险的局限性。
解决方法可能是用包装软件（例如node-webkit）多备份。
实际上现在游戏存档是有截图的，网页游戏，不可想象吧，不过实际上我测试，一个小截图占用空间不大，就几十KB，一般localStorage至少都有5MB的容量，完全可以胜任，大不了以后限制存档数量就好了。

缺陷4：CPU集中型算法可能缓慢，例如寻路算法。确实是慢了点，只能说针对这些算法不断进行优化。
实在不行也可以考虑用WebWorker这样的技术来进行多线程异步计算，不过延迟会变高，在移动端访问可能很不友好（虽然支持Worker但是延迟太高什么的）
我尝试了A*算法在WebWorker的情况，在桌面还没什么问题（当然桌面一般同步也没问题），但是在android上基本没法用，可以感觉到延迟太高了。

缺陷5：内存占用大，比如说对于webgl渲染，就需要两套材质，一套是image，一套是webgl的texture，这样很不好。
这个我想不到解决办法，幸运的是现在手机/PC的内存都很大，在合理的地图大小下，在中高端手机和一般电脑里面应该不会有问题。

### 测试游戏 | Game test

游戏发展还在非常原始的阶段，但是已经可以进行简单测试，需要一定动手能力

游戏将支持多平台，已经测试的平台包括：
- windows(node-webkit，firefox，chrome)
- linux(node-webkit，firefox，chrome)
- android(cordova, chrome)

现在，因为游戏还在开发过程中，所以我并没有制作游戏客户端，想尝试的话，可以在线（只在最新版本的chromium与firefox上测试过）

两个连接是一样的

http://qhduan.github.io/RPG/

http://eliorwis.qhduan.com/

Only Chinese version
