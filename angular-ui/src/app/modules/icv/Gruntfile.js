module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      production: {
        cwd: 'src', src: [ '*', 'libs/**', 'img/**', 'barrios/**' ], dest: 'build', expand: true
      },
      dev: { 
        cwd: 'src', src: [ 'scripts/**' ], dest: 'build/src/', expand: true 
      }
    },
    terser: {
      production: {
        options: {
          sourceMap: {url: 'icv.min.js.map'},
          
        },
        src: ['./src/scripts/scales.js', './src/scripts/icv.js'],
        dest: './build/icv.min.js'
      }
    },
    concat: {
      dev: {
        src : '<%= terser.production.src %>',
        dest : '<%= terser.production.dest %>'
      }
    },
    clean: {
      files: ['build']
    },
    jshint: {
      options: {
        esversion: 6,
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/scripts/*.js', 'src/*.js']
      }
    },
    "http-server": {
      dev: {
        root: "build",
        port: 8080,
        host: "127.0.0.1",
        cache: -1,
        showDir: true,
        autoIndex: true,
        ext: "html",
        runInBackground: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/scripts/*.js', 'src/*.js'],
        tasks: ['copy', 'jshint', 'terser'],
        options: {
          spawn: false,
        },
      },    
      html: {
        files: ['src/**.html'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-terser');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');

  // Default task(s).
  grunt.registerTask('default', ['copy', 'jshint', 'concat']);

//  grunt.registerTask('dev', ['copy', 'copy:dev','jshint', 'concat']);
  grunt.registerTask('dev', ['copy','jshint', 'terser']);

  grunt.registerTask('server', ['dev', 'http-server', 'watch']);

  grunt.registerTask('production', ['copy:production', 'jshint', 'terser:production']);

};