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


var monitor = require('respawn')(['livereload'], {
    // env: {ENV_VAR:'test'}, // set env vars
    // cwd: '.',              // set cwd
    maxRestarts:10,        // how many restarts are allowed within 60s
    sleep:1000,            // time to sleep between restarts
});

monitor.start();


function liveReload(){
  // try{
  //   server = require('livereload').createServer();
  //   server.watch(__dirname);
  // } catch (e) {
  //   console.log("livereload err", e)
  //   liveReload()
  // }
}

liveReload()
