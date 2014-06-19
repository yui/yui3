#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync;

var base = path.join(__dirname, '../../');

var dirs = fs.readdirSync(base);

var examples = [];

var ignore = function(json) {

    if (json.name === 'test' || json.name.indexOf('-deprecated') > 0) {
        return true;
    }

    return false;
};

var parseJSON = function(file) {
    var json = JSON.parse(fs.readFileSync(file, 'utf8'));
    var windows = {};
    if (ignore(json)) {
        return;
    }
    if (json && json.examples) {
        var name = json.name;
        json.examples.forEach(function(c) {
            if ('newWindow' in c) {
                windows[c.name] = c.name;
            } else {
                examples.push(name + '/' + c.name + '.html');
            }
        });
    }
    if (json && json.pages) {
        Object.keys(json.pages).forEach(function(page) {
            var p = json.pages[page];
            if (p && p.name && windows[p.name]) {
                examples.push(name + '/' + page + '.html');
            }
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

