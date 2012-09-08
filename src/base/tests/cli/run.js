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
            'base-core-tests': {
                fullpath: path.join(__dirname, '../unit/assets/base-core-tests.js'),
                requires: ['base-core', 'dump', 'test']
            },
            'base-tests': {
                fullpath: path.join(__dirname, '../unit/assets/base-tests.js'),
                requires: ['base', 'test']
            }
        }
    });

    Y.use('base-tests', 'base-core-tests');

    Y.Test.Runner._ignoreEmpty = true;
    
    Y.Test.Runner.setName('Base cli tests');
    
});

