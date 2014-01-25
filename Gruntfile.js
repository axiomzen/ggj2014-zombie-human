module.exports = function (grunt) {

  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadTasks('./tasks');

  grunt.initConfig({
    connect: {
      root: {
        options: {
          port: 5423,
          keepalive: true,
        }
      }
    }
  });

  grunt.registerTask('default', ['connect']);
  // grunt.registerTask('build', ['clean', 'concat', 'umd', 'uglify']);

};
