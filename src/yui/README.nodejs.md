YUI in NodeJS
=============

The YUI system needs to be built in order for it to work inside of NodeJS properly.
We have created a script to do this for you so you can create an npm packge that's
installable and usable locally.

We have also created a new seed file for YUI inside of node (`yui-nodejs`) that 
loads all of the YUI modules needed to make YUI run on node properly.

Installation
------------

To create the package you need `bash`, `make`, `node` and `npm` installed.

    cd yui3/src/yui
    make npm

By default this will create the package here:

    /tmp/npm-yui/

Then you can use `npm` to install this package like this:

    mkdir yui_test
    cd yui_test
    npm i /tmp/npm-yui/

Now `npm ls` will show that the package is installed locally in this directory.


Usage
-----

Once the yui package has been installed, you can still access it like you used to:

```javascript
var YUI = require('yui').YUI;

YUI().use('oop', function(Y) {
    console.log('OOP?', (Y.rbind) ? true : false); //true
});
```

We have also added support for YUI "requiring" in a more "CommonJS" manner:

```javascript
var Y = require('yui/base-base');
console.log('Base?', (Y.Base) ? true : false); //true

var Y = require('yui/yql');
console.log('YQL?', (Y.YQL) ? true : false); //true
```

When you require a YUI module more than once in a process, the YUI instance
used under the hood is shared. 

```javascript
var Y = require('yui/yql');
console.log('YQL #1?', (Y.YQL) ? true : false); //true
console.log('Base #1?', (Y.Base) ? true : false); //false

var Y = require('yui/base-base');
console.log('YQL #2?', (Y.YQL) ? true : false); //true
console.log('Base #2?', (Y.Base) ? true : false); //true
```


You can also do one YUI use on require and load several modules at once:

```javascript
var Y = require('yui').use('yql', 'oop', 'base-base');

console.log('OOP?', (Y.rbind) ? true : false); //true
console.log('YQL?', (Y.YQL) ? true : false); //true
console.log('Base?', (Y.Base) ? true : false); //true
```

Sync vs Async
-------------

Doing a require, like above, where you select your modules inside the require will
make that YUI instance sync by default:

```javascript
//This will be sync
var Y = require('yui').use('yql', 'oop', 'base-base');
```

Using YUI like you do in the browser will make YUI async:

```javascript
var YUI = require('yui').YUI;
//This will be async
YUI().use('oop', function(Y) {
    console.log('OOP?', (Y.rbind) ? true : false); //true
});
```

You can force a sync use by setting the `useSync` config option in they YUI constructor:

```javascript
var YUI = require('yui').YUI;
//This is sync
var Y = YUI({ useSync: true }).use('oop');
console.log('OOP?', (Y.rbind) ? true : false); //true
```
