#!/usr/bin/env node

var path = require('path');

var YUI = require(path.join('../../../../', 'build-npm')).YUI;

console.log(YUI.version);
