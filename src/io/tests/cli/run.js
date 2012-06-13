#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    server = require('./server'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI,
    json;

var modules = require(path.join(__dirname, '../modules'));

Object.keys(modules).forEach(function(name) {
    modules[name].fullpath = path.join(__dirname, '../', modules[name].fullpath);
});

modules['nodejs-tests'] = {
    fullpath: path.join(__dirname, './nodejs-tests.js'),
    requires: [ 'test', 'querystring-parse-simple' ]
}

console.log('Starting up test server');
server.start();

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
        Y.IO.URLS[name] = 'http://127.0.0.1:8181/' + name;
    });

    Y.Test.Runner.setName('io-base cli tests');
    
    Y.Test.Runner.subscribe(YUITest.TestRunner.COMPLETE_EVENT, function() {
        console.log('Closing server');
        server.stop();
    });
});

