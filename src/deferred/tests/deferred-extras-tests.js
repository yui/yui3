YUI.add('deferred-extras-tests', function (Y) {

var suite = new Y.Test.Suite('deferred-extras');

suite.add(new Y.Test.Case({
    name: "wait",

    setUp: function () {
        this.deferred = new Y.Deferred();
    },

    tearDown: function () {
        this.deferred.reject();
    },

    "wait() should exist on the deferred and the promise": function () {
        Y.Assert.isFunction(this.deferred.wait);
        Y.Assert.isFunction(this.deferred.promise().wait);
    },

    "wait() should resolve after the specified ms": function () {
        var test = this,
            milepost = +(new Date());

        this.deferred.wait(500).then(function () {
            test.resume(function () {
                var now = +(new Date());

                Y.Assert.isTrue((now - milepost) > 500);
            });
        });

        this.deferred.resolve();

        this.wait();
    },

    "wait() promise should have cancel() method": function () {
        Y.Assert.isFunction(this.deferred.wait(function () {}).cancel);
    },

    "wait() promise.cancel() should clearTimeout": function () {
        var test = this,
            waiting,
            called;

        waiting = this.deferred.wait(200);
        
        waiting.then(function () {
            called = true;
        });

        this.deferred.resolve();

        setTimeout(function () {
            waiting.cancel();
        }, 10);

        this.wait(function () {
            Y.Assert.isUndefined(called);
        }, 500);
    },

    "wait() promise should relay resolve() results from parent deferred": function () {
        var test = this;

        this.deferred.wait(10).then(function (foo, bar, baz) {
            test.resume(function () {
                Y.Assert.areSame(1, foo);
                Y.Assert.areSame(true, bar);
                Y.Assert.areSame("done", baz);
            });
        });

        this.deferred.resolve(1, true, "done");

        this.wait();
    },

    "wait() deferred should halt if parent deferred is rejected": function () {
        var test = this,
            called;

        waiting = this.deferred.wait(10).then(function () {
            called = true;
        });

        this.deferred.reject();

        this.wait(function () {
            Y.Assert.isUndefined(called);
        }, 300);
    }

}));

suite.add(new Y.Test.Case({
    name: "onProgress + notify",

    setUp: function () {
        this.deferred = new Y.Deferred();
    },

    tearDown: function () {
        this.deferred.reject();
    },

    "onProgress should be on the deferred and the promise": function () {
        Y.Assert.isFunction(this.deferred.onProgress);
        Y.Assert.isFunction(this.deferred.promise().onProgress);
    },

    "notify should be on the deferred and NOT on the promise": function () {
        Y.Assert.isFunction(this.deferred.notify);
        Y.Assert.isUndefined(this.deferred.promise().notify);
    },

    "deferred.notify() should execute onProgress() callbacks synchronously": function () {
        var called;

        this.deferred.onProgress(function () {
            called = true;
        });

        this.deferred.notify();

        Y.Assert.isTrue(called);
    },

    "callback should receive notify() arguments": function () {
        this.deferred.onProgress(function (foo, bar, baz) {
            Y.Assert.areSame(1, foo);
            Y.Assert.areSame(true, bar);
            Y.Assert.areSame("done", baz);
        });

        this.deferred.notify(1, true, "done");
    },

    "callback should be cleared when resolved": function () {
        var called;

        this.deferred.onProgress(function () {
            called = true;
        });

        this.deferred.notify();

        Y.Assert.isTrue(called);

        called = false;

        this.deferred.resolve();

        this.deferred.notify("boom");

        Y.Assert.isFalse(called);
    },

    "callback should be cleared when rejected": function () {
        var called;

        this.deferred.onProgress(function () {
            called = true;
        });

        this.deferred.notify();

        Y.Assert.isTrue(called);

        called = false;

        this.deferred.reject();

        this.deferred.notify("boom");

        Y.Assert.isFalse(called);
    },

    "onProgress(callback) + notify called after resolved should no-op": function () {
        var called;

        this.deferred.resolve();

        this.deferred.onProgress(function () {
            called = true;
        });

        this.deferred.notify();

        Y.Assert.isUndefined(called);
    },

    "onProgress(callback) + notify called after rejected should no-op": function () {
        var called;

        this.deferred.reject();

        this.deferred.onProgress(function () {
            called = true;
        });

        this.deferred.notify();

        Y.Assert.isUndefined(called);
    }
}));

suite.add(new Y.Test.Case({
    name: "isResolved",

    "isResolved() should exist on the deferred and the promise": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isFunction(deferred.isResolved);
        Y.Assert.isFunction(deferred.promise().isResolved);
    },

    "isResolved() should return false for in progress deferreds": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isFalse(deferred.isResolved());
    },

    "isResolved() should return false for rejected deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.reject();

        Y.Assert.isFalse(deferred.isResolved());
    },

    "isResolved() should return true for resolved deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.resolve();

        Y.Assert.isTrue(deferred.isResolved());
    }
}));

