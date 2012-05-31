#!/usr/bin/env node

var path = require('path');

var base = path.join(__dirname, '../../');

var paths = require('./parse');

paths.forEach(function(p, i) {
    paths[i] = path.join(base, p);
});

module.exports = paths;
