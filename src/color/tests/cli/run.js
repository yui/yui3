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
            'color-base-tests': {
                fullpath: path.join(__dirname, '../unit/assets/color-base-tests.js'),
                requires: [ 'test', 'dump', 'color-base' ]
            },
            'color-harmony-tests': {
                fullpath: path.join(__dirname, '../unit/assets/color-harmony-tests.js'),
                requires: [ 'test', 'dump', 'color-harmony' ]
            },
            'color-hsl-tests': {
                fullpath: path.join(__dirname, '../unit/assets/color-hsl-tests.js'),
                requires: [ 'test', 'dump', 'color-hsl' ]
            },
            'color-hsv-tests': {
                fullpath: path.join(__dirname, '../unit/assets/color-hsv-tests.js'),
                requires: [ 'test', 'dump', 'color-hsv' ]
            }
        }
    });

    Y.use('color-base-tests', 'color-harmony-tests', 'color-hsl-tests', 'color-hsv-tests');

    Y.Test.Runner._ignoreEmpty = true; //ArrayAssert's don't count

    Y.Test.Runner.setName('color cli tests');

});

