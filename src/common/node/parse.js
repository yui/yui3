#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    base = path.join(__dirname, '../../'),
    dirs = fs.readdirSync(base),
    paths = [];

dirs.forEach(function(dir) {
    var testBase = path.join(dir, 'tests/unit');
    var unit = path.join(base, testBase);
    if (exists(unit)){
        var files = fs.readdirSync(unit);
        files.forEach(function(file) {
            var ext = path.extname(file);
            if (ext === '.html' || ext == '.htm') {
                paths.push(path.join(testBase, file));
            }
        });
    }
});

paths.sort();

module.exports = paths;