suite.add(new Y.Test.Case({
    name: "isRejected",

    "isRejected() should exist on the deferred and the promise": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isFunction(deferred.isRejected);
        Y.Assert.isFunction(deferred.promise().isRejected);
    },

    "isRejected() should return false for in progress deferreds": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isFalse(deferred.isRejected());
    },

    "isRejected() should return false for resolved deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.resolve();

        Y.Assert.isFalse(deferred.isRejected());
    },

    "isRejected() should return true for rejected deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.reject();

        Y.Assert.isTrue(deferred.isRejected());
    }
}));

suite.add(new Y.Test.Case({
    name: "isInProgress",

    "isInProgress() should exist on the deferred and the promise": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isFunction(deferred.isInProgress);
        Y.Assert.isFunction(deferred.promise().isInProgress);
    },

    "isInProgress() should return true for in progress deferreds": function () {
        var deferred = new Y.Deferred();

        Y.Assert.isTrue(deferred.isInProgress());
    },

    "isInProgress() should return false for resolved deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.resolve();

        Y.Assert.isFalse(deferred.isInProgress());
    },

    "isInProgress() should return false for rejected deferreds": function () {
        var deferred = new Y.Deferred();

        deferred.reject();

        Y.Assert.isFalse(deferred.isInProgress());
    }
}));

