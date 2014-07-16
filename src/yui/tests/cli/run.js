#!/usr/bin/env node

process.chdir(__dirname);

var YUI_config = {
    gconfig: true
};

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI,
    json;


YUI.GlobalConfig = {
    globalConfig: true,
    modules: {
        'global-mod': {
            fullpath: path.join(__dirname, '../unit/assets/globalmod.js')
        }
    },
    groups: {
        //Just for code coverage..
        noop: {
            modules: {
                noop: {
                    fullpath: path.join(__dirname, '../unit/assets/noop.js')
                }
            }
        }
    }
};

YUI({
    useSync: true,
    logExclude: {Dom: true, Selector: true, Node: true, attribute: true, base: true, event: true, widget: true }
}).use('test', function(Y) {
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;


    var modules = {
        'seed-tests': {
            fullpath: 'seed-tests.js',
            requires: [ 'test']
        },
        'core-tests': {
            fullpath: 'core-tests.js',
            requires: [ 'classnamemanager']
        },
        'config-test': {
            fullpath: 'config-test.js'
        },

        'later-test': {
            fullpath: 'later-test.js'
        },
        'namespace-test': {
            fullpath: 'namespace-test.js'
        },
        'ua-data': {
            fullpath: 'ua-data.js'
        },
        'ua-yui-data': {
            fullpath: 'ua-yui-data.js',
            requires: [ 'ua-data' ]
        },
        'ua-tests': {
            fullpath: 'ua-tests.js',
            requires: [ 'ua-data', 'ua-yui-data', 'test' ]
        },
        'array-test': {
            fullpath: 'array-test.js',
            requires: ['test']
        },
        'object-test': {
            fullpath: 'object-test.js',
            requires: ['test']
        },
        'lang-test': {
            fullpath: 'lang-test.js',
            requires: ['test']
        },
        'es-modules-test': {
            fullpath: 'es-modules-test.js',
            requires: ['test']
        }
    };

    Object.keys(modules).forEach(function(name) {
        var mod = modules[name];
        mod.fullpath = path.join(__dirname, '../unit/assets', mod.fullpath);
    });

    modules['core-nodejs-tests'] = {
        fullpath: path.join(__dirname, './lib/nodejs-tests.js'),
        requires: ['test']
    };

    Y.applyConfig({
        modules: modules
    });

    Y.use(Object.keys(modules));

    Y.Test.Runner.setName('CORE cli tests');

});

