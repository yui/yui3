#!/usr/bin/env node

//This is a hack for global modules in npm 1.0
require.paths.push('/usr/local/lib/node_modules');

var tests = {};

if ('COMBO' in process.env) {
    tests.combo = true;
}
if ('RLS' in process.env) {
    tests.rls = true;
}

if ('STAR' in process.env) {
    tests.star = true;
}

if ('LOCAL' in process.env) {
    tests.local = true;
}

if ('LOADER' in process.env) {
    tests.loader = true;
}

var filter = [];

if ('FILTER' in process.env) {
    filter = process.env.FILTER.split(',');
}

if (!Object.keys(tests).length) {
    console.error('NO TEST SPECIFIED: RLS, STAR, LOCAL, COMBO');
    console.error('export STAR=1; ./server.js');
    console.error('export LOCAL=1; export STAR=1; ./server.js');
    console.error('export LOCAL=1; export STAR=1; export COMBO=1; ./server.js');
    console.error('export LOCAL=1; export STAR=1; export COMBO=1; export LOADER=1; ./server.js #The normal test to run');
    console.error('export LOCAL=1; export STAR=1; export COMBO=1; export RLS=1; ./server.js');
    console.error('export LOCAL=1; export STAR=1; export COMBO=1; export LOADER=1; export RLS=1; ./server.js');
    process.exit(1);
}


try {
var fs = require('fs'),
    express = require('express'),
    app = express.createServer(),
    path = require('path'),
    yui3 = require('yui3'),
    comboHandler = require('combohandler'),
    mods = {};

} catch (e) {
    console.error('Express and YUI3 need to be installed globally:');
    console.error('     npm -g i yui3');
    console.error('     npm -g i express');
    console.error('     npm -g i combohandler');
    process.exit(1);
}

var json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'js') + '/yui3.json'));

var templates = {};
Object.keys(tests).forEach(function(v) {
    templates[v] = fs.readFileSync(path.join(__dirname, v + '_template.html'), 'utf8');
});

var testMod = function(v) {
    //Removes YUI core modules
    if ((v.indexOf('yui') === -1) && (v.indexOf('loader') === -1) && (v.indexOf('compat') === -1) &&
        (v.indexOf('css') === -1) && (v !== 'queue-run') && (v !== 'pluginattr') && (v !== 'rls') &&
        (v !== 'alias')) {

        var ret = true;
        if (filter.length) {
            ret = false;
            filter.forEach(function(f) {
                if (v.indexOf(f) === 0) {
                    ret = true;
                }
            });
        }
        return ret;
    }
    return false;
}

Object.keys(json).forEach(function(v) {
    if (testMod(v)) { //Removes YUI core modules
        Object.keys(tests).forEach(function(t) {
            mods[t + '/'+ v] = 1;
        });
        if (json[v].submodules) {
            Object.keys(json[v].submodules).forEach(function(k) {
                if (testMod(k)) { //Removes YUI core modules
                    Object.keys(tests).forEach(function(t) {
                        mods[t + '/'+ k] = 1;
                    });
                }
            });
        }
    }
});

var writeTest = function(key, cb) {
    var p = path.join(__dirname, "../../../../");
    var YUI = yui3.configure({ debug: false, yuiPath: p, yuiCoreFile: 'build/yui-base/yui-base.js' }).YUI;

    var config = {
        m: key,
        v: '3.3.0',
        env: 'features,get,intl-base,yui,yui-base,yui-later,yui-log'
    };
    
    var rls = new yui3.RLS(YUI, config);
    rls.compile(function(err, data) {
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
    var n = k.replace(/-/g, '_').replace(/\//g, '_');
    str += 'test_' + n + ' : function() {\n';
    str += '    Assert.isNotUndefined(results["' + k + '"], "Module not loaded from test suite: ' +  k + '");\n';
    str += '    Assert.areEqual(0, results["' + k + '"].result.length, "Missing Modules: " + JSON.stringify(results["' + k + '"].result));\n';
    str += '    Assert.isNull(results["' + k + '"].err, "Module threw an error while using");\n';
    str += '}';
    cases.push(str);
});

var js = 'var gen_tests = ' + JSON.stringify(Object.keys(mods).reverse()) + ';';
    js += '\n\n var cases = {\n' + cases.join(',\n') + '\n};\n';

var comboPath = path.join(__dirname, '../../../../');

app.configure(function() {
    app.use(express.static(comboPath));
});

app.get('/combo', comboHandler.combine({ rootPath: comboPath }), function (req, res) {
  res.send(res.body, 200);
});

app.get('/', function(req, res) {
    res.send(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'));
});

app.get('/tests/:type/:id', function(req, res) {

    var key = req.params.type;
    var template = templates[key];

    template = template.replace(/{KEY}/g, req.params.type + '/' + req.params.id);
    template = template.replace('{STAMP}', (new Date()).getTime());
    template = template.replace('{KEY_USE}', req.params.id);

    res.send(template);
});

app.get('/js/:id.:format?', function(req, res) {
    writeTest(req.params.id, function(js) {
        res.contentType('text/plain');
        res.charset = 'UTF-8';
        res.send(js);
    });
});

app.get('/generated.js', function(req, res) {
    res.contentType('application/json');
    res.send(js);
});



console.error('Test serving: http:/'+'/localhost:5000/');
console.error('Running tests: ', JSON.stringify(Object.keys(tests)));
if (filter.length) {
    console.error('With module filters: ', JSON.stringify(filter));
}
app.listen(5000);
