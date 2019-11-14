var through2 = require('through2');
var rext = require('replace-ext');
var log = require('fancy-log');
var PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-twig';

module.exports = function (options) {
    'use strict';
    options = Object.assign({}, {
      changeExt: true,
      extname: '.html',
      useFileContents: false,

    }, options || {});

    function modifyContents(file, encoding, callback) {
        var data = file.data || Object.assign({}, options.data);

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported!'));
        }

        data._file   = file;
        if(options.changeExt === false || options.extname === true){
            data._target = {
                 path: file.path,
                 relative: file.relative
             }
        }else{
            data._target = {
                path: rext(file.path, options.extname || ''),
                relative: rext(file.relative, options.extname || '')
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

        if (options.useFileContents) {
          var fileContents = file.contents.toString();
          twigOpts.data = fileContents
        }

        template = twig(twigOpts);

        try {
            file.contents = new Buffer(template.render(data));
        }catch(e){
            if (options.errorLogToConsole) {
                log(PLUGIN_NAME + ' ' + e);
                return callback();
            }

            if (typeof options.onError === 'function') {
                options.onError(e);
                return callback();
            }
            return callback(new PluginError(PLUGIN_NAME, e));
        }

        file.path = data._target.path;
        callback(null, file);
    }

    return through2.obj(modifyContents);
};
