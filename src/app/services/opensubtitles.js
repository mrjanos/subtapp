subtitlesApp.factory('opensubtitles', function () {
	var opensubtitles = require('opensubtitles-client');

	var opensubtitlesService = {};

	opensubtitlesService.getSubtitle = function (file, lang, callback) {
		//login to get the token
		opensubtitles.api.login().done(function (token) {
			//search for subtitle
			opensubtitles.api.searchForFile(token, lang, file).done(function (results) {
				opensubtitles.downloader.download(results, 1, file, function () {
					opensubtitles.api.logout(token).done(callback);
				});
			});
		});
	};

	opensubtitlesService.getResults = function (file, lang, callback) {
		opensubtitles.api.login().done(function (token) {
			//search for subtitle
			opensubtitles.api.searchForFile(token, lang, file.path).done(function (results) {
				opensubtitles.api.logout(token).done(function () {
					callback(results);
				});
			})
		});
	};

	opensubtitlesService.downloadOne = function (results, file, callback) {
		//login to get the token
		opensubtitles.api.login().done(function (token) {
			opensubtitles.downloader.download(results, 1, file.path, function () {
				opensubtitles.api.logout(token).done(callback);
			});
		});
	};

	opensubtitlesService.downloadAll = function (file, lang, callback) {
		//login to get the token
		opensubtitles.api.login().done(function (token) {
			//search for subtitle
			opensubtitles.api.searchForFile(token, lang, file).done(function (results) {
				opensubtitles.downloader.download(results, results.length, file, function () {
					opensubtitles.api.logout(token).done(callback);
				});
			});
		});
	};

	return opensubtitlesService;
});