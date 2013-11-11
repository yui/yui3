YUI.add('timers-tests', function (Y) {
    'use strict';

    var ArrayAssert = Y.Test.ArrayAssert;

    var suite = new Y.Test.Suite('timers');

    suite.add(new Y.Test.Case({
        name: 'Y.soon Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.soon, 'Y.soon should be a function.');
            Y.Assert.isFunction(Y.soon._asynchronizer, 'Y.soon._asynchronizer should be a function.');
            Y.Assert.isString(Y.soon._impl, 'Y.soon._impl should be a string.');
        },
        'enforce asynchronicity': function () {
            var test = this,
                reference = [];

            reference.push('a');
            Y.soon(function () {
                reference.push('c');
                test.resume(function () {
                    ArrayAssert.itemsAreSame(['a', 'b', 'c'], reference, 'Y.soon should not execute synchronously');
                });
            });
            reference.push('b');

            test.wait();
        },
        'test:002-asyncCallbackFunction': function () {
            var count = 0,
                test = this,
                timer = Y.soon(function () {
                    count += 1;

                    if (count > 1) {
                        test.resume(function () {
                            Y.Assert.fail('Y.soon() callback function should not execute multiple times.');
                        });
                    } else {
                        test.resume(function () {
                            // Arbitrary timeout to test that the callback
                            // function does not execute again.
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
        'test:003-cancel': function () {
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

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'test',
        'timers'
    ]
});