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
    Y.Test.ArrayAssert = YUITest.ArrayAssert;

    Y.applyConfig({
        modules: {
            'batch-tests':  {
                fullpath: path.join(__dirname, '../unit/assets/batch-tests.js'),
                requires: [ 'promise', 'test' ]
            },
            'when-tests': {
                fullpath: path.join(__dirname, '../unit/assets/when-tests.js'),
                requires: ['promise', 'test']
            },
            'promise-tests':  {
                fullpath: path.join(__dirname, '../unit/assets/promise-tests.js'),
                requires: ['promise', 'test']
            },
            'aplus-tests': {
                fullpath: path.join(__dirname, './assets/aplus.js'),
                requires: ['promise', 'test']
            }
        }
    });

    Y.use('batch-tests', 'when-tests', 'promise-tests', 'aplus-tests');
    
    Y.Test.Runner.setName('yql cli tests');
    
});

