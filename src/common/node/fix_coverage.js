#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    xmlFile = path.join(__dirname, '../tests/coverage.xml');

var xml = fs.readFileSync(xmlFile, 'utf8');
xml = xml.split('\n');

var base = path.join(__dirname, '../../');
var remove = {};

xml.forEach(function(line, key) {
    line = line.trim();
    if (line.indexOf('<url>') > -1) {
        line = line.replace('<url>', '').replace('</url>', '');
        var file = path.join(base, line);
        if (!exists(file)) {
            remove[key] = true;
        }
    }
});

if (Object.keys(remove).length) {
    console.log('removing', Object.keys(remove).length, 'missing tests');
    var newXML = [];
    xml.forEach(function(line, key) {
        if (!remove[key]) {
            newXML.push(line);
        } else {
            console.log('Removing: ', line);
        }
    });
    fs.writeFileSync(xmlFile, newXML.join('\n'), 'utf8');
}

