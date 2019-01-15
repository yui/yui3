#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI,
    json;

YUI({ useSync: true }).use('test', function(Y) {
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;

    Y.applyConfig({
        modules: {
            'get-vendor-test': {
                fullpath: path.join(__dirname, '../unit/assets/vendor-test.js'),
                requires: ['get', 'vendor-script-signed', 'test']
            },
            'vendor-script-signed': {
                fullpath: path.join(__dirname, '../assets/vendor-signed.js')
            }
        }
    });

    Y.use('get-vendor-test');

    Y.Test.Runner.setName('get cli tests');
    Y.Test.Runner.add(Y.GetTests.vendor);

});
