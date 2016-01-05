subtitlesApp.factory('fsutils', function () {
    var dir = require('node-dir');
    var fs = require('fs');
    var path = require('path')
    var fsutils = {};
    var match = new RegExp(/\.(mkv|ogg|avi|mov|wmv|mp4|m4p|m4v|mpg|mp2|mpeg|mpe|mpv|m2v)/g);

    fsutils.isMediaFile = function (fileName) {
        return match.test(fileName);
    };

    fsutils.getMediaFiles = function (path_string) {
        if (fs.lstatSync(path_string).isDirectory()) {
            var p1 = new Promise(function (resolve, reject) {
                dir.files(path_string, function (err, files) {
                    if (err) throw err;
                    var t = files.filter(fsutils.isMediaFile);
                    var res = [];
                    for (var index = 0; index < t.length; index++) {
                        var element = {};
                        element.path = t[index];
                        element.name = path.basename(t[index]);
                        res.push(element);
                    }
                    resolve(res);
                });
            });
            return p1;
        }
    };

    fsutils.isDir = function (path_string) {
        return fs.lstatSync(path_string).isDirectory()
    };

    return fsutils;
});
