#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;


console.log('Prepping release for npm');

var start = process.argv[2];

if (!start) {
    console.error('No out directory given');
    process.exit(1);
}

if (!path.existsSync(start)) {
    console.error('Out directory does not exist, exiting..');
    process.exit(1);
}

process.chdir(start);

var makeIndex = function(mod) {
    var str = 'var mod = "' + mod + '";\n';
    str += 'var YUI = require("../yui-nodejs/yui-nodejs").YUI;\n';
    str += 'module.exports = YUI({ useSync: true }).use(mod);\n';
    return str;
};

var packageJS = 'exports.path = function() { return __dirname; };\n';
packageJS += 'exports.YUI = require("./yui-nodejs/yui-nodejs").YUI;\n';
packageJS += 'exports.use = exports.useSync = function() {\n';
packageJS += '      var YUI = require("./yui-nodejs/yui-nodejs").YUI;\n';
packageJS += '      var Y = YUI({ useSync: true });\n';
packageJS += '      var Y = Y.use.apply(Y, arguments);\n';
packageJS += '      return Y;\n';
packageJS += '};\n';



console.log('Writing index.js files');
var dirs = fs.readdirSync(start);
dirs.forEach(function(mod) {
    var p = path.join(start, mod, 'index.js');
    var stat = fs.statSync(path.join(start, mod))
    if (stat.isDirectory()) {
        fs.writeFileSync(p, makeIndex(mod), 'utf8');
    }
});
console.log('Index files written');

fs.writeFileSync(path.join(start, 'package.js'), packageJS, 'utf8');

console.log('NPM Release Ready');
