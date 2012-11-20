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
    Y.ArrayAssert = YUITest.ArrayAssert;

    Y.applyConfig({
        modules: {
            'loader-tests': {
                fullpath: path.join(__dirname, '../unit/assets/loader-tests.js'),
                requires: ['test']
            }
        }
    });

    Y.use('loader-tests');
    
    Y.Test.Runner.setName('Loader cli tests');
    
});

