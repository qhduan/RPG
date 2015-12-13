"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        presets: ["es2015"]
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
    watch: {
      scrpites: {
        files: "src/**/*.js",
        //tasks: ["babel:dist"],
        options: {
          spawn: false
        }
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      elliorwis: {
        src: [
          "data/js/polyfill.js",

          "data/js/Sprite/Sprite.js",
          "data/js/Sprite/Util.js",
          "data/js/Sprite/Canvas.js",
          "data/js/Sprite/Webgl.js",
          "data/js/Sprite/Event.js",
          "data/js/Sprite/Tween.js",
          "data/js/Sprite/Loader.js",
          "data/js/Sprite/Ticker.js",
          "data/js/Sprite/Display.js",
          "data/js/Sprite/Container.js",
          "data/js/Sprite/Stage.js",
          "data/js/Sprite/Text.js",
          "data/js/Sprite/Frame.js",
          "data/js/Sprite/Sheet.js",
          "data/js/Sprite/Input.js",
          "data/js/Sprite/Shape.js",
          "data/js/Sprite/Bitmap.js",

          "data/js/Game/Game.js",

          "data/js/Game/Window.js",

          "data/js/Game/Window/Archive.js",
          "data/js/Game/Window/Buy.js",
          "data/js/Game/Window/Choice.js",
          "data/js/Game/Window/Confirm.js",
          "data/js/Game/Window/Dialogue.js",
          "data/js/Game/Window/Interface.js",
          "data/js/Game/Window/Inventory.js",
          "data/js/Game/Window/Loading.js",
          "data/js/Game/Window/Main.js",
          "data/js/Game/Window/Map.js",
          "data/js/Game/Window/Over.js",
          "data/js/Game/Window/Pickup.js",
          "data/js/Game/Window/Quest.js",
          "data/js/Game/Window/Register.js",
          "data/js/Game/Window/Sell.js",
          "data/js/Game/Window/Setting.js",
          "data/js/Game/Window/Skill.js",
          "data/js/Game/Window/Status.js",
          "data/js/Game/Window/Sysmenu.js",

          "data/js/Game/Astar.js",
          "data/js/Game/AI.js",
          "data/js/Game/Collision.js",
          "data/js/Game/UI.js",
          "data/js/Game/Area.js",
          "data/js/Game/Map.js",
          "data/js/Game/Quest.js",
          "data/js/Game/Item.js",
          "data/js/Game/Skill.js",
          "data/js/Game/Actor.js",
          "data/js/Game/ActorAlly.js",
          "data/js/Game/ActorHero.js",
          "data/js/Game/ActorMonster.js",
          "data/js/Game/ActorNPC.js",
          "data/js/Game/ActorPet.js",
          "data/js/Game/DrawHero.js",
          "data/js/Game/Input.js",
          "data/js/Game/Register.js",
          "data/js/Game/Archive.js"
        ],
        dest: "data/js/all.js"
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  //grunt.registerTask("default", ["babel", "watch"]);

};
