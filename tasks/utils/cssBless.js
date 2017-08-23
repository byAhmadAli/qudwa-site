'use strict';

var _ = require('lodash'),
	moment = require('moment'),
	md5 = require('./md5');

module.exports = function(grunt,files) {
	return _.transform(files, function(result, src, dest) {
		var minHash = md5(grunt.file.readJSON('package.json').version);
		var newDest = dest.replace(/\.css$/gi, '.' + minHash + '.css');
		result[newDest] =newDest.replace(/assets\/css/gi, 'assets/sass/bless');
		delete result[dest];
	});
};