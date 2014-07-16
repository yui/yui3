/*
* This file was assembled by ../scripts/build_loader_tests.js
*/

var path = require('path'),
    YUI = require(path.join(__dirname, '../../../../', 'build/yui/yui.js')).YUI;
    Y = YUI(),
    YUITest = require("yuitest").YUITest,
    Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    suite = new YUITest.TestSuite("YUILoader");

//Generic Async Wait
var async = function(fn) {
    var count = 0;
    return function(data) {
        var loaded = false;
        var w = function() {
            if (count === 1000) {
                throw new Error('Async Timer reached 1000 iterations..');
            }
            count++;
            if (!loaded) {
                this.wait(w, 10);
            }
        };
        var next = function() {
            loaded = true;
        };
        fn.call(this, data, next);
        this.wait(w, 10);
    };
};

/*
* !! TESTCASE !! will be replaced with a JSON object by the parent script.
*/
suite.add(new YUITest.TestCase(!!TESTCASE!!));

YUITest.TestRunner.add(suite);
