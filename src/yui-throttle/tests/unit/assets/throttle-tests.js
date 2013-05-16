YUI.add('throttle-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite("Throttle"),

        testCase = new Y.Test.Case({

        name: "Throttle Tests With Mock Y.Lang.now",

        setUp : function() {
            var test = this;

            test.tNow = 0;
            test.tDelta = 1;

            test.originalNow = Y.Lang.now;

            // Mock. First call will be at 0,
            // and increment in tDelta chunks
            // So by default we're mocking
            // invocation every 1ms, starting at t = 0,
            // but the tests can mess with it as
            // they need.

            Y.Lang.now = function() {

                var now = test.tNow;
                test.tNow += test.tDelta;

                return now;
            }
        },

        tearDown : function() {
            Y.Lang.now = this.originalNow;
        },

        'test throttle return value' : function() {

            var fn = function() {},
                throttledFn;

            throttledFn = Y.throttle(fn, 10);

            Assert.isFunction(fn);
            Assert.areNotSame(throttledFn, fn, 'Y.throttle failed to return a new function');
        },

        'test negative throttle return value' : function() {

            var fn = function() {},
                throttledFn;

            throttledFn = Y.throttle(fn, -1);

            Assert.isFunction(fn);
            Assert.areNotSame(throttledFn, fn, 'Y.throttle negative failed to return a new function');
        },

        'test throttle return values are different' : function() {

            var fnOne = function() {},
                fnTwo = function() {},

                throttledFnOne,
                throttledFnTwo,
                throttledFnThree;

            throttledFnOne = Y.throttle(fnOne, 10);
            throttledFnTwo = Y.throttle(fnOne, 20);
            throttledFnThree = Y.throttle(fnTwo, 30);

            Assert.areNotSame(throttledFnOne, throttledFnTwo);
            Assert.areNotSame(throttledFnOne, throttledFnThree);
            Assert.areNotSame(throttledFnTwo, throttledFnThree);
        },

        'test calls are throttled': function() {

            var counter = 0,
                out = 0,
                i,
                fn;

            fn = Y.throttle(function() {
                counter++;
            }, 5);

            for (i = 0; i < 6; i++) {
                out++;
                fn();
            }

            Assert.isTrue((counter < out), 'Y.throttle did not throttle the function call');
            Assert.areEqual(1, counter, 'Y.throttle did not allow the function to be called the expected number of times');
        },

        'tests calls are not throttled for negative throttle': function() {

            var counter = 0,
                out = 0,
                i,
                fn;

            fn = Y.throttle(function() {
                counter++;
            }, -1);

            for (i = 0; i < 1000; i++) {
                out++;
                fn();
            }

            Assert.areEqual(out, counter, 'Y.throttle DID throttle the function call');
            Assert.areEqual(1000, counter, 'Y.throttle did not allow the function to be called the expected number of times');
        },

        'test default throttle time': function() {

            // Expected to be 150ms

            var counter = 0,
                out = 0,
                i,
                fn;

            fn = Y.throttle(function() {
                counter++;
            });

            for (i = 0; i < 151; i++) {
                out++;
                fn();
            }

            Assert.isTrue((counter < out), 'Y.throttle DID NOT throttle the function call');
            Assert.areEqual(1, counter, 'Y.throttle did not allow the function to be called the expected number of times');
        },

        'test Y configured default throttle time': function() {

            var counter = 0,
                out = 0,
                i,
                fn,
                hasOrigConfig,
                origConfig;

            if ("throttleTime" in Y.config) {
                hasOrigConfig = true;
                origConfig = Y.config.throttleTime;
            }

            Y.config.throttleTime = 50;

            fn = Y.throttle(function() {
                counter++;
            });

            for (i = 0; i < 51; i++) {
                out++;
                fn();
            }

            Assert.isTrue((counter < out), 'Y.throttle DID NOT throttle the function call');
            Assert.areEqual(1, counter, 'Y.throttle did not allow the function to be called the expected number of times');

            if (hasOrigConfig) {
                Y.config.throttleTime = origConfig;
            }
        },

        'test `this` in throttled function with negative throttle': function() {

            var throttledContext,
                obj;

            obj = {
                fn: Y.throttle(function () {
                    throttledContext = this;
                }, -1)
            };

            obj.fn();

            Assert.areSame(obj, throttledContext, 'wrong value for `this` in function with negative throttle');
        },

        'test `this` in throttled function': function() {

            var lastThrottledContext,
                obj,
                i;

            obj = {
                fn: Y.throttle(function () {
                    lastThrottledContext = this;
                }, 10)
            };

            for (i = 0; i < 11; i++) {
                obj.fn();
            }

            Assert.areSame(obj, lastThrottledContext, 'wrong value for `this` in function with negative throttle');
        },

        'test expected number of calls' : function() {

            var counter = 0,
                out = 0,
                i,
                fn;

            fn = Y.throttle(function() {
                counter++;
            }, 10);

            // Expecting it to call fn() at i = 10, 21, 32, 43 ... based on the throttle impl
            for (i = 0; i < 44; i++) {
                out++;
                fn();
            }

            Assert.areEqual(44, out, 'fn() called unexpected number of times');
            Assert.areEqual(4, counter, 'Y.throttle did not allow the function to be called the expected number of times');
        }
    });

    suite.add(testCase);

    Y.Test.Runner.add(suite);
});
