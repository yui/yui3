#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  out = path.join(__dirname, '../', 'js', 'wf2-alias.js'),
  keys = [],
  values = [],
  wf2Alias;

wf2Alias = fs.readFileSync(path.join(__dirname, '..', '..') + '/wf2-alias.json');

var alias = JSON.parse(wf2Alias || '[]');

//remove entries without a key or value
var arr = alias.filter(function (item) {
    return item.key && item.module;
});

//sort by length of value (longest first)
function lengthComparitor(a, b){
var thisLen = a.module.length,
  thatLen = b.module.length;

  if(thisLen > thatLen) {
    return -1;
  }
  if(thisLen === thatLen) {
    return 0;
  }
  return 1;
}
arr.sort(lengthComparitor);

// populate key and value arrays
arr.forEach(function(item) {
  keys.push(item.key);
  values.push(item.module);
});

// write wf2-alias-arrays.js containing key/value arrays on YUI.Env[Y.version]
var str = '';
str += 'YUI.Env[Y.version].WF2_ALIAS_KEYS = ' + JSON.stringify(keys) + ';';
str += '\n';
str += 'YUI.Env[Y.version].WF2_ALIAS_VALUES = ' + JSON.stringify(values) + ';';
fs.writeFileSync(out, str, 'utf8');
