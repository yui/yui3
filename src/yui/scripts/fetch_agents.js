#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    YUI = require(path.join(__dirname, '../../../', 'build-npm')).YUI;

YUI();
/*
Fetching User-Agent data from http://user-agent-string.info/download
*/

var testing = [
    'ie',
    'opera',
    'chrome',
    'chromium',
    'firefox',
    'safari',
    'webkit',
    'palm'
];

var invalid = [
    'alienforce',
    'firebird',
    'phoenix'
];

var browsers = [];
var out = {};

var isValid = function(name) {
    var ret = false;

    testing.forEach(function(test) {
        if (!ret && name.toLowerCase().indexOf(test) > -1) {
            ret = true;
        }
    });

    invalid.forEach(function(test) {
        if (ret && name.toLowerCase().indexOf(test) > -1) {
            ret = false;
        }
    });

    return ret;
};

var trim = function(str) {
    return str.replace(/"/g, '');
}

var resolve = function() {
    browsers.forEach(function(info, k) {
        if ((/BeOS/).test(info.ua) || (/OpenBSD/).test(info.ua)) {
            return;
        }
        out[info.name] = out[info.name] || [];
        var ua = YUI.Env.parseUA(info.ua);
        var data = {};
        Object.keys(ua).forEach(function(v) {
            if (v === 'userAgent') {
                return;
            }
            if (ua[v]) {
                data[v] = ua[v];
            }
        });

        var o = {
            ua: info.ua,
            data: data
        };
        out[info.name].push(o);
    });
    console.log('Finished parsing all', browsers.length, 'user agent strings, saving..');
    var file = path.join(__dirname, '../', 'tests', 'ua-data.js');
    var data = 'YUI.add("ua-data", function(Y) {\n\n';
    data += '// THIS FILE SHOULD BE HAND VERIFIED BEFORE TESTING\n\n';
    data += 'Y.UAData = ' + JSON.stringify(out, undefined, '\t') + ';';
    data += '\n\n});\n';
    fs.writeFileSync(file, data, 'utf8');
};

var parse = function(data) {
    data = data.split('\n');

    data.forEach(function(line) {
        line = line.split('",');
        if (line.length && (trim(line[0]) === 'Browser' || trim(line[0]) === 'Mobile Browser')) {
            line.shift(); //Remove the "Browser" key

            if (isValid(trim(line[0]))) {
                browsers.push({
                    name: trim(line[0]),
                    ua: trim(line[1])
                });
            }
        }
    });
    //console.log(browsers);
    console.log('Found: ', browsers.length);
    console.log('Resolving data');
    resolve();
};



console.log('Fetching CSV Browser Data');
http.get({
    host: 'user-agent-string.info',
    path: '/rpc/get_data.php?uaslist=csv'
}, function(res) {
    var data = '';
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function() {
        console.log('Browser data received, parsing..');
        parse(data);
    });
});

