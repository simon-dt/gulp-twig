var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var twig = require('../');

require('mocha');

describe('gulp-twig', function () {

    it('should compile twig templates to html files', function (done) {
        var twg = twig({
            data: {
                title: "twig"
            }
        });

        var fakeFile = new gutil.File({
            base: "test/",
            cwd: "test/",
            path: path.join(__dirname, '/templates/file.twig'),
            contents: fs.readFileSync(__dirname + '/templates/file.twig')
        });

        twg.on('data', function (newFile) {
            should.exist(newFile);
            should.exist(newFile.contents);
            should.exist(newFile.path);
            String(newFile.contents).should.equal(fs.readFileSync(__dirname + '/expected/file.html', 'utf8'));
            done();
        });
        twg.write(fakeFile);
    });

});
