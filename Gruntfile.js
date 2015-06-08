module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    preprocess: {
      js: {
        src: 'src/build/main.js',
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    clean: {
      build: 'build',
      tmp: 'tmp'
    },

    uglify: {
      src: 'build/<%= pkg.name %>.js',
      dest: 'build/<%= pkg.name %>.min.js'
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
  grunt.registerTask('build', ['clean:build', 'preprocess', 'uglify', 'clean:tmp']);
  grunt.registerTask('default', ['build']);
};