#!/usr/bin/env node

var YUI = require('../../build/yui-nodejs/yui-nodejs-debug').YUI;

YUI({ debug: true }).use('jsonp', function(Y) {

    Y.jsonp('https://github.com/api/v2/json/user/show/yui?callback={callback}', function(d) {
        Y.log(d);
    });

});
