#!/usr/bin/env node


var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mod;

http.get({
    host: 'yuilibrary.com',
    path: '/gallery/api/oncdn'
}, function(res) {
    var body = '';
    res.on('data', function(d) {
        body += d;
    });
    res.on('end', function() {
        try {
            mod = JSON.parse(body).modules[0];
            console.log('Found latest gallery build tag: ', mod.buildtag);
            patch(mod.buildtag);
        } catch (e) {
            console.log('Failed to fetch latest gallery build tag.');
        }
    });
});

var patch = function(tag) {
    var prop = path.join(__dirname, '../', 'loader.meta.properties');
    var str = fs.readFileSync(prop, 'utf8'),
    nStr = [];
    str.split('\n').forEach(function(line) {
        if (line.indexOf('loader.gallery=') === 0) {
            nStr.push('loader.gallery=' + tag);
        } else {
            nStr.push(line);
        }
    });
    fs.writeFileSync(prop, nStr.join('\n'), 'utf8');
    console.log('Patch File Complete, Gallery Build Updated');
}
