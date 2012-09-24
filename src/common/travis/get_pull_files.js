#!/usr/bin/env node

var ID = process.env.TRAVIS_PULL_REQUEST_NUMBER;
var USER = 'yui';
var fs = require('fs');
var path = require('path');
var https = require('https');
var spawn = require('child_process').spawn;
var base = path.join(__dirname, '../../');
var mods = {};

if (base.indexOf('/home/travis/builds/') > -1) 
    USER = base.replace('/home/travis/builds/', '').split('/')[0];
}

if (!ID) {
    process.exit(0);
}

console.log('Fetching files from pull request #' + ID, 'from user', USER);

https.get({
    hostname: 'api.github.com',
    path: '/repos/' + USER + '/yui3/pulls/' + ID + '/files'
}, function(res) {
    var data = '';
    res.on('data', function(c) {
        data += c;
    });

    res.on('end', function() {
        console.log('processing files');
        var json = JSON.parse(data);
        var files = {};
        json.forEach(function(item) {
            if (item.filename && item.filename.indexOf('src/') === 0) {
                files[item.filename] = true;
            }
        });
        Object.keys(files).forEach(function(file) {
            var mod = file.split('/')[1];
            mods[mod] = true;
        });
        mods = Object.keys(mods).sort();
        mods.push('yui');
        mods.reverse();

        console.log('Building', mods.join(','));
        build();
    });
});

var build = function() {
    var mod = mods.pop();
    if (!mod) {
        console.log('all builds complete');
        process.exit(0);
        return;
    }
    console.log('building', mod, 'from', path.join(base, mod));
    console.log('ONLY STDERR WILL BE PRINTED');
    
    var child = spawn('shifter', ['--no-coverage', '--no-lint'], {
        cwd: path.join(base, mod)
    });

    child.stderr.on('data', function(d) {
        process.stderr.write(d.toString());
    });

    child.on('exit', function(code) {
        if (code) {
            console.log('Build Failed');
            process.exit(code);
        }
        build();
    });

};
