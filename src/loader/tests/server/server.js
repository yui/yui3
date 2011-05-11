#!/usr/bin/env node

//This is a hack for global modules in npm 1.0
require.paths.push('/usr/local/lib/node_modules');

var tryCombo = false;
if (process.env.COMBO) {
    tryCombo = true;
}

try {
var fs = require('fs'),
    express = require('express'),
    app = express.createServer(),
    path = require('path'),
    yui3 = require('yui3'),
    mods = {};

} catch (e) {
    console.error('Express and YUI3 need to be installed globally:');
    console.error('     npm -g i yui3');
    console.error('     npm -g i express');
    process.exit(1);
}

var json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'js') + '/yui3.json'));
var wrapper = fs.readFileSync(path.join(__dirname, 'use_template.html'), 'utf8');
var combo = fs.readFileSync(path.join(__dirname, 'combo_template.html'), 'utf8');
var local = fs.readFileSync(path.join(__dirname, 'local_template.html'), 'utf8');

var testMod = function(v) {
    //Removes YUI core modules
    if ((v.indexOf('yui') === -1) && (v.indexOf('loader') === -1) && (v.indexOf('compat') === -1)) {
        return true;
    }
    return false;
}

Object.keys(json).forEach(function(v) {
    if (testMod(v)) { //Removes YUI core modules
        mods[v] = 1;
        if (tryCombo) {
            mods['combo_'+ v] = 1;
        }
        mods['local_'+ v] = 1;
        if (json[v].submodules) {
            Object.keys(json[v].submodules).forEach(function(k) {
                if (testMod(k)) { //Removes YUI core modules
                    mods[k] = 1;
                    if (tryCombo) {
                        mods['combo_' + k] = 1;
                    }
                    mods['local_' + k] = 1;
                }
            });
        }
    }
});

var writeTest = function(key, cb) {
    var p = path.join(__dirname, "../../../../");
    var YUI = yui3.configure({ debug: false, yuiPath: p }).YUI;
    
    var config = {
        m: key,
        v: '3.3.0',
        env: 'features,get,intl-base,rls,yui,yui-base,yui-later,yui-log,yui-throttle'
    };


    new yui3.RLS(YUI, config).compile(function(err, data) {
        var str = [];
        data.js.forEach(function(v) {
            str.push(fs.readFileSync(v, 'utf-8'));
        });
        cb(str.join('\n'));
    });
};

var cases = [];

Object.keys(mods).forEach(function(k) {
    var str = '\n';
    var n = k.replace(/-/g, '_');
    str += 'test_' + n + ' : function() {\n';
    str += '    Assert.areEqual(results["' + k + '"].result.length, 0, "Missing Modules: " + JSON.stringify(results["' + k + '"].result));\n';
    str += '    Assert.isNull(results["' + k + '"].err, "Module threw an error while using");\n';
    str += '}';
    cases.push(str);
});

var js = 'var gen_tests = ' + JSON.stringify(Object.keys(mods).reverse()) + ';';
    js += '\n\n var cases = {\n' + cases.join(',\n') + '\n};\n';

app.configure(function() {
    var p = path.join(__dirname, '../../../../');
    app.use(express.static(p));
});

app.get('/', function(req, res) {
    res.send(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'));
});

app.get('/mod/:id', function(req, res) {
    var template = wrapper;
    if (req.params.id.indexOf('combo_') === 0) {
        template = combo;
        template = template.replace('{KEY_USE}', req.params.id.replace('combo_', ''));
    } else if (req.params.id.indexOf('local_') === 0) {
        template = local;
        template = template.replace('{KEY_USE}', req.params.id.replace('local_', ''));
    }

    template = template.replace(/{KEY}/g, req.params.id).replace('{STAMP}', (new Date()).getTime());

    res.send(template);
});

app.get('/js/:id.:format?', function(req, res) {
    writeTest(req.params.id, function(js) {
        res.charset = 'UTF-8';
        res.send(js);
    });
});

app.get('/generated.js', function(req, res) {
    res.contentType('application/json');
    res.send(js);
});

console.error('Test serving: http:/'+'/localhost:3000/');
app.listen(3000);
