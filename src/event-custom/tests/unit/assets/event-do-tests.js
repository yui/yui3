YUI.add("event-do-tests", function(Y) {

var suite = new Y.Test.Suite("Custom Event: AOP");

suite.add(new Y.Test.Case({
    name: "Y.Do",

    _should: {
        fail: {
            //"test before/after with falsy context binds args": "ticket pending"
        },
        ignore: {
            "test originalRetVal not overwritten by nested call": 2530030, // Trac ticket noted as value
            "test before/after with falsy context binds args": true
        }
    },

    "test before" : function() {

        var invoked = [],
            expected = ["before", "original"];

        var o = {
            method : function() {
                invoked.push("original");
            }
        };

        Y.Do.before(function() {
            invoked.push("before"); 
        }, o, "method");

        o.method();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test after" : function() {

        var invoked = [],
            expected = ["original", "after"];

        var o = {
            method : function() {
                invoked.push("original");
            }
        };

        Y.Do.after(function() {
            invoked.push("after"); 
        }, o, "method");

        o.method();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },
    
    "test multiple subscribers" : function() {
        var invoked = [],
            expected = ["before1", "before2", "original", "after1", "after2"];

        var o = {
            method : function() {
                invoked.push("original");
            }
        };

        Y.Do.before(function() {
            invoked.push("before1"); 
        }, o, "method");
        
        Y.Do.before(function() {
            invoked.push("before2"); 
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after1"); 
        }, o, "method");
        
        Y.Do.after(function() {
            invoked.push("after2"); 
        }, o, "method");
        
        o.method();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },
    
    "test multiple methods" : function() {
        var invoked = [],
            expected = ["beforeA", "originalA", "afterA", "beforeB", "originalB", "afterB"];

        var o = {
            methodA : function() {
                invoked.push("originalA");
            },
            
            methodB : function() {
                invoked.push("originalB");
            }
        };

        Y.Do.before(function() {
            invoked.push("beforeA"); 
        }, o, "methodA");
        
        Y.Do.before(function() {
            invoked.push("beforeB"); 
        }, o, "methodB");

        Y.Do.after(function() {
            invoked.push("afterA"); 
        }, o, "methodA");
        
        Y.Do.after(function() {
            invoked.push("afterB"); 
        }, o, "methodB");
        
        o.methodA();
        o.methodB();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test detach" : function() {
        var invoked = [],
            expected = ["before1", "before2", "original", "after1", "after2", "original", "after1", "after2", "original"];

        var o = {
            method : function() {
                invoked.push("original");
            }
        };

        var h1 = Y.Do.before(function() {
            invoked.push("before1"); 
        }, o, "method");

        var h2 = Y.Do.before(function() {
            invoked.push("before2"); 
        }, o, "method");

        var h3 = Y.Do.after(function() {
            invoked.push("after1"); 
        }, o, "method");

        var h4 = Y.Do.after(function() {
            invoked.push("after2"); 
        }, o, "method");

        o.method();

        Y.Do.detach(h1);
        Y.Do.detach(h2);

        o.method();

        Y.Do.detach(h3);
        Y.Do.detach(h4);

        o.method();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test detach multiple methods" : function() {

        var invoked = [],
            expected = ["beforeA", "originalA", "afterA", "beforeB", "originalB", "afterB", 
                        "originalA", "afterA", "originalB", "afterB", 
                        "originalA", "originalB"];

        var o = {
            methodA : function() {
                invoked.push("originalA");
            },
            
            methodB : function() {
                invoked.push("originalB");
            }
        };

        var h1 = Y.Do.before(function() {
            invoked.push("beforeA"); 
        }, o, "methodA");

        var h2 = Y.Do.before(function() {
            invoked.push("beforeB"); 
        }, o, "methodB");

        var h3 = Y.Do.after(function() {
            invoked.push("afterA"); 
        }, o, "methodA");

        var h4 = Y.Do.after(function() {
            invoked.push("afterB"); 
        }, o, "methodB");

        o.methodA();
        o.methodB();
        
        Y.Do.detach(h1);
        Y.Do.detach(h2);
        
        o.methodA();
        o.methodB();

        Y.Do.detach(h3);
        Y.Do.detach(h4);

        o.methodA();
        o.methodB();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test context" : function() {

        var invoked = [],
            expected = ["before", "original", "after"];

        var o = {
            method : function() {
                invoked.push("original");
            }
        };

        var that = {};

        Y.Do.before(function() {
            invoked.push("before");
            Y.Assert.areSame(that, this); 
        }, o, "method", that);

        Y.Do.after(function() {
            invoked.push("after");
            Y.Assert.areSame(that, this); 
        }, o, "method", that);

        o.method();

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },
    
    "test additional args" : function() {

        var invoked = [],
            expected = ["before", "original", "after"];

        var o = {
            method : function(arg) {
                invoked.push("original");
                Y.ArrayAssert.itemsAreEqual([0], Y.Array(arguments));
            }
        };

        var that = {};

        Y.Do.before(function() {

            invoked.push("before");

            Y.Assert.areSame(that, this);
            Y.ArrayAssert.itemsAreEqual([0, 1, 2, 3], Y.Array(arguments));

        }, o, "method", that, 1, 2, 3);

        Y.Do.after(function() {

            invoked.push("after");

            Y.Assert.areSame(that, this);
            Y.ArrayAssert.itemsAreEqual([0, 1, 2, 3, 4], Y.Array(arguments));

        }, o, "method", that, 1, 2, 3, 4);

        o.method(0);

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test altered args" : function() {

        var invoked = [],
            expected = ["before", "original", "after"];

        var o = {
            method : function() {
                invoked.push("original");
                Y.ArrayAssert.itemsAreEqual([1, 2, 3], Y.Array(arguments));
            }
        };

        Y.Do.before(function() {
            invoked.push("before");

            Y.ArrayAssert.itemsAreEqual(["a", "b", "c"], Y.Array(arguments));

            return new Y.Do.AlterArgs("new args", [1, 2, 3]);
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after");
            Y.ArrayAssert.itemsAreEqual([1, 2, 3], Y.Array(arguments));            
        }, o, "method");

        o.method("a", "b", "c");

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },
    
    "test chained altered args" : function() {

        var invoked = [],
            expected = ["before1", "before2", "original", "after"];

        var o = {
            method : function() {
                invoked.push("original");
                Y.ArrayAssert.itemsAreEqual([1, 2, 3, 4, 5, 6], Y.Array(arguments));
            }
        };

        Y.Do.before(function() {
            invoked.push("before1");
            
            var args = Y.Array(arguments);
            Y.ArrayAssert.itemsAreEqual([1, 2], args);
            return new Y.Do.AlterArgs("new args", args.concat([3, 4]));
        }, o, "method");
        
        Y.Do.before(function() {
            invoked.push("before2");
            
            var args = Y.Array(arguments);
            Y.ArrayAssert.itemsAreEqual([1, 2, 3, 4], args);
            return new Y.Do.AlterArgs("new args", args.concat([5, 6]));
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after");
            Y.ArrayAssert.itemsAreEqual([1, 2, 3, 4, 5, 6], Y.Array(arguments));            
        }, o, "method");

        o.method(1, 2);

        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test altered return": function() {
        var invoked = [],
            expected = ["original", "after"];

        var o = {
            method : function() {
                invoked.push("original");
                return "original";
            }
        };

        Y.Do.after(function() {
            invoked.push("after");

            Y.Assert.areEqual("original", Y.Do.originalRetVal);
            Y.Assert.areEqual("original", Y.Do.currentRetVal);

            return new Y.Do.AlterReturn("altering return", "altered");
        }, o, "method");

        var ret = o.method();

        Y.Assert.areEqual("altered", ret);
        Y.Assert.areEqual("altered", Y.Do.currentRetVal);
        Y.Assert.areEqual("original", Y.Do.originalRetVal);
        
        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test chained altered return": function() {
        var invoked = [],
            expected = ["original", "after1", "after2"];

        var o = {
            method : function() {
                invoked.push("original");
                return "original";
            }
        };

        Y.Do.after(function() {
            invoked.push("after1");

            Y.Assert.areEqual("original", Y.Do.originalRetVal);
            Y.Assert.areEqual("original", Y.Do.currentRetVal);

            return new Y.Do.AlterReturn("altering return", "altered1");
        }, o, "method");
        
        Y.Do.after(function() {

            invoked.push("after2");

            Y.Assert.areEqual("original", Y.Do.originalRetVal);
            Y.Assert.areEqual("altered1", Y.Do.currentRetVal);

            return new Y.Do.AlterReturn("altering return", "altered2");
        }, o, "method");

        var ret = o.method();

        Y.Assert.areEqual("altered2", ret);
        Y.Assert.areEqual("altered2", Y.Do.currentRetVal);
        Y.Assert.areEqual("original", Y.Do.originalRetVal);
        
        Y.ArrayAssert.itemsAreEqual(expected, invoked);
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
    },

    "test halt before" : function() {
        var invoked = [],
            expected = ["before1", "before2"];

        var o = {
            method : function() {
                invoked.push("original");
                return "original";
            }
        };

        Y.Do.before(function() {
            invoked.push("before1");
        }, o, "method");

        Y.Do.before(function() {
            invoked.push("before2");
            return new Y.Do.Halt("halting", "halted");
        }, o, "method");
        
        Y.Do.before(function() {
            invoked.push("before3");
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after");
        }, o, "method");

        var ret = o.method();

        Y.Assert.areEqual("halted", ret);
        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },
    
    "test halt after" : function() {
        var invoked = [],
            expected = ["before", "original", "after1"];

        var o = {
            method : function() {
                invoked.push("original");
                return "original";
            }
        };
        
        Y.Do.before(function() {
            invoked.push("before");
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after1");
            return new Y.Do.Halt("halting", "halted");
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after2");
        }, o, "method");

        var ret = o.method();

        Y.Assert.areEqual("halted", ret);
        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test prevent" : function() {
        var invoked = [],
            expected = ["before", "after"];

        var o = {
            method : function() {
                invoked.push("original");
                return "original";
            }
        };

        Y.Do.before(function() {
            invoked.push("before");
            return new Y.Do.Prevent("prevented");
        }, o, "method");

        Y.Do.after(function() {
            invoked.push("after");
            return new Y.Do.AlterReturn("altering return", "altered"); 
        }, o, "method");

        var ret = o.method();

        Y.Assert.areEqual("altered", ret);
        Y.ArrayAssert.itemsAreEqual(expected, invoked);
    },

    "test before/after with falsy context binds args": function () {
        //Y.Do.before(fn, obj, "method", null, "a", obj, null);
    },

    "test ET altered return": function() {
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
    }
}));

suite.add(new Y.Test.Case({
    name: "EventTarget on/before/after",

    _should : {
        ignore : {
            "test target.on(fn, host, noSuchMethod)": true,
            "test target.on([fnA, fnB, fnC], host, noSuchMethod)": true,
            "test target.before() is an alias for target.on()": true
        }
    },

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

/*
suite.add(new Y.Test.Case({
    name: "return Y.Do.Classes to affect fn flow"

    // Test each in before and after phases
    // AlterArgs
    // AlterReturn
    // Halt
    // Prevent
}));
*/

Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-custom-base', 'test']}); 
