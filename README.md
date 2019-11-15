[![Build Status](https://travis-ci.org/zimmen/gulp-twig.png?branch=master)](https://travis-ci.org/zimmen/gulp-twig)

<table>
<tr>
<td>Package</td><td>gulp-twig</td>
</tr>
<tr>
<td>Description</td>
<td>Twig plugin for gulp.js, The streaming build system</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 4</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>
</tr>
</table>

Compile [Twig.js](https://github.com/justjohn/twig.js) templates with Gulp. Build upon [Twig.js](https://github.com/justjohn/twig.js) , the JS port of the Twig templating language by John Roepke.

You can use this plugin with [gulp-data](https://www.npmjs.com/package/gulp-data).

## Usage

### Install

```bash
npm install gulp-twig --save
```

### Example

```html
{# index.twig #}
{% extends "layout.twig" %}

{% block page %}
    <header>
        <h1>Gulp and Twig.js</h1>
    </header>
    <p>
        This page is generated by Twig.js using the gulp-twig gulp plugin.
    </p>
    <ul>
        {% for value in benefits %}
            <li>{{ value }}</li>
        {% endfor %}
    </ul>
{% endblock %}
```

```html
{# layout.twig #}
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="A demo of how to use gulp-twig" />
        <meta name="author" content="Simon de Turck" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <title>{{ title }}</title>
    </head>
    <body>
        <section>
            {% block page %}{% endblock %}
        </section>
    </body>
</html>
```

```javascript
var gulp = require('gulp');

gulp.task('compile', function() {
    'use strict';
    var twig = require('gulp-twig');
    return gulp
        .src('./index.twig')
        .pipe(
            twig({
                data: {
                    title: 'Gulp and Twig',
                    benefits: ['Fast', 'Flexible', 'Secure'],
                },
            }),
        )
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['compile']);
```

### Options:

**data**: [object| _The data that is exposed in the twig files. Or use gulp-data to pipe files directly into gulp-twig_

**errorLogToConsole**: [true|false] _logs errors to console (defaults to false)_

**onError**: [function] _handle error yourself_

**cache**: [true|false] _enables the Twig cache. (defaults to false)_

**extend**: [function (Twig)] _extends Twig with new tags types. The Twig attribute is Twig.js's internal object. [Read more here](https://github.com/justjohn/twig.js/wiki/Extending-twig.js-With-Custom-Tags)_

**extname**: [string|true|false] _output file extension including the '.' like path.extname(filename). Use `true` to keep source extname and a "falsy" value to drop the file extension_

**useFileContents**: [true|false] _use file contents instead of file path (defaults to false) [Read more here](https://github.com/zimmen/gulp-twig/issues/30)_

**twigParameters**: [object] _Parameters for creating a Twig template._

- **base**: [string] _sets the views base folder. Extends can be loaded relative to this path_

- **debug**: [true|false] _enables debug info logging (defaults to false)_

- **trace**: [true|false] _enables tracing info logging (defaults to false)_

- **strict_variables**: [true|false] _If set to false, Twig will silently ignore invalid variables (variables and or attributes/methods that do not exist) and replace them with a null value. When set to true, Twig throws an exception instead (default to false)._

**functions**: [array] _extends Twig with given function objects. (default to undefined)_

```javascript
[
    {
        name: 'nameOfFunction',
        func: function(args) {
            return 'the function';
        },
    },
];
```

**filters**: [array] _extends Twig with given filter objects. (default to undefined)_

```javascript
[
    {
        name: 'nameOfFilter',
        func: function(args) {
            return 'the filter';
        },
    },
];
```

### LICENSE

(MIT License)

Copyright (c) 2015 Simon de Turck <simon@zimmen.com> www.zimmen.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
