#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var base = path.join(__dirname, '../../');

var unitXML = fs.readFileSync(path.join(__dirname, '../tests/unit.xml'), 'utf8');

var lines = unitXML.split('\n');

var paths = [];

var inComment = false;
lines.forEach(function(line) {
    if (line.indexOf('<!--') > -1) {
        inComment = true;
    }
    if (line.indexOf('-->') > -1) {
        inComment = false;
    }
    if (!inComment) {
        if (line.indexOf('<url>') > -1) {
            var p = line.replace('<url>', '').replace('</url>', '').replace(/ /g, '').replace('\t', '');
            paths.push(path.join(p));
        }
    }
});

paths.shift();

module.exports = paths;
