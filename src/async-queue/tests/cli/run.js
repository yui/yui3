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
            'async-queue-tests': {
                fullpath: path.join(__dirname, '../unit/assets/async-queue-tests.js'),
                requires: ['async-queue', 'test']
            }
        }
    });

    Y.use('async-queue-tests');
    
    Y.Test.Runner.setName('async-queue cli tests');
    
});

