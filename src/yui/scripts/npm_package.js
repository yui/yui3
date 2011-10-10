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
    var str = 'var inst = require("../package").getInstance();\n';
    str += 'module.exports = inst.use("' + mod + '");\n';
    return str;
};

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

console.log('NPM Release Ready');
