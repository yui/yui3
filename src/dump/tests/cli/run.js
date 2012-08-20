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
    Y.ObjectAssert = YUITest.ObjectAssert;

    Y.applyConfig({
        modules: {
            'dump-tests': {
                fullpath: path.join(__dirname, '../unit/assets/dump-tests.js'),
                requires: ['dump', 'test']
            }
        }
    });

    Y.use('dump-tests');
    
    Y.Test.Runner.setName('Dump cli tests');
    
});

