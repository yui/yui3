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

    Y.Test.Runner.add(suite);
});
