var Twig = require('twig');
var map = require('map-stream');
var rext = require('replace-ext');
var gutil = require('gulp-util');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');

const PLUGIN_NAME = 'gulp-twig';

var twig = Twig.twig,
    includeCache = {};

module.exports = function (options) {
    'use strict';
    options = _.merge({
        data: {},
        includes: null,
        getIncludeId: function(filePath) {
            return filePath;
        }
    }, options || {});

    // Register includes
    // Thanks to https://github.com/backflip/gulp-twig
    if (options.includes) {
        if (!_.isArray(options.includes)) {
            options.includes = [options.includes];
        }

        options.includes.forEach(function(pattern) {
            glob.sync(pattern).forEach(function(file) {
                var id = options.getIncludeId(file),
                    changed = fs.statSync(file).mtime,
                    content;

                // Skip registering if include has not changed since last time
                if (includeCache[id] && includeCache[id].getTime() === changed.getTime()) {
                    return;
                }

                includeCache[id] = changed;

                content = fs.readFileSync(file, 'utf8').toString();

                twig({
                    id: id,
                    data: content
                });
            });
        });
    }

    function modifyContents(file, cb) {

        var data = typeof options.data === 'function' ? options.data(file) : options.data;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, "Streaming not supported!"));
        }

        data._file   = file;
        data._target = {
            path: rext(file.path, '.html'),
            relative: rext(file.relative, '.html')
        };

        var twigOpts = {
                allowInlineIncludes: true,
                data: file.contents.toString(),
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

        if (options.functions) {
            options.functions.forEach(function (func) {
                Twig.extendFunction(func.name, func.func);
            });
        }

        if (options.filters) {
            options.filters.forEach(function (filter) {
                Twig.extendFilter(filter.name, filter.func);
            });
        }

        if(options.extend) {
            Twig.extend(options.extend);
            delete options.extend;
        }

        template = twig(twigOpts);

        try {
            file.contents = new Buffer(template.render(data));
        }catch(e){
            if (options.errorLogToConsole) {
                gutil.log(PLUGIN_NAME + ' ' + e);
                return cb();
            }

            if (typeof options.onError === 'function') {
                options.onError(e);
                return cb();
            }
            return cb(new gutil.PluginError(PLUGIN_NAME, e));
        }

        file.path = rext(file.path, '.html');
        cb(null, file);
    }

    return map(modifyContents);
};
