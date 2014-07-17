var map = require('map-stream');
var rext = require('replace-ext');

module.exports = function (options) {
    'use strict';
    if (!options) {
        options = {};
    }

    function modifyContents(file, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new Error('gulp-twig: Streaming not supported'));
        }

        var Twig = require('twig'),
            twig = Twig.twig,
            template = twig({
                path: file.path,
                async: false
            });

        file.contents = new Buffer(template.render(options.data));
        file.path = rext(file.path, '.html');
        cb(null, file);
    }

    return map(modifyContents);
};
