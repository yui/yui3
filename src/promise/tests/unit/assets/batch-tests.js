YUI.add('batch-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise;

    function wait(ms) {
        return new Promise(function (fulfill) {
            setTimeout(function () {
                fulfill(ms);
            }, ms);
        });
    }

    function rejectedAfter(ms) {
        return new Promise(function (fulfill, reject) {
            setTimeout(function () {
                reject(ms);
            }, ms);
        });
    }

    // -- Suite --------------------------------------------------------------------
    var suite = new Y.Test.Suite({
        name: 'Promise: Y.batch'
    });

    // -- Lifecycle ----------------------------------------------------------------
    suite.add(new Y.Test.Case({
        name: 'Y.batch basic tests',

        'batch should return a promise': function () {
            var somePromise = new Promise(function () {});

            Assert.isInstanceOf(Promise, Y.batch(5), 'when passed a value, batch should return a promise');
            Assert.isInstanceOf(Promise, Y.batch(new Promise(function () {})), 'when passed a promise, batch should return a promise');
            Assert.isInstanceOf(Promise, Y.batch(), 'with no parameters batch should still return a promise');
            Assert.areNotSame(somePromise, Y.batch(somePromise), 'when passed a promise, batch should return a new promise');
        },

        'empty parameter list should return an empty array': function () {
            var test = this;

            Y.batch().then(function (result) {
                test.resume(function () {
                    Assert.areSame(0, result.length, 'with no parameters, batch should result in an empty array');
                });
            });

            test.wait(100);
        },

        'order of promises should be preserved': function () {
            var test = this;

            Y.batch(wait(20), wait(10), wait(15)).then(function (result) {
                test.resume(function () {
                    ArrayAssert.itemsAreSame([20, 10, 15], result, 'order of returned values should be the same as the parameter list');
                });
            });

            test.wait();
        },

        'values should be wrapped in a promise': function () {
            var test = this,
                obj = {
                    hello: 'world'
                };

            Y.batch('foo', 5, obj).then(function (result) {
                test.resume(function () {
                    ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to batch should be wrapped in promises, not ignored');
                });
            });

            test.wait(100);
        },

        'correct handling of function parameters': function () {
            var test = this;

            function testFn() {}

            Y.batch(testFn).then(function (values) {
                test.resume(function () {
                    Assert.isFunction(values[0], 'promise value should be a function');
                    Assert.areSame(testFn, values[0], 'promise value should be the passed function');
                });
            });

            test.wait(100);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'rejection tests',

        'batch should fail as fast as possible': function () {
            var test = this;

            Y.batch(rejectedAfter(20), rejectedAfter(10), rejectedAfter(15)).then(null, function (reason) {
                test.resume(function () {
                    Assert.areEqual(10, reason, 'reason should be the one from the first promise to be rejected');
                });
            });

            test.wait(500);
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
