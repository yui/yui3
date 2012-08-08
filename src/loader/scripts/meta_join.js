#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    skins = require('yui3skins'),
    exists = fs.existsSync || path.existsSync,
    base = path.join(__dirname, '../../'),
    jsonOut = path.join(__dirname, '../', 'js', 'yui3.json'),
    jsOut = path.join(__dirname, '../', 'js', 'yui3.js'),
    MD5_TOKEN = '{ /* MD5 */ }',
    TEMPLATE_TOKEN = '{ /* METAGEN */ }',
    crypto = require('crypto'),
    md5sum = crypto.createHash('md5');

var dirs = fs.readdirSync(base);

var metaFiles = [];

dirs.forEach(function(d) {
    var p = path.join(base, d, 'meta');
    if (exists(p)) {
        var files = fs.readdirSync(p);
        files.forEach(function(f) {
            f = path.join(p, f);
            var ext = path.extname(f);
            if (ext === '.json') {
                metaFiles.push(f);
            }
        });
    }
});

if (!metaFiles.length) {
    console.error('Something went very wrong here, could not find meta data to parse.');
    process.exit(1);
}

console.log('Found', metaFiles.length, '.json files to parse. Parsing now..');


//This is only to make the data look exactly the same as the old python script.
var sortObject = function(data) {
    var keys = Object.keys(data).sort();
    var d = {};
    keys.forEach(function(k) {
        d[k] = data[k];
    });
    return d;
};

var json = {};

var conds = {};

var parseData = function(name, data, file) {
    var i, o;
    for (i in data) {
        if (i === 'submodules' || i === 'plugins') {
            for (o in data[i]) {
                parseData(o, data[i][o], file);
            }
            delete data[i];
        }
        if (i === 'condition') {
            if (data[i].test && data[i].test.indexOf('.js') > 0) {
                conds[name] = path.join(path.dirname(file), data[i].test);
            }
            data[i].name = name;
            data[i] = sortObject(data[i]);
        }
    }
    json[name] = sortObject(data);
};

metaFiles.forEach(function(file) {
    var data = fs.readFileSync(file, 'utf8'), i, o;

    try {
        data = JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse: ', file);
        console.error(e);
        process.exit(1);
    }
    for (i in data) {
        parseData(i, data[i], file);
    }
});

var out = sortObject(json);

console.log('Writing JSON', jsonOut);

skins.scan(base, null, function(skinHash) {
    var modName, modSkins;

    for (modName in skinHash) {
        if (skinHash.hasOwnProperty(modName)) {
            if (out[modName] && !out[modName].skins) {
                out[modName].skins = skinHash[modName];
            }
        }
    }

    var jsonStr = JSON.stringify(out, null, 4);

    fs.writeFileSync(jsonOut, jsonStr, 'utf8');

    console.log('Done, processing conditionals.');

    md5sum.update(jsonOut);
    var sum = md5sum.digest('hex');

    console.log('Using MD5:', sum);

    var header = fs.readFileSync(path.join(__dirname, '../template/meta.js'), 'utf8');

    header = header.replace(MD5_TOKEN, sum).replace('join.py', 'join.js');

    var tests = [];
    var allTests = [];

    Object.keys(out).forEach(function(name) {
        var mod = out[name],
            file;
        if (mod.condition) {
            var cond = sortObject(mod.condition);
            if (conds[mod.condition.name]) {
                var cName = mod.condition.name;
                file = conds[cName];
                if (exists(file)) {
                    var test = fs.readFileSync(file, 'utf8');
                    mod.condition.test = file;
                    cond.test = test;
                    tests.push({ key: file, test: test });
                } else {
                    console.error('Failed to locate test file: ', file);
                    process.exit(1);
                }
            }
            allTests.push(cond);
        }
    });

    var jsonStr = JSON.stringify(out, null, 4);

    tests.forEach(function(info) {
        jsonStr = jsonStr.replace('"' + info.key + '"', info.test);
    });

    jsonStr = jsonStr.replace(/}\n,/g, '},').replace(/}\n\n,/g, '},');

    var jsStr = header.replace(TEMPLATE_TOKEN, jsonStr);

    console.log('Writing JS file', jsOut);

    fs.writeFileSync(jsOut, jsStr, 'utf8');

    console.log('Done writing JS file');

    allTests.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0
    });


    header = fs.readFileSync(path.join(__dirname, '../template/load-tests-template.js'), 'utf8');
    header = header.replace('join.py', 'join.js');

    tests = [];

    allTests.forEach(function(cond, key) {
        var test = cond.test;
        if (test) {
            cond.test = '~~COND~~';
        }
        var o = JSON.stringify(cond, null, 4);
        if (test) {
            o = o.replace('"~~COND~~"', test);
        }
        tests.push("// " + cond.name);
        tests.push("add('load', '" + key + "', " + o + ");");
    });

    header += tests.join('\n');
    header= header.replace(/}\n,/g, '},');
    header= header.replace(/}\n\n,/g, '},');

    var loadTests = path.join(__dirname, '../../yui/js/load-tests.js');

    console.log('Writing load tests file', loadTests);

    fs.writeFileSync(loadTests, header, 'utf8');

    console.log('Done!');
});
