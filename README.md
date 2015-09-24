# RPG

Created by http://qhduan.com

本项目是个人作品，希望制作一个自己觉得不错的开放沙盘2D RPG游戏，A-RPG战斗模式

游戏引擎使用作者自己开发的Sprite引擎，使用webgl或canvas作为游戏后端

世界观： https://github.com/qhduan/RPG/wiki/%E4%B8%96%E7%95%8C%E8%A7%82

游戏操作： https://github.com/qhduan/RPG/wiki/%E6%B8%B8%E6%88%8F%E6%93%8D%E4%BD%9C

角色信息：　https://github.com/qhduan/RPG/wiki/%E8%A7%92%E8%89%B2%E4%BF%A1%E6%81%AF

## 游戏特性

- 无结尾（但是有主线剧情结局）
- 无职业，人物的一切都以技能决定，可能会有称号系统（例如当前称号是厨师，就会提高厨艺什么的）
- 多支线
- 庞大自由的地图，尽量不进行任何剧情限制，一开始就可以旅行到任意地方（如果不怕被高级区的怪打死）
- 多生活技能，构思中，暂定会有厨艺，钓鱼之类的
- 模拟养成要素，布置房间，生活
- 团战，带领大量NPC，对抗其他的大量NPC的，建设要塞，攻城，守城，野战等
- 穿插的小游戏，暂定的设想有：钓鱼，打飞机（雷电），赌博（骰子和扑克），开锁（暂时设想是迷宫），等各种小游戏
- 尽量真实的奇幻世界

## License 协议

所有原创代码采用GPL v3版本共享，包括Sprite引擎(src/Sprite目录)，和游戏本体(src/Game目录)

项目中原创资源(非代码)采用CC-BY-SA 3.0方式共享，署名-相同方式共享

其他非原创资源(非代码)列表，会以credits的方式列出，大部分的资源都会是GPL，CC，或其他兼容协议（因为资源的协议限制，游戏绝无可能商业运营）

项目暂时未使用任何第三方代码

### 开发环境

node.js 系统运行和测试，非必要，游戏可以完全的以静态HTML的方式运行，只是开发与测试需要，实际运行不需要

babel.js 为了写es6代码，非必要，在短暂的未来chrome，node-webkit等更好的支持es6之后就可以放弃，至少node-webkit支持es6应该还是很快的吧

地图使用tiled，网址在 http://www.mapeditor.org/


### 原创非代码资源，遵守CC-BY-SA 3.0协议

### credits 鸣谢

大部分资源来自 OpenGameArt.org (http://opengameart.org)
因为项目还在不断改进，以后我会列出详细的列表，感谢所有资源提供者

Most resources are from OpenGameArt.org (http://opengameart.org)
I will list the detail later, thanks

### 关于HTML5 网页游戏

###### 为什么是网页游戏

- 跨平台方便
- 开发简单，例如让我直接用c++/opengl开发，就需要数倍的精力
- 足够了，就是因为足够了，webgl足够快了

###### 游戏有没有在线元素

没有，可能永远也不会有

###### HTML5的缺陷

缺陷1：速度慢，但是webgl的速度实际上还可以，对于2D游戏来说，基本足够

缺陷2：在线资源加载的异步性，我做的是游戏，有些资源可能很大，例如bgm，这就没办法了。
不过可以用客户端解决，只要把网页用node-webkit或者cordova包装成原生应用，就没什么问题了。

缺陷3：存档等保存的局限性。因为没有文件系统，所以存档智能保存在localStorage或者indexDB里面，有容量，和可能有危险的局限性。
解决方法可能是用包装软件（例如node-webkit）多备份。

缺陷4： CPU集中型算法可能缓慢，例如寻路算法。确实是慢了点，不过这些算法也可以进行一些优化，缓冲。
实在不行也可以考虑用WebWorker这样的技术来进行多线程异步计算，不过延迟会变高，在移动端访问可能很不友好（虽然支持Worker但是延迟太高什么的）
我尝试了A*算法在WebWorker的情况，在桌面还没什么问题（当然桌面一般同步也没问题），但是在android上基本没法用，可以感觉到延迟太高了。

### 测试游戏

游戏发展还在非常原始的阶段，但是已经可以进行简单测试，需要一定动手能力

游戏将支持多平台，已经测试的平台包括：
- windows(node-webkit，firefox，chrome)
- linux(node-webkit，firefox，chrome)
- android(cordova, chrome)

在线测试网址：
http://qhduan.github.io/RPG/

[谨点]
注意，因为游戏尚在开发阶段，所以很多图片资源尚未优化合并，js代码也尚未合并uglify，所以打开速度可能非常慢，但是不影响运行速度。
如果想要尝试，可以用chrome或者firefox打开，并且期待网速快，如果无法打开尝试刷新。

本地打开方式：

方法1：下载项目，只需要项目中的data目录，然后下载node-webkit( http://nwjs.io/ )，使用

windows: nw.exe 游戏目录/data

linux: nw 游戏目录/data

方法2：下载项目，用firefox直接打开项目data目录下的index.html文件

注：这种方法可能只支持firefox，因为chrome的权限控制比较严格，会出错，IE未测试，应该不行。还有游戏存档功能可能也会有影响

方法3： 随便使用一种网页服务，例如python

安装python，在游戏目录的data目录下，运行“python -m SimpleHTTPServer”命令，然后打开浏览器，并进入地址 http://localhost:8000/
