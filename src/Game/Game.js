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

"use strict";

import "./CSS/Global.scss";
import Game from "./Base.js";

import Actor        from "./Actor.js";
import ActorAlly    from "./ActorAlly.js";
import ActorHero    from "./ActorHero.js";
import ActorMonster from "./ActorMonster.js";
import ActorNPC     from "./ActorNPC.js";
import ActorPet     from "./ActorPet.js";
import Archive      from "./Archive.js";
import Area         from "./Area.js";
import Astar        from "./Astar.js";
import Input        from "./Input.js";
import Item         from "./Item.js";
import Map          from "./Map.js";
import Quest        from "./Quest.js";
import Register     from "./Register.js";
import Skill        from "./Skill.js";
import Window       from "./Window.js";

import Choice       from "./Component/Choice.js";
import Confirm      from "./Component/Confirm.js";
import Dialogue     from "./Component/Dialogue.js";
import DrawHero     from "./Component/DrawHero.js";
import Popup        from "./Component/Popup.js";

Game.assign("Actor",        Actor);
Game.assign("ActorAlly",    ActorAlly);
Game.assign("ActorHero",    ActorHero);
Game.assign("ActorMonster", ActorMonster);
Game.assign("ActorNPC",     ActorNPC);
Game.assign("ActorPet",     ActorPet);
Game.assign("Archive",      Archive);
Game.assign("Area",         Area);
Game.assign("Astar",        Astar);
Game.assign("Input",        Input);
Game.assign("Item",         Item);
Game.assign("Map",          Map);
Game.assign("Quest",        Quest);
Game.assign("Register",     Register);
Game.assign("Skill",        Skill);
Game.assign("Window",       Window);

Game.assign("Choice",       Choice);
Game.assign("Confirm",      Confirm);
Game.assign("Dialogue",     Dialogue);
Game.assign("DrawHero",     DrawHero);
Game.assign("Popup",        Popup);

import WindowArchive   from "./Window/Archive.js";
import WindowBuy       from "./Window/Buy.js";
import WindowInterface from "./Window/Interface.js";
import WindowInventory from "./Window/Inventory.js";
import WindowLoading   from "./Window/Loading.js";
import WindowMain      from "./Window/Main.js";
import WindowMap       from "./Window/Map.js";
import WindowOver      from "./Window/Over.js";
import WindowPickup    from "./Window/Pickup.js";
import WindowQuest     from "./Window/Quest.js";
import WindowRegister  from "./Window/Register.js";
import WindowSell      from "./Window/Sell.js";
import WindowSetting   from "./Window/Setting.js";
import WindowSkill     from "./Window/Skill.js";
import WindowStatus    from "./Window/Status.js";
import WindowSysmenu   from "./Window/Sysmenu.js";

Game.windows.archive =   WindowArchive;
Game.windows.buy =       WindowBuy;
Game.windows.interface = WindowInterface;
Game.windows.inventory = WindowInventory;
Game.windows.loading =   WindowLoading;
Game.windows.main =      WindowMain;
Game.windows.map =       WindowMap;
Game.windows.over =      WindowOver;
Game.windows.pickup =    WindowPickup;
Game.windows.quest =     WindowQuest;
Game.windows.register =  WindowRegister;
Game.windows.sell =      WindowSell;
Game.windows.setting =   WindowSetting;
Game.windows.skill =     WindowSkill;
Game.windows.status =    WindowStatus;
Game.windows.sysmenu =   WindowSysmenu;

Game.init();

let WindowStage = Window.create("stageWindow");
WindowStage.appendChild(Game.stage.canvas);
Game.windows.stage = WindowStage;
WindowStage.show();

Input.init();
WindowMain.show();
document.title = "Elliorwis";

window.Game = Game;

export default Game;
