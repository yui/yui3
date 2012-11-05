#!/usr/bin/env node

process.chdir(__dirname);

var fs = require('fs');

var root = process.argv[2],
    path = require('path');

var json = JSON.parse(fs.readFileSync('./tests.json', 'utf8'));

json.tests.forEach(function(v, k) {
    json.tests[k] = path.join(root, v);
});
console.log(json.tests.join(' '));
