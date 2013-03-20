#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI,
    json;


YUI({useSync: true }).use('test', function(Y) {
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;

    Y.applyConfig({
        modules: {
            'date-math-tests': {
                fullpath: './assets/date-math-tests.js',
                fullpath: path.join(__dirname, '../unit/assets/date-math-tests.js'),
                requires: [ "test", "datatype-date" ]
            }
        }
    });

    Y.use('date-math-tests');
    
    Y.Test.Runner.setName('date-math cli tests');
    
});

