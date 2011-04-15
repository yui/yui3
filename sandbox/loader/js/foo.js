YUI.add('module-bar', function(Y) {
  console.log("BAR LOADED");
}, '1');


YUI.add('module-foo', function(Y) {
  console.log("FOO LOADED");
}, '1', { requires: [ 'module-bar'] });
