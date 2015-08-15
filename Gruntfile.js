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
          dest: "public/js",
          ext: ".js"
        }]
      }
    },
    watch: {
      scrpites: {
        files: "src/*.js",
        //tasks: ["babel:dist"],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  // Default task.
  //grunt.registerTask("default", ["babel", "watch"]);

};
