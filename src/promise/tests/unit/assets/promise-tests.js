YUI.add('promise-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise;

    /**
    Takes a promise and a callback. Calls the callback with a boolean paramter
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
        name: 'Promise tests'
    });

    // -- Lifecycle ----------------------------------------------------------------
    suite.add(new Y.Test.Case({
        name: 'Basic promise behavior',

        'calling Y.Promise as a function should return an instance of Y.Promise': function () {
            Assert.isInstanceOf(Y.Promise, Y.Promise(function () {}), 'Y.Promise as a function should return a promise');
        },

        'promise.then returns a promise': function () {
            var promise = new Y.Promise(function (fulfill) {
                fulfill(5);
            });

            Assert.isInstanceOf(Y.Promise, promise.then(), 'promise.then returns a promise');
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
        },

        'fulfilling more than once should not change the promise value': function () {
            var test = this;

            Promise(function (fulfill) {
                fulfill(true);
                fulfill(5);
            }).then(function (value) {
                test.resume(function () {
                    Assert.areSame(true, value, 'value should remain the same');
                });
            });

            test.wait(100);
        },

        'rejecting more than once should not change the rejection reason': function () {
            var test = this;

            Promise(function (fulfill, reject) {
                reject(new Error('foo'));
                reject(new Error('bar'));
            }).then(null, function (reason) {
                test.resume(function () {
                    Assert.areEqual('foo', reason.message, 'reason should remain the same');
                });
            });

            test.wait(100);
        },

        'correct value for "this" inside the promise init function': function () {
            var promiseA,
                promiseB = Y.Promise(function () {
                    promiseA = this;

                    Assert.isInstanceOf(Promise, this, '"this" should be a promise');
                });

            Assert.areSame(promiseA, promiseB, 'the return value of Y.Promise and "this" inside the init function should be the same');
        },

        'callbacks passed to then should be called asynchronously': function () {
            var test = this;

            var foo = false;

            Y.Promise(function (fulfill) {
                fulfill();
            }).then(function () {
                foo = true;
                test.resume();
            });

            Assert.areEqual(false, foo, 'callback should not modify local variable in this turn of the event loop');

            test.wait();
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Behavior of the then() callbacks',

        _should: {
            ignore: {
                '|this| inside a callback must be undefined in strict mode': (function () {
                    'use strict';
                    return typeof this !== 'undefined';
                }()),
                '|this| inside a callback must be the global object': (function () {
                    return typeof this === 'undefined';
                }())
            }
        },

        'throwing inside a callback should turn into a rejection': function () {
            var test = this,
                error = new Error('Arbitrary error');

            Y.Promise(function (fulfill) {
                fulfill(5);
            }).then(function (value) {
                throw error;
            }).then(null, function (reason) {
                test.resume(function () {
                    Assert.areSame(error, reason, 'thrown error should become the rejection reason');
                });
            });

            test.wait(50);
        },

        'returning a promise from a callback should link both promises': function () {
            var test = this;

            Y.Promise(function (fulfill) {
                fulfill('placeholder');
            }).then(function () {
                return Y.Promise(function (fulfill) {
                    fulfill(5);
                });
            }).then(function (value) {
                test.resume(function () {
                    Assert.areEqual(5, value, 'new value should be the value from the returned promise');
                });
            });

            test.wait(100);
        },

        // This test is run only when not in strict mode
        '|this| inside a callback must be the global object': function () {
            var test = this,
                fulfilled, rejected,
                fulfilledThis, rejectedThis;

            fulfilled = new Y.Promise(function (fulfill) {
                fulfill('value');
            });
            rejected = new Y.Promise(function (fulfill, reject) {
                reject('reason');
            });

            fulfilled.then(function () {
                fulfilledThis = this;
                rejected.then(null, function () {
                    rejectedThis = this;
                    test.resume(function () {
                        Assert.areSame(Y.config.global, fulfilledThis, 'when not in strict mode |this| in the success callback must be the global object');
                        Assert.areSame(Y.config.global, rejectedThis, 'when not in strict mode |this| in the failure callback must be the global object');
                    });
                });
            });

            test.wait(300);
        },

        // This test is run only in strict mode
        '|this| inside a callback must be undefined in strict mode': function () {
            'use strict';

            var test = this,
                fulfilled, rejected,
                fulfilledThis, rejectedThis;

            fulfilled = new Y.Promise(function (fulfill) {
                fulfill('value');
            });
            rejected = new Y.Promise(function (fulfill, reject) {
                reject('reason');
            });

            fulfilled.then(function () {
                fulfilledThis = this;
                rejected.then(null, function () {
                    rejectedThis = this;
                    test.resume(function () {
                        Assert.isUndefined(fulfilledThis, 'in strict mode |this| in the success callback must be undefined');
                        Assert.isUndefined(rejectedThis, 'in strict mode |this| in the failure callback must be undefined');
                    });
                });
            });

            test.wait(300);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'control flow with catch()',

        'promises have a catch() method': function () {
            var promise = new Promise(function () {});

            Assert.isFunction(promise['catch'], 'promises should have a `catch` method');
        },

        'catch(fn) does nothing to resolved promises': function () {
            var value = {foo:'bar'},
                resolved = new Promise(function (resolve) {
                    resolve(value);
                }),
                next,
                test = this;

            next = resolved['catch'](function (err) {
                return err;
            });

            Assert.isObject(next, 'catch() should return an object');
            Assert.isTrue(Promise.isPromise(next), 'catch() should return a promise');

            isFulfilled(next, function (fulfilled, val) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should still be fulfilled');
                    Assert.areSame(value, val, 'promise fulfilled value should remain the same')
                });
            });

            test.wait();
        },

        'catch(fn) is equivalent to then(undefined, fn)': function () {
            var reason = new Error('some error'),
                rejected = new Promise(function (resolve, reject) {
                    reject(reason);
                }),
                next, test = this;

            next = rejected['catch'](function (err) {
                return err;
            });

            isFulfilled(next, function (fulfilled, value) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should now be fulfilled');
                    Assert.areSame(reason, value, 'returning an error in catch() should cause the next promise to be fulfilled');
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise detection with Promise.isPromise',

        _should: {
            ignore: {
                'detect object with getters that throw': !Object.create
            }
        },

        'detecting YUI promises': function () {
            Assert.isTrue(isPromise(new Promise(function () {})), 'a YUI promise should be identified as a promise');
        },

        'detecting pseudo promises': function () {
            Assert.isTrue(isPromise({
                then: function () {
                    return 5;
                }
            }), 'a pseudo promise should be identified as a promise');
        },

        'failing for values and almost promises': function () {
            // truthy values
            Assert.isFalse(isPromise(5), 'numbers should not be identified as promises');
            Assert.isFalse(isPromise('foo'), 'strings should not be identified as promises');
            Assert.isFalse(isPromise(true), 'true booleans should not be identified as promises');
            Assert.isFalse(isPromise({}), 'objects should not be identified as promises');

            // false values
            Assert.isFalse(isPromise(0), 'zero should not be identified as a promise');
            Assert.isFalse(isPromise(''), 'empty strings should not be identified as promises');
            Assert.isFalse(isPromise(false), 'false booleans should not be identified as promises');
            Assert.isFalse(isPromise(null), 'null should not be identified as a promise');
            Assert.isFalse(isPromise(undefined), 'undefined should not be identified as a promise');

            // almost promises
            Assert.isFalse(isPromise({
                then: 5
            }), 'almost promises should not be identified as promises');
        },

        'detect object with getters that throw': function () {
            var nonPromise = Object.create(null, {
                then: {
                    get: function () {
                        throw new Error('isPromise did not catch an exception thrown by the getter of the `then` property');
                    }
                }
            });

            Assert.isFalse(isPromise(nonPromise), 'an object with a `then` property that throws should not be identified as a promise');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise factories tests',

        'Promise constructor has the correct methods': function () {
            Assert.isFunction(Promise.reject, 'Promise.reject should be a function');
            Assert.isFunction(Promise.resolve, 'Promise.resolve should be a function');
        },

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

        'Promise.reject() should preserve the constructor when using inheritance': function () {
            function Subpromise() {
                Subpromise.superclass.constructor.apply(this, arguments);
            }
            Y.extend(Subpromise, Promise);

            Subpromise.reject = Promise.reject;

            var promise = Subpromise.reject('foo');
            var test = this;

            isRejected(promise, function (rejected, reason) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'subpromise should be rejected');
                    Assert.areSame('foo', reason, 'subpromise should have the correct rejection reason');
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
        },

        'Promise.resolve() should preserve the constructor when using inheritance': function () {
            function Subpromise() {
                Subpromise.superclass.constructor.apply(this, arguments);
            }
            Y.extend(Subpromise, Promise);

            Subpromise.resolve = Promise.resolve;

            var promise = Subpromise.resolve('foo');
            var test = this;

            isFulfilled(promise, function (fulfilled, value) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'subpromise should be fulfilled');
                    Assert.areSame('foo', value, 'subpromise should have the correct fulfilled value');
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.all() tests',

        'Promise.all() should return a promise': function () {
            var somePromise = new Promise(function () {});

            Assert.isInstanceOf(Promise, Promise.all([5]), 'when passed a value, Promise.all() should return a promise');
            Assert.isInstanceOf(Promise, Promise.all([new Promise(function () {})]), 'when passed a promise, Promise.all() should return a promise');
            Assert.isInstanceOf(Promise, Promise.all([]), 'with an empty list Promise.all() should still return a promise');
            Assert.areNotSame(somePromise, Promise.all([somePromise]), 'when passed a promise, Promise.all() should return a new promise');
        },

        'a non array argument should turn into a rejected promise': function () {
            var test = this;

            isRejected(Promise.all('foo'), function (rejected, error) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'wrong argument for all() should return a rejected promise');
                    Assert.isInstanceOf(TypeError, error, 'rejection reason should be a TypeError');
                });
            });

            test.wait();
        },

        'order of promises should be preserved': function () {
            var test = this,
                promise = Promise.all([wait(20), wait(10), wait(15)]);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should be fulfilled');
                    ArrayAssert.itemsAreSame([20, 10, 15], result, 'order of returned values should be the same as the parameter list');
                });
            });

            test.wait();
        },

        'values should be wrapped in a promise': function () {
            var test = this,
                obj = {
                    hello: 'world'
                },
                promise = Promise.all(['foo', 5, obj]);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should be fulfilled');
                    ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to Promise.all() should be wrapped in promises, not ignored');
                });
            });

            test.wait();
        },

        'correct handling of function parameters': function () {
            var test = this, promise;

            function testFn() {}

            promise = Promise.all([testFn]);

            isFulfilled(promise, function (fulfilled, values) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should be fulfilled');
                    Assert.isFunction(values[0], 'promise value should be a function');
                    Assert.areSame(testFn, values[0], 'promise value should be the passed function');
                });
            });

            test.wait();
        },

        'Promise.all() should fail as fast as possible': function () {
            var test = this, promise;

            promise = Promise.all([rejectedAfter(20), rejectedAfter(10), rejectedAfter(15)]);

            isRejected(promise, function (rejected, reason) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected');
                    Assert.areEqual(10, reason, 'reason should be the one from the first promise to be rejected');
                });
            });

            test.wait();
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.race() tests',

        'a non array argument should turn into a rejected promise': function () {
            var test = this;

            isRejected(Promise.race('foo'), function (rejected, error) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'wrong argument for all() should return a rejected promise');
                    Assert.isInstanceOf(TypeError, error, 'rejection reason should be a TypeError');
                });
            });

            test.wait();
        },

        'Promise.race() should fulfill when passed a fulfilled promise': function () {
            var test = this,
                promise = Promise.race([wait(10)]);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should be fulfilled');
                    Assert.areEqual(10, result, 'Promise.race() should fulfill when passed a fulfilled promise');
                });
            });

            test.wait();
        },

        'Promise.race() should reject when passed a rejected promise': function () {
            var test = this,
                promise = Promise.race([rejectedAfter(10)]);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected');
                    Assert.areEqual(10, result, 'Promise.race() should reject when passed a rejected promise');
                });
            });

            test.wait();
        },

        'Promise.race() should fulfill to the value of the first promise to be fulfilled': function () {
            var test = this,
                promise = Promise.race([wait(10), wait(100)]);

            isFulfilled(promise, function (fulfilled, result) {
                test.resume(function () {
                    Assert.isTrue(fulfilled, 'promise should be fulfilled');
                    Assert.areEqual(10, result, 'Promise.race() should fulfill to the value of the first promise to be fulfilled');
                });
            });

            test.wait();
        },

        'Promise.race() should reject with the reason of the first promise to be rejected': function () {
            var test = this,
                promise = Promise.race([rejectedAfter(10), rejectedAfter(100)]);

            isRejected(promise, function (rejected, result) {
                test.resume(function () {
                    Assert.isTrue(rejected, 'promise should be rejected');
                    Assert.areEqual(10, result, 'Promise.race() should reject with the reason of the first promise to be rejected');
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.cast() tests',

        'a promise should not be modified': function () {
            var promise = Promise.resolve(),
                wrapped = Promise.cast(promise);

            Assert.isTrue(Promise.isPromise(promise), 'Promise.cast should always return a promise');
            Assert.areSame(promise, wrapped, 'Promise.cast should not modify a promise');
        },

        'values should be wrapped in a promise': function () {
            // truthy values
            Assert.isInstanceOf(Promise, Promise.cast(5), 'numbers should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast('foo'), 'strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(true), 'booleans should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(function () {}), 'functions should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast({}), 'objects should be wrapped in a promise');

            // falsy values
            Assert.isInstanceOf(Promise, Promise.cast(0), 'zero should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(''), 'empty strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(false), 'false should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(null), 'null should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(undefined), 'undefined should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.cast(), 'undefined (empty parameters) should be wrapped in a promise');

            // almost promises
            Assert.isInstanceOf(Promise, Promise.cast({then: 5}), 'promise-like objects should be wrapped in a promise');
        }
    }));


    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});
