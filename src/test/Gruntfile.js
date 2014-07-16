module.exports = function(grunt) {

    var path = require('path'),
        LIB = path.join(process.cwd(), '../../../', 'yuitest', 'javascript', 'src');

    grunt.registerTask('prep', 'Prep YUITest import', function() {
        grunt.log.write('Looking for YUITest'.green);
        if (!grunt.file.exists(LIB)) {
            grunt.log.writeln('');
            grunt.fail.fatal('Could not locate YUITest repo: ' + LIB + '\nDid you clone it above the yui3 repo?');
        }
        grunt.log.writeln('...OK'.white);
    });

    grunt.registerTask('clean', 'Clean Source Tree', function() {
        var files = grunt.file.expand('js/'+'*.js');
        files.forEach(function(file) {
            grunt.log.writeln('Deleting: '.red + file.cyan);
            grunt.file['delete'](file);
        });
    });

    var genericImport = function(type) {
        var files = grunt.file.expand({ force: true }, path.join(LIB, type, '/') + '*.js');
        files.forEach(function(file) {
            var src = path.relative(process.cwd(), file),
                dest = 'js/' + path.basename(file);

            grunt.log.writeln('Copying: '.green + src.cyan + ' to ' + dest.cyan);
            grunt.file.copy(src, dest);
        });
    };

    grunt.registerTask('import-asserts', 'Import Asserts', function() {
        genericImport('asserts');
    });

    grunt.registerTask('import-errors', 'Import Errors', function() {
        genericImport('errors');
    });

    grunt.registerTask('import-mocks', 'Import Mocks', function() {
        genericImport('mock');
    });

    grunt.registerTask('import-core', 'Import Core', function() {
        genericImport('core');
        var file = path.join(LIB, 'util', 'EventTarget.js'),
            src = path.relative(process.cwd(), file),
            dest = 'js/' + path.basename(file);

        grunt.log.writeln('Copying: '.green + src.cyan + ' to ' + dest.cyan);
        grunt.file.copy(src, dest);
    });

    grunt.registerTask('import-reporting', 'Import Reporting', function() {
        genericImport('reporting');
        var file = path.join(LIB, 'web', 'Reporter.js'),
            src = path.relative(process.cwd(), file),
            dest = 'js/' + path.basename(file);

        grunt.log.writeln('Copying: '.green + src.cyan + ' to ' + dest.cyan);
        grunt.file.copy(src, dest);
    });

    grunt.registerTask('import-wrapper', 'Import Wrapper', function() {
        var files = grunt.file.expand('./scripts/' + '*.js');
        files.forEach(function(file) {
            var src = file,
                dest = path.join('js', path.basename(file));
            grunt.log.writeln('Copying: '.green + src.cyan + ' to ' + dest.cyan);
            grunt.file.copy(src, dest);
        });
    });

    grunt.registerTask('fix-docs', 'Fixing API Docs', function() {
        var files = grunt.file.expand('./js/' + '*.js');
        files.forEach(function(file) {
            grunt.log.writeln('Processing: '.green + file.cyan);
            var str = grunt.file.read(file);

            str = str.replace(/\r\n/g, '\n');
            str = str.replace(/module yuitest/g, 'module test');
            str = str.replace(/namespace YUITest/g, 'namespace Test');
            str = str.replace(/namespace  YUITest/g, 'namespace Test');
            str = str.replace(/namespace   YUITest/g, 'namespace Test');
            str = str.replace(/class YUITest/g, 'class Test');
            str = str.replace(/\{YUITest/g, '{Test');
            str = str.replace(/@class /g, '@module test\n * @class ');
            str = str.replace(/@prop /g, '@property ');

            grunt.file.write(file, str);
        });
    });


    grunt.registerTask('import', [
        'import-core',
        'import-asserts',
        'import-errors',
        'import-reporting',
        'import-mocks',
        'import-wrapper',
    ]);

    grunt.registerTask('all', [
        'prep',
        'clean',
        'import',
        'fix-docs'
    ]);

    grunt.registerTask('default', ['all']);

};



