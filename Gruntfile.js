module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      less: {
        files: ['stylesheets/**/*.less'],
        tasks: ['less']
      },
      css: {
        options: {
          livereload: true,
          debounceDelay: 1
        },
        files: ['stylesheets/**/*.css']
      }
    },
    less: {
      development: {
        options: {
          paths: ["stylesheets"],
          yuicompress: false
        },
        files: {
          "stylesheets/application.css": "stylesheets/application.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less']);
  grunt.registerTask('serve', ['less', 'watch']);

};