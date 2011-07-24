#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var root = path.join(__dirname, '../../');

var dirs = fs.readdirSync(root);

dirs.forEach(function(d) {
    var stat = fs.statSync(path.join(root, d));
    if (stat.isDirectory()) {
        var files = fs.readdirSync(path.join(root, d));
        files.forEach(function(f) {
            if (f.indexOf('.properties') > 0) {
                console.log(d + '/' + f);
                var write = false;
                var str = fs.readFileSync(path.join(root, d, f), 'utf8').split('\n');
                str.forEach(function(line, num) {
                    if (line.indexOf('global.build.component') === 0) {
                        write = true;
                        str[num] = line.replace('global.build.component', '#global.build.component');
                    }
                });
                if (write) {
                    //console.error(str.join('\n'));
                    console.log('Writing: ', path.join(root, d, f));
                    fs.writeFileSync(path.join(root, d, f), str.join('\n'), 'utf8');
                }

            }
        });
    }
});
