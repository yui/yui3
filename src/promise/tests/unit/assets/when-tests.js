YUI.add('when-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise;

    // -- Suite --------------------------------------------------------------------
    var suite = new Y.Test.Suite({
        name: 'Y.when tests'
    });

    // -- Lifecycle ----------------------------------------------------------------
    suite.add(new Y.Test.Case({
        name: 'correct handling of different types of arguments',

        'a promise should not be modified': function () {
            var test = this,
                promise = new Promise(function (fulfill) {
                    fulfill(5);
                }),
                wrapped = Y.when(promise);

            Assert.areSame(promise, wrapped, 'Y.when should not modify a promise');
        },

        'values should be wrapped in a promise': function () {
            // truthy values
            Assert.isInstanceOf(Promise, Y.when(5), 'numbers should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when('foo'), 'strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(true), 'booleans should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(function () {}), 'functions should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when({}), 'objects should be wrapped in a promise');

            // falsy values
            Assert.isInstanceOf(Promise, Y.when(0), 'zero should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(''), 'empty strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(false), 'false should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(null), 'null should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(undefined), 'undefined should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Y.when(), 'undefined (empty parameters) should be wrapped in a promise');

            // almost promises
            Assert.isInstanceOf(Promise, Y.when({then: 5}), 'promise-like objects should be wrapped in a promise');
        },

        'callbacks should behave the same as using then()': function () {
            var test = this,
                value = 'not modified',
                error = new Error('reason');

            Y.when(new Y.Promise(function (fulfill) {
                fulfill(5);
            }), function (result) {
                value = 'modified';

                test.resume(function () {
                    Assert.areEqual(5, result, 'first callback should receive the result of a fulfilled promise');
                });
            });

            Assert.areEqual('not modified', value, 'value should not be changed by a callback synchronously');

            test.wait(50);
        },

        'errbacks should behave the same as using then()': function () {
            var test = this,
                error = new Error('reason');

            Y.when(new Y.Promise(function (fulfill, reject) {
                reject(error);
            }), null, function (reason) {
                test.resume(function () {
                    Assert.areSame(error, reason, 'second callback should receive the reason of a rejected promise');
                });
            });

            test.wait(50);
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
