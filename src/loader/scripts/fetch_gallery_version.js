#!/usr/bin/env node


var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
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
            patchJSON(mod.buildtag);
            console.log('Patch File Complete, Gallery Build Updated');
        } catch (e) {
            console.log('Failed to fetch latest gallery build tag.');
        }
    });
});

var patchJSON = function(tag) {
    var jsonFile = path.join(__dirname, '../', 'build.json');
    if (exists(jsonFile)) {
        console.log('patching build.json');
        var json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        json.builds['loader-base'].replace['@GALLERY@'] = tag;
        fs.writeFileSync(jsonFile, JSON.stringify(json, null, 4) + '\n','utf8');
    }
};

var patch = function(tag) {
    var prop = path.join(__dirname, '../', 'loader.meta.properties');
    if (exists(prop)) {
        console.log('patching loader.meta.properties');
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
    }
}
