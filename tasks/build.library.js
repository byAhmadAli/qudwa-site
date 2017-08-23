/**
 * Grunt script to run r.js.
 * I found it easier to do a custom task than use 'grunt-contrib-requirejs'
 *
 * @see https://github.com/jrburke/r.js/wiki/Deployment-Techniques
 *
 * @author Ahmad Ali <ahmad.ali@CASHU3d.com>
 */
'use strict';

var requireJS = require('requirejs'),
	path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	md5 = require('./utils/md5');


module.exports = function(grunt) {
	grunt.registerTask('CASHUJS', 'Build CASHU Library', function() {
		grunt.config.files = [];
		console.log('starting CASHU Library..');

		var done = this.async(),
			options = this.options();
		
		if (!options.cashuBuildFile  || !options.vendorsBuildFile || !options.pagesBuildFile || !options.registryFile) {
			grunt.fail.fatal('No build file or registry passed!');
		} else {
			grunt.log.writeln('Reading %s',options.buildFile);
		}

		var registry = grunt.file.readJSON(options.registryFile);
		var paths = _.extend({},
			registry.paths.libs,
			registry.paths.library
		);

		var configTemplate = _.template(grunt.file.read(options.cashuBuildFile));
		var config = JSON.parse(configTemplate({
			paths:JSON.stringify(paths,null, '	'),
			shim:JSON.stringify(registry.shim,null, '	'),
			map:JSON.stringify(registry.map,null, '	')
		}));

		config.out = options.output + 'app.'+ md5(options.version) +'.js';
		
		grunt.log.writeln('');
		grunt.log.writeln('Building CASHU Library: ');
		grunt.log.writeln('---------------------------');


		grunt.file.write(options.output+'logs/build.json',JSON.stringify(config, null, '	'));

		requireJS.optimize(config, function(output) {
			grunt.log.writeln(output);
			grunt.file.write(options.output+'logs/cashu.build.txt',output);
			grunt.config.files.push({fullpath:config.out,path:'CASHUJS'});
		}, function(err) {	// Error handler
			grunt.fail.fatal('Build failure: ' +  err);
		});

		configTemplate = _.template(grunt.file.read(options.vendorsBuildFile));
		config = JSON.parse(configTemplate({
			paths:JSON.stringify(paths,null, '	'),
			shim:JSON.stringify(registry.shim,null, '	'),
			map:JSON.stringify(registry.map,null, '	')
		}));

		config.out = options.output + 'vendors.'+ md5(options.version) +'.js';


		requireJS.optimize(config, function(output) {

			grunt.log.writeln('Building CASHU Vendors: ');
			grunt.log.writeln('---------------------------');

			grunt.log.writeln(output);
			grunt.file.write(options.output+'logs/vendors.build.txt',output);
			grunt.config.files.push({fullpath:config.out,path:'CASHUJS'});
		}, function(err) {	// Error handler
			grunt.fail.fatal('Build failure: ' +  err);
		});


		/*configTemplate = _.template(grunt.file.read(options.componentsBuildFile));
		config = JSON.parse(configTemplate({
			paths:JSON.stringify(paths,null, '	'),
			shim:JSON.stringify(registry.shim,null, '	')
		}));


		requireJS.optimize(config, function(output) {

			grunt.log.writeln('Building CASHU Components: ');
			grunt.log.writeln('---------------------------');

			grunt.log.writeln(output);
			grunt.file.write(options.output+'logs/components.build.txt',output);
			grunt.config.files.push({fullpath:config.out,path:'CASHUJS',status:'created',version:options.version});
		}, function(err) {	// Error handler
			grunt.fail.fatal('Build failure: ' +  err);
		});*/

		var pages = grunt.file.readJSON(options.pagesBuildFile);
		
		//grunt.log.writeln(pages.optimize[0].path);
		for(var i = 0; i < pages.optimize.length; i++) {
			
	    	configTemplate = _.template(grunt.file.read(pages.optimize[i].path));
			config = JSON.parse(configTemplate({
				paths:JSON.stringify(paths,null, '	'),
				shim:JSON.stringify(registry.shim,null, '	')
			}));

			config.out = options.output + 'pages/' +pages.optimize[i].page +'.'+ md5(options.version) +'.js';

			requireJS.optimize(config, function(output) {

				grunt.log.writeln('Building CASHU Pages: ');
				grunt.log.writeln('---------------------------');

				grunt.log.writeln(output);
				grunt.file.write(options.output+'../logs/vendors.build.txt',output);
				grunt.config.files.push({fullpath:config.out,path:'CASHUJS',status:'created',version:options.version});
			}, function(err) {	// Error handler
				grunt.fail.fatal('Build failure: ' +  err);
			});
		}
		
		done();

	});
};
