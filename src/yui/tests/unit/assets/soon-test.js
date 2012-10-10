YUI.add('soon-test', function (Y) {
    Y.SeedTests.add(new Y.Test.Case({
        name: 'Soon tests',

        'test soon(callbackFunction)': function () {
            var test = this,
                count = 0,
                timer = Y.soon(function () {
                    count += 1;

                    if (count > 1) {
                        test.resume(function () {
                            Y.Assert.fail('soon() callback executed multiple times');
                        });
                    } else {
                        test.resume(function () {
                            // Arbitrary timeout to test that the callback doesn't
                            // execute again
                            test.wait(function () {
                                Y.Assert.isTrue(true);
                            }, 150);
                        });
                    }
                });

            Y.Assert.areSame(0, count);
            Y.Assert.isObject(timer);
            Y.Assert.isFunction(timer.cancel);

            test.wait();
        },

        'test cancel soon(callbackFunction)': function () {
            var count = 0,
                timer = Y.soon(function () {
                    count += 1;
                });

            timer.cancel();

            this.wait(function () {
                Y.Assert.areSame(0, count);
            }, 250);
        }
    }));
});