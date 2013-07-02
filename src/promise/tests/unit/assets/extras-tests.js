YUI.add('extras-tests', function (Y) {
    
    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise,
        SynchronousSoon = {
            setUp: function () {
                this._soon = Y.soon;

                Y.soon = function (fn) {
                    fn();
                };
            },
            tearDown: function () {
                Y.soon = this._soon;
            }
        };

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

    // These tests rely on Y.soon being synchronous
    // In particular promises are being made synchronous to be able to
    // test if promise.done() does not catch errors, by using a try...catch
    // block over it. If they were asynchronous then the try...catch block
    // would do nothing
    suite.add(new Y.Test.Case(Y.merge(SynchronousSoon, {
        name: 'promise.done() tests',

        'done() does not return a promise': function () {
            Assert.isUndefined(Promise.resolve('foo').done(), 'done() should return undefined');
        },

        'done() treats resolution the same way as then()': function () {
            var value = {},
                promise = Promise.resolve(value);

            function next(fulfilled, result) {
                Assert.isTrue(fulfilled, 'done() should respect the success path');
                Assert.areSame(value, result, 'done() should respect the promise value');
            }

            promise.done(function (x) {
                next(true, x);
            }, function (e) {
                next(false, e);
            });
        },

        'done() treats rejection the same way as then()': function () {
            var value = {},
                promise = Promise.reject(value);

            function next(fulfilled, result) {
                Assert.isFalse(fulfilled, 'done() should respect the failure path');
                Assert.areSame(value, result, 'done() should respect the promise value');
            }

            promise.done(function (x) {
                next(true, x);
            }, function (e) {
                next(false, e);
            });
        },

        'errors thrown inside done() are not caught': function () {
            var message = 'foo',
                value = new Error(message),
                promise = Promise.reject(value);

            // relies on setUp and tearDown replacing Y.soon with a synchronous version
            try {
                promise.done();
            } catch (err) {
                Assert.areSame(value, err, 'empty done() should send an uncaught error');
            }
        }

    })));

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

        'Promise.reject(fulfilledPromise) should allow created promise\'s rejection reason to be fulfilledPromise': function () {
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

        'Promise.reject(rejectedPromise) should allow created promise\'s rejection reason to be rejectedPromise': function () {
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

    suite.add(new Y.Test.Case(Y.merge(SynchronousSoon, {
        name: 'Promise.every() tests',

        'Promise.every() should return a promise': function () {
            var somePromise = new Promise(function () {});

            Assert.isInstanceOf(Promise, Promise.every([5]), 'when passed a value, Promise.every() should return a promise');
            Assert.isInstanceOf(Promise, Promise.every([new Promise(function () {})]), 'when passed a promise, Promise.every() should return a promise');
            Assert.isInstanceOf(Promise, Promise.every([]), 'with an empty list Promise.every() should still return a promise');
            Assert.areNotSame(somePromise, Promise.every([somePromise]), 'when passed a promise, Promise.every() should return a new promise');
        },

        'empty list should resolve to undefined': function () {
            Promise.every([]).then(function (result) {
                Assert.isUndefined(result, 'with an empty list Promise.every() should resolve to undefined');
            });
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
            var obj = {
                    hello: 'world'
                };

            Promise.every(['foo', 5, obj]).then(function (result) {
                ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to Promise.every() should be wrapped in promises, not ignored');
            });
        },

        'correct handling of function parameters': function () {
            function testFn() {}

            Promise.every([testFn]).then(function (values) {
                Assert.isFunction(values[0], 'promise value should be a function');
                Assert.areSame(testFn, values[0], 'promise value should be the passed function');
            });
        },

        'Promise.every() should fail as fast as possible': function () {
            var sync = false;

            Promise.every([rejectedAfter(20), Promise.reject(0), rejectedAfter(15)]).then(null, function (reason) {
                sync = true;
                Assert.areSame(0, reason, 'reason should be the one from the first promise to be rejected');
            });

            // This is a consequence of the test being run synchronously, not
            // a property of the function itself. This assertion is present here
            // to check if the promise returned by every() was rejected
            // synchronously or if it is waiting for the delayed rejections
            // If it waits for the rejection no assertions would be run and no
            // errors would appear because the test is not using test.wait()
            Assert.areSame(true, sync, 'every() should be rejected synchronously');
        }

    })));

    suite.add(new Y.Test.Case({
        name: 'Promise.any() tests',

        'empty list should resolve to undefined': function () {
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

    suite.add(new Y.Test.Case(Y.merge(SynchronousSoon, {
        name: 'Promise.some() tests',

        'empty list should resolve to undefined': function () {
            Promise.some([]).then(function (result) {
                Assert.isUndefined(result, 'Promise.some() with an empty list should resolve to undefined');
            });
        },

        'one fulfilled promise should fulfill the returned promise': function () {
            var test = this;

            Promise.some([rejectedAfter(10), wait(20), rejectedAfter(100)]).then(function (result) {
                test.resume(function () {
                    Assert.areEqual(20, result, 'promise should be resolved to the first fulfilled value');
                });
            }, function (err) {
                test.resume(function () {
                    Assert.fail(err);
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
        },

        'Promise.some() should resolve as fast as possible': function () {
            var sync = false;

            Promise.some([wait(20), Promise.resolve(0), wait(15)]).then(function (value) {
                sync = true;
                Assert.areSame(0, value, 'value should be the one from the first promise to be resolved');
            });

            // This is a consequence of the test being run synchronously, not
            // a property of the function itself. This assertion is present here
            // to check if the promise returned by some() was resolved
            // synchronously or if it is waiting for the delayed resolutions
            // If it has to wait for the resolution no assertions would be run
            // and no errors would appear because the test is not using test.wait()
            Assert.areSame(true, sync, 'some() should be resolved synchronously');
        }
    })));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
