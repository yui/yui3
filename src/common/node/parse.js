#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    base = path.join(__dirname, '../../');


var parse = function(filter) {
    var dirs = fs.readdirSync(base),
        json = {};

    dirs.forEach(function(dir) {
        if (dir === 'io' || dir === 'jsonp') {
            return;
        }
        var testBase = path.join(dir, 'tests/unit');
        var unit = path.join(base, testBase);
        if (exists(unit)) {
            var files = fs.readdirSync(unit);
            files.forEach(function(file) {
                var ext = path.extname(file);
                if (ext === '.html' || ext == '.htm') {
                    json[dir] = json[dir] || [];
                    if (!filter || (filter && filter(file))) {
                        json[dir].push(file);
                    }
                }
            });
        }
    });

    return json;
};

exports.paths = function(json) {
    var paths = [];
    json = json || parse();

    Object.keys(json).forEach(function(mod) {
        var info = json[mod];
        var p = path.join(mod, 'tests/unit');
        info.forEach(function(u) {
            paths.push(path.join(p, u));
        });
    });
    paths.sort();

    return paths;
};

exports.parse = parse;
