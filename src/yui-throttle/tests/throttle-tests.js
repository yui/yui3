YUI.add('throttle-tests', function(Y) {

    var Assert = Y.Assert;

    var suite = new Y.Test.Suite("Y.Throttle test Suite");

    var testCase = new Y.Test.Case({
        name: "Throttle Tests",
        test_throttle: function() {
            var counter = 0,
                out = 0,
                i = 0, fn;

            fn = Y.throttle(function() {
                counter++;
            }, 2);

            for (i; i< 35000; i++) {
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
            Assert.isTrue((counter > 0), 'Y.Throttle did not throttle the function call');
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
        }

    });
    
    suite.add(testCase);

    Y.Test.Runner.add(suite);
});
