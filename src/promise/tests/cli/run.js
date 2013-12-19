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
            'tests-promise-utils': {
                fullpath: path.join(__dirname, '../unit/assets/tests-promise-utils.js'),
                requires: ['promise', 'test']
            },
            'batch-tests':  {
                fullpath: path.join(__dirname, '../unit/assets/batch-tests.js'),
                requires: ['tests-promise-utils']
            },
            'when-tests': {
                fullpath: path.join(__dirname, '../unit/assets/when-tests.js'),
                requires: ['tests-promise-utils']
            },
            'promise-tests':  {
                fullpath: path.join(__dirname, '../unit/assets/promise-tests.js'),
                requires: ['tests-promise-utils']
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

