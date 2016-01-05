subtitlesApp.controller('SubtitlesController', ['$scope', 'opensubtitles', 'fsutils', function ($scope, opensubtitles, fsutils) {
    $scope.lang = 'hun';
    $scope.movieFiles = [];
    $scope.loading = false;
	
    // prevent default behavior from changing page on dropped file
    window.ondragover = function (e) { e.preventDefault(); return false };
    window.ondrop = function (e) { e.preventDefault(); return false };

    var holder = document.getElementById('holder');
    holder.ondrop = function (e) {
        "use strict";

        e.preventDefault();
        $scope.loading = true;

        var movieFiles = [];
        var promises = [];
        // greate movie file list
        for (var i = 0; i < e.dataTransfer.files.length; ++i) {
            var droppedFile = e.dataTransfer.files[i];
            if (fsutils.isDir(droppedFile.path)) {
                var p = fsutils.getMediaFiles(droppedFile.path);
                promises.push(p);
                p.then(function (files) {
                    movieFiles = movieFiles.concat(files);
                });
            } else if (fsutils.isMediaFile(droppedFile.path)) {
                movieFiles.push(droppedFile);
            }
        }

        // wait for directory lookups
        Promise.all(promises).then(function () {
            // download subtitles
            for (var i = 0; i < movieFiles.length; ++i) {
                let movieFile = movieFiles[i];
                movieFile.loading = true;
                $scope.movieFiles.push(movieFile);
                $scope.$apply();

                opensubtitles.getResults(movieFile, $scope.lang, function (results) {
                    movieFile.results = results;
                    //$scope.$apply();

                    opensubtitles.downloadOne(results, movieFile, function () {
                        movieFile.loading = false;
                        $scope.loading = false;
                        $scope.$apply();
                        //console.log('done');
                        //console.log(movieFile.name);
                    });
                });
            }
        });
        
        return false;
    };

    $scope.downloadNextSub = function (movieFile) {
        $scope.loading = true;
        movieFile.loading = true;

        opensubtitles.downloadOne(movieFile.results, movieFile, function () {
            $scope.loading = false;
            movieFile.loading = false;
            $scope.$apply();
        });
    };

}]);