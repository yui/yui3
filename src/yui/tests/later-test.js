YUI.add('later-test', function(Y) {

    Y.SeedTests.add(new Y.Test.Case({

            name: "Later tests",
            _should: {
                ignore: {
                    "test later(10, null, callback)": (Y.UA.nodejs ? true : false),
                    "test later(10, null, callback, null, true)": (Y.UA.nodejs ? true : false)
                }
            },

            "test later(10, null, callback)": function() {
                var test = this,
                    context = (function () { return this; })(),
                    count = 0,
                    testContext;

                Y.later(10, null, function () {
                    count++;
                    testContext = this;

                    if (count > 1) {
                        test.resume(function () {
                            Y.Assert.fail("non-interval later() callback executed multiple times");
                        });
                    } else {
                        test.resume(function () {
                            Y.Assert.areSame(context, testContext);

                            // Arbitrary timeout to test that the callback
                            // doesn't execute again
                            test.wait(function () {
                                Y.Assert.isTrue(true);
                            }, 150);
                        });
                    }
                });

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, obj, callback)": function() {
                var test = this,
                    context = {},
                    count = 0,
                    testContext;

                Y.later(10, context, function () {
                    count++;
                    testContext = this;

                    if (count > 1) {
                        test.resume(function () {
                            Y.Assert.fail("non-interval later() callback executed multiple times");
                        });
                    } else {
                        test.resume(function () {
                            Y.Assert.areSame(context, testContext);

                            // Arbitrary timeout to test that the callback
                            // doesn't execute again
                            test.wait(function () {
                                Y.Assert.isTrue(true);
                            }, 150);
                        });
                    }
                });

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, obj, methodString)": function() {
                var test = this,
                    count = 0,
                    context = {
                        fn: function () {
                                count++;
                                testContext = this;

                                if (count > 1) {
                                    test.resume(function () {
                                        Y.Assert.fail("non-interval later() callback executed multiple times");
                                    });
                                } else {
                                    test.resume(function () {
                                        Y.Assert.areSame(context, testContext);

                                        // Arbitrary timeout to test that the
                                        // callback doesn't execute again
                                        test.wait(function () {
                                            Y.Assert.isTrue(true);
                                        }, 150);
                                    });
                                }
                            }
                    },
                    testContext;

                Y.later(10, context, "fn");

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, null, callback, argArray)": function() {
                var test = this,
                    count = 0,
                    args = ["A", 1, { foo: 3 }],
                    obj = {};

                Y.later(10, null, function (arg1, arg2, arg3) {
                    count++;

                    if (count > 1) {
                        test.resume(function () {
                            Y.Assert.fail("non-interval later() callback executed multiple times");
                        });
                    } else {
                        test.resume(function () {
                            Y.ArrayAssert.itemsAreSame(args, [arg1, arg2, arg3]);
                            // Arbitrary timeout to test that the callback
                            // doesn't execute again
                            test.wait(function () {
                                Y.Assert.isTrue(true);
                            }, 150);
                        });
                    }
                }, args);

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(0, null, callback, obj)": function() {
                var data = { foo: 'bar' },
                    count = 0,
                    testData;

                Y.Lang.later(0, null, function(o) {
                    count++;
                    testData = o;
                }, data)

                this.wait(function() {
                    Y.Assert.areEqual(1, count);
                    Y.Assert.areSame(data, testData);
                }, 5);
            },

            "test later(o, null, setTimeout, [fn, 0])": function() {
                // fails in IE, YUI 3.3.0 and below

                var data = [function() { baz = "boo"; }, 0],
                    baz;

                Y.Lang.later(0, null, setTimeout, data)

                this.wait(function() {
                    this.wait(function() {
                        Y.Assert.areEqual('boo', baz);
                    }, 5);
                }, 5);
            },

            "test cancel later(100, null, callback)": function () {
                var count = 0,
                    handle;

                handle = Y.later(100, null, function () { count++; });

                this.wait(function () {
                    handle.cancel();

                    this.wait(function () {
                        Y.Assert.areSame(0, count);
                    }, 250);
                }, 20);
            },

            "test later(10, null, callback, null, true)": function() {
                var test = this,
                    context = (function () { return this; })(),
                    count = 0,
                    testContext,
                    handle;

                handle = Y.later(10, null, function () {
                    count++;
                    testContext = this;

                    if (count > 1) {
                        handle.cancel();
                        test.resume(function () {
                            Y.Assert.areSame(context, testContext);
                        });
                    }
                }, null, true);

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, obj, callback, null, true)": function() {
                var test = this,
                    context = {},
                    count = 0,
                    testContext,
                    handle;

                handle = Y.later(10, context, function () {
                    count++;
                    testContext = this;

                    if (count > 1) {
                        handle.cancel();
                        test.resume(function () {
                            Y.Assert.areSame(context, testContext);
                        });
                    }
                }, null, true);

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, obj, methodString, null, true)": function() {
                var test = this,
                    count = 0,
                    testContext,
                    context = {
                        fn: function () {
                            count++;
                            testContext = this;

                            if (count > 1) {
                                handle.cancel();
                                test.resume(function () {
                                    Y.Assert.areSame(context, testContext);
                                });
                            }
                        }
                    },
                    handle;

                handle = Y.later(10, context, "fn", null, true);

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test later(10, null, callback, argArray, true)": function() {
                var test = this,
                    args = ["A", 1, { foo: 3 }],
                    count = 0,
                    handle;

                handle = Y.later(10, null, function (arg1, arg2, arg3) {
                    count++;
                    test.resume(function () {
                        Y.ArrayAssert.itemsAreSame(args, [arg1, arg2, arg3]);
                        if (count === 1) {
                            test.wait();
                        } else {
                            handle.cancel();
                        }
                    });
                }, args, true);

                Y.Assert.areSame(0, count);
                
                this.wait();
            },

            "test cancel later(10, null, callback, null, true)": function() {
                var test = this,
                    count = 0,
                    done = false,
                    handle;

                handle = Y.later(10, null, function () {
                    count++;
                    
                    if (done) {
                        test.resume(function () {
                            Y.Assert.fail("Interval callback executed after cancel()");
                        });
                    } else if (count > 1) {
                        done = true;

                        handle.cancel();

                        // Arbitrary timeout to test the callback doesn't
                        // execute again
                        test.resume(function () {
                            test.wait(function () {
                                Y.Assert.isTrue(true);
                            }, 300);
                        });
                    }
                }, null, true);

                this.wait();
            }

        }));

});
