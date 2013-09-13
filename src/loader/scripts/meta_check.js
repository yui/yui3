#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    root = path.join(__dirname, '../../'),
    build = {}, json = {}, logs = [], mods = {}, extras = [], warns = [],
    color = function(str, num) {
        num = num || '37;40';
        return "\033[" + num + "m" + str + "\033[0m"
    },
    parseMod = function(d, name) {
        ['submodules', 'plugins'].forEach(function(n) {
            if (d[name][n]) {
                for (var i in d[name][n]) {
                    var m = d[name][n][i];
                    if (!json[i]) {
                        json[i] = {};
                    }
                    if (m.requires || m.use) {
                        if (m.requires) {
                            json[i].requires = m.requires.sort();
                        }
                        if (m.use) {
                            json[i].use = m.use.sort();
                        }
                        parseMod(d[name][n], i);
                    }
                }
            }
        });
    },
    hash = function(a) {
        if (!a) {
            return {};
        }
        var b = {};
        a.forEach(function(v) {
            b[v] = v;
        });
        return b;
    },
    parseFile = function(file) {
        var data = fs.readFileSync(file, 'utf8').split('\n'),
        name, m = false,  use = false, requires = false;
        data.forEach(function(l) {
            if (l.indexOf('component=') > -1 && l.indexOf('.') === -1) {
                name = l.replace('\n', '').replace('component=', '');
            }
            if (l.indexOf('component.use=') > -1 && (l.indexOf('#') === -1)) {
                use = l.replace('\n', '').replace('component.use=', '').replace(/ /g, '').split(',');
            }
            if (l.indexOf('component.requires=') > -1 && (l.indexOf('#') === -1)) {
                requires = l.replace('\n', '').replace('component.requires=', '').replace(/ /g, '').split(',');
            }
            if (l.indexOf('component.require=') > -1 && (l.indexOf('#') === -1)) {
                warns.push('    ' + color('[' + name + ']') + ' Fixing component.require should be component.requires');
                requires = l.replace('\n', '').replace('component.require=', '').replace(/ /g, '').split(',');
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

//Begin..
console.log(color('Scanning: ' + root));

var dirs = fs.readdirSync(root);

dirs.forEach(function(d) {
    var p = path.join(root, d);
    //console.log(' ' + d + '/');
    var stat = fs.statSync(p);
    if (stat.isDirectory()) {
        var files = fs.readdirSync(p);
        files.forEach(function(f) {
            name = d;
            if ((d.indexOf('yui') === 0)) {
                //Skip the YUI object..
                return;
            }
            if (f === 'meta') {
                var o = fs.readdirSync(path.join(p, 'meta'));
                o.forEach(function(i) {
                    if (path.extname(i) === '.json') {
                        try {
                            var d = JSON.parse(fs.readFileSync(path.join(p, 'meta', i)));
                        } catch (e) {
                            console.error('Failed to parse JSON from: ', path.join(p, 'meta', i));
                            process.exit(1);
                        }
                        for (var name in d) {
                            if (d[name].use) {
                                //console.log('     --', path.join('meta', i));
                                if (!json[name]) {
                                    json[name] = {};
                                }
                                json[name].use = d[name].use.sort();
                            }
                            if (d[name].requires) {
                                if (!json[name]) {
                                    json[name] = {};
                                }
                                json[name].requires = d[name].requires.sort();
                            }
                            if (d[name].requires && d[name].use) {
                                warns.push('    ' + color('[' + name + ']') + ' has both a requires and a use. The use should define the requires. FIX!');
                            }

                            parseMod(d, name);
                        }
                    }
                });
            }
            if (f.indexOf('.properties') !== -1) {
                var m = parseFile(path.join(root, d, f));
                if (m) {
                    name = m.name || d;

                    if (m.use) {
                        if (!build[name]) {
                            build[name] = {};
                        }
                        build[name].use = m.use.sort();
                    }
                    if (m.requires) {
                        if (!build[name]) {
                            build[name] = {};
                        }
                        build[name].requires = m.requires.sort();
                    }
                }
            }
        });
    }
});

var comp = function(str, a /* JSON Meta*/, b /* Build Meta */) {
    var len = logs.length;

    if (!a && !b) {
        //There is no use or require data for this module, skip it
        return;
    }
    if (!a) {
        a = {};
        extras.push('     ' + color('[' + str + ']') + ' data was not found in the JSON meta file');
        return;
    }

    if (!b) {
        b = {};
        if (!a.use && !a.requires) {
            return;
        }
        logs.push('     ' + color('[' + str + ']') + ' data was not found in the Build Properties files');
    }

    var a1 = {
        use: hash(a.use),
        requires: hash(a.requires)
    },
    b1 = {
        use: hash(b.use),
        requires: hash(b.requires)
    };

    if (!a.use && b.use) {
        logs.push('     ' + color('[' + str + ']') + ' JSON Meta "use" is not defined');
    }
    if (a.use) {
        for (var i in a1.use) {
            if (!b1.use[i]) {
                logs.push('     ' + color('[' + str + ']') + ' Build Properties "use" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(b1.use)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(a1.use)));
            }
        }
    }
    if (b.use) {
        for (var i in b1.use) {
            if (!a1.use[i]) {
                logs.push('     ' + color('[' + str + ']') + ' JSON meta "use" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(b1.use)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(a1.use)));
            }
        }
    }
    if (a.requires) {
        for (var i in a1.requires) {
            if (!b1.requires[i]) {
                logs.push('     ' + color('[' + str + ']') + ' Build Properties "requires" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(b1.requires)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(a1.requires)));
            }
        }
    }
    if (b.requires) {
        for (var i in b1.requires) {
            if (!a1.requires[i]) {
                logs.push('     ' + color('[' + str + ']') + ' JSON meta "requires" is missing: ' + i);
                logs.push('                  build file: ' + JSON.stringify(Object.keys(b1.requires)));
                logs.push('                  meta json:  ' + JSON.stringify(Object.keys(a1.requires)));
            }
        }
    }
    if (logs.length > len) {
        logs.push('');
    }
};

var m = [].concat(Object.keys(build), Object.keys(json));
m.forEach(function(v) {
    mods[v] = v;
});

Object.keys(mods).sort().forEach(function(i) {
    comp(i, json[i], build[i]);
});

if (logs.length) {
    console.log('');
    console.log(color('Meta Data Warnings', '33'));
    logs.forEach(function(i) {
        console.log(i);
    });
}

if (warns.length) {
    console.log('');
    console.log(color('General Warnings', '33'));
    warns.forEach(function(i) {
        console.log(i);
    });
}

if (extras.length) {
    console.log('');
    console.log(color('Other Warnings', '33'));
    extras.forEach(function(i) {
        console.log(i);
    });
}
