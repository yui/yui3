YUI.add('later-test', function(Y) {

    Y.SeedTests.add(new Y.Test.Case({

            name: "Later tests",

            "test later(10, null, callback)": function() {
                var context = (function () { return this; })(),
                    count = 0,
                    testContext;

                Y.later(10, null, function () {
                    testContext = this;
                    count++;
                });

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's only executed once.
                this.wait(function () {
                    Y.Assert.areSame(1, count);
                    Y.Assert.areSame(context, testContext);
                }, 150);
            },

            "test later(10, obj, callback)": function() {
                var context = {},
                    count = 0,
                    testContext;

                Y.later(10, context, function () {
                    testContext = this;
                    count++;
                });

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's only executed once.
                this.wait(function () {
                    Y.Assert.areSame(1, count);
                    Y.Assert.areSame(context, testContext);
                }, 150);
            },

            "test later(10, obj, methodString)": function() {
                var count = 0,
                    testContext,
                    context = {
                        fn: function () {
                                count++;
                                testContext = this;
                            }
                    };

                Y.later(10, context, "fn");

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's only executed once.
                this.wait(function () {
                    Y.Assert.areSame(1, count);
                    Y.Assert.areSame(context, testContext);
                }, 150);
            },

            "test later(10, null, callback, argArray)": function() {
                var count = 0,
                    obj = {},
                    data = [];

                Y.later(10, null, function (arg1, arg2, arg3) {
                    count++;
                    data[0] = arg1;
                    data[1] = arg2;
                    data[2] = arg3;
                }, ["ARG1", 2, obj]);

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's only executed once.
                this.wait(function () {
                    Y.Assert.areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(["ARG1", 2, obj], data);
                }, 150);
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
                var context = (function () { return this; })(),
                    count = 0,
                    testContext,
                    handle;

                handle = Y.later(10, null, function () {
                    testContext = this;
                    count++;
                }, null, true);

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's executed more than once.
                this.wait(function () {
                    Y.assert((count > 1));
                    Y.Assert.areSame(context, testContext);
                    handle.cancel();
                }, 150);
            },

            "test later(10, obj, callback, null, true)": function() {
                var context = {},
                    count = 0,
                    testContext,
                    handle;

                handle = Y.later(10, context, function () {
                    testContext = this;
                    count++;
                }, null, true);

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's executed more than once.
                this.wait(function () {
                    Y.assert((count > 1));
                    Y.Assert.areSame(context, testContext);
                    handle.cancel();
                }, 150);
            },

            "test later(10, obj, methodString, null, true)": function() {
                var count = 0,
                    testContext,
                    context = {
                        fn: function () {
                                count++;
                                testContext = this;
                            }
                    },
                    handle;

                handle = Y.later(10, context, "fn", null, true);

                Y.Assert.areSame(0, count);
                
                // test after 150ms to make sure it's executed more than once.
                this.wait(function () {
                    Y.assert((count > 1));
                    Y.Assert.areSame(context, testContext);
                    handle.cancel();
                }, 150);
            },

            "test later(10, null, callback, argArray, true)": function() {
                var obj = { foo: 3 },
                    count = 0,
                    args = [];

                Y.later(10, null, function (arg1, arg2, arg3) {
                    count++;
                    arg3["prop" + count] = true;
                    args.push(Y.Array(arguments, 0, true));
                }, ["A", 1, obj], true);

                Y.Assert.areSame(0, count);
                Y.Assert.areSame(0, args.length);
                
                // test after 150ms to make sure it's only executed once.
                this.wait(function () {
                    Y.assert((count > 1));
                    Y.assert((args.length > 1));
                    Y.Assert.areSame(count, args.length);
                    Y.Assert.isString(args[0][0]);
                    Y.Assert.isNumber(args[0][1]);
                    Y.Assert.isObject(args[0][2]);
                    Y.Assert.isTrue(obj["prop" + count]);
                    Y.ArrayAssert.itemsAreSame(args[0], args[1]);
                }, 150);
            },

            "test cancel later(10, null, callback, null, true)": function() {
                var count = 0,
                    handle;

                handle = Y.later(10, null, function () { count++; }, null, true);

                this.wait(function () {
                    var currentCount = count;

                    handle.cancel();

                    this.wait(function () {
                        Y.assert((count > 1));
                        Y.Assert.areSame(currentCount, count,
                            "callback executed after clearInterval");
                    }, 150);
                }, 150);
            }

        }));

});
