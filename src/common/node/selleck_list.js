#!/usr/bin/env node

/*

To be used with Yeti:

cd yui3;
"yeti --hub http://127.0.0.1:9000 `src/common/node/selleck_list.js`"

This will cause yeti to get the arguments that are echoed
from this script so that it can dynamically run the tests.

*/

var out = require('./selleck');

console.log(out.join(' '));
