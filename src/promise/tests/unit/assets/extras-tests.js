YUI.add('extras-tests', function (Y) {
    
    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise;

    /**
    Takes a promise and a callback. Calls the callback with a boolean paramter
    indicating if the promise is accepted and the value as the next parameter
    **/
    function isAccepted(promise, next) {
        promise.then(function (x) {
            next(true, x);
        }, function (e) {
            next(false, e);
        });
    }

    /**
    Takes a promise and a callback. Calls the callback with a boolean paramter
    indicating if the promise is rejected and the reason as the next parameter
    **/
    function isRejected(promise, next) {
        promise.then(function (x) {
            next(false, x);
        }, function (e) {
            next(true, e);
        });
    }

    // -- Suite --------------------------------------------------------------------
    var suite = new Y.Test.Suite({
        name: 'Promise core tests'
    });

    suite.add(new Y.Test.Case({
        name: 'Promise factories tests',

        'Promise.accept() returns an accepted promise': function () {
            var test = this,
                value = {},
                promise = Promise.accept(value);

            Assert.isTrue(isPromise(promise), 'accept() should return a promise');

            isAccepted(promise, function (accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'promise should be accepted, not rejected');
                    Assert.areSame(value, result, 'accept() should respect the passed value');
                });
            });

            test.wait();
        },

        'Promise.accept() should wrap accepted promises': function () {
            var test = this,
                value = new Promise(function (resolve) {
                    resolve('foo');
                }),
                promise = Promise.accept(value);

            isAccepted(promise, function (accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'promise should be accepted, not rejected');
                    Assert.areSame(value, result, 'Promise.accept() should wrap accepted promises');
                });
            });

            test.wait();
        },

        'Promise.accept() should wrap rejected promises': function () {
            var test = this,
                value = new Promise(function (resolve, reject) {
                    reject('foo');
                }),
                promise = Promise.accept(value);

            isAccepted(promise, function (accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'promise should be accepted, not rejected');
                    Assert.areSame(value, result, 'Promise.accept() should wrap rejected promises');
                });
            });

            test.wait();
        },

        'Promise.reject() returns an rejected promise': function () {
            var test = this,
                value = new Error('foo'),
                promise = Promise.reject(value);

            Assert.isTrue(isPromise(promise), 'Promise.reject() should return a promise');

            isRejected(promise, function next(rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected, not accepted');
                    Assert.areSame(value, result, 'Promise.reject() should respect the passed value');
                });
            });

            test.wait();
        },

        'Promise.reject() should wrap accepted promises': function () {
            var test = this,
                value = new Promise(function (resolve) {
                    resolve('foo');
                }),
                promise = Promise.reject(value);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected, not accepted');
                    Assert.areSame(value, result, 'Promise.reject() should wrap accepted promises');
                });
            });

            test.wait();
        },

        'Promise.reject() should wrap rejected promises': function () {
            var test = this,
                value = new Promise(function (resolve, reject) {
                    reject('foo');
                }),
                promise = Promise.reject(value);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected, not accepted');
                    Assert.areSame(value, result, 'Promise.reject() should wrap rejected promises');
                });
            });

            test.wait();
        },

        'Promise.resolve() is accepted when passed a regular value': function () {
            var test = this,
                value = {},
                promise = Promise.resolve(value);

            isAccepted(promise, function (accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'resolved promise should be accepted');
                    Assert.areSame(value, result, 'resolved promise should respect the value passed to it');
                });
            });

            test.wait();
        },

        'Promise.resolve() adopts the state of an accepted promise': function () {
            var test = this,
                value = {},
                accepted = Promise.accept(value),
                promise = Promise.resolve(accepted);

            isAccepted(promise, function (accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'resolved promise should be accepted');
                    Assert.areSame(value, result, 'resolved promise should take the value of the provided promise');
                });
            });

            test.wait();
        },

        'Promise.resolve() adopts the state of a rejected promise': function () {
            var test = this,
                value = {},
                accepted = Promise.reject(value),
                promise = Promise.resolve(accepted);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'resolved promise should be rejected');
                    Assert.areSame(value, result, 'resolved promise should take the value of the provided promise');
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise extra methods tests',

        _should: {
            ignore: {
                'errors thrown inside done() are not caught': !Y.config.win
            }
        },

        'fail() adds an errback to a rejected promise': function () {
            var test = this,
                expected = new Error('foo'),
                promise = Promise.reject(expected),
                returnValue;

            returnValue = promise.fail(function (err) {
                test.resume(function () {
                    Assert.areSame(expected, err, 'Promise rejected with the wrong reason');
                    Assert.isTrue(isPromise(returnValue), 'fail() should return a promise');
                });
            });

            test.wait(250);
        },

        'done() behaves in a similar way to then()': function () {
            var test = this,
                value = {},
                promise = Promise.accept(value);

            function next(accepted, result) {
                test.resume(function () {
                    Assert.isTrue(accepted, 'done() should respect the success path');
                    Assert.areSame(value, result, 'done() should respect the promise value');
                });
            }

            promise.done(function (x) {
                next(true, x);
            }, function (e) {
                next(false, e);
            });

            test.wait();
        },

        'errors thrown inside done() are not caught': function () {
            var test = this,
                message = 'foo',
                value = new Error(message),
                promise = Promise.reject(value);

            promise.done();

            Y.one('win').once('error', function (e) {
                test.resume(function () {
                    Assert.isTrue(e._event.message.indexOf(message) > -1, 'empty done() should send an uncaught error');
                });
            });

            test.wait(250);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise combinator tests'
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
