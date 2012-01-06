#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    base = path.join(__dirname, '../../../api-js/data.json'),
    alias_json = path.join(__dirname, '../../loader/js/yui3.json'),
    out = path.join(__dirname, '../docs/partials/modules.mustache');

if (!path.existsSync(base)) {
    console.error('\n[error] Please run `yuidoc` first to generate API documentation!');
    process.exit();
}

console.log('[info] Loading module meta data');
var data = JSON.parse(fs.readFileSync(base, 'utf8'));
var alias_data = JSON.parse(fs.readFileSync(alias_json, 'utf8'));

var nameSort = function(a, b) {
    if (!a.name || !b.name) {
        return 0;
    }
    var an = a.name.toLowerCase(),
        bn = b.name.toLowerCase(),
        ret = 0;

    if (an < bn) {
        ret = -1;
    }
    if (an > bn) {
        ret =  1
    }
    return ret;
};

var mods = [];

Object.keys(data.modules).forEach(function(i) {
    var v = data.modules[i];

    var d = v.description || '';

    d = d.split('\n')[0].replace('<p>', '').replace('</p>', '');

    if (alias_data[v.name] && alias_data[v.name].use) {
        d = 'Alias module for: `' + alias_data[v.name].use.join(', ') + '`';
    }

    var o = {
        name: v.name,
        desc: d
    };
    mods.push(o);
});

mods.sort(nameSort);

console.log('[info] Building module list (' + mods.length + ')');

var str = [];

str.push('<table>');
str.push('  <thead>');
str.push('      <tr>');
str.push('          <th>YUI 3 Component</th>');
str.push('          <th>Module</th>');
str.push('      </tr>');
str.push('  </thead>');
str.push('  <tbody>');

mods.forEach(function(m) {
    str.push('      <tr>');
    str.push('          <td>`' + m.name + '`</td>');
    str.push('          <td>' + m.desc + '</td>');
    str.push('      </tr>');
});

str.push('  </tbody>');
str.push('</table>');

console.log('[info] Writing ' + out);
fs.writeFileSync(out, str.join('\n'), 'utf8');

console.log('[info] Done!');
