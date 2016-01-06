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

import SpriteBitmap from "./Bitmap.js";
import SpriteCanvas from "./Canvas.js";
import SpriteContainer from "./Container.js";
import SpriteDisplay from "./Display.js";
import SpriteEvent from "./Event.js";
import SpriteFrame from "./Frame.js";
import SpriteInput from "./Input.js";
import SpriteLoader from "./Loader.js";
import SpriteShape from "./Shape.js";
import SpriteSheet from "./Sheet.js";
import SpriteStage from "./Stage.js";
import SpriteText from "./Text.js";
import SpriteTicker from "./Ticker.js";
import SpriteTween from "./Tween.js";
import SpriteUtil from "./Util.js";
import SpriteWebgl from "./Webgl.js";

Sprite.assign("Bitmap", SpriteBitmap);
Sprite.assign("Canvas", SpriteCanvas);
Sprite.assign("Container", SpriteContainer);
Sprite.assign("Display", SpriteDisplay);
Sprite.assign("Event", SpriteEvent);
Sprite.assign("Frame", SpriteFrame);
Sprite.assign("Input", SpriteInput);
Sprite.assign("Loader", SpriteLoader);
Sprite.assign("Shape", SpriteShape);
Sprite.assign("Sheet", SpriteSheet);
Sprite.assign("Stage", SpriteStage);
Sprite.assign("Text", SpriteText);
Sprite.assign("Ticker", SpriteTicker);
Sprite.assign("Tween", SpriteTween);
Sprite.assign("Util", SpriteUtil);
Sprite.assign("Webgl", SpriteWebgl);

export default Sprite;