suite.add(new Y.Test.Case({
    name: "Y.batch",

    "Y.batch() should return a promise": function () {
        Y.Assert.isInstanceOf(Y.Promise, Y.batch(function () {}));
    },

    "callbacks should be passed a Y.Deferred for them to resolve": function () {
        Y.batch(function (deferred) {
            Y.Assert.isInstanceOf(Y.Deferred, deferred);

            deferred.resolve();
        });
    },

    "Y.batch(fnA, fnB)'s promise should resolve after fnA and fnB deferreds have resolved": function () {
        var test = this,
            fnAResolved, fnBResolved;

        Y.batch(
            function (deferredA) {
                setTimeout(function () {
                    fnAResolved = true;
                    deferredA.resolve();
                }, 10);
            },
            function (deferredB) {
                setTimeout(function () {
                    fnBResolved = true;
                    deferredB.resolve();
                }, 30);
            })
            .then(function () {
                test.resume(function () {
                    Y.Assert.isTrue(fnAResolved);
                    Y.Assert.isTrue(fnBResolved);
                });
            });

        this.wait();
    },

    "Y.batch(promiseA)'s deferred should resolve after promiseA resolves": function () {
        var test = this,
            deferred = new Y.Deferred(),
            promise  = deferred.promise(),
            start = +(new Date());

        Y.batch(promise).then(function () {
            var now = +(new Date());

            test.resume(function () {
                Y.Assert.isTrue((now - start > 500));
            });
        });

        setTimeout(function () {
            deferred.resolve();
        }, 500);

        this.wait();
    },

    "Y.batch(promiseA, promiseB)'s deferred should resolve after A and B resolve": function () {
        var test = this,
            deferredA = new Y.Deferred(),
            promiseA  = deferredA.promise(),
            deferredB = new Y.Deferred(),
            promiseB  = deferredB.promise(),
            start = +(new Date()),
            aResolved, bResolved;

        Y.batch(promiseA, promiseB).then(function () {
            var now = +(new Date());

            test.resume(function () {
                Y.Assert.isTrue(aResolved);
                Y.Assert.isTrue(bResolved);
                Y.Assert.isTrue((now - start > 500));
            });
        });

        setTimeout(function () {
            aResolved = true;
            deferredA.resolve();
        }, 100);

        setTimeout(function () {
            bResolved = true;
            deferredB.resolve();
        }, 500);

        this.wait();
    },

    "rejecting a callback's deferred should reject the batch()'s deferred": function () {
        var test = this,
            start = +(new Date()),
            called;

        Y.batch(
            function (deferredA) {
                setTimeout(function () {

                    deferredA.resolve();
                }, 10);
            },
            function (deferredB) {
                setTimeout(function () {
                    deferredB.reject();
                }, 100);
            },
            function (deferredC) {
                setTimeout(function () {
                    deferredC.resolve();
                }, 1000);
            })
            .then(
                // success callback == boom
                function () {
                    test.resume(function () {
                        Y.Assert.fail("deferredB's rejection should have triggered the errback");
                    });
                },
                // errback (what we want)
                function () {
                    var elapsed = +(new Date()) - start;

                    test.resume(function () {
                        Y.Assert.isTrue(elapsed > 100);
                        Y.Assert.isTrue(elapsed < 1000,
                            "errback should be called after first failure, " +
                            "not wait for all promises to resolve");
                    });
                });

        this.wait();
    },

    "rejecting promiseA's deferred from Y.batch(promiseA) should reject the batch()'s deferred": function () {
        var test = this,
            deferred = new Y.Deferred(),
            promise  = deferred.promise();

        Y.batch(promise).then(
            // callback == boom
            function () {
                test.resume(function () {
                    Y.Assert.fail();
                });
            },
            // errback (what we want)
            function () {
                test.resume(function () {
                    Y.Assert.isTrue(true);
                });
            });

        deferred.reject();

        this.wait();
    },

    "Results from all callbacks should be passed to resolve subscribers": function () {
        var test = this;

        function fnA(deferred) { deferred.resolve("A"); }

        function fnB(deferred) {
            setTimeout(function () {
                deferred.resolve("B", "b");
            }, 300);
        }

        Y.batch(fnA, fnB)
            .then(function (aResults, bResults) {
                test.resume(function () {
                    Y.Assert.areSame("A", aResults);
                    Y.ArrayAssert.itemsAreSame(["B", "b"], bResults);
                });
            });

        this.wait();
    },

    "Y.batch(fnA, nonPromiseValue) should resolve batch fnA resolves": function () {
        var test = this;

        Y.batch(
            function (deferred) {
                setTimeout(function () {
                    deferred.resolve("A");
                }, 10);
            },
            "I'm neither a function, nor a promise!")
            .then(function (a, b) {
                test.resume(function () {
                    Y.Assert.areSame("A", a);
                    Y.Assert.areSame("I'm neither a function, nor a promise!", b);
                });
            });

        this.wait();
    },

    "Y.batch(value, value) should resolve immediately": function () {
        var test = this,
            promise = Y.batch("A", "B", "C");

        Y.Assert.isFalse(promise.isResolved());

        promise.then(function () {
            var args = Y.Array(arguments, 0, true);

            test.resume(function () {
                Y.ArrayAssert.itemsAreSame(["A", "B", "C"], args);
            });
        });

        Y.Assert.isFalse(promise.isResolved());

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

}, '', { requires: [ 'deferred-extras', 'test' ] });
