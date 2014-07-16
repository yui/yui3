YUI.add('batch-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        wait = Y.fulfilledAfter,
        rejectedAfter = Y.rejectedAfter;

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
            this.isFulfilled(Y.batch(), function (result) {
                Assert.areSame(0, result.length, 'with no parameters, batch should result in an empty array');
            });
        },

        'order of promises should be preserved': function () {
            var promise = Y.batch(wait(20), wait(10), wait(15));

            this.isFulfilled(promise, function (result) {
                ArrayAssert.itemsAreSame([20, 10, 15], result, 'order of returned values should be the same as the parameter list');
            });
        },

        'values should be wrapped in a promise': function () {
            var obj = {
                    hello: 'world'
                };

            this.isFulfilled(Y.batch('foo', 5, obj), function (result) {
                ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to batch should be wrapped in promises, not ignored');
            });
        },

        'correct handling of function parameters': function () {
            function testFn() {}

            this.isFulfilled(Y.batch(testFn), function (values) {
                Assert.isFunction(values[0], 'promise value should be a function');
                Assert.areSame(testFn, values[0], 'promise value should be the passed function');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'rejection tests',

        'batch should fail as fast as possible': function () {
            var promise = Y.batch(rejectedAfter(20), rejectedAfter(10), rejectedAfter(15));

            this.isRejected(promise, function (reason) {
                Assert.areEqual(10, reason, 'reason should be the one from the first promise to be rejected');
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'tests-promise-utils'
    ]
});
