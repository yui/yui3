#!/usr/bin/env node

var YUI = require('../../build/yui-nodejs/yui-nodejs').YUI;

var zip = process.argv[2] || '90210';

YUI({ debug: true }).use('yql', function(Y) {
    Y.log('Pass a zipcode as an argument to get that locations weather.');

    Y.YQL('select * from weather.forecast where location=' + zip, function(r) {
        try {
            var c = r.query.results.channel.item;
            Y.log(c.title);
            Y.log('Current Temp: ' + c.condition.temp);
        } catch (e) {
            Y.log('YQL returned an error, please try a different zip code.', 'error', 'demo');
        }
    });

});
