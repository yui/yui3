#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    root = path.join(__dirname, '../../'),
    color = function(str, num) {
        num = num || '37;40';
        return "\033[" + num + "m" + str + "\033[0m"
    };

//Begin..
console.log(color('Scanning: ' + root));

var dirs = fs.readdirSync(root);

dirs.forEach(function(d) {
    var p = path.join(root, d);
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
                        Object.keys(d).forEach(function(name) {
                            //console.log(d[name]);
                            var mod = d[name];
                            if (!mod.use && !mod.requires && (name.indexOf('css') === -1)) {
                                console.log(color('[No Requires]'), path.join(p, 'meta', i), color(' [' + name + ']'));
                            }
                            if (mod.submodules) {
                                Object.keys(mod.submodules).forEach(function(sub) {
                                    var subMod = d[name].submodules[sub];
                                    if (!subMod.use && !subMod.requires && (sub.indexOf('css') === -1)) {
                                        console.log(color('[No Requires]'), path.join(p, 'meta', i), color(' [' + name + '][' + sub + ']'));
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});


