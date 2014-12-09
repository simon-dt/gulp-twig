var gulp = require('gulp');

gulp.task('compile', function () {
    'use strict';
    var twig = require('gulp-twig');
    return gulp.src('./index.twig')
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('data-example', function () {
    'use strict';

    var twig = require('gulp-twig');
    var data = require('gulp-data');

    return gulp.src('./index-json.twig')
        .pipe(data(function(file) {
            return require('./example/index-data.json');
        }))
        .pipe(twig())
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['compile', 'data-example']);
