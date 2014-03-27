YUI.add('promise-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise,
        wait = Y.fulfilledAfter,
        rejectedAfter = Y.rejectedAfter;

    // -- Suite --------------------------------------------------------------------
    var suite = new Y.Test.Suite({
        name: 'Promise tests'
    });

    // -- Lifecycle ----------------------------------------------------------------
    suite.add(new Y.Test.Case({
        name: 'Basic promise behavior',

        'calling Y.Promise as a function should return an instance of Y.Promise': function () {
            Assert.isInstanceOf(Promise, Promise(function () {}), 'Y.Promise as a function should return a promise');
        },

        'promise.then returns a promise': function () {
            var promise = new Promise(function (fulfill) {
                fulfill(5);
            });

            Assert.isInstanceOf(Promise, promise.then(), 'promise.then returns a promise');
        },

        'promise state should change only once': function () {
            var resolveA, rejectA, promiseA, resolveB, rejectB, promiseB;

            promiseA = new Promise(function (resolve, reject) {
                resolveA = resolve;
                rejectA = reject;
            });
            promiseB = new Promise(function (resolve, reject) {
                resolveB = resolve;
                rejectB = reject;
            });

            Assert.areEqual('pending', promiseA.getStatus(), 'before fulfillment the resolver status should be "pending"');
            resolveA(5);
            Assert.areEqual('fulfilled', promiseA.getStatus(), 'once fulfilled the resolver status should be "fulfilled"');
            rejectA(new Error('reject'));
            Assert.areEqual('fulfilled', promiseA.getStatus(), 'rejecting a fulfilled promise should not change its status');

            Assert.areEqual('pending', promiseB.getStatus(), 'before rejection the resolver status should be "pending"');
            rejectB(new Error('reject'));
            Assert.areEqual('rejected', promiseB.getStatus(), 'once rejected the resolver status should be "rejected"');
            resolveB(5);
            Assert.areEqual('rejected', promiseB.getStatus(), 'fulfilling a rejected promise should not change its status');
        },

        'fulfilling more than once should not change the promise value': function () {
            var promise = new Promise(function (fulfill) {
                fulfill(true);
                fulfill(5);
            });

            this.isFulfilled(promise, function (value) {
                Assert.areSame(true, value, 'value should remain the same');
            });
        },

        'rejecting more than once should not change the rejection reason': function () {
            var promise = new Promise(function (fulfill, reject) {
                reject(new Error('foo'));
                reject(new Error('bar'));
            });

            this.isRejected(promise, function (reason) {
                Assert.areEqual('foo', reason.message, 'reason should remain the same');
            });
        },

        'correct value for "this" inside the promise init function': function () {
            var promiseA,
                promiseB = new Promise(function () {
                    promiseA = this;

                    Assert.isInstanceOf(Promise, this, '"this" should be a promise');
                });

            Assert.areSame(promiseA, promiseB, 'the return value of Y.Promise and "this" inside the init function should be the same');
        },

        'callbacks passed to then should be called asynchronously': function () {
            var test = this;

            var foo = false;

            var promise = new Promise(function (fulfill) {
                fulfill();
            }).then(function () {
                foo = true;
                test.resume();
            });

            Assert.areEqual(false, foo, 'callback should not modify local variable in this turn of the event loop');

            test.wait();
        },

        'errors thrown inside the promise init function should turn into rejections': function () {
            var error = new Error('foo'),
                promise = new Promise(function () {
                    throw error;
                });

            this.isRejected(promise, function (reason) {
                Assert.areSame(error, reason, 'thrown error should become the rejection reason');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Behavior of the then() callbacks',

        _should: {
            ignore: {
                '`this` inside a callback must be undefined in strict mode': (function () {
                    'use strict';
                    return typeof this !== 'undefined';
                }()),
                '`this` inside a callback must be the global object': (function () {
                    return typeof this === 'undefined';
                }())
            }
        },

        'throwing inside a callback should turn into a rejection': function () {
            var error = new Error('Arbitrary error');

            var promise = new Promise(function (fulfill) {
                fulfill(5);
            }).then(function (value) {
                throw error;
            });

            this.isRejected(promise, function (reason) {
                Assert.areSame(error, reason, 'thrown error should become the rejection reason');
            });
        },

        'returning a promise from a callback should link both promises': function () {
            var promise = Promise(function (fulfill) {
                fulfill('placeholder');
            }).then(function () {
                return new Promise(function (fulfill) {
                    fulfill(5);
                });
            });

            this.isFulfilled(promise, function (value) {
                Assert.areEqual(5, value, 'new value should be the value from the returned promise');
            });
        },

        // This test is run only when not in strict mode
        '`this` inside a callback must be the global object': function () {
            var test = this,
                fulfilled, rejected,
                fulfilledThis, rejectedThis;

            fulfilled = new Promise(function (fulfill) {
                fulfill('value');
            });
            rejected = new Promise(function (fulfill, reject) {
                reject('reason');
            });

            fulfilled.then(function () {
                fulfilledThis = this;
                rejected.then(null, function () {
                    rejectedThis = this;
                    test.resume(function () {
                        Assert.areSame(Y.config.global, fulfilledThis, 'when not in strict mode `this` in the success callback must be the global object');
                        Assert.areSame(Y.config.global, rejectedThis, 'when not in strict mode `this` in the failure callback must be the global object');
                    });
                });
            });

            test.wait();
        },

        // This test is run only in strict mode
        '`this` inside a callback must be undefined in strict mode': function () {
            'use strict';

            var test = this,
                fulfilled, rejected,
                fulfilledThis, rejectedThis;

            fulfilled = new Promise(function (fulfill) {
                fulfill('value');
            });
            rejected = new Promise(function (fulfill, reject) {
                reject('reason');
            });

            fulfilled.then(function () {
                fulfilledThis = this;
                rejected.then(null, function () {
                    rejectedThis = this;
                    test.resume(function () {
                        Assert.isUndefined(fulfilledThis, 'in strict mode `this` in the success callback must be undefined');
                        Assert.isUndefined(rejectedThis, 'in strict mode `this` in the failure callback must be undefined');
                    });
                });
            });

            test.wait();
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
                next;

            next = resolved['catch'](function (err) {
                return err;
            });

            Assert.isObject(next, 'catch() should return an object');
            Assert.isTrue(Promise.isPromise(next), 'catch() should return a promise');

            this.isFulfilled(next, function (val) {
                Assert.areSame(value, val, 'promise fulfilled value should remain the same')
            });
        },

        'catch(fn) is equivalent to then(undefined, fn)': function () {
            var reason = new Error('some error'),
                rejected = new Promise(function (resolve, reject) {
                    reject(reason);
                }),
                next;

            next = rejected['catch'](function (err) {
                return err;
            });

            this.isFulfilled(next, function (value) {
                Assert.areSame(reason, value, 'returning an error in catch() should cause the next promise to be fulfilled');
            });
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

            this.isRejected(promise, function next(result) {
                Assert.areSame(value, result, 'Promise.reject() should respect the passed value');
            });
        },

        'Promise.reject() should wrap fulfilled promises': function () {
            var value = new Promise(function (resolve) {
                    resolve('foo');
                }),
                promise = Promise.reject(value);

            this.isRejected(promise, function (result) {
                Assert.areSame(value, result, 'Promise.reject() should wrap fulfilled promises');
            });
        },

        'Promise.reject() should wrap rejected promises': function () {
            var value = new Promise(function (resolve, reject) {
                    reject('foo');
                }),
                promise = Promise.reject(value);

            this.isRejected(promise, function (result) {
                Assert.areSame(value, result, 'Promise.reject() should wrap rejected promises');
            });
        },

        'Promise.reject() should preserve the constructor when using inheritance': function () {
            function Subpromise() {
                Subpromise.superclass.constructor.apply(this, arguments);
            }
            Y.extend(Subpromise, Promise, null, {reject: Promise.reject});

            var promise = Subpromise.reject('foo');

            Assert.isInstanceOf(Subpromise, promise, 'rejected promise should be an instance of the subclass');

            this.isRejected(promise, function (reason) {
                Assert.areSame('foo', reason, 'subpromise should have the correct rejection reason');
            });
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
            this.isRejected(Promise.all('foo'), function (error) {
                Assert.isInstanceOf(TypeError, error, 'rejection reason should be a TypeError');
            });
        },

        'order of promises should be preserved': function () {
            var promise = Promise.all([wait(20), wait(10), wait(15)]);

            this.isFulfilled(promise, function (result) {
                ArrayAssert.itemsAreSame([20, 10, 15], result, 'order of returned values should be the same as the parameter list');
            });
        },

        'values should be wrapped in a promise': function () {
            var obj = {
                    hello: 'world'
                },
                promise = Promise.all(['foo', 5, obj]);

            this.isFulfilled(promise, function (result) {
                ArrayAssert.itemsAreSame(['foo', 5, obj], result, 'values passed to Promise.all() should be wrapped in promises, not ignored');
            });
        },

        'correct handling of function parameters': function () {
            function testFn() {}

            this.isFulfilled(Promise.all([testFn]), function (values) {
                Assert.isFunction(values[0], 'promise value should be a function');
                Assert.areSame(testFn, values[0], 'promise value should be the passed function');
            });
        },

        'Promise.all() should fail as fast as possible': function () {
            var promise = Promise.all([rejectedAfter(20), rejectedAfter(10), rejectedAfter(15)]);

            this.isRejected(promise, function (reason) {
                Assert.areEqual(10, reason, 'reason should be the one from the first promise to be rejected');
            });
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.race() tests',

        'a non array argument should turn into a rejected promise': function () {
            this.isRejected(Promise.race('foo'), function (error) {
                Assert.isInstanceOf(TypeError, error, 'rejection reason should be a TypeError');
            });
        },

        'Promise.race() should fulfill when passed a fulfilled promise': function () {
            this.isFulfilled(Promise.race([wait(10)]), function (result) {
                Assert.areEqual(10, result, 'Promise.race() should fulfill when passed a fulfilled promise');
            });
        },

        'Promise.race() should reject when passed a rejected promise': function () {
            this.isRejected(Promise.race([rejectedAfter(10)]), function (result) {
                Assert.areEqual(10, result, 'Promise.race() should reject when passed a rejected promise');
            });
        },

        'Promise.race() should fulfill to the value of the first promise to be fulfilled': function () {
            var promise = Promise.race([wait(10), wait(100)]);

            this.isFulfilled(promise, function (result) {
                Assert.areEqual(10, result, 'Promise.race() should fulfill to the value of the first promise to be fulfilled');
            });
        },

        'Promise.race() should reject with the reason of the first promise to be rejected': function () {
            var promise = Promise.race([rejectedAfter(10), rejectedAfter(100)]);

            this.isRejected(promise, function (result) {
                Assert.areEqual(10, result, 'Promise.race() should reject with the reason of the first promise to be rejected');
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise.resolve() tests',

        'a promise should not be modified': function () {
            var promise = new Promise(function () {}),
                wrapped = Promise.resolve(promise);

            Assert.isTrue(Promise.isPromise(promise), 'Promise.resolve should always return a promise');
            Assert.areSame(promise, wrapped, 'Promise.resolve should not modify a promise');
        },

        'values should be wrapped in a promise': function () {
            // truthy values
            Assert.isInstanceOf(Promise, Promise.resolve(5), 'numbers should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve('foo'), 'strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(true), 'booleans should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(function () {}), 'functions should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve({}), 'objects should be wrapped in a promise');

            // falsy values
            Assert.isInstanceOf(Promise, Promise.resolve(0), 'zero should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(''), 'empty strings should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(false), 'false should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(null), 'null should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(undefined), 'undefined should be wrapped in a promise');
            Assert.isInstanceOf(Promise, Promise.resolve(), 'undefined (empty parameters) should be wrapped in a promise');

            // almost promises
            Assert.isInstanceOf(Promise, Promise.resolve({then: 5}), 'promise-like objects should be wrapped in a promise');
        }
    }));


    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'tests-promise-utils'
    ]
});
