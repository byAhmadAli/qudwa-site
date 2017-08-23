module.exports = function (string) {
	var md5 = require('crypto').createHash('md5');
	md5.update(string);
	return md5.digest('hex');
};