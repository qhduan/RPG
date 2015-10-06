"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: "inline"
      },
      dist: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js"],
          dest: "data/js",
          ext: ".js"
        }]
      }
    },
    concat: {
      elliorwis: {
        src: [
          "data/js/browser-polyfill.js",

          "data/js/Sprite/Sprite.js",
          "data/js/Sprite/SpriteCanvas.js",
          "data/js/Sprite/SpriteWebgl.js",
          "data/js/Sprite/SpriteEvent.js",
          "data/js/Sprite/SpriteTween.js",
          "data/js/Sprite/SpriteLoad.js",
          "data/js/Sprite/SpriteTicker.js",
          "data/js/Sprite/SpriteDisplay.js",
          "data/js/Sprite/SpriteContainer.js",
          "data/js/Sprite/SpriteStage.js",
          "data/js/Sprite/SpriteText.js",
          "data/js/Sprite/SpriteFrame.js",
          "data/js/Sprite/SpriteSheet.js",
          "data/js/Sprite/SpriteInput.js",
          "data/js/Sprite/SpriteShape.js",
          "data/js/Sprite/SpriteBitmap.js",

          "data/js/Game/Game.js",

          "data/js/Game/GameWindow.js",
          "data/js/Game/GameWindowArchive.js",
          "data/js/Game/GameWindowBuy.js",
          "data/js/Game/GameWindowChoice.js",
          "data/js/Game/GameWindowConfirm.js",
          "data/js/Game/GameWindowDialogue.js",
          "data/js/Game/GameWindowInterface.js",
          "data/js/Game/GameWindowInventory.js",
          "data/js/Game/GameWindowLoading.js",
          "data/js/Game/GameWindowMain.js",
          "data/js/Game/GameWindowMap.js",
          "data/js/Game/GameWindowOver.js",
          "data/js/Game/GameWindowPickup.js",
          "data/js/Game/GameWindowQuest.js",
          "data/js/Game/GameWindowRegister.js",
          "data/js/Game/GameWindowSell.js",
          "data/js/Game/GameWindowSetting.js",
          "data/js/Game/GameWindowSkill.js",
          "data/js/Game/GameWindowStatus.js",
          "data/js/Game/GameWindowSysmenu.js",

          "data/js/Game/GameAstar.js",
          "data/js/Game/GameAI.js",
          "data/js/Game/GameCollision.js",
          "data/js/Game/GameUI.js",
          "data/js/Game/GameArea.js",
          "data/js/Game/GameMap.js",
          "data/js/Game/GameQuest.js",
          "data/js/Game/GameItem.js",
          "data/js/Game/GameSkill.js",
          "data/js/Game/GameActor.js",
          "data/js/Game/GameActorAlly.js",
          "data/js/Game/GameActorHero.js",
          "data/js/Game/GameActorMonster.js",
          "data/js/Game/GameActorNPC.js",
          "data/js/Game/GameActorPet.js",
          "data/js/Game/GameDrawHero.js",
          "data/js/Game/GameInput.js",
          "data/js/Game/GameRegister.js",
          "data/js/Game/GameArchive.js"
        ],
        dest: "data/js/all.js"
      }
    },
    watch: {
      scrpites: {
        files: "src/**/*.js",
        //tasks: ["babel:dist"],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  //grunt.registerTask("default", ["babel", "watch"]);

};
