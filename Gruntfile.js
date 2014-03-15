
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
            js: {
                files: ['gruntfile.js', 'assets/js/normal/*.js'],
                tasks: ['jshint','uglify'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['assets/css/normal/*.css'],
                tasks: ['cssmin'],
                options: {
                    livereload: true
                }
            }
        },

    uglify: {
      js: {
        files: {
          'assets/js/all.min.js': [
            'assets/vendors/**/*.js',
            'assets/js/normal/*.js'
          ]
        }
      }

    }

    ,'json-minify': {
      build: {
        files: 'assets/data/data.json'
      }
    }

    ,cssmin: {
      combine: {
        files: {
          'assets/css/all.min.css': [
            'assets/vendors/**/*.css',
            'assets/css/normal/*.css'
          ]
        }
      }
    }

    ,jshint: {
      all: [
        'assets/js/normal/*.js'
      ]
    }
    

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-json-minify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', [
    'jshint', 
    'uglify', 
    'cssmin', 
    'json-minify',
    'watch'
  ]);
  
};