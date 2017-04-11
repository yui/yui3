YUI.add('throttle-tests', function(Y) {

    var Assert = Y.Assert;

    var suite = new Y.Test.Suite("Throttle");

    suite.add(new Y.Test.Case({
        name: "Throttle Tests",

        setUp : function() {
            var test = this;

            // Start with real time to use numbers closer to reality
            test.tNow = Y.Lang.now();
            test.tDelta = 1;

            test.originalNow = Y.Lang.now;

            // Mock. First call will be at real time,
            // and increment in tDelta chunks.
            // So by default we're mocking/ invocation every 1ms,
            // but the tests can mess with it as they need.
            Y.Lang.now = function() {
                var now = test.tNow;
                test.tNow += test.tDelta;

                return now;
            };
        },

        tearDown: function () {
            Y.Lang.now = this.originalNow;
        },

        test_throttle: function() {
            var counter = 0,
                out = 0,
                i = 0, throttledFn;

            function count() {
                counter++;
            }

            // Y.Lang.now() returns always previousTime + 1, so if we throttle
            // the function by 75ms and we call the returned function 76 times
            // the throttled function should be called once
            throttledFn = Y.throttle(count, 75);

            // Calling the result function 100 times means the throttled function
            // will be called once. So `out` will be 100 and `counter` will be 1
            for (i; i < 100; i++) {
                out++;
                throttledFn();
            }

            Assert.isFunction(throttledFn, 'Y.throttle failed to return a function');
            Assert.areNotSame(count, throttledFn, 'Y.throttle failed to return a new function');
            Assert.isTrue(counter < out, 'Y.throttle did not throttle the function call');
            Assert.isTrue(counter > 0, 'Y.throttle did not throttle the function call (no exec)');
            Assert.areSame(1, counter, 'throttled function was executed more than expected');
        },
        test_throttle_negative: function() {
            var counter = 0,
                out = 0,
                i = 0, throttledFn;

            function count() {
                counter++;
            }

            throttledFn = Y.throttle(count, -1);

            for (i; i < 100; i++) {
                out++;
                throttledFn();
            }

            Assert.isFunction(throttledFn, 'Y.throttle failed to return a function');
            Assert.areNotSame(count, throttledFn, 'Y.throttle failed to return a new function');
            Assert.areEqual(out, counter, 'Y.throttle DID throttle the function call');
        },
        'test no throttle time': function() {
            var counter = 0,
                i = 0, fn;

            fn = Y.throttle(function () {
                counter++;
            });

            // Call twice, once after the default throttle time of 150ms
            this.tDelta = 150;
            fn();
            this.tDelta = 1;
            fn();

            Assert.isFalse(counter < 1, 'throttled function with no throttle time never called');
            Assert.isFalse(counter > 1, 'throttled function with no throttle time called more than once');
        },
        'test throttled function never called after throttle time': function () {
            var counter = 0,
                fn = Y.throttle(function () {
                    counter++;
                }, 10);

            // call once before the 10ms threshold (as if it were only 5ms)
            this.tDelta = 5;
            fn();

            Assert.areEqual(0, counter, 'throttled function called before throttle time');
        },
        '`this` is not modified in throttled function': function () {
            var counter = 0,
                obj = {
                    fn: Y.throttle(function () {
                        counter++;
                        Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                    }, 1)
                };

            // Adjust delta to be larger the throttle time so the function is called
            this.tDelta = 10;
            obj.fn();
            obj.fn();

            // Ensure the test function is called and we do not get a false positive
            Assert.areSame(1, counter, 'throttled function was never called');
        },
        'test `this` in function with disabled throttle': function () {
            var obj = {
                fn: Y.throttle(function () {
                    Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                }, -1)
            };

            obj.fn();
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Late Throttle Tests",

        setUp : function() {
            var test = this;

            // Start with real time to use numbers closer to reality
            test.tNow = Y.Lang.now();
            test.tDelta = 1;

            test.originalNow = Y.Lang.now;

            // Mock. First call will be at real time,
            // and increment in tDelta chunks.
            // So by default we're mocking/ invocation every 1ms,
            // but the tests can mess with it as they need.
            Y.Lang.now = function() {
                var now = test.tNow;
                test.tNow += test.tDelta;

                return now;
            };
        },

        tearDown: function () {
            Y.Lang.now = this.originalNow;
        },

        test_throttle: function() {
            var counter = 0,
                out = 0,
                i = 0, throttledFn;

            function count() {
                counter++;
            }

            // Y.Lang.now() returns always previousTime + 1, so if we throttle
            // the function by 75ms and we call the returned function 100 times
            // the throttled function should be called twice.
            throttledFn = Y.lateThrottle(count, 75);

            // Calling the result function 100 times means the throttled function
            // will be called once. So `out` will be 100 and `counter` will be 2.
            for (i; i < 100; i++) {
                out++;
                throttledFn();
            }

            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.isFunction(throttledFn, 'Y.lateTrottle failed to return a function');
                    Assert.areNotSame(count, throttledFn, 'Y.lateThrottle failed to return a new function');
                    Assert.isTrue(counter < out, 'Y.lateThrottle did not throttle the function call');
                    Assert.isTrue(counter > 0, 'Y.lateThrottle did not throttle the function call (no exec)');
                    Assert.areSame(2, counter, 'throttled function was executed more than expected');
                });
            });

            // Initially the counter should be 0 still.
            Assert.areSame(0, counter);

            this.wait();
        },
        test_throttle_negative: function() {
            var counter = 0,
                out = 0,
                i = 0, throttledFn;

            function count() {
                counter++;
            }

            throttledFn = Y.lateThrottle(count, -1);

            for (i; i < 100; i++) {
                out++;
                throttledFn();
            }

            Assert.isFunction(throttledFn, 'Y.lateThrottle failed to return a function');
            Assert.areNotSame(count, throttledFn, 'Y.lateThrottle failed to return a new function');
            Assert.areEqual(out, counter, 'Y.lateThrottle DID throttle the function call');
        },
        'test no throttle time': function() {
            var counter = 0,
                i = 0, fn;

            fn = Y.lateThrottle(function () {
                counter++;
            });

            // Call twice, once after the default throttle time of 150ms
            this.tDelta = 150;
            fn();

            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.isFalse(counter < 1, 'throttled function with no throttle time never called');
                });
            });

            this.wait();

            this.tDelta = 1;
            fn();
            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.isFalse(counter > 1, 'throttled function with no throttle time called more than once');
                });
            });

            this.wait();
        },
        'test throttled function never called after throttle time': function () {
            var counter = 0,
                fn = Y.lateThrottle(function () {
                    counter++;
                }, 10);

            // call once before the 10ms threshold (as if it were only 5ms)
            this.tDelta = 5;
            fn();

            Assert.areEqual(0, counter, 'throttled function called before throttle time');
        },
        '`this` is not modified in throttled function': function () {
            var counter = 0,
                obj = {
                    fn: Y.lateThrottle(function () {
                        counter++;
                        Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                    }, 1)
                };

            // Adjust delta to be larger the throttle time so the function is called
            this.tDelta = 10;
            obj.fn();
            obj.fn();

            Y.later(200, this, function() {
                this.resume(function () {
                    // Ensure the test function is called and we do not get a false positive
                    Assert.areSame(2, counter, 'throttled function was never called');
                });
            });

            this.wait();
        },
        'test `this` in function with disabled throttle': function () {
            var obj = {
                fn: Y.lateThrottle(function () {
                    Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                }, -1)
            };

            obj.fn();
        },
        'test that the first arguments are used as standard': function() {
            var counter = 0,
                throttledFn,
                finalArgs,
                runCount = 0;

            // Create a late throttle with a delay of 100ms.
            throttledFn = Y.lateThrottle(function(args) {
                runCount++;
                finalArgs = args;
            }, 100);

            // First call with a value of 0.
            throttledFn(0);

            // Now with an argument of 100
            throttledFn(100);

            // Check it after 200ms.
            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.areSame(1, runCount, 'The throttled function ran more than once');
                    Assert.areSame(0, finalArgs, 'throttled function used last set of arguments');
                });
            });

            this.wait();
        },
        'test that the first arguments are used when choosing not to use the final argument': function() {
            var counter = 0,
                throttledFn,
                finalArgs,
                runCount = 0;

            // Create a late throttle with a delay of 100ms.
            throttledFn = Y.lateThrottle(function(args) {
                runCount++;
                finalArgs = args;
            }, 100, false);

            // First call with a value of 0.
            throttledFn(0);

            // Now with an argument of 100
            throttledFn(100);

            // Check it after 200ms.
            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.areSame(1, runCount, 'The throttled function ran more than once');
                    Assert.areSame(0, finalArgs, 'throttled function used last set of arguments');
                });
            });

            this.wait();
        },
        'test latest arguments are used when choosing to use the final argument': function() {
            var counter = 0,
                throttledFn,
                finalArgs,
                runCount = 0;

            // Create a late throttle with a delay of 100ms.
            throttledFn = Y.lateThrottle(function(args) {
                runCount++;
                finalArgs = args;
            }, 100, true);

            // First call with a value of 0.
            throttledFn(0);

            // Now with an argument of 100
            throttledFn(100);

            // Check it after 200ms.
            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.areSame(1, runCount, 'The throttled function ran more than once');
                    Assert.areSame(100, finalArgs, 'throttled function did not use last set of arguments');
                });
            });

            this.wait();
        }
    }));

    Y.Test.Runner.add(suite);
});
