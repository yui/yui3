#!/usr/bin/env node

//This is a hack for global modules in npm 1.0
require.paths.push('/usr/local/lib/node_modules');

var fs = require('fs'),
    path = require('path'),
    yui3 = require('yui3'),
    mods = {};

var json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'js') + '/yui3.json'));

var wrapper = fs.readFileSync(__dirname + '/use_template.html', 'utf8');

var testMod = function(v) {
    //Removes YUI core modules
    //if ((v.indexOf('yui') === -1) && (v.indexOf('loader') === -1) && (v.indexOf('history') === -1) && (v.indexOf('text-') === -1) && (v !== 'text')) {
    if ((v.indexOf('yui') === -1) && (v.indexOf('loader') === -1) && (v.indexOf('history') === -1)) {
        return true;
    }
    return false;
}

Object.keys(json).forEach(function(v) {
    if (testMod(v)) { //Removes YUI core modules
        mods[v] = 1;
        if (json[v].submodules) {
            Object.keys(json[v].submodules).forEach(function(k) {
                if (testMod(k)) { //Removes YUI core modules
                    mods[k] = 1;
                }
            });
        }
    }
});

var writeTest = function(key, cb) {

    var p = path.join(__dirname, "../../../");
    var YUI = yui3.configure({ debug: false, yuiPath: p }).YUI;
    
    (function(key) {
        var config = {
            m: key,
            v: '3.3.0',
            env: 'features,get,intl-base,rls,yui,yui-base,yui-later,yui-log,yui-throttle'
        };
    

        new yui3.RLS(YUI, config).compile(function(err, data) {
            var f = path.join(__dirname, '../tests/generated/js/', key + '.js');
            var h = path.join(__dirname, '../tests/generated/html/', key + '.html');
            var str = [];
            data.js.forEach(function(v) {
                str.push(fs.readFileSync(v, 'utf-8'));
            });
            console.error('Writing test for', key);
            fs.writeFileSync(f, str.join('\n'), 'utf8');
            fs.writeFileSync(h, wrapper.replace(/{KEY}/g, key).replace('{STAMP}', (new Date()).getTime()), 'utf8');
        });
    })(key);
};

var cases = [];

Object.keys(mods).forEach(function(k) {
    writeTest(k);
    var str = '\n';
    var n = k.replace(/-/g, '_');
    str += 'test_' + n + ' : function() {\n';
    str += '    Assert.areEqual(results["' + k + '"].result.length, 0, "Missing Modules: " + JSON.stringify(results["' + k + '"].result));\n';
    str += '    Assert.isNull(results["' + k + '"].err, "Module threw an error while using");\n';
    str += '}';
    cases.push(str);
});

var f = path.join(__dirname, '../tests/generated/', 'generated.js');
var js = 'var gen_tests = ' + JSON.stringify(Object.keys(mods).reverse()) + ';';
    js += '\n\n var cases = {\n' + cases.join(',\n') + '\n};\n';
fs.writeFileSync(f, js);

