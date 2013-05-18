YUI.add('throttle-tests', function(Y) {

    var Assert = Y.Assert;

    var suite = new Y.Test.Suite("Throttle");

    var testCase = new Y.Test.Case({
        name: "Throttle Tests",
        test_throttle: function() {
            var counter = 0,
                out = 0,
                i = 0, fn;

            fn = Y.throttle(function() {
                counter++;
            }, 2);

            for (i; i< 55000; i++) {
                out++;
                fn();
            }
            
            var fn1 = function() {
                counter++;
            };

            fn1.name = 'foo';

            fn = Y.throttle(fn1, 10);

            Assert.isFunction(fn, 'Y.Throttle failed to return a function');
            Assert.areNotSame(fn1, fn, 'Y.Throttle failed to return a new function');
            Assert.isTrue((counter < out), 'Y.Throttle did not throttle the function call');
            Assert.isTrue((counter > 0), 'Y.Throttle did not throttle the function call (no exec)');
        },
        test_throttle_negative: function() {
            var counter = 0,
                out = 0,
                i = 0, fn;

            fn = Y.throttle(function() {
                counter++;
            }, -1);

            for (i; i< 3500; i++) {
                out++;
                fn();
            }
            
            var fn1 = function() {
                counter++;
            };

            fn1.name = 'foo';

            fn = Y.throttle(fn1, 10);

            Assert.isFunction(fn, 'Y.Throttle failed to return a function');
            Assert.areNotSame(fn1, fn, 'Y.Throttle failed to return a new function');
            Assert.areEqual(out, counter, 'Y.Throttle DID throttle the function call');
        },
        'test no throttle time': function() {
            var counter = 0,
                out = 0,
                i = 0, fn;

            fn = Y.throttle(function() {
                counter++;
            });

            for (i; i< 3500; i++) {
                out++;
                fn();
            }
            
            var fn1 = function() {
                counter++;
            };

            fn1.name = 'foo';

            fn = Y.throttle(fn1, 10);

            Assert.isFunction(fn, 'Y.Throttle failed to return a function');
            Assert.areNotSame(fn1, fn, 'Y.Throttle failed to return a new function');
            Assert.areEqual(counter, 0, 'Y.Throttle DID NOT throttle the function call');
        },
        'test `this` in throttled function': function () {
            var obj = {
                fn: Y.throttle(function () {
                    Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                }, -1)
            };

            obj.fn();
        }

    });
    
    suite.add(testCase);

    // Test the case when the timeout is > -1 by rewriting Lang.now() so it
    // does not need setTimeout to fake the behavior. This avoids flaky results
    // when testing in slow computers or VMs
    suite.add(new Y.Test.Case({
        name: 'Throttle tests with mock Lang.now()',

        setUp: function () {
            var time = Y.Lang.now();

            this._now = Y.Lang.now;

            Y.Lang.now = function () {
                return time += 50;
            };
        },

        tearDown: function () {
            Y.Lang.now = this._now;
        },

        '`this` is not modified': function () {
            var obj = {
                fn: Y.throttle(function () {
                    Assert.areSame(obj, this, 'wrong value for `this` in function with canceled throttle');
                }, 10)
            };

            obj.fn();
        }
    }));

    Y.Test.Runner.add(suite);
});
