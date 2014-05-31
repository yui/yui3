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

        test_immediate_throttle: function() {
            var throttledFn,
                hasRun = false;

            throttledFn = Y.throttle(function() {
                hasRun = true;
            }, 150);

            Assert.isFalse(hasRun);
            throttledFn();
            Assert.isTrue(hasRun);
        },

        test_throttle: function() {
            var counter = 0,
                out = 0,
                i = 0, throttledFn;

            function count() {
                counter++;
            }

            // Y.Lang.now() returns always previousTime + 1, so if we throttle
            // the function by 100ms and we call the returned function 50 times
            // the throttled function should be called once.
            throttledFn = Y.throttle(count, 100);

            // Calling the result function 50 times means the throttled function
            // will be called once. So `out` will be 50 and `counter` will be 1
            for (i; i < 50; i++) {
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
        },

        'test function is invoked when called immediately after setup': function() {
            var throttledFn,
                runCount = 0;

            // Create a throttled function with a delay of 200ms.
            throttledFn = Y.throttle(function(args) {
                runCount++;
            }, 100, true);

            // Get the current time, and then immediately call the function.
            this.tDelta = 1;
            throttledFn();

            // Should have happened initially.
            Assert.areSame(1, runCount, 'The throttled function was not called');

            // Now ensure that the function is invoked after the throttle limit has expired since we set it up.
            this.tDelta = 100;
            Y.Lang.now();
            throttledFn();

            Y.later(200, this, function() {
                this.resume(function () {
                    Assert.areSame(2, runCount, 'throttled function was not executed the expected number of times');
                });
            });

            this.wait();
        }
    }));

    Y.Test.Runner.add(suite);
});
