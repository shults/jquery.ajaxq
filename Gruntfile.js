module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      version: '<%= pkg.version %>',
      banner:
        '/** \n' +
        ' * jQuery.ajaxq <%= pkg.version %> \n' +
        ' * jQuery plugin for AJAX queueing. This extension can be used also with Zepto.js. \n' +
        ' * https://github.com/shults/jquery.ajaxq/\n' +
        ' * Yaroslav Kotsur <yarikkotsur@gmail.com>\n' +
        ' * Distributed under MIT license\n' +
        ' */\n'
    },

    preprocess: {
      js: {
        src: 'src/build/main.js',
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    clean: {
      build: 'build'
    },

    uglify: {
      main: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js',
        options : {
          banner: '<%= meta.banner %>'
        }
      }
    },

    watch: {
      files: ['src/**/*.{js}'],
      tasks: ['preprocess']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['preprocess', 'watch']);
  grunt.registerTask('build', ['clean:build', 'preprocess', 'uglify']);
  grunt.registerTask('default', ['build']);
};