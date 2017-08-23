'use strict';

var _ = require('lodash'),
	moment = require('moment'),
	md5 = require('./md5');

module.exports = function(grunt,files) {
	console.log('Hash : ', md5(grunt.file.readJSON('package.json').version));
	return _.transform(files, function(result, src, dest) {
		var minHash = md5(grunt.file.readJSON('package.json').version);
    grunt.log.writeln('css Hash : ' + minHash );
		var newDest = dest.replace(/\.css$/gi, '.' + minHash + '.css');
		result[newDest.replace(/assets\/css/gi, 'assets/sass/bless')] = src.replace(/assets\/css\//gi, 'assets/sass/bless');
		delete result[dest];
	});
};