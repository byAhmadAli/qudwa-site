'use strict';
var _ = require('lodash'),
	moment = require('moment'),
	md5 = require('./tasks/utils/md5'),
	minFactor = require('./tasks/utils/signature'),
	cssHash = require('./tasks/utils/cssHash'),
	cssBless = require('./tasks/utils/cssBless');


module.exports = function(grunt) {
	grunt.log.header = function() {};
	require('time-grunt')(grunt);

	var cssMap = grunt.file.readJSON('assets/sass/cssMap.json');

  //var pagesMap = grunt.file.readJSON('assets/library/pages/pagesMap.json');
  	var sassLtr = {
		options: {
			includePaths: ['libs/bootstrap-sass/assets/stylesheets', 'libs/font-awesome/scss'],
			outputStyle: 'expanded',
			line_comments: 'true'
		},
		files: _.transform(cssMap.compile.ltr, function(result, src, dest) {
            result[dest.replace(/css\//gi, 'sass/bless/')] = src;
        })
	};
	var sassRtl = _.cloneDeep(sassLtr);
	sassRtl.files =  _.transform(cssMap.compile.rtl, function(result, src, dest) {
        result[dest.replace(/css\//gi, 'sass/bless/')] = src;
    });

	
	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    version: md5('<%= pkg.version %>'),
    assemble: {
      options: {
        layout: "web/layouts/default.html",
        flatten: true,
        data: 'web/data/<%= language %>/*.{json,yml}',
        lang: '<%= language %>',
        oppositeLang: '<%= oppositeLanguage %>',
        partials: ['web/includes/**/*.html' ],
        helpers: ['web/helpers/*.js'],
        oppositeDirection: '<%= oppositeDirection %>',
		defaultFloat: '<%= defaultFloat %>',
		version: '<%= pkgVersion %>',
		direction: '<%= direction %>'
      },
      pages: {
        files: {
          'dist/<%= language %>/': ['web/pages/*.html']
        }
      }
	},
    sass: {
		ltr: sassLtr,
		rtl: sassRtl
	},
	bless: {
      dev: {
	      options: {
	        cacheBuster: true,
	        compress: false,
	        logCount : true
	      },
	      files:  _.transform(_.extend(cssMap.compile.ltr,cssMap.compile.rtl), function(result, src, dest) {
	      	var minHash = md5(grunt.file.readJSON('package.json').version);
					var newDest = dest.replace(/\.css$/gi, '.' + minHash + '.css');

          result[dest] = dest.replace(/assets\/css\//gi, 'assets/sass/bless/');
        })
	    },
	    deployment: {
	      options: {
	        cacheBuster: false,
	        compress: true,
	        logCount : true
	      },
	      files: cssBless(grunt,cssMap.optimize)
	    }
    },
    csscount: {
		  dev: {
		    src:  _.filter(_.keys(cssMap.compile.ltr), function(obj) {
				  return ~obj.toLowerCase().indexOf("common");
				}),
		    //src: cssHash(grunt,cssMap.optimize).files,
		    options: {
		      maxRules: 4000
		    }
		  }
	},
	cssmetrics: {
	    dev: {
	      src: _.filter(_.keys(cssMap.compile.ltr), function(obj) {
				  return  ~obj.toLowerCase().indexOf("common");
				}),
	      options: {
		      quiet: false,
		      maxSelectors: 4096,
		      maxFileSize: 10240000
		    }
	    }
    },
	sassDirection: _.toArray(cssMap.compile.ltr),
	cssmin: {
		dist: {
			files: 'dist/<%= language %>/css/common.css'
		}
	},
    copy:{
      main: {
        files: [
          {
            expand: true,
            cwd : 'assets/' ,
            src: ['{images,fonts}/**/*'],
            dest: 'dist/<%= language %>'
          }
        ],
      },
      css: {
        files: [
          {
            expand: true,
            cwd : 'assets/' ,
            src: ['css/<%= language %>/*.css'],
            dest: 'dist/<%= language %>'
          }
        ],
      },
      fontAwesome:{
        files: [
          {
            expand: true,
            cwd : 'libs/font-awesome/fonts/' ,
            src: ['**/*'],
            dest: 'dist/<%= language %>/css/fonts/'
          }
        ]
      },
      js: {
        files: [
            {
                expand: true,
                cwd : 'assets/js/' ,
                src: ['**/*.js'],
                dest: 'dist/js/'
            }
        ]
      },
      jslibs: {
        files: [
            {
                expand: true,
                cwd : 'libs/' ,
                src: ['uikit/js/**/*', 'slick-carousel/slick/*.js', 'jquery/dist/*.js', 
                  'jquery.countdown/dist/*.js', 'bootstrap-sass/assets/javascripts/**/*.js'],
                dest: 'dist/js/libs'
            }
        ]
      },
      
      slick:{
        files: [
          {
            expand: true,
            cwd : 'libs/slick-carousel/slick/fonts/',
            src: ['**/*'],
            dest: 'dist/<%= language %>/css/fonts/'
          }
        ]
      }
    },
    uglify: {
        optimizeMxd: {
            files: [{
                expand: true,
                cwd: 'dist/js/',
                src: ['**/*.'+ md5(grunt.file.readJSON('package.json').version)+'.js'],
                dest: 'dist/js/'
            }],
        }
    },
    clean: {
    	dist: ['dist/{**/*,!logs}'],
      build:['assets/css','assets/sass/bless'],
    	buildLtr: ['dist/en/css/ar', 'dist/en/images/ar'],
    	buildRtl: ['dist/ar/css/en','dist/ar/images/en'],
	    html: ['dist/<%= language %>/*.html'],
	    css: ['dist/<%= language %>/css/*.css'],
	    js: ['dist/js'],
        images: ['dist/<%= language %>/images']
	},
    watch:{
      assemble:{
        files:[
          'web/includes/**/*.html', 
          'web/layouts/*.html', 
          'web/pages/**/*.html',
          'web/data/**/*.{json,yml}'
        ],
        tasks:['build-en','build-ar']
      },
      sass:{
      	files:['assets/sass/**/**/*.{scss,sass}'],
      	tasks:['default']
      },
      js:{
      	files:['assets/js/**/*.{js,json}'],
      	tasks:['default']
      }
    }
  });
	
	grunt.loadTasks('tasks');

	require('load-grunt-tasks')(grunt);
  
  	grunt.loadNpmTasks('assemble');
  	grunt.loadNpmTasks('grunt-contrib-clean');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-sass');
  	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-bless');
	grunt.loadNpmTasks('grunt-css-count');
	grunt.loadNpmTasks('grunt-css-metrics');

	grunt.task.registerTask('log', 'Create a new release build log files on each run.', function() {
		console.log('Date: '+ new Date());
		minFactor();
	});

	grunt.registerTask('cssBuild','building minFactor css', function () {
		grunt.log.writeln('Building minFactor CSS Framework');
		grunt.log.writeln('---------------------------');
	});
	grunt.registerTask('hash','get hash for current version', function () {
		console.log('build Version : ', grunt.file.readJSON('package.json').version);
		console.log('build Hash : ', md5(grunt.file.readJSON('package.json').version));
	});
	grunt.registerTask('build-en', function() {
		grunt.config.set('language', 'en');
		grunt.config.set('oppositeLanguage', 'ar');
		grunt.config.set('oppositeDirection', 'right');
		grunt.config.set('defaultFloat', 'left');
	  	grunt.config.set('direction', 'ltr');
	  	grunt.config.set('pkgVersion', md5(grunt.file.readJSON('package.json').version));




		grunt.task.run(['buildCSSLtr', 'copy', 'cssmin', 'assemble']);
		console.log('=============english');
	});
	grunt.registerTask('build-ar', function() {
		grunt.config.set('language', 'ar');
		grunt.config.set('oppositeLanguage', 'en');
		grunt.config.set('oppositeDirection', 'left');
		grunt.config.set('defaultFloat', 'right');
		grunt.config.set('direction', 'rtl');
	  	grunt.config.set('pkgVersion', md5(grunt.file.readJSON('package.json').version));




      grunt.task.run(['buildCSSRtl', 'copy', 'cssmin', 'assemble']);
		console.log('=================arabic');
	});


	grunt.registerTask('buildCSSLtr', ['cssBuild', 'sass:ltr', 'bless:dev']);
	grunt.registerTask('buildCSSRtl', ['cssBuild', 'sass:rtl', 'bless:dev']);

	
 	grunt.registerTask('default', ['log', 'hash', 'clean:dist', 'build-en','build-ar', 'copy', 'clean:build', 'clean:buildLtr', 'clean:buildRtl']);
};