#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    server = require('./lib/server'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI,
    port = ('TEST_PORT' in process.env ? parseInt(process.env.TEST_PORT, 10) : 4000),
    json;

if (!port || isNaN(port)) {
    port = 4000;
}

console.log('Using port', port);

var modules = require(path.join(__dirname, '../unit/modules'));

Object.keys(modules).forEach(function(name) {
    modules[name].fullpath = path.join(__dirname, '../unit', modules[name].fullpath);
});

modules['nodejs-tests'] = {
    fullpath: path.join(__dirname, './lib/nodejs-tests.js'),
    requires: [ 'test', 'querystring-parse-simple' ]
}

YUI({useSync: true }).use('test', function(Y) {
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;

    Y.applyConfig({
        modules: modules
    });

    Y.use(Object.keys(modules));
    
    //Setup the dynamic server urls
    Y.Object.each(Y.IO.URLS, function(url, name) {
        Y.IO.URLS[name] = 'http://127.0.0.1:' + port + '/tests/src/io/tests/unit/' + url;
    });

    Y.Test.Runner.setName('io-base cli tests');
    
});

