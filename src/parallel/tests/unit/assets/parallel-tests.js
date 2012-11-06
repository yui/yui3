YUI.add('parallel-tests', function(Y) {

    var Assert = Y.Assert;

    var testCase = new Y.Test.Case({
        name: "Parallel Tests",

        test_load: function() {
            Assert.isFunction(Y.Parallel, 'Y.Parallel did not load');
        },
        test_stack: function() {
            var stack = new Y.Parallel(),
            test = this,
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                }), 100);
            }

            stack.done(function() {
                test.resume(function() {
                    Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                    Assert.areEqual(15, counter, 'Stack did not complete properly');
                });
            });
            test.wait();
        },
        test_results: function() {
            var stack = new Y.Parallel(),
            test = this,
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    return false;
                }), 100);
            }

            stack.done(function(results) {
                test.resume(function() {
                    Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                    Assert.areEqual(15, counter, 'Stack did not complete properly');
                    Assert.areEqual(15, results.length, 'Results array is not right');
                });
            });
            test.wait();
        },
        test_returns_data: function() {
            var stack = new Y.Parallel(),
            test = this,
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                test.resume(function() {
                    Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                    Assert.areEqual(15, counter, 'Stack did not complete properly');
                    Assert.areEqual(15, results.length, 'Results array is not right');
                    Assert.areEqual(0, data.length, 'Data array is not right');
                });
            }, []);

            test.wait();
        },
        test_nocontext: function() {
            var stack = new Y.Parallel(),
            test = this,
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    Assert.isFunction(this.use, 'Execution context is wrong in stack item');
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                var self = this;
                test.resume(function() {
                    Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                    Assert.areEqual(15, counter, 'Stack did not complete properly');
                    Assert.areEqual(15, results.length, 'Results array is not right');
                    Assert.areEqual(0, data.length, 'Data array is not right');
                    Assert.isFunction(self.use, 'Execution context is wrong in done handler');
                });
            }, []);

            test.wait();
        },
        test_context: function() {
            var stack = new Y.Parallel({
                context: { foo: true }
            }),
            test = this,
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    Assert.isTrue(this.foo, 'Execution context is wrong in stack item');
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                var self = this;
                test.resume(function() {
                    Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                    Assert.areEqual(15, counter, 'Stack did not complete properly');
                    Assert.areEqual(15, results.length, 'Results array is not right');
                    Assert.areEqual(0, data.length, 'Data array is not right');
                    Assert.isTrue(self.foo, 'Execution context is wrong in done handler');
                });
            }, []);

            test.wait();
        },
        test_add_nofn: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback();

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual(0, data.length, 'Data array is not right');
                Assert.isFunction(this.use, 'Execution context is wrong in done handler');
            }, []);
        },
        test_add_nofn_one_arg: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback('foo');

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual('foo', results[0], 'Results is not right');
            });
        },
        test_add_nofn_two_args: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback('foo', 'bar');

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual(2, results[0].length, 'Results[0] array is not right');
                Assert.areEqual('foo', results[0][0], 'Results[0][0] is not right');
                Assert.areEqual('bar', results[0][1], 'Results[0][1] is not right');
            });
        },
        test_results_order: function () {
            var stack = new Y.Parallel(),
                test = this;

            setTimeout(stack.add(function () {
                return 1;
            }), 100);
            setTimeout(stack.add(function () {
                return 2;
            }), 10);
            setTimeout(stack.add(function () {
                return 3;
            }), 50);

            stack.done(function (results) {
                test.resume(function () {
                    Y.ArrayAssert.itemsAreEqual(results, [1, 2, 3], 'Results array did not retain order of callbacks');
                });
            });
            
            test.wait();
        }
    });

    Y.Test.Runner.add(testCase);



});
