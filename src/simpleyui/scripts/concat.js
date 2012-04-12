#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    outFile = path.join(__dirname, '../js/concat.js'),
    base = path.join(__dirname, '../../../', 'build/'),
    YUI = require(path.join(base, 'yui/yui.js')).YUI;

var Y = YUI();

//Tell the UA we are not in Node.js so that 
//Node.js modules are not resolved and loaded

Y.UA.nodejs = false;

var loader = new Y.Loader({
    base: base,
    filter: 'debug',
    ignoreRegistered: true,
    require: [
        'yui-base',
        'oop',
        'dom',
        'event-custom',
        'event-base',
        'pluginhost',
        'node',
        'event-delegate',
        'io-base',
        'json-parse',
        'transition',
        'selector-css3',
        'dom-style-ie']
});

var out = loader.resolve(true);

var str = '';

out.js.forEach(function(f) {
    str += fs.readFileSync(f, 'utf8');
});

fs.writeFileSync(outFile, str, 'utf8');
console.log('Wrote (' + out.js.length + ') files to js/concat.js');
