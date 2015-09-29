"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js"],
          dest: "tmp/js",
          ext: ".js"
        }]
      }
    },
    concat: {
      sprite: {
        src: [
          "tmp/js/Sprite/Sprite.js",
          "tmp/js/Sprite/SpriteCanvas.js",
          "tmp/js/Sprite/SpriteWebgl.js",
          "tmp/js/Sprite/SpriteEvent.js",
          "tmp/js/Sprite/SpriteTween.js",
          "tmp/js/Sprite/SpriteLoad.js",
          "tmp/js/Sprite/SpriteTicker.js",
          "tmp/js/Sprite/SpriteDisplay.js",
          "tmp/js/Sprite/SpriteContainer.js",
          "tmp/js/Sprite/SpriteStage.js",
          "tmp/js/Sprite/SpriteText.js",
          "tmp/js/Sprite/SpriteFrame.js",
          "tmp/js/Sprite/SpriteSheet.js",
          "tmp/js/Sprite/SpriteInput.js",
          "tmp/js/Sprite/SpriteShape.js",
          "tmp/js/Sprite/SpriteBitmap.js"
        ],
        dest: "data/js/Sprite.all.js"
      },
      game: {
        src: [
          "tmp/js/Game/Game.js",

          "tmp/js/Game/GameWindow.js",
          "tmp/js/Game/GameWindowArchive.js",
          "tmp/js/Game/GameWindowBuy.js",
          "tmp/js/Game/GameWindowChoice.js",
          "tmp/js/Game/GameWindowConfirm.js",
          "tmp/js/Game/GameWindowDialogue.js",
          "tmp/js/Game/GameWindowInterface.js",
          "tmp/js/Game/GameWindowInventory.js",
          "tmp/js/Game/GameWindowLoading.js",
          "tmp/js/Game/GameWindowMain.js",
          "tmp/js/Game/GameWindowMap.js",
          "tmp/js/Game/GameWindowOver.js",
          "tmp/js/Game/GameWindowPickup.js",
          "tmp/js/Game/GameWindowQuest.js",
          "tmp/js/Game/GameWindowRegister.js",
          "tmp/js/Game/GameWindowSell.js",
          "tmp/js/Game/GameWindowSetting.js",
          "tmp/js/Game/GameWindowSkill.js",
          "tmp/js/Game/GameWindowStatus.js",
          "tmp/js/Game/GameWindowSysmenu.js",

          "tmp/js/Game/GameAstar.js",
          "tmp/js/Game/GameAI.js",
          "tmp/js/Game/GameCollision.js",
          "tmp/js/Game/GameUI.js",
          "tmp/js/Game/GameArea.js",
          "tmp/js/Game/GameMap.js",
          "tmp/js/Game/GameQuest.js",
          "tmp/js/Game/GameItem.js",
          "tmp/js/Game/GameSkill.js",
          "tmp/js/Game/GameActor.js",
          "tmp/js/Game/GameActorAlly.js",
          "tmp/js/Game/GameActorHero.js",
          "tmp/js/Game/GameActorMonster.js",
          "tmp/js/Game/GameActorNPC.js",
          "tmp/js/Game/GameActorPet.js",
          "tmp/js/Game/GameDrawHero.js",
          "tmp/js/Game/GameInput.js",
          "tmp/js/Game/GameRegister.js",
          "tmp/js/Game/GameArchive.js"
        ],
        dest: "data/js/Game.all.js"
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
