#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var base = path.join(__dirname, '../../');

var dirs = fs.readdirSync(base);

var examples = [];

dirs.forEach(function(dir) {
    var comp = path.join(base, dir, 'docs', 'component.json');
    if (path.existsSync(comp)) {
        var json = JSON.parse(fs.readFileSync(comp, 'utf8'));
        if (json && json.examples) {
            var name = json.name;
            json.examples.forEach(function(c) {
                examples.push(name + '/' + c.name + '.html');
            });
        }
    }
});

examples.sort();

module.exports = examples;
