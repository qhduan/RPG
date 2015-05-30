"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: "public/src",
          src: ["**/*.js"],
          dest: "public/client",
          ext: ".js"
        }]
      }
    },
    watch: {
      scrpites: {
        files: "public/src/*.js",
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
