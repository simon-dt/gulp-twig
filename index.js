const through2 = require("through2");
const rext = require("replace-ext");
const log = require("fancy-log");
const PluginError = require("plugin-error");

const PLUGIN_NAME = "gulp-twig";

module.exports = function(options) {
    "use strict";

    function modifyContents(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(
                new PluginError(PLUGIN_NAME, "Streaming not supported!")
            );
        }

        const {
            changeExt = true,
            extname = ".html",
            useFileContents = false,
            twigParameters = {},
            data: optionsData,
            cache,
            functions,
            filters,
            extend,
            errorLogToConsole,
            onError
        } = options || {};

        const data = file.data || optionsData || {};

        const target =
            changeExt === false || extname === true
                ? {
                      path: file.path,
                      relative: file.relative
                  }
                : {
                      path: rext(file.path, extname || ""),
                      relative: rext(file.relative, extname || "")
                  };

        const Twig = require("twig");
        const { twig } = Twig;

        if (cache !== true) {
            Twig.cache(false);
        }

        if (functions) {
            functions.forEach(function(func) {
                Twig.extendFunction(func.name, func.func);
            });
        }

        if (filters) {
            filters.forEach(function(filter) {
                Twig.extendFilter(filter.name, filter.func);
            });
        }

        if (extend) {
            Twig.extend(extend);
        }

        const template = twig({
            ...twigParameters,
            async: false,
            path: file.path,
            data: useFileContents ? file.contents.toString() : undefined
        });

        try {
            file.contents = new Buffer.from(
                template.render({
                    ...data,
                    _target: target,
                    _file: file
                })
            );
        } catch (e) {
            if (errorLogToConsole) {
                log(PLUGIN_NAME + " " + e);
                return callback();
            }

            if (typeof onError === "function") {
                onError(e);
                return callback();
            }
            return callback(new PluginError(PLUGIN_NAME, e));
        }

        file.path = target.path;
        callback(null, file);
    }

    return through2.obj(modifyContents);
};
