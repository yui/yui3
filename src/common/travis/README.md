YUI on Node.js testing with TravisCI
====================================

This directory contains the scripts used to automate YUI's Node.js testing with TravisCI.

Scripts
-------

   * `before.sh` - Runs in the `before_install` build step to create the YUI npm package
   * `install.sh` - Runs in the `install` build step to do an `npm install` in `build-npm` (created from the above step)
   * `test.sh` - Runs in the `test` build step. It fetches the list of tests to execute, then executes YUITest on them.
   * `travis.sh` - Runs the travis tests locally for testing, not used in the Travis build.

Getting your tests in the build
-------------------------------

All `.js` files under `src/[module]/tests/cli/` will be picked up and added to each test run.

Running the tests locally
-------------------------

Clone the repo, then:

    cd yui3;
    ./src/common/travis/travis.sh

Or you can use `yogi`

    cd yui3/src;
    yogi test //All tests with CLI and Grover
    yogi --cli //Only CLI tests


Ways to format your tests
-------------------------

   * Break out your tests into a separate module to load
   * Ensure that your tests don't require a DOM, if they do add them to the ignore list against `Y.UA.nodejs`
   * If you are requiring external dependencies (files, modules) make sure the paths are changed to disk locations and not relative.

Using `_should` in YUITest
--------------------------

You should avoid wrapping assertions with `Y.UA.nodejs` inside your tests. The recommended approach is
to use YUITest's `_should` feature to ignore tests that are not applicable inside of Node.js.

```javascript

var testCase = new Y.Test.Case({
    name: 'My Test Case',
    _should: {
        ignore: {
            'test that requires a DOM': Y.UA.nodejs,
            'test that does not work in Node.js': Y.UA.nodejs
        }
    }
});

```

Sample tests
------------

   * Create a directory called `tests/cli`
   * Create a `run.js` in there like this:


```javascript
#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    //This loads the path to the NPM module
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI;


YUI({useSync: true }).use('test', function(Y) {
    //This maps the internal YUITest to the included module
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;
});
```

Sample Module
-------------

```javascript
YUI.add('my-nodejs-module', function(Y) {

    var suite = new Y.Test.Suite('My Node.js Module');
    // Insert tests here
    Y.Test.Runner.add(suite);

});
```

Sample HTML Page
----------------

Setup your HTML page as usual:

```javascript
YUI({
    modules: {
        'my-nodejs-module': {
            fullpath: './my-nodejs-module.js',
            requires: [ 'test', 'oop' ]
        }
    }
}).use('my-nodejs-module', function(Y) {
    Y.Test.Runner.run();
});
```

Setting up the Node.js Test
---------------------------

Now add the same module to your `run.js` script:

```javascript
#!/usr/bin/env node

process.chdir(__dirname);

var YUITest = require('yuitest'),
    path = require('path'),
    fs = require('fs'),
    dir = path.join(__dirname, '../../../../build-npm/'),
    YUI = require(dir).YUI;


YUI({useSync: true }).use('test', function(Y) {
    Y.Test.Runner = YUITest.TestRunner;
    Y.Test.Case = YUITest.TestCase;
    Y.Test.Suite = YUITest.TestSuite;
    Y.Assert = YUITest.Assert;

    Y.applyConfig({
        modules: {
            'my-nodejs-module': {
                fullpath: path.join(__dirname, '../my-nodejs-module.js'),
                requires: ['test', 'oop']
            }
        }
    });

    Y.use('my-nodejs-module');
    
    Y.Test.Runner.setName('cli tests');
    
});
```

Grover Tests
------------

After running the Node.js tests, Travis will run a subset of our main unit tests with (Grover)[http://github.com/davglass/grover].

It runs this command:

```
grover -t 180 -c 5  -i src/common/node/batch.js
```

This tells Grover to run the tests with a 180 second timeout and 5 concurrent processes.

It checks the env variable called `TRAVIS` and changes it's defaults.

On your local machine it will run 20 concurrent tests and all of the unit tests in the system.

On Travis, it runs 5 concurrent (for resourcing issues) and it removes the DD, Charts & Graphics tests from the list
due to them taking so long to execute that it was failing some builds.
