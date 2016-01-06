/*

2D Game Sprite Library, Built using JavaScript ES6
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

/**
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

"use strict";

import Sprite from "./Base.js";

import Bitmap from "./Bitmap.js";
import Canvas from "./Canvas.js";
import Container from "./Container.js";
import Display from "./Display.js";
import Event from "./Event.js";
import Frame from "./Frame.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Shape from "./Shape.js";
import Sheet from "./Sheet.js";
import Stage from "./Stage.js";
import Text from "./Text.js";
import Ticker from "./Ticker.js";
import Tween from "./Tween.js";
import Util from "./Util.js";
import Webgl from "./Webgl.js";

Sprite.assign("Bitmap", Bitmap);
Sprite.assign("Canvas", Canvas);
Sprite.assign("Container", Container);
Sprite.assign("Display", Display);
Sprite.assign("Event", Event);
Sprite.assign("Frame", Frame);
Sprite.assign("Input", Input);
Sprite.assign("Loader", Loader);
Sprite.assign("Shape", Shape);
Sprite.assign("Sheet", Sheet);
Sprite.assign("Stage", Stage);
Sprite.assign("Text", Text);
Sprite.assign("Ticker", Ticker);
Sprite.assign("Tween", Tween);
Sprite.assign("Util", Util);
Sprite.assign("Webgl", Webgl);

export default Sprite;
