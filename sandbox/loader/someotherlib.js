YUI.add('someotherlib', function (Y) {
 Y.someotherlib = 'someotherlib';

 Y.use('io', function (Y) {
   Y.log('io: ' + Y.io);
 });
}); 

