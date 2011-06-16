#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    p = path.join(__dirname, '../../loader/js/yui3.json')
    out = path.join(__dirname, '../', 'js', 'alias.js');

var data = JSON.parse(fs.readFileSync(p, 'utf8')),
meta = {};


Object.keys(data).sort().forEach(function(m) {
    if (m === 'yui') {
        return;
    }
    if (data[m].use) {
        meta[m] = {
            use: data[m].use
        };
    }
});

var str = 'YUI.Env.aliases = {\n';
var o = [];
Object.keys(meta).forEach(function(name) {
    var mod = meta[name];
    o.push('    "' + name + '": ' + JSON.stringify(mod.use));
});
str += o.join(',\n');
str += '\n};\n';


console.log('Writing aliases to ./js/alias.js');
fs.writeFileSync(out, str, 'utf8')
