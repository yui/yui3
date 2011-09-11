#!/usr/bin/env node

//Simplified FAKE RLS server for testing failures

var http = require('http'),
    fs = require('fs'),
    qs = require('querystring'),
    loader = fs.readFileSync('/Users/davglass/src/local/3.x/build/loader/loader-min.js', 'utf8');

http.createServer(function (req, res) {
    var q = qs.parse(req.url.split('?')[1]);
    var missing = [];

    if (q && q.m && q.m.length) {
        missing = q.m.split(',');
    }
    /*
    This sends:

    YUI.$rls({
        error: "RLS Server Error",
        modules: ["loader-base", "loader-rollup", "loader-yui3"],
        missing: [] //The modules passed in via ?m=
    });
    */
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(loader + '\n\nYUI.$rls({ error: "RLS Server Error", modules: [ "loader-base", "loader-rollup", "loader-yui3" ] , missing: ' + JSON.stringify(missing) + ' });');

}).listen(5000);

console.log('Fake Failure RLS server listening: http://localhost:5000/?');
