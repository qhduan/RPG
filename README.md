# RPG

Created by http://qhduan.com

本项目是个人作品，希望制作一个自己觉得不错的开放沙盘2D RPG游戏，A-RPG战斗模式

游戏引擎使用作者自己开发的Sprite引擎，使用webgl或canvas作为游戏后端

世界观： https://github.com/qhduan/RPG/wiki/%E4%B8%96%E7%95%8C%E8%A7%82

游戏操作： https://github.com/qhduan/RPG/wiki/%E6%B8%B8%E6%88%8F%E6%93%8D%E4%BD%9C

角色信息：　https://github.com/qhduan/RPG/wiki/%E8%A7%92%E8%89%B2%E4%BF%A1%E6%81%AF

## 游戏特性

- 无结局
- 多支线
- 多生活技能
- 真实的奇幻世界

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

### 测试游戏

游戏发展还在非常原始的阶段，但是已经可以进行简单测试，需要一定动手能力

游戏将支持多平台，已经测试的平台包括：
- windows(node-webkit，firefox，chrome)
- linux(node-webkit，firefox，chrome)
- android(cordova, chrome)

在线测试网址：
http://qhduan.github.io/RPG/

注意，因为游戏尚在开发阶段，所以很多图片资源尚未优化合并，js代码也尚未合并uglify，所以打开速度可能非常慢，但是不影响运行速度

本地打开方式：

方法1：下载项目，只需要项目中的data目录，然后下载node-webkit( http://nwjs.io/ )，使用

windows: nw.exe 游戏目录/data

linux: nw 游戏目录/data

方法2：下载项目，用firefox直接打开项目data目录下的index.html文件

注：这种方法可能只支持firefox，因为chrome的权限控制比较严格，会出错，IE未测试，应该不行。还有游戏存档功能可能也会有影响

方法3： 随便使用一种网页服务，例如python

安装python，在游戏目录的data目录下，运行“python -m SimpleHTTPServer”命令，然后打开浏览器，并进入地址 http://localhost:8000/
