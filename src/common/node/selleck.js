#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync;

var base = path.join(__dirname, '../../');

var dirs = fs.readdirSync(base);

var examples = [];

var parseJSON = function(file) {
    var json = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (json && json.examples) {
        var name = json.name;
        json.examples.forEach(function(c) {
            examples.push(name + '/' + c.name + '.html');
        });
    }
};

var walk = function(dir) {
    if (!exists(dir)) {
        return;
    }
    var dirs = fs.readdirSync(dir);
    dirs.forEach(function(d) {
        var p = path.join(dir, d);
        var stat = fs.statSync(p);
        if (stat.isDirectory()) {
            walk(p);
        }
        if (d === 'component.json') {
            parseJSON(p);
        }
    });
};


dirs.forEach(function(dir) {
    var docs = path.join(base, dir, 'docs');
    walk(docs);
});

examples.sort();

module.exports = examples;

