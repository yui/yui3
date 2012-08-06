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
            'array-extras-test': {
                fullpath: path.join(__dirname, '../unit/assets/array-extras-test.js'),
                requires: [
                    'array-extras', 'test'
                ]
            },
            'array-invoke-tests': {
                fullpath: path.join(__dirname, '../unit/assets/array-invoke-tests.js'),
                requires: [
                    'array-invoke', 'test'
                ]
            },
            'arraylist-tests': {
                fullpath: path.join(__dirname, '../unit/assets/arraylist-tests.js'),
                requires: [
                    'arraylist', 'test'
                ]
            }
        }
    });

    Y.use('array-extras-test', 'array-invoke-tests', 'arraylist-tests');
    
    Y.Test.Runner.setName('Array Extras cli tests');
    
});

