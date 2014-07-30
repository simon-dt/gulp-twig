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
            twigOpts = {
                path: file.path,
                async: false
            },
            template;

        if (options.debug !== undefined) {
            twigOpts.debug = options.debug;
        }
        if (options.trace !== undefined) {
            twigOpts.trace = options.trace;
        }
        if (options.base !== undefined) {
            twigOpts.base = options.base;
        }
        if (options.cache !== true) {
            Twig.cache(false);
        }

        template = twig(twigOpts);
        file.path = rext(file.path, '.html');
        cb(null, file);
    }

    return map(modifyContents);
};
