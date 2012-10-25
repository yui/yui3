#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    base = path.join(__dirname, '../../../build/json-parse-shim/');

console.log('');
console.log('Fixing json issue with eval');
console.log('scanning', base);
fs.readdir(base, function(err, files) {
    files.forEach(function(file) {
        var f = path.join(base, file);
        console.log('reading', f);
        fs.readFile(f, 'utf8', function(err, data) {
            console.log('writing', f);
            data = data.replace(/EVAL_TOKEN/g, 'eval');
            fs.writeFile(f, data, 'utf8', function() {
                console.log('done', f);
            });
        });
    });
});
