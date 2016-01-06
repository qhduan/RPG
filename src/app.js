"use strict";

import "babel-polyfill";

window.onerror = function (err) {
  console.log("Some error happend");
  console.log(err);
  alert(err);
};

import Game from "./Game/Game.js";
