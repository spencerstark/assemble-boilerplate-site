/*
 * Assemble, component generator for Grunt.js
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('src/data/site.yml'),

    assemble: {
      // Task-level options
      options: {
        prettify: {indent: 2},
        marked: {sanitize: false},
        production: true,
        data: 'src/**/*.{json,yml}',
        assets: '<%= site.destination %>/assets',
        helpers: 'src/helpers/helper-*.js',
        layoutdir: 'src/templates/layouts',
        partials: ['src/templates/includes/**/*.hbs'],
      },
      blogs: {
        options: {
          flatten: true,
          partials: ['src/blog/*.md'] 
        },
        files:{
          '<%= site.destination %>/zachs/': ['src/templates/pages/test.hbs']
        }
      },
      site: {
        // Target-level options
        options: {layout: 'default.hbs'},
        files: [
          { expand: true, cwd: 'src/templates/pages', src: ['*.hbs'], dest: '<%= site.destination %>/' }
        ]
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      all: ['<%= site.destination %>/**/*.{html,md}']
    },
    // create a local server
    connect: {
      server: {
        options: {
          livereload: 35730,
          port: 8080,
          base: '<%= site.destination %>'
        }
      }
    },
    // different watch options trigger different tasks
    watch: {
      options: {
        livereload: true
      },
      assemble: {
        files: ['src/**/*.hbs', '!src/templates/misc/readme.md.hbs', 'src/data/*.assemble.json'],
        tasks: ['assemble:dev']
      },
      templates: {
        files: ['src/fonts/**'],
        tasks: ['copy:fonts']
      },
      all: {
        files: ['src/**'],
        tasks: ['assemble']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-verb');

  // Default task to be run.
  grunt.registerTask('default', ['clean', 'assemble', 'connect:server']);
};
