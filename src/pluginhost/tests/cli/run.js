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
            'plugin-tests': {
                fullpath: path.join(__dirname, '../unit/assets/plugin-tests.js'),
                requires: ['base-base', 'base-pluginhost', 'base-build', 'plugin', 'test']
            }
        }
    });

    Y.use('plugin-tests');
    
    Y.Test.Runner.setName('plugin cli tests');
    
});

