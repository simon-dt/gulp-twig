var map = require('map-stream');
var rext = require('replace-ext');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-twig';

module.exports = function (options) {
    'use strict';
    if (!options) {
        options = {};
    }

    function modifyContents(file, cb) {

        var data = file.data || options.data || {};

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, "Streaming not supported!"));
        }
        
        data._file   = file;
        if(options.changeExt == false){
            data._target = {
                 path: file.path,
                 relative: file.relative
             }           
        }else{
            data._target = {
                path: rext(file.path, '.html'),
                relative: rext(file.relative, '.html')
            }
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
        if (options.namespaces !== undefined) {
            twigOpts.namespaces = options.namespaces;
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

        file.path = data._target.path;
        cb(null, file);
    }

    return map(modifyContents);
};
