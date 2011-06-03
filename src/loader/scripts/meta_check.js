#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    root = path.join(__dirname, '../../'),
    meta = {},
    data = {};

console.error('Scanning', root);

var parseFile = function(file) {
    var data = fs.readFileSync(file, 'utf8').split('\n'),
    name, use = false;
    data.forEach(function(l) {
        if (l.indexOf('component=') > -1) {
            name = l.replace('\n', '').replace('component=', '');
        }
        if (l.indexOf('component.use=') > -1) {
            use = l.replace('\n', '').replace('component.use=', '').replace(/ /g, '').split(',');
        }
    });
    return use;
};

var dirs = fs.readdirSync(root);

dirs.forEach(function(d) {
    var p = path.join(root, d);
    //console.error(' ' + d + '/');
    var stat = fs.statSync(p);
    if (stat.isDirectory()) {
        var files = fs.readdirSync(p);
        files.forEach(function(f) {
            name = d;
            if (f === 'meta') {
                var o = fs.readdirSync(path.join(p, 'meta'));
                o.forEach(function(i) {
                    if (path.extname(i) === '.json') {
                        var d = JSON.parse(fs.readFileSync(path.join(p, 'meta', i)));
                        if (d[name] && d[name].use) {
                            //console.error('     --', path.join('meta', i));
                            data[name] = d[name].use.sort();
                        }
                    }
                });
            }
            if (f.indexOf('.properties') !== -1) {
                var m = parseFile(path.join(root, d, f));
                if (m) {
                    //console.error('     |-', f);
                    meta[name] = m.sort();
                }
            }
        });
    }
});

var hash = function(a) {
    var b = {};
    a.forEach(function(v) {
        b[v] = v;
    });
    return b;
}

var comp = function(str, a, b) {
    var logs = [];

    if (a.length !== b.length) {
        logs.push('     [' + str + '] dependencies #\'s do not match');
    }
    var a1 = hash(a),
        b1 = hash(b);

    for (var i in a1) {
        if (!b1[i]) {
            logs.push('     [' + str + '] build properties use is missing: ' + i);
        }
    }
    for (var i in b1) {
        if (!a1[i]) {
            logs.push('     [' + str + '] meta JSON file is missing: ' + i);
        }
    }
    if (logs.length) {
        console.error('');
        logs.forEach(function(i) {
            console.error(i);
        });
    }
};

Object.keys(meta).forEach(function(i) {
    if (data[i]) {
        //console.error('Comparing ', i);
        comp(i, data[i], meta[i]);
    } else {
        //console.error('Failed to find', i, 'in data array');
    }
});

//console.error(meta);
//console.error(data);
