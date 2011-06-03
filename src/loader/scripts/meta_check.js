#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    root = path.join(__dirname, '../../'),
    meta = {},
    data = {},
    logs = [],
    warns = [];

console.error('Scanning', root);

var parseFile = function(file) {
    var data = fs.readFileSync(file, 'utf8').split('\n'),
    name, m = false,  use = false, requires = false;
    data.forEach(function(l) {
        if (l.indexOf('component=') > -1) {
            name = l.replace('\n', '').replace('component=', '');
        }
        if (l.indexOf('component.use=') > -1) {
            use = l.replace('\n', '').replace('component.use=', '').replace(/ /g, '').split(',');
        }
        if (l.indexOf('component.requires=') > -1) {
            requires = l.replace('\n', '').replace('component.requires=', '').replace(/ /g, '').split(',');
        }
    });
    if (use || requires) {
        var m = {};
        if (use) {
            m.name = name;
            m.use = use;
        }
        if (requires) {
            m.name = name;
            m.requires = requires
        }
    }
    return m;
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
                            if (!data[name]) {
                                data[name] = {};
                            }
                            data[name].use = d[name].use.sort();
                        }
                        if (d[name]) {
                            if (d[name].requires && d[name].use) {
                                warns.push('    [' + name + '] has both a requires and a use. The use should define the requires. FIX!');
                            }
                            if (d[name].submodules) {
                                for (var i in d[name].submodules) {
                                    var m = d[name].submodules[i];
                                    if (m.requires) {
                                        if (!data[i]) {
                                            data[i] = {};
                                        }
                                        data[i].requires = m.requires.sort();
                                    }
                                }
                            }
                        }
                    }
                });
            }
            if (f.indexOf('.properties') !== -1) {
                var m = parseFile(path.join(root, d, f));
                if (m) {
                    name = m.name;

                    if (m.use) {
                        if (!meta[name]) {
                            meta[name] = {};
                        }
                        meta[name].use = m.use.sort();
                    }
                    if (m.requires) {
                        if (!meta[name]) {
                            meta[name] = {};
                        }
                        meta[name].requires = m.requires.sort();
                    }
                }
            }
        });
    }
});

var hash = function(a) {
    if (!a) {
        return {};
    }
    var b = {};
    a.forEach(function(v) {
        b[v] = v;
    });
    return b;
}

var comp = function(str, a, b) {
    var len = logs.length;

    if (a.length !== b.length) {
        logs.push('     [' + str + '] dependencies #\'s do not match');
    }
    var a1 = {
        use: hash(a.use),
        requires: hash(a.requires)
    },
    b1 = {
        use: hash(b.use),
        requires: hash(b.requires)
    };
    if (a.use) {
        for (var i in a1.use) {
            if (!b1.use[i]) {
                logs.push('     [' + str + '] JSON Meta "use" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(a1.use)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(b1.use)));
            }
        }
    }
    if (b.use) {
        for (var i in b1.use) {
            if (!a1.use[i]) {
                logs.push('     [' + str + '] build properties file "use" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(a1.use)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(b1.use)));
            }
        }
    }
    if (a.requires) {
        for (var i in a1.requires) {
            if (!b1.requires[i]) {
                logs.push('     [' + str + '] JSON Meta "requires" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(a1.requires)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(b1.requires)));
            }
        }
    }
    if (b.requires) {
        for (var i in b1.requires) {
            if (!a1.requires[i]) {
                logs.push('     [' + str + '] build properties file "requires" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(a1.requires)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(b1.requires)));
            }
        }
    }
    if (logs.length > len) {
        logs.push('');
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

if (warns.length) {
    console.error('');
    console.error('General Warnings');
    warns.forEach(function(i) {
        console.error(i);
    });
}
if (logs.length) {
    console.error('');
    console.error('Meta Data Warnings');
    logs.forEach(function(i) {
        console.error(i);
    });
}

//console.error(meta);
//console.error(data);
