#!/usr/bin/env node

/*

To be used with Yeti:

cd yui3;
"yeti --hub http://127.0.0.1:9000 `src/common/node/list.js`"

This will cause yeti to get the arguments that are echoed
from this script so that it can dynamically run the tests.

*/

var json = require('./parse').parse(function(line) {
    return (line.indexOf('coverage') === -1);
});
var out = require('./parse').paths(json);


out.forEach(function(line, k) {
    //Here we could do some filtering if we want to limit the tests
    out[k] = 'src/' + line;
});

console.log(out.join(' '));
