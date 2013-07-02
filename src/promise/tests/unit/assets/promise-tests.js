YUI.add('promise-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.Test.ArrayAssert,
        Promise = Y.Promise,
        isPromise = Promise.isPromise,
        isThenable = Promise.isThenable;

    // -- Suite --------------------------------------------------------------------
    var suite = new Y.Test.Suite({
        name: 'Promise core tests'
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

        'rejecting a fulfilled promise does not do anything': function () {
            var test = this,
                expected = {hello: 'world'},
                promise = new Promise(function (resolve, reject) {
                    resolve(expected);
                    reject(new Error('ouch'));
                });

            promise.then(function (value) {
                test.resume(function () {
                    Assert.areSame(expected, value, 'fulfilled promise did not take the correct value');
                });
            }, function () {
                test.resume(function () {
                    Assert.fail('fulfilled promise when through the rejection branch');
                });
            });

            test.wait();
        },

        'fulfilling a rejected promise does not do anything': function () {
            var test = this,
                expected = new Error('foo'),
                promise = new Promise(function (resolve, reject) {
                    reject(expected);
                    resolve(true);
                });

            function fail() {
                test.resume(function () {
                    Assert.fail('rejected promise when through the fulfill branch');
                });
            }

            promise.then(fail, function (reason) {
                return new Promise(function (resolve, reject) {
                    reject(reason);
                    // Faking going through fulfill to test the possibility of
                    // someone calling it directly even if YUI does not approve
                    // The goal is to test the branch that protects the promise
                    // from being fulfilled after being rejected but since
                    // resolver.resolve() already returns early if the promise
                    // is already rejected then this branch was never hit
                    this._resolver.fulfill(true);
                });
            }).then(fail, function (reason) {
                test.resume(function () {
                    Assert.areSame(expected, reason, 'rejected promise did not take the correct reason');
                });
            });

            test.wait();
        },

        'correct value for "this" inside the promise init function': function () {
            var promiseA,
                promiseB = Y.Promise(function () {
                    promiseA = this;

                    Assert.isInstanceOf(Promise, this, '"this" should be a promise');
                });

            Assert.areSame(promiseA, promiseB, 'the return value of Y.Promise and "this" inside the init function should be the same');
        },

        'callbacks passed to then() should be called asynchronously': function () {
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
        },

        'resolving with a fulfilled promise creates a fulfilled promise': function () {
            var test = this,
                expected = {};
                fulfilled = new Y.Promise(function (resolve) {
                    resolve(expected);
                });

            Y.Promise(function (resolve) {
                resolve(fulfilled);
            }).then(function (value) {
                test.resume(function () {
                    Assert.areSame(expected, value, 'value of the resolved promise should be the same as the previous promise');
                });
            }, function (err) {
                test.resume(function () {
                    Assert.fail(err);
                });
            });

            test.wait();
        },

        'resolving with a rejected promise creates a rejected promise': function () {
            var test = this,
                expected = new Error('foo');
                rejected = new Y.Promise(function (resolve, reject) {
                    reject(expected);
                });

            Y.Promise(function (resolve) {
                resolve(rejected);
            }).then(function (value) {
                test.resume(function () {
                    Assert.fail('Y.Promise failed to resolve a rejected promise');
                });
            }, function (err) {
                test.resume(function () {
                    Assert.areSame(expected, err, 'value of the resolved promise should be the same as the previous promise');
                });
            });

            test.wait();
        },

        'test fulfilled thenable assimilation': function () {
            var test = this,
                expected = {},
                thenable = {
                    then: function (onsuccess) {
                        onsuccess(expected);
                    }
                },
                promise = new Promise(function (resolve) {
                    resolve(thenable);
                });

            promise.then(function (value) {
                test.resume(function () {
                    Assert.areSame(expected, value, 'value of the resolved promise did not match value provided by thenable');
                });
            }, function () {
                test.resume(function () {
                    Assert.fail('Promise rejected a promise when resolving with a fulfilled thenable');
                });
            });

            test.wait();
        },

        'test rejected thenable assimilation': function () {
            var test = this,
                expected = {},
                thenable = {
                    then: function (onsuccess, onfailure) {
                        onfailure(expected);
                    }
                },
                promise = new Promise(function (resolve) {
                    resolve(thenable);
                });

            promise.then(function () {
                test.resume(function () {
                    Assert.fail('Promise fulfilled a promise when resolving with a rejected thenable');
                });
            }, function (reason) {
                test.resume(function () {
                    Assert.areSame(expected, reason, 'value of the resolved promise did not match rejection reason provided by thenable');
                });
            });

            test.wait();
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

            test.wait();
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

            test.wait();
        },

        // This test is run only when not in strict mode
        '`this` inside a callback must be the global object': function () {
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
                        Assert.isUndefined(fulfilledThis, 'in strict mode `this` in the success callback must be undefined');
                        Assert.isUndefined(rejectedThis, 'in strict mode `this` in the failure callback must be undefined');
                    });
                });
            });

            test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Promise detection with Promise.isPromise',

        'detecting YUI promises': function () {
            var promise = new Promise(function () {});

            Assert.isTrue(isThenable(promise), 'a YUI promise should be identified as a thenable');
            Assert.isTrue(isPromise(promise), 'a YUI promise should be identified as a promise');
        },

        'detecting pseudo promises': function () {
            var thenable = {
                then: function () {
                    return 5;
                }
            };

            Assert.isTrue(isThenable(thenable), 'a pseudo promise should be identified as a thenable');
            Assert.isFalse(isPromise(thenable), 'a pseudo promise should not be identified as a promise');
        },

        'isPromise() failing for values and almost promises': function () {
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

        'isThenable() failing for values and almost promises': function () {
            // truthy values
            Assert.isFalse(isThenable(5), 'numbers should not be identified as promises');
            Assert.isFalse(isThenable('foo'), 'strings should not be identified as promises');
            Assert.isFalse(isThenable(true), 'true booleans should not be identified as promises');
            Assert.isFalse(isThenable({}), 'objects should not be identified as promises');

            // false values
            Assert.isFalse(isThenable(0), 'zero should not be identified as a promise');
            Assert.isFalse(isThenable(''), 'empty strings should not be identified as promises');
            Assert.isFalse(isThenable(false), 'false booleans should not be identified as promises');
            Assert.isFalse(isThenable(null), 'null should not be identified as a promise');
            Assert.isFalse(isThenable(undefined), 'undefined should not be identified as a promise');

            // almost promises
            Assert.isFalse(isThenable({
                then: 5
            }), 'almost promises should not be identified as promises');
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: [
        'promise-core',
        'test'
    ]
});
