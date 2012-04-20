#!/usr/bin/env node

process.chdir(__dirname);

var root = process.argv[2],
    path = require('path');

var json = require('./tests.json');

json.tests.forEach(function(v, k) {
    json.tests[k] = path.join(root, v);
});
console.log(json.tests.join(' '));
