YUI.add('deferred-tests', function (Y) {

    var suite = new Y.Test.Suite('deferred');

    suite.add(new Y.Test.Case({
        name: "instantiation",

        "test new Y.Deferred()": function () {
            var deferred = new Y.Deferred();

            Y.Assert.isInstanceOf(Y.Deferred, deferred);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "promise",

        setUp: function () {
            this.deferred = new Y.Deferred();
            this.promise  = this.deferred.promise();
        },

        "should return a Y.Promise": function () {
            Y.Assert.isInstanceOf(Y.Promise, this.promise);
        },

        "should return the associated promise": function () {
            Y.Assert.areSame(this.promise, this.deferred._promise);
            Y.Assert.areSame(this.deferred, this.promise._deferred);
        },

        "should be present on the deferred and the promise": function () {
            Y.Assert.isFunction(this.deferred.promise);
            Y.Assert.isFunction(this.promise.promise);
        },

        "should relay then() to the associated deferred": function () {
            var called, args;

            this.deferred.then = function () {
                args   = arguments;
                called = true;
            };

            this.promise.then(1, true, "done");

            Y.Assert.isTrue(called);
            Y.Assert.areSame(3, args.length);
            Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
        },

        "should relay promise() to the associated deferred": function () {
            var called, args;

            this.deferred.promise = function () {
                args   = arguments;
                called = true;
            };

            this.promise.promise(1, true, "done");

            Y.Assert.isTrue(called);
            Y.Assert.areSame(3, args.length);
            Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
        },

        "should relay getStatus() to the associated deferred": function () {
            var called, args;

            this.deferred.getStatus = function () {
                args   = arguments;
                called = true;
            };

            this.promise.getStatus(1, true, "done");

            Y.Assert.isTrue(called);
            Y.Assert.areSame(3, args.length);
            Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
        },

        "should relay getResult() to the associated deferred": function () {
            var called, args;

            this.deferred.getResult = function () {
                args   = arguments;
                called = true;
            };

            this.promise.getResult(1, true, "done");

            Y.Assert.isTrue(called);
            Y.Assert.areSame(3, args.length);
            Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "then",

        setUp: function () {
            this.deferred = new Y.Deferred();
        },

        tearDown: function () {
            this.deferred.reject();
        },

        "should be present on the deferred and the promise": function () {
            Y.Assert.isFunction(this.deferred.then);
            Y.Assert.isFunction(this.deferred.promise().then);
        },

        "then(callback) should return a promise": function () {
            var promise = this.deferred.then(function () {});

            Y.Assert.isInstanceOf(Y.Promise, promise);
        },

        "then(callback) promise should NOT be deferred.promise()": function () {
            var promise = this.deferred.then(function () {});

            Y.Assert.areNotSame(promise, this.deferred.promise());
        },

        "then(null, callback) should return a promise": function () {
            var promise = this.deferred.then(null, function () {});

            Y.Assert.isInstanceOf(Y.Promise, promise);
        },

        "then(null, callback) promise should NOT be deferred.promise()": function () {
            var promise = this.deferred.then(null, function () {});

            Y.Assert.areNotSame(promise, this.deferred.promise());
        },

        "then(callbackA, callbackB) should return a promise": function () {
            var promise = this.deferred.then(function () {}, function () {});

            Y.Assert.isInstanceOf(Y.Promise, promise);
        },

        "then(callbackA, callbackB) promise should NOT be deferred.promise()": function () {
            var promise = this.deferred.then(function () {}, function () {});

            Y.Assert.areNotSame(promise, this.deferred.promise());
        },

        "then(callback) callback should be executed when resolved": function () {
            var test = this;

            this.deferred.then(function () {
                // wrapped in setTimeout to make it agnostic of sync/async
                // tests.
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(true);
                    });
                }, 0);
            });

            this.deferred.resolve();

            this.wait();
        },

        "then(null, callback) callback should be executed when rejected": function () {
            var test = this;

            this.deferred.then(null, function () {
                // wrapped in setTimeout to make it agnostic of sync/async
                // tests.
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(true);
                    });
                }, 0);
            });

            this.deferred.reject();

            this.wait();
        },

        "callback that returns a promise should resolve the then()'d promise when that promise is resolved": function () {
            var test = this;

            this.deferred
                .then(function () {
                    var deferred = new Y.Deferred();

                    setTimeout(function () {
                        deferred.resolve();
                    }, 0);

                    return deferred.promise();
                })
                .then(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(true);
                    });
                });

            this.deferred.resolve();

            this.wait();
        },

        "callback should receive arguments passed to resolve()": function () {
            var test = this,
                args;

            this.deferred.then(function () {
                args = [].slice.call(arguments);

                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isArray(args);
                        Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
                    });
                }, 0);
            });

            this.deferred.resolve(1, true, "done");

            this.wait();
        },

        "errback should receive arguments passed to reject()": function () {
            var test = this,
                args;

            this.deferred.then(null, function () {
                args = [].slice.call(arguments);

                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isArray(args);
                        Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
                    });
                }, 0);
            });

            this.deferred.reject(1, true, "done");

            this.wait();
        },

        "calling then(callback) on a resolved deferred should still execute the callback": function () {
            var test = this;

            this.deferred.resolve();

            this.deferred.then(function () {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(true);
                    });
                }, 0);
            });

            this.wait();
        },

        "calling then(callback) on a rejected deferred should be a no-op": function () {
            var test = this;

            this.deferred.reject();

            this.deferred.then(function () {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.fail();
                    });
                }, 0);
            });

            this.wait(function () {
                Y.Assert.isTrue(true);
            }, 300);
        },

        "calling then(null, errback) on a rejected deferred should still execute the errback": function () {
            var test = this;

            this.deferred.reject();

            this.deferred.then(null, function () {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isTrue(true);
                    });
                }, 0);
            });

            this.wait();
        },

        "calling then(null, errback) on a resolved deferred should be a no-op": function () {
            var test = this;

            this.deferred.resolve();

            this.deferred.then(null, function () {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.fail();
                    });
                }, 0);
            });

            this.wait(function () {
                Y.Assert.isTrue(true);
            }, 300);
        },

        "calling then(callback) on a resolved deferred should still pass args": function () {
            var test = this,
                args;

            this.deferred.resolve(1, true, "done");

            this.deferred.then(function () {
                args = [].slice.call(arguments);

                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isArray(args);
                        Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
                    });
                }, 0);
            });

            this.wait();
        },

        "calling then(null, errback) on a rejected deferred should still pass args": function () {
            var test = this,
                args;

            this.deferred.reject(1, true, "done");

            this.deferred.then(null, function () {
                args = [].slice.call(arguments);

                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isArray(args);
                        Y.ArrayAssert.itemsAreSame([1, true, "done"], args);
                    });
                }, 0);
            });

            this.wait();
        },

        "callbacks that return a promise will not resolve until the promise resolves": function () {
            var test = this,
                milepost;

            this.deferred
                .then(function () {
                    var then = new Y.Deferred();

                    milepost = +(new Date());

                    setTimeout(function () {
                        then.resolve();
                    }, 1000);

                    return then.promise();
                })
                .then(function () {
                    test.resume(function () {
                        var now = +(new Date());

                        Y.Assert.isTrue(now - milepost > 1000);
                    });
                });

            this.deferred.resolve();

            this.wait();
        },

        "callbacks that return a promise that is rejected will reject that promise's deferred": function () {
            var test = this,
                milepost;

            this.deferred
                .then(function () {
                    var then = new Y.Deferred();

                    milepost = +(new Date());

                    setTimeout(function () {
                        then.reject();
                    }, 1000);

                    return then.promise();
                })
                .then(null, function () { // MUST be an errback
                    test.resume(function () {
                        var now = +(new Date());

                        Y.Assert.isTrue(now - milepost > 1000);
                    });
                });

            this.deferred.resolve();

            this.wait();
        },

        "callback should be executed asynchronously": function () {
            var test = this,
                called;

            this.deferred.then(function () {
                called = true;
            });

            this.deferred.resolve();

            Y.Assert.isUndefined(called);

            this.deferred.then(function () {
                test.resume(function () {
                    Y.Assert.isTrue(called);
                });
            });

            this.wait();
        },

        "errback should be executed asynchronously": function () {
            var test = this,
                called;

            this.deferred.then(null, function () {
                called = true;
            });

            this.deferred.reject();

            Y.Assert.isUndefined(called);

            this.deferred.then(null, function () {
                test.resume(function () {
                    Y.Assert.isTrue(called);
                });
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: "resolve",

        setUp: function () {
            this.deferred = new Y.Deferred();
        },

        tearDown: function () {
            this.deferred.reject();
        },

        "should be present on the deferred and NOT the promise": function () {
            Y.Assert.isFunction(this.deferred.resolve);
            Y.Assert.isUndefined(this.deferred.promise().resolve);
        },

        "should call 'resolve' subscribers": function () {
            var test = this,
                sub1, sub2, nextSub;

            this.deferred
                .then(function () {
                    sub1 = true;
                })
                .then(function () {
                    nextSub = true;

                    // timeout to give separate then() sub time to resolve
                    setTimeout(function () {
                        test.resume(function () {
                            Y.Assert.isTrue(sub1);
                            Y.Assert.isTrue(sub2);
                            Y.Assert.isTrue(nextSub);
                        });
                    }, 300);
                });

            this.deferred.then(function () {
                sub2 = true;
            });

            this.deferred.resolve();

            this.wait();
        },

        "should pass arguments to subscribers": function () {
            var test = this,
                args;

            this.deferred.then(function (foo, bar, baz) {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.areSame(1, foo);
                        Y.Assert.areSame(true, bar);
                        Y.Assert.areSame("done", baz);
                    });
                }, 0);
            });

            this.deferred.resolve(1, true, "done");

            this.wait();
        },

        "Should clear promise subscriptions": function () {
            var test = this,
                count = 0,
                errcount = 0;

            this.deferred
                .then(function () {
                    count++;
                }, function () {
                    errcount++;
                });

            this.deferred.resolve();

            this.wait(function () {
                test.deferred.resolve();

                test.wait(function () {
                    Y.Assert.areSame(1, count);
                    Y.Assert.areSame(0, errcount);
                }, 300);
            }, 300);
        },

        "should be chainable": function () {
            Y.Assert.areSame(this.deferred, this.deferred.reject());
        }
    }));

    suite.add(new Y.Test.Case({
        name: "reject",

        setUp: function () {
            this.deferred = new Y.Deferred();
        },

        tearDown: function () {
            this.deferred.reject();
        },

        "should be present on the deferred and NOT the promise": function () {
            Y.Assert.isFunction(this.deferred.reject);
            Y.Assert.isUndefined(this.deferred.promise().reject);
        },

        "should call 'reject' subscribers": function () {
            var test = this,
                sub1, nextSub;

            this.deferred
                .then(null, function () {
                    nextSub = true;

                    // timeout to give separate then() sub time to resolve
                    setTimeout(function () {
                        test.resume(function () {
                            Y.Assert.isTrue(sub1);
                            Y.Assert.isTrue(nextSub);
                        });
                    }, 300);
                });

            this.deferred.then(null, function () {
                sub1 = true;
            });

            this.deferred.reject();

            this.wait();
        },

        "should pass arguments to subscribers": function () {
            var test = this,
                args;

            this.deferred.then(null, function (foo, bar, baz) {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.areSame(1, foo);
                        Y.Assert.areSame(true, bar);
                        Y.Assert.areSame("done", baz);
                    });
                }, 0);
            });

            this.deferred.reject(1, true, "done");

            this.wait();
        },
 
        "test continuation from errback": function () {
            var test = this,
                subA, subB, subC;

            // not returning a failed promise in an errback should result in
            // then()'s wrapping promise resolving to next callback, not
            // errback
            function finish() {
                test.resume(function () {
                    Y.Assert.isTrue(subA);
                    Y.Assert.isTrue(subB);
                    Y.Assert.isUndefined(subC);
                });
            }

            this.deferred.then(null, function () {
                    subA = true;
                })
                .then(function () { // callback
                    subB = true; // Working
                }, function () {
                    subC = true; // OOPS! Shouldn't go here.
                })
                .then(finish, finish);

            this.deferred.reject();

            this.wait();
        },

        "returning failed promise from errback should reject to next errback": function () {
            var test = this,
                subA, subB, subC;

            // Returning a failed promise in an errback should result in
            // then()'s wrapping promise rejecting to next errback, not
            // callback
            function finish() {
                test.resume(function () {
                    Y.Assert.isTrue(subA);
                    Y.Assert.isTrue(subC);
                    Y.Assert.isUndefined(subB);
                });
            }

            this.deferred.then(null, function () {
                    subA = true;
                    return new Y.Deferred().reject().promise();
                })
                .then(function () { // callback
                    subB = true; // OOPS! Shouldn't go here.
                }, function () {
                    subC = true; // Working
                })
                .then(finish, finish);

            this.deferred.reject();

            this.wait();
        },

        "Should clear promise subscriptions": function () {
            var test = this,
                count = 0,
                errcount = 0;

            this.deferred
                .then(function () {
                    count++;
                }, function () {
                    errcount++;
                });

            this.deferred.reject();

            this.wait(function () {
                test.deferred.resolve();

                test.wait(function () {
                    Y.Assert.areSame(0, count);
                    Y.Assert.areSame(1, errcount);
                }, 300);
            }, 300);
        },

        "should be chainable": function () {
            Y.Assert.areSame(this.deferred, this.deferred.reject());
        }
    }));

    suite.add(new Y.Test.Case({
        name: "getStatus",

        "should be present on the deferred and the promise": function () {
            var deferred = new Y.Deferred();

            Y.Assert.isFunction(deferred.getStatus);
            Y.Assert.isFunction(deferred.promise().getStatus);
        },

        "new Deferreds should be in status 'in progress'": function () {
            Y.Assert.areSame('in progress', new Y.Deferred().getStatus());
        },

        "resolved Deferreds should be in status 'resolved'": function () {
            Y.Assert.areSame('resolved', new Y.Deferred().resolve().getStatus());
        },

        "rejected Deferreds should be in status 'resolved'": function () {
            Y.Assert.areSame('rejected', new Y.Deferred().reject().getStatus());
        }
    }));

    suite.add(new Y.Test.Case({
        name: "getResult",

        "should be present on the deferred and the promise": function () {
            var deferred = new Y.Deferred();

            Y.Assert.isFunction(deferred.getResult);
            Y.Assert.isFunction(deferred.promise().getResult);
        },

        "new Deferreds should return undefined": function () {
            Y.Assert.isUndefined(new Y.Deferred().getResult());
        },

        "resolved Deferreds should return array of resolve() args": function () {
            var result = new Y.Deferred().resolve(1, true, "done").getResult();

            Y.ArrayAssert.itemsAreSame([1, true, "done"], result);
        },

        "rejected Deferreds should return array of reject() args": function () {
            var result = new Y.Deferred().reject(1, true, "done").getResult();

            Y.ArrayAssert.itemsAreSame([1, true, "done"], result);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Promise.addMethod",

        tearDown: function () {
            var dProto = Y.Deferred.prototype,
                pProto = Y.Promise.prototype;

            delete dProto.testing;
            delete pProto.testing;
            delete dProto.foo;
            delete dProto.bar;
            delete dProto.baz;
            delete pProto.foo;
            delete pProto.bar;
            delete pProto.baz;
        },

        "addMethod(name) adds relay from promise to its deferred": function () {
            var called;

            Y.Deferred.prototype.testing = function () {
                called = true;
            };

            Y.Promise.addMethod('testing');

            new Y.Deferred().promise().testing();

            Y.Assert.isTrue(called);
        },

        "addMethod([name, name, ...]) adds multiple relays": function () {
            var deferred = new Y.Deferred(),
                calledFoo, calledBar, calledBaz;

            deferred.foo = function () { calledFoo = true; };
            deferred.bar = function () { calledBar = true; };
            deferred.baz = function () { calledBaz = true; };

            Y.Promise.addMethod(['foo', 'bar', 'baz']);

            deferred.promise().foo();
            deferred.promise().bar();
            deferred.promise().baz();

            Y.Assert.isTrue(calledFoo);
            Y.Assert.isTrue(calledBar);
            Y.Assert.isTrue(calledBar);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Y.defer",

        "Y.defer should pass a Deferred to the input callback": function () {
            var test = this;

            Y.defer(function (deferred) {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isInstanceOf(Y.Deferred, deferred);
                        deferred.resolve();
                    });
                }, 0);
            });

            this.wait();
        },

        "Y.defer should return a promise": function () {
            var test = this,
                promise;

            promise = Y.defer(function (deferred) {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.isInstanceOf(Y.Promise, promise);
                        deferred.resolve();
                    });
                }, 0);
            });

            this.wait();
        },

        "callback passed to Y.defer should be executed asynchronously": function () {
            var test = this,
                sub;

            Y.defer(function (deferred) {
                sub = true;
                test.resume(function () {
                    Y.Assert.isTrue(sub);
                    deferred.resolve();
                });
            });

            Y.Assert.isUndefined(sub);

            this.wait();
        },

        "passing a non-function to Y.defer will result in a new Deferred resolving with that value": function () {
            var test = this;

            Y.defer(12345)
             .then(function (val) {
                test.resume(function () {
                    Y.Assert.areSame(12345, val);
                });
            });

            this.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Y.when",

        "Y.when(promise, callback, errback) should equate to promise.then(callback, errback)": function () {
            var test = this,
                promise;

            promise = Y.defer(function (deferred) {
                setTimeout(function () {
                    deferred.resolve(12345);
                }, 100);
            });

            function callback(val) {
                test.resume(function () {
                    Y.Assert.areSame(12345, val);
                });
            }

            Y.when(promise, callback, Y.Assert.fail);

            this.wait();
        },

        "Y.when(value, callback, errback) should wrap the value in a Deferred that will resolve with that value": function () {
            var test = this;

            Y.when(12345, function (val) {
                test.resume(function () {
                    Y.Assert.areSame(12345, val);
                })
            }, Y.Assert.fail);

            this.wait();
        },

        "Y.when should return a promise": function () {
            var test = this,
                promiseA, promiseB;

            promiseA = Y.defer(function (deferred) {
                setTimeout(function () {
                    deferred.resolve(12345);
                }, 100);
            });

            function callback(val) {
                test.resume(function () {
                    Y.Assert.areSame(12345, val);
                    Y.Assert.areNotSame(promiseA, promiseB);
                });
            }

            promiseB = Y.when(promiseA, callback, Y.Assert.fail);

            this.wait();
        },

        "Not passing either callback or errback should return same promise": function () {
            var test = this,
                promiseA, promiseB;

            promiseA = Y.defer(function (deferred) {
                setTimeout(function () {
                    test.resume(function () {
                        Y.Assert.areSame(promiseA, promiseB);
                        deferred.resolve();
                    });
                }, 100);
            });

            promiseB = Y.when(promiseA);

            this.wait();
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'deferred', 'test', 'test-console' ] });
