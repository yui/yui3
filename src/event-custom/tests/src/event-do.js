var suite = new Y.Test.Suite("AOP");

suite.add(new Y.Test.Case({
    name: "Y.Do",

    _should: {
        fail: {
            //"test before/after with falsy context binds args": "ticket pending"
        },
        ignore: {
            // Trac ticket noted as value
            "test originalRetVal not overwritten by nested call": 2530030
        }
    },

    "test before/after with falsy context binds args": function () {
        //Y.Do.before(fn, obj, "method", null, "a", obj, null);
    },

    "test Y.AlterReturn": function() {
        var et = new Y.EventTarget(), count = 0;

        et.after(function() {
            count++;
            Y.Assert.isTrue(Y.Do.originalRetVal);
            Y.Assert.isTrue(Y.Do.currentRetVal);
            return new Y.Do.AlterReturn("altered return", "altered");
        }, et, 'fire');

        et.after(function() {
            count++;
            Y.Assert.isTrue(Y.Do.originalRetVal);
            Y.Assert.areEqual("altered", Y.Do.currentRetVal);
        }, et, 'fire');


        et.fire('yay');
        Y.Assert.areEqual(2, count);

    },

    "test originalRetVal not overwritten by nested call": function () {
        var obj = {
            a: function () {
                this.b();
                return 'A';
            },

            b: function () {
                return 'B';
            }
        };

        Y.Do.after(function () {
            return Y.Do.originalRetVal.toLowerCase();
        }, obj, 'a');

        Y.Do.after(function () {
            // It doesn't matter what happens here, but for example, we
            // don't interfere with the return value
        }, obj, 'b');

        Y.Assert.areSame('a', obj.a());
    }
}));

suite.add(new Y.Test.Case({
    name: "EventTarget on/before/after",

    "test target.on(fn, host, methodName)": function () {
        var target = new Y.EventTarget(),
            called = [],
            handle, before;

        before = Y.Do.before;
        Y.Do.before = function () {
            called.push("before");
            return before.apply(this, arguments);
        };

        function callback() {
            called.push("callback");
        }

        function method() {
            called.push("method");
        }

        target.method = method;
            
        // awkward that you have to pass the target, and even more so
        // because this means every EventTarget is effectively an alias
        // for Y.Do
        handle = target.on(callback, target, "method");

        Y.Assert.areNotSame(method, target.method);
        Y.Assert.isObject(handle);
        Y.Assert.isInstanceOf(Y.Do.Method, handle.evt);

        target.method();

        Y.ArrayAssert.itemsAreSame(["before", "callback", "method"], called);

        // restore the method for other tests
        Y.Do.before = before;
    },

    "test target.on(fn, host, methodName, context)": function () {
        var target = new Y.EventTarget(),
            called = [],
            handle, before;

        before = Y.Do.before;
        Y.Do.before = function () {
            called.push("before");
            return before.apply(this, arguments);
        };

        function callback() {
            called.push("callback");
        }

        function method() {
            called.push("method");
        }

        target.method = method;
            
        // awkward that you have to pass the target, and even more so
        // because this means every EventTarget is effectively an alias
        // for Y.Do
        handle = target.on(callback, target, "method");

        Y.Assert.areNotSame(method, target.method);
        Y.Assert.isObject(handle);
        Y.Assert.isInstanceOf(Y.Do.Method, handle.evt);

        target.method();

        Y.ArrayAssert.itemsAreSame(["before", "callback", "method"], called);

        // restore the method for other tests
        Y.Do.before = before;
    },

    "test target.on(fn, host, noSuchMethod)": function () {
    },

    "test target.on([fnA, fnB, fnC], host, noSuchMethod)": function () {
    },

    "test target.before() is an alias for target.on()": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "return Y.Do.Classes to affect fn flow"

    // Test each in before and after phases
    // AlterArgs
    // AlterReturn
    // Halt
    // Prevent
}));

Y.Test.Runner.add(suite);
