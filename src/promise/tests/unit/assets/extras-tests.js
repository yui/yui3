YUI.add('extras-tests', function (Y) {
    
    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise;

    /**
    Takes a promise and a callback. Calls the callback with a boolean parameter
    indicating if the promise is fulfilled and the value as the next parameter
    **/
    function isFulfilled(promise, next) {
        promise.then(function (x) {
            next(true, x);
        }, function (e) {
            next(false, e);
        });
    }

    /**
    Takes a promise and a callback. Calls the callback with a boolean parameter
    indicating if the promise is rejected and the reason as the next parameter
    **/
    function isRejected(promise, next) {
        promise.then(function (x) {
            next(false, x);
        }, function (e) {
            next(true, e);
        });
    }

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
        name: 'Promise extras tests'
    });

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

        'done() does not return a promise': function () {
            Assert.isUndefined(Promise.resolve('foo').done(), 'done() should return undefined');
        },

        'done() treats resolution the same way as then()': function () {
            var test = this,
                value = {},
                promise = Promise.resolve(value);

            function next(fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'done() should respect the success path');
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

        'done() treats rejection the same way as then()': function () {
            var test = this,
                value = {},
                promise = Promise.reject(value);

            function next(fulfilled, result) {
                test.resume(function () {
                    Assert.isFalse(fulfilled, 'done() should respect the failure path');
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
                e.halt();
                test.resume(function () {
                    Assert.isTrue(e._event.message.indexOf(message) > -1, 'empty done() should send an uncaught error');
                });
            });

            test.wait(250);
        },

        'promise state should change synchronously': function () {
            var pending = new Promise(function () {}),
                fulfilled = new Promise(function (resolve) {
                    resolve(5);
                }),
                rejected = new Promise(function (resolve, reject) {
                    reject('foo');
                });

            Assert.isString(pending.getStatus(), 'status should be a string');
            Assert.isString(fulfilled.getStatus(), 'status should be a string');
            Assert.isString(rejected.getStatus(), 'status should be a string');

            Assert.areEqual('pending',   pending.getStatus(),   'pending promise status should be "pending"');
            Assert.areEqual('fulfilled', fulfilled.getStatus(), 'fulfilled promise status should be "fulfilled"');
            Assert.areEqual('rejected',  rejected.getStatus(),  'rejected promise status should be "rejected"');
        },

        'promise state should change only once': function () {
            var fulfilled = new Promise(function (fulfill, reject) {
                    Assert.areEqual('pending', this.getStatus(), 'before fulfillment the resolver status should be "pending"');

                    fulfill(5);

                    Assert.areEqual('fulfilled', this.getStatus(), 'once fulfilled the resolver status should be "fulfilled"');

                    reject(new Error('reject'));

                    Assert.areEqual('fulfilled', this.getStatus(), 'rejecting a fulfilled promise should not change its status');
                }),

                rejected = new Promise(function (fulfill, reject) {
                    Assert.areEqual('pending', this.getStatus(), 'before rejection the resolver status should be "pending"');

                    reject(new Error('reject'));

                    Assert.areEqual('rejected', this.getStatus(), 'once rejected the resolver status should be "rejected"');

                    fulfill(5);

                    Assert.areEqual('rejected', this.getStatus(), 'fulfilling a rejected promise should not change its status');
                });

            Assert.areEqual('fulfilled', fulfilled.getStatus(), 'status of a fulfilled promise should be "fulfilled"');
            Assert.areEqual('rejected', rejected.getStatus(), 'status of a rejected promise should be "rejected"');
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Promise factories tests',

        'Promise.reject() returns an rejected promise': function () {
            var test = this,
                value = new Error('foo'),
                promise = Promise.reject(value);

            Assert.isTrue(isPromise(promise), 'Promise.reject() should return a promise');

            isRejected(promise, function next(rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected, not fulfilled');
                    Assert.areSame(value, result, 'Promise.reject() should respect the passed value');
                });
            });

            test.wait();
        },

        'Promise.reject() should wrap fulfilled promises': function () {
            var test = this,
                value = new Promise(function (resolve) {
                    resolve('foo');
                }),
                promise = Promise.reject(value);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected, not fulfilled');
                    Assert.areSame(value, result, 'Promise.reject() should wrap fulfilled promises');
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
                    Assert.isTrue(rejected, 'promise should be rejected, not fulfilled');
                    Assert.areSame(value, result, 'Promise.reject() should wrap rejected promises');
                });
            });

            test.wait();
        },

        'Promise.resolve() is fulfilled when passed a regular value': function () {
            var test = this,
                value = {},
                promise = Promise.resolve(value);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'resolved promise should be fulfilled');
                    Assert.areSame(value, result, 'resolved promise should respect the value passed to it');
                });
            });

            test.wait();
        },

        'Promise.resolve() adopts the state of an fulfilled promise': function () {
            var test = this,
                value = {},
                fulfilled = Promise.resolve(value),
                promise = Promise.resolve(fulfilled);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'resolved promise should be fulfilled');
                    Assert.areSame(value, result, 'resolved promise should take the value of the provided promise');
                });
            });

            test.wait();
        },

        'Promise.resolve() adopts the state of a rejected promise': function () {
            var test = this,
                value = {},
                fulfilled = Promise.reject(value),
                promise = Promise.resolve(fulfilled);

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
        name: 'Promise.every() tests',

        'Promise.empty() should return a promise': function () {
            var somePromise = new Promise(function () {});

            Assert.isInstanceOf(Promise, Promise.every([5]), 'when passed a value, Promise.every() should return a promise');
            Assert.isInstanceOf(Promise, Promise.every([new Promise(function () {})]), 'when passed a promise, Promise.every() should return a promise');
            Assert.isInstanceOf(Promise, Promise.every([]), 'with an empty list Promise.every() should still return a promise');
            Assert.areNotSame(somePromise, Promise.every([somePromise]), 'when passed a promise, Promise.every() should return a new promise');
        },

        'empty list should resolve to undefined': function () {
            var test = this;

            Promise.every([]).then(function (result) {
                test.resume(function () {
                    Assert.isUndefined(result, 'with an empty list Promise.every() should resolve to undefined');
                });
            });

            test.wait();
        },

        'order of promises should be preserved': function () {
            var test = this;

            Promise.every([wait(20), wait(10), wait(15)]).then(function (result) {
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

            Promise.every(['foo', 5, obj]).then(function (result) {
                test.resume(function () {
                    ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to Promise.every() should be wrapped in promises, not ignored');
                });
            });

            test.wait();
        },

        'correct handling of function parameters': function () {
            var test = this;

            function testFn() {}

            Promise.every([testFn]).then(function (values) {
                test.resume(function () {
                    Assert.isFunction(values[0], 'promise value should be a function');
                    Assert.areSame(testFn, values[0], 'promise value should be the passed function');
                });
            });

            test.wait();
        },

        'Promise.every() should fail as fast as possible': function () {
            var test = this;

            Promise.every([rejectedAfter(20), rejectedAfter(10), rejectedAfter(15)]).then(null, function (reason) {
                test.resume(function () {
                    Assert.areEqual(10, reason, 'reason should be the one from the first promise to be rejected');
                });
            });

            test.wait();
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.any() tests',

        'empty list shoudl resolve to undefined': function () {
            var test = this;

            Promise.any([]).then(function (result) {
                test.resume(function () {
                    Assert.isUndefined(result, 'Promise.any() with an empty list should resolve to undefined');
                });
            });

            test.wait();
        },

        'Promise.any() should fulfill when passed a fulfilled promise': function () {
            var test = this;

            Promise.any([wait(10)]).then(function (result) {
                test.resume(function () {
                    Assert.areEqual(10, result, 'Promise.any() should fulfill when passed a fulfilled promise');
                });
            });

            test.wait();
        },

        'Promise.any() should reject when passed a rejected promise': function () {
            var test = this;

            Promise.any([rejectedAfter(10)]).then(null, function (result) {
                test.resume(function () {
                    Assert.areEqual(10, result, 'Promise.any() should reject when passed a rejected promise');
                });
            });

            test.wait();
        },

        'Promise.any() should fulfill to the value of the first promise to be fulfilled': function () {
            var test = this;

            Promise.any([wait(10), wait(100)]).then(function (result) {
                test.resume(function () {
                    Assert.areEqual(10, result, 'Promise.any() should fulfill to the value of the first promise to be fulfilled');
                });
            });

            test.wait();
        },

        'Promise.any() should reject with the reason of the first promise to be rejected': function () {
            var test = this;

            Promise.any([rejectedAfter(10), rejectedAfter(100)]).then(null, function (result) {
                test.resume(function () {
                    Assert.areEqual(10, result, 'Promise.any() should reject with the reason of the first promise to be rejected');
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.some() tests',

        'empty list should resolve to undefined': function () {
            var test = this;

            Promise.some([]).then(function (result) {
                test.resume(function () {
                    Assert.isUndefined(result, 'Promise.some() with an empty list should resolve to undefined');
                });
            });

            test.wait();
        },

        'one fulfilled promise should fulfill the returned promise': function () {
            var test = this;

            Promise.some([rejectedAfter(10), wait(20), rejectedAfter(100)]).then(function (result) {
                test.resume(function () {
                    Assert.areEqual(20, result, 'promise should be resolved to the first fulfilled value');
                });
            }, function (err) {
                test.resume(function () {
                    throw err;
                });
            });

            test.wait();
        },

        'all rejected promises should reject the returned promise': function () {
            var test = this;

            Promise.some([rejectedAfter(20), rejectedAfter(10)]).then(null, function (results) {
                test.resume(function () {
                    Assert.isArray(results, 'rejection reason should be an array');
                    ArrayAssert.itemsAreSame([20, 10], results, 'array of reasons should match the order passed to Promise.some()');
                });
            });

            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
