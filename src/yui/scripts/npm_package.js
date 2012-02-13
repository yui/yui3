#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    YUI = require(path.join(__dirname, '../../../build/yui-nodejs/yui-nodejs')).YUI,
    Y,
    exec = require('child_process').exec;

YUI.Env.core = [];
Y = YUI(); //This makes YUI.Env.aliases valid

console.error('Prepping release for npm');

var start = process.argv[2];

if (!start) {
    console.error('No out directory given');
    process.exit(1);
}

start = path.resolve(start);

if (!path.existsSync(start)) {
    console.error('Out directory does not exist, exiting..');
    process.exit(1);
}

process.chdir(start);

var makeIndex = function(mod, p) {
    var o = '../index';
    if (p) {
        o = './index';
    }
    var str = 'var inst = require("' + o + '").getInstance();\n';
    str += 'module.exports = inst.use("' + mod + '");\n';
    return str;
};

var makeDebug = function(mod, p) {
    var o = '../index';
    if (p) {
        o = './index';
    }
    var str = 'var inst = require("' + o + '").getInstance();\n';
    str += 'inst.applyConfig({ debug: true, filter: "debug" });\n';
    str += 'module.exports = inst.use("' + mod + '");\n';
    return str;
};

console.error('Writing index.js files');
var dirs = fs.readdirSync(start);
dirs.forEach(function(mod) {
    var p = path.join(start, mod, 'index.js');
    var d = path.join(start, mod, 'debug.js');
    var stat = fs.statSync(path.join(start, mod))
    if (stat.isDirectory()) {
        fs.writeFileSync(p, makeIndex(mod), 'utf8');
        fs.writeFileSync(d, makeDebug(mod), 'utf8');
    }
});
console.error('Index files written');

console.error('Writing seed debug file');
var index = 'exports.path = function() {' + 
    '   return __dirname;' +
    '};\n' + 
    'var YUI = require("./yui-nodejs/yui-nodejs-debug").YUI;\n' +
    'YUI.applyConfig({ debug: true, filter: "debug" });\n' +
    'exports.YUI = YUI;';

var p = path.join(start, 'debug.js');
fs.writeFileSync(p, index, 'utf8');

console.error('Writing alias files');
Object.keys(YUI.Env.aliases).forEach(function(mod) {
    var index = makeIndex(mod, true);
    var p = path.join(start, mod + '.js');
    fs.writeFileSync(p, index, 'utf8');
});

console.error('NPM Release Ready');
